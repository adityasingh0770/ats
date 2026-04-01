const {
  findSessionOne,
  saveSession,
  findLearnerByUserId,
  saveLearner,
  getMastery,
  updateConceptMastery,
  findSessionsForUser,
} = require('../store/fileStore');
const { calculateMastery, updateConfidenceScore } = require('../services/masteryService');
const { buildSessionTryDigest } = require('../services/remedialService');
const { handleError } = require('../utils/dbError');

function buildSessionSummaryPayload(session) {
  const qr = session.questionResults || [];
  const durationMinutes = session.endTime
    ? Math.round((new Date(session.endTime) - new Date(session.startTime)) / 60000)
    : 0;
  const firstTry = qr.filter((r) => r.correct && r.attempts === 1).length;
  const struggled = qr.filter((r) => !r.correct || r.attempts > 1).length;
  const masteryAfter = session.masteryAfter ?? session.masteryBefore ?? 0;
  const masteryBefore = session.masteryBefore ?? 0;
  return {
    correct: firstTry,
    wrong: struggled,
    questionsCompleted: qr.length,
    questionsCorrectTotal: session.metrics?.correct ?? 0,
    totalAttempts: session.metrics?.totalAttempts ?? 0,
    hintsUsed: session.metrics?.hintsUsed ?? 0,
    timeSpentSeconds: session.metrics?.timeSpent ?? 0,
    durationMinutes,
    accuracy: qr.length > 0 ? Math.round((firstTry / qr.length) * 100) : 0,
    masteryBefore,
    masteryAfter,
    masteryGain: parseFloat((masteryAfter - masteryBefore).toFixed(3)),
    tryDigest: buildSessionTryDigest(session.wrongAttempts),
  };
}

const completeSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = findSessionOne({ sessionId, userId: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found.' });

    if (session.status !== 'completed') {
      session.status = 'completed';
      session.endTime = new Date().toISOString();
      saveSession(session);
    }

    const durationMinutes = session.endTime
      ? Math.round((new Date(session.endTime) - new Date(session.startTime)) / 60000)
      : 0;

    res.json({
      sessionId: session.sessionId,
      topic: session.topic,
      shape: session.shape,
      summary: {
        correct: session.questionResults.filter((r) => r.correct && r.attempts === 1).length,
        wrong: session.questionResults.filter((r) => !r.correct || r.attempts > 1).length,
        totalAttempts: session.metrics.totalAttempts,
        hintsUsed: session.metrics.hintsUsed,
        timeSpentSeconds: session.metrics.timeSpent,
        durationMinutes,
        questionsCompleted: session.questionResults.length,
        firstAttemptCorrect: session.questionResults.filter((r) => r.correct && r.attempts === 1).length,
        accuracy:
          session.questionResults.length > 0
            ? Math.round(
                (session.questionResults.filter((r) => r.correct && r.attempts === 1).length /
                  session.questionResults.length) *
                  100
              )
            : 0,
        masteryBefore: session.masteryBefore,
        masteryAfter: session.masteryAfter,
        masteryGain: parseFloat((session.masteryAfter - session.masteryBefore).toFixed(3)),
        tryDigest: buildSessionTryDigest(session.wrongAttempts),
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
    const session = findSessionOne({ sessionId, userId: req.user._id, status: 'active' });
    if (!session) return res.status(404).json({ message: 'Active session not found.' });

    session.status = 'terminated';
    session.endTime = new Date().toISOString();

    if (session.currentAttempts > 0 && session.currentQuestionId) {
      session.questionResults.push({
        questionId: session.currentQuestionId,
        qid: null,
        correct: false,
        attempts: session.currentAttempts,
        hintsUsed: session.currentHintsUsed,
        timeSpent: 0,
        errorType: 'terminated',
      });
    }

    const learner = findLearnerByUserId(req.user._id);
    if (learner) {
      if (session.questionResults.length > 0) {
        const conceptKey = `${session.topic}_${session.shape}`;
        const answered = session.questionResults.length;
        const correct = session.metrics.correct;

        const newScore = calculateMastery({
          correct,
          totalAttempts: session.metrics.totalAttempts,
          hintsUsed: session.metrics.hintsUsed,
          questionsAnswered: answered,
          confidenceScore: learner.confidence_score,
          avgTimeSpent: answered > 0 ? session.metrics.timeSpent / answered : 60,
          avgExpectedTime: 60,
        });

        updateConceptMastery(learner, conceptKey, newScore);
        learner.confidence_score = updateConfidenceScore(
          learner.confidence_score,
          false,
          session.currentAttempts,
          session.currentHintsUsed
        );
        learner.hints_used += session.metrics.hintsUsed;

        session.masteryAfter = getMastery(learner, conceptKey) || newScore;
      }
      learner.total_sessions += 1;
      saveLearner(learner);
    }

    saveSession(session);

    res.json({
      message: 'Session terminated.',
      sessionId: session.sessionId,
      topic: session.topic,
      shape: session.shape,
      status: 'terminated',
      summary: buildSessionSummaryPayload(session),
      questionResults: session.questionResults,
    });
  } catch (err) {
    handleError(err, res);
  }
};

const getSessionHistory = async (req, res) => {
  try {
    const sessions = findSessionsForUser(req.user._id, { statusIn: ['completed'] })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 20);
    res.json(sessions);
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = { completeSession, terminateSession, getSessionHistory };
