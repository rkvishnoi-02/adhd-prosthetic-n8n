/**
 * Mode Badge Component
 * Shows active AI mode with color coding
 */

import { ModeType } from '@/types';

interface ModeBadgeProps {
  mode: ModeType;
}

// Hoist static config outside component (vercel: rendering-hoist-jsx)
const MODE_STYLES: Record<ModeType, string> = {
  '@dump': 'bg-purple-100 text-purple-800 border-purple-200',
  '@do': 'bg-blue-100 text-blue-800 border-blue-200',
  '@clarity': 'bg-green-100 text-green-800 border-green-200',
  '@ground': 'bg-amber-100 text-amber-800 border-amber-200',
};

const MODE_LABELS: Record<ModeType, string> = {
  '@dump': 'Dump',
  '@do': 'Do',
  '@clarity': 'Clarity',
  '@ground': 'Ground',
};

export function ModeBadge({ mode }: ModeBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${MODE_STYLES[mode]}`}
      // Accessibility: announce mode to screen readers
      role="status"
      aria-label={`Active mode: ${MODE_LABELS[mode]}`}
    >
      {MODE_LABELS[mode]}
    </span>
  );
}
