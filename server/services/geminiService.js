/**
 * Gemini AI Service
 * Powers personalized, Socratic hints and remedial content.
 * Falls back gracefully if the API key is missing or the call fails.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

const MODEL = 'gemini-1.5-flash';

const TUTOR_SYSTEM = `You are a Socratic math tutor for Grade 8 students learning mensuration (perimeter, area, surface area, volume of 2D and 3D shapes such as squares, rectangles, circles, cubes, cuboids, cylinders).

Your core rules:
- NEVER reveal the correct numerical answer
- Guide students to discover the answer themselves using questions
- Be warm, brief (2–4 sentences max), and encouraging
- Use plain text only — no markdown, no bullet points, no bold/italic
- Address the student directly as "you"
- If the student is close, acknowledge their effort before redirecting`;

let _genAI = null;

function getClient() {
  if (!_genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'your_gemini_api_key_here') {
      throw new Error('GEMINI_API_KEY not configured');
    }
    _genAI = new GoogleGenerativeAI(key);
  }
  return _genAI;
}

/**
 * Generate a personalized Socratic hint for a wrong answer.
 *
 * @param {object} question  - Full question document from question bank
 * @param {string|number} studentAnswer - What the student submitted
 * @param {object|null} errorInfo  - Output of detectError() { type, feedback, ... }
 * @param {number} hintLevel  - 1 (gentle nudge), 2 (step-level), 3 (near-direct)
 * @returns {Promise<string>}  - Plain-text hint
 */
async function getGeminiHint(question, studentAnswer, errorInfo, hintLevel) {
  const client = getClient();
  const model = client.getGenerativeModel({ model: MODEL, systemInstruction: TUTOR_SYSTEM });

  const errorDesc = errorInfo
    ? `Detected mistake pattern: "${errorInfo.type}" — ${errorInfo.feedback || 'answer does not match expected'}`
    : `The student's answer doesn't match the correct result.`;

  const levelGuide =
    hintLevel === 1
      ? 'Give a gentle nudge only — ask one guiding question that makes the student check their approach, without naming which step is wrong.'
      : hintLevel === 2
      ? 'Be more specific — identify the operation or step where the error happened (addition vs multiplication, wrong formula, unit issue, etc.) without computing the answer.'
      : 'Give a near-direct hint — name the exact mistake and the correct operation to use, but stop before computing the final numerical result.';

  const prompt = `A Grade 8 student is working on this mensuration question:

Question: ${question.question}
Topic: ${String(question.topic || '').replace(/_/g, ' ')} of a ${question.shape || 'shape'}
Formula: ${question.formula || 'as per Grade 8 curriculum'}
Student submitted: ${studentAnswer}
${errorDesc}

Hint level ${hintLevel}/3: ${levelGuide}

Write ONLY the hint text. Do not prefix it with "Hint:" or any label.`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

/**
 * Generate personalized remedial content after repeated failures.
 *
 * @param {object} question - Current question (for formula / topic context)
 * @param {string} topic
 * @param {string} shape
 * @param {Array}  wrongAttempts - Array of { submittedAnswer, errorType }
 * @returns {Promise<string>} - Plain-text personalized mini-lesson
 */
async function getGeminiRemedial(question, topic, shape, wrongAttempts) {
  const client = getClient();
  const model = client.getGenerativeModel({ model: MODEL, systemInstruction: TUTOR_SYSTEM });

  const attemptsDesc =
    wrongAttempts && wrongAttempts.length > 0
      ? wrongAttempts
          .map((a, i) => `Attempt ${i + 1}: answered "${a.submittedAnswer}" (error type: ${a.errorType || 'unknown'})`)
          .join('\n')
      : 'Several incorrect attempts recorded.';

  const prompt = `A Grade 8 student has made repeated mistakes on a mensuration concept and needs a short personalised review.

Concept: ${String(topic || '').replace(/_/g, ' ')} of a ${shape || 'shape'}
Formula: ${question?.formula || 'as per Grade 8 curriculum'}
Their wrong attempts this session:
${attemptsDesc}

Write a personalised mini-lesson in 4–6 sentences that:
1. Acknowledges the specific mistake pattern seen in their attempts (e.g. formula mix-up, wrong operation)
2. Explains the core idea using a simple, concrete everyday analogy
3. Walks through the correct reasoning at a high level (no numbers — just the logic)
4. Ends with a Socratic question that tests whether they now understand the concept

Plain text only. No markdown. No bullet points. Address the student as "you".`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

module.exports = { getGeminiHint, getGeminiRemedial };
