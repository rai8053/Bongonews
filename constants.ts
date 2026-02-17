
import { CityConfig, NewsItem } from './types';

export const APP_NAME = "LocalBeat";

export const CITIES: CityConfig[] = [
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    neighborhoods: ['Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield'],
    rssFeeds: ['TOI Bengaluru', 'Deccan Herald'],
    eventSources: ['Eventbrite Bengaluru']
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    neighborhoods: ['Bandra', 'Andheri', 'Colaba', 'Juhu'],
    rssFeeds: ['Hindustan Times Mumbai'],
    eventSources: ['BookMyShow Mumbai']
  },
  {
    id: 'delhi',
    name: 'Delhi',
    neighborhoods: ['South Delhi', 'Connaught Place', 'Dwarka'],
    rssFeeds: ['NDTV Delhi'],
    eventSources: ['EventsHigh Delhi']
  }
];

const getAiImage = (prompt: string) => 
  `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=450&nologo=true`;

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'b1',
    headline: 'New Metro Line connecting Silk Board to KR Puram opens Friday',
    previewText: 'The long-awaited Outer Ring Road metro line is finally opening its doors to commuters...',
    content: 'Commuters in Bengaluru have a reason to celebrate. The BMRCL confirmed that the ORR line is operational. This will reduce travel time by 40 minutes for techies working in HSR and Bellandur.',
    type: 'STORY',
    category: 'Top Stories',
    city: 'bengaluru',
    neighborhood: 'HSR Layout',
    imageUrl: getAiImage('Modern Bangalore Metro train on elevated track blue sky'),
    createdAt: Date.now(),
    readTime: '2 min',
    views: 1500,
    likes: 45,
    comments: []
  },
  {
    id: 'b2',
    headline: 'Sunday Soul Sante: Fashion & Art Market',
    previewText: 'Head to Jayamahal Palace this Sunday for the city\'s favorite flea market...',
    content: 'Experience the best of local art, music, and food. Over 200 stalls featuring hand-crafted goods.',
    type: 'EVENT',
    category: 'Weekend Events',
    city: 'bengaluru',
    imageUrl: getAiImage('Outdoor flea market india colorful stalls people'),
    createdAt: Date.now(),
    externalLink: 'https://insider.in',
    views: 800,
    likes: 22,
    comments: []
  },
  {
    id: 'b3',
    headline: '50% Off at Third Wave Coffee Koramangala',
    previewText: 'Exclusive deal for LocalBeat subscribers this weekend only...',
    content: 'Flash this newsletter at the Koramangala 4th Block outlet to avail 1+1 on all cold brews.',
    type: 'DEAL',
    category: 'Local Deals',
    city: 'bengaluru',
    neighborhood: 'Koramangala',
    imageUrl: getAiImage('Aesthetic coffee shop interior latte art'),
    createdAt: Date.now(),
    isSponsored: true,
    views: 3000,
    likes: 120,
    comments: []
  }
];