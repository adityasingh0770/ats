import axios from 'axios';
import { getApiBaseURL } from '../config/api';

// Long timeout: Render free tier can take 30–60s to wake from sleep
const api = axios.create({
  baseURL: getApiBaseURL(),
  timeout: 120000,
});

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const register = async (name, email, password) => {
  const { data } = await api.post('/auth/register', { name, email, password });
  return data;
};
