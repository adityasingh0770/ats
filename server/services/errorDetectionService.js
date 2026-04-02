/**
 * Error Detection Service — Grade 8 Mensuration ITS
 *
 * Detects 40+ specific mistake patterns across all shape × topic combinations:
 *   Shapes : square, rectangle, circle, cube, cuboid, cylinder
 *   Topics : perimeter, area, surface_area, volume
 *   Types  : direct_calculation, mcq, true_false, fill_in_blank,
 *             reverse_find, word_problem, cost_problem, comparison
 *
 * Every error returns: { type, feedback, hintLead, remedialLead }
 */

const TOL_RATIO = 0.05;          // 5% relative tolerance
const PI        = 22 / 7;         // NCERT standard (≈ 3.142857)

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatStudentAnswerForUi(answer, unit) {
  if (answer === undefined || answer === null || answer === '') return '';
  const u = unit ? ` ${unit}` : '';
  return `${String(answer).trim()}${u}`;
}

function findNumbersInQuestion(text) {
  if (!text) return [];
  const matches = text.match(/\d+(?:\.\d+)?/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => parseFloat(m)))].filter(
    (n) => !Number.isNaN(n) && n > 0 && n < 1e6
  );
}

/** Fuzzy equality: max(5% relative, tolAbs) tolerance */
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

// ── Dimension extractors ──────────────────────────────────────────────────────

/** Rectangle: returns { l, b } or null */
function extractRectangleDims(text) {
  if (!text) return null;
  let m = text.match(/length\s+(\d+(?:\.\d+)?)\s*cm.*?breadth\s+(\d+(?:\.\d+)?)\s*cm/i);
  if (m) return { l: parseFloat(m[1]), b: parseFloat(m[2]) };
  m = text.match(/breadth\s+(\d+(?:\.\d+)?)\s*cm.*?length\s+(\d+(?:\.\d+)?)\s*cm/i);
  if (m) return { l: parseFloat(m[2]), b: parseFloat(m[1]) };
  m = text.match(/\bl\s*=\s*(\d+(?:\.\d+)?)\s*(?:m|cm).*?\bb\s*=\s*(\d+(?:\.\d+)?)/i);
  if (m) return { l: parseFloat(m[1]), b: parseFloat(m[2]) };
  // word-problem: "X m long and Y m wide"
  m = text.match(/(\d+(?:\.\d+)?)\s*m\s+long.*?(\d+(?:\.\d+)?)\s*m\s+(?:wide|broad)/i);
  if (m) return { l: parseFloat(m[1]), b: parseFloat(m[2]) };
  return null;
}

/** Square / Cube side: handles "side X cm", "edge X cm", "a = X" */
function extractSide(text) {
  if (!text) return null;
  let m = text.match(/(?:side|edge)\s+(?:of\s+)?(\d+(?:\.\d+)?)\s*(?:cm|m)\b/i);
  if (!m) m = text.match(/\ba\s*=\s*(\d+(?:\.\d+)?)/i);
  return m ? parseFloat(m[1]) : null;
}

/** Circle: returns radius r (converts diameter if needed) */
function extractCircleRadius(text) {
  if (!text) return null;
  // "radius X cm" / "radius of X cm"
  let m = text.match(/radius\s+(?:of\s+)?(\d+(?:\.\d+)?)\s*(?:cm|m)\b/i);
  if (!m) m = text.match(/\br\s*=\s*(\d+(?:\.\d+)?)\s*(?:cm|m)\b/i);
  if (m) return parseFloat(m[1]);
  // "diameter X cm" → r = d/2
  m = text.match(/diameter\s+(?:of\s+)?(\d+(?:\.\d+)?)\s*(?:cm|m)\b/i);
  if (!m) m = text.match(/\bd\s*=\s*(\d+(?:\.\d+)?)\s*(?:cm|m)\b/i);
  if (m) return parseFloat(m[1]) / 2;
  return null;
}

/** Cuboid: returns { l, b, h } or null (h may be null for partial matches) */
function extractCuboidDims(text) {
  if (!text) return null;
  // "l = X cm, b = Y cm, h = Z cm"
  const lM = text.match(/\bl\s*=\s*(\d+(?:\.\d+)?)\s*(?:cm|m)\b/i) ||
             text.match(/length\s+(?:of\s+)?(\d+(?:\.\d+)?)\s*(?:cm|m)\b/i);
  const bM = text.match(/\bb\s*=\s*(\d+(?:\.\d+)?)\s*(?:cm|m)\b/i) ||
             text.match(/breadth\s+(?:of\s+)?(\d+(?:\.\d+)?)\s*(?:cm|m)\b/i) ||
             text.match(/width\s+(?:of\s+)?(\d+(?:\.\d+)?)\s*(?:cm|m)\b/i);
  const hM = text.match(/\bh\s*=\s*(\d+(?:\.\d+)?)\s*(?:cm|m)\b/i) ||
             text.match(/height\s+(?:of\s+)?(\d+(?:\.\d+)?)\s*(?:cm|m)\b/i);
  if (lM && bM && hM) {
    return { l: parseFloat(lM[1]), b: parseFloat(bM[1]), h: parseFloat(hM[1]) };
  }
  // "length X cm, breadth Y cm, height Z cm"
  const seq = text.match(
    /length\s+(\d+(?:\.\d+)?)\s*cm.*?breadth\s+(\d+(?:\.\d+)?)\s*cm.*?height\s+(\d+(?:\.\d+)?)\s*cm/i
  );
  if (seq) return { l: parseFloat(seq[1]), b: parseFloat(seq[2]), h: parseFloat(seq[3]) };
  if (lM && bM) return { l: parseFloat(lM[1]), b: parseFloat(bM[1]), h: null };
  return null;
}

