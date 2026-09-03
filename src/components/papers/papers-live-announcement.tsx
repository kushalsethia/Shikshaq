import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { hasSeenOnboarding } from '@/lib/onboarding';
import { PAST_PAPERS_PATH } from '@/lib/nav-config';

/* "Past papers are live" — a one-time announcement, not a second onboarding.
 *
 * Shown once per browser, and deliberately NOT to someone who is meeting the
 * product for the first time: hasSeenOnboarding() gates it, so a first visit
 * gets the tour and nothing else, and this lands on the NEXT visit. Two
 * full-screen "here is the product" moments in one session is exactly the
 * duplication that got OnboardingModal deleted, and this is the same trap one
 * component further along.
 *
 * Every number is fetched. If the counts do not arrive the panel still opens
 * with the sentence that needs no figure, rather than rendering a zero or a
 * plausible-looking guess.
 */
const SEEN_KEY = 'shikshaq.papersLiveSeen';

function hasSeen(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === '1';
  } catch {
    // Storage unavailable (private mode, quota). Treat as seen: a nudge that
    // cannot remember being dismissed is a nudge that reappears every load.
    return true;
  }
}

function markSeen(): void {
  try {
    localStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Nothing to persist; the dismiss still works for this session.
  }
}

function usePapersCounts(enabled: boolean) {
  return useQuery({
    queryKey: ['papers-live', 'counts'],
    enabled,
    staleTime: 10 * 60 * 1000,
    queryFn: async () => {
      const [papers, schools] = await Promise.all([
        supabase.from('bank_papers').select('id', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('bank_papers').select('school').eq('is_published', true).eq('has_school', true),
      ]);
      return {
        papers: papers.count ?? null,
        schools: schools.data ? new Set(schools.data.map((r) => r.school)).size : null,
      };
    },
  });
}

export function PapersLiveAnnouncement() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const counts = usePapersCounts(open);

  useEffect(() => {
    /* Only for a returning visitor. A first-timer is mid-tour. */
    if (!hasSeen() && hasSeenOnboarding()) {
      /* One frame late, so it never races the tour's own mount and never
         competes with first paint. */
      const t = window.setTimeout(() => setOpen(true), 900);
      return () => window.clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    markSeen();
    setOpen(false);
  };

  const go = () => {
    markSeen();
    setOpen(false);
    navigate(PAST_PAPERS_PATH);
  };

  const c = counts.data;

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) dismiss(); }}>
      <DialogContent
        aria-describedby="papers-live-body"
        className="w-[calc(100vw-2rem)] overflow-hidden rounded-[28px] p-0 sm:max-w-md"
      >
        {/* Indigo header. Papers are the indigo half of the brand pair
            everywhere else on the site, so the announcement wears the colour of
            the thing it is announcing rather than the generic brand orange. */}
        <div className="relative overflow-hidden bg-brand-blue px-5 pb-6 pt-7 sm:px-6">
          <div aria-hidden="true" className="mb-4 flex justify-center gap-3">
            {/* The mascot, in the papers colourway. Same anatomy as the tour's
                face so it reads as the same character. */}
            {[0, 1].map((i) => (
              <span
                key={i}
                className="relative block h-[46px] w-[40px] overflow-hidden rounded-full bg-white"
              >
                <span className="absolute left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-panel">
                  <span
                    className={`absolute h-[74%] w-[74%] rounded-full bg-white ${
                      i === 0 ? '-left-[26%]' : '-right-[26%]'
                    } -top-[26%]`}
                  />
                </span>
              </span>
            ))}
          </div>

          <DialogHeader className="items-center text-center">
            <DialogTitle className="text-balance font-display text-[26px] font-black leading-[1.05] tracking-[-0.04em] text-white">
              Past papers are live
            </DialogTitle>
          </DialogHeader>

          <p id="papers-live-body" className="mt-2 text-center text-[14.5px] leading-[1.55] text-white/90">
            {c?.papers && c?.schools
              ? `${c.papers} real question papers from ${c.schools} schools, typed out with their marks and chapters.`
              : 'Real question papers, typed out with their marks and chapters.'}
          </p>
        </div>

        <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
          <p className="mb-4 text-center text-[13.5px] leading-[1.55] text-warm-prose">
            The first five questions on every paper are free to read, no account needed.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={go} variant="indigo" size={52} className="w-full">
              Open the library
              <ArrowRight size={17} strokeWidth={2.4} aria-hidden="true" />
            </Button>
            <Button onClick={dismiss} variant="muted" size={44} className="w-full">
              Not now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PapersLiveAnnouncement;
