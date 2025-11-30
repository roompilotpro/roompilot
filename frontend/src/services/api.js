import axios from 'axios'
import { getToken, removeToken } from '../utils/tokenStorage'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear it and redirect to login
      removeToken()
      // Only redirect if not already on login, auth, or test pages
      if (
        !window.location.pathname.startsWith('/login') &&
        !window.location.pathname.startsWith('/auth') &&
        !window.location.pathname.startsWith('/test')
      ) {
        window.location.href = '/login?sessionExpired=true'
      }
    }
    return Promise.reject(error)
  }
)

export const messageService = {
  getAllMessages: () => api.get('/api/messages'),
  getMessage: (id) => api.get(`/api/messages/${id}`),
  createMessage: (content) => api.post('/api/messages', { content }),
  updateMessage: (id, content) => api.put(`/api/messages/${id}`, { content }),
  deleteMessage: (id) => api.delete(`/api/messages/${id}`),
}

export default api
