/**
 * API base URL for Axios.
 * - Local dev: leave VITE_API_URL unset → uses Vite proxy "/api"
 * - Production: set VITE_API_URL to your backend origin, e.g. https://api.yourapp.onrender.com
 */
export function getApiBaseURL() {
  const raw = import.meta.env.VITE_API_URL;
  if (raw && String(raw).trim()) {
    let base = String(raw).trim().replace(/\/$/, '');
    if (base.endsWith('/api')) base = base.slice(0, -4);
    return `${base}/api`;
  }
  return '/api';
}
