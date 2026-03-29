const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  qid: { type: String, required: true, unique: true },
  topic: {
    type: String,
    required: true,
    enum: ['perimeter', 'area', 'surface_area', 'volume'],
  },
  shape: {
    type: String,
    required: true,
    enum: ['square', 'rectangle', 'circle', 'cube', 'cuboid', 'cylinder'],
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  type: {
    type: String,
    enum: [
      'direct_calculation', 'mcq', 'fill_in_blank', 'true_false',
      'reverse_find', 'word_problem', 'cost_problem', 'comparison',
      'error_correction', 'matching',
    ],
    default: 'direct_calculation',
  },
  question: { type: String, required: true },
  // Mixed allows number (numeric questions) or string (MCQ letter, true_false word)
  answer: { type: mongoose.Schema.Types.Mixed, required: true },
  unit: { type: String, default: '' },
  formula: { type: String, required: true },

  // MCQ-specific
  options: {
    A: String,
    B: String,
    C: String,
    D: String,
  },
  correct_option: { type: String, enum: ['A', 'B', 'C', 'D'] },

  // True/False-specific
  correct_verdict: { type: String, enum: ['True', 'False'] },
  reason: String,

  // Progressive 3-level hints
  hints: {
    level1: { type: String, required: true },
    level2: { type: String, required: true },
    level3: { type: String, required: true },
  },

  // Rich remedial content shown after ≥4 wrong attempts
  remedial: {
    concept_recap: String,
    formula: String,
    worked_example: String,
    common_mistake: String,
    memory_tip: String,
  },

  // Step-by-step solution path
  solution_steps: [String],

  expectedTime: { type: Number, default: 60 },
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
