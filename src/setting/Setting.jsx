import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar'; 
import './Setting.css';
import logoOriginal from '../assets/logo/logo-original.png';

const Setting = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [weeklyInsights, setWeeklyInsights] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  const handleThemeToggle = () => {
    const newThemeState = !isDarkMode;
    setIsDarkMode(newThemeState);
    if (newThemeState) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="settings-container">
      <nav className="navbar navbar-expand-lg px-5 py-4 bg-transparent position-relative" style={{ zIndex: 10 }}>
        <div className="container-fluid align-items-center">
          <div className="d-flex align-items-center gap-4">
            <motion.div 
              className="navbar-brand m-0"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              <img src={logoOriginal} alt="SkillUpscale" className="navbar-logo" />
            </motion.div>
            <span className="dashboard-link d-none d-md-block" onClick={() => navigate('/')}>Dashboard</span>
          </div>
          <div className="ms-auto d-flex align-items-center gap-3">
            <motion.div className="user-profile-avatar" onClick={() => setIsSidebarOpen(true)} whileHover={{ scale: 1.1, boxShadow: "0 8px 16px rgba(20, 184, 166, 0.3)" }} whileTap={{ scale: 0.95 }}>
              <i className="fa-solid fa-user"></i>
            </motion.div>
          </div>
        </div>
      </nav>

      <div className="container pb-5 settings-content">
        <motion.div className="settings-header mb-5" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1>Settings</h1>
          <p>Manage your account preferences and secure your digital learning workspace.</p>
        </motion.div>

        <div className="settings-cards-wrapper">
          <motion.div className="settings-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
            <div className="profile-header-sec">
              <div className="profile-avatar-large"><i className="fa-solid fa-user"></i><div className="edit-avatar-btn"><i className="fa-solid fa-pen"></i></div></div>
              <div className="profile-title-sec"><h5>Profile Identity</h5><p>This information is visible to mentors and peers.</p></div>
            </div>
            <div className="row g-4 mt-2">
              <div className="col-md-6"><div className="settings-form-group"><label>FULL NAME</label><input type="text" defaultValue="Alexander Sterling" /></div></div>
              <div className="col-md-6"><div className="settings-form-group"><label>EMAIL ADDRESS</label><input type="email" defaultValue="alex.sterling@architects.io" /></div></div>
              <div className="col-12"><div className="settings-form-group"><label>PROFESSIONAL HEADLINE</label><input type="text" defaultValue="Senior Cloud Architect & Digital Experience Designer" /></div></div>
            </div>
          </motion.div>

          <motion.div className="settings-section mt-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <div className="section-title"><i className="fa-solid fa-sliders"></i><h4>Experience Preferences</h4></div>
            <div className="preference-list">
              <div className="preference-item">
                <div className="pref-info"><i className="fa-regular fa-moon"></i><div><h6>Dark Mode</h6><p>Switch to a darker interface for low-light environments.</p></div></div>
                <label className="toggle-switch"><input type="checkbox" checked={isDarkMode} onChange={handleThemeToggle} /><span className="slider"></span></label>
              </div>
              <div className="preference-item">
                <div className="pref-info"><i className="fa-regular fa-envelope"></i><div><h6>Email Notifications</h6><p>Receive alerts about new course content and messages.</p></div></div>
                <label className="toggle-switch"><input type="checkbox" checked={emailNotifs} onChange={() => setEmailNotifs(!emailNotifs)} /><span className="slider"></span></label>
              </div>
              <div className="preference-item">
                <div className="pref-info"><i className="fa-solid fa-chart-line"></i><div><h6>Weekly Career Insights</h6><p>Personalized growth metrics and industry trends.</p></div></div>
                <label className="toggle-switch"><input type="checkbox" checked={weeklyInsights} onChange={() => setWeeklyInsights(!weeklyInsights)} /><span className="slider"></span></label>
              </div>
            </div>
          </motion.div>

          <motion.div className="settings-card mt-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
            <div className="section-title mb-4"><i className="fa-solid fa-shield-halved"></i><h4>Security & Access</h4></div>
            <div className="row g-4">
              <div className="col-md-6"><div className="settings-form-group"><label>CURRENT PASSWORD</label><input type="password" defaultValue="12345678" /></div></div>
              <div className="col-md-6"><div className="settings-form-group"><label>NEW PASSWORD</label><input type="password" placeholder="Min. 12 characters" /></div></div>
            </div>
            <div className="settings-divider"></div>
            <div className="security-actions">
              <button className="btn-update-security">Update Account Security</button>
              <button className="btn-delete-account"><i className="fa-solid fa-trash-can"></i> Delete Account</button>
            </div>
          </motion.div>
        </div>
      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
};

export default Setting;