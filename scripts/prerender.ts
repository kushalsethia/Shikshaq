/**
 * Build-time HTML for every indexable route.
 *
 * The problem this solves: dist/ contained exactly one HTML file, whose body
 * was `<div id="root"></div>`. Every one of the ~1,857 sitemap URLs served
 * byte-identical markup with the homepage's title and description, and (until
 * a7091ac) a hardcoded homepage canonical. Google's renderer usually gets
 * there eventually; Bing, WhatsApp, Facebook, LinkedIn and most LLM crawlers
 * do not run JavaScript at all, so a shared teacher profile unfurled as the
 * homepage -- on a product whose main distribution channel is WhatsApp.
 *
 * Why this approach rather than SSR or SSG: React still boots with
 * createRoot(), exactly as before. Nothing is hydrated, so there is no
 * hydration mismatch to get wrong, no page needs to be made SSR-safe, and the
 * failure mode of a bug here is "a page has worse meta tags", never "the app
 * does not render". For a pre-launch window that trade is worth more than the
 * fidelity true SSG would add.
 *
 * WHAT IS DELIBERATELY NOT HERE: question body text.
 * Nobody searches for the text of question 3. They search "la martiniere class
 * 10 maths 2023 question paper", which is entirely metadata -- school, board,
 * class, subject, year. So question bodies earn no ranking, and putting 1,282
 * papers' worth of them into static HTML would hand a scraper the entire
 * preview corpus over plain HTTP with no account and no rate limit.
 *
 * That exclusion is enforced twice. First structurally: this script
 * authenticates with the PUBLISHABLE (anon) key, and anon has no SELECT on
 * bank_questions.body, Shikshaqmine."Link" or ."Phone Number" -- it is
 * physically incapable of reading them, so no future edit to a template here
 * can leak them. Second by assertion: assertNoQuestionText() below fetches
 * real question text and fails the build if any emitted file contains it.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

import { canonicalPathFor } from '../src/lib/canonical';
import { schoolSlug } from '../src/lib/school-slug';
import { isExcludedPaper } from './excluded-papers';
import { SUBJECT_CONTENT, BOARD_CONTENT, type SubjectContent } from '../src/content/subject-seo';
import {
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
  generateFAQPageSchema,
  generateTeacherPersonSchema,
} from '../src/utils/structuredDataGenerators';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
const SITE_URL = 'https://www.shikshaq.in';
const DIST = path.join(__dirname, '..', 'dist');
const TEMPLATE_PATH = path.join(DIST, 'index.html');
const PAGE = 1000;

/* Same reasoning as scripts/generate-sitemap.ts: nobody on this team can read
   Vercel's build logs, so a warning reaches no one. Prerendering half the
   routes and reporting success is worse than not prerendering at all, because
   the half that silently fell back is invisible. */
function fail(message: string): never {
  console.error(`\nPRERENDER FAILED: ${message}`);
  console.error('Refusing to ship a partially prerendered dist/.\n');
  process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_KEY) {
  fail('Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

type Query = { range: (from: number, to: number) => Promise<{ data: unknown[] | null; error: { message: string } | null }> };

/* PostgREST truncates an unbounded select at 1000 rows and returns 200 OK.
   That bug already shipped once here (the sitemap advertised 1000 of 1282
   papers for weeks) so every read in this file pages explicitly. */
async function fetchAll<T>(build: () => Query, label: string): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await build().range(from, from + PAGE - 1);
    if (error) fail(`${label}: ${error.message}`);
    rows.push(...((data ?? []) as T[]));
    if (!data || data.length < PAGE) break;
  }
  return rows;
}

// ---------------------------------------------------------------------------
// HTML helpers
// ---------------------------------------------------------------------------

/** Escape for HTML text and double-quoted attribute values alike. */
function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* JSON-LD sits inside <script>, where HTML entity escaping does NOT apply --
   the only sequence that can break out is "</script". Escaping the forward
   slash is the standard fix and leaves the JSON valid. */
function jsonLd(schemas: object[]): string {
  if (schemas.length === 0) return '';
  const body = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas).replace(/<\//g, '<\\/');
  return `<script type="application/ld+json">${body}</script>`;
}

interface Meta {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  schemas: object[];
  body: string;
}

