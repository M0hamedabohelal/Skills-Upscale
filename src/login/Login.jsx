import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(false); 
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="row g-0 h-100">
        
        {/* Left Side - Blue Gradient Background */}
        <div className="col-lg-6 d-none d-lg-flex auth-left">
          <div className="auth-left-content">
            
            {/* اللوجو مع أنيميشن الدخول والـ Hover */}
            <motion.div 
              className="auth-logo"
              onClick={() => navigate('/')}
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 10, delay: 0.1 }}
              whileHover={{ 
                scale: 1.08, 
                textShadow: "0px 0px 12px rgba(255, 255, 255, 0.8)",
                y: -3
              }}
              whileTap={{ scale: 0.95 }}
              style={{ cursor: 'pointer' }}
            >
              SkillsUpscale
            </motion.div>

            <motion.div 
              className="auth-hero-text"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h1>Build your career with AI</h1>
              <p>
                Unlock your potential with architect-designed learning paths enhanced by artificial intelligence. Upscale your skills and secure your future in the digital era.
              </p>
            </motion.div>

            {/* AI Progress Tracking Card */}
            <motion.div 
              className="auth-floating-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: 1, 
                y: [0, -10, 0] 
              }}
              transition={{ 
                opacity: { delay: 0.4, duration: 0.8 },
                y: { repeat: Infinity, duration: 4, ease: "easeInOut" } 
              }}
            >
              <div className="card-header-icon">
                <motion.div 
                  className="icon-circle"
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.5 }}
                >
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                </motion.div>
                <div className="card-text">
                  <h6>AI Progress Tracking</h6>
                  <span>Dynamic skill mapping active</span>
                </div>
              </div>
              <div className="progress-bar-container">
                <motion.div 
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                ></motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="col-lg-6 auth-right">
          <motion.div 
            className="auth-form-card"
            layout 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Tabs */}
            <div className="auth-tabs">
              <div 
                className={`auth-tab ${!isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </div>
              <div 
                className={`auth-tab ${isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </div>
            </div>

            {/* Form */}
            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div 
                    className="form-group"
                    layout
                    initial={{ opacity: 0, x: 20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label>FULL NAME</label>
                    <input type="text" placeholder="John Architect" />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div 
                className="form-group" layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <label>EMAIL</label>
                <input type="email" placeholder="john@example.com" />
              </motion.div>

              <motion.div 
                className="form-group" layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <label>PASSWORD</label>
                <input type="password" placeholder="••••••••" />
              </motion.div>

              <motion.button 
                layout
                className="btn-auth-submit"
                whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(0, 212, 200, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {isLogin ? 'Login' : 'Sign Up'}
              </motion.button>

              <motion.div 
                layout className="auth-divider"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              >
                <span>OR</span>
              </motion.div>

              <motion.button 
                layout
                className="btn-auth-google"
                whileHover={{ backgroundColor: '#f8f9fa', y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" />
                Continue with Google
              </motion.button>
            </form>

            <motion.div 
              layout className="auth-footer"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Sign Up' : 'Log in'}
              </span>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Login;