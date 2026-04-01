const { getHint } = require('./hintService');
const { getGeminiHint } = require('./geminiService');

/**
 * Resolve a hint for a wrong answer.
 * Tries Gemini AI first (personalized, Socratic).
 * Falls back to rule-based hints if Gemini is unavailable or fails.
 */
async function resolveHint(question, _session, studentAnswer, errorInfo, hintLevel) {
  const level = Math.min(Math.max(parseInt(hintLevel, 10) || 1, 1), 3);

  // ── Gemini AI hint (personalized) ──────────────────────────────────────────
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    try {
      const aiContent = await getGeminiHint(question, studentAnswer, errorInfo, level);
      if (aiContent) {
        return {
          level,
          content: aiContent,
          formula: question.formula,
          source: 'gemini',
        };
      }
    } catch (err) {
      console.warn('[Hint] Gemini failed, falling back to rule-based hints:', err.message);
    }
  }

  // ── Rule-based fallback ────────────────────────────────────────────────────
  const fb = await getHint(question._id, level, {
    studentAnswer,
    errorInfo: errorInfo || null,
  });

  return { ...fb, source: 'rules' };
}

module.exports = { resolveHint };
