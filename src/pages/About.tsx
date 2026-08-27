import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { BentoStack, BentoPanel } from '@/components/layout/PageContainer';
import { AnnotatedStatement, AnnotatedHighlight } from '@/components/marketing/annotated-statement';
import { StripePlaceholder } from '@/components/ui/stripe-placeholder';
import { IconDisc } from '@/components/ui/icon-disc';
import { Button } from '@/components/ui/button';
import { usePageMeta } from '@/hooks/usePageMeta';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { EyesPanel } from '@/components/home/EyesPanel';
import { useSentenceBuilder } from '@/hooks/useSentenceBuilder';
import { useChromeConfig } from '@/components/layout/AppShell';

// S21 — one typographic statement on a faint grid ground ("a straight line
// between a parent and a teacher"), three tilted annotation pills, an origin
// story paragraph, real stat tiles, and a near-black founders card. Replaces
// the previous hero+principles+CTA layout entirely (changelog C-058).
export default function About() {
  usePageMeta(
    'About Shikshaq | Free tuition teacher matching in Kolkata',
    'Shikshaq is a free platform connecting Kolkata students with verified tuition teachers directly, with no commission and no middlemen.'
  );

  // Handoff AB-001: this route renders its own eyes panel, replacing
  // AppShell's default pre-footer.
  useChromeConfig({ preFooter: 'none' });
  const {
    builderMode, setBuilderMode, slots: builderSlots, onSlotChange: handleSlotChange, onSubmit: handleBuilderSubmit,
  } = useSentenceBuilder();

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
      ? { value: stats.teachers!.toLocaleString('en-IN'), label: 'verified teachers listed', ink: 'text-foreground', tint: 'bg-muted' }
      : null,
    (stats.papers ?? 0) > 0
      ? { value: stats.papers!.toLocaleString('en-IN'), label: 'past papers, free to read', ink: 'text-foreground', tint: 'bg-muted' }
      : null,
    // A fact, not a query — always true, so it always shows (same reasoning
    // PreFooter's B2 uses for its commission line).
    { value: '₹0', label: 'commission taken from a fee', ink: 'text-brand-deep', tint: 'bg-brand-subtle' },
    (stats.schools ?? 0) > 0
      ? { value: stats.schools!.toLocaleString('en-IN'), label: 'Kolkata schools represented', ink: 'text-foreground', tint: 'bg-muted' }
      : null,
  ].filter(Boolean) as { value: string; label: string; ink: string; tint: string }[];

  const statement = (
    <>
      a straight{' '}
      <AnnotatedHighlight tone="pill-brand">line</AnnotatedHighlight>
      <br className="lg:hidden" />
      <span className="hidden lg:inline"> </span>between{' '}
      <br className="lg:hidden" />
      a parent and
      <br className="lg:hidden" /> a teacher.
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <main>
        <BentoStack>
          {/* Handoff AB-002: the annotated statement, now inside a bone header panel. */}
          <BentoPanel fill="card" edge="top" className="px-[22px] pt-[14px] pb-[26px]">
            <AnnotatedStatement
              statement={statement}
              align="left"
              statementClassName="text-[38px] leading-[1.04] tracking-[-0.05em] lg:text-[44px] lg:leading-[1.02] lg:tracking-[-0.04em]"
              className="mt-5"
              pills={[
                { label: 'No commission, ever', anchor: 'top-right', tone: 'dark', tilt: 4, dot: false },
                { label: 'WhatsApp, not a call centre', anchor: 'bottom-left', tone: 'bone', tilt: -3, dot: false },
              ]}
            />
          </BentoPanel>

          {/* Handoff AB-003: lede + stats grid. */}
          <BentoPanel fill="card" className="p-[22px]">
            <p className="text-[15px] leading-[1.6] text-warm-prose">
              ShikshAQ started because finding a tutor in Kolkata still meant asking three
              neighbours and trusting a photocopied leaflet. We list teachers, verify who they
              say they are, and then get out of the way. The fee you agree is the fee the
              teacher keeps.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {statTiles.map((st) => (
                <div
                  key={st.label}
                  className={`flex h-[120px] flex-col justify-center rounded-[18px] p-[14px] ${st.tint}`}
                >
                  <div className={`font-display text-[24px] font-black tracking-[-0.04em] tabular-nums ${st.ink}`}>
                    {st.value}
                  </div>
                  <div className="mt-0.5 text-[12.5px] leading-[1.4] text-warm-label">{st.label}</div>
                </div>
              ))}
            </div>
          </BentoPanel>

          {/* Handoff AB-004: founders panel. */}
          <BentoPanel fill="dark" className="p-[22px]">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex flex-none -space-x-3">
                <div className="h-14 w-14 overflow-hidden rounded-full ring-2 ring-panel">
                  <StripePlaceholder name="Sourav" initialSize={19} />
                </div>
                <div className="h-14 w-14 overflow-hidden rounded-full ring-2 ring-panel">
                  <StripePlaceholder name="Arka" initialSize={19} />
                </div>
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
            <Button asChild variant="primary" size={46} className="mt-4">
              <Link to="/join">
                List yourself as a teacher
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </BentoPanel>

          {/* Handoff AB-005: recommend CTA, identical to Home's H-020 row.
              Retained: the existing "recommend a teacher" flow isn't in the
              mockup, but it's real functionality (a live route + form the app
              depends on), so it stays — styled in the mockup's own language
              rather than dropped. */}
          <BentoPanel fill="card" className="px-[22px] !py-[18px] lg:!py-8">
            <Link
              to="/recommend-teacher"
              className="flex items-center gap-[14px] transition-transform duration-tap hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <IconDisc tone="muted" size={44}>
                <GraduationCap />
              </IconDisc>
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-semibold text-foreground">Know a good teacher?</p>
                <p className="mt-0.5 text-[14px] leading-[1.45] text-warm-secondary">
                  Recommend them &mdash; we&rsquo;ll reach out and get them listed, free.
                </p>
              </div>
              <ArrowRight className="h-5 w-5 flex-none text-warm-label" aria-hidden="true" />
            </Link>
          </BentoPanel>

          {/* Shared tail. */}
          <EyesPanel
            mode={builderMode}
            onModeChange={setBuilderMode}
            heading={(
              <>
                Still deciding? <span className="font-extrabold">We&rsquo;re watching out for you.</span>
              </>
            )}
            subline="Fill in the blanks and we'll take you straight there."
            slots={builderSlots}
            onSlotChange={handleSlotChange}
            onSubmit={handleBuilderSubmit}
          />
        </BentoStack>
      </main>
    </div>
  );
}
