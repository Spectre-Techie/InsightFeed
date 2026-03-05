/**
 * SentimentBadge -- Displays the sentiment label with a Lucide icon.
 *
 * Color-coded: emerald (positive), red (negative), slate (neutral).
 * Uses TrendingUp / TrendingDown / Minus icons instead of emojis.
 */

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Sentiment, SentimentLabel } from '@/types';
import { getSentimentColor } from '@/lib/utils';

interface SentimentBadgeProps {
  sentiment: Sentiment;
  showScore?: boolean;
}

const SENTIMENT_ICONS: Record<SentimentLabel, React.ComponentType<{ className?: string }>> = {
  positive: TrendingUp,
  negative: TrendingDown,
  neutral: Minus,
};

export default function SentimentBadge({ sentiment, showScore = false }: SentimentBadgeProps) {
  const colorClasses = getSentimentColor(sentiment.label);
  const Icon = SENTIMENT_ICONS[sentiment.label] || Minus;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-medium ${colorClasses}`}
      title={`Sentiment: ${sentiment.label} (score: ${sentiment.score}, confidence: ${sentiment.confidence})`}
    >
      <Icon className="h-3 w-3" />
      <span className="capitalize">{sentiment.label}</span>
      {showScore && (
        <span className="opacity-70">({sentiment.score})</span>
      )}
    </span>
  );
}
