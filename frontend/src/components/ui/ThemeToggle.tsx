/**
 * ThemeToggle — Premium three-way theme switcher.
 *
 * Cycles between System / Light / Dark with smooth icon transitions.
 * Uses Lucide icons instead of emojis for a premium feel.
 */

'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch — only render after mount
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Render a placeholder with the same dimensions to prevent layout shift
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-lg" />
    );
  }

  const modes = [
    { key: 'system', icon: Monitor, label: 'System theme' },
    { key: 'light', icon: Sun, label: 'Light mode' },
    { key: 'dark', icon: Moon, label: 'Dark mode' },
  ] as const;

  const current = modes.find((m) => m.key === theme) ?? modes[0];
  const CurrentIcon = current.icon;

  const cycleTheme = () => {
    const idx = modes.findIndex((m) => m.key === theme);
    const next = modes[(idx + 1) % modes.length];

    // Add transitioning class for smooth theme change CSS transitions
    document.documentElement.classList.add('transitioning');
    setTheme(next.key);
    // Remove after transitions finish
    setTimeout(() => document.documentElement.classList.remove('transitioning'), 350);
  };

  return (
    <button
      onClick={cycleTheme}
      className="relative flex h-9 w-9 items-center justify-center rounded-lg
                 border border-gray-200 dark:border-gray-700
                 bg-white dark:bg-gray-800
                 text-gray-600 dark:text-gray-300
                 hover:bg-gray-50 dark:hover:bg-gray-700
                 hover:text-gray-900 dark:hover:text-white
                 transition-all duration-200 ease-out
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                 dark:focus-visible:ring-offset-gray-900"
      aria-label={current.label}
      title={current.label}
    >
      <CurrentIcon className="h-4 w-4 transition-transform duration-200" />
    </button>
  );
}
