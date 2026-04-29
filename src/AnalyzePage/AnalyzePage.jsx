import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar'; // استدعاء السايد بار
import './AnalyzePage.css';

const AnalyzePage = () => {
  const [cvFile, setCvFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // حالة السايد بار
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
    }
  };

  const handleDragDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setCvFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!cvFile || !jobTitle) {
      alert('Please upload your CV and enter your target job title');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Analyzing your resume...');
    }, 2000);
  };

  return (
    <div className="analyze-container">
      {/* Navbar */}
      <motion.nav 
        className="navbar navbar-expand-lg px-5 py-4 bg-transparent position-relative navbar-analyze" 
        style={{ zIndex: 10 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container-fluid">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2, duration: 0.6 }} 
            className="navbar-brand fw-bolder fs-4"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <span className="bg-teal text-white rounded-3 px-3 py-2 me-2 fw-bold">S</span>
            <span>SkillUpscale</span>
          </motion.div>
          <div className="ms-auto d-flex align-items-center gap-3">
            <motion.button 
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-link text-dark text-decoration-none fw-bold"
            >
              Sign In
            </motion.button>

            {/* أيقونة اليوزر المضافة جديد */}
            <motion.div 
              className="user-profile-avatar ms-2"
              onClick={() => setIsSidebarOpen(true)} // فتح السايد بار عند الضغط
              whileHover={{ scale: 1.1, boxShadow: "0 8px 16px rgba(20, 184, 166, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              title="Profile"
            >
              <i className="fa-solid fa-user"></i>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.div 
        className="analyze-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h1 className="analyze-title">SkillsUpscale</h1>
        <p className="analyze-subtitle">
          Analyze your CV, match your dream job, and grow with a clear roadmap.
        </p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-analyze-primary"
        >
          Get Started
        </motion.button>
        <p className="analyze-link">
          <a href="#signup">Sign up for more features</a>
        </p>
      </motion.div>

      {/* Main Form Section */}
      <motion.div 
        className="analyze-form-section"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="container-mo">
          <div className="form-card">
            <div className="row g-4">
              {/* CV Upload */}
              <div className="col-lg-6">
                <div className="form-group">
                  <label className="form-label">Resume File</label>
                  <motion.div 
                    className={`upload-area ${cvFile ? 'has-file' : ''}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDragDrop}
                    whileHover={{ borderColor: '#00BCD4' }}
                  >
                    <input 
                      type="file" 
                      id="cvInput" 
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx"
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="cvInput" className="upload-label">
                      <div className="upload-icon">
                        <i className="fa-solid fa-file-pdf"></i>
                      </div>
                      <div className="upload-text">
                        <p className="upload-title">
                          {cvFile ? cvFile.name : 'Upload Your Resume'}
                        </p>
                        <p className="upload-subtitle">or drag and drop</p>
                      </div>
                    </label>
                  </motion.div>
                </div>
              </div>

              {/* Job Title Input */}
              <div className="col-lg-6">
                <div className="form-group">
                  <label className="form-label">Target Job Title</label>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <input 
                      type="text"
                      className="form-control job-input"
                      placeholder="e.g. Frontend Developer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                    <p className="form-hint">
                      We'll use your target role to generate a custom skill gap analysis and growth plan.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Analyze Button */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAnalyze}
              disabled={isLoading}
              className="btn btn-analyze-submit"
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze Now
                  <i className="fa-solid fa-arrow-right ms-2"></i>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div 
        className="analyze-features"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <motion.div className="feature-item" whileHover={{ y: -5 }}>
                <div className="feature-icon">
                  <i className="fa-solid fa-bolt-lightning"></i>
                </div>
                <h3>Fast Analysis</h3>
                <p>Instant resume analysis and high-accuracy skill extraction</p>
              </motion.div>
            </div>
            <div className="col-md-4">
              <motion.div className="feature-item" whileHover={{ y: -5 }}>
                <div className="feature-icon">
                  <i className="fa-solid fa-chart-line"></i>
                </div>
                <h3>Smart Matching</h3>
                <p>Compare your skills with job requirements in detail</p>
              </motion.div>
            </div>
            <div className="col-md-4">
              <motion.div className="feature-item" whileHover={{ y: -5 }}>
                <div className="feature-icon">
                  <i className="fa-solid fa-chart-simple"></i>
                </div>
                <h3>Custom Roadmap</h3>
                <p>Get a personalized learning path to bridge skill gaps</p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* مكون السايد بار المضاف في آخر الصفحة */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
};

export default AnalyzePage;