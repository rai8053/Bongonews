
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNews, getNewsById, incrementView, addComment, toggleLikeNews, isNewsLikedByUser } from '../services/storageService';
import { NewsItem, Comment } from '../types';
import { ArrowLeft, Share2, Calendar, Eye, ShoppingCart, ExternalLink, Copy, Check, Heart, MessageCircle, Send, UserCircle } from 'lucide-react';
import AdBanner from '../components/AdBanner';
import NewsCard from '../components/NewsCard';

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [copied, setCopied] = useState(false);
  
  // Engagement State
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [userName, setUserName] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (id) {
      // 1. Increment View
      incrementView(id);
      
      // 2. Load Data
      const item = getNewsById(id);
      if (item) {
        setNews(item);
        setIsLiked(isNewsLikedByUser(id));
        setLikeCount(item.likes || 0);
        setComments(item.comments || []);
        
        window.scrollTo(0, 0);
        document.title = `${item.headline} | BongoNews`;
        
        // 3. Fetch Related
        getNews().then((allNews) => {
          const related = allNews
            .filter(n => n.category === item.category && n.id !== item.id)
            .sort(() => 0.5 - Math.random()) 
            .slice(0, 3);
          setRelatedNews(related);
        });
      }
    }
    return () => {
      document.title = "BongoNews"; 
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
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    alert("লিঙ্ক কপি করা হয়েছে (Link Copied)");
  };

  const handleLike = () => {
    if (!news) return;
    const result = toggleLikeNews(news.id);
    setIsLiked(result.isLiked);
    setLikeCount(result.newCount);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!news || !commentText.trim() || !userName.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      user: userName,
      text: commentText,
      timestamp: Date.now()
    };

    addComment(news.id, newComment);
    setComments([newComment, ...comments]);
    setCommentText('');
    setUserName('');
  };

  if (!news) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="pb-24 bg-white dark:bg-royal-900 min-h-screen">
      {/* Header Image */}
      <div className="w-full h-[40vh] md:h-[50vh] relative group">
        <img 
          src={news.imageUrl || 'https://picsum.photos/1200/800'} 
          alt={news.headline} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-royal-900 to-transparent"></div>
        <Link to="/" className="absolute top-4 left-4 p-2 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 transition">
          <ArrowLeft className="w-6 h-6" />
        </Link>

        {/* Floating Like Button (Desktop/Image overlay) */}
        <button 
          onClick={handleLike}
          className="absolute bottom-[-20px] right-8 p-4 rounded-full shadow-xl transition-transform transform active:scale-90 z-20 flex items-center justify-center bg-white dark:bg-royal-800 text-royal-600 dark:text-white"
        >
           <Heart className={`w-8 h-8 ${isLiked ? 'fill-red-500 text-red-500' : 'text-slate-300'}`} />
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-5 -mt-20 relative z-10">
        <div className="flex justify-between items-start">
          <span className="inline-block px-3 py-1 bg-bengal-500 text-royal-900 text-xs font-bold rounded-full mb-4 shadow-lg">
            {news.category}
          </span>
        </div>
        
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
             {(news.views || 0) + 1} বার পঠিত
           </div>
           <div className="flex items-center gap-1 text-red-500 font-bold">
             <Heart className="w-4 h-4 fill-current" /> {likeCount} Likes
           </div>
        </div>

        {/* Affiliate CTA */}
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

        <AdBanner variant="box" />

        {/* --- COMMENTS SECTION --- */}
        <div className="mt-10 bg-slate-50 dark:bg-royal-800/30 p-6 rounded-xl border border-slate-100 dark:border-royal-700">
           <h3 className="text-xl font-bold font-serif mb-6 flex items-center gap-2 dark:text-white">
             <MessageCircle className="w-5 h-5" /> মন্তব্য ({comments.length})
           </h3>

           {/* Comment Form */}
           <form onSubmit={handlePostComment} className="mb-8 bg-white dark:bg-royal-800 p-4 rounded-lg shadow-sm">
              <div className="mb-3">
                <input 
                  type="text" 
                  placeholder="আপনার নাম (Name)"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-2 border-b border-slate-200 dark:border-royal-600 dark:bg-royal-800 focus:outline-none focus:border-royal-500 text-sm dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                 <textarea 
                    placeholder="আপনার মতামত লিখুন..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 p-2 bg-slate-50 dark:bg-royal-900 rounded-lg text-sm focus:ring-1 focus:ring-royal-500 outline-none dark:text-white"
                    rows={2}
                 />
                 <button 
                   type="submit"
                   disabled={!commentText.trim() || !userName.trim()}
                   className="bg-royal-600 text-white p-3 rounded-lg hover:bg-royal-700 disabled:opacity-50 transition"
                 >
                    <Send className="w-5 h-5" />
                 </button>
              </div>
           </form>

           {/* Comment List */}
           <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="mt-1">
                      <UserCircle className="w-8 h-8 text-slate-300 dark:text-royal-600" />
                    </div>
                    <div className="bg-white dark:bg-royal-800 p-3 rounded-lg rounded-tl-none shadow-sm border border-slate-100 dark:border-royal-700 flex-1">
                       <div className="flex justify-between items-center mb-1">
                         <span className="font-bold text-sm dark:text-slate-200">{comment.user}</span>
                         <span className="text-[10px] text-slate-400">
                           {new Date(comment.timestamp).toLocaleDateString()}
                         </span>
                       </div>
                       <p className="text-sm text-slate-700 dark:text-slate-300">{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-400 text-sm italic py-4">এখনও কেউ মন্তব্য করেননি। আপনিই প্রথম মন্তব্য করুন!</p>
              )}
           </div>
        </div>

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