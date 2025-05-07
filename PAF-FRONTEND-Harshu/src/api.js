// src/api.js
import axios from 'axios';

// Base URLs
const API_BASE_URL = 'http://localhost:8080/api';
const OAUTH2_BASE_URL = 'http://localhost:8080/oauth2';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', {
        fullName: userData.name,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword
      });
      
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  // OAuth2 URLs
  getGoogleAuthUrl: () => 
    `${OAUTH2_BASE_URL}/authorization/google?redirect_uri=http://localhost:8080/oauth2/redirect`,
  
  getGithubAuthUrl: () => 
    `${OAUTH2_BASE_URL}/authorization/github?redirect_uri=http://localhost:8080/oauth2/redirect`
};

// User services
export const userService = {
  getCurrentUser: async () => {
    return api.get('/users/me');
  },
  
  getUserById: async (id) => {
    return api.get(`/users/${id}`);
  }
};

export default api;