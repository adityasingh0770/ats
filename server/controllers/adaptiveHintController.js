const { generateAdaptiveHints } = require('../services/adaptiveHintLLMService');
const { handleError } = require('../utils/dbError');
const { getOpenAiKey } = require('../utils/openaiEnv');
const { getGeminiKey } = require('../utils/geminiEnv');

const postAdaptiveHints = async (req, res) => {
  try {
    const { question, correct_answer, student_answer, concept_tags, common_wrong_answers } = req.body || {};

    if (question === undefined || question === null || String(question).trim() === '') {
      return res.status(400).json({ message: 'question is required.' });
    }
    if (correct_answer === undefined || correct_answer === null) {
      return res.status(400).json({ message: 'correct_answer is required.' });
    }
    if (student_answer === undefined || student_answer === null) {
      return res.status(400).json({ message: 'student_answer is required.' });
    }

    if (!getOpenAiKey() && !getGeminiKey()) {
      return res.status(503).json({
        message: 'Adaptive LLM hints need OPENAI_API_KEY and/or GEMINI_API_KEY on the server.',
      });
    }

    const payload = await generateAdaptiveHints({
      question: String(question),
      correct_answer,
      student_answer,
      concept_tags,
      common_wrong_answers,
    });

    return res.json(payload);
  } catch (err) {
    if (err.code === 'ADAPTIVE_HINTS_DISABLED' || err.code === 'NO_LLM_KEY') {
      return res.status(503).json({ message: err.message });
    }
    if (err.code === 'LLM_HTTP_ERROR' && err.status === 401) {
      return res.status(502).json({ message: 'LLM authentication failed. Check OPENAI_API_KEY.' });
    }
    if (err.code === 'LLM_HTTP_ERROR' && err.status === 429) {
      return res.status(429).json({ message: 'Hint service is busy. Try again in a moment.' });
    }
    if (err.code && String(err.code).startsWith('LLM_')) {
      console.error('Adaptive hints LLM error:', err.message);
      return res.status(502).json({ message: 'Could not generate hints right now. Try again.' });
    }
    handleError(err, res);
  }
};

module.exports = { postAdaptiveHints };
