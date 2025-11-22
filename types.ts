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
  views?: number;
  isSponsored?: boolean; // For monetization
  affiliate?: {
    link: string;
    text: string;
  };
}

export enum Category {
  ALL = 'All News',
  MY_AREA = 'My Area', // Special dynamic category
  KOLKATA = 'Kolkata',
  DISTRICT = 'Districts',
  STATE = 'West Bengal',
  BREAKING = 'Breaking',
}

export interface TranscribeResponse {
  text: string;
}

export interface VpsConfig {
  endpoint: string;
  apiKey: string;
}