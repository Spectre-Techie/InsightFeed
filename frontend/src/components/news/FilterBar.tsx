/**
 * FilterBar — Three-row filter panel for the news feed.
 *
 * Row 1: Region chips   (All, Nigeria 🇳🇬, World 🌍)
 * Row 2: Category chips  (All, Politics, Sports, Business, etc.)
 * Row 3: Sentiment chips (All, Positive 😊, Negative 😟, Neutral 😐)
 *
 * Plus a search input for keyword filtering.
 * This is a client component because it manages local filter state.
 */

'use client';

import {
  Search, X,
  Globe, MapPin, Globe2,
  LayoutGrid, Landmark, Trophy, Briefcase, Monitor, Film, HeartPulse, Newspaper,
  Layers, TrendingUp, TrendingDown, Minus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { FilterState, Category, SentimentLabel, Region } from '@/types';

// ── Filter Options ──────────────────────────────────────────────

const REGIONS: { value: Region | 'all'; label: string; icon: LucideIcon }[] = [
  { value: 'all', label: 'All', icon: Globe },
  { value: 'nigeria', label: 'Nigeria', icon: MapPin },
  { value: 'world', label: 'World', icon: Globe2 },
];

const CATEGORIES: { value: Category | ''; label: string; icon: LucideIcon }[] = [
  { value: '', label: 'All', icon: LayoutGrid },
  { value: 'politics', label: 'Politics', icon: Landmark },
  { value: 'sports', label: 'Sports', icon: Trophy },
  { value: 'business', label: 'Business', icon: Briefcase },
  { value: 'technology', label: 'Tech', icon: Monitor },
  { value: 'entertainment', label: 'Entertainment', icon: Film },
  { value: 'health', label: 'Health', icon: HeartPulse },
  { value: 'general', label: 'General', icon: Newspaper },
];

const SENTIMENTS: { value: SentimentLabel | ''; label: string; icon: LucideIcon }[] = [
  { value: '', label: 'All', icon: Layers },
  { value: 'positive', label: 'Positive', icon: TrendingUp },
  { value: 'negative', label: 'Negative', icon: TrendingDown },
  { value: 'neutral', label: 'Neutral', icon: Minus },
];

// ── Props ───────────────────────────────────────────────────────

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

// ── Component ───────────────────────────────────────────────────

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  /**
   * Update a single filter key while preserving the rest.
   * Resets page to 1 when any filter changes.
   */
  const updateFilter = (key: keyof FilterState, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
      page: 1, // Reset pagination on filter change
    });
  };

  /** Clear all filters back to defaults. */
  const clearFilters = () => {
    onFilterChange({
      category: '',
      sentiment: '',
      region: 'all',
      search: '',
      page: 1,
    });
  };

  /** Check if any filters are active (to show the "Clear" button). */
  const hasActiveFilters =
    filters.category !== '' ||
    filters.sentiment !== '' ||
    filters.region !== 'all' ||
    filters.search !== '';

  return (
    <div className="space-y-2.5 sm:space-y-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-3 sm:p-4 shadow-sm">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search news..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-2 pl-9 sm:pl-10 pr-9 sm:pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {filters.search && (
          <button
            onClick={() => updateFilter('search', '')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Region Chips */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <span className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide w-12 sm:w-16">Region</span>
        {REGIONS.map(({ value, label, icon: Icon }) => (
          <ChipButton
            key={value}
            label={label}
            icon={<Icon className="h-3 w-3" />}
            active={filters.region === value}
            onClick={() => updateFilter('region', value)}
          />
        ))}
      </div>

      {/* Category Chips */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap scrollbar-hide">
        <span className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide w-12 sm:w-16 shrink-0">Topic</span>
        {CATEGORIES.map(({ value, label, icon: Icon }) => (
          <ChipButton
            key={value || 'all-cat'}
            label={label}
            icon={<Icon className="h-3 w-3" />}
            active={filters.category === value}
            onClick={() => updateFilter('category', value)}
          />
        ))}
      </div>

      {/* Sentiment Chips */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <span className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide w-12 sm:w-16">Mood</span>
        {SENTIMENTS.map(({ value, label, icon: Icon }) => (
          <ChipButton
            key={value || 'all-sent'}
            label={label}
            icon={<Icon className="h-3 w-3" />}
            active={filters.sentiment === value}
            onClick={() => updateFilter('sentiment', value)}
          />
        ))}
      </div>

      {/* Clear All Button */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <X className="h-3 w-3" />
          Clear all filters
        </button>
      )}
    </div>
  );
}

// ── Chip Button (internal helper) ───────────────────────────────

interface ChipButtonProps {
  label: string;
  icon?: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function ChipButton({ label, icon, active, onClick }: ChipButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
        active
          ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-sm shadow-blue-500/25'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
