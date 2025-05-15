// src/components/OAuth2RedirectHandler.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../api';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    if (token) {
      // Store the token in localStorage
      localStorage.setItem('accessToken', token);
      
      // Fetch current user data if token is present
      const fetchUserData = async () => {
        try {
          const response = await userService.getCurrentUser();
          localStorage.setItem('user', JSON.stringify(response.data));
          // Navigate to dashboard after successful auth
          navigate('/dashboard');
        } catch (err) {
          console.error('Error fetching user data:', err);
          navigate('/login', { 
            state: { error: 'Failed to get user information. Please try again.' }
          });
        }
      };
      
      fetchUserData();
    } else if (error) {
      // Handle authentication error
      console.error('Authentication Error:', error);
      navigate('/login', { 
        state: { error: 'Authentication failed. Please try again.' }
      });
    } else {
      // No token or error provided, redirect to login
      navigate('/login', {
        state: { error: 'Invalid authentication response. Please try again.' }
      });
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-center text-white">
        <div className="animate-spin w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Processing authentication...</p>
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;