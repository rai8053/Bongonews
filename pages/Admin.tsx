
import React, { useState } from 'react';
import { Bot, PlusCircle, Settings, Play, Database, Upload, CheckCircle, RefreshCw, Link as LinkIcon, Download, Globe, ExternalLink } from 'lucide-react';
import { CITIES } from '../constants';
import { curateNewsletterSection, discoverTrends, transformExternalNews } from '../services/geminiService';
import { saveNewsItem, fetchFromExternalApi, saveMultipleNewsItems } from '../services/storageService';
import { NewsItem } from '../types';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cities' | 'pipeline' | 'import'>('pipeline');
  const [selectedCity, setSelectedCity] = useState(CITIES[0].id);
  const [status, setStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiUrl, setApiUrl] = useState('https://newsapi.org/v2/top-headlines?country=in&category=general');
  // State to store grounding sources from search as required by Gemini API guidelines
  const [groundingSources, setGroundingSources] = useState<any[]>([]);

  const triggerPipeline = async () => {
    setIsProcessing(true);
    setGroundingSources([]);
    setStatus('Discovering trends for ' + selectedCity + '...');
    try {
      const { headlines, sources } = await discoverTrends(selectedCity);
      setGroundingSources(sources);
      setStatus('Found: ' + headlines.join(', '));
      
      for (const trend of headlines) {
        setStatus(`Curating: ${trend}...`);
        const result = await curateNewsletterSection(selectedCity, trend, 'STORY');
        
        const newItem: NewsItem = {
          id: Date.now().toString() + Math.random(),
          headline: result.headline,
          content: result.content,
          previewText: result.previewText,
          type: 'STORY',
          city: selectedCity,
          category: 'ব্রেকিং নিউজ',
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

  const importFromUrl = async () => {
    if (!apiUrl) return;
    setIsProcessing(true);
    setStatus('Fetching from API...');
    try {
      const rawData = await fetchFromExternalApi(apiUrl);
      setStatus('Data received. Gemini is translating and reformatting...');
      
      const transformed = await transformExternalNews(rawData, selectedCity);
      setStatus(`Successfully transformed ${transformed.length} articles. Saving...`);

      const finalItems: NewsItem[] = transformed.map((t, idx) => ({
        ...t,
        id: `ext-${Date.now()}-${idx}`,
        type: 'STORY',
        city: selectedCity,
        createdAt: Date.now() - (idx * 3600000), // Stagger times
        views: Math.floor(Math.random() * 100),
        likes: 0,
        comments: []
      } as NewsItem));

      await saveMultipleNewsItems(finalItems);
      setStatus('Import complete! ' + finalItems.length + ' new stories added.');
    } catch (e) {
      console.error(e);
      setStatus('Import failed. Check URL or API Key.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto p-8 pb-32 font-sans">
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
            onClick={() => setActiveTab('import')}
            className={`p-3 rounded-xl transition ${activeTab === 'import' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            <Globe className="w-5 h-5" />
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
                      <h5 className="font-bold text-slate-900 font-bengali">{c.name}</h5>
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
                  <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 font-mono text-xs flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                      <span className="text-slate-300">{status}</span>
                    </div>
                    {/* Display grounding sources as required by Gemini Search Grounding guidelines */}
                    {groundingSources.length > 0 && (
                      <div className="mt-4 border-t border-slate-700 pt-4">
                        <p className="text-indigo-400 font-black mb-2 uppercase tracking-widest text-[10px]">Grounding Sources:</p>
                        <div className="flex flex-col gap-2">
                          {groundingSources.map((source, idx) => (
                            <a 
                              key={idx} 
                              href={source.web?.uri} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-indigo-400 flex items-center gap-2 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span className="truncate">{source.web?.title || source.web?.uri}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                <Database className="w-48 h-48" />
              </div>
           </div>
        </div>
      )}

      {activeTab === 'import' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-50 rounded-2xl">
                  <Globe className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">API Data Import</h3>
                  <p className="text-sm text-slate-500">Connect any News API and let Gemini handle the rest.</p>
                </div>
             </div>

             <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-1 block">API Endpoint URL</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                        placeholder="https://api.yoursite.com/news" 
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Target City</label>
                    <select 
                      value={selectedCity} 
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                    >
                      {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button 
                      onClick={importFromUrl}
                      disabled={isProcessing}
                      className="w-full py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                    >
                      {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      IMPORT & SYNC
                    </button>
                  </div>
                </div>
             </div>

             {status && (
                <div className="mt-6 p-4 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                    <span className="text-xs font-mono text-indigo-300">LOG: {status}</span>
                  </div>
                </div>
             )}
          </div>

          <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl">
             <h4 className="text-amber-800 font-bold mb-2 flex items-center gap-2 text-sm">
               <Bot className="w-4 h-4" /> Pro Tip: Intelligent Mapping
             </h4>
             <p className="text-xs text-amber-700 leading-relaxed">
               You don't need to configure keys or field mappings. Our <strong>Gemini Transformation Engine</strong> automatically detects headlines, body text, and images from your JSON structure and translates them into professional Bengali.
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
