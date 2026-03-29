const mongoose = require('mongoose');

const learnerModelSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  concept_mastery: {
    type: Map,
    of: Number,
    default: {},
  },
  attempts: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  hints_used: { type: Number, default: 0 },
  time_taken: { type: Map, of: Number, default: {} },
  error_patterns: { type: [String], default: [] },
  confidence_score: { type: Number, default: 0.5 },
  total_sessions: { type: Number, default: 0 },
}, { timestamps: true });

learnerModelSchema.methods.getMasteryForConcept = function (conceptKey) {
  return this.concept_mastery.get(conceptKey) || 0;
};

learnerModelSchema.methods.updateConceptMastery = function (conceptKey, score) {
  const current = this.concept_mastery.get(conceptKey) || 0;
  const updated = current * 0.7 + score * 0.3;
  this.concept_mastery.set(conceptKey, Math.min(1, Math.max(0, updated)));
};

module.exports = mongoose.model('LearnerModel', learnerModelSchema);
