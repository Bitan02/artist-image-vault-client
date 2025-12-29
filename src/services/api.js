import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
};

// User API
export const userAPI = {
  getMe: () => api.get('/users/me'),
  searchUsers: (username) => api.get(`/users/search?username=${username}`),
  getUserByUsername: (username) => api.get(`/users/${username}`),
};

// Post API
export const postAPI = {
  uploadImage: (formData) =>
    api.post('/posts/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getFeed: () => api.get('/posts/feed'),
  getPostsByUsername: (username) => api.get(`/posts/user/${username}`),
  deletePost: (postId) => api.delete(`/posts/${postId}`),
};

export default api;