/** Cylinder: returns { r, h } or null */
function extractCylinderDims(text) {
  if (!text) return null;
  let r = null, h = null;
  let m = text.match(/radius\s+(?:of\s+)?(\d+(?:\.\d+)?)\s*(?:cm|m)\b/i);
  if (!m) m = text.match(/\br\s*=\s*(\d+(?:\.\d+)?)\s*(?:cm|m)\b/i);
  if (m) r = parseFloat(m[1]);
  m = text.match(/height\s+(?:of\s+)?(\d+(?:\.\d+)?)\s*(?:cm|m)\b/i);
  if (!m) m = text.match(/\bh\s*=\s*(\d+(?:\.\d+)?)\s*(?:cm|m)\b/i);
  if (m) h = parseFloat(m[1]);
  if (!r) {
    let dm = text.match(/diameter\s+(?:of\s+)?(\d+(?:\.\d+)?)\s*(?:cm|m)\b/i);
    if (dm) r = parseFloat(dm[1]) / 2;
  }
  return r && h ? { r, h } : null;
}

// ── General operation-confusion check (rectangle / 2-number cases) ────────────

function inferOperationConfusion(ans, correct, questionText) {
  const nums = findNumbersInQuestion(questionText);
  if (nums.length < 2) return null;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      const a = nums[i], b = nums[j];
      const sum  = a + b;
      const prod = a * b;
      const perimRect = 2 * (a + b);

      if (near(sum, correct, 0.5) && near(prod, ans, 0.5)) {
        return pack({
          type: 'multiply_instead_of_add',
          feedback: `⚠️ Your answer (${ans}) equals ${a} × ${b} = ${prod}, but this step needs addition, not multiplication.`,
          hintLead: `You multiplied ${a}×${b} to get ${prod}. Think about what operation the formula actually needs — should you be adding or multiplying here?`,
          remedialLead: `You treated the numbers as factors (${a}×${b}). The formula here calls for adding them first.`,
        });
      }
      if (near(prod, correct, 0.5) && near(sum, ans, 0.5)) {
        return pack({
          type: 'add_instead_of_multiply',
          feedback: `⚠️ Your answer (${ans}) equals ${a} + ${b} = ${sum}, but this step uses multiplication, not addition.`,
          hintLead: `You added ${a}+${b}=${sum}. Check the formula — does it ask you to add or multiply these values?`,
          remedialLead: `You added the numbers (${a}+${b}). The formula here requires multiplying them.`,
        });
      }
      if (near(perimRect, correct, 0.5) && near(prod, ans, 0.5)) {
        return pack({
          type: 'area_instead_of_perimeter_rect',
          feedback: `⚠️ Your answer (${ans}) is ${a} × ${b} — that gives the space inside (area). This question asks for the boundary (perimeter).`,
          hintLead: `${a}×${b}=${prod} gives the space inside (area). This question is about the boundary — how do you find the total distance around a rectangle?`,
          remedialLead: `Multiplying length×breadth gives area. Perimeter is the total boundary — think about walking around all four sides.`,
        });
      }
      if (near(prod, correct, 0.5) && near(perimRect, ans, 0.5)) {
        return pack({
          type: 'perimeter_instead_of_area_rect',
          feedback: `⚠️ Your answer (${ans}) matches the perimeter formula. This question asks for area — the space inside.`,
          hintLead: `You used 2×(${a}+${b}). But the question asks for the space inside. Which simpler operation on length and breadth gives area?`,
          remedialLead: `2×(length+breadth) is perimeter. Area is about the space inside — multiply length × breadth directly.`,
        });
      }
    }
  }
  return null;
}

// ── Swapped-formula helpers (2D) ──────────────────────────────────────────────

function getSwappedAreaAnswer(shape, question) {
  const text = question.question || '';
  if (shape === 'square') { const s = extractSide(text); if (s != null) return [s * s]; }
  if (shape === 'rectangle') { const d = extractRectangleDims(text); if (d) return [d.l * d.b]; }
  return [];
}

function getSwappedPerimeterAnswer(shape, question) {
  const text = question.question || '';
  if (shape === 'square') { const s = extractSide(text); if (s != null) return [4 * s]; }
  if (shape === 'rectangle') { const d = extractRectangleDims(text); if (d) return [2 * (d.l + d.b)]; }
  return [];
}

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN DETECTOR
// ══════════════════════════════════════════════════════════════════════════════

