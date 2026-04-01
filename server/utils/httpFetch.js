/** Node 18+ fetch or node-fetch fallback (no OpenAI dependency). */
function getFetchImpl() {
  if (typeof fetch === 'function') return fetch;
  try {
    return require('node-fetch');
  } catch {
    return null;
  }
}

module.exports = { getFetchImpl };
