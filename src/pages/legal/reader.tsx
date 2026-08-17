import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Footer } from '@/components/Footer';
import { WhatsAppIcon } from '@/components/BrandIcons';
import { getWhatsAppLink } from '@/utils/whatsapp';
import { BottomNavSpacer } from '@/components/layout/PageContainer';

/**
 * C15 — LegalReader (handoff\components.md line 48).
 *
 * "Pill + display h1 + lede + updated line; four-card summary strip; 240px
 * contents rail + prose column; each section opens with a bold one-line
 * answer." Built once, reused by Terms, Privacy, Help and FAQ (handoff
 * "Redesign Legal pages.dc.html" L1/L2, reused per components.md).
 *
 * Pixel values below are transcribed literally from the L1/L2 mockup per the
 * owner's pixel-exact override — arbitrary Tailwind values throughout,
 * intentionally not rounded to the spacing scale.
 */

export type SummaryTone = 'bone' | 'brand' | 'blue' | 'muted' | 'mint';

export interface LegalSummaryCard {
  head: string;
  text: string;
  tone: SummaryTone;
}

export interface LegalSection {
  n: string;
  title: string;
  /** The bold one-line answer that opens every section. */
  short: string;
  body: ReactNode;
  bullets?: string[];
}

export interface LegalReaderProps {
  pill: string;
  pillTone: 'brand' | 'blue';
  h1: ReactNode;
  lede: string;
  updated: string;
  summary: LegalSummaryCard[];
  sections: LegalSection[];
  /** Accent used for the small bullet dots (matches the page's pill tone). */
  accent: 'brand' | 'blue';
  footHead: string;
  footBody: string;
  /** Extra content rendered after the accordion — e.g. FAQ's "Tell us here" line. */
  footerExtra?: ReactNode;
}

const SUMMARY_TONE_CLASS: Record<SummaryTone, string> = {
  bone: 'bg-card',
  brand: 'bg-brand-subtle',
  blue: 'bg-brand-blue-subtle',
  muted: 'bg-muted',
  mint: 'bg-mint',
};

const SUMMARY_HEAD_CLASS: Record<SummaryTone, string> = {
  bone: 'text-foreground',
  brand: 'text-brand-deep',
  blue: 'text-brand-blue-deep',
  muted: 'text-foreground',
  mint: 'text-whatsapp-text',
};

const SUMMARY_BODY_CLASS: Record<SummaryTone, string> = {
  bone: 'text-warm-prose',
  brand: 'text-warm-prose',
  blue: 'text-warm-prose',
  muted: 'text-warm-prose',
  // Mockup uses a two-tone WhatsApp green (a near-black head, a lighter
  // sage body) with no token for the lighter body shade — nearest available
  // token (whatsapp-text) reused for both, reported as a mockup-color
  // substitution.
  mint: 'text-whatsapp-text',
};

