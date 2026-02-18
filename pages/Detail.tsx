
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNews, getNewsById, incrementView, addComment, toggleLikeNews, isNewsLikedByUser } from '../services/storageService';
import { NewsItem, Comment } from '../types';
import { ArrowLeft, Calendar, Eye, Heart, MessageCircle, Send, UserCircle } from 'lucide-react';
import NewsCard from '../components/NewsCard';

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [userName, setUserName] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (id) {
      incrementView(id);
      const item = getNewsById(id);
      if (item) {
        setNews(item);
        setIsLiked(isNewsLikedByUser(id));
        setLikeCount(item.likes || 0);
        setComments(item.comments || []);
        window.scrollTo(0, 0);
        
        getNews().then((allNews) => {
          const related = allNews
            .filter(n => n.category === item.category && n.id !== item.id)
            .sort(() => 0.5 - Math.random()) 
            .slice(0, 3);
          setRelatedNews(related);
        });
      }
    }
  }, [id]);

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

  if (!news) return <div className="p-10 text-center font-bengali">লোড হচ্ছে...</div>;

  return (
    <div className="pb-24 bg-white min-h-screen font-bengali">
      <div className="w-full h-[40vh] md:h-[50vh] relative group">
        <img src={news.imageUrl} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
        <Link to="/" className="absolute top-4 left-4 p-2 bg-black/30 backdrop-blur-md rounded-full text-white">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <button 
          onClick={handleLike}
          className="absolute bottom-[-20px] right-8 p-4 rounded-full shadow-xl transition-transform transform active:scale-90 z-20 bg-white text-royal-600"
        >
           <Heart className={`w-8 h-8 ${isLiked ? 'fill-red-500 text-red-500' : 'text-slate-300'}`} />
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-5 -mt-20 relative z-10">
        <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full mb-4">
          {news.category}
        </span>
        
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">
          {news.headline}
        </h1>

        <div className="flex items-center gap-4 text-sm text-slate-500 mb-8 border-b border-slate-100 pb-6">
           <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(news.createdAt).toLocaleDateString('bn-BD')}</div>
           <div className="flex items-center gap-1"><Eye className="w-4 h-4" /> {news.views} দেখা হয়েছে</div>
        </div>

        <article className="prose prose-slate leading-loose max-w-none text-slate-800">
          {news.content.split('\n').map((para, i) => (
            <p key={i} className="mb-6 text-lg">{para}</p>
          ))}
        </article>

        <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
             <MessageCircle className="w-5 h-5" /> মন্তব্য ({comments.length})
           </h3>

           <form onSubmit={handlePostComment} className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <input 
                placeholder="আপনার নাম"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-2 border-b border-slate-100 mb-2 focus:outline-none text-sm"
              />
              <div className="flex gap-2">
                 <textarea 
                    placeholder="আপনার মতামত লিখুন..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 p-2 bg-slate-50 rounded-lg text-sm outline-none"
                    rows={2}
                 />
                 <button type="submit" className="bg-indigo-600 text-white p-3 rounded-xl"><Send className="w-5 h-5" /></button>
              </div>
           </form>

           <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <UserCircle className="w-8 h-8 text-slate-300" />
                  <div className="bg-white p-3 rounded-xl border border-slate-100 flex-1">
                     <div className="flex justify-between items-center mb-1">
                       <span className="font-bold text-sm">{comment.user}</span>
                       <span className="text-[10px] text-slate-400">{new Date(comment.timestamp).toLocaleDateString()}</span>
                     </div>
                     <p className="text-sm text-slate-700">{comment.text}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>

        <div className="mt-12 border-t border-slate-100 pt-8">
          <h3 className="text-2xl font-bold mb-6 border-l-4 border-indigo-600 pl-3">আরও খবর</h3>
          <div className="grid gap-4">
            {relatedNews.map(item => <NewsCard key={item.id} item={item} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
