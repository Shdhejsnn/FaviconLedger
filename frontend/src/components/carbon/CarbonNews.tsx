import React, { useEffect, useState, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Loader, Newspaper, RefreshCw, ArrowUpRight, AlertCircle, TrendingUp } from 'lucide-react';
import axios from 'axios';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source_id: string;
  image_url?: string;
  source: 'newsdata' | 'gnews' | 'carbonpulse';
  category?: string;
  isNew?: boolean;
}

interface NewsResponse {
  status: string;
  articles: NewsArticle[];
  error?: string;
}

// NewsData.io API
const fetchNewsDataArticles = async (): Promise<NewsResponse> => {
  try {
    const response = await axios.get('https://newsdata.io/api/1/news', {
      params: {
        apikey: 'pub_8156513aabd8c7e895e4b7736871655fb118d',
        q: 'carbon market OR carbon credits OR emissions trading',
        language: 'en',
        category: 'business,environment'
      }
    });

    if (response.data.status === 'success') {
      const oneHourAgo = new Date(Date.now() - 3600000);
      
      const articles = response.data.results.map((article: any) => ({
        id: `newsdata-${article.article_id || Math.random().toString(36).substr(2, 9)}`,
        title: article.title,
        description: article.description || article.content || 'No description available',
        link: article.link,
        pubDate: article.pubDate,
        source_id: article.source_id,
        image_url: article.image_url,
        source: 'newsdata' as const,
        category: 'general',
        isNew: new Date(article.pubDate) > oneHourAgo
      }));

      return {
        status: 'success',
        articles
      };
    } else {
      throw new Error(response.data.message || 'Failed to fetch news from NewsData.io');
    }
  } catch (error: any) {
    console.error('Error fetching from NewsData.io:', error);
    return {
      status: 'error',
      articles: [],
      error: error.message || 'Failed to fetch news from NewsData.io'
    };
  }
};

// GNews API
const fetchGNewsArticles = async (): Promise<NewsResponse> => {
  try {
    const response = await axios.get('https://gnews.io/api/v4/search', {
      params: {
        q: 'carbon market OR carbon trading OR emissions',
        lang: 'en',
        max: 10,
        token: '90690f4d8daa77e781d7dc941471c730'
      }
    });

    if (response.data.articles) {
      const oneHourAgo = new Date(Date.now() - 3600000);
      
      const articles = response.data.articles.map((article: any) => ({
        id: `gnews-${Math.random().toString(36).substr(2, 9)}`,
        title: article.title,
        description: article.description,
        link: article.url,
        pubDate: article.publishedAt,
        source_id: article.source.name,
        image_url: article.image,
        source: 'gnews' as const,
        category: 'financial',
        isNew: new Date(article.publishedAt) > oneHourAgo
      }));

      return {
        status: 'success',
        articles
      };
    } else {
      throw new Error('Failed to fetch news from GNews');
    }
  } catch (error: any) {
    console.error('Error fetching from GNews:', error);
    return {
      status: 'error',
      articles: [],
      error: error.message || 'Failed to fetch news from GNews'
    };
  }
};

// Carbon Pulse mock data
const fetchCarbonPulseArticles = async (): Promise<NewsResponse> => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentDate = new Date().toISOString();
        
        const mockArticles: NewsArticle[] = [
          {
            id: 'carbonpulse-1',
            title: 'EU Carbon Market Weekly: EUA prices stable amid mixed signals',
            description: 'EU carbon prices stayed in a narrow range this week as traders weighed bearish economic data against technical support.',
            link: 'https://carbon-pulse.com/example-article-1',
            pubDate: currentDate,
            source_id: 'Carbon Pulse',
            image_url: 'https://images.pexels.com/photos/2990650/pexels-photo-2990650.jpeg',
            source: 'carbonpulse',
            category: 'market analysis',
            isNew: true
          },
          {
            id: 'carbonpulse-2',
            title: 'Voluntary carbon market faces scrutiny over quality standards',
            description: 'The voluntary carbon market is seeing increased regulatory attention as concerns over credit quality and integrity continue to rise.',
            link: 'https://carbon-pulse.com/example-article-2',
            pubDate: new Date(Date.now() - 3600000 * 3).toISOString(),
            source_id: 'Carbon Pulse',
            image_url: 'https://images.pexels.com/photos/4218883/pexels-photo-4218883.jpeg',
            source: 'carbonpulse',
            category: 'regulation',
            isNew: false
          },
          {
            id: 'carbonpulse-3',
            title: 'China ETS expands scope to include more industrial sectors',
            description: "China's national emissions trading scheme will add new industrial sectors next year as part of efforts to reach carbon neutrality by 2060.",
            link: 'https://carbon-pulse.com/example-article-3',
            pubDate: new Date(Date.now() - 3600000 * 5).toISOString(),
            source_id: 'Carbon Pulse',
            image_url: 'https://images.pexels.com/photos/2965773/pexels-photo-2965773.jpeg',
            source: 'carbonpulse',
            category: 'policy',
            isNew: false
          }
        ];

        resolve({
          status: 'success',
          articles: mockArticles
        });
      }, 500);
    });
  } catch (error: any) {
    console.error('Error fetching from Carbon Pulse:', error);
    return {
      status: 'error',
      articles: [],
      error: error.message || 'Failed to fetch news from Carbon Pulse'
    };
  }
};

