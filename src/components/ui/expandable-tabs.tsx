import { NavLink } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import type { LucideIcon } from 'lucide-react';

export interface ExpandableTab {
  to: string;
  label: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
}

/**
 * Shared expand-on-select tab primitive backing both the mobile bottom nav
 * and the desktop top nav (DESIGN_SYSTEM §11 / VISUAL_LANGUAGE §9).
 *
 * The "expanded" tab is the one whose route matches the current location
 * (via `isActive`), not click-driven local state — the label reveal tracks
 * `useLocation()` in the caller. A lightweight `peek` state (hover/focus on
 * an *inactive* tab) previews its label too, and collapses on outside
 * click/tap via `useOnClickOutside` so a touch tap elsewhere always closes
 * any open peek instead of leaving it stuck expanded.
 *
 * Width/opacity of the revealed label animate with framer-motion — the one
 * place in the codebase sanctioned to use it (DESIGN_SYSTEM §6).
 */
export function ExpandableTabs({
  tabs,
  pathname,
  theme,
  className = '',
}: {
  tabs: ExpandableTab[];
  pathname: string;
  theme: 'dark' | 'light';
  className?: string;
}) {
  const [peekIndex, setPeekIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLUListElement>(null);
  useOnClickOutside(containerRef as React.RefObject<HTMLElement>, () => setPeekIndex(null));
  // DESIGN_SYSTEM §6: no exceptions for reduced-motion. framer-motion doesn't
  // auto-honor the media query for arbitrary animate props, so gate it here.
  const prefersReducedMotion = useReducedMotion();

  const isDark = theme === 'dark';

  return (
    <ul
      ref={containerRef}
      className={`relative flex items-stretch ${className}`}
    >
      {tabs.map((tab, index) => {
        const active = tab.isActive(pathname);
        const expanded = active || peekIndex === index;
        const Icon = tab.icon;

        return (
          <li
            key={tab.label}
            className={`flex items-stretch transition-[flex-grow] duration-300 ease-out ${
              expanded ? 'flex-[1.6]' : 'flex-1'
            } ${isDark ? 'py-2' : ''}`}
          >
            <NavLink
              to={tab.to}
              aria-current={active ? 'page' : undefined}
              aria-label={tab.label}
              onMouseEnter={() => !active && setPeekIndex(index)}
              onMouseLeave={() => setPeekIndex((v) => (v === index ? null : v))}
              onFocus={() => !active && setPeekIndex(index)}
              onBlur={() => setPeekIndex((v) => (v === index ? null : v))}
              className={`relative flex h-11 w-full items-center justify-center gap-1.5 overflow-hidden rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 active:scale-[0.94] ${
                isDark
                  ? `focus-visible:ring-offset-panel ${active ? 'bg-brand' : ''}`
                  : `focus-visible:ring-offset-background ${active ? 'bg-card shadow-border text-brand' : 'text-foreground hover:bg-muted'}`
              }`}
            >
              <Icon
                className={`relative z-10 h-5 w-5 shrink-0 transition-colors duration-150 ${
                  isDark
                    ? active
                      ? 'text-white'
                      : 'text-white/50'
                    : active
                      ? 'text-brand'
                      : 'text-muted-foreground'
                }`}
                strokeWidth={active ? 2.25 : 1.8}
                aria-hidden
              />
              <motion.span
                aria-hidden
                initial={false}
                animate={{
                  maxWidth: expanded ? 96 : 0,
                  opacity: expanded ? 1 : 0,
                  marginLeft: expanded ? 6 : 0,
                }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={`relative z-10 overflow-hidden whitespace-nowrap text-xs font-medium motion-reduce:transition-none ${
                  isDark ? 'text-white' : active ? 'text-brand' : 'text-foreground'
                }`}
              >
                {tab.label}
              </motion.span>
              {!isDark && active && (
                <span
                  aria-hidden
                  className="absolute -bottom-px left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-brand"
                />
              )}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}
