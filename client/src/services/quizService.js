import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { getApiBaseURL } from '../config/api';

// Single shared instance with interceptors
const api = axios.create({ baseURL: getApiBaseURL() });

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401, pass through everything else
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const startQuiz        = async (topic, shape)           => { const { data } = await api.post('/quiz/start',      { topic, shape });          return data; };
export const submitAnswer      = async (sessionId, ans, time)  => { const { data } = await api.post('/quiz/answer',     { sessionId, answer: ans, timeSpent: time }); return data; };
export const requestHint       = async (sessionId, level)      => { const { data } = await api.get('/quiz/hint',        { params: { sessionId, level } }); return data; };
export const requestRemedial   = async (sessionId)             => { const { data } = await api.get('/quiz/remedial',    { params: { sessionId } });   return data; };
export const getDashboard      = async ()                       => { const { data } = await api.get('/user/dashboard');                                return data; };
export const completeSession   = async (sessionId)             => { const { data } = await api.post('/session/complete',  { sessionId }); return data; };
export const terminateSession  = async (sessionId)             => { const { data } = await api.post('/session/terminate', { sessionId }); return data; };
export const getSessionHistory = async ()                       => { const { data } = await api.get('/session/history');                               return data; };
export const getProfile        = async ()                       => { const { data } = await api.get('/user/profile');                                  return data; };
export const updateProfile     = async (payload)               => { const { data } = await api.put('/user/profile',    payload);                      return data; };
