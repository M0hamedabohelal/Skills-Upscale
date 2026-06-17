import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import Sidebar from '../Sidebar/Sidebar'; 
import './Product-Driven.css';
import logoOriginal from '../assets/logo/logo-original.png';

const Productdriven = () => {
  const [particles, setParticles] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const y1 = useTransform(scrollY, [0, 500], [0, 80]);
  const y2 = useTransform(scrollY, [0, 500], [0, -80]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const particlesArray = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 30 + 30,
      delay: Math.random() * 5,
    }));
    setParticles(particlesArray);
  }, []);

  const sentence = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.3 } }
  };

  const letter = {
    hidden: { opacity: 0, y: 30, rotateZ: -5 },
    visible: { opacity: 1, y: 0, rotateZ: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
  };

  return (
    <div className="main-container">
      <div className="animated-background">
        <motion.div className="wave wave1" animate={{ backgroundPosition: ['0px 0px', '600px 0px'] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
        <motion.div className="wave wave2" animate={{ backgroundPosition: ['0px 0px', '-600px 0px'] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
      </div>

      <div className="particles-container">
        {particles.map(particle => (
          <motion.div key={particle.id} className="particle"
            animate={{ y: [particle.y, particle.y - 100, particle.y], x: [particle.x, particle.x + Math.sin(particle.id) * 50, particle.x], opacity: [0, 0.6, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: "linear" }}
            style={{ width: `${particle.size}px`, height: `${particle.size}px`, left: `${particle.x}%`, top: `${particle.y}%` }}
          />
        ))}
      </div>

      <motion.div className="bg-blob blob1" style={{ y: y1 }} animate={{ x: [0, 60, -50, 0], scale: [1, 1.05, 0.95, 1] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />
      <motion.div className="bg-blob blob2" style={{ y: y2 }} animate={{ x: [0, -80, 60, 0], scale: [1, 0.95, 1.05, 1] }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }} />

      <motion.div className="mouse-glow" animate={{ x: springX, y: springY }} />

      {/* Navbar */}
      <motion.nav className="navbar navbar-expand-lg px-4 py-3 bg-transparent position-relative navbar-animated" style={{ zIndex: 10 }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="container-fluid">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src={logoOriginal} alt="SkillUpscale" className="navbar-logo" />
          </motion.div>

          <div className="ms-auto d-flex align-items-center gap-2">
            <motion.button onClick={() => navigate('/login')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-link text-dark text-decoration-none fw-bold">Login</motion.button>
            <motion.button onClick={() => navigate('/analyze')} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.93 }} className="btn btn-glow btn-nav">Get Started</motion.button>
            <motion.div className="user-profile-avatar ms-2" onClick={() => setIsSidebarOpen(true)} whileHover={{ scale: 1.1, boxShadow: "0 8px 16px rgba(20, 184, 166, 0.3)" }} whileTap={{ scale: 0.95 }} title="Profile">
              <i className="fa-solid fa-user"></i>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="container text-center mt-4 pt-3 position-relative hero-section" style={{ zIndex: 2 }}>
        <motion.h1 className="hero-title mb-3" variants={sentence} initial="hidden" animate="visible" style={{ opacity }}>
          {"SkillUpscale".split("").map((char, i) => (
            <motion.span key={i} variants={letter}>{char}</motion.span>
          ))}
        </motion.h1>
        
        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }} className="mx-auto mb-4 text-secondary description-text" style={{ maxWidth: '650px', fontWeight: 500, lineHeight: 1.7 }}>
          An integrated platform designed to help students, graduates, and professionals understand and develop their skills to match real job market requirements.
        </motion.p>

        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 1.3, type: "spring", stiffness: 100 }}>
          <motion.button onClick={() => navigate('/analyze')} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.93 }} className="btn btn-glow px-4 py-2 hero-btn">Start Resume Analysis</motion.button>
        </motion.div>
      </div>

      <div className="gradient-line-divider"></div>

      {/* Features Section */}
      <div className="container mt-4 pt-2 pb-5 position-relative features-section" style={{ zIndex: 2 }}>
        <motion.div className="features-header" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <motion.button className="section-btn" onClick={() => navigate('/analyze')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <span className="btn-text">Platform Features</span>
          </motion.button>
        </motion.div>
        
        <div className="row g-3">
          <FeatureCard icon="fa-wand-magic-sparkles" title="CV Analysis" desc="Extract structured data, technical, and soft skills from resumes with high accuracy." delay={1.6} color="#4f46e5" />
          <FeatureCard icon="fa-magnifying-glass-chart" title="Skill Gap Engine" desc="Compare your skills with target job requirements and categorize them with professional accuracy." delay={1.8} color="#14b8a6" />
          <FeatureCard icon="fa-map-location-dot" title="Personalized Roadmap" desc="Generate a personalized learning path to bridge skill gaps based on market demand." delay={2.0} color="#06b6d4" />
        </div>
      </div>

      <motion.div className="scroll-indicator" animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 5v14M19 12l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, delay, color }) => (
  <div className="col-md-4">
    <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay, duration: 0.5, ease: "easeOut" }} whileHover={{ y: -5, transition: { duration: 0.2 } }} className="feature-card h-100">
      <motion.div className="card-icon-box" whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 200 }} style={{ background: `linear-gradient(135deg, ${color}18, ${color}08)` }}>
        <i className={`fas ${icon}`} style={{ color }}></i>
      </motion.div>
      <h4 className="card-title">{title}</h4>
      <p className="card-desc mb-0">{desc}</p>
    </motion.div>
  </div>
);

export default Productdriven;