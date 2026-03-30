import api, { withNetworkRetries } from './apiClient';

export const login = async (email, password) => {
  const { data } = await withNetworkRetries(() => api.post('/auth/login', { email, password }));
  return data;
};

export const register = async (name, email, password) => {
  const { data } = await withNetworkRetries(() =>
    api.post('/auth/register', { name, email, password })
  );
  return data;
};
