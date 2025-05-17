import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      console.log('NotificationContext: No user, not fetching notifications');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      console.log('NotificationContext: Fetching notifications for user:', user);
      const res = await axios.get('http://localhost:8080/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('NotificationContext: Notifications response:', res.data);
      setNotifications(res.data);
    } catch (e) {
      console.error('NotificationContext: Error fetching notifications', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(`http://localhost:8080/api/notifications/mark-read/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications((prev) => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (e) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchNotifications();
    }
  }, [authLoading, user, fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, fetchNotifications, markAsRead, loading }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext); 