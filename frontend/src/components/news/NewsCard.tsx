/**
 * NewsCard -- Displays a single news article in the feed.
 *
 * Premium card design with dark mode, Lucide icons (no emojis),
 * smooth hover transitions, and responsive layout.
 */

import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Clock, MapPin, Globe2 } from 'lucide-react';
import { Article } from '@/types';
import SentimentBadge from '@/components/ui/SentimentBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { timeAgo, stripHtml, truncate } from '@/lib/utils';

interface NewsCardProps {
  article: Article;
}

export default function NewsCard({ article }: NewsCardProps) {
  const cleanDescription = truncate(stripHtml(article.description), 180);
  const RegionIcon = article.region === 'nigeria' ? MapPin : Globe2;

  return (
    <article className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/20 hover:border-gray-300 dark:hover:border-gray-700 hover:-translate-y-0.5">
      {/* Image — clickable, links to article detail */}
      {article.imageUrl && (
        <Link href={`/article/${encodeURIComponent(article.id)}`} className="relative block h-36 sm:h-44 lg:h-48 w-full overflow-hidden rounded-t-xl">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </Link>
      )}

      {/* Content */}
      <div className="p-3 sm:p-4">
        {/* Source + Time */}
        <div className="mb-1.5 sm:mb-2 flex items-center justify-between text-xs sm:text-sm">
          <span className="flex items-center gap-1 sm:gap-1.5 text-gray-500 dark:text-gray-400">
            <RegionIcon className="h-3 w-3" />
            <span className="font-medium text-gray-600 dark:text-gray-300 truncate max-w-[120px] sm:max-w-none">{article.source}</span>
          </span>
          <span className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
            <Clock className="h-3 w-3" />
            {timeAgo(article.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <Link
          href={`/article/${encodeURIComponent(article.id)}`}
          className="block"
        >
          <h2 className="mb-1.5 sm:mb-2 text-base sm:text-lg font-semibold leading-snug text-gray-900 dark:text-gray-100 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
            {article.title}
          </h2>
        </Link>

        {/* Description */}
        {cleanDescription && (
          <p className="mb-2 sm:mb-3 text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-2 sm:line-clamp-3">
            {cleanDescription}
          </p>
        )}

        {/* Badges + External link */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <SentimentBadge sentiment={article.sentiment} />
            <CategoryBadge category={article.category} />
          </div>

          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              title="Read original article"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
