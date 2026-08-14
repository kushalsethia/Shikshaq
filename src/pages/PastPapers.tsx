import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, FlaskConical, Languages, Calculator, Brain, Landmark as LandmarkIcon, Dna, Monitor, Wallet, FileText, Search, ShieldCheck, Users } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { SearchControl } from '@/components/SearchControl';
import { Footer } from '@/components/Footer';
import { PaperCard } from '@/components/PaperCard';
import { usePageMeta } from '@/hooks/usePageMeta';
import { supabase } from '@/integrations/supabase/client';
import { SUBJECTS, CLASSES, BOARDS } from '@/utils/searchFacets';

interface Paper {
  id: string;
  title: string;
  school: string;
  subject: string;
  class: string;
  board: string;
  exam_type: string;
  year: number;
  file_url: string | null;
  created_at: string;
}

interface SchoolStat {
  school: string;
  board: string;
  count: number;
}

const PAPER_CLASSES = CLASSES.filter((c) => c !== 'UG');

const SUBJECT_ICON: Record<string, typeof BookOpen> = {
  Chemistry: FlaskConical, Hindi: Languages, English: BookOpen, Maths: Calculator,
  Mathematics: Calculator, Psychology: Brain, Economics: Wallet, Biology: Dna,
  Computers: Monitor, Computer: Monitor, Accounts: LandmarkIcon,
};
const SUBJECT_TINTS = [
  { tint: '#FFF4E8', solid: '#FF8000' },
  { tint: '#EDEEFF', solid: '#4351FF' },
  { tint: '#E6F4E6', solid: '#228B22' },
  { tint: '#FCE8E8', solid: '#C0392B' },
];

const PAPER_STEPS = [
  { n: '01', icon: Search, title: 'Find the paper', body: 'Search by school, subject, class or board, or browse the sections below.' },
  { n: '02', icon: FileText, title: 'Read it here', body: 'Papers open right in the browser. No download, no app, no print.' },
  { n: '03', icon: ShieldCheck, title: "It's free, always", body: "Shared by students, for students. We don't charge for a single page." },
];

const PAPER_PROMISES = [
  { icon: FileText, title: 'Nothing to download', body: 'Every paper reads in the browser. No PDFs cluttering your downloads folder.' },
  { icon: Users, title: 'Shared by students', body: "The collection grows as students who've sat these exams share their papers." },
  { icon: ShieldCheck, title: 'Removed on request', body: 'Any school that wants a paper taken down can have it removed, no argument.' },
];

// A paper counts as "new" for the Recently added stickers when it was added
// within the last week — factual, derived from created_at, never marketing copy.
function isNewThisWeek(createdAt: string): boolean {
  const ageMs = Date.now() - new Date(createdAt).getTime();
  return ageMs >= 0 && ageMs <= 7 * 24 * 60 * 60 * 1000;
}

