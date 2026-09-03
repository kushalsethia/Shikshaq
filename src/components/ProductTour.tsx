import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, X } from 'lucide-react';

import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import { hasSeenOnboarding, markOnboardingSeen } from '@/lib/onboarding';
import { PAST_PAPERS_PATH } from '@/lib/nav-config';

/* The one onboarding.
 *
 * There were two, doing the same job in two visual languages: OnboardingModal
 * opened itself once per browser on a full orange screen, and ProductTour
 * opened on a logo tap as four dark cards. A visitor could meet both in a
 * minute, be told the same three facts twice, and reasonably conclude the
 * second one was a bug. They are now this, which runs on first visit AND on
 * every logo tap, so the thing you can re-open is the thing you were shown.
 *
 * The vibe, per the owner's two references: one saturated colour per step
 * edge to edge, a big mascot face carrying the step's mood, an oversized
 * display headline, and a row of real chips at the bottom. Brand palette only
 * - orange, indigo, mint, ink - not the references' pink and lilac.
 *
 * Every number on these screens is fetched. A count that cannot be read is
 * simply not drawn, rather than being filled in with a plausible figure.
 */

export const OPEN_TOUR_EVENT = 'shikshaq:open-tour';

export function openProductTour() {
  window.dispatchEvent(new CustomEvent(OPEN_TOUR_EVENT));
}

export function useProductTour() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_TOUR_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_TOUR_EVENT, onOpen);
  }, []);
  return { open, setOpen };
}

/* ---------------------------------------------------------------------------
   The mascot

   The site already has two mascot treatments and this is deliberately the
   third of nothing: it reuses CornerMascot's exact anatomy (a circular face,
   two rounded eye whites, dark pupils, one catchlight high-left) so the face
   on the welcome screen is recognisably the face on the home page. What it
   adds is a mouth, because these screens carry a mood and CornerMascot's
   eyes-only face cannot.
--------------------------------------------------------------------------- */

type Mood = 'hi' | 'reading' | 'chat' | 'go';

/* Mouth geometry in the face's own percentage space, so the face scales
   without the mouth drifting. */
const MOUTH: Record<Mood, { d: string; open: boolean }> = {
  hi: { d: 'M30 60 Q50 82 70 60', open: true },
  reading: { d: 'M34 64 Q50 74 66 64', open: false },
  chat: { d: 'M32 62 Q50 80 68 62', open: true },
  go: { d: 'M30 58 Q50 84 70 58', open: true },
};

