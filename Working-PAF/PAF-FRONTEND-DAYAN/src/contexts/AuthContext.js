import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    console.log('Initial token:', token); // Debug log
    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      console.log('Fetching user data...'); // Debug log
      const response = await userService.getCurrentUser();
      console.log('User data response:', response.data); // Debug log
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      console.log('Logging in with credentials:', credentials); // Debug log
      const response = await userService.login(credentials);
      console.log('Login response:', response.data); // Debug log
      localStorage.setItem('accessToken', response.data.token);
      await fetchUserData();
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await userService.signup(userData);
      localStorage.setItem('accessToken', response.data.token);
      await fetchUserData();
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out...'); // Debug log
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Debug log for user state changes
  useEffect(() => {
    console.log('User state updated:', user);
  }, [user]);

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.email === 'admin@gmail.com'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 