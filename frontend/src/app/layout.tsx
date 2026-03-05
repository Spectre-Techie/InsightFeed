import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import ThemeProvider from '@/components/providers/ThemeProvider';
import PwaRegistrar from '@/components/providers/PwaRegistrar';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'InsightFeed — AI-Powered News with Sentiment Analysis',
  description:
    'Real-time Nigerian and world news with AI-powered sentiment analysis. Filter by mood, category, and region.',
  keywords: ['news', 'nigeria', 'sentiment analysis', 'world news', 'insightfeed'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'InsightFeed',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0f1a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f1a] text-gray-900 dark:text-gray-100">
            <Header />
            <main className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
              {children}
            </main>
          </div>
          <PwaRegistrar />
        </ThemeProvider>
      </body>
    </html>
  );
}
