/**
 * Personalized Hint Service — two hints per wrong attempt, then remedial.
 * Hint 1 = mistake pattern (+/−/×/÷, r vs d, perimeter vs area, etc.).
 * Hint 2 = same, plus the question’s formula from the bank when available (not shown on the question card).
 */

const { formatStudentAnswerForUi } = require('./errorDetectionService');

function snippetOf(studentAnswer, unit) {
  return formatStudentAnswerForUi(studentAnswer, unit) || 'your answer';
}

function buildPersonalizedHint(question, errorInfo, studentAnswer, level) {
  const L     = Math.min(Math.max(parseInt(level, 10) || 1, 1), 2);
  const sn    = snippetOf(studentAnswer, question.unit);
  const type  = errorInfo?.type || 'wrong_answer';
  const qType = String(question.type || 'direct_calculation');
  const f     = (question.formula && String(question.formula).trim()) || '';

  /** Level 1 = pattern only. Level 2 = pattern + formula line (questions stay formula-free in the UI). */
  const pick = (a, b) => {
    const body = L === 1 ? a : b;
    if (L === 2 && f && type !== 'invalid_input') {
      return `${body}\n\nFormula: ${f}`;
    }
    return body;
  };

  switch (type) {

    // ── PERIMETER — Square ──────────────────────────────────────────────────

    case 'square_two_sides_perimeter':
      return pick(
        `Hmm — you got ${sn}. How many sides does a square have?`,
        `You multiplied by 2 instead of 4. Perimeter of a square = 4 × side because all four sides are identical and must be counted.`
      );

    case 'square_perimeter_subtract_instead_multiply':
      return pick(
        `You wrote ${sn}. Did you subtract one number from the other, or multiply?`,
        `You subtracted (${sn} comes from subtraction). Perimeter = 4 × side: multiply the side length by 4. Never subtract the 4 from the side.`
      );

    case 'square_area_instead_of_perimeter':
      return pick(
        `Take a moment — is the question asking for the space inside the square, or the fence around it?`,
        `side² gives area. You need perimeter, which is the total boundary: P = 4 × side. Four equal sides added together, not one side multiplied by itself.`
      );

    // ── PERIMETER — Rectangle ───────────────────────────────────────────────

    case 'rect_multiply_instead_of_perimeter':
      return pick(
        `Notice that you multiplied the two measurements — does that give the boundary or the inside of the rectangle?`,
        `l × b = area. For perimeter you need all four sides: P = 2(l + b). Two lengths and two breadths, not a product.`
      );

    case 'rect_sum_only_perimeter':
      return pick(
        `You got ${sn}. Does a rectangle have just two sides?`,
        `l + b gives only two sides. The full perimeter includes all four: P = 2 × (l + b). You forgot to double it.`
      );

    case 'rect_perimeter_instead_of_area':
      return pick(
        `The question asks for the space inside the rectangle — did you add the sides and double (perimeter-style) instead of multiplying length × breadth?`,
        `2(l + b) is perimeter. Area = l × b — a single product of length and breadth, no doubling.`
      );

    case 'perimeter_instead_of_area_rect':
      return pick(
        `Re-read the last line — "area" or "perimeter"? Your answer hints at the wrong one.`,
        `You used perimeter thinking: 2(l+b). But area = l × b. One multiplication, no factor of 2.`
      );

    // ── PERIMETER — Circle ──────────────────────────────────────────────────

    case 'circle_forgot_multiply_by_2':
      return pick(
        `Distance around a circle should scale like “once around the rim” — did you stop after π × r and drop a factor of 2?`,
        `You computed πr, but circumference = 2πr. The 2 fixes “half a turn” versus the full boundary.`
      );

    case 'circle_area_for_circumference':
      return pick(
        `This asks for distance around — did you square r and use πr² (inside-area style) instead of 2πr (around-once style)?`,
        `πr² = area inside. Circumference = 2πr (no r²). You mixed inside-area steps with around-the-circle steps.`
      );

    case 'forgot_pi_circumference':
      return pick(
        `Circles always involve π — did you only multiply 2 × radius and skip π?`,
        `You got 2r. Around-the-circle needs 2 × π × r — multiply by (22/7) as well.`
      );

    // ── AREA — Square ───────────────────────────────────────────────────────

    case 'square_perimeter_instead_of_area':
      return pick(
        `What does "area" actually measure — the boundary line or the flat surface covered?`,
        `4 × side is perimeter. Area = side × side = side². You need the square of the side, not four times it.`
      );

    // ── AREA — Rectangle ───────────────────────────────────────────────────

    case 'area_instead_of_perimeter_rect':
      return pick(
        `You got ${sn} — does the question ask for the boundary or the inside space?`,
        `l × b is area (multiply). Perimeter doubles (l + b). You multiplied; this question needs the around-the-rectangle path.`
      );

    // ── AREA — Circle ───────────────────────────────────────────────────────

    case 'circle_circumference_for_area':
      return pick(
        `Inside the circle needs r × r with π — did you use 2πr (around the circle) instead?`,
        `2πr = distance around. Inside area = π × r × r. You used a “no r²” path where r should be squared.`
      );

    case 'circle_forgot_square_radius':
      return pick(
        `For inside-area you need r × r before π — did you stop at π × r?`,
        `You wrote πr. Inside area needs π × (r × r). Square r first, then multiply by π.`
      );

    case 'forgot_pi_area':
      return pick(
        `You squared the radius — did you forget to multiply that r² by π?`,
        `Inside area = π × r². Include (22/7) after you have r × r.`
      );

    // ── SURFACE AREA — Cube ─────────────────────────────────────────────────

    case 'cube_one_face_sa':
      return pick(
        `You found the area of a face — but surface area covers every face. How many does a cube have?`,
        `You computed a² (one face only). Total SA = 6a² — multiply by 6 to cover all six identical square faces.`
      );

    case 'cube_two_faces_sa':
      return pick(
        `Interesting — you seem to have counted two faces. Is a cube open on the sides?`,
        `2a² = top + bottom only (2 faces). TSA = 6a² because a cube has 6 identical square faces — include all of them.`
      );

    case 'cube_four_faces_sa':
      return pick(
        `Got ${sn}. Quick check — does the question ask for total surface area or lateral surface area?`,
        `LSA = 4a² (sides only). TSA = 6a² (all 6 faces). Re-read what the question asks for and choose the right one.`
      );

    case 'cube_volume_for_sa':
      return pick(
        `Think about this: does "surface area" describe what's on the outside of a cube, or the space it holds inside?`,
        `a³ is volume. Surface area = 6a² — six faces, each with area a². Volume and SA are completely different measurements.`
      );

    case 'cube_linear_sa':
      return pick(
        `Surface area is measured in square units — does your calculation produce a square unit?`,
        `TSA = 6 × a × a = 6a². You computed 6 × a (linear). Each face is a square, so its area is a², not just a.`
      );

    // ── SURFACE AREA — Cuboid ───────────────────────────────────────────────

    case 'cuboid_no_factor_2_sa':
      return pick(
        `You found ${sn}. Think about how many times each face of a cuboid appears.`,
        `lb + bh + lh = half the TSA. Every face has an identical opposite face, so multiply by 2: TSA = 2(lb + bh + lh).`
      );

    case 'cuboid_volume_for_sa':
      return pick(
        `Surface area and volume are easy to mix up — which one does this question actually ask for?`,
        `l × b × h is volume. Surface area = 2(lb + bh + lh) — sum the three pairs of face areas and double them.`
      );

    case 'cuboid_partial_sa':
      return pick(
        `You covered the top and bottom — how many more pairs of faces does a cuboid have?`,
        `TSA = 2lb + 2lh + 2bh. You included only 2lb (one pair). Add the other two pairs: 2lh (front+back) and 2bh (left+right).`
      );

    // ── SURFACE AREA — Cylinder ─────────────────────────────────────────────

    case 'cylinder_lateral_only_sa':
      return pick(
        `Got ${sn}. Does a closed cylinder have any flat parts, or just the curved wall?`,
        `CSA = 2πrh (curved wall only). TSA = 2πrh + 2πr² = 2πr(r + h). You missed the two circular bases (2πr²).`
      );

    case 'cylinder_only_circles_sa':
      return pick(
        `You found the area of the two circular ends — what about the surface wrapping around the side?`,
        `2πr² = two circular bases only. TSA = 2πrh + 2πr² = 2πr(r+h). The curved surface area 2πrh was completely missing.`
      );

    case 'cylinder_volume_for_sa':
      return pick(
        `Is the question asking for the outer skin of the cylinder, or how much it can hold?`,
        `Inside fill = circle area × height. Outer skin = wrap wall plus both round ends — not the inside multiply alone.`
      );

    case 'cylinder_forgot_factor_2_csa':
      return pick(
        `Curved wrap uses “once around” × height — did you drop the same factor of 2 you need for full circumference?`,
        `You used πrh. It should be 2πrh — the wall area is full turn (2πr) times h, not half.`
      );

    // ── VOLUME — Cube ───────────────────────────────────────────────────────

    case 'cube_sa_for_volume':
      return pick(
        `Volume measures how much space a cube holds — is covering its outside faces the same as measuring that space?`,
        `6a² is surface area. Volume = a³ — multiply the edge by itself three times, not six times squared.`
      );

    case 'cube_squared_for_volume':
      return pick(
        `You squared the edge — but is a square face the same as the volume of a cube?`,
        `a² = face area (2D). Volume = a³ = a × a × a. You need one more multiplication by a to reach the full 3D measure.`
      );

    case 'cube_linear_for_volume':
      return pick(
        `Your answer looks like it might be a length, not a volume. What kind of units does volume have?`,
        `Volume = a × a × a = a³. You computed something linear. Cube the edge — multiply it by itself three times.`
      );

    // ── VOLUME — Cuboid ─────────────────────────────────────────────────────

    case 'cuboid_forgot_height_volume':
      return pick(
        `You used two of the three dimensions — but volume fills all three directions. Which one is missing?`,
        `V = l × b × h. You multiplied only two dimensions (leaving one out). All three — length, breadth, and height — must appear in the product.`
      );

    case 'cuboid_sa_for_volume':
      return pick(
        `The question asks for the space inside the cuboid — did you accidentally calculate the outer covering?`,
        `2(lb + bh + lh) is TSA. Volume = l × b × h — multiply all three dimensions once. Much simpler than surface area.`
      );

    case 'cuboid_added_dims_volume':
      return pick(
        `Interesting approach — but does adding the three measurements give a 3D volume?`,
        `Volume = l × b × h (multiply). You computed l + b + h (add). Multiplication, not addition, produces the volume.`
      );

    // ── VOLUME — Cylinder ───────────────────────────────────────────────────

    case 'cylinder_forgot_height_volume':
      return pick(
        `You found the flat circle area — volume needs the third direction. Did you stop before × height?`,
        `Volume = base circle × height. After π × r × r, multiply once more by h.`
      );

    case 'cylinder_csa_for_volume':
      return pick(
        `Got ${sn}. “How much fits inside” is not the same as wrapping the wall — did you use 2πrh (wrap) instead of base × height?`,
        `2πrh is outer wrap. Inside space = (π × r × r) × h — circle area, then stretch by height.`
      );

    case 'cylinder_tsa_for_volume':
      return pick(
        `You combined caps and wrap (all outside) — the question wants space inside. Which operation uses only base circle × height?`,
        `Outer total used curved + both circles. Inside fill = πr² × h — drop the extra surface pieces.`
      );

    case 'cylinder_forgot_square_r':
      return pick(
        `Base circle area needs r × r — did you only use one r before π and h?`,
        `You likely did π × r × h. It should be π × (r × r) × h — square r inside the base first.`
      );

    // ── OPERATION CONFUSION ─────────────────────────────────────────────────

    case 'multiply_instead_of_add':
      return pick(
        `Your number fits a product (×) — did the problem want you to add those two pieces first (+)?`,
        `Do the addition inside the story first; only multiply afterward if the situation calls for scaling or repeated strips — not × where + belongs.`
      );

    case 'add_instead_of_multiply':
      return pick(
        `Your number fits a sum (+) — did the problem need a product (×) of those same pieces?`,
        `Replace + with × for the pair that should grow together (area, scaling, “all of each”), then redo the rest.`
      );

    // ── RADIUS / DIAMETER ───────────────────────────────────────────────────

    case 'radius_diameter_confusion': {
      const ans = parseFloat(studentAnswer);
      const correct = parseFloat(question.answer);
      const looksDouble = !isNaN(ans) && !isNaN(correct) && ans > correct * 1.5;
      return pick(
        looksDouble
          ? `Your answer is much bigger than expected — using the full width (diameter) where only half (radius) should go into πr² or similar blows the answer up (often about 4× for area).`
          : `Your answer is much smaller than expected — check the wording: if it gave diameter, you may need radius = half of that before squaring or multiplying by π.`,
        `Halve diameter → r when the step needs r; if you already had r, don’t plug the full diameter in again.`
      );
    }

    // ── FORMULA SWAP ────────────────────────────────────────────────────────

    case 'formula_swap':
      return pick(
        `Your value fits one kind of job (fence-around vs inside-flat vs all faces vs space-filled) — does it match the word in the question?`,
        `Around → add pairs then double; inside flat → multiply two sides; all paint faces → sum/double face areas; how much inside solid → multiply including height or cube edge. Pick the chain that matches the question words.`
      );

    // ── SA / VOLUME CONFUSION ───────────────────────────────────────────────

    case 'sa_volume_confusion':
      return pick(
        `Did you add up outside skins (faces/wrap) when the question asked how much fits inside, or the opposite?`,
        `Outside = add/multiply face areas. Inside = one 3D chunk (often base × height or edge³). Match which one you computed to what was asked.`
      );

    // ── UNIT ERROR ──────────────────────────────────────────────────────────

    case 'unit_error':
      return pick(
        `The scale of your answer seems off — are all your lengths in the same unit before you calculate?`,
        `Convert every length to cm or every length to m first, then redo +, ×, and squares. Don’t mix m and cm in one chain.`
      );

    // ── ARITHMETIC ──────────────────────────────────────────────────────────

    case 'arithmetic_mistake':
      return pick(
        `Your approach looks right, but the final value is a little off — redo order of operations and fractions (e.g. 22/7) step by step.`,
        `Rewrite the same operations in a column, one × or ÷ at a time — a single slip in bracket or π use changes ${sn}.`
      );

    // ── PARTIAL FORMULA ─────────────────────────────────────────────────────

    case 'partial_formula':
      return pick(
        `Your answer is smaller than expected — did you stop after one multiply when another (×2, +second part, ×height, or r²) was still needed?`,
        `Walk the chain again: doubling, second pair of sides, squaring r, height, or extra faces — one of those steps is usually missing when the value is too low.`
      );

    // ── MCQ / TRUE-FALSE ────────────────────────────────────────────────────

    case 'wrong_option': {
      const letter = String(studentAnswer).toUpperCase().trim();
      return pick(
        `You chose ${letter}. Compute the number from the givens (+ / − / × / ÷ / square) before matching options.`,
        `Redo with the numbers in the problem; the correct letter is whichever option equals that value — watch × vs + and r vs d.`
      );
    }

    case 'wrong_verdict': {
      const said = String(studentAnswer).trim();
      return pick(
        `You said "${said}". Recompute the claim with the same operations (+ × ÷ √ r²) and see if it truly matches.`,
        `If your recomputed value matches the statement → True; if not → False.`
      );
    }

    // ── INVALID INPUT ────────────────────────────────────────────────────────

    case 'invalid_input':
      return pick(
        `Please type only a number in the answer box — no units or extra words.`,
        `Remove any letters, unit labels, or symbols from your answer. The system needs a plain number to check it.`
      );

    // ── REVERSE-FIND ─────────────────────────────────────────────────────────

    case 'reverse_gave_perimeter':
      return pick(
        `You wrote the perimeter itself — but the question is asking you to find the side length from it.`,
        `Side = Perimeter ÷ 4. You wrote the perimeter down instead of dividing it. One step left: divide by 4.`
      );

    case 'reverse_square_half':
      return pick(
        `You got ${sn}. A square has four equal sides — did you divide by the right number?`,
        `A square has 4 sides, so side = Perimeter ÷ 4. You divided by 2 — that gives two sides' worth, not one.`
      );

    case 'reverse_multiplied':
      return pick(
        `You multiplied — but the perimeter is already given. What operation undoes multiplication?`,
        `If four equal sides make P, then one side = P ÷ 4. You multiplied by 4 instead of dividing — swap to ÷.`
      );

    case 'reverse_gave_area':
      return pick(
        `That number is the area that the question gave you — what do you need to do to it to get the side?`,
        `side = √(area). You wrote the area value instead of taking its square root. One more step: √${sn}.`
      );

    case 'reverse_square_divided':
      return pick(
        `Dividing by 4 doesn't undo squaring — what operation does?`,
        `To reverse s² = area, take the square root: side = √area. Dividing by 4 is not the inverse of squaring.`
      );

    case 'reverse_rect_forgot_subtract':
      return pick(
        `Good start — you found half the perimeter. What do you do next to isolate the missing side?`,
        `Half the perimeter = l + b. You know one side, so subtract it: missing side = (P ÷ 2) − known side. You stopped one step early.`
      );

    case 'reverse_gave_input':
      return pick(
        `That value is already in the question — you need to compute the unknown, not copy a given number.`,
        `Use the givens with + / × / ÷ / √ to reach the quantity the question names — don’t paste a number you already read.`
      );

    // ── EXTENDED PERIMETER — Square ──────────────────────────────────────────

    case 'square_three_sides_perimeter':
      return pick(
        `Close — you multiplied by 3. How many sides does a square actually have?`,
        `P = 4 × side. You used 3 — one side was missed. All four sides are equal and must all be counted.`
      );

    case 'square_one_side_only':
      return pick(
        `You wrote the side length — but perimeter goes all the way around. How many sides need to be counted?`,
        `P = 4 × side. You gave just the side value (× 1). Multiply by 4 to include all four equal sides.`
      );

    // ── EXTENDED PERIMETER — Rectangle ───────────────────────────────────────

    case 'rect_two_lengths_only':
      return pick(
        `You've counted both long sides — but a rectangle has another pair too. Which sides are missing?`,
        `P = 2l + 2b. You computed 2l — the two breadths (each = b) are still missing. Add 2b to complete the perimeter.`
      );

    case 'rect_two_breadths_only':
      return pick(
        `You've counted both short sides — but the longer pair is missing. What are those sides called?`,
        `P = 2l + 2b. You computed 2b — the two lengths (each = l) are not included. Add 2l to get the full perimeter.`
      );

    // ── EXTENDED AREA — Rectangle ────────────────────────────────────────────

    case 'rect_triangle_area':
      return pick(
        `You halved the result — but is a rectangle the same shape as a triangle?`,
        `Rectangle area = l × b (no ÷ 2). Halving is for triangles: Area = ½ × base × height. Remove the division.`
      );

    case 'rect_side_squared':
      return pick(
        `You squared one side — rectangles need both different sides in one area step (multiply length × breadth).`,
        `Area = l × b. You used l×l or b×b; multiply the two different edges instead.`
      );

    // ── EXTENDED AREA — Circle ───────────────────────────────────────────────

    case 'circle_diameter_as_radius_area':
      return pick(
        `Your answer is much larger than expected — did you check whether you used radius or diameter?`,
        `A = π × r × r. If diameter d is given: r = d ÷ 2. You appear to have used d as r, giving πd² = 4πr². Halve the diameter first.`
      );

    // ── EXTENDED SA — Cube ───────────────────────────────────────────────────

    case 'cube_three_faces_sa':
      return pick(
        `You multiplied by 3 — can you picture all the faces of a cube and count them?`,
        `TSA = 6a². You multiplied by 3 instead of 6. A cube has six identical square faces — count all six.`
      );

    case 'cube_five_faces_sa':
      return pick(
        `So close — you included 5 faces. How many faces does a cube have in total?`,
        `TSA = 6a². You multiplied by 5 — just one face short. Count all six faces and multiply by a².`
      );

    // ── EXTENDED SA — Cuboid ─────────────────────────────────────────────────

    case 'cuboid_lateral_sa_only':
      return pick(
        `You found the area of the four side walls — does the question ask for total SA or lateral SA only?`,
        `LSA = 2h(l+b) (sides only). TSA = 2(lb+bh+lh) = LSA + 2lb. Add the top and bottom pair (2lb) to get TSA.`
      );

    // ── EXTENDED SA — Cylinder ───────────────────────────────────────────────

    case 'cylinder_one_circle_sa':
      return pick(
        `You included the curved surface and one circle — but a cylinder has two circular ends. Which one is missing?`,
        `TSA = 2πrh + 2πr². You added only one πr² instead of two. Both circular ends are equal — add πr² one more time.`
      );

    // ── EXTENDED VOLUME — Cube ───────────────────────────────────────────────

    case 'cube_twelve_edges_volume':
      return pick(
        `That value looks like 12 × edge (total edge length) — volume is edge × edge × edge, not “how many edges”.`,
        `Use the same edge three times with ×: a × a × a — not 12 × a.`
      );

    // ── EXTENDED VOLUME — Cylinder ───────────────────────────────────────────

    case 'cylinder_diameter_as_radius_vol':
      return pick(
        `Volume is way too big — using full diameter everywhere you meant radius makes r effectively doubled and volume about 4× too large.`,
        `Halve the given width once → r; then use r × r in the base before × h.`
      );

    // ── COST PROBLEMS ────────────────────────────────────────────────────────

    case 'cost_forgot_rate':
      return pick(
        `You have the measurement — but the question asks for the total cost. What one more step is needed?`,
        `Total cost = area (or perimeter) × cost rate. You stopped at the measurement. Multiply by the rate given in the question.`
      );

    case 'cost_wrong_measure':
      return pick(
        `Re-read what the question is charging for — is it charging per unit of area, or per unit of length?`,
        `Per m² → multiply cost by inside-flat amount (area-style ×). Per m → multiply cost by around-the-fence amount (perimeter-style). You paired cost with the wrong kind of number.`
      );

    // ── Generic algebraic (+/−/×/÷ confusion from question numbers) ─────────

    case 'algebraic_subtract_instead_multiply':
      return pick(
        `You wrote ${sn}. Does that value come from subtracting two numbers that should grow the total together instead?`,
        `Your answer fits “one amount minus another.” Here those pieces should be multiplied, not subtracted — swap − for × using the same numbers.`
      );

    case 'algebraic_divide_instead_multiply':
      return pick(
        `You have ${sn}. Did you divide two quantities where the problem expects you to combine them into one larger amount?`,
        `Your result lines up with a ÷ b pattern. The next step needs a product (×), not a quotient — multiply those two values instead.`
      );

    case 'algebraic_multiply_instead_divide':
      return pick(
        `${sn} is pretty large — could you have multiplied when the numbers actually need to be split or scaled down?`,
        `Your value matches a × b style step. Here you should share or ratio the amounts: use division (÷) where you used multiplication.`
      );

    case 'algebraic_add_instead_divide':
      return pick(
        `You entered ${sn}. Does that come from adding, when the story is really about splitting something evenly or finding “how many fit”?`,
        `Your answer looks like a sum. This situation calls for division — use ÷ on the relevant pair instead of +.`
      );

    case 'algebraic_divide_instead_add':
      return pick(
        `You got ${sn}. Could that be from dividing two parts that were supposed to be totaled?`,
        `Your number matches a ÷ step. Those two amounts should be added first (+), not divided — combine them, then finish any later steps.`
      );

    case 'algebraic_subtract_instead_add':
      return pick(
        `${sn} — is that what you get after taking away, when the question really wants a combined total?`,
        `Your result matches subtraction. Here you need the sum of those parts (+), not the difference — add them and continue.`
      );

    // ── DEFAULT ──────────────────────────────────────────────────────────────

    default: {
      const isReverse = qType === 'reverse_find' || qType === 'fill_in_blank';
      const lead = errorInfo?.hintLead;
      if (lead && String(lead).trim()) {
        return pick(
          `You got ${sn}.`,
          String(lead).replace(/\s*Formula:.*$/i, '').trim() || `Check each operation: + vs ×, ÷ vs −, squaring vs doubling, radius vs diameter.`
        );
      }
      return pick(
        isReverse
          ? `You got ${sn}. Work backward from the given total: undo × with ÷, undo squares with √, undo doubles with ÷2 — whatever matches how the total was built.`
          : `You got ${sn}. Re-walk the problem: label each step as add, multiply, divide, or square — most slips are swapping +/× or using diameter where r was needed.`,
        isReverse
          ? `Isolate the unknown on one side by reversing one operation at a time from the outside in.`
          : `Say each operation out loud before writing it; if the story says “around” vs “inside” or “faces” vs “fills”, match that to your operations.`
      );
    }
  }
}

module.exports = { buildPersonalizedHint };
