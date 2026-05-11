import api from './api';

// Get wawasan keuangan
export const getInsights = async () => {
  const response = await api.get('insights');
  return response.data;
};