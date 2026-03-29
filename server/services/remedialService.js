const Content = require('../models/Content');

const getRemedialContent = async (topic, shape) => {
  const conceptKey = `${topic}_${shape}`;
  const content = await Content.findOne({ conceptKey });

  if (!content) {
    return {
      title: `${shape} ${topic}`,
      explanation: 'Please review the concept before continuing.',
      formula: 'Refer to your textbook.',
      formulaBreakdown: '',
      workedExample: '',
      simpleQuestion: null,
    };
  }

  return {
    title: content.title,
    explanation: content.remedial.explanation,
    formula: content.formula,
    formulaBreakdown: content.remedial.formulaBreakdown,
    workedExample: content.remedial.workedExample,
    simpleQuestion: content.remedial.simpleQuestion,
  };
};

const getConceptMaterial = async (topic, shape) => {
  const conceptKey = `${topic}_${shape}`;
  const content = await Content.findOne({ conceptKey });
  if (!content) return null;

  return {
    title: content.title,
    explanation: content.explanation,
    formula: content.formula,
    keyFacts: content.keyFacts,
    example: content.example,
    visualHint: content.visualHint,
  };
};

module.exports = { getRemedialContent, getConceptMaterial };
