const {
  findLearnerByUserId,
  createSession,
  findSessionOne,
  saveSession,
  saveLearner,
  getMastery,
  updateConceptMastery,
} = require('../store/fileStore');
const { getNextQuestion, findById } = require('../store/questionBank');
const { getConceptMaterial, getRemedialContent } = require('../services/remedialService');
const { handleError } = require('../utils/dbError');
const { getHint } = require('../services/hintService');
const { detectError, checkAnswer } = require('../services/errorDetectionService');
const { applyPedagogicalRule, adjustDifficulty } = require('../services/pedagogyEngine');
const { calculateMastery, updateConfidenceScore, difficultyFromMastery } = require('../services/masteryService');

const MAX_QUESTIONS_PER_SESSION = 8;

const startQuiz = async (req, res) => {
  try {
    const { topic, shape } = req.body;
    if (!topic || !shape) return res.status(400).json({ message: 'Topic and shape are required.' });

    const learner = findLearnerByUserId(req.user._id);
    const conceptKey = `${topic}_${shape}`;
    const masteryScore = learner ? getMastery(learner, conceptKey) : 0;
    const startDifficulty = difficultyFromMastery(masteryScore);

    const conceptMaterial = await getConceptMaterial(topic, shape);
    const firstQuestion = getNextQuestion(topic, shape, startDifficulty, []);

    const session = createSession({
      userId: req.user._id,
      topic,
      shape,
      currentQuestionId: firstQuestion ? firstQuestion._id : null,
      currentDifficulty: startDifficulty,
      masteryBefore: masteryScore,
    });

    res.json({
      sessionId: session.sessionId,
      conceptMaterial,
      question: firstQuestion ? formatQuestion(firstQuestion) : null,
      difficulty: startDifficulty,
      masteryBefore: masteryScore,
    });
  } catch (err) {
    handleError(err, res);
  }
};

