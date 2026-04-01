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

  const asRules = async (reason) => {
    const fb = await fallback();
    console.warn('[hints] using built-in rules:', reason, { level, qid: question.qid });
    return { ...fb, source: 'rules', llmSkippedReason: reason };
  };

  if (!getOpenAiKey()) {
    return asRules('no_openai_key');
  }

  if (ansKey === undefined || ansKey === null || String(ansKey).trim() === '') {
    return asRules('empty_student_answer');
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
        console.warn('[hints] LLM bundle marked correct (unexpected with grader); clearing cache');
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
        const L = session.adaptiveHintsCache.levels;
        if (!L[0] || !L[1] || !L[2]) {
          console.warn('[hints] LLM returned incomplete levels after retries:', L.map((x) => (x ? `${x.length}ch` : 'EMPTY')));
        }
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
      return asRules('openai_empty_level');
    }
  } catch (e) {
    console.warn('[hints] LLM path failed:', e.code || e.name, e.message);
    session.adaptiveHintsCache = null;
    return asRules(e.code === 'LLM_HTTP_ERROR' && e.status === 401 ? 'openai_auth' : 'openai_error');
  }

  return asRules('openai_no_cache');
}

module.exports = { resolveHint };
