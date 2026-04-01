const { getByConceptKey } = require('../store/contentCache');
const { buildLessonSlides } = require('../data/conceptLessonBuilder');
const { formatStudentAnswerForUi } = require('./errorDetectionService');

const getRemedialContent = async (topic, shape, ctx = {}) => {
  const conceptKey = `${topic}_${shape}`;
  const content = getByConceptKey(conceptKey);

  const { studentAnswer, errorInfo, question } = ctx;
  const hasAnswer =
    studentAnswer !== undefined && studentAnswer !== null && String(studentAnswer).trim() !== '';

  let personalizedBlock = '';
  if (hasAnswer && errorInfo) {
    const snippet = formatStudentAnswerForUi(studentAnswer, question?.unit);
    const lead = errorInfo.remedialLead || errorInfo.feedback;
    personalizedBlock = `Based on your answer (${snippet})\n\n${lead}\n\n—\n\n`;
  } else if (errorInfo) {
    personalizedBlock = `Focus for you\n\n${errorInfo.remedialLead || errorInfo.feedback}\n\n—\n\n`;
  }

  if (!content) {
    return {
      title: `${shape} ${topic}`,
      explanation: personalizedBlock + 'Please review the concept before continuing.',
      formula: 'Refer to your textbook.',
      formulaBreakdown: '',
      workedExample: '',
      simpleQuestion: null,
    };
  }

  return {
    title: content.title,
    explanation: personalizedBlock + content.remedial.explanation,
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
