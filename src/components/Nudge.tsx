import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable "seen once" coachmark bubble. Renders nothing until `delayMs` after mount, then shows
 * a short message anchored to its (relatively-positioned) parent, and disappears on its own after
 * `autoDismissMs` or as soon as the user taps anywhere. Once shown, it's flagged "seen" in
 * localStorage under a caller-supplied `id` so it never appears again in this browser — same
 * try/catch-guarded localStorage pattern as utils/recentSearches.ts, so a blocked/unavailable
 * localStorage (private browsing, etc.) just means the nudge always shows rather than crashing.
 *
 * Usage: wrap the anchor element in a `position: relative` container and render <Nudge> as its
 * sibling (not a descendant of a <button>, since Nudge renders its own interactive buttons and
 * nested <button> elements are invalid HTML).
 */

const STORAGE_PREFIX = 'shikshaq_nudge_seen_';

function hasSeenNudge(id: string): boolean {
  try {
    return localStorage.getItem(STORAGE_PREFIX + id) === '1';
  } catch {
    return false;
  }
}

function markNudgeSeen(id: string): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + id, '1');
  } catch {
    // localStorage unavailable (private browsing, etc.) — nudge just won't persist as seen
  }
}

export interface NudgeProps {
  /** Unique id — persisted to localStorage so this nudge only ever shows once per browser. */
  id: string;
  /** Bubble copy. Rendered as a button (see onCtaClick) when onCtaClick is provided, plain text otherwise. */
  message: string;
  /** Optional tap action for the message itself, e.g. navigating somewhere. Also dismisses the nudge. */
  onCtaClick?: () => void;
  /** Delay before the bubble appears, in ms. Default 900. */
  delayMs?: number;
  /** Auto-dismiss this many ms after appearing. Default 5500 (per the "few seconds" spec). */
  autoDismissMs?: number;
  /** Which edge of the anchor the bubble hangs below. Default 'bottom'. */
  placement?: 'bottom' | 'top';
  /** Which side the bubble's edge aligns to (so it doesn't run off-screen near a page edge). Default 'left'. */
  align?: 'left' | 'right';
}

export function Nudge({
  id,
  message,
  onCtaClick,
  delayMs = 900,
  autoDismissMs = 5500,
  placement = 'bottom',
  align = 'left',
}: NudgeProps) {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dismissedRef = useRef(false);

  const dismiss = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setVisible(false);
  };

  // Show once, after a short delay — and immediately flag as "seen" so a reload or navigating
  // away mid-timer still counts as having shown it (per the "seen once" requirement).
  useEffect(() => {
    if (hasSeenNudge(id)) return;
    const showTimer = setTimeout(() => {
      markNudgeSeen(id);
      setVisible(true);
    }, delayMs);
    return () => clearTimeout(showTimer);
  }, [id, delayMs]);

  // Auto-dismiss + tap-anywhere-to-dismiss. Taps inside the bubble are left to its own buttons
  // (CTA / close) so this only fires for genuine "tap elsewhere" dismissal.
  useEffect(() => {
    if (!visible) return;
    const hideTimer = setTimeout(dismiss, autoDismissMs);
    const handleDocumentClick = (e: MouseEvent) => {
      if (containerRef.current && containerRef.current.contains(e.target as Node)) return;
      dismiss();
    };
    document.addEventListener('click', handleDocumentClick);
    return () => {
      clearTimeout(hideTimer);
      document.removeEventListener('click', handleDocumentClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, autoDismissMs]);

  if (!visible) return null;

  const edgeSide = align === 'left' ? 'left' : 'right';

  return (
    <div
      ref={containerRef}
      role="status"
      // Position and side are genuinely dynamic per-caller values (which edge
      // of the anchor, which alignment) — the sanctioned inline-style
      // exception for computed/dynamic values (DESIGN_SYSTEM §1.2). Color,
      // radius, shadow and motion all come from tokens/utilities below.
      style={{
        position: 'absolute',
        [placement === 'bottom' ? 'top' : 'bottom']: 'calc(100% + 12px)',
        [edgeSide]: 0,
        width: 232,
        // The bubble can visually overhang nearby interactive elements on tight mobile layouts
        // (e.g. a search field just below its anchor). pointer-events:none here — reenabled on
        // its own buttons below — means it never intercepts taps meant for whatever's underneath;
        // a tap that lands on the bubble's visual footprint but not on the X/CTA still reaches the
        // element beneath it AND still bubbles to the document click listener that dismisses it.
        pointerEvents: 'none',
      }}
      className="z-40 animate-pop rounded-xl bg-panel py-3 pl-4 pr-8 shadow-lg"
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          [placement === 'bottom' ? 'top' : 'bottom']: -4,
          [edgeSide]: 16,
        }}
        className="h-2 w-2 rotate-45 bg-panel"
      />

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full text-white/55 transition-colors duration-tap hover:text-white"
        style={{ pointerEvents: 'auto' }}
      >
        <X size={12} aria-hidden="true" />
      </button>

      {onCtaClick ? (
        <button
          type="button"
          onClick={() => {
            dismiss();
            onCtaClick();
          }}
          className="block w-full text-left text-meta font-medium leading-snug text-white"
          style={{ pointerEvents: 'auto' }}
        >
          {message}
        </button>
      ) : (
        <p className="text-meta font-medium leading-snug text-white">{message}</p>
      )}
    </div>
  );
}
