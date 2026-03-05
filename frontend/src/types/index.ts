/**
 * Shared TypeScript types for the Smart News Reader.
 *
 * These mirror the backend's article schema and API response shapes.
 * Single source of truth for the frontend.
 */

// ── Sentiment ───────────────────────────────────────────────────

export type SentimentLabel = 'positive' | 'negative' | 'neutral';

export interface Sentiment {
  label: SentimentLabel;
  score: number;         // -1 to 1
  confidence: number;    // 0 to 1
  positiveWords: string[];
  negativeWords: string[];
}

// ── Article ─────────────────────────────────────────────────────

export type Region = 'nigeria' | 'world';

export type Category =
  | 'general'
  | 'politics'
  | 'sports'
  | 'business'
  | 'technology'
  | 'entertainment'
  | 'health';

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string | null;
  source: string;
  sourceType: 'rss' | 'api';
  region: Region;
  category: Category;
  publishedAt: string;   // ISO date string
  fetchedAt: string;     // ISO date string
  sentiment: Sentiment;
}

// ── API Response ────────────────────────────────────────────────

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalArticles: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Filters {
  category: string | null;
  sentiment: string | null;
  region: string;
  search: string | null;
}

export interface NewsResponse {
  articles: Article[];
  pagination: Pagination;
  filters: Filters;
}

// ── Filter State (for the UI) ───────────────────────────────────

export interface FilterState {
  category: Category | '';
  sentiment: SentimentLabel | '';
  region: Region | 'all';
  search: string;
  page: number;
}