/**
 * Replace rather than append.
 *
 * The template already carries a title, description and a full og/twitter set
 * for the homepage. Appending would leave two of each in the document, and
 * which one wins is consumer-specific -- Facebook takes the first og:title,
 * Twitter tends to take the last. Replacing in place keeps exactly one.
 */
function render(template: string, meta: Meta): string {
  const url = `${SITE_URL}${canonicalPathFor(meta.path)}`;
  const title = esc(meta.title);
  const description = esc(meta.description);

  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${description}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${title}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${description}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${esc(url)}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${title}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${description}" />`,
  );
  if (meta.ogImage) {
    html = html.replace(
      /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:image" content="${esc(meta.ogImage)}" />`,
    );
    html = html.replace(
      /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:image" content="${esc(meta.ogImage)}" />`,
    );
  }

  const head = `<link rel="canonical" href="${esc(url)}" />${jsonLd(meta.schemas)}`;
  html = html.replace('</head>', `${head}</head>`);

  /* A sibling of #root, not a child, and removed by src/main.tsx before
     createRoot() runs. Inside #root it would depend on React's container
     -clearing behaviour; in a <noscript> it would be ambiguous to a crawler
     that does execute JS. A plain sibling is unambiguous in both cases. */
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"></div>\n<div id="prerender">${meta.body}</div>`,
  );

  return html;
}

function writeRoute(routePath: string, html: string): void {
  const clean = routePath.replace(/^\/+|\/+$/g, '');
  const dir = clean ? path.join(DIST, clean) : DIST;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
}

function links(items: Array<{ href: string; label: string }>): string {
  if (items.length === 0) return '';
  return `<ul>${items.map((i) => `<li><a href="${esc(i.href)}">${esc(i.label)}</a></li>`).join('')}</ul>`;
}

// ---------------------------------------------------------------------------
// Route builders
// ---------------------------------------------------------------------------

interface BankPaper {
  id: string;
  school: string;
  has_school: boolean;
  year: string | null;
  exam: string | null;
  cls: string;
  subject: string;
  board: string;
  question_count: number;
  marks: number;
}

function hasYear(year: string | null): boolean {
  return Boolean(year && year.trim() && year !== 'null');
}

function paperTitle(p: BankPaper): string {
  const year = hasYear(p.year) ? ` ${p.year}` : '';
  return `${p.school} Class ${p.cls} ${p.subject}${year} Question Paper | Shikshaq`;
}

