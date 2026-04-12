/**
 * Mastery Formula: M = 0.40*A + 0.20*(1-H) + 0.15*(1-PA) + 0.15*C + 0.10*T
 * A  = Accuracy (correct / total attempts)
 * H  = Hint Rate (hints used / total questions answered)
 * PA = Attempts Penalty (extra attempts beyond 1st / total attempts)
 * C  = Confidence Score
 * T  = Time Efficiency (expected time / actual time, capped at 1)
 */

const calculateMastery = ({ correct, totalAttempts, hintsUsed, questionsAnswered, confidenceScore, avgTimeSpent, avgExpectedTime }) => {
  const A = totalAttempts > 0 ? correct / totalAttempts : 0;
  const H = questionsAnswered > 0 ? Math.min(1, hintsUsed / questionsAnswered) : 0;
  const PA = totalAttempts > 0 ? Math.min(1, Math.max(0, (totalAttempts - questionsAnswered) / totalAttempts)) : 0;
  const C = Math.min(1, Math.max(0, confidenceScore));
  const T = avgTimeSpent > 0 ? Math.min(1, avgExpectedTime / avgTimeSpent) : 0.5;

  const M = 0.40 * A + 0.20 * (1 - H) + 0.15 * (1 - PA) + 0.15 * C + 0.10 * T;
  return Math.min(1, Math.max(0, M));
};

const classifyMastery = (score) => {
  if (score < 0.40) return 'Explorer';
  if (score <= 0.70) return 'Scholar';
  return 'Legend';
};

const difficultyFromMastery = (score) => {
  if (score < 0.40) return 'beginner';
  if (score <= 0.70) return 'intermediate';
  return 'advanced';
};

const updateConfidenceScore = (currentConfidence, isCorrect, attempts, hintsUsed) => {
  let delta = 0;
  if (isCorrect && attempts === 1 && hintsUsed === 0) delta = 0.1;
  else if (isCorrect && attempts <= 2) delta = 0.05;
  else if (isCorrect) delta = 0.02;
  else if (attempts >= 3) delta = -0.08;
  else delta = -0.04;
  return Math.min(1, Math.max(0, currentConfidence + delta));
};

module.exports = { calculateMastery, classifyMastery, difficultyFromMastery, updateConfidenceScore };