function Mascot({
  mood,
  faceFill,
  eyeWhite,
  ink,
  className,
}: {
  mood: Mood;
  faceFill: string;
  eyeWhite: string;
  ink: string;
  className?: string;
}) {
  const m = MOUTH[mood];
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="50" cy="50" r="50" fill={faceFill} />
      {/* Eyes. Tall rounded capsules, not circles: this is the shape the home
          page's mascot uses, and a circle reads as a different character. */}
      {[34, 66].map((cx) => (
        <g key={cx}>
          <rect x={cx - 11} y={26} width={22} height={30} rx={11} fill={eyeWhite} />
          <circle cx={cx} cy={43} r={8.5} fill={ink} />
          <circle cx={cx - 3} cy={39.5} r={2.6} fill="#FFFFFF" opacity={0.92} />
        </g>
      ))}
      <path
        d={m.d}
        stroke={ink}
        strokeWidth={7}
        strokeLinecap="round"
        fill={m.open ? ink : 'none'}
      />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   Steps
--------------------------------------------------------------------------- */

interface Step {
  key: string;
  mood: Mood;
  /** Full-bleed background. */
  bg: string;
  /** Ink that measures >= 4.5:1 on `bg`. */
  ink: string;
  /** Softer ink for body copy, still >= 4.5:1. */
  inkSoft: string;
  faceFill: string;
  eyeWhite: string;
  /** Pupil / mouth colour on the face. */
  faceInk: string;
  headline: React.ReactNode;
  body: string;
  chipBg: string;
  chipInk: string;
}

/* Orange carries dark ink and never white: index.css records the measurement
   (white on #FF8000 is 2.52:1, under the 4.5:1 floor) and every other brand
   surface in the app already uses #1F1F1F on it. */
const STEPS: Step[] = [
  {
    key: 'teachers',
    mood: 'hi',
    bg: 'bg-brand',
    ink: 'text-brand-foreground',
    inkSoft: 'text-brand-foreground/80',
    faceFill: '#FCFAF7',
    eyeWhite: '#FFFFFF',
    faceInk: '#1F1F1F',
    headline: (
      <>
        Find a teacher
        <br />
        who teaches
        <br />
        your board.
      </>
    ),
    body: 'Filter by subject, class, board and your part of Kolkata. Every teacher here is verified.',
    chipBg: 'bg-[#FCFAF7]',
    chipInk: 'text-foreground',
  },
  {
    key: 'papers',
    mood: 'reading',
    bg: 'bg-brand-blue',
    ink: 'text-white',
    /* /90, not /85. Composited against #4351FF the softer value measures
       4.37:1, which is under the 4.5:1 floor for 15px body copy; /90 measures
       4.71:1. The orange step's /80 is fine because its ink is near-black. */
    inkSoft: 'text-white/90',
    faceFill: '#FFD84D',
    eyeWhite: '#FFFFFF',
    faceInk: '#1F1F1F',
    headline: (
      <>
        Past papers,
        <br />
        free to read.
      </>
    ),
    body: 'Real question papers from real schools, with marks and chapters. The first five questions need no account at all.',
    chipBg: 'bg-white',
    chipInk: 'text-brand-blue-deep',
  },
  {
    key: 'direct',
    mood: 'chat',
    bg: 'bg-mint',
    ink: 'text-foreground',
    inkSoft: 'text-warm-prose',
    faceFill: '#FF8000',
    eyeWhite: '#FFFFFF',
    faceInk: '#1F1F1F',
    headline: (
      <>
        Message them
        <br />
        yourself.
        <br />
        No agent.
      </>
    ),
    body: 'You contact the teacher directly and they keep every rupee of their fee. Shikshaq takes no cut and sits in no middle.',
    chipBg: 'bg-white',
    chipInk: 'text-foreground',
  },
];

/* ---------------------------------------------------------------------------
   Counts

   Two numbers, both real, both cheap. Anything a query cannot return is left
   off the screen rather than invented.
--------------------------------------------------------------------------- */
function useTourCounts(enabled: boolean) {
  return useQuery({
    queryKey: ['tour', 'counts'],
    enabled,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const [teachers, papers] = await Promise.all([
        supabase.from('teachers_list').select('id', { count: 'exact', head: true }),
        supabase
          .from('bank_papers')
          .select('id', { count: 'exact', head: true })
          .eq('is_published', true),
      ]);
      return { teachers: teachers.count ?? null, papers: papers.count ?? null };
    },
  });
}

/* ---------------------------------------------------------------------------
   The flow
--------------------------------------------------------------------------- */

export interface ProductTourProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductTour({ open, onOpenChange }: ProductTourProps) {
  const [i, setI] = React.useState(0);
  const navigate = useNavigate();
  const counts = useTourCounts(open);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const skipRef = React.useRef<HTMLButtonElement>(null);

  /* First visit opens it on its own. The same flag the old modal used, so a
     visitor who already dismissed that one is not shown this. */
  React.useEffect(() => {
    if (!hasSeenOnboarding()) onOpenChange(true);
  }, [onOpenChange]);

  React.useEffect(() => {
    if (open) setI(0);
  }, [open]);

  const close = React.useCallback(() => {
    // Recorded before any animation, so the record cannot depend on the tab
    // surviving one.
    markOnboardingSeen();
    onOpenChange(false);
  }, [onOpenChange]);

