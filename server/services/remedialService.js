const { getByConceptKey } = require('../store/contentCache');
const { buildLessonSlides } = require('../data/conceptLessonBuilder');
const { getRemedialSimple } = require('../data/remedialSimple');
const { generateAdaptiveRemedial } = require('./adaptiveRemedialLLMService');
const { getGeminiKey, isGeminiLlmDisabled } = require('../utils/geminiEnv');

let remedialMedia = {};
try {
  remedialMedia = require('../data/remedialMedia.json');
} catch {
  /* optional file */
}

const ERROR_TYPE_LABELS = {
  wrong_option: 'MCQ choice',
  wrong_verdict: 'True/False',
  invalid_input: 'Input format',
  multiply_instead_of_add: 'Used × instead of +',
  add_instead_of_multiply: 'Used + instead of ×',
  area_instead_of_perimeter_rect: 'Mixed area with perimeter',
  perimeter_instead_of_area_rect: 'Mixed perimeter with area',
  rect_multiply_instead_of_perimeter: 'Used length × breadth for perimeter',
  rect_sum_only_perimeter: 'Forgot to double (l + b)',
  rect_perimeter_instead_of_area: 'Used perimeter for area',
  square_area_instead_of_perimeter: 'Used area idea for perimeter',
  square_perimeter_instead_of_area: 'Used perimeter idea for area',
  formula_swap: 'Formula mix-up',
  radius_diameter_confusion: 'Radius vs diameter',
  sa_volume_confusion: 'Surface area vs volume',
  unit_error: 'Units / conversion',
  arithmetic_mistake: 'Arithmetic slip',
  partial_formula: 'Incomplete formula',
  wrong_answer: 'Answer mismatch',
  unknown: 'Other',
};

function labelErrorType(type) {
  return ERROR_TYPE_LABELS[type] || String(type || 'other').replace(/_/g, ' ');
}

/**
 * Summarise every wrong submission this session (all tries), for display only.
 */
function buildSessionTryDigest(wrongAttempts) {
  if (!wrongAttempts || !wrongAttempts.length) {
    return { hasTries: false, totalSubmissions: 0, byType: {}, tries: [] };
  }
  const byType = {};
  const tries = wrongAttempts.map((w, i) => {
    const t = w.errorType || 'unknown';
    byType[t] = (byType[t] || 0) + 1;
    return {
      n: i + 1,
      answer: w.submittedAnswer,
      kind: labelErrorType(t),
      qid: w.qid || null,
    };
  });
  return {
    hasTries: true,
    totalSubmissions: wrongAttempts.length,
    byType,
    tries,
  };
}

async function maybeAttachLlmRemedial(base, ctx) {
  if (!getGeminiKey() || isGeminiLlmDisabled() || !ctx.llmRemedialInput) return base;
  const in_ = ctx.llmRemedialInput;
  if (!in_.questionText || in_.studentAnswer === undefined || in_.studentAnswer === null) return base;
  try {
    const llmRemedial = await generateAdaptiveRemedial({
      questionText: in_.questionText,
      studentAnswer: in_.studentAnswer,
      correctAnswer: in_.correctAnswer,
      topic: in_.topic || base.title,
      shape: in_.shape || '',
      formula: in_.formula,
      errorTypeRuleBased: in_.errorTypeRuleBased,
      adaptiveMeta: in_.adaptiveMeta,
      priorHints: in_.priorHints,
    });
    return { ...base, llmRemedial };
  } catch (e) {
    console.warn('[remedial] LLM personalized block skipped:', e.message);
    return base;
  }
}

const getRemedialContent = async (topic, shape, ctx = {}) => {
  const conceptKey = `${topic}_${shape}`;
  const content = getByConceptKey(conceptKey);
  const simple = getRemedialSimple(conceptKey);
  const digest = buildSessionTryDigest(ctx.wrongAttempts);
  const media = remedialMedia[conceptKey] || {};

  const figures = Array.isArray(content?.figures) ? content.figures : [];

  if (!content) {
    const base = {
      title: `${shape} ${topic}`,
      tagline: simple.oneLiner,
      intro: simple.intro,
      basicsBullets: simple.bullets,
      explanation: simple.intro,
      sessionDigest: digest,
      formula: 'Refer to your textbook.',
      formulaBreakdown: '',
      workedExample: '',
      simpleQuestion: null,
      figures: [],
      gifUrl: media.gifUrl || null,
      gifCaption: media.gifCaption || null,
    };
    return maybeAttachLlmRemedial(base, ctx);
  }

  const base = {
    title: content.title,
    tagline: simple.oneLiner,
    intro: simple.intro,
    basicsBullets: simple.bullets,
    explanation: `${simple.intro}\n\n${content.remedial.explanation}`,
    sessionDigest: digest,
    formula: content.formula,
    formulaBreakdown: content.remedial.formulaBreakdown,
    workedExample: content.remedial.workedExample,
    simpleQuestion: content.remedial.simpleQuestion,
    figures,
    gifUrl: media.gifUrl || null,
    gifCaption: media.gifCaption || null,
  };
  return maybeAttachLlmRemedial(base, ctx);
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

module.exports = { getRemedialContent, getConceptMaterial, buildSessionTryDigest };
