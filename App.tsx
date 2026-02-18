
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Admin from './pages/Admin';
import { CITIES } from './constants';

const App: React.FC = () => {
  const [currentCity, setCurrentCity] = useState(CITIES[0].id);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
        <Header currentCity={currentCity} setCity={setCurrentCity} />
        
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Home currentCity={currentCity} />} />
            <Route path="/news/:id" element={<Detail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Home currentCity={currentCity} />} />
          </Routes>
        </main>

        <footer className="py-8 bg-white border-t border-slate-100 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} বঙ্গ নিউজ • সর্বস্বত্ব সংরক্ষিত
          </p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
