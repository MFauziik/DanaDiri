import api from './api';

// Get semua transaksi berulang
export const getRecurring = async () => {
  const response = await api.get('recurring');
  return response.data;
};

// Buat transaksi berulang baru
export const createRecurring = async (data) => {
  const response = await api.post('recurring', data);
  return response.data;
};

// Hapus transaksi berulang
export const deleteRecurring = async (id) => {
  const response = await api.delete(`recurring/${id}`);
  return response.data;
};

// Update transaksi berulang
export const updateRecurring = async (id, data) => {
  const response = await api.put(`recurring/${id}`, data);
  return response.data;
};