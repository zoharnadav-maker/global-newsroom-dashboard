'use client';

import { useState, useEffect, useCallback } from 'react';
import NewsCard from '@/components/NewsCard';
import ArticleModal from '@/components/ArticleModal';
import './page.css';

const categories = [
  { id: 'business', label: 'Business', query: 'business' },
  { id: 'tech', label: 'Technology', query: 'technology' },
  { id: 'science', label: 'Science', query: 'science' },
  { id: 'health', label: 'Health', query: 'health' },
  { id: 'sports', label: 'Sports', query: 'sports' },
  { id: 'entertainment', label: 'Entertainment', query: 'entertainment' },
  { id: 'general', label: 'General', query: 'general' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('general');
  const [news, setNews] = useState({});
  const [loading, setLoading] = useState({});
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [lastUpdated, setLastUpdated] = useState({});

  const fetchNews = useCallback(async (category) => {
    try {
      setLoading((prev) => ({ ...prev, [category]: true }));
      const response = await fetch(
        `/api/news?category=${category}&pageSize=12`
      );
      const data = await response.json();
      setNews((prev) => ({ ...prev, [category]: data.articles || [] }));
      setLastUpdated((prev) => ({
        ...prev,
        [category]: new Date().toLocaleTimeString(),
      }));
    } catch (error) {
      console.error(`Error fetching ${category} news:`, error);
      setNews((prev) => ({ ...prev, [category]: [] }));
    } finally {
      setLoading((prev) => ({ ...prev, [category]: false }));
    }
  }, []);

  // Initial load
  useEffect(() => {
    categories.forEach((cat) => {
      fetchNews(cat.id);
    });
  }, [fetchNews]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNews(activeTab);
    }, 60000);
    return () => clearInterval(interval);
  }, [activeTab, fetchNews]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (!news[tabId]) {
      fetchNews(tabId);
    }
  };

  const currentNews = news[activeTab] || [];
  const isLoading = loading[activeTab];
  const updated = lastUpdated[activeTab];

  return (
    <div className="dashboard">
      <header className="header">
        <h1>🌍 Global Newsroom Dashboard</h1>
        <p className="subtitle">Real-time news from around the world</p>
      </header>

      <div className="tabs-container">
        <div className="tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleTabChange(cat.id)}
              className={`tab ${activeTab === cat.id ? 'active' : ''}`}
              title={cat.label}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="content">
        <div className="header-info">
          <h2>{categories.find((c) => c.id === activeTab)?.label} News</h2>
          <div className="meta-info">
            {isLoading && <span className="loading">⟳ Updating...</span>}
            {updated && (
              <span className="timestamp">Last updated: {updated}</span>
            )}
            <button
              onClick={() => fetchNews(activeTab)}
              className="refresh-btn"
              disabled={isLoading}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        <div className="news-grid">
          {currentNews.length > 0 ? (
            currentNews.map((article, index) => (
              <NewsCard
                key={`${activeTab}-${index}`}
                article={article}
                onClick={() => setSelectedArticle(article)}
              />
            ))
          ) : (
            <div className="no-articles">
              {isLoading ? 'Loading articles...' : 'No articles available'}
            </div>
          )}
        </div>
      </div>

      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
}
