/**
 * Gemini generateContent — returns OpenAI-shaped { choices: [{ message: { content } }] } for drop-in use.
 */

const { getGeminiKey } = require('./geminiEnv');
const { getFetchImpl } = require('./httpFetch');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Prefer server-provided retry delay (google.rpc.RetryInfo); else exponential backoff.
 * @param {object|null} data - parsed error JSON body
 * @param {number} attemptIndex - 0-based retry after first 429
 */
function gemini429BackoffMs(data, attemptIndex) {
  const details = data?.error?.details;
  if (Array.isArray(details)) {
    for (const d of details) {
      if (d?.['@type'] === 'type.googleapis.com/google.rpc.RetryInfo' && d.retryDelay) {
        const rd = d.retryDelay;
        let sec = 0;
        if (typeof rd === 'string') {
          const m = rd.match(/^(\d+)s$/);
          sec = m ? parseInt(m[1], 10) : 0;
        } else if (typeof rd === 'object') {
          sec = Number(rd.seconds || 0) + Number(rd.nanos || 0) / 1e9;
        }
        if (sec > 0) return Math.min(120000, Math.ceil(sec * 1000) + 500);
      }
    }
  }
  return Math.min(45000, 3000 * 2 ** attemptIndex);
}

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
 * @param {{ timeoutMs?: number, logTag?: string, max429Retries?: number }} options
 * @returns {Promise<{ choices: Array<{ message: { content: string } }> }>}
 */
async function geminiChatCompletionOpenAiShaped(body, options = {}) {
  const { timeoutMs = 90000, logTag = 'gemini', max429Retries = 2 } = options;
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

  const maxAttempts = Math.max(1, max429Retries + 1);
  let res;
  let raw;
  let data;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const ctrl = new AbortController();
    const id = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      res = await fetchImpl(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody),
        signal: ctrl.signal,
      });
      raw = await res.text();
    } catch (e) {
      clearTimeout(id);
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

    try {
      data = JSON.parse(raw);
    } catch {
      if (res.status === 429 && attempt < max429Retries) {
        const delay = gemini429BackoffMs(null, attempt);
        console.warn(`[${logTag}] Gemini 429 non-JSON body, backoff ${delay}ms`);
        await sleep(delay);
        continue;
      }
      console.error(`[${logTag}] Gemini non-JSON:`, raw.slice(0, 400));
      const err = new Error('Gemini returned non-JSON');
      err.code = 'GEMINI_BAD_RESPONSE';
      throw err;
    }

    if (!res.ok) {
      if (res.status === 429 && attempt < max429Retries) {
        const delay = gemini429BackoffMs(data, attempt);
        console.warn(
          `[${logTag}] Gemini rate limit (429), waiting ${delay}ms before retry ${attempt + 2}/${maxAttempts}`
        );
        await sleep(delay);
        continue;
      }
      const msg = data?.error?.message || `Gemini HTTP ${res.status}`;
      console.error(`[${logTag}] Gemini error ${res.status}:`, JSON.stringify(data?.error || data).slice(0, 800));
      const err = new Error(msg);
      err.code = 'LLM_HTTP_ERROR';
      err.status = res.status;
      throw err;
    }

    break;
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
