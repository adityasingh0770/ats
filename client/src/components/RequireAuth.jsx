import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { HOME_PATH } from '../config/routes';
import { FullPageLoader } from './ui/LoadingSpinner';

/** ET605: JWT only after Merge /chapter entry — no anonymous guest users in production flow. */
export default function RequireAuth({ children }) {
  const token = useAuthStore((s) => s.token);
  const [hydrated, setHydrated] = useState(() => useAuthStore.persist.hasHydrated());

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  if (!hydrated) return <FullPageLoader text="Loading session..." />;
  if (!token) return <Navigate to={HOME_PATH} replace />;
  return children;
}
