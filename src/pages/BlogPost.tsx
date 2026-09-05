import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { SEOHead } from '@/components/SEOHead';
import { BentoStack, BentoPanel, PageContainer } from '@/components/layout/PageContainer';
import { useChromeConfig } from '@/components/layout/AppShell';
import { PAST_PAPERS_PATH, BROWSE_PATH } from '@/lib/nav-config';
import {
  ARTICLE_BY_SLUG,
  BLOG_ARTICLES,
  BLOG_PATH,
  BANK_TOTALS,
  CHAPTER_STATS,
  SCOPE_LABEL,
  commonestMarkValue,
  fmt,
  markShare,
  paperCoverage,
  type BlogArticle,
} from '@/content/blog';

/* ---------------------------------------------------------------------------
   Shared pieces
--------------------------------------------------------------------------- */

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex h-[96px] flex-col-reverse justify-center rounded-[18px] bg-muted p-[14px]">
      <dt className="mt-0.5 text-[12.5px] leading-[1.4] text-warm-label">{label}</dt>
      <dd className="font-display text-[24px] font-black tabular-nums tracking-[-0.04em] text-foreground">
        {value}
      </dd>
    </div>
  );
}

/** A bar row. Width is a share of the largest value, so the eye compares. */
function BarRow({
  label,
  value,
  max,
  suffix,
  href,
}: {
  label: string;
  value: number;
  max: number;
  suffix: string;
  href?: string;
}) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  const inner = (
    <>
      <span className="flex items-baseline justify-between gap-3">
        <span className="min-w-0 truncate font-semibold text-foreground">{label}</span>
        <span className="flex-none text-meta font-bold tabular-nums text-warm-label">
          {fmt(value)} {suffix}
        </span>
      </span>
      <span
        aria-hidden
        className="mt-1.5 block h-2 rounded-full bg-brand-subtle"
      >
        <span className="block h-2 rounded-full bg-brand" style={{ width: `${pct}%` }} />
      </span>
    </>
  );

  return (
    <li>
      {href ? (
        <Link
          to={href}
          className="-mx-2 block rounded-lg px-2 py-2 transition-colors duration-hover hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {inner}
        </Link>
      ) : (
        <span className="-mx-2 block px-2 py-2">{inner}</span>
      )}
    </li>
  );
}

function MethodNote() {
  return (
    <p className="mt-8 border-t border-border pt-4 text-meta leading-[1.6] text-warm-label">
      Counted from {fmt(BANK_TOTALS.questions)} questions in {fmt(BANK_TOTALS.papers)}{' '}
      {SCOPE_LABEL} papers set by {fmt(BANK_TOTALS.schools)} Kolkata schools between{' '}
      {BANK_TOTALS.firstYear} and {BANK_TOTALS.lastYear}. Chapter labels are the ones carried in
      the paper bank. Papers are the property of the schools that set them.
    </p>
  );
}

/* ---------------------------------------------------------------------------
   The two overview articles
--------------------------------------------------------------------------- */

