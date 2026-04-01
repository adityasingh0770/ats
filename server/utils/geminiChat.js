/**
 * Gemini generateContent — returns OpenAI-shaped { choices: [{ message: { content } }] } for drop-in use.
 */

const { getGeminiKey } = require('./geminiEnv');
const { getFetchImpl } = require('./httpFetch');

function openaiMessagesToGemini(messages) {
  if (!Array.isArray(messages)) return { systemText: '', userText: '' };
  const systemChunks = [];
  const userChunks = [];
  for (const m of messages) {
    const text = String(m.content || '');
    if (m.role === 'system') systemChunks.push(text);
    else if (m.role === 'user') userChunks.push(text);
    else if (m.role === 'assistant') userChunks.push(`(assistant): ${text}`);
    else userChunks.push(text);
  }
  return {
    systemText: systemChunks.join('\n\n'),
    userText: userChunks.join('\n\n'),
  };
}

/**
 * @param {object} body - OpenAI-style chat body
 * @param {{ timeoutMs?: number, logTag?: string }} options
 * @returns {Promise<{ choices: Array<{ message: { content: string } }> }>}
 */
async function geminiChatCompletionOpenAiShaped(body, options = {}) {
  const { timeoutMs = 90000, logTag = 'gemini' } = options;
  const key = getGeminiKey();
  if (!key) {
    const e = new Error('GEMINI_API_KEY is not configured');
    e.code = 'NO_GEMINI_KEY';
    throw e;
  }

  const fetchImpl = getFetchImpl();
  if (!fetchImpl) {
    const e = new Error('fetch unavailable');
    e.code = 'FETCH_MISSING';
    throw e;
  }

  const model = (process.env.GEMINI_MODEL || 'gemini-2.0-flash').replace(/^models\//, '');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;

  const { systemText, userText } = openaiMessagesToGemini(body.messages);
  const wantJson = Boolean(body.response_format?.type === 'json_object');

  const geminiBody = {
    ...(systemText ? { systemInstruction: { parts: [{ text: systemText }] } } : {}),
    contents: [{ role: 'user', parts: [{ text: userText || 'Respond with JSON only.' }] }],
    generationConfig: {
      temperature: typeof body.temperature === 'number' ? body.temperature : 0.35,
      maxOutputTokens: body.max_tokens || 2048,
      ...(wantJson ? { responseMimeType: 'application/json' } : {}),
    },
  };

  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  let res;
  let raw;
  try {
    res = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
      signal: ctrl.signal,
    });
    raw = await res.text();
  } catch (e) {
    if (e.name === 'AbortError') {
      const err = new Error(`Gemini timed out after ${timeoutMs}ms`);
      err.code = 'LLM_TIMEOUT';
      throw err;
    }
    const err = new Error(e.message || 'Network error calling Gemini');
    err.code = 'LLM_NETWORK';
    throw err;
  } finally {
    clearTimeout(id);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    console.error(`[${logTag}] Gemini non-JSON:`, raw.slice(0, 400));
    const err = new Error('Gemini returned non-JSON');
    err.code = 'GEMINI_BAD_RESPONSE';
    throw err;
  }

  if (!res.ok) {
    const msg = data?.error?.message || `Gemini HTTP ${res.status}`;
    console.error(`[${logTag}] Gemini error ${res.status}:`, JSON.stringify(data?.error || data).slice(0, 800));
    const err = new Error(msg);
    err.code = 'LLM_HTTP_ERROR';
    err.status = res.status;
    throw err;
  }

  const block = data?.promptFeedback?.blockReason;
  if (block) {
    const err = new Error(`Gemini blocked: ${block}`);
    err.code = 'GEMINI_BLOCKED';
    throw err;
  }

  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
  if (!text.trim()) {
    console.error(`[${logTag}] Gemini empty candidates:`, JSON.stringify(data).slice(0, 600));
    const err = new Error('Empty Gemini completion');
    err.code = 'GEMINI_EMPTY';
    throw err;
  }

  return { choices: [{ message: { content: text.trim() } }] };
}

module.exports = { geminiChatCompletionOpenAiShaped, openaiMessagesToGemini };
