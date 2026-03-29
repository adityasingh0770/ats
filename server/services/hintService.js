const Question = require('../models/Question');

const getHint = async (questionId, level) => {
  const question = await Question.findById(questionId);
  if (!question) throw new Error('Question not found');

  const validLevel = Math.min(Math.max(parseInt(level) || 1, 1), 3);
  const hintKey = `level${validLevel}`;

  return {
    level: validLevel,
    content: question.hints[hintKey],
    formula: question.formula,
  };
};

module.exports = { getHint };
