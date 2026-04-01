/** Trimmed key — avoids Render/newline issues */
function getOpenAiKey() {
  const k = process.env.OPENAI_API_KEY;
  if (k == null || k === '') return '';
  const t = String(k).trim();
  return t || '';
}

module.exports = { getOpenAiKey };
