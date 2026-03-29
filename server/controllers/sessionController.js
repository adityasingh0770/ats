const Session = require('../models/Session');
const LearnerModel = require('../models/LearnerModel');
const { calculateMastery, updateConfidenceScore } = require('../services/masteryService');
const { handleError } = require('../utils/dbError');

const completeSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await Session.findOne({ sessionId, userId: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found.' });

    if (session.status !== 'completed') {
      session.status = 'completed';
      session.endTime = new Date();
      await session.save();
    }

    const durationMinutes = session.endTime
      ? Math.round((new Date(session.endTime) - new Date(session.startTime)) / 60000)
      : 0;

    res.json({
      sessionId: session.sessionId,
      topic: session.topic,
      shape: session.shape,
      summary: {
        correct: session.questionResults.filter(r => r.correct && r.attempts === 1).length,
        wrong:   session.questionResults.filter(r => !r.correct || r.attempts > 1).length,
        totalAttempts: session.metrics.totalAttempts,
        hintsUsed: session.metrics.hintsUsed,
        timeSpentSeconds: session.metrics.timeSpent,
        durationMinutes,
        questionsCompleted: session.questionResults.length,
        // Accuracy = questions answered correctly on the FIRST attempt / total questions.
        // This penalises every question that required retries or hints before getting right.
        firstAttemptCorrect: session.questionResults.filter(r => r.correct && r.attempts === 1).length,
        accuracy: session.questionResults.length > 0
          ? Math.round(
              (session.questionResults.filter(r => r.correct && r.attempts === 1).length /
               session.questionResults.length) * 100
            )
          : 0,
        masteryBefore: session.masteryBefore,
        masteryAfter: session.masteryAfter,
        masteryGain: parseFloat((session.masteryAfter - session.masteryBefore).toFixed(3)),
      },
      questionResults: session.questionResults,
    });
  } catch (err) {
    handleError(err, res);
  }
};

const terminateSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await Session.findOne({ sessionId, userId: req.user._id, status: 'active' });
    if (!session) return res.status(404).json({ message: 'Active session not found.' });

    session.status = 'terminated';
    session.endTime = new Date();

    // If the user was mid-question (attempted but never answered correctly),
    // log it as a wrong result so it counts in mastery + questionsCompleted.
    if (session.currentAttempts > 0 && session.currentQuestionId) {
      session.questionResults.push({
        questionId: session.currentQuestionId,
        qid:        null,
        correct:    false,
        attempts:   session.currentAttempts,
        hintsUsed:  session.currentHintsUsed,
        timeSpent:  0,
        errorType:  'terminated',
      });
      // metrics.wrong is already incremented per wrong submit — no double count needed
    }

    // Calculate + save partial mastery even for a terminated session
    const learner = await LearnerModel.findOne({ userId: req.user._id });
    if (learner) {
      if (session.questionResults.length > 0) {
        const conceptKey = `${session.topic}_${session.shape}`;
        const answered   = session.questionResults.length;
        const correct    = session.metrics.correct;

        const newScore = calculateMastery({
          correct,
          totalAttempts:      session.metrics.totalAttempts,
          hintsUsed:          session.metrics.hintsUsed,
          questionsAnswered:  answered,
          confidenceScore:    learner.confidence_score,
          avgTimeSpent:       answered > 0 ? session.metrics.timeSpent / answered : 60,
          avgExpectedTime:    60,
        });

        learner.updateConceptMastery(conceptKey, newScore);
        learner.confidence_score = updateConfidenceScore(
          learner.confidence_score, false, session.currentAttempts, session.currentHintsUsed
        );
        learner.hints_used += session.metrics.hintsUsed;

        session.masteryAfter = learner.concept_mastery.get(conceptKey) || newScore;
      }
      learner.total_sessions += 1;
      await learner.save();
    }

    await session.save();
    res.json({ message: 'Session terminated.', sessionId });
  } catch (err) {
    handleError(err, res);
  }
};

const getSessionHistory = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user._id, status: 'completed' })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    res.json(sessions);
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = { completeSession, terminateSession, getSessionHistory };
