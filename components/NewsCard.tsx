
import React, { useState, useEffect } from 'react';
import { NewsItem } from '../types';
// Added 'Radio' to the lucide-react imports to fix the "Cannot find name 'Radio'" error.
import { Clock, Share2, Bookmark, Star, MessageCircle, Heart, Eye, ArrowUpRight, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toggleBookmark, isBookmarked, toggleLikeNews, isNewsLikedByUser } from '../services/storageService';

interface NewsCardProps {
  item: NewsItem;
  featured?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ item, featured = false }) => {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes || 0);
  const [imgSrc, setImgSrc] = useState(item.imageUrl || `https://image.pollinations.ai/prompt/News%20report%20${encodeURIComponent(item.headline)}?width=800&height=450&nologo=true`);

  useEffect(() => {
    setSaved(isBookmarked(item.id));
    setLiked(isNewsLikedByUser(item.id));
    setLikeCount(item.likes || 0);
    setImgSrc(item.imageUrl || `https://image.pollinations.ai/prompt/News%20report%20${encodeURIComponent(item.headline)}?width=800&height=450&nologo=true`);
  }, [item.id, item.imageUrl, item.likes]);

  const getTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "এইমাত্র";
    if (mins < 60) return `${mins} মিনিট আগে`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ঘণ্টা আগে`;
    return new Date(timestamp).toLocaleDateString('bn-BD');
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(toggleBookmark(item.id));
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const result = toggleLikeNews(item.id);
    setLiked(result.isLiked);
    setLikeCount(result.newCount);
  };

  if (featured) {
    return (
      <Link to={`/news/${item.id}`} className="block group mb-8">
        <div className="relative overflow-hidden rounded-[2rem] shadow-2xl transition-all duration-500 aspect-[16/10] w-full">
          <img src={imgSrc} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent p-8 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center gap-1 uppercase tracking-widest">
                <Radio className="w-3 h-3" /> লাইভ
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                {item.category || 'শীর্ষ খবর'}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4 drop-shadow-md group-hover:text-indigo-300 transition-colors">
              {item.headline}
            </h2>
            <div className="flex items-center justify-between text-white/70 text-sm font-medium">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {getTimeAgo(item.createdAt)}</span>
                <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {item.views || 0}</span>
              </div>
              <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/news/${item.id}`} className="flex gap-4 p-4 bg-white hover:bg-slate-50 rounded-3xl transition-all border border-slate-100 group relative">
      <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden flex-shrink-0 relative border border-slate-100 shadow-sm">
        <img src={imgSrc} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex items-center justify-between mb-1">
             <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{item.category || 'খবর'}</span>
             <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
               <Clock className="w-3 h-3" /> {getTimeAgo(item.createdAt)}
             </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
            {item.headline}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {item.previewText}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
             <span className="flex items-center gap-1 text-red-500/70"><Heart className={`w-3 h-3 ${liked ? 'fill-red-500 text-red-500' : ''}`} /> {likeCount}</span>
             <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {item.comments?.length || 0}</span>
          </div>
          <button onClick={handleBookmark} className="p-1 hover:text-indigo-600 transition-colors">
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-indigo-600 text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