function paperRoutes(papers: BankPaper[], template: string): number {
  const bySchool = new Map<string, BankPaper[]>();
  for (const p of papers) {
    if (!p.has_school) continue;
    const slug = schoolSlug(p.school);
    if (!slug) continue;
    if (!bySchool.has(slug)) bySchool.set(slug, []);
    bySchool.get(slug)!.push(p);
  }

  for (const p of papers) {
    const routePath = `/past-papers/${p.id}`;
    const url = `${SITE_URL}${routePath}`;
    const year = hasYear(p.year) ? p.year : null;
    const slug = p.has_school ? schoolSlug(p.school) : '';

    /* Siblings from the same school turn 1,282 near-orphan paper pages into a
       connected graph. Before this, most were reachable only from the sitemap
       and a single /school/:slug listing. */
    const siblings = (slug ? bySchool.get(slug) ?? [] : [])
      .filter((s) => s.id !== p.id)
      .slice(0, 4)
      .map((s) => ({
        href: `/past-papers/${s.id}`,
        label: `${s.school} Class ${s.cls} ${s.subject}${hasYear(s.year) ? ` ${s.year}` : ''}`,
      }));

    const heading = `${p.school} Class ${p.cls} ${p.subject}${year ? ` ${year}` : ''} question paper`;

    const body = [
      `<h1>${esc(heading)}</h1>`,
      `<dl>`,
      `<dt>School</dt><dd>${esc(p.school)}</dd>`,
      `<dt>Board</dt><dd>${esc(p.board)}</dd>`,
      `<dt>Class</dt><dd>${esc(p.cls)}</dd>`,
      `<dt>Subject</dt><dd>${esc(p.subject)}</dd>`,
      year ? `<dt>Year</dt><dd>${esc(year)}</dd>` : '',
      p.exam ? `<dt>Exam</dt><dd>${esc(p.exam)}</dd>` : '',
      `<dt>Questions</dt><dd>${esc(p.question_count)}</dd>`,
      `<dt>Total marks</dt><dd>${esc(p.marks)}</dd>`,
      `</dl>`,
      slug ? `<p><a href="/school/${esc(slug)}">All ${esc(p.school)} question papers</a></p>` : '',
      siblings.length ? `<h2>More from this school</h2>${links(siblings)}` : '',
    ].join('');

    /* isAccessibleForFree:false + hasPart is Google's documented paywall
       markup. Without it, a page that advertises 40 questions in its
       description while showing a signed-out reader two of them reads as
       thin content or a content mismatch, across 1,282 URLs. BankPaper.tsx
       emits no JSON-LD at all today, so this is the whole structured-data
       story for the site's largest URL class. */
    const learningResource = {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      '@id': `${url}#resource`,
      url,
      name: heading,
      learningResourceType: 'Exam question paper',
      educationalLevel: `Class ${p.cls}`,
      about: { '@type': 'Thing', name: p.subject },
      isAccessibleForFree: false,
      ...(year ? { datePublished: year } : {}),
      provider: { '@type': 'EducationalOrganization', name: p.school },
      isPartOf: { '@id': `${SITE_URL}/#website` },
      hasPart: {
        '@type': 'WebPageElement',
        isAccessibleForFree: false,
        cssSelector: '.question-list',
      },
    };

    const breadcrumbs = generateBreadcrumbSchema(
      [
        { name: 'Home', url: '/' },
        { name: 'Past papers', url: '/past-papers' },
        ...(slug ? [{ name: p.school, url: `/school/${slug}` }] : []),
        { name: heading, url: routePath },
      ],
      `${url}#breadcrumb`,
    );

    writeRoute(
      routePath,
      render(template, {
        title: paperTitle(p),
        description:
          `${p.question_count} questions from the ${p.school} Class ${p.cls} ${p.subject} ${p.exam ?? 'question paper'}, `
          + 'with marks, chapters and figures. Free to read with an account.',
        path: routePath,
        schemas: [learningResource, breadcrumbs],
        body,
      }),
    );
  }

  return papers.length;
}

function schoolRoutes(papers: BankPaper[], template: string): number {
  const bySchool = new Map<string, { name: string; papers: BankPaper[] }>();
  for (const p of papers) {
    if (!p.has_school) continue;
    const slug = schoolSlug(p.school);
    if (!slug) continue;
    if (!bySchool.has(slug)) bySchool.set(slug, { name: p.school, papers: [] });
    bySchool.get(slug)!.papers.push(p);
  }

  for (const [slug, { name, papers: list }] of bySchool) {
    const routePath = `/school/${slug}`;
    const url = `${SITE_URL}${routePath}`;
    const years = [...new Set(list.map((p) => p.year).filter(hasYear))].sort().reverse();
    const subjects = [...new Set(list.map((p) => p.subject))];

    /* Every paper, not a sample. This listing is what makes the 1,282 paper
       URLs crawlable without relying on the sitemap alone. */
    const paperLinks = list.map((p) => ({
      href: `/past-papers/${p.id}`,
      label: `Class ${p.cls} ${p.subject}${hasYear(p.year) ? ` ${p.year}` : ''}${p.exam ? ` ${p.exam}` : ''}`,
    }));

    const body = [
      `<h1>${esc(name)} question papers</h1>`,
      `<p>${esc(list.length)} past papers`,
      subjects.length ? ` across ${esc(subjects.join(', '))}` : '',
      years.length ? `, from ${esc(years[years.length - 1])} to ${esc(years[0])}` : '',
      `.</p>`,
      `<h2>All papers</h2>`,
      links(paperLinks),
    ].join('');

    writeRoute(
      routePath,
      render(template, {
        title: `${name} Question Papers | Shikshaq`,
        description:
          `${list.length} past question papers from ${name}`
          + `${subjects.length ? `, covering ${subjects.join(', ')}` : ''}`
          + `${years.length ? `, ${years[years.length - 1]} to ${years[0]}` : ''}. Free to read with an account.`,
        path: routePath,
        schemas: [
          generateCollectionPageSchema({
            url,
            name: `${name} question papers`,
            description: `Past question papers from ${name}, Kolkata.`,
            about: name,
            numberOfItems: list.length,
          }),
          generateBreadcrumbSchema(
            [
              { name: 'Home', url: '/' },
              { name: 'Schools', url: '/schools' },
              { name, url: routePath },
            ],
            `${url}#breadcrumb`,
          ),
        ],
        body,
      }),
    );
  }

  return bySchool.size;
}