function ChaptersByMarks() {
  const max = CHAPTER_STATS[0]?.marks ?? 0;
  const top = CHAPTER_STATS[0];
  const topFive = CHAPTER_STATS.slice(0, 5);
  const topFiveShare = Math.round(
    (topFive.reduce((n, c) => n + c.marks, 0) / BANK_TOTALS.marks) * 100,
  );
  /* Compared against, not asserted over. An earlier draft read "so more than
     half the paper comes from under a third of the syllabus" while the figure
     beside it said 49%, which is the exact failure this whole section is
     supposed to avoid. The comparison is now derived from both numbers. */
  const topFiveSyllabusShare = Math.round((topFive.length / BANK_TOTALS.chapters) * 100);

  return (
    <>
      <p className="text-lede text-warm-prose">
        Every revision guide ranks these chapters by opinion. This one ranks them by the marks they
        actually carried in {fmt(BANK_TOTALS.papers)} papers.
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <Stat value={fmt(BANK_TOTALS.marks)} label="marks counted" />
        <Stat value={fmt(BANK_TOTALS.chapters)} label="chapters" />
        <Stat value={`${topFiveShare}%`} label="carried by the top five" />
        <Stat value={fmt(BANK_TOTALS.papers)} label="papers read" />
      </dl>

      <h2 className="mt-10 font-display text-section-head font-extrabold tracking-[-0.03em] text-foreground">
        All {BANK_TOTALS.chapters} chapters, by marks carried
      </h2>
      <ul className="mt-4 space-y-1">
        {CHAPTER_STATS.map((c) => (
          <BarRow
            key={c.slug}
            label={c.name}
            value={c.marks}
            max={max}
            suffix="marks"
            href={`${BLOG_PATH}/${c.slug}-in-icse-class-10-maths-papers`}
          />
        ))}
      </ul>

      <h2 className="mt-10 font-display text-section-head font-extrabold tracking-[-0.03em] text-foreground">
        What the ranking shows
      </h2>
      <p className="mt-3 max-w-prose text-body-secondary text-warm-prose">
        {top?.name} carried more marks than any other chapter, {fmt(top?.marks ?? 0)} of{' '}
        {fmt(BANK_TOTALS.marks)}, which is {markShare(top!)}% of every mark in the bank. The five
        heaviest chapters carried {topFiveShare}% of the marks between them, which is{' '}
        {topFiveShare > topFiveSyllabusShare ? 'more' : 'less'} than their {topFiveSyllabusShare}%
        share of the syllabus: five of {BANK_TOTALS.chapters} chapters.
      </p>
      <p className="mt-3 max-w-prose text-body-secondary text-warm-prose">
        Weight is not the same as reliability. A chapter can carry a large total simply by appearing
        in most papers at a small size, so each chapter page below also gives the share of papers it
        appeared in and the mark value it was most often set at.
      </p>

      <MethodNote />
    </>
  );
}

function HowSchoolsSetPapers() {
  /* Exam types are recorded per question, so summing across chapters gives the
     bank's real distribution rather than a guess at how many papers of each
     kind exist. */
  const byExam = new Map<string, number>();
  for (const c of CHAPTER_STATS) {
    for (const e of c.examTypes) byExam.set(e.label, (byExam.get(e.label) ?? 0) + e.count);
  }
  const exams = [...byExam.entries()].sort((a, b) => b[1] - a[1]);
  const examMax = exams[0]?.[1] ?? 0;

  const byMark = new Map<number, number>();
  for (const c of CHAPTER_STATS) {
    for (const m of c.markValues) byMark.set(m.value, (byMark.get(m.value) ?? 0) + m.count);
  }
  const marks = [...byMark.entries()].sort((a, b) => a[0] - b[0]);
  const markMax = Math.max(...marks.map(([, n]) => n), 0);

  const totalLong = CHAPTER_STATS.reduce((n, c) => n + c.longQuestions, 0);
  const totalShort = CHAPTER_STATS.reduce((n, c) => n + c.shortQuestions, 0);
  const longShare = totalLong + totalShort > 0
    ? Math.round((totalLong / (totalLong + totalShort)) * 100)
    : 0;

  return (
    <>
      <p className="text-lede text-warm-prose">
        {fmt(BANK_TOTALS.schools)} Kolkata schools, {fmt(BANK_TOTALS.papers)} papers, and a fairly
        consistent shape underneath them.
      </p>

      <h2 className="mt-10 font-display text-section-head font-extrabold tracking-[-0.03em] text-foreground">
        What kind of paper these are
      </h2>
      <ul className="mt-4 space-y-1">
        {exams.map(([label, n]) => (
          <BarRow key={label} label={label} value={n} max={examMax} suffix="questions" />
        ))}
      </ul>
      <p className="mt-4 max-w-prose text-body-secondary text-warm-prose">
        Prelims dominate the bank, which matters when you use it: a prelim is a school setting its
        own paper in the board's shape, so it tells you what your school tends to ask as much as
        what the board does.
      </p>

      <h2 className="mt-10 font-display text-section-head font-extrabold tracking-[-0.03em] text-foreground">
        How questions are weighted
      </h2>
      <ul className="mt-4 space-y-1">
        {marks.map(([value, n]) => (
          <BarRow
            key={value}
            label={`${value} mark${value === 1 ? '' : 's'}`}
            value={n}
            max={markMax}
            suffix="questions"
          />
        ))}
      </ul>
      <p className="mt-4 max-w-prose text-body-secondary text-warm-prose">
        Of the questions the bank labels by length, {longShare}% are long-form. The rest are short,
        which is where most of the paper's volume sits even when the marks are elsewhere.
      </p>

      <MethodNote />
    </>
  );
}

