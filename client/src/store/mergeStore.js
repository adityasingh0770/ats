/**
 * Merge-portal session state backed by sessionStorage.
 * Persists across in-tab navigation but clears when the tab closes,
 * which matches the lifecycle of one Merge visit.
 */

const STORAGE_KEY = 'mathmentor-merge';

function read() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(data) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Store Merge params parsed from /chapter?token=…&student_id=…&session_id=… */
export function initMergeSession(token, studentId, sessionId) {
  write({
    token,
    studentId,
    sessionId,
    recommendationSent: false,
    recommendation: null,
  });
}

/** True when the current tab was opened from the Merge portal. */
export function isMergeSession() {
  return !!read();
}

export function getMergeSession() {
  return read();
}

export function getMergeToken() {
  return read()?.token || null;
}

export function getMergeStudentId() {
  return read()?.studentId || null;
}

export function getMergeSessionId() {
  return read()?.sessionId || null;
}

export function isRecommendationSent() {
  return !!read()?.recommendationSent;
}

export function markRecommendationSent(recommendation) {
  const data = read();
  if (!data) return;
  data.recommendationSent = true;
  data.recommendation = recommendation ?? null;
  write(data);
}

export function getStoredRecommendation() {
  return read()?.recommendation || null;
}

export function clearMergeSession() {
  sessionStorage.removeItem(STORAGE_KEY);
}
