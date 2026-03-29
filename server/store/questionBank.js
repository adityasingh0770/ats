const rawList = require('../data/questions.seed.js');

const byId = new Map();
const list = rawList.map((q, i) => {
  const _id = String(i);
  const enriched = { ...q, _id };
  byId.set(_id, enriched);
  return enriched;
});

function findById(id) {
  if (id == null) return null;
  return byId.get(String(id)) || null;
}

function findMany({ topic, shape, difficulty, excludeIds = [] }) {
  const ex = new Set((excludeIds || []).map(String));
  return list.filter(
    (q) =>
      q.topic === topic &&
      q.shape === shape &&
      q.difficulty === difficulty &&
      !ex.has(q._id)
  );
}

function findManyFallback({ topic, shape, excludeIds = [] }) {
  const ex = new Set((excludeIds || []).map(String));
  return list.filter(
    (q) => q.topic === topic && q.shape === shape && !ex.has(q._id)
  );
}

function pickRandom(arr) {
  if (!arr.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function getNextQuestion(topic, shape, difficulty, excludeIds) {
  let pool = findMany({ topic, shape, difficulty, excludeIds });
  if (pool.length === 0) pool = findManyFallback({ topic, shape, excludeIds });
  return pickRandom(pool);
}

module.exports = { list, findById, getNextQuestion };
