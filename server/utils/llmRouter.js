/**
 * Routes chat completions: OpenAI, Gemini, or auto (OpenAI then Gemini on 429/503).
 * LLM_PROVIDER=openai | gemini | auto (default auto)
 */

const { getOpenAiKey } = require('./openaiEnv');
const { getGeminiKey } = require('./geminiEnv');
const { openaiChatCompletion } = require('./openaiChat');
const { geminiChatCompletionOpenAiShaped } = require('./geminiChat');

/**
 * Same contract as openaiChatCompletion — returns OpenAI API JSON shape.
 */
async function llmChatCompletion(body, options = {}) {
  const provider = (process.env.LLM_PROVIDER || 'auto').toLowerCase();
  const hasOpenAI = Boolean(getOpenAiKey());
  const hasGemini = Boolean(getGeminiKey());

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

  if (!hasOpenAI && hasGemini) {
    return geminiChatCompletionOpenAiShaped(body, options);
  }

  if (provider === 'openai') {
    return openaiChatCompletion(body, options);
  }

  // auto: prefer OpenAI when key exists
  try {
    return await openaiChatCompletion(body, options);
  } catch (e) {
    if (e.code === 'LLM_HTTP_ERROR' && (e.status === 429 || e.status === 503) && hasGemini) {
      console.warn(
        `[${options.logTag || 'llm'}] OpenAI ${e.status} (${e.message?.slice(0, 120)}), falling back to Gemini`
      );
      return geminiChatCompletionOpenAiShaped(body, options);
    }
    throw e;
  }
}

function hasLlmProviderKey() {
  return Boolean(getOpenAiKey() || getGeminiKey());
}

module.exports = { llmChatCompletion, hasLlmProviderKey };
