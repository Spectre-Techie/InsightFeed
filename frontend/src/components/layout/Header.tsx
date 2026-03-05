/**
 * Header -- Top navigation bar.
 *
 * Shows the app logo/name, live indicator, and theme toggle.
 * Sticky at the top with glass-morphism effect.
 */

import Link from 'next/link';
import { Newspaper, Radio } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-4 lg:px-6">
        {/* Logo / App Name */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25 group-hover:shadow-md group-hover:shadow-blue-500/30 transition-shadow">
            <Newspaper className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
              InsightFeed
            </h1>
            <p className="hidden sm:block text-[10px] text-gray-400 dark:text-gray-500 leading-none -mt-0.5">
              AI-Powered News
            </p>
          </div>
        </Link>

        {/* Right side: Live indicator + Theme toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live indicator */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <Radio className="h-3 w-3 animate-pulse" />
            <span className="hidden sm:inline">Live</span>
          </span>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
