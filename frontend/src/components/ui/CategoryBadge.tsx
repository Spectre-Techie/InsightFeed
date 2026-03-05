/**
 * CategoryBadge -- Displays the article category with a Lucide icon.
 *
 * Each category has its own icon and color for quick visual scanning.
 */

import {
  Landmark, Trophy, Briefcase, Monitor,
  Film, HeartPulse, Newspaper,
} from 'lucide-react';
import { Category } from '@/types';
import { getCategoryColor } from '@/lib/utils';

interface CategoryBadgeProps {
  category: Category;
}

const CATEGORY_ICONS: Record<Category, React.ComponentType<{ className?: string }>> = {
  politics: Landmark,
  sports: Trophy,
  business: Briefcase,
  technology: Monitor,
  entertainment: Film,
  health: HeartPulse,
  general: Newspaper,
};

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const colorClasses = getCategoryColor(category);
  const Icon = CATEGORY_ICONS[category] || Newspaper;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-medium capitalize ${colorClasses}`}
    >
      <Icon className="h-3 w-3" />
      {category}
    </span>
  );
}
