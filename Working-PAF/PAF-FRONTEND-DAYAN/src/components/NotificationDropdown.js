import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = ({ onClose }) => {
  const { notifications, markAsRead, loading } = useNotifications();
  const navigate = useNavigate();

  const handleClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
      onClose && onClose();
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
      <div className="p-3 border-b font-bold text-gray-800">Notifications</div>
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : notifications.map((n) => (
          <div
            key={n.id}
            className={`px-4 py-3 cursor-pointer hover:bg-gray-100 border-b last:border-b-0 ${n.isRead ? 'text-gray-500 bg-gray-50' : 'text-gray-900 bg-white font-semibold'}`}
            onClick={() => handleClick(n)}
          >
            <div>{n.message}</div>
            <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
      <button className="w-full py-2 text-sm text-blue-600 hover:underline" onClick={onClose}>Close</button>
    </div>
  );
};

export default NotificationDropdown; 