/**
 * API base URL for Axios.
 * - Local dev: leave VITE_API_URL unset → uses Vite proxy "/api"
 * - Production: set VITE_API_URL to your backend origin, e.g. https://api.yourapp.onrender.com
 */
function normalizeHttpToHttpsIfNeeded(origin) {
  if (typeof window === 'undefined') return origin;
  try {
    if (
      window.location.protocol === 'https:' &&
      origin.startsWith('http://') &&
      !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(origin)
    ) {
      return `https://${origin.slice('http://'.length)}`;
    }
  } catch {
    /* ignore */
  }
  return origin;
}

export function getApiBaseURL() {
  const raw = import.meta.env.VITE_API_URL;
  if (raw && String(raw).trim()) {
    let base = String(raw).trim().replace(/\/$/, '');
    if (base.endsWith('/api')) base = base.slice(0, -4);
    base = normalizeHttpToHttpsIfNeeded(base);
    return `${base}/api`;
  }
  return '/api';
}
