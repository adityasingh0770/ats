const { findById } = require('../store/questionBank');
const { buildPersonalizedHint } = require('./personalizedHintService');

const getHint = async (questionId, level, ctx = {}) => {
  const question = findById(questionId);
  if (!question) throw new Error('Question not found');

  const validLevel = Math.min(Math.max(parseInt(level, 10) || 1, 1), 2);
  const content = buildPersonalizedHint(question, ctx.errorInfo || null, ctx.studentAnswer, validLevel);

  return {
    level: validLevel,
    content,
    formula: question.formula || null,
  };
};

module.exports = { getHint };
