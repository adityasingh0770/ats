/**
 * ITS Analyzer — Intelligent Tutoring System Core Engine
 *
 * Analyzes a student's answer, infers the most likely mistake pattern,
 * and generates 2 adaptive hints (from the current wrong answer) without revealing the correct answer.
 * 100% rule-based — no external API or LLM.
 *
 * Output format:
 * {
 *   is_correct        : boolean,
 *   error_type        : string,   // human-readable mistake category
 *   detected_pattern  : string,   // how the student likely arrived at their wrong answer
 *   confidence        : 'low' | 'medium' | 'high',
 *   message           : string,   // encouragement if correct, else ''
 *   hint_level_1      : string,
 *   hint_level_2      : string,
 *   hint_level_3      : '' (reserved),
 * }
 */

const { checkAnswer, detectError } = require('./errorDetectionService');
const { buildPersonalizedHint }    = require('./personalizedHintService');

// ── Encouragement pool ────────────────────────────────────────────────────────
const CORRECT_MESSAGES = [
  "Great job! That's exactly right.",
  "Correct! You've got a solid understanding of this concept.",
  "Well done! Your approach was spot on.",
  "Perfect! Keep up the great work.",
  "Excellent! You applied the formula correctly.",
  "Brilliant! Right on target.",
];

// ── Human-readable error category labels ─────────────────────────────────────
const ERROR_TYPE_LABEL = {
  // Perimeter — Square
  square_two_sides_perimeter:          'Counted only 2 sides instead of 4 (perimeter of square)',
  square_area_instead_of_perimeter:    'Used area formula (s²) for perimeter of square',

  // Perimeter — Rectangle
  multiply_instead_of_add:             'Wrong operation — multiplied where addition was needed',
  add_instead_of_multiply:             'Wrong operation — added where multiplication was needed',
  area_instead_of_perimeter_rect:      'Used area formula (l×b) for perimeter of rectangle',
  perimeter_instead_of_area_rect:      'Used perimeter formula 2(l+b) for area of rectangle',
  rect_multiply_instead_of_perimeter:  'Multiplied length×breadth (area) for perimeter question',
  rect_sum_only_perimeter:             'Added l+b once — forgot to double for full perimeter',
  rect_perimeter_instead_of_area:      'Used perimeter formula for area question (rectangle)',

  // Perimeter — Circle
  circle_forgot_multiply_by_2:         'Used πr instead of 2πr for circumference',
  circle_area_for_circumference:       'Used area formula (πr²) for circumference',
  forgot_pi_circumference:             'Forgot π — computed 2r instead of 2πr',

  // Area — Square
  square_perimeter_instead_of_area:    'Used perimeter formula (4s) for area of square',

  // Area — Circle
  circle_circumference_for_area:       'Used circumference formula (2πr) for area',
  circle_forgot_square_radius:         'Used πr instead of πr² for circle area',
  forgot_pi_area:                      'Forgot π — computed r² instead of πr²',

  // Surface Area — Cube
  cube_one_face_sa:                    'Calculated area of only 1 face (s²) instead of 6s²',
  cube_two_faces_sa:                   'Calculated area of only 2 faces (2s²) instead of 6s²',
  cube_four_faces_sa:                  'Used lateral SA (4s²) instead of total SA (6s²)',
  cube_volume_for_sa:                  'Used volume formula (s³) for surface area of cube',
  cube_linear_sa:                      'Multiplied 6×edge linearly — forgot to square edge',

  // Surface Area — Cuboid
  cuboid_no_factor_2_sa:               'Forgot the factor of 2 — computed lb+bh+lh instead of 2(lb+bh+lh)',
  cuboid_volume_for_sa:                'Used volume formula (l×b×h) for surface area of cuboid',
  cuboid_partial_sa:                   'Only computed one pair of faces (e.g., 2lb) instead of all three pairs',

  // Surface Area — Cylinder
  cylinder_lateral_only_sa:            'Used only CSA (2πrh) instead of TSA (2πr(r+h))',
  cylinder_only_circles_sa:            'Computed only the two circular bases (2πr²) — forgot curved surface',
  cylinder_volume_for_sa:              'Used volume formula (πr²h) for surface area of cylinder',
  cylinder_forgot_factor_2_csa:        'Used πrh instead of 2πrh for CSA — forgot the factor 2',

  // Volume — Cube
  cube_sa_for_volume:                  'Used surface area formula (6s²) for volume of cube',
  cube_squared_for_volume:             'Squared the edge (s²) instead of cubing (s³) for volume',
  cube_linear_for_volume:              'Used a linear expression (6s) instead of s³ for volume',

  // Volume — Cuboid
  cuboid_forgot_height_volume:         'Used only l×b (base area) — forgot height for cuboid volume',
  cuboid_sa_for_volume:                'Used surface area formula for volume of cuboid',
  cuboid_added_dims_volume:            'Added l+b+h instead of multiplying for cuboid volume',

  // Volume — Cylinder
  cylinder_forgot_height_volume:       'Used only πr² (base area) — forgot height for cylinder volume',
  cylinder_csa_for_volume:             'Used CSA formula (2πrh) for volume of cylinder',
  cylinder_tsa_for_volume:             'Used TSA formula (2πr(r+h)) for volume of cylinder',
  cylinder_forgot_square_r:            'Used πrh instead of πr²h — forgot to square the radius',

  // General
  radius_diameter_confusion:           'Radius and diameter confused — used one where the other was needed',
  formula_swap:                        'Wrong formula type used (e.g., perimeter formula for area question)',
  sa_volume_confusion:                 'Surface area and volume formulas swapped',
  unit_error:                          'Unit/place-value error (e.g., cm vs m mixed up)',
  arithmetic_mistake:                  'Arithmetic/calculation error (right approach, wrong computation)',
  partial_formula:                     'Incomplete formula — stopped partway through or skipped a factor',
  wrong_option:                        'Incorrect MCQ option selected',
  wrong_verdict:                       'Incorrect True/False verdict',
  invalid_input:                       'Non-numeric or unreadable input entered',
  wrong_answer:                        'Answer mismatch — specific pattern could not be identified',
  unknown:                             'Answer mismatch — specific pattern could not be identified',

  // Reverse-find
  reverse_gave_perimeter:       'Copied the given perimeter instead of dividing to find the side',
  reverse_square_half:          'Divided the perimeter by 2 instead of 4 — a square has 4 sides, not 2',
  reverse_multiplied:           'Multiplied by 4 instead of dividing — formula applied forwards, not backwards',
  reverse_gave_area:            'Copied the given area instead of taking the square root for the side',
  reverse_square_divided:       'Divided area by 4 instead of taking the square root',
  reverse_rect_forgot_subtract: 'Halved the perimeter correctly but forgot to subtract the known side',
  reverse_gave_input:           'Entered a value given in the question instead of computing the unknown',

  // Extended perimeter — Square
  square_three_sides_perimeter: 'Counted 3 sides instead of 4 (answer = 3 × side)',
  square_one_side_only:         'Wrote the side length itself as the perimeter (counted 1 side)',
  square_perimeter_subtract_instead_multiply:
    'Subtracted the 4 from the side (e.g. side − 4) instead of multiplying 4 × side for perimeter',

  // Extended perimeter — Rectangle
  rect_two_lengths_only:        'Added only two lengths (2 × l) — forgot the two breadths',
  rect_two_breadths_only:       'Added only two breadths (2 × b) — forgot the two lengths',

  // Extended area — Rectangle
  rect_triangle_area:           'Used triangle area formula (½ × l × b) instead of l × b for rectangle',
  rect_side_squared:            'Squared one side (l² or b²) — treated the rectangle as a square',

  // Extended area — Circle
  circle_diameter_as_radius_area: 'Used full diameter as the radius in the area formula → result is 4× too large',

  // Extended SA — Cube
  cube_three_faces_sa:          'Computed area of only 3 faces (3a²) instead of 6a²',
  cube_five_faces_sa:           'Computed area of only 5 faces (5a²) instead of 6a²',

  // Extended SA — Cuboid
  cuboid_lateral_sa_only:       'Computed only lateral SA = 2h(l+b) — missed the top and bottom faces (2lb)',

  // Extended SA — Cylinder
  cylinder_one_circle_sa:       'Added only one circular base (2πrh + πr²) — forgot the second circular cap',

  // Extended Volume — Cube
  cube_twelve_edges_volume:     'Multiplied 12 × edge — computed total edge length instead of volume (edge³)',

  // Extended Volume — Cylinder
  cylinder_diameter_as_radius_vol: 'Used full diameter as radius in volume formula → result is 4× too large',

  // Cost problems
  cost_forgot_rate:             'Calculated the area/perimeter correctly but forgot to multiply by the cost rate',
  cost_wrong_measure:           'Used the wrong measurement type (e.g., area instead of perimeter) for cost calculation',

  // Generic algebraic (pairwise +/−/×/÷)
  algebraic_subtract_instead_multiply: 'Subtracted two quantities where the formula needs their product',
  algebraic_divide_instead_multiply:   'Divided where the formula needs a product',
  algebraic_multiply_instead_divide:     'Multiplied where the formula needs division',
  algebraic_add_instead_divide:         'Added where the formula needs division',
  algebraic_divide_instead_add:         'Divided where the formula needs a sum',
  algebraic_subtract_instead_add:       'Subtracted where the formula needs a sum',
};

