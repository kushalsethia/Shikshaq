import * as React from 'react';
import { cn } from '@/lib/utils';
import { SentenceBuilder, type SentenceSlot } from '@/components/home/SentenceBuilder';

/* Handoff H-023 / S-015 — the eyes panel, one implementation shared by every
   page that has a footer (mode/heading default per route on other pages;
   Home passes its own explicit copy and drives `mode` from the sentence
   builder's own toggle, since the dome's fill is the SAME state that colours
   the toggle pill and the CTA — H-023's binding rule).

   Pupils track the pointer on a mouse; on a touch device they follow
   deviceorientation instead (iOS 13+ needs a permission prompt, requested
   from the tap handler, never on mount — falls back silently to pointer
   tracking if denied). A 5.2s idle timer blinks them, and a tap blinks them
   too. prefers-reduced-motion disables all of it — pupils sit centred, no
   listeners attached. */

export interface EyesPanelProps {
  mode: 'teachers' | 'papers';
  onModeChange: (mode: 'teachers' | 'papers') => void;
  heading: React.ReactNode;
  subline: string;
  slots: SentenceSlot[];
  onSlotChange: (key: string, value: string) => void;
  onSubmit: () => void;
  count?: number;
  className?: string;
}

const PUPIL_MAX_X = 20;
const PUPIL_MAX_Y = 16;
const PUPIL_DISTANCE_NORM = 260;
const IDLE_BLINK_MS = 5200;
// Handoff M-005: the lid drops for 150ms (how long it stays visually
// closed before reopening) on a 90ms ease-out transition curve (the Eye
// component's own duration-[90ms] class) — two different numbers. This one
// used to reuse the transition's 90ms for the hold too, which meant the
// close-transition and the reopen-transition were racing rather than the
// lid ever settling shut.
const BLINK_HOLD_MS = 150;

type OrientationPermissionState = 'unknown' | 'granted' | 'denied' | 'unsupported';

function usesReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function Eye({
  offset,
  blinking,
  lidFill,
}: {
  offset: { x: number; y: number };
  blinking: boolean;
  lidFill: string;
}) {
  return (
    <div
      aria-hidden
      className="relative h-[74px] w-[104px] shrink-0 overflow-hidden rounded-[50%] bg-card shadow-[inset_0_3px_6px_rgba(31,31,31,.13)]"
    >
      {/* The pupil carries two catchlights. A flat black disc reads as a dot;
          a highlight is what makes an eye read as wet, lit and alive, and it
          is the cheapest possible way to make this face friendly rather than
          blank. Both sit INSIDE the pupil so they travel with it — a
          highlight fixed to the eye white would slide off as the pupil
          moves. */}
      <div
        className="absolute left-1/2 top-1/2 h-[34px] w-[34px] rounded-full bg-panel transition-transform duration-[120ms] ease-out"
        style={{ transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))` }}
      >
        <span
          aria-hidden
          className="absolute left-[6px] top-[5px] h-[11px] w-[11px] rounded-full bg-white/90"
        />
        <span
          aria-hidden
          className="absolute bottom-[7px] right-[6px] h-[5px] w-[5px] rounded-full bg-white/45"
        />
      </div>
      {/* Lid: full-bleed div in the dome's own fill, resting off-panel and
          dropping down to blink, sharing the dome's .85s colour curve. */}
      <div
        className={cn(
          'absolute inset-0 transition-[transform,background-color] duration-[850ms] ease-settle',
          lidFill,
          blinking ? 'translate-y-0 duration-[90ms]' : '-translate-y-full',
        )}
      />
    </div>
  );
}

function EyesPanel({
  mode,
  onModeChange,
  heading,
  subline,
  slots,
  onSlotChange,
  onSubmit,
  count,
  className,
}: EyesPanelProps) {
  const reduced = React.useMemo(usesReducedMotion, []);
  const domeRef = React.useRef<HTMLDivElement>(null);
  const leftEyeRef = React.useRef<HTMLDivElement>(null);
  const rightEyeRef = React.useRef<HTMLDivElement>(null);
  const [leftOffset, setLeftOffset] = React.useState({ x: 0, y: 0 });
  const [rightOffset, setRightOffset] = React.useState({ x: 0, y: 0 });
  const [blinking, setBlinking] = React.useState(false);
  const [orientationPermission, setOrientationPermission] = React.useState<OrientationPermissionState>('unknown');
  const [tiltActive, setTiltActive] = React.useState(false);
  const blinkTimerRef = React.useRef<ReturnType<typeof setTimeout>>();

  const isTouch = React.useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches,
    [],
  );

  const runBlink = React.useCallback(() => {
    if (reduced) return;
    setBlinking(true);
    window.setTimeout(() => setBlinking(false), BLINK_HOLD_MS);
  }, [reduced]);

  // Idle blink loop.
  React.useEffect(() => {
    if (reduced) return;
    function schedule() {
      blinkTimerRef.current = setTimeout(() => {
        runBlink();
        schedule();
      }, IDLE_BLINK_MS);
    }
    schedule();
    return () => clearTimeout(blinkTimerRef.current);
  }, [reduced, runBlink]);

  const applyPointer = React.useCallback((clientX: number, clientY: number) => {
    for (const [ref, setOffset] of [
      [leftEyeRef, setLeftOffset],
      [rightEyeRef, setRightOffset],
    ] as const) {
      const el = ref.current;
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      const dist = Math.hypot(dx, dy);
      const scale = Math.min(1, dist / PUPIL_DISTANCE_NORM);
      const ux = dist === 0 ? 0 : dx / dist;
      const uy = dist === 0 ? 0 : dy / dist;
      setOffset({ x: ux * scale * PUPIL_MAX_X, y: uy * scale * PUPIL_MAX_Y });
    }
  }, []);

  /* Pointer tracking. This used to be `if (reduced || isTouch) return`, which
     meant the eyes never moved at all on a phone: `pointer: coarse` is true,
     so nothing was bound, and M-004's tilt only takes over AFTER the reader
     taps to grant orientation permission. Most visitors therefore saw a
     completely static face and, reasonably, read it as broken.

     `pointermove` fires for touch drags too, so binding it unless the gyro is
     genuinely driving gives: desktop -> pointer, phone before permission ->
     finger drag, phone with tilt granted -> tilt. M-003 and M-004 both still
     hold; this only fills the gap between them. */
  React.useEffect(() => {
    if (reduced || tiltActive) return;
    function onPointerMove(e: PointerEvent) {
      applyPointer(e.clientX, e.clientY);
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [reduced, tiltActive, applyPointer]);

  // Device orientation tracking — touch only, after permission is granted.
  React.useEffect(() => {
    if (reduced || !isTouch || orientationPermission !== 'granted') return;
    function onOrientation(e: DeviceOrientationEvent) {
      if (e.gamma == null || e.beta == null) return;
      setTiltActive(true);
      // Handoff M-004: gamma maps to x over +/-30 degrees, beta maps to y as
      // (beta - 45) / 30 -- both clamped to +/-1. Was dividing by 45, which
      // needed a steeper tilt than specified to reach full pupil deflection.
      const x = Math.max(-1, Math.min(1, e.gamma / 30)) * PUPIL_MAX_X;
      const y = Math.max(-1, Math.min(1, (e.beta - 45) / 30)) * PUPIL_MAX_Y;
      setLeftOffset({ x, y });
      setRightOffset({ x, y });
    }
    window.addEventListener('deviceorientation', onOrientation);
    return () => window.removeEventListener('deviceorientation', onOrientation);
  }, [reduced, isTouch, orientationPermission]);

  const handleTap = React.useCallback(() => {
    runBlink();
    if (reduced || !isTouch || orientationPermission === 'granted') return;
    const DOE = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    if (typeof DOE?.requestPermission === 'function') {
      DOE.requestPermission()
        .then((result) => setOrientationPermission(result === 'granted' ? 'granted' : 'denied'))
        .catch(() => setOrientationPermission('denied'));
    } else if (typeof window.DeviceOrientationEvent !== 'undefined') {
      // No permission gate on this platform — orientation events just start arriving.
      setOrientationPermission('granted');
    } else {
      setOrientationPermission('unsupported');
    }
  }, [reduced, isTouch, orientationPermission, runBlink]);

  const hint = !isTouch
    ? null
    : tiltActive
      ? 'Tilt your phone'
      : orientationPermission === 'granted'
        ? 'Tap, or tilt your phone'
        : 'Tap to wake them up';

  const domeFill = mode === 'papers' ? 'bg-brand-blue' : 'bg-brand';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-bento bg-card px-0 pb-0 pt-[26px]',
        className,
      )}
    >
      <h2 className="px-[22px] text-center font-display text-[32px] font-normal leading-[1.04] tracking-[-0.05em] text-foreground">
        {heading}
      </h2>
      <p className="mx-auto mt-[10px] max-w-prose px-[22px] text-center text-[14px] text-warm-secondary">
        {subline}
      </p>

      <div
        ref={domeRef}
        onClick={handleTap}
        role="presentation"
        style={{ borderRadius: '50% 50% 0 0 / 90px 90px 0 0' }}
        className={cn(
          'relative mt-[26px] box-border w-[124%] -mx-[12%] px-[12%] pb-[26px] pt-[34px] transition-colors duration-[850ms] ease-settle motion-reduce:transition-none',
          domeFill,
        )}
      >
        <div className="flex items-center justify-center gap-[22px]">
          <div ref={leftEyeRef}>
            <Eye offset={reduced ? { x: 0, y: 0 } : leftOffset} blinking={blinking} lidFill={domeFill} />
          </div>
          <div ref={rightEyeRef}>
            <Eye offset={reduced ? { x: 0, y: 0 } : rightOffset} blinking={blinking} lidFill={domeFill} />
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center px-5 text-center">
          <div
            role="tablist"
            aria-label="Search mode"
            /* grid-cols-2: same fix as the hero toggle — flex sized each
               segment to its own label, so "Teachers" (92px) and "Past
               papers" (111px) were visibly different pills. */
            className="grid h-11 grid-cols-2 items-center gap-1 rounded-full p-1"
            style={{ backgroundColor: 'rgba(31,31,31,.14)' }}
          >
            {(['teachers', 'papers'] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => onModeChange(m)}
                className={cn(
                  'tap-44 flex h-9 items-center justify-center rounded-full px-4 text-[13.5px] font-bold transition-colors duration-500',
                  mode === m ? 'bg-panel text-background' : mode === 'papers' ? 'text-white/85' : 'text-[rgba(31,31,31,.7)]',
                )}
              >
                {m === 'teachers' ? 'Teachers' : 'Past papers'}
              </button>
            ))}
          </div>

          <SentenceBuilder
            mode={mode}
            slots={slots}
            onChange={onSlotChange}
            onSubmit={onSubmit}
            count={count}
            className="mt-[18px] items-center text-center [&_p]:justify-center [&_p]:text-[26px] [&_p]:font-black [&_p]:leading-[1.25] [&_p]:tracking-[-0.03em] [&_p]:text-[#FCFAF7]"
          />

          {hint && (
            <p
              className="mt-3 text-[11.5px] font-bold uppercase tracking-wide"
              style={{ color: 'rgba(31,31,31,.55)' }}
            >
              {hint}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export { EyesPanel };
