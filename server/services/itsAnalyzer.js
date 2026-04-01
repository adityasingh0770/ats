/**
 * ITS Analyzer — Intelligent Tutoring System Core Engine
 *
 * Analyzes a student's answer, infers the most likely mistake pattern,
 * and generates 3 adaptive hint levels WITHOUT revealing the correct answer.
 * No external API or LLM used — purely rule-based.
 *
 * Output format:
 * {
 *   is_correct        : boolean,
 *   error_type        : string,   // human-readable mistake category
 *   detected_pattern  : string,   // how the student likely arrived at their answer
 *   confidence        : 'low' | 'medium' | 'high',
 *   message           : string,   // encouragement if correct, else ''
 *   hint_level_1      : string,   // subtle nudge
 *   hint_level_2      : string,   // more specific direction
 *   hint_level_3      : string,   // near-direct (no answer given)
 * }
 */

const { checkAnswer, detectError } = require('./errorDetectionService');
const { buildPersonalizedHint } = require('./personalizedHintService');

// ── Encouragement pool (shown when answer is correct) ────────────────────────
const CORRECT_MESSAGES = [
  "Great job! That's exactly right.",
  "Correct! You've got a solid understanding of this concept.",
  "Well done! Your approach was spot on.",
  "Perfect! Keep up the great work.",
  "Excellent! You applied the formula correctly.",
];

// ── Map internal error types → human-readable mistake category ───────────────
const ERROR_TYPE_LABEL = {
  multiply_instead_of_add:           'Wrong operation (multiplication instead of addition)',
  add_instead_of_multiply:           'Wrong operation (addition instead of multiplication)',
  area_instead_of_perimeter_rect:    'Wrong formula (area formula used for perimeter)',
  rect_multiply_instead_of_perimeter:'Wrong formula (multiplied dimensions instead of finding perimeter)',
  perimeter_instead_of_area_rect:    'Wrong formula (perimeter formula used for area)',
  rect_perimeter_instead_of_area:    'Wrong formula (perimeter-style calculation used for area)',
  rect_sum_only_perimeter:           'Partial/incomplete solving (l + b not doubled)',
  square_area_instead_of_perimeter:  'Wrong formula (area formula used for perimeter)',
  square_perimeter_instead_of_area:  'Wrong formula (perimeter formula used for area)',
  radius_diameter_confusion:         'Unit/measurement error (radius and diameter confused)',
  formula_swap:                      'Wrong formula or concept (formulas swapped)',
  sa_volume_confusion:               'Wrong formula (surface area and volume swapped)',
  unit_error:                        'Unit/place value error',
  arithmetic_mistake:                'Arithmetic/calculation error',
  partial_formula:                   'Partial/incomplete solving (formula applied incompletely)',
  wrong_option:                      'Wrong formula or concept (MCQ selection)',
  wrong_verdict:                     'Wrong formula or concept (True/False reversal)',
  invalid_input:                     'Invalid input format',
  wrong_answer:                      'Answer mismatch — specific pattern unclear',
  unknown:                           'Answer mismatch — specific pattern unclear',
};

// ── Confidence levels per error type ─────────────────────────────────────────
const CONFIDENCE_LEVEL = {
  multiply_instead_of_add:           'high',
  add_instead_of_multiply:           'high',
  area_instead_of_perimeter_rect:    'high',
  rect_multiply_instead_of_perimeter:'high',
  perimeter_instead_of_area_rect:    'high',
  rect_perimeter_instead_of_area:    'high',
  rect_sum_only_perimeter:           'high',
  square_area_instead_of_perimeter:  'high',
  square_perimeter_instead_of_area:  'high',
  radius_diameter_confusion:         'high',
  formula_swap:                      'high',
  sa_volume_confusion:               'high',
  unit_error:                        'medium',
  arithmetic_mistake:                'medium',
  partial_formula:                   'medium',
  wrong_option:                      'medium',
  wrong_verdict:                     'medium',
  invalid_input:                     'high',
  wrong_answer:                      'low',
  unknown:                           'low',
};

