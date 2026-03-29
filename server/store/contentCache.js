const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'data', 'content.seed.json');
const rows = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const byConcept = new Map(rows.map((r) => [r.conceptKey, r]));

function getByConceptKey(conceptKey) {
  return byConcept.get(conceptKey) || null;
}

module.exports = { getByConceptKey, rows };
