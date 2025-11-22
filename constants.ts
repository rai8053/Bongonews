import { Category, NewsItem } from './types';

export const APP_NAME = "BongoNews";

export const VPS_ENDPOINT = "https://api.example.com/transcribe";
export const DEFAULT_VPS_KEY = "demo-key";

// Categories for the Tabs
export const CATEGORIES = [
  Category.BREAKING,
  Category.KOLKATA,
  Category.DISTRICT,
  Category.STATE,
];

// Helper to generate consistent AI images
const getAiImage = (prompt: string) => 
  `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true`;

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: '1',
    headline: 'নিউ টাউনে নতুন মেট্রো স্টেশনের উদ্বোধন করলেন মুখ্যমন্ত্রী',
    previewText: 'যাত্রীদের দীর্ঘদিনের অপেক্ষার অবসান ঘটিয়ে অবশেষে চালু হলো নতুন রুট...',
    content: 'দীর্ঘ প্রতীক্ষার পর অবশেষে নিউ টাউন বাসীদের জন্য সুখবর। আজ সকালে মাননীয়া মুখ্যমন্ত্রী নতুন মেট্রো স্টেশনের উদ্বোধন করলেন।',
    category: Category.KOLKATA,
    location: 'New Town',
    imageUrl: getAiImage('Kolkata Metro Station Inauguration crowd ribbon cutting photorealistic'),
    createdAt: Date.now() - 120000, // 2 mins ago
    readTime: '3 min',
    views: 1205
  },
  {
    id: '2',
    headline: 'মুর্শিদাবাদে ঐতিহাসিক পর্যটন কেন্দ্রে পর্যটকদের ভিড়',
    previewText: 'শীতের মরসুমে হাজার হাজার মানুষ ভিড় জমিয়েছেন হাজারদুয়ারিতে...',
    content: 'মুর্শিদাবাদের হাজারদুয়ারি প্যালেসে এই বছর রেকর্ড সংখ্যক পর্যটক এসেছেন। স্থানীয় ব্যবসায়ীদের মুখে হাসি ফুটেছে।',
    category: Category.DISTRICT,
    location: 'Murshidabad',
    imageUrl: getAiImage('Hazarduari Palace Murshidabad historic india building sunny day tourists'),
    createdAt: Date.now() - 300000, // 5 mins ago
    readTime: '4 min',
    views: 850
  },
  {
    id: '3',
    headline: 'দার্জিলিং-এ তুষারপাতের সম্ভাবনা, পর্যটকদের জন্য সুখবর',
    previewText: 'আবহাওয়া দপ্তরের পূর্বাভাস অনুযায়ী আগামী কাল থেকেই নামতে পারে তাপমাত্রা...',
    content: 'উত্তরবঙ্গের পাহাড়ি এলাকাগুলিতে তাপমাত্রার পারদ নামছে। সান্দাকফুতে হালকা তুষারপাতের খবর পাওয়া গেছে।',
    category: Category.DISTRICT,
    location: 'Darjeeling',
    imageUrl: getAiImage('Darjeeling tea garden snow mountain kanchenjunga view'),
    createdAt: Date.now() - 600000, // 10 mins ago
    readTime: '2 min',
    views: 3400
  },
  {
    id: '4',
    headline: 'রাজ্যজুড়ে শুরু হচ্ছে "দুয়ারে সরকার" ক্যাম্প',
    previewText: 'আগামী ১লা তারিখ থেকে রাজ্যের প্রতিটি ব্লকে বসবে ক্যাম্প...',
    content: 'রাজ্য সরকারের উদ্যোগে আবারও শুরু হচ্ছে দুয়ারে সরকার কর্মসূচি। লক্ষ্মীর ভাণ্ডার সহ একাধিক প্রকল্পের সুবিধা পাওয়া যাবে।',
    category: Category.STATE,
    location: 'West Bengal',
    imageUrl: getAiImage('West Bengal government official camp village crowd india'),
    createdAt: Date.now() - 900000, // 15 mins ago
    readTime: '5 min',
    views: 920
  },
  {
    id: '5',
    headline: 'কলকাতায় আজ বিকেলে কালবৈশাখীর পূর্বাভাস',
    previewText: 'আলিপুর আবহাওয়া দপ্তরের সতর্কবার্তা, উপকূলবর্তী এলাকায় জলোচ্ছ্বাস...',
    content: 'গরমের দাবদাহ থেকে কিছুটা স্বস্তি মিলতে পারে আজ বিকেলেই। আলিপুর আবহাওয়া দপ্তর জানিয়েছে।',
    category: Category.KOLKATA,
    location: 'Kolkata',
    imageUrl: getAiImage('Kolkata city street rain storm dark clouds victoria memorial'),
    createdAt: Date.now() - 1200000, // 20 mins ago
    readTime: '2 min',
    views: 1500
  },
  {
    id: '6',
    headline: 'সেন ব্রাদার্স মিষ্টান্ন ভাণ্ডারে পুজো স্পেশাল ছাড়!',
    previewText: 'এই পুজোয় মিষ্টি প্রেমীদের জন্য সুখবর। সেন ব্রাদার্স নিয়ে এলো নতুন স্বাদের সন্দেশ...',
    content: 'সেন ব্রাদার্স মিষ্টান্ন ভাণ্ডার উত্তর কলকাতার একটি ঐতিহ্যবাহী দোকান। এবারের পুজোয় তারা নিয়ে এসেছে অভিনব চকোলেট সন্দেশ এবং ম্যাঙ্গো দই।',
    category: Category.KOLKATA,
    location: 'Kolkata',
    imageUrl: getAiImage('Bengali sweets shop display rosogolla sandesh'),
    createdAt: Date.now() - 1500000, 
    readTime: '1 min',
    views: 5000,
    isSponsored: true
  },
  {
    id: '7',
    headline: 'গরমের সেরা ৫টি এসি - দাম এবং ফিচার',
    previewText: 'এই গরমে কোন এসি কিনবেন ভাবছেন? দেখে নিন আমাদের বাছাই করা সেরা ৫টি মডেলের তালিকা...',
    content: 'গরমের তীব্রতা বাড়ার সাথে সাথে এসির চাহিদাও বাড়ছে। আজকের প্রতিবেদনে আমরা আলোচনা করব ভোল্টাস এবং এলজি-র নতুন মডেলগুলি নিয়ে যা বিদ্যুৎ সাশ্রয়ী এবং দ্রুত ঠান্ডা করে।',
    category: Category.STATE,
    location: 'West Bengal',
    imageUrl: getAiImage('Modern living room air conditioner wall cool blue light'),
    createdAt: Date.now() - 1800000,
    readTime: '5 min',
    views: 2300,
    affiliate: {
      link: 'https://amazon.in',
      text: 'Check Best Price on Amazon'
    }
  }
];