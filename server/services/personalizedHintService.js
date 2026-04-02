/**
 * Personalized Hint Service — two hints per wrong attempt, then remedial.
 * Hint 1: nudge toward the mistake (operations, r vs d, perimeter vs area, etc.).
 * Hint 2: clearer fix; appends the bank formula on its own line when present (not on MCQ — see wrong_option).
 * MCQ: both hints stress using the formula; the formula is appended when available.
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

  const pick = (a, b) => {
    const body = L === 1 ? a : b;
    if (L === 2 && f && type !== 'invalid_input' && type !== 'wrong_option') {
      return `${body}\n\n${f}`;
    }
    return body;
  };

  switch (type) {

    // ── PERIMETER — Square ──────────────────────────────────────────────────

    case 'square_two_sides_perimeter':
      return pick(
        `You wrote ${sn}. A square has four equal sides — did you only double one side?`,
        `Perimeter needs all four: 4 × side length, not 2 × side.`
      );

    case 'square_perimeter_subtract_instead_multiply':
      return pick(
        `You wrote ${sn}. Does that come from subtracting — e.g. side minus 4 — instead of scaling the side?`,
        `The "4" means four equal sides: multiply side × 4. Don’t subtract 4 from the side.`
      );

    case 'square_area_instead_of_perimeter':
      return pick(
        `Does this question want distance around the square, or the flat space inside?`,
        `You used side × side (area). Perimeter is four times the side: add all four equal edges, same as 4 × side.`
      );

    // ── PERIMETER — Rectangle ───────────────────────────────────────────────

    case 'rect_multiply_instead_of_perimeter':
      return pick(
        `Multiplying length × breadth fills the inside. Does the question ask for that or for the boundary?`,
        `l × b is area. Perimeter walks all four sides: double (length + breadth).`
      );

    case 'rect_sum_only_perimeter':
      return pick(
        `You got ${sn}. One length plus one breadth is only half the trip around.`,
        `Double it: P = 2 × (l + b).`
      );

    case 'rect_perimeter_instead_of_area':
      return pick(
        `Inside the rectangle is one simple product of the two sides — did you use 2(l + b) instead?`,
        `2(l + b) is perimeter. Area is length × breadth, once, no factor of 2.`
      );

    case 'perimeter_instead_of_area_rect':
      return pick(
        `Check the question: does it say area or perimeter?`,
        `Your number fits perimeter-style. Area = l × b — one multiply only.`
      );

    // ── PERIMETER — Circle ──────────────────────────────────────────────────

    case 'circle_forgot_multiply_by_2':
      return pick(
        `Full distance around the circle usually has a 2 with π and r. Did you stop at π × r?`,
        `Use 2 × π × r for circumference — the 2 is the full turn, not half.`
      );

    case 'circle_area_for_circumference':
      return pick(
        `This is “around the circle.” Did you square r and use πr² (area logic)?`,
        `Around = 2πr. Inside = πr². No squaring r here.`
      );

    case 'forgot_pi_circumference':
      return pick(
        `Did you leave π out and use only 2 × radius?`,
        `Circumference needs π: 2 × π × r (e.g. π = 22/7).`
      );

    // ── AREA — Square ───────────────────────────────────────────────────────

    case 'square_perimeter_instead_of_area':
      return pick(
        `Area is flat space inside — not the length of the fence.`,
        `4 × side is perimeter. Area = side × side.`
      );

    // ── AREA — Rectangle ───────────────────────────────────────────────────

    case 'area_instead_of_perimeter_rect':
      return pick(
        `You got ${sn}. Boundary or inside — which did the question ask for?`,
        `l × b is inside. Around the rectangle is 2(l + b). You need the boundary.`
      );

    // ── AREA — Circle ───────────────────────────────────────────────────────

    case 'circle_circumference_for_area':
      return pick(
        `Inside the circle needs r × r with π. Did you use 2πr (around) by mistake?`,
        `Area = π × r². Circumference is different — no r² there.`
      );

    case 'circle_forgot_square_radius':
      return pick(
        `Circle area uses radius twice: r × r, then × π.`,
        `You stopped at π × r. Do r × r first, then × π.`
      );

    case 'forgot_pi_area':
      return pick(
        `After r × r, circle area still needs π.`,
        `Area = π × r² — multiply by (22/7) or the π you were told to use.`
      );

    // ── SURFACE AREA — Cube ─────────────────────────────────────────────────

    case 'cube_one_face_sa':
      return pick(
        `One face is a square — how many faces does a closed cube have?`,
        `Total surface = 6 × (face area). You had one face; multiply by 6.`
      );

    case 'cube_two_faces_sa':
      return pick(
        `Two faces aren’t enough for a whole box — what about the four sides?`,
        `Top + bottom is 2 faces. Add four more: 6 equal faces → 6a².`
      );

    case 'cube_four_faces_sa':
      return pick(
        `You got ${sn}. Total surface area or only the four side faces?`,
        `Four faces = lateral only. Total = six faces → 6a² unless it asks for lateral only.`
      );

    case 'cube_volume_for_sa':
      return pick(
        `Surface means paint on the outside; volume is air inside — different idea.`,
        `You used edge³ (volume). Outside = six squares: 6a².`
      );

    case 'cube_linear_sa':
      return pick(
        `Surface area should end in square units — each face is a square.`,
        `You may have done 6 × edge (length). Need 6 × edge × edge.`
      );

    // ── SURFACE AREA — Cuboid ───────────────────────────────────────────────

    case 'cuboid_no_factor_2_sa':
      return pick(
        `You got ${sn}. Each face has an identical opposite — does your sum count both?`,
        `lb + bh + lh is half the story. Double it: TSA = 2(lb + bh + lh).`
      );

    case 'cuboid_volume_for_sa':
      return pick(
        `Filling the box vs wrapping it — which does the question want?`,
        `l × b × h is volume. Wrapping = 2(lb + bh + lh).`
      );

    case 'cuboid_partial_sa':
      return pick(
        `Top and bottom are one pair — what other pairs of faces are there?`,
        `Add front/back and left/right pairs: 2lb + 2lh + 2bh.`
      );

    // ── SURFACE AREA — Cylinder ─────────────────────────────────────────────

    case 'cylinder_lateral_only_sa':
      return pick(
        `Got ${sn}. A closed can has a curved label plus two round lids.`,
        `Curved part alone misses the circles — add both bases.`
      );

    case 'cylinder_only_circles_sa':
      return pick(
        `Two circles are only the ends — what about the curved wall?`,
        `Add the wrap (curved surface) to the two caps.`
      );

    case 'cylinder_volume_for_sa':
      return pick(
        `Outer skin vs space inside — which one is asked?`,
        `Inside = base circle × height. Outside adds wall and both circles.`
      );

    case 'cylinder_forgot_factor_2_csa':
      return pick(
        `The curved sheet is “once around” × height — same 2 as in 2πr.`,
        `Wall area is 2πrh, not πrh.`
      );

    // ── VOLUME — Cube ───────────────────────────────────────────────────────

    case 'cube_sa_for_volume':
      return pick(
        `Space inside the cube isn’t the same as area on all faces.`,
        `6a² is outside. Inside = a × a × a.`
      );

    case 'cube_squared_for_volume':
      return pick(
        `A single face is a²; the solid fills depth too.`,
        `Multiply by a once more: volume = a³.`
      );

    case 'cube_linear_for_volume':
      return pick(
        `Volume should feel “thick” — edge used three times, not once.`,
        `Volume = edge × edge × edge.`
      );

    // ── VOLUME — Cuboid ─────────────────────────────────────────────────────

    case 'cuboid_forgot_height_volume':
      return pick(
        `Volume stretches in three directions — is one dimension missing?`,
        `Multiply length × breadth × height — all three.`
      );

    case 'cuboid_sa_for_volume':
      return pick(
        `Space inside vs total paper to wrap — which did they ask?`,
        `2(lb+bh+lh) wraps the box. Inside = l × b × h.`
      );

    case 'cuboid_added_dims_volume':
      return pick(
        `Adding l + b + h gives a length, not a filled box.`,
        `Volume multiplies: l × b × h.`
      );

    // ── VOLUME — Cylinder ───────────────────────────────────────────────────

    case 'cylinder_forgot_height_volume':
      return pick(
        `After the circular base, depth still matters.`,
        `Volume = (π × r × r) × height.`
      );

    case 'cylinder_csa_for_volume':
      return pick(
        `Got ${sn}. Wall wrap isn’t the same as “how much fits inside.”`,
        `Use base area × height, not the curved wall alone.`
      );

    case 'cylinder_tsa_for_volume':
      return pick(
        `You mixed every outer piece — the question may only want fill.`,
        `Inside = πr²h. Drop caps-and-wrap if it’s volume.`
      );

    case 'cylinder_forgot_square_r':
      return pick(
        `Base circle uses r twice before you multiply by height.`,
        `π × r × r × h — not π × r × h.`
      );

    // ── OPERATION CONFUSION ─────────────────────────────────────────────────

    case 'multiply_instead_of_add':
      return pick(
        `Your result looks like a product — should those two numbers be added first?`,
        `Add where the story joins lengths or parts; multiply when you scale or repeat.`
      );

    case 'add_instead_of_multiply':
      return pick(
        `Your result looks like a sum — should those two numbers be multiplied?`,
        `Try × for “all of this and all of that” in one step (area, scaling, etc.).`
      );

    // ── RADIUS / DIAMETER ───────────────────────────────────────────────────

    case 'radius_diameter_confusion': {
      const ans = parseFloat(studentAnswer);
      const correct = parseFloat(question.answer);
      const looksDouble = !isNaN(ans) && !isNaN(correct) && ans > correct * 1.5;
      return pick(
        looksDouble
          ? `Your answer is much too large — often that means diameter was used as radius (especially where r is squared).`
          : `Your answer looks too small — check if you were given diameter but used it as r (or the reverse).`,
        `Radius = diameter ÷ 2 when the wording gives the full width across the circle.`
      );
    }

    // ── FORMULA SWAP ────────────────────────────────────────────────────────

    case 'formula_swap':
      return pick(
        `Your number fits one “job”: around the shape, flat inside, all faces, or space filled — does it match the question?`,
        `Fence-around: add pairs, then double. Flat inside: one multiply of the two sides. Faces: sum/double face areas. Fill: product with height or edge³.`
      );

    // ── SA / VOLUME CONFUSION ───────────────────────────────────────────────

    case 'sa_volume_confusion':
      return pick(
        `Did you skin the solid when they asked how much fits — or the other way round?`,
        `Outside = face areas (and wrap). Inside = one 3D chunk (often base × height or edge³).`
      );

    // ── UNIT ERROR ──────────────────────────────────────────────────────────

    case 'unit_error':
      return pick(
        `The size of your answer suggests mixed units — all cm, or all m?`,
        `Convert every length to the same unit, then redo the calculation.`
      );

    // ── ARITHMETIC ──────────────────────────────────────────────────────────

    case 'arithmetic_mistake':
      return pick(
        `The idea looks right; the final number is slightly off.`,
        `Redo each step in order — brackets, fractions like 22/7, and squaring — until ${sn} matches the chain.`
      );

    // ── PARTIAL FORMULA ─────────────────────────────────────────────────────

    case 'partial_formula':
      return pick(
        `Your answer is lower than expected — a step may be unfinished (extra ×, double, height, r², or another face).`,
        `Walk the full path again: perimeter doubles; area may need both sides; solids need all three dimensions or every face you need.`
      );

    // ── MCQ / TRUE-FALSE ────────────────────────────────────────────────────

    case 'wrong_option': {
      const letter = String(studentAnswer).toUpperCase().trim();
      const fBlock = f ? `\n\n${f}` : '';
      if (L === 1) {
        return (
          `You chose ${letter}. Work the numbers with the formula first, then pick the option that matches — not the other way round.` +
          fBlock
        );
      }
      return (
        `Work step by step with the formula (order of operations, π, r² where needed). Exactly one option should equal your result.` +
        fBlock
      );
    }

    case 'wrong_verdict': {
      const said = String(studentAnswer).trim();
      return pick(
        `You said "${said}." Evaluate the statement yourself — does the math actually work out?`,
        `Same value on both sides → True. A mismatch → False.`
      );
    }

    // ── INVALID INPUT ────────────────────────────────────────────────────────

    case 'invalid_input':
      return pick(
        `Enter a plain number only (digits and maybe a decimal point).`,
        `Remove units, words, and symbols — just the numeric answer.`
      );

    // ── REVERSE-FIND ─────────────────────────────────────────────────────────

    case 'reverse_gave_perimeter':
      return pick(
        `The perimeter is the clue — the answer should be one side.`,
        `Side = perimeter ÷ 4 for a square.`
      );

    case 'reverse_square_half':
      return pick(
        `You got ${sn}. Four equal sides share the perimeter — divide by 4, not 2.`,
        `side = P ÷ 4.`
      );

    case 'reverse_multiplied':
      return pick(
        `Perimeter is given — to get one side you undo the “×4”.`,
        `Divide by 4: side = P ÷ 4.`
      );

    case 'reverse_gave_area':
      return pick(
        `Area was given; the side is the reverse of squaring.`,
        `side = √(area). If you wrote ${sn}, you may have stopped at the area instead of taking its square root.`
      );

    case 'reverse_square_divided':
      return pick(
        `÷4 doesn’t undo a square — different inverse.`,
        `side = √(area).`
      );

    case 'reverse_rect_forgot_subtract':
      return pick(
        `Half the perimeter is length + breadth — one piece is known.`,
        `Missing side = (P ÷ 2) minus the side you already know.`
      );

    case 'reverse_gave_input':
      return pick(
        `That number is already in the text — the task is to find something else.`,
        `Compute the unknown from the givens; don’t restate a value you read.`
      );

    // ── EXTENDED PERIMETER — Square ──────────────────────────────────────────

    case 'square_three_sides_perimeter':
      return pick(
        `Three sides isn’t a full square — how many edges on the boundary?`,
        `Use 4 × side, not 3.`
      );

    case 'square_one_side_only':
      return pick(
        `Perimeter is the whole walk around — not one edge.`,
        `4 × side.`
      );

    // ── EXTENDED PERIMETER — Rectangle ───────────────────────────────────────

    case 'rect_two_lengths_only':
      return pick(
        `Both long sides, but the two short sides are missing.`,
        `Perimeter = 2l + 2b — add the breadth pair.`
      );

    case 'rect_two_breadths_only':
      return pick(
        `Both short sides, but the two long sides are missing.`,
        `Add the length pair: 2l + 2b.`
      );

    // ── EXTENDED AREA — Rectangle ────────────────────────────────────────────

    case 'rect_triangle_area':
      return pick(
        `A rectangle isn’t a triangle — no halving of l × b.`,
        `Area = l × b. Drop any ÷2.`
      );

    case 'rect_side_squared':
      return pick(
        `You used one side twice (a square). A rectangle has two different sides in the product.`,
        `Area = length × breadth.`
      );

    // ── EXTENDED AREA — Circle ───────────────────────────────────────────────

    case 'circle_diameter_as_radius_area':
      return pick(
        `Answer much too big — often diameter was used as r in πr².`,
        `Use r = diameter ÷ 2, then π × r × r.`
      );

    // ── EXTENDED SA — Cube ───────────────────────────────────────────────────

    case 'cube_three_faces_sa':
      return pick(
        `Six faces on a cube — not three.`,
        `Total = 6 × (one face area).`
      );

    case 'cube_five_faces_sa':
      return pick(
        `Five faces leaves one face out.`,
        `All six: 6a².`
      );

    // ── EXTENDED SA — Cuboid ─────────────────────────────────────────────────

    case 'cuboid_lateral_sa_only':
      return pick(
        `Four walls only, or top and bottom too?`,
        `If total outside is asked, add the top and bottom to the four walls.`
      );

    // ── EXTENDED SA — Cylinder ───────────────────────────────────────────────

    case 'cylinder_one_circle_sa':
      return pick(
        `One round end plus the wrap — the other end is still missing.`,
        `Both circular caps count equally.`
      );

    // ── EXTENDED VOLUME — Cube ───────────────────────────────────────────────

    case 'cube_twelve_edges_volume':
      return pick(
        `12 × edge is total edge length, not space inside.`,
        `Volume = edge × edge × edge.`
      );

    // ── EXTENDED VOLUME — Cylinder ───────────────────────────────────────────

    case 'cylinder_diameter_as_radius_vol':
      return pick(
        `Volume far too large — diameter-as-r inflates r² by 4×.`,
        `r = diameter ÷ 2 before πr²h.`
      );

    // ── COST PROBLEMS ────────────────────────────────────────────────────────

    case 'cost_forgot_rate':
      return pick(
        `You likely have metres or m² — cost still needs the price per unit.`,
        `Multiply your length or area by the rate (₹/m or ₹/m²).`
      );

    case 'cost_wrong_measure':
      return pick(
        `Is the rate per metre of fence or per square metre of floor?`,
        `Match: per m² → area then × rate; per m → perimeter/length then × rate.`
      );

    // ── Generic algebraic (+/−/×/÷ confusion from question numbers) ─────────

    case 'algebraic_subtract_instead_multiply':
      return pick(
        `You wrote ${sn}. Could that be from subtracting when the numbers should combine with ×?`,
        `Use multiplication for the same pair — not subtraction.`
      );

    case 'algebraic_divide_instead_multiply':
      return pick(
        `You have ${sn}. Did you divide where the problem needs a product?`,
        `Multiply those two values instead of dividing.`
      );

    case 'algebraic_multiply_instead_divide':
      return pick(
        `${sn} looks inflated — did you multiply where you should split or share?`,
        `Try ÷ instead of × for that step.`
      );

    case 'algebraic_add_instead_divide':
      return pick(
        `You entered ${sn}. Does that look like a sum when “how many fit” or equal shares need ÷?`,
        `Divide the right total by the right part — don’t add them.`
      );

    case 'algebraic_divide_instead_add':
      return pick(
        `You got ${sn}. Did you divide two pieces that should be combined first?`,
        `Add the parts (+), then continue if there’s another step.`
      );

    case 'algebraic_subtract_instead_add':
      return pick(
        `${sn} fits subtraction — did the question ask for a total of parts?`,
        `Add the amounts instead of subtracting.`
      );

    // ── DEFAULT ──────────────────────────────────────────────────────────────

    default: {
      const isReverse = qType === 'reverse_find' || qType === 'fill_in_blank';
      const lead = errorInfo?.hintLead;
      if (lead && String(lead).trim()) {
        const clean = String(lead).replace(/^⚠️\s*|^❌\s*/, '').replace(/\s*Formula:.*$/i, '').trim();
        return pick(
          `You got ${sn}. Here’s a tighter read on what went wrong:`,
          clean || `Re-check + vs ×, ÷ vs −, squaring, and radius vs diameter.`
        );
      }
      return pick(
        isReverse
          ? `You got ${sn}. You’re solving for something inside a relation — undo steps from the outside in.`
          : `You got ${sn}. Walk the numbers again: watch × vs +, ÷ vs −, and r vs diameter.`,
        isReverse
          ? `Undo × with ÷, √ with ², etc., until the unknown is alone.`
          : `Say each operation aloud; match “around,” “inside,” “faces,” or “fills” to the right chain.`
      );
    }
  }
}

module.exports = { buildPersonalizedHint };