// ── Confidence levels per error type ─────────────────────────────────────────
const CONFIDENCE_LEVEL = {
  // High confidence: specific value-matched detections
  square_two_sides_perimeter:          'high',
  square_area_instead_of_perimeter:    'high',
  multiply_instead_of_add:             'high',
  add_instead_of_multiply:             'high',
  area_instead_of_perimeter_rect:      'high',
  perimeter_instead_of_area_rect:      'high',
  rect_multiply_instead_of_perimeter:  'high',
  rect_sum_only_perimeter:             'high',
  rect_perimeter_instead_of_area:      'high',
  circle_forgot_multiply_by_2:         'high',
  circle_area_for_circumference:       'high',
  forgot_pi_circumference:             'high',
  square_perimeter_instead_of_area:    'high',
  circle_circumference_for_area:       'high',
  circle_forgot_square_radius:         'high',
  forgot_pi_area:                      'high',
  cube_one_face_sa:                    'high',
  cube_two_faces_sa:                   'high',
  cube_four_faces_sa:                  'high',
  cube_volume_for_sa:                  'high',
  cube_linear_sa:                      'high',
  cuboid_no_factor_2_sa:               'high',
  cuboid_volume_for_sa:                'high',
  cuboid_partial_sa:                   'high',
  cylinder_lateral_only_sa:            'high',
  cylinder_only_circles_sa:            'high',
  cylinder_volume_for_sa:              'high',
  cylinder_forgot_factor_2_csa:        'high',
  cube_sa_for_volume:                  'high',
  cube_squared_for_volume:             'high',
  cube_linear_for_volume:              'high',
  cuboid_forgot_height_volume:         'high',
  cuboid_sa_for_volume:                'high',
  cuboid_added_dims_volume:            'high',
  cylinder_forgot_height_volume:       'high',
  cylinder_csa_for_volume:             'high',
  cylinder_tsa_for_volume:             'high',
  cylinder_forgot_square_r:            'high',
  radius_diameter_confusion:           'high',
  formula_swap:                        'high',

  // Medium confidence: approximate or general detections
  sa_volume_confusion:                 'medium',
  unit_error:                          'medium',
  arithmetic_mistake:                  'medium',
  partial_formula:                     'medium',
  wrong_option:                        'medium',
  wrong_verdict:                       'medium',
  invalid_input:                       'high',

  // Low confidence: no specific pattern found
  wrong_answer:                        'low',
  unknown:                             'low',

  // Reverse-find: high confidence (value-matched)
  reverse_gave_perimeter:       'high',
  reverse_square_half:          'high',
  reverse_multiplied:           'high',
  reverse_gave_area:            'high',
  reverse_square_divided:       'high',
  reverse_rect_forgot_subtract: 'high',
  reverse_gave_input:           'high',

  // Extended patterns — all value-matched → high
  square_three_sides_perimeter:    'high',
  square_one_side_only:            'high',
  square_perimeter_subtract_instead_multiply: 'high',
  rect_two_lengths_only:           'high',
  rect_two_breadths_only:          'high',
  rect_triangle_area:              'high',
  rect_side_squared:               'high',
  circle_diameter_as_radius_area:  'high',
  cube_three_faces_sa:             'high',
  cube_five_faces_sa:              'high',
  cuboid_lateral_sa_only:          'high',
  cylinder_one_circle_sa:          'high',
  cube_twelve_edges_volume:        'high',
  cylinder_diameter_as_radius_vol: 'high',
  cost_forgot_rate:                'high',
  cost_wrong_measure:              'medium',

  algebraic_subtract_instead_multiply: 'high',
  algebraic_divide_instead_multiply:   'medium',
  algebraic_multiply_instead_divide:   'medium',
  algebraic_add_instead_divide:         'medium',
  algebraic_divide_instead_add:         'medium',
  algebraic_subtract_instead_add:       'medium',
};

