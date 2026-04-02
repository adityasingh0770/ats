const { analyzeAnswer } = require('./itsAnalyzer');

/**
 * Resolve a hint for a wrong answer using the ITS Analyzer.
 * Returns the hint for the requested level along with ITS diagnostic info.
 */
async function resolveHint(question, _session, studentAnswer, errorInfo, hintLevel) {
  const level = Math.min(Math.max(parseInt(hintLevel, 10) || 1, 1), 2);

  // Run the ITS analysis (pure rule-based, no API calls) — two Socratic hints per wrong answer
  const analysis = analyzeAnswer(question, studentAnswer, errorInfo);

  const content = level === 1 ? analysis.hint_level_1 : analysis.hint_level_2;

  return {
    level,
    content,
    formula: question.formula || null,
    source: 'rules',
    itsAnalysis: {
      error_type:       analysis.error_type,
      detected_pattern: analysis.detected_pattern,
      confidence:       analysis.confidence,
    },
  };
}

module.exports = { resolveHint };
