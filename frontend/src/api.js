import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const patientAPI = {
  getAll: () => api.get('/patients/'),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients/', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
};

export default api;
