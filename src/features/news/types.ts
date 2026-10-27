export type NewsStatus = 'RUMOR' | 'CONFIRMED' | 'DEBUNKED';

export type NewsType = 'PIRATE' | 'MARINE' | 'REVOLUTIONARY' | 'WORLD_GOVERNMENT' | 'OTHER';

export type NewsPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  type: NewsType;
  priority: NewsPriority;
  status: NewsStatus;
  publishedAt: string;
  updatedAt: string;
  author?: string;
  location?: string;
}

export interface NewsFeedResponse {
  items: NewsItem[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface NewsFilterParams {
  cursor?: string;
  limit?: number;
  type?: NewsType;
  priority?: NewsPriority;
  status?: NewsStatus;
}
