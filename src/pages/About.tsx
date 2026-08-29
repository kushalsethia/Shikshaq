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
              Shikshaq started because finding a tutor in Kolkata still meant asking three
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

          {/* The story, told properly. The page opened on a statement, a
              paragraph and a stats grid, which says what Shikshaq is but never
              how it came to exist or why it is shaped the way it is. Three
              short movements: the problem as it actually is in Kolkata, the
              decision that follows from it, and who it is for. Every claim
              here is one the product already keeps elsewhere. */}
          <BentoPanel fill="card" className="p-[22px]">
            <span className="text-[11.5px] font-bold uppercase tracking-[0.04em] text-brand-deep">
              How this started
            </span>
            <h2 className="mt-1.5 text-[21px] font-extrabold tracking-[-0.03em] text-foreground">
              Finding a tutor should not be a favour you ask around for
            </h2>
            <div className="mt-3 grid max-w-prose gap-3 text-[15px] leading-[1.65] text-warm-prose">
              <p>
                In most of Kolkata, finding a teacher still runs on hearsay. You ask a neighbour,
                who asks their sister, who knows someone who taught her son four years ago. If you
                are lucky the number still works. Nobody can tell you what he charges, which boards
                he has actually taught, or whether he travels to your part of the city, so you
                arrange a meeting to find out and lose a Saturday discovering the answer is no.
              </p>
              <p>
                The alternatives were worse. Coaching directories sold the same enquiry to six
                centres and left the phone ringing for a month. Aggregators quoted a rate, took a
                cut of every class, and made the teacher raise their fee to cover it. In both cases
                the person who actually teaches was the last one consulted and the first one
                squeezed.
              </p>
              <p>
                So we built the boring version instead: a list you can filter, with the fee, the
                boards, the classes and the areas each teacher travels to written down before you
                contact anyone, and a WhatsApp thread straight to them when you do. No commission,
                because the moment we take one we start having opinions about who you should pick.
              </p>
            </div>
          </BentoPanel>

          <BentoPanel fill="card" className="p-[22px]">
            <span className="text-[11.5px] font-bold uppercase tracking-[0.04em] text-brand-deep">
              Who it is for
            </span>
            <h2 className="mt-1.5 text-[21px] font-extrabold tracking-[-0.03em] text-foreground">
              Both sides of the same conversation
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[18px] bg-muted p-4">
                <p className="text-[14.5px] font-bold text-foreground">If you are looking</p>
                <p className="mt-1.5 text-[14px] leading-[1.6] text-warm-secondary">
                  Search by subject, class, board and area, read what other students wrote, and
                  message the teacher yourself. You never pay us, and we never put ourselves in the
                  middle of what you agree with them.
                </p>
              </div>
              <div className="rounded-[18px] bg-muted p-4">
                <p className="text-[14.5px] font-bold text-foreground">If you teach</p>
                <p className="mt-1.5 text-[14px] leading-[1.6] text-warm-secondary">
                  Listing is free and stays free. You set your own rate, you keep all of it, and
                  enquiries arrive as a message from a real person rather than as a lead somebody
                  sold. Nothing about your listing goes live until you have approved it.
                </p>
              </div>
            </div>
          </BentoPanel>

          {/* How we work — the reasoning under the "no commission" pill in the
              header, spelled out. Every claim here is one the product already
              makes elsewhere (the fee line on every teacher profile, the
              WhatsApp CTA, the verification badge, the free-to-read papers);
              nothing is asserted that the app does not already do. */}
          <BentoPanel fill="card" className="p-[22px]">
            <h2 className="text-[21px] font-extrabold tracking-[-0.03em] text-foreground">
              How we work
            </h2>
            <p className="mt-2.5 text-[15px] leading-[1.6] text-warm-prose">
              Most tuition sites earn by standing between you and the teacher. A cut of
              every fee, a number you cannot dial, a counsellor who rings for a month. We took
              the other bet: be useful enough to be worth opening, and take nothing from the
              people doing the actual teaching.
            </p>
            <ul className="mt-4 grid gap-3">
              {[
                {
                  head: 'The fee is the fee',
                  body: 'Whatever you settle with a teacher is what they keep. We take no commission, so nobody here has a reason to steer you towards a pricier tutor.',
                },
                {
                  head: 'You message them, not us',
                  body: 'Every profile ends in a WhatsApp thread with that teacher. No call centre, no lead form, no one selling your number onward.',
                },
                {
                  head: 'Verified means a person checked',
                  body: 'The badge means ID and qualifications were looked at by a human. Where we have not checked, there is no badge. We would rather show you less than imply more.',
                },
                {
                  head: 'Free stays free',
                  body: 'Past papers are free to read and always will be. They are not bait for an account upgrade, because there is no upgrade.',
                },
              ].map((pt) => (
                <li key={pt.head} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[7px] h-2 w-2 flex-none rounded-[2px] bg-brand"
                  />
                  <span className="min-w-0">
                    <span className="block text-[14.5px] font-bold text-foreground">{pt.head}</span>
                    <span className="mt-0.5 block text-[14px] leading-[1.55] text-warm-secondary">
                      {pt.body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </BentoPanel>

          {/* The papers network. This is the one part of Shikshaq that students
              built for each other rather than something we made for them, so it
              gets said in their terms, not ours. Indigo panel because papers are
              indigo everywhere else in the product. */}
          <BentoPanel fill="card" className="p-[22px]">
            <span className="text-[11.5px] font-bold uppercase tracking-[0.04em] text-brand-blue">
              Students helping students
            </span>
            <h2 className="mt-1.5 text-[21px] font-extrabold tracking-[-0.03em] text-foreground">
              The papers came from the people who sat them
            </h2>
            <p className="mt-2.5 text-[15px] leading-[1.6] text-warm-prose">
              Nobody at Shikshaq wrote a single question on this site. Every past paper here was
              sent in by a student who had already sat it and decided the next batch should not
              have to hunt for it the way they did. A prelim from a school that never put
              theirs online, a half-yearly that only ever existed as a photocopy going round a
              class WhatsApp group.
            </p>
            <p className="mt-3 text-[15px] leading-[1.6] text-warm-prose">
              That is the whole mechanism. One person who is finished helping the person who is
              about to start. It costs the sender nothing and saves the next reader an afternoon,
              which is a good trade about a thousand times over.
            </p>
            <div className="mt-4 rounded-[18px] bg-muted p-4">
              <p className="text-[13.5px] font-bold text-foreground">Where we draw the line</p>
              <p className="mt-1 text-[13.5px] leading-[1.6] text-warm-secondary">
                The questions belong to the schools that set them, not to us and not to the
                student who shared them. So papers are free to read and not to download or
                repost, every one names its school, and any school that wants theirs taken down
                only has to ask. We would rather host fewer papers honestly than more of them
                badly.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {/* indigo, not primary: papers are blue in every other surface of
                  the product (the mode toggle, the covers, the reader), and an
                  orange CTA on the papers panel breaks that one association. */}
              <Button asChild variant="indigo" size={46}>
                <Link to="/past-papers">
                  Read the papers
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size={46}>
                <Link to="/contact">Send us one you have</Link>
              </Button>
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
              should be able to find them in under a minute, and talk to them without
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
                  Recommend them and we&rsquo;ll reach out to get them listed, free.
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
