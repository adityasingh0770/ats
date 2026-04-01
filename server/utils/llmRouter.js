/**
 * LLM calls use Google Gemini only (GEMINI_API_KEY). Request/response shape matches OpenAI chat completions for adapters.
 */

const { getGeminiKey } = require('./geminiEnv');
const { geminiChatCompletionOpenAiShaped } = require('./geminiChat');

/**
 * @returns {Promise<object>} OpenAI-shaped API JSON { choices: [{ message: { content } }] }
 */
async function llmChatCompletion(body, options = {}) {
  if (!getGeminiKey()) {
    const e = new Error('GEMINI_API_KEY is required for AI hints and remedial content.');
    e.code = 'NO_LLM_KEY';
    throw e;
  }
  return geminiChatCompletionOpenAiShaped(body, options);
}

function hasLlmProviderKey() {
  return Boolean(getGeminiKey());
}

module.exports = { llmChatCompletion, hasLlmProviderKey };
