
import React, { useState, useEffect } from 'react';
import { getNews } from '../services/storageService';
import { CITIES } from '../constants';
import { NewsItem } from '../types';
import { Calendar, Wind, Navigation, TrendingUp, Zap, Clock, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import NewsCard from '../components/NewsCard';

const Home: React.FC<{ currentCity: string }> = ({ currentCity }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [neighborhood, setNeighborhood] = useState('');
  const cityConfig = CITIES.find(c => c.id === currentCity);

  const loadNews = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const all = await getNews();
    const cityNews = all
      .filter(n => n.city === currentCity)
      .sort((a, b) => b.createdAt - a.createdAt);
    setNews(cityNews);
    setLoading(false);
  };

  useEffect(() => {
    loadNews();
    if (cityConfig) setNeighborhood(cityConfig.neighborhoods[0]);

    // Live update polling every 60 seconds
    const interval = setInterval(() => {
      loadNews(false);
    }, 60000);

    return () => clearInterval(interval);
  }, [currentCity]);

  const stories = news.filter(n => n.type === 'STORY');
  const breakingNews = stories.slice(0, 5);
  const mainFeatures = stories.slice(0, 3);
  const events = news.filter(n => n.type === 'EVENT').slice(0, 4);

  if (loading && news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-bengali">খবর লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto bg-white min-h-screen border-x border-slate-100 pb-20 font-bengali">
      
      {/* Breaking News Ticker */}
      <div className="bg-red-600 text-white overflow-hidden h-10 flex items-center border-b border-red-700">
        <div className="bg-black px-4 h-full flex items-center font-bold text-xs z-10 whitespace-nowrap gap-2">
          <Zap className="w-3 h-3 fill-yellow-400 text-yellow-400 animate-pulse" />
          ব্রেকিং নিউজ
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="whitespace-nowrap animate-[marquee_30s_linear_infinite] inline-block pl-4 text-sm font-bold">
            {breakingNews.map((n, i) => (
              <span key={n.id} className="mx-8">
                • {n.headline}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Branding */}
      <div className="p-8 text-center bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
          </span>
          লাইভ আপডেট • {new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">
          {cityConfig?.name} <span className="text-indigo-600">লাইভ</span>
        </h1>
        <div className="flex flex-col items-center justify-center gap-1 text-slate-500 font-medium text-sm">
          <span>{neighborhood} এলাকার সর্বশেষ সংবাদ</span>
        </div>
      </div>

      <div className="p-6 space-y-12">
        {/* Main Stories Feed */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 border-l-4 border-indigo-600 pl-3">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">সেরা খবর</h2>
            </div>
            <button onClick={() => loadNews()} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-400">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {stories.length > 0 ? stories.map((s, i) => (
              <NewsCard key={s.id} item={s} featured={i === 0} />
            )) : (
              <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 italic">এই মুহূর্তে আপনার শহরে কোনো খবর নেই।</p>
                <Link to="/admin" className="text-indigo-600 font-bold text-sm mt-2 inline-block">AI পাইপলাইন চালু করুন</Link>
              </div>
            )}
          </div>
        </section>

        {/* Dynamic Weather Widget */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="bg-sky-50 p-6 rounded-3xl border border-sky-100 flex items-start gap-4">
              <div className="bg-sky-500 p-3 rounded-2xl text-white">
                <Wind className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">আবহাওয়া</h4>
                <p className="text-sm text-slate-600 leading-snug">সর্বোচ্চ ৩২°সে.। সন্ধ্যায় হালকা বৃষ্টির সম্ভাবনা রয়েছে।</p>
              </div>
           </div>
           <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-start gap-4">
              <div className="bg-amber-500 p-3 rounded-2xl text-white">
                <Navigation className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">ট্রাফিক আপডেট</h4>
                <p className="text-sm text-slate-600 leading-snug">প্রধান সড়কে যানজটের সম্ভাবনা। ফ্লাইওভারগুলো স্বাভাবিক।</p>
              </div>
           </div>
        </section>

        {/* Weekly Events with Visual Polish */}
        <section className="bg-slate-950 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Calendar className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-emerald-500/20 p-2 rounded-lg">
                <Calendar className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold">সাপ্তাহিক অনুষ্ঠান</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map(e => (
                <div key={e.id} className="group bg-slate-900/50 backdrop-blur-sm p-4 rounded-2xl border border-white/5 hover:border-emerald-500/50 transition-all">
                  <div className="overflow-hidden rounded-xl mb-4 h-40">
                    <img src={e.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="" />
                  </div>
                  <h4 className="font-bold mb-2 group-hover:text-emerald-400 transition-colors">{e.headline}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-black tracking-widest mb-4">
                    <Clock className="w-3 h-3" /> ২০ ফেব্রুয়ারি • কাঞ্চনজঙ্ঘা স্টেডিয়াম
                  </div>
                  <button className="w-full py-3 bg-white/5 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 font-bold text-xs rounded-xl transition-all active:scale-95 border border-white/10">টিকিট বুক করুন</button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default Home;
