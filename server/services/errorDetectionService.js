/**
 * Error Detection Service
 * Classifies student answer errors into specific types with targeted feedback.
 * Supports numeric, MCQ, and True/False question types.
 * Adds hintLead / remedialLead for personalized hints and remedial screens.
 */

const TOL_RATIO = 0.05;

function formatStudentAnswerForUi(answer, unit) {
  if (answer === undefined || answer === null || answer === '') return '';
  const u = unit ? ` ${unit}` : '';
  return `${String(answer).trim()}${u}`;
}

function findNumbersInQuestion(text) {
  if (!text) return [];
  const matches = text.match(/\d+(?:\.\d+)?/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => parseFloat(m)))].filter((n) => !Number.isNaN(n) && n > 0 && n < 1e6);
}

/** e.g. length 8 cm and breadth 5 cm */
function extractRectangleDims(text) {
  if (!text) return null;
  let m = text.match(/length\s+(\d+(?:\.\d+)?)\s*cm.*?breadth\s+(\d+(?:\.\d+)?)\s*cm/i);
  if (m) return { l: parseFloat(m[1]), b: parseFloat(m[2]) };
  m = text.match(/breadth\s+(\d+(?:\.\d+)?)\s*cm.*?length\s+(\d+(?:\.\d+)?)\s*cm/i);
  if (m) return { l: parseFloat(m[2]), b: parseFloat(m[1]) };
  m = text.match(/\bl\s*=\s*(\d+(?:\.\d+)?)\s*m\s+and\s+b\s*=\s*(\d+(?:\.\d+)?)/i);
  if (m) return { l: parseFloat(m[1]), b: parseFloat(m[2]) };
  m = text.match(/\bl\s*=\s*(\d+(?:\.\d+)?)\s*cm\s+and\s+b\s*=\s*(\d+(?:\.\d+)?)/i);
  if (m) return { l: parseFloat(m[1]), b: parseFloat(m[2]) };
  return null;
}

function extractSquareSide(text) {
  if (!text) return null;
  const m = text.match(/side\s+(\d+(?:\.\d+)?)\s*cm/i) || text.match(/side\s+(\d+(?:\.\d+)?)\s*m\b/i);
  return m ? parseFloat(m[1]) : null;
}

function near(a, b, tolAbs) {
  if (a == null || b == null || Number.isNaN(a) || Number.isNaN(b)) return false;
  const tol = Math.max(Math.abs(b) * TOL_RATIO, tolAbs ?? 0.5);
  return Math.abs(a - b) <= tol;
}

function pack(err) {
  const hintLead =
    err.hintLead ||
    String(err.feedback || '')
      .replace(/^⚠️\s*/, '')
      .replace(/^❌\s*/, '')
      .trim();
  return {
    ...err,
    hintLead,
    remedialLead: err.remedialLead || err.feedback,
  };
}

/**
 * Detect e.g. student used a×b when answer should be a+b, or 3×2 when sum is 5.
 */
