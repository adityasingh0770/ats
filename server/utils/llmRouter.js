/**
 * Routes chat completions between OpenAI and Gemini.
 *
 * LLM_PROVIDER=openai | gemini | auto (default auto)
 * LLM_PRIMARY=gemini | openai — when auto + BOTH keys: which to try first (default gemini, fewer OpenAI 429s).
 * When only one key exists, that provider is used regardless of LLM_PRIMARY.
 */

const { getOpenAiKey } = require('./openaiEnv');
const { getGeminiKey } = require('./geminiEnv');
const { openaiChatCompletion } = require('./openaiChat');
const { geminiChatCompletionOpenAiShaped } = require('./geminiChat');

const RETRYABLE = new Set([429, 502, 503]);

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function tryWithFallback(primaryOpenAI, body, options, tag) {
  if (primaryOpenAI) {
    try {
      return await openaiChatCompletion(body, options);
    } catch (e) {
      if (e.code === 'LLM_HTTP_ERROR' && RETRYABLE.has(e.status) && getGeminiKey()) {
        console.warn(`[${tag}] OpenAI ${e.status}, falling back to Gemini`);
        return geminiChatCompletionOpenAiShaped(body, options);
      }
      throw e;
    }
  }

  try {
    return await geminiChatCompletionOpenAiShaped(body, options);
  } catch (e) {
    if (e.code === 'LLM_HTTP_ERROR' && RETRYABLE.has(e.status) && getOpenAiKey()) {
      console.warn(`[${tag}] Gemini ${e.status}, falling back to OpenAI`);
      return openaiChatCompletion(body, options);
    }
    throw e;
  }
}

/**
 * Same contract as openaiChatCompletion — returns OpenAI API JSON shape.
 */
async function llmChatCompletion(body, options = {}) {
  const provider = (process.env.LLM_PROVIDER || 'auto').toLowerCase();
  const hasOpenAI = Boolean(getOpenAiKey());
  const hasGemini = Boolean(getGeminiKey());
  const tag = options.logTag || 'llm';

  if (!hasOpenAI && !hasGemini) {
    const e = new Error('No LLM API key configured (OPENAI_API_KEY or GEMINI_API_KEY)');
    e.code = 'NO_LLM_KEY';
    throw e;
  }

  if (provider === 'gemini') {
    if (!hasGemini) {
      const e = new Error('LLM_PROVIDER=gemini requires GEMINI_API_KEY');
      e.code = 'NO_GEMINI_KEY';
      throw e;
    }
    return geminiChatCompletionOpenAiShaped(body, options);
  }

  if (provider === 'openai') {
    if (!hasOpenAI) {
      const e = new Error('LLM_PROVIDER=openai requires OPENAI_API_KEY');
      e.code = 'NO_OPENAI_KEY';
      throw e;
    }
    return openaiChatCompletion(body, options);
  }

  // --- auto ---
  if (!hasOpenAI && hasGemini) {
    return geminiChatCompletionOpenAiShaped(body, options);
  }

  if (hasOpenAI && !hasGemini) {
    try {
      return await openaiChatCompletion(body, options);
    } catch (e) {
      if (e.code === 'LLM_HTTP_ERROR' && e.status === 429) {
        console.warn(`[${tag}] OpenAI 429, single retry after 5s (no Gemini key)`);
        await sleep(5000);
        return openaiChatCompletion(body, options);
      }
      throw e;
    }
  }

  // both keys: default try Gemini first unless LLM_PRIMARY=openai
  const primaryOpenAI = (process.env.LLM_PRIMARY || 'gemini').toLowerCase() === 'openai';
  return tryWithFallback(primaryOpenAI, body, options, tag);
}

function hasLlmProviderKey() {
  return Boolean(getOpenAiKey() || getGeminiKey());
}

module.exports = { llmChatCompletion, hasLlmProviderKey };
