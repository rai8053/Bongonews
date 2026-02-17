
import React, { useState, useEffect } from 'react';
import { getNews } from '../services/storageService';
import { CITIES } from '../constants';
import { NewsItem } from '../types';
import { Calendar, MapPin, Tag, Wind, Navigation, Mail, CheckCircle, TrendingUp } from 'lucide-react';
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
    <div className="max-w-screen-md mx-auto bg-white min-h-screen border-x border-slate-100 pb-20">
      {/* Newsletter Header */}
      <div className="p-8 text-center bg-slate-50 border-b border-slate-200">
        <p className="text-indigo-600 font-black text-sm uppercase tracking-[0.2em] mb-2">Friday Edition • Feb 20, 2026</p>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">
          The {cityConfig?.name} Beat
        </h1>
        <div className="flex items-center justify-center gap-2 text-slate-500 font-medium text-sm">
          <span>Hey {neighborhood}! Here's what's happening in your hood.</span>
          <select 
            value={neighborhood} 
            onChange={(e) => setNeighborhood(e.target.value)}
            className="bg-white border border-slate-200 px-2 py-1 rounded text-xs font-bold text-slate-700"
          >
            {cityConfig?.neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="p-6 space-y-12">
        {/* Section 1: Top Stories */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-black text-slate-900">Top 3 Stories</h2>
          </div>
          <div className="space-y-8">
            {stories.map((s, i) => (
              <div key={s.id} className="group cursor-pointer">
                <Link to={`/news/${s.id}`}>
                  <div className="flex gap-4">
                    <div className="text-4xl font-black text-slate-200 group-hover:text-indigo-100 transition-colors">0{i+1}</div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2 group-hover:text-indigo-600">{s.headline}</h3>
                      <p className="text-slate-600 leading-relaxed text-sm line-clamp-3">{s.content}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Weekend Events */}
        <section className="bg-slate-900 rounded-3xl p-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-black">Weekend Events</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(e => (
              <div key={e.id} className="bg-slate-800 p-4 rounded-2xl hover:bg-slate-750 transition border border-slate-700">
                <img src={e.imageUrl} className="w-full h-32 object-cover rounded-xl mb-3" />
                <h4 className="font-bold mb-1">{e.headline}</h4>
                <p className="text-xs text-slate-400 mb-4">{e.previewText}</p>
                <button className="w-full py-2 bg-emerald-500 text-slate-900 font-bold text-xs rounded-lg">View Details</button>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Local Deals */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Tag className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-black text-slate-900">Neighborhood Deals</h2>
          </div>
          <div className="space-y-4">
            {deals.map(d => (
              <div key={d.id} className="border-2 border-dashed border-indigo-200 p-6 rounded-3xl bg-indigo-50/30 flex items-center justify-between">
                <div>
                   <span className="text-[10px] font-black uppercase text-indigo-500 bg-white border border-indigo-100 px-2 py-0.5 rounded-full mb-2 inline-block">Exclusive Deal</span>
                   <h4 className="text-lg font-bold text-slate-900">{d.headline}</h4>
                   <p className="text-sm text-slate-500">{d.previewText}</p>
                </div>
                <div className="text-right">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm mb-2 ml-auto">
                     <CheckCircle className="w-6 h-6 text-emerald-500" />
                   </div>
                   <span className="text-xs font-bold text-indigo-600">Claim Code</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Weather & Traffic */}
        <section className="grid grid-cols-2 gap-4">
           <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
              <Wind className="w-8 h-8 text-indigo-600 mb-4" />
              <h4 className="font-black text-slate-900 mb-1">Weather</h4>
              <p className="text-sm text-slate-600">High of 32°C. Partly cloudy with a chance of light evening showers.</p>
           </div>
           <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
              <Navigation className="w-8 h-8 text-amber-600 mb-4" />
              <h4 className="font-black text-slate-900 mb-1">Traffic</h4>
              <p className="text-sm text-slate-600">Expected congestion on ORR due to roadwork. Flyovers clear.</p>
           </div>
        </section>

        {/* Newsletter Footer */}
        <footer className="pt-12 border-t border-slate-100 text-center pb-20">
           <div className="mb-6">
             <div className="w-16 h-16 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center text-white font-black text-2xl mb-4">L</div>
             <p className="text-slate-400 text-sm max-w-xs mx-auto">Automated local news for professionals who value their time.</p>
           </div>
           <div className="flex justify-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <span>Advertise</span>
              <span>Feedback</span>
              <span className="text-red-500">Unsubscribe</span>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;