import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Settings, LogOut, ShieldCheck, X, Heart } from 'lucide-react';
import { BentoStack, BentoPanel } from '@/components/layout/PageContainer';
import { useAuth } from '@/lib/auth-context';
import { useLikes } from '@/lib/likes-context';
import { useRequireRole } from '@/hooks/use-require-role';
import { supabase } from '@/integrations/supabase/client';
import { getTeachersByIds, getShikshaqmineBasicBySlugs } from '@/lib/teachers';
import { TeacherCard } from '@/components/TeacherCard';
import { PaperCard, type PaperCardPaper } from '@/components/PaperCard';
import { GoalRing } from '@/components/papers/goal-ring';
import { Button } from '@/components/ui/button';
import { ListLoading, ListError, ListEnd } from '@/components/ui/list-states';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { readAllContacts } from '@/lib/contact-record';
import { EyesPanel } from '@/components/home/EyesPanel';
import { useSentenceBuilder } from '@/hooks/useSentenceBuilder';
import { useChromeConfig } from '@/components/layout/AppShell';

type TabKey = 'saved' | 'contacted' | 'papers';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'saved', label: 'Saved' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'papers', label: 'Papers' },
];

interface RowTeacher {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  subjects: { name: string; slug: string } | null;
  sirMaam?: string | null;
  whatsappLink?: string | null;
}

interface ContactedTeacher extends RowTeacher {
  contactedAt: number;
}

interface ReadPaper {
  read_at: string;
  paper: PaperCardPaper;
}

