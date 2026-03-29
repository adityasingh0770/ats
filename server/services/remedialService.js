const { getByConceptKey } = require('../store/contentCache');
const { buildLessonSlides } = require('../data/conceptLessonBuilder');

const getRemedialContent = async (topic, shape) => {
  const conceptKey = `${topic}_${shape}`;
  const content = getByConceptKey(conceptKey);

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
  const content = getByConceptKey(conceptKey);
  if (!content) return null;

  const formulasFromExtras = Array.isArray(content.formulas) ? content.formulas : null;
  const formulas =
    formulasFromExtras?.length
      ? formulasFromExtras
      : content.formula
        ? [{ name: 'Formula', formula: content.formula }]
        : [];

  const lessonSlides = buildLessonSlides(conceptKey, content);

  return {
    title: content.title,
    explanation: content.explanation,
    detailParagraphs: content.detailParagraphs || [],
    formula: content.formula,
    formulas,
    keyFacts: content.keyFacts || [],
    example: content.example,
    visualHint: content.visualHint,
    tip: content.visualHint,
    figures: content.figures || [],
    lessonSlides,
  };
};

module.exports = { getRemedialContent, getConceptMaterial };
