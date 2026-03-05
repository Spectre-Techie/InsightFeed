/**
 * ThemeProvider — Wraps the app with next-themes for System / Light / Dark mode.
 *
 * Uses the `class` strategy so Tailwind's `dark:` variant works out of the box.
 * Suppresses hydration warning since theme is resolved client-side.
 */

'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      {children}
    </NextThemesProvider>
  );
}