export default function PastPapers() {
  usePageMeta(
    'Past Year Question Papers (PYQs) for CBSE, ICSE and State Board | Shikshaq',
    'Download free past year question papers and previous year solved papers for CBSE, ICSE, ISC and West Bengal State Board exams. Practice PYQs by subject and class.'
  );

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [schoolStats, setSchoolStats] = useState<SchoolStat[]>([]);
  const [recentPapers, setRecentPapers] = useState<Paper[]>([]);
  const [subjectCounts, setSubjectCounts] = useState<Record<string, number>>({});
  const [totalPapers, setTotalPapers] = useState<number | null>(null);

  // The old /past-papers route used to render results inline; that's now the
  // dedicated /past-papers/results route (see PaperResults.tsx). SearchControl,
  // Browse's mode-handoff, and a couple of older internal links still commit to
  // /past-papers with filter/q params attached (they're outside this task's
  // edit scope), so this redirect keeps them working instead of silently
  // stranding those params on the landing page.
  const hasFilters = searchParams.toString().length > 0;

  // Landing-page data: schools, recent papers, subject counts, total
  useEffect(() => {
    if (hasFilters) return;
    async function fetchLanding() {
      const [schoolsRes, recentRes, subjectsRes, countRes] = await Promise.all([
        supabase.from('papers').select('school,board').eq('is_published', true),
        supabase.from('papers').select('id,title,school,subject,class,board,exam_type,year,file_url,created_at').eq('is_published', true).order('created_at', { ascending: false }).limit(6),
        supabase.from('papers').select('subject').eq('is_published', true),
        supabase.from('papers').select('id', { count: 'exact', head: true }).eq('is_published', true),
      ]);

      if (schoolsRes.data) {
        const bySchool = new Map<string, Map<string, number>>();
        schoolsRes.data.forEach((p) => {
          const boards = bySchool.get(p.school) ?? new Map<string, number>();
          boards.set(p.board, (boards.get(p.board) || 0) + 1);
          bySchool.set(p.school, boards);
        });
        const stats: SchoolStat[] = Array.from(bySchool.entries()).map(([school, boards]) => {
          let dominantBoard = '';
          let dominantCount = 0;
          let total = 0;
          boards.forEach((count, board) => {
            total += count;
            if (count > dominantCount) { dominantCount = count; dominantBoard = board; }
          });
          return { school, board: dominantBoard, count: total };
        }).sort((a, b) => a.school.localeCompare(b.school));
        setSchoolStats(stats);
      }
      if (recentRes.data) setRecentPapers(recentRes.data);
      if (subjectsRes.data) {
        const counts: Record<string, number> = {};
        subjectsRes.data.forEach((p) => { counts[p.subject] = (counts[p.subject] || 0) + 1; });
        setSubjectCounts(counts);
      }
      setTotalPapers(countRes.count ?? 0);
    }
    fetchLanding();
  }, [hasFilters]);

  // The search bar's Teachers/Papers toggle doubles as the page-mode switch.
  const handleSearchModeChange = (mode: 'teachers' | 'papers') => {
    if (mode !== 'teachers') return;
    navigate('/all-tuition-teachers-in-kolkata');
  };

  const featuredSubjects = SUBJECTS.filter((s) => subjectCounts[s]).slice(0, 8);

  if (hasFilters) {
    return <Navigate to={`/past-papers/results?${searchParams.toString()}`} replace />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9F5F1' }} className="flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(32px,5vw,56px) clamp(16px,3vw,28px) 40px' }}>
            <span style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 999, background: '#EDEEFF', color: '#2E3AD6', fontSize: 11.5, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase' }}>
              Free community resource
            </span>
            <h1 style={{ marginTop: 20, maxWidth: 920, fontSize: 'clamp(31px,5.2vw,60px)', lineHeight: 0.95, letterSpacing: '-.055em', fontWeight: 400 }}>
              Past papers from <span style={{ fontWeight: 800 }}>Kolkata schools</span>, shared by students, <span style={{ fontWeight: 800 }}>for students</span>.
            </h1>
            <p style={{ marginTop: 22, maxWidth: 600, fontSize: 17, lineHeight: 1.55, color: '#7B736B' }}>
              Real question papers set by real schools. Nothing to pay for, nothing to download, nothing hidden.
            </p>
            <div style={{ maxWidth: 820, marginTop: 28 }}>
              <SearchControl align="flex-start" stackedToggle initialMode="papers" onModeChange={handleSearchModeChange} />
            </div>
            {totalPapers != null && totalPapers > 0 && (
              <button
                onClick={() => navigate('/past-papers/results?view=all')}
                className="shikshaq-text-link"
                style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, marginTop: 18, fontSize: 15, fontWeight: 600, color: '#2E3AD6', transition: 'opacity .15s ease, transform .15s ease-out' }}
              >
                Browse all {totalPapers.toLocaleString('en-IN')} paper{totalPapers === 1 ? '' : 's'} →
              </button>
            )}
          </div>

          {schoolStats.length > 0 && (
            <div style={{ background: '#4351FF', borderRadius: 32, margin: '0 clamp(16px,3vw,28px)', padding: 'clamp(32px,4vw,52px) 0' }}>
              <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px,3vw,28px)' }}>
                <h2 style={{ fontSize: 'clamp(23px,3vw,34px)', lineHeight: 1, color: '#fff', fontWeight: 700, marginBottom: 24 }}>By school</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 16 }}>
                  {schoolStats.map(({ school, board, count }) => (
                    <button
                      key={school}
                      onClick={() => navigate(`/past-papers/results?filter_schools=${encodeURIComponent(school)}`)}
                      className="shikshaq-school-tile shikshaq-tap"
                      style={{ display: 'block', padding: 22, borderRadius: 18, background: '#FCFAF7', textAlign: 'left', transition: 'transform .2s ease, box-shadow .2s ease' }}
                    >
                      <span style={{ display: 'block', fontSize: 18, fontWeight: 600, letterSpacing: '-.03em', lineHeight: 1.2 }}>{school}</span>
                      <span style={{ display: 'block', marginTop: 9, fontSize: 13, color: '#7B736B' }}>
                        {board} · {count} paper{count === 1 ? '' : 's'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {featuredSubjects.length > 0 && (
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(32px,5vw,56px) clamp(16px,3vw,28px)' }}>
              <h2 style={{ fontSize: 'clamp(23px,3vw,34px)', lineHeight: 1, fontWeight: 700, marginBottom: 22 }}>By subject</h2>
              <div className="shikshaq-papers-subject-grid">
                {featuredSubjects.map((s, i) => {
                  const tint = SUBJECT_TINTS[i % SUBJECT_TINTS.length];
                  const Icon = SUBJECT_ICON[s] || BookOpen;
                  return (
                    <button
                      key={s}
                      onClick={() => navigate(`/past-papers/results?filter_subjects=${encodeURIComponent(s)}`)}
                      className="shikshaq-subject-tile shikshaq-tap"
                      style={{ display: 'block', padding: 22, borderRadius: 20, background: tint.tint, textAlign: 'left', transition: 'transform .2s ease, box-shadow .2s ease' }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: 13, background: tint.solid, marginBottom: 26 }}>
                        <Icon size={21} color="#fff" strokeWidth={1.9} />
                      </span>
                      <span style={{ display: 'block', fontSize: 23, fontWeight: 700, letterSpacing: '-.04em' }}>{s}</span>
                      <span style={{ display: 'block', marginTop: 5, fontSize: 13, fontWeight: 500, color: 'rgba(31,31,31,.55)' }}>
                        {subjectCounts[s]} paper{subjectCounts[s] === 1 ? '' : 's'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ background: '#FF8000', borderRadius: 32, margin: '0 clamp(16px,3vw,28px)', padding: 'clamp(32px,4vw,52px) 0' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px,3vw,28px)' }}>
              {/* Rules #9: orange never carries white text, so this heading is dark
                  even though the prototype's spec copy called it a white h2. */}
              <h2 style={{ fontSize: 'clamp(23px,3vw,34px)', lineHeight: 1, color: '#1F1F1F', fontWeight: 700, marginBottom: 24 }}>By class &amp; board</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {PAPER_CLASSES.map((c) => (
                  <button
                    key={`class-${c}`}
                    onClick={() => navigate(`/past-papers/results?filter_classes=${encodeURIComponent(c)}`)}
                    className="shikshaq-tap"
                    style={{ minHeight: 44, padding: '13px 22px', borderRadius: 999, fontSize: 15, fontWeight: 600, background: '#FCFAF7', color: '#1F1F1F' }}
                  >
                    Class {c}
                  </button>
                ))}
                {BOARDS.map((b) => (
                  <button
                    key={`board-${b}`}
                    onClick={() => navigate(`/past-papers/results?filter_boards=${encodeURIComponent(b)}`)}
                    className="shikshaq-tap"
                    style={{ minHeight: 44, padding: '13px 22px', borderRadius: 999, fontSize: 15, fontWeight: 600, background: '#EDEEFF', color: '#2E3AD6' }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {recentPapers.length > 0 && (
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(32px,5vw,56px) clamp(16px,3vw,28px)' }}>
              <h2 style={{ fontSize: 'clamp(23px,3vw,34px)', lineHeight: 1, fontWeight: 700, marginBottom: 20 }}>Recently added</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 18 }}>
                {recentPapers.map((p) => (
                  <PaperCard key={p.id} paper={p} variant="recent" sticker={isNewThisWeek(p.created_at) ? 'New this week' : undefined} />
                ))}
              </div>
            </div>
          )}

          {/* 3 steps */}
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(32px,5vw,56px) clamp(16px,3vw,28px)' }}>
            <h2 style={{ fontSize: 'clamp(23px,3vw,34px)', lineHeight: 1, fontWeight: 700, textAlign: 'center', marginBottom: 'clamp(26px,3vw,40px)' }}>
              Three steps, no cost,<br />no catch.
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 'clamp(20px,3vw,32px)' }}>
              {PAPER_STEPS.map((step) => (
                <div key={step.n}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 46, height: 46, flex: 'none', borderRadius: 999, background: '#228B22', color: '#fff', fontSize: 17, fontWeight: 700 }}>{step.n}</span>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 'clamp(18px,1.9vw,20px)', fontWeight: 600 }}>
                      <step.icon size={18} color="#228B22" strokeWidth={2} />
                      {step.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: '#666', maxWidth: '44ch' }}>{step.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Promises */}
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px,3vw,28px) clamp(32px,4vw,52px)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 'clamp(14px,2vw,18px)' }}>
              {PAPER_PROMISES.map((pp) => (
                <div key={pp.title} style={{ padding: 'clamp(22px,2.6vw,28px)', borderRadius: 22, background: '#FCFAF7', boxShadow: '0 0 0 1px rgba(0,0,0,.06),0 2px 4px rgba(0,0,0,.04)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 12, background: '#F0EAE2', marginBottom: 14 }}>
                    <pp.icon size={19} color="#1F1F1F" strokeWidth={1.8} />
                  </span>
                  <h3 style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.03em', marginBottom: 10 }}>{pp.title}</h3>
                  <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#7B736B' }}>{pp.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ownership */}
          <div style={{ background: '#F0EAE2', borderRadius: 32, margin: '0 clamp(16px,3vw,28px) 40px', padding: 'clamp(32px,4vw,48px) 0' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px,3vw,28px)' }}>
              <div style={{ maxWidth: 660 }}>
                <h2 style={{ fontSize: 28, lineHeight: 1.1, fontWeight: 700, marginBottom: 16 }}>Who owns these papers</h2>
                <p style={{ fontSize: 16, lineHeight: 1.65, color: '#4A443E', marginBottom: 14 }}>
                  Every paper here is the property of the school that set it. Shikshaq claims no ownership over any paper, derives no revenue from any paper, and hosts these materials solely as a free community resource for students.
                </p>
                <p style={{ fontSize: 16, lineHeight: 1.65, color: '#4A443E' }}>
                  Any school that wishes a paper removed can have it removed on request, without argument.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* These tiles/cards/chips declared transitions but had nothing hover-driven
          to transition to on a desktop pointer — same gap fixed on the Home page's
          equivalent subject tiles. */}
      <style>{`
        @media (hover: hover) {
          .shikshaq-text-link:hover { opacity: 0.7; }
          .shikshaq-school-tile:hover,
          .shikshaq-subject-tile:hover { transform: translateY(-3px); box-shadow: 0 10px 22px rgba(0,0,0,.08); }
        }

        /* By-subject tile grid — a single minmax(210px,1fr) auto-fill column collapsed to one
           oversized full-width tile on narrow phones (lots of dead space next to a short
           subject name + count). Explicit 2/3-column steps below tablet width match the same
           pattern already used for the homepage subject grid and the Teachers page card grid;
           auto-fill takes back over once there's room for a real 210px column. */
        .shikshaq-papers-subject-grid {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 480px) {
          .shikshaq-papers-subject-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
        }
        @media (min-width: 768px) {
          .shikshaq-papers-subject-grid {
            grid-template-columns: repeat(auto-fill, minmax(210px,1fr));
          }
        }
      `}</style>
    </div>
  );
}
