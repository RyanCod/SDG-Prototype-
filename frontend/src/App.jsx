import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Leaf, Activity, Cpu, Globe, Moon, Sun } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import HardwareHub from './pages/HardwareHub';
import GlobalImpact from './pages/GlobalImpact';
import './index.css';

function App() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
      <div className="app-container">
        {/* Top Navigation Bar */}
        <nav className="nav-bar">
          <div className="nav-brand">
            <Leaf color="var(--accent-success)" size={32} />
            EcoTwin K-12
          </div>
          
          <div className="nav-links">
            <NavLink 
              to="/" 
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              <Activity size={18} />
              Live Dashboard
            </NavLink>
            <NavLink 
              to="/hardware" 
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              <Cpu size={18} />
              Hardware Hub
            </NavLink>
            <NavLink 
              to="/global" 
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              <Globe size={18} />
              Around the World
            </NavLink>
            
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </nav>

        {/* Page Content */}
        <Routes>
          <Route path="/" element={<Dashboard theme={theme} />} />
          <Route path="/hardware" element={<HardwareHub />} />
          <Route path="/global" element={<GlobalImpact theme={theme} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
