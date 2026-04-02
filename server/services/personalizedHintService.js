/**
 * Personalized Hint Service — 3-level Socratic hints for every error type.
 *
 * Level 1 — single casual redirecting question, no formula, varied openers
 * Level 2 — points to the specific formula part or step that was wrong
 * Level 3 — names the exact mistake precisely, stops before giving the answer
 *
 * Every hint addresses the student directly ("you") and references their answer (sn).
 * No two cases use the same sentence structure at the same level.
 */

const { formatStudentAnswerForUi } = require('./errorDetectionService');

function snippetOf(studentAnswer, unit) {
  return formatStudentAnswerForUi(studentAnswer, unit) || 'your answer';
}

function buildPersonalizedHint(question, errorInfo, studentAnswer, level) {
  const L     = Math.min(Math.max(parseInt(level, 10) || 1, 1), 3);
  const sn    = snippetOf(studentAnswer, question.unit);
  const f     = question.formula || 'the correct formula';
  const type  = errorInfo?.type || 'wrong_answer';
  const qType = String(question.type || 'direct_calculation');
  const topic = String(question.topic || '').replace(/_/g, ' ');
  const shape = question.shape || 'shape';

  const pick = (a, b, c) => [a, b, c][L - 1];

  switch (type) {

    // ── PERIMETER — Square ──────────────────────────────────────────────────

    case 'square_two_sides_perimeter':
      return pick(
        `Hmm — you got ${sn}. How many sides does a square have?`,
        `Your answer is 2 × side, so you counted two sides. A square has four equal sides — how should that change your total?`,
        `You multiplied by 2 instead of 4. Perimeter of a square = 4 × side because all four sides are identical and must be counted.`
      );

    case 'square_area_instead_of_perimeter':
      return pick(
        `Take a moment — is the question asking for the space inside the square, or the fence around it?`,
        `You squared the side, which gives area (inside space). Perimeter is about the boundary — think about adding all four sides, not multiplying them together.`,
        `side² gives area. You need perimeter, which is the total boundary: P = 4 × side. Four equal sides added together, not one side multiplied by itself.`
      );

    // ── PERIMETER — Rectangle ───────────────────────────────────────────────

    case 'rect_multiply_instead_of_perimeter':
      return pick(
        `Notice that you multiplied the two measurements — does that give the boundary or the inside of the rectangle?`,
        `Multiplying length × breadth fills in the inside (that's area). Perimeter is the outer boundary — picture walking all the way around the rectangle.`,
        `l × b = area. For perimeter you need all four sides: P = 2(l + b). Two lengths and two breadths, not a product.`
      );

    case 'rect_sum_only_perimeter':
      return pick(
        `You got ${sn}. Does a rectangle have just two sides?`,
        `l + b counts one length and one breadth — that's half the rectangle's boundary. The other two sides are still to add.`,
        `l + b gives only two sides. The full perimeter includes all four: P = 2 × (l + b). You forgot to double it.`
      );

    case 'rect_perimeter_instead_of_area':
      return pick(
        `The question asks for the space inside the rectangle — did you use the right formula for that?`,
        `You applied 2(l + b), which is the boundary (perimeter). Area is simpler — it's just the two dimensions multiplied directly.`,
        `2(l + b) is perimeter. Area = l × b — a single product of length and breadth, no doubling.`
      );

    case 'perimeter_instead_of_area_rect':
      return pick(
        `Re-read the last line — "area" or "perimeter"? Your answer hints at the wrong one.`,
        `Your answer matches the perimeter approach. Area means the space inside — what single operation on length and breadth gives that?`,
        `You used perimeter thinking: 2(l+b). But area = l × b. One multiplication, no factor of 2.`
      );

    // ── PERIMETER — Circle ──────────────────────────────────────────────────

    case 'circle_forgot_multiply_by_2':
      return pick(
        `Look carefully at the circumference formula — is there a number right at the front you might have skipped?`,
        `C = 2πr has three parts: 2, π, and r. You seem to have used πr. Which of the three parts is missing?`,
        `You computed πr, but circumference = 2πr. The "2" accounts for the full round trip — the entire boundary, not half of it.`
      );

    case 'circle_area_for_circumference':
      return pick(
        `This question asks for the distance all the way around — are you sure you used the "around" formula?`,
        `Your result matches πr², which is the area (inside space). Circumference is the outer boundary — its formula is different and doesn't involve squaring r.`,
        `πr² = area (inside). Circumference = 2πr (boundary). You used the area formula — switch to 2πr and recalculate.`
      );

    case 'forgot_pi_circumference':
      return pick(
        `Circles always involve a special constant — did yours make it into the calculation?`,
        `You computed 2 × r = ${sn}. The circumference formula is 2πr — what constant multiplies the whole thing?`,
        `C = 2πr. You got 2r — π (= 22/7) was left out entirely. Every circle formula needs π.`
      );

    // ── AREA — Square ───────────────────────────────────────────────────────

    case 'square_perimeter_instead_of_area':
      return pick(
        `What does "area" actually measure — the boundary line or the flat surface covered?`,
        `4 × side gives the boundary length (perimeter). For area, think about how you measure the flat space a square takes up.`,
        `4 × side is perimeter. Area = side × side = side². You need the square of the side, not four times it.`
      );

    // ── AREA — Rectangle ───────────────────────────────────────────────────

    case 'area_instead_of_perimeter_rect':
      return pick(
        `You got ${sn} — does the question ask for the boundary or the inside space?`,
        `l × b fills in the inside (area). This question is about the total distance around — how do you find that for a rectangle?`,
        `l × b is area; 2(l+b) is perimeter. You calculated the area — apply the perimeter formula instead.`
      );

    // ── AREA — Circle ───────────────────────────────────────────────────────

    case 'circle_circumference_for_area':
      return pick(
        `The question wants the space inside the circle — did you use the "inside" formula or the "boundary" formula?`,
        `Your answer matches 2πr (circumference — boundary). For area, the formula looks different; r appears squared. Can you write it down?`,
        `2πr = circumference. Area = πr² — the r is squared. You used the wrong formula; switch to πr².`
      );

    case 'circle_forgot_square_radius':
      return pick(
        `In the area formula for a circle, what happens to r before you multiply by π?`,
        `You computed π × r, but the formula is πr². What extra step should you do with r before multiplying by π?`,
        `Area = πr². You wrote πr without squaring. First multiply r by itself (r × r), then multiply by π.`
      );

    case 'forgot_pi_area':
      return pick(
        `You squared the radius correctly — but something's still missing from a circle area calculation. What is it?`,
        `r² is partway there, but the area of a circle is πr². Which constant did you forget to include?`,
        `Area = πr². You computed r² but skipped multiplying by π (22/7). That constant is essential in every circle formula.`
      );

    // ── SURFACE AREA — Cube ─────────────────────────────────────────────────

    case 'cube_one_face_sa':
      return pick(
        `You found the area of a face — but surface area covers every face. How many does a cube have?`,
        `a² is one square face. A cube is a closed solid with 6 identical faces. How does knowing that change your calculation?`,
        `You computed a² (one face only). Total SA = 6a² — multiply by 6 to cover all six identical square faces.`
      );

    case 'cube_two_faces_sa':
      return pick(
        `Interesting — you seem to have counted two faces. Is a cube open on the sides?`,
        `2a² includes only the top and bottom. A cube has four more faces around the sides. How many faces are there in total?`,
        `2a² = top + bottom only (2 faces). TSA = 6a² because a cube has 6 identical square faces — include all of them.`
      );

    case 'cube_four_faces_sa':
      return pick(
        `Got ${sn}. Quick check — does the question ask for total surface area or lateral surface area?`,
        `4a² is the lateral SA (4 side faces, no top/bottom). If total SA is asked, the top and bottom faces must also be included.`,
        `LSA = 4a² (sides only). TSA = 6a² (all 6 faces). Re-read what the question asks for and choose the right one.`
      );

    case 'cube_volume_for_sa':
      return pick(
        `Think about this: does "surface area" describe what's on the outside of a cube, or the space it holds inside?`,
        `Your answer matches a³ — that's the volume (space inside). Surface area is the outer covering. Which formula uses a²?`,
        `a³ is volume. Surface area = 6a² — six faces, each with area a². Volume and SA are completely different measurements.`
      );

    case 'cube_linear_sa':
      return pick(
        `Surface area is measured in square units — does your calculation produce a square unit?`,
        `6 × edge gives a length (linear). For surface area you need to know each face's area first — how do you find the area of one square face?`,
        `TSA = 6 × a × a = 6a². You computed 6 × a (linear). Each face is a square, so its area is a², not just a.`
      );

    // ── SURFACE AREA — Cuboid ───────────────────────────────────────────────

    case 'cuboid_no_factor_2_sa':
      return pick(
        `You found ${sn}. Think about how many times each face of a cuboid appears.`,
        `lb + bh + lh counts one face from each pair. But a cuboid has pairs of opposite faces — each pair has two identical faces. What does that mean for the total?`,
        `lb + bh + lh = half the TSA. Every face has an identical opposite face, so multiply by 2: TSA = 2(lb + bh + lh).`
      );

    case 'cuboid_volume_for_sa':
      return pick(
        `Surface area and volume are easy to mix up — which one does this question actually ask for?`,
        `l × b × h = volume (how much space it holds). Surface area is about covering every outer face — the formula looks quite different.`,
        `l × b × h is volume. Surface area = 2(lb + bh + lh) — sum the three pairs of face areas and double them.`
      );

    case 'cuboid_partial_sa':
      return pick(
        `You covered the top and bottom — how many more pairs of faces does a cuboid have?`,
        `2 × l × b gives the top + bottom pair. A cuboid also has a front/back pair and a left/right pair. What are their areas?`,
        `TSA = 2lb + 2lh + 2bh. You included only 2lb (one pair). Add the other two pairs: 2lh (front+back) and 2bh (left+right).`
      );

    // ── SURFACE AREA — Cylinder ─────────────────────────────────────────────

    case 'cylinder_lateral_only_sa':
      return pick(
        `Got ${sn}. Does a closed cylinder have any flat parts, or just the curved wall?`,
        `2πrh is the curved surface (the "wrap"). A closed cylinder also has a circular face on top and one on the bottom — what area do those two circles add?`,
        `CSA = 2πrh (curved wall only). TSA = 2πrh + 2πr² = 2πr(r + h). You missed the two circular bases (2πr²).`
      );

    case 'cylinder_only_circles_sa':
      return pick(
        `You found the area of the two circular ends — what about the surface wrapping around the side?`,
        `2πr² gives top + bottom circles. The cylinder's curved wall (the "label" around it) is a separate area. Which formula gives that part?`,
        `2πr² = two circular bases only. TSA = 2πrh + 2πr² = 2πr(r+h). The curved surface area 2πrh was completely missing.`
      );

    case 'cylinder_volume_for_sa':
      return pick(
        `Is the question asking for the outer skin of the cylinder, or how much it can hold?`,
        `πr²h fills the inside (volume). Surface area describes the outer covering — it needs a different formula. Can you recall which one?`,
        `πr²h = volume. For surface area: CSA = 2πrh, TSA = 2πr(r+h). These are completely different; choose based on what the question asks.`
      );

    case 'cylinder_forgot_factor_2_csa':
      return pick(
        `The CSA formula starts with a number before π — did that number make it into your answer?`,
        `You used πrh. The curved surface area formula is 2πrh — what factor sits at the very front?`,
        `CSA = 2πrh. You computed πrh, dropping the 2. That factor comes from the full circumference: 2πr times height.`
      );

    // ── VOLUME — Cube ───────────────────────────────────────────────────────

    case 'cube_sa_for_volume':
      return pick(
        `Volume measures how much space a cube holds — is covering its outside faces the same as measuring that space?`,
        `Your answer matches the surface area formula. Volume is 3-dimensional and uses a different power of the edge. Which one?`,
        `6a² is surface area. Volume = a³ — multiply the edge by itself three times, not six times squared.`
      );

    case 'cube_squared_for_volume':
      return pick(
        `You squared the edge — but is a square face the same as the volume of a cube?`,
        `a² is a flat area (2D, one face). Volume fills three-dimensional space. If you have a², what one more multiplication gets you there?`,
        `a² = face area (2D). Volume = a³ = a × a × a. You need one more multiplication by a to reach the full 3D measure.`
      );

    case 'cube_linear_for_volume':
      return pick(
        `Your answer looks like it might be a length, not a volume. What kind of units does volume have?`,
        `6a is linear (like a total edge length). Volume is 3D — the edge must be used in a way that creates a cubic measure.`,
        `Volume = a × a × a = a³. You computed something linear. Cube the edge — multiply it by itself three times.`
      );

    // ── VOLUME — Cuboid ─────────────────────────────────────────────────────

    case 'cuboid_forgot_height_volume':
      return pick(
        `You used two of the three dimensions — but volume fills all three directions. Which one is missing?`,
        `Volume = l × b × h requires all three measurements. You used two of them. Look at your working — which dimension did you leave out?`,
        `V = l × b × h. You multiplied only two dimensions (leaving one out). All three — length, breadth, and height — must appear in the product.`
      );

    case 'cuboid_sa_for_volume':
      return pick(
        `The question asks for the space inside the cuboid — did you accidentally calculate the outer covering?`,
        `Your answer matches 2(lb + bh + lh), which is the total surface area formula. Volume is simpler — just one product of the three dimensions.`,
        `2(lb + bh + lh) is TSA. Volume = l × b × h — multiply all three dimensions once. Much simpler than surface area.`
      );

    case 'cuboid_added_dims_volume':
      return pick(
        `Interesting approach — but does adding the three measurements give a 3D volume?`,
        `l + b + h is a sum of lengths. Volume needs the three dimensions combined differently to give a 3D quantity. What operation is that?`,
        `Volume = l × b × h (multiply). You computed l + b + h (add). Multiplication, not addition, produces the volume.`
      );

    // ── VOLUME — Cylinder ───────────────────────────────────────────────────

    case 'cylinder_forgot_height_volume':
      return pick(
        `You found the base area — but a cylinder has height. Where does height go in the volume formula?`,
        `πr² is the area of the circular base (flat, 2D). Volume stretches that base through the full height. What factor adds the third dimension?`,
        `V = πr²h. You stopped at πr² (base area) without multiplying by height h. Volume = base area × height.`
      );

    case 'cylinder_csa_for_volume':
      return pick(
        `Got ${sn}. The question is about filling the cylinder — not coating its outside. Which formula is right?`,
        `2πrh is the curved surface area (outer wall). Volume is about how much the cylinder can hold — a different formula applies.`,
        `2πrh = CSA (surface). Volume = πr²h — base area (πr²) multiplied by height h. Different formulas for different things.`
      );

    case 'cylinder_tsa_for_volume':
      return pick(
        `Surface area and volume measure very different things — which one does this question need?`,
        `2πr(r + h) is the total surface area (outer covering). Volume is the space inside — the formula is much simpler and uses only base area and height.`,
        `TSA = 2πr(r+h); Volume = πr²h. You used TSA. Switch to Volume = πr²h — it's base area times height.`
      );

    case 'cylinder_forgot_square_r':
      return pick(
        `Look at the volume formula — what operation is applied to r specifically?`,
        `You wrote π × r × h, but V = πr²h. The radius appears squared — what should you do with r before multiplying by π and h?`,
        `V = πr²h. You computed πrh — r wasn't squared. Multiply r × r first, then multiply by π and h.`
      );

    // ── OPERATION CONFUSION ─────────────────────────────────────────────────

    case 'multiply_instead_of_add':
      return pick(
        `Check the formula at that step — should those two values be multiplied, or combined in another way?`,
        `You multiplied two numbers that the formula needs you to add first. Re-read ${f} — does it call for a sum or a product at that step?`,
        `Write the addition step explicitly: (a + b), then apply whatever comes next in the formula. Multiplication comes after, not instead of, the sum.`
      );

    case 'add_instead_of_multiply':
      return pick(
        `At that step in the formula, are those two numbers supposed to be added — or multiplied?`,
        `You added values that the formula requires to be multiplied. Compare your steps to ${f} — which operation connects those two quantities?`,
        `Identify the two quantities that must be multiplied (not added), then multiply them exactly as the formula shows.`
      );

    // ── RADIUS / DIAMETER ───────────────────────────────────────────────────

    case 'radius_diameter_confusion': {
      const ans = parseFloat(studentAnswer);
      const correct = parseFloat(question.answer);
      const looksDouble = !isNaN(ans) && !isNaN(correct) && ans > correct * 1.5;
      return pick(
        looksDouble
          ? `Your answer is much larger than expected. Did you use the diameter where the formula needs the radius?`
          : `Your answer is smaller than expected. Check whether the question gives radius or diameter — they're easy to swap.`,
        `Radius (r) = half the diameter. If the question gives the diameter, you must halve it before substituting into ${f}.`,
        `r = d ÷ 2. Substitute the correct one into ${f} — if the question gives diameter, convert first: r = diameter ÷ 2.`
      );
    }

    // ── FORMULA SWAP ────────────────────────────────────────────────────────

    case 'formula_swap':
      return pick(
        `Re-read the last line of the question — what exactly is it asking you to find?`,
        `You applied a formula for a different measurement than what was asked. Pick out the key word: "perimeter", "area", "surface area", or "volume", then match it to the right formula.`,
        `Label what you need: boundary → perimeter; inside space → area; all faces → surface area; space filled → volume. Then use only the matching formula.`
      );

    // ── SA / VOLUME CONFUSION ───────────────────────────────────────────────

    case 'sa_volume_confusion':
      return pick(
        `Did you mix up the outer covering of the solid with the space inside it?`,
        `Surface area and volume use completely different formulas for the same shape. Which one does the question ask for?`,
        `Surface area = total area of all outer faces. Volume = how much space the solid encloses. Confirm which is asked, then apply only that formula.`
      );

    // ── UNIT ERROR ──────────────────────────────────────────────────────────

    case 'unit_error':
      return pick(
        `The scale of your answer seems off — are all your lengths in the same unit before you calculate?`,
        `A factor-of-100 difference usually means cm and m got mixed. Remember: 1 m = 100 cm, so 1 m² = 10,000 cm².`,
        `Convert every dimension to one unit first. Then substitute into ${f} and calculate. Never mix cm and m in the same problem.`
      );

    // ── ARITHMETIC ──────────────────────────────────────────────────────────

    case 'arithmetic_mistake':
      return pick(
        `Your approach looks right, but the final value is a little off — try each calculation step again slowly.`,
        `Trace every operation in order. Common slips: handling 22/7 as a fraction, order of operations inside brackets, or squaring a decimal.`,
        `Write ${f}, substitute each value, and evaluate one operation at a time — check each intermediate result before moving to the next step.`
      );

    // ── PARTIAL FORMULA ─────────────────────────────────────────────────────

    case 'partial_formula':
      return pick(
        `Your answer is smaller than expected — did you complete every step of the formula?`,
        `Compare your work to ${f}. Is there a factor, a bracket, or a squaring step that you might have left out?`,
        `Write ${f} in full, replace every letter with a number from the question, then evaluate — leave nothing out.`
      );

    // ── MCQ / TRUE-FALSE ────────────────────────────────────────────────────

    case 'wrong_option': {
      const letter = String(studentAnswer).toUpperCase().trim();
      return pick(
        `You chose ${letter}. Before picking an option, try working out the answer from the formula and then match it to the choices.`,
        `Plug the given values into ${f} step by step. Which option does your result match?`,
        `Calculate using ${f} with the numbers in the question. The correct option is exactly what the formula produces — compare your computed value to each choice.`
      );
    }

    case 'wrong_verdict': {
      const said = String(studentAnswer).trim();
      return pick(
        `You said "${said}". Run the calculation the statement describes and see whether the result agrees with what it claims.`,
        `Apply ${f} to the numbers in the statement. If your result matches the claimed value, it's True; if not, False.`,
        `Evaluate both sides of the statement using ${f}. Compare them — equal means True, not equal means False.`
      );
    }

    // ── INVALID INPUT ────────────────────────────────────────────────────────

    case 'invalid_input':
      return pick(
        `Please type only a number in the answer box — no units or extra words.`,
        `Enter the numeric value only (e.g., 44 or 3.5). If the answer is a fraction, convert it to a decimal first.`,
        `Remove any letters, unit labels, or symbols from your answer. The system needs a plain number to check it.`
      );

    // ── REVERSE-FIND ─────────────────────────────────────────────────────────

    case 'reverse_gave_perimeter':
      return pick(
        `You wrote the perimeter itself — but the question is asking you to find the side length from it.`,
        `The perimeter is given information. To get the side, you need to reverse the formula: if P = 4 × side, then side = P ÷ ?`,
        `Side = Perimeter ÷ 4. You wrote the perimeter down instead of dividing it. One step left: divide by 4.`
      );

    case 'reverse_square_half':
      return pick(
        `You got ${sn}. A square has four equal sides — did you divide by the right number?`,
        `You divided the perimeter by 2, but P = 4 × side means side = P ÷ 4, not P ÷ 2.`,
        `A square has 4 sides, so side = Perimeter ÷ 4. You divided by 2 — that gives two sides' worth, not one.`
      );

    case 'reverse_multiplied':
      return pick(
        `You multiplied — but the perimeter is already given. What operation undoes multiplication?`,
        `You applied P = 4 × side in the forward direction. The question gives you P and asks for side — you need to go backwards.`,
        `If P = 4 × side, then side = P ÷ 4. You multiplied by 4 instead of dividing. Reverse the formula to isolate the unknown.`
      );

    case 'reverse_gave_area':
      return pick(
        `That number is the area that the question gave you — what do you need to do to it to get the side?`,
        `The area is given information. Area = side² means you need to undo squaring. What is the inverse operation of squaring?`,
        `side = √(area). You wrote the area value instead of taking its square root. One more step: √${sn}.`
      );

    case 'reverse_square_divided':
      return pick(
        `Dividing by 4 doesn't undo squaring — what operation does?`,
        `Area = side², so to find the side you need to reverse the squaring. What is the opposite of squaring a number?`,
        `To reverse s² = area, take the square root: side = √area. Dividing by 4 is not the inverse of squaring.`
      );

    case 'reverse_rect_forgot_subtract':
      return pick(
        `Good start — you found half the perimeter. What do you do next to isolate the missing side?`,
        `P ÷ 2 gives you (length + breadth). You already know one of them. How do you get the other one from their sum?`,
        `Half the perimeter = l + b. You know one side, so subtract it: missing side = (P ÷ 2) − known side. You stopped one step early.`
      );

    case 'reverse_gave_input':
      return pick(
        `That value is already in the question — you need to compute the unknown, not copy a given number.`,
        `The question provides some values and asks you to find one missing value. Which value is the unknown? Set up the formula to solve for it.`,
        `Don't copy a given value as your answer. Set up the formula, substitute the known numbers, and solve for the missing quantity.`
      );

    // ── DEFAULT ──────────────────────────────────────────────────────────────

    default: {
      // For reverse-find / fill-in-blank questions, the hint should be about
      // working backwards — not about "which formula to use"
      const isReverse = qType === 'reverse_find' || qType === 'fill_in_blank';
      return pick(
        isReverse
          ? `You got ${sn}. The question gives you a result and asks you to find one of the inputs — try working the formula backwards.`
          : `You got ${sn}. Re-read the question carefully — which measurement is it actually asking for?`,
        isReverse
          ? `Write out ${f}, identify which value is missing (the unknown), substitute everything else, and solve for the unknown.`
          : `Try writing ${f} out in full, substituting each value from the question, and checking each step — is the formula and the operation (+, ×, ²) correct?`,
        isReverse
          ? `Rearrange ${f} to isolate the unknown on one side, then substitute the given values and calculate.`
          : `Write ${f}, replace each letter with its number, and evaluate carefully — pay attention to brackets, powers, and whether you need to add or multiply.`
      );
    }
  }
}

module.exports = { buildPersonalizedHint };
