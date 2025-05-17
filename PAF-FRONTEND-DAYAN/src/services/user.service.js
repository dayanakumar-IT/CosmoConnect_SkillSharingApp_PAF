import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

const userService = {
    getCurrentUser: async () => {
        const response = await axios.get(`${API_CONFIG.BASE_URL}/users/me`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    updateProfile: async (userId, userData) => {
        const response = await axios.put(
            `${API_CONFIG.BASE_URL}/users/${userId}`,
            userData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return response.data;
    },

    updateProfilePhoto: async (userId, photoFile) => {
        const formData = new FormData();
        formData.append('photo', photoFile);

        const response = await axios.put(
            `${API_CONFIG.BASE_URL}/users/${userId}/photo`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    },

    deleteProfile: async (userId) => {
        await axios.delete(`${API_CONFIG.BASE_URL}/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    }
};

export default userService; 