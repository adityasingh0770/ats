const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'data', 'content.seed.json');
const extrasPath = path.join(__dirname, '..', 'data', 'conceptExtras.json');

let extrasByKey = {};
try {
  if (fs.existsSync(extrasPath)) {
    const raw = JSON.parse(fs.readFileSync(extrasPath, 'utf8'));
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) extrasByKey = raw;
  }
} catch (e) {
  console.warn('conceptExtras.json:', e.message);
}

const rows = JSON.parse(fs.readFileSync(jsonPath, 'utf8')).map((r) => ({
  ...r,
  ...(extrasByKey[r.conceptKey] || {}),
}));

const byConcept = new Map(rows.map((r) => [r.conceptKey, r]));

function getByConceptKey(conceptKey) {
  return byConcept.get(conceptKey) || null;
}

module.exports = { getByConceptKey, rows };