/* ---------------------------------------------------------------------------
   A chapter article
--------------------------------------------------------------------------- */

function ChapterArticle({ article }: { article: BlogArticle }) {
  const c = article.chapter!;
  const rank = CHAPTER_STATS.findIndex((x) => x.slug === c.slug) + 1;
  const common = commonestMarkValue(c);
  const markMax = Math.max(...c.markValues.map((m) => m.count), 0);
  const examMax = Math.max(...c.examTypes.map((e) => e.count), 0);

  return (
    <>
      <p className="text-lede text-warm-prose">
        {c.name} carried {fmt(c.marks)} marks across the bank, which ranks it {rank} of{' '}
        {BANK_TOTALS.chapters} chapters and is {markShare(c)}% of every mark counted.
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <Stat value={fmt(c.marks)} label="marks carried" />
        <Stat value={fmt(c.questions)} label="questions set" />
        <Stat value={`${paperCoverage(c)}%`} label="of papers" />
        <Stat value={String(c.averageMarks)} label="marks per question" />
      </dl>

      <h2 className="mt-10 font-display text-section-head font-extrabold tracking-[-0.03em] text-foreground">
        How often it comes up
      </h2>
      <p className="mt-3 max-w-prose text-body-secondary text-warm-prose">
        It appeared in {fmt(c.papers)} of {fmt(BANK_TOTALS.papers)} papers, set by{' '}
        {fmt(c.schools)} different Kolkata schools
        {c.firstYear && c.lastYear ? `, in papers dated ${c.firstYear} to ${c.lastYear}` : ''}.{' '}
        {paperCoverage(c) >= 75
          ? 'At that rate it is close to a certainty rather than a topic to gamble on.'
          : paperCoverage(c) >= 40
            ? 'That is frequent enough to prepare for, and infrequent enough that a single paper may skip it.'
            : 'That is infrequent, so a given paper may well not set it at all.'}
      </p>

      {c.markValues.length > 0 && (
        <>
          <h2 className="mt-10 font-display text-section-head font-extrabold tracking-[-0.03em] text-foreground">
            What it is usually worth
          </h2>
          <ul className="mt-4 space-y-1">
            {c.markValues.map((m) => (
              <BarRow
                key={m.value}
                label={`${m.value} mark${m.value === 1 ? '' : 's'}`}
                value={m.count}
                max={markMax}
                suffix="questions"
              />
            ))}
          </ul>
          {common && (
            <p className="mt-4 max-w-prose text-body-secondary text-warm-prose">
              Most often it is set as a {common.value}-mark question, {fmt(common.count)} of the{' '}
              {fmt(c.questions)} counted here.
            </p>
          )}
        </>
      )}

      {c.examTypes.length > 0 && (
        <>
          <h2 className="mt-10 font-display text-section-head font-extrabold tracking-[-0.03em] text-foreground">
            Which papers set it
          </h2>
          <ul className="mt-4 space-y-1">
            {c.examTypes.map((e) => (
              <BarRow key={e.label} label={e.label} value={e.count} max={examMax} suffix="questions" />
            ))}
          </ul>
        </>
      )}

      <div className="mt-8 rounded-2xl bg-brand-blue-subtle p-6">
        <h2 className="font-display text-card-title-lg font-extrabold text-brand-blue-deep">
          Read the questions themselves
        </h2>
        <p className="mt-2 max-w-prose text-body-secondary text-brand-blue-deep/90">
          The counting above comes from papers you can open. The first five questions of any paper
          need no account.
        </p>
        <Link
          to={PAST_PAPERS_PATH}
          className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-brand-blue px-5 text-[15px] font-extrabold text-white transition-transform duration-tap hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
        >
          Browse the papers
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <MethodNote />
    </>
  );
}

