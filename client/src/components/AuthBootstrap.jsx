import { useLayoutEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ensureGuestSession } from '../services/authService';
import { CHAPTER_PATH } from '../config/routes';

/**
 * Ensures a JWT exists for API calls without login/register.
 * Skips when Merge opens /chapter?token=… (ChapterEntryPage obtains its own JWT).
 */
export default function AuthBootstrap() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const token = useAuthStore((s) => s.token);

  useLayoutEffect(() => {
    if (token) return;
    if (location.pathname === CHAPTER_PATH && searchParams.get('token')) return;

    let cancelled = false;
    (async () => {
      try {
        await ensureGuestSession();
      } catch (e) {
        console.error('[AuthBootstrap] Guest session failed', e);
      }
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.search, token]);

  return null;
}