function timeAgo(ts: number): string {
  const diffMs = Date.now() - ts;
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return '1 week ago';
  if (weeks < 5) return `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  return months <= 1 ? '1 month ago' : `${months} months ago`;
}

/** Thin swipe-to-remove wrapper: drags the row left past a threshold, then
 * calls onRemove. Optimistic — the caller is expected to update its own
 * state/context synchronously, this component only owns the gesture. */
function SwipeToRemove({
  onRemove,
  children,
}: {
  onRemove: () => void;
  children: React.ReactNode;
}) {
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);

  const THRESHOLD = -88;

  const onPointerDown = (e: React.PointerEvent) => {
    setStartX(e.clientX);
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (startX == null) return;
    const delta = Math.min(0, e.clientX - startX);
    setDragX(delta);
  };
  const endDrag = () => {
    setDragging(false);
    setStartX(null);
    if (dragX < THRESHOLD) {
      onRemove();
    }
    setDragX(0);
  };

  return (
    // Radius matches TeacherCard's own `row` frame (rounded-[24px]) exactly —
    // this wrapper's only job is to clip the reveal panel during the drag, and
    // a smaller radius here (rounded-2xl/16px) was clipping the card's own
    // 24px corners into a visibly tighter curve than every other row card on
    // the page (make-interfaces-feel-better: concentric radius).
    <div className="relative overflow-hidden rounded-[24px]">
      <div className="absolute inset-y-0 right-0 flex w-20 items-center justify-center bg-destructive text-destructive-foreground">
        <X className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
      </div>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{
          transform: `translateX(${dragX}px)`,
          transition: dragging ? 'none' : 'transform 200ms var(--ease-settle, ease-out)',
          touchAction: 'pan-y',
        }}
        className="relative bg-background"
      >
        {children}
      </div>
    </div>
  );
}

interface FullProfile {
  role: 'student' | 'guardian' | 'teacher' | null;
  full_name: string | null;
  email: string | null;
  grade: string | null;
  student_grade: string | null;
}

export default function Account() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { likedTeacherIds, likedCount, loading: likesLoading, toggleLike } = useLikes();

  useRequireRole();

  // Handoff AC-007: this route renders its own eyes panel, replacing
  // AppShell's default pre-footer.
  useChromeConfig({ preFooter: 'none' });
  const {
    builderMode, setBuilderMode, slots: builderSlots, onSlotChange: handleSlotChange, onSubmit: handleBuilderSubmit,
  } = useSentenceBuilder();

  // AuthProvider's UserProfile is a lean {role, full_name} slice; the header's
  // "Student · Class 10" meta needs the class/grade fields too, which live only
  // on the full profiles row (StudentDashboard.tsx / GuardianDashboard.tsx both
  // fetch it the same way).
  const [profile, setProfile] = useState<FullProfile | null>(null);
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('role, full_name, email, grade, student_grade')
        .eq('id', user.id)
        .maybeSingle();
      if (data) setProfile(data as FullProfile);
    }
    fetchProfile();
  }, [user]);

  const paramTab = searchParams.get('tab') as TabKey | null;
  const defaultTab: TabKey = profile?.role === 'guardian' ? 'contacted' : 'saved';
  const activeTab: TabKey = paramTab && TABS.some((t) => t.key === paramTab) ? paramTab : defaultTab;

  const setTab = (tab: TabKey) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', tab);
    setSearchParams(next, { replace: false });
  };

  useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  // ---------------------------------------------------------------- Saved
  const [savedTeachers, setSavedTeachers] = useState<RowTeacher[]>([]);
  const [savedLoading, setSavedLoading] = useState(true);
  const [savedError, setSavedError] = useState(false);

  useEffect(() => {
    async function fetchSaved() {
      if (likesLoading) return;
      if (likedTeacherIds.size === 0) {
        setSavedTeachers([]);
        setSavedLoading(false);
        setSavedError(false);
        return;
      }
      setSavedLoading(true);
      setSavedError(false);
      try {
        const teachers = await getTeachersByIds(Array.from(likedTeacherIds));
        setSavedTeachers(teachers);
      } catch {
        setSavedError(true);
      } finally {
        setSavedLoading(false);
      }
    }
    fetchSaved();
  }, [likedTeacherIds, likesLoading]);

  // ------------------------------------------------------------- Contacted
  // Contacted tracking has no server table yet (O-04 — no whatsapp_clicks /
  // enquiries table reachable from the student side). contact-record.ts is a
  // device-local, best-effort log of WhatsApp taps this browser made; it is
  // the only real signal available, so it powers this tab as a pragmatic v1.
  const [contactedTeachers, setContactedTeachers] = useState<ContactedTeacher[]>([]);
  const [contactedLoading, setContactedLoading] = useState(true);
  const [contactedError, setContactedError] = useState(false);

  useEffect(() => {
    async function fetchContacted() {
      setContactedLoading(true);
      setContactedError(false);
      try {
        const records = readAllContacts();
        if (records.length === 0) {
          setContactedTeachers([]);
          return;
        }
        const slugs = records.map((r) => r.slug);
        const [{ data: rows, error }, basicMap] = await Promise.all([
          supabase
            .from('teachers_list')
            .select('id, name, slug, image_url, subjects(name, slug)')
            .in('slug', slugs),
          getShikshaqmineBasicBySlugs(slugs),
        ]);
        if (error) throw error;

        const bySlug = new Map((rows ?? []).map((r: any) => [r.slug, r]));
        const merged: ContactedTeacher[] = records
          .map((rec) => {
            const row = bySlug.get(rec.slug);
            if (!row) return null;
            const basic = basicMap.get(rec.slug);
            return {
              id: row.id,
              name: row.name,
              slug: row.slug,
              image_url: row.image_url,
              subjects: row.subjects,
              sirMaam: basic?.sirMaam ?? null,
              whatsappLink: basic?.whatsappLink ?? null,
              contactedAt: rec.ts,
            } as ContactedTeacher;
          })
          .filter((t): t is ContactedTeacher => t !== null);

        setContactedTeachers(merged);
      } catch {
        setContactedError(true);
      } finally {
        setContactedLoading(false);
      }
    }
    fetchContacted();
  }, []);

  // ---------------------------------------------------------------- Papers
  const WEEKLY_GOAL = 5;
  const [readPapers, setReadPapers] = useState<ReadPaper[]>([]);
  const [papersLoading, setPapersLoading] = useState(true);
  const [papersError, setPapersError] = useState(false);
  const [readThisWeek, setReadThisWeek] = useState(0);
  const [totalPapersRead, setTotalPapersRead] = useState(0);

  useEffect(() => {
    async function fetchPapers() {
      if (!user) return;
      setPapersLoading(true);
      setPapersError(false);
      try {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const [{ data, error }, weekRes, totalRes] = await Promise.all([
          supabase
            .from('paper_reads')
            .select('read_at, papers(id, title, school, subject, class, board, exam_type, year, file_url)')
            .eq('user_id', user.id)
            .order('read_at', { ascending: false })
            .limit(40),
          supabase
            .from('paper_reads')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('read_at', weekAgo),
          supabase
            .from('paper_reads')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id),
        ]);
        if (error) throw error;

        const mapped: ReadPaper[] = (data ?? [])
          .filter((row: any) => row.papers)
          .map((row: any) => ({ read_at: row.read_at, paper: row.papers as PaperCardPaper }));
        setReadPapers(mapped);
        setReadThisWeek(weekRes.count ?? 0);
        setTotalPapersRead(totalRes.count ?? 0);
      } catch {
        setPapersError(true);
      } finally {
        setPapersLoading(false);
      }
    }
    fetchPapers();
  }, [user]);

  // ---------------------------------------------------------------- Header
  const userEmail = user?.email || profile?.email || '';
  const userName =
    (user?.user_metadata as any)?.full_name ||
    (user?.user_metadata as any)?.name ||
    profile?.full_name ||
    '';
  const initial = (userName || userEmail || '?').trim().charAt(0).toUpperCase() || '?';

  const roleLabel = profile?.role === 'guardian' ? 'Guardian' : profile?.role === 'teacher' ? 'Teacher' : 'Student';
  const subLineParts = useMemo(() => {
    const grade = profile?.role === 'guardian' ? profile?.student_grade : profile?.grade;
    return [roleLabel, grade ? `Class ${grade}` : null].filter(Boolean);
  }, [profile, roleLabel]);

  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleRemoveSaved = (id: string) => {
    toggleLike(id);
    setSavedTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  if (!user) return null;

  const counts: Record<TabKey, number> = {
    saved: likedCount,
    contacted: contactedTeachers.length,
    papers: totalPapersRead,
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
      <BentoStack>
      {/* Handoff AC-002: bone greeting panel — the !rounded-b-[32px] override
          is gone, the panel owns its own radius now. */}
      <BentoPanel fill="card" edge="top" className="pt-[14px] pb-5">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-brand font-display text-[19px] font-black text-brand-foreground">
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-[22px] font-extrabold tracking-[-0.04em] text-foreground">
              {userName || 'Your account'}
            </h1>
            <p className="mt-0.5 truncate text-[14px] text-warm-tertiary">{subLineParts.join(' · ')}</p>
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Open settings"
            className="tap-44 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-muted transition-colors duration-150 hover:bg-accent active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Settings className="h-[17px] w-[17px] text-foreground" strokeWidth={2.1} aria-hidden="true" />
          </button>
        </div>
      </BentoPanel>

      {/* Handoff AC-003: sticky pill row — border-b-2 underline removed, the
          active state is now the fill. role="tablist"/"tab"/aria-selected
          and setTab are unchanged. */}
      <BentoPanel fill="card" className="sticky top-[80px] z-20 isolate !px-0 py-3 pl-4">
        <div role="tablist" aria-label="Account sections" className="flex gap-2 overflow-x-auto pr-4 scrollbar-hide">
          {TABS.map((tab) => {
            const selected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={selected}
                onClick={() => setTab(tab.key)}
                className={`flex h-11 flex-none items-center gap-2 rounded-full px-4 text-[13.5px] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  selected ? 'bg-panel font-bold text-background' : 'bg-muted text-warm-secondary'
                }`}
              >
                {tab.label}
                <span
                  className={`inline-flex h-[20px] min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold tabular-nums ${
                    selected ? 'bg-brand text-brand-foreground' : 'bg-card text-warm-secondary'
                  }`}
                >
                  {counts[tab.key]}
                </span>
              </button>
            );
          })}
        </div>
      </BentoPanel>

      <BentoPanel fill="card" className="px-4 py-[18px]">
        {activeTab === 'saved' && (
          <section>
            {savedLoading && savedTeachers.length === 0 ? (
              <ListLoading count={3} media={0} lines={2} />
            ) : savedError ? (
              <ListError onRetry={() => setSavedTeachers((t) => [...t])} />
            ) : savedTeachers.length > 0 ? (
              <>
                <ul className="flex flex-col gap-2.5">
                  {savedTeachers.map((teacher) => (
                    <li key={teacher.id} className="flex items-center gap-2">
                      <div className="min-w-0 flex-1">
                        <SwipeToRemove onRemove={() => handleRemoveSaved(teacher.id)}>
                          <TeacherCard
                            id={teacher.id}
                            name={teacher.name}
                            slug={teacher.slug}
                            subject={teacher.subjects?.name || 'Tuition Teacher'}
                            subjectSlug={teacher.subjects?.slug}
                            imageUrl={teacher.image_url || undefined}
                            sirMaam={teacher.sirMaam}
                            variant="row"
                            hideFavourite
                          />
                        </SwipeToRemove>
                      </div>
                      {/* Handoff AC-004: the trailing action on this page is
                          the unsave heart, not the WhatsApp disc. */}
                      <button
                        type="button"
                        onClick={() => handleRemoveSaved(teacher.id)}
                        aria-label={`Remove ${teacher.name} from saved`}
                        className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-card transition-transform duration-tap active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <Heart className="h-4 w-4 fill-destructive text-destructive" aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
                <ListEnd count={savedTeachers.length} />
              </>
            ) : (
              /* Handoff AC-005: empty states are their own tinted panel —
                 heading naming the exact empty thing, one line, one action. */
              <BentoPanel fill="brandTint">
                <p className="font-display text-[21px] font-extrabold tracking-[-0.03em] text-brand-deep">Nothing saved yet</p>
                <p className="mt-1.5 text-[14px] leading-[1.55] text-warm-prose">Save a teacher's profile and it shows up here.</p>
                <Button asChild variant="primary" size={52} className="mt-4">
                  <Link to="/all-tuition-teachers-in-kolkata">Browse teachers</Link>
                </Button>
              </BentoPanel>
            )}
          </section>
        )}

        {activeTab === 'contacted' && (
          <section>
            {contactedLoading ? (
              <ListLoading count={3} media={0} lines={2} />
            ) : contactedError ? (
              <ListError onRetry={() => setContactedTeachers((t) => [...t])} />
            ) : contactedTeachers.length > 0 ? (
              <ul className="flex flex-col gap-2.5">
                {contactedTeachers.map((teacher) => (
                  // No card wrapper here — TeacherCard's `row` variant already draws its
                  // own bg-muted/rounded-[24px] frame (S-001). Wrapping it in a second
                  // card would double the frame, which is exactly the "border + shadow
                  // stacked" pattern this redesign rules out. Saved tab's <li> is bare
                  // for the same reason; this now matches it.
                  <li key={teacher.id} className="flex flex-col gap-1.5">
                    <TeacherCard
                      id={teacher.id}
                      name={teacher.name}
                      slug={teacher.slug}
                      subject={teacher.subjects?.name || 'Tuition Teacher'}
                      subjectSlug={teacher.subjects?.slug}
                      imageUrl={teacher.image_url || undefined}
                      sirMaam={teacher.sirMaam}
                      whatsappLink={teacher.whatsappLink}
                      variant="row"
                    />
                    <p className="px-2.5 text-meta text-warm-meta">
                      Messaged {timeAgo(teacher.contactedAt)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <BentoPanel fill="brandTint">
                <p className="font-display text-[21px] font-extrabold tracking-[-0.03em] text-brand-deep">You haven't messaged anyone yet</p>
                <p className="mt-1.5 text-[14px] leading-[1.55] text-warm-prose">Message a teacher on WhatsApp and they'll show up here.</p>
                <Button asChild variant="primary" size={52} className="mt-4">
                  <Link to="/all-tuition-teachers-in-kolkata">Browse teachers</Link>
                </Button>
              </BentoPanel>
            )}
          </section>
        )}

        {activeTab === 'papers' && (
          <section className="flex flex-col gap-4">
            {user && readThisWeek > 0 && (
              <div className="flex items-center gap-3 rounded-2xl bg-muted p-4">
                <GoalRing value={readThisWeek} goal={WEEKLY_GOAL} size={86} stroke={8} />
                <div>
                  <p className="font-display text-card-title-lg font-extrabold tracking-tight text-foreground">
                    {readThisWeek} of {WEEKLY_GOAL}
                  </p>
                  <p className="text-body-secondary text-muted-foreground">papers this week</p>
                </div>
              </div>
            )}
            {papersLoading ? (
              <ListLoading count={3} media={0} lines={2} />
            ) : papersError ? (
              <ListError onRetry={() => setReadPapers((p) => [...p])} />
            ) : readPapers.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {readPapers.map(({ paper, read_at }) => (
                  <PaperCard key={`${paper.id}-${read_at}`} paper={paper} variant="compact" />
                ))}
              </div>
            ) : (
              <BentoPanel fill="brandTint">
                <p className="font-display text-[21px] font-extrabold tracking-[-0.03em] text-brand-deep">No papers read yet</p>
                <p className="mt-1.5 text-[14px] leading-[1.55] text-warm-prose">Open a past paper and it shows up here.</p>
                <Button asChild variant="primary" size={52} className="mt-4">
                  <Link to="/past-papers">Browse past papers</Link>
                </Button>
              </BentoPanel>
            )}
          </section>
        )}
      </BentoPanel>

      <EyesPanel
        mode={builderMode}
        onModeChange={setBuilderMode}
        heading={(
          <>
            Still deciding? <span className="font-extrabold">We&rsquo;re watching out for you.</span>
          </>
        )}
        subline="Fill in the blanks and we'll take you straight there."
        slots={builderSlots}
        onSlotChange={handleSlotChange}
        onSubmit={handleBuilderSubmit}
      />
      </BentoStack>
      </main>

      {/* Settings sheet — sign-out and account links. Full profile-field
          editing (subjects, address, etc.) stays on the ported dashboards for
          now rather than being rebuilt inline here. */}
      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent side="bottom" className="rounded-t-[28px] border-0 pb-8 pt-6">
          <SheetHeader className="items-start text-left">
            <SheetTitle className="font-display text-xl font-bold tracking-tight text-foreground">
              Settings
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex flex-col gap-1">
            <button
              type="button"
              onClick={() => navigate('/privacy-policy')}
              className="flex min-h-[52px] w-full items-center gap-3 rounded-xl px-2 text-left transition-colors duration-150 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <ShieldCheck className="h-4 w-4 text-warm-label" strokeWidth={2} aria-hidden="true" />
              <span className="flex-1 text-body-secondary font-semibold text-foreground">Privacy &amp; terms</span>
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex min-h-[52px] w-full items-center gap-3 rounded-xl px-2 text-left transition-colors duration-150 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <LogOut className="h-4 w-4 text-destructive" strokeWidth={2} aria-hidden="true" />
              <span className="flex-1 text-body-secondary font-semibold text-destructive">Sign out</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