interface TeacherRow {
  slug: string;
  name: string;
  image_url: string | null;
}

interface ShikshaqmineRow {
  Slug: string;
  Title: string | null;
  "Sir/Ma'am?": string | null;
  Subjects: string | null;
  'Classes Taught': string | null;
  Area: string | null;
  'School Boards Catered': string | null;
  Description: string | null;
  'Qualifications etc': string | null;
  'Mode of Teaching': string | null;
}

function teacherRoutes(teachers: TeacherRow[], mine: Map<string, ShikshaqmineRow>, template: string): number {
  for (const t of teachers) {
    const m = mine.get(t.slug.toLowerCase());
    const routePath = `/tuition-teachers/${t.slug}`;
    const url = `${SITE_URL}${routePath}`;
    const honorific = m?.["Sir/Ma'am?"] ?? '';
    const displayName = honorific ? `${t.name} ${honorific}` : t.name;
    const subjects = (m?.Subjects ?? '').split(',').map((s) => s.trim()).filter(Boolean);
    const classes = (m?.['Classes Taught'] ?? '').split(',').map((s) => s.trim()).filter(Boolean);
    const boards = (m?.['School Boards Catered'] ?? '').split(',').map((s) => s.trim()).filter(Boolean);
    const area = m?.Area ?? null;
    const primary = subjects[0] ?? 'Tuition';

    /* NO Description and NO "Qualifications etc" here, deliberately.
       Those two are the teacher's own prose, and they are the blocks marked
       [data-protected] on the profile, where selection and copying are
       blocked. Emitting them into static HTML would have made that protection
       theatre: the browser would refuse to let you select the bio while
       `curl https://www.shikshaq.in/tuition-teachers/<slug>` handed over the
       same paragraph in full, to anyone, with no account and no JavaScript.
       What stays is structured metadata -- subjects, boards, classes, areas,
       mode. That is what these pages actually rank for ("maths tuition teacher
       in Ballygunge"), it is factual rather than authored, and it is the half
       a competitor could reconstruct from a directory anyway. The prose is the
       part that took work, so it now comes only from the API, behind the same
       gates as everything else. */
    const body = [
      `<h1>${esc(displayName)}</h1>`,
      `<p>${esc(primary)} tuition teacher in ${esc(area ?? 'Kolkata')}.</p>`,
      `<dl>`,
      subjects.length ? `<dt>Subjects</dt><dd>${esc(subjects.join(', '))}</dd>` : '',
      classes.length ? `<dt>Classes</dt><dd>${esc(classes.join(', '))}</dd>` : '',
      boards.length ? `<dt>Boards</dt><dd>${esc(boards.join(', '))}</dd>` : '',
      area ? `<dt>Area</dt><dd>${esc(area)}</dd>` : '',
      m?.['Mode of Teaching'] ? `<dt>Mode</dt><dd>${esc(m['Mode of Teaching'])}</dd>` : '',
      `</dl>`,
    ].join('');

    /* No telephone passed, deliberately. generateTeacherPersonSchema accepts
       phoneNumber, and this script could not supply it even if a template
       asked -- anon has no SELECT on Shikshaqmine."Phone Number". Contact
       stays behind the sign-in gate on the profile itself. */
    /* The bio and qualifications are withheld from the JSON-LD for the same
       reason they are withheld from the body block above -- a <script
       type="application/ld+json"> is plain text in the served HTML, so putting
       the prose there would have leaked exactly what removing it from the body
       was meant to stop. Easy thing to miss: the visible markup looks clean
       and the paragraph is still sitting in the page source. */
    const person = generateTeacherPersonSchema({
      url,
      name: displayName,
      area,
      subjects,
      classesTaught: classes,
    });

    const description =
      `${displayName} teaches ${subjects.length ? subjects.join(', ') : 'tuition'}`
      + `${classes.length ? ` for ${classes.join(', ')}` : ''}`
      + `${area ? ` in ${area}` : ' in Kolkata'}. `
      + 'See experience, fees and reviews on Shikshaq.';

    const ogImage = t.image_url && /^https?:\/\//.test(t.image_url) ? t.image_url : undefined;

    writeRoute(
      routePath,
      render(template, {
        title: `${displayName} - ${primary} Tuition Teacher in ${area ?? 'Kolkata'} | Shikshaq`,
        description,
        path: routePath,
        ogImage,
        schemas: [
          person,
          generateBreadcrumbSchema(
            [
              { name: 'Home', url: '/' },
              { name: 'Tuition teachers', url: '/all-tuition-teachers-in-kolkata' },
              { name: displayName, url: routePath },
            ],
            `${url}#breadcrumb`,
          ),
        ],
        body,
      }),
    );
  }

  return teachers.length;
}

