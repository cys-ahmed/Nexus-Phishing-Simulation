import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Target, Send } from 'lucide-react';
import logo from './assets/Application_Logo.png';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import Targets from './pages/Targets';

function App() {
    return (
        <Router>
            <div className="app-container">
                <aside className="sidebar">
                    <div className="brand">
                        <img src={logo} alt="Nexus Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                        <span>Nexus Phishing</span>
                    </div>
                    <nav>
                        <Link to="/" className="nav-item">
                            <LayoutDashboard size={20} />
                            Overview
                        </Link>
                        <Link to="/campaigns" className="nav-item">
                            <Send size={20} />
                            Campaigns
                        </Link>
                        <Link to="/targets" className="nav-item">
                            <Target size={20} />
                            Targets
                        </Link>
                    </nav>
                </aside>

                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/campaigns" element={<Campaigns />} />
                        <Route path="/targets" element={<Targets />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
