/** Google AI Studio / Gemini API key (trimmed) */
function getGeminiKey() {
  const k = process.env.GEMINI_API_KEY;
  if (k == null || k === '') return '';
  const t = String(k).trim();
  return t || '';
}

function envFlagOn(val) {
  if (val == null || val === '') return false;
  const s = String(val).trim().toLowerCase();
  return s === '1' || s === 'true' || s === 'yes' || s === 'on';
}

/** When set, never call Gemini (hints + remedial use built-in content only). Key may still be set for later. */
function isGeminiLlmDisabled() {
  return envFlagOn(process.env.GEMINI_LLM_DISABLED);
}

function isGeminiLlmEnabled() {
  return Boolean(getGeminiKey()) && !isGeminiLlmDisabled();
}

module.exports = { getGeminiKey, isGeminiLlmDisabled, isGeminiLlmEnabled };
