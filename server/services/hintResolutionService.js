const { getHint } = require('./hintService');

/**
 * Rule-based hints (personalized from question bank + error detection).
 */
async function resolveHint(question, session, studentAnswer, errorInfo, hintLevel) {
  const level = Math.min(Math.max(parseInt(hintLevel, 10) || 1, 1), 3);
  const qid = question._id;
  const ansKey = studentAnswer;

  const fb = await getHint(qid, level, {
    studentAnswer: ansKey,
    errorInfo: errorInfo || null,
  });

  return {
    ...fb,
    source: 'rules',
  };
}

module.exports = { resolveHint };
