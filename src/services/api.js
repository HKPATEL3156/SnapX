import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('snapx_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('snapx_token');
      localStorage.removeItem('snapx_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  verify: () => api.get('/auth/verify'),
};

// Images API
export const imagesAPI = {
  upload: (formData) => api.post('/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getGallery: (page = 1, limit = 12) => api.get(`/images/gallery?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/images/${id}`),
  search: (query, page = 1, limit = 12) => api.get(`/images/search/${query}?page=${page}&limit=${limit}`),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getPending: (page = 1, limit = 10) => api.get(`/admin/pending?page=${page}&limit=${limit}`),
  getImages: (status = 'all', page = 1, limit = 10) => 
    api.get(`/admin/images?status=${status}&page=${page}&limit=${limit}`),
  approve: (id) => api.post(`/admin/approve/${id}`),
  reject: (id, reason) => api.post(`/admin/reject/${id}`, { reason }),
  delete: (id) => api.delete(`/admin/delete/${id}`),
  bulkAction: (action, imageIds, reason = '') => 
    api.post('/admin/bulk-action', { action, imageIds, reason }),
};

export default api;