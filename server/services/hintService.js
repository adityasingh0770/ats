const { findById } = require('../store/questionBank');
const { formatStudentAnswerForUi } = require('./errorDetectionService');

const getHint = async (questionId, level, ctx = {}) => {
  const question = findById(questionId);
  if (!question) throw new Error('Question not found');

  const validLevel = Math.min(Math.max(parseInt(level, 10) || 1, 1), 3);
  const hintKey = `level${validLevel}`;
  let content = question.hints[hintKey];

  const { studentAnswer, errorInfo } = ctx;
  const hasAnswer =
    studentAnswer !== undefined && studentAnswer !== null && String(studentAnswer).trim() !== '';

  if (hasAnswer && errorInfo) {
    const snippet = formatStudentAnswerForUi(studentAnswer, question.unit);
    const lead = errorInfo.hintLead || errorInfo.feedback;
    content = `Your answer: ${snippet}\n\n${lead}\n\nHint (step ${validLevel}):\n${content}`;
  } else if (hasAnswer) {
    const snippet = formatStudentAnswerForUi(studentAnswer, question.unit);
    content = `Your answer: ${snippet}\n\n${content}`;
  }

  return {
    level: validLevel,
    content,
    formula: question.formula,
  };
};

module.exports = { getHint };
