import React, { useState, useEffect } from 'react';
import { generateHeadline, cleanNewsText, draftNewsFromTopic, generateImagePrompt, getTrendingTopics } from '../services/geminiService';
import { saveNewsItem } from '../services/storageService';
import { CATEGORIES } from '../constants';
import { NewsItem, Category } from '../types';
import { Wand2, Loader2, Save, Lock, PenTool, Sparkles, Globe, Search, MapPin, DollarSign, Bot, Play, Square } from 'lucide-react';

const Admin: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Editor State
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  
  // Research State
  const [topic, setTopic] = useState('');
  const [sources, setSources] = useState<string[]>([]);
  
  // Auto Pilot State
  const [isAutoPilotOn, setIsAutoPilotOn] = useState(false);
  
  // Form Data
  const [headline, setHeadline] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>(Category.BREAKING);
  const [location, setLocation] = useState(''); 
  const [previewText, setPreviewText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // Monetization State
  const [isSponsored, setIsSponsored] = useState(false); 
  const [affiliateLink, setAffiliateLink] = useState('');
  const [affiliateText, setAffiliateText] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('ভুল পাসওয়ার্ড (Incorrect Password)');
    }
  };

  // --- AI HELPERS ---

  const handleResearch = async () => {
    if (!topic) return;
    setLoading(true);
    setStatus('Searching web & drafting...');
    try {
      const result = await draftNewsFromTopic(topic);
      setContent(result.content);
      setSources(result.sources);
      setStatus('Draft Created!');
      
      // Auto generate headline
      const aiHeadline = await generateHeadline(result.content);
      setHeadline(aiHeadline);
      
      // Auto generate Image
      const imgPrompt = await generateImagePrompt(result.content);
      const aiImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(imgPrompt)}?width=800&height=600&nologo=true`;
      setImageUrl(aiImage);
      
      setPreviewText(result.content.substring(0, 100) + "...");
      
      // Guess location
      if (result.content.includes('কলকাতা')) setLocation('Kolkata');
      else if (result.content.includes('জেলা')) setLocation('District');
      else setLocation('West Bengal');
      
    } catch (error) {
      console.error(error);
      setStatus('Research failed.');
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const handleCleanText = async () => {
    if (!content) return;
    setLoading(true);
    setStatus('Cleaning Text with AI...');
    try {
      const cleanText = await cleanNewsText(content);
      setContent(cleanText);
      setStatus('Text Cleaned!');
    } catch (error) {
      setStatus('Error cleaning text.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateHeadline = async () => {
    if (!content) return;
    setLoading(true);
    setStatus('Generating Headline...');
    try {
      const aiHeadline = await generateHeadline(content);
      setHeadline(aiHeadline);
    } catch (error) {
      setStatus('Error generating headline.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    const baseText = headline || content || topic;
    if (!baseText) return;
    
    setLoading(true);
    setStatus('Creating AI Image...');
    try {
      const prompt = await generateImagePrompt(baseText);
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true`;
      setImageUrl(url);
      setStatus('Image Created!');
    } catch (error) {
      setStatus('Image failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = () => {
    if (!headline || !content) {
      alert("Please fill in Headline and Content");
      return;
    }

    const newItem: NewsItem = {
      id: Date.now().toString(),
      headline,
      content,
      previewText: previewText || content.substring(0, 100) + "...",
      category,
      location: location || 'West Bengal',
      createdAt: Date.now(),
      imageUrl: imageUrl || `https://picsum.photos/800/400?random=${Date.now()}`,
      readTime: `${Math.ceil(content.split(' ').length / 200)} min`,
      views: 0,
      isSponsored: isSponsored,
      affiliate: affiliateLink ? { link: affiliateLink, text: affiliateText || 'Buy Now' } : undefined
    };

    saveNewsItem(newItem);
    alert('News Published Successfully!');
    
    setHeadline('');
    setContent('');
    setPreviewText('');
    setImageUrl('');
    setLocation('');
    setStatus('');
    setTopic('');
    setSources([]);
    setIsSponsored(false);
    setAffiliateLink('');
    setAffiliateText('');
  };

  // --- AUTO PILOT LOOP ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoPilotOn) {
      const runAutoPilot = async () => {
        setStatus('🤖 Auto-Pilot: Finding Trends...');
        try {
          // 1. Find a trend
          const trends = await getTrendingTopics();
          const randomTrend = trends[Math.floor(Math.random() * trends.length)];
          
          setStatus(`🤖 Auto-Pilot: Researching "${randomTrend}"...`);
          
          // 2. Draft News
          const draft = await draftNewsFromTopic(randomTrend);
          const aiHeadline = await generateHeadline(draft.content);
          const imgPrompt = await generateImagePrompt(draft.content);
          const aiImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(imgPrompt)}?width=800&height=600&nologo=true`;
          
          // 3. Publish
          const newItem: NewsItem = {
            id: Date.now().toString(),
            headline: aiHeadline,
            content: draft.content,
            previewText: draft.content.substring(0, 120) + "...",
            category: Category.BREAKING,
            location: 'West Bengal',
            createdAt: Date.now(),
            imageUrl: aiImage,
            readTime: '3 min',
            views: 100
          };
          
          saveNewsItem(newItem);
          setStatus(`✅ Auto-Published: ${randomTrend}`);
          
        } catch (e) {
          console.error(e);
          setStatus('⚠️ Auto-Pilot Error. Retrying...');
        }
      };

      // Run immediately then every 30 seconds
      runAutoPilot();
      interval = setInterval(runAutoPilot, 30000);
    }

    return () => clearInterval(interval);
  }, [isAutoPilotOn]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-royal-900">
        <div className="bg-white dark:bg-royal-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 dark:border-royal-700">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-royal-100 dark:bg-royal-700 rounded-full">
              <Lock className="w-8 h-8 text-royal-600 dark:text-royal-300" />
            </div>
          </div>
          <h2 className="text-2xl font-serif font-bold text-center mb-6 dark:text-white">
            অ্যাডমিন প্যানেল
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                পাসওয়ার্ড দিন
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-300 dark:border-royal-600 bg-slate-50 dark:bg-royal-900 dark:text-white focus:ring-2 focus:ring-royal-500 outline-none"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="w-full py-3 bg-royal-600 text-white font-bold rounded-lg">
              লগইন করুন
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-royal-600 rounded-lg text-white">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold dark:text-white">Editor Dashboard</h1>
            <p className="text-sm text-slate-500">Create & Manage News</p>
          </div>
        </div>
        {status && (
          <div className="bg-bengal-100 text-bengal-800 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 animate-pulse">
            {loading || isAutoPilotOn ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {status}
          </div>
        )}
      </div>

      {/* Auto Pilot Section */}
      <div className="mb-8 p-6 bg-royal-900 text-white rounded-xl flex items-center justify-between shadow-lg relative overflow-hidden">
         <div className="relative z-10">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
              <Bot className="w-6 h-6 text-bengal-500" /> Auto-Pilot News Bot
            </h3>
            <p className="text-sm text-slate-300 max-w-md">
              Automatically searches trends, writes articles, creates images, and publishes news every 30s.
            </p>
         </div>
         <div className="relative z-10">
            <button 
              onClick={() => setIsAutoPilotOn(!isAutoPilotOn)}
              className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${isAutoPilotOn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
               {isAutoPilotOn ? <><Square className="w-4 h-4 fill-current" /> Stop Bot</> : <><Play className="w-4 h-4 fill-current" /> Start Bot</>}
            </button>
         </div>
         <div className="absolute right-0 top-0 w-64 h-64 bg-royal-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Manual Research Section */}
      <div className="bg-slate-50 dark:bg-royal-800/50 p-6 rounded-xl border border-slate-200 dark:border-royal-700 mb-8">
        <div className="flex items-center gap-2 mb-3 text-royal-700 dark:text-bengal-400 font-bold">
          <Globe className="w-5 h-5" />
          <h3>Smart Research</h3>
        </div>
        <div className="flex gap-2">
          <input 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic (e.g., 'Kolkata Weather')..."
            className="flex-1 p-3 rounded-lg border border-slate-300 dark:border-royal-600 bg-white dark:bg-royal-900 focus:outline-none focus:ring-2 focus:ring-royal-500"
          />
          <button 
            onClick={handleResearch}
            disabled={!topic || loading}
            className="px-6 bg-royal-600 text-white font-bold rounded-lg flex items-center gap-2 hover:bg-royal-700 disabled:opacity-50 transition-all"
          >
            <Search className="w-4 h-4" />
            Auto-Draft
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white dark:bg-royal-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-royal-700 space-y-6">
        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="block text-sm font-bold dark:text-slate-200">Headline</label>
            <button 
              onClick={handleGenerateHeadline}
              disabled={!content || loading}
              className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full flex items-center gap-1"
            >
              <Wand2 className="w-3 h-3" /> AI Headline
            </button>
          </div>
          <input 
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full p-4 text-xl font-serif font-bold bg-slate-50 dark:bg-royal-900 border border-slate-200 dark:border-royal-700 rounded-lg focus:ring-2 focus:ring-royal-500 outline-none"
          />
        </div>

        <div>
           <div className="flex justify-between items-end mb-2">
            <label className="block text-sm font-bold dark:text-slate-200">Content</label>
            <button 
              onClick={handleCleanText}
              disabled={!content || loading}
              className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> Clean Text
            </button>
          </div>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 min-h-[300px] font-serif bg-slate-50 dark:bg-royal-900 border border-slate-200 dark:border-royal-700 rounded-lg focus:ring-2 focus:ring-royal-500 outline-none text-lg"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2 dark:text-slate-200">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-royal-900 border border-slate-200 dark:border-royal-700 rounded-lg outline-none"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 dark:text-slate-200">Image URL</label>
              <div className="flex gap-2">
                <input 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 p-3 bg-slate-50 dark:bg-royal-900 border border-slate-200 dark:border-royal-700 rounded-lg outline-none text-sm"
                  placeholder="https://..."
                />
                <button 
                   onClick={handleGenerateImage}
                   className="p-3 bg-bengal-500 text-royal-900 rounded-lg hover:bg-bengal-400 transition"
                   title="Generate AI Image"
                >
                  <Wand2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
             {/* Preview & Monetization (Same as before) */}
             <div className="p-4 bg-slate-50 dark:bg-royal-900/50 border border-slate-200 dark:border-royal-700 rounded-lg">
                <h4 className="text-sm font-bold text-royal-700 dark:text-bengal-500 mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Monetization
                </h4>
                <label className="flex items-center gap-3 mb-4 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={isSponsored}
                      onChange={(e) => setIsSponsored(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm font-medium dark:text-slate-300">Sponsored Post</span>
                </label>
                <input 
                   value={affiliateLink}
                   onChange={(e) => setAffiliateLink(e.target.value)}
                   placeholder="Affiliate Link"
                   className="w-full p-2 text-xs rounded border border-slate-300 dark:border-royal-600 dark:bg-royal-800 mb-2"
                />
             </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-royal-700 flex justify-end">
          <button
            onClick={handlePublish}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;