const fetchAllNews = async (): Promise<NewsResponse> => {
  try {
    const [newsdataResponse, gnewsResponse, carbonPulseResponse] = await Promise.allSettled([
      fetchNewsDataArticles(),
      fetchGNewsArticles(),
      fetchCarbonPulseArticles()
    ]);

    const allArticles: NewsArticle[] = [];
    
    if (newsdataResponse.status === 'fulfilled') {
      allArticles.push(...newsdataResponse.value.articles);
    }
    
    if (gnewsResponse.status === 'fulfilled') {
      allArticles.push(...gnewsResponse.value.articles);
    }
    
    if (carbonPulseResponse.status === 'fulfilled') {
      allArticles.push(...carbonPulseResponse.value.articles);
    }
    
    allArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    if (allArticles.length === 0) {
      return {
        status: 'error',
        articles: [],
        error: 'Failed to fetch news from all sources'
      };
    }

    return {
      status: 'success',
      articles: allArticles
    };
  } catch (error: any) {
    console.error('Error fetching all news:', error);
    return {
      status: 'error',
      articles: [],
      error: error.message || 'Failed to fetch news from all sources'
    };
  }
};

const extractTopics = (articles: NewsArticle[]): string[] => {
  const topics = new Set<string>();
  const keywords = [
    'carbon market', 'emissions trading', 'carbon credits', 'carbon pricing',
    'net zero', 'climate policy', 'carbon tax', 'carbon offset',
    'voluntary market', 'compliance market', 'renewable energy'
  ];
  
  articles.forEach(article => {
    const content = `${article.title} ${article.description}`.toLowerCase();
    keywords.forEach(keyword => {
      if (content.includes(keyword.toLowerCase())) {
        topics.add(keyword);
      }
    });
  });
  
  return Array.from(topics).slice(0, 6);
};

const NewsCard: React.FC<{ article: NewsArticle }> = ({ article }) => {
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'gnews':
        return <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
      case 'carbonpulse':
        return <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Newspaper className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'gnews':
        return 'bg-emerald-100 dark:bg-emerald-900/30';
      case 'carbonpulse':
        return 'bg-amber-100 dark:bg-amber-900/30';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30';
    }
  };

  const sourceColors = {
    newsdata: 'border-blue-200 hover:border-blue-300',
    gnews: 'border-emerald-200 hover:border-emerald-300',
    carbonpulse: 'border-amber-200 hover:border-amber-300',
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 ${sourceColors[article.source]} transition-all duration-300 p-4 flex flex-col h-full hover:shadow-md opacity-0 animate-[fadeIn_0.5s_ease_forwards]`}>
      {article.image_url && (
        <div className="relative">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {article.isNew && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
              NEW
            </div>
          )}
        </div>
      )}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${getSourceColor(article.source)}`}>
          {getSourceIcon(article.source)}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(article.pubDate), { addSuffix: true })}
          </span>
          {article.category && (
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
              {article.category}
            </span>
          )}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {article.title}
      </h3>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
        {article.description}
      </p>
      
      <div className="flex items-center justify-between mt-auto">
        <span className="text-sm font-medium">
          {article.source === 'newsdata' && (
            <span className="text-blue-600 dark:text-blue-400">{article.source_id}</span>
          )}
          {article.source === 'gnews' && (
            <span className="text-emerald-600 dark:text-emerald-400">{article.source_id}</span>
          )}
          {article.source === 'carbonpulse' && (
            <span className="text-amber-600 dark:text-amber-400">{article.source_id}</span>
          )}
        </span>
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:underline group"
        >
          Read More
          <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </div>
  );
};

