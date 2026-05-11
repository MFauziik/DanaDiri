import api from './api';

export const login = async (email, password) => {
  const response = await api.post('auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const register = async (name, email, phone, password) => {
  const response = await api.post('auth/register', { name, email, phone, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getProfile = async () => {
  const response = await api.get('auth/profile');
  return response.data;
};

export const updateProfile = async (formData) => {
  const response = await api.put('auth/profile', formData);
  return response.data;
};
