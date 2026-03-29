import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';
import { startQuiz, submitAnswer, terminateSession } from '../services/quizService';
import PageWrapper from '../components/layout/PageWrapper';
import ConceptMaterial from '../components/quiz/ConceptMaterial';
import QuestionCard from '../components/quiz/QuestionCard';
import FeedbackBox from '../components/quiz/FeedbackBox';
import HintPanel from '../components/quiz/HintPanel';
import RemedialContent from '../components/quiz/RemedialContent';
import { FullPageLoader } from '../components/ui/LoadingSpinner';
import Badge from '../components/ui/Badge';
import { formatTopicName, formatShapeName, topicColor } from '../utils/masteryCalc';
import { X, AlertTriangle } from 'lucide-react';
import CelebrationBurst from '../components/quiz/CelebrationBurst';
import { playCorrectSoundFX, playIncorrectSoundFX } from '../utils/quizFeedbackAudio';

export default function QuizPage() {
  const { topic, shape } = useParams();
  const navigate = useNavigate();
  const timeRef = useRef(null);
  const [initializing, setInitializing] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);
  const [inputKey, setInputKey] = useState(0);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [terminating, setTerminating] = useState(false);
  const [celebrationBurstId, setCelebrationBurstId] = useState(0);

  const {
    sessionId, currentQuestion, conceptMaterial, phase, feedback,
    hint, hints, hintLevel,
    remedialContent, progress, currentDifficulty,
    setSession, startQuiz: storeStartQuiz, setFeedback, setHint,
    setRemedial, setNextQuestion, incrementAttempt, reset, resumeQuiz,
  } = useQuizStore();

  useEffect(() => {
    reset();
    initQuiz();
    return () => reset();
  }, [topic, shape]);

  const initQuiz = async () => {
    setInitializing(true);
    try {
      const data = await startQuiz(topic, shape);
      setSession({ ...data, topic, shape });
    } catch (err) {
      console.error('Failed to start quiz:', err);
    } finally {
      setInitializing(false);
    }
  };

  const handleStartQuiz = () => storeStartQuiz();

  const handleSubmit = useCallback(async (answer, timeSpent) => {
    if (submitting || !sessionId) return;
    setSubmitting(true);
    incrementAttempt();
    try {
      const res = await submitAnswer(sessionId, answer, timeSpent);
      setLastResponse(res);
      if (res.hint) setHint(res.hint);
      if (res.action === 'remedial' && res.remedialContent) setRemedial(res.remedialContent);
      if (res.correct) {
        void playCorrectSoundFX();
        setCelebrationBurstId((n) => n + 1);
      } else {
        void playIncorrectSoundFX();
      }
      setFeedback({
        correct: res.correct, action: res.action, message: res.message,
        errorInfo: res.errorInfo, masteryUpdate: res.masteryUpdate,
        nextQuestion: res.nextQuestion, progress: res.progress, currentDifficulty: res.currentDifficulty,
      });
      if (res.action === 'session_complete' || res.sessionComplete) {
        setTimeout(() => navigate(`/result/${sessionId}`), 2000);
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  }, [submitting, sessionId, incrementAttempt, setHint, setRemedial, setFeedback, navigate]);

  const handleNextQuestion = useCallback(() => {
    if (!lastResponse) { navigate(`/result/${sessionId}`); return; }
    if (lastResponse.action === 'session_complete' || lastResponse.sessionComplete) {
      navigate(`/result/${sessionId}`); return;
    }
    if (lastResponse.nextQuestion) {
      setNextQuestion(lastResponse.nextQuestion, lastResponse.progress, lastResponse.currentDifficulty, lastResponse.masteryUpdate);
      setLastResponse(null);
      setInputKey(k => k + 1);
    } else {
      navigate(`/result/${sessionId}`);
    }
  }, [lastResponse, sessionId, navigate, setNextQuestion]);

  const handleRetry = useCallback(() => {
    setFeedback(null);
    setLastResponse(null);
    setInputKey(k => k + 1);
    timeRef.current = Date.now();
  }, [setFeedback, setLastResponse]);

  const handleTerminate = async () => {
    if (!sessionId || terminating) return;
    setTerminating(true);
    try {
      await terminateSession(sessionId);
    } catch (err) {
      console.error('Terminate error:', err);
    } finally {
      setTerminating(false);
      reset();
      navigate('/dashboard');
    }
  };

  const handleRemedialContinue = () => {
    resumeQuiz();
    if (lastResponse?.nextQuestion) {
      setNextQuestion(lastResponse.nextQuestion, lastResponse.progress, lastResponse.currentDifficulty, null);
      setLastResponse(null);
      setInputKey(k => k + 1);
    } else {
      // No next question stored — retry the same question fresh
      setFeedback(null);
      setLastResponse(null);
      setInputKey(k => k + 1);
      timeRef.current = Date.now();
    }
  };


  if (initializing) return <FullPageLoader text="Preparing your quiz..." />;

  // Lock the input the moment ANY feedback appears — student must click Try Again or Skip
  const isAnswerLocked = !!feedback;

  const accent = topicColor(topic);

  return (
    <PageWrapper>
      <CelebrationBurst burstId={celebrationBurstId} />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Terminate confirmation modal */}
        <AnimatePresence>
          {showTerminateModal && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full space-y-4 border border-[#E8E5E0]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111111]">Terminate Quiz?</p>
                    <p className="text-xs text-[#888888]">Your progress so far will still count towards your mastery.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowTerminateModal(false)}
                    className="flex-1 py-2 rounded-xl border border-[#E8E5E0] text-sm font-semibold text-[#555555] hover:bg-[#F5F3F0] transition-colors">
                    Keep Going
                  </button>
                  <motion.button whileTap={{ scale: 0.97 }}
                    onClick={handleTerminate} disabled={terminating}
                    className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50">
                    {terminating ? 'Saving…' : 'End Session'}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#AAAAAA]">{formatTopicName(topic)} › {formatShapeName(shape)}</span>
            <Badge label={currentDifficulty} type={currentDifficulty} size="xs" />
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowTerminateModal(true)}
            className="flex items-center gap-1 text-xs text-[#AAAAAA] hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50">
            <X className="w-3.5 h-3.5" /> End Quiz
          </motion.button>
        </div>

        {/* Progress */}
        {phase === 'quiz' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1.5">
            <div className="flex justify-between text-xs text-[#AAAAAA]">
              <span>Q {progress.answered + 1} / {progress.total}</span>
              <span className="text-green-600 font-medium">{progress.correct} correct</span>
            </div>
            <div className="h-2 bg-black/6 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${(progress.answered / progress.total) * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="h-2 rounded-full"
                style={{ background: accent }}
              />
            </div>
            <div className="flex gap-1">
              {Array.from({ length: progress.total }).map((_, i) => (
                <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                  style={{
                    background: i < progress.answered ? accent : i === progress.answered ? `${accent}60` : '#E8E5E0',
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {phase === 'concept' && (
            <motion.div key="concept" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ConceptMaterial material={conceptMaterial} topic={topic} shape={shape} onContinue={handleStartQuiz} />
            </motion.div>
          )}

          {phase === 'quiz' && currentQuestion && (
            <motion.div key={`quiz-${currentQuestion.id}-${inputKey}`} className="space-y-3"
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}>
              <QuestionCard key={inputKey} question={currentQuestion} onSubmit={handleSubmit}
                timeRef={timeRef}
                disabled={isAnswerLocked || submitting} />
              <AnimatePresence>
                {hintLevel > 0 && (
                  <HintPanel
                    hints={hints}
                    currentLevel={hintLevel}
                    maxLevel={3}
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {feedback && (
                  <FeedbackBox
                    feedback={feedback}
                    onNext={handleNextQuestion}
                    onRetry={handleRetry}
                    canRetry={
                      feedback.action === 'encouragement' ||
                      feedback.action === 'hint' ||
                      feedback.action === 'retry'
                    }
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {phase === 'remedial' && (
            <motion.div key="remedial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <RemedialContent content={remedialContent} onContinue={handleRemedialContinue} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageWrapper>
  );
}