const submitAnswer = async (req, res) => {
  try {
    const { sessionId, answer, timeSpent } = req.body;
    if (!sessionId || answer === undefined)
      return res.status(400).json({ message: 'sessionId and answer are required.' });

    const session = findSessionOne({ sessionId, userId: req.user._id, status: 'active' });
    if (!session) return res.status(404).json({ message: 'Active session not found.' });

    const question = findById(session.currentQuestionId);
    if (!question) return res.status(404).json({ message: 'Current question not found.' });

    session.currentAttempts += 1;
    session.metrics.totalAttempts += 1;
    session.metrics.timeSpent += timeSpent || 0;

    const isCorrect = checkAnswer(answer, question.answer, question);
    let errorInfo = null;

    if (!isCorrect) {
      errorInfo = detectError(answer, question.answer, question);
      session.metrics.wrong += 1;
    }

    const rule = applyPedagogicalRule(session.currentAttempts, isCorrect, timeSpent || 0, question.expectedTime);

    let hint = null;
    if (rule.hintLevel) {
      hint = await getHint(question._id, rule.hintLevel);
      session.currentHintsUsed += 1;
      session.metrics.hintsUsed += 1;
    }

    let nextQuestion = null;
    let isSessionComplete = false;

    if (isCorrect) {
      session.metrics.correct += 1;
      session.consecutiveCorrect += 1;
      session.consecutiveWrong = 0;

      session.questionResults.push({
        questionId: question._id,
        qid: question.qid,
        correct: true,
        attempts: session.currentAttempts,
        hintsUsed: session.currentHintsUsed,
        timeSpent: timeSpent || 0,
        errorType: null,
      });

      if (session.questionResults.length >= MAX_QUESTIONS_PER_SESSION) {
        isSessionComplete = true;
      } else {
        if (session.consecutiveCorrect >= 2 && rule.adjustDifficulty === 'up') {
          session.currentDifficulty = adjustDifficulty(session.currentDifficulty, 'up');
          session.consecutiveCorrect = 0;
        }
        session.questionsAsked.push(question._id);
        nextQuestion = getNextQuestion(
          session.topic,
          session.shape,
          session.currentDifficulty,
          session.questionsAsked
        );

        if (!nextQuestion) {
          isSessionComplete = true;
        } else {
          session.currentQuestionId = nextQuestion._id;
          session.currentAttempts = 0;
          session.currentHintsUsed = 0;
        }
      }
    } else {
      session.consecutiveWrong += 1;
      session.consecutiveCorrect = 0;

      if (rule.adjustDifficulty === 'down') {
        session.currentDifficulty = adjustDifficulty(session.currentDifficulty, 'down');
        session.consecutiveWrong = 0;
      }

      if (errorInfo) {
        const L = findLearnerByUserId(req.user._id);
        if (L && !(L.error_patterns || []).includes(errorInfo.type)) {
          if (!L.error_patterns) L.error_patterns = [];
          L.error_patterns.push(errorInfo.type);
          saveLearner(L);
        }
      }
    }

    const learner = findLearnerByUserId(req.user._id);
    let masteryAfter = session.masteryBefore;
    if (isCorrect && learner) {
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
        avgExpectedTime: question.expectedTime,
      });

      updateConceptMastery(learner, conceptKey, newScore);
      learner.confidence_score = updateConfidenceScore(
        learner.confidence_score,
        isCorrect,
        session.currentAttempts,
        session.currentHintsUsed
      );
      learner.attempts += 1;
      learner.hints_used += session.currentHintsUsed;
      learner.accuracy = Math.min(
        1,
        Math.max(0, (learner.accuracy * (learner.attempts - 1) + 1) / learner.attempts)
      );
      saveLearner(learner);
      masteryAfter = getMastery(learner, conceptKey) || newScore;
    }

    if (isSessionComplete) {
      session.status = 'completed';
      session.endTime = new Date().toISOString();
      session.masteryAfter = masteryAfter;
      if (learner) {
        learner.total_sessions += 1;
        saveLearner(learner);
      }
    }

    saveSession(session);

    let remedialContent = null;
    if (rule.showRemedial) {
      remedialContent = await getRemedialContent(session.topic, session.shape);
    }

    res.json({
      correct: isCorrect,
      errorInfo: isCorrect ? null : errorInfo,
      rule: rule.rule,
      action: isSessionComplete ? 'session_complete' : rule.action,
      message: rule.message,
      hint,
      remedialContent,
      nextQuestion: nextQuestion ? formatQuestion(nextQuestion) : null,
      sessionComplete: isSessionComplete,
      sessionId: session.sessionId,
      currentDifficulty: session.currentDifficulty,
      progress: {
        answered: session.questionResults.length,
        total: MAX_QUESTIONS_PER_SESSION,
        correct: session.metrics.correct,
      },
      masteryUpdate: {
        before: session.masteryBefore,
        after: masteryAfter,
      },
    });
  } catch (err) {
    console.error(err);
    handleError(err, res);
  }
};

const requestHint = async (req, res) => {
  try {
    const { sessionId, level } = req.query;
    const session = findSessionOne({ sessionId, userId: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found.' });

    const hint = await getHint(session.currentQuestionId, level || 1);
    session.currentHintsUsed += 1;
    session.metrics.hintsUsed += 1;
    saveSession(session);

    const learner = findLearnerByUserId(req.user._id);
    if (learner) {
      learner.hints_used += 1;
      saveLearner(learner);
    }

    res.json(hint);
  } catch (err) {
    handleError(err, res);
  }
};

const requestRemedial = async (req, res) => {
  try {
    const { sessionId } = req.query;
    const session = findSessionOne({ sessionId, userId: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found.' });

    const remedial = await getRemedialContent(session.topic, session.shape);
    res.json(remedial);
  } catch (err) {
    handleError(err, res);
  }
};

const formatQuestion = (q) => ({
  id: q._id,
  qid: q.qid,
  topic: q.topic,
  shape: q.shape,
  difficulty: q.difficulty,
  type: q.type || 'direct_calculation',
  question: q.question,
  unit: q.unit,
  formula: q.formula,
  expectedTime: q.expectedTime,
  options: q.options || null,
});

module.exports = { startQuiz, submitAnswer, requestHint, requestRemedial };
