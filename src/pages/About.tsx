import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { PreFooter } from '@/components/layout/PreFooter';
import { PageContainer, BottomNavSpacer } from '@/components/layout/PageContainer';
import { AnnotatedStatement } from '@/components/marketing/annotated-statement';
import { StripePlaceholder } from '@/components/ui/stripe-placeholder';
import { Button } from '@/components/ui/button';
import { usePageMeta } from '@/hooks/usePageMeta';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

// S21 — one typographic statement on a faint grid ground ("a straight line
// between a parent and a teacher"), three tilted annotation pills, an origin
// story paragraph, real stat tiles, and a near-black founders card. Replaces
// the previous hero+principles+CTA layout entirely (changelog C-058).
export default function About() {
  usePageMeta(
    'About Shikshaq | Free tuition teacher matching in Kolkata',
    'Shikshaq is a free platform connecting Kolkata students with verified tuition teachers directly, with no commission and no middlemen.'
  );

  // Every stat is a real running query (design.md §0.10 / brief rule 5). A stat
  // whose count fails to fetch is dropped from the tile list entirely, never
  // hardcoded and never shown as a fabricated number — this is why there is no
  // "median reply time" tile here even though the mockup draws one: nothing in
  // the schema tracks first-reply latency, so it cannot be a real query.
  const [stats, setStats] = useState({
    teachers: null as number | null,
    papers: null as number | null,
    schools: null as number | null,
  });

  useEffect(() => {
    let cancelled = false;
    async function fetchStats() {
      const [teachersRes, papersRes, schoolsRes] = await Promise.all([
        supabase.from('teachers_list').select('id', { count: 'exact', head: true }),
        supabase.from('papers').select('id', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('papers').select('school').eq('is_published', true),
      ]);
      if (cancelled) return;
      if (teachersRes.error) logger.error('About.fetchStats.teachers', teachersRes.error);
      if (papersRes.error) logger.error('About.fetchStats.papers', papersRes.error);
      if (schoolsRes.error) logger.error('About.fetchStats.schools', schoolsRes.error);
      const distinctSchools = schoolsRes.data ? new Set(schoolsRes.data.map((p) => p.school)).size : null;
      setStats({
        teachers: teachersRes.count ?? null,
        papers: papersRes.count ?? null,
        schools: distinctSchools,
      });
    }
    fetchStats();
    return () => {
      cancelled = true;
    };
  }, []);

  /* Guarded on > 0, not != null. `!= null` only hides these while they load, so
     with an empty papers table this page — the one page whose whole job is to
     say we are trustworthy — rendered "0 past papers, free to read" and
     "0 Kolkata schools represented" as if they were achievements. design.md
     §3.2: never advertise emptiness. A zero drops its tile. */
  const statTiles = [
    (stats.teachers ?? 0) > 0
      ? { value: stats.teachers!.toLocaleString('en-IN'), label: 'verified teachers listed', ink: 'text-foreground' }
      : null,
    (stats.papers ?? 0) > 0
      ? { value: stats.papers!.toLocaleString('en-IN'), label: 'past papers, free to read', ink: 'text-brand-blue-deep' }
      : null,
    // A fact, not a query — always true, so it always shows (same reasoning
    // PreFooter's B2 uses for its commission line).
    { value: '₹0', label: 'commission taken from a fee', ink: 'text-brand-deep' },
    (stats.schools ?? 0) > 0
      ? { value: stats.schools!.toLocaleString('en-IN'), label: 'Kolkata schools represented', ink: 'text-foreground' }
      : null,
  ].filter(Boolean) as { value: string; label: string; ink: string }[];

  const statement = (
    <>
      a straight{' '}
      <span
        className="marker-highlight marker-highlight--pill"
        style={{ '--marker-color': 'hsl(var(--brand-subtle))' } as React.CSSProperties}
      >
        line
      </span>
      <br className="lg:hidden" />
      <span className="hidden lg:inline"> </span>between{' '}
      <br className="lg:hidden" />
      a parent and
      <br className="lg:hidden" /> a teacher.
    </>
  );

  return (
    <div className="min-h-screen bg-background">

      <main className="pb-20 lg:pb-0">
        <PageContainer as="section" className="pt-6 sm:pt-10 lg:pt-14">
          <AnnotatedStatement
            statement={statement}
            align="left"
            className="px-[18px] py-6 lg:px-10 lg:py-14 lg:text-center"
            /* The third pill was hard-coded to the copy deck's "846 past papers,
               free" while the library actually holds none — a fabricated number
               on the page that exists to establish trust. It now states the
               real count, and drops out entirely rather than saying zero. */
            pills={[
              { label: 'No commission, ever', anchor: 'top-right' as const, tone: 'dark' as const, tilt: 4 },
              { label: 'WhatsApp, not a call centre', anchor: 'bottom-left' as const, tone: 'bone' as const, tilt: -3 },
              ...((stats.papers ?? 0) > 0
                ? [{
                    label: `${stats.papers!.toLocaleString('en-IN')} past papers, free`,
                    anchor: 'bottom-right' as const,
                    tone: 'indigo' as const,
                    tilt: -3,
                    dot: true,
                  }]
                : []),
            ]}
          />
        </PageContainer>

        {/* Story + stats + founders card */}
        <PageContainer as="section" className="pt-8 sm:pt-10 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pt-14">
          <div>
            <p className="max-w-prose text-body-secondary leading-[1.6] text-warm-prose">
              ShikshAQ started because finding a tutor in Kolkata still meant asking three
              neighbours and trusting a photocopied leaflet. We list teachers, verify who they
              say they are, and then get out of the way. The fee you agree is the fee the
              teacher keeps.
            </p>
            <div className="mt-[14px] grid grid-cols-2 gap-[10px] lg:grid-cols-4">
              {statTiles.map((st) => (
                <div key={st.label} className="rounded-[18px] bg-card p-[14px] shadow-border">
                  <div className={`font-display text-[24px] lg:text-[28px] font-black tracking-[-0.04em] tabular-nums ${st.ink}`}>
                    {st.value}
                  </div>
                  <div className="mt-[2px] text-[12.5px] leading-[1.4] text-warm-label">{st.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-[14px] rounded-[22px] bg-panel p-[18px] text-background lg:mt-0 lg:p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="h-11 w-11 flex-none overflow-hidden rounded-full lg:h-[52px] lg:w-[52px]">
                <StripePlaceholder name="Sourav" initialSize={19} />
              </div>
              <div>
                <div className="text-[14.5px] font-bold">Made by two people</div>
                <div className="text-[12.5px] text-background/62">Kolkata &middot; since 2023</div>
              </div>
            </div>
            <p className="text-[13.5px] leading-[1.65] text-background/78">
              &ldquo;We built this for our own families first. If a teacher near you is good, you
              should be able to find them in under a minute &mdash; and talk to them without
              anyone taking a cut.&rdquo;
            </p>
            <Button asChild variant="primary" size={46} className="mt-4 hidden lg:inline-flex">
              <Link to="/join">
                List yourself as a teacher
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </PageContainer>

        {/* Retained: the existing "recommend a teacher" flow isn't in the S21
            mockup, but it's real functionality (a live route + form the app
            depends on), so it stays — styled in the mockup's own language
            rather than dropped (brief "keep functionality"). */}
        <PageContainer as="section" className="py-8 sm:py-12">
          <Link
            to="/recommend-teacher"
            className="flex items-center gap-4 rounded-3xl bg-card p-4 shadow-border transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-border-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-6"
          >
            <div className="min-w-0 flex-1">
              <p className="font-display text-card-title font-semibold text-foreground">Know a good teacher?</p>
              <p className="text-body-secondary text-muted-foreground">
                Recommend them &mdash; we&rsquo;ll reach out and get them listed, free.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 flex-none text-warm-label" aria-hidden="true" />
          </Link>
        </PageContainer>

        <PageContainer as="section" className="pb-8 sm:pb-12">
          <PreFooter variant="B1" />
        </PageContainer>
        <BottomNavSpacer />
      </main>

      <Footer />
    </div>
  );
}
