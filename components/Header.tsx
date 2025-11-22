import React, { useState } from 'react';
import { Menu, Search, Moon, Sun, X, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/95 dark:bg-royal-900/90 border-b border-slate-200 dark:border-slate-700 transition-colors duration-300 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Left: Logo & Menu (Hidden if search is open on mobile) */}
        {!isSearchOpen && (
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-royal-700 rounded-full transition-colors md:hidden">
              <Menu className="w-6 h-6 text-royal-600 dark:text-slate-200" />
            </button>
            <Link to="/" className="flex items-center gap-2 group">
               <div className="w-8 h-8 bg-gradient-to-br from-royal-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold font-serif text-xl shadow-lg group-hover:scale-105 transition-transform">
                 ব
               </div>
               <span className="text-2xl font-bold font-serif bg-clip-text text-transparent bg-gradient-to-r from-royal-600 to-purple-600 dark:from-slate-100 dark:to-slate-300 hidden xs:block">
                 বঙ্গ নিউজ
               </span>
            </Link>
          </div>
        )}

        {/* Center/Right: Search Bar */}
        <div className={`flex-1 flex items-center justify-end ${isSearchOpen ? 'w-full' : ''}`}>
          {isSearchOpen ? (
            <form onSubmit={handleSearchSubmit} className="w-full flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-200">
              <input 
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="খবর খুঁজুন (Search News)..."
                className="w-full bg-slate-100 dark:bg-royal-800 border-none rounded-full py-2 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-royal-500 outline-none"
              />
              <button type="submit" className="p-2 bg-royal-600 text-white rounded-full">
                <Search className="w-4 h-4" />
              </button>
              <button 
                type="button" 
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-royal-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          ) : (
            /* Right: Actions */
            <div className="flex items-center gap-1 md:gap-3">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-royal-700 rounded-full text-slate-600 dark:text-slate-300 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <button 
                className="p-2 hover:bg-slate-100 dark:hover:bg-royal-700 rounded-full text-slate-600 dark:text-slate-300 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-royal-900"></span>
              </button>
              
              <button 
                onClick={toggleDarkMode}
                className="p-2 hover:bg-slate-100 dark:hover:bg-royal-700 rounded-full text-slate-600 dark:text-slate-300 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;