import { getApiBaseURL } from '../config/api';

/** User-facing text when login/register API call fails without a response body */
export function networkErrorMessage() {
  if (import.meta.env.PROD && getApiBaseURL() === '/api') {
    return 'This build has no API URL. In Vercel → Project → Settings → Environment Variables, set VITE_API_URL to your Render URL (e.g. https://ats-xxx.onrender.com), then Redeploy.';
  }
  return 'Cannot reach the API. (1) Open your Render URL + /api/health in a new tab and wait until it responds. (2) On Render, set CLIENT_ORIGIN to this site’s exact URL (copy from the address bar) and redeploy the API.';
}