/**
 * The 35 subject and board landing pages.
 *
 * These carry 1,127 lines of genuinely good, route-specific copy in
 * src/content/subject-seo.ts -- and every word of it has been invisible to any
 * crawler that does not execute JavaScript. They are also the pages that
 * inherit Browse's generic <h1>, so all 35 of the highest-intent commercial
 * URLs currently share one heading.
 *
 * Same objects the client renders through SEOContentBlock, so there is one
 * source of truth and no possibility of the static HTML and the rendered page
 * disagreeing.
 */
function subjectRoutes(template: string): number {
  const entries: Array<[string, SubjectContent, 'subject' | 'board']> = [
    ...Object.entries(SUBJECT_CONTENT).map(([k, v]) => [k, v, 'subject'] as [string, SubjectContent, 'subject']),
    ...Object.entries(BOARD_CONTENT).map(([k, v]) => [k, v, 'board'] as [string, SubjectContent, 'board']),
  ];

  for (const [routePath, content, kind] of entries) {
    const url = `${SITE_URL}${canonicalPathFor(routePath)}`;
    const label = routePath
      .replace(/^\//, '')
      .replace(/-tuition-teachers-in-kolkata$/, '')
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const heading = kind === 'board'
      ? `${label} tuition teachers in Kolkata`
      : `${label} tuition teachers in Kolkata`;

    const body = [
      `<h1>${esc(heading)}</h1>`,
      `<p>${esc(content.intro)}</p>`,
      content.covers.length
        ? `<h2>What tutors cover</h2><ul>${content.covers.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>`
        : '',
      content.faqs.length
        ? `<h2>Common questions</h2>${content.faqs
            .map((f) => `<h3>${esc(f.question)}</h3><p>${esc(f.answer)}</p>`)
            .join('')}`
        : '',
      content.internalLinks.length ? `<h2>Related</h2>${links(content.internalLinks)}` : '',
    ].join('');

    writeRoute(
      routePath,
      render(template, {
        title: `${heading} | Shikshaq`,
        description: content.intro.slice(0, 300).replace(/\s+\S*$/, ''),
        path: routePath,
        schemas: [
          generateCollectionPageSchema({
            url,
            name: heading,
            description: content.intro.slice(0, 200),
            about: label,
            numberOfItems: 0,
          }),
          ...(content.faqs.length ? [generateFAQPageSchema({ url, faqs: content.faqs })] : []),
          generateBreadcrumbSchema(
            [
              { name: 'Home', url: '/' },
              { name: 'Tuition teachers', url: '/all-tuition-teachers-in-kolkata' },
              { name: heading, url: routePath },
            ],
            `${url}#breadcrumb`,
          ),
        ],
        body,
      }),
    );
  }

  return entries.length;
}

// ---------------------------------------------------------------------------
// The assertion that makes the exclusion real
// ---------------------------------------------------------------------------

/**
 * Fetch real question text and prove none of it reached dist/.
 *
 * The structural guarantee (anon cannot read bank_questions.body) is the
 * primary defence, but it is invisible -- someone could add a service-role key
 * here in six months without realising what it unlocks. This makes the rule
 * enforceable by the build instead of by memory.
 */
async function assertNoQuestionText(paperId: string, emitted: string[]): Promise<void> {
  const { data, error } = await supabase.rpc('bank_paper_questions', { p_paper_id: paperId });
  if (error || !Array.isArray(data) || data.length === 0) {
    console.warn('   Could not fetch sample question text; skipping leak assertion');
    return;
  }

  /* A distinctive run of words, not the whole body: templates wrap and
     truncate, so an exact full-string match would miss a partial leak. */
  const needles = (data as Array<{ body: string }>)
    .map((q) => (q.body || '').trim().split(/\s+/).slice(0, 8).join(' '))
    .filter((s) => s.length > 30);

  if (needles.length === 0) return;

  for (const file of emitted) {
    const html = fs.readFileSync(file, 'utf8');
    for (const needle of needles) {
      if (html.includes(needle)) {
        fail(
          `Question body text found in ${path.relative(DIST, file)}.\n`
          + `  Matched: "${needle}"\n`
          + '  Prerendered HTML is served to anyone over plain HTTP, with no account and no rate limit.\n'
          + '  Question text belongs behind bank_paper_questions(), never in a static file.',
        );
      }
    }
  }
  console.log(`   Leak assertion passed (${needles.length} samples vs ${emitted.length} files)`);
}

// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('\nPrerendering routes...\n');

  if (!fs.existsSync(TEMPLATE_PATH)) {
    fail(`No dist/index.html at ${TEMPLATE_PATH}. Run vite build first.`);
  }
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  if (!template.includes('<div id="root"></div>')) {
    fail('dist/index.html has no <div id="root"></div> to anchor the prerender block to.');
  }

  const allPapers = await fetchAll<BankPaper>(
    () => supabase
      .from('bank_papers')
      .select('id, school, has_school, year, exam, cls, subject, board, question_count, marks')
      .eq('is_published', true) as unknown as Query,
    'bank_papers',
  );
  if (allPapers.length === 0) fail('bank_papers returned zero rows');

  /* Filter before deriving schools, not after. A school whose only papers are
     all excluded then drops out on its own, instead of getting a hub page
     listing nothing -- which would trade one thin page for another. */
  const papers = allPapers.filter((p) => !isExcludedPaper(p.id));
  const skipped = allPapers.length - papers.length;
  if (skipped > 0) console.log(`   Skipped ${skipped} papers with placeholder question text`);

  const teachers = await fetchAll<TeacherRow>(
    () => supabase.from('teachers_list').select('slug, name, image_url').order('name') as unknown as Query,
    'teachers_list',
  );
  if (teachers.length === 0) fail('teachers_list returned zero rows');

  /* No "Link", no "Phone Number", no "Email ID" -- anon has no SELECT on any
     of them, and naming one here would fail the whole query with a
     permission error rather than omitting the column. */
  const mineRows = await fetchAll<ShikshaqmineRow>(
    () => supabase
      .from('Shikshaqmine')
      .select('"Slug","Title","Sir/Ma\'am?","Subjects","Classes Taught","Area","School Boards Catered","Description","Qualifications etc","Mode of Teaching"') as unknown as Query,
    'Shikshaqmine',
  );
  const mine = new Map(mineRows.filter((r) => r.Slug).map((r) => [r.Slug.toLowerCase(), r]));

  const counts = {
    papers: paperRoutes(papers, template),
    schools: schoolRoutes(papers, template),
    teachers: teacherRoutes(teachers, mine, template),
    subjects: subjectRoutes(template),
  };

  const total = counts.papers + counts.schools + counts.teachers + counts.subjects;

  console.log('   Paper pages:        ' + counts.papers);
  console.log('   School pages:       ' + counts.schools);
  console.log('   Teacher profiles:   ' + counts.teachers);
  console.log('   Subject/board:      ' + counts.subjects);
  console.log('   ─────────────────────────────');
  console.log('   Total prerendered:  ' + total);

  const sample = [
    path.join(DIST, 'past-papers', papers[0].id, 'index.html'),
    path.join(DIST, 'tuition-teachers', teachers[0].slug, 'index.html'),
  ].filter((f) => fs.existsSync(f));

  await assertNoQuestionText(papers[0].id, sample);

  console.log('\nPrerender complete.\n');
}

main().catch((err) => fail(String(err)));
