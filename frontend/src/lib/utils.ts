/**
 * Utility helpers used across the frontend.
 *
 * Formatting, color mappings, and other shared logic.
 * All emoji-free -- uses Lucide icon components instead.
 */

import { formatDistanceToNow, format } from 'date-fns';
import { SentimentLabel, Category, Region } from '@/types';

// -- Sentiment Colors & Labels -----------------------------------------------

/**
 * Get Tailwind classes for a sentiment badge (light + dark mode).
 */
export function getSentimentColor(label: SentimentLabel): string {
  const colors: Record<SentimentLabel, string> = {
    positive: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400',
    negative: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  };
  return colors[label] || colors.neutral;
}

// -- Category Colors ----------------------------------------------------------

/**
 * Get Tailwind badge classes for a category (light + dark mode).
 */
export function getCategoryColor(category: Category): string {
  const colors: Record<Category, string> = {
    politics: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-400',
    sports: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-400',
    business: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400',
    technology: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-400',
    entertainment: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-400',
    health: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400',
    general: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  };
  return colors[category] || colors.general;
}

// -- Date Formatting ----------------------------------------------------------

export function timeAgo(dateString: string): string {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return 'Unknown time';
  }
}

export function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  } catch {
    return 'Unknown date';
  }
}

// -- Text Helpers -------------------------------------------------------------

const HTML_ENTITIES: Record<string, string> = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&apos;': "'", '&nbsp;': ' ', '&ndash;': '\u2013', '&mdash;': '\u2014',
  '&lsquo;': '\u2018', '&rsquo;': '\u2019', '&ldquo;': '\u201c', '&rdquo;': '\u201d',
  '&hellip;': '\u2026', '&bull;': '\u2022',
};

export function decodeEntities(text: string): string {
  let decoded = text;
  for (const [entity, char] of Object.entries(HTML_ENTITIES)) {
    decoded = decoded.replaceAll(entity, char);
  }
  decoded = decoded.replace(/&#(\d+);/g, (_, dec: string) => String.fromCharCode(Number(dec)));
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)));
  return decoded;
}

export function stripHtml(html: string): string {
  const stripped = html.replace(/<[^>]*>/g, '');
  const decoded = decodeEntities(stripped);
  return decoded.replace(/\s+/g, ' ').trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '\u2026';
}
