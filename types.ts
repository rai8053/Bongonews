
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
  category: string;
  location?: string; // e.g., "Kolkata", "Siliguri", "Barasat"
  imageUrl?: string;
  createdAt: number;
  readTime?: string;
  views: number;
  likes: number;
  comments: Comment[];
  isSponsored?: boolean; // For monetization
  affiliate?: {
    link: string;
    text: string;
  };
}

export interface TranscribeResponse {
  text: string;
  segments?: Array<{
    start: number;
    end: number;
    text: string;
  }>;
  language?: string;
}

export enum Category {
  ALL = 'All News',
  TRENDING = 'Trending', // New Dynamic Category
  MY_AREA = 'My Area', 
  KOLKATA = 'Kolkata',
  DISTRICT = 'Districts',
  STATE = 'West Bengal',
  BREAKING = 'Breaking',
}