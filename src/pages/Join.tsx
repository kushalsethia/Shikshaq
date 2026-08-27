import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { IndianRupee, MessageCircle, Heart, ShieldCheck, type LucideIcon } from 'lucide-react';
import { BentoStack, BentoPanel } from '@/components/layout/PageContainer';
import { AnnotatedHighlight } from '@/components/marketing/annotated-statement';
import { EyesPanel } from '@/components/home/EyesPanel';
import { useSentenceBuilder } from '@/hooks/useSentenceBuilder';
import { useChromeConfig } from '@/components/layout/AppShell';

// Handoff JN-003: titles/bodies below are unchanged from the pre-redesign
// array — only card tint, icon-tile fill and type scale changed.
const BENEFITS: { title: string; body: string; icon: LucideIcon; cardTint: string; titleInk: string; bodyInk: string; iconTile: string }[] = [
  {
    title: 'No commission fees',
    body: 'Fees are agreed between you and the family. We never sit in the middle of a payment.',
    icon: IndianRupee,
    cardTint: 'bg-brand-subtle',
    titleInk: 'text-brand-deep',
    bodyInk: 'text-warm-prose',
    iconTile: 'bg-brand',
  },
  {
    title: 'Direct student contact',
    body: 'Enquiries reach you on WhatsApp. No lead credits, no bidding for students.',
    icon: MessageCircle,
    cardTint: 'bg-mint',
    titleInk: 'text-[#24603D]',
    bodyInk: 'text-[#3E6F53]',
    iconTile: 'bg-[#34B268]',
  },
  {
    title: 'Empathy',
    body: 'We were students in this city. The platform is built for how tuition actually works in Kolkata.',
    icon: Heart,
    cardTint: 'bg-brand-blue-subtle',
    titleInk: 'text-brand-blue-deep',
    bodyInk: 'text-warm-prose',
    iconTile: 'bg-brand-blue',
  },
  {
    title: 'Values',
    body: 'Real reviews from real students, and no paid placement in results. Ever.',
    icon: ShieldCheck,
    cardTint: 'bg-[#F0E4F6]',
    titleInk: 'text-[#4C2460]',
    bodyInk: 'text-[#5F3E6F]',
    iconTile: 'bg-[#9F53C6]',
  },
];

export default function Join() {
  usePageMeta(
    'Join as a Tuition Teacher in Kolkata | Shikshaq',
    'List yourself as a tuition teacher in Kolkata for free. Reach students near you directly. No commission, no middlemen, no platform fees. Apply to join Shikshaq today.'
  );

  // Handoff JN-001: this route renders its own eyes panel, replacing
  // AppShell's default pre-footer.
  useChromeConfig({ preFooter: 'none' });
  const {
    builderMode, setBuilderMode, slots: builderSlots, onSlotChange: handleSlotChange, onSubmit: handleBuilderSubmit,
  } = useSentenceBuilder();

  return (
    <div className="min-h-screen bg-background">
      <main>
        <BentoStack>
          {/* Handoff JN-002: pitch panel. */}
          <BentoPanel fill="card" edge="top" className="px-[22px] pt-[14px] pb-[26px]">
            <h1 className="mt-5 font-display text-[38px] font-normal leading-[.98] tracking-[-0.04em] text-foreground lg:text-[44px] lg:leading-[1.02] lg:tracking-[-0.04em]">
              Teach on Shikshaq.{' '}
              <AnnotatedHighlight tone="block-brand" weight={800} tilt={-1.5}>
                Keep every rupee.
              </AnnotatedHighlight>
            </h1>
            <p className="mt-4 text-[16px] leading-[1.6] text-warm-secondary">
              We list local tuition teachers, students contact you directly on WhatsApp, and we take nothing from what you charge. There is no listing fee either.
            </p>
            {/* Handoff D-007 (JN-002): flatten at lg. */}
            <div className="mt-3.5 inline-flex h-8 -rotate-2 items-center gap-2 rounded-full bg-card px-[13px] text-[12.5px] font-bold text-foreground shadow-border motion-reduce:rotate-0 lg:rotate-0">
              <span className="h-[7px] w-[7px] flex-none rounded-full bg-brand" />
              Reviewed in ~3 working days
            </div>
            <Link
              to="/join/apply"
              className="mt-[22px] flex h-[54px] items-center justify-center rounded-full bg-panel text-[15px] font-extrabold text-background transition-transform duration-tap hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Apply to be listed
            </Link>
          </BentoPanel>

          {/* Handoff JN-003: benefits panel. */}
          <BentoPanel fill="card" className="p-[22px]">
            <h2 className="sr-only">Why teach on Shikshaq</h2>
            <div className="grid grid-cols-2 gap-2">
              {BENEFITS.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className={`rounded-[20px] p-4 ${b.cardTint}`}>
                    <div className={`flex h-[34px] w-[34px] items-center justify-center rounded-[11px] ${b.iconTile}`}>
                      <Icon className="h-[17px] w-[17px] text-white" strokeWidth={2} aria-hidden="true" />
                    </div>
                    <div className={`mt-3 text-[17px] font-extrabold tracking-[-0.03em] ${b.titleInk}`}>{b.title}</div>
                    <p className={`mt-1 text-[13.5px] leading-[1.5] ${b.bodyInk}`}>{b.body}</p>
                  </div>
                );
              })}
            </div>
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
