import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNews, getNewsById } from '../services/storageService';
import { NewsItem } from '../types';
import { ArrowLeft, Share2, Calendar, Eye, ShoppingCart, ExternalLink, Copy, Check } from 'lucide-react';
import AdBanner from '../components/AdBanner';
import NewsCard from '../components/NewsCard';

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      const item = getNewsById(id);
      if (item) {
        setNews(item);
        window.scrollTo(0, 0);
        
        // Dynamic Title for SEO
        document.title = `${item.headline} | BongoNews`;
        
        // Fetch real related news (same category, excluding current)
        const allNews = getNews();
        const related = allNews
          .filter(n => n.category === item.category && n.id !== item.id)
          .sort(() => 0.5 - Math.random()) // Random shuffle
          .slice(0, 3);
        setRelatedNews(related);
      }
    }
    return () => {
      document.title = "BongoNews"; // Reset on unmount
    };
  }, [id]);

  const handleNativeShare = async () => {
    if (!news) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: news.headline,
          text: news.previewText,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      // Fallback: Copy to clipboard
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    alert("লিঙ্ক কপি করা হয়েছে (Link Copied)");
  };

  if (!news) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="pb-24 bg-white dark:bg-royal-900 min-h-screen">
      {/* Header Image */}
      <div className="w-full h-[40vh] md:h-[50vh] relative">
        <img 
          src={news.imageUrl || 'https://picsum.photos/1200/800'} 
          alt={news.headline} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-royal-900 to-transparent"></div>
        <Link to="/" className="absolute top-4 left-4 p-2 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 transition">
          <ArrowLeft className="w-6 h-6" />
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-5 -mt-20 relative z-10">
        <span className="inline-block px-3 py-1 bg-bengal-500 text-royal-900 text-xs font-bold rounded-full mb-4 shadow-lg">
          {news.category}
        </span>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-tight mb-6 drop-shadow-sm">
          {news.headline}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
           <div className="flex items-center gap-1">
             <Calendar className="w-4 h-4" />
             {new Date(news.createdAt).toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
           </div>
           <div className="flex items-center gap-1">
             <Eye className="w-4 h-4" />
             {news.views || 0} বার পঠিত
           </div>
        </div>

        {/* Affiliate CTA - Sticky Style */}
        {news.affiliate && (
          <div className="mb-8 p-5 bg-bengal-50 dark:bg-royal-800 border border-bengal-200 dark:border-royal-700 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <h3 className="font-bold text-royal-900 dark:text-white text-lg">Featured Product</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Best price available now</p>
            </div>
            <a 
              href={news.affiliate.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-royal-600 hover:bg-royal-700 text-white font-bold rounded-lg shadow-lg shadow-royal-600/20 flex items-center gap-2 transition-transform active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" /> 
              {news.affiliate.text || 'Buy Now'}
            </a>
          </div>
        )}

        {/* Content Body */}
        <article className="prose prose-lg prose-slate dark:prose-invert font-serif leading-loose max-w-none first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-royal-600 dark:first-letter:text-bengal-500">
          {news.content.split('\n').map((para, i) => (
            <p key={i} className="mb-6 text-slate-800 dark:text-slate-200 text-[1.1rem]">
              {para}
            </p>
          ))}
        </article>

        {/* Affiliate CTA - Bottom Repeat */}
        {news.affiliate && (
          <div className="my-8 text-center">
             <a 
              href={news.affiliate.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-bengal-500 text-royal-900 font-bold text-lg rounded-full shadow-xl hover:shadow-2xl hover:bg-bengal-400 transition-all"
            >
              {news.affiliate.text || 'Check Price'} <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        )}

        {/* Share Buttons */}
        <div className="my-10 p-6 bg-slate-50 dark:bg-royal-800/50 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-bold text-slate-700 dark:text-slate-300">শেয়ার করুন (Share):</span>
          <div className="flex gap-3">
            <button 
              onClick={handleNativeShare}
              className="px-4 py-2 bg-[#25D366] text-white rounded-full font-medium text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition"
            >
              <Share2 className="w-4 h-4" /> WhatsApp
            </button>
            <button 
              onClick={handleNativeShare}
              className="px-4 py-2 bg-[#1877F2] text-white rounded-full font-medium text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition"
            >
              <Share2 className="w-4 h-4" /> Facebook
            </button>
             <button 
              onClick={handleCopyLink}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full font-medium text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copy
            </button>
          </div>
        </div>

        <AdBanner variant="box" />

        {/* Related / Read Next */}
        <div className="mt-12 border-t border-slate-200 dark:border-royal-700 pt-8">
          <h3 className="text-2xl font-bold font-serif mb-6 dark:text-white border-l-4 border-bengal-500 pl-3">আরও পড়ুন (Read Next)</h3>
          <div className="grid gap-4">
            {relatedNews.length > 0 ? (
              relatedNews.map(item => (
                <NewsCard key={item.id} item={item} />
              ))
            ) : (
               <p className="text-slate-400 italic">আর কোনো খবর নেই...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;