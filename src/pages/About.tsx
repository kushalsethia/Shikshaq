import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Handshake, Sparkles, Users, FileText, School, IndianRupee } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { usePageMeta } from '@/hooks/usePageMeta';
import { supabase } from '@/integrations/supabase/client';
import aboutPhoto from '@/assets/0001.jpg';
import aboutPhotoWebp from '@/assets/0001.webp';
import aboutPhotoAvif from '@/assets/0001.avif';

const CONTAINER = 'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8';
const SECTION = 'py-12 sm:py-16 lg:py-20';

const PRINCIPLES = [
  { title: 'No commission, ever', body: 'Fees are agreed directly between you and the teacher. We never sit in the middle of a payment.' },
  { title: 'Direct contact', body: 'Enquiries reach the teacher on WhatsApp. No lead credits, no bidding for students.' },
  { title: 'Built for Kolkata', body: 'We were students in this city. The platform is built for how tuition actually works here.' },
  { title: 'No paid placement', body: 'Real reviews from real students, and no teacher can pay to rank higher in results.' },
];

export default function About() {
  usePageMeta(
    'About Shikshaq | Free tuition teacher matching in Kolkata',
    'Shikshaq is a free platform connecting Kolkata students with verified tuition teachers directly, with no commission and no middlemen.'
  );

  const navigate = useNavigate();
  const [stats, setStats] = useState({ teachers: null as number | null, papers: null as number | null, schools: null as number | null });

  useEffect(() => {
    async function fetchStats() {
      const [teachersRes, papersRes, schoolsRes] = await Promise.all([
        supabase.from('teachers_list').select('id', { count: 'exact', head: true }),
        supabase.from('papers').select('id', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('papers').select('school').eq('is_published', true),
      ]);
      const distinctSchools = schoolsRes.data ? new Set(schoolsRes.data.map((p) => p.school)).size : null;
      setStats({
        teachers: teachersRes.count ?? null,
        papers: papersRes.count ?? null,
        schools: distinctSchools,
      });
    }
    fetchStats();
  }, []);

  const aboutStats = [
    { n: stats.teachers, label: 'Verified teachers listed', icon: Users, shape: 'bg-brand/15 text-brand' },
    { n: stats.papers, label: 'Past papers, free to read', icon: FileText, shape: 'bg-brand-blue/15 text-brand-blue' },
    { n: stats.schools, label: 'Kolkata schools represented', icon: School, shape: 'bg-mint text-foreground' },
    { n: 0, label: 'Commission taken, ever', icon: IndianRupee, shape: 'bg-muted text-foreground', prefix: '₹' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pb-20 lg:pb-0">
        {/* ------------------------------------------------------------ Hero */}
        {/* Rebuilt from zero against a specific reference (Spark Kids School): a
            full-bleed saturated color band containing a split card — headline/copy/
            CTA on a white panel to the left, a real photo panel to the right — rather
            than the previous single-column PageHeader-driven layout. Structural
            change, not a re-skin of PageHeader (which stays in place for every other
            page that uses it). */}
        <section className="bg-brand px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4">
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="flex flex-col justify-center rounded-3xl bg-warm-card p-6 sm:p-8 lg:p-10">
              <p className="mb-2 text-label font-bold uppercase tracking-wide text-brand">About us</p>
              <h1 className="font-display text-page-title font-bold leading-[1.1] text-foreground sm:text-display-hero">
                Tuition in Kolkata,{' '}
                {/* Icon-in-headline (Aaply reference: an emoji sits mid-sentence in the
                    hero title) — adapted with the same inline icon-bubble device the
                    Index hero already uses (a lucide icon inside a small brand-colour
                    circle), rather than a raw emoji, so it matches the rest of the
                    type system instead of introducing a new device. */}
                <span
                  aria-hidden="true"
                  className="relative mx-[0.06em] inline-flex h-[0.62em] w-[0.62em] -translate-y-[0.08em] items-center justify-center rounded-full bg-brand-blue align-middle"
                >
                  <Handshake className="h-[0.62em] w-[0.62em] text-white" strokeWidth={2.5} aria-hidden="true" />
                </span>{' '}
                <span
                  className="marker-highlight marker-highlight--pill"
                  style={{ '--marker-color': 'hsl(var(--brand-blue))' } as React.CSSProperties}
                >
                  without the middleman
                </span>
                .
              </h1>
              <p className="mt-4 max-w-prose text-body-secondary text-muted-foreground">
                Shikshaq started because finding a tuition teacher in this city runs on word of mouth, and word of mouth runs out fast. We list teachers, students contact them directly, and no money passes through us.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <a
                  href="#principles"
                  className="flex h-12 items-center rounded-full bg-panel px-6 text-sm font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-panel focus-visible:ring-offset-2"
                >
                  What we hold to
                </a>
                <span aria-hidden="true" className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-brand text-white">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </div>

            <div className="hidden overflow-hidden rounded-3xl sm:block">
              <picture>
                <source srcSet={aboutPhotoAvif} type="image/avif" />
                <source srcSet={aboutPhotoWebp} type="image/webp" />
                <img
                  src={aboutPhoto}
                  alt="A tuition class in session in Kolkata"
                  loading="eager"
                  decoding="async"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover"
                />
              </picture>
            </div>
          </div>
        </section>

        {/* Stat row — rebuilt as a centered heading + 4-column icon/number/label
            strip (Spark Kids School's "School of Early Development" pattern),
            replacing the previous tilted-card cluster entirely. */}
        <section className={`${CONTAINER} pt-10 sm:pt-14 lg:pt-16`}>
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Built for how tuition actually works in Kolkata
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:mt-10 lg:grid-cols-4 lg:gap-8">
            {aboutStats.map((st, i) => {
              const Icon = st.icon;
              return (
                <div key={st.label} className="animate-card-reveal flex flex-col items-center text-center" style={{ animationDelay: `${Math.min(i, 5) * 40}ms` }}>
                  <span className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl ${st.shape}`}>
                    <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <div className="text-[clamp(22px,2.8vw,30px)] font-extrabold tracking-[-.04em] tabular-nums">
                    {/* A literal 0 reads as broken on a trust surface (DESIGN_SYSTEM §13) —
                        except the commission stat, where zero is the point. */}
                    {st.n == null || (st.n === 0 && !st.prefix) ? '—' : `${st.prefix || ''}${st.n.toLocaleString('en-IN')}`}
                  </div>
                  <div className="mt-1 max-w-[18ch] text-sm text-muted-foreground">{st.label}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* --------------------------------------------------------- Principles */}
        <section id="principles" className={`${CONTAINER} ${SECTION} scroll-mt-20 pt-8 sm:pt-10 lg:pt-12`}>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">What we hold to</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {PRINCIPLES.map((pr, i) => (
              <div
                key={pr.title}
                className="animate-card-reveal rounded-2xl bg-card p-4 shadow-border sm:p-6"
                style={{ animationDelay: `${Math.min(i, 5) * 40}ms` }}
              >
                <h3 className="text-lg font-semibold">{pr.title}</h3>
                <p className="mt-2 text-sm leading-[1.6] text-muted-foreground">{pr.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------- How it started */}
        <section className={`${CONTAINER} pb-16 sm:pb-20 lg:pb-24`}>
          <p className="text-xs font-medium uppercase tracking-wide text-brand">Where this comes from</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">How this started</h2>
          <div className="mt-6 space-y-4 rounded-2xl border-l-4 border-brand bg-card p-6 shadow-border sm:p-8">
            <p className="max-w-prose text-base leading-[1.65] text-muted-foreground sm:text-lg">
              Word of mouth is a fine way to find a teacher, right up until you're new to the area or don't have the right group chat to ask in. Shikshaq doesn't try to replace that network, it just makes it searchable, by subject, grade and location, so it stops mattering whose cousin you happen to know.
            </p>
            <p className="max-w-prose text-base leading-[1.65] text-muted-foreground sm:text-lg">
              The past papers exist for a similar reason. They were already circulating as scanned PDFs and forwarded chats; putting them in one place, free to read, just means fewer dead ends before an exam.
            </p>
            <p className="max-w-prose text-base leading-[1.65] text-muted-foreground sm:text-lg">
              The four things we hold to, above, aren't a mission statement so much as the rules the product actually runs on. The numbers at the top of this page are what following those rules has produced so far, and we'd rather show you those than a row of team photos before we're ready to put real names to them.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------ CTA slab */}
        <section className={`${CONTAINER} pb-16 sm:pb-20 lg:pb-24`}>
          <div className="flex flex-col items-start gap-5 rounded-4xl bg-panel p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8 lg:p-10">
            <div>
              <h3 className="flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl">
                Know a teacher worth listing?
                <Sparkles className="h-5 w-5 text-brand" aria-hidden="true" />
              </h3>
              <p className="mt-2 max-w-prose text-sm leading-[1.6] text-white/60">
                Recommend them and we will reach out. Most of our best teachers came in this way.
              </p>
            </div>
            <button
              onClick={() => navigate('/recommend-teacher')}
              className="min-h-11 flex-none rounded-lg bg-brand px-6 py-3.5 text-sm font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-panel motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              Recommend a teacher
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