const detectError = (studentAnswer, correctAnswer, question) => {
  const qType = question.type || 'direct_calculation';
  const qtext = question.question || '';
  const { topic, shape, formula } = question;
  const ans     = parseFloat(studentAnswer);
  const correct = parseFloat(correctAnswer);

  // ── MCQ ────────────────────────────────────────────────────────────────────
  if (qType === 'mcq') {
    const letter  = String(studentAnswer).toUpperCase().trim();
    const opts    = question.options || {};
    const chosen  = opts[letter];
    const feedback = chosen
      ? `❌ You chose ${letter} (${chosen}). Try plugging the values into ${question.formula || 'the formula'} and compare each option.`
      : `❌ Incorrect. Think about the formula for ${shape} ${String(topic || '').replace('_', ' ')}.`;
    return pack({
      type: 'wrong_option',
      feedback,
      hintLead: chosen
        ? `Option ${letter} (${chosen}) doesn't match when you work through the formula. Try substituting the question's values into ${question.formula || 'the formula'} and compare each option.`
        : `Think about the formula for ${shape} ${String(topic || '').replace('_', ' ')}. Work through it with the given values and see which option matches.`,
      remedialLead: feedback,
    });
  }

  // ── True/False ─────────────────────────────────────────────────────────────
  if (qType === 'true_false') {
    const said = String(studentAnswer).trim();
    const feedback = `❌ You answered "${said}". ${question.reason || 'Review the statement with the formula and try again.'}`;
    return pack({
      type: 'wrong_verdict',
      feedback,
      hintLead: `You said "${said}". Re-check the calculation in the statement against ${question.formula || 'the concept'} — does the number in the statement actually come out of the formula?`,
      remedialLead: feedback,
    });
  }

  // ── Invalid input ──────────────────────────────────────────────────────────
  if (Number.isNaN(ans)) {
    return pack({ type: 'invalid_input', feedback: 'Please enter a valid number.', hintLead: 'Enter only a number (digits, optional decimal). Remove any units or text from the answer box.', remedialLead: 'Enter a number only. If the answer is a fraction, use its decimal form.' });
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  SHAPE + TOPIC SPECIFIC DETECTORS
  // ══════════════════════════════════════════════════════════════════════════

  // ── PERIMETER — Square ────────────────────────────────────────────────────
  if (shape === 'square' && topic === 'perimeter') {
    const s = extractSide(qtext);
    if (s != null) {
      const perim   = 4 * s;
      const twoSide = 2 * s;
      const areaVal = s * s;

      if (near(ans, twoSide, 0.5) && !near(ans, perim, 0.5)) {
        return pack({
          type: 'square_two_sides_perimeter',
          feedback: `⚠️ ${ans} = 2×${s} — you counted only two sides. A square has four equal sides.`,
          hintLead: `You got 2×${s}=${twoSide} — that covers just two sides. How many sides does a square have, and how does that change the formula?`,
          remedialLead: `You added only two sides. Perimeter = 4×side because a square has four equal sides. Multiply by 4, not 2.`,
        });
      }
      if (near(ans, areaVal, 0.5) && !near(ans, perim, 0.5)) {
        return pack({
          type: 'square_area_instead_of_perimeter',
          feedback: `⚠️ ${s}×${s} = ${areaVal} gives the space inside (area). This question asks for the boundary (perimeter).`,
          hintLead: `You squared the side — that gives area. For perimeter, think about all four equal sides of the square.`,
          remedialLead: `Squaring the side gives area. Perimeter is the total boundary — a square has four equal sides, so P = 4×side.`,
        });
      }
    }
  }

  // ── PERIMETER — Rectangle ─────────────────────────────────────────────────
  if (shape === 'rectangle' && topic === 'perimeter') {
    const d = extractRectangleDims(qtext);
    if (d) {
      const { l, b } = d;
      const perim = 2 * (l + b);
      const prod  = l * b;
      const halfP = l + b;

      if (near(ans, prod, 0.5) && !near(ans, perim, 0.5)) {
        return pack({
          type: 'rect_multiply_instead_of_perimeter',
          feedback: `⚠️ ${l}×${b} = ${prod} is area, not perimeter. For perimeter, think about the distance around all four sides.`,
          hintLead: `You computed ${l}×${b}=${prod} — that's the area formula. For perimeter, think about walking around all four sides of the rectangle.`,
          remedialLead: `length×breadth gives area. Perimeter = 2×(length+breadth) — the total boundary.`,
        });
      }
      if (near(ans, halfP, 0.5) && !near(ans, perim, 0.5)) {
        return pack({
          type: 'rect_sum_only_perimeter',
          feedback: `⚠️ ${l}+${b} = ${halfP} adds the sides once, but a rectangle has four sides.`,
          hintLead: `You got ${l}+${b}=${halfP} — that covers just one length and one breadth. A rectangle has four sides. What's the next step?`,
          remedialLead: `Perimeter is the whole boundary: you need both pairs of opposite sides — multiply (l+b) by 2.`,
        });
      }
    }
  }

  // ── PERIMETER — Circle ────────────────────────────────────────────────────
  if (shape === 'circle' && topic === 'perimeter') {
    const r = extractCircleRadius(qtext);
    if (r != null) {
      const circ  = 2 * PI * r;
      const piR   = PI * r;
      const areaN = PI * r * r;
      const twoR  = 2 * r;

      if (near(ans, piR, Math.abs(piR) * 0.05 + 0.5) && !near(ans, circ, 0.5)) {
        return pack({
          type: 'circle_forgot_multiply_by_2',
          feedback: `⚠️ You got π×r ≈ ${ans.toFixed(1)}, but circumference = 2πr — the factor of 2 is missing.`,
          hintLead: `Your answer looks like π×r. Look at the full formula C = 2πr — what factor did you leave out?`,
          remedialLead: `C = 2πr. You applied πr (missing the 2). The "2" accounts for going all the way around the circle.`,
        });
      }
      if (near(ans, areaN, Math.abs(areaN) * 0.05 + 0.5) && !near(ans, circ, 0.5)) {
        return pack({
          type: 'circle_area_for_circumference',
          feedback: `⚠️ Your answer matches π×r² — that's the area formula, not circumference. The question asks for the distance around.`,
          hintLead: `Your answer looks like π×r² (area). But this question asks for the distance around the circle — which formula gives that?`,
          remedialLead: `πr² gives the space inside (area). For the boundary (circumference), use 2πr. No squaring involved.`,
        });
      }
      if (near(ans, twoR, Math.abs(twoR) * 0.05 + 0.5) && !near(ans, circ, 0.5)) {
        return pack({
          type: 'forgot_pi_circumference',
          feedback: `⚠️ You got 2×r = ${twoR}, but circumference also needs π (≈ 22/7). C = 2πr — don't leave out π.`,
          hintLead: `You computed 2×${r}=${twoR} — that's 2r without π. Circumference = 2πr. What constant were you supposed to include?`,
          remedialLead: `C = 2πr. You got 2r — π (22/7) was not applied. Always include π when working with circles.`,
        });
      }
    }
  }

  // ── AREA — Square ─────────────────────────────────────────────────────────
  if (shape === 'square' && topic === 'area') {
    const s = extractSide(qtext);
    if (s != null) {
      const area  = s * s;
      const perim = 4 * s;

      if (near(ans, perim, 0.5) && !near(ans, area, 0.5)) {
        return pack({
          type: 'square_perimeter_instead_of_area',
          feedback: `⚠️ 4×${s} = ${perim} gives the boundary length (perimeter). This question wants the space the square covers.`,
          hintLead: `4×side gives the boundary length (perimeter). For area, think about how much space the square covers — what operation on the side gives that?`,
          remedialLead: `You used the perimeter formula. Area = side × side = s². Think: space inside, not boundary length.`,
        });
      }
    }
  }

  // ── AREA — Rectangle ─────────────────────────────────────────────────────
  if (shape === 'rectangle' && topic === 'area') {
    const d = extractRectangleDims(qtext);
    if (d) {
      const { l, b } = d;
      const area  = l * b;
      const perim = 2 * (l + b);

      if (near(ans, perim, 0.5) && !near(ans, area, 0.5)) {
        return pack({
          type: 'rect_perimeter_instead_of_area',
          feedback: `⚠️ Your answer matches 2×(${l}+${b}) — that's the perimeter formula. Area = length × breadth.`,
          hintLead: `You used 2×(${l}+${b}) — that's the perimeter formula. For area, think about what simpler operation on length and breadth gives the space inside.`,
          remedialLead: `2×(l+b) is perimeter. Area = l×b — just multiply the two dimensions directly.`,
        });
      }
    }
  }

  // ── AREA — Circle ─────────────────────────────────────────────────────────
  if (shape === 'circle' && topic === 'area') {
    const r = extractCircleRadius(qtext);
    if (r != null) {
      const area  = PI * r * r;
      const circ  = 2 * PI * r;
      const piR   = PI * r;
      const rSq   = r * r;
      const piD   = PI * 2 * r * 2 * r; // used diameter as radius

      if (near(ans, circ, Math.abs(circ) * 0.05 + 0.5) && !near(ans, area, 0.5)) {
        return pack({
          type: 'circle_circumference_for_area',
          feedback: `⚠️ Your answer matches 2πr (circumference). Area uses πr² — the radius needs to be squared.`,
          hintLead: `Your answer looks like 2πr (circumference). For area, the formula is πr² — what changes compared to circumference?`,
          remedialLead: `2πr is circumference (boundary). Area = πr² — the radius is squared. Different formula, different meaning.`,
        });
      }
      if (near(ans, piR, Math.abs(piR) * 0.05 + 0.5) && !near(ans, area, 0.5)) {
        return pack({
          type: 'circle_forgot_square_radius',
          feedback: `⚠️ You got π×r ≈ ${ans.toFixed(1)}, but area = π×r². The radius must be squared.`,
          hintLead: `You computed π×${r}≈${ans.toFixed(1)}. In the area formula πr², what should you do with r before multiplying by π?`,
          remedialLead: `Area = πr². You used πr — the radius must be multiplied by itself (r×r) first, then multiply by π.`,
        });
      }
      if (near(ans, rSq, Math.abs(rSq) * 0.05 + 0.5) && !near(ans, area, 0.5)) {
        return pack({
          type: 'forgot_pi_area',
          feedback: `⚠️ You got r² = ${rSq}, but area = π×r². Multiply by π (22/7) — don't leave it out.`,
          hintLead: `You squared the radius to get ${rSq}. The area formula is πr² — what constant were you supposed to multiply by?`,
          remedialLead: `Area = πr². You computed r² but forgot to multiply by π (22/7). Always include π in circle area calculations.`,
        });
      }
    }
  }

  // ── SURFACE AREA — Cube ───────────────────────────────────────────────────
  if (shape === 'cube' && topic === 'surface_area') {
    const a = extractSide(qtext);
    if (a != null) {
      const tsa      = 6 * a * a;
      const lsa      = 4 * a * a;
      const oneFace  = a * a;
      const twoFaces = 2 * a * a;
      const vol      = a * a * a;
      const linear   = 6 * a;

      if (near(ans, oneFace, Math.abs(oneFace) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cube_one_face_sa',
          feedback: `⚠️ a² = ${oneFace} is the area of just one face. A cube has 6 equal faces — multiply by 6.`,
          hintLead: `You computed ${a}×${a}=${oneFace} — that's just one face. How many faces does a cube have in total?`,
          remedialLead: `A cube has 6 identical square faces. You found the area of one face — now multiply by 6: TSA = 6a².`,
        });
      }
      if (near(ans, twoFaces, Math.abs(twoFaces) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cube_two_faces_sa',
          feedback: `⚠️ 2a² = ${twoFaces} covers only 2 faces (top + bottom). A cube has 6 equal faces.`,
          hintLead: `2×a² counts just 2 faces. A cube has top, bottom, and all four sides. How many faces total?`,
          remedialLead: `2a² counts only top+bottom. Total SA = 6a² — include all 6 equal square faces.`,
        });
      }
      if (near(ans, lsa, Math.abs(lsa) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cube_four_faces_sa',
          feedback: `⚠️ 4a² = ${lsa} is the lateral SA (4 side faces only). ${near(correct, tsa, 1) ? 'TSA also includes the top and bottom.' : 'Check whether the question asks for TSA or LSA.'}`,
          hintLead: `4a² gives the 4 side faces only (lateral SA). Does the question ask for Total SA or Lateral SA? How many faces are included in each?`,
          remedialLead: `LSA (lateral) = 4a² (4 side faces). TSA (total) = 6a² (all 6 faces). Re-read what the question is asking for.`,
        });
      }
      if (near(ans, vol, Math.abs(vol) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cube_volume_for_sa',
          feedback: `⚠️ a³ = ${vol} is volume (space inside), not surface area. SA = 6a².`,
          hintLead: `Your answer equals a³ (volume). This question asks about the outer covering. Which formula gives surface area for a cube?`,
          remedialLead: `a³ is volume. Surface area = 6a² — the outer covering of all 6 square faces.`,
        });
      }
      if (near(ans, linear, Math.abs(linear) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cube_linear_sa',
          feedback: `⚠️ 6×${a} = ${linear} — you multiplied 6 by the edge, but surface area uses 6×a² (edge squared).`,
          hintLead: `You computed 6×${a} without squaring. Surface area is measured in square units — what should you do with 'a' in TSA = 6a²?`,
          remedialLead: `TSA = 6×a×a = 6a². You computed 6a without squaring the edge. Each face area = a², not just a.`,
        });
      }
    }
  }

  // ── SURFACE AREA — Cuboid ─────────────────────────────────────────────────
  if (shape === 'cuboid' && topic === 'surface_area') {
    const dims = extractCuboidDims(qtext);
    if (dims && dims.l && dims.b && dims.h) {
      const { l, b, h } = dims;
      const tsa     = 2 * (l * b + b * h + l * h);
      const lsa     = 2 * h * (l + b);
      const halfTSA = l * b + b * h + l * h;
      const vol     = l * b * h;
      const onlyLB  = 2 * l * b;

      if (near(ans, halfTSA, Math.abs(halfTSA) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cuboid_no_factor_2_sa',
          feedback: `⚠️ lb+bh+lh = ${halfTSA} — that's only half the TSA. The formula has a factor of 2: TSA = 2(lb+bh+lh).`,
          hintLead: `Your answer ${ans} equals lb+bh+lh. A cuboid has 3 pairs of faces — how does that pair-count affect the formula?`,
          remedialLead: `lb+bh+lh counts each face pair once. But each pair appears twice (top+bottom, front+back, left+right), so multiply by 2: TSA = 2(lb+bh+lh).`,
        });
      }
      if (near(ans, vol, Math.abs(vol) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cuboid_volume_for_sa',
          feedback: `⚠️ l×b×h = ${vol} is volume (space inside), not surface area.`,
          hintLead: `Your answer looks like l×b×h (volume). Surface area measures the outer covering — how does TSA = 2(lb+bh+lh) differ from volume?`,
          remedialLead: `l×b×h is volume. Surface area = 2(lb+bh+lh) — it counts the area of all 6 faces.`,
        });
      }
      if (near(ans, onlyLB, Math.abs(onlyLB) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cuboid_partial_sa',
          feedback: `⚠️ 2×l×b = ${onlyLB} covers only the top and bottom faces. A cuboid has three pairs of faces.`,
          hintLead: `2×l×b gives only top and bottom. How many other pairs of faces does a cuboid have? What are their areas?`,
          remedialLead: `A cuboid has 3 pairs: top+bottom (2lb), front+back (2lh), left+right (2bh). You only included one pair.`,
        });
      }
    }
  }

  // ── SURFACE AREA — Cylinder ───────────────────────────────────────────────
  if (shape === 'cylinder' && topic === 'surface_area') {
    const dims = extractCylinderDims(qtext);
    if (dims) {
      const { r, h } = dims;
      const csa         = 2 * PI * r * h;
      const tsa         = 2 * PI * r * (r + h);
      const circlesOnly = 2 * PI * r * r;
      const vol         = PI * r * r * h;
      const piRH        = PI * r * h;   // CSA without the 2
      const piRSq       = PI * r * r;   // base area only

      if (near(ans, csa, Math.abs(csa) * 0.05 + 0.5) && !near(ans, correct, 0.5) && near(correct, tsa, Math.abs(tsa) * 0.1)) {
        return pack({
          type: 'cylinder_lateral_only_sa',
          feedback: `⚠️ 2πrh = ${ans.toFixed(1)} is the curved surface only. Total SA also needs the two circular bases.`,
          hintLead: `2πrh gives the curved wall area. But total SA includes the circles on top and bottom too. What area do those add?`,
          remedialLead: `CSA = 2πrh (curved wall). TSA = 2πr(r+h) = 2πrh + 2πr². The two circular bases (2πr²) were missed.`,
        });
      }
      if (near(ans, circlesOnly, Math.abs(circlesOnly) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cylinder_only_circles_sa',
          feedback: `⚠️ 2πr² = ${ans.toFixed(1)} is just the two circular bases. SA also needs the curved surface.`,
          hintLead: `2πr² gives the two circular ends only. But a cylinder also has a curved surface wrapping around it. What formula gives that?`,
          remedialLead: `2πr² covers only the top+bottom circles. TSA = 2πrh + 2πr² = 2πr(r+h). You're missing the curved part.`,
        });
      }
      if (near(ans, vol, Math.abs(vol) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cylinder_volume_for_sa',
          feedback: `⚠️ πr²h = ${ans.toFixed(1)} is volume. This question asks for surface area.`,
          hintLead: `πr²h gives the volume (space inside). This question asks for surface area (outer covering). Which formula is correct?`,
          remedialLead: `πr²h is volume. For surface area: CSA = 2πrh, TSA = 2πr(r+h) — depending on what's asked.`,
        });
      }
      if (near(ans, piRH, Math.abs(piRH) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cylinder_forgot_factor_2_csa',
          feedback: `⚠️ You got π×r×h ≈ ${ans.toFixed(1)}, but CSA = 2πrh — a factor of 2 is missing.`,
          hintLead: `Your answer equals πrh. The curved surface area is 2πrh — what factor is missing from your calculation?`,
          remedialLead: `CSA = 2πrh. You computed πrh without the 2. The "2" comes from the full circle of circumference (2πr) times the height.`,
        });
      }
    }
  }

  // ── VOLUME — Cube ─────────────────────────────────────────────────────────
  if (shape === 'cube' && topic === 'volume') {
    const a = extractSide(qtext);
    if (a != null) {
      const vol    = a * a * a;
      const tsa    = 6 * a * a;
      const lsa    = 4 * a * a;
      const aSquared = a * a;
      const linear = 6 * a;

      if (near(ans, tsa, Math.abs(tsa) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cube_sa_for_volume',
          feedback: `⚠️ 6a² = ${tsa} is surface area. Volume of a cube = a³ (edge cubed, not squared).`,
          hintLead: `Your answer matches 6a² (surface area). Volume and surface area are different — which one needs all three dimensions multiplied together?`,
          remedialLead: `6a² is surface area. Volume = a³ — multiply edge×edge×edge, not 6×edge².`,
        });
      }
      if (near(ans, lsa, Math.abs(lsa) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cube_sa_for_volume',
          feedback: `⚠️ 4a² = ${lsa} is lateral surface area. Volume = a³.`,
          hintLead: `Your answer matches 4a² (lateral SA). Volume needs all three dimensions multiplied together — how do you get a 3D measure from the edge?`,
          remedialLead: `4a² is lateral surface area. Volume = a³ — edge cubed.`,
        });
      }
      if (near(ans, aSquared, Math.abs(aSquared) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cube_squared_for_volume',
          feedback: `⚠️ a² = ${aSquared} is a 2D area (one face). Volume = a³ needs three dimensions.`,
          hintLead: `You squared the edge: ${a}²=${aSquared}. But volume is 3-dimensional. What do you need to do one more time?`,
          remedialLead: `a² gives the face area (2D). Volume = a³ — multiply by a one more time: a×a×a.`,
        });
      }
      if (near(ans, linear, Math.abs(linear) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cube_linear_for_volume',
          feedback: `⚠️ 6×${a} = ${linear} is linear, not volume. Volume = a³.`,
          hintLead: `6a=${linear} resembles a perimeter, not a volume. For volume, what operation on the edge gives a 3D measure?`,
          remedialLead: `Volume = a³. You computed 6a which is linear. Volume needs all three equal sides multiplied: a×a×a.`,
        });
      }
    }
  }

  // ── VOLUME — Cuboid ───────────────────────────────────────────────────────
  if (shape === 'cuboid' && topic === 'volume') {
    const dims = extractCuboidDims(qtext);
    if (dims && dims.l && dims.b && dims.h) {
      const { l, b, h } = dims;
      const vol      = l * b * h;
      const tsa      = 2 * (l * b + b * h + l * h);
      const lb       = l * b;
      const lh       = l * h;
      const bh       = b * h;
      const sumDims  = l + b + h;

      if (near(ans, lb, Math.abs(lb) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cuboid_forgot_height_volume',
          feedback: `⚠️ l×b = ${lb} is a flat base area. Volume = l×b×h — you need to include all three dimensions.`,
          hintLead: `You multiplied l×b=${lb} but stopped there. Volume fills a 3D space — what's the third dimension you're missing?`,
          remedialLead: `Volume = l×b×h. You computed l×b (base area only) and forgot to multiply by height h.`,
        });
      }
      if (near(ans, lh, Math.abs(lh) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cuboid_forgot_height_volume',
          feedback: `⚠️ l×h = ${lh} is missing the breadth dimension. Volume = l×b×h.`,
          hintLead: `You used two dimensions (l and h). Volume is 3D — which dimension are you missing from l×b×h?`,
          remedialLead: `Volume = l×b×h. You multiplied only two dimensions — include all three.`,
        });
      }
      if (near(ans, bh, Math.abs(bh) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cuboid_forgot_height_volume',
          feedback: `⚠️ b×h = ${bh} is missing the length dimension. Volume = l×b×h.`,
          hintLead: `You used two dimensions (b and h). Volume is 3D — which dimension are you missing from l×b×h?`,
          remedialLead: `Volume = l×b×h. You multiplied only two dimensions — include all three.`,
        });
      }
      if (near(ans, tsa, Math.abs(tsa) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cuboid_sa_for_volume',
          feedback: `⚠️ Your answer matches 2(lb+bh+lh) — that's the surface area formula. Volume = l×b×h.`,
          hintLead: `Your answer looks like the surface area formula 2(lb+bh+lh). This question asks for volume — which formula gives the space inside?`,
          remedialLead: `2(lb+bh+lh) is TSA. Volume = l×b×h — just multiply all three dimensions once.`,
        });
      }
      if (near(ans, sumDims, Math.abs(sumDims) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cuboid_added_dims_volume',
          feedback: `⚠️ l+b+h = ${sumDims} — you added the dimensions instead of multiplying them.`,
          hintLead: `l+b+h=${sumDims} is a sum, but volume uses all three dimensions differently. What operation combines l, b, and h to give a 3D measure?`,
          remedialLead: `Volume = l×b×h (multiply). You computed l+b+h (add). Volume fills space by multiplying all three dimensions.`,
        });
      }
    }
  }

  // ── VOLUME — Cylinder ─────────────────────────────────────────────────────
  if (shape === 'cylinder' && topic === 'volume') {
    const dims = extractCylinderDims(qtext);
    if (dims) {
      const { r, h } = dims;
      const vol      = PI * r * r * h;
      const baseArea = PI * r * r;
      const csa      = 2 * PI * r * h;
      const tsa      = 2 * PI * r * (r + h);
      const piRH     = PI * r * h;  // forgot to square r

      if (near(ans, baseArea, Math.abs(baseArea) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cylinder_forgot_height_volume',
          feedback: `⚠️ πr² = ${ans.toFixed(1)} is the base circle area. Volume = πr²h — multiply by height h.`,
          hintLead: `πr² gives the circular base area. But volume fills the entire height of the cylinder. What factor completes the volume formula?`,
          remedialLead: `V = πr²h. You computed πr² (base area only) and forgot to multiply by height h.`,
        });
      }
      if (near(ans, csa, Math.abs(csa) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cylinder_csa_for_volume',
          feedback: `⚠️ 2πrh = ${ans.toFixed(1)} is the curved surface area. Volume = πr²h.`,
          hintLead: `2πrh is the surface area formula. For volume, think about filling the cylinder — which formula gives the space inside?`,
          remedialLead: `2πrh = CSA (surface). Volume = πr²h — base area (πr²) × height.`,
        });
      }
      if (near(ans, tsa, Math.abs(tsa) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cylinder_tsa_for_volume',
          feedback: `⚠️ 2πr(r+h) = ${ans.toFixed(1)} is the total surface area. Volume = πr²h.`,
          hintLead: `2πr(r+h) is the total surface area. This question asks for volume — the space inside, not the outer covering.`,
          remedialLead: `TSA = 2πr(r+h). Volume = πr²h. They're very different — volume = base area × height.`,
        });
      }
      if (near(ans, piRH, Math.abs(piRH) * 0.05 + 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'cylinder_forgot_square_r',
          feedback: `⚠️ You got π×r×h ≈ ${ans.toFixed(1)}, but volume = π×r²×h — the radius must be squared first.`,
          hintLead: `You used π×r×h without squaring r. In V = πr²h, what does the ² tell you to do with r before multiplying by h?`,
          remedialLead: `V = πr²h. You computed πrh — the radius must be squared (r×r) before multiplying by π and h.`,
        });
      }
    }
  }

  // ── REVERSE-FIND — Square (given perimeter, find side) ───────────────────
  if ((qType === 'reverse_find' || qType === 'fill_in_blank') &&
      shape === 'square' && topic === 'perimeter') {
    const nums = findNumbersInQuestion(qtext);
    // Try to find the given perimeter — it will be the number that equals correct*4
    let givenPerim = null;
    for (const n of nums) {
      if (near(n, correct * 4, Math.abs(correct) * 0.1 + 0.5)) { givenPerim = n; break; }
    }
    if (givenPerim != null) {
      if (near(ans, givenPerim, 0.5)) {
        return pack({
          type: 'reverse_gave_perimeter',
          feedback: `⚠️ You wrote ${ans} — that's the perimeter the question already gave you. You need to find the side length.`,
          hintLead: `${ans} is the perimeter, which the question already told you. The question asks for the side — how do you get from perimeter back to one side?`,
          remedialLead: `The perimeter is given (${givenPerim}). To find the side: side = perimeter ÷ 4, because a square has 4 equal sides.`,
        });
      }
      if (near(ans, givenPerim / 2, 0.5)) {
        return pack({
          type: 'reverse_square_half',
          feedback: `⚠️ You divided the perimeter by 2 — but a square has 4 sides, not 2. Try dividing by 4.`,
          hintLead: `You got ${ans}, which is ${givenPerim} ÷ 2. A square has four equal sides. What should you divide by to find one side?`,
          remedialLead: `Perimeter of a square = 4 × side. So side = perimeter ÷ 4, not ÷ 2. A square has 4 sides.`,
        });
      }
      if (near(ans, givenPerim * 4, Math.abs(givenPerim) * 0.1 + 0.5)) {
        return pack({
          type: 'reverse_multiplied',
          feedback: `⚠️ You multiplied instead of dividing — you applied the formula forwards. To find the side, divide the perimeter by 4.`,
          hintLead: `You got ${ans} by multiplying. But the question gives you the perimeter — you need to work backwards. How do you undo "× 4"?`,
          remedialLead: `P = 4 × side means side = P ÷ 4. You applied the formula in the wrong direction — divide, don't multiply.`,
        });
      }
    }
  }

  // ── REVERSE-FIND — Square (given area, find side) ─────────────────────────
  if ((qType === 'reverse_find' || qType === 'fill_in_blank') &&
      shape === 'square' && topic === 'area') {
    const nums = findNumbersInQuestion(qtext);
    let givenArea = null;
    for (const n of nums) {
      if (near(n, correct * correct, Math.abs(correct) * 0.15 + 0.5)) { givenArea = n; break; }
    }
    if (givenArea != null) {
      if (near(ans, givenArea, 0.5)) {
        return pack({
          type: 'reverse_gave_area',
          feedback: `⚠️ You wrote ${ans} — that's the area the question already gave you. You need to find the side length.`,
          hintLead: `${ans} is the area that was given. The question asks for the side — what operation reverses squaring?`,
          remedialLead: `Area = side². So side = √area. You need the square root of ${givenArea}, not the area itself.`,
        });
      }
      if (near(ans, givenArea / 4, Math.abs(givenArea) * 0.1 + 0.5)) {
        return pack({
          type: 'reverse_square_divided',
          feedback: `⚠️ You divided the area by 4, but that's not how you reverse squaring. To find the side, take the square root.`,
          hintLead: `You divided by 4 — but area = side². To undo squaring, you need a different operation. What is the inverse of squaring?`,
          remedialLead: `Area = s². To find s: take the square root of the area (√area). Dividing by 4 would give the wrong answer.`,
        });
      }
    }
  }

  // ── REVERSE-FIND — Rectangle (given perimeter, find missing side) ─────────
  if ((qType === 'reverse_find' || qType === 'fill_in_blank') &&
      shape === 'rectangle' && topic === 'perimeter') {
    const nums = findNumbersInQuestion(qtext);
    // Find which number, when paired with correct, gives a matching perimeter
    for (const knownSide of nums) {
      if (near(knownSide, correct, 0.5)) continue; // skip the answer itself
      const expectedPerim = 2 * (knownSide + correct);
      let givenPerim = null;
      for (const n of nums) {
        if (near(n, expectedPerim, Math.abs(expectedPerim) * 0.1 + 0.5) && !near(n, knownSide, 0.5)) {
          givenPerim = n; break;
        }
      }
      if (givenPerim != null) {
        const halfPerim = givenPerim / 2;
        if (near(ans, halfPerim, 0.5)) {
          return pack({
            type: 'reverse_rect_forgot_subtract',
            feedback: `⚠️ You halved the perimeter to get ${halfPerim}, but forgot to subtract the known side (${knownSide}) to isolate the missing side.`,
            hintLead: `Good start — you found P ÷ 2 = ${halfPerim}. That equals (length + breadth). The question gives one side as ${knownSide}. What's the next step?`,
            remedialLead: `P ÷ 2 = l + b = ${halfPerim}. You know one side is ${knownSide}. So missing side = ${halfPerim} − ${knownSide} = ${halfPerim - knownSide}.`,
          });
        }
        if (near(ans, givenPerim, 0.5)) {
          return pack({
            type: 'reverse_gave_input',
            feedback: `⚠️ You wrote ${ans} — that's the perimeter the question gave you. Work backwards to find the missing side.`,
            hintLead: `${ans} is already in the question as the perimeter. You need to find the missing side — how do you use P = 2(l + b) in reverse?`,
            remedialLead: `Rearrange P = 2(l + b): first find l + b = P ÷ 2, then subtract the known side.`,
          });
        }
        break;
      }
    }
  }

  // ── REVERSE-FIND — general: student echoed a given value ──────────────────
  if (qType === 'reverse_find' || qType === 'fill_in_blank') {
    const nums = findNumbersInQuestion(qtext);
    for (const n of nums) {
      if (near(ans, n, 0.5) && !near(ans, correct, 0.5)) {
        return pack({
          type: 'reverse_gave_input',
          feedback: `⚠️ You wrote ${ans}, which matches a value already given in the question. You need to calculate the unknown.`,
          hintLead: `${ans} is a number that appears in the question itself. The question asks you to find something — use the given values to work it out.`,
          remedialLead: `Don't copy a given value — set up the formula, substitute the known values, then solve for the unknown.`,
        });
      }
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  GENERAL FALLBACK DETECTORS (apply when specific ones didn't fire)
  // ══════════════════════════════════════════════════════════════════════════

  // General operation confusion (rectangle/2-number cases)
  const opErr = inferOperationConfusion(ans, correct, qtext);
  if (opErr) return opErr;

  // Radius / Diameter confusion for circle & cylinder
  if (shape === 'circle' || shape === 'cylinder') {
    if (correct !== 0 && near(ans, correct * 2, Math.abs(correct) * 0.08)) {
      return pack({
        type: 'radius_diameter_confusion',
        feedback: '⚠️ Radius vs Diameter! Your answer is about twice the expected value — check whether you used the radius or diameter.',
        hintLead: 'Your answer is roughly double the expected value. Did you use the full diameter where radius (r = d ÷ 2) was needed?',
        remedialLead: 'Diameter = 2 × radius. If the question gives diameter, divide by 2 to get r before using the formula.',
      });
    }
    if (correct !== 0 && near(ans, correct * 0.5, Math.abs(correct) * 0.08)) {
      return pack({
        type: 'radius_diameter_confusion',
        feedback: '⚠️ Radius vs Diameter! Your answer is about half the expected value — check whether you swapped radius and diameter.',
        hintLead: 'Your answer is roughly half the expected value. Did you use the radius where the diameter was needed (or vice versa)?',
        remedialLead: 'radius = diameter ÷ 2. Make sure you use the correct one in the formula.',
      });
    }
  }

  // Formula swap (2D: perimeter ↔ area for square/rectangle)
  if (topic === 'perimeter') {
    const swapped = getSwappedAreaAnswer(shape, question);
    for (const a of swapped) {
      if (a && near(ans, a, Math.abs(a) * TOL_RATIO)) {
        return pack({
          type: 'formula_swap',
          feedback: '⚠️ Formula mix-up! You calculated the space inside instead of the boundary.',
          hintLead: 'Your answer matches the area formula, not perimeter. Apply the perimeter formula step by step.',
          remedialLead: 'Compare perimeter vs area for this shape — your answer fits the area idea.',
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
          feedback: '⚠️ Formula mix-up! You calculated the boundary instead of the space inside.',
          hintLead: 'Your answer matches the perimeter formula, not area. Apply the area formula step by step.',
          remedialLead: 'You applied a boundary-length idea; this question needs the inside space (area).',
        });
      }
    }
  }

  // SA ↔ Volume general confusion
  if ((topic === 'surface_area' || topic === 'volume') &&
      correct !== 0 && Math.abs(ans - correct) > Math.abs(correct) * 0.5) {
    return pack({
      type: 'sa_volume_confusion',
      feedback: '⚠️ Did you mix up Surface Area and Volume formulas? Re-read what the question is asking for.',
      hintLead: 'Re-read the question — does it ask for the outer covering (surface area) or the space inside (volume)? They use very different formulas.',
      remedialLead: 'Surface area and volume use different formulas for the same solid. Identify what the question asks first.',
    });
  }

  // Unit / place-value error
  if (correct !== 0 &&
      (near(ans, correct * 100, Math.abs(correct) * 5) ||
       near(ans, correct / 100, Math.abs(correct) * 0.05))) {
    return pack({
      type: 'unit_error',
      feedback: '⚠️ Unit conversion error! Check your units — are you mixing cm and m? 1 m = 100 cm, 1 m² = 10,000 cm².',
      hintLead: 'The error is ×100 or ÷100 — classic sign of mixing cm and m (or cm² and m²). Convert all lengths to the same unit before calculating.',
      remedialLead: '1 m = 100 cm; 1 m² = 10,000 cm². Convert everything to one unit before substituting into the formula.',
    });
  }

  // Arithmetic slip (right approach, small error)
  if (correct !== 0 && Math.abs(ans - correct) < Math.abs(correct) * 0.4) {
    return pack({
      type: 'arithmetic_mistake',
      feedback: '⚠️ You seem to have the right idea but made a calculation error. Re-check your arithmetic step by step.',
      hintLead: 'Your approach seems right but there is a small calculation slip. Try redoing each step carefully and double-check your arithmetic.',
      remedialLead: 'The right formula is probably in reach; a small arithmetic slip changed the final value. Redo one step at a time.',
    });
  }

  // Partial formula (answer too small)
  if (ans > 0 && correct !== 0 && ans < Math.abs(correct) * 0.75) {
    return pack({
      type: 'partial_formula',
      feedback: `⚠️ Partial formula! Your answer is smaller than expected — did you apply the complete formula? Formula: ${formula}`,
      hintLead: `Your answer is lower than expected. Make sure you completed every part of the formula: ${formula}. Did you miss a step or factor?`,
      remedialLead: `You may have stopped halfway through the formula or left out a factor. Write out ${formula} fully and substitute every symbol.`,
    });
  }

  // Final fallback
  return pack({
    type: 'wrong_answer',
    feedback: `❌ Incorrect. The formula to use is: ${formula}. Review the concept and try again.`,
    hintLead: `Try working through ${formula} step by step using the values from the question. Write down each step to spot where things go differently.`,
    remedialLead: `Your answer doesn't match the expected result. Review ${formula} with the numbers given in the question.`,
  });
};

// ── Answer checker ────────────────────────────────────────────────────────────

const checkAnswer = (studentAnswer, correctAnswer, question) => {
  const qType = question?.type || 'direct_calculation';

  if (qType === 'mcq') {
    return String(studentAnswer).toUpperCase().trim() ===
           String(question.correct_option || '').toUpperCase().trim();
  }
  if (qType === 'true_false') {
    return String(studentAnswer).toLowerCase().trim() ===
           String(question.correct_verdict || '').toLowerCase().trim();
  }

  const ans     = parseFloat(studentAnswer);
  const correct = parseFloat(correctAnswer);
  if (Number.isNaN(ans) || Number.isNaN(correct)) return false;
  const tolerance = Math.max(Math.abs(correct) * 0.02, 0.5);
  return Math.abs(ans - correct) <= tolerance;
};

module.exports = { detectError, checkAnswer, formatStudentAnswerForUi };
