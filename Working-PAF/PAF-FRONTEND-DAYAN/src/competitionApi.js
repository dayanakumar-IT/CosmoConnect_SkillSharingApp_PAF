import axios from 'axios';

const COMPETITION_API_BASE = 'http://localhost:8080/api/v1/competition';

// Create axios instance with default config
const api = axios.create({
  baseURL: COMPETITION_API_BASE,
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

export const competitionApi = {
  // Create
  create: async (formData) => {
    try {
      const res = await api.post('/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return res.data;
    } catch (error) {
      console.error('Error creating competition:', error.response?.data || error.message);
      throw error;
    }
  },

  // Read all
  getAll: async () => {
    try {
      const res = await api.get('/getAll');
      return res.data;
    } catch (error) {
      console.error('Error fetching competitions:', error.response?.data || error.message);
      throw error;
    }
  },

  // Read one
  getById: async (id) => {
    try {
      const res = await api.get(`/${id}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching competition:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update
  update: async (id, formData) => {
    try {
      const res = await api.put(`/edit/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return res.data;
    } catch (error) {
      console.error('Error updating competition:', error.response?.data || error.message);
      throw error;
    }
  },

  // Delete
  delete: async (id) => {
    try {
      const res = await api.delete(`/delete/${id}`);
      return res.data;
    } catch (error) {
      console.error('Error deleting competition:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get file
  getFile: async (filename) => {
    try {
      const res = await api.get(`/files/${filename}`, {
        responseType: 'blob'
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching file:', error.response?.data || error.message);
      throw error;
    }
  }
}; 