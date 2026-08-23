import { Link } from 'react-router-dom';
import { Footer } from '@/components/Footer';
import { usePageMeta } from '@/hooks/usePageMeta';
import { IndianRupee, MessageCircle, Heart, ShieldCheck, type LucideIcon } from 'lucide-react';
import { BentoStack, BentoPanel } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { EyesPanel } from '@/components/home/EyesPanel';
import { useSentenceBuilder } from '@/hooks/useSentenceBuilder';

const BENEFITS: { title: string; body: string; icon: LucideIcon; cardBg: string; titleColor: string; iconTileBg: string }[] = [
  {
    title: 'No commission fees',
    body: 'Fees are agreed between you and the family. We never sit in the middle of a payment.',
    icon: IndianRupee,
    // JN-003: card fill/text/icon-tile mapping, in the array's existing order.
    cardBg: 'bg-brand-subtle',
    titleColor: 'text-brand-deep',
    iconTileBg: 'bg-brand',
  },
  {
    title: 'Direct student contact',
    body: 'Enquiries reach you on WhatsApp. No lead credits, no bidding for students.',
    icon: MessageCircle,
    cardBg: 'bg-mint',
    titleColor: 'text-[#24603D]',
    // Mockup's mint-solid icon tile (#34B268) — no existing token backs this
    // exact green, so it is a literal arbitrary value, not an invented one.
    iconTileBg: 'bg-[#34B268]',
  },
  {
    title: 'Empathy',
    body: 'We were students in this city. The platform is built for how tuition actually works in Kolkata.',
    icon: Heart,
    cardBg: 'bg-brand-blue-subtle',
    titleColor: 'text-brand-blue-deep',
    iconTileBg: 'bg-brand-blue',
  },
  {
    title: 'Values',
    body: 'Real reviews from real students, and no paid placement in results. Ever.',
    icon: ShieldCheck,
    // JN-003's fourth card is a purple pair given as literal hex in the
    // changelog (#F0E4F6/#4C2460) with the icon-tile solid (#9F53C6) taken
    // from the mockup — no existing token backs this hue anywhere else in
    // the product, so these stay arbitrary values rather than invented ones.
    cardBg: 'bg-[#F0E4F6]',
    titleColor: 'text-[#4C2460]',
    iconTileBg: 'bg-[#9F53C6]',
  },
];

export default function Join() {
  usePageMeta(
    'Join as a Tuition Teacher in Kolkata | Shikshaq',
    'List yourself as a tuition teacher in Kolkata for free. Reach students near you directly. No commission, no middlemen, no platform fees. Apply to join Shikshaq today.'
  );

  const { builderMode, setBuilderMode, slots, onSlotChange, onSubmit } = useSentenceBuilder();

  return (
    <BentoStack>
      {/* `contents` — <main> keeps its landmark role for a11y/skip-link
          purposes without becoming a box in the flex layout, so BentoStack's
          gap-[6px] seam still applies directly between every panel including
          the ones nested inside <main> (a wrapping element that WAS a real
          box here would swallow one seam and flatten the panels inside it). */}
      <main className="contents">
        {/* JN-002 — pitch panel. */}
        <BentoPanel fill="card" edge="top" className="pt-[14px] px-5 pb-[26px] lg:px-8">
          <h1 className="font-display text-[38px] sm:text-[46px] lg:text-[54px] font-normal leading-[.98] tracking-[-0.04em] text-foreground">
            Teach on Shikshaq.{' '}
            <span className="relative inline-block font-extrabold">
              <span
                aria-hidden
                className="absolute -left-[8px] -right-[8px] top-[4px] bottom-[2px] rounded-[8px] bg-brand"
                style={{ transform: 'rotate(-1.5deg)' }}
              />
              <span className="relative">Keep every rupee.</span>
            </span>
          </h1>

          <p className="mt-4 max-w-prose text-[16px] leading-[1.6] text-warm-secondary">
            We list local tuition teachers, students contact you directly on WhatsApp, and we take nothing from what you charge. There is no listing fee either.
          </p>

          {/* ⚠ "~3 working days" stays hedged — reported as a pill, not a
              promise, per JN-002. */}
          <div
            className="mt-[14px] inline-flex h-8 items-center gap-2 rounded-full bg-card px-[13px] text-[12.5px] font-bold text-foreground shadow-border"
            style={{ transform: 'rotate(-2deg)' }}
          >
            <span aria-hidden className="h-[7px] w-[7px] shrink-0 rounded-full bg-brand" />
            Reviewed in ~3 working days
          </div>

          <Button asChild variant="dark" size={54} className="mt-[22px] w-full text-[15px] font-extrabold">
            <Link to="/join/apply">Apply to be listed</Link>
          </Button>
        </BentoPanel>

        {/* JN-003 — benefits panel: 2x2 grid, tinted r20 cards, no tilt. */}
        <BentoPanel fill="card" className="px-5 py-5 lg:px-8 lg:py-8">
          <h2 className="sr-only">Why teach on Shikshaq</h2>
          <div className="grid grid-cols-2 gap-2">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className={`rounded-[20px] p-4 ${b.cardBg}`}>
                  <div className={`flex h-[34px] w-[34px] items-center justify-center rounded-[11px] ${b.iconTileBg}`}>
                    <Icon size={17} className="text-white" aria-hidden="true" />
                  </div>
                  <p className={`mt-3 text-[17px] font-extrabold leading-tight tracking-[-0.03em] ${b.titleColor}`}>
                    {b.title}
                  </p>
                  <p className="mt-1 text-[13.5px] leading-[1.5] text-warm-secondary">{b.body}</p>
                </div>
              );
            })}
          </div>
        </BentoPanel>

        <EyesPanel
          mode={builderMode}
          onModeChange={setBuilderMode}
          heading={
            <>
              Still deciding? <span className="font-extrabold">We&apos;re watching out for you.</span>
            </>
          }
          subline="Fill in the blanks and we'll take you straight there."
          slots={slots}
          onSlotChange={onSlotChange}
          onSubmit={onSubmit}
        />
      </main>

      <Footer />
    </BentoStack>
  );
}