  /* Escape closes, and focus starts inside the panel rather than wherever the
     logo left it. Without this a keyboard user tabs into the page behind. */
  React.useEffect(() => {
    if (!open) return;
    skipRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') setI((v) => Math.min(v + 1, STEPS.length - 1));
      if (e.key === 'ArrowLeft') setI((v) => Math.max(v - 1, 0));
    };
    document.addEventListener('keydown', onKey);
    // The page behind must not scroll under the overlay.
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  if (!open) return null;

  const step = STEPS[i];
  const last = i === STEPS.length - 1;
  const c = counts.data;

  const advance = () => {
    if (last) {
      close();
      navigate('/all-tuition-teachers-in-kolkata');
      return;
    }
    setI((v) => v + 1);
  };

  /* Chips carry this step's own real number, and are skipped entirely when the
     count has not arrived or is zero. */
  const chips: string[] =
    step.key === 'teachers'
      ? c?.teachers
        ? [`${c.teachers} verified teachers`, 'Free to contact']
        : ['Free to contact']
      : step.key === 'papers'
        ? c?.papers
          ? [`${c.papers} papers`, 'Marks and chapters']
          : ['Marks and chapters']
        : ['They keep 100%', 'No commission'];

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="How Shikshaq works"
      className={cn(
        'fixed inset-0 z-[100] flex flex-col overflow-hidden transition-colors duration-500 ease-snap',
        step.bg,
      )}
    >
      {/* Chrome: the mark, and one way out that is always in the same place. */}
      <div className="flex h-16 flex-none items-center justify-between px-5">
        <Logo
          size="nav"
          className="tap-44 pointer-events-none [&_img]:[filter:brightness(0)]"
          ariaLabel="Shikshaq"
          priority
        />
        <button
          ref={skipRef}
          type="button"
          onClick={close}
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-full bg-black/10 transition-colors duration-150 hover:bg-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
            step.ink,
          )}
          aria-label="Skip the introduction"
        >
          <X className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>

      {/* The step. Scrolls on a short screen rather than clipping the CTA. */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-2">
        <div className="flex w-full max-w-[560px] flex-col items-center">
          <Mascot
            key={step.key}
            mood={step.mood}
            faceFill={step.faceFill}
            eyeWhite={step.eyeWhite}
            ink={step.faceInk}
            className="mb-6 h-[124px] w-[124px] motion-safe:animate-panel-fade sm:h-[150px] sm:w-[150px]"
          />

          {/* text-balance so a three-line headline does not leave one orphan
              word on the last line at an awkward width. */}
          <h2
            className={cn(
              'text-balance text-center font-display text-[40px] font-black leading-[0.94] tracking-[-0.055em] sm:text-[54px]',
              step.ink,
            )}
          >
            {step.headline}
          </h2>

          <p
            className={cn(
              'mt-4 max-w-[38ch] text-pretty text-center text-[15px] leading-[1.55]',
              step.inkSoft,
            )}
          >
            {step.body}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {chips.map((label) => (
              <span
                key={label}
                className={cn(
                  'inline-flex h-9 items-center rounded-full px-4 text-[13.5px] font-extrabold tabular-nums',
                  step.chipBg,
                  step.chipInk,
                )}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer: progress, then the action. */}
      <div className="flex-none px-6 pb-8 pt-2">
        <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-4">
          <div className="flex items-center gap-2" role="presentation">
            {STEPS.map((s, n) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setI(n)}
                aria-label={`Step ${n + 1} of ${STEPS.length}`}
                aria-current={n === i ? 'step' : undefined}
                className="tap-44 flex h-2.5 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
              >
                <span
                  className={cn(
                    'block h-2.5 rounded-full transition-all duration-300 ease-snap',
                    step.ink.replace('text-', 'bg-'),
                    n === i ? 'w-7 opacity-100' : 'w-2.5 opacity-35',
                  )}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={advance}
            className={cn(
              'flex h-[56px] w-full items-center justify-center gap-2 rounded-full text-[16px] font-extrabold transition-transform duration-tap hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
              step.chipBg,
              step.chipInk,
            )}
          >
            {last ? 'Start looking' : 'Next'}
            <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>

          {/* A second way past, for the reader who wants the papers rather than
              a teacher. Only on the last step, where the choice is real. */}
          {last && (
            <button
              type="button"
              onClick={() => {
                close();
                navigate(PAST_PAPERS_PATH);
              }}
              className={cn(
                'flex min-h-11 items-center justify-center text-[14px] font-semibold underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
                step.inkSoft,
              )}
            >
              Take me to the papers instead
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Mounts the tour once for the whole app, owning its own open state.
 *
 * There must be exactly one of these. The logo trigger is a window event, so a
 * second mounted copy would answer the same tap and stack two dialogs on top of
 * each other. It lives in App.tsx rather than on the home page because the
 * first-visit open has to work for someone who arrives on a paper or a teacher
 * profile from search, which is how most first visits actually start.
 */
export function ProductTourHost() {
  const { open, setOpen } = useProductTour();
  return <ProductTour open={open} onOpenChange={setOpen} />;
}

export default ProductTour;
