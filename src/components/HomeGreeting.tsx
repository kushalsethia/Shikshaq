import { useEffect, useState } from 'react';
import { FileText, Clock } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useLikes } from '@/lib/likes-context';
import { getRecentlyVisited, type RecentVisit } from '@/lib/recently-visited';

/**
 * Signed-in "Hello" greeting slab for the home page. Rounded saturated slab
 * pattern (VISUAL_LANGUAGE §1.1) — real, currently-queryable metrics only:
 * favourited teachers (likes-context) as the dominant stat, recently-visited
 * count as a secondary chip. No fabricated streaks/percentages.
 */
export function HomeGreeting() {
  const { user, profile } = useAuth();
  const { likedCount } = useLikes();
  const [recent, setRecent] = useState<RecentVisit[]>([]);

  useEffect(() => {
    setRecent(getRecentlyVisited());
  }, []);

  if (!user) return null;

  const firstName = profile?.full_name?.trim().split(' ')[0] || user.email?.split('@')[0] || 'there';
  const papersViewed = recent.filter((r) => r.type === 'paper').length;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
      <div className="rounded-4xl bg-brand p-6 text-brand-foreground sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Hello, {firstName} 👋
        </h2>
        <p className="mt-1 text-sm text-brand-foreground/80">
          {likedCount > 0 || recent.length > 0
            ? 'Here is where you left off.'
            : 'Welcome back — start by favouriting a teacher or browsing past papers.'}
        </p>

        {(likedCount > 0 || recent.length > 0) && (
          <div className="mt-6 flex flex-wrap items-end gap-6">
            {likedCount > 0 && (
              <div>
                <span className="text-4xl font-extrabold tabular-nums tracking-[-.02em] sm:text-5xl">
                  {likedCount}
                </span>
                <p className="mt-1 text-[11.5px] font-bold uppercase tracking-[.04em] text-brand-foreground/75">
                  Favourite {likedCount === 1 ? 'teacher' : 'teachers'}
                </p>
              </div>
            )}

            {recent.length > 0 && (
              <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">
                <Clock className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                <span className="text-sm font-medium tabular-nums">{recent.length} recently visited</span>
              </div>
            )}

            {papersViewed > 0 && (
              <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">
                <FileText className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                <span className="text-sm font-medium tabular-nums">{papersViewed} papers viewed</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