/* ---------------------------------------------------------------------------
   The route
--------------------------------------------------------------------------- */

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? ARTICLE_BY_SLUG[slug] : undefined;

  /* A missing slug redirects to the index rather than rendering a 404 body,
     because every link into this route comes from a generated list: a slug
     that misses means the article set changed, and the index is the honest
     next step for a reader following an old link. */
  useChromeConfig(article ? { preFooter: 'B3' } : null);

  if (!article) return <Navigate to={BLOG_PATH} replace />;

  const i = BLOG_ARTICLES.findIndex((a) => a.slug === article.slug);
  const next = BLOG_ARTICLES[i + 1];

  return (
    <>
      <SEOHead
        title={`${article.title} | Shikshaq`}
        description={article.description}
        canonical={`${BLOG_PATH}/${article.slug}`}
        ogType="article"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.description,
          about: article.chapter ? article.chapter.name : SCOPE_LABEL,
          isAccessibleForFree: true,
          publisher: { '@type': 'Organization', name: 'Shikshaq' },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://shikshaq.in${BLOG_PATH}/${article.slug}`,
          },
        }}
      />

      <BentoStack>
        <BentoPanel fill="card" edge="top">
          <PageContainer className="px-0">
            <Link
              to={BLOG_PATH}
              className="-m-1 mb-3 flex h-11 w-fit items-center gap-1.5 p-1 text-[13px] font-semibold text-warm-label transition-colors duration-tap hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2.25} aria-hidden />
              All reading
            </Link>

            <span className="text-label uppercase text-brand-deep">{article.eyebrow}</span>
            <h1 className="mt-2 max-w-[20ch] font-display text-display-hero font-black leading-[0.95] tracking-[-0.04em] text-foreground">
              {article.title}
            </h1>
            <p className="mt-3 text-meta tabular-nums text-warm-label">
              {article.minutes} min read
            </p>
          </PageContainer>
        </BentoPanel>

        <BentoPanel fill="card">
          <PageContainer className="px-0">
            {article.chapter ? (
              <ChapterArticle article={article} />
            ) : article.slug === 'which-chapters-carry-the-marks' ? (
              <ChaptersByMarks />
            ) : (
              <HowSchoolsSetPapers />
            )}

            {next && (
              <Link
                to={`${BLOG_PATH}/${next.slug}`}
                className="group mt-10 flex items-center justify-between gap-4 rounded-2xl bg-muted p-5 transition-transform duration-hover hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.99]"
              >
                <span className="min-w-0">
                  <span className="block text-label uppercase text-warm-label">Next</span>
                  <span className="mt-1 block truncate font-bold text-foreground">
                    {next.title}
                  </span>
                </span>
                <ArrowRight
                  className="h-5 w-5 flex-none text-warm-label transition-transform duration-hover group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            )}

            <p className="mt-6 text-body-secondary text-warm-prose">
              Looking for a teacher instead?{' '}
              <Link
                to={BROWSE_PATH}
                className="font-semibold text-brand-blue underline underline-offset-4"
              >
                Every verified tutor in Kolkata
              </Link>{' '}
              is free to search and free to contact.
            </p>
          </PageContainer>
        </BentoPanel>
      </BentoStack>
    </>
  );
}
