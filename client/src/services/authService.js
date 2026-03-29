import axios from 'axios';
import { getApiBaseURL } from '../config/api';

const api = axios.create({ baseURL: getApiBaseURL() });

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const register = async (name, email, password) => {
  const { data } = await api.post('/auth/register', { name, email, password });
  return data;
};
