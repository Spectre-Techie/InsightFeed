/**
 * NewsFeed — Main news feed client component.
 *
 * Manages:
 *  - Filter state (region, category, sentiment, search)
 *  - API calls to the backend
 *  - Loading / error states
 *  - Pagination
 *
 * Renders FilterBar, NewsCard grid, and Pagination.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle, Newspaper } from 'lucide-react';
import { getNews } from '@/lib/api';
import { FilterState, NewsResponse } from '@/types';
import FilterBar from '@/components/news/FilterBar';
import NewsCard from '@/components/news/NewsCard';
import Pagination from '@/components/ui/Pagination';

// ── Default filter state ────────────────────────────────────────

const DEFAULT_FILTERS: FilterState = {
  category: '',
  sentiment: '',
  region: 'all',
  search: '',
  page: 1,
};

export default function NewsFeed() {
  // ── State ─────────────────────────────────────────────────────
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [data, setData] = useState<NewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch articles whenever filters change ────────────────────
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getNews(filters);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch news';
      setError(message);
      console.error('[NewsFeed] Fetch error:', message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // ── Debounced search ──────────────────────────────────────────
  // We use a separate effect to debounce the search input so we
  // don't fire an API call on every keystroke.
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [searchInput, filters.search]);

  // ── Filter change handler ─────────────────────────────────────
  const handleFilterChange = (newFilters: FilterState) => {
    // If the search changed, route through the debounced input
    if (newFilters.search !== filters.search) {
      setSearchInput(newFilters.search);
      // Don't update filters.search directly — let debounce handle it
      const { search: _, ...rest } = newFilters;
      setFilters((prev) => ({ ...prev, ...rest }));
    } else {
      setFilters(newFilters);
    }
  };

  // ── Page change handler ───────────────────────────────────────
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <FilterBar
        filters={{ ...filters, search: searchInput }}
        onFilterChange={handleFilterChange}
      />

      {/* Loading State — Skeleton cards */}
      {loading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 stagger-children">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 overflow-hidden">
              <div className="skeleton h-44 w-full rounded-none" />
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <div className="skeleton h-3 w-24" />
                  <div className="skeleton h-3 w-16" />
                </div>
                <div className="skeleton h-5 w-full" />
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-5/6" />
                <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="skeleton h-5 w-20 rounded-full" />
                  <div className="skeleton h-5 w-16 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="h-7 w-7 text-red-500 dark:text-red-400" />
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Failed to load news</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{error}</p>
            </div>
            <button
              onClick={fetchArticles}
              className="mt-2 rounded-lg bg-blue-600 dark:bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && data?.articles.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <Newspaper className="h-7 w-7 text-gray-400 dark:text-gray-500" />
            </div>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">No articles found</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your filters or search query.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      {!loading && !error && data && data.articles.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 stagger-children">
            {data.articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            pagination={data.pagination}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
