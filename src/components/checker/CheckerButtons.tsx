import * as React from 'react';
import { actionToneClass, type ActionTone } from '@/lib/checker-button-styles';
import { cn } from '@/lib/utils';

/* The checker's action button, shared by the checker and the practice round.
   No data access in here: the practice round imports this file, and it must
   stay clear of Supabase (see src/lib/checker-practice.ts). */

export function ActionButton({
  tone,
  onClick,
  disabled,
  children,
  tourId,
  className,
}: {
  tone: ActionTone;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  /** Marks the button for the first-visit walkthrough (data-tour). */
  tourId?: string;
  /** Extra classes, like a width for the phone's action grid. */
  className?: string;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} data-tour={tourId} className={cn(actionToneClass(tone), className)}>
      {children}
    </button>
  );
}
