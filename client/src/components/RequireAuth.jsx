import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { HOME_PATH } from '../config/routes';

/** ET605: JWT only after Merge /chapter entry — no anonymous guest users in production flow. */
export default function RequireAuth({ children }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to={HOME_PATH} replace />;
  return children;
}
