import { getApiBaseURL } from '../config/api';

/** User-facing text when login/register API call fails without a response body */
export function networkErrorMessage() {
  const base = getApiBaseURL();
  if (!import.meta.env.PROD && base === '/api') {
    return 'Cannot reach the API. Start the backend (e.g. cd server && npm run dev) so it listens on port 8787, then try again.';
  }
  if (import.meta.env.PROD && base === '/api') {
    return 'This build has no API URL. In Vercel → Project → Settings → Environment Variables, set VITE_API_URL to your backend URL (e.g. https://your-api.onrender.com), then redeploy.';
  }
  if (import.meta.env.PROD) {
    return `Cannot reach the API at ${base}. (1) Open that URL + /health in a browser — wait if Render was sleeping (first load can take ~1 min). (2) In Vercel, set VITE_API_URL to your Render URL only — no /api at the end. (3) If it still fails, check Render logs and that the service is Live.`;
  }
  return 'Cannot reach the API. (1) Open your backend URL + /api/health in a new tab and wait until it responds. (2) Ensure the host allows your site’s origin in CORS (CLIENT_ORIGIN).';
}
