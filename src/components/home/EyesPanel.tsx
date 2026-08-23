import * as React from 'react';
import { cn } from '@/lib/utils';
import { SentenceBuilder, type SentenceSlot } from '@/components/home/SentenceBuilder';

/* Redesign 09 (00-shared-components.md S-015 "the eyes panel — one
   implementation"). New file, since it did not exist yet on this branch —
   only Join and RecommendTeacher need it within this pass's scope (09a/09c;
   see the geometry appendix in 09-Join-Onboarding-...md). Transcribed
   directly from the embedded interaction logic in the "Join Recommend
   Onboarding Redesign.dc.html" mockup (its `<script type="text/x-dc">`
   Component class — pointer maths, blink timing, gyro permission flow),
   which is the literal, load-bearing source for the numbers below, not an
   approximation.

   Pupils track the pointer on a mouse; on a touch device they follow
   deviceorientation instead (iOS 13+ needs a permission prompt, requested
   from the tap handler, never on mount — falls back silently to pointer
   tracking if denied). A 5.2s idle timer blinks them, and a tap blinks them
   too. prefers-reduced-motion disables all of it — pupils sit centred, no
   listeners attached (verification gate G-7). */

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

/* Mockup `offsetFor(el, cx, cy, max)`: max is always 20 for both axes, with
   the y axis additionally scaled by 0.8 (so its effective ceiling is 16) —
   not two independently-authored maxima. */
