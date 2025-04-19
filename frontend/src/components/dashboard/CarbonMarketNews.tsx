import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ExternalLink, Newspaper, TrendingUp, Lightbulb, BookOpen, Loader } from 'lucide-react';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  source: string;
  category: 'policy' | 'market' | 'technology' | 'research';
  url: string;
}

const categoryConfig = {
  policy: {
    icon: BookOpen,
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
  },
  market: {
    icon: TrendingUp,
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
  },
  technology: {
    icon: Lightbulb,
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
  },
  research: {
    icon: BookOpen,
    color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
  }
};

// Mock data to ensure the UI always has content
const mockNewsData: NewsItem[] = [
  {
    id: 'news1',
    title: 'EU Carbon Market Reform Shows Promise',
    summary: 'New regulations aim to strengthen carbon pricing mechanisms across European markets.',
    date: '2025-04-18',
    source: 'Carbon Insights',
    category: 'policy',
    url: 'https://example.com/news1'
  },
  {
    id: 'news2',
    title: 'Global Carbon Credit Trading Volume Surges',
    summary: 'Trading volumes in global carbon markets reached new heights this quarter.',
    date: '2025-04-17',
    source: 'Market Watch',
    category: 'market',
    url: 'https://example.com/news2'
  },
  {
    id: 'news3',
    title: 'Breakthrough in Carbon Capture Technology',
    summary: 'Scientists develop more efficient carbon capture method using novel materials.',
    date: '2025-04-16',
    source: 'Tech Review',
    category: 'technology',
    url: 'https://example.com/news3'
  },
  {
    id: 'news4',
    title: 'Carbon Market Research Reveals New Trends',
    summary: 'Latest research indicates shifting patterns in global carbon trading strategies.',
    date: '2025-04-15',
    source: 'Climate Research',
    category: 'research',
    url: 'https://example.com/news4'
  }
];

export const CarbonMarketNews: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>(mockNewsData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const options = {
          method: 'GET',
          url: 'https://carbon-market-news.p.rapidapi.com/news/latest',
          headers: {
            'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'carbon-market-news.p.rapidapi.com'
          }
        };

        const response = await axios.request(options);
        
        if (response.data && Array.isArray(response.data)) {
          const formattedNews = response.data.map((item: any) => ({
            id: item.id || crypto.randomUUID(),
            title: item.title,
            summary: item.description || item.summary,
            date: new Date(item.publishedAt).toLocaleDateString(),
            source: item.source.name,
            category: categorizeNews(item.title),
            url: item.url
          }));
          setNews(formattedNews);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        // Fallback to mock data on error
        setNews(mockNewsData);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000); // Refresh every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  const categorizeNews = (title: string): 'policy' | 'market' | 'technology' | 'research' => {
    const lowercase = title.toLowerCase();
    
    if (lowercase.includes('policy') || lowercase.includes('regulation') || lowercase.includes('law')) {
      return 'policy';
    } else if (lowercase.includes('price') || lowercase.includes('market') || lowercase.includes('trading')) {
      return 'market';
    } else if (lowercase.includes('tech') || lowercase.includes('innovation')) {
      return 'technology';
    } else {
      return 'research';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader className="h-8 w-8 text-emerald-600 dark:text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {news.map((item) => {
        const CategoryIcon = categoryConfig[item.category].icon;
        const categoryColorClass = categoryConfig[item.category].color;
        
        return (
          <div 
            key={item.id}
            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded flex-shrink-0 ${categoryColorClass}`}>
                <CategoryIcon className="h-5 w-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <a 
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 hover:underline mb-1"
                >
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {item.title}
                  </h4>
                  <ExternalLink className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                
                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                  {item.summary}
                </p>
                
                <div className="flex justify-between items-center mt-1 text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    {item.source}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded ${categoryColorClass}`}>
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {item.date}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CarbonMarketNews;