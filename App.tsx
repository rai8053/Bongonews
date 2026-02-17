
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Admin from './pages/Admin';
import { CITIES } from './constants';
import { Bot } from 'lucide-react';

const App: React.FC = () => {
  const [currentCity, setCurrentCity] = useState(CITIES[0].id);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
        <Header currentCity={currentCity} setCity={setCurrentCity} />
        
        <main className="flex-1 w-full transition-colors duration-300">
          <Routes>
            <Route path="/" element={<Home currentCity={currentCity} />} />
            <Route path="/news/:id" element={<Detail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Home currentCity={currentCity} />} />
          </Routes>
        </main>

        {/* Desktop Admin Link */}
        <div className="fixed bottom-6 right-6 z-50">
           <a href="#/admin" className="w-12 h-12 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 transition group">
              <span className="absolute right-full mr-3 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">ADMIN</span>
              <Bot className="w-6 h-6" />
           </a>
        </div>
      </div>
    </Router>
  );
};

export default App;