import React, { useEffect, useState } from 'react';
import { getBookmarkedNews } from '../services/storageService';
import { NewsItem } from '../types';
import NewsCard from '../components/NewsCard';
import { Bookmark, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Bookmarks: React.FC = () => {
  const [savedNews, setSavedNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    // Load bookmarks on mount. 
    // In a real app with Redux/Context, this would sync automatically. 
    // Here we fetch on mount.
    setSavedNews(getBookmarkedNews());
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-royal-900 pb-20">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="p-3 bg-bengal-100 dark:bg-royal-800 rounded-full text-bengal-600 dark:text-bengal-500">
            <Bookmark className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
              সংরক্ষিত খবর
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your Saved Articles
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {savedNews.length > 0 ? (
            savedNews.map(item => (
              <NewsCard key={item.id} item={item} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500 text-center">
              <BookOpen className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium mb-2">কোনো খবর সংরক্ষিত নেই</p>
              <p className="text-sm max-w-xs mx-auto mb-6">
                খবর পড়ার সময় "Bookmark" আইকনে ক্লিক করে এখানে সেভ করে রাখুন।
              </p>
              <Link 
                to="/" 
                className="px-6 py-2 bg-royal-600 text-white rounded-full font-bold text-sm hover:bg-royal-700 transition"
              >
                খবর পড়ুন
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;