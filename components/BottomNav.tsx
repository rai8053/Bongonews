import React from 'react';
import { Home, Bookmark, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: Home, label: 'হোম', path: '/' },
    { icon: Bookmark, label: 'সংরক্ষিত', path: '/bookmarks' },
    { icon: User, label: 'প্রোফাইল', path: '/about' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-royal-900 border-t border-slate-200 dark:border-slate-800 pb-safe pt-2 px-6 flex justify-between items-center z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <Link 
          key={item.path} 
          to={item.path}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${isActive(item.path) ? 'text-royal-600 dark:text-bengal-500' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <item.icon className={`w-6 h-6 ${isActive(item.path) ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;