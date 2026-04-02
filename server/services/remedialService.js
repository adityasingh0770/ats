const { getByConceptKey } = require('../store/contentCache');
const { buildLessonSlides } = require('../data/conceptLessonBuilder');
const { getRemedialSimple } = require('../data/remedialSimple');

let remedialMedia = {};
try {
  remedialMedia = require('../data/remedialMedia.json');
} catch {
  /* optional file */
}

// ── Per-error insight descriptions ───────────────────────────────────────────
// Each entry: { label, category, whatYouDid, whyWrong, fix, remember }
const ERROR_INSIGHT = {
  // Perimeter — Square
  square_two_sides_perimeter: {
    label: 'Counted only 2 sides',
    category: 'Missing sides',
    whatYouDid: 'You multiplied 2 × side — counting only two sides.',
    whyWrong: 'A square has 4 equal sides, not 2.',
    fix: 'Multiply by 4: P = 4 × side.',
    remember: 'P = 4 × s',
  },
  square_area_instead_of_perimeter: {
    label: 'Used area formula for perimeter',
    category: 'Formula mix-up',
    whatYouDid: 'You squared the side (s × s).',
    whyWrong: 's² gives the area (space inside). Perimeter is the boundary around the square.',
    fix: 'Use P = 4 × s — add all four sides, do not square.',
    remember: 'P = 4 × s  (not s²)',
  },
  square_perimeter_subtract_instead_multiply: {
    label: 'Subtracted instead of multiplying by 4',
    category: 'Wrong operation',
    whatYouDid: 'You combined the side and 4 with subtraction (e.g. side − 4).',
    whyWrong: 'The “4” in P = 4 × side means four equal sides — you multiply the side by 4, not subtract.',
    fix: 'Compute 4 × side (multiplication), not side − 4.',
    remember: 'P = 4 × s  (multiply, don’t subtract the 4)',
  },

  // Perimeter — Rectangle
  rect_multiply_instead_of_perimeter: {
    label: 'Multiplied length × breadth for perimeter',
    category: 'Formula mix-up',
    whatYouDid: 'You computed l × b.',
    whyWrong: 'l × b gives the area — the space inside. Perimeter is the boundary distance.',
    fix: 'Use P = 2 × (l + b): add the two different sides, then double.',
    remember: 'P = 2(l + b)  (not l × b)',
  },
  rect_sum_only_perimeter: {
    label: 'Forgot to double l + b',
    category: 'Incomplete formula',
    whatYouDid: 'You added l + b and stopped there.',
    whyWrong: 'l + b counts only one length and one breadth — half the rectangle.',
    fix: 'Multiply by 2: P = 2 × (l + b) to include all four sides.',
    remember: 'P = 2 × (l + b)  — doubling is essential',
  },
  rect_perimeter_instead_of_area: {
    label: 'Used perimeter formula for area',
    category: 'Formula mix-up',
    whatYouDid: 'You applied 2(l + b) when area was needed.',
    whyWrong: '2(l + b) is the perimeter (boundary), not the area (inside space).',
    fix: 'Area = l × b — a single multiplication, no doubling.',
    remember: 'Area = l × b  (not 2(l+b))',
  },
  area_instead_of_perimeter_rect: {
    label: 'Used area formula for perimeter',
    category: 'Formula mix-up',
    whatYouDid: 'You multiplied l × b when perimeter was asked.',
    whyWrong: 'l × b gives area (inside space). Perimeter needs all four sides added.',
    fix: 'P = 2(l + b): add l and b, then double.',
    remember: 'P = 2(l + b)  (not l × b)',
  },
  perimeter_instead_of_area_rect: {
    label: 'Used perimeter formula for area',
    category: 'Formula mix-up',
    whatYouDid: 'You applied the perimeter approach (adding sides).',
    whyWrong: 'Perimeter measures the boundary. Area measures the inside space.',
    fix: 'Area = l × b — multiply length and breadth directly.',
    remember: 'Area = l × b',
  },
  multiply_instead_of_add: {
    label: 'Multiplied where you should have added',
    category: 'Wrong operation',
    whatYouDid: 'You multiplied two values that needed to be added.',
    whyWrong: 'The formula requires adding those values first before any other operation.',
    fix: 'Add the values inside the brackets first, then continue.',
    remember: 'Check: + inside brackets before ×',
  },
  add_instead_of_multiply: {
    label: 'Added where you should have multiplied',
    category: 'Wrong operation',
    whatYouDid: 'You added values that the formula needs to be multiplied.',
    whyWrong: 'Addition and multiplication give very different results here.',
    fix: 'Multiply those values as the formula directs.',
    remember: 'Re-read the formula sign: + or ×?',
  },

  // Perimeter — Circle
  circle_forgot_multiply_by_2: {
    label: 'Missing the "2" in 2πr',
    category: 'Incomplete formula',
    whatYouDid: 'You computed π × r without the 2.',
    whyWrong: 'Circumference = 2πr. The "2" accounts for going all the way around — not just halfway.',
    fix: 'Multiply by 2: C = 2 × π × r.',
    remember: 'C = 2πr  — the 2 is not optional',
  },
  circle_area_for_circumference: {
    label: 'Used area formula (πr²) for circumference',
    category: 'Formula mix-up',
    whatYouDid: 'You used πr² — that is the area formula.',
    whyWrong: 'πr² gives the space inside the circle (area), not the distance around it.',
    fix: 'Circumference = 2πr — no squaring of r.',
    remember: 'C = 2πr  |  Area = πr²  — different formulas!',
  },
  forgot_pi_circumference: {
    label: 'Left out π in circumference',
    category: 'Missing constant',
    whatYouDid: 'You computed 2 × r without π.',
    whyWrong: '2r is the diameter — not the circumference. π must always be included.',
    fix: 'C = 2 × π × r. Use π = 22/7.',
    remember: 'Every circle formula needs π',
  },

  // Area — Square
  square_perimeter_instead_of_area: {
    label: 'Used perimeter formula (4s) for area',
    category: 'Formula mix-up',
    whatYouDid: 'You computed 4 × side.',
    whyWrong: '4s gives the perimeter (boundary). Area = how much flat space the square covers.',
    fix: 'Area = s × s = s².',
    remember: 'Area = s²  |  Perimeter = 4s',
  },

  // Area — Circle
  circle_circumference_for_area: {
    label: 'Used circumference formula (2πr) for area',
    category: 'Formula mix-up',
    whatYouDid: 'You applied 2πr — the circumference formula.',
    whyWrong: '2πr gives the distance around (circumference). Area needs r to be squared.',
    fix: 'Area = π × r × r = πr².',
    remember: 'Area = πr²  |  C = 2πr',
  },
  circle_forgot_square_radius: {
    label: 'Did not square the radius in area formula',
    category: 'Incomplete formula',
    whatYouDid: 'You computed π × r instead of π × r².',
    whyWrong: 'The area formula is πr² — r must be multiplied by itself first.',
    fix: 'Compute r × r first, then multiply by π.',
    remember: 'Area = π × r × r  (r appears twice)',
  },
  forgot_pi_area: {
    label: 'Left out π in area formula',
    category: 'Missing constant',
    whatYouDid: 'You computed r² without multiplying by π.',
    whyWrong: 'r² alone is just a number — the formula requires π × r².',
    fix: 'Area = (22/7) × r × r.',
    remember: 'Every circle formula needs π',
  },

  // Surface Area — Cube
  cube_one_face_sa: {
    label: 'Calculated area of only 1 face',
    category: 'Missing faces',
    whatYouDid: 'You computed a² — the area of one face only.',
    whyWrong: 'A cube has 6 identical square faces. You need all 6.',
    fix: 'Multiply by 6: TSA = 6 × a².',
    remember: 'TSA = 6a²  (6 faces, each = a²)',
  },
  cube_two_faces_sa: {
    label: 'Calculated area of only 2 faces',
    category: 'Missing faces',
    whatYouDid: 'You computed 2a² — counting only the top and bottom faces.',
    whyWrong: 'A cube has 4 more side faces to include.',
    fix: 'TSA = 6 × a² — include all 6 faces.',
    remember: 'TSA = 6a²  (top + bottom + 4 sides)',
  },
  cube_four_faces_sa: {
    label: 'Used lateral SA (4a²) instead of total SA (6a²)',
    category: 'Wrong formula variant',
    whatYouDid: 'You computed 4a² — the four side faces only.',
    whyWrong: 'Lateral SA (4a²) excludes the top and bottom faces. TSA includes all 6.',
    fix: 'Check what the question asks: LSA = 4a², TSA = 6a².',
    remember: 'LSA = 4a²  |  TSA = 6a²',
  },
  cube_volume_for_sa: {
    label: 'Used volume formula (a³) for surface area',
    category: 'Formula mix-up',
    whatYouDid: 'You computed a³ — the volume.',
    whyWrong: 'a³ = volume (space inside). Surface area = all outer faces = 6a².',
    fix: 'TSA = 6 × a × a = 6a².',
    remember: 'SA = 6a²  |  Volume = a³',
  },
  cube_linear_sa: {
    label: 'Multiplied 6 × a without squaring',
    category: 'Incomplete formula',
    whatYouDid: 'You multiplied 6 × a (linear, not squared).',
    whyWrong: 'Surface area is in square units — each face area = a², not a.',
    fix: 'TSA = 6 × a × a = 6a². Square the edge first.',
    remember: 'TSA = 6a²  (a must be squared)',
  },

  // Surface Area — Cuboid
  cuboid_no_factor_2_sa: {
    label: 'Forgot the factor of 2 in TSA formula',
    category: 'Incomplete formula',
    whatYouDid: 'You computed lb + bh + lh without multiplying by 2.',
    whyWrong: 'Each face has an identical opposite — top/bottom, front/back, left/right. Each pair has 2 faces.',
    fix: 'TSA = 2 × (lb + bh + lh). Always multiply by 2.',
    remember: 'TSA = 2(lb + bh + lh)  — the 2 doubles every pair',
  },
  cuboid_volume_for_sa: {
    label: 'Used volume formula (l×b×h) for surface area',
    category: 'Formula mix-up',
    whatYouDid: 'You multiplied l × b × h — giving volume.',
    whyWrong: 'l × b × h = volume (space inside). Surface area sums all face areas.',
    fix: 'TSA = 2(lb + bh + lh).',
    remember: 'SA = 2(lb+bh+lh)  |  Volume = l×b×h',
  },
  cuboid_partial_sa: {
    label: 'Included only one pair of faces',
    category: 'Missing faces',
    whatYouDid: 'You computed only one pair of faces (e.g., top + bottom = 2lb).',
    whyWrong: 'A cuboid has 3 pairs: top+bottom (2lb), front+back (2lh), left+right (2bh).',
    fix: 'Add all three pairs: TSA = 2lb + 2lh + 2bh = 2(lb+lh+bh).',
    remember: 'TSA needs all 3 pairs of faces',
  },

  // Surface Area — Cylinder
  cylinder_lateral_only_sa: {
    label: 'Used only curved surface (2πrh) — missed the two circles',
    category: 'Missing parts',
    whatYouDid: 'You computed 2πrh — the curved surface only.',
    whyWrong: 'A closed cylinder also has a circular cap on top and one on the bottom.',
    fix: 'TSA = 2πrh + 2πr² = 2πr(r + h).',
    remember: 'TSA = 2πr(r + h)  = CSA + 2 circles',
  },
  cylinder_only_circles_sa: {
    label: 'Included only the two circular ends',
    category: 'Missing parts',
    whatYouDid: 'You computed 2πr² — the two circular caps only.',
    whyWrong: 'You missed the curved side wall (CSA = 2πrh).',
    fix: 'TSA = 2πrh + 2πr² = 2πr(r + h).',
    remember: 'TSA = curved wall + 2 circles',
  },
  cylinder_volume_for_sa: {
    label: 'Used volume formula (πr²h) for surface area',
    category: 'Formula mix-up',
    whatYouDid: 'You applied πr²h — that gives volume.',
    whyWrong: 'πr²h = volume. Surface area is the outer covering, not the space inside.',
    fix: 'TSA = 2πr(r + h)  or  CSA = 2πrh.',
    remember: 'SA = 2πr(r+h)  |  Volume = πr²h',
  },
  cylinder_forgot_factor_2_csa: {
    label: 'Missing the "2" in CSA = 2πrh',
    category: 'Incomplete formula',
    whatYouDid: 'You computed πrh — missing the factor of 2.',
    whyWrong: 'CSA = 2πrh. The "2" comes from the circumference (2πr) unrolled times height.',
    fix: 'CSA = 2 × π × r × h. Do not drop the 2.',
    remember: 'CSA = 2πrh  (2 is essential)',
  },

  // Volume — Cube
  cube_sa_for_volume: {
    label: 'Used surface area formula (6a²) for volume',
    category: 'Formula mix-up',
    whatYouDid: 'You computed 6a² — the surface area.',
    whyWrong: '6a² covers the outside. Volume fills the inside — different formula.',
    fix: 'Volume = a × a × a = a³.',
    remember: 'Volume = a³  |  SA = 6a²',
  },
  cube_squared_for_volume: {
    label: 'Squared the edge instead of cubing',
    category: 'Wrong power',
    whatYouDid: 'You computed a² instead of a³.',
    whyWrong: 'a² is a flat area (2D). Volume needs three dimensions — multiply by a one more time.',
    fix: 'Volume = a × a × a = a³.',
    remember: 'Volume = a³  (3D needs 3 multiplications)',
  },
  cube_linear_for_volume: {
    label: 'Used a linear expression for volume',
    category: 'Wrong formula',
    whatYouDid: 'You computed something linear (like 6a) instead of a³.',
    whyWrong: 'Volume fills 3D space — a linear number cannot represent it.',
    fix: 'Volume = a × a × a = a³.',
    remember: 'Volume = a³',
  },

  // Volume — Cuboid
  cuboid_forgot_height_volume: {
    label: 'Used only 2 dimensions — forgot height',
    category: 'Missing dimension',
    whatYouDid: 'You multiplied only two of the three dimensions.',
    whyWrong: 'Volume is 3D — all three dimensions (l, b, h) must be multiplied together.',
    fix: 'V = l × b × h — include all three.',
    remember: 'Volume = l × b × h  (all 3 dimensions)',
  },
  cuboid_sa_for_volume: {
    label: 'Used surface area formula for volume',
    category: 'Formula mix-up',
    whatYouDid: 'You computed 2(lb + bh + lh) — the surface area.',
    whyWrong: 'That formula covers the outer faces. Volume = space inside = l × b × h.',
    fix: 'V = l × b × h — a simple triple product.',
    remember: 'Volume = l×b×h  |  SA = 2(lb+bh+lh)',
  },
  cuboid_added_dims_volume: {
    label: 'Added l + b + h instead of multiplying',
    category: 'Wrong operation',
    whatYouDid: 'You added the three dimensions together.',
    whyWrong: 'Adding gives a length, not a 3D volume. Volume requires multiplication.',
    fix: 'V = l × b × h — multiply all three.',
    remember: 'Volume = l × b × h  (multiply, not add)',
  },

  // Volume — Cylinder
  cylinder_forgot_height_volume: {
    label: 'Forgot to multiply by height',
    category: 'Missing dimension',
    whatYouDid: 'You computed πr² — the base circle area only.',
    whyWrong: 'πr² is the flat base (2D). Volume fills the entire height of the cylinder.',
    fix: 'V = π × r² × h — multiply base area by height.',
    remember: 'Volume = πr²h  (base × height)',
  },
  cylinder_csa_for_volume: {
    label: 'Used CSA formula (2πrh) for volume',
    category: 'Formula mix-up',
    whatYouDid: 'You computed 2πrh — the curved surface area.',
    whyWrong: '2πrh is the surface (outer wall), not the space inside.',
    fix: 'V = π × r² × h.',
    remember: 'Volume = πr²h  |  CSA = 2πrh',
  },
  cylinder_tsa_for_volume: {
    label: 'Used TSA formula for volume',
    category: 'Formula mix-up',
    whatYouDid: 'You applied 2πr(r + h) — the total surface area.',
    whyWrong: 'TSA is the outer covering. Volume is the space inside — completely different.',
    fix: 'V = π × r² × h.',
    remember: 'Volume = πr²h  |  TSA = 2πr(r+h)',
  },
  cylinder_forgot_square_r: {
    label: 'Did not square r in volume formula',
    category: 'Wrong power',
    whatYouDid: 'You computed π × r × h instead of π × r² × h.',
    whyWrong: 'V = πr²h — the radius must be squared before multiplying by h.',
    fix: 'Compute r × r first, then multiply by π and h.',
    remember: 'Volume = π × r × r × h  (r appears twice)',
  },

  // General
  radius_diameter_confusion: {
    label: 'Confused radius and diameter',
    category: 'Wrong input value',
    whatYouDid: 'You may have used the radius where diameter was needed, or vice versa.',
    whyWrong: 'Radius = half the diameter. Using the wrong one doubles or halves your answer.',
    fix: 'r = d ÷ 2. Convert once before plugging into the formula.',
    remember: 'r = d / 2  — always convert first',
  },
  formula_swap: {
    label: 'Used the wrong formula type',
    category: 'Formula mix-up',
    whatYouDid: 'You applied a formula for a different measurement than what was asked.',
    whyWrong: 'Perimeter, area, surface area, and volume are four different things with different formulas.',
    fix: 'Re-read the question: boundary → perimeter; inside → area; all faces → SA; holds → volume.',
    remember: 'Match the formula to the question keyword',
  },
  sa_volume_confusion: {
    label: 'Mixed up surface area and volume',
    category: 'Formula mix-up',
    whatYouDid: 'You swapped the surface area and volume formulas.',
    whyWrong: 'SA = all outer faces (cm²). Volume = space inside (cm³). Completely different measurements.',
    fix: 'Confirm what the question asks, then choose only that formula.',
    remember: 'SA uses cm²  |  Volume uses cm³',
  },
  unit_error: {
    label: 'Unit conversion error',
    category: 'Unit mistake',
    whatYouDid: 'You likely mixed cm and m (or cm² and m²) in the same calculation.',
    whyWrong: '1 m = 100 cm. If you mix them, your answer is off by a factor of 100 or 10,000.',
    fix: 'Convert everything to one unit before substituting into the formula.',
    remember: '1 m = 100 cm  |  1 m² = 10 000 cm²',
  },
  arithmetic_mistake: {
    label: 'Arithmetic / calculation error',
    category: 'Calculation slip',
    whatYouDid: 'Your formula choice looks right, but the final number is off.',
    whyWrong: 'A small slip in multiplication, division, or handling fractions like 22/7 changed the answer.',
    fix: 'Redo each step slowly: write intermediate results, especially when using 22/7.',
    remember: 'Write every step — spot the slip before it compounds',
  },
  partial_formula: {
    label: 'Incomplete formula application',
    category: 'Incomplete formula',
    whatYouDid: 'Your answer is smaller than expected — you likely stopped partway through.',
    whyWrong: 'A factor or step was missing from your calculation.',
    fix: 'Write the full formula, substitute every symbol, and evaluate completely.',
    remember: 'Do not stop until every symbol in the formula has a number',
  },

  // Reverse-find
  reverse_gave_perimeter: {
    label: 'Wrote down the given value — not the answer',
    category: 'Reverse-find error',
    whatYouDid: 'You wrote the perimeter that was already in the question.',
    whyWrong: 'The question gives you the perimeter and asks for the side length.',
    fix: 'Work backwards: if P = 4 × s, then s = P ÷ 4.',
    remember: 'Side = Perimeter ÷ 4',
  },
  reverse_square_half: {
    label: 'Divided by 2 instead of 4',
    category: 'Reverse-find error',
    whatYouDid: 'You halved the perimeter (P ÷ 2).',
    whyWrong: 'P = 4 × side, not 2 × side. A square has 4 equal sides.',
    fix: 'Side = P ÷ 4.',
    remember: 'Perimeter ÷ 4 = one side of a square',
  },
  reverse_multiplied: {
    label: 'Multiplied instead of dividing',
    category: 'Reverse-find error',
    whatYouDid: 'You multiplied by 4 instead of dividing.',
    whyWrong: 'The question gives P — you need to undo the × 4 by dividing.',
    fix: 'Side = P ÷ 4. Division reverses multiplication.',
    remember: 'To find side from perimeter: ÷ 4',
  },
  reverse_gave_area: {
    label: 'Wrote down the given area — not the side',
    category: 'Reverse-find error',
    whatYouDid: 'You wrote the area that was already given in the question.',
    whyWrong: 'The question asks for the side length, not the area.',
    fix: 'Side = √area. Take the square root of the given area.',
    remember: 'Area = s²  →  s = √Area',
  },
  reverse_square_divided: {
    label: 'Divided area by 4 instead of square-rooting',
    category: 'Reverse-find error',
    whatYouDid: 'You divided the area by 4.',
    whyWrong: 'Area = s², so the inverse is square root — not division by 4.',
    fix: 'Side = √area.',
    remember: 's = √Area  (not Area ÷ 4)',
  },
  reverse_rect_forgot_subtract: {
    label: 'Halved the perimeter but forgot to subtract the known side',
    category: 'Reverse-find error',
    whatYouDid: 'You computed P ÷ 2 and used that as the answer.',
    whyWrong: 'P ÷ 2 = l + b. You still need to subtract the known side to isolate the unknown one.',
    fix: 'Missing side = (P ÷ 2) − known side.',
    remember: 'l + b = P/2  →  missing side = P/2 − known side',
  },
  reverse_gave_input: {
    label: 'Entered a value already in the question',
    category: 'Reverse-find error',
    whatYouDid: 'You wrote a number that was already given in the question.',
    whyWrong: 'The question provides known values to use — the unknown must be calculated.',
    fix: 'Set up the formula, substitute the known values, solve for the unknown.',
    remember: 'Rearrange the formula to isolate the unknown',
  },

  // Extended perimeter — Square
  square_three_sides_perimeter: {
    label: 'Counted only 3 sides instead of 4',
    category: 'Missing sides',
    whatYouDid: 'You multiplied 3 × side.',
    whyWrong: 'A square has 4 equal sides, not 3.',
    fix: 'P = 4 × side. The multiplier must be 4.',
    remember: 'P = 4 × s  (always 4)',
  },
  square_one_side_only: {
    label: 'Wrote just the side length — not the perimeter',
    category: 'Missing sides',
    whatYouDid: 'You submitted the side value without multiplying.',
    whyWrong: 'Perimeter is the total of all four sides, not just one.',
    fix: 'P = 4 × side. Multiply the side by 4.',
    remember: 'P = 4 × s',
  },

  // Extended perimeter — Rectangle
  rect_two_lengths_only: {
    label: 'Counted only the two lengths — forgot both breadths',
    category: 'Missing sides',
    whatYouDid: 'You computed 2 × l and stopped.',
    whyWrong: 'A rectangle has two lengths AND two breadths. Both pairs must be counted.',
    fix: 'P = 2 × l + 2 × b = 2(l + b).',
    remember: 'P = 2(l + b)  — include both pairs',
  },
  rect_two_breadths_only: {
    label: 'Counted only the two breadths — forgot both lengths',
    category: 'Missing sides',
    whatYouDid: 'You computed 2 × b and stopped.',
    whyWrong: 'A rectangle has two breadths AND two lengths. Both pairs must be counted.',
    fix: 'P = 2 × l + 2 × b = 2(l + b).',
    remember: 'P = 2(l + b)  — include both pairs',
  },

  // Extended area — Rectangle
  rect_triangle_area: {
    label: 'Applied triangle area formula (½ l × b) to a rectangle',
    category: 'Wrong formula',
    whatYouDid: 'You halved the product l × b.',
    whyWrong: 'Halving is for triangles (Area = ½ × base × height). A rectangle uses the full product.',
    fix: 'Rectangle area = l × b. No division by 2.',
    remember: 'Rectangle: A = l × b  |  Triangle: A = ½ × b × h',
  },
  rect_side_squared: {
    label: 'Squared one side — treated rectangle as a square',
    category: 'Wrong formula',
    whatYouDid: 'You computed l² or b², using only one dimension.',
    whyWrong: 'A rectangle has two different side lengths — both must be multiplied.',
    fix: 'Area = l × b — multiply the two different dimensions.',
    remember: 'Area = l × b  (both sides, different values)',
  },

  // Extended area — Circle
  circle_diameter_as_radius_area: {
    label: 'Used diameter as radius in area formula — answer is 4× too large',
    category: 'Wrong input value',
    whatYouDid: 'You used the full diameter value as r in A = πr².',
    whyWrong: 'r = diameter ÷ 2. Using d as r gives πd² = 4πr² — four times the correct area.',
    fix: 'Convert first: r = diameter ÷ 2, then compute A = πr².',
    remember: 'r = d / 2  — always convert before squaring',
  },

  // Extended SA — Cube
  cube_three_faces_sa: {
    label: 'Multiplied by 3 — counted only 3 of 6 faces',
    category: 'Missing faces',
    whatYouDid: 'You computed 3 × a².',
    whyWrong: 'A cube has 6 identical square faces, not 3.',
    fix: 'TSA = 6 × a². Multiply by 6.',
    remember: 'TSA = 6a²  (6 faces total)',
  },
  cube_five_faces_sa: {
    label: 'Multiplied by 5 — missed one face',
    category: 'Missing faces',
    whatYouDid: 'You computed 5 × a².',
    whyWrong: 'A cube has exactly 6 faces — one was left out.',
    fix: 'TSA = 6 × a². Multiply by 6, not 5.',
    remember: 'TSA = 6a²  (top + bottom + 4 sides = 6)',
  },

  // Extended SA — Cuboid
  cuboid_lateral_sa_only: {
    label: 'Computed only lateral SA = 2h(l+b) — missed top and bottom',
    category: 'Missing parts',
    whatYouDid: 'You computed 2h(l+b) — the four side walls only.',
    whyWrong: 'Lateral SA excludes the top and bottom faces (2lb). TSA includes all six faces.',
    fix: 'TSA = 2(lb+bh+lh). Add 2lb to the lateral SA to get TSA.',
    remember: 'LSA = 2h(l+b)  |  TSA = 2(lb+bh+lh)',
  },

  // Extended SA — Cylinder
  cylinder_one_circle_sa: {
    label: 'Added only one circular cap instead of two',
    category: 'Missing parts',
    whatYouDid: 'You computed 2πrh + πr² — including only one circular end.',
    whyWrong: 'A cylinder has two identical circular caps (top and bottom). Both must be included.',
    fix: 'TSA = 2πrh + 2πr² = 2πr(r+h). Add πr² twice, not once.',
    remember: 'TSA = 2πr(r+h)  = curved + 2 circles',
  },

  // Extended Volume — Cube
  cube_twelve_edges_volume: {
    label: 'Computed 12 × edge — total edge length, not volume',
    category: 'Wrong formula',
    whatYouDid: 'You multiplied 12 × edge length.',
    whyWrong: 'A cube has 12 edges; 12a is the total wire length of its frame — not a volume measure.',
    fix: 'Volume = a × a × a = a³.',
    remember: 'Volume = a³  (not 12a)',
  },

  // Extended Volume — Cylinder
  cylinder_diameter_as_radius_vol: {
    label: 'Used diameter as radius in volume formula — answer is 4× too large',
    category: 'Wrong input value',
    whatYouDid: 'You used the full diameter as r in V = πr²h.',
    whyWrong: 'r = diameter ÷ 2. Using d as r gives πd²h = 4πr²h — four times the correct volume.',
    fix: 'Convert first: r = diameter ÷ 2, then compute V = πr²h.',
    remember: 'r = d / 2  — convert before squaring',
  },

  // Cost problems
  cost_forgot_rate: {
    label: 'Found the measure but forgot to multiply by cost rate',
    category: 'Incomplete calculation',
    whatYouDid: 'You calculated the area or perimeter correctly but did not multiply by the cost rate.',
    whyWrong: 'The question asks for total cost, not just the measurement.',
    fix: 'Total cost = measurement × rate per unit. One more multiplication needed.',
    remember: 'Cost = area (or perimeter) × rate',
  },
  cost_wrong_measure: {
    label: 'Used the wrong formula type for the cost calculation',
    category: 'Formula mix-up',
    whatYouDid: 'You used the wrong measurement (e.g., perimeter instead of area, or vice versa) for the cost.',
    whyWrong: 'The rate in the question tells you which formula to use: "per m²" → area; "per m" → perimeter.',
    fix: 'Identify the rate unit, choose the matching formula, then multiply.',
    remember: 'per m² → area × rate  |  per m → perimeter × rate',
  },

  // Generic algebraic (operation confusion)
  algebraic_subtract_instead_multiply: {
    label: 'Subtracted instead of multiplying',
    category: 'Wrong operation',
    whatYouDid: 'You subtracted two values that should be multiplied.',
    whyWrong: 'Taking a difference shrinks the total; the problem needed a product (scaling or repeated parts).',
    fix: 'Use × between those two numbers, not −.',
    remember: '“How many” or “all parts together” → often ×, not −',
  },
  algebraic_divide_instead_multiply: {
    label: 'Divided instead of multiplying',
    category: 'Wrong operation',
    whatYouDid: 'You divided where a product was needed.',
    whyWrong: 'Division splits; the question asked you to combine into one larger value.',
    fix: 'Multiply the two quantities instead of dividing.',
    remember: 'If the answer should grow with both inputs → ×',
  },
  algebraic_multiply_instead_divide: {
    label: 'Multiplied instead of dividing',
    category: 'Wrong operation',
    whatYouDid: 'You multiplied where sharing or splitting was needed.',
    whyWrong: 'Multiplication inflates the value; the situation called for fair shares or “how many fit”.',
    fix: 'Divide the appropriate total by the given part.',
    remember: 'Splitting / per-unit → often ÷',
  },
  algebraic_add_instead_divide: {
    label: 'Added instead of dividing',
    category: 'Wrong operation',
    whatYouDid: 'You added when you needed to split or scale down.',
    whyWrong: 'A sum is too large; the problem needed a ratio or equal parts.',
    fix: 'Use division on the values from the problem instead of adding them.',
    remember: 'Equal parts or “how many in one” → ÷',
  },
  algebraic_divide_instead_add: {
    label: 'Divided instead of adding',
    category: 'Wrong operation',
    whatYouDid: 'You divided parts that should be totaled.',
    whyWrong: 'The question asked for a combined amount, not a share.',
    fix: 'Add the relevant amounts first, then apply any other step.',
    remember: 'Total / together → + before other ops',
  },
  algebraic_subtract_instead_add: {
    label: 'Subtracted instead of adding',
    category: 'Wrong operation',
    whatYouDid: 'You subtracted where a total was needed.',
    whyWrong: 'Difference misses one of the parts the problem tells you to include.',
    fix: 'Add the pieces (+), don’t take the difference.',
    remember: '“Total” / “all together” → sum with +',
  },

  // MCQ / T-F
  wrong_option: {
    label: 'Incorrect MCQ option selected',
    category: 'MCQ error',
    whatYouDid: 'You chose an option that does not match the formula result.',
    whyWrong: 'The correct option is whatever the formula produces for the given numbers.',
    fix: 'Calculate the answer using the formula, then match it to the choices.',
    remember: 'Compute first, choose after',
  },
  wrong_verdict: {
    label: 'Wrong True / False verdict',
    category: 'True-False error',
    whatYouDid: 'You chose the opposite verdict from what the calculation shows.',
    whyWrong: 'The verdict must match the result of applying the formula to the statement.',
    fix: 'Compute both sides of the statement using the formula. Equal → True; Not equal → False.',
    remember: 'Evaluate the formula, then decide True or False',
  },
  invalid_input: {
    label: 'Non-numeric input entered',
    category: 'Input error',
    whatYouDid: 'You entered text, units, or symbols instead of a plain number.',
    whyWrong: 'The system can only check numeric answers.',
    fix: 'Type only the number (e.g. 44 or 3.5). No units, no letters.',
    remember: 'Answer box: numbers only',
  },
  wrong_answer: {
    label: 'Answer did not match',
    category: 'Unidentified error',
    whatYouDid: 'Your answer was different from the expected result.',
    whyWrong: 'The specific mistake pattern could not be pinpointed automatically.',
    fix: 'Write the full formula, substitute every value from the question, and re-evaluate step by step.',
    remember: 'Write every step — do not skip ahead',
  },
  unknown: {
    label: 'Answer did not match',
    category: 'Unidentified error',
    whatYouDid: 'Your answer was different from the expected result.',
    whyWrong: 'The specific mistake could not be identified automatically.',
    fix: 'Write the formula in full, substitute values one by one, and check each step.',
    remember: 'Write every step — do not skip ahead',
  },
};

