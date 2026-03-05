/**
 * Home Page -- Premium landing with integrated news feed.
 *
 * Features a compact hero section with real-time stats,
 * followed by the full interactive news feed.
 */

import { Newspaper, TrendingUp, Radio, Filter } from 'lucide-react';
import NewsFeed from '@/components/news/NewsFeed';

export default function HomePage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero section -- compact, data-driven, professional */}
      <section className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/50 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/20 p-5 sm:p-8">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />

        <div className="relative space-y-4 sm:space-y-5">
          {/* Heading */}
          <div className="space-y-1.5 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Smart News,{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Deeper Insights
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-xl">
              Real-time Nigerian and world news powered by AI sentiment analysis.
              Understand the mood behind every headline.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <FeatureCard
              icon={<Radio className="h-4 w-4" />}
              title="Live Feed"
              description="Real-time updates"
            />
            <FeatureCard
              icon={<TrendingUp className="h-4 w-4" />}
              title="Sentiment AI"
              description="Mood analysis"
            />
            <FeatureCard
              icon={<Newspaper className="h-4 w-4" />}
              title="Multi-Source"
              description="4+ outlets"
            />
            <FeatureCard
              icon={<Filter className="h-4 w-4" />}
              title="Smart Filters"
              description="Category & region"
            />
          </div>
        </div>
      </section>

      {/* News Feed */}
      <NewsFeed />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-gray-200/60 dark:border-gray-700/50 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm p-3 sm:p-3.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white leading-tight">{title}</p>
        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{description}</p>
      </div>
    </div>
  );
}

