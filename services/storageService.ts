
import { NewsItem, Comment } from '../types';
import { INITIAL_NEWS } from '../constants';

const STORAGE_KEY = 'bongo_news_db';
const BOOKMARK_KEY = 'bongo_news_bookmarks';
const LIKED_KEY = 'bongo_news_likes'; 

export const getNews = async (): Promise<NewsItem[]> => {
  // Fallback to Local Storage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Initialize with Mock Data if first time
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NEWS));
    return INITIAL_NEWS;
  }
  return JSON.parse(stored);
};

// Non-Async version for immediate rendering (will be hydrated by effect)
export const getNewsSync = (): NewsItem[] => {
   const stored = localStorage.getItem(STORAGE_KEY);
   return stored ? JSON.parse(stored) : INITIAL_NEWS;
}

export const saveNewsItem = async (item: NewsItem): Promise<void> => {
  // Save Locally
  const current = getNewsSync();
  // Ensure new items have default counts
  if (!item.views) item.views = 0;
  if (!item.likes) item.likes = 0;
  if (!item.comments) item.comments = [];
  
  const updated = [item, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getNewsById = (id: string): NewsItem | undefined => {
  const news = getNewsSync();
  return news.find((n) => n.id === id);
};

// --- Engagement System ---

export const incrementView = (id: string): void => {
  const allNews = getNewsSync();
  const updated = allNews.map(n => {
    if (n.id === id) {
      return { ...n, views: (n.views || 0) + 1 };
    }
    return n;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const addComment = (newsId: string, comment: Comment): NewsItem | null => {
  const allNews = getNewsSync();
  let updatedItem = null;
  
  const updated = allNews.map(n => {
    if (n.id === newsId) {
      const newComments = [comment, ...(n.comments || [])];
      updatedItem = { ...n, comments: newComments };
      return updatedItem;
    }
    return n;
  });
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updatedItem;
};

export const toggleLikeNews = (id: string): { success: boolean; isLiked: boolean; newCount: number } => {
  const likedIds = JSON.parse(localStorage.getItem(LIKED_KEY) || '[]');
  const isLiked = likedIds.includes(id);
  
  let newCount = 0;
  const allNews = getNewsSync();
  
  const updatedNews = allNews.map(n => {
    if (n.id === id) {
      newCount = isLiked ? Math.max(0, (n.likes || 0) - 1) : (n.likes || 0) + 1;
      return { ...n, likes: newCount };
    }
    return n;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNews));
  
  if (isLiked) {
    const filtered = likedIds.filter((lid: string) => lid !== id);
    localStorage.setItem(LIKED_KEY, JSON.stringify(filtered));
  } else {
    likedIds.push(id);
    localStorage.setItem(LIKED_KEY, JSON.stringify(likedIds));
  }

  return { success: true, isLiked: !isLiked, newCount };
};

export const isNewsLikedByUser = (id: string): boolean => {
  const likedIds = JSON.parse(localStorage.getItem(LIKED_KEY) || '[]');
  return likedIds.includes(id);
};

// --- Bookmark System ---

export const getBookmarks = (): string[] => {
  const stored = localStorage.getItem(BOOKMARK_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
};

export const toggleBookmark = (id: string): boolean => {
  const bookmarks = getBookmarks();
  const isBookmarked = bookmarks.includes(id);
  
  let updated;
  if (isBookmarked) {
    updated = bookmarks.filter(bId => bId !== id);
  } else {
    updated = [id, ...bookmarks];
  }
  
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(updated));
  return !isBookmarked;
};

export const isBookmarked = (id: string): boolean => {
  const bookmarks = getBookmarks();
  return bookmarks.includes(id);
};

export const getBookmarkedNews = (): NewsItem[] => {
  const ids = getBookmarks();
  const allNews = getNewsSync();
  return allNews.filter(item => ids.includes(item.id));
};
