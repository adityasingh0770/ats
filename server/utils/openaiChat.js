/**
 * OpenAI Chat Completions POST with timeout, optional node-fetch fallback, and json_mode retry.
 */

const { getOpenAiKey } = require('./openaiEnv');

function getFetchImpl() {
  if (typeof fetch === 'function') return fetch;
  try {
    return require('node-fetch');
  } catch {
    return null;
  }
}

/**
 * @param {object} body - OpenAI chat.completions body (model, messages, ...)
 * @param {{ timeoutMs?: number, logTag?: string }} options
 * @returns {Promise<object>} Parsed JSON response body (choices, error, etc.)
 */
async function openaiChatCompletion(body, options = {}) {
  const { timeoutMs = 60000, logTag = 'openai' } = options;
  const fetchImpl = getFetchImpl();
  if (!fetchImpl) {
    const e = new Error(
      'Global fetch is missing. Use Node 18+ on Render, or the server will load node-fetch if installed.'
    );
    e.code = 'FETCH_MISSING';
    throw e;
  }

  const key = getOpenAiKey();
  if (!key) {
    const e = new Error('OPENAI_API_KEY is not configured');
    e.code = 'NO_KEY';
    throw e;
  }

  const baseUrl = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  const url = `${baseUrl}/chat/completions`;

  const postOnce = async (reqBody) => {
    const ctrl = new AbortController();
    const id = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetchImpl(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify(reqBody),
        signal: ctrl.signal,
      });
      const raw = await res.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        data = { _nonJson: true, rawSnippet: raw.slice(0, 400) };
      }
      return { res, data };
    } catch (e) {
      if (e.name === 'AbortError') {
        const err = new Error(`OpenAI request timed out after ${timeoutMs}ms`);
        err.code = 'LLM_TIMEOUT';
        throw err;
      }
      const err = new Error(e.message || 'Network error calling OpenAI');
      err.code = 'LLM_NETWORK';
      err.cause = e;
      throw err;
    } finally {
      clearTimeout(id);
    }
  };

  let { res, data } = await postOnce(body);

  if (!res.ok && res.status === 400 && body.response_format) {
    const errStr = JSON.stringify(data?.error || data || {}).toLowerCase();
    if (
      errStr.includes('response_format') ||
      errStr.includes('json_object') ||
      errStr.includes('json mode')
    ) {
      console.warn(`[${logTag}] Retrying OpenAI without response_format (API returned 400)`);
      const { response_format, ...rest } = body;
      const second = await postOnce(rest);
      res = second.res;
      data = second.data;
    }
  }

  if (!res.ok) {
    const msg = data?.error?.message || `HTTP ${res.status}`;
    console.error(`[${logTag}] OpenAI error ${res.status}:`, JSON.stringify(data?.error || data).slice(0, 800));
    const err = new Error(msg);
    err.code = 'LLM_HTTP_ERROR';
    err.status = res.status;
    err.openaiPayload = data?.error;
    throw err;
  }

  return data;
}

module.exports = { openaiChatCompletion, getFetchImpl };
