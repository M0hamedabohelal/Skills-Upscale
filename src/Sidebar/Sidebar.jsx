import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // التحقق من الدارك مود أول ما الـ Sidebar يفتح
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  // دالة تبديل الدارك مود
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div 
            className="sidebar-container"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="sidebar-header">
              <div className="sidebar-user-card">
                <div className="sidebar-avatar-wrapper">
                  <div className="sidebar-avatar">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <span className="status-dot"></span>
                </div>
                <div className="sidebar-user-info">
                  <h5>Alex Architect</h5>
                  <p>alex.architect@skillupscale.com</p>
                </div>
              </div>
            </div>

            <div className="sidebar-menu">
              <div className="menu-item" onClick={() => handleNavigation('/')}>
                <i className="fa-solid fa-house"></i>
                <span>Home</span>
              </div>
              
              <div className="menu-item" onClick={() => handleNavigation('/analyze')}>
                <i className="fa-solid fa-bolt-lightning"></i>
                <span>Get Started</span>
              </div>

              {/* 👈 زرار الـ Dashboard الجديد المضاف هنا */}
              <div className="menu-item" onClick={() => handleNavigation('/dashboard')}>
                <i className="fa-solid fa-chart-pie"></i>
                <span>Dashboard</span>
              </div>

              <div className="menu-item" onClick={toggleTheme}>
                <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </div>

              <div className="menu-item" onClick={() => handleNavigation('/settings')}>
                <i className="fa-solid fa-gear"></i>
                <span>Settings</span>
              </div>
            </div>

            <div className="sidebar-footer">
              <button className="btn-logout" onClick={() => handleNavigation('/login')}>
                <span>Logout</span>
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
              </button>
              <p className="version-text">SKILLSUPSCALE PRO V2.4</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;