// ── Human-readable error labels for "Your tries" ─────────────────────────────
const ERROR_TYPE_LABELS = Object.fromEntries(
  Object.entries(ERROR_INSIGHT).map(([k, v]) => [k, v.label])
);

function labelErrorType(type) {
  return ERROR_TYPE_LABELS[type] || String(type || 'other').replace(/_/g, ' ');
}

/**
 * Build a deduplicated list of personalized error insight cards
 * from the session's wrong attempts.
 */
function buildErrorInsights(wrongAttempts) {
  if (!Array.isArray(wrongAttempts) || !wrongAttempts.length) return [];

  // Collect { type, count, lastAnswer }
  const byType = {};
  for (const w of wrongAttempts) {
    const t = w.errorType || 'unknown';
    if (!byType[t]) byType[t] = { count: 0, lastAnswer: w.submittedAnswer };
    byType[t].count += 1;
    byType[t].lastAnswer = w.submittedAnswer;
  }

  // Map to insight entries, most frequent first
  return Object.entries(byType)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([type, { count, lastAnswer }]) => {
      const insight = ERROR_INSIGHT[type] || ERROR_INSIGHT['unknown'];
      return {
        type,
        count,
        lastAnswer,
        label: insight.label,
        category: insight.category,
        whatYouDid: insight.whatYouDid,
        whyWrong: insight.whyWrong,
        fix: insight.fix,
        remember: insight.remember,
      };
    });
}

