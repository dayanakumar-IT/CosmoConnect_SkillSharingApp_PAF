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
    } else {
      console.warn('No access token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
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
    try {
      const response = await api.get('/users/me');
      console.log('Current user:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },
  
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  updateProfile: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  updateProfilePhoto: async (userId, photoFile) => {
    try {
      const formData = new FormData();
      formData.append('photo', photoFile);
      const response = await api.put(`/users/${userId}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response;
    } catch (error) {
      console.error('Error updating profile photo:', error);
      throw error;
    }
  },

  // Post-related functions
  createPostMultipart: async (formData) => {
    try {
      console.log('Creating post with formData:', formData);
      const response = await api.post('/posts/multipart', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Post creation response:', response.data);
      return response;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  getFeedPosts: async () => {
    try {
      console.log('Fetching feed posts...');
      const response = await api.get('/posts/feed');
      console.log('Feed posts response:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching feed posts:', error);
      throw error;
    }
  },

  getPublicPosts: async () => {
    try {
      console.log('Fetching public posts...');
      const response = await api.get('/posts/public');
      console.log('Public posts response:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching public posts:', error);
      throw error;
    }
  },

  getUserPosts: async (userId) => {
    try {
      const response = await api.get(`/posts/user/${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      throw error;
    }
  },

  deletePost: async (postId) => {
    try {
      const response = await api.delete(`/posts/${postId}`);
      return response;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  updatePostMultipart: async (postId, formData) => {
    try {
      const response = await api.put(`/posts/${postId}/multipart`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  likePost: async (postId) => {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  unlikePost: async (postId) => {
    try {
      const response = await api.post(`/posts/${postId}/unlike`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export const commentService = {
  getComments: async (postId) => {
    try {
      const response = await api.get(`/comments/post/${postId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  addComment: async (postId, content) => {
    try {
      const response = await api.post('/comments', { postId, content });
      return response;
    } catch (error) {
      throw error;
    }
  },
  editComment: async (commentId, content) => {
    try {
      const response = await api.put(`/comments/${commentId}`, { content });
      return response;
    } catch (error) {
      throw error;
    }
  },
  deleteComment: async (commentId) => {
    try {
      const response = await api.delete(`/comments/${commentId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  likeComment: async (commentId) => {
    try {
      const response = await api.post(`/comments/${commentId}/like`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  unlikeComment: async (commentId) => {
    try {
      const response = await api.post(`/comments/${commentId}/unlike`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export const userApi = {
  getAll: async () => api.get('/users'),
  follow: async (id) => api.post(`/users/${id}/follow`),
  unfollow: async (id) => api.post(`/users/${id}/unfollow`),
  getFollowers: async (id) => api.get(`/users/${id}/followers`),
  getFollowing: async (id) => api.get(`/users/${id}/following`),
};

export default api;