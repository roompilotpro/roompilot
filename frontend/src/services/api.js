import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const messageService = {
  getAllMessages: () => api.get('/api/messages'),
  getMessage: (id) => api.get(`/api/messages/${id}`),
  createMessage: (content) => api.post('/api/messages', { content }),
  updateMessage: (id, content) => api.put(`/api/messages/${id}`, { content }),
  deleteMessage: (id) => api.delete(`/api/messages/${id}`),
};

export default api;