/**
 * Summarise every wrong submission this session (all tries), for display.
 */
function buildSessionTryDigest(wrongAttempts) {
  if (!wrongAttempts || !wrongAttempts.length) {
    return { hasTries: false, totalSubmissions: 0, byType: {}, tries: [] };
  }
  const byType = {};
  const tries = wrongAttempts.map((w, i) => {
    const t = w.errorType || 'unknown';
    byType[t] = (byType[t] || 0) + 1;
    return {
      n: i + 1,
      answer: w.submittedAnswer,
      kind: labelErrorType(t),
      qid: w.qid || null,
    };
  });
  return {
    hasTries: true,
    totalSubmissions: wrongAttempts.length,
    byType,
    tries,
  };
}

const getRemedialContent = async (topic, shape, ctx = {}) => {
  const conceptKey = `${topic}_${shape}`;
  const content = getByConceptKey(conceptKey);
  const simple = getRemedialSimple(conceptKey);
  const digest = buildSessionTryDigest(ctx.wrongAttempts);
  const errorInsights = buildErrorInsights(ctx.wrongAttempts);
  const media = remedialMedia[conceptKey] || {};

  const figures = Array.isArray(content?.figures) ? content.figures : [];

  if (!content) {
    return {
      title: `${String(shape || '').charAt(0).toUpperCase() + String(shape || '').slice(1)} — ${String(topic || '').replace(/_/g, ' ')}`,
      tagline: simple.oneLiner,
      intro: simple.intro,
      basicsBullets: simple.bullets,
      stepsToSolve: simple.steps || [],
      keyMistake: simple.keyMistake || null,
      explanation: simple.intro,
      sessionDigest: digest,
      errorInsights,
      formula: 'Refer to your textbook.',
      formulaBreakdown: '',
      workedExample: '',
      simpleQuestion: null,
      figures: [],
      gifUrl: media.gifUrl || null,
      gifCaption: media.gifCaption || null,
    };
  }

  return {
    title: content.title,
    tagline: simple.oneLiner,
    intro: simple.intro,
    basicsBullets: simple.bullets,
    stepsToSolve: simple.steps || [],
    keyMistake: simple.keyMistake || null,
    explanation: `${simple.intro}\n\n${content.remedial?.explanation || ''}`.trim(),
    sessionDigest: digest,
    errorInsights,
    formula: content.formula,
    formulaBreakdown: content.remedial?.formulaBreakdown || '',
    workedExample: content.remedial?.workedExample || '',
    simpleQuestion: content.remedial?.simpleQuestion || null,
    figures,
    gifUrl: media.gifUrl || null,
    gifCaption: media.gifCaption || null,
  };
};

const getConceptMaterial = async (topic, shape) => {
  const conceptKey = `${topic}_${shape}`;
  const content = getByConceptKey(conceptKey);
  if (!content) return null;

  const formulasFromExtras = Array.isArray(content.formulas) ? content.formulas : null;
  const formulas =
    formulasFromExtras?.length
      ? formulasFromExtras
      : content.formula
        ? [{ name: 'Formula', formula: content.formula }]
        : [];

  const lessonSlides = buildLessonSlides(conceptKey, content);

  return {
    title: content.title,
    explanation: content.explanation,
    detailParagraphs: content.detailParagraphs || [],
    formula: content.formula,
    formulas,
    keyFacts: content.keyFacts || [],
    example: content.example,
    visualHint: content.visualHint,
    tip: content.visualHint,
    figures: content.figures || [],
    lessonSlides,
  };
};

module.exports = { getRemedialContent, getConceptMaterial, buildSessionTryDigest };
