
import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../constants';
import { getNews } from '../services/storageService';
import { NewsItem, Category } from '../types';
import NewsCard from '../components/NewsCard';
import AdBanner from '../components/AdBanner';
import { MapPin, RefreshCw, Navigation, Flame, Server } from 'lucide-react';

const Home: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Load news
  useEffect(() => {
    document.title = "BongoNews - Home"; // Reset Title
    loadNews();
  }, []);

  const loadNews = async () => {
    const allNews = await getNews();
    setNews(allNews.sort((a, b) => b.createdAt - a.createdAt));
  };

  // Function to handle "My Area" click
  const handleLocationRequest = () => {
    if (activeCategory === Category.MY_AREA && userLocation) return; // Already set

    setActiveCategory(Category.MY_AREA);
    setLocationLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setTimeout(() => {
            setUserLocation('Kolkata'); 
            setLocationLoading(false);
          }, 1500);
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Unable to retrieve location. Showing all local news.");
          setUserLocation('West Bengal'); // Fallback
          setLocationLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setLocationLoading(false);
    }
  };

  const getFilteredNews = () => {
    // 1. Special Case: Trending (Sort by Engagement)
    if (activeCategory === Category.TRENDING) {
       const trending = [...news].sort((a, b) => {
         const scoreA = (a.views || 0) + (a.likes || 0) * 5; // Likes are weighted more
         const scoreB = (b.views || 0) + (b.likes || 0) * 5;
         return scoreB - scoreA;
       });
       return trending;
    }

    // 2. Default Filter
    if (activeCategory === 'All') return news;
    
    if (activeCategory === Category.MY_AREA) {
      if (!userLocation) return [];
      return news.filter(n => 
        n.location?.includes(userLocation) || 
        n.category === Category.KOLKATA || 
        (n.location && userLocation === 'West Bengal')
      );
    }

    return news.filter(n => n.category === activeCategory);
  };

  const filteredNews = getFilteredNews();
  const breakingNews = activeCategory === 'All' || activeCategory === Category.BREAKING ? news[0] : null;
  
  // If trending, show all. If Breaking/All, separate the first item as Hero
  const displayList = (breakingNews && activeCategory === 'All') ? filteredNews.filter(n => n.id !== breakingNews.id) : filteredNews;

  return (
    <div className="pb-20 md:pb-10 min-h-screen bg-slate-50 dark:bg-royal-900/50">
      
      {/* Sticky Sub-Header Group (Status Bar + Tabs) */}
      <div className="sticky top-16 z-40 shadow-md">
        
        {/* Live Status Bar - Premium Dark Look */}
        <div className="bg-royal-900 text-white px-4 py-1.5 border-b border-royal-800 flex justify-between items-center text-[10px] uppercase tracking-widest">
           <div className="flex items-center gap-2 font-bold text-bengal-500">
             <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
             LIVE UPDATES
           </div>
           <div className="flex items-center gap-1 text-slate-300">
             <RefreshCw className="w-3 h-3" />
             Updated: {lastUpdated.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
           </div>
        </div>

        {/* Categories Tabs */}
        <div className="bg-white/95 dark:bg-royal-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 py-3">
          <div className="max-w-screen-xl mx-auto px-4 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 whitespace-nowrap">
              {/* All News */}
              <button
                onClick={() => setActiveCategory('All')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === 'All' 
                    ? 'bg-royal-600 text-white shadow-lg shadow-royal-600/30' 
                    : 'bg-slate-100 dark:bg-royal-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                সব খবর
              </button>

              {/* Trending (New) */}
              <button
                onClick={() => setActiveCategory(Category.TRENDING)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                  activeCategory === Category.TRENDING 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                    : 'bg-slate-100 dark:bg-royal-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Flame className="w-3 h-3" /> জনপ্রিয়
              </button>

              {/* My Area */}
              <button
                onClick={handleLocationRequest}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all flex items-center gap-1 ${
                  activeCategory === Category.MY_AREA 
                    ? 'bg-bengal-500 text-royal-900 shadow-lg shadow-bengal-500/30' 
                    : 'bg-slate-100 dark:bg-royal-800 text-royal-600 dark:text-bengal-500 border border-bengal-500/30'
                }`}
              >
                {locationLoading ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <MapPin className="w-3 h-3" />
                )}
                আমার এলাকা
              </button>

              {/* Other Categories */}
              {CATEGORIES.filter(c => c !== Category.TRENDING).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat 
                      ? 'bg-royal-600 text-white shadow-lg shadow-royal-600/30' 
                      : 'bg-slate-100 dark:bg-royal-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        
        {/* Location Banner */}
        {activeCategory === Category.MY_AREA && userLocation && (
          <div className="mb-6 p-4 bg-gradient-to-r from-bengal-500/10 to-transparent border-l-4 border-bengal-500 rounded-r-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
             <div className="p-2 bg-bengal-500 text-white rounded-full">
               <Navigation className="w-4 h-4" />
             </div>
             <div>
               <p className="text-xs font-bold text-bengal-600 uppercase tracking-wider">Locating News For</p>
               <h2 className="text-xl font-serif font-bold text-royal-900 dark:text-white">{userLocation}</h2>
             </div>
          </div>
        )}

        {/* Hero / Breaking News (Only on 'All' or 'Breaking') */}
        {breakingNews && (activeCategory === 'All' || activeCategory === Category.BREAKING) && (
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-red-500 font-bold text-sm tracking-widest uppercase">Breaking News</span>
            </div>
            <NewsCard item={breakingNews} featured />
          </div>
        )}

        {/* Trending Hero Title */}
        {activeCategory === Category.TRENDING && (
          <div className="mb-6 flex items-center gap-2 text-red-600 dark:text-red-500">
             <Flame className="w-6 h-6" />
             <h2 className="text-2xl font-serif font-bold">এখন চর্চায় (Trending Now)</h2>
          </div>
        )}

        {/* News List */}
        <div className="flex flex-col gap-4">
          {displayList.length > 0 ? (
            displayList.map((item, index) => (
              <React.Fragment key={item.id}>
                <NewsCard item={item} />
                {/* Insert Ad every 3rd item */}
                {(index + 1) % 3 === 0 && <AdBanner variant="banner" />}
              </React.Fragment>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <MapPin className="w-12 h-12 mb-4 opacity-20" />
              <p>এই মুহূর্তে আপনার এলাকার কোনো খবর নেই।</p>
              <button onClick={() => setActiveCategory('All')} className="mt-4 text-royal-600 underline">সব খবর দেখুন</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
