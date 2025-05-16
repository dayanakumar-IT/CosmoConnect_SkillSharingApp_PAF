import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaRocket, 
  FaTrophy, 
  FaUserAstronaut, 
  FaCompass,
  FaBars,
  FaTimes,
  FaCog,
  FaSignOutAlt,
  FaUser
} from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/feed', icon: <FaHome />, label: 'Feed' },
    { path: '/learning', icon: <FaRocket />, label: 'Learn' },
    { path: '/competitions', icon: <FaTrophy />, label: 'Compete' },
    { path: '/explore', icon: <FaCompass />, label: 'Explore' }
  ];

  const dropdownItems = [
    { path: '/profile', icon: <FaUser />, label: 'View Profile' },
    { path: '/settings', icon: <FaCog />, label: 'Settings' },
    { 
      path: '/login', 
      icon: <FaSignOutAlt />, 
      label: 'Logout',
      onClick: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  
  const styles = {
    starContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '100%',
      overflow: 'hidden',
      zIndex: 0,
      pointerEvents: 'none'
    },
    star: {
      position: 'absolute',
      width: '2px',
      height: '2px',
      backgroundColor: '#fff',
      borderRadius: '50%',
      animation: 'twinkle 1.5s infinite'
    }
  };

  
  const stars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    style: {
      ...styles.star,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`
    }
  }));

  return (
    <nav className="relative bg-space-navy border-b border-space-purple">
      {/* Star effect container */}
      <div style={styles.starContainer}>
        {stars.map(star => (
          <div key={star.id} style={star.style} />
        ))}
      </div>

      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          .nav-link {
            position: relative;
            z-index: 1;
            transition: all 0.3s ease;
          }
          .nav-link:hover {
            transform: translateY(-2px);
          }
          .dropdown-menu {
            animation: slideIn 0.2s ease-out;
          }
          @keyframes slideIn {
            from { transform: translateY(-10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center z-10">
            <Link to="/feed" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-space-purple to-space-blue flex items-center justify-center">
                <FaRocket className="text-white text-lg" />
              </div>
              <span className="text-xl font-orbitron text-white">COSMIC</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 z-10">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link flex items-center px-3 py-2 rounded-lg ${
                  isActive(item.path)
                    ? 'bg-space-purple text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={handleDropdown}
                className="nav-link flex items-center px-3 py-2 rounded-lg text-gray-300 hover:text-white"
              >
                <FaUserAstronaut className="text-xl" />
              </button>

              {showDropdown && (
                <div className="dropdown-menu absolute right-0 mt-2 w-48 rounded-lg bg-space-navy border border-space-purple shadow-lg py-1">
                  {dropdownItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={item.onClick}
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-space-purple hover:text-white"
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden z-10">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-space-navy z-20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg ${
                  isActive(item.path)
                    ? 'bg-space-purple text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            {/* Mobile dropdown items */}
            {dropdownItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (item.onClick) item.onClick();
                  setIsMenuOpen(false);
                }}
                className="flex items-center px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 