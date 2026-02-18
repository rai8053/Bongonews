
import { NewsItem, Comment } from '../types';
import { INITIAL_NEWS, API_BASE_URL } from '../constants';

const STORAGE_KEY = 'bongo_news_db';
const BOOKMARK_KEY = 'bongo_news_bookmarks';
const LIKED_KEY = 'bongo_news_likes'; 

/**
 * Fetch news from VPS backend if available, otherwise fallback to local storage
 */
export const getNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/news`);
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (e) {
    console.error("VPS fetch failed, falling back to local storage", e);
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NEWS));
    return INITIAL_NEWS;
  }
  return JSON.parse(stored);
};

export const fetchFromExternalApi = async (url: string): Promise<any> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("External API failed");
  return await response.json();
};

export const getNewsSync = (): NewsItem[] => {
   const stored = localStorage.getItem(STORAGE_KEY);
   return stored ? JSON.parse(stored) : INITIAL_NEWS;
}

export const saveNewsItem = async (item: NewsItem): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/api/news`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
  } catch (e) {
    console.warn("Could not sync with VPS", e);
  }

  const current = getNewsSync();
  if (!item.views) item.views = 0;
  if (!item.likes) item.likes = 0;
  if (!item.comments) item.comments = [];
  
  const updated = [item, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const saveMultipleNewsItems = async (items: NewsItem[]): Promise<void> => {
  for (const item of items) {
    await saveNewsItem(item);
  }
};

export const getNewsById = (id: string): NewsItem | undefined => {
  const news = getNewsSync();
  return news.find((n) => n.id === id);
};

// --- Engagement System ---

export const incrementView = async (id: string): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/api/news/${id}/view`, { method: 'POST' });
  } catch (e) { /* ignore */ }

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
  fetch(`${API_BASE_URL}/api/news/${newsId}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment)
  }).catch(() => {});

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

  fetch(`${API_BASE_URL}/api/news/${id}/like`, { method: 'POST' }).catch(() => {});

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
