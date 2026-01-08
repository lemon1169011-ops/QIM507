import React from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Module1 from './pages/Module1';
import Module2 from './pages/Module2';
import Module3 from './pages/Module3';
import Assessment from './pages/Assessment';
import ProPitch from './pages/ProPitch';
import QiMingChat from './components/QiMingChat';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow pb-24 lg:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/module1" element={<Module1 />} />
            <Route path="/module2" element={<Module2 />} />
            <Route path="/module3" element={<Module3 />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/pro" element={<ProPitch />} />
          </Routes>
        </main>
        
        <QiMingChat />
        
        <footer className="glass-card py-6 text-center text-sm text-gray-400 mt-auto border-t border-white/5">
          <p>© 2024 MindPlanet Project | SDG 3: Good Health and Well-being</p>
        </footer>
      </div>
    </HashRouter>
  );
};

const Navigation: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: 'fa-home' },
    { path: '/module1', label: 'Weather', icon: 'fa-cloud-sun' },
    { path: '/module2', label: 'Toolbox', icon: 'fa-toolbox' },
    { path: '/module3', label: 'Support', icon: 'fa-users' },
    { path: '/assessment', label: 'Quiz', icon: 'fa-check-circle' },
    { path: '/pro', label: 'Pro', icon: 'fa-star' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-card px-4 py-3 flex justify-between items-center shadow-lg lg:px-20 border-b border-white/10">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 animate-pulse planet-glow"></div>
        <span className="font-bold text-lg text-white tracking-wider">MindPlanet</span>
      </Link>
      
      <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`transition-all hover:text-cyan-300 ${isActive(item.path) ? 'text-cyan-400 font-bold border-b-2 border-cyan-400' : 'text-gray-300'}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-card flex justify-around py-3 border-t border-white/10 px-2 rounded-t-2xl z-50">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 ${isActive(item.path) ? 'text-cyan-400' : 'text-gray-400'}`}
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span className="text-[10px]">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default App;