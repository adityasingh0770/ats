/**
 * Concept-level remedial copy — clear, beginner-friendly, with steps and common-mistake warnings.
 */
const byKey = {
  perimeter_square: {
    oneLiner: 'Perimeter = total fence length around all 4 equal sides.',
    intro:
      'A square has 4 sides that are all the same length. Perimeter is the total distance you walk if you go all the way around it — visiting every side exactly once.',
    bullets: [
      'Find the side length — call it s.',
      'Since all 4 sides are equal, add them: s + s + s + s = 4s.',
      'Formula: P = 4 × s.',
      'Unit is cm or m (a length) — never cm² or m² (those are area units).',
    ],
    steps: [
      'Write: P = 4 × s',
      'Pick s from the question.',
      'Multiply: 4 × s = your answer.',
      'Write the unit (cm or m).',
    ],
    keyMistake:
      'Do not square the side (s × s gives area, not perimeter). Do not use 2 × s — that counts only two sides out of four.',
  },

  perimeter_rectangle: {
    oneLiner: 'Perimeter = 2 × (length + breadth) — two long sides and two short sides.',
    intro:
      'A rectangle has two pairs of equal sides. To find the full boundary, add one length and one breadth, then double the result because there are two of each.',
    bullets: [
      'Identify length (l) and breadth (b).',
      'Add them: l + b (this is just one long + one short side).',
      'Double it: 2 × (l + b) — now all four sides are counted.',
      'Unit is cm or m, never cm².',
    ],
    steps: [
      'Write: P = 2 × (l + b)',
      'Find l and b in the question.',
      'Add inside the brackets first: l + b.',
      'Multiply by 2.',
      'Write the unit.',
    ],
    keyMistake:
      'Do not multiply l × b — that gives area, not perimeter. Do not use just l + b — you need to double it to include both pairs of sides.',
  },

  perimeter_circle: {
    oneLiner: 'Circumference = 2 × π × radius — the full distance around a circle.',
    intro:
      'The boundary of a circle is called its circumference. It depends on the radius (r), which is the distance from the centre to the rim. The constant π ≈ 22/7 is always needed.',
    bullets: [
      'Find the radius (r). If the question gives diameter, halve it: r = diameter ÷ 2.',
      'Formula: C = 2 × π × r (use π = 22/7 unless told otherwise).',
      'Multiply: 2 × 22/7 × r.',
      'Unit is cm or m.',
    ],
    steps: [
      'Check: does the question give radius or diameter?',
      'If diameter: r = diameter ÷ 2.',
      'Write: C = 2 × (22/7) × r',
      'Multiply step by step.',
      'Write the unit.',
    ],
    keyMistake:
      'Do not forget the 2 in 2πr — missing it gives πr (only half). Do not skip π — 2r is just the diameter, not the circumference.',
  },

  area_square: {
    oneLiner: 'Area = side × side = s² — the space the square covers.',
    intro:
      'Area tells you how many unit squares fit inside the square. Because all sides are equal, you just multiply the side by itself.',
    bullets: [
      'Find the side length s.',
      'Multiply: A = s × s = s².',
      'Unit is cm² or m² — always squared (area measures flat surface).',
      'Perimeter uses 4 × s; area uses s × s — they are different.',
    ],
    steps: [
      'Write: A = s × s',
      'Find s from the question.',
      'Multiply: s × s.',
      'Write the unit (cm² or m²).',
    ],
    keyMistake:
      'Do not use 4 × s — that is perimeter, not area. Make sure you square s (multiply it by itself), not just write it once.',
  },

  area_rectangle: {
    oneLiner: 'Area = length × breadth — the flat space inside the rectangle.',
    intro:
      'Area counts how many unit squares tile the inside of the rectangle. You find it by multiplying the two different side lengths together.',
    bullets: [
      'Identify length (l) and breadth (b).',
      'Multiply: A = l × b.',
      'Unit is cm² or m² (area).',
      'Perimeter = 2(l+b); area = l × b — do not mix them.',
    ],
    steps: [
      'Write: A = l × b',
      'Find l and b from the question.',
      'Multiply them together.',
      'Write the unit (cm² or m²).',
    ],
    keyMistake:
      'Do not use 2(l + b) — that is perimeter. Area is a single multiplication: l × b, nothing more.',
  },

  area_circle: {
    oneLiner: 'Area = π × r² — the flat space inside the circle.',
    intro:
      'The area of a circle uses the radius squared. You must square r first, then multiply by π (22/7). Circumference uses r once; area uses r².',
    bullets: [
      'Find radius r. If diameter is given: r = diameter ÷ 2.',
      'Square the radius: r² = r × r.',
      'Multiply by π: A = π × r² = (22/7) × r².',
      'Unit is cm² or m².',
    ],
    steps: [
      'Check: radius or diameter given?',
      'If diameter: r = d ÷ 2.',
      'Write: A = (22/7) × r × r',
      'Compute r × r first.',
      'Then multiply by 22/7.',
      'Write the unit (cm² or m²).',
    ],
    keyMistake:
      'Do not forget to square r (πr is not area). Do not forget π (r² alone is not area). Circumference = 2πr; area = πr² — notice r is squared for area.',
  },

  surface_area_cube: {
    oneLiner: 'Surface area = 6 × side² — all 6 identical square faces.',
    intro:
      'A cube has 6 faces, and every face is an identical square. To find the total surface area, find the area of one face (side²) and multiply by 6.',
    bullets: [
      'Find the edge length a.',
      'Area of one face = a × a = a².',
      'A cube has 6 faces: TSA = 6 × a².',
      'Unit is cm² or m² (area, not volume).',
    ],
    steps: [
      'Write: TSA = 6 × a²',
      'Find a from the question.',
      'Compute a² = a × a.',
      'Multiply by 6.',
      'Write the unit (cm²).',
    ],
    keyMistake:
      'Do not use a³ — that is volume. Do not forget to multiply by 6 — one face area (a²) is not the total SA. Do not use 6 × a without squaring.',
  },

  surface_area_cuboid: {
    oneLiner: 'Surface area = 2(lb + bh + lh) — add all three face pairs, then double.',
    intro:
      'A cuboid has 3 pairs of rectangular faces. Each pair has two identical faces (top+bottom, front+back, left+right). Find the area of each pair, add them, then multiply by 2.',
    bullets: [
      'Find l (length), b (breadth), h (height).',
      'Compute three face areas: l×b, b×h, l×h.',
      'Add them: lb + bh + lh.',
      'Multiply by 2 (each face appears twice): TSA = 2(lb + bh + lh).',
      'Unit is cm² or m².',
    ],
    steps: [
      'Write: TSA = 2 × (lb + bh + lh)',
      'Find l, b, h from the question.',
      'Calculate lb, bh, lh separately.',
      'Add all three.',
      'Multiply the total by 2.',
      'Write the unit (cm²).',
    ],
    keyMistake:
      'Do not forget the factor of 2 (lb+bh+lh is only half the SA). Do not use l×b×h — that is volume, not surface area.',
  },

  surface_area_cylinder: {
    oneLiner: 'TSA = 2πr(r + h) = curved surface + two circular caps.',
    intro:
      'A cylinder has two parts: a curved wall and two flat circular ends. The curved part unrolls into a rectangle; the caps are circles. Add them for total SA.',
    bullets: [
      'Find radius r and height h.',
      'Curved surface area (CSA) = 2 × π × r × h.',
      'Two circular caps = 2 × π × r².',
      'Total SA = CSA + caps = 2πrh + 2πr² = 2πr(r + h).',
      'Unit is cm² or m².',
    ],
    steps: [
      'Write: TSA = 2 × (22/7) × r × (r + h)',
      'Find r and h.',
      'Compute (r + h) first.',
      'Multiply: 2 × (22/7) × r × (r + h).',
      'Write the unit (cm²).',
    ],
    keyMistake:
      'Do not use only 2πrh — that is the curved surface only; add 2πr² for the caps. Do not forget the factor of 2 in 2πrh.',
  },

  volume_cube: {
    oneLiner: 'Volume = edge³ = a × a × a — space inside the cube.',
    intro:
      'Volume measures how much space is inside the cube. Since all three dimensions (length, width, height) are equal, you multiply the edge by itself three times.',
    bullets: [
      'Find the edge length a.',
      'Multiply three times: V = a × a × a = a³.',
      'Unit is cm³ or m³ (volume = 3D, so cubed units).',
      'Surface area uses a²; volume uses a³ — different powers.',
    ],
    steps: [
      'Write: V = a × a × a',
      'Find a from the question.',
      'Multiply: a × a = a², then a² × a = a³.',
      'Write the unit (cm³).',
    ],
    keyMistake:
      'Do not use 6a² — that is surface area. Do not use a² — you need three multiplications, not two.',
  },

  volume_cuboid: {
    oneLiner: 'Volume = length × breadth × height — space inside the box.',
    intro:
      'Volume tells you how much the cuboid can hold. Multiply all three different dimensions together.',
    bullets: [
      'Find l (length), b (breadth), h (height).',
      'Multiply all three: V = l × b × h.',
      'Unit is cm³ or m³.',
      'If you forget height, you only get the base area — a flat, 2D answer.',
    ],
    steps: [
      'Write: V = l × b × h',
      'Find l, b, h from the question.',
      'Multiply all three numbers.',
      'Write the unit (cm³).',
    ],
    keyMistake:
      'Do not stop at l × b — that is the base area only. All three dimensions are required for volume.',
  },

  volume_cylinder: {
    oneLiner: 'Volume = π × r² × h — base circle area × height.',
    intro:
      'Volume = base circle area × height. The base is a circle (area = πr²). Then multiply by the height to fill the whole cylinder.',
    bullets: [
      'Find radius r (not diameter) and height h.',
      'Base area = π × r² = (22/7) × r × r.',
      'Volume = base area × height = π × r² × h.',
      'Unit is cm³ or m³.',
    ],
    steps: [
      'Write: V = (22/7) × r × r × h',
      'Find r and h.',
      'Compute r × r first.',
      'Multiply by 22/7.',
      'Multiply by h.',
      'Write the unit (cm³).',
    ],
    keyMistake:
      'Do not forget to square r (V = πrh misses the squaring). Do not forget to multiply by h (πr² is the base area only, not the volume).',
  },
};

function getRemedialSimple(conceptKey) {
  return (
    byKey[conceptKey] || {
      oneLiner: 'Review the idea step by step.',
      intro: 'Read the formula slowly and match each symbol to the question.',
      bullets: [
        'Write the formula from memory.',
        'Identify every variable in the question.',
        'Substitute and calculate one step at a time.',
      ],
      steps: ['Write the formula.', 'Substitute numbers.', 'Calculate carefully.'],
      keyMistake: 'Make sure you are using the correct formula for what the question asks.',
    }
  );
}

module.exports = { getRemedialSimple };
