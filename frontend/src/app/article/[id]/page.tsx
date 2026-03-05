/**
 * Article Detail Page — /article/[id]
 *
 * Shows a single article with full content, sentiment breakdown,
 * and a link back to the feed.
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, Clock, Globe, MapPin, Globe2, AlertCircle } from 'lucide-react';
import { Article } from '@/types';
import { getArticleById } from '@/lib/api';
import SentimentBadge from '@/components/ui/SentimentBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { formatDate, stripHtml } from '@/lib/utils';

export default function ArticlePage() {
  const params = useParams();
  const id = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const data = await getArticleById(decodeURIComponent(id));
        setArticle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchArticle();
  }, [id]);

  // -- Loading State --
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
        <div className="skeleton h-4 w-32" />
        <div className="space-y-3">
          <div className="skeleton h-3 w-48" />
          <div className="skeleton h-8 w-full" />
          <div className="skeleton h-8 w-3/4" />
          <div className="flex gap-2"><div className="skeleton h-6 w-20 rounded-full" /><div className="skeleton h-6 w-16 rounded-full" /></div>
        </div>
        <div className="skeleton h-64 sm:h-80 w-full rounded-xl" />
        <div className="space-y-3">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-4/5" />
        </div>
      </div>
    );
  }

  // -- Error State --
  if (error || !article) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertCircle className="h-7 w-7 text-red-500 dark:text-red-400" />
        </div>
        <p className="text-gray-600 dark:text-gray-400">{error || 'Article not found'}</p>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to feed
        </Link>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────
  const cleanContent = stripHtml(article.content);
  const RegionIcon = article.region === 'nigeria' ? MapPin : Globe2;

  return (
    <article className="mx-auto max-w-3xl space-y-4 sm:space-y-6 animate-fade-in">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        Back to feed
      </Link>

      {/* Header */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <RegionIcon className="h-3.5 w-3.5" />
            {article.source}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            {formatDate(article.publishedAt)}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight text-gray-900 dark:text-white">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <SentimentBadge sentiment={article.sentiment} showScore />
          <CategoryBadge category={article.category} />
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 capitalize">
            <RegionIcon className="h-3 w-3" />
            {article.region}
          </span>
        </div>
      </div>

      {/* Featured Image — shorter on mobile */}
      {article.imageUrl && (
        <div className="relative h-48 sm:h-64 lg:h-80 w-full overflow-hidden rounded-lg sm:rounded-xl">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            unoptimized
            priority
          />
        </div>
      )}

      {/* Article Content */}
      <div className="prose prose-gray dark:prose-invert max-w-none leading-relaxed">
        {cleanContent ? (
          cleanContent.split('\n').filter(Boolean).map((paragraph, i) => (
            <p key={i} className="mb-3 sm:mb-4 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-6 sm:leading-7">
              {paragraph}
            </p>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">
            Full content not available. Read the original article below.
          </p>
        )}
      </div>

      {/* Sentiment Breakdown */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-3 sm:p-5 space-y-2 sm:space-y-3">
        <h3 className="text-[10px] sm:text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
          Sentiment Analysis
        </h3>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{article.sentiment.score}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Score</p>
          </div>
          <div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(article.sentiment.confidence * 100)}%
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Confidence</p>
          </div>
          <div>
            <p className="text-lg sm:text-2xl font-bold capitalize text-gray-900 dark:text-white">{article.sentiment.label}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Label</p>
          </div>
        </div>

        {(article.sentiment.positiveWords.length > 0 || article.sentiment.negativeWords.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-3 border-t border-gray-100 dark:border-gray-800">
            {article.sentiment.positiveWords.length > 0 && (
              <div>
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">Positive signals</p>
                <div className="flex flex-wrap gap-1">
                  {article.sentiment.positiveWords.map((word) => (
                    <span key={word} className="rounded bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 text-xs text-emerald-700 dark:text-emerald-400">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {article.sentiment.negativeWords.length > 0 && (
              <div>
                <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">Negative signals</p>
                <div className="flex flex-wrap gap-1">
                  {article.sentiment.negativeWords.map((word) => (
                    <span key={word} className="rounded bg-red-50 dark:bg-red-900/30 px-1.5 py-0.5 text-xs text-red-700 dark:text-red-400">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Read Original */}
      {article.url && (
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-blue-600 dark:bg-blue-500 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm shadow-blue-500/25"
        >
          <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Read original at {article.source}
          <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </a>
      )}
    </article>
  );
}
