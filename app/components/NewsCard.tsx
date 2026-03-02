'use client';

interface Article {
  title: string;
  description: string;
  urlToImage?: string;
  url: string;
  source: { name: string };
  publishedAt: string;
  author?: string;
  content?: string;
}

interface NewsCardProps {
  article: Article;
  onClick: () => void;
    isLatest?: boolean;
}

export default function NewsCard({ article, onClick }: NewsCardProps) {
  const imageUrl =
    article.urlToImage && article.urlToImage.startsWith('http')
      ? article.urlToImage
      : '/placeholder.jpg';

  const publishDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article
      className="news-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <div className="card-image-wrapper">
        <img
          src={imageUrl}
          alt={article.title}
          className="card-image"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.jpg';
          }}
        />
      </div>
      <div className="card-content">
        <div className="card-meta">
          <span className="source-badge">{article.source.name}</span>
          <span className="publish-date">{publishDate}</span>
                  {isLatest && <span className="latest-badge">⭐ LATEST</span>}
        </div>
        <h3 className="card-title">{article.title}</h3>
        <p className="card-description">
          {article.description ? article.description.substring(0, 100) + '...' : 'Click to read more'}
        </p>
      </div>
    </article>
  );
}