// ── Detected-pattern descriptions ────────────────────────────────────────────
const DETECTED_PATTERN = {
  square_two_sides_perimeter:
    'Student likely multiplied 2 × side, counting only two sides of the square instead of all four.',
  square_area_instead_of_perimeter:
    'Student squared the side (s²), computing area instead of the boundary (perimeter = 4s).',
  multiply_instead_of_add:
    'Student multiplied two values that the formula required to be added — common formula-reading error.',
  add_instead_of_multiply:
    'Student added values that should have been multiplied — likely misread the formula structure.',
  area_instead_of_perimeter_rect:
    'Student multiplied l × b (area formula) when the perimeter formula 2(l+b) was required.',
  perimeter_instead_of_area_rect:
    'Student applied 2(l+b) (perimeter) when the area formula l × b was required.',
  rect_multiply_instead_of_perimeter:
    'Student multiplied length × breadth (giving area) when perimeter was asked.',
  rect_sum_only_perimeter:
    'Student added l + b once, giving only two of the four sides — forgot to multiply by 2.',
  rect_perimeter_instead_of_area:
    'Student used the perimeter formula for a rectangle area question.',
  circle_forgot_multiply_by_2:
    'Student applied πr instead of 2πr — the factor of 2 in the circumference formula was omitted.',
  circle_area_for_circumference:
    'Student used the area formula (πr²) when circumference (2πr) was required.',
  forgot_pi_circumference:
    'Student computed 2r without multiplying by π — the π constant was omitted from the circumference.',
  square_perimeter_instead_of_area:
    'Student applied 4 × side (perimeter) when the area formula (s²) was required.',
  circle_circumference_for_area:
    'Student used the circumference formula (2πr) when the area formula (πr²) was required.',
  circle_forgot_square_radius:
    'Student applied πr instead of πr² — forgot to square the radius in the area formula.',
  forgot_pi_area:
    'Student computed r² without multiplying by π — the π constant was omitted from the area formula.',
  cube_one_face_sa:
    'Student computed a² (area of one face) instead of 6a² (total surface area of all 6 faces).',
  cube_two_faces_sa:
    'Student computed 2a² (top + bottom only) instead of 6a² (all 6 faces).',
  cube_four_faces_sa:
    'Student computed 4a² (lateral SA — 4 side faces) instead of 6a² (total SA including top and bottom).',
  cube_volume_for_sa:
    'Student applied the volume formula (a³) instead of the surface area formula (6a²).',
  cube_linear_sa:
    'Student multiplied 6 × a linearly without squaring — did not compute a² for each face area.',
  cuboid_no_factor_2_sa:
    'Student computed lb + bh + lh without the factor of 2 — forgot that each face pair appears twice.',
  cuboid_volume_for_sa:
    'Student applied l × b × h (volume) instead of 2(lb + bh + lh) (surface area).',
  cuboid_partial_sa:
    'Student computed only one pair of face areas (e.g., 2lb) — missed the other two pairs.',
  cylinder_lateral_only_sa:
    'Student computed CSA = 2πrh (curved surface only) when TSA = 2πr(r+h) was required — forgot circular bases.',
  cylinder_only_circles_sa:
    'Student computed 2πr² (two circular bases only) — forgot the curved surface (2πrh).',
  cylinder_volume_for_sa:
    'Student applied the volume formula (πr²h) instead of the surface area formula.',
  cylinder_forgot_factor_2_csa:
    'Student computed πrh instead of 2πrh — the factor of 2 in the CSA formula was omitted.',
  cube_sa_for_volume:
    'Student applied the surface area formula (6a²) instead of the volume formula (a³).',
  cube_squared_for_volume:
    'Student squared the edge (a²) instead of cubing (a³) — stopped one dimension short.',
  cube_linear_for_volume:
    'Student used a linear expression (e.g., 6a) — did not cube the edge for volume.',
  cuboid_forgot_height_volume:
    'Student multiplied only two of the three dimensions (e.g., l × b), omitting height from the volume.',
  cuboid_sa_for_volume:
    'Student applied the surface area formula 2(lb+bh+lh) instead of volume (l×b×h).',
  cuboid_added_dims_volume:
    'Student added l + b + h instead of multiplying all three dimensions for volume.',
  cylinder_forgot_height_volume:
    'Student computed πr² (base area) without multiplying by height — forgot h in V = πr²h.',
  cylinder_csa_for_volume:
    'Student used the curved surface area formula (2πrh) instead of volume (πr²h).',
  cylinder_tsa_for_volume:
    'Student used the total surface area formula 2πr(r+h) instead of volume (πr²h).',
  cylinder_forgot_square_r:
    'Student computed πrh instead of πr²h — did not square the radius in the volume formula.',
  radius_diameter_confusion:
    'Student likely confused radius and diameter — used one where the other was required.',
  formula_swap:
    'Student applied the wrong formula type (e.g., perimeter formula for an area question).',
  sa_volume_confusion:
    'Student confused surface area and volume formulas for a solid shape.',
  unit_error:
    'Student likely mixed measurement units (cm vs m, cm² vs m²) without converting.',
  arithmetic_mistake:
    'Student used the correct approach but made a calculation error in an arithmetic step.',
  partial_formula:
    'Student applied only part of the formula — likely stopped one step early or omitted a factor.',
  wrong_option:
    'Student selected an MCQ option that does not match the formula result for the given values.',
  wrong_verdict:
    'Student gave the opposite True/False verdict from what the calculation actually shows.',
  invalid_input:
    'Student entered a non-numeric value that could not be interpreted as a number.',
  wrong_answer:
    'Student answer does not match the correct result — specific mistake pattern could not be identified.',
  unknown:
    'Student answer does not match the correct result — specific mistake pattern could not be identified.',

  // Reverse-find
  reverse_gave_perimeter:
    'Student wrote down the perimeter that was given in the question instead of working backwards to find the side (side = P ÷ 4).',
  reverse_square_half:
    'Student halved the perimeter (P ÷ 2) instead of quartering it — confused "2 sides" with "4 sides" of a square.',
  reverse_multiplied:
    'Student multiplied by 4 instead of dividing — applied the formula forwards (P = 4s) rather than solving for s.',
  reverse_gave_area:
    'Student wrote down the area that was given instead of computing its square root to find the side.',
  reverse_square_divided:
    'Student divided the area by 4 instead of taking the square root — did not know how to reverse s².',
  reverse_rect_forgot_subtract:
    'Student halved the perimeter to get (l + b) but then forgot to subtract the known side to isolate the unknown.',
  reverse_gave_input:
    'Student entered a number that appears in the question statement rather than computing the unknown quantity.',

  // Extended perimeter — Square
  square_three_sides_perimeter:
    'Student computed 3 × side — counted three sides of the square instead of all four.',
  square_one_side_only:
    'Student submitted the side length itself as the answer — effectively counted only one side.',
  square_perimeter_subtract_instead_multiply:
    'Student subtracted 4 from the side (or 4 − side) treating “4” like a number to combine with subtraction instead of multiplying 4 × side.',

  // Extended perimeter — Rectangle
  rect_two_lengths_only:
    'Student computed 2 × length — included both lengths but forgot both breadths.',
  rect_two_breadths_only:
    'Student computed 2 × breadth — included both breadths but forgot both lengths.',

  // Extended area — Rectangle
  rect_triangle_area:
    'Student halved the product (l × b ÷ 2) — applied the triangle area formula to a rectangle.',
  rect_side_squared:
    'Student squared one side (l² or b²) — treated the rectangle as a square instead of multiplying both dimensions.',

  // Extended area — Circle
  circle_diameter_as_radius_area:
    'Student used the full diameter as the radius in πr² — giving an answer 4× the correct value.',

  // Extended SA — Cube
  cube_three_faces_sa:
    'Student computed 3a² — counted only three faces of the cube instead of all six.',
  cube_five_faces_sa:
    'Student computed 5a² — counted five faces, missing one face of the cube.',

  // Extended SA — Cuboid
  cuboid_lateral_sa_only:
    'Student computed only the lateral SA = 2h(l+b) — covered the four side walls but omitted the top and bottom faces (2lb).',

  // Extended SA — Cylinder
  cylinder_one_circle_sa:
    'Student added only one circular base (2πrh + πr²) — forgot the second cap, getting TSA − πr².',

  // Extended Volume — Cube
  cube_twelve_edges_volume:
    'Student computed 12 × edge — calculated the total edge length (12 edges) instead of volume (edge³).',

  // Extended Volume — Cylinder
  cylinder_diameter_as_radius_vol:
    'Student used the full diameter as the radius in πr²h — giving a volume 4× the correct value.',

  // Cost problems
  cost_forgot_rate:
    'Student computed the correct area or perimeter but forgot to multiply by the cost rate.',
  cost_wrong_measure:
    'Student used the wrong measurement type for the cost calculation (e.g., used area rate but perimeter was needed).',

  algebraic_subtract_instead_multiply:
    'Student subtracted two quantities where the correct path was to multiply them.',
  algebraic_divide_instead_multiply:
    'Student divided where the correct path was to multiply.',
  algebraic_multiply_instead_divide:
    'Student multiplied where the correct path was to divide.',
  algebraic_add_instead_divide:
    'Student added where the correct path was to divide.',
  algebraic_divide_instead_add:
    'Student divided where the correct path was to add.',
  algebraic_subtract_instead_add:
    'Student subtracted where the correct path was to add.',
};

// ── Main analyzer ─────────────────────────────────────────────────────────────

/**
 * Analyze a student's answer and return the full ITS result.
 *
 * @param {object}       question         - Full question object from question bank
 * @param {string|number} studentAnswer   - What the student submitted
 * @param {object|null}  precomputedError - errorInfo from detectError(), if already run
 * @returns {object}  ITS analysis
 */
function analyzeAnswer(question, studentAnswer, precomputedError = null) {
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

  // Use precomputed error from this submit (must match current student answer)
  const errorInfo = precomputedError || detectError(studentAnswer, question.answer, question);
  const errorType = errorInfo?.type || 'wrong_answer';

  // Check common wrong answers map if present in question bank
  let resolvedType = errorType;
  if (question.commonWrongAnswers && typeof question.commonWrongAnswers === 'object') {
    const key = String(studentAnswer).trim();
    if (question.commonWrongAnswers[key]) resolvedType = question.commonWrongAnswers[key];
  }

  const errorCategory   = ERROR_TYPE_LABEL[resolvedType]    || ERROR_TYPE_LABEL['unknown'];
  const confidence      = CONFIDENCE_LEVEL[resolvedType]    || 'low';
  const detectedPattern = DETECTED_PATTERN[resolvedType]    || DETECTED_PATTERN['wrong_answer'];

  const hint1 = buildPersonalizedHint(question, errorInfo, studentAnswer, 1);
  const hint2 = buildPersonalizedHint(question, errorInfo, studentAnswer, 2);

  return {
    is_correct:       false,
    error_type:       errorCategory,
    detected_pattern: detectedPattern,
    confidence,
    message:          '',
    hint_level_1:     hint1,
    hint_level_2:     hint2,
    hint_level_3:     '',
  };
}

module.exports = { analyzeAnswer };
