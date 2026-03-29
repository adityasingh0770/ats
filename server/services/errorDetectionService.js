/**
 * Error Detection Service
 * Classifies student answer errors into specific types with targeted feedback.
 * Supports numeric, MCQ, and True/False question types.
 */

const detectError = (studentAnswer, correctAnswer, question) => {
  const qType = question.type || 'direct_calculation';

  // Non-numeric types: return simple wrong-answer feedback
  if (qType === 'mcq') {
    return {
      type: 'wrong_option',
      feedback: `❌ Incorrect option. Think carefully about the formula for ${question.shape} ${question.topic?.replace('_', ' ')} and try again.`,
    };
  }
  if (qType === 'true_false') {
    return {
      type: 'wrong_verdict',
      feedback: `❌ Incorrect. Review the statement carefully. ${question.reason || ''}`,
    };
  }

  const { topic, shape, formula } = question;
  const ans = parseFloat(studentAnswer);
  const correct = parseFloat(correctAnswer);

  if (isNaN(ans)) return { type: 'invalid_input', feedback: 'Please enter a valid number.' };

  // Radius / Diameter confusion (answer is 2x or 0.5x)
  if (shape === 'circle' || shape === 'cylinder') {
    if (Math.abs(ans - correct * 2) < Math.abs(correct) * 0.05) {
      return {
        type: 'radius_diameter_confusion',
        feedback: '⚠️ Radius vs Diameter confusion! Remember: diameter = 2 × radius. If the problem gives diameter, divide by 2 to get radius before applying the formula.',
      };
    }
    if (correct !== 0 && Math.abs(ans - correct * 0.5) < Math.abs(correct) * 0.05) {
      return {
        type: 'radius_diameter_confusion',
        feedback: '⚠️ Radius vs Diameter confusion! You may have used radius where diameter was needed (or vice versa). Check the problem again.',
      };
    }
  }

  // Formula swap: Area vs Perimeter
  if (topic === 'perimeter') {
    const swapped = getSwappedAreaAnswer(shape, question);
    for (const a of swapped) {
      if (a && Math.abs(ans - a) < Math.abs(a) * 0.05) {
        return {
          type: 'formula_swap',
          feedback: `⚠️ Formula mix-up! You calculated the AREA instead of the PERIMETER. For ${shape}: Perimeter = ${formula}. Area uses a different formula.`,
        };
      }
    }
  }

  if (topic === 'area') {
    const swapped = getSwappedPerimeterAnswer(shape, question);
    for (const p of swapped) {
      if (p && Math.abs(ans - p) < Math.abs(p) * 0.05) {
        return {
          type: 'formula_swap',
          feedback: `⚠️ Formula mix-up! You calculated the PERIMETER instead of the AREA. For ${shape}: Area = ${formula}. Perimeter uses a different formula.`,
        };
      }
    }
  }

  // SA vs Volume confusion
  if (topic === 'surface_area' || topic === 'volume') {
    if (correct !== 0 && Math.abs(ans - correct) > Math.abs(correct) * 0.5) {
      const possibleSwap = topic === 'surface_area' ? 'volume' : 'surface area';
      return {
        type: 'sa_volume_confusion',
        feedback: `⚠️ Did you mix up Surface Area and Volume formulas? Make sure to use the correct formula for ${topic.replace('_', ' ')}.`,
      };
    }
  }

  // Unit error (100x or 10000x off)
  if (correct !== 0 && (
    Math.abs(ans - correct * 100) < Math.abs(correct) * 5 ||
    Math.abs(ans - correct / 100) < Math.abs(correct) * 0.05
  )) {
    return {
      type: 'unit_error',
      feedback: '⚠️ Unit conversion error! Check your units. Are you mixing cm and m? Remember: 1 m = 100 cm, 1 m² = 10,000 cm².',
    };
  }

  // Arithmetic mistake (formula likely correct but calculation wrong)
  if (correct !== 0 && Math.abs(ans - correct) < Math.abs(correct) * 0.5) {
    return {
      type: 'arithmetic_mistake',
      feedback: '⚠️ You seem to have the right idea but made a calculation error. Re-check your arithmetic step by step.',
    };
  }

  // Partial formula
  if (ans > 0 && correct !== 0 && ans < Math.abs(correct) * 0.7) {
    return {
      type: 'partial_formula',
      feedback: `⚠️ Partial formula used! Your answer is smaller than expected. Did you apply the complete formula? Formula: ${formula}`,
    };
  }

  return {
    type: 'wrong_answer',
    feedback: `❌ Incorrect. The formula to use is: ${formula}. Review the concept and try again.`,
  };
};

const getSwappedAreaAnswer = (shape, question) => [];
const getSwappedPerimeterAnswer = (shape, question) => [];

/**
 * checkAnswer — type-aware answer validation.
 * @param {string|number} studentAnswer - What the student submitted
 * @param {number|string} correctAnswer  - The stored answer field value
 * @param {object} question              - Full question document
 */
const checkAnswer = (studentAnswer, correctAnswer, question) => {
  const qType = question?.type || 'direct_calculation';

  if (qType === 'mcq') {
    // Student submits option letter (A/B/C/D)
    return String(studentAnswer).toUpperCase().trim() === String(question.correct_option || '').toUpperCase().trim();
  }

  if (qType === 'true_false') {
    // Student submits "True" or "False"
    return String(studentAnswer).toLowerCase().trim() === String(question.correct_verdict || '').toLowerCase().trim();
  }

  // Numeric comparison with tolerance
  const ans = parseFloat(studentAnswer);
  const correct = parseFloat(correctAnswer);
  if (isNaN(ans) || isNaN(correct)) return false;
  const tolerance = Math.max(Math.abs(correct) * 0.02, 0.5);
  return Math.abs(ans - correct) <= tolerance;
};

module.exports = { detectError, checkAnswer };
