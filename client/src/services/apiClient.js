import axios from 'axios';
import { getApiBaseURL } from '../config/api';
import { HOME_PATH } from '../config/routes';
import { useAuthStore } from '../store/authStore';

/** Shared HTTP client: long timeout (Render cold start), auth header, 401 handling. */
const api = axios.create({
  baseURL: getApiBaseURL(),
  timeout: 120000,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = String(err.config?.url || '');
    const isAuthForm = url.includes('/auth/guest');
    if (err.response?.status === 401 && !isAuthForm) {
      useAuthStore.getState().logout();
      window.location.href = HOME_PATH;
    }
    return Promise.reject(err);
  }
);

/** Fire on auth screens so Render (or the Vercel proxy) can wake before the user submits. */
export function warmupBackend() {
  const probe = axios.create({
    baseURL: getApiBaseURL(),
    timeout: 90000,
  });
  probe.get('/health').catch(() => {});
}

/** Retries transient failures (sleeping API, flaky networks). */
export async function withNetworkRetries(fn, { attempts = 3, delaysMs = [0, 900, 2200] } = {}) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    if (delaysMs[i]) await new Promise((r) => setTimeout(r, delaysMs[i]));
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const transient =
        err.code === 'ERR_NETWORK' ||
        err.code === 'ECONNABORTED' ||
        err.message === 'Network Error' ||
        (!err.response && err.request);
      if (!transient || i === attempts - 1) throw err;
    }
  }
  throw lastErr;
}

export default api;
