import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { usePageMeta } from '@/hooks/usePageMeta';
import { supabase } from '@/integrations/supabase/client';

const CONTAINER = 'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8';
const SECTION = 'py-16 sm:py-20 lg:py-24';

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
    { n: stats.teachers, label: 'Verified teachers listed', fill: 'bg-brand text-white', rotate: '-rotate-[2.5deg]' },
    { n: stats.papers, label: 'Past papers, free to read', fill: 'bg-brand-blue text-white', rotate: 'rotate-[2deg]' },
    { n: stats.schools, label: 'Kolkata schools represented', fill: 'bg-card text-foreground shadow-border', rotate: '-rotate-[1.5deg]' },
    { n: 0, label: 'Commission taken, ever', fill: 'bg-muted text-foreground', rotate: 'rotate-[2.5deg]', prefix: '₹' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pb-20 lg:pb-0">
        {/* ------------------------------------------------------------ Hero */}
        <section className={`${CONTAINER} pt-6 pb-4 sm:pt-12 lg:pt-16`}>
          <div className="relative max-w-3xl space-y-3">
            <span
              aria-hidden="true"
              className="animate-sparkle absolute -left-2 -top-3 hidden h-[9px] w-[9px] rounded-[3px] bg-brand opacity-0 [animation-delay:.1s] lg:block"
            />
            <span
              aria-hidden="true"
              className="animate-sparkle absolute left-24 -top-1 hidden h-[6px] w-[6px] rounded-[2px] bg-brand-blue opacity-0 [animation-delay:.55s] lg:block"
            />
            <p className="animate-fade-slide-up text-xs font-medium uppercase tracking-wide text-brand">About us</p>
            <h1 className="animate-fade-slide-up [animation-delay:40ms] text-[clamp(30px,4.6vw,52px)] font-normal leading-[.98] tracking-[-.05em]">
              Tuition in Kolkata,{' '}
              <span className="font-extrabold">without the middleman</span>.
            </h1>
            <p className="animate-fade-slide-up max-w-prose text-base leading-[1.65] text-muted-foreground [animation-delay:80ms] sm:text-lg">
              Shikshaq started because finding a tuition teacher in this city runs on word of mouth, and word of mouth runs out fast. We list teachers, students contact them directly, and no money passes through us.
            </p>
          </div>

          {/* Stat cluster — tilted cards, real live counts, never a bare zero */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {aboutStats.map((st, i) => (
              <div
                key={st.label}
                className={`animate-card-reveal rounded-2xl p-4 transition-transform duration-150 hover:-translate-y-0.5 sm:p-6 ${st.fill} ${st.rotate}`}
                style={{ animationDelay: `${Math.min(i, 5) * 40}ms` }}
              >
                <div className="text-[clamp(26px,3.4vw,38px)] font-extrabold tracking-[-.04em] tabular-nums">
                  {/* A literal 0 reads as broken on a trust surface (DESIGN_SYSTEM §13) —
                      except the commission stat, where zero is the point. */}
                  {st.n == null || (st.n === 0 && !st.prefix) ? '—' : `${st.prefix || ''}${st.n.toLocaleString('en-IN')}`}
                </div>
                <div className="mt-1.5 text-sm font-medium opacity-90">{st.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------------- Principles */}
        <section className={`${CONTAINER} ${SECTION} pt-8 sm:pt-10 lg:pt-12`}>
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