function inferOperationConfusion(ans, correct, questionText) {
  const nums = findNumbersInQuestion(questionText);
  if (nums.length < 2) return null;

  for (let i = 0; i < nums.length; i += 1) {
    for (let j = i + 1; j < nums.length; j += 1) {
      const a = nums[i];
      const b = nums[j];
      const sum = a + b;
      const prod = a * b;
      const perimRect = 2 * (a + b);

      if (near(sum, correct, 0.5) && near(prod, ans, 0.5)) {
        return pack({
          type: 'multiply_instead_of_add',
          feedback: `⚠️ Your answer (${ans}) equals ${a} × ${b} = ${prod}, but the correct result here is ${a} + ${b} = ${correct}. This question needs addition, not multiplication.`,
          hintLead: `You multiplied ${a}×${b} to get ${prod}. Here you should add: ${a}+${b}=${correct}.`,
          remedialLead: `You treated the numbers as factors (${a}×${b}). The situation calls for adding them first (${a}+${b}), then continuing with the full formula if needed.`,
        });
      }

      if (near(prod, correct, 0.5) && near(sum, ans, 0.5)) {
        return pack({
          type: 'add_instead_of_multiply',
          feedback: `⚠️ Your answer (${ans}) equals ${a} + ${b} = ${sum}, but the correct result uses multiplication: ${a} × ${b} = ${correct}.`,
          hintLead: `You added ${a}+${b}=${sum}. This step needs multiplication: ${a}×${b}=${correct}.`,
          remedialLead: `You added the numbers (${a}+${b}). The formula here requires multiplying (${a}×${b}).`,
        });
      }

      if (near(perimRect, correct, 0.5) && near(prod, ans, 0.5)) {
        return pack({
          type: 'area_instead_of_perimeter_rect',
          feedback: `⚠️ Your answer (${ans}) is ${a} × ${b} — that is the area of an ${a} cm by ${b} cm rectangle. This question asks for perimeter, which is 2×(${a}+${b}) = ${perimRect}.`,
          hintLead: `${a}×${b}=${prod} is area. Perimeter goes around the rectangle: 2×(${a}+${b})=${perimRect}.`,
          remedialLead: `Multiplying length×breadth gives area (${prod}). Perimeter is the total boundary: 2×(length+breadth)=${perimRect}.`,
        });
      }

      if (near(prod, correct, 0.5) && near(perimRect, ans, 0.5)) {
        return pack({
          type: 'perimeter_instead_of_area_rect',
          feedback: `⚠️ Your answer (${ans}) matches the perimeter 2×(${a}+${b}) = ${perimRect}. This question asks for area = length × breadth = ${a} × ${b} = ${correct}.`,
          hintLead: `You used the perimeter idea (2×(${a}+${b})). For area, multiply only: ${a}×${b}=${correct}.`,
          remedialLead: `2×(length+breadth) is perimeter (${perimRect}). Area is length×breadth=${correct}.`,
        });
      }
    }
  }
  return null;
}

function getSwappedAreaAnswer(shape, question) {
  const text = question.question || '';
  if (shape === 'square') {
    const s = extractSquareSide(text);
    if (s != null) return [s * s];
  }
  if (shape === 'rectangle') {
    const d = extractRectangleDims(text);
    if (d) return [d.l * d.b];
  }
  return [];
}

function getSwappedPerimeterAnswer(shape, question) {
  const text = question.question || '';
  if (shape === 'square') {
    const s = extractSquareSide(text);
    if (s != null) return [4 * s];
  }
  if (shape === 'rectangle') {
    const d = extractRectangleDims(text);
    if (d) return [2 * (d.l + d.b)];
  }
  return [];
}

