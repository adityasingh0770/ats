import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { initMergeSession } from '../store/mergeStore';
import { retryQueuedRecommendations } from '../services/recommendService';
import api from '../services/apiClient';
import { FullPageLoader } from '../components/ui/LoadingSpinner';
import { HOME_PATH } from '../config/routes';

/**
 * /chapter  — Merge portal redirect entry point.
 * Extracts token, student_id, session_id from query params,
 * auto-logs the student in via /api/merge/entry, then redirects to /topics.
 */
export default function ChapterEntryPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = params.get('token');
    const studentId = params.get('student_id');
    const sessionId = params.get('session_id');

    if (!token || !studentId || !sessionId) {
      navigate(HOME_PATH, { replace: true });
      return;
    }

    initMergeSession(token, studentId, sessionId);

    (async () => {
      try {
        const { data } = await api.post(
          '/merge/entry',
          { student_id: studentId },
          { headers: { 'X-Merge-Token': token } }
        );
        setAuth(data.token, data.user);

        retryQueuedRecommendations().catch(() => {});

        navigate('/topics', { replace: true });
      } catch (err) {
        console.error('Merge entry failed:', err);
        setError('Failed to authenticate with the portal. Please try again.');
      }
    })();
  }, [params, navigate, setAuth]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-3 max-w-sm">
          <p className="text-red-500 text-sm">{error}</p>
          <p className="text-xs text-[#888888]">
            If this keeps happening, return to the portal and re-open the chapter.
          </p>
        </div>
      </div>
    );
  }

  return <FullPageLoader text="Connecting to MathMentor..." />;
}
