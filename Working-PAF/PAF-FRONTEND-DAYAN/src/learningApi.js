import axios from 'axios';

const LEARNING_API_BASE = 'http://localhost:8080/api/v1/learning';

// Create axios instance with default config
const api = axios.create({
  baseURL: LEARNING_API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Enable sending cookies
});

// Add request interceptor to add auth token
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

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const learningApi = {
  // Create
  create: async (data) => {
    try {
      const res = await api.post('/save', data);
      return res.data;
    } catch (error) {
      console.error('Error creating learning entry:', error.response?.data || error.message);
      throw error;
    }
  },
  // Read all
  getAll: async () => {
    try {
      const res = await api.get('/getAll');
      return res.data;
    } catch (error) {
      console.error('Error fetching learning entries:', error.response?.data || error.message);
      throw error;
    }
  },
  // Read by user ID
  getByUserId: async (userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      const res = await api.get(`/getByUserId/${userId}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching user learning entries:', error.response?.data || error.message);
      if (error.response?.status === 500) {
        throw new Error('Server error while fetching learning entries. Please try again later.');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data || 'Invalid request');
      } else {
        throw new Error('Failed to fetch learning entries. Please try again.');
      }
    }
  },
  // Read one
  getById: async (id) => {
    try {
      const res = await api.get(`/learning/${id}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching learning entry:', error.response?.data || error.message);
      throw error;
    }
  },
  // Update
  update: async (id, data) => {
    try {
      const res = await api.put(`/edit/${id}`, data);
      return res.data;
    } catch (error) {
      console.error('Error updating learning entry:', error.response?.data || error.message);
      throw error;
    }
  },
  // Delete
  delete: async (id) => {
    try {
      const res = await api.delete(`/delete/${id}`);
      return res.data;
    } catch (error) {
      console.error('Error deleting learning entry:', error.response?.data || error.message);
      throw error;
    }
  },
}; 