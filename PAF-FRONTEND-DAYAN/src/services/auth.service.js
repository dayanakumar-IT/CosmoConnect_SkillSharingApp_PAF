import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

const authService = {
    login: async (credentials) => {
        const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/login`, credentials);
        if (response.data.accessToken) {
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export default authService; 