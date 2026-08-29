#!/usr/bin/env tsx
/**
 * AUTOMATIC SITEMAP GENERATOR
 *
 * This script automatically regenerates public/sitemap.xml with:
 * - All approved teacher profiles from database
 * - All subject pages
 * - All board pages
 * - All static pages
 *
 * Run manually: npm run generate-sitemap
 * Or set up as cron job / build step
 *
 * Updates public/sitemap.xml directly
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
/* Imported, not reimplemented. A local copy of this drifted immediately: it
   omitted the `&` -> ' and ' expansion that schoolSlug does before stripping
   non-alphanumerics, so any school with an ampersand would have been listed in
   the sitemap under a slug SchoolPage.tsx cannot resolve — a submitted URL
   that 404s, which is the exact bug already fixed once for /cbse-ncert-. */
import { schoolSlug } from '../src/lib/school-slug';
import { schoolsOf, papersOf } from '../src/lib/question-bank';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
const SITE_URL = 'https://www.shikshaq.in';
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

interface SitemapURL {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

/**
 * Static pages with fixed URLs
 */
const STATIC_PAGES: Omit<SitemapURL, 'lastmod'>[] = [
  { loc: '/', changefreq: 'daily', priority: 1.0 },
  { loc: '/all-tuition-teachers-in-kolkata', changefreq: 'daily', priority: 0.9 },
  { loc: '/faq', changefreq: 'monthly', priority: 0.6 },
  { loc: '/join', changefreq: 'monthly', priority: 0.7 },
  /* '/join/apply' deliberately omitted: robots.txt disallows it, so listing it
     here produced a "Submitted URL blocked by robots.txt" warning in Search
     Console. Keep the two in agreement. */
  { loc: '/past-papers', changefreq: 'weekly', priority: 0.5 },
  { loc: '/privacy-policy', changefreq: 'yearly', priority: 0.3 },
  { loc: '/terms-of-service', changefreq: 'yearly', priority: 0.3 },
  { loc: '/recommend-teacher', changefreq: 'monthly', priority: 0.5 },
  /* /about and /more were internally linked but absent here. /contact was
     neither — grep found no `to="/contact"` anywhere in src/, so with zero
     inbound links and no sitemap entry it would effectively never be
     crawled, despite being a direct trust signal for a local-services site. */
  { loc: '/about', changefreq: 'monthly', priority: 0.6 },
  { loc: '/more', changefreq: 'monthly', priority: 0.4 },
  { loc: '/contact', changefreq: 'monthly', priority: 0.5 },
  /* Both added with their routes and linked from the footer / papers page, so
     they must be listed here too — an internally linked page absent from the
     sitemap is discoverable but slow to be recrawled. */
  { loc: '/submit-a-paper', changefreq: 'monthly', priority: 0.5 },
  /* The one paper rendered as real questions rather than a PDF embed: 41
     indexable questions of ICSE Class X Maths, which is the only page on this
     site carrying exam-question text. Weekly is wrong (it never changes) but
     0.7 reflects that it is the strongest long-tail asset here. */
  { loc: '/past-papers/icse-2025-maths', changefreq: 'yearly', priority: 0.7 },
];

/**
 * Subject pages
 */
const SUBJECT_PAGES: Omit<SitemapURL, 'lastmod'>[] = [
  { loc: '/maths-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.8 },
  { loc: '/english-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.8 },
  { loc: '/science-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.8 },
  { loc: '/physics-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.8 },
  { loc: '/chemistry-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.8 },
  { loc: '/biology-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.8 },
  { loc: '/computer-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.7 },
  { loc: '/hindi-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.7 },
  { loc: '/bengali-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.7 },
  { loc: '/history-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.7 },
  { loc: '/geography-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.7 },
  { loc: '/economics-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.7 },
  { loc: '/accounts-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.7 },
  { loc: '/business-studies-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.7 },
  { loc: '/commerce-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.7 },
  { loc: '/commercial-studies-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.6 },
  { loc: '/psychology-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.6 },
  { loc: '/sociology-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.6 },
  { loc: '/political-science-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.6 },
  { loc: '/environmental-science-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.6 },
  { loc: '/drawing-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.6 },
  { loc: '/sat-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.7 },
  { loc: '/act-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.7 },
  { loc: '/cat-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.7 },
  { loc: '/nmat-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.6 },
  { loc: '/gmat-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.6 },
  { loc: '/ca-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.7 },
  { loc: '/cfa-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.6 },
  /* Both routes are live (App.tsx) with their own copy in SubjectPage.tsx and
     are linked from the footer, but were missing here — crawlable, yet given no
     sitemap signal. */
  { loc: '/clat-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.7 },
  { loc: '/social-studies-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.6 },
];

/**
 * Board pages
 */
const BOARD_PAGES: Omit<SitemapURL, 'lastmod'>[] = [
  /* Must match the route registered in App.tsx exactly. This was
     '/cbse-tuition-teachers-in-kolkata', which has no route and fell through to
     the catch-all 404 — a submitted sitemap URL that returned 404 to crawlers. */
  { loc: '/cbse-ncert-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.8 },
  { loc: '/icse-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.8 },
  { loc: '/igcse-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.7 },
  { loc: '/international-board-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.7 },
  { loc: '/state-board-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.7 },
];

/**
 * Fetch all approved teacher slugs from Supabase
 */
/**
 * /school/:slug pages are generated the same way teacher profiles are. They
 * existed and were linked from exactly one place (PastPapers.tsx), with no
 * sitemap entry at all — yet this is the URL shape that ranks for queries like
 * "la martiniere question paper", which SEO_STRATEGY.md names as the highest
 * value untapped pattern. There is no schools table, so the slugs are derived
 * from the papers rows, matching how SchoolPage.tsx resolves them.
 */
async function fetchSchoolSlugs(): Promise<SitemapURL[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  try {
    console.log('Fetching school data from Supabase...');
    const { data, error } = await supabase
      .from('papers')
      .select('school')
      .eq('is_published', true);
    if (error) {
      console.error('Database error:', error.message);
      return [];
    }
    const currentDate = new Date().toISOString().split('T')[0];
    const counts = new Map<string, number>();
    for (const row of data || []) {
      const name = (row as { school: string | null }).school;
      if (!name || !name.trim()) continue;
      counts.set(name, (counts.get(name) || 0) + 1);
    }
    const seen = new Set<string>();
    const urls: SitemapURL[] = [];
    for (const [name] of counts) {
      const slug = schoolSlug(name);
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      urls.push({ loc: `/school/${slug}`, changefreq: 'weekly', priority: 0.5, lastmod: currentDate });
    }
    console.log(`Found ${urls.length} schools`);
    return urls;
  } catch (err) {
    console.error('Failed to fetch schools:', err);
    return [];
  }
}

async function fetchTeacherSlugs(): Promise<SitemapURL[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('ERROR: Missing Supabase credentials');
    console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env');
    return [];
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    console.log('Fetching teacher data from Supabase...');

    const { data: teachers, error } = await supabase
      .from('teachers_list')
      .select('slug')
      .order('name');

    if (error) {
      console.error('Database error:', error.message);
      return [];
    }

    if (!teachers || teachers.length === 0) {
      console.warn('No teachers found in database');
      return [];
    }

    const today = new Date().toISOString().split('T')[0];
    console.log(`Found ${teachers.length} teachers`);

    return teachers.map((teacher) => ({
      loc: `/tuition-teachers/${teacher.slug}`,
      lastmod: today,
      changefreq: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (err) {
    console.error('❌ Exception while fetching teachers:', err);
    return [];
  }
}

/**
 * Generate sitemap XML
 */
function generateSitemapXML(urls: SitemapURL[]): string {
  const urlElements = urls
    .map(
      (url) => `  <url>
    <loc>${SITE_URL}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority.toFixed(1)}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urlElements}
</urlset>`;
}

/**
 * The question bank's own URLs.
 *
 * The bank is a static asset rather than a table, so this script never saw
 * it: 193 paper pages and the ~79 schools that exist only in the bank were
 * absent from the sitemap even though every one of them is a real, linked,
 * indexable page. Read from disk here for the same reason schoolSlug is
 * imported rather than copied — one derivation, no second implementation to
 * drift out of step with what the app actually routes.
 */
function readBankURLs(currentDate: string): { schools: SitemapURL[]; papers: SitemapURL[] } {
  const bankPath = path.join(__dirname, '..', 'public', 'question-bank.json');
  if (!fs.existsSync(bankPath)) {
    console.warn('   Question bank not found, skipping its URLs');
    return { schools: [], papers: [] };
  }

  try {
    const bank = JSON.parse(fs.readFileSync(bankPath, 'utf-8'));
    const schools: SitemapURL[] = schoolsOf(bank).map((school) => ({
      loc: `/school/${school.slug}`,
      changefreq: 'weekly',
      priority: 0.5,
      lastmod: currentDate,
    }));
    const papers: SitemapURL[] = papersOf(bank).map((paper) => ({
      loc: `/past-papers/${paper.id}`,
      changefreq: 'yearly',
      priority: 0.6,
      lastmod: currentDate,
    }));
    return { schools, papers };
  } catch (err) {
    console.error('   Failed to read question bank:', err);
    return { schools: [], papers: [] };
  }
}

/** First occurrence wins, so a school in both sources is one URL, not two. */
function dedupeByLoc(urls: SitemapURL[]): SitemapURL[] {
  const seen = new Set<string>();
  return urls.filter((url) => {
    if (seen.has(url.loc)) return false;
    seen.add(url.loc);
    return true;
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting sitemap generation...\n');

  const currentDate = new Date().toISOString().split('T')[0];

  // Fetch dynamic teacher pages
  const teacherPages = await fetchTeacherSlugs();
  const schoolPages = await fetchSchoolSlugs();
  const bankURLs = readBankURLs(currentDate);

  // Combine all URLs. Deduped because a school with papers in both the table
  // and the bank is one page and must be listed once.
  const allURLs: SitemapURL[] = dedupeByLoc([
    ...STATIC_PAGES.map((url) => ({ ...url, lastmod: currentDate })),
    ...SUBJECT_PAGES.map((url) => ({ ...url, lastmod: currentDate })),
    ...BOARD_PAGES.map((url) => ({ ...url, lastmod: currentDate })),
    ...teacherPages,
    ...schoolPages,
    ...bankURLs.schools,
    ...bankURLs.papers,
  ]);

  console.log('\n📊 Sitemap Statistics:');
  console.log(`   Static pages:       ${STATIC_PAGES.length}`);
  console.log(`   Subject pages:      ${SUBJECT_PAGES.length}`);
  console.log(`   Board pages:        ${BOARD_PAGES.length}`);
  console.log(`   Teacher profiles:   ${teacherPages.length}`);
  console.log(`   School pages:       ${schoolPages.length} (table) + ${bankURLs.schools.length} (bank)`);
  console.log(`   Bank paper pages:   ${bankURLs.papers.length}`);
  console.log(`   ─────────────────────────────────`);
  console.log(`   Total URLs:         ${allURLs.length}`);

  if (allURLs.length > 50000) {
    console.warn('\n⚠️  WARNING: More than 50,000 URLs!');
    console.warn('   Consider implementing sitemap index for better performance.');
  }

  // Generate XML
  const sitemapXML = generateSitemapXML(allURLs);

  // Write to file
  try {
    fs.writeFileSync(OUTPUT_PATH, sitemapXML, 'utf-8');
    console.log(`\n✅ Sitemap generated successfully!`);
    console.log(`   Output: ${OUTPUT_PATH}`);
    console.log(`   Size: ${(sitemapXML.length / 1024).toFixed(2)} KB`);
  } catch (err) {
    console.error('\n❌ Failed to write sitemap file:', err);
    process.exit(1);
  }

  console.log('\n🎉 Done!\n');
}

// Run
main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
