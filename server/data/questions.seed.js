/**
 * 120 Mensuration questions — Grade 8 NCERT standard
 * 4 topics × 3 levels × 10 questions = 120
 * All circle/cylinder calculations use π = 22/7
 */

const questions = [

  // ════════════════════════════════════════════════════════
  //  PERIMETER — EASY  (P-E-01 to P-E-10)
  // ════════════════════════════════════════════════════════

  {
    qid: 'P-E-01', topic: 'perimeter', shape: 'square', difficulty: 'beginner',
    type: 'direct_calculation',
    question: 'Find the perimeter of a square with side 7 cm.',
    answer: 28, unit: 'cm', formula: 'P = 4 × a',
    solution_steps: ['Formula: P = 4 × a', 'Substitute: P = 4 × 7', 'P = 28 cm'],
    hints: {
      level1: 'Think about the formula for the perimeter of a square. A square has four equal sides.',
      level2: 'Substitute a = 7 into the formula P = 4 × a.',
      level3: 'P = 4 × 7 = ___ cm',
    },
    remedial: {
      concept_recap: 'Perimeter is the total length of the boundary. A square has 4 equal sides, so we multiply one side by 4.',
      formula: 'Perimeter of Square = 4 × a',
      worked_example: 'Square with side = 5 cm → P = 4 × 5 = 20 cm',
      common_mistake: 'Students often add only 2 sides (2 × a) instead of all 4 sides.',
      memory_tip: '"Four sides, four times" — multiply the side by 4.',
    },
    expectedTime: 40,
  },

  {
    qid: 'P-E-02', topic: 'perimeter', shape: 'rectangle', difficulty: 'beginner',
    type: 'mcq',
    question: 'What is the perimeter of a rectangle with length 8 cm and breadth 5 cm?',
    answer: 26, unit: 'cm', formula: 'P = 2 × (l + b)',
    options: { A: '26 cm', B: '40 cm', C: '13 cm', D: '16 cm' },
    correct_option: 'A',
    solution_steps: ['Formula: P = 2 × (l + b)', 'Substitute: P = 2 × (8 + 5) = 2 × 13', 'P = 26 cm'],
    hints: {
      level1: 'The perimeter of a rectangle uses both its length and its breadth. Which formula involves adding them?',
      level2: 'Substitute l = 8 and b = 5 into P = 2 × (l + b).',
      level3: 'P = 2 × (8 + 5) = 2 × 13 = ___ cm',
    },
    remedial: {
      concept_recap: 'A rectangle has two pairs of equal opposite sides. The perimeter adds all four sides: l + b + l + b = 2(l + b).',
      formula: 'P = 2 × (l + b)',
      worked_example: 'Rectangle l = 10 cm, b = 4 cm → P = 2(10 + 4) = 2 × 14 = 28 cm',
      common_mistake: 'A common mistake is just adding l + b once (forgetting to multiply by 2).',
      memory_tip: '"Two pairs" — multiply the sum of l and b by 2.',
    },
    expectedTime: 40,
  },

  {
    qid: 'P-E-03', topic: 'perimeter', shape: 'circle', difficulty: 'beginner',
    type: 'fill_in_blank',
    question: 'The circumference of a circle with radius 7 cm is ___ cm. (Use π = 22/7)',
    answer: 44, unit: 'cm', formula: 'C = 2 × π × r',
    solution_steps: ['Formula: C = 2 × π × r', 'Substitute: C = 2 × (22/7) × 7', 'C = 2 × 22 = 44 cm'],
    hints: {
      level1: 'The perimeter of a circle is called its circumference. Recall the formula involving π and r.',
      level2: 'Substitute r = 7 and π = 22/7 into C = 2 × π × r.',
      level3: 'C = 2 × (22/7) × 7 = 2 × 22 = ___ cm',
    },
    remedial: {
      concept_recap: 'The circumference (perimeter) of a circle is the distance around it. It depends on the radius and π.',
      formula: 'C = 2 × π × r  (where π = 22/7)',
      worked_example: 'Circle with r = 14 cm → C = 2 × (22/7) × 14 = 2 × 44 = 88 cm',
      common_mistake: 'Using diameter instead of radius, or forgetting to multiply by 2.',
      memory_tip: '"Two pi r" — remember 2πr for circumference.',
    },
    expectedTime: 45,
  },

  {
    qid: 'P-E-04', topic: 'perimeter', shape: 'square', difficulty: 'beginner',
    type: 'true_false',
    question: 'True or False: A square with side 9 cm has a perimeter of 36 cm.',
    answer: 1, unit: '', formula: 'P = 4 × a',
    correct_verdict: 'True',
    reason: 'P = 4 × 9 = 36 cm, so the statement is correct.',
    solution_steps: ['Formula: P = 4 × a', 'Substitute: P = 4 × 9', 'P = 36 cm — True'],
    hints: {
      level1: 'Apply the formula for perimeter of a square and check if the result matches 36 cm.',
      level2: 'Calculate P = 4 × 9 and compare with 36.',
      level3: 'P = 4 × 9 = 36 cm. Is 36 cm = 36 cm?',
    },
    remedial: {
      concept_recap: 'Perimeter of a square = 4 × side. All four sides of a square are equal.',
      formula: 'P = 4 × a',
      worked_example: 'Square side = 7 cm → P = 4 × 7 = 28 cm',
      common_mistake: 'Confusing perimeter (4 × a) with area (a²).',
      memory_tip: '"Four sides, four times" — multiply the side by 4.',
    },
    expectedTime: 30,
  },

  {
    qid: 'P-E-05', topic: 'perimeter', shape: 'rectangle', difficulty: 'beginner',
    type: 'direct_calculation',
    question: 'Find the perimeter of a rectangle with length 15 cm and breadth 9 cm.',
    answer: 48, unit: 'cm', formula: 'P = 2 × (l + b)',
    solution_steps: ['Formula: P = 2 × (l + b)', 'Substitute: P = 2 × (15 + 9) = 2 × 24', 'P = 48 cm'],
    hints: {
      level1: 'The perimeter of a rectangle uses the formula involving length and breadth.',
      level2: 'Substitute l = 15 and b = 9 into P = 2 × (l + b).',
      level3: 'P = 2 × (15 + 9) = 2 × 24 = ___ cm',
    },
    remedial: {
      concept_recap: 'The perimeter of a rectangle is the total distance around it. Add both the length and breadth, then multiply by 2.',
      formula: 'P = 2 × (l + b)',
      worked_example: 'Rectangle l = 12 cm, b = 5 cm → P = 2(12 + 5) = 2 × 17 = 34 cm',
      common_mistake: 'Forgetting to multiply the sum by 2, giving only (l + b).',
      memory_tip: '"2 pairs of parallel sides" — always multiply by 2.',
    },
    expectedTime: 40,
  },

  {
    qid: 'P-E-06', topic: 'perimeter', shape: 'circle', difficulty: 'beginner',
    type: 'mcq',
    question: 'What is the circumference of a circle with diameter 21 cm? (Use π = 22/7)',
    answer: 66, unit: 'cm', formula: 'C = 2 × π × r',
    options: { A: '44 cm', B: '33 cm', C: '66 cm', D: '132 cm' },
    correct_option: 'C',
    solution_steps: ['Diameter = 21 cm → r = 21/2 = 10.5 cm', 'C = 2 × (22/7) × 10.5 = 2 × 33 = 66 cm'],
    hints: {
      level1: 'When a diameter is given, first find the radius before applying C = 2πr.',
      level2: 'r = diameter ÷ 2 = 21 ÷ 2 = 10.5. Now substitute r = 10.5 into C = 2 × (22/7) × r.',
      level3: 'C = 2 × (22/7) × 10.5 = 2 × 33 = ___ cm',
    },
    remedial: {
      concept_recap: 'Circumference = 2πr. When you are given the diameter, divide by 2 to get the radius first.',
      formula: 'r = diameter ÷ 2; C = 2 × π × r',
      worked_example: 'Diameter = 14 cm → r = 7 cm → C = 2 × (22/7) × 7 = 44 cm',
      common_mistake: 'Using diameter directly in the formula instead of converting to radius.',
      memory_tip: '"Diameter is double the radius" — always halve the diameter first.',
    },
    expectedTime: 50,
  },

  {
    qid: 'P-E-07', topic: 'perimeter', shape: 'square', difficulty: 'beginner',
    type: 'fill_in_blank',
    question: 'A square has a perimeter of 36 cm. Its side length is ___ cm.',
    answer: 9, unit: 'cm', formula: 'side = P ÷ 4',
    solution_steps: ['Formula: P = 4 × a → a = P ÷ 4', 'Substitute: a = 36 ÷ 4', 'a = 9 cm'],
    hints: {
      level1: 'The perimeter of a square is 4 times the side. To find the side, reverse this operation.',
      level2: 'Use the formula side = Perimeter ÷ 4. Substitute P = 36.',
      level3: 'side = 36 ÷ 4 = ___ cm',
    },
    remedial: {
      concept_recap: 'If P = 4 × a, then a = P ÷ 4. Divide the perimeter by 4 to find the side of a square.',
      formula: 'side = P ÷ 4',
      worked_example: 'Perimeter = 48 cm → side = 48 ÷ 4 = 12 cm',
      common_mistake: 'Dividing by 2 instead of 4 (confusing with rectangle formula).',
      memory_tip: '"Perimeter of square = 4a" — work backwards by dividing by 4.',
    },
    expectedTime: 40,
  },

  {
    qid: 'P-E-08', topic: 'perimeter', shape: 'rectangle', difficulty: 'beginner',
    type: 'reverse_find',
    question: 'The perimeter of a rectangle is 50 cm and its length is 15 cm. Find its breadth.',
    answer: 10, unit: 'cm', formula: 'b = (P ÷ 2) − l',
    solution_steps: ['P = 2(l + b) → l + b = P ÷ 2 = 25', 'b = 25 − l = 25 − 15', 'b = 10 cm'],
    hints: {
      level1: 'Use P = 2(l + b) and rearrange to find b.',
      level2: 'From P = 50: l + b = 50 ÷ 2 = 25. Now subtract l = 15.',
      level3: 'b = 25 − 15 = ___ cm',
    },
    remedial: {
      concept_recap: 'Rearranging P = 2(l + b): first find (l + b) = P ÷ 2, then subtract the known side.',
      formula: 'b = (P ÷ 2) − l',
      worked_example: 'P = 40, l = 12 → l + b = 20 → b = 20 − 12 = 8 cm',
      common_mistake: 'Forgetting to divide P by 2 before subtracting the length.',
      memory_tip: '"Halve the perimeter, then subtract the known side."',
    },
    expectedTime: 50,
  },

  {
    qid: 'P-E-09', topic: 'perimeter', shape: 'circle', difficulty: 'beginner',
    type: 'direct_calculation',
    question: 'Find the circumference of a circle with radius 21 cm. (Use π = 22/7)',
    answer: 132, unit: 'cm', formula: 'C = 2 × π × r',
    solution_steps: ['Formula: C = 2 × π × r', 'Substitute: C = 2 × (22/7) × 21', 'C = 2 × 66 = 132 cm'],
    hints: {
      level1: 'Apply the circumference formula C = 2πr directly.',
      level2: 'Substitute r = 21 and π = 22/7 into C = 2 × π × r.',
      level3: 'C = 2 × (22/7) × 21 = 2 × 66 = ___ cm',
    },
    remedial: {
      concept_recap: 'Circumference = 2πr. Choose r = 21 so that 22/7 × 21 gives a whole number.',
      formula: 'C = 2 × (22/7) × r',
      worked_example: 'r = 7 cm → C = 2 × (22/7) × 7 = 2 × 22 = 44 cm',
      common_mistake: 'Not simplifying 22/7 × 21 = 66 correctly (forgetting that 7 cancels).',
      memory_tip: '"22/7 times r — cancel 7 with multiples of 7 in r."',
    },
    expectedTime: 45,
  },

  {
    qid: 'P-E-10', topic: 'perimeter', shape: 'square', difficulty: 'beginner',
    type: 'mcq',
    question: 'A square park has a side of 25 m. What length of wire is needed to fence it once?',
    answer: 100, unit: 'm', formula: 'P = 4 × a',
    options: { A: '50 m', B: '625 m', C: '25 m', D: '100 m' },
    correct_option: 'D',
    solution_steps: ['Formula: P = 4 × a', 'Substitute: P = 4 × 25', 'P = 100 m'],
    hints: {
      level1: 'Fencing around a square means finding its perimeter.',
      level2: 'Substitute a = 25 into P = 4 × a.',
      level3: 'P = 4 × 25 = ___ m',
    },
    remedial: {
      concept_recap: 'Perimeter = total boundary length = 4 × side for a square.',
      formula: 'P = 4 × a',
      worked_example: 'Square side = 10 m → P = 4 × 10 = 40 m of wire needed.',
      common_mistake: 'Calculating area (side²) instead of perimeter.',
      memory_tip: '"Wire = fencing = perimeter" — use 4 × a.',
    },
    expectedTime: 35,
  },

  // ════════════════════════════════════════════════════════
  //  PERIMETER — MEDIUM  (P-M-01 to P-M-10)
  // ════════════════════════════════════════════════════════

  {
    qid: 'P-M-01', topic: 'perimeter', shape: 'rectangle', difficulty: 'intermediate',
    type: 'word_problem',
    question: 'A rectangular garden is 18 m long and 12 m wide. A person walks twice around the garden. Find the total distance walked.',
    answer: 120, unit: 'm', formula: 'P = 2 × (l + b)',
    solution_steps: [
      'Perimeter = 2 × (18 + 12) = 2 × 30 = 60 m',
      'Total distance for 2 rounds = 2 × 60',
      'Distance = 120 m',
    ],
    hints: {
      level1: 'First find the perimeter of the garden, then use the number of rounds.',
      level2: 'P = 2(18 + 12) = 60 m. The person walks 2 rounds, so multiply by 2.',
      level3: 'Total distance = 2 × 60 = ___ m',
    },
    remedial: {
      concept_recap: 'The perimeter of a rectangle is 2(l + b). For multiple rounds, multiply perimeter by the number of rounds.',
      formula: 'P = 2 × (l + b); Total = P × rounds',
      worked_example: 'Garden 10 m × 8 m, 3 rounds → P = 36 m → Total = 3 × 36 = 108 m',
      common_mistake: 'Forgetting to multiply perimeter by the number of rounds.',
      memory_tip: '"Perimeter × rounds = total distance walked."',
    },
    expectedTime: 75,
  },

  {
    qid: 'P-M-02', topic: 'perimeter', shape: 'circle', difficulty: 'intermediate',
    type: 'reverse_find',
    question: 'The circumference of a circular track is 132 m. Find the radius of the track. (Use π = 22/7)',
    answer: 21, unit: 'm', formula: 'r = C ÷ (2π)',
    solution_steps: [
      'C = 2πr → 132 = 2 × (22/7) × r',
      'r = 132 × 7 ÷ (2 × 22) = 924 ÷ 44',
      'r = 21 m',
    ],
    hints: {
      level1: 'Use C = 2πr and rearrange to solve for r.',
      level2: 'Rearrange: r = C ÷ (2π) = 132 ÷ (2 × 22/7). Multiply numerator and denominator carefully.',
      level3: 'r = 132 × 7 ÷ 44 = 924 ÷ 44 = ___ m',
    },
    remedial: {
      concept_recap: 'From C = 2πr, isolate r by dividing both sides by 2π. With π = 22/7, this gives r = C × 7 ÷ 44.',
      formula: 'r = C × 7 ÷ 44  (when π = 22/7)',
      worked_example: 'C = 88 m → r = 88 × 7 ÷ 44 = 616 ÷ 44 = 14 m',
      common_mistake: 'Multiplying by 2π instead of dividing, giving r = C × 2π.',
      memory_tip: '"Divide circumference by 2π to get the radius."',
    },
    expectedTime: 80,
  },

  {
    qid: 'P-M-03', topic: 'perimeter', shape: 'square', difficulty: 'intermediate',
    type: 'fill_in_blank',
    question: 'If the perimeter of a square is increased from 28 cm to 36 cm, the side increases by ___ cm.',
    answer: 2, unit: 'cm', formula: 'side = P ÷ 4',
    solution_steps: [
      'Old side = 28 ÷ 4 = 7 cm',
      'New side = 36 ÷ 4 = 9 cm',
      'Increase = 9 − 7 = 2 cm',
    ],
    hints: {
      level1: 'Find the old side and new side using side = P ÷ 4, then subtract.',
      level2: 'Old side = 28 ÷ 4 = 7 cm; New side = 36 ÷ 4 = 9 cm.',
      level3: 'Increase in side = 9 − 7 = ___ cm',
    },
    remedial: {
      concept_recap: 'side = P ÷ 4. To find the change in side length, find the side for each perimeter and subtract.',
      formula: 'side = P ÷ 4; Change = new side − old side',
      worked_example: 'P changes from 20 to 32 → sides: 5 and 8 → increase = 3 cm',
      common_mistake: 'Subtracting perimeters (36−28=8) and treating that as the side increase.',
      memory_tip: '"Find each side first, then find the difference."',
    },
    expectedTime: 70,
  },

  {
    qid: 'P-M-04', topic: 'perimeter', shape: 'rectangle', difficulty: 'intermediate',
    type: 'mcq',
    question: 'A rectangle has a perimeter of 50 cm and its length is 15 cm. What is its breadth?',
    answer: 10, unit: 'cm', formula: 'b = (P ÷ 2) − l',
    options: { A: '35 cm', B: '20 cm', C: '10 cm', D: '25 cm' },
    correct_option: 'C',
    solution_steps: [
      'l + b = P ÷ 2 = 50 ÷ 2 = 25',
      'b = 25 − l = 25 − 15',
      'b = 10 cm',
    ],
    hints: {
      level1: 'Use P = 2(l + b) and rearrange to find b.',
      level2: 'l + b = P ÷ 2 = 25. Now substitute l = 15 and solve for b.',
      level3: 'b = 25 − 15 = ___ cm',
    },
    remedial: {
      concept_recap: 'Rearrange P = 2(l + b) → l + b = P/2 → b = P/2 − l.',
      formula: 'b = (P ÷ 2) − l',
      worked_example: 'P = 40, l = 12 → b = 20 − 12 = 8 cm',
      common_mistake: 'Using b = P − l (forgetting the ÷ 2 step).',
      memory_tip: '"Halve the perimeter, then subtract the length to get breadth."',
    },
    expectedTime: 70,
  },

  {
    qid: 'P-M-05', topic: 'perimeter', shape: 'circle', difficulty: 'intermediate',
    type: 'cost_problem',
    question: 'A circular garden has a radius of 21 m. A farmer wants to put a fence around it. If fencing costs ₹15 per metre, find the total cost. (Use π = 22/7)',
    answer: 1980, unit: '₹', formula: 'C = 2 × π × r',
    solution_steps: [
      'C = 2 × (22/7) × 21 = 2 × 66 = 132 m',
      'Cost = C × rate = 132 × 15',
      'Cost = ₹1980',
    ],
    hints: {
      level1: 'First find the circumference (fencing length), then multiply by the cost per metre.',
      level2: 'C = 2 × (22/7) × 21 = 132 m. Now multiply by ₹15.',
      level3: 'Cost = 132 × 15 = ₹___',
    },
    remedial: {
      concept_recap: 'Fencing a circular area = finding its circumference. Then cost = circumference × rate per unit.',
      formula: 'C = 2πr; Cost = C × rate',
      worked_example: 'r = 14 m → C = 88 m; at ₹10/m → cost = ₹880',
      common_mistake: 'Calculating area instead of circumference before multiplying by rate.',
      memory_tip: '"Fencing follows the boundary = circumference, not area."',
    },
    expectedTime: 90,
  },

  {
    qid: 'P-M-06', topic: 'perimeter', shape: 'square', difficulty: 'intermediate',
    type: 'comparison',
    question: 'Find the difference in perimeter between a square of side 12 cm and a rectangle of length 15 cm and breadth 7 cm.',
    answer: 4, unit: 'cm', formula: 'P_square = 4a;  P_rect = 2(l + b)',
    solution_steps: [
      'Square P = 4 × 12 = 48 cm',
      'Rectangle P = 2(15 + 7) = 2 × 22 = 44 cm',
      'Difference = 48 − 44 = 4 cm (Square has greater perimeter)',
    ],
    hints: {
      level1: 'Calculate the perimeter of each shape separately using the correct formula.',
      level2: 'Square: P = 4 × 12 = 48 cm. Rectangle: P = 2(15 + 7) = 44 cm.',
      level3: 'Difference = 48 − 44 = ___ cm',
    },
    remedial: {
      concept_recap: 'Compare perimeters by calculating each separately, then finding the difference.',
      formula: 'Square: P = 4a; Rectangle: P = 2(l + b)',
      worked_example: 'Square side 10 cm (P=40) vs Rectangle 13×7 cm (P=40) → no difference.',
      common_mistake: 'Comparing areas instead of perimeters.',
      memory_tip: '"Calculate each perimeter first, then subtract the smaller from the larger."',
    },
    expectedTime: 80,
  },

  {
    qid: 'P-M-07', topic: 'perimeter', shape: 'rectangle', difficulty: 'intermediate',
    type: 'reverse_find',
    question: 'The perimeter of a rectangle is 72 cm and its breadth is 16 cm. Find its length.',
    answer: 20, unit: 'cm', formula: 'l = (P ÷ 2) − b',
    solution_steps: [
      'l + b = P ÷ 2 = 72 ÷ 2 = 36',
      'l = 36 − b = 36 − 16',
      'l = 20 cm',
    ],
    hints: {
      level1: 'Rearrange P = 2(l + b) to isolate l.',
      level2: 'l + b = 36; substitute b = 16 to find l.',
      level3: 'l = 36 − 16 = ___ cm',
    },
    remedial: {
      concept_recap: 'From P = 2(l + b), we get l + b = P/2. Subtract the known dimension to find the other.',
      formula: 'l = (P ÷ 2) − b',
      worked_example: 'P = 60, b = 12 → l + b = 30 → l = 30 − 12 = 18 cm',
      common_mistake: 'Not dividing P by 2 before subtracting.',
      memory_tip: '"Half the perimeter minus one side = the other side."',
    },
    expectedTime: 75,
  },

  {
    qid: 'P-M-08', topic: 'perimeter', shape: 'circle', difficulty: 'intermediate',
    type: 'word_problem',
    question: 'A wire is bent into the shape of a square of side 11 cm. The same wire is then rebent into a circle. Find the radius of the circle. (Use π = 22/7)',
    answer: 7, unit: 'cm', formula: 'r = C ÷ (2π)',
    solution_steps: [
      'Length of wire = Perimeter of square = 4 × 11 = 44 cm',
      'Circumference of circle = 44 cm → 44 = 2 × (22/7) × r',
      'r = 44 × 7 ÷ 44 = 7 cm',
    ],
    hints: {
      level1: 'The length of wire equals the perimeter of the square. When rebent, this length becomes the circumference of the circle.',
      level2: 'Wire length = 4 × 11 = 44 cm. Set C = 44 and use C = 2πr to find r.',
      level3: 'r = 44 × 7 ÷ (2 × 22) = 44 × 7 ÷ 44 = ___ cm',
    },
    remedial: {
      concept_recap: 'Wire length is conserved when reshaping. Perimeter of one shape = circumference of the other.',
      formula: 'Wire = 4a (square); C = 2πr (circle)',
      worked_example: 'Square side = 7 cm → wire = 28 cm → r = 28×7÷44 = 4.45 cm (use exact values)',
      common_mistake: 'Forgetting that the wire length is the same — calculating a new perimeter instead.',
      memory_tip: '"Same wire, same length — equal perimeters when reshaped."',
    },
    expectedTime: 90,
  },

  {
    qid: 'P-M-09', topic: 'perimeter', shape: 'square', difficulty: 'intermediate',
    type: 'mcq',
    question: 'A square has a perimeter of 64 m. What is its area?',
    answer: 256, unit: 'm²', formula: 'side = P ÷ 4; A = side²',
    options: { A: '128 m²', B: '64 m²', C: '256 m²', D: '512 m²' },
    correct_option: 'C',
    solution_steps: [
      'side = P ÷ 4 = 64 ÷ 4 = 16 m',
      'Area = side² = 16²',
      'Area = 256 m²',
    ],
    hints: {
      level1: 'Find the side of the square from its perimeter, then calculate the area.',
      level2: 'side = 64 ÷ 4 = 16 m. Now use A = side² = 16².',
      level3: 'A = 16 × 16 = ___ m²',
    },
    remedial: {
      concept_recap: 'First reverse-find the side: side = P ÷ 4. Then area = side².',
      formula: 'side = P ÷ 4; A = a²',
      worked_example: 'P = 40 m → side = 10 m → A = 100 m²',
      common_mistake: 'Squaring the perimeter (64²) instead of the side.',
      memory_tip: '"Get the side first, then square it for area."',
    },
    expectedTime: 80,
  },

  {
    qid: 'P-M-10', topic: 'perimeter', shape: 'rectangle', difficulty: 'intermediate',
    type: 'comparison',
    question: 'Rectangle A has length 14 cm and breadth 6 cm. Rectangle B has length 11 cm and breadth 8 cm. By how many cm is the perimeter of Rectangle A greater than Rectangle B?',
    answer: 2, unit: 'cm', formula: 'P = 2 × (l + b)',
    solution_steps: [
      'P_A = 2(14 + 6) = 2 × 20 = 40 cm',
      'P_B = 2(11 + 8) = 2 × 19 = 38 cm',
      'Difference = 40 − 38 = 2 cm',
    ],
    hints: {
      level1: 'Calculate the perimeter of each rectangle separately, then compare.',
      level2: 'P_A = 2(14+6) = 40 cm; P_B = 2(11+8) = 38 cm.',
      level3: 'Difference = 40 − 38 = ___ cm',
    },
    remedial: {
      concept_recap: 'To compare perimeters: calculate each using P = 2(l+b), then subtract.',
      formula: 'P = 2 × (l + b)',
      worked_example: 'Rect A: 10×6 (P=32); Rect B: 9×7 (P=32) → same perimeter.',
      common_mistake: 'Comparing areas instead of perimeters.',
      memory_tip: '"Compute both perimeters first, then find the difference."',
    },
    expectedTime: 80,
  },

  // ════════════════════════════════════════════════════════
  //  PERIMETER — HARD  (P-H-01 to P-H-10)
  // ════════════════════════════════════════════════════════

  {
    qid: 'P-H-01', topic: 'perimeter', shape: 'rectangle', difficulty: 'advanced',
    type: 'cost_problem',
    question: 'A rectangular field is 75 m long and 50 m wide. It is to be fenced on all four sides, but a 5 m wide gate is to be left on one of the shorter sides. If fencing costs ₹35 per metre, find the total cost.',
    answer: 8575, unit: '₹', formula: 'P = 2(l + b); Cost = fence length × rate',
    solution_steps: [
      'Full perimeter = 2(75 + 50) = 250 m',
      'Fence length = 250 − 5 = 245 m (gate excluded)',
      'Cost = 245 × 35 = ₹8575',
    ],
    hints: {
      level1: 'Find the full perimeter first, then subtract the gate width before calculating cost.',
      level2: 'Full P = 2(75+50) = 250 m. Subtract the gate: 250 − 5 = 245 m of fencing needed.',
      level3: 'Cost = 245 × 35 = ₹___',
    },
    remedial: {
      concept_recap: 'When a gate or opening is excluded from fencing, subtract its width from the perimeter before multiplying by the rate.',
      formula: 'Fence length = P − opening; Cost = fence length × rate',
      worked_example: 'Field 50×30, gate 3m → P=160, fence=157m, at ₹20 → ₹3140',
      common_mistake: 'Forgetting to subtract the gate from the total perimeter.',
      memory_tip: '"Perimeter minus openings = actual fencing needed."',
    },
    expectedTime: 150,
  },

  {
    qid: 'P-H-02', topic: 'perimeter', shape: 'circle', difficulty: 'advanced',
    type: 'word_problem',
    question: 'A race track is circular. Priya runs 4 rounds and covers a total distance of 1056 m. Find the radius of the track. (Use π = 22/7)',
    answer: 42, unit: 'm', formula: 'r = C ÷ (2π)',
    solution_steps: [
      'C = total distance ÷ rounds = 1056 ÷ 4 = 264 m',
      '264 = 2 × (22/7) × r → r = 264 × 7 ÷ 44',
      'r = 1848 ÷ 44 = 42 m',
    ],
    hints: {
      level1: 'Find the circumference of one round first by dividing total distance by number of rounds.',
      level2: 'C = 1056 ÷ 4 = 264 m. Now use C = 2πr to find r.',
      level3: 'r = 264 × 7 ÷ 44 = ___ m',
    },
    remedial: {
      concept_recap: 'Total distance = C × rounds. To find C, divide total distance by rounds. Then r = C ÷ (2π).',
      formula: 'C = Total ÷ rounds; r = C × 7 ÷ 44',
      worked_example: '3 rounds = 528 m → C = 176 m → r = 176×7÷44 = 28 m',
      common_mistake: 'Using the total distance (1056 m) as the circumference directly.',
      memory_tip: '"Divide by rounds to get one round (circumference), then find radius."',
    },
    expectedTime: 150,
  },

  {
    qid: 'P-H-03', topic: 'perimeter', shape: 'square', difficulty: 'advanced',
    type: 'error_correction',
    question: 'Ravi calculated the perimeter of a square with side 13 cm as: P = 2 × side = 2 × 13 = 26 cm. Find his mistake and calculate the correct perimeter.',
    answer: 52, unit: 'cm', formula: 'P = 4 × a',
    solution_steps: [
      'Ravi\'s mistake: he used the formula for half the perimeter (2 × a) instead of P = 4 × a',
      'Correct formula: P = 4 × side',
      'Correct P = 4 × 13 = 52 cm',
    ],
    hints: {
      level1: 'Check which formula Ravi used. How many sides does a square have?',
      level2: 'Ravi used 2 × side, but a square has 4 equal sides, so the correct formula is 4 × side.',
      level3: 'Correct P = 4 × 13 = ___ cm',
    },
    remedial: {
      concept_recap: 'A square has 4 equal sides, so P = 4 × a. Using P = 2 × a (the formula for 2 sides) is wrong.',
      formula: 'P = 4 × a  (NOT 2 × a)',
      worked_example: 'Square side = 9 cm → P = 4 × 9 = 36 cm (not 18 cm)',
      common_mistake: 'Confusing square perimeter (4a) with rectangle perimeter (2(l+b)) when l = b.',
      memory_tip: '"Square: four identical sides, so multiply by 4, not 2."',
    },
    expectedTime: 150,
  },

  {
    qid: 'P-H-04', topic: 'perimeter', shape: 'rectangle', difficulty: 'advanced',
    type: 'word_problem',
    question: 'A rectangular swimming pool is 40 m long and 25 m wide. A 2 m wide path runs around the outside of the pool. Find the perimeter of the outer boundary of the path.',
    answer: 146, unit: 'm', formula: 'P = 2 × (L + B)',
    solution_steps: [
      'Outer length = 40 + 2 × 2 = 44 m',
      'Outer width = 25 + 2 × 2 = 29 m',
      'Outer perimeter = 2(44 + 29) = 2 × 73 = 146 m',
    ],
    hints: {
      level1: 'The path adds to both sides of the length and both sides of the width. Find the new outer dimensions first.',
      level2: 'Outer length = 40 + 4 = 44 m; Outer width = 25 + 4 = 29 m.',
      level3: 'Outer P = 2(44 + 29) = 2 × 73 = ___ m',
    },
    remedial: {
      concept_recap: 'A path around a rectangle increases each dimension by 2 × path width on each side.',
      formula: 'Outer L = l + 2w; Outer B = b + 2w; P = 2(L + B)',
      worked_example: 'Pool 20×15, path 1m → outer 22×17 → P = 2×39 = 78 m',
      common_mistake: 'Adding the path width only once to each dimension instead of twice.',
      memory_tip: '"Path adds to both ends — double the path width for each dimension."',
    },
    expectedTime: 150,
  },

  {
    qid: 'P-H-05', topic: 'perimeter', shape: 'circle', difficulty: 'advanced',
    type: 'cost_problem',
    question: 'A circular park of radius 35 m is to be surrounded by a decorative fence. The fence costs ₹120 per metre. Find the total fencing cost. (Use π = 22/7)',
    answer: 26400, unit: '₹', formula: 'C = 2 × π × r',
    solution_steps: [
      'C = 2 × (22/7) × 35 = 2 × 110 = 220 m',
      'Cost = 220 × 120',
      'Cost = ₹26400',
    ],
    hints: {
      level1: 'Find the circumference of the park, then multiply by the cost rate.',
      level2: 'C = 2 × (22/7) × 35 = 220 m. Now find cost = 220 × 120.',
      level3: 'Cost = 220 × 120 = ₹___',
    },
    remedial: {
      concept_recap: 'Fencing a circular park costs = circumference × rate. Find C first using C = 2πr.',
      formula: 'C = 2πr; Cost = C × rate',
      worked_example: 'r = 14 m → C = 88 m; at ₹50/m → cost = ₹4400',
      common_mistake: 'Using area (πr²) instead of circumference for the fence length.',
      memory_tip: '"Fence wraps around = circumference, not area."',
    },
    expectedTime: 150,
  },

  {
    qid: 'P-H-06', topic: 'perimeter', shape: 'square', difficulty: 'advanced',
    type: 'comparison',
    question: 'A square of side 20 m and a rectangle of length 25 m and breadth 14 m are both to be fenced at ₹50 per metre. By how much more does it cost to fence the square than the rectangle?',
    answer: 100, unit: '₹', formula: 'P_sq = 4a; P_rect = 2(l+b); Cost = P × rate',
    solution_steps: [
      'Square P = 4 × 20 = 80 m; Cost = 80 × 50 = ₹4000',
      'Rectangle P = 2(25 + 14) = 78 m; Cost = 78 × 50 = ₹3900',
      'Extra cost for square = 4000 − 3900 = ₹100',
    ],
    hints: {
      level1: 'Find the perimeter and cost for each shape separately.',
      level2: 'Square: P=80m, cost=₹4000. Rectangle: P=78m, cost=₹3900.',
      level3: 'Difference = ₹4000 − ₹3900 = ₹___',
    },
    remedial: {
      concept_recap: 'Compare fencing costs by finding each perimeter and multiplying by the rate, then subtract.',
      formula: 'Cost = Perimeter × rate',
      worked_example: 'Sq side 15 (P=60) vs Rect 18×10 (P=56) at ₹10 → costs ₹600 vs ₹560 → ₹40 more for square.',
      common_mistake: 'Comparing areas instead of perimeters when asked about fencing costs.',
      memory_tip: '"Fencing cost = perimeter × rate. Compare perimeters first."',
    },
    expectedTime: 150,
  },

  {
    qid: 'P-H-07', topic: 'perimeter', shape: 'rectangle', difficulty: 'advanced',
    type: 'error_correction',
    question: 'Anjali found the perimeter of a rectangle with l = 18 m and b = 11 m as: P = l + b = 18 + 11 = 29 m. What is the correct perimeter?',
    answer: 58, unit: 'm', formula: 'P = 2 × (l + b)',
    solution_steps: [
      'Anjali\'s error: she computed l + b instead of 2(l + b)',
      'Correct formula: P = 2 × (l + b)',
      'Correct P = 2 × (18 + 11) = 2 × 29 = 58 m',
    ],
    hints: {
      level1: 'A rectangle has two pairs of equal sides. The formula adds all four sides.',
      level2: 'The correct formula is P = 2(l + b), not just l + b. Anjali forgot the factor of 2.',
      level3: 'P = 2 × (18 + 11) = 2 × 29 = ___ m',
    },
    remedial: {
      concept_recap: 'P = 2(l + b) because there are 2 lengths and 2 breadths. Just adding l + b gives only half the perimeter.',
      formula: 'P = 2 × (l + b)',
      worked_example: 'l = 10, b = 6 → P = 2×16 = 32 m (not 16 m)',
      common_mistake: 'Forgetting to multiply by 2 — giving only half the perimeter.',
      memory_tip: '"Perimeter = total boundary = 2 pairs = multiply by 2."',
    },
    expectedTime: 150,
  },

  {
    qid: 'P-H-08', topic: 'perimeter', shape: 'circle', difficulty: 'advanced',
    type: 'reverse_find',
    question: 'The cost of fencing a circular park at ₹40 per metre is ₹8800. Find the radius of the park. (Use π = 22/7)',
    answer: 35, unit: 'm', formula: 'r = C ÷ (2π)',
    solution_steps: [
      'Circumference = Total cost ÷ rate = 8800 ÷ 40 = 220 m',
      '220 = 2 × (22/7) × r → r = 220 × 7 ÷ 44',
      'r = 1540 ÷ 44 = 35 m',
    ],
    hints: {
      level1: 'First find the circumference from the cost and rate, then find the radius.',
      level2: 'C = 8800 ÷ 40 = 220 m. Now solve 220 = 2 × (22/7) × r.',
      level3: 'r = 220 × 7 ÷ 44 = ___ m',
    },
    remedial: {
      concept_recap: 'Reverse-find: circumference = cost ÷ rate; then r = C × 7 ÷ 44.',
      formula: 'C = cost ÷ rate; r = C × 7 ÷ 44',
      worked_example: 'Cost = ₹4400, rate = ₹20 → C = 220 m → r = 35 m',
      common_mistake: 'Using cost directly in the radius formula without first finding C.',
      memory_tip: '"Cost ÷ rate = circumference; circumference ÷ 2π = radius."',
    },
    expectedTime: 150,
  },

  {
    qid: 'P-H-09', topic: 'perimeter', shape: 'square', difficulty: 'advanced',
    type: 'cost_problem',
    question: 'A square garden of side 45 m needs to be fenced. Fencing costs ₹80 per metre for the first 100 m and ₹60 per metre for the remaining length. Find the total fencing cost.',
    answer: 12800, unit: '₹', formula: 'P = 4 × a',
    solution_steps: [
      'Total perimeter = 4 × 45 = 180 m',
      'First 100 m cost = 100 × 80 = ₹8000',
      'Remaining 80 m cost = 80 × 60 = ₹4800; Total = ₹12800',
    ],
    hints: {
      level1: 'Find the total perimeter first, then apply the two different rate tiers.',
      level2: 'P = 180 m. First 100 m at ₹80, rest (80 m) at ₹60.',
      level3: 'Cost = (100 × 80) + (80 × 60) = 8000 + ___ = ₹12800',
    },
    remedial: {
      concept_recap: 'When there are tiered rates, apply each rate to the appropriate length and add the costs.',
      formula: 'P = 4a; Cost = (first part × rate1) + (remaining × rate2)',
      worked_example: 'P=120m; first 50m at ₹100 + remaining 70m at ₹70 → 5000+4900=₹9900',
      common_mistake: 'Applying only one rate to the entire perimeter.',
      memory_tip: '"Tiered pricing: split the fence, apply each rate separately, then add."',
    },
    expectedTime: 180,
  },

  {
    qid: 'P-H-10', topic: 'perimeter', shape: 'rectangle', difficulty: 'advanced',
    type: 'reverse_find',
    question: 'The cost of fencing a rectangular field at ₹25 per metre is ₹3750. If the field is 50 m long, find its breadth.',
    answer: 25, unit: 'm', formula: 'b = (P ÷ 2) − l',
    solution_steps: [
      'Perimeter = Total cost ÷ rate = 3750 ÷ 25 = 150 m',
      'l + b = 150 ÷ 2 = 75; b = 75 − 50',
      'b = 25 m',
    ],
    hints: {
      level1: 'Find the perimeter from the cost data, then use it to find the breadth.',
      level2: 'P = 3750 ÷ 25 = 150 m. Now l + b = 75, so b = 75 − 50.',
      level3: 'b = 75 − 50 = ___ m',
    },
    remedial: {
      concept_recap: 'Multi-step reverse: cost → perimeter → dimension. P = cost ÷ rate; then b = P/2 − l.',
      formula: 'P = cost ÷ rate; b = (P ÷ 2) − l',
      worked_example: 'Cost=₹2400, rate=₹30 → P=80m → l+b=40 → if l=25 then b=15m',
      common_mistake: 'Skipping the step of dividing by rate to find perimeter.',
      memory_tip: '"Cost ÷ rate = perimeter; then halve and subtract to get the missing side."',
    },
    expectedTime: 180,
  },

  // ════════════════════════════════════════════════════════
  //  AREA — EASY  (A-E-01 to A-E-10)
  // ════════════════════════════════════════════════════════

  {
    qid: 'A-E-01', topic: 'area', shape: 'square', difficulty: 'beginner',
    type: 'direct_calculation',
    question: 'Find the area of a square with side 9 cm.',
    answer: 81, unit: 'cm²', formula: 'A = a²',
    solution_steps: ['Formula: A = a²', 'Substitute: A = 9²', 'A = 81 cm²'],
    hints: {
      level1: 'The area of a square depends only on its side length.',
      level2: 'Substitute a = 9 into A = a² = 9 × 9.',
      level3: 'A = 9 × 9 = ___ cm²',
    },
    remedial: {
      concept_recap: 'Area of a square = side × side = side². It tells us how much surface the square covers.',
      formula: 'A = a²',
      worked_example: 'Square side = 6 cm → A = 6² = 36 cm²',
      common_mistake: 'Using A = 4 × a (perimeter formula) instead of A = a².',
      memory_tip: '"Area = side squared — literally multiply side by itself."',
    },
    expectedTime: 35,
  },

  {
    qid: 'A-E-02', topic: 'area', shape: 'rectangle', difficulty: 'beginner',
    type: 'mcq',
    question: 'What is the area of a rectangle with length 12 cm and breadth 7 cm?',
    answer: 84, unit: 'cm²', formula: 'A = l × b',
    options: { A: '38 cm²', B: '84 cm²', C: '96 cm²', D: '42 cm²' },
    correct_option: 'B',
    solution_steps: ['Formula: A = l × b', 'Substitute: A = 12 × 7', 'A = 84 cm²'],
    hints: {
      level1: 'Area of a rectangle is found by multiplying its two dimensions.',
      level2: 'Substitute l = 12 and b = 7 into A = l × b.',
      level3: 'A = 12 × 7 = ___ cm²',
    },
    remedial: {
      concept_recap: 'Area of a rectangle = length × breadth. It measures the surface covered.',
      formula: 'A = l × b',
      worked_example: 'l = 8 cm, b = 5 cm → A = 8 × 5 = 40 cm²',
      common_mistake: 'Adding l + b instead of multiplying, giving perimeter ÷ 2.',
      memory_tip: '"Area = product of two dimensions; perimeter = sum (×2)."',
    },
    expectedTime: 35,
  },

  {
    qid: 'A-E-03', topic: 'area', shape: 'circle', difficulty: 'beginner',
    type: 'fill_in_blank',
    question: 'The area of a circle with radius 7 cm is ___ cm². (Use π = 22/7)',
    answer: 154, unit: 'cm²', formula: 'A = π × r²',
    solution_steps: ['Formula: A = π × r²', 'Substitute: A = (22/7) × 7²', 'A = (22/7) × 49 = 22 × 7 = 154 cm²'],
    hints: {
      level1: 'Area of a circle uses π and r. Recall the formula.',
      level2: 'Substitute r = 7 and π = 22/7 into A = π × r².',
      level3: 'A = (22/7) × 49 = ___ cm²',
    },
    remedial: {
      concept_recap: 'Area of a circle = πr². The r² means square the radius first, then multiply by π.',
      formula: 'A = π × r²  (π = 22/7)',
      worked_example: 'r = 14 cm → A = (22/7) × 196 = 22 × 28 = 616 cm²',
      common_mistake: 'Using circumference formula (2πr) instead of area formula (πr²).',
      memory_tip: '"Area: pi r squared — π × r × r."',
    },
    expectedTime: 45,
  },

  {
    qid: 'A-E-04', topic: 'area', shape: 'square', difficulty: 'beginner',
    type: 'true_false',
    question: 'True or False: A square with side 6 cm has an area of 24 cm².',
    answer: 0, unit: '', formula: 'A = a²',
    correct_verdict: 'False',
    reason: 'Area = 6² = 36 cm², not 24 cm². The mistake is using 4 × 6 (perimeter rule) for area.',
    solution_steps: ['Formula: A = a²', 'A = 6² = 36 cm²', 'Statement says 24 cm² — this is False'],
    hints: {
      level1: 'Calculate the area of a square with side 6 cm and compare with 24 cm².',
      level2: 'A = 6 × 6 = 36 cm², not 24 cm². Where does 24 come from? (It equals 4 × 6 — the perimeter of the square.)',
      level3: 'A = 36 cm² ≠ 24 cm² → False',
    },
    remedial: {
      concept_recap: 'Area of a square = a² (side squared). 24 = 4 × 6 is the perimeter formula, not area.',
      formula: 'A = a²',
      worked_example: 'Square side = 5 cm → A = 25 cm² (not 4×5=20)',
      common_mistake: 'Using perimeter formula (4×a) when asked for area.',
      memory_tip: '"Area = side × side; Perimeter = 4 × side. Don\'t mix them!"',
    },
    expectedTime: 40,
  },

  {
    qid: 'A-E-05', topic: 'area', shape: 'rectangle', difficulty: 'beginner',
    type: 'direct_calculation',
    question: 'Find the area of a rectangle with length 11 cm and breadth 8 cm.',
    answer: 88, unit: 'cm²', formula: 'A = l × b',
    solution_steps: ['Formula: A = l × b', 'Substitute: A = 11 × 8', 'A = 88 cm²'],
    hints: {
      level1: 'Use the formula A = l × b to find the area.',
      level2: 'Substitute l = 11 and b = 8.',
      level3: 'A = 11 × 8 = ___ cm²',
    },
    remedial: {
      concept_recap: 'Area of rectangle = l × b. Multiply length and breadth together.',
      formula: 'A = l × b',
      worked_example: 'l = 9 cm, b = 6 cm → A = 54 cm²',
      common_mistake: 'Adding l + b instead of multiplying.',
      memory_tip: '"Area: multiply the two sides together."',
    },
    expectedTime: 35,
  },

  {
    qid: 'A-E-06', topic: 'area', shape: 'circle', difficulty: 'beginner',
    type: 'reverse_find',
    question: 'The area of a circle is 616 cm². Find its radius. (Use π = 22/7)',
    answer: 14, unit: 'cm', formula: 'r = √(A ÷ π)',
    options: { A: '7 cm', B: '14 cm', C: '28 cm', D: '21 cm' },
    correct_option: 'B',
    type: 'mcq',
    solution_steps: ['A = πr² → r² = A ÷ π = 616 ÷ (22/7) = 616 × 7/22 = 196', 'r = √196 = 14 cm'],
    hints: {
      level1: 'Rearrange A = πr² to isolate r².',
      level2: 'r² = A ÷ π = 616 ÷ (22/7) = 616 × 7/22. Compute this value.',
      level3: 'r² = 196, so r = √196 = ___ cm',
    },
    remedial: {
      concept_recap: 'From A = πr², isolate r² = A/π, then take the square root.',
      formula: 'r² = A ÷ π; r = √(A × 7 ÷ 22)',
      worked_example: 'A = 154 → r² = 154×7/22 = 49 → r = 7 cm',
      common_mistake: 'Not taking the square root at the end, giving r² as the answer.',
      memory_tip: '"To find r from area: divide by π, then take √."',
    },
    expectedTime: 60,
  },

  {
    qid: 'A-E-07', topic: 'area', shape: 'square', difficulty: 'beginner',
    type: 'fill_in_blank',
    question: 'The perimeter of a square is 20 cm. Its area is ___ cm².',
    answer: 25, unit: 'cm²', formula: 'side = P ÷ 4; A = side²',
    solution_steps: ['side = P ÷ 4 = 20 ÷ 4 = 5 cm', 'A = side² = 5² = 25 cm²'],
    hints: {
      level1: 'Find the side of the square from its perimeter first.',
      level2: 'side = 20 ÷ 4 = 5 cm. Now calculate A = side².',
      level3: 'A = 5² = ___ cm²',
    },
    remedial: {
      concept_recap: 'Two-step problem: get the side from perimeter (÷4), then find area (side²).',
      formula: 'side = P ÷ 4; A = a²',
      worked_example: 'P = 36 → side = 9 → A = 81 cm²',
      common_mistake: 'Squaring the perimeter (20²=400) instead of the side.',
      memory_tip: '"Step 1: find side. Step 2: square it for area."',
    },
    expectedTime: 55,
  },

  {
    qid: 'A-E-08', topic: 'area', shape: 'rectangle', difficulty: 'beginner',
    type: 'direct_calculation',
    question: 'Find the area of a rectangular field 25 m long and 18 m wide.',
    answer: 450, unit: 'm²', formula: 'A = l × b',
    solution_steps: ['Formula: A = l × b', 'Substitute: A = 25 × 18', 'A = 450 m²'],
    hints: {
      level1: 'Use A = l × b for a rectangle.',
      level2: 'Substitute l = 25 and b = 18.',
      level3: 'A = 25 × 18 = ___ m²',
    },
    remedial: {
      concept_recap: 'Area of rectangle = l × b. Multiply length by width.',
      formula: 'A = l × b',
      worked_example: 'l = 20, b = 15 → A = 300 m²',
      common_mistake: 'Using perimeter formula 2(l+b) instead of l×b.',
      memory_tip: '"Area = l × b. Perimeter = 2(l+b). Different operations!"',
    },
    expectedTime: 35,
  },

  {
    qid: 'A-E-09', topic: 'area', shape: 'circle', difficulty: 'beginner',
    type: 'mcq',
    question: 'The diameter of a circle is 28 cm. What is its area? (Use π = 22/7)',
    answer: 616, unit: 'cm²', formula: 'A = π × r²',
    options: { A: '88 cm²', B: '1232 cm²', C: '308 cm²', D: '616 cm²' },
    correct_option: 'D',
    solution_steps: ['r = diameter ÷ 2 = 28 ÷ 2 = 14 cm', 'A = (22/7) × 14² = (22/7) × 196 = 616 cm²'],
    hints: {
      level1: 'When a diameter is given, convert to radius first before applying A = πr².',
      level2: 'r = 28 ÷ 2 = 14 cm. Substitute into A = (22/7) × r².',
      level3: 'A = (22/7) × 196 = ___ cm²',
    },
    remedial: {
      concept_recap: 'r = diameter ÷ 2. Then A = πr². Forgetting to halve the diameter is the most common error.',
      formula: 'r = d ÷ 2; A = π × r²',
      worked_example: 'diameter = 14 → r = 7 → A = (22/7) × 49 = 154 cm²',
      common_mistake: 'Using d = 28 directly in A = π × d² = π × 784 (gives 4× the correct area).',
      memory_tip: '"Diameter ÷ 2 = radius; then use radius in the area formula."',
    },
    expectedTime: 55,
  },

  {
    qid: 'A-E-10', topic: 'area', shape: 'square', difficulty: 'beginner',
    type: 'reverse_find',
    question: 'The area of a square is 169 cm². Find the length of its side.',
    answer: 13, unit: 'cm', formula: 'side = √A',
    solution_steps: ['A = side² → side = √A', 'side = √169', 'side = 13 cm'],
    hints: {
      level1: 'From A = a², isolate a by taking the square root.',
      level2: 'side = √(Area) = √169.',
      level3: '√169 = ___ cm (think: 13 × 13 = 169)',
    },
    remedial: {
      concept_recap: 'From A = a², rearrange to a = √A. Find a number that when squared gives 169.',
      formula: 'side = √A',
      worked_example: 'A = 81 cm² → side = √81 = 9 cm',
      common_mistake: 'Dividing A by 4 (confusing with perimeter calculation).',
      memory_tip: '"Area = side²; to get side, take the square root."',
    },
    expectedTime: 50,
  },

  // ════════════════════════════════════════════════════════
  //  AREA — MEDIUM  (A-M-01 to A-M-10)
  // ════════════════════════════════════════════════════════

  {
    qid: 'A-M-01', topic: 'area', shape: 'rectangle', difficulty: 'intermediate',
    type: 'word_problem',
    question: 'A rectangular hall is 15 m long and 12 m wide. Find the cost of laying tiles at ₹80 per m².',
    answer: 14400, unit: '₹', formula: 'A = l × b; Cost = A × rate',
    solution_steps: ['A = 15 × 12 = 180 m²', 'Cost = 180 × 80', 'Cost = ₹14400'],
    hints: {
      level1: 'Find the area of the hall first, then multiply by the rate per m².',
      level2: 'A = 15 × 12 = 180 m². Now multiply by ₹80.',
      level3: 'Cost = 180 × 80 = ₹___',
    },
    remedial: {
      concept_recap: 'Tiling costs = area × rate per unit area. First calculate area (l×b), then multiply by cost.',
      formula: 'A = l × b; Cost = A × rate',
      worked_example: 'Hall 10m × 8m = 80 m² at ₹50 → cost = ₹4000',
      common_mistake: 'Using perimeter instead of area to find tiling cost.',
      memory_tip: '"Tiles cover area; fencing covers perimeter."',
    },
    expectedTime: 80,
  },

  {
    qid: 'A-M-02', topic: 'area', shape: 'circle', difficulty: 'intermediate',
    type: 'reverse_find',
    question: 'The area of a circular park is 1386 m². Find its radius. (Use π = 22/7)',
    answer: 21, unit: 'm', formula: 'r = √(A ÷ π)',
    solution_steps: [
      'A = πr² → r² = 1386 × 7 ÷ 22 = 441',
      'r = √441 = 21 m',
    ],
    hints: {
      level1: 'From A = πr², isolate r² then take the square root.',
      level2: 'r² = 1386 × 7 ÷ 22. Compute 1386 × 7 = 9702, then ÷ 22.',
      level3: 'r² = 441 → r = √441 = ___ m',
    },
    remedial: {
      concept_recap: 'Rearrange A = πr²: r² = A/π. With π=22/7: r² = A × 7/22. Then take the square root.',
      formula: 'r² = A × 7 ÷ 22; r = √r²',
      worked_example: 'A = 616 → r² = 616×7/22 = 196 → r = 14 m',
      common_mistake: 'Forgetting to take the square root — giving r² as the final answer.',
      memory_tip: '"Divide area by π (multiply by 7/22), then take √ to get radius."',
    },
    expectedTime: 90,
  },

  {
    qid: 'A-M-03', topic: 'area', shape: 'square', difficulty: 'intermediate',
    type: 'comparison',
    question: 'A square plot has side 14 m. A rectangular plot has dimensions 18 m × 10 m. How much more area does the square plot have?',
    answer: 16, unit: 'm²', formula: 'A_sq = a²; A_rect = l × b',
    solution_steps: [
      'Square A = 14² = 196 m²',
      'Rectangle A = 18 × 10 = 180 m²',
      'Difference = 196 − 180 = 16 m²',
    ],
    hints: {
      level1: 'Calculate the area of each shape separately, then compare.',
      level2: 'Square A = 196 m²; Rectangle A = 180 m².',
      level3: 'Difference = 196 − 180 = ___ m²',
    },
    remedial: {
      concept_recap: 'Compare areas by computing each independently and finding the difference.',
      formula: 'Square: A = a²; Rectangle: A = l × b',
      worked_example: 'Square 10m → A=100; Rect 12×8 → A=96; Sq is larger by 4 m²',
      common_mistake: 'Comparing perimeters instead of areas.',
      memory_tip: '"Area tells you how much space a shape covers."',
    },
    expectedTime: 80,
  },

  {
    qid: 'A-M-04', topic: 'area', shape: 'rectangle', difficulty: 'intermediate',
    type: 'mcq',
    question: 'The area of a rectangle is 120 cm² and its length is 15 cm. What is its breadth?',
    answer: 8, unit: 'cm', formula: 'b = A ÷ l',
    options: { A: '10 cm', B: '6 cm', C: '8 cm', D: '12 cm' },
    correct_option: 'C',
    solution_steps: ['A = l × b → b = A ÷ l', 'b = 120 ÷ 15', 'b = 8 cm'],
    hints: {
      level1: 'Rearrange A = l × b to find b.',
      level2: 'b = A ÷ l = 120 ÷ 15.',
      level3: '120 ÷ 15 = ___ cm',
    },
    remedial: {
      concept_recap: 'From A = l × b, isolate b = A ÷ l. Divide the area by the known dimension.',
      formula: 'b = A ÷ l',
      worked_example: 'A = 96, l = 12 → b = 96 ÷ 12 = 8 cm',
      common_mistake: 'Multiplying l × A instead of dividing.',
      memory_tip: '"To find one dimension, divide area by the other dimension."',
    },
    expectedTime: 70,
  },

  {
    qid: 'A-M-05', topic: 'area', shape: 'circle', difficulty: 'intermediate',
    type: 'cost_problem',
    question: 'A circular garden has a radius of 14 m. Find the cost of planting grass at ₹25 per m². (Use π = 22/7)',
    answer: 15400, unit: '₹', formula: 'A = π × r²; Cost = A × rate',
    solution_steps: [
      'A = (22/7) × 14² = (22/7) × 196 = 616 m²',
      'Cost = 616 × 25',
      'Cost = ₹15400',
    ],
    hints: {
      level1: 'Find the area of the circular garden first, then multiply by the rate.',
      level2: 'A = (22/7) × 196 = 616 m². Now find cost = 616 × 25.',
      level3: 'Cost = 616 × 25 = ₹___',
    },
    remedial: {
      concept_recap: 'Cost of filling/covering an area = area × rate per m². Find area using A = πr².',
      formula: 'A = πr²; Cost = A × rate',
      worked_example: 'r = 7m → A = 154 m² at ₹20 → cost = ₹3080',
      common_mistake: 'Using circumference (2πr) instead of area (πr²).',
      memory_tip: '"Covering a surface = area × rate. Area = πr²."',
    },
    expectedTime: 90,
  },

  {
    qid: 'A-M-06', topic: 'area', shape: 'square', difficulty: 'intermediate',
    type: 'word_problem',
    question: 'A square carpet has side 5 m. A second square carpet has side 7 m. Find the combined area of both carpets.',
    answer: 74, unit: 'm²', formula: 'A_total = a₁² + a₂²',
    solution_steps: ['Area of carpet 1 = 5² = 25 m²', 'Area of carpet 2 = 7² = 49 m²', 'Total = 25 + 49 = 74 m²'],
    hints: {
      level1: 'Calculate the area of each carpet separately, then add them together.',
      level2: 'A₁ = 5² = 25 m²; A₂ = 7² = 49 m².',
      level3: 'Total = 25 + 49 = ___ m²',
    },
    remedial: {
      concept_recap: 'For multiple shapes, find each area independently and add them.',
      formula: 'A_total = a₁² + a₂²',
      worked_example: 'Sq side 4 (A=16) + sq side 6 (A=36) → total = 52 m²',
      common_mistake: 'Adding the sides first (5+7=12) and then squaring (12²=144).',
      memory_tip: '"Square each, then add — never add first then square."',
    },
    expectedTime: 80,
  },

  {
    qid: 'A-M-07', topic: 'area', shape: 'rectangle', difficulty: 'intermediate',
    type: 'reverse_find',
    question: 'A rectangular room has an area of 195 m² and a breadth of 13 m. Find the length of the room.',
    answer: 15, unit: 'm', formula: 'l = A ÷ b',
    solution_steps: ['l = A ÷ b = 195 ÷ 13', 'l = 15 m'],
    hints: {
      level1: 'Rearrange A = l × b to find l.',
      level2: 'l = A ÷ b = 195 ÷ 13.',
      level3: '195 ÷ 13 = ___ m',
    },
    remedial: {
      concept_recap: 'Divide area by the known dimension to find the unknown one.',
      formula: 'l = A ÷ b',
      worked_example: 'A = 132 m², b = 11 m → l = 132 ÷ 11 = 12 m',
      common_mistake: 'Multiplying b × A instead of dividing.',
      memory_tip: '"Area ÷ one side = the other side."',
    },
    expectedTime: 70,
  },

  {
    qid: 'A-M-08', topic: 'area', shape: 'circle', difficulty: 'intermediate',
    type: 'fill_in_blank',
    question: 'If the radius of a circle is doubled, the new area becomes ___ times the original area.',
    answer: 4, unit: 'times', formula: 'A = π × r²',
    solution_steps: [
      'Original A = πr²',
      'New radius = 2r → New A = π(2r)² = 4πr²',
      'New area = 4 × original area',
    ],
    hints: {
      level1: 'Write out the area formula before and after doubling the radius.',
      level2: 'Original A = πr². If r becomes 2r, the new area = π × (2r)² = π × 4r².',
      level3: 'New A = 4πr² = ___ × original A',
    },
    remedial: {
      concept_recap: 'Area ∝ r². Doubling r multiplies area by 2² = 4, not by 2.',
      formula: 'New A = π(2r)² = 4πr² = 4 × original A',
      worked_example: 'r=7, A=154. Double r=14, A=616=4×154 ✓',
      common_mistake: 'Thinking area doubles when radius doubles (forgetting the square).',
      memory_tip: '"Radius doubled → area × 4 (because A ∝ r²)."',
    },
    expectedTime: 75,
  },

  {
    qid: 'A-M-09', topic: 'area', shape: 'square', difficulty: 'intermediate',
    type: 'mcq',
    question: 'A square tile has side 30 cm. How many tiles are needed to cover a floor of area 54 m²?',
    answer: 600, unit: 'tiles', formula: 'Tiles = Floor area ÷ Tile area',
    options: { A: '6 tiles', B: '180 tiles', C: '600 tiles', D: '6000 tiles' },
    correct_option: 'C',
    solution_steps: [
      'Floor = 54 m² = 540000 cm²',
      'Tile area = 30² = 900 cm²',
      'Number of tiles = 540000 ÷ 900 = 600',
    ],
    hints: {
      level1: 'Convert all units to the same system first, then divide floor area by tile area.',
      level2: 'Floor area = 54 m² = 540000 cm². Tile area = 900 cm². Number = 540000 ÷ 900.',
      level3: '540000 ÷ 900 = ___ tiles',
    },
    remedial: {
      concept_recap: 'Number of tiles = total area ÷ area of one tile. Make sure units match before dividing.',
      formula: 'Tiles = Total area ÷ Tile area (in same unit)',
      worked_example: 'Floor 20m²=200000cm²; tile 50cm×50cm=2500cm² → tiles=80',
      common_mistake: 'Not converting m² to cm² before dividing by tile area in cm².',
      memory_tip: '"Same units before dividing: 1 m² = 10000 cm²."',
    },
    expectedTime: 90,
  },

  {
    qid: 'A-M-10', topic: 'area', shape: 'rectangle', difficulty: 'intermediate',
    type: 'comparison',
    question: 'A square has side 10 cm and a rectangle has length 13 cm and breadth 7 cm. How much greater is the area of the square than the rectangle?',
    answer: 9, unit: 'cm²', formula: 'A_sq = a²; A_rect = l × b',
    solution_steps: [
      'Square A = 10² = 100 cm²',
      'Rectangle A = 13 × 7 = 91 cm²',
      'Difference = 100 − 91 = 9 cm²',
    ],
    hints: {
      level1: 'Calculate the area of each shape separately, then compare.',
      level2: 'Square A = 100 cm²; Rectangle A = 91 cm².',
      level3: 'Difference = 100 − 91 = ___ cm²',
    },
    remedial: {
      concept_recap: 'Compare areas: Square = a², Rectangle = l×b. Subtract smaller from larger.',
      formula: 'A_sq = a²; A_rect = l × b',
      worked_example: 'Sq 8cm (A=64) vs Rect 9×6 (A=54) → sq larger by 10 cm²',
      common_mistake: 'Comparing perimeters instead of areas.',
      memory_tip: '"Area comparison: use l×b or a², not 2(l+b) or 4a."',
    },
    expectedTime: 80,
  },

  // ════════════════════════════════════════════════════════
  //  AREA — HARD  (A-H-01 to A-H-10)
  // ════════════════════════════════════════════════════════

  {
    qid: 'A-H-01', topic: 'area', shape: 'rectangle', difficulty: 'advanced',
    type: 'cost_problem',
    question: 'A rectangular wall is 8 m long and 5 m high. It has two windows each 1.5 m × 1 m and one door 2 m × 1 m. Find the cost of painting the remaining wall area at ₹120 per m².',
    answer: 4200, unit: '₹', formula: 'Net area = Wall − Windows − Door; Cost = Net × rate',
    solution_steps: [
      'Wall area = 8 × 5 = 40 m²',
      'Windows area = 2 × (1.5 × 1) = 3 m²; Door area = 2 × 1 = 2 m²',
      'Net area = 40 − 3 − 2 = 35 m²; Cost = 35 × 120 = ₹4200',
    ],
    hints: {
      level1: 'Find the total wall area, then subtract the openings (windows and door).',
      level2: 'Wall = 40 m². Remove: 2 windows (3 m²) + 1 door (2 m²) = 5 m². Net = 35 m².',
      level3: 'Cost = 35 × 120 = ₹___',
    },
    remedial: {
      concept_recap: 'For partial painting: total area minus areas of openings = paintable area; then × rate.',
      formula: 'Net = Wall − Openings; Cost = Net × rate',
      worked_example: 'Wall 6×4=24, 1 window 2×1=2, door 1×2=2 → net=20 m² at ₹100=₹2000',
      common_mistake: 'Forgetting to subtract the windows and door from total wall area.',
      memory_tip: '"Total area minus holes = paintable area."',
    },
    expectedTime: 180,
  },

  {
    qid: 'A-H-02', topic: 'area', shape: 'circle', difficulty: 'advanced',
    type: 'word_problem',
    question: 'A circular pond of radius 14 m is surrounded by a uniform path of width 7 m. Find the area of the path. (Use π = 22/7)',
    answer: 770, unit: 'm²', formula: 'A_path = π(R² − r²)',
    solution_steps: [
      'Inner r = 14 m; Outer R = 14 + 7 = 21 m',
      'A_path = (22/7) × (21² − 14²) = (22/7) × (441 − 196) = (22/7) × 245',
      'A_path = 22 × 35 = 770 m²',
    ],
    hints: {
      level1: 'The path is the ring between the outer and inner circles. Area of path = outer area − inner area.',
      level2: 'Outer R = 14 + 7 = 21 m. A_path = π(R² − r²) = (22/7)(441 − 196).',
      level3: 'A_path = (22/7) × 245 = ___ m²',
    },
    remedial: {
      concept_recap: 'Ring area = π(R² − r²) where R = outer radius and r = inner radius. Always add path width to inner radius for R.',
      formula: 'A_path = π × (R² − r²); R = r + path width',
      worked_example: 'Inner r=7, path 7m → R=14; A=(22/7)(196−49)=(22/7)×147=462 m²',
      common_mistake: 'Using R = r × 2 instead of R = r + path width.',
      memory_tip: '"Outer radius = inner + path width. Subtract inner area from outer area."',
    },
    expectedTime: 180,
  },

  {
    qid: 'A-H-03', topic: 'area', shape: 'square', difficulty: 'advanced',
    type: 'error_correction',
    question: 'Meera calculated the area of a square with side 11 cm as: A = 4 × side = 4 × 11 = 44 cm². Find her mistake and calculate the correct area.',
    answer: 121, unit: 'cm²', formula: 'A = a²',
    solution_steps: [
      'Meera\'s error: she used A = 4 × a (the perimeter formula) instead of A = a²',
      'Correct formula: A = a²',
      'Correct A = 11² = 121 cm²',
    ],
    hints: {
      level1: 'Check what formula Meera used. Is 4 × side the right formula for area?',
      level2: 'Meera used the perimeter formula P = 4a. Area of a square is a², not 4 × a.',
      level3: 'Correct A = 11 × 11 = ___ cm²',
    },
    remedial: {
      concept_recap: 'Area = a² (multiply side by itself). Perimeter = 4a (multiply side by 4). Never mix them.',
      formula: 'A = a² (NOT 4 × a)',
      worked_example: 'Square side = 8 → A = 64 cm² (not 32 cm²)',
      common_mistake: 'Using the perimeter formula for area: 4 × a instead of a².',
      memory_tip: '"Area is squared; perimeter is multiplied by 4. Different operations!"',
    },
    expectedTime: 150,
  },

  {
    qid: 'A-H-04', topic: 'area', shape: 'rectangle', difficulty: 'advanced',
    type: 'word_problem',
    question: 'A park is 80 m long and 60 m wide. A 2.5 m wide path runs inside along the boundary. Find the area of the path.',
    answer: 675, unit: 'm²', formula: 'A_path = Outer − Inner',
    solution_steps: [
      'Outer A = 80 × 60 = 4800 m²',
      'Inner dimensions: (80 − 5) × (60 − 5) = 75 × 55 = 4125 m²',
      'A_path = 4800 − 4125 = 675 m²',
    ],
    hints: {
      level1: 'The path is inside the park boundary. Inner area = outer area minus the path on all four sides.',
      level2: 'Inner length = 80 − 2×2.5 = 75; Inner width = 60 − 2×2.5 = 55.',
      level3: 'A_path = 4800 − 75×55 = 4800 − 4125 = ___ m²',
    },
    remedial: {
      concept_recap: 'Inside path: subtract 2 × path width from both dimensions to get inner dimensions. Area of path = outer − inner.',
      formula: 'Inner L = l − 2w; Inner B = b − 2w; A_path = Outer − Inner',
      worked_example: '60×40 park, 2m path → inner 56×36=2016 → path=2400−2016=384 m²',
      common_mistake: 'Subtracting path width only once instead of twice from each dimension.',
      memory_tip: '"Path on both sides: subtract 2×width from each dimension."',
    },
    expectedTime: 180,
  },

  {
    qid: 'A-H-05', topic: 'area', shape: 'circle', difficulty: 'advanced',
    type: 'cost_problem',
    question: 'A circular plot of radius 21 m is to be paved. The cost of paving is ₹150 per m². Find the total cost. (Use π = 22/7)',
    answer: 207900, unit: '₹', formula: 'A = π × r²; Cost = A × rate',
    solution_steps: [
      'A = (22/7) × 21² = (22/7) × 441 = 22 × 63 = 1386 m²',
      'Cost = 1386 × 150',
      'Cost = ₹207900',
    ],
    hints: {
      level1: 'Find the area of the circle first, then multiply by ₹150.',
      level2: 'A = (22/7) × 441 = 1386 m². Now cost = 1386 × 150.',
      level3: 'Cost = 1386 × 150 = ₹___',
    },
    remedial: {
      concept_recap: 'Cost of paving = area × rate. Calculate area = πr² first, then multiply.',
      formula: 'A = πr²; Cost = A × rate',
      worked_example: 'r=14m → A=616m² at ₹200 → cost=₹123200',
      common_mistake: 'Using circumference (2πr=132) instead of area for paving cost.',
      memory_tip: '"Paving covers the surface = area. Fencing covers the boundary = circumference."',
    },
    expectedTime: 180,
  },

  {
    qid: 'A-H-06', topic: 'area', shape: 'square', difficulty: 'advanced',
    type: 'comparison',
    question: 'Square X has side 13 cm and Square Y has side 11 cm. How much more area does Square X have than Square Y?',
    answer: 48, unit: 'cm²', formula: 'A = a²',
    solution_steps: ['A_X = 13² = 169 cm²', 'A_Y = 11² = 121 cm²', 'Difference = 169 − 121 = 48 cm²'],
    hints: {
      level1: 'Calculate the area of each square separately.',
      level2: 'A_X = 169 cm²; A_Y = 121 cm².',
      level3: 'Difference = 169 − 121 = ___ cm²',
    },
    remedial: {
      concept_recap: 'A = a². Compute each area then subtract.',
      formula: 'A = a²',
      worked_example: 'Sq 10 (A=100) vs sq 8 (A=64) → diff = 36 cm²',
      common_mistake: 'Comparing sides (13−11=2) and treating that as the area difference.',
      memory_tip: '"Square the sides, then compare — don\'t compare the sides directly."',
    },
    expectedTime: 150,
  },

  {
    qid: 'A-H-07', topic: 'area', shape: 'rectangle', difficulty: 'advanced',
    type: 'reverse_find',
    question: 'The cost of carpeting a rectangular room at ₹200 per m² is ₹12000. If the length of the room is 10 m, find its breadth.',
    answer: 6, unit: 'm', formula: 'Area = cost ÷ rate; b = A ÷ l',
    solution_steps: [
      'Area = 12000 ÷ 200 = 60 m²',
      'b = A ÷ l = 60 ÷ 10',
      'b = 6 m',
    ],
    hints: {
      level1: 'Find the area from the cost data, then find the breadth using area = l × b.',
      level2: 'A = 12000 ÷ 200 = 60 m². Now b = 60 ÷ 10.',
      level3: 'b = 60 ÷ 10 = ___ m',
    },
    remedial: {
      concept_recap: 'Multi-step reverse: cost → area → dimension. A = cost ÷ rate; b = A ÷ l.',
      formula: 'A = cost ÷ rate; b = A ÷ l',
      worked_example: 'cost=₹8000, rate=₹200, l=8m → A=40 → b=5m',
      common_mistake: 'Not dividing by the rate first to get area before finding the dimension.',
      memory_tip: '"Find area from cost first, then divide area by the known side."',
    },
    expectedTime: 150,
  },

  {
    qid: 'A-H-08', topic: 'area', shape: 'circle', difficulty: 'advanced',
    type: 'word_problem',
    question: 'A semicircular garden has a diameter of 28 m. Find the total area of the garden. (Use π = 22/7)',
    answer: 308, unit: 'm²', formula: 'A_semicircle = (1/2) × π × r²',
    solution_steps: [
      'Diameter = 28 m → r = 14 m',
      'Full circle A = (22/7) × 196 = 616 m²',
      'Semicircle A = 616 ÷ 2 = 308 m²',
    ],
    hints: {
      level1: 'A semicircle is half a full circle. Find the area of the full circle first.',
      level2: 'r = 28 ÷ 2 = 14 m. Full circle A = (22/7) × 14². Divide by 2 for semicircle.',
      level3: 'Semicircle A = 616 ÷ 2 = ___ m²',
    },
    remedial: {
      concept_recap: 'Semicircle area = (1/2) × πr². First convert diameter to radius, then apply the formula.',
      formula: 'A = (1/2) × π × r²',
      worked_example: 'Diameter=14m → r=7m; A=(1/2)×(22/7)×49=77 m²',
      common_mistake: 'Using the full circle formula without halving, or using diameter directly.',
      memory_tip: '"Semicircle = half a circle → divide full area by 2."',
    },
    expectedTime: 150,
  },

  {
    qid: 'A-H-09', topic: 'area', shape: 'square', difficulty: 'advanced',
    type: 'cost_problem',
    question: 'A square courtyard of side 30 m is to be paved with square tiles each of side 50 cm. If each tile costs ₹45, find the total cost of tiling.',
    answer: 162000, unit: '₹', formula: 'Tiles = Courtyard area ÷ Tile area; Cost = Tiles × price',
    solution_steps: [
      'Courtyard side = 30 m = 3000 cm; tiles per row = 3000 ÷ 50 = 60',
      'Total tiles = 60 × 60 = 3600',
      'Cost = 3600 × 45 = ₹162000',
    ],
    hints: {
      level1: 'Convert all measurements to the same unit before calculating the number of tiles.',
      level2: 'Courtyard side = 3000 cm; tile side = 50 cm; tiles per row = 60; total = 3600 tiles.',
      level3: 'Cost = 3600 × 45 = ₹___',
    },
    remedial: {
      concept_recap: 'Tiles = (total side ÷ tile side)² when the courtyard is square. Then cost = tiles × price.',
      formula: 'Tiles = (L/l)² for square; Cost = Tiles × price',
      worked_example: '20m courtyard, 25cm tiles → 2000÷25=80 per row → 6400 tiles at ₹10=₹64000',
      common_mistake: 'Not converting m to cm before dividing by tile size in cm.',
      memory_tip: '"Match units before dividing: 1m = 100cm."',
    },
    expectedTime: 180,
  },

  {
    qid: 'A-H-10', topic: 'area', shape: 'rectangle', difficulty: 'advanced',
    type: 'word_problem',
    question: 'A rectangular swimming pool is 50 m long and 25 m wide. A path of width 2 m runs around the outside. Find the area of the path.',
    answer: 316, unit: 'm²', formula: 'A_path = Outer − Inner',
    solution_steps: [
      'Outer dimensions: (50 + 4) × (25 + 4) = 54 × 29 = 1566 m²',
      'Inner area = 50 × 25 = 1250 m²',
      'Path area = 1566 − 1250 = 316 m²',
    ],
    hints: {
      level1: 'The outer boundary extends by 2 m on each side. Find the outer dimensions first.',
      level2: 'Outer: (50+4) × (25+4) = 54 × 29. Inner = 1250 m².',
      level3: 'Path = 1566 − 1250 = ___ m²',
    },
    remedial: {
      concept_recap: 'Outside path: add 2×width to each dimension for outer rectangle. Path area = outer − inner.',
      formula: 'Outer L = l+2w; Outer B = b+2w; A_path = Outer − Inner',
      worked_example: '30×20 pool, 2m path → outer 34×24=816 − inner 600 = path 216 m²',
      common_mistake: 'Adding path width only once instead of twice to each dimension.',
      memory_tip: '"Outside path: add twice the width (both sides) to each dimension."',
    },
    expectedTime: 180,
  },

  // ════════════════════════════════════════════════════════
  //  SURFACE AREA — EASY  (SA-E-01 to SA-E-10)
  // ════════════════════════════════════════════════════════

  {
    qid: 'SA-E-01', topic: 'surface_area', shape: 'cube', difficulty: 'beginner',
    type: 'direct_calculation',
    question: 'Find the total surface area of a cube with edge 5 cm.',
    answer: 150, unit: 'cm²', formula: 'TSA = 6 × a²',
    solution_steps: ['Formula: TSA = 6 × a²', 'Substitute: TSA = 6 × 5² = 6 × 25', 'TSA = 150 cm²'],
    hints: {
      level1: 'A cube has 6 identical square faces. Recall the total surface area formula.',
      level2: 'Substitute a = 5 into TSA = 6 × a².',
      level3: 'TSA = 6 × 25 = ___ cm²',
    },
    remedial: {
      concept_recap: 'A cube has 6 equal square faces. Total Surface Area = 6 × area of one face = 6a².',
      formula: 'TSA = 6 × a²',
      worked_example: 'Cube edge = 4 cm → TSA = 6 × 16 = 96 cm²',
      common_mistake: 'Using 4a² (lateral surface area of cube) instead of 6a² for TSA.',
      memory_tip: '"Six faces, each a² — TSA = 6a²."',
    },
    expectedTime: 40,
  },

  {
    qid: 'SA-E-02', topic: 'surface_area', shape: 'cuboid', difficulty: 'beginner',
    type: 'mcq',
    question: 'What is the total surface area of a cuboid with l = 6 cm, b = 4 cm, h = 3 cm?',
    answer: 108, unit: 'cm²', formula: 'TSA = 2(lb + bh + lh)',
    options: { A: '72 cm²', B: '54 cm²', C: '144 cm²', D: '108 cm²' },
    correct_option: 'D',
    solution_steps: [
      'TSA = 2(lb + bh + lh)',
      '= 2(6×4 + 4×3 + 6×3) = 2(24 + 12 + 18) = 2 × 54',
      'TSA = 108 cm²',
    ],
    hints: {
      level1: 'A cuboid has 3 pairs of rectangular faces. Recall the TSA formula.',
      level2: 'TSA = 2(lb + bh + lh). Substitute l=6, b=4, h=3.',
      level3: 'TSA = 2(24 + 12 + 18) = 2 × 54 = ___ cm²',
    },
    remedial: {
      concept_recap: 'A cuboid has 3 pairs of faces: top/bottom (lb), front/back (lh), left/right (bh). TSA = 2(lb + bh + lh).',
      formula: 'TSA = 2(lb + bh + lh)',
      worked_example: 'l=5, b=3, h=2 → TSA = 2(15+6+10) = 2×31 = 62 cm²',
      common_mistake: 'Adding lb + bh + lh without multiplying by 2 at the end.',
      memory_tip: '"Three pairs of faces — compute each pair\'s area, add, then multiply by 2."',
    },
    expectedTime: 50,
  },

  {
    qid: 'SA-E-03', topic: 'surface_area', shape: 'cylinder', difficulty: 'beginner',
    type: 'fill_in_blank',
    question: 'The curved surface area of a cylinder with radius 7 cm and height 10 cm is ___ cm². (Use π = 22/7)',
    answer: 440, unit: 'cm²', formula: 'CSA = 2 × π × r × h',
    solution_steps: [
      'CSA = 2 × π × r × h',
      '= 2 × (22/7) × 7 × 10 = 2 × 22 × 10',
      'CSA = 440 cm²',
    ],
    hints: {
      level1: 'The curved surface area of a cylinder is the area of the curved part (like the label on a can).',
      level2: 'Substitute r = 7, h = 10 into CSA = 2πrh.',
      level3: 'CSA = 2 × (22/7) × 7 × 10 = ___ cm²',
    },
    remedial: {
      concept_recap: 'CSA of a cylinder = 2πrh. This is the lateral area — the curved wall, not including the top and bottom circles.',
      formula: 'CSA = 2 × π × r × h',
      worked_example: 'r=3.5, h=10 → CSA = 2×(22/7)×3.5×10 = 220 cm²',
      common_mistake: 'Using TSA = 2πr(r+h) when only CSA is required.',
      memory_tip: '"CSA = just the curved wall = 2πrh. TSA adds the two circles."',
    },
    expectedTime: 50,
  },

  {
    qid: 'SA-E-04', topic: 'surface_area', shape: 'cube', difficulty: 'beginner',
    type: 'true_false',
    question: 'True or False: The total surface area of a cube with edge 4 cm is 96 cm².',
    answer: 1, unit: '', formula: 'TSA = 6 × a²',
    correct_verdict: 'True',
    reason: 'TSA = 6 × 4² = 6 × 16 = 96 cm². The statement is correct.',
    solution_steps: ['TSA = 6 × a² = 6 × 4²', '= 6 × 16 = 96 cm²', 'Statement is True ✓'],
    hints: {
      level1: 'Apply TSA = 6a² with a = 4 and compare.',
      level2: 'TSA = 6 × 16 = 96 cm². Does this match the statement?',
      level3: 'TSA = 96 cm² ✓ — True',
    },
    remedial: {
      concept_recap: 'TSA of cube = 6a². For a=4: TSA = 6×16 = 96 cm².',
      formula: 'TSA = 6 × a²',
      worked_example: 'a=3 → TSA = 6×9 = 54 cm²',
      common_mistake: 'Using 4a² (LSA) instead of 6a² (TSA).',
      memory_tip: '"Total = 6 faces; Lateral = 4 faces (sides only)."',
    },
    expectedTime: 35,
  },

  {
    qid: 'SA-E-05', topic: 'surface_area', shape: 'cuboid', difficulty: 'beginner',
    type: 'direct_calculation',
    question: 'Find the total surface area of a cuboid with l = 10 cm, b = 8 cm, h = 5 cm.',
    answer: 340, unit: 'cm²', formula: 'TSA = 2(lb + bh + lh)',
    solution_steps: [
      'TSA = 2(lb + bh + lh)',
      '= 2(80 + 40 + 50) = 2 × 170',
      'TSA = 340 cm²',
    ],
    hints: {
      level1: 'Use TSA = 2(lb + bh + lh) for a cuboid.',
      level2: 'Substitute l=10, b=8, h=5 and compute each pair.',
      level3: 'TSA = 2(80 + 40 + 50) = 2 × 170 = ___ cm²',
    },
    remedial: {
      concept_recap: 'TSA of cuboid = 2(lb + bh + lh). Compute each pair (l×b, b×h, l×h), add them, multiply by 2.',
      formula: 'TSA = 2(lb + bh + lh)',
      worked_example: 'l=6, b=4, h=3 → 2(24+12+18)=2×54=108 cm²',
      common_mistake: 'Adding only lb + bh + lh without the factor of 2.',
      memory_tip: '"Two of each face — remember to multiply by 2."',
    },
    expectedTime: 55,
  },

  {
    qid: 'SA-E-06', topic: 'surface_area', shape: 'cylinder', difficulty: 'beginner',
    type: 'mcq',
    question: 'What is the curved surface area of a cylinder with radius 3.5 cm and height 10 cm? (Use π = 22/7)',
    answer: 220, unit: 'cm²', formula: 'CSA = 2 × π × r × h',
    options: { A: '110 cm²', B: '440 cm²', C: '220 cm²', D: '77 cm²' },
    correct_option: 'C',
    solution_steps: [
      'CSA = 2 × (22/7) × 3.5 × 10',
      '= 2 × (22/7) × 35 = 2 × 110',
      'CSA = 220 cm²',
    ],
    hints: {
      level1: 'CSA = 2πrh for a cylinder.',
      level2: 'Substitute r = 3.5 and h = 10 into CSA = 2 × (22/7) × r × h.',
      level3: 'CSA = 2 × (22/7) × 35 = 2 × 110 = ___ cm²',
    },
    remedial: {
      concept_recap: 'CSA = 2πrh. With r=3.5=7/2, the calculation becomes 2 × 22/7 × 7/2 × h = 22h.',
      formula: 'CSA = 2 × π × r × h',
      worked_example: 'r=7, h=5 → CSA=2×(22/7)×7×5=2×22×5=220 cm²',
      common_mistake: 'Using TSA formula instead of just CSA.',
      memory_tip: '"CSA = curved only = 2πrh."',
    },
    expectedTime: 55,
  },

  {
    qid: 'SA-E-07', topic: 'surface_area', shape: 'cube', difficulty: 'beginner',
    type: 'fill_in_blank',
    question: 'The lateral surface area of a cube with edge 6 cm is ___ cm².',
    answer: 144, unit: 'cm²', formula: 'LSA = 4 × a²',
    solution_steps: ['LSA = 4 × a²', 'Substitute: LSA = 4 × 6² = 4 × 36', 'LSA = 144 cm²'],
    hints: {
      level1: 'Lateral surface area of a cube includes only the 4 side faces, not top and bottom.',
      level2: 'Substitute a = 6 into LSA = 4 × a².',
      level3: 'LSA = 4 × 36 = ___ cm²',
    },
    remedial: {
      concept_recap: 'LSA (lateral) = 4 faces only = 4a². TSA = 6 faces = 6a². Lateral excludes top and bottom.',
      formula: 'LSA = 4 × a²',
      worked_example: 'a=5 → LSA=4×25=100 cm²; TSA=6×25=150 cm²',
      common_mistake: 'Using TSA = 6a² when only lateral (4a²) is asked.',
      memory_tip: '"Lateral = 4 side walls only. Total = all 6 faces."',
    },
    expectedTime: 45,
  },

  {
    qid: 'SA-E-08', topic: 'surface_area', shape: 'cuboid', difficulty: 'beginner',
    type: 'reverse_find',
    question: 'A cuboid has l = 6 cm, b = 4 cm, and TSA = 108 cm². Find its height.',
    answer: 3, unit: 'cm', formula: 'TSA = 2(lb + bh + lh)',
    solution_steps: [
      '108 = 2(6×4 + 4h + 6h) = 2(24 + 10h)',
      '54 = 24 + 10h → 10h = 30',
      'h = 3 cm',
    ],
    hints: {
      level1: 'Use TSA = 2(lb + bh + lh) and solve for h.',
      level2: '108 = 2(24 + 4h + 6h) = 2(24 + 10h). Simplify.',
      level3: '54 = 24 + 10h → h = ___ cm',
    },
    remedial: {
      concept_recap: 'Set up TSA = 2(lb + h(l+b)) and solve for h. Group h terms together.',
      formula: 'TSA = 2(lb + h(l+b)); h = (TSA/2 − lb) ÷ (l+b)',
      worked_example: 'l=8,b=5,TSA=214 → 214=2(40+13h)→107=40+13h→h=67/13≈5.15',
      common_mistake: 'Not grouping the h-terms together before solving.',
      memory_tip: '"Group h terms: TSA/2 − lb = h(l+b), then divide."',
    },
    expectedTime: 70,
  },

  {
    qid: 'SA-E-09', topic: 'surface_area', shape: 'cylinder', difficulty: 'beginner',
    type: 'direct_calculation',
    question: 'Find the total surface area of a cylinder with radius 7 cm and height 15 cm. (Use π = 22/7)',
    answer: 968, unit: 'cm²', formula: 'TSA = 2 × π × r × (r + h)',
    solution_steps: [
      'TSA = 2 × π × r × (r + h)',
      '= 2 × (22/7) × 7 × (7 + 15) = 2 × 22 × 22',
      'TSA = 968 cm²',
    ],
    hints: {
      level1: 'TSA of a cylinder includes the curved surface AND both circular bases.',
      level2: 'TSA = 2πr(r+h). Substitute r=7, h=15.',
      level3: 'TSA = 2 × (22/7) × 7 × 22 = 44 × 22 = ___ cm²',
    },
    remedial: {
      concept_recap: 'TSA = 2πr(r+h) = CSA + 2 × base area. It includes both the curved wall and both circular tops.',
      formula: 'TSA = 2 × π × r × (r + h)',
      worked_example: 'r=3.5, h=10 → TSA=2×(22/7)×3.5×13.5=2×11×13.5=297 cm²',
      common_mistake: 'Using CSA = 2πrh and forgetting to add the two circular bases.',
      memory_tip: '"TSA = CSA + 2 circles. The (r+h) in TSA = 2πr(r+h) handles this."',
    },
    expectedTime: 65,
  },

  {
    qid: 'SA-E-10', topic: 'surface_area', shape: 'cube', difficulty: 'beginner',
    type: 'mcq',
    question: 'The total surface area of a cube is 216 cm². What is the length of its edge?',
    answer: 6, unit: 'cm', formula: 'a = √(TSA ÷ 6)',
    options: { A: '4 cm', B: '9 cm', C: '36 cm', D: '6 cm' },
    correct_option: 'D',
    solution_steps: ['TSA = 6a² → a² = 216 ÷ 6 = 36', 'a = √36 = 6 cm'],
    hints: {
      level1: 'Rearrange TSA = 6a² to find a.',
      level2: 'a² = TSA ÷ 6 = 216 ÷ 6 = 36.',
      level3: 'a = √36 = ___ cm',
    },
    remedial: {
      concept_recap: 'From TSA = 6a²: a² = TSA/6. Take the square root to find a.',
      formula: 'a = √(TSA ÷ 6)',
      worked_example: 'TSA=96 → a²=16 → a=4 cm',
      common_mistake: 'Dividing TSA by 4 (confusing 6 faces with 4 sides).',
      memory_tip: '"Divide by 6 (six faces), then take the square root."',
    },
    expectedTime: 55,
  },

  // ════════════════════════════════════════════════════════
  //  SURFACE AREA — MEDIUM  (SA-M-01 to SA-M-10)
  // ════════════════════════════════════════════════════════

  {
    qid: 'SA-M-01', topic: 'surface_area', shape: 'cuboid', difficulty: 'intermediate',
    type: 'word_problem',
    question: 'A room is 12 m long, 10 m wide and 4 m high. Find the total area of its four walls (lateral surface area).',
    answer: 176, unit: 'm²', formula: 'LSA = 2 × h × (l + b)',
    solution_steps: [
      'LSA = 2h(l + b)',
      '= 2 × 4 × (12 + 10) = 8 × 22',
      'LSA = 176 m²',
    ],
    hints: {
      level1: 'The four walls of a room are the lateral surfaces of a cuboid.',
      level2: 'Use LSA = 2h(l + b). Substitute l=12, b=10, h=4.',
      level3: 'LSA = 2 × 4 × 22 = ___ m²',
    },
    remedial: {
      concept_recap: 'Lateral surface area of a cuboid (four walls) = 2h(l+b). It excludes floor and ceiling.',
      formula: 'LSA = 2 × h × (l + b)',
      worked_example: 'Room 8×6×3 → LSA=2×3×14=84 m²',
      common_mistake: 'Using TSA = 2(lb+bh+lh) which includes floor and ceiling.',
      memory_tip: '"Four walls only = Lateral = 2h(l+b). TSA includes floor and ceiling too."',
    },
    expectedTime: 75,
  },

  {
    qid: 'SA-M-02', topic: 'surface_area', shape: 'cylinder', difficulty: 'intermediate',
    type: 'reverse_find',
    question: 'The curved surface area of a cylinder is 880 cm² and its height is 20 cm. Find the radius. (Use π = 22/7)',
    answer: 7, unit: 'cm', formula: 'r = CSA ÷ (2πh)',
    solution_steps: [
      'CSA = 2πrh → 880 = 2 × (22/7) × r × 20',
      'r = 880 × 7 ÷ (2 × 22 × 20) = 6160 ÷ 880',
      'r = 7 cm',
    ],
    hints: {
      level1: 'Use CSA = 2πrh and isolate r.',
      level2: 'r = CSA ÷ (2πh) = 880 ÷ (2 × 22/7 × 20). Simplify step by step.',
      level3: 'r = 880 × 7 ÷ 880 = ___ cm',
    },
    remedial: {
      concept_recap: 'From CSA = 2πrh: r = CSA/(2πh). Substitute and simplify.',
      formula: 'r = CSA × 7 ÷ (2 × 22 × h)',
      worked_example: 'CSA=440, h=10 → r=440×7÷440=7 cm',
      common_mistake: 'Multiplying by 2πh instead of dividing.',
      memory_tip: '"Divide CSA by 2πh to get radius."',
    },
    expectedTime: 90,
  },

  {
    qid: 'SA-M-03', topic: 'surface_area', shape: 'cube', difficulty: 'intermediate',
    type: 'comparison',
    question: 'A cube has edge 4 cm and another cube has edge 6 cm. How much more is the total surface area of the larger cube?',
    answer: 120, unit: 'cm²', formula: 'TSA = 6 × a²',
    solution_steps: [
      'TSA (4 cm) = 6 × 16 = 96 cm²',
      'TSA (6 cm) = 6 × 36 = 216 cm²',
      'Difference = 216 − 96 = 120 cm²',
    ],
    hints: {
      level1: 'Calculate TSA for each cube using TSA = 6a², then find the difference.',
      level2: 'TSA₁ = 96 cm²; TSA₂ = 216 cm².',
      level3: 'Difference = 216 − 96 = ___ cm²',
    },
    remedial: {
      concept_recap: 'TSA = 6a². Compute for each edge, then subtract.',
      formula: 'TSA = 6 × a²',
      worked_example: 'Cubes 3cm and 5cm → TSAs 54 and 150 → diff = 96 cm²',
      common_mistake: 'Comparing edges (6−4=2) and multiplying by 6 (wrong approach).',
      memory_tip: '"Square each edge, then multiply by 6. Compare the results."',
    },
    expectedTime: 80,
  },

  {
    qid: 'SA-M-04', topic: 'surface_area', shape: 'cuboid', difficulty: 'intermediate',
    type: 'mcq',
    question: 'A box without a lid has l = 8 cm, b = 6 cm, h = 4 cm. What is the surface area of the outside (excluding the top)?',
    answer: 160, unit: 'cm²', formula: 'TSA − top = 2(lb + bh + lh) − lb',
    options: { A: '208 cm²', B: '160 cm²', C: '96 cm²', D: '112 cm²' },
    correct_option: 'B',
    solution_steps: [
      'TSA = 2(8×6 + 6×4 + 8×4) = 2(48+24+32) = 2×104 = 208 cm²',
      'Top area = lb = 8 × 6 = 48 cm²',
      'Required area = 208 − 48 = 160 cm²',
    ],
    hints: {
      level1: 'Find the full TSA first, then subtract the area of the top face (l × b).',
      level2: 'TSA = 208 cm². Top = 8 × 6 = 48 cm². Subtract to get the area without the lid.',
      level3: '208 − 48 = ___ cm²',
    },
    remedial: {
      concept_recap: 'Box without lid = TSA minus one top face (lb). Use TSA = 2(lb+bh+lh) then subtract lb.',
      formula: 'Area = 2(lb+bh+lh) − lb',
      worked_example: 'l=5,b=4,h=3 → TSA=94, top=20 → open box=74 cm²',
      common_mistake: 'Using TSA (with lid) as the answer without subtracting the top.',
      memory_tip: '"No lid = TSA minus the top face (l×b)."',
    },
    expectedTime: 90,
  },

  {
    qid: 'SA-M-05', topic: 'surface_area', shape: 'cylinder', difficulty: 'intermediate',
    type: 'word_problem',
    question: 'A cylindrical tank has radius 7 m and height 8 m. Find the total area of sheet metal needed to make it (with both circular bases). (Use π = 22/7)',
    answer: 660, unit: 'm²', formula: 'TSA = 2 × π × r × (r + h)',
    solution_steps: [
      'TSA = 2 × (22/7) × 7 × (7 + 8)',
      '= 2 × 22 × 15',
      'TSA = 660 m²',
    ],
    hints: {
      level1: 'Find the total surface area of the closed cylinder.',
      level2: 'TSA = 2πr(r+h). Substitute r=7, h=8.',
      level3: 'TSA = 2 × 22 × 15 = ___ m²',
    },
    remedial: {
      concept_recap: 'TSA = 2πr(r+h) includes both circular bases and the curved surface.',
      formula: 'TSA = 2 × π × r × (r + h)',
      worked_example: 'r=3.5, h=10 → TSA=2×(22/7)×3.5×13.5=297 cm²',
      common_mistake: 'Using CSA = 2πrh (missing the two circular bases).',
      memory_tip: '"TSA = 2πr(r+h). The extra \'r\' term adds the two base circles."',
    },
    expectedTime: 90,
  },

  {
    qid: 'SA-M-06', topic: 'surface_area', shape: 'cube', difficulty: 'intermediate',
    type: 'fill_in_blank',
    question: 'If the edge of a cube is doubled, its total surface area becomes ___ times the original.',
    answer: 4, unit: 'times', formula: 'TSA = 6 × a²',
    solution_steps: [
      'Original TSA = 6a²',
      'New edge = 2a → New TSA = 6(2a)² = 6 × 4a² = 24a²',
      'New TSA = 4 × original TSA',
    ],
    hints: {
      level1: 'Write TSA before and after doubling the edge, then find the ratio.',
      level2: 'New TSA = 6(2a)² = 6 × 4a² = 24a². Original = 6a².',
      level3: 'Ratio = 24a² ÷ 6a² = ___ times',
    },
    remedial: {
      concept_recap: 'TSA ∝ a². If a doubles → TSA × 2² = ×4. Doubling a dimension squares the area.',
      formula: 'TSA = 6a² → New TSA = 6(2a)² = 4 × original',
      worked_example: 'a=3: TSA=54. a=6: TSA=216. 216/54=4. ✓',
      common_mistake: 'Saying TSA doubles when the edge doubles.',
      memory_tip: '"Length doubles → area ×4 (because area depends on length²)."',
    },
    expectedTime: 80,
  },

  {
    qid: 'SA-M-07', topic: 'surface_area', shape: 'cuboid', difficulty: 'intermediate',
    type: 'reverse_find',
    question: 'The total surface area of a cuboid is 208 cm². Its length is 8 cm and breadth is 4 cm. Find its height.',
    answer: 6, unit: 'cm', formula: 'h = (TSA/2 − lb) ÷ (l + b)',
    solution_steps: [
      '208 = 2(8×4 + 4h + 8h) = 2(32 + 12h)',
      '104 = 32 + 12h → 12h = 72',
      'h = 6 cm',
    ],
    hints: {
      level1: 'Set up the TSA equation with h as the unknown.',
      level2: '208 = 2(32 + 12h). Divide by 2 to get 104 = 32 + 12h.',
      level3: '12h = 72 → h = ___ cm',
    },
    remedial: {
      concept_recap: 'TSA = 2(lb + h(l+b)). Rearrange: h = (TSA/2 − lb) ÷ (l+b).',
      formula: 'h = (TSA/2 − lb) ÷ (l + b)',
      worked_example: 'l=6,b=4,TSA=148 → 74=24+10h → h=5 cm',
      common_mistake: 'Not simplifying h(l+b) = h(8+4) = 12h correctly.',
      memory_tip: '"Group h: TSA/2 − lb = h × (l+b). Solve for h."',
    },
    expectedTime: 90,
  },

  {
    qid: 'SA-M-08', topic: 'surface_area', shape: 'cylinder', difficulty: 'intermediate',
    type: 'fill_in_blank',
    question: 'A cylinder has radius 14 cm and height 8 cm. Its total surface area is ___ cm². (Use π = 22/7)',
    answer: 1936, unit: 'cm²', formula: 'TSA = 2 × π × r × (r + h)',
    solution_steps: [
      'TSA = 2 × (22/7) × 14 × (14 + 8)',
      '= 2 × 44 × 22',
      'TSA = 1936 cm²',
    ],
    hints: {
      level1: 'Use TSA = 2πr(r+h) with r=14 and h=8.',
      level2: 'TSA = 2 × (22/7) × 14 × 22 = 2 × 44 × 22.',
      level3: 'TSA = 88 × 22 = ___ cm²',
    },
    remedial: {
      concept_recap: 'TSA = 2πr(r+h). With r=14: first compute 22/7 × 14 = 44, then 2 × 44 × (14+8).',
      formula: 'TSA = 2 × π × r × (r + h)',
      worked_example: 'r=7, h=10 → TSA=2×(22/7)×7×17=2×22×17=748 cm²',
      common_mistake: 'Computing (r+h) as r × h (multiplication instead of addition).',
      memory_tip: '"r + h means ADD r and h — don\'t multiply them."',
    },
    expectedTime: 80,
  },

  {
    qid: 'SA-M-09', topic: 'surface_area', shape: 'cube', difficulty: 'intermediate',
    type: 'word_problem',
    question: '6 identical cubes each with edge 3 cm are joined end to end to form a rectangular box. Find the total surface area of the box.',
    answer: 234, unit: 'cm²', formula: 'TSA = 2(lb + bh + lh)',
    solution_steps: [
      'Box dimensions: l = 6×3 = 18 cm, b = 3 cm, h = 3 cm',
      'TSA = 2(18×3 + 3×3 + 18×3) = 2(54 + 9 + 54) = 2 × 117',
      'TSA = 234 cm²',
    ],
    hints: {
      level1: 'When cubes are joined end to end, the resulting shape is a cuboid. Find its dimensions first.',
      level2: 'L = 6 × 3 = 18 cm, B = 3 cm, H = 3 cm. Now apply TSA = 2(LB + BH + LH).',
      level3: 'TSA = 2(54 + 9 + 54) = 2 × 117 = ___ cm²',
    },
    remedial: {
      concept_recap: 'Joining identical cubes end to end creates a cuboid with L = n × a, B = a, H = a.',
      formula: 'L = n × a; TSA = 2(LB + BH + LH)',
      worked_example: '4 cubes edge 2cm → L=8,B=2,H=2 → TSA=2(16+4+16)=2×36=72 cm²',
      common_mistake: 'Adding TSA of 6 individual cubes (ignoring the joined faces).',
      memory_tip: '"Joined cubes form a cuboid — find new dimensions, then apply TSA formula."',
    },
    expectedTime: 100,
  },

  {
    qid: 'SA-M-10', topic: 'surface_area', shape: 'cuboid', difficulty: 'intermediate',
    type: 'comparison',
    question: 'Cuboid A has dimensions 6 cm × 5 cm × 4 cm and Cuboid B has dimensions 8 cm × 3 cm × 4 cm. By how many cm² is the TSA of Cuboid A greater than Cuboid B?',
    answer: 12, unit: 'cm²', formula: 'TSA = 2(lb + bh + lh)',
    solution_steps: [
      'TSA_A = 2(30+20+24) = 2×74 = 148 cm²',
      'TSA_B = 2(24+12+32) = 2×68 = 136 cm²',
      'Difference = 148 − 136 = 12 cm²',
    ],
    hints: {
      level1: 'Calculate TSA for each cuboid separately, then compare.',
      level2: 'TSA_A = 148 cm²; TSA_B = 136 cm².',
      level3: 'Difference = 148 − 136 = ___ cm²',
    },
    remedial: {
      concept_recap: 'TSA = 2(lb+bh+lh). Compute each and subtract.',
      formula: 'TSA = 2(lb + bh + lh)',
      worked_example: 'A(5×4×3)=94; B(6×2×4)=88; A larger by 6 cm²',
      common_mistake: 'Comparing volumes instead of surface areas.',
      memory_tip: '"Compute both TSAs, then subtract."',
    },
    expectedTime: 90,
  },

  // ════════════════════════════════════════════════════════
  //  SURFACE AREA — HARD  (SA-H-01 to SA-H-10)
  // ════════════════════════════════════════════════════════

  {
    qid: 'SA-H-01', topic: 'surface_area', shape: 'cuboid', difficulty: 'advanced',
    type: 'cost_problem',
    question: 'A room is 15 m long, 10 m wide, and 5 m high. Find the cost of painting the four walls and ceiling at ₹35 per m², given 2 windows each 1.5 m × 1 m and 1 door 2 m × 1 m.',
    answer: 13825, unit: '₹', formula: 'Paintable = Walls + Ceiling − Openings; Cost = Paintable × rate',
    solution_steps: [
      'Walls (4 sides) = 2×5×(15+10) = 250 m²; Ceiling = 15×10 = 150 m²; Total = 400 m²',
      'Openings: 2 windows = 3 m², 1 door = 2 m²; Total openings = 5 m²',
      'Net area = 400−5 = 395 m²; Cost = 395 × 35 = ₹13825',
    ],
    hints: {
      level1: 'Find the total wall and ceiling area, subtract all openings, then multiply by rate.',
      level2: 'Walls = 250 m², Ceiling = 150 m². Subtract windows (3 m²) and door (2 m²).',
      level3: 'Cost = 395 × 35 = ₹___',
    },
    remedial: {
      concept_recap: 'Paintable area = 4 walls (LSA) + ceiling − openings. Walls = 2h(l+b); Ceiling = l×b.',
      formula: 'Net area = 2h(l+b) + lb − openings',
      worked_example: 'Room 10×8×4: walls=144, ceiling=80, total=224; 1 window 2m²=222; at ₹20=₹4440',
      common_mistake: 'Forgetting to include the ceiling or not subtracting the window and door areas.',
      memory_tip: '"Four walls + ceiling − all openings = paintable area."',
    },
    expectedTime: 200,
  },

  {
    qid: 'SA-H-02', topic: 'surface_area', shape: 'cylinder', difficulty: 'advanced',
    type: 'word_problem',
    question: 'A cylindrical pillar has radius 3.5 m and height 10 m. Find the curved surface area of the pillar. (Use π = 22/7)',
    answer: 220, unit: 'm²', formula: 'CSA = 2 × π × r × h',
    solution_steps: [
      'CSA = 2 × (22/7) × 3.5 × 10',
      '= 2 × (22/7) × 35 = 2 × 110',
      'CSA = 220 m²',
    ],
    hints: {
      level1: 'A pillar\'s outer curved area uses the CSA formula.',
      level2: 'CSA = 2πrh. Substitute r = 3.5 and h = 10.',
      level3: 'CSA = 2 × (22/7) × 35 = 2 × 110 = ___ m²',
    },
    remedial: {
      concept_recap: 'CSA = 2πrh — the curved wall area of a cylinder. For a pillar, this is the painted/exposed area.',
      formula: 'CSA = 2 × π × r × h',
      worked_example: 'r=7, h=8 → CSA=2×(22/7)×7×8=352 m²',
      common_mistake: 'Using TSA (including top and bottom circles) when only the curved surface is needed.',
      memory_tip: '"Pillar ↔ curved surface only ↔ CSA = 2πrh."',
    },
    expectedTime: 150,
  },

  {
    qid: 'SA-H-03', topic: 'surface_area', shape: 'cube', difficulty: 'advanced',
    type: 'error_correction',
    question: 'Arun calculated the TSA of a cube with edge 7 cm as: TSA = 4 × 7² = 4 × 49 = 196 cm². Find his mistake and calculate the correct TSA.',
    answer: 294, unit: 'cm²', formula: 'TSA = 6 × a²',
    solution_steps: [
      'Arun\'s error: he used 4a² (lateral surface area) instead of 6a² (total surface area)',
      'Correct formula: TSA = 6 × a²',
      'TSA = 6 × 49 = 294 cm²',
    ],
    hints: {
      level1: 'How many faces does a cube have in total? Arun multiplied by 4 — is that all the faces?',
      level2: 'A cube has 6 faces, not 4. Arun calculated the lateral surface area (4 sides only).',
      level3: 'Correct TSA = 6 × 49 = ___ cm²',
    },
    remedial: {
      concept_recap: 'LSA (lateral) = 4a² (4 side faces). TSA (total) = 6a² (all 6 faces including top and bottom).',
      formula: 'TSA = 6 × a²; LSA = 4 × a²',
      worked_example: 'Edge=5: LSA=100 cm², TSA=150 cm²',
      common_mistake: 'Using 4 instead of 6 — forgetting the top and bottom faces.',
      memory_tip: '"Total = 6 faces. Lateral = 4 side faces only."',
    },
    expectedTime: 150,
  },

  {
    qid: 'SA-H-04', topic: 'surface_area', shape: 'cuboid', difficulty: 'advanced',
    type: 'comparison',
    question: 'Cuboid A has dimensions 8 cm × 6 cm × 5 cm. Cuboid B has dimensions 10 cm × 5 cm × 4 cm. By how many cm² is the TSA of Cuboid A greater than Cuboid B?',
    answer: 16, unit: 'cm²', formula: 'TSA = 2(lb + bh + lh)',
    solution_steps: [
      'TSA_A = 2(48 + 30 + 40) = 2×118 = 236 cm²',
      'TSA_B = 2(50 + 20 + 40) = 2×110 = 220 cm²',
      'Difference = 236 − 220 = 16 cm²',
    ],
    hints: {
      level1: 'Calculate TSA of each cuboid using TSA = 2(lb+bh+lh), then subtract.',
      level2: 'TSA_A = 236 cm²; TSA_B = 220 cm².',
      level3: 'Difference = 236 − 220 = ___ cm²',
    },
    remedial: {
      concept_recap: 'TSA = 2(lb+bh+lh). Compute both and compare.',
      formula: 'TSA = 2(lb + bh + lh)',
      worked_example: 'A(6×5×4)=148; B(7×4×3)=130; A−B=18 cm²',
      common_mistake: 'Comparing volumes (l×b×h) instead of surface areas.',
      memory_tip: '"Surface area measures the outside; use TSA formula, not volume."',
    },
    expectedTime: 180,
  },

  {
    qid: 'SA-H-05', topic: 'surface_area', shape: 'cylinder', difficulty: 'advanced',
    type: 'cost_problem',
    question: 'A cylindrical water tank of radius 7 m and height 10 m is to be painted on its curved surface and one circular base. Find the total painting cost at ₹25 per m². (Use π = 22/7)',
    answer: 14850, unit: '₹', formula: 'Area = CSA + base; Cost = Area × rate',
    solution_steps: [
      'CSA = 2 × (22/7) × 7 × 10 = 440 m²',
      'One base = (22/7) × 7² = 154 m²',
      'Total = 594 m²; Cost = 594 × 25 = ₹14850',
    ],
    hints: {
      level1: 'Find CSA and one base area separately, then add them and multiply by the rate.',
      level2: 'CSA = 440 m²; Base = 154 m². Total = 594 m².',
      level3: 'Cost = 594 × 25 = ₹___',
    },
    remedial: {
      concept_recap: 'When painting CSA + one base: area = 2πrh + πr² = πr(2h + r). Cost = area × rate.',
      formula: 'Area = 2πrh + πr²; Cost = Area × rate',
      worked_example: 'r=3.5, h=8 → CSA=176, base=38.5 → total=214.5 at ₹20=₹4290',
      common_mistake: 'Painting both bases when only one is required.',
      memory_tip: '"Read carefully — one base or both? Add accordingly."',
    },
    expectedTime: 200,
  },

  {
    qid: 'SA-H-06', topic: 'surface_area', shape: 'cube', difficulty: 'advanced',
    type: 'comparison',
    question: 'Box A is a cube of edge 10 cm. Box B is a cube of edge 8 cm. How much more wrapping paper does Box A need than Box B?',
    answer: 216, unit: 'cm²', formula: 'TSA = 6 × a²',
    solution_steps: [
      'TSA_A = 6 × 100 = 600 cm²',
      'TSA_B = 6 × 64 = 384 cm²',
      'Extra paper = 600 − 384 = 216 cm²',
    ],
    hints: {
      level1: 'Wrapping paper needed = total surface area of the cube.',
      level2: 'TSA_A = 600 cm²; TSA_B = 384 cm².',
      level3: 'Difference = 600 − 384 = ___ cm²',
    },
    remedial: {
      concept_recap: 'Wrapping a cube ≈ TSA = 6a². Compare TSA values to find extra paper.',
      formula: 'TSA = 6 × a²',
      worked_example: 'Cube 9cm: TSA=486. Cube 6cm: TSA=216. Diff=270 cm².',
      common_mistake: 'Subtracting edges (10−8=2) and trying to use that.',
      memory_tip: '"Wrapping paper wraps all 6 faces = TSA."',
    },
    expectedTime: 150,
  },

  {
    qid: 'SA-H-07', topic: 'surface_area', shape: 'cuboid', difficulty: 'advanced',
    type: 'reverse_find',
    question: 'The cost of painting all 6 faces of a cuboid at ₹5 per cm² is ₹1280. The length is 12 cm and height is 5 cm. Find the breadth.',
    answer: 4, unit: 'cm', formula: 'b = (TSA/2 − lh) ÷ (l + h)',
    solution_steps: [
      'TSA = 1280 ÷ 5 = 256 cm²',
      '256 = 2(12b + 5b + 60) = 2(17b + 60) → 128 = 17b + 60',
      '17b = 68 → b = 4 cm',
    ],
    hints: {
      level1: 'Find TSA from cost and rate, then set up the equation to find b.',
      level2: 'TSA = 1280 ÷ 5 = 256. Set up: 256 = 2(12b + 5b + 60).',
      level3: '128 = 17b + 60 → 17b = 68 → b = ___ cm',
    },
    remedial: {
      concept_recap: 'Step 1: TSA = cost ÷ rate. Step 2: set up TSA = 2(lb+bh+lh) and solve for b.',
      formula: 'TSA = cost ÷ rate; then solve 2(lb + bh + lh) = TSA',
      worked_example: 'cost=₹750, rate=₹5, l=10, h=3 → TSA=150=2(10b+3b+30)→75=13b+30→b=45/13≈3.46',
      common_mistake: 'Not grouping b-terms: lb + bh = b(l+h), then solving.',
      memory_tip: '"Group b terms together: b(l+h) on one side, known values on the other."',
    },
    expectedTime: 200,
  },

  {
    qid: 'SA-H-08', topic: 'surface_area', shape: 'cylinder', difficulty: 'advanced',
    type: 'word_problem',
    question: 'A cylindrical can has diameter 28 cm and height 20 cm. Find the total area of the metal sheet needed to make it (closed at both ends). (Use π = 22/7)',
    answer: 2992, unit: 'cm²', formula: 'TSA = 2 × π × r × (r + h)',
    solution_steps: [
      'r = 28 ÷ 2 = 14 cm',
      'TSA = 2 × (22/7) × 14 × (14 + 20) = 2 × 44 × 34',
      'TSA = 2992 cm²',
    ],
    hints: {
      level1: 'Convert diameter to radius first, then apply TSA = 2πr(r+h).',
      level2: 'r = 14 cm. TSA = 2 × (22/7) × 14 × 34 = 2 × 44 × 34.',
      level3: 'TSA = 88 × 34 = ___ cm²',
    },
    remedial: {
      concept_recap: 'Metal sheet for a closed cylinder = TSA = 2πr(r+h). Always convert diameter to radius first.',
      formula: 'r = d/2; TSA = 2πr(r+h)',
      worked_example: 'Diameter=14, h=10 → r=7 → TSA=2×(22/7)×7×17=748 cm²',
      common_mistake: 'Using diameter (28) directly in the formula instead of radius (14).',
      memory_tip: '"Diameter ÷ 2 first, THEN calculate TSA."',
    },
    expectedTime: 180,
  },

  {
    qid: 'SA-H-09', topic: 'surface_area', shape: 'cube', difficulty: 'advanced',
    type: 'cost_problem',
    question: 'A cube of edge 1 m is to be painted on all faces. Each face is first primed at ₹20 per m² and then painted at ₹50 per m². Find the total cost.',
    answer: 420, unit: '₹', formula: 'TSA = 6 × a²; Cost = TSA × (rate1 + rate2)',
    solution_steps: [
      'TSA = 6 × 1² = 6 m²',
      'Priming cost = 6 × 20 = ₹120; Painting cost = 6 × 50 = ₹300',
      'Total = ₹120 + ₹300 = ₹420',
    ],
    hints: {
      level1: 'Find TSA of the cube, then apply each rate separately and add the costs.',
      level2: 'TSA = 6 m². Priming = 6×20 = ₹120. Painting = 6×50 = ₹300.',
      level3: 'Total = 120 + 300 = ₹___',
    },
    remedial: {
      concept_recap: 'Multiple cost rates: calculate each cost separately (TSA × rate) and add them.',
      formula: 'Total cost = TSA × rate1 + TSA × rate2 = TSA × (rate1 + rate2)',
      worked_example: 'Cube 2m: TSA=24m²; prime ₹15+paint ₹45=₹60 per m² → 24×60=₹1440',
      common_mistake: 'Adding the two rates and forgetting to multiply by TSA.',
      memory_tip: '"Each face gets both operations: (prime + paint) rate × TSA."',
    },
    expectedTime: 180,
  },

  {
    qid: 'SA-H-10', topic: 'surface_area', shape: 'cuboid', difficulty: 'advanced',
    type: 'word_problem',
    question: 'A suitcase has dimensions 80 cm × 50 cm × 30 cm and is to be covered with cloth on all 6 faces. If cloth costs ₹8 per 100 cm², find the total cost.',
    answer: 1264, unit: '₹', formula: 'TSA = 2(lb + bh + lh); Cost = TSA × rate',
    solution_steps: [
      'TSA = 2(80×50 + 50×30 + 80×30) = 2(4000 + 1500 + 2400) = 2 × 7900 = 15800 cm²',
      'Cost per cm² = ₹8 ÷ 100 = ₹0.08',
      'Cost = 15800 × 0.08 = ₹1264',
    ],
    hints: {
      level1: 'Find TSA of the suitcase in cm², then apply the rate carefully (₹8 per 100 cm²).',
      level2: 'TSA = 15800 cm². Rate = ₹8/100cm² = ₹0.08/cm².',
      level3: 'Cost = 15800 × 0.08 = ₹___',
    },
    remedial: {
      concept_recap: 'TSA = 2(lb+bh+lh). Then apply rate: if rate is per 100 cm², divide by 100 to get rate per cm².',
      formula: 'Cost = TSA × (rate ÷ 100) when rate is per 100 cm²',
      worked_example: 'Box 60×40×20 → TSA=9200 cm²; ₹5/100cm² → cost=460',
      common_mistake: 'Forgetting to convert rate from "per 100 cm²" to "per cm²" before multiplying.',
      memory_tip: '"Rate per 100 cm² → divide rate by 100 to get cost per cm²."',
    },
    expectedTime: 200,
  },

  // ════════════════════════════════════════════════════════
  //  VOLUME — EASY  (V-E-01 to V-E-10)
  // ════════════════════════════════════════════════════════

  {
    qid: 'V-E-01', topic: 'volume', shape: 'cube', difficulty: 'beginner',
    type: 'direct_calculation',
    question: 'Find the volume of a cube with edge 6 cm.',
    answer: 216, unit: 'cm³', formula: 'V = a³',
    solution_steps: ['V = a³', 'Substitute: V = 6³ = 6 × 6 × 6', 'V = 216 cm³'],
    hints: {
      level1: 'Volume of a cube = edge cubed. Recall the formula.',
      level2: 'Substitute a = 6 into V = a³ = 6 × 6 × 6.',
      level3: 'V = 6 × 6 × 6 = ___ cm³',
    },
    remedial: {
      concept_recap: 'Volume of a cube = a³ (edge × edge × edge). It tells us how much space the cube occupies.',
      formula: 'V = a³',
      worked_example: 'Cube edge = 4 cm → V = 4³ = 64 cm³',
      common_mistake: 'Using 3 × a (multiplying by 3) instead of a × a × a (cubing).',
      memory_tip: '"Volume = cube the edge — a³ means a × a × a."',
    },
    expectedTime: 40,
  },

  {
    qid: 'V-E-02', topic: 'volume', shape: 'cuboid', difficulty: 'beginner',
    type: 'mcq',
    question: 'What is the volume of a cuboid with l = 8 cm, b = 5 cm, h = 4 cm?',
    answer: 160, unit: 'cm³', formula: 'V = l × b × h',
    options: { A: '136 cm³', B: '160 cm³', C: '320 cm³', D: '80 cm³' },
    correct_option: 'B',
    solution_steps: ['V = l × b × h', 'V = 8 × 5 × 4', 'V = 160 cm³'],
    hints: {
      level1: 'Volume of a cuboid = product of its three dimensions.',
      level2: 'Substitute l=8, b=5, h=4 into V = l × b × h.',
      level3: 'V = 8 × 5 × 4 = ___ cm³',
    },
    remedial: {
      concept_recap: 'Volume of cuboid = l × b × h. Multiply all three dimensions together.',
      formula: 'V = l × b × h',
      worked_example: 'l=6, b=4, h=3 → V = 72 cm³',
      common_mistake: 'Adding dimensions (8+5+4=17) instead of multiplying.',
      memory_tip: '"Volume = multiply all three dimensions."',
    },
    expectedTime: 40,
  },

  {
    qid: 'V-E-03', topic: 'volume', shape: 'cylinder', difficulty: 'beginner',
    type: 'fill_in_blank',
    question: 'The volume of a cylinder with radius 7 cm and height 10 cm is ___ cm³. (Use π = 22/7)',
    answer: 1540, unit: 'cm³', formula: 'V = π × r² × h',
    solution_steps: [
      'V = π × r² × h',
      '= (22/7) × 7² × 10 = (22/7) × 49 × 10',
      'V = 22 × 7 × 10 = 1540 cm³',
    ],
    hints: {
      level1: 'Volume of a cylinder = π × r² × h. Recall the formula.',
      level2: 'Substitute r=7, h=10 into V = (22/7) × r² × h.',
      level3: 'V = (22/7) × 49 × 10 = 22 × 70 = ___ cm³',
    },
    remedial: {
      concept_recap: 'V = πr²h. First square the radius (r²), multiply by π, then by height h.',
      formula: 'V = π × r² × h  (π = 22/7)',
      worked_example: 'r=3.5, h=10 → V=(22/7)×12.25×10=385 cm³',
      common_mistake: 'Using formula C = 2πr (circumference) instead of V = πr²h.',
      memory_tip: '"Volume: pi r squared h — πr²h."',
    },
    expectedTime: 50,
  },

  {
    qid: 'V-E-04', topic: 'volume', shape: 'cube', difficulty: 'beginner',
    type: 'true_false',
    question: 'True or False: A cube with edge 4 cm has the same volume as a cuboid with l = 8 cm, b = 4 cm, h = 2 cm.',
    answer: 1, unit: '', formula: 'V_cube = a³; V_cuboid = l × b × h',
    correct_verdict: 'True',
    reason: 'Cube V = 4³ = 64 cm³; Cuboid V = 8×4×2 = 64 cm³. Both are 64 cm³.',
    solution_steps: ['Cube V = 4³ = 64 cm³', 'Cuboid V = 8×4×2 = 64 cm³', '64 = 64 → True'],
    hints: {
      level1: 'Calculate the volume of each shape and compare.',
      level2: 'Cube V = 64 cm³; Cuboid V = 8×4×2 = 64 cm³.',
      level3: 'Both equal 64 cm³ → True',
    },
    remedial: {
      concept_recap: 'Different shapes can have the same volume. Cube: a³; Cuboid: l×b×h.',
      formula: 'Cube: V = a³; Cuboid: V = l×b×h',
      worked_example: 'Cube a=3 (V=27); Cuboid 9×3×1 (V=27) → same volume ✓',
      common_mistake: 'Assuming different shapes always have different volumes.',
      memory_tip: '"Volume is about space — different shapes can fill the same space."',
    },
    expectedTime: 45,
  },

  {
    qid: 'V-E-05', topic: 'volume', shape: 'cuboid', difficulty: 'beginner',
    type: 'direct_calculation',
    question: 'Find the volume of a cuboid with l = 12 cm, b = 9 cm, h = 5 cm.',
    answer: 540, unit: 'cm³', formula: 'V = l × b × h',
    solution_steps: ['V = l × b × h', 'V = 12 × 9 × 5', 'V = 540 cm³'],
    hints: {
      level1: 'Use V = l × b × h for a cuboid.',
      level2: 'Substitute l=12, b=9, h=5.',
      level3: 'V = 12 × 9 × 5 = ___ cm³',
    },
    remedial: {
      concept_recap: 'Volume of cuboid = l × b × h. Multiply all three dimensions.',
      formula: 'V = l × b × h',
      worked_example: 'l=10, b=8, h=3 → V=240 cm³',
      common_mistake: 'Finding surface area (TSA) instead of volume.',
      memory_tip: '"Volume: three dimensions multiplied together."',
    },
    expectedTime: 40,
  },

  {
    qid: 'V-E-06', topic: 'volume', shape: 'cylinder', difficulty: 'beginner',
    type: 'mcq',
    question: 'Find the volume of a cylinder with radius 3.5 cm and height 12 cm. (Use π = 22/7)',
    answer: 462, unit: 'cm³', formula: 'V = π × r² × h',
    options: { A: '231 cm³', B: '924 cm³', C: '462 cm³', D: '154 cm³' },
    correct_option: 'C',
    solution_steps: [
      'V = (22/7) × 3.5² × 12 = (22/7) × 12.25 × 12',
      '= (22/7) × 147 = 22 × 21',
      'V = 462 cm³',
    ],
    hints: {
      level1: 'V = πr²h. Square the radius first.',
      level2: 'r² = 3.5² = 12.25. V = (22/7) × 12.25 × 12.',
      level3: '(22/7) × 12.25 = (22/7) × (49/4) = (22×7)/4 = 38.5. V = 38.5 × 12 = ___ cm³',
    },
    remedial: {
      concept_recap: 'V = πr²h. With r=3.5: r²=12.25=49/4. Then (22/7)×(49/4)=11×7/2=38.5. V=38.5h.',
      formula: 'V = π × r² × h',
      worked_example: 'r=7, h=5 → V=(22/7)×49×5=22×7×5=770 cm³',
      common_mistake: 'Not squaring r before multiplying by π.',
      memory_tip: '"πr²h: square r first, then multiply by π and h."',
    },
    expectedTime: 60,
  },

  {
    qid: 'V-E-07', topic: 'volume', shape: 'cube', difficulty: 'beginner',
    type: 'fill_in_blank',
    question: 'A cube has volume 343 cm³. Its edge length is ___ cm.',
    answer: 7, unit: 'cm', formula: 'a = ∛V',
    solution_steps: ['V = a³ → a = ∛V', 'a = ∛343', 'a = 7 cm (since 7³ = 343)'],
    hints: {
      level1: 'From V = a³, find a by taking the cube root of V.',
      level2: 'a = ∛343. Which number multiplied by itself three times gives 343?',
      level3: '7 × 7 × 7 = 343 → a = ___ cm',
    },
    remedial: {
      concept_recap: 'From V = a³: a = ∛V. The cube root of 343 = 7 because 7³ = 343.',
      formula: 'a = ∛V',
      worked_example: 'V = 125 → a = ∛125 = 5 cm (since 5³ = 125)',
      common_mistake: 'Dividing by 3 (a = 343/3) instead of taking the cube root.',
      memory_tip: '"Cube root undoes cubing: a = ∛V."',
    },
    expectedTime: 55,
  },

  {
    qid: 'V-E-08', topic: 'volume', shape: 'cuboid', difficulty: 'beginner',
    type: 'reverse_find',
    question: 'A cuboid has volume 480 cm³, length 15 cm and height 4 cm. Find its breadth.',
    answer: 8, unit: 'cm', formula: 'b = V ÷ (l × h)',
    solution_steps: ['V = l × b × h → b = V ÷ (l × h)', 'b = 480 ÷ (15 × 4) = 480 ÷ 60', 'b = 8 cm'],
    hints: {
      level1: 'Rearrange V = l × b × h to find b.',
      level2: 'b = V ÷ (l × h) = 480 ÷ (15 × 4).',
      level3: 'b = 480 ÷ 60 = ___ cm',
    },
    remedial: {
      concept_recap: 'From V = lbh: b = V ÷ (l × h). Divide volume by the product of the other two dimensions.',
      formula: 'b = V ÷ (l × h)',
      worked_example: 'V=120, l=10, h=3 → b=120÷30=4 cm',
      common_mistake: 'Multiplying l × h × V instead of dividing.',
      memory_tip: '"To find one dimension: divide volume by the product of the other two."',
    },
    expectedTime: 55,
  },

  {
    qid: 'V-E-09', topic: 'volume', shape: 'cylinder', difficulty: 'beginner',
    type: 'direct_calculation',
    question: 'Find the volume of a cylinder with radius 14 cm and height 5 cm. (Use π = 22/7)',
    answer: 3080, unit: 'cm³', formula: 'V = π × r² × h',
    solution_steps: [
      'V = (22/7) × 14² × 5 = (22/7) × 196 × 5',
      '= 22 × 28 × 5',
      'V = 3080 cm³',
    ],
    hints: {
      level1: 'Use V = πr²h. First calculate r² = 14² = 196.',
      level2: 'V = (22/7) × 196 × 5. Simplify (22/7) × 196 = 22 × 28.',
      level3: 'V = 22 × 28 × 5 = ___ cm³',
    },
    remedial: {
      concept_recap: 'V = πr²h. (22/7) × 196 = 22 × 28 = 616. Then 616 × 5 = 3080.',
      formula: 'V = π × r² × h',
      worked_example: 'r=7, h=10 → V=(22/7)×49×10=22×7×10=1540 cm³',
      common_mistake: 'Dividing r by 7 early and making arithmetic errors.',
      memory_tip: '"Group 22/7 with r² to cancel the 7. Then multiply by h."',
    },
    expectedTime: 55,
  },

  {
    qid: 'V-E-10', topic: 'volume', shape: 'cube', difficulty: 'beginner',
    type: 'mcq',
    question: 'A cubical water tank has edge 5 m. What is its capacity in litres? (1 m³ = 1000 litres)',
    answer: 125000, unit: 'litres', formula: 'V = a³; Capacity = V × 1000',
    options: { A: '125 litres', B: '12500 litres', C: '125000 litres', D: '1250 litres' },
    correct_option: 'C',
    solution_steps: ['V = 5³ = 125 m³', 'Capacity = 125 × 1000 litres', 'Capacity = 125000 litres'],
    hints: {
      level1: 'Find the volume in m³ first, then convert to litres using 1 m³ = 1000 L.',
      level2: 'V = 5³ = 125 m³. Multiply by 1000 to get litres.',
      level3: '125 × 1000 = ___ litres',
    },
    remedial: {
      concept_recap: 'Volume of cube in m³ = a³. Capacity in litres = V × 1000 (since 1 m³ = 1000 L).',
      formula: 'V = a³; 1 m³ = 1000 litres',
      worked_example: 'Cube 3m → V=27m³ → 27000 litres',
      common_mistake: 'Forgetting to convert m³ to litres, giving 125 instead of 125000.',
      memory_tip: '"Litres = m³ × 1000."',
    },
    expectedTime: 55,
  },

  // ════════════════════════════════════════════════════════
  //  VOLUME — MEDIUM  (V-M-01 to V-M-10)
  // ════════════════════════════════════════════════════════

  {
    qid: 'V-M-01', topic: 'volume', shape: 'cuboid', difficulty: 'intermediate',
    type: 'word_problem',
    question: 'A rectangular water tank is 4 m long, 3 m wide, and 2 m deep. How many litres of water can it hold? (1 m³ = 1000 litres)',
    answer: 24000, unit: 'litres', formula: 'V = l × b × h; Litres = V × 1000',
    solution_steps: ['V = 4 × 3 × 2 = 24 m³', 'Capacity = 24 × 1000 = 24000 litres'],
    hints: {
      level1: 'Find the volume in m³, then convert to litres.',
      level2: 'V = 4 × 3 × 2 = 24 m³. 1 m³ = 1000 L.',
      level3: 'Capacity = 24 × 1000 = ___ litres',
    },
    remedial: {
      concept_recap: 'Volume of cuboid = l×b×h. To get litres, multiply m³ by 1000.',
      formula: 'V = l×b×h; Litres = V × 1000',
      worked_example: 'Tank 5×4×3=60 m³ = 60000 litres',
      common_mistake: 'Not converting m³ to litres.',
      memory_tip: '"1 m³ holds 1000 litres — multiply volume by 1000."',
    },
    expectedTime: 75,
  },

  {
    qid: 'V-M-02', topic: 'volume', shape: 'cylinder', difficulty: 'intermediate',
    type: 'reverse_find',
    question: 'The volume of a cylinder is 1540 cm³ and its height is 10 cm. Find its radius. (Use π = 22/7)',
    answer: 7, unit: 'cm', formula: 'r = √(V ÷ (π × h))',
    solution_steps: [
      '1540 = (22/7) × r² × 10 → r² = 1540 × 7 ÷ (22 × 10) = 49',
      'r = √49 = 7 cm',
    ],
    hints: {
      level1: 'Rearrange V = πr²h to isolate r².',
      level2: 'r² = 1540 × 7 ÷ (22 × 10) = 10780 ÷ 220 = 49.',
      level3: 'r = √49 = ___ cm',
    },
    remedial: {
      concept_recap: 'From V = πr²h: r² = V × 7 ÷ (22 × h). Then r = √r².',
      formula: 'r² = V × 7 ÷ (22 × h); r = √r²',
      worked_example: 'V=3080, h=5 → r²=3080×7÷(22×5)=196 → r=14 cm',
      common_mistake: 'Forgetting to take the square root at the end.',
      memory_tip: '"Divide volume by πh → get r² → take √ → get r."',
    },
    expectedTime: 90,
  },

  {
    qid: 'V-M-03', topic: 'volume', shape: 'cube', difficulty: 'intermediate',
    type: 'comparison',
    question: 'Cube A has edge 5 cm and Cube B has edge 4 cm. How much more volume does Cube A have?',
    answer: 61, unit: 'cm³', formula: 'V = a³',
    solution_steps: ['V_A = 5³ = 125 cm³', 'V_B = 4³ = 64 cm³', 'Difference = 125 − 64 = 61 cm³'],
    hints: {
      level1: 'Find the volume of each cube, then subtract.',
      level2: 'V_A = 125 cm³; V_B = 64 cm³.',
      level3: 'Difference = 125 − 64 = ___ cm³',
    },
    remedial: {
      concept_recap: 'V = a³. Compute each and find the difference.',
      formula: 'V = a³',
      worked_example: 'Cube 6 (V=216) vs cube 5 (V=125) → diff = 91 cm³',
      common_mistake: 'Subtracting edges (5−4=1) then cubing (1³=1) — wrong approach.',
      memory_tip: '"Cube each edge, THEN subtract."',
    },
    expectedTime: 75,
  },

  {
    qid: 'V-M-04', topic: 'volume', shape: 'cuboid', difficulty: 'intermediate',
    type: 'mcq',
    question: 'A rectangular box has volume 360 cm³. Its length is 10 cm and breadth is 6 cm. What is its height?',
    answer: 6, unit: 'cm', formula: 'h = V ÷ (l × b)',
    options: { A: '4 cm', B: '8 cm', C: '6 cm', D: '12 cm' },
    correct_option: 'C',
    solution_steps: ['h = V ÷ (l × b) = 360 ÷ (10 × 6) = 360 ÷ 60', 'h = 6 cm'],
    hints: {
      level1: 'Rearrange V = l × b × h to find h.',
      level2: 'h = 360 ÷ (10 × 6) = 360 ÷ 60.',
      level3: '360 ÷ 60 = ___ cm',
    },
    remedial: {
      concept_recap: 'h = V ÷ (l × b). Divide volume by the product of the two known dimensions.',
      formula: 'h = V ÷ (l × b)',
      worked_example: 'V=240, l=8, b=5 → h=240÷40=6 cm',
      common_mistake: 'Computing l × b × V instead of dividing.',
      memory_tip: '"Divide volume by the product of the other two sides."',
    },
    expectedTime: 70,
  },

  {
    qid: 'V-M-05', topic: 'volume', shape: 'cylinder', difficulty: 'intermediate',
    type: 'word_problem',
    question: 'A cylindrical water tank of radius 7 m and height 5 m is half full. Find the volume of water in the tank. (Use π = 22/7)',
    answer: 385, unit: 'm³', formula: 'V_half = (1/2) × π × r² × h',
    solution_steps: [
      'Full V = (22/7) × 7² × 5 = (22/7) × 49 × 5 = 770 m³',
      'Volume of water (half) = 770 ÷ 2',
      'V_water = 385 m³',
    ],
    hints: {
      level1: 'Find the full capacity first, then take half.',
      level2: 'Full V = (22/7) × 49 × 5 = 770 m³. Half = 770 ÷ 2.',
      level3: 'V_water = 770 ÷ 2 = ___ m³',
    },
    remedial: {
      concept_recap: 'Half-full tank contains V/2. Full V = πr²h; half = πr²h/2.',
      formula: 'V_half = πr²h ÷ 2',
      worked_example: 'r=14, h=10: full=6160; half=3080 m³',
      common_mistake: 'Finding full volume and giving it as the answer.',
      memory_tip: '"Half full = half the full volume."',
    },
    expectedTime: 85,
  },

  {
    qid: 'V-M-06', topic: 'volume', shape: 'cube', difficulty: 'intermediate',
    type: 'fill_in_blank',
    question: 'If the edge of a cube is tripled, its volume becomes ___ times the original.',
    answer: 27, unit: 'times', formula: 'V = a³',
    solution_steps: [
      'Original V = a³',
      'New edge = 3a → New V = (3a)³ = 27a³',
      'New V = 27 × original V',
    ],
    hints: {
      level1: 'Write the new volume after tripling the edge, then compare to original.',
      level2: 'New V = (3a)³ = 3³ × a³ = 27a³.',
      level3: 'Ratio = 27a³ ÷ a³ = ___ times',
    },
    remedial: {
      concept_recap: 'V ∝ a³. Tripling a multiplies V by 3³ = 27.',
      formula: 'New V = (ka)³ = k³ × original V',
      worked_example: 'a=2: V=8; a=6: V=216=27×8 ✓',
      common_mistake: 'Saying volume triples when edge triples.',
      memory_tip: '"Edge tripled → volume ×27 (because V ∝ a³ and 3³=27)."',
    },
    expectedTime: 80,
  },

  {
    qid: 'V-M-07', topic: 'volume', shape: 'cuboid', difficulty: 'intermediate',
    type: 'reverse_find',
    question: 'A rectangular tank of capacity 1200 litres has length 2 m and breadth 1.5 m. Find the depth of the tank. (1 m³ = 1000 litres)',
    answer: 0.4, unit: 'm', formula: 'h = V ÷ (l × b)',
    solution_steps: [
      'V = 1200 L ÷ 1000 = 1.2 m³',
      'h = 1.2 ÷ (2 × 1.5) = 1.2 ÷ 3',
      'h = 0.4 m',
    ],
    hints: {
      level1: 'Convert litres to m³ first, then find depth = V ÷ (l × b).',
      level2: 'V = 1.2 m³. h = 1.2 ÷ (2 × 1.5) = 1.2 ÷ 3.',
      level3: 'h = 1.2 ÷ 3 = ___ m',
    },
    remedial: {
      concept_recap: 'Convert capacity to m³ (÷1000), then h = V/(l×b).',
      formula: 'V = Litres ÷ 1000; h = V ÷ (l × b)',
      worked_example: '600L=0.6m³; l=2, b=1 → h=0.3m',
      common_mistake: 'Not converting litres to m³ before dividing.',
      memory_tip: '"Litres ÷ 1000 = m³; then divide by base area to get height."',
    },
    expectedTime: 90,
  },

  {
    qid: 'V-M-08', topic: 'volume', shape: 'cylinder', difficulty: 'intermediate',
    type: 'fill_in_blank',
    question: 'A cylinder of radius 7 cm and height 20 cm has volume ___ cm³. (Use π = 22/7)',
    answer: 3080, unit: 'cm³', formula: 'V = π × r² × h',
    solution_steps: [
      'V = (22/7) × 7² × 20 = (22/7) × 49 × 20',
      '= 22 × 7 × 20',
      'V = 3080 cm³',
    ],
    hints: {
      level1: 'Use V = πr²h. Substitute r=7, h=20.',
      level2: '(22/7) × 49 = 22 × 7 = 154. Then 154 × 20.',
      level3: 'V = 154 × 20 = ___ cm³',
    },
    remedial: {
      concept_recap: 'V = πr²h. With r=7: (22/7)×49=154. V = 154 × h.',
      formula: 'V = π × r² × h',
      worked_example: 'r=7, h=10 → V=(22/7)×49×10=1540 cm³',
      common_mistake: 'Using 2πrh (CSA formula) for volume.',
      memory_tip: '"Volume = πr²h. Surface area = 2πrh (curved). Different formulas!"',
    },
    expectedTime: 70,
  },

  {
    qid: 'V-M-09', topic: 'volume', shape: 'cube', difficulty: 'intermediate',
    type: 'word_problem',
    question: 'How many small cubes of edge 2 cm can be cut from a bigger cube of edge 10 cm?',
    answer: 125, unit: 'cubes', formula: 'Number = (Big edge ÷ Small edge)³',
    solution_steps: [
      'Number along each edge = 10 ÷ 2 = 5',
      'Total cubes = 5³ = 5 × 5 × 5',
      'Total = 125 cubes',
    ],
    hints: {
      level1: 'Find how many small cubes fit along one edge, then cube that number.',
      level2: 'Per edge: 10 ÷ 2 = 5. Total = 5³.',
      level3: 'Total = 5 × 5 × 5 = ___ cubes',
    },
    remedial: {
      concept_recap: 'Number of small cubes = (Big V) ÷ (Small V) = (Big edge ÷ Small edge)³.',
      formula: 'Number = (L/l)³ = (Big edge ÷ Small edge)³',
      worked_example: 'Big 12, small 3 → per edge=4 → total=4³=64 cubes',
      common_mistake: 'Dividing big volume by small volume without recognising it equals (edge ratio)³.',
      memory_tip: '"Cubes along one edge cubed = total number of cubes."',
    },
    expectedTime: 85,
  },

  {
    qid: 'V-M-10', topic: 'volume', shape: 'cuboid', difficulty: 'intermediate',
    type: 'comparison',
    question: 'Box A has dimensions 8 cm × 6 cm × 5 cm and Box B has dimensions 10 cm × 4 cm × 5 cm. By how many cm³ is Box A\'s volume greater than Box B?',
    answer: 40, unit: 'cm³', formula: 'V = l × b × h',
    solution_steps: ['V_A = 8×6×5 = 240 cm³', 'V_B = 10×4×5 = 200 cm³', 'Difference = 240 − 200 = 40 cm³'],
    hints: {
      level1: 'Calculate the volume of each box, then subtract.',
      level2: 'V_A = 240 cm³; V_B = 200 cm³.',
      level3: 'Difference = 240 − 200 = ___ cm³',
    },
    remedial: {
      concept_recap: 'V = l×b×h. Compute each volume and subtract.',
      formula: 'V = l × b × h',
      worked_example: 'Box A 7×5×4=140; Box B 10×4×3=120; A > B by 20 cm³',
      common_mistake: 'Comparing TSA instead of volume.',
      memory_tip: '"Volume = l × b × h. Compare the final numbers."',
    },
    expectedTime: 80,
  },

  // ════════════════════════════════════════════════════════
  //  VOLUME — HARD  (V-H-01 to V-H-10)
  // ════════════════════════════════════════════════════════

  {
    qid: 'V-H-01', topic: 'volume', shape: 'cuboid', difficulty: 'advanced',
    type: 'cost_problem',
    question: 'A swimming pool is 30 m long, 15 m wide, and 2 m deep. It is to be filled with water. If water costs ₹2 per 100 litres, find the total cost. (1 m³ = 1000 litres)',
    answer: 18000, unit: '₹', formula: 'V = l×b×h; Litres = V×1000; Cost = Litres × rate',
    solution_steps: [
      'V = 30 × 15 × 2 = 900 m³ = 900000 litres',
      'Cost = 900000 × (2 ÷ 100)',
      'Cost = 900000 × 0.02 = ₹18000',
    ],
    hints: {
      level1: 'Find volume in m³, convert to litres, then apply the rate (₹2 per 100 L).',
      level2: 'V = 900 m³ = 900000 L. Rate = ₹2/100L = ₹0.02/L.',
      level3: 'Cost = 900000 × 0.02 = ₹___',
    },
    remedial: {
      concept_recap: 'Multi-step: volume → litres (×1000) → cost (×rate per litre).',
      formula: 'V = lbh; L = V×1000; Cost = L × (rate per litre)',
      worked_example: 'Pool 20×10×2=400m³=400000L; ₹3/100L → cost=₹12000',
      common_mistake: 'Not converting m³ to litres before applying the per-litre rate.',
      memory_tip: '"Litres = m³ × 1000; cost = litres × rate per litre."',
    },
    expectedTime: 200,
  },

  {
    qid: 'V-H-02', topic: 'volume', shape: 'cylinder', difficulty: 'advanced',
    type: 'word_problem',
    question: 'A cylindrical well of radius 7 m is dug to a depth of 10 m. Find the volume of earth removed. (Use π = 22/7)',
    answer: 1540, unit: 'm³', formula: 'V = π × r² × h',
    solution_steps: [
      'V = (22/7) × 7² × 10 = (22/7) × 49 × 10',
      '= 22 × 7 × 10',
      'V = 1540 m³',
    ],
    hints: {
      level1: 'Volume of earth = volume of the cylindrical well dug.',
      level2: 'V = (22/7) × 49 × 10. Simplify (22/7) × 49 = 154.',
      level3: 'V = 154 × 10 = ___ m³',
    },
    remedial: {
      concept_recap: 'Volume of earth removed = volume of the cylinder. V = πr²h.',
      formula: 'V = π × r² × h',
      worked_example: 'Well r=3.5, depth 8m → V=(22/7)×12.25×8=308 m³',
      common_mistake: 'Using TSA or CSA formula instead of volume.',
      memory_tip: '"Volume of space dug = cylinder volume = πr²h."',
    },
    expectedTime: 150,
  },

  {
    qid: 'V-H-03', topic: 'volume', shape: 'cube', difficulty: 'advanced',
    type: 'error_correction',
    question: 'Kiran found the volume of a cube with edge 9 cm as: V = 9² = 81 cm³. Find his mistake and calculate the correct volume.',
    answer: 729, unit: 'cm³', formula: 'V = a³',
    solution_steps: [
      'Kiran\'s mistake: he used a² (area formula) instead of a³ (volume formula)',
      'Correct formula: V = a³',
      'V = 9³ = 9 × 9 × 9 = 729 cm³',
    ],
    hints: {
      level1: 'Check Kiran\'s formula. What is the difference between a² and a³?',
      level2: 'a² gives area; a³ gives volume. Kiran squared when he should have cubed.',
      level3: 'Correct V = 9 × 9 × 9 = ___ cm³',
    },
    remedial: {
      concept_recap: 'Area of a face = a²; Volume of a cube = a³. These are different operations.',
      formula: 'V = a³ (NOT a²)',
      worked_example: 'Edge=5: area of face=25; volume=125 cm³',
      common_mistake: 'Squaring (a²) instead of cubing (a³) for volume.',
      memory_tip: '"Volume = 3D → multiply edge 3 times (a³). Area = 2D → multiply twice (a²)."',
    },
    expectedTime: 150,
  },

  {
    qid: 'V-H-04', topic: 'volume', shape: 'cuboid', difficulty: 'advanced',
    type: 'word_problem',
    question: 'Rainwater collected on a roof 20 m × 15 m flows into a rectangular tank with base 6 m × 5 m. If 2 cm of rain falls, find the rise in water level in the tank (in cm).',
    answer: 20, unit: 'cm', formula: 'V_rain = l × b × h_rain; Rise = V_rain ÷ (tank base)',
    solution_steps: [
      'V of rain = 20 × 15 × 0.02 = 6 m³',
      'Rise = 6 ÷ (6 × 5) = 6 ÷ 30 = 0.2 m',
      'Rise = 0.2 m = 20 cm',
    ],
    hints: {
      level1: 'Find the volume of rainwater collected on the roof, then find the height it adds in the tank.',
      level2: 'Rain volume = 20 × 15 × 0.02 m = 6 m³. Rise = 6 ÷ (tank base area).',
      level3: 'Rise = 6 ÷ 30 = 0.2 m = ___ cm',
    },
    remedial: {
      concept_recap: 'V_rain = roof area × rainfall depth (in same unit). Rise in tank = V_rain ÷ tank base area.',
      formula: 'Rise = (Roof area × rainfall depth) ÷ Tank base area',
      worked_example: 'Roof 10×10, rain 3cm=0.03m → V=3m³; tank 5×3=15m² → rise=0.2m=20cm',
      common_mistake: 'Not converting cm to m for the rain depth before calculating volume.',
      memory_tip: '"Convert rain depth to metres first; then V = area × depth."',
    },
    expectedTime: 200,
  },

  {
    qid: 'V-H-05', topic: 'volume', shape: 'cylinder', difficulty: 'advanced',
    type: 'cost_problem',
    question: 'A cylindrical tank of radius 7 m and height 10 m is filled with water. If 1 litre of water costs ₹0.50, find the total cost of filling the tank. (Use π = 22/7, 1 m³ = 1000 litres)',
    answer: 770000, unit: '₹', formula: 'V = πr²h; L = V×1000; Cost = L × rate',
    solution_steps: [
      'V = (22/7) × 49 × 10 = 1540 m³',
      'Capacity = 1540 × 1000 = 1540000 litres',
      'Cost = 1540000 × 0.50 = ₹770000',
    ],
    hints: {
      level1: 'Find volume in m³, convert to litres, then multiply by rate per litre.',
      level2: 'V = 1540 m³ = 1540000 L. Rate = ₹0.50/L.',
      level3: 'Cost = 1540000 × 0.50 = ₹___',
    },
    remedial: {
      concept_recap: 'V = πr²h → convert to litres (×1000) → cost = litres × rate.',
      formula: 'V = πr²h; L = V×1000; Cost = L × rate',
      worked_example: 'r=3.5, h=10 → V=385m³=385000L; at ₹0.20/L → ₹77000',
      common_mistake: 'Applying rate to m³ instead of litres.',
      memory_tip: '"Rate per litre: convert volume to litres first (×1000)."',
    },
    expectedTime: 200,
  },

  {
    qid: 'V-H-06', topic: 'volume', shape: 'cube', difficulty: 'advanced',
    type: 'comparison',
    question: 'A cube of edge 12 cm is melted and recast into smaller cubes of edge 3 cm each. How many smaller cubes are formed?',
    answer: 64, unit: 'cubes', formula: 'Number = V_large ÷ V_small = (L/l)³',
    solution_steps: [
      'V_large = 12³ = 1728 cm³',
      'V_small = 3³ = 27 cm³',
      'Number = 1728 ÷ 27 = 64 cubes',
    ],
    hints: {
      level1: 'The total volume is conserved when melting. Divide big volume by small volume.',
      level2: 'V_large = 1728; V_small = 27. Number = 1728 ÷ 27.',
      level3: '1728 ÷ 27 = ___ cubes',
    },
    remedial: {
      concept_recap: 'Melting and recasting conserves volume. Number = V_big ÷ V_small = (Big edge ÷ Small edge)³.',
      formula: 'Number = V_big ÷ V_small = (L/l)³',
      worked_example: 'Big 6cm (V=216) melted to 2cm (V=8) → 216/8=27 cubes',
      common_mistake: 'Dividing the edges (12÷3=4) and giving 4 instead of 4³=64.',
      memory_tip: '"Divide volumes — not edges — to get the number of smaller cubes."',
    },
    expectedTime: 180,
  },

  {
    qid: 'V-H-07', topic: 'volume', shape: 'cuboid', difficulty: 'advanced',
    type: 'reverse_find',
    question: 'The volume of a cuboid is 2400 cm³. Its length is 20 cm and height is 10 cm. Find its breadth.',
    answer: 12, unit: 'cm', formula: 'b = V ÷ (l × h)',
    solution_steps: ['b = V ÷ (l × h) = 2400 ÷ (20 × 10) = 2400 ÷ 200', 'b = 12 cm'],
    hints: {
      level1: 'Rearrange V = l × b × h to isolate b.',
      level2: 'b = 2400 ÷ (20 × 10) = 2400 ÷ 200.',
      level3: '2400 ÷ 200 = ___ cm',
    },
    remedial: {
      concept_recap: 'b = V ÷ (l × h). Divide volume by the product of the two known dimensions.',
      formula: 'b = V ÷ (l × h)',
      worked_example: 'V=1200, l=15, h=8 → b=1200÷120=10 cm',
      common_mistake: 'Dividing by only one dimension instead of the product of both.',
      memory_tip: '"V ÷ (l × h) = breadth — divide by the other two sides together."',
    },
    expectedTime: 150,
  },

  {
    qid: 'V-H-08', topic: 'volume', shape: 'cylinder', difficulty: 'advanced',
    type: 'word_problem',
    question: 'A cylindrical pipe has inner radius 3 cm, outer radius 4 cm, and length 35 cm. Find the volume of metal used to make the pipe. (Use π = 22/7)',
    answer: 770, unit: 'cm³', formula: 'V = π(R² − r²) × h',
    solution_steps: [
      'V = (22/7) × (4² − 3²) × 35 = (22/7) × (16 − 9) × 35',
      '= (22/7) × 7 × 35 = 22 × 35',
      'V = 770 cm³',
    ],
    hints: {
      level1: 'Volume of a hollow cylinder = π(R² − r²)h where R = outer radius and r = inner radius.',
      level2: 'R² − r² = 16 − 9 = 7. V = (22/7) × 7 × 35.',
      level3: 'V = 22 × 35 = ___ cm³',
    },
    remedial: {
      concept_recap: 'Hollow pipe: V = π(R² − r²)h = V_outer − V_inner. Compute outer cylinder volume minus inner cylinder volume.',
      formula: 'V = π × (R² − r²) × h',
      worked_example: 'R=5, r=4, h=14 → V=(22/7)×(25−16)×14=396 cm³',
      common_mistake: 'Using R − r instead of R² − r² in the formula.',
      memory_tip: '"Hollow: subtract inner from outer — but subtract r², not r."',
    },
    expectedTime: 200,
  },

  {
    qid: 'V-H-09', topic: 'volume', shape: 'cube', difficulty: 'advanced',
    type: 'reverse_find',
    question: 'A cubical water tank holds 8000 litres when completely full. Find the edge length of the tank. (1 m³ = 1000 litres)',
    answer: 2, unit: 'm', formula: 'a = ∛V',
    solution_steps: [
      'V = 8000 ÷ 1000 = 8 m³',
      'a = ∛8 = 2 m',
      'Edge = 2 m',
    ],
    hints: {
      level1: 'Convert litres to m³, then find the cube root to get the edge.',
      level2: 'V = 8000 ÷ 1000 = 8 m³. a = ∛8.',
      level3: '∛8 = ___ m (since 2 × 2 × 2 = 8)',
    },
    remedial: {
      concept_recap: 'Convert L to m³ (÷1000), then a = ∛V. Find the number whose cube equals V.',
      formula: 'V = L ÷ 1000; a = ∛V',
      worked_example: '1000L = 1m³ → a = 1m. 27000L = 27m³ → a = 3m.',
      common_mistake: 'Not converting litres to m³ before taking cube root.',
      memory_tip: '"Litres ÷ 1000 = m³; then cube root gives edge."',
    },
    expectedTime: 150,
  },

  {
    qid: 'V-H-10', topic: 'volume', shape: 'cuboid', difficulty: 'advanced',
    type: 'word_problem',
    question: 'A rectangular cistern is 6 m long, 4 m wide, and 2 m deep. It is filled by a pipe at 60 litres per minute. How many minutes will it take to fill the cistern completely? (1 m³ = 1000 litres)',
    answer: 800, unit: 'minutes', formula: 'V = l×b×h; L = V×1000; Time = L ÷ rate',
    solution_steps: [
      'V = 6 × 4 × 2 = 48 m³ = 48000 litres',
      'Time = 48000 ÷ 60',
      'Time = 800 minutes',
    ],
    hints: {
      level1: 'Find the cistern\'s capacity in litres, then divide by the flow rate.',
      level2: 'V = 48 m³ = 48000 litres. Rate = 60 litres/min.',
      level3: 'Time = 48000 ÷ 60 = ___ minutes',
    },
    remedial: {
      concept_recap: 'Time = Total litres ÷ rate (litres per minute). First find volume in litres.',
      formula: 'Time = (V × 1000) ÷ rate (L/min)',
      worked_example: 'V=30m³=30000L; rate=50L/min → time=600 min',
      common_mistake: 'Dividing m³ by the rate instead of litres.',
      memory_tip: '"Convert to litres first, then divide by the pipe\'s rate."',
    },
    expectedTime: 180,
  },
];

module.exports = questions;
