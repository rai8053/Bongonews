
import React from 'react';
import { MapPin, ChevronDown, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { CITIES } from '../constants';

interface HeaderProps {
  currentCity: string;
  setCity: (cityId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentCity, setCity }) => {
  const location = useLocation();
  const city = CITIES.find(c => c.id === currentCity) || CITIES[0];

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900 text-white border-b border-slate-800 shadow-xl font-bengali">
      <div className="max-w-screen-md mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-indigo-500/20 shadow-lg group-hover:scale-105 transition-transform">
            ব
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tighter leading-none">বঙ্গ নিউজ</span>
            </div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">লাইভ আপডেট</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-slate-700 transition border border-white/5">
              <MapPin className="w-3 h-3 text-indigo-400" />
              {city.name}
              <ChevronDown className="w-3 h-3 opacity-50" />
            </button>
            <div className="absolute top-full right-0 mt-2 w-48 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 z-50">
              {CITIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCity(c.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 ${currentCity === c.id ? 'text-indigo-600 bg-indigo-50' : ''}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          
          <Link 
            to="/admin" 
            className={`p-2 rounded-full border border-white/5 transition ${location.pathname === '/admin' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
