import api from './apiClient';
import { getApiBaseURL } from '../config/api';
import {
  isMergeSession,
  getMergeToken,
  getMergeStudentId,
  getMergeSessionId,
  isRecommendationSent,
  markRecommendationSent,
} from '../store/mergeStore';

// TODO: confirm canonical chapter_id with Merge / course team
const CHAPTER_ID = 'grade8_mensuration';
const TOTAL_QUESTIONS = 8;
const TOTAL_HINTS_EMBEDDED = TOTAL_QUESTIONS * 2; // 2 hints per question
const QUEUE_KEY = 'mathmentor-recommend-queue';

/** Prevents duplicate in-flight exit/completion sends (e.g. pagehide + legacy handlers). */
let recommendSendLock = false;

/**
 * Build the Recommendation API payload from a session summary.
 *
 * @param {object} summary - The summary object returned by /session/complete or /session/terminate
 * @param {'completed'|'exited_midway'} sessionStatus
 */
export function buildPayload(summary, sessionStatus) {
  const questionsCorrectTotal =
    summary.questionsCorrectTotal != null
      ? summary.questionsCorrectTotal
      : summary.questionsCompleted; // completed sessions: all questions are correct

  const correctAnswers = questionsCorrectTotal;
  const wrongAnswers = summary.questionsCompleted - correctAnswers;
  const questionsAttempted = summary.questionsCompleted;

  // retry_count = number of questions that needed more than 1 attempt
  const retryCount = summary.wrong ?? (questionsAttempted - (summary.correct ?? 0));

  return {
    student_id: getMergeStudentId(),
    session_id: getMergeSessionId(),
    chapter_id: CHAPTER_ID,
    timestamp: new Date().toISOString(),
    session_status: sessionStatus,
    correct_answers: correctAnswers,
    wrong_answers: wrongAnswers,
    questions_attempted: questionsAttempted,
    total_questions: TOTAL_QUESTIONS,
    retry_count: Math.min(retryCount, questionsAttempted),
    hints_used: summary.hintsUsed ?? 0,
    total_hints_embedded: TOTAL_HINTS_EMBEDDED,
    time_spent_seconds: summary.timeSpentSeconds ?? 0,
    topic_completion_ratio: Math.min(1, Math.max(0, questionsAttempted / TOTAL_QUESTIONS)),
  };
}

/** Validate payload against the course-mandated rules. Returns null if valid, or an error string. */
export function validatePayload(p) {
  if (p.correct_answers + p.wrong_answers !== p.questions_attempted) {
    return `correct(${p.correct_answers}) + wrong(${p.wrong_answers}) != attempted(${p.questions_attempted})`;
  }
  if (p.questions_attempted > p.total_questions) {
    return `attempted(${p.questions_attempted}) > total(${p.total_questions})`;
  }
  if (p.retry_count > p.questions_attempted) {
    return `retry_count(${p.retry_count}) > attempted(${p.questions_attempted})`;
  }
  if (p.hints_used > p.total_hints_embedded) {
    return `hints_used(${p.hints_used}) > total_hints(${p.total_hints_embedded})`;
  }
  if (p.topic_completion_ratio < 0 || p.topic_completion_ratio > 1) {
    return `topic_completion_ratio(${p.topic_completion_ratio}) out of [0,1]`;
  }
  if (p.session_status === 'completed' && p.questions_attempted !== p.total_questions) {
    return `status=completed but attempted(${p.questions_attempted}) != total(${p.total_questions})`;
  }
  return null;
}

/** Queue a failed payload to localStorage for manual retry later. */
function queuePayload(payload) {
  try {
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    queue.push({ payload, failedAt: new Date().toISOString() });
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch { /* storage full — nothing we can do */ }
}

/**
 * Send the Recommendation API payload via our server proxy.
 * Retries up to 3 times on transient failure; queues to localStorage on final failure.
 *
 * @param {object} summary - session summary from completeSession / terminateSession
 * @param {'completed'|'exited_midway'} sessionStatus
 * @returns {Promise<object|null>} the recommendation response, or null on failure
 */
export async function sendRecommendation(summary, sessionStatus) {
  if (!isMergeSession()) return null;
  if (isRecommendationSent()) return null;
  if (recommendSendLock) return null;
  recommendSendLock = true;

  const payload = buildPayload(summary, sessionStatus);
  const validationError = validatePayload(payload);
  if (validationError) {
    console.error('[Recommend] Validation failed:', validationError);
    recommendSendLock = false;
    return null;
  }

  const mergeToken = getMergeToken();
  if (!mergeToken) {
    recommendSendLock = false;
    return null;
  }
  const ATTEMPTS = 3;
  const DELAYS = [0, 1000, 2500];

  try {
    for (let i = 0; i < ATTEMPTS; i++) {
      if (DELAYS[i]) await new Promise((r) => setTimeout(r, DELAYS[i]));
      try {
        const { data } = await api.post('/merge/recommend', payload, {
          headers: { 'X-Merge-Token': mergeToken },
        });
        markRecommendationSent(data);
        return data;
      } catch (err) {
        console.warn(`[Recommend] Attempt ${i + 1} failed:`, err.message);
        if (i === ATTEMPTS - 1) {
          console.error('[Recommend] All attempts failed — queuing to localStorage.');
          queuePayload(payload);
          return null;
        }
      }
    }
    return null;
  } finally {
    recommendSendLock = false;
  }
}

/** Retry any queued payloads (e.g., called when the app next loads from Merge). */
export async function retryQueuedRecommendations() {
  const mergeToken = getMergeToken();
  if (!mergeToken) return;

  let queue;
  try {
    queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  } catch { return; }
  if (!queue.length) return;

  const remaining = [];
  for (const entry of queue) {
    try {
      const { data } = await api.post('/merge/recommend', entry.payload, {
        headers: { 'X-Merge-Token': mergeToken },
      });
      markRecommendationSent(data);
    } catch {
      remaining.push(entry);
    }
  }
  localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
}

/**
 * Best-effort send while the page is unloading (tab close / refresh).
 * Uses fetch(..., { keepalive: true }) so custom headers (X-Merge-Token) are preserved.
 */
export async function sendRecommendationKeepAlive(summary, sessionStatus) {
  if (!isMergeSession()) return;
  if (isRecommendationSent()) return;
  if (recommendSendLock) return;
  recommendSendLock = true;

  const payload = buildPayload(summary, sessionStatus);
  const validationError = validatePayload(payload);
  if (validationError) {
    console.error('[Recommend unload] Validation failed:', validationError);
    recommendSendLock = false;
    return;
  }

  const mergeToken = getMergeToken();
  if (!mergeToken) {
    recommendSendLock = false;
    return;
  }

  const base = getApiBaseURL().replace(/\/$/, '');
  try {
    const res = await fetch(`${base}/merge/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Merge-Token': mergeToken,
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    // Avoid marking as sent unless the proxy accepted the request.
    if (res.ok) markRecommendationSent(null);
  } catch {
    // ignore — best effort only
  } finally {
    recommendSendLock = false;
  }
}
