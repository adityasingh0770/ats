const { getHint } = require('./hintService');
const { generateAdaptiveHints } = require('./adaptiveHintLLMService');
const { getOpenAiKey } = require('../utils/openaiEnv');

function cacheValid(cache, questionId, answerKey) {
  return (
    cache &&
    cache.questionId === questionId &&
    String(cache.answerKey ?? '') === String(answerKey ?? '')
  );
}

/**
 * Prefer OpenAI adaptive hints (one bundle per wrong answer, three levels cached).
 * Falls back to rule-based getHint if no key, LLM error, empty level, or LLM claims correct while grader says wrong.
 */
async function resolveHint(question, session, studentAnswer, errorInfo, hintLevel) {
  const level = Math.min(Math.max(parseInt(hintLevel, 10) || 1, 1), 3);
  const qid = question._id;
  const ansKey = studentAnswer;

  const fallback = () =>
    getHint(qid, level, {
      studentAnswer: ansKey,
      errorInfo: errorInfo || null,
    });

  if (!getOpenAiKey()) {
    return { ...(await fallback()), source: 'rules' };
  }

  if (ansKey === undefined || ansKey === null || String(ansKey).trim() === '') {
    return { ...(await fallback()), source: 'rules' };
  }

  try {
    if (!cacheValid(session.adaptiveHintsCache, qid, ansKey)) {
      const bundle = await generateAdaptiveHints(
        {
          question: question.question,
          correct_answer: question.answer,
          student_answer: ansKey,
          concept_tags: [question.topic, question.shape].filter(Boolean),
          common_wrong_answers: {},
        },
        { graderMarkedWrong: true }
      );

      if (bundle.is_correct) {
        session.adaptiveHintsCache = null;
      } else {
        session.adaptiveHintsCache = {
          questionId: qid,
          answerKey: String(ansKey),
          levels: [
            String(bundle.hint_level_1 || '').trim(),
            String(bundle.hint_level_2 || '').trim(),
            String(bundle.hint_level_3 || '').trim(),
          ],
          meta: {
            error_type: bundle.error_type || '',
            detected_pattern: bundle.detected_pattern || '',
            confidence: bundle.confidence || 'medium',
          },
        };
      }
    }

    const c = session.adaptiveHintsCache;
    if (c && Array.isArray(c.levels)) {
      const txt = c.levels[level - 1];
      if (txt) {
        return {
          level,
          content: txt,
          formula: question.formula,
          adaptive: c.meta || null,
          source: 'llm',
        };
      }
    }
  } catch (e) {
    console.warn('[hints] LLM path failed, using rule-based:', e.message);
    session.adaptiveHintsCache = null;
  }

  const fb = await fallback();
  return { ...fb, source: 'rules' };
}

module.exports = { resolveHint };
