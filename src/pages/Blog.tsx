import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { SEOHead } from '@/components/SEOHead';
import { BentoStack, BentoPanel, PageContainer } from '@/components/layout/PageContainer';
import { useChromeConfig } from '@/components/layout/AppShell';
import {
  BLOG_ARTICLES,
  BLOG_PATH,
  BANK_TOTALS,
  SCOPE_LABEL,
  fmt,
  paperCoverage,
} from '@/content/blog';

/**
 * The reading index.
 *
 * Two things it deliberately does not do. It does not claim a posting cadence,
 * because these are not posts and nothing is scheduled. And it does not
 * paginate, because twenty articles is not a feed and a second page would only
 * bury the chapter list that is the actual reason to be here.
 */
export default function Blog() {
  useChromeConfig({ preFooter: 'B3' });

  /* Split by what an article IS, not by position. Slicing the list left the
     second overview piece sitting in the chapter grid, where every other card
     carries a marks/coverage line and it had none. */
  const [lead, ...others] = BLOG_ARTICLES.filter((a) => !a.chapter);
  const chapters = BLOG_ARTICLES.filter((a) => a.chapter);

  return (
    <>
      <SEOHead
        title={`${SCOPE_LABEL} papers, counted | Shikshaq`}
        description={
          `What ${fmt(BANK_TOTALS.questions)} questions from ${fmt(BANK_TOTALS.papers)} Kolkata ` +
          `school papers show about which chapters carry the marks. Free to read.`
        }
        canonical={BLOG_PATH}
      />

      <BentoStack>
        <BentoPanel fill="papers" edge="top">
          <PageContainer className="px-0">
            <span className="text-label uppercase text-white/75">Reading</span>
            <h1 className="mt-2 max-w-[18ch] font-display text-display-hero font-black leading-[0.95] tracking-[-0.04em] text-white">
              The papers, counted.
            </h1>
            <p className="mt-4 max-w-[52ch] text-lede text-white/90">
              Every number on these pages was counted from {fmt(BANK_TOTALS.papers)} real{' '}
              {SCOPE_LABEL} papers set by {fmt(BANK_TOTALS.schools)} Kolkata schools between{' '}
              {BANK_TOTALS.firstYear} and {BANK_TOTALS.lastYear}. Nothing here is estimated.
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                { value: fmt(BANK_TOTALS.papers), label: 'papers read' },
                { value: fmt(BANK_TOTALS.questions), label: 'questions counted' },
                { value: fmt(BANK_TOTALS.schools), label: 'Kolkata schools' },
                { value: fmt(BANK_TOTALS.chapters), label: 'chapters covered' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex h-[92px] flex-col-reverse justify-center rounded-[18px] bg-white/10 p-[14px]"
                >
                  <dt className="mt-0.5 text-[12.5px] leading-[1.4] text-white/75">{s.label}</dt>
                  <dd className="font-display text-[24px] font-black tabular-nums tracking-[-0.04em] text-white">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </PageContainer>
        </BentoPanel>

        <BentoPanel fill="card">
          <PageContainer className="px-0">
            {/* The lead article is the one that answers the question everyone
                actually arrives with, so it gets the width rather than sitting
                as the first of twenty identical cards. */}
            <Link
              to={`${BLOG_PATH}/${lead.slug}`}
              className="group block rounded-2xl bg-brand-subtle p-6 transition-transform duration-hover hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 active:scale-[0.99] sm:p-8"
            >
              <span className="text-label uppercase text-brand-deep">{lead.eyebrow}</span>
              <h2 className="mt-2 max-w-[24ch] font-display text-section-head font-extrabold leading-[1.05] tracking-[-0.03em] text-brand-deep">
                {lead.title}
              </h2>
              <p className="mt-3 max-w-prose text-body-secondary text-brand-deep/90">
                {lead.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-bold text-brand-deep">
                Read it
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-hover group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>

            {others.length > 0 && (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {others.map((a) => (
                  <li key={a.slug}>
                    <Link
                      to={`${BLOG_PATH}/${a.slug}`}
                      className="group flex h-full flex-col rounded-2xl bg-muted p-5 transition-transform duration-hover hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
                    >
                      <span className="text-label uppercase text-warm-label">{a.eyebrow}</span>
                      <span className="mt-1.5 block font-bold leading-[1.25] text-foreground">
                        {a.title}
                      </span>
                      <span className="mt-2 block text-body-secondary text-warm-prose">
                        {a.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <h2 className="mt-10 font-display text-section-head font-extrabold tracking-[-0.03em] text-foreground">
              Chapter by chapter
            </h2>
            <p className="mt-2 max-w-prose text-body-secondary text-warm-prose">
              One page per chapter, each with the marks it carried, how many papers set it, and how
              it was usually weighted.
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {chapters.map((a) => (
                <li key={a.slug}>
                  <Link
                    to={`${BLOG_PATH}/${a.slug}`}
                    className="flex h-full flex-col rounded-2xl bg-muted p-5 transition-transform duration-hover hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
                  >
                    <span className="text-label uppercase text-warm-label">{a.eyebrow}</span>
                    <span className="mt-1.5 block font-bold leading-[1.25] text-foreground">
                      {a.title}
                    </span>
                    {a.chapter && (
                      <span className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-4 text-meta tabular-nums text-warm-label">
                        <span>{fmt(a.chapter.marks)} marks</span>
                        <span>{paperCoverage(a.chapter)}% of papers</span>
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </PageContainer>
        </BentoPanel>
      </BentoStack>
    </>
  );
}
