import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Moves a specular highlight across a glass surface as the device tilts or the
 * pointer moves, so the panel behaves like a pane catching a light source
 * rather than a static translucent rectangle.
 *
 * WHAT DRIVES IT, and why there is no permission prompt.
 *
 *   desktop / any pointer   pointermove on the window
 *   Android, most others    deviceorientation, which needs no permission on a
 *                           secure origin
 *   iOS                     falls back to touch, deliberately
 *
 * iOS gates DeviceOrientationEvent behind requestPermission(), which must be
 * called from a user gesture and shows a system dialog. Asking a parent for
 * motion-sensor access so that a menu can be shiny is not a trade worth making,
 * and a prompt that arrives unexplained is the kind of thing that makes people
 * distrust a site. So this never asks. On iOS the highlight follows the finger,
 * which is where the reader is looking anyway.
 *
 * REDUCED MOTION TURNS IT OFF ENTIRELY. Not damped -- off. A highlight that
 * chases the pointer is exactly the continuous, unrequested movement that
 * setting exists to stop. The surface keeps its static edge highlight, so it
 * still reads as glass; it just stops moving.
 *
 * Every update is coalesced into one requestAnimationFrame. The panel this
 * drives carries a 36px backdrop-blur, which is expensive to repaint, so
 * writing the variables on every raw event would mean several repaints per
 * frame of a full-screen blur on a mid-range phone.
 *
 * Returns the ref to attach and the initial style. The hook writes
 * `--gx` / `--gy` straight onto the node rather than through React state,
 * because re-rendering a sheet on every pointer move is the other way to make
 * this expensive.
 */

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export interface GlassReflection {
  ref: (node: HTMLElement | null) => void;
  /** Starting position, so the surface is lit before the first event. */
  style: React.CSSProperties;
}

export function useGlassReflection(active: boolean): GlassReflection {
  const nodeRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 50, y: 0 });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(REDUCED_MOTION);
    const onChange = () => setReduced(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const ref = useCallback((node: HTMLElement | null) => {
    nodeRef.current = node;
  }, []);

  const schedule = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      const node = nodeRef.current;
      if (!node) return;
      node.style.setProperty('--gx', `${targetRef.current.x}%`);
      node.style.setProperty('--gy', `${targetRef.current.y}%`);
    });
  }, []);

  useEffect(() => {
    if (!active || reduced || typeof window === 'undefined') return;

    const onPointer = (e: PointerEvent) => {
      const node = nodeRef.current;
      if (!node) return;
      const r = node.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      /* Relative to the PANEL, not the window: the highlight should sit under
         the pointer when it is over the glass, and trail off sensibly when it
         is not. Clamped so a pointer far away does not push the gradient
         somewhere that stops lighting the surface at all. */
      targetRef.current = {
        x: clamp(((e.clientX - r.left) / r.width) * 100, -30, 130),
        y: clamp(((e.clientY - r.top) / r.height) * 100, -60, 160),
      };
      schedule();
    };

    const onOrient = (e: DeviceOrientationEvent) => {
      /* gamma is left/right tilt, beta is front/back, both in degrees.
         +-35 degrees covers the range a hand actually moves through while
         holding a phone; beyond that the highlight is already off the panel.
         beta is offset because a phone is typically held around 45 degrees
         rather than flat, so that posture should be the neutral, centred one. */
      const gamma = e.gamma ?? 0;
      const beta = (e.beta ?? 45) - 45;
      targetRef.current = {
        x: clamp(50 + (gamma / 35) * 60, -30, 130),
        y: clamp(10 + (beta / 35) * 60, -60, 160),
      };
      schedule();
    };

    window.addEventListener('pointermove', onPointer, { passive: true });
    /* No requestPermission call. On iOS this listener simply never fires and
       the pointer path above covers it. */
    window.addEventListener('deviceorientation', onOrient, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('deviceorientation', onOrient);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [active, reduced, schedule]);

  return {
    ref,
    style: { '--gx': '50%', '--gy': '0%' } as React.CSSProperties,
  };
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}