const PUPIL_MAX = 20;
const PUPIL_Y_FACTOR = 0.8;
const PUPIL_DISTANCE_NORM = 260;
const IDLE_BLINK_MS = 5200;
/* Mockup `blink()`: state held for 150ms; the lid's own CSS transition is
   90ms (`transition:transform .09s ease-out`, hardcoded on the Eye's lid
   below) in both directions, so the eye reads as shut for a beat longer than
   the transition alone would give it. */
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
      className="relative h-[104px] w-[74px] shrink-0 overflow-hidden rounded-[50%] bg-card"
    >
      <div
        className="absolute left-1/2 top-1/2 h-[34px] w-[34px] rounded-full bg-panel transition-transform duration-[120ms] ease-out"
        style={{ transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))` }}
      />
      <div
        className={cn(
          'absolute inset-0 transition-[transform,background-color] duration-[90ms] ease-out',
          lidFill,
          blinking ? 'translate-y-0' : '-translate-y-full',
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
  const leftEyeRef = React.useRef<HTMLDivElement>(null);
  const rightEyeRef = React.useRef<HTMLDivElement>(null);
  const [leftOffset, setLeftOffset] = React.useState({ x: 0, y: 0 });
  const [rightOffset, setRightOffset] = React.useState({ x: 0, y: 0 });
  const [blinking, setBlinking] = React.useState(false);
  const [orientationPermission, setOrientationPermission] = React.useState<OrientationPermissionState>('unknown');
  const [tiltActive, setTiltActive] = React.useState(false);
  const blinkHoldRef = React.useRef<ReturnType<typeof setTimeout>>();
  const idleTimerRef = React.useRef<ReturnType<typeof setInterval>>();

  const isTouch = React.useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches,
    [],
  );

  const runBlink = React.useCallback(() => {
    if (reduced) return;
    setBlinking(true);
    clearTimeout(blinkHoldRef.current);
    blinkHoldRef.current = setTimeout(() => setBlinking(false), BLINK_HOLD_MS);
  }, [reduced]);

  // Idle blink loop — mockup: setInterval(this.blink, 5200).
  React.useEffect(() => {
    if (reduced) return;
    idleTimerRef.current = setInterval(runBlink, IDLE_BLINK_MS);
    return () => clearInterval(idleTimerRef.current);
  }, [reduced, runBlink]);

  React.useEffect(() => () => clearTimeout(blinkHoldRef.current), []);

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
      const dist = Math.hypot(dx, dy) || 1;
      const scale = Math.min(1, dist / PUPIL_DISTANCE_NORM);
      setOffset({ x: (dx / dist) * PUPIL_MAX * scale, y: (dy / dist) * PUPIL_MAX * scale * PUPIL_Y_FACTOR });
    }
  }, []);

  // Pointer tracking — non-touch only.
  React.useEffect(() => {
    if (reduced || isTouch) return;
    function onPointerMove(e: PointerEvent) {
      applyPointer(e.clientX, e.clientY);
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [reduced, isTouch, applyPointer]);

  // Device orientation tracking — touch only, after permission is granted.
  // Mockup: x = clamp(gamma/30,-1,1)*20; y = clamp((beta-45)/30,-1,1)*16.
  React.useEffect(() => {
    if (reduced || !isTouch || orientationPermission !== 'granted') return;
    function onOrientation(e: DeviceOrientationEvent) {
      if (e.gamma == null || e.beta == null) return;
      setTiltActive(true);
      const x = Math.max(-1, Math.min(1, e.gamma / 30)) * PUPIL_MAX;
      const y = Math.max(-1, Math.min(1, (e.beta - 45) / 30)) * (PUPIL_MAX * PUPIL_Y_FACTOR);
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
  const domeTextColor = mode === 'papers' ? 'text-brand-blue' : 'text-brand';
  const ctaLabel = mode === 'papers' ? 'Find papers' : 'Find them';

  return (
    <div className={cn('relative overflow-hidden rounded-[30px] bg-card pb-0 pt-[26px]', className)}>
      <h2 className="px-[22px] text-center font-display text-[32px] font-normal leading-[1.04] tracking-[-0.05em] text-foreground">
        {heading}
      </h2>
      <p className="mx-auto mt-[10px] max-w-prose px-[22px] text-center text-[14px] leading-[1.5] text-warm-secondary">
        {subline}
      </p>

      <div
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
            className="flex h-11 items-center gap-1 rounded-full p-1"
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
                  'tap-44 flex h-9 items-center rounded-full px-4 text-[13.5px] font-bold transition-colors duration-500',
                  mode === m ? 'bg-panel text-background' : mode === 'papers' ? 'text-white/85' : 'text-[rgba(31,31,31,.7)]',
                )}
              >
                {m === 'teachers' ? 'Teachers' : 'Past papers'}
              </button>
            ))}
          </div>

          {/* SentenceBuilder's own built-in CTA button is solid-brand — the
              mockup's CTA for this panel is a bone pill with dome-coloured
              text instead, and sits in its own block with a hint line below
              it, so the built-in button is hidden ([&>div]:hidden targets
              only its direct-child button wrapper, not the sentence <p>) and
              replaced with the panel's own CTA row below. */}
          <SentenceBuilder
            mode={mode}
            slots={slots}
            onChange={onSlotChange}
            onSubmit={onSubmit}
            count={count}
            className="mt-[18px] items-center gap-0 text-center [&>div]:hidden [&_p]:justify-center [&_p]:text-[26px] [&_p]:font-black [&_p]:leading-[1.25] [&_p]:tracking-[-0.03em] [&_p]:text-[#FCFAF7]"
          />

          <div className="mt-[22px] flex flex-col items-center gap-[10px]">
            <button
              type="button"
              onClick={onSubmit}
              className={cn(
                'inline-flex h-[52px] items-center rounded-full bg-card px-6 text-[15px] font-extrabold transition-colors duration-[850ms] ease-settle',
                domeTextColor,
              )}
            >
              {count === undefined ? ctaLabel : `Show ${count} ${mode === 'teachers' ? 'teachers' : 'papers'}`}
            </button>
            {hint && (
              <p className="text-[11.5px] font-bold uppercase tracking-wide" style={{ color: 'rgba(31,31,31,.55)' }}>
                {hint}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { EyesPanel };
