/**
 * LLM calls use Google Gemini only (GEMINI_API_KEY). Request/response shape matches OpenAI chat completions for adapters.
 */

const { getGeminiKey, isGeminiLlmDisabled, isGeminiLlmEnabled } = require('./geminiEnv');
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
  if (isGeminiLlmDisabled()) {
    const e = new Error('Gemini LLM is turned off (GEMINI_LLM_DISABLED).');
    e.code = 'LLM_DISABLED';
    throw e;
  }
  return geminiChatCompletionOpenAiShaped(body, options);
}

function hasLlmProviderKey() {
  return isGeminiLlmEnabled();
}

module.exports = { llmChatCompletion, hasLlmProviderKey };
