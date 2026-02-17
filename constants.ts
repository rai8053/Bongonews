import { CityConfig, NewsItem } from './types';

export const APP_NAME = "বঙ্গ নিউজ";

// Updated to the IP provided: 154.12.117.202
export const API_BASE_URL = "http://154.12.117.202"; 

export const CITIES: CityConfig[] = [
  {
    id: 'kolkata',
    name: 'কলকাতা',
    neighborhoods: ['সল্টলেক', 'নিউ টাউন', 'বালিগঞ্জ', 'গড়িয়াহাট'],
    rssFeeds: ['Anandabazar Patrika', 'Sangbad Pratidin'],
    eventSources: ['Kolkata Events']
  },
  {
    id: 'howrah',
    name: 'হাওড়া',
    neighborhoods: ['শিবপুর', 'বেলুড়', 'বালি'],
    rssFeeds: ['Local Howrah News'],
    eventSources: ['Howrah Events']
  },
  {
    id: 'siliguri',
    name: 'শিলিগুড়ি',
    neighborhoods: ['প্রধান নগর', 'মাটিগাড়া', 'ভক্তিনগর'],
    rssFeeds: ['Uttarbanga Sambad'],
    eventSources: ['North Bengal Events']
  }
];

const getAiImage = (prompt: string) => 
  `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=450&nologo=true`;

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'b1',
    headline: 'কলকাতা মেট্রোর নতুন রুট উদ্বোধন হচ্ছে আগামী শুক্রবার',
    previewText: 'শহরবাসীর দীর্ঘ প্রতীক্ষার অবসান ঘটিয়ে চালু হচ্ছে নতুন মেট্রো পরিষেবা...',
    content: 'কলকাতা মেট্রো রেল কর্তৃপক্ষ জানিয়েছে যে আগামী শুক্রবার থেকে নতুন মেট্রো রুটটি জনসাধারণের জন্য খুলে দেওয়া হবে। এর ফলে যাতায়াতের সময় অনেকটা কমবে এবং যাত্রীরা স্বাচ্ছন্দ্যে ভ্রমণ করতে পারবেন।',
    type: 'STORY',
    category: 'সেরা খবর',
    city: 'kolkata',
    neighborhood: 'সল্টলেক',
    imageUrl: getAiImage('Modern Kolkata Metro train blue sky city background'),
    createdAt: Date.now(),
    readTime: '২ মিনিট',
    views: 1200,
    likes: 38,
    comments: []
  },
  {
    id: 'b2',
    headline: 'শিলিগুড়িতে শুরু হচ্ছে হস্তশিল্প মেলা',
    previewText: 'আগামী সপ্তাহ থেকে কাঞ্চনজঙ্ঘা স্টেডিয়াম চত্বরে শুরু হবে এই মেলা...',
    content: 'বাংলার বিভিন্ন প্রান্তের হস্তশিল্পীদের তৈরি পণ্য নিয়ে শুরু হচ্ছে এই মেলা। স্থানীয় সংস্কৃতির প্রসারে এই উদ্যোগ নেওয়া হয়েছে।',
    type: 'EVENT',
    category: 'সাপ্তাহিক অনুষ্ঠান',
    city: 'siliguri',
    imageUrl: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&q=80&w=800',
    createdAt: Date.now(),
    externalLink: 'https://events.example.com',
    views: 540,
    likes: 15,
    comments: []
  }
];