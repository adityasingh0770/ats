/**
 * Very simple, general remedial copy per concept (not tied to a single wrong answer).
 */
const byKey = {
  perimeter_square: {
    oneLiner: 'Perimeter = distance once around the shape.',
    intro: 'A square has four equal sides. Walking around it once means you count that side four times.',
    bullets: [
      'Measure one side and call it s.',
      'Add all four sides: s + s + s + s — same as 4 × s.',
      'Use cm or m (length units), never cm².',
    ],
  },
  perimeter_rectangle: {
    oneLiner: 'Go around the rectangle: two lengths and two breadths.',
    intro: 'Opposite sides match. The full walk is length + breadth + length + breadth.',
    bullets: [
      'Add length and breadth first, then double: 2 × (l + b).',
      'Do not multiply l × b here — that is area, not perimeter.',
      'Check: both lengths and both breadths are included.',
    ],
  },
  perimeter_circle: {
    oneLiner: 'Around a circle is called circumference.',
    intro: 'Use the radius r from the centre to the rim (or half the diameter).',
    bullets: [
      'Formula C = 2 × π × r (often π = 22/7 in class).',
      'If the problem gives diameter, divide by 2 to get r first.',
      'Radius and diameter are easy to mix up — read the question twice.',
    ],
  },
  area_square: {
    oneLiner: 'Area = space inside the square.',
    intro: 'It is how many unit squares fit inside — same as side × side.',
    bullets: [
      'A = s × s (also written s²).',
      'Units are squared: cm², m².',
      'Perimeter uses 4 × s; area uses s × s — don’t swap them.',
    ],
  },
  area_rectangle: {
    oneLiner: 'Area = how much floor the rectangle covers.',
    intro: 'Multiply how long by how wide.',
    bullets: [
      'A = length × breadth.',
      'Units are cm² or m².',
      'If you added l + b, that is only part of the story — area needs the product.',
    ],
  },
  area_circle: {
    oneLiner: 'Area inside the circle uses the radius squared.',
    intro: 'Always use radius r in A = π × r × r.',
    bullets: [
      'If you see diameter, split by 2 to get r first.',
      'r² means r × r, not 2 × r.',
      'π is often 22/7 in Grade 8 — use what the question says.',
    ],
  },
  surface_area_cube: {
    oneLiner: 'Surface area = all faces painted — six matching squares.',
    intro: 'A cube has 6 equal square faces.',
    bullets: [
      'One face = side × side; six faces → 6 × side².',
      'Units are cm², m² (area, not cm³).',
      'Don’t confuse with volume (space inside).',
    ],
  },
  surface_area_cuboid: {
    oneLiner: 'Add areas of all six rectangles.',
    intro: 'Opposite faces are equal — top/bottom, front/back, left/right.',
    bullets: [
      'SA = 2(lb + bh + hl) using length l, breadth b, height h.',
      'Sketch the box and label l, b, h before substituting.',
      'Volume uses l × b × h; surface area sums face areas.',
    ],
  },
  surface_area_cylinder: {
    oneLiner: 'Curved surface + two circles (top and bottom).',
    intro: 'Imagine unrolling the curved part — it is a rectangle; caps are circles.',
    bullets: [
      'Curved part: 2πrh; two circles: 2πr² (add them for total SA).',
      'Radius r is from the axis to the rim.',
      'Watch π and r² — squaring mistakes are common.',
    ],
  },
  volume_cube: {
    oneLiner: 'Volume = space inside — side × side × side.',
    intro: 'A cube is the same edge length three ways.',
    bullets: [
      'V = edge³ or edge × edge × edge.',
      'Units are cm³, m³.',
      'Surface area counts squares on the outside; volume fills the inside.',
    ],
  },
  volume_cuboid: {
    oneLiner: 'Volume = how much the box holds.',
    intro: 'Multiply the three different edge lengths.',
    bullets: [
      'V = length × breadth × height.',
      'Units are cm³ or m³.',
      'If two numbers are given, you may need a third from the diagram.',
    ],
  },
  volume_cylinder: {
    oneLiner: 'Volume = base area × height.',
    intro: 'Base is a circle: πr², then multiply by height h.',
    bullets: [
      'V = π × r² × h.',
      'Use radius, not diameter, unless you convert first.',
      'Compare with surface-area formulas so you don’t mix them up.',
    ],
  },
};

function getRemedialSimple(conceptKey) {
  return (
    byKey[conceptKey] || {
      oneLiner: 'Review the idea step by step.',
      intro: 'Read the formula slowly and match each symbol to the diagram.',
      bullets: ['Write the formula.', 'Substitute numbers.', 'Calculate carefully.'],
    }
  );
}

module.exports = { getRemedialSimple };
