import React, { useState, useEffect } from 'react';
import { NewsItem } from '../types';
import { Clock, Share2, Bookmark, Star, ShoppingBag, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toggleBookmark, isBookmarked } from '../services/storageService';

interface NewsCardProps {
  item: NewsItem;
  featured?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ item, featured = false }) => {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked(item.id));
  }, [item.id]);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleBookmark(item.id);
    setSaved(newState);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.headline,
          text: item.previewText,
          url: `${window.location.origin}/#/news/${item.id}`,
        });
      } catch (err) {
        console.log("Share canceled");
      }
    } else {
       alert("Share feature not supported on this device/browser.");
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('bn-BD', { hour: 'numeric', minute: 'numeric' }).format(date);
  };

  // Sponsored Post (Native Ad) Design
  if (item.isSponsored) {
    return (
      <Link to={`/news/${item.id}`} className="block mb-4">
        <div className="flex gap-4 p-4 bg-gradient-to-r from-bengal-50 to-white dark:from-royal-800 dark:to-royal-900 rounded-xl border border-bengal-400 dark:border-bengal-600/50 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-bengal-500 text-royal-900 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg z-10 flex items-center gap-1">
            <Star className="w-3 h-3 fill-royal-900" /> Sponsored
          </div>
          
          <div className="w-1/3 aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0 relative border border-bengal-200">
            <img 
              src={item.imageUrl || `https://picsum.photos/seed/${item.id}/400/300`} 
              alt={item.headline} 
              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="flex-1 flex flex-col justify-between py-1">
            <div>
              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 mb-2">
                {item.headline}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-sans">
                {item.previewText}
              </p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-bold text-bengal-600 dark:text-bengal-500 uppercase tracking-wider">
                Promoted Content
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (featured) {
    return (
      <Link to={`/news/${item.id}`} className="block group">
        <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 aspect-video w-full">
          <img 
            src={item.imageUrl || 'https://picsum.photos/800/450'} 
            alt={item.headline} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end">
            <span className="inline-block px-3 py-1 bg-bengal-500 text-royal-900 text-xs font-bold rounded-full w-fit mb-3 shadow-lg">
              {item.category}
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white leading-snug drop-shadow-md mb-2">
              {item.headline}
            </h2>
            <div className="flex items-center gap-4 text-slate-300 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTime(item.createdAt)}</span>
              <span>•</span>
              <span>{item.readTime || '3 min'} read</span>
              
              <button 
                onClick={handleBookmark}
                className="ml-auto p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <Bookmark className={`w-5 h-5 ${saved ? 'fill-bengal-500 text-bengal-500' : 'text-white'}`} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/news/${item.id}`} className="flex gap-4 p-4 bg-white dark:bg-royal-800/50 rounded-xl shadow-sm hover:shadow-md hover:bg-slate-50 dark:hover:bg-royal-800 transition-all duration-300 border border-slate-100 dark:border-royal-700/50 relative">
      <div className="w-1/3 aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0 relative">
        <img 
          src={item.imageUrl || `https://picsum.photos/seed/${item.id}/400/300`} 
          alt={item.headline} 
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-royal-600/90 backdrop-blur text-white text-[10px] font-bold rounded-md">
          {item.category}
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 mb-2">
            {item.headline}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-sans">
            {item.previewText}
          </p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {formatTime(item.createdAt)}
          </span>
          
          {item.affiliate ? (
            <span className="flex items-center gap-1 text-xs font-bold text-bengal-600 dark:text-bengal-500 bg-bengal-50 dark:bg-bengal-900/20 px-2 py-1 rounded-full">
              <ShoppingBag className="w-3 h-3" /> Shop
            </span>
          ) : (
            <div className="flex gap-3 text-slate-400">
               <button 
                 onClick={handleBookmark}
                 className="p-1 hover:text-royal-600 transition-colors"
               >
                 <Bookmark className={`w-4 h-4 ${saved ? 'fill-royal-600 text-royal-600' : ''}`} />
               </button>
               <button
                onClick={handleShare}
                className="p-1 hover:text-royal-600 transition-colors"
               >
                 <Share2 className="w-4 h-4" />
               </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;