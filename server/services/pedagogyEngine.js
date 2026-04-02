/**
 * Pedagogical Rule Engine
 * R1: Show concept material when topic opened
 * R2: Then give question
 * R3: Correct → increase difficulty
 * R4: 1st wrong → encouragement
 * R5: 2nd wrong → Personalized hint 1 (from current answer)
 * R6: 3rd wrong → Personalized hint 2
 * R7: ≥4 wrong → Remedial content
 * Advanced: time-based adaptivity, frustration detection
 */

const ENCOURAGEMENT_MESSAGES = [
  "Don't give up! Every mistake is a step closer to mastering it. Try again! 💪",
  "You're almost there! Review the formula and give it another shot. 🌟",
  "Great effort! Think carefully about which formula applies here. You've got this! ✨",
  "Keep going! Mathematics takes practice. Re-read the question and try again. 🎯",
];

const CORRECT_MESSAGES = [
  "Excellent! That's correct! 🎉 You're mastering this concept!",
  "Perfect! Well done! 🌟 Your understanding is growing!",
  "Brilliant! Exactly right! 🔥 Keep up the great work!",
  "Outstanding! That's spot on! ⭐ You're on fire!",
];

const applyPedagogicalRule = (attemptCount, isCorrect, timeSpent, expectedTime) => {
  const timeFactor = expectedTime > 0 ? timeSpent / expectedTime : 1;
  const frustrationDetected = timeFactor > 2;

  if (isCorrect) {
    return {
      rule: 'R3',
      action: 'next_question',
      message: CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)],
      hintLevel: null,
      showRemedial: false,
      adjustDifficulty: 'up',
      frustrationDetected: false,
    };
  }

  // Frustration: same 2-hint ladder, then remedial
  if (frustrationDetected && attemptCount >= 2 && attemptCount < 4) {
    const hintLevel = Math.min(attemptCount - 1, 2);
    return {
      rule: 'R_FRUSTRATION',
      action: 'hint',
      message:
        hintLevel === 1
          ? "Taking a while is normal — here’s a hint aimed at what you tried. 💡"
          : 'One more focused hint — then a short review if you’re still stuck.',
      hintLevel,
      showRemedial: false,
      adjustDifficulty: null,
      frustrationDetected: true,
    };
  }

  if (attemptCount === 1) {
    return {
      rule: 'R4',
      action: 'retry',
      message: ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)],
      hintLevel: null,
      showRemedial: false,
      adjustDifficulty: null,
      frustrationDetected: false,
    };
  }

  if (attemptCount === 2) {
    return {
      rule: 'R5',
      action: 'hint',
      message: "Let me give you a hint to point you in the right direction. 💡",
      hintLevel: 1,
      showRemedial: false,
      adjustDifficulty: null,
      frustrationDetected: false,
    };
  }

  if (attemptCount === 3) {
    return {
      rule: 'R6',
      action: 'hint',
      message: 'Here’s another hint tailored to the answer you just tried. 💡',
      hintLevel: 2,
      showRemedial: false,
      adjustDifficulty: null,
      frustrationDetected: false,
    };
  }

  if (attemptCount >= 4) {
    return {
      rule: 'R7',
      action: 'remedial',
      message: "Let’s open a short review with pictures and steps — then you can continue. 🧠",
      hintLevel: null,
      showRemedial: true,
      adjustDifficulty: 'down',
      frustrationDetected: false,
    };
  }

  return {
    rule: 'R4',
    action: 'retry',
    message: ENCOURAGEMENT_MESSAGES[0],
    hintLevel: null,
    showRemedial: false,
    adjustDifficulty: null,
    frustrationDetected: false,
  };
};

const adjustDifficulty = (currentDifficulty, direction) => {
  const levels = ['beginner', 'intermediate', 'advanced'];
  const idx = levels.indexOf(currentDifficulty);
  if (direction === 'up') return levels[Math.min(idx + 1, 2)];
  if (direction === 'down') return levels[Math.max(idx - 1, 0)];
  return currentDifficulty;
};

const shouldSuggestHint = (timeSpent, expectedTime) => {
  return expectedTime > 0 && timeSpent > expectedTime * 1.5;
};

module.exports = { applyPedagogicalRule, adjustDifficulty, shouldSuggestHint };
