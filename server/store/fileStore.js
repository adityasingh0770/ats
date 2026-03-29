const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const defaultPath = path.join(__dirname, '..', 'data', 'app-state.json');
const DATA_PATH = process.env.DATA_FILE_PATH
  ? path.resolve(process.env.DATA_FILE_PATH)
  : defaultPath;

function ensureFile() {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(
      DATA_PATH,
      JSON.stringify({ users: [], learners: [], sessions: [] }, null, 2)
    );
  }
}

function load() {
  ensureFile();
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
}

function save(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// --- users ---
function findUserByEmail(email) {
  const e = (email || '').toLowerCase().trim();
  return load().users.find((u) => u.email === e) || null;
}

function findUserById(id) {
  return load().users.find((u) => u._id === id) || null;
}

async function createUser({ name, email, password }) {
  const data = load();
  const e = email.toLowerCase().trim();
  if (data.users.some((u) => u.email === e)) {
    const err = new Error('Duplicate email');
    err.code = 11000;
    throw err;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = {
    _id: uuidv4(),
    name: name.trim(),
    email: e,
    passwordHash,
    grade: 8,
    createdAt: new Date().toISOString(),
  };
  data.users.push(user);
  save(data);
  return user;
}

async function matchPassword(user, plain) {
  return bcrypt.compare(plain, user.passwordHash);
}

function userToPublic(user) {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
}

async function updateUserFields(userId, { name, newPassword }) {
  const data = load();
  const i = data.users.findIndex((u) => u._id === userId);
  if (i === -1) return null;
  if (name && name.trim()) data.users[i].name = name.trim();
  if (newPassword) data.users[i].passwordHash = await bcrypt.hash(newPassword, 12);
  save(data);
  return data.users[i];
}

// --- learners ---
function defaultLearner(userId) {
  return {
    userId,
    concept_mastery: {},
    attempts: 0,
    accuracy: 0,
    hints_used: 0,
    time_taken: {},
    error_patterns: [],
    confidence_score: 0.5,
    total_sessions: 0,
    updatedAt: new Date().toISOString(),
  };
}

function findLearnerByUserId(userId) {
  return load().learners.find((l) => l.userId === userId) || null;
}

function createLearner(userId) {
  const data = load();
  if (data.learners.some((l) => l.userId === userId)) {
    return data.learners.find((l) => l.userId === userId);
  }
  const learner = defaultLearner(userId);
  data.learners.push(learner);
  save(data);
  return learner;
}

function saveLearner(learner) {
  const data = load();
  const i = data.learners.findIndex((l) => l.userId === learner.userId);
  learner.updatedAt = new Date().toISOString();
  if (i === -1) data.learners.push({ ...learner });
  else data.learners[i] = { ...learner };
  save(data);
}

/** @returns {number} */
function getMastery(learner, conceptKey) {
  if (!learner.concept_mastery) return 0;
  const v = learner.concept_mastery[conceptKey];
  return typeof v === 'number' ? v : 0;
}

function updateConceptMastery(learner, conceptKey, score) {
  if (!learner.concept_mastery) learner.concept_mastery = {};
  const current = learner.concept_mastery[conceptKey] || 0;
  learner.concept_mastery[conceptKey] = Math.min(1, Math.max(0, current * 0.7 + score * 0.3));
}

// --- sessions ---
function createSession(doc) {
  const data = load();
  const session = {
    sessionId: uuidv4(),
    userId: doc.userId,
    topic: doc.topic,
    shape: doc.shape,
    status: 'active',
    currentQuestionId: doc.currentQuestionId ?? null,
    currentAttempts: 0,
    currentHintsUsed: 0,
    currentDifficulty: doc.currentDifficulty || 'beginner',
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    questionsAsked: doc.questionsAsked || [],
    questionResults: [],
    metrics: { correct: 0, wrong: 0, totalAttempts: 0, hintsUsed: 0, timeSpent: 0 },
    masteryBefore: doc.masteryBefore ?? 0,
    masteryAfter: 0,
    startTime: new Date().toISOString(),
    endTime: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  data.sessions.push(session);
  save(data);
  return session;
}

function findSessionOne(query) {
  const data = load();
  return (
    data.sessions.find((s) => {
      if (query.sessionId != null && s.sessionId !== query.sessionId) return false;
      if (query.userId != null && s.userId !== String(query.userId)) return false;
      if (query.status != null && s.status !== query.status) return false;
      return true;
    }) || null
  );
}

function findSessionsForUser(userId, { statusIn } = {}) {
  let list = load().sessions.filter((s) => s.userId === String(userId));
  if (statusIn && statusIn.length) list = list.filter((s) => statusIn.includes(s.status));
  return list;
}

function saveSession(session) {
  const data = load();
  const i = data.sessions.findIndex((s) => s.sessionId === session.sessionId);
  session.updatedAt = new Date().toISOString();
  if (i === -1) data.sessions.push(session);
  else data.sessions[i] = session;
  save(data);
}

function initStore() {
  ensureFile();
  console.log(`📁 App data file: ${DATA_PATH}`);
}

module.exports = {
  initStore,
  DATA_PATH,
  findUserByEmail,
  findUserById,
  createUser,
  matchPassword,
  userToPublic,
  updateUserFields,
  findLearnerByUserId,
  createLearner,
  saveLearner,
  getMastery,
  updateConceptMastery,
  createSession,
  findSessionOne,
  findSessionsForUser,
  saveSession,
};
