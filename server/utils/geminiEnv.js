/** Google AI Studio / Gemini API key (trimmed) */
function getGeminiKey() {
  const k = process.env.GEMINI_API_KEY;
  if (k == null || k === '') return '';
  const t = String(k).trim();
  return t || '';
}

module.exports = { getGeminiKey };
