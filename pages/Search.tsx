import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getNews } from '../services/storageService';
import { NewsItem } from '../types';
import NewsCard from '../components/NewsCard';
import { Search as SearchIcon, Frown } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<NewsItem[]>([]);

  useEffect(() => {
    if (query) {
      const allNews = getNews();
      const filtered = allNews.filter(item => 
        item.headline.toLowerCase().includes(query.toLowerCase()) || 
        item.content.toLowerCase().includes(query.toLowerCase()) ||
        item.location?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-royal-900 pb-20">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
            <SearchIcon className="w-6 h-6 text-royal-600 dark:text-bengal-500" />
            Search Results
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Showing results for: <span className="font-bold text-royal-600 dark:text-bengal-500">"{query}"</span>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {results.length > 0 ? (
            results.map(item => (
              <NewsCard key={item.id} item={item} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
              <Frown className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">No news found for "{query}"</p>
              <p className="text-sm">Try searching for "Kolkata", "Metro", or "Weather".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;