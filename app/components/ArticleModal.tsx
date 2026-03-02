'use client';

import { useEffect } from 'react';

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  source: { name: string };
  publishedAt: string;
  author?: string;
  content?: string;
}

interface ArticleModalProps {
  article: Article;
  onClose: () => void;
}

export default function ArticleModal({ article, onClose }: ArticleModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="modal-header">
          {article.urlToImage && (
            <img
              src={article.urlToImage}
              alt={article.title}
              className="modal-image"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>
        <div className="modal-body">
          <h2>{article.title}</h2>
          <div className="article-meta">
            <span className="source">{article.source.name}</span>
            <span className="date">
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          {article.author && <p className="author">By {article.author}</p>}
          <p className="description">{article.description}</p>
          {article.content && <p className="content">{article.content}</p>}
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="read-more-btn"
          >
            Read Full Article →
          </a>
        </div>
      </div>
    </div>
  );
}
