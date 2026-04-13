import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { isMergeSession, isRecommendationSent } from '../store/mergeStore';
import { sendRecommendationKeepAlive } from '../services/recommendService';

const ZERO_SUMMARY = {
  questionsCompleted: 0,
  questionsCorrectTotal: 0,
  wrong: 0,
  correct: 0,
  totalAttempts: 0,
  hintsUsed: 0,
  timeSpentSeconds: 0,
};

/**
 * Tab close / refresh on non-quiz pages: send exited_midway once per Merge tab session.
 * QuizPage owns the same for /quiz/* (richer metrics).
 */
export default function MergeDocumentExitHandler() {
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    if (path.startsWith('/quiz')) return undefined;

    const onBeforeUnload = (e) => {
      if (!isMergeSession() || isRecommendationSent()) return;
      e.preventDefault();
      e.returnValue = 'Your session will be reported as exited to the course portal.';
    };

    const onPageHide = () => {
      if (!isMergeSession() || isRecommendationSent()) return;
      void sendRecommendationKeepAlive(ZERO_SUMMARY, 'exited_midway');
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('pagehide', onPageHide);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, [path]);

  return null;
}
