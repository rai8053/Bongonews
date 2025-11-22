import React, { useState } from 'react';
import { generateHeadline, cleanNewsText, draftNewsFromTopic } from '../services/geminiService';
import { saveNewsItem } from '../services/storageService';
import { CATEGORIES } from '../constants';
import { NewsItem, Category } from '../types';
import { Wand2, Loader2, Save, Lock, PenTool, Sparkles, Globe, Search, MapPin, DollarSign, ShoppingBag } from 'lucide-react';

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
  
  // Form Data
  const [headline, setHeadline] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>(Category.BREAKING);
  const [location, setLocation] = useState(''); // New field
  const [previewText, setPreviewText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // Monetization State
  const [isSponsored, setIsSponsored] = useState(false); 
  const [affiliateLink, setAffiliateLink] = useState('');
  const [affiliateText, setAffiliateText] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded password for demo
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('ভুল পাসওয়ার্ড (Incorrect Password)');
    }
  };

  // AI Helper: Research & Draft
  const handleResearch = async () => {
    if (!topic) return;
    setLoading(true);
    setStatus('Searching web & drafting...');
    try {
      const result = await draftNewsFromTopic(topic);
      setContent(result.content);
      setSources(result.sources);
      setStatus('Draft Created!');
      
      // Auto generate headline after content is ready
      const aiHeadline = await generateHeadline(result.content);
      setHeadline(aiHeadline);
      
      // Auto preview
      setPreviewText(result.content.substring(0, 100) + "...");
      
      // Guess location based on text (simple check)
      if (result.content.includes('কলকাতা')) setLocation('Kolkata');
      if (result.content.includes('জেলা')) setLocation('District');
      
    } catch (error) {
      console.error(error);
      setStatus('Research failed.');
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(''), 3000);
    }
  };

  // AI Helper: Clean Text
  const handleCleanText = async () => {
    if (!content) return;
    setLoading(true);
    setStatus('Cleaning Text with AI...');
    try {
      const cleanText = await cleanNewsText(content);
      setContent(cleanText);
      setStatus('Text Cleaned!');
    } catch (error) {
      console.error(error);
      setStatus('Error cleaning text.');
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(''), 2000);
    }
  };

  // AI Helper: Generate Headline
  const handleGenerateHeadline = async () => {
    if (!content) return;
    setLoading(true);
    setStatus('Generating Headline with AI...');
    try {
      const aiHeadline = await generateHeadline(content);
      setHeadline(aiHeadline);
      setStatus('Headline Generated!');
    } catch (error) {
      console.error(error);
      setStatus('Error generating headline.');
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(''), 2000);
    }
  };

  // Helper: Auto Generate Preview
  const handleGeneratePreview = () => {
    if (!content) return;
    setPreviewText(content.substring(0, 100) + "...");
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
    
    // Reset
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

  // --- LOGIN SCREEN ---
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
            <button 
              type="submit"
              className="w-full py-3 bg-royal-600 hover:bg-royal-700 text-white font-bold rounded-lg shadow-lg transition-transform transform active:scale-95"
            >
              লগইন করুন
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- ADMIN DASHBOARD ---
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {status}
          </div>
        )}
      </div>

      {/* AI Research Section */}
      <div className="bg-gradient-to-br from-royal-50 to-purple-50 dark:from-royal-800/50 dark:to-purple-900/30 p-6 rounded-xl border border-royal-100 dark:border-royal-700 mb-8">
        <div className="flex items-center gap-2 mb-3 text-royal-700 dark:text-bengal-400 font-bold">
          <Globe className="w-5 h-5" />
          <h3>Smart Research & Auto-Draft</h3>
        </div>
        <div className="flex gap-2">
          <input 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic (e.g., 'Kolkata Metro Update' or 'IPL News')..."
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
        <p className="text-xs text-slate-500 mt-2">
          Uses Gemini Search Grounding to find real facts and write a Bengali article.
        </p>
        
        {/* Sources Display */}
        {sources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-royal-200 dark:border-royal-700">
             <p className="text-xs font-bold text-slate-500 mb-2">Sources Found:</p>
             <div className="flex flex-wrap gap-2">
               {sources.map((src, i) => (
                 <a 
                    key={i} 
                    href={src} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] bg-white dark:bg-royal-900 px-2 py-1 rounded border border-slate-200 dark:border-royal-700 text-royal-600 dark:text-royal-300 hover:underline truncate max-w-[200px]"
                 >
                   {new URL(src).hostname}
                 </a>
               ))}
             </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-royal-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-royal-700 space-y-6">
        
        {/* Headline Section */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="block text-sm font-bold dark:text-slate-200">Headline (Bangla)</label>
            <button 
              onClick={handleGenerateHeadline}
              disabled={!content || loading}
              className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1 rounded-full flex items-center gap-1 transition disabled:opacity-50"
            >
              <Wand2 className="w-3 h-3" /> Generate with AI
            </button>
          </div>
          <input 
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full p-4 text-xl font-serif font-bold bg-slate-50 dark:bg-royal-900 border border-slate-200 dark:border-royal-700 rounded-lg focus:ring-2 focus:ring-royal-500 outline-none"
            placeholder="লিখুন অথবা AI ব্যবহার করুন..."
          />
        </div>

        {/* Content Section */}
        <div>
           <div className="flex justify-between items-end mb-2">
            <label className="block text-sm font-bold dark:text-slate-200">Full Article Content</label>
            <button 
              onClick={handleCleanText}
              disabled={!content || loading}
              className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-full flex items-center gap-1 transition disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3" /> Polish / Clean Text
            </button>
          </div>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleGeneratePreview}
            className="w-full p-4 min-h-[300px] font-serif bg-slate-50 dark:bg-royal-900 border border-slate-200 dark:border-royal-700 rounded-lg focus:ring-2 focus:ring-royal-500 outline-none leading-loose text-lg"
            placeholder="Paste or type your news article here..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2 dark:text-slate-200">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-royal-900 border border-slate-200 dark:border-royal-700 rounded-lg outline-none focus:ring-2 focus:ring-royal-500"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 dark:text-slate-200">Specific Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 p-3 bg-slate-50 dark:bg-royal-900 border border-slate-200 dark:border-royal-700 rounded-lg outline-none focus:ring-2 focus:ring-royal-500 text-sm"
                  placeholder="Enter city or area name..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 dark:text-slate-200">Image URL (Optional)</label>
              <input 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-royal-900 border border-slate-200 dark:border-royal-700 rounded-lg outline-none focus:ring-2 focus:ring-royal-500 text-sm"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Right Column: Preview & Monetization */}
          <div className="space-y-4">
             <div>
                <label className="block text-sm font-bold mb-2 dark:text-slate-200">Short Preview</label>
                <textarea 
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    className="w-full p-3 h-[130px] bg-slate-50 dark:bg-royal-900 border border-slate-200 dark:border-royal-700 rounded-lg outline-none focus:ring-2 focus:ring-royal-500 resize-none"
                    placeholder="Auto-generated from content..."
                />
             </div>

             {/* MONETIZATION SECTION */}
             <div className="p-4 bg-slate-50 dark:bg-royal-900/50 border border-slate-200 dark:border-royal-700 rounded-lg">
                <h4 className="text-sm font-bold text-royal-700 dark:text-bengal-500 mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Monetization Tools
                </h4>
                
                {/* Sponsored Toggle */}
                <label className="flex items-center gap-3 mb-4 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={isSponsored}
                      onChange={(e) => setIsSponsored(e.target.checked)}
                      className="w-4 h-4 text-royal-600 focus:ring-royal-500 rounded"
                    />
                    <span className="text-sm font-medium dark:text-slate-300">Sponsored Post (Native Ad)</span>
                </label>

                {/* Affiliate Links */}
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase">Affiliate Marketing (Product Link)</label>
                   <input 
                      value={affiliateLink}
                      onChange={(e) => setAffiliateLink(e.target.value)}
                      placeholder="https://amazon.in/..."
                      className="w-full p-2 text-xs rounded border border-slate-300 dark:border-royal-600 dark:bg-royal-800 dark:text-white"
                   />
                   <input 
                      value={affiliateText}
                      onChange={(e) => setAffiliateText(e.target.value)}
                      placeholder="Button Text (e.g. Check Price on Amazon)"
                      className="w-full p-2 text-xs rounded border border-slate-300 dark:border-royal-600 dark:bg-royal-800 dark:text-white"
                   />
                </div>
             </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-royal-700 flex justify-end">
          <button
            onClick={handlePublish}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-green-600/30 flex items-center gap-2 transition-transform transform hover:scale-105 active:scale-95"
          >
            <Save className="w-5 h-5" />
            Publish Article
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;