import api from './apiClient';

export const startQuiz = async (topic, shape) => {
  const { data } = await api.post('/quiz/start', { topic, shape });
  return data;
};
export const submitAnswer = async (sessionId, ans, time) => {
  const { data } = await api.post('/quiz/answer', { sessionId, answer: ans, timeSpent: time });
  return data;
};
export const requestHint = async (sessionId, level) => {
  const { data } = await api.get('/quiz/hint', { params: { sessionId, level } });
  return data;
};

/** ITS-style JSON: is_correct, error_type, detected_pattern, confidence, message, hint_level_1..3 */
export const requestAdaptiveHints = async (payload) => {
  const { data } = await api.post('/quiz/adaptive-hints', payload);
  return data;
};
export const requestRemedial = async (sessionId) => {
  const { data } = await api.get('/quiz/remedial', { params: { sessionId } });
  return data;
};
export const getDashboard = async () => {
  const { data } = await api.get('/user/dashboard');
  return data;
};
export const completeSession = async (sessionId) => {
  const { data } = await api.post('/session/complete', { sessionId });
  return data;
};
export const terminateSession = async (sessionId) => {
  const { data } = await api.post('/session/terminate', { sessionId });
  return data;
};
export const getSessionHistory = async () => {
  const { data } = await api.get('/session/history');
  return data;
};
export const getProfile = async () => {
  const { data } = await api.get('/user/profile');
  return data;
};
export const updateProfile = async (payload) => {
  const { data } = await api.put('/user/profile', payload);
  return data;
};
