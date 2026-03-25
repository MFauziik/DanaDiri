import api from './api';

// Set atau update budget bulan ini
export const setBudget = async (amount) => {
  const response = await api.post('/budget', { amount });
  return response.data;
};

// Get budget dan total pengeluaran bulan ini
export const getBudget = async () => {
  const response = await api.get('/budget');
  return response.data;
};