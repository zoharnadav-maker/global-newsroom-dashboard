import { NextRequest, NextResponse } from 'next/server';

const NEWS_API_KEY = process.env.NEWS_API_KEY || 'demo';
// Configured to use real NewsAPI
const NEWS_API_URL = 'https://newsapi.org/v2';

const categoryMap: { [key: string]: string } = {
  business: 'business',
  tech: 'technology',
  science: 'science',
  health: 'health',
  sports: 'sports',
  entertainment: 'entertainment',
  general: 'general',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'general';
  const pageSize = searchParams.get('pageSize') || '12';

  // Map category to newsapi category
  const mappedCategory = categoryMap[category] || 'general';

  try {
    const apiUrl = `${NEWS_API_URL}/top-headlines?category=${mappedCategory}&pageSize=${pageSize}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;

    // If using demo key, return mock data
    if (NEWS_API_KEY === 'demo') {
      return NextResponse.json({
        status: 'ok',
        articles: generateMockNews(category, parseInt(pageSize)),
        totalResults: 100,
      });
    }

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Global-Newsroom-Dashboard/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    // Return mock data on error
    return NextResponse.json(
      {
        status: 'ok',
        articles: generateMockNews(category, parseInt(pageSize)),
        totalResults: 100,
      },
      { status: 200 }
    );
  }
}

function generateMockNews(
  category: string,
  count: number
): Array<{
  source: { name: string; id?: string };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}> {
  const sources = [
    'BBC News',
    'CNN',
    'Reuters',
    'Associated Press',
    'The Guardian',
    'The New York Times',
    'TechCrunch',
    'Wired',
    'Nature',
    'Science Daily',
  ];

  const titles: { [key: string]: string[] } = {
    business: [
      'Stock market hits new high',
      'Tech giant announces expansion plans',
      'GDP growth exceeds expectations',
      'Companies invest in renewable energy',
      'New trade agreement signed',
    ],
    tech: [
      'AI breakthroughs announced',
      'New smartphone features revealed',
      'Cloud computing market grows',
      'Cybersecurity threats increase',
      'Web3 adoption accelerates',
    ],
    science: [
      'Scientists discover new species',
      'Breakthrough in medical research',
      'Space mission reaches milestone',
      'Climate change study released',
      'Quantum computing advances',
    ],
    health: [
      'New drug approved for treatment',
      'Mental health awareness campaign',
      'Fitness trends for 2024',
      'Nutrition research findings',
      'Disease prevention strategies',
    ],
    sports: [
      'Championship game results',
      'Athlete breaks world record',
      'Team wins major tournament',
      'Olympic games preparations',
      'Young star emerges',
    ],
    entertainment: [
      'Movie breaks box office records',
      'Celebrity announces new project',
      'Music award ceremony highlights',
      'TV series finale airs',
      'Festival announces lineup',
    ],
    general: [
      'Global news roundup',
      'International developments',
      'World leaders meet',
      'Major events unfold',
      'News from around the globe',
    ],
  };

  const categoryTitles = titles[category] || titles.general;

  return Array.from({ length: count }, (_, i) => ({
    source: {      name: sources[i % sources.length],
    },
    author: 'Staff Reporter',
    title:
      categoryTitles[i % categoryTitles.length] +
      (i > 0 ? ` - Update ${i + 1}` : ''),
    description: `This is a mock article about ${category} news. In production, this would be fetched from NewsAPI. The article contains important information and updates about current events in the ${category} sector.`,
    url: `https://example.com/article-${i + 1}`,
    urlToImage:
      'https://via.placeholder.com/600x400?text=' +
      encodeURIComponent(categoryTitles[i % categoryTitles.length]),
    publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
    content: `Full article content about ${category} news would appear here. This is mock data used when NewsAPI is not configured.`,
  }));
}