const TopicButton: React.FC<{
  topic: string;
  selected: boolean;
  onClick: () => void;
}> = ({ topic, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      selected
        ? 'bg-emerald-600 text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
    }`}
  >
    {topic}
  </button>
);

const SourceFilter: React.FC<{
  selectedSources: string[];
  onToggleSource: (source: string) => void;
}> = ({ selectedSources, onToggleSource }) => {
  const sources = [
    { id: 'newsdata', name: 'NewsData', icon: Newspaper, color: 'text-blue-600' },
    { id: 'gnews', name: 'GNews', icon: TrendingUp, color: 'text-emerald-600' },
    { id: 'carbonpulse', name: 'Carbon Pulse', icon: AlertCircle, color: 'text-amber-600' }
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {sources.map(source => {
        const Icon = source.icon;
        const isSelected = selectedSources.includes(source.id);
        
        return (
          <button
            key={source.id}
            onClick={() => onToggleSource(source.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
              isSelected 
                ? `bg-opacity-20 bg-${source.color.split('-')[1]}-100 border border-${source.color.split('-')[1]}-200` 
                : 'bg-gray-100 border border-gray-200 dark:bg-gray-800 dark:border-gray-700'
            }`}
          >
            <Icon className={`h-4 w-4 ${isSelected ? source.color : 'text-gray-500'}`} />
            <span className={isSelected ? source.color : 'text-gray-700 dark:text-gray-300'}>
              {source.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};

const CarbonNews: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>(['newsdata', 'gnews', 'carbonpulse']);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchNews = useCallback(async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');
      
      const response = await fetchAllNews();
      
      if (response.status === 'success') {
        setNews(response.articles);
        setLastUpdated(new Date());
        const extractedTopics = extractTopics(response.articles);
        setTopics(extractedTopics);
      } else {
        throw new Error(response.error || 'Failed to fetch news');
      }
    } catch (err: any) {
      console.error('Error fetching news:', err);
      setError('Failed to load news. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (news.length > 0) {
      let filtered = [...news];
      
      if (selectedSources.length > 0) {
        filtered = filtered.filter(article => selectedSources.includes(article.source));
      }
      
      if (selectedTopic) {
        const topicLower = selectedTopic.toLowerCase();
        filtered = filtered.filter(
          article => 
            article.title.toLowerCase().includes(topicLower) || 
            (article.description && article.description.toLowerCase().includes(topicLower))
        );
      }
      
      setFilteredNews(filtered);
    }
  }, [news, selectedTopic, selectedSources]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    let intervalId: number | null = null;
    
    if (autoRefresh) {
      intervalId = window.setInterval(() => {
        fetchNews(true);
      }, 5 * 60 * 1000);
    }
    
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefresh, fetchNews]);

  const handleRefresh = () => {
    fetchNews(true);
  };

  const toggleSource = (source: string) => {
    setSelectedSources(prev => {
      if (prev.includes(source)) {
        if (prev.length === 1) return prev;
        return prev.filter(s => s !== source);
      } else {
        return [...prev, source];
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="h-10 w-10 text-emerald-600 dark:text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <Newspaper className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {error}
          </h3>
          <button 
            onClick={handleRefresh}
            className="text-emerald-600 hover:text-emerald-500 flex items-center justify-center mx-auto gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Carbon Market News</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Auto-refresh</span>
              <button 
                className={`w-10 h-5 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${autoRefresh ? 'bg-emerald-500 justify-end' : 'bg-gray-300 justify-start'}`}
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300" />
              </button>
            </div>
            <button 
              onClick={handleRefresh} 
              className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Stay updated with the latest news and developments in the carbon market
        </p>
        {lastUpdated && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      <SourceFilter 
        selectedSources={selectedSources}
        onToggleSource={toggleSource}
      />

      {topics.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Trending Topics</h2>
          <div className="flex flex-wrap gap-2">
            {selectedTopic && (
              <TopicButton
                topic="All Topics"
                selected={false}
                onClick={() => setSelectedTopic(null)}
              />
            )}
            {topics.map((topic) => (
              <TopicButton
                key={topic}
                topic={topic}
                selected={selectedTopic === topic}
                onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
              />
            ))}
          </div>
        </div>
      )}

      {filteredNews.length === 0 ? (
        <div className="text-center py-12">
          <Newspaper className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No news articles found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Try changing your filters or refreshing the page
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CarbonNews;