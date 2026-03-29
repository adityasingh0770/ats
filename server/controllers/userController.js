const LearnerModel = require('../models/LearnerModel');
const Session = require('../models/Session');
const User = require('../models/User');
const { classifyMastery } = require('../services/masteryService');
const { handleError } = require('../utils/dbError');

const getDashboard = async (req, res) => {
  try {
    const learner = await LearnerModel.findOne({ userId: req.user._id });
    if (!learner) return res.status(404).json({ message: 'Learner model not found.' });

    // Fetch ALL finished sessions for stats computation
    const allSessions = await Session.find({
      userId: req.user._id,
      status: { $in: ['completed', 'terminated'] },
    }).lean();

    // Derive every stat directly from session records — avoids any drift in learner fields
    let totalQuestions      = 0;
    let firstAttemptCorrect = 0;
    let totalAttempts       = 0;
    let totalHints          = 0;

    for (const s of allSessions) {
      const results = s.questionResults || [];
      totalQuestions      += results.length;
      firstAttemptCorrect += results.filter(r => r.correct && r.attempts === 1).length;
      totalAttempts       += s.metrics?.totalAttempts ?? 0;
      totalHints          += s.metrics?.hintsUsed     ?? 0;
    }

    const accuracyPct = totalQuestions > 0
      ? parseFloat(((firstAttemptCorrect / totalQuestions) * 100).toFixed(1))
      : 0;

    // Recent 10 for the history list
    const recentSessions = allSessions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    const topics    = ['perimeter', 'area', 'surface_area', 'volume'];
    const shapes2D  = ['square', 'rectangle', 'circle'];
    const shapes3D  = ['cube', 'cuboid', 'cylinder'];

    const conceptProgress = {};
    for (const topic of topics) {
      const shapeList = ['perimeter', 'area'].includes(topic) ? shapes2D : shapes3D;
      conceptProgress[topic] = {};
      for (const shape of shapeList) {
        const key   = `${topic}_${shape}`;
        const score = learner.concept_mastery.get(key) || 0;
        conceptProgress[topic][shape] = {
          score:      parseFloat(score.toFixed(3)),
          level:      classifyMastery(score),
          percentage: Math.round(score * 100),
        };
      }
    }

    const overallScore = calculateOverallMastery(learner.concept_mastery);

    res.json({
      student: { id: req.user._id, name: req.user.name, email: req.user.email },
      overallMastery: {
        score:      parseFloat(overallScore.toFixed(3)),
        level:      classifyMastery(overallScore),
        percentage: Math.round(overallScore * 100),
      },
      conceptProgress,
      stats: {
        attempts:       totalAttempts,
        accuracy:       accuracyPct,
        hintsUsed:      totalHints,
        totalSessions:  allSessions.length,
        errorPatterns:  [...new Set(learner.error_patterns)].slice(0, 5),
      },
      recentSessions: recentSessions.map((s) => ({
        sessionId:         s.sessionId,
        topic:             s.topic,
        shape:             s.shape,
        status:            s.status,
        masteryBefore:     s.masteryBefore,
        masteryAfter:      s.masteryAfter,
        masteryGain:       parseFloat((s.masteryAfter - s.masteryBefore).toFixed(3)),
        metrics:           s.metrics,
        questionsCompleted: s.questionResults?.length ?? 0,
        date:              s.endTime,
      })),
    });
  } catch (err) {
    handleError(err, res);
  }
};

const calculateOverallMastery = (masteryMap) => {
  if (!masteryMap || masteryMap.size === 0) return 0;
  let total = 0;
  let count = 0;
  for (const [, val] of masteryMap) {
    total += val;
    count++;
  }
  return count > 0 ? total / count : 0;
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    const learner = await LearnerModel.findOne({ userId: req.user._id });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      grade: user.grade,
      createdAt: user.createdAt,
      stats: learner ? {
        attempts:      learner.attempts,
        hintsUsed:     learner.hints_used,
        totalSessions: learner.total_sessions,
      } : null,
    });
  } catch (err) {
    handleError(err, res);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (name && name.trim()) user.name = name.trim();

    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ message: 'Current password is required to set a new password.' });
      const match = await user.matchPassword(currentPassword);
      if (!match) return res.status(400).json({ message: 'Current password is incorrect.' });
      if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters.' });
      user.passwordHash = newPassword;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully.', name: user.name, email: user.email });
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = { getDashboard, getProfile, updateProfile };
