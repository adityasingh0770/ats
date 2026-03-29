const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  conceptKey: { type: String, required: true, unique: true },
  topic: { type: String, required: true },
  shape: { type: String, required: true },
  title: { type: String, required: true },
  explanation: { type: String, required: true },
  formula: { type: String, required: true },
  keyFacts: [String],
  example: { type: String, required: true },
  visualHint: { type: String },
  remedial: {
    explanation: String,
    formulaBreakdown: String,
    workedExample: String,
    simpleQuestion: {
      question: String,
      answer: Number,
      unit: String,
    },
  },
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);
