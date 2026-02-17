
import React, { useState, useEffect } from 'react';
import { getNews } from '../services/storageService';
import { CITIES } from '../constants';
import { NewsItem } from '../types';
import { Calendar, MapPin, Tag, Wind, Navigation, TrendingUp, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC<{ currentCity: string }> = ({ currentCity }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [neighborhood, setNeighborhood] = useState('');
  const cityConfig = CITIES.find(c => c.id === currentCity);

  useEffect(() => {
    loadNews();
    if (cityConfig) setNeighborhood(cityConfig.neighborhoods[0]);
  }, [currentCity]);

  const loadNews = async () => {
    const all = await getNews();
    setNews(all.filter(n => n.city === currentCity));
  };

  const stories = news.filter(n => n.type === 'STORY').slice(0, 3);
  const events = news.filter(n => n.type === 'EVENT').slice(0, 4);
  const deals = news.filter(n => n.type === 'DEAL').slice(0, 2);

  return (
    <div className="max-w-screen-md mx-auto bg-white min-h-screen border-x border-slate-100 pb-20 font-bengali">
      {/* Newsletter Header */}
      <div className="p-8 text-center bg-slate-50 border-b border-slate-200">
        <p className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-2">শুক্রবার সংস্করণ • ২০ ফেব্রুয়ারি, ২০২৬</p>
        <h1 className="text-4xl font-black text-slate-900 mb-4">
          {cityConfig?.name} ডাইজেস্ট
        </h1>
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-slate-500 font-medium text-sm">
          <span>নমস্কার {neighborhood}! দেখে নিন আপনার এলাকার খবরাখবর।</span>
          <select 
            value={neighborhood} 
            onChange={(e) => setNeighborhood(e.target.value)}
            className="bg-white border border-slate-200 px-2 py-1 rounded text-xs font-bold text-slate-700 outline-none"
          >
            {cityConfig?.neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="p-6 space-y-12">
        {/* Section 1: Top Stories */}
        <section>
          <div className="flex items-center gap-3 mb-6 border-l-4 border-indigo-600 pl-3">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-slate-900">সেরা ৩ খবর</h2>
          </div>
          <div className="space-y-8">
            {stories.length > 0 ? stories.map((s, i) => (
              <div key={s.id} className="group cursor-pointer">
                <Link to={`/news/${s.id}`}>
                  <div className="flex gap-4">
                    <div className="text-4xl font-black text-slate-200 group-hover:text-indigo-100 transition-colors">০{i+1}</div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{s.headline}</h3>
                      <p className="text-slate-600 leading-relaxed text-sm line-clamp-2">{s.previewText}</p>
                    </div>
                  </div>
                </Link>
              </div>
            )) : (
              <p className="text-slate-400 italic">এই মুহূর্তে কোনো খবর নেই।</p>
            )}
          </div>
        </section>

        {/* Section 2: Weekend Events */}
        <section className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold">সাপ্তাহিক অনুষ্ঠান</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(e => (
              <div key={e.id} className="bg-slate-800 p-4 rounded-2xl hover:bg-slate-750 transition border border-slate-700 group">
                <div className="overflow-hidden rounded-xl mb-3 h-32">
                  <img src={e.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="" />
                </div>
                <h4 className="font-bold mb-1 line-clamp-1">{e.headline}</h4>
                <p className="text-xs text-slate-400 mb-4 line-clamp-2">{e.previewText}</p>
                <button className="w-full py-2 bg-emerald-500 text-slate-900 font-bold text-xs rounded-lg active:scale-95 transition">বিস্তারিত দেখুন</button>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Weather & Traffic */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="bg-sky-50 p-6 rounded-3xl border border-sky-100">
              <Wind className="w-8 h-8 text-sky-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-1">আবহাওয়া</h4>
              <p className="text-sm text-slate-600 leading-relaxed">সর্বোচ্চ ৩২°সে.। আংশিক মেঘলা আকাশ, সন্ধ্যায় হালকা বৃষ্টির সম্ভাবনা রয়েছে।</p>
           </div>
           <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
              <Navigation className="w-8 h-8 text-amber-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-1">ট্রাফিক আপডেট</h4>
              <p className="text-sm text-slate-600 leading-relaxed">রাস্তা মেরামতের কাজের জন্য প্রধান সড়কে যানজটের সম্ভাবনা। ফ্লাইওভারগুলো স্বাভাবিক।</p>
           </div>
        </section>

        {/* Newsletter Footer */}
        <footer className="pt-12 border-t border-slate-100 text-center pb-20">
           <div className="mb-6">
             <div className="w-16 h-16 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center text-white font-black text-2xl mb-4">ব</div>
             <p className="text-slate-400 text-sm max-w-xs mx-auto">বঙ্গ নিউজ - আধুনিক প্রযুক্তির মাধ্যমে আপনার এলাকার সঠিক খবর।</p>
           </div>
           <div className="flex justify-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <span className="hover:text-indigo-600 cursor-pointer transition">বিজ্ঞাপন</span>
              <span className="hover:text-indigo-600 cursor-pointer transition">মতামত</span>
              <span className="text-red-500 hover:text-red-700 cursor-pointer transition">আনসাবস্ক্রাইব</span>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
