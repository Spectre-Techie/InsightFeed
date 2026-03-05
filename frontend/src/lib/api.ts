/**
 * API Client
 *
 * Handles all HTTP communication with the backend.
 * Centralizes error handling, base URL config, and response typing.
 */

import { NewsResponse, Article, FilterState } from '@/types';

// ── Base URL — configurable via env variable ────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Generic fetch wrapper with error handling.
 *
 * @param endpoint - API path (e.g., '/news')
 * @param params   - Query parameters object
 * @returns Parsed JSON response
 */
async function fetchApi<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  // Build URL with query params
  const url = new URL(`${API_BASE}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch paginated news articles with optional filters.
 *
 * @param filters - Current filter state from the UI
 * @returns News response with articles, pagination, and applied filters
 */
export async function getNews(filters: Partial<FilterState> = {}): Promise<NewsResponse> {
  const params: Record<string, string> = {};

  if (filters.category) params.category = filters.category;
  if (filters.sentiment) params.sentiment = filters.sentiment;
  if (filters.region && filters.region !== 'all') params.region = filters.region;
  if (filters.search) params.search = filters.search;
  if (filters.page) params.page = String(filters.page);

  return fetchApi<NewsResponse>('/news', params);
}

/**
 * Fetch a single article by ID.
 *
 * @param id - Article ID
 * @returns The full article object
 */
export async function getArticleById(id: string): Promise<Article> {
  return fetchApi<Article>(`/news/${encodeURIComponent(id)}`);
}

/**
 * Check if the backend is healthy.
 *
 * @returns Health status object
 */
export async function checkHealth(): Promise<{ status: string; uptime: number }> {
  return fetchApi('/health');
}