// ── Detected-pattern descriptions (how the student likely got their answer) ──
const DETECTED_PATTERN = {
  multiply_instead_of_add:
    'Student multiplied two values that should be added first — common when mixing up area and perimeter operations.',
  add_instead_of_multiply:
    'Student added values that should be multiplied, possibly misreading the formula.',
  area_instead_of_perimeter_rect:
    'Student applied the area formula (l × b) when perimeter (2(l + b)) was required.',
  rect_multiply_instead_of_perimeter:
    'Student multiplied length × breadth (giving area) when perimeter was asked.',
  perimeter_instead_of_area_rect:
    'Student applied the perimeter formula (2(l + b)) when area (l × b) was required.',
  rect_perimeter_instead_of_area:
    'Student used a perimeter-style calculation (adding/doubling) instead of multiplying for area.',
  rect_sum_only_perimeter:
    'Student added l + b once but forgot to multiply by 2, giving half the actual perimeter.',
  square_area_instead_of_perimeter:
    'Student squared the side (s²) as for area when perimeter (4 × s) was needed.',
  square_perimeter_instead_of_area:
    'Student used 4 × s (perimeter) when area (s²) was required.',
  radius_diameter_confusion:
    'Student likely used the diameter where radius was needed (or vice versa), doubling or halving the correct value.',
  formula_swap:
    'Student used a formula for a different measurement type (e.g., perimeter formula in an area question).',
  sa_volume_confusion:
    'Student confused the surface area formula with the volume formula, or the other way around.',
  unit_error:
    'Student may have mixed units (cm vs m, or cm² vs m²) without converting — scaling error visible in the result.',
  arithmetic_mistake:
    'Student used the right approach but made a calculation error in an arithmetic step.',
  partial_formula:
    'Student applied only part of the formula — likely stopped one step early or omitted a factor.',
  wrong_option:
    'Student selected an MCQ option that does not match what the formula produces for the given values.',
  wrong_verdict:
    'Student gave the opposite True/False verdict from what the calculation actually shows.',
  invalid_input:
    'Student entered a non-numeric value or text that could not be interpreted as a number.',
  wrong_answer:
    'Student answer does not match the correct result; specific mistake pattern could not be determined.',
  unknown:
    'Student answer does not match the correct result; specific mistake pattern could not be determined.',
};

// ── Main analyzer ─────────────────────────────────────────────────────────────

/**
 * Analyze a student's answer and produce the full ITS result.
 *
 * @param {object}      question           - Full question object from the question bank
 * @param {string|number} studentAnswer    - What the student submitted
 * @param {object|null} precomputedError   - errorInfo from detectError(), if already run
 * @returns {object}  ITS analysis (see format above)
 */
function analyzeAnswer(question, studentAnswer, precomputedError = null) {
  // ── 1. Check correctness ──────────────────────────────────────────────────
  const isCorrect = checkAnswer(studentAnswer, question.answer, question);

  if (isCorrect) {
    return {
      is_correct:       true,
      error_type:       '',
      detected_pattern: '',
      confidence:       'high',
      message:          CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)],
      hint_level_1:     '',
      hint_level_2:     '',
      hint_level_3:     '',
    };
  }

  // ── 2. Identify mistake ───────────────────────────────────────────────────
  const errorInfo = precomputedError || detectError(studentAnswer, question.answer, question);
  const errorType = errorInfo?.type || 'wrong_answer';

  // ── 3. Check against common wrong answers (if provided in question bank) ──
  // question.commonWrongAnswers: { [answer]: errorType } — optional field
  let resolvedType = errorType;
  if (question.commonWrongAnswers && typeof question.commonWrongAnswers === 'object') {
    const key = String(studentAnswer).trim();
    if (question.commonWrongAnswers[key]) {
      resolvedType = question.commonWrongAnswers[key]; // prioritize explicit mapping
    }
  }

  const errorCategory   = ERROR_TYPE_LABEL[resolvedType]    || 'Unknown mistake pattern';
  const confidence      = CONFIDENCE_LEVEL[resolvedType]    || 'low';
  const detectedPattern = DETECTED_PATTERN[resolvedType]    || DETECTED_PATTERN['wrong_answer'];

  // ── 4. Generate 3 adaptive hint levels ────────────────────────────────────
  const hint1 = buildPersonalizedHint(question, errorInfo, studentAnswer, 1);
  const hint2 = buildPersonalizedHint(question, errorInfo, studentAnswer, 2);
  const hint3 = buildPersonalizedHint(question, errorInfo, studentAnswer, 3);

  return {
    is_correct:       false,
    error_type:       errorCategory,
    detected_pattern: detectedPattern,
    confidence,
    message:          '',
    hint_level_1:     hint1,
    hint_level_2:     hint2,
    hint_level_3:     hint3,
  };
}

module.exports = { analyzeAnswer };
