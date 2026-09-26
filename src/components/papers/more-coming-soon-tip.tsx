import { useEffect, useId, useState, type ReactNode } from 'react';

/* Owner request 2026-09-26: the hero's paper count gets a "More coming soon"
   tooltip that shows on hover/focus AND reveals itself on a loop, so a
   visitor who never hovers still sees that the library is growing. */
const FIRST_REVEAL_MS = 1500;
const CYCLE_MS = 10_000;
const VISIBLE_MS = 2600;

export function MoreComingSoonTip({ children }: { children: ReactNode }) {
  const id = useId();
  const [autoShown, setAutoShown] = useState(false);

  useEffect(() => {
    let hideTimer: number | undefined;
    const reveal = () => {
      setAutoShown(true);
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => setAutoShown(false), VISIBLE_MS);
    };
    const first = window.setTimeout(reveal, FIRST_REVEAL_MS);
    const loop = window.setInterval(reveal, CYCLE_MS);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(loop);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <span
      tabIndex={0}
      aria-describedby={id}
      className="group relative inline-block cursor-default rounded-md tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      {children}
      {/* Below the number, not above: at mobile the headline sits right under
          the fixed navbar, which would cover a tooltip placed on top.
          Left-anchored, not centred: the number can open the line, and a
          centred pill wider than "1,960" ran to the edge of a 320px screen. */}
      <span
        id={id}
        role="tooltip"
        data-show={autoShown}
        className="pointer-events-none absolute left-0 top-full z-10 mt-2 translate-y-1 scale-95 whitespace-nowrap rounded-full bg-card px-3 py-1.5 font-sans text-sm font-semibold leading-none tracking-normal text-foreground opacity-0 shadow-border-hover transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:scale-100 group-focus-visible:opacity-100 data-[show=true]:translate-y-0 data-[show=true]:scale-100 data-[show=true]:opacity-100 motion-reduce:transition-none"
      >
        More coming soon
      </span>
    </span>
  );
}
