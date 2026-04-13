/**
 * Read Merge portal JWT payload (no signature verification — server still validates on /merge/entry).
 * ET605 §7.3: claims may include student_id, username, etc.
 */

function parseJwtPayload(token) {
  if (!token || typeof token !== 'string' || token.split('.').length < 2) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '==='.slice((base64.length + 3) % 4);
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Resolve Merge handoff from URLSearchParams (query).
 * Prefer explicit query params; fill gaps from JWT body when portal only appends ?token=...
 */
export function resolveMergeHandoff(searchParams) {
  const token = searchParams.get('token')?.trim();
  if (!token) return null;

  const fromQuery = {
    studentId: searchParams.get('student_id')?.trim() || searchParams.get('studentId')?.trim() || null,
    sessionId: searchParams.get('session_id')?.trim() || searchParams.get('sessionId')?.trim() || null,
  };

  const payload = parseJwtPayload(token);
  const fromJwt = payload
    ? {
        studentId:
          payload.student_id ||
          payload.studentId ||
          payload.user?.student_id ||
          payload.user?.studentId ||
          (typeof payload.sub === 'string' && /^STD-/i.test(payload.sub) ? payload.sub : null) ||
          null,
        sessionId:
          payload.session_id ||
          payload.sessionId ||
          payload.chapter_session_id ||
          payload.sess_id ||
          (typeof payload.jti === 'string' ? payload.jti : null) ||
          null,
      }
    : { studentId: null, sessionId: null };

  const studentId = fromQuery.studentId || (fromJwt.studentId != null ? String(fromJwt.studentId).trim() : null);
  const sessionId = fromQuery.sessionId || (fromJwt.sessionId != null ? String(fromJwt.sessionId).trim() : null);

  if (!studentId || !sessionId) return null;

  return { token, studentId, sessionId };
}
