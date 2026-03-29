const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const questionResultSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  qid: String,
  correct: Boolean,
  attempts: Number,
  hintsUsed: Number,
  timeSpent: Number,
  errorType: String,
}, { _id: false });

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, default: uuidv4, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true },
  shape: { type: String, required: true },
  status: { type: String, enum: ['active', 'completed', 'terminated'], default: 'active' },
  currentQuestionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', default: null },
  currentAttempts: { type: Number, default: 0 },
  currentHintsUsed: { type: Number, default: 0 },
  currentDifficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  consecutiveCorrect: { type: Number, default: 0 },
  consecutiveWrong: { type: Number, default: 0 },
  questionsAsked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  questionResults: [questionResultSchema],
  metrics: {
    correct: { type: Number, default: 0 },
    wrong: { type: Number, default: 0 },
    totalAttempts: { type: Number, default: 0 },
    hintsUsed: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 },
  },
  masteryBefore: { type: Number, default: 0 },
  masteryAfter: { type: Number, default: 0 },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
