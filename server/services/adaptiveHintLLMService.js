/**
 * OpenAI-compatible Chat Completions → strict JSON ITS hint payload.
 * Env: OPENAI_API_KEY and/or GEMINI_API_KEY, LLM_PROVIDER (auto|openai|gemini), models — see llmRouter.
 */

const { llmChatCompletion } = require('../utils/llmRouter');

const SYSTEM_PROMPT = `You are an intelligent tutoring system for Grade 8 mensuration.

The student's submitted answer is WRONG for the given question (the human grader already marked it incorrect).

TASK:
1. Infer the most likely mistake from their specific answer value.
2. Produce THREE different hint strings: hint_level_1 (gentle), hint_level_2 (clearer), hint_level_3 (strong nudge). Each must be DISTINCT in content.
3. Each hint MUST explicitly refer to what they wrote (e.g. their number or choice)—paraphrase or quote it—then guide them to rethink. At least 2 sentences per hint.
4. NEVER state the correct final answer. NO step-by-step that ends in the answer. NO "the answer is …".

Also set:
- "is_correct": false
- "error_type": short machine-friendly label (e.g. wrong_formula, arithmetic_slip, unit_confusion)
- "detected_pattern": one sentence on likely thinking
- "confidence": "low"|"medium"|"high"
- "message": ""

OUTPUT: JSON only with keys: is_correct, error_type, detected_pattern, confidence, message, hint_level_1, hint_level_2, hint_level_3`;

function stripJsonFence(text) {
  const t = String(text || '').trim();
  const m = t.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
  return m ? m[1].trim() : t;
}

function coalesceHintFields(parsed) {
  const pick = (...vals) => {
    for (const v of vals) {
      if (v != null && String(v).trim()) return String(v).trim();
    }
    return '';
  };
  const h = parsed.hints;
  return {
    ...parsed,
    hint_level_1: pick(
      parsed.hint_level_1,
      parsed.hintLevel1,
      parsed.level_1,
      parsed.hint1,
      Array.isArray(h) ? h[0] : null
    ),
    hint_level_2: pick(
      parsed.hint_level_2,
      parsed.hintLevel2,
      parsed.level_2,
      parsed.hint2,
      Array.isArray(h) ? h[1] : null
    ),
    hint_level_3: pick(
      parsed.hint_level_3,
      parsed.hintLevel3,
      parsed.level_3,
      parsed.hint3,
      Array.isArray(h) ? h[2] : null
    ),
  };
}

function normalizePayload(parsed, correct_answer, student_answer, graderMarkedWrong) {
  const merged = coalesceHintFields(parsed);
  let isCorrect = Boolean(merged.is_correct);

  if (!graderMarkedWrong && correct_answer != null && student_answer != null) {
    const agreed = answersMatch(correct_answer, student_answer);
    if (agreed && !isCorrect) {
      isCorrect = true;
    }
  }

  if (graderMarkedWrong) {
    isCorrect = false;
  }

  const base = {
    is_correct: isCorrect,
    error_type: isCorrect ? '' : String(merged.error_type || 'unknown'),
    detected_pattern: isCorrect ? '' : String(merged.detected_pattern || ''),
    confidence: ['low', 'medium', 'high'].includes(merged.confidence) ? merged.confidence : 'medium',
    message: isCorrect ? String(merged.message || 'Well done!') : '',
    hint_level_1: isCorrect ? '' : String(merged.hint_level_1 || '').trim(),
    hint_level_2: isCorrect ? '' : String(merged.hint_level_2 || '').trim(),
    hint_level_3: isCorrect ? '' : String(merged.hint_level_3 || '').trim(),
  };
  return base;
}

function answersMatch(correct, student) {
  const c = String(correct).trim().toLowerCase();
  const s = String(student).trim().toLowerCase();
  if (c === s) return true;
  const nc = parseFloat(c.replace(/[^0-9.+-eE]/g, ''));
  const ns = parseFloat(s.replace(/[^0-9.+-eE]/g, ''));
  if (!Number.isNaN(nc) && !Number.isNaN(ns) && Math.abs(nc - ns) < 1e-9 * Math.max(1, Math.abs(nc))) return true;
  return false;
}

function levelsComplete(b) {
  return [b.hint_level_1, b.hint_level_2, b.hint_level_3].every((s) => String(s || '').trim().length > 0);
}

async function generateAdaptiveHints(
  { question, correct_answer, student_answer, concept_tags, common_wrong_answers },
  options = {}
) {
  const graderMarkedWrong = options.graderMarkedWrong === true;
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const payloadObj = {
    question,
    correct_answer: String(correct_answer),
    student_answer: String(student_answer),
    concept_tags: Array.isArray(concept_tags) ? concept_tags : [],
    common_wrong_answers:
      common_wrong_answers && typeof common_wrong_answers === 'object' && !Array.isArray(common_wrong_answers)
        ? common_wrong_answers
        : {},
    grader_already_marked_incorrect: graderMarkedWrong,
  };

  let lastBundle = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    const retryNote =
      attempt === 1
        ? '\n\nCRITICAL RETRY: hint_level_1, hint_level_2, and hint_level_3 were missing or too short. Each must be 2+ sentences and mention the student_answer explicitly. All three keys required.'
        : attempt === 2
          ? '\n\nFINAL RETRY: Output valid JSON only. Fill hint_level_1, hint_level_2, hint_level_3 with different strings (each 40+ characters). Reference the student_answer text. Never leave a hint empty.'
          : '';

    const data = await llmChatCompletion(
      {
        model,
        temperature: attempt === 0 ? 0.3 : attempt === 1 ? 0.45 : 0.55,
        max_tokens: 1400,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `INPUT (JSON):\n${JSON.stringify(payloadObj)}${retryNote}\n\nOutput only the JSON object.`,
          },
        ],
      },
      { timeoutMs: 65000, logTag: 'hints' }
    );

    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      const err = new Error('Empty completion from LLM');
      err.code = 'LLM_EMPTY';
      throw err;
    }

    let parsed;
    try {
      parsed = JSON.parse(stripJsonFence(text));
    } catch (e) {
      const err = new Error(`Could not parse LLM JSON: ${e.message}`);
      err.code = 'LLM_PARSE';
      throw err;
    }

    lastBundle = normalizePayload(parsed, correct_answer, student_answer, graderMarkedWrong);
    if (levelsComplete(lastBundle)) {
      return lastBundle;
    }
  }

  return lastBundle;
}

module.exports = { generateAdaptiveHints, answersMatch };
