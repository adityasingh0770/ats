/**
 * OpenAI-compatible Chat Completions → strict JSON ITS hint payload.
 * Env: OPENAI_API_KEY (required), OPENAI_MODEL (default gpt-4o-mini), OPENAI_BASE_URL (optional).
 */

const SYSTEM_PROMPT = `You are an intelligent tutoring system that analyzes a student's final answer and generates adaptive hints to guide learning.

OBJECTIVE:
Evaluate the student's answer, infer the most likely mistake pattern, and generate helpful hints WITHOUT revealing the correct answer.

INSTRUCTIONS:

1. CHECK CORRECTNESS:
- Compare the student answer with the correct answer (allow equivalent forms: same numeric value, equivalent fractions, correct units if applicable).
- If correct:
  - Set "is_correct" to true
  - Return a short encouraging message in "message"
  - Set "error_type", "detected_pattern", "hint_level_1", "hint_level_2", "hint_level_3" to empty strings
  - Set "confidence" to "high"

2. IF INCORRECT:
- Set "is_correct" to false
- Set "message" to empty string

3. IDENTIFY LIKELY MISTAKE:
- Reverse-engineer how the student might have arrived at their answer.
- Categories (non-exhaustive): wrong operation; arithmetic error; order of operations (BODMAS/PEMDAS); sign error; wrong formula or concept; partial/incomplete solving; unit/place value error.

4. COMMON WRONG ANSWERS:
- If the input includes "common_wrong_answers" as a map and the student answer matches a key (or normalized form), prioritize that interpretation for error_type and detected_pattern.

5. CONFIDENCE:
- high → clear mapping (e.g. obvious wrong operation)
- medium → plausible but not certain
- low → multiple possible interpretations

6. GENERATE ADAPTIVE HINTS (when incorrect):
- DO NOT reveal the correct answer or any digit/token that completes it
- DO NOT give a step-by-step solution
- DO NOT explicitly name the exact arithmetic slip (e.g. avoid "you added instead of multiplied"); guide them to rethink
- hint_level_1 → very subtle guidance
- hint_level_2 → more specific direction
- hint_level_3 → strong guidance but still not the answer
- If confidence is low, keep hints more general

7. STYLE:
- Short, clear, student-friendly, encouraging tone

OUTPUT: Return a single JSON object ONLY with exactly these keys:
"is_correct" (boolean),
"error_type" (string, empty if correct),
"detected_pattern" (string, empty if correct),
"confidence" ("low"|"medium"|"high"),
"message" (string, only if correct; else empty),
"hint_level_1" (string),
"hint_level_2" (string),
"hint_level_3" (string)`;

function stripJsonFence(text) {
  const t = String(text || '').trim();
  const m = t.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
  return m ? m[1].trim() : t;
}

function normalizePayload(parsed, isCorrectFromCompare) {
  const isCorrect = Boolean(parsed.is_correct);
  const base = {
    is_correct: isCorrect,
    error_type: isCorrect ? '' : String(parsed.error_type || 'unknown'),
    detected_pattern: isCorrect ? '' : String(parsed.detected_pattern || ''),
    confidence: ['low', 'medium', 'high'].includes(parsed.confidence) ? parsed.confidence : 'medium',
    message: isCorrect ? String(parsed.message || 'Well done!') : '',
    hint_level_1: isCorrect ? '' : String(parsed.hint_level_1 || ''),
    hint_level_2: isCorrect ? '' : String(parsed.hint_level_2 || ''),
    hint_level_3: isCorrect ? '' : String(parsed.hint_level_3 || ''),
  };
  if (isCorrectFromCompare && !isCorrect) {
    base.is_correct = true;
    base.error_type = '';
    base.detected_pattern = '';
    base.confidence = 'high';
    base.message = String(parsed.message || 'Well done!');
    base.hint_level_1 = '';
    base.hint_level_2 = '';
    base.hint_level_3 = '';
  }
  return base;
}

/** Loose numeric / string equality for sanity check */
function answersMatch(correct, student) {
  const c = String(correct).trim().toLowerCase();
  const s = String(student).trim().toLowerCase();
  if (c === s) return true;
  const nc = parseFloat(c.replace(/[^0-9.+-eE]/g, ''));
  const ns = parseFloat(s.replace(/[^0-9.+-eE]/g, ''));
  if (!Number.isNaN(nc) && !Number.isNaN(ns) && Math.abs(nc - ns) < 1e-9 * Math.max(1, Math.abs(nc))) return true;
  return false;
}

async function generateAdaptiveHints({
  question,
  correct_answer,
  student_answer,
  concept_tags,
  common_wrong_answers,
}) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    const err = new Error('OPENAI_API_KEY is not configured');
    err.code = 'ADAPTIVE_HINTS_DISABLED';
    throw err;
  }

  const baseUrl = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const userContent = JSON.stringify(
    {
      question,
      correct_answer: String(correct_answer),
      student_answer: String(student_answer),
      concept_tags: Array.isArray(concept_tags) ? concept_tags : [],
      common_wrong_answers:
        common_wrong_answers && typeof common_wrong_answers === 'object' && !Array.isArray(common_wrong_answers)
          ? common_wrong_answers
          : {},
    },
    null,
    0
  );

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.25,
      max_tokens: 900,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `INPUT (JSON):\n${userContent}\n\nOutput only the required JSON object, no other text.`,
        },
      ],
    }),
  });

  const raw = await res.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    const err = new Error(`LLM provider returned non-JSON: ${raw.slice(0, 200)}`);
    err.code = 'LLM_BAD_RESPONSE';
    throw err;
  }

  if (!res.ok) {
    const err = new Error(data?.error?.message || `LLM request failed (${res.status})`);
    err.code = 'LLM_HTTP_ERROR';
    err.status = res.status;
    throw err;
  }

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

  const agreedCorrect = answersMatch(correct_answer, student_answer);
  return normalizePayload(parsed, agreedCorrect);
}

module.exports = { generateAdaptiveHints };
