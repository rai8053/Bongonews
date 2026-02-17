
import React, { useState } from 'react';
import { Bot, PlusCircle, Settings, Play, Database, Upload, CheckCircle, RefreshCw } from 'lucide-react';
import { CITIES } from '../constants';
import { curateNewsletterSection, discoverTrends } from '../services/geminiService';
import { saveNewsItem } from '../services/storageService';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cities' | 'pipeline' | 'analytics'>('cities');
  const [selectedCity, setSelectedCity] = useState(CITIES[0].id);
  const [status, setStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const triggerPipeline = async () => {
    setIsProcessing(true);
    setStatus('Discovering trends for ' + selectedCity + '...');
    try {
      const trends = await discoverTrends(selectedCity);
      setStatus('Found: ' + trends.join(', '));
      
      for (const trend of trends) {
        setStatus(`Curating: ${trend}...`);
        const result = await curateNewsletterSection(selectedCity, trend, 'STORY');
        
        const newItem = {
          id: Date.now().toString() + Math.random(),
          headline: result.headline,
          content: result.content,
          previewText: result.previewText,
          type: 'STORY' as any,
          city: selectedCity,
          createdAt: Date.now(),
          views: 0,
          likes: 0,
          comments: []
        };
        await saveNewsItem(newItem);
      }
      setStatus('Pipeline completed successfully!');
    } catch (e) {
      console.error(e);
      setStatus('Pipeline failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto p-8 pb-32">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Control Center</h1>
          <p className="text-slate-500">Platform Operations & Pipeline Management</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('cities')}
            className={`p-3 rounded-xl transition ${activeTab === 'cities' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTab('pipeline')}
            className={`p-3 rounded-xl transition ${activeTab === 'pipeline' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            <Bot className="w-5 h-5" />
          </button>
        </div>
      </div>

      {activeTab === 'cities' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="font-black text-lg mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-600" /> Onboard New City
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input placeholder="City Name" className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
              <input placeholder="City ID (lowercase)" className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
            </div>
            <textarea 
              placeholder="YAML Configuration (Feeds, Eventbrite keys...)" 
              className="w-full p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-2xl h-32 mb-4"
            />
            <button className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" /> Upload Config
            </button>
          </div>

          <div className="space-y-3">
             <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Active Cities ({CITIES.length})</h4>
             {CITIES.map(c => (
               <div key={c.id} className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold border border-slate-200">{c.name[0]}</div>
                    <div>
                      <h5 className="font-bold text-slate-900">{c.name}</h5>
                      <p className="text-[10px] text-slate-500 uppercase font-black">{c.neighborhoods.length} Neighborhoods</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-white text-slate-400 rounded-lg border border-slate-200"><Settings className="w-4 h-4" /></button>
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {activeTab === 'pipeline' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
           <div className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                  <Bot className="w-8 h-8 text-indigo-400" /> AI Pipeline Trigger
                </h3>
                <p className="text-slate-400 text-sm mb-8 max-w-sm">Run the automated curation engine. This will fetch RSS feeds, use Gemini to summarize, and build the weekly beat.</p>
                
                <div className="flex items-center gap-4 mb-8">
                  <select 
                    value={selectedCity} 
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-sm font-bold outline-none"
                  >
                    {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <button 
                    disabled={isProcessing}
                    onClick={triggerPipeline}
                    className="px-8 py-3 bg-indigo-500 text-white font-black rounded-xl hover:bg-indigo-400 disabled:opacity-50 transition flex items-center gap-2 shadow-lg shadow-indigo-500/40"
                  >
                    {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                    EXECUTE FLOW
                  </button>
                </div>

                {status && (
                  <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 font-mono text-xs flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-300">{status}</span>
                  </div>
                )}
              </div>
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                <Database className="w-48 h-48" />
              </div>
           </div>

           <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center">
                 <h6 className="text-[10px] font-black uppercase text-slate-400 mb-2">Last Run</h6>
                 <p className="text-xl font-black text-slate-900">4h ago</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center">
                 <h6 className="text-[10px] font-black uppercase text-slate-400 mb-2">Total Sends</h6>
                 <p className="text-xl font-black text-slate-900">12.5k</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center">
                 <h6 className="text-[10px] font-black uppercase text-slate-400 mb-2">API Health</h6>
                 <p className="text-xl font-black text-emerald-500">99.9%</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