export function LegalReader({
  pill,
  pillTone,
  h1,
  lede,
  updated,
  summary,
  sections,
  accent,
  footHead,
  footBody,
  footerExtra,
}: LegalReaderProps) {
  const pillClass =
    pillTone === 'blue'
      ? 'bg-brand-blue-subtle text-brand-blue-deep'
      : 'bg-brand-subtle text-brand-deep';
  const accentDotClass = accent === 'blue' ? 'bg-brand-blue' : 'bg-brand';

  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.findIndex((el) => el === entry.target);
            if (idx !== -1) setActiveIndex(idx);
          }
        }
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    );
    for (const el of sectionRefs.current) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections.length]);

  return (
    <div className="min-h-screen bg-background">

      <main className="mx-auto max-w-[980px] px-4 pb-[90px] pt-[44px] sm:px-[40px]">
        {/* pill + h1 + lede + updated */}
        <span
          className={`inline-flex h-[32px] items-center gap-2 whitespace-nowrap rounded-full px-[14px] text-[12px] font-bold ${pillClass}`}
        >
          {pill}
        </span>
        <h1 className="mt-[16px] mb-[12px] font-display text-[38px] font-black leading-[.96] tracking-[-0.045em] text-foreground sm:text-[60px] sm:tracking-[-0.04em]">
          {h1}
        </h1>
        <p className="m-0 max-w-[66ch] text-[16px] leading-[1.6] text-warm-prose sm:text-[18px]">
          {lede}
        </p>
        <span className="mt-[14px] block text-[12.5px] text-warm-meta sm:text-[13.5px]">{updated}</span>

        {/* four-card summary strip */}
        <div className="mt-[22px] grid grid-cols-1 gap-[10px] sm:mt-[32px] sm:grid-cols-2 lg:grid-cols-4">
          {summary.map((s) => (
            <div
              key={s.head}
              className={`flex flex-col gap-2 rounded-[18px] p-[16px] sm:rounded-[20px] sm:p-[18px] ${SUMMARY_TONE_CLASS[s.tone]}`}
            >
              <span
                className={`font-display text-[17px] font-black leading-[1.15] tracking-[-0.03em] sm:text-[19px] sm:leading-[1.1] ${SUMMARY_HEAD_CLASS[s.tone]}`}
              >
                {s.head}
              </span>
              <span className={`text-[13.5px] leading-[1.5] ${SUMMARY_BODY_CLASS[s.tone]}`}>{s.text}</span>
            </div>
          ))}
        </div>

        {/* 240px contents rail + prose column */}
        <div className="mt-[26px] grid grid-cols-1 gap-[28px] sm:mt-[40px] lg:grid-cols-[240px_1fr] lg:gap-[40px]">
          <nav aria-label="On this page" className="hidden flex-col gap-[3px] lg:flex">
            <span className="mb-2 text-[11.5px] font-bold uppercase tracking-[.07em] text-warm-label">
              On this page
            </span>
            {sections.map((s, i) => {
              const isActive = i === activeIndex;
              return (
                <a
                  key={s.n}
                  href={`#legal-section-${s.n}`}
                  className={`flex min-h-[44px] items-center gap-[10px] rounded-[11px] px-[12px] py-[9px] text-[13.5px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    isActive
                      ? 'bg-muted font-bold text-foreground'
                      : 'font-semibold text-warm-secondary hover:bg-muted/60'
                  }`}
                >
                  <span className="w-[18px] flex-none text-[11.5px] font-bold text-warm-label">{s.n}</span>
                  {s.title}
                </a>
              );
            })}
          </nav>

          <div className="flex flex-col gap-[22px] sm:gap-[28px]">
            {sections.map((s, i) => (
              <div
                key={s.n}
                id={`legal-section-${s.n}`}
                ref={(el) => {
                  sectionRefs.current[i] = el;
                }}
                className="scroll-mt-24"
              >
                <div className="mb-[8px] flex items-baseline gap-[10px] sm:mb-[10px] sm:gap-[12px]">
                  <span className="text-[11.5px] font-bold tracking-[.05em] text-warm-label sm:text-[13px] sm:tracking-[.04em]">
                    {s.n}
                  </span>
                  <h2 className="m-0 font-display text-[22px] font-extrabold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-[26px]">
                    {s.title}
                  </h2>
                </div>
                <p className="m-0 mb-[8px] max-w-[70ch] text-[15.5px] font-bold leading-[1.5] text-foreground sm:mb-[10px] sm:text-[17px] sm:leading-[1.55]">
                  {s.short}
                </p>
                <div className="max-w-[70ch] text-[15px] leading-[1.7] text-warm-prose sm:text-[16px]">{s.body}</div>

                {s.bullets && s.bullets.length > 0 && (
                  <div className="mt-[14px] flex flex-col gap-[8px]">
                    {s.bullets.map((b) => (
                      <div key={b} className="flex max-w-[70ch] items-start gap-[11px]">
                        <span className={`mt-[9px] h-[6px] w-[6px] flex-none rounded-full ${accentDotClass}`} />
                        <span className="text-[15px] leading-[1.6] text-warm-prose sm:text-[15.5px]">{b}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* dark "still stuck" panel */}
            <div className="rounded-[22px] bg-panel p-[20px] text-white sm:p-[24px]">
              <span className="mb-[12px] inline-flex h-[26px] items-center whitespace-nowrap rounded-full bg-warm-card px-[11px] text-[11.5px] font-bold text-foreground">
                questions
              </span>
              <div className="mb-[8px] font-display text-[20px] font-extrabold leading-[1.15] tracking-[-0.03em] sm:text-[23px]">
                {footHead}
              </div>
              <p className="m-0 mb-[14px] max-w-[62ch] text-[14px] leading-[1.65] text-white/78 sm:mb-[16px] sm:text-[15px]">
                {footBody}
              </p>
              <div className="flex flex-wrap gap-[10px]">
                <a
                  href={getWhatsAppLink('8240980312')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[13px] bg-whatsapp px-[18px] text-[14.5px] font-extrabold text-whatsapp-text transition-transform duration-150 active:scale-[0.97] sm:w-auto"
                >
                  <WhatsAppIcon className="h-[17px] w-[17px]" />
                  WhatsApp us
                </a>
                <a
                  href="mailto:hello@shikshaq.in"
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-[13px] bg-white/10 px-[18px] text-[14.5px] font-bold text-white transition-colors duration-150 hover:bg-white/15 sm:w-auto"
                >
                  hello@shikshaq.in
                </a>
              </div>
            </div>

            {footerExtra}
          </div>
        </div>
      </main>

      <BottomNavSpacer />
      <Footer />
    </div>
  );
}
