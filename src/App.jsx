import React, { useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import "@fortawesome/fontawesome-free/css/all.min.css"
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Productdriven from "./Product-Driven/Product-Driven"
import AnalyzePage from "./AnalyzePage/AnalyzePage"
import Login from "./login/Login"

function App() {
  // الكود ده بيشتغل أول ما الموقع يفتح في أي صفحة عشان يطبق الدارك مود لو محفوظ
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Productdriven />} />
        <Route path="/analyze" element={<AnalyzePage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App