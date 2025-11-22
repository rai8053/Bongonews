import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../constants';
import { getNews } from '../services/storageService';
import { NewsItem, Category } from '../types';
import NewsCard from '../components/NewsCard';
import AdBanner from '../components/AdBanner';
import { MapPin, RefreshCw, Navigation } from 'lucide-react';

const Home: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Load news and set up auto-refresh simulation
  useEffect(() => {
    document.title = "BongoNews - Home"; // Reset Title
    loadNews();
    
    // Simulate pulling fresh data every 5 minutes
    const intervalId = setInterval(() => {
      loadNews();
      setLastUpdated(new Date());
    }, 300000); // 5 mins

    return () => clearInterval(intervalId);
  }, []);

  const loadNews = () => {
    const allNews = getNews();
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
          // Simulating Reverse Geocoding logic since we don't have a paid Maps API key here.
          // In a real app, fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR_KEY`)
          
          // For Demo: We will randomly assign "Kolkata" or "New Town" or match based on mock logic
          // or simply allow all 'District' news if exact match fails.
          
          setTimeout(() => {
            // Mocking a successful detection
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
    if (activeCategory === 'All') return news;
    
    if (activeCategory === Category.MY_AREA) {
      if (!userLocation) return [];
      // Filter logic: Match exact location string OR fallback to category matching if location isn't specific in data
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
  const displayList = breakingNews && activeCategory === 'All' ? filteredNews.filter(n => n.id !== breakingNews.id) : filteredNews;

  return (
    <div className="pb-20 md:pb-10 min-h-screen bg-slate-50 dark:bg-royal-900/50">
      
      {/* Live Status Bar */}
      <div className="bg-white dark:bg-royal-900 px-4 py-2 border-b border-slate-100 dark:border-royal-800 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest sticky top-16 z-20">
         <div className="flex items-center gap-2">
           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
           LIVE UPDATES
         </div>
         <div className="flex items-center gap-1">
           <RefreshCw className="w-3 h-3" />
           Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
         </div>
      </div>

      {/* Categories Tabs */}
      <div className="sticky top-[105px] z-30 bg-white/95 dark:bg-royal-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 py-3 shadow-sm">
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

            {/* My Area (Special Button) */}
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
            {CATEGORIES.map(cat => (
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

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        
        {/* Location Banner if active */}
        {activeCategory === Category.MY_AREA && userLocation && (
          <div className="mb-6 p-4 bg-gradient-to-r from-bengal-500/10 to-transparent border-l-4 border-bengal-500 rounded-r-lg flex items-center gap-3">
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