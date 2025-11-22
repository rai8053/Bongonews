import { NewsItem } from '../types';
import { INITIAL_NEWS } from '../constants';

const STORAGE_KEY = 'bongo_news_db';
const BOOKMARK_KEY = 'bongo_news_bookmarks';

export const getNews = (): NewsItem[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Initialize with mock data if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NEWS));
    return INITIAL_NEWS;
  }
  return JSON.parse(stored);
};

export const saveNewsItem = (item: NewsItem): void => {
  const current = getNews();
  const updated = [item, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getNewsById = (id: string): NewsItem | undefined => {
  const news = getNews();
  return news.find((n) => n.id === id);
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
  return !isBookmarked; // Return new state (true if added, false if removed)
};

export const isBookmarked = (id: string): boolean => {
  const bookmarks = getBookmarks();
  return bookmarks.includes(id);
};

export const getBookmarkedNews = (): NewsItem[] => {
  const ids = getBookmarks();
  const allNews = getNews();
  // Return news items that match the bookmarked IDs
  return allNews.filter(item => ids.includes(item.id));
};