import  { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './Dashboard.css';
import logoOriginal from '../assets/logo/logo-original.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSkillTab, setActiveSkillTab] = useState('all');

  // الداتا الافتراضية (Fallback) بنفس الهيكل الجديد بالظبط عشان الصفحة ماتضربش لو فتحتها مباشر
  const fallbackData = {
    output: {
      job_optimization: { suggested_title: "Frontend Engineer", match_score: 85 },
      cv_analysis: {
        keywords: { found: ["React", "JavaScript", "HTML/CSS"], missing: [], neutral: [], to_remove: [] },
        skills: {
          found: ["React", "JavaScript", "System Design"],
          missing: ["TypeScript", "Docker", "GraphQL"],
          neutral: ["Frontend", "HTML/CSS"],
          to_remove: ["jQuery", "Legacy Code"]
        }
      },
      ats_enhancements: ["Add quantifiable metrics"],
      learning_resources: [
        { skill: "TypeScript Basics", priority: "High", youtube_url: "https://youtube.com", udemy_url: "https://udemy.com", coursera_url: "" },
        { skill: "Docker for Frontend", priority: "Medium", youtube_url: "", udemy_url: "https://udemy.com", coursera_url: "https://coursera.org" }
      ],
      jobs: [
        { job_title: "Senior Frontend Engineer", score: 95, url: "#" },
        { job_title: "Full Stack Developer", score: 88, url: "#" }
      ]
    }
  };

  const apiData = location.state?.analysisData?.output || fallbackData.output;
  const { job_optimization, cv_analysis, learning_resources, jobs, ats_enhancements } = apiData;

  return (
    <div className="dashboard-container">
      {/* Navbar */}
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
            <span className="dashboard-link active d-none d-md-block">Dashboard</span>
          </div>
          
          <div className="ms-auto d-flex align-items-center gap-3">
            <motion.div className="user-profile-avatar" onClick={() => setIsSidebarOpen(true)} whileHover={{ scale: 1.1, boxShadow: "0 8px 16px rgba(20, 184, 166, 0.3)" }} whileTap={{ scale: 0.95 }}>
              <i className="fa-solid fa-user"></i>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container pb-5 dashboard-content">
        
        <motion.div className="dashboard-header mb-5" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1>{job_optimization?.suggested_title || "Job Target"}</h1>
          <p>Analyze your learning trajectory and connect with opportunities tailored to your evolving skillset.</p>
        </motion.div>

        {/* 1. Skills Analysis (Keywords) */}
        <motion.div className="dash-card mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="card-title-sec mb-4">
            <i className="fa-regular fa-folder-open"></i>
            <h4>Acquired Keywords</h4>
          </div>
          <div className="analysis-box">
            <div className="box-title mb-3">
              <i className="fa-solid fa-circle-check text-teal me-2"></i>
              <span className="fw-bold" style={{color: '#3b82f6'}}>Keywords Found in CV</span>
            </div>
            <div className="pills-container">
              {cv_analysis?.keywords?.found?.length > 0 ? (
                cv_analysis.keywords.found.map((keyword, idx) => (
                  <span key={idx} className="skill-pill normal-pill">{keyword}</span>
                ))
              ) : (<span className="text-muted">No keywords detected.</span>)}
            </div>
          </div>
        </motion.div>

        {/* 2. Skills Breakdown (Tabs View) */}
        <motion.div className="dash-card mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="card-title-sec d-flex justify-content-between align-items-center w-100 flex-wrap gap-3 mb-4">
            <div className="d-flex align-items-center gap-2">
              <i className="fa-solid fa-layer-group"></i>
              <h4 className="m-0">Skills Breakdown</h4>
            </div>
          </div>

          <div className="skills-tabs-container mb-4">
            <button className={`skill-tab-btn ${activeSkillTab === 'all' ? 'active' : ''}`} onClick={() => setActiveSkillTab('all')}>All Skills</button>
            <button className={`skill-tab-btn tab-present ${activeSkillTab === 'present' ? 'active' : ''}`} onClick={() => setActiveSkillTab('present')}><span className="dot dot-present"></span> Present</button>
            <button className={`skill-tab-btn tab-missing ${activeSkillTab === 'missing' ? 'active' : ''}`} onClick={() => setActiveSkillTab('missing')}><span className="dot dot-missing"></span> Missing</button>
            <button className={`skill-tab-btn tab-normal ${activeSkillTab === 'normal' ? 'active' : ''}`} onClick={() => setActiveSkillTab('normal')}><span className="dot dot-normal"></span> Normal</button>
            <button className={`skill-tab-btn tab-remove ${activeSkillTab === 'remove' ? 'active' : ''}`} onClick={() => setActiveSkillTab('remove')}><span className="dot dot-remove"></span> To Remove</button>
          </div>

          <div className="skills-grid-content">
            <AnimatePresence mode="popLayout">
              {(activeSkillTab === 'all' || activeSkillTab === 'present') && (
                <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} className="skill-category-group">
                  {activeSkillTab === 'all' && <h6 className="category-title text-present">Present Skills (Found)</h6>}
                  <div className="pills-container">
                    {cv_analysis?.skills?.found?.map((skill, idx) => (<span key={`p-${idx}`} className="skill-badge badge-present"><i className="fa-solid fa-check me-2"></i>{skill}</span>))}
                  </div>
                </motion.div>
              )}
              {(activeSkillTab === 'all' || activeSkillTab === 'missing') && (
                <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} className={`skill-category-group ${activeSkillTab === 'all' ? 'mt-3' : ''}`}>
                  {activeSkillTab === 'all' && <h6 className="category-title text-missing">Missing Skills (To Learn)</h6>}
                  <div className="pills-container">
                    {cv_analysis?.skills?.missing?.map((skill, idx) => (<span key={`m-${idx}`} className="skill-badge badge-missing"><i className="fa-solid fa-plus me-2"></i>{skill}</span>))}
                  </div>
                </motion.div>
              )}
              {(activeSkillTab === 'all' || activeSkillTab === 'normal') && (
                <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} className={`skill-category-group ${activeSkillTab === 'all' ? 'mt-3' : ''}`}>
                  {activeSkillTab === 'all' && <h6 className="category-title text-normal">Normal Skills (Neutral)</h6>}
                  <div className="pills-container">
                    {cv_analysis?.skills?.neutral?.map((skill, idx) => (<span key={`n-${idx}`} className="skill-badge badge-normal"><i className="fa-solid fa-minus me-2"></i>{skill}</span>))}
                  </div>
                </motion.div>
              )}
              {(activeSkillTab === 'all' || activeSkillTab === 'remove') && (
                <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} className={`skill-category-group ${activeSkillTab === 'all' ? 'mt-3' : ''}`}>
                  {activeSkillTab === 'all' && <h6 className="category-title text-remove">Skills to Remove</h6>}
                  <div className="pills-container">
                    {cv_analysis?.skills?.to_remove?.map((skill, idx) => (<span key={`r-${idx}`} className="skill-badge badge-remove"><i className="fa-solid fa-xmark me-2"></i>{skill}</span>))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* 3. Job Matches & Learning Path */}
        <div className="row g-4 mb-4">
          
          {/* Top Jobs */}
          <div className="col-lg-6">
            <motion.div className="dash-card h-100" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className="card-title-sec mb-4">
                <i className="fa-solid fa-briefcase"></i>
                <h4>Top Job Matches</h4>
              </div>
              {jobs?.map((job, idx) => (
                <div key={idx} className="job-item">
                  <div>
                    <h6>{job.job_title}</h6>
                    <a href={job.url} target="_blank" rel="noreferrer" style={{fontSize: '0.8rem', color: '#14b8a6', textDecoration: 'none', fontWeight: 'bold'}}>
                      View Job Details <i className="fa-solid fa-arrow-up-right-from-square ms-1"></i>
                    </a>
                  </div>
                  <div className={`match-score ${job.score >= 90 ? 'high' : job.score >= 80 ? 'medium' : 'low'}`}>{job.score}%</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Learning Path */}
          <div className="col-lg-6">
            <motion.div className="dash-card h-100" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <div className="card-title-sec mb-4">
                <i className="fa-solid fa-road"></i>
                <h4>Learning Path</h4>
              </div>
              <div className="timeline">
                {learning_resources?.map((item, idx) => (
                  <div key={idx} className="timeline-item in-progress">
                    <div className="tl-icon"><i className="fa-solid fa-book"></i></div>
                    <div className="tl-content">
                      <h6>{item.skill}</h6>
                      <p className="mb-2">Priority: <span className="fw-bold">{item.priority}</span></p>
                      
                      {/* روابط الكورسات (بتظهر بس لو راجع فيها لينك) */}
                      <div className="d-flex flex-wrap gap-2 mt-1">
                        {item.youtube_url && (
                          <a href={item.youtube_url} target="_blank" rel="noreferrer" className="badge bg-danger text-white text-decoration-none p-2">
                            <i className="fa-brands fa-youtube me-1"></i> YouTube
                          </a>
                        )}
                        {item.udemy_url && (
                          <a href={item.udemy_url} target="_blank" rel="noreferrer" className="badge text-white text-decoration-none p-2" style={{backgroundColor: '#a435f0'}}>
                            Udemy
                          </a>
                        )}
                        {item.coursera_url && (
                          <a href={item.coursera_url} target="_blank" rel="noreferrer" className="badge bg-primary text-white text-decoration-none p-2">
                            Coursera
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>

        {/* 4. ATS Enhancements (قسم إضافي صغير للنصائح) */}
        {ats_enhancements?.length > 0 && (
          <motion.div className="dash-card mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="card-title-sec mb-3">
              <i className="fa-solid fa-file-signature text-warning"></i>
              <h4 className="m-0">ATS Enhancements</h4>
            </div>
            <ul className="list-group list-group-flush border-0">
              {ats_enhancements.map((tip, idx) => (
                <li key={idx} className="list-group-item bg-transparent px-0 border-0 d-flex gap-2 align-items-start">
                  <i className="fa-solid fa-circle-arrow-right text-warning mt-1"></i>
                  <span style={{ color: '#475569', fontWeight: 500 }}>{tip}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
};

export default Dashboard;