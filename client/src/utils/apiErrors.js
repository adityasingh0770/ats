import { getApiBaseURL } from '../config/api';

/** User-facing text when login/register API call fails without a response body */
export function networkErrorMessage() {
  const base = getApiBaseURL();
  if (!import.meta.env.PROD && base === '/api') {
    return 'Cannot reach the API. Start the backend (e.g. cd server && npm run dev) so it listens on port 5000, then try again.';
  }
  if (import.meta.env.PROD && base === '/api') {
    return 'This build has no API URL. In Vercel → Project → Settings → Environment Variables, set VITE_API_URL to your backend URL (e.g. https://your-api.onrender.com), then redeploy.';
  }
  return 'Cannot reach the API. (1) Open your backend URL + /api/health in a new tab and wait until it responds. (2) Ensure the host allows your site’s origin in CORS (CLIENT_ORIGIN).';
}
