/**
 * DYNAMIC SITEMAP GENERATOR FOR SHIKSHAQ
 *
 * Automatically generates sitemap.xml with:
 * - Static pages (homepage, browse, FAQ, etc.)
 * - Subject pages (all 23+ subjects)
 * - Board pages (CBSE, ICSE, etc.)
 * - Teacher profiles (dynamically from database)
 *
 * Implements sitemap index if URLs exceed 50,000
 * Updates automatically when teachers are added/removed
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
/** Same anon/public key as the browser client — see src/integrations/supabase/client.ts */
const SUPABASE_PUBLISHABLE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';
const SITE_URL = 'https://www.shikshaq.in';

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Static pages with fixed URLs
 */
const STATIC_PAGES: SitemapURL[] = [
  {
    loc: '/',
    changefreq: 'daily',
    priority: 1.0,
  },
  {
    loc: '/all-tuition-teachers-in-kolkata',
    changefreq: 'daily',
    priority: 0.9,
  },
  {
    loc: '/faq',
    changefreq: 'monthly',
    priority: 0.6,
  },
  {
    loc: '/join',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    loc: '/join/apply',
    changefreq: 'monthly',
    priority: 0.6,
  },
  {
    loc: '/past-papers',
    changefreq: 'weekly',
    priority: 0.5,
  },
  {
    loc: '/more',
    changefreq: 'monthly',
    priority: 0.4,
  },
  {
    loc: '/privacy-policy',
    changefreq: 'yearly',
    priority: 0.3,
  },
  {
    loc: '/terms-of-service',
    changefreq: 'yearly',
    priority: 0.3,
  },
  {
    loc: '/recommend-teacher',
    changefreq: 'monthly',
    priority: 0.5,
  },
];

/**
 * Subject pages - all 23 subjects
 */
const SUBJECT_PAGES: SitemapURL[] = [
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
];

/**
 * Board pages - all 5 boards
 */
const BOARD_PAGES: SitemapURL[] = [
  { loc: '/cbse-ncert-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.8 },
  { loc: '/icse-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.8 },
  { loc: '/igcse-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.7 },
  { loc: '/international-board-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.7 },
  { loc: '/state-board-tuition-teachers-in-kolkata', changefreq: 'weekly', priority: 0.7 },
];

/**
 * Fetch all teacher slugs from database
 */
async function fetchTeacherSlugs(): Promise<SitemapURL[]> {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY');
    return [];
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

  try {
    // Query teachers_list table for all approved teachers
    const { data: teachers, error } = await supabase
      .from('teachers_list')
      .select('slug, updated_at')
      .eq('approved', true)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching teacher slugs:', error);
      return [];
    }

    if (!teachers || teachers.length === 0) {
      console.warn('No approved teachers found in database');
      return [];
    }

    return teachers.map((teacher) => ({
      loc: `/tuition-teachers/${teacher.slug}`,
      lastmod: teacher.updated_at || new Date().toISOString().split('T')[0],
      changefreq: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (err) {
    console.error('Exception while fetching teacher slugs:', err);
    return [];
  }
}

/**
 * Generate sitemap XML from URL array
 */
function generateSitemapXML(urls: SitemapURL[]): string {
  const urlElements = urls
    .map((url) => {
      const lastmod = url.lastmod || new Date().toISOString().split('T')[0];
      return `  <url>
    <loc>${SITE_URL}${url.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${url.changefreq || 'weekly'}</changefreq>
    <priority>${url.priority || 0.5}</priority>
  </url>`;
    })
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
 * Generate sitemap index (if URLs exceed 50,000)
 */
function generateSitemapIndex(sitemaps: { loc: string; lastmod: string }[]): string {
  const sitemapElements = sitemaps
    .map((sitemap) => {
      return `  <sitemap>
    <loc>${SITE_URL}${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapElements}
</sitemapindex>`;
}

/**
 * Main handler for Vercel/Netlify serverless function
 */
export default async function handler(req: any, res: any) {
  try {
    const currentDate = new Date().toISOString().split('T')[0];

    // Fetch dynamic teacher pages
    const teacherPages = await fetchTeacherSlugs();

    // Combine all URLs
    const allURLs = [
      ...STATIC_PAGES.map((url) => ({ ...url, lastmod: currentDate })),
      ...SUBJECT_PAGES.map((url) => ({ ...url, lastmod: currentDate })),
      ...BOARD_PAGES.map((url) => ({ ...url, lastmod: currentDate })),
      ...teacherPages,
    ];

    console.log(`Generated sitemap with ${allURLs.length} URLs`);
    console.log(`- Static pages: ${STATIC_PAGES.length}`);
    console.log(`- Subject pages: ${SUBJECT_PAGES.length}`);
    console.log(`- Board pages: ${BOARD_PAGES.length}`);
    console.log(`- Teacher profiles: ${teacherPages.length}`);

    // If URLs exceed 50,000, generate sitemap index
    if (allURLs.length > 50000) {
      // Split into chunks of 50,000
      const chunks: SitemapURL[][] = [];
      for (let i = 0; i < allURLs.length; i += 50000) {
        chunks.push(allURLs.slice(i, i + 50000));
      }

      // Generate individual sitemaps (would need separate handlers)
      const sitemapIndex = generateSitemapIndex(
        chunks.map((_, index) => ({
          loc: `/sitemap-${index + 1}.xml`,
          lastmod: currentDate,
        }))
      );

      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
      res.status(200).send(sitemapIndex);
    } else {
      // Generate single sitemap
      const sitemapXML = generateSitemapXML(allURLs);

      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
      res.status(200).send(sitemapXML);
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
}

/**
 * For local development / build-time generation
 */
export async function generateSitemap(): Promise<string> {
  const currentDate = new Date().toISOString().split('T')[0];
  const teacherPages = await fetchTeacherSlugs();

  const allURLs = [
    ...STATIC_PAGES.map((url) => ({ ...url, lastmod: currentDate })),
    ...SUBJECT_PAGES.map((url) => ({ ...url, lastmod: currentDate })),
    ...BOARD_PAGES.map((url) => ({ ...url, lastmod: currentDate })),
    ...teacherPages,
  ];

  return generateSitemapXML(allURLs);
}
