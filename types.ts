
export type ContentType = 'STORY' | 'EVENT' | 'DEAL' | 'WEATHER' | 'TRAFFIC';

export interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: number;
}

export interface NewsItem {
  id: string;
  headline: string;
  previewText: string;
  content: string;
  type: ContentType;
  city: string;
  neighborhood?: string;
  imageUrl?: string;
  createdAt: number;
  readTime?: string;
  views: number;
  likes: number;
  comments: Comment[];
  isSponsored?: boolean;
  externalLink?: string;
  // Adding category and affiliate to fix "Property does not exist" errors
  category?: string;
  affiliate?: {
    link: string;
    text?: string;
  };
}

export interface CityConfig {
  id: string;
  name: string;
  neighborhoods: string[];
  rssFeeds: string[];
  eventSources: string[];
}

export enum Category {
  STORY = 'Top Stories',
  EVENT = 'Weekend Events',
  DEAL = 'Local Deals',
  INFO = 'Weather & Traffic'
}