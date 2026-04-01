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
          feedback: `⚠️ Your answer (${ans}) equals ${a} × ${b} = ${prod}, but this question needs addition, not multiplication. Re-read the formula carefully.`,
          hintLead: `You multiplied ${a}×${b} to get ${prod}. Think about what operation the formula actually needs — should you be adding or multiplying here?`,
          remedialLead: `You treated the numbers as factors (${a}×${b}). The situation calls for adding them first, then continuing with the full formula if needed.`,
        });
      }

      if (near(prod, correct, 0.5) && near(sum, ans, 0.5)) {
        return pack({
          type: 'add_instead_of_multiply',
          feedback: `⚠️ Your answer (${ans}) equals ${a} + ${b} = ${sum}, but this step uses multiplication, not addition.`,
          hintLead: `You added ${a}+${b}=${sum}. Check the formula again — does it ask you to add or multiply these values?`,
          remedialLead: `You added the numbers (${a}+${b}). The formula here requires multiplying them.`,
        });
      }

      if (near(perimRect, correct, 0.5) && near(prod, ans, 0.5)) {
        return pack({
          type: 'area_instead_of_perimeter_rect',
          feedback: `⚠️ Your answer (${ans}) is ${a} × ${b} — that gives the space inside (area). But this question asks about the boundary around the rectangle.`,
          hintLead: `${a}×${b}=${prod} gives the space inside (area). But this question is about the boundary. How do you find the total distance around a rectangle?`,
          remedialLead: `Multiplying length×breadth gives area. Perimeter is the total boundary — think about walking around all four sides.`,
        });
      }

      if (near(prod, correct, 0.5) && near(perimRect, ans, 0.5)) {
        return pack({
          type: 'perimeter_instead_of_area_rect',
          feedback: `⚠️ Your answer (${ans}) matches the perimeter formula. But this question asks for area — the space inside the rectangle.`,
          hintLead: `You used the perimeter approach (2×(${a}+${b})). But the question asks for the space inside. Which simpler operation on length and breadth gives area?`,
          remedialLead: `2×(length+breadth) is perimeter. Area is about the space inside — think about what operation on length and breadth gives that.`,
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
      feedback = `❌ You chose ${letter} (${chosen}). Try plugging the values into the formula ${question.formula || ''} and compare each option.`;
    }
    return pack({
      type: 'wrong_option',
      feedback,
      hintLead: chosen
        ? `Option ${letter} (${chosen}) doesn't match when you work through the formula. Try plugging the question's values into ${question.formula || 'the formula'} and compare each option.`
        : `Think about the formula for ${question.shape} ${String(question.topic || '').replace('_', ' ')}. Work through it with the given values and see which option matches.`,
      remedialLead: chosen
        ? `You selected ${letter}: "${chosen}". Walk through ${question.formula || 'the formula'} with the numbers in the question and see which option matches.`
        : `Review the formula for ${question.shape} ${String(question.topic || '').replace('_', ' ')} and apply it step by step.`,
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
          feedback: `⚠️ ${l}×${b} = ${prod} is area, not perimeter. For perimeter, think about the distance around all four sides.`,
          hintLead: `You computed ${l}×${b}=${prod} — that's the area formula. For perimeter, think about walking around all four sides of the rectangle.`,
          remedialLead: `Your answer matches length×breadth (area). This question needs the perimeter: the total distance around all four sides.`,
        });
      }
      if (near(ans, sum, 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'rect_sum_only_perimeter',
          feedback: `⚠️ ${l}+${b} = ${sum} adds the sides once, but a rectangle has four sides, not two.`,
          hintLead: `You got ${l}+${b}=${sum} — that covers just one length and one breadth. A rectangle has four sides. What's the next step?`,
          remedialLead: `Perimeter is the whole boundary: you need both pairs of opposite sides, not just one of each.`,
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
          feedback: `⚠️ Your answer matches the perimeter formula. But this question asks for the space inside the rectangle, not the boundary.`,
          hintLead: `You used 2×(${l}+${b}) — that's the perimeter formula. For area, think about what simpler operation on length and breadth gives the space inside.`,
          remedialLead: `You used the perimeter formula. For area, you only need to combine length and breadth in a simpler way.`,
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
          feedback: `⚠️ ${s}×${s} = ${area} gives the space inside the square. But this question asks about the boundary.`,
          hintLead: `You squared the side — that gives area (space inside). For perimeter, think about all four equal sides of the square.`,
          remedialLead: `Squaring the side gives area. Perimeter is about the total boundary — a square has four equal sides.`,
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
          feedback: `⚠️ Your answer matches the perimeter formula. But this question asks for the space the square covers.`,
          hintLead: `4×side gives the boundary length (perimeter). For area, think about how much space the square covers — what operation on the side gives that?`,
          remedialLead: `You used the perimeter formula. Area is about the space inside — think about what you do with the side length to find that.`,
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
          feedback: `⚠️ Formula mix-up! You calculated the space inside instead of the boundary. Re-read what the question is asking for.`,
          hintLead: `Your answer matches the area formula, not perimeter. Go back to the perimeter formula and try applying it step by step.`,
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
          feedback: `⚠️ Formula mix-up! You calculated the boundary instead of the space inside. Re-read what the question is asking for.`,
          hintLead: `Your answer matches the perimeter formula, not area. Go back to the area formula and try applying it step by step.`,
          remedialLead: `You applied a boundary-length idea; this question needs the inside space (area).`,
        });
      }
    }
  }

  if (topic === 'surface_area' || topic === 'volume') {
    if (correct !== 0 && Math.abs(ans - correct) > Math.abs(correct) * 0.5) {
      return pack({
        type: 'sa_volume_confusion',
        feedback: `⚠️ Did you mix up Surface Area and Volume formulas? Re-read what the question is asking for.`,
        hintLead: `Re-read the question carefully — does it ask for the outer covering (surface area) or the space inside (volume)? They use very different formulas.`,
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
      hintLead: `Your approach seems right but there's a small calculation slip. Try redoing each step carefully and double-check your arithmetic.`,
      remedialLead: `The right formula is probably in reach; a small arithmetic slip changed the final value.`,
    });
  }

  if (ans > 0 && correct !== 0 && ans < Math.abs(correct) * 0.7) {
    return pack({
      type: 'partial_formula',
      feedback: `⚠️ Partial formula used! Your answer is smaller than expected. Did you apply the complete formula? Formula: ${formula}`,
      hintLead: `Your answer is lower than expected. Make sure you completed every part of the formula: ${formula}. Did you miss a step or factor?`,
      remedialLead: `You may have stopped halfway through the formula or left out a factor.`,
    });
  }

  return pack({
    type: 'wrong_answer',
    feedback: `❌ Incorrect. The formula to use is: ${formula}. Review the concept and try again.`,
    hintLead: `Try working through ${formula} step by step using the values from the question. Write down each step to spot where things go differently.`,
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
