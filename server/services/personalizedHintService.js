/**
 * Personalized Hint Service — 3-level Socratic hints for every error type.
 *
 * Rules:
 *  • Level 1 — very subtle nudge, ask a question, never reveal the answer
 *  • Level 2 — more specific, name the problematic step or formula part
 *  • Level 3 — near-direct: identify the exact mistake, stop before giving the answer
 *
 * All hints address the student directly ("you") and reference their actual answer (sn).
 */

const { formatStudentAnswerForUi } = require('./errorDetectionService');

function snippetOf(studentAnswer, unit) {
  return formatStudentAnswerForUi(studentAnswer, unit) || 'your answer';
}

/**
 * Build a personalized hint for a wrong answer.
 *
 * @param {object}       question      - Full question doc from the question bank
 * @param {object|null}  errorInfo     - Output of detectError()
 * @param {string|number} studentAnswer
 * @param {number}       level         - 1, 2, or 3
 * @returns {string}  Hint text (plain, no markdown)
 */
function buildPersonalizedHint(question, errorInfo, studentAnswer, level) {
  const L     = Math.min(Math.max(parseInt(level, 10) || 1, 1), 3);
  const sn    = snippetOf(studentAnswer, question.unit);
  const f     = question.formula || 'the correct formula';
  const type  = errorInfo?.type || 'wrong_answer';
  const topic = String(question.topic || '').replace(/_/g, ' ');
  const shape = question.shape || 'shape';

  const pick = (a, b, c) => [a, b, c][L - 1];

  switch (type) {

    // ── PERIMETER — Square ──────────────────────────────────────────────────

    case 'square_two_sides_perimeter':
      return pick(
        `You got ${sn}. Think about how many sides a square has and whether your formula counted all of them.`,
        `Your answer equals 2 × side. A square has four sides, not two — how does that change the formula?`,
        `You multiplied 2 × side, giving only two sides. Perimeter of a square = 4 × side because all four sides are equal.`
      );

    case 'square_area_instead_of_perimeter':
      return pick(
        `You got ${sn}. The question asks for the boundary around the square — is the formula you used measuring the boundary or the space inside?`,
        `You squared the side — that gives area (inside space). For perimeter, think about adding all four equal sides, not squaring them.`,
        `side² gives area (inside). For perimeter, use P = 4 × side — four sides, each equal to the side length.`
      );

    // ── PERIMETER — Rectangle ───────────────────────────────────────────────

    case 'rect_multiply_instead_of_perimeter':
      return pick(
        `You got ${sn}. You multiplied length and breadth — but does multiplying give the boundary or the inside space?`,
        `Multiplying length × breadth gives the area (space inside). Perimeter is the total boundary — think about walking around all four sides.`,
        `l × b gives area. For perimeter, add all four sides: P = 2 × (l + b), since a rectangle has two lengths and two breadths.`
      );

    case 'rect_sum_only_perimeter':
      return pick(
        `You got ${sn}. You added the two given measurements once — does a rectangle have just two sides?`,
        `l + b gives you two sides (one length + one breadth). A rectangle also has the opposite two sides. What's the next step?`,
        `l + b is half the perimeter. You need to account for the other pair of sides: P = 2 × (l + b), not just (l + b).`
      );

    case 'rect_perimeter_instead_of_area':
      return pick(
        `You got ${sn}. The question asks for the space inside the rectangle — did you use the boundary formula or the inside formula?`,
        `You used 2 × (l + b) — that gives the perimeter (boundary). Area is the space inside the rectangle. What simpler operation on l and b gives that?`,
        `2 × (l + b) is perimeter. For area, just multiply: A = l × b. One simple product, no doubling.`
      );

    case 'perimeter_instead_of_area_rect':
      return pick(
        `You got ${sn}. Re-read the question — does it ask for the space inside or the distance around?`,
        `Your answer matches the perimeter formula. But area = space inside = l × b. Which one does the question ask for?`,
        `2(l + b) is perimeter; l × b is area. You applied the perimeter idea. Use l × b for the space inside.`
      );

    // ── PERIMETER — Circle ──────────────────────────────────────────────────

    case 'circle_forgot_multiply_by_2':
      return pick(
        `You got ${sn}. Look at the circumference formula — does it have a coefficient at the very front that you may have missed?`,
        `The circumference formula is C = 2πr. Check each part: 2, π, and r. Which one is missing from your calculation?`,
        `You computed πr, but C = 2πr. The "2" means you go around the complete circle — both "halves" of the boundary.`
      );

    case 'circle_area_for_circumference':
      return pick(
        `You got ${sn}. This question asks for the distance around the circle — which formula gives the boundary, not the inside space?`,
        `The formula you used involves r² — that's typically the area formula. Re-read the question: does it ask for "around" (circumference) or "inside" (area)?`,
        `πr² gives the space inside (area). For the distance around (circumference), use C = 2πr — no squaring of r.`
      );

    case 'forgot_pi_circumference':
      return pick(
        `You got ${sn}. The circumference formula involves a special constant related to circles — did you include it?`,
        `You computed 2 × r, but circumference = 2πr. What constant that involves circles did you forget to multiply by?`,
        `C = 2πr. You got 2r — π (= 22/7) was left out. Always multiply by π when working with circles.`
      );

    // ── AREA — Square ───────────────────────────────────────────────────────

    case 'square_perimeter_instead_of_area':
      return pick(
        `You got ${sn}. The question asks for the space inside the square, not the boundary — which formula gives that?`,
        `4 × side gives the boundary (perimeter). For area (inside space), think about what you do with the side to get a 2D measure.`,
        `4 × side is perimeter. Area = side × side = side² — multiply the side by itself to get the space inside.`
      );

    // ── AREA — Rectangle ───────────────────────────────────────────────────

    case 'area_instead_of_perimeter_rect':
      return pick(
        `You got ${sn}. Re-read the question — does it ask for the space inside (area) or the distance around (perimeter)?`,
        `l × b gives the space inside (area). This question asks for the boundary around the rectangle — which formula uses both l and b in a different way?`,
        `l × b is area; 2(l+b) is perimeter. You used the area formula — apply the perimeter formula instead.`
      );

    // ── AREA — Circle ───────────────────────────────────────────────────────

    case 'circle_circumference_for_area':
      return pick(
        `You got ${sn}. This question asks for the space inside the circle (area) — which formula gives that?`,
        `Your answer matches 2πr (circumference). For area, the formula is πr² — notice how it differs from circumference.`,
        `2πr is circumference (boundary). Area = πr² — the radius is squared. Use πr², not 2πr.`
      );

    case 'circle_forgot_square_radius':
      return pick(
        `You got ${sn}. In the area formula, what operation should you do with the radius before multiplying by π?`,
        `You computed π × r, but the formula is π × r². What does the "squared" (²) tell you to do with r first?`,
        `Area = πr². You used πr without squaring. Multiply r by itself first (r × r), then multiply by π.`
      );

    case 'forgot_pi_area':
      return pick(
        `You got ${sn}. You squared the radius correctly — but the area formula has an extra constant for circles. Did you include it?`,
        `You computed r² but the formula for circle area is πr². What constant is supposed to be multiplied with r²?`,
        `Area = πr². You computed r² but forgot to multiply by π (= 22/7). Always include π in all circle calculations.`
      );

    // ── SURFACE AREA — Cube ─────────────────────────────────────────────────

    case 'cube_one_face_sa':
      return pick(
        `You got ${sn}. You found the area of one face — but how many faces does a cube have in total?`,
        `a² gives one face area. A cube has 6 identical square faces. How should that change your calculation?`,
        `You computed a² (one face). Total SA = 6a² — multiply by 6 since all six faces are identical.`
      );

    case 'cube_two_faces_sa':
      return pick(
        `You got ${sn}. You may have counted only two faces — top and bottom. How many faces does a cube have?`,
        `2a² counts top and bottom only. A cube has four more side faces. How does including all faces change the total?`,
        `2a² counts 2 faces. Total SA = 6a² — include all 6 equal square faces (top, bottom, and all four sides).`
      );

    case 'cube_four_faces_sa':
      return pick(
        `You got ${sn}. You included four faces — but does the question ask for total SA or just the lateral SA?`,
        `4a² is the lateral surface area (4 side faces only). If the question asks for total SA, you also need to include the top and bottom faces.`,
        `LSA = 4a² (4 sides). TSA = 6a² (all 6 faces). Re-read the question — does it ask for lateral or total surface area?`
      );

    case 'cube_volume_for_sa':
      return pick(
        `You got ${sn}. The question asks about the outer covering of the cube — is that the same as the space inside?`,
        `Your answer matches a³ (volume — space inside). Surface area is about the outer covering. Which formula uses a²?`,
        `a³ is volume. Surface area = 6a² — multiply the face area (a²) by the number of faces (6).`
      );

    case 'cube_linear_sa':
      return pick(
        `You got ${sn}. You multiplied 6 by the edge length — but surface area is measured in square units. What should you do with the edge first?`,
        `6 × edge gives a linear measure. Surface area uses the area of each face — how do you find the area of a square face?`,
        `TSA = 6 × a × a = 6a². You computed 6a without squaring. Each face area = a², not just a.`
      );

    // ── SURFACE AREA — Cuboid ───────────────────────────────────────────────

    case 'cuboid_no_factor_2_sa':
      return pick(
        `You got ${sn}. You added the areas of three face types — but does the full formula have a factor you may have forgotten?`,
        `lb + bh + lh accounts for one face from each pair. A cuboid has 3 pairs of faces (top+bottom, front+back, left+right). How does that affect the formula?`,
        `lb + bh + lh counts one face per pair. Since each pair has 2 identical faces, multiply by 2: TSA = 2(lb + bh + lh).`
      );

    case 'cuboid_volume_for_sa':
      return pick(
        `You got ${sn}. The question asks for the outer covering of the cuboid — is multiplying l, b, and h directly the formula for that?`,
        `l × b × h gives volume (space inside). Surface area measures the outer covering — that uses a different formula. Can you recall it?`,
        `l × b × h is volume. Surface area = 2(lb + bh + lh) — add the areas of all three face pairs and multiply by 2.`
      );

    case 'cuboid_partial_sa':
      return pick(
        `You got ${sn}. You found the area of the top and bottom faces — how many other pairs of faces does a cuboid have?`,
        `2 × l × b covers the top and bottom. A cuboid has three pairs of faces. Which two other pairs are you missing?`,
        `A cuboid has 3 face pairs: top+bottom (2lb), front+back (2lh), left+right (2bh). Add all three pairs: TSA = 2(lb + bh + lh).`
      );

    // ── SURFACE AREA — Cylinder ─────────────────────────────────────────────

    case 'cylinder_lateral_only_sa':
      return pick(
        `You got ${sn}. You found the curved surface area — but does the total SA of a closed cylinder have any other parts?`,
        `2πrh gives the curved (lateral) surface only. A closed cylinder also has a circular face on the top and one on the bottom. What area do they add?`,
        `CSA = 2πrh (curved wall). TSA = 2πrh + 2πr² = 2πr(r + h). You missed the two circular bases (2πr²).`
      );

    case 'cylinder_only_circles_sa':
      return pick(
        `You got ${sn}. You found the area of the two circular ends — but what about the curved surface that wraps around the cylinder?`,
        `2πr² covers the two circular faces (top + bottom). A cylinder also has a curved surface. Which formula gives that part?`,
        `2πr² = two circles only. TSA = 2πrh + 2πr² = 2πr(r + h). The curved surface area 2πrh was missing.`
      );

    case 'cylinder_volume_for_sa':
      return pick(
        `You got ${sn}. The question asks for the outer covering (surface area) — is that the same as the space inside?`,
        `πr²h gives volume (space inside the cylinder). Surface area measures the outer covering — a completely different formula. Which one is correct?`,
        `πr²h is volume. For surface area: CSA = 2πrh, or TSA = 2πr(r + h). Re-read what the question asks for.`
      );

    case 'cylinder_forgot_factor_2_csa':
      return pick(
        `You got ${sn}. The curved surface area formula has a coefficient at the front — did you include it?`,
        `You computed π × r × h, but CSA = 2πrh. What factor at the front of the formula is missing?`,
        `CSA = 2πrh. You got πrh without the 2. The "2" comes from the full circumference (2πr) being "unrolled" times the height.`
      );

    // ── VOLUME — Cube ───────────────────────────────────────────────────────

    case 'cube_sa_for_volume':
      return pick(
        `You got ${sn}. The question asks for the space inside the cube — is the formula you used for the outer covering or the inside space?`,
        `Your answer matches the surface area formula (6a²). Volume is 3-dimensional — it uses all three dimensions differently. Which formula gives the space inside?`,
        `6a² is surface area. Volume = a³ — multiply edge × edge × edge. Volume is about space inside, not the outer covering.`
      );

    case 'cube_squared_for_volume':
      return pick(
        `You got ${sn}. You squared the edge — but volume is 3-dimensional, not 2-dimensional. What else is needed?`,
        `a² gives a flat area (2D). Volume fills 3D space. If you have a², what one more multiplication would make it 3-dimensional?`,
        `a² is 2D (face area). Volume = a³ = a × a × a — you need to multiply by a one more time to get the 3D measure.`
      );

    case 'cube_linear_for_volume':
      return pick(
        `You got ${sn}. That answer looks like a linear measure, not a volume. What does volume measure, and which formula captures that?`,
        `6a is a linear expression. Volume measures 3D space — how do you combine the edge length with itself to get a 3D measure?`,
        `Volume = a³ = a × a × a. You computed 6a (linear). Volume needs the edge multiplied by itself three times.`
      );

    // ── VOLUME — Cuboid ─────────────────────────────────────────────────────

    case 'cuboid_forgot_height_volume':
      return pick(
        `You got ${sn}. You multiplied two of the three dimensions — but volume is 3-dimensional. Which dimension is missing?`,
        `You used two dimensions from l, b, h. Volume = l × b × h requires all three. Which one did you leave out?`,
        `Volume = l × b × h. You multiplied only two dimensions — include all three. Volume fills 3D space, so all three measurements matter.`
      );

    case 'cuboid_sa_for_volume':
      return pick(
        `You got ${sn}. The question asks for the space inside the cuboid — did you use the surface area formula instead?`,
        `Your answer matches 2(lb + bh + lh) — that's the total surface area. Volume is the space inside. Which formula gives that?`,
        `2(lb + bh + lh) is TSA (surface). Volume = l × b × h — just multiply all three dimensions once. Much simpler.`
      );

    case 'cuboid_added_dims_volume':
      return pick(
        `You got ${sn}. You added the three dimensions — but does adding give a 3-dimensional volume measure?`,
        `l + b + h is a sum. Volume needs all three dimensions combined in a different way to give a 3D quantity. What operation is that?`,
        `Volume = l × b × h (multiplication). You computed l + b + h (addition). Multiply all three to get the space inside.`
      );

    // ── VOLUME — Cylinder ───────────────────────────────────────────────────

    case 'cylinder_forgot_height_volume':
      return pick(
        `You got ${sn}. You found the base circle area — but a cylinder has height too. What does the height contribute to volume?`,
        `πr² gives the circular base area (2D). Volume fills the whole cylinder from base to top — what factor adds the third dimension?`,
        `V = πr²h. You computed πr² (base area only) and forgot to multiply by height h. Volume = base area × height.`
      );

    case 'cylinder_csa_for_volume':
      return pick(
        `You got ${sn}. You may have used the surface area formula — but the question asks for the space inside the cylinder.`,
        `2πrh is the curved surface area formula. Volume is about filling the inside — which formula uses πr² and height?`,
        `2πrh = CSA (surface). Volume = πr²h — base area (πr²) multiplied by height h.`
      );

    case 'cylinder_tsa_for_volume':
      return pick(
        `You got ${sn}. You found the total surface area — but the question asks for the space inside (volume).`,
        `2πr(r + h) is the total surface area formula. Volume is completely different — it measures how much the cylinder can hold, not its outer covering.`,
        `TSA = 2πr(r + h). Volume = πr²h. They measure different things. Volume = base area × height — use πr²h.`
      );

    case 'cylinder_forgot_square_r':
      return pick(
        `You got ${sn}. In the volume formula for a cylinder, what operation should you apply to the radius before multiplying by height?`,
        `You used π × r × h, but V = πr²h. The radius appears squared — what does that mean you should do with r first?`,
        `V = πr²h. You computed πrh without squaring r. Multiply r × r first, then multiply by π and h.`
      );

    // ── OPERATION CONFUSION ─────────────────────────────────────────────────

    case 'multiply_instead_of_add':
      return pick(
        `You got ${sn}. Think about what operation the formula actually calls for at that step — should you be adding or multiplying?`,
        `Mistake pattern: you multiplied two numbers that should be added first. Re-read the formula — does it say to add two lengths (or terms) before anything else?`,
        `Write the addition step first (a + b), then continue with the rest of the formula (e.g., doubling, or multiplying by π).`
      );

    case 'add_instead_of_multiply':
      return pick(
        `You got ${sn}. Check the formula — should those two numbers be added or multiplied at that step?`,
        `You used addition where the formula needs multiplication. Compare your steps to ${f} — which operation connects those two values?`,
        `Identify which two quantities must be multiplied (not summed) — then multiply them exactly as the formula shows.`
      );

    case 'area_instead_of_perimeter_rect':
      return pick(
        `You got ${sn}. You multiplied length and breadth — does that give the boundary or the space inside?`,
        `l × b gives the space inside (area). This question is about the boundary around the rectangle. How do you find the total distance around?`,
        `Perimeter = 2(l + b): walk around all four sides. Area = l × b: the inside space. You did the area operation — switch to the perimeter formula.`
      );

    case 'perimeter_instead_of_area_rect':
      return pick(
        `You got ${sn}. Re-read the last line of the question — does it ask for "around" (perimeter) or "inside" (area)?`,
        `You used the perimeter approach. But area is the space inside — what simpler operation on length and breadth gives that?`,
        `2(l + b) is perimeter; l × b is area. You used the perimeter path — use the single product of length and breadth for area.`
      );

    // ── RADIUS / DIAMETER ───────────────────────────────────────────────────

    case 'radius_diameter_confusion': {
      const fb = String(errorInfo?.feedback || '');
      const looksDouble = /twice|double|2\s*×/i.test(fb) || /too large/i.test(fb) || ans > parseFloat(question.answer) * 1.5;
      return pick(
        looksDouble
          ? `You got ${sn}, which is larger than expected. Did you use the radius and diameter interchangeably? Check which one the question gives you.`
          : `You got ${sn}, which is smaller than expected. Check: the question mentions "radius" or "diameter" — are you using the right one in ${f}?`,
        `Radius (r) = half the diameter. Diameter (d) = 2 × radius. If the question gives diameter, convert: r = d ÷ 2 before using ${f}.`,
        `Use either r or d consistently — convert once if needed, then plug into ${f} without mixing both in the same step.`
      );
    }

    // ── FORMULA SWAP ────────────────────────────────────────────────────────

    case 'formula_swap':
      return pick(
        `You got ${sn}. Re-read the question's last line — does it ask for "around/boundary", "inside/space", "surface", or "volume"?`,
        `You applied the wrong formula family for this question type. Compare ${f} with the other common formula for this shape and choose the one that matches the question.`,
        `Name what you need: perimeter = boundary; area = inside; surface area = all faces; volume = space filled. Then use only the matching formula.`
      );

    // ── SA / VOLUME CONFUSION ───────────────────────────────────────────────

    case 'sa_volume_confusion':
      return pick(
        `You got ${sn}. Re-read the question — does it ask for the outer covering (surface area) or the space inside (volume)?`,
        `Surface area and volume use completely different formulas for the same solid. Identify what the question asks, then choose the matching formula.`,
        `Surface area = total area of all faces. Volume = how much space the solid holds. They are different — confirm which one is asked and use only that formula.`
      );

    // ── UNIT ERROR ──────────────────────────────────────────────────────────

    case 'unit_error':
      return pick(
        `You got ${sn}. The size of the error suggests a unit conversion issue — are all your measurements in the same unit?`,
        `Check: 1 m = 100 cm and 1 m² = 10,000 cm². Make sure all lengths are in the same unit before you substitute into ${f}.`,
        `Convert every measurement to one unit first. Then substitute into ${f} and calculate. Don't mix cm and m in the same problem.`
      );

    // ── ARITHMETIC ──────────────────────────────────────────────────────────

    case 'arithmetic_mistake':
      return pick(
        `You got ${sn}. Your approach seems right, but the final value is off — try recalculating each step slowly on paper.`,
        `Trace each operation in order. Common slips: order of operations, fraction arithmetic (especially with 22/7), or squaring.`,
        `Write ${f}, substitute every value, then evaluate one operation at a time — check each intermediate result before moving on.`
      );

    // ── PARTIAL FORMULA ─────────────────────────────────────────────────────

    case 'partial_formula':
      return pick(
        `You got ${sn}, which is smaller than expected. Did you apply every part of the formula, or did you stop too early?`,
        `Compare your work to ${f}. Is every symbol in the formula accounted for in your calculation?`,
        `Write out ${f} fully, then replace each symbol with the number from the question — make sure no term is left out.`
      );

    // ── MCQ / TRUE-FALSE ────────────────────────────────────────────────────

    case 'wrong_option': {
      const letter = String(studentAnswer).toUpperCase().trim();
      return pick(
        `You chose ${letter}. Try working out the correct answer from the formula before looking at the options.`,
        `Plug the question's measurements into ${f} step by step, then see which option the result matches.`,
        `Calculate the answer using ${f} with the given values — the correct option is exactly what the formula produces.`
      );
    }

    case 'wrong_verdict': {
      const said = String(studentAnswer).trim();
      return pick(
        `You said "${said}". Apply the formula to the numbers in the statement and check whether the claim holds.`,
        `Do the calculation the statement describes using ${f}. If the result matches the claimed value, it's True; otherwise, False.`,
        `Evaluate both sides of the statement separately using ${f}. Compare — if they match, True; if not, False.`
      );
    }

    // ── INVALID INPUT ────────────────────────────────────────────────────────

    case 'invalid_input':
      return pick(
        `Please enter only a number in the answer box — no units, no words.`,
        `Type the numeric value only (e.g., 44 or 3.5). If the answer is a fraction, enter its decimal form.`,
        `Remove any text or unit labels from your answer. Enter just the number so the system can check it.`
      );

    // ── DEFAULT ──────────────────────────────────────────────────────────────

    default:
      return pick(
        `You got ${sn}. First check: does the question want ${topic} of this ${shape} — and are you using the matching formula?`,
        `Use ${f} with the values from the question. Write the formula, substitute each value, then calculate — watch × vs + and any squared or cubed terms.`,
        `Copy ${f}, replace each letter with the number from the question, then evaluate carefully — respecting brackets, powers, and the order of operations.`
      );
  }
}

module.exports = { buildPersonalizedHint };
