import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { useNotifications } from '../contexts/NotificationContext';
import NotificationDropdown from './NotificationDropdown';

const NotificationBell = () => {
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="relative focus:outline-none"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
      >
        <FaBell className="text-2xl text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
            {unreadCount}
          </span>
        )}
      </button>
      {open && <NotificationDropdown onClose={() => setOpen(false)} />}
    </div>
  );
};

export default NotificationBell; 