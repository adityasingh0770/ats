/**
 * Three escalating hints per mistake — plain language about what the student did vs what to do.
 * No generic "concept / formula / step" buckets; each line is tied to error type + their answer.
 */

const { formatStudentAnswerForUi } = require('./errorDetectionService');

function snippetOf(studentAnswer, unit) {
  return formatStudentAnswerForUi(studentAnswer, unit) || 'your answer';
}

/**
 * @param {object} question - full question doc
 * @param {object|null} errorInfo - from detectError
 * @param {string|number} studentAnswer
 * @param {number} level - 1, 2, or 3
 */
function buildPersonalizedHint(question, errorInfo, studentAnswer, level) {
  const L = Math.min(Math.max(parseInt(level, 10) || 1, 1), 3);
  const sn = snippetOf(studentAnswer, question.unit);
  const f = question.formula || 'the right formula';
  const qtext = question.question || '';
  const type = errorInfo?.type || 'wrong_answer';
  const topic = String(question.topic || '').replace(/_/g, ' ');
  const shape = question.shape || 'shape';

  const pick = (a, b, c) => [a, b, c][L - 1];

  switch (type) {
    case 'multiply_instead_of_add':
      return pick(
        `You entered ${sn}. That usually means you multiplied two numbers that should be added first. Next try: use + between those parts, not ×.`,
        `Mistake pattern: multiplication where addition belongs. Read the formula again — does it say to add two lengths (or terms) before anything else?`,
        `Concrete fix: write the addition part first (a + b), then continue with whatever the full formula says (for example doubling, or multiplying by π).`
      );

    case 'add_instead_of_multiply':
      return pick(
        `You entered ${sn}. That looks like you added when the formula expects you to multiply. Check: should two numbers be multiplied together here?`,
        `You used addition (+) in a place that needs multiplication (×). Compare your steps to ${f}.`,
        `Fix: identify which two quantities must be multiplied (not summed), then multiply them as the formula shows.`
      );

    case 'area_instead_of_perimeter_rect':
    case 'rect_multiply_instead_of_perimeter':
      return pick(
        `You entered ${sn}. You multiplied length × breadth — that gives area (inside the rectangle). This question asks for perimeter (around the edge). Don't use × of l and b here; use the perimeter idea.`,
        `You multiplied when you should walk the boundary: add length + breadth + length + breadth, or use 2 × (length + breadth).`,
        `Remember: perimeter = total fence length around the shape = 2(l + b). Area = l × b. You did the area operation; switch to the perimeter one.`
      );

    case 'perimeter_instead_of_area_rect':
    case 'rect_perimeter_instead_of_area':
      return pick(
        `You entered ${sn}. That matches a perimeter-style calculation. This question wants the space inside — area — so you should multiply length × breadth, not use 2(l + b).`,
        `You added/doubled like for perimeter. For area, only multiply the two dimensions: length × breadth.`,
        `Area = l × b (one multiplication). Perimeter = 2(l + b). You used the perimeter path; use the single product of length and breadth.`
      );

    case 'rect_sum_only_perimeter':
      return pick(
        `You entered ${sn}. You added length + breadth once, but a rectangle has four sides: two lengths and two breadths. You still need to count the “other pair” of sides.`,
        `After l + b, perimeter needs the same pair again — that’s why we write 2 × (l + b).`,
        `Full step: (l + b) is half the walk around; multiply that sum by 2 for the whole boundary: P = 2(l + b).`
      );

    case 'square_area_instead_of_perimeter':
      return pick(
        `You entered ${sn}. You squared the side (s × s) — that’s area. This question asks for perimeter, so think “four equal sides”, not “side × side”.`,
        `For a square’s boundary, add all four sides: s + s + s + s = 4 × s, not s².`,
        `Use P = 4 × side. You used s² (area); replace it with 4 × s for perimeter.`
      );

    case 'square_perimeter_instead_of_area':
      return pick(
        `You entered ${sn}. You used 4 × side — that’s perimeter. Here the question wants area (space inside), so use side × side, not 4 × side.`,
        `Area of a square = side × side = s². You walked the “four sides” idea; switch to “how much space inside”.`,
        `Write A = s × s. Cancel the “4 ×” idea for this question.`
      );

    case 'radius_diameter_confusion': {
      const fb = String(errorInfo?.feedback || '');
      const looksDouble = /twice|double|2\s*×|2\s*\*/i.test(fb) || /too large|bigger than expected/i.test(fb);
      return pick(
        looksDouble
          ? `Your value ${sn} is much larger than expected — often that means diameter was used as radius (or you doubled when you should not). If the problem states diameter, use r = d ÷ 2 before ${f}.`
          : `Your value ${sn} is much smaller than expected — often radius and diameter were swapped. “Across through the centre” = diameter; “centre to edge” = radius. Use the one that matches ${f}.`,
        `Radius r and diameter d satisfy d = 2r. Substitute only the quantity the question actually gives.`,
        `Pick one: work entirely in r or entirely in d, convert once, then plug into ${f} — do not mix both in the same step.`
      );
    }

    case 'formula_swap':
      return pick(
        `You entered ${sn}. Your number fits one kind of formula (area vs perimeter, or similar) but the question asked for the other. Re-read the last line of the question: does it say “around”, “boundary”, “inside”, or “space”?`,
        `You applied the wrong “family” of formula for what was asked. Compare ${f} with the other common formula for this shape and pick the one that matches the question’s words.`,
        `Name what you need aloud: perimeter/circumference = around; area = inside; surface area = all faces; volume = space filled. Then use only the matching formula.`
      );

    case 'unit_error':
      return pick(
        `You entered ${sn}. The size of the error (×100 or ÷100) often means cm/m or m²/cm² mix-up. Convert everything to one unit before calculating.`,
        `Check: 1 m = 100 cm, 1 m² = 10 000 cm². Make lengths consistent before you substitute.`,
        `Redo the problem with every measurement written in the same unit, then apply ${f}.`
      );

    case 'arithmetic_mistake':
      return pick(
        `You entered ${sn}. You’re close to the expected value — the idea is probably right but a calculation step slipped. Recalculate slowly on paper.`,
        `Trace each operation in order. Common slips: order of operations, fraction arithmetic, or π substitution.`,
        `Start from ${f} with the given numbers; do one operation at a time and check each intermediate result.`
      );

    case 'partial_formula':
      return pick(
        `You entered ${sn}. It’s smaller than expected — you may have stopped halfway through the formula or left out a factor.`,
        `Compare your work to the full ${f}. Did you multiply every part that should be multiplied?`,
        `Write the full formula first, then substitute every symbol from the question — don’t skip a term.`
      );

    case 'sa_volume_confusion':
      return pick(
        `You entered ${sn}. The value is far off — often surface area (faces) is swapped with volume (space inside). Which one does the question name?`,
        `Surface area adds areas of faces (often several terms with π, r, h). Volume is a single “space” formula. Match words to the right one.`,
        `If it asks for “total area of all faces” or “SA”, don’t use the volume formula — and the other way around.`
      );

    case 'wrong_option': {
      const letter = String(studentAnswer).toUpperCase().trim();
      return pick(
        `You chose ${letter}. That option doesn’t come out of ${f} with the numbers in the question. Work the formula on paper and see which option matches.`,
        `Plug the question’s measurements into ${f} step by step. Eliminate options that can’t be produced that way.`,
        `Recalculate each option mentally or on paper; the correct one is exactly what ${f} gives with the given data.`
      );
    }

    case 'wrong_verdict': {
      const said = String(studentAnswer).trim();
      return pick(
        `You said “${said}”. Check the numbers in the statement with ${f} — does the claimed result match?`,
        `Do the computation the statement describes. If it matches, True; if not, False.`,
        `Work the left-hand side and right-hand side of the claim separately, then compare.`
      );
    }

    case 'invalid_input':
      return pick(
        `Enter a number only (you can include a decimal). Remove extra text or units in the box if the app asks for the number alone.`,
        `Use digits and one decimal point if needed. Then submit again.`,
        `If the answer is a fraction, try its decimal form unless the question says otherwise.`
      );

    default:
      return pick(
        `You entered ${sn}. It doesn’t match the correct result. First check: does the question want ${topic} of this ${shape} — and are you using the matching formula, not a different one?`,
        `Use ${f} with the values from the question. Write the formula, substitute, then calculate — watch × vs + and squared terms.`,
        `Last nudge: copy ${f}, replace each letter with the number from the question, then evaluate left to right respecting brackets and powers.`
      );
  }
}

module.exports = { buildPersonalizedHint };
