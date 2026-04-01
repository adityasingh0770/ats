/**
 * Detailed remedial micro-lesson from OpenAI (JSON). Never echoes the item’s final answer.
 */

const { getOpenAiKey } = require('../utils/openaiEnv');

const SYSTEM_PROMPT = `You are an expert Grade 8 mathematics tutor for mensuration (perimeter, area, surface area, volume, circles, solids).

INPUT gives you: the question text, the student’s wrong answer, the correct answer (for your reasoning only), topic/shape, optional formula, optional detector labels, and optional prior hint lines shown to the student.

CRITICAL RULES:
- Never state the correct numeric (or letter MCQ) answer to the original question.
- Never write a worked solution that ends with the correct value for that specific question.
- You may teach the method and formulas in general terms.
- Build on any "adaptive_meta" or "prior_hints" so your remedial feels continuous with what they already saw.
- Be detailed: students are in remedial because they are stuck.
- Opening and misconception_focus MUST tie to their specific wrong answer (student_answer)—name or paraphrase it.

OUTPUT: Return ONLY a JSON object with exactly these keys:
"opening": string (warm, 2–4 sentences),
"misconception_focus": string (one rich paragraph on the likely conceptual slip),
"key_ideas": array of 5–8 short strings (bullet-worthy lines),
"formula_reminder": string (the right formula family for this topic—avoid plugging their numbers if it would reveal the answer),
"guided_rethink": string (use several paragraphs separated by \\n\\n—walk through how to think about this class of problem; still no final answer to their item),
"self_check_questions": array of 2–4 strings (reflection questions; no answers included)`;

function stripJsonFence(text) {
  const t = String(text || '').trim();
  const m = t.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
  return m ? m[1].trim() : t;
}

function normalize(parsed) {
  const keyIdeas = Array.isArray(parsed.key_ideas)
    ? parsed.key_ideas.map((s) => String(s || '').trim()).filter(Boolean)
    : [];
  const selfCheck = Array.isArray(parsed.self_check_questions)
    ? parsed.self_check_questions.map((s) => String(s || '').trim()).filter(Boolean)
    : [];
  return {
    opening: String(parsed.opening || '').trim(),
    misconception_focus: String(parsed.misconception_focus || '').trim(),
    key_ideas: keyIdeas.length ? keyIdeas : ['Compare what the question asks (around vs inside vs space filled) with the formula you used.'],
    formula_reminder: String(parsed.formula_reminder || '').trim(),
    guided_rethink: String(parsed.guided_rethink || '').trim(),
    self_check_questions: selfCheck.length ? selfCheck : ['What quantity does the question word “perimeter” vs “area” refer to?'],
  };
}

/**
 * @param {object} input
 * @param {string} input.questionText
 * @param {string|number} input.studentAnswer
 * @param {string|number} input.correctAnswer
 * @param {string} input.topic
 * @param {string} input.shape
 * @param {string} [input.formula]
 * @param {string|null} [input.errorTypeRuleBased]
 * @param {object|null} [input.adaptiveMeta] - { error_type, detected_pattern, confidence }
 * @param {string[]|null} [input.priorHints] - three hint lines if any
 */
async function generateAdaptiveRemedial(input) {
  const key = getOpenAiKey();
  if (!key) {
    const err = new Error('OPENAI_API_KEY is not configured');
    err.code = 'REMEDIAL_LLM_DISABLED';
    throw err;
  }

  const baseUrl = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const payload = {
    question: input.questionText,
    student_answer: String(input.studentAnswer ?? ''),
    correct_answer: String(input.correctAnswer ?? ''),
    topic: input.topic,
    shape: input.shape,
    formula_from_bank: input.formula || null,
    rule_based_error_type: input.errorTypeRuleBased || null,
    adaptive_meta: input.adaptiveMeta || null,
    prior_hints_shown: Array.isArray(input.priorHints) ? input.priorHints.filter(Boolean) : [],
  };

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      max_tokens: 2200,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Generate the remedial JSON for this case:\n${JSON.stringify(payload, null, 0)}`,
        },
      ],
    }),
  });

  const raw = await res.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    const err = new Error(`Remedial LLM non-JSON: ${raw.slice(0, 160)}`);
    err.code = 'REMEDIAL_LLM_BAD';
    throw err;
  }

  if (!res.ok) {
    const err = new Error(data?.error?.message || `Remedial LLM HTTP ${res.status}`);
    err.code = 'REMEDIAL_LLM_HTTP';
    err.status = res.status;
    throw err;
  }

  const text = data?.choices?.[0]?.message?.content;
  if (!text) {
    const err = new Error('Empty remedial completion');
    err.code = 'REMEDIAL_LLM_EMPTY';
    throw err;
  }

  let parsed;
  try {
    parsed = JSON.parse(stripJsonFence(text));
  } catch (e) {
    const err = new Error(`Remedial JSON parse: ${e.message}`);
    err.code = 'REMEDIAL_LLM_PARSE';
    throw err;
  }

  return normalize(parsed);
}

module.exports = { generateAdaptiveRemedial };
