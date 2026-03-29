const {
  findLearnerByUserId,
  findSessionsForUser,
  findUserById,
  matchPassword,
  updateUserFields,
  getMastery,
} = require('../store/fileStore');
const { classifyMastery } = require('../services/masteryService');
const { handleError } = require('../utils/dbError');

const calculateOverallMastery = (conceptMastery) => {
  if (!conceptMastery || typeof conceptMastery !== 'object') return 0;
  const vals = Object.values(conceptMastery).filter((v) => typeof v === 'number');
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
};

const getDashboard = async (req, res) => {
  try {
    const learner = findLearnerByUserId(req.user._id);
    if (!learner) return res.status(404).json({ message: 'Learner model not found.' });

    const allSessions = findSessionsForUser(req.user._id, {
      statusIn: ['completed', 'terminated'],
    });

    let totalQuestions = 0;
    let firstAttemptCorrect = 0;
    let totalAttempts = 0;
    let totalHints = 0;

    for (const s of allSessions) {
      const results = s.questionResults || [];
      totalQuestions += results.length;
      firstAttemptCorrect += results.filter((r) => r.correct && r.attempts === 1).length;
      totalAttempts += s.metrics?.totalAttempts ?? 0;
      totalHints += s.metrics?.hintsUsed ?? 0;
    }

    const accuracyPct = totalQuestions > 0
      ? parseFloat(((firstAttemptCorrect / totalQuestions) * 100).toFixed(1))
      : 0;

    const recentSessions = allSessions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    const topics = ['perimeter', 'area', 'surface_area', 'volume'];
    const shapes2D = ['square', 'rectangle', 'circle'];
    const shapes3D = ['cube', 'cuboid', 'cylinder'];

    const conceptProgress = {};
    for (const topic of topics) {
      const shapeList = ['perimeter', 'area'].includes(topic) ? shapes2D : shapes3D;
      conceptProgress[topic] = {};
      for (const shape of shapeList) {
        const key = `${topic}_${shape}`;
        const score = getMastery(learner, key);
        conceptProgress[topic][shape] = {
          score: parseFloat(score.toFixed(3)),
          level: classifyMastery(score),
          percentage: Math.round(score * 100),
        };
      }
    }

    const overallScore = calculateOverallMastery(learner.concept_mastery);

    res.json({
      student: { id: req.user._id, name: req.user.name, email: req.user.email },
      overallMastery: {
        score: parseFloat(overallScore.toFixed(3)),
        level: classifyMastery(overallScore),
        percentage: Math.round(overallScore * 100),
      },
      conceptProgress,
      stats: {
        attempts: totalAttempts,
        accuracy: accuracyPct,
        hintsUsed: totalHints,
        totalSessions: allSessions.length,
        errorPatterns: [...new Set(learner.error_patterns || [])].slice(0, 5),
      },
      recentSessions: recentSessions.map((s) => ({
        sessionId: s.sessionId,
        topic: s.topic,
        shape: s.shape,
        status: s.status,
        masteryBefore: s.masteryBefore,
        masteryAfter: s.masteryAfter,
        masteryGain: parseFloat((s.masteryAfter - s.masteryBefore).toFixed(3)),
        metrics: s.metrics,
        questionsCompleted: s.questionResults?.length ?? 0,
        date: s.endTime,
      })),
    });
  } catch (err) {
    handleError(err, res);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = findUserById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    const learner = findLearnerByUserId(req.user._id);
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      grade: user.grade,
      createdAt: user.createdAt,
      stats: learner
        ? {
            attempts: learner.attempts,
            hintsUsed: learner.hints_used,
            totalSessions: learner.total_sessions,
          }
        : null,
    });
  } catch (err) {
    handleError(err, res);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const user = findUserById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password.' });
      }
      const match = await matchPassword(user, currentPassword);
      if (!match) return res.status(400).json({ message: 'Current password is incorrect.' });
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters.' });
      }
    }

    await updateUserFields(req.user._id, {
      name: name && name.trim() ? name.trim() : undefined,
      newPassword: newPassword || undefined,
    });

    const updated = findUserById(req.user._id);
    res.json({ message: 'Profile updated successfully.', name: updated.name, email: updated.email });
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = { getDashboard, getProfile, updateProfile };
