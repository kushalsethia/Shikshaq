import * as React from 'react';

/* "Find a teacher" / "Revise past papers free" felt empty on desktop — a big
   circular mascot face, roughly half the panel, orange for teachers / blue
   for papers, whose eyes track the cursor. First pass tucked this into a tiny
   corner badge; the owner asked for it big and centred instead — a real
   circular face, not a decorative sliver.

   Reuses EyesPanel's own pupil-follow math (distance-normalised offset,
   eased toward target) rather than a second, divergent implementation.

   Desktop only: a touch device has no cursor to follow, and EyesPanel already
   owns the tilt-follow treatment for touch elsewhere on this page. */

const PUPIL_MAX = 9;
const DISTANCE_NORM = 260;
const EASE_PER_FRAME = 0.2;

function usesReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function CornerMascot({ tone }: { tone: 'teachers' | 'papers' }) {
  const reduced = React.useMemo(usesReducedMotion, []);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const leftPupilRef = React.useRef<HTMLDivElement>(null);
  const rightPupilRef = React.useRef<HTMLDivElement>(null);
  const targetRef = React.useRef({ x: 0, y: 0 });
  const currentRef = React.useRef({ x: 0, y: 0 });
  const rafRef = React.useRef<number>();

  const settle = React.useCallback(() => {
    if (rafRef.current !== undefined) return;
    const tick = () => {
      const cur = currentRef.current;
      const tgt = targetRef.current;
      const dx = tgt.x - cur.x;
      const dy = tgt.y - cur.y;
      if (Math.abs(dx) > 0.02 || Math.abs(dy) > 0.02) {
        cur.x += dx * EASE_PER_FRAME;
        cur.y += dy * EASE_PER_FRAME;
        const t = `translate(calc(-50% + ${cur.x.toFixed(2)}px), calc(-50% + ${cur.y.toFixed(2)}px))`;
        if (leftPupilRef.current) leftPupilRef.current.style.transform = t;
        if (rightPupilRef.current) rightPupilRef.current.style.transform = t;
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = undefined;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  React.useEffect(() => {
    if (reduced) return;
    function onPointerMove(e: PointerEvent) {
      const root = rootRef.current;
      if (!root) return;
      const r = root.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const scale = Math.min(1, dist / DISTANCE_NORM);
      targetRef.current = {
        x: dist === 0 ? 0 : (dx / dist) * scale * PUPIL_MAX,
        y: dist === 0 ? 0 : (dy / dist) * scale * PUPIL_MAX,
      };
      settle();
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [reduced, settle]);

  React.useEffect(() => () => {
    if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
  }, []);

  const fill = tone === 'teachers' ? 'bg-brand' : 'bg-brand-blue';
  const eyeWhite = tone === 'teachers' ? 'bg-[#1F1F1F]/[0.14]' : 'bg-white/30';

  return (
    <div
      ref={rootRef}
      aria-hidden
      /* h-full + aspect-square, not a fixed max-w: the panel's own height
         varies (padding, content length), so sizing off height keeps the
         circle from either looking small in a tall panel or overflowing a
         short one. max-h caps it from getting absurd on a very tall panel. */
      className={`relative hidden aspect-square h-full max-h-[230px] w-auto flex-none items-center justify-center gap-4 rounded-full lg:flex ${fill}`}
    >
      {[leftPupilRef, rightPupilRef].map((ref, i) => (
        <span
          key={i}
          className={`relative h-[30%] w-[22%] shrink-0 overflow-hidden rounded-full ${eyeWhite}`}
        >
          <span
            ref={ref}
            className="absolute left-1/2 top-1/2 h-[46%] w-[46%] rounded-full bg-[#1F1F1F]"
            style={{ transform: 'translate(-50%, -50%)' }}
          />
        </span>
      ))}
    </div>
  );
}

export default CornerMascot;