const detectError = (studentAnswer, correctAnswer, question) => {
  const qType = question.type || 'direct_calculation';
  const qtext = question.question || '';

  if (qType === 'mcq') {
    const letter = String(studentAnswer).toUpperCase().trim();
    const opts = question.options || {};
    const chosen = opts[letter];
    const correctLetter = String(question.correct_option || '').toUpperCase().trim();
    const correctLabel = opts[correctLetter] || 'the correct option';
    let feedback = `❌ Incorrect. Think about the formula for ${question.shape} ${String(question.topic || '').replace('_', ' ')}.`;
    if (chosen) {
      feedback = `❌ You chose ${letter} (${chosen}). The correct choice is ${correctLetter} (${correctLabel}). Compare the values with the formula ${question.formula || ''}.`;
    }
    return pack({
      type: 'wrong_option',
      feedback,
      hintLead: chosen
        ? `Option ${letter} (${chosen}) does not match ${question.formula || 'the right formula'}. Compare with ${correctLabel}.`
        : feedback,
      remedialLead: chosen
        ? `You selected ${letter}: "${chosen}". Walk through ${question.formula || 'the formula'} with the numbers in the question and see which option matches.`
        : feedback,
    });
  }

  if (qType === 'true_false') {
    const said = String(studentAnswer).trim();
    const feedback = `❌ You answered "${said}". ${question.reason || 'Review the statement with the formula and try again.'}`;
    return pack({
      type: 'wrong_verdict',
      feedback,
      hintLead: `You said ${said}. Re-check the calculation in the statement against ${question.formula || 'the concept'}.`,
      remedialLead: feedback,
    });
  }

  const { topic, shape, formula } = question;
  const ans = parseFloat(studentAnswer);
  const correct = parseFloat(correctAnswer);

  if (Number.isNaN(ans)) return pack({ type: 'invalid_input', feedback: 'Please enter a valid number.' });

  const opErr = inferOperationConfusion(ans, correct, qtext);
  if (opErr) return opErr;

  if (shape === 'rectangle' && topic === 'perimeter') {
    const d = extractRectangleDims(qtext);
    if (d) {
      const { l, b } = d;
      const sum = l + b;
      const prod = l * b;
      const perim = 2 * (l + b);
      if (near(ans, prod, 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'rect_multiply_instead_of_perimeter',
          feedback: `⚠️ ${l}×${b} = ${prod} is area, not perimeter. For perimeter use 2×(${l}+${b}) = ${perim}.`,
          hintLead: `You computed ${l}×${b}=${prod}. Perimeter = 2×(length+breadth)=${perim}.`,
          remedialLead: `Your answer matches length×breadth (area). This question needs the perimeter: add length and breadth, then multiply by 2.`,
        });
      }
      if (near(ans, sum, 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'rect_sum_only_perimeter',
          feedback: `⚠️ ${l}+${b} = ${sum} adds the sides once, but the full perimeter is 2×(${l}+${b}) = ${perim}.`,
          hintLead: `You stopped at ${l}+${b}=${sum}. Multiply that sum by 2 for perimeter: 2×${sum}=${perim}.`,
          remedialLead: `Perimeter is the whole boundary: you need both pairs of opposite sides, so 2×(length+breadth).`,
        });
      }
    }
  }

  if (shape === 'rectangle' && topic === 'area') {
    const d = extractRectangleDims(qtext);
    if (d) {
      const { l, b } = d;
      const perim = 2 * (l + b);
      if (near(ans, perim, 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'rect_perimeter_instead_of_area',
          feedback: `⚠️ Your answer matches perimeter 2×(${l}+${b})=${perim}. This question asks for area = ${l}×${b}=${l * b}.`,
          hintLead: `2×(${l}+${b}) is perimeter. Area is ${l}×${b}.`,
          remedialLead: `You used the perimeter formula. For area, multiply length by breadth only.`,
        });
      }
    }
  }

  if (shape === 'square' && topic === 'perimeter') {
    const s = extractSquareSide(qtext);
    if (s != null) {
      const area = s * s;
      if (near(ans, area, 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'square_area_instead_of_perimeter',
          feedback: `⚠️ ${s}×${s} = ${area} is the area of the square. Perimeter is 4×${s} = ${4 * s}.`,
          hintLead: `You squared the side (area). Perimeter uses 4×side.`,
          remedialLead: `Area = side×side; perimeter = 4×side — don't mix them.`,
        });
      }
    }
  }

  if (shape === 'square' && topic === 'area') {
    const s = extractSquareSide(qtext);
    if (s != null) {
      const perim = 4 * s;
      if (near(ans, perim, 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'square_perimeter_instead_of_area',
          feedback: `⚠️ 4×${s} = ${perim} is perimeter. Area is side×side = ${s}×${s} = ${s * s}.`,
          hintLead: `4×side is perimeter. Area is side×side.`,
          remedialLead: `You used perimeter (4a). Area needs a×a.`,
        });
      }
    }
  }

  if (shape === 'circle' || shape === 'cylinder') {
    if (near(ans, correct * 2, Math.abs(correct) * 0.05)) {
      return pack({
        type: 'radius_diameter_confusion',
        feedback:
          '⚠️ Radius vs Diameter confusion! Remember: diameter = 2 × radius. If the problem gives diameter, divide by 2 to get radius before applying the formula.',
        remedialLead:
          'Your answer is about twice the expected value — check whether the question gave radius or diameter.',
      });
    }
    if (correct !== 0 && near(ans, correct * 0.5, Math.abs(correct) * 0.05)) {
      return pack({
        type: 'radius_diameter_confusion',
        feedback:
          '⚠️ Radius vs Diameter confusion! You may have used radius where diameter was needed (or vice versa). Check the problem again.',
        remedialLead: 'Your answer is about half the expected value — often a radius/diameter mix-up.',
      });
    }
  }

  if (topic === 'perimeter') {
    const swapped = getSwappedAreaAnswer(shape, question);
    for (const a of swapped) {
      if (a && near(ans, a, Math.abs(a) * TOL_RATIO)) {
        return pack({
          type: 'formula_swap',
          feedback: `⚠️ Formula mix-up! You calculated the AREA instead of the PERIMETER. For ${shape}: Perimeter = ${formula}. Area uses a different formula.`,
          hintLead: `Your number matches area, not perimeter. Use: ${formula}.`,
          remedialLead: `Compare perimeter vs area for this shape — your answer fits the area idea.`,
        });
      }
    }
  }

  if (topic === 'area') {
    const swapped = getSwappedPerimeterAnswer(shape, question);
    for (const p of swapped) {
      if (p && near(ans, p, Math.abs(p) * TOL_RATIO)) {
        return pack({
          type: 'formula_swap',
          feedback: `⚠️ Formula mix-up! You calculated the PERIMETER instead of the AREA. For ${shape}: Area = ${formula}. Perimeter uses a different formula.`,
          hintLead: `Your number matches perimeter, not area. Use: ${formula}.`,
          remedialLead: `You applied a boundary-length idea; this question needs the inside space (area).`,
        });
      }
    }
  }

  if (topic === 'surface_area' || topic === 'volume') {
    if (correct !== 0 && Math.abs(ans - correct) > Math.abs(correct) * 0.5) {
      return pack({
        type: 'sa_volume_confusion',
        feedback: `⚠️ Did you mix up Surface Area and Volume formulas? Make sure to use the correct formula for ${String(topic).replace('_', ' ')}.`,
        hintLead: `Re-read whether the question wants total surface area or space inside (volume).`,
        remedialLead: `Your answer is far from the mark — surface area and volume use different formulas for the same solid.`,
      });
    }
  }

  if (
    correct !== 0 &&
    (near(ans, correct * 100, Math.abs(correct) * 5) || near(ans, correct / 100, Math.abs(correct) * 0.05))
  ) {
    return pack({
      type: 'unit_error',
      feedback:
        '⚠️ Unit conversion error! Check your units. Are you mixing cm and m? Remember: 1 m = 100 cm, 1 m² = 10,000 cm².',
    });
  }

  if (correct !== 0 && Math.abs(ans - correct) < Math.abs(correct) * 0.5) {
    return pack({
      type: 'arithmetic_mistake',
      feedback: '⚠️ You seem to have the right idea but made a calculation error. Re-check your arithmetic step by step.',
      hintLead: `Your answer (${ans}) is close to ${correct} — redo the middle steps carefully.`,
      remedialLead: `The right formula is probably in reach; a small arithmetic slip changed the final value.`,
    });
  }

  if (ans > 0 && correct !== 0 && ans < Math.abs(correct) * 0.7) {
    return pack({
      type: 'partial_formula',
      feedback: `⚠️ Partial formula used! Your answer is smaller than expected. Did you apply the complete formula? Formula: ${formula}`,
      hintLead: `Your value is smaller than expected — check you used the full formula: ${formula}.`,
      remedialLead: `You may have stopped halfway through the formula or left out a factor.`,
    });
  }

  return pack({
    type: 'wrong_answer',
    feedback: `❌ Incorrect. The formula to use is: ${formula}. Review the concept and try again.`,
    hintLead: `Compare your steps with ${formula}.`,
    remedialLead: `Your answer doesn't match the expected result. Review ${formula} with the numbers given.`,
  });
};

const checkAnswer = (studentAnswer, correctAnswer, question) => {
  const qType = question?.type || 'direct_calculation';

  if (qType === 'mcq') {
    return String(studentAnswer).toUpperCase().trim() === String(question.correct_option || '').toUpperCase().trim();
  }

  if (qType === 'true_false') {
    return String(studentAnswer).toLowerCase().trim() === String(question.correct_verdict || '').toLowerCase().trim();
  }

  const ans = parseFloat(studentAnswer);
  const correct = parseFloat(correctAnswer);
  if (Number.isNaN(ans) || Number.isNaN(correct)) return false;
  const tolerance = Math.max(Math.abs(correct) * 0.02, 0.5);
  return Math.abs(ans - correct) <= tolerance;
};

module.exports = { detectError, checkAnswer, formatStudentAnswerForUi };
