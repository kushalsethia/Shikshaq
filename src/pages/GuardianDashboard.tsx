import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { PreFooter, preFooterFor } from '@/components/layout/PreFooter';
import { PageContainer, ControlBlock, BottomNavSpacer } from '@/components/layout/PageContainer';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { getTeachersByIds } from '@/lib/teachers';
import { Footer } from '@/components/Footer';
import { TeacherCard } from '@/components/TeacherCard';
import { ListLoading, ListEmpty } from '@/components/ui/list-states';
import { IconDisc } from '@/components/ui/icon-disc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Save,
  Lock,
  Heart,
  BookOpen,
  UserCog,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLikes } from '@/lib/likes-context';
import { useStudiesWith } from '@/lib/studies-with-context';
import {
  formatDateForDisplay,
  formatDateForDatabase,
  isValidDateFormat,
  formatDateInput,
} from '@/lib/date-helpers';

interface Subject {
  id: string;
  name: string;
  slug: string;
}

interface SavedTeacher {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  subjects: { name: string; slug: string } | null;
  sirMaam?: string | null;
}

interface Profile {
  id: string;
  role: 'student' | 'guardian' | 'teacher';
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  relationship_to_student: string | null;
  student_name: string | null;
  student_date_of_birth: string | null;
  student_age: number | null;
  student_grade: string | null;
  student_school_board: string | null;
}

// Profile form field/label styling, on the token system so the editable form matches the rest
// of the page instead of falling back to shadcn's bare default input styling.
const FIELD_CLASSNAME =
  'h-auto min-h-12 rounded-lg border-0 bg-background text-base shadow-border focus-visible:ring-0 focus-visible:ring-offset-0';
const LOCKED_FIELD_CLASSNAME = `${FIELD_CLASSNAME} cursor-not-allowed opacity-70`;
const LABEL_CLASSNAME = 'mb-1.5 block text-sm font-semibold text-foreground';
const OPTION_GROUP_CLASSNAME = 'rounded-2xl bg-background shadow-border';

// Section-heading pattern (design.md §1): icon tile + name.
function SectionHeading({
  icon,
  children,
  action,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight text-foreground">
        <IconDisc tone="muted" size={26} shape="square">
          {icon}
        </IconDisc>
        {children}
      </h2>
      {action}
    </div>
  );
}

export default function GuardianDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [boards, setBoards] = useState<string[]>([]);
  const [studentSubjects, setStudentSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { likedTeacherIds, likedCount, loading: likesLoading } = useLikes();
  const { studiesWithCount } = useStudiesWith();
  const [savedTeachers, setSavedTeachers] = useState<SavedTeacher[]>([]);
  const [savedTeachersLoading, setSavedTeachersLoading] = useState(true);
  const [savedTeachersError, setSavedTeachersError] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    relationship_to_student: '',
    student_name: '',
    student_date_of_birth: '',
    student_grade: '',
    student_school_board: '',
  });

  // Redirect if not authenticated or not a guardian
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }
    if (!loading && profile && profile.role !== 'guardian') {
      navigate('/');
      return;
    }
  }, [user, profile, loading, navigate]);

  // Fetch profile and subjects
  useEffect(() => {
    async function fetchData() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // These four queries are independent of one another (profile and guardianSubjects are
        // keyed off user.id, subjects and the Shikshaqmine board list are global lookups) so
        // they run concurrently via Promise.all instead of four sequential round-trips.
        const [
          { data: profileData, error: profileError },
          { data: subjectsData },
          { data: shikshaqData },
          { data: guardianSubjectsData },
        ] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase.from('subjects').select('*').order('name'),
          supabase.from('Shikshaqmine').select('"School Boards Catered"'),
          supabase.from('guardian_student_subjects').select('subject_id').eq('guardian_id', user.id),
        ]);

        if (profileError) {
          if (import.meta.env.DEV) {
            console.error('Error fetching profile:', profileError);
          }
          setLoading(false);
          return;
        }

        setProfile(profileData as Profile);

        // Populate form
        if (profileData) {
          setFormData({
            phone: profileData.phone || '',
            address: profileData.address || '',
            relationship_to_student: profileData.relationship_to_student || '',
            student_name: profileData.student_name || '',
            student_date_of_birth: formatDateForDisplay(profileData.student_date_of_birth),
            student_grade: profileData.student_grade || '',
            student_school_board: profileData.student_school_board || '',
          });
        }

        if (subjectsData) {
          setSubjects(subjectsData);
        }

        const boardSet = new Set<string>();
        if (shikshaqData) {
          shikshaqData.forEach((record: any) => {
            const boardsStr = record["School Boards Catered"];
            if (boardsStr) {
              // Split by comma and clean up
              const boardsList = boardsStr.split(',').map((b: string) => b.trim()).filter(Boolean);
              boardsList.forEach((board: string) => {
                if (board && board !== 'College') {
                  boardSet.add(board);
                }
              });
            }
          });
        }

        // Convert to array and sort, or use default list if none found
        const uniqueBoards = boardSet.size > 0
          ? Array.from(boardSet).sort()
          : ['CBSE', 'ICSE', 'IGCSE', 'IB', 'State Board'];
        setBoards(uniqueBoards);

        if (guardianSubjectsData) {
          setStudentSubjects(guardianSubjectsData.map(s => s.subject_id));
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error:', error);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  // Fetch full teacher records for the guardian's saved (liked) teachers
  useEffect(() => {
    async function fetchSavedTeachers() {
      if (likesLoading) return;

      if (likedTeacherIds.size === 0) {
        setSavedTeachers([]);
        setSavedTeachersLoading(false);
        setSavedTeachersError(false);
        return;
      }

      setSavedTeachersError(false);
      try {
        const teacherIds = Array.from(likedTeacherIds);
        const teachersWithSirMaam = await getTeachersByIds(teacherIds);
        setSavedTeachers(teachersWithSirMaam);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching saved teachers:', error);
        }
        setSavedTeachersError(true);
      } finally {
        setSavedTeachersLoading(false);
      }
    }

    fetchSavedTeachers();
  }, [likedTeacherIds, likesLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      // For phone number, only allow numeric characters
      const numericValue = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: numericValue });
    } else if (name === 'student_date_of_birth') {
      // Format date input as dd-mm-yyyy
      const formatted = formatDateInput(value);
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubjectToggle = (subjectId: string) => {
    setStudentSubjects(prev => {
      if (prev.includes(subjectId)) {
        return prev.filter(id => id !== subjectId);
      } else {
        return [...prev, subjectId];
      }
    });
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    // Validate phone number if provided (must be exactly 10 digits)
    if (formData.phone.trim() && formData.phone.trim().length !== 10) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    // Validate date format if provided
    if (formData.student_date_of_birth && !isValidDateFormat(formData.student_date_of_birth)) {
      toast.error('Please enter a valid date in DD-MM-YYYY format (e.g., 15-03-2010)');
      return;
    }

    setSaving(true);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          phone: formData.phone || null,
          address: formData.address || null,
          relationship_to_student: formData.relationship_to_student || null,
          student_name: formData.student_name || null,
          student_date_of_birth: formatDateForDatabase(formData.student_date_of_birth),
          student_grade: formData.student_grade || null,
          student_school_board: formData.student_school_board || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) {
        if (import.meta.env.DEV) {
          console.error('Error updating profile:', profileError);
        }
        toast.error('Failed to update profile');
        setSaving(false);
        return;
      }

      // Update guardian student subjects
      // Delete existing subjects. If this fails, stop here rather than inserting on top of
      // whatever rows are already there (which would create duplicates) and telling the user
      // the save succeeded when the subjects half of it didn't.
      const { error: deleteError } = await supabase
        .from('guardian_student_subjects')
        .delete()
        .eq('guardian_id', user.id);

      if (deleteError) {
        if (import.meta.env.DEV) {
          console.error('Error deleting subjects:', deleteError);
        }
        toast.error('Failed to update subjects');
        setSaving(false);
        return;
      }

      // Insert new subjects
      if (studentSubjects.length > 0) {
        const { error: insertError } = await supabase
          .from('guardian_student_subjects')
          .insert(
            studentSubjects.map(subjectId => ({
              guardian_id: user.id,
              subject_id: subjectId,
            }))
          );

        if (insertError) {
          if (import.meta.env.DEV) {
            console.error('Error inserting subjects:', insertError);
          }
          toast.error('Failed to update subjects');
          setSaving(false);
          return;
        }
      }

      // Refresh profile to get updated age
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (updatedProfile) {
        setProfile(updatedProfile as Profile);
      }

      toast.success('Profile updated successfully');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error saving:', error);
      }
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ControlBlock mode="dark">
          <div className="flex animate-pulse items-center gap-[14px]">
            <div className="h-14 w-14 flex-none rounded-full bg-white/10" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-40 rounded-full bg-white/10" />
              <div className="h-3 w-28 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="mt-[18px] grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-[70px] rounded-2xl bg-white/[0.08]" />
            ))}
          </div>
        </ControlBlock>
        <PageContainer as="main" className="pt-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-muted" />
            ))}
          </div>
        </PageContainer>
        <BottomNavSpacer />
        <PreFooter variant={preFooterFor(location.pathname)} />
        <Footer />
      </div>
    );
  }

  if (!profile || profile.role !== 'guardian') {
    return (
      <div className="min-h-screen bg-background">
        <main className="container py-16 pb-16 text-center sm:py-20">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {user ? 'Guardian account required' : 'Sign in required'}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {user
              ? 'This dashboard is only available to guardian accounts.'
              : 'Please sign in to view your dashboard.'}
          </p>
          <Button className="mt-6" onClick={() => navigate(user ? '/' : '/auth')}>
            {user ? 'Go Home' : 'Sign In'}
          </Button>
        </main>
        <PreFooter variant={preFooterFor(location.pathname)} />
        <Footer />
      </div>
    );
  }

  // Get user email and name from auth (locked fields)
  const userEmail = user?.email || profile.email || '';
  const userName = user?.user_metadata?.full_name ||
                   user?.user_metadata?.name ||
                   profile.full_name ||
                   '';
  const firstName = userName.split(' ')[0] || 'there';
  const avatarInitial = (userName.trim()[0] || firstName[0] || 'G').toUpperCase();

  const subLineParts = [
    'Guardian',
    profile.student_grade ? `Class ${profile.student_grade}` : null,
    profile.address || null,
  ].filter(Boolean);

  // Three real counters, C9 StatCard pattern (components.md), header row on the dark control
  // block. Every value is a real query result — never fabricated (design.md §0.10).
  const dashboardStats = [
    { label: 'study with', value: studiesWithCount },
    { label: 'saved', value: likedCount },
    { label: 'subjects', value: studentSubjects.length },
  ];

  const SAVED_TEACHERS_SHOWN = 6;
  const shownSavedTeachers = savedTeachers.slice(0, SAVED_TEACHERS_SHOWN);
  const hasMoreSavedTeachers = likedCount > shownSavedTeachers.length;

  // Profile-completeness bar — plain bar, never GoalRing (that device is reserved for the
  // weekly paper goal only). Derived from already-loaded form state, no new fetching.
  const completenessChecks = [
    Boolean(formData.phone),
    Boolean(formData.address),
    Boolean(formData.relationship_to_student),
    Boolean(formData.student_name),
    Boolean(formData.student_date_of_birth),
    Boolean(formData.student_grade),
    Boolean(formData.student_school_board),
    studentSubjects.length > 0,
  ];
  const completenessFilled = completenessChecks.filter(Boolean).length;
  const completenessTotal = completenessChecks.length;
  const completenessPct = Math.round((completenessFilled / completenessTotal) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Control block — S9 dark header: avatar, name, role/class/locality, three counters */}
      <ControlBlock mode="dark">
        <div className="flex items-center gap-[14px]">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-brand font-display text-[22px] font-black text-brand-foreground"
          >
            {avatarInitial}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-[22px] font-black tracking-tight text-background">
              Hi, {firstName}
            </div>
            <div className="mt-0.5 truncate text-[13px] text-background/60">
              {subLineParts.join(' · ')}
            </div>
          </div>
        </div>

        {/* C9 StatCard trio */}
        <div className="mt-[18px] grid grid-cols-3 gap-2">
          {dashboardStats.map((st) => (
            <div key={st.label} className="rounded-2xl bg-white/[0.08] p-3">
              <div className="font-display text-[22px] font-black tracking-tight text-background tabular-nums">
                {st.value}
              </div>
              <div className="mt-0.5 whitespace-nowrap text-[11.5px] text-background/60">
                teachers {st.label}
              </div>
            </div>
          ))}
        </div>
      </ControlBlock>

      <PageContainer as="main" className="flex flex-col gap-6 pt-6">
        {/* Saved teachers */}
        <section>
          <SectionHeading
            icon={<Heart className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
            action={
              hasMoreSavedTeachers ? (
                <Link
                  to="/liked-teachers"
                  className="whitespace-nowrap text-sm font-semibold text-brand-blue transition-colors duration-150 hover:text-brand-blue-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  All {likedCount}
                </Link>
              ) : undefined
            }
          >
            Teachers you saved
          </SectionHeading>

          {savedTeachersLoading ? (
            <ListLoading count={3} media={44} lines={2} />
          ) : shownSavedTeachers.length > 0 ? (
            <div className="flex flex-col gap-2">
              {shownSavedTeachers.map((teacher) => (
                <TeacherCard
                  key={teacher.id}
                  id={teacher.id}
                  name={teacher.name}
                  slug={teacher.slug}
                  subject={teacher.subjects?.name || 'Tuition Teacher'}
                  subjectSlug={teacher.subjects?.slug}
                  imageUrl={teacher.image_url || undefined}
                  sirMaam={teacher.sirMaam}
                  variant="row"
                />
              ))}
            </div>
          ) : (
            <ListEmpty line="No saved teachers yet. Tap the mark on any card and they wait for you here." />
          )}
        </section>

        {/* Recently opened papers — no reading-history backend exists yet (mirrors
            StudentDashboard.tsx: no reader progress table), so this stays an honest empty
            state rather than a fabricated list or count. */}
        <section>
          <SectionHeading icon={<BookOpen className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}>
            Recently opened papers
          </SectionHeading>
          <ListEmpty line="No papers read yet. Pick one from your class and it lands on your shelf." />
        </section>

        {/* Profile completeness — plain bar (never GoalRing outside the weekly paper goal) */}
        <section>
          <SectionHeading icon={<ShieldCheck className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}>
            Profile completeness
          </SectionHeading>
          <div className="rounded-2xl bg-card p-4 shadow-border sm:p-[18px]">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-foreground">
                {completenessFilled}/{completenessTotal} fields
              </span>
              <span className="text-sm font-extrabold tabular-nums text-foreground">{completenessPct}%</span>
            </div>
            <div className="relative mt-2 h-[6px] rounded-full bg-muted">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-brand transition-[width] duration-300 ease-out"
                style={{ width: `${completenessPct}%` }}
              />
            </div>
            <p className="mt-2.5 text-[12.5px] text-muted-foreground">
              Fill in the student's details and subjects below so teachers can be matched to them.
            </p>
          </div>
        </section>

        {/* Account settings list — settings-list idiom from S9. Each row is the guardian's own
            profile fields, or the multi-field student form, opened as an accordion so all of the
            original machinery (validation, subject toggles, save) survives without a second route. */}
        <section>
          <SectionHeading icon={<UserCog className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}>
            Account
          </SectionHeading>

          <div className="rounded-[20px] bg-card shadow-border">
            <Accordion type="multiple" className="w-full">
              {/* Locked account info row */}
              <AccordionItem value="account-info" className="border-b border-border/60 px-4 last:border-b-0">
                <AccordionTrigger className="min-h-[44px] gap-3 py-[14px] text-left hover:no-underline">
                  <span className="flex flex-1 items-center gap-3">
                    <IconDisc tone="muted" size={36} shape="square">
                      <Lock className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    </IconDisc>
                    <span className="text-[14.5px] font-semibold text-foreground">Account information</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="accountName" className={LABEL_CLASSNAME}>Name</Label>
                      <Input id="accountName" value={userName} disabled className={LOCKED_FIELD_CLASSNAME} />
                      <p className="text-xs text-muted-foreground">Imported from Google Auth</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountEmail" className={LABEL_CLASSNAME}>Email</Label>
                      <Input id="accountEmail" value={userEmail} disabled className={LOCKED_FIELD_CLASSNAME} />
                      <p className="text-xs text-muted-foreground">Imported from Google Auth</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Guardian information row */}
              <AccordionItem value="guardian-info" className="border-b border-border/60 px-4 last:border-b-0">
                <AccordionTrigger className="min-h-[44px] gap-3 py-[14px] text-left hover:no-underline">
                  <span className="flex flex-1 items-center gap-3">
                    <IconDisc tone="muted" size={36} shape="square">
                      <UserCog className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    </IconDisc>
                    <span className="text-[14.5px] font-semibold text-foreground">Guardian information</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className={LABEL_CLASSNAME}>Phone Number (Optional)</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="10-digit phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        maxLength={10}
                        inputMode="numeric"
                        className={FIELD_CLASSNAME}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={LABEL_CLASSNAME}>Relationship to Student (Optional)</Label>
                      {/* Segmented pill toggle — 4 fixed options. Tap the active pill again to clear. */}
                      <div className="flex flex-wrap gap-2" role="group" aria-label="Relationship to student">
                        {[
                          { value: 'parent', label: 'Parent' },
                          { value: 'sister/brother', label: 'Sister/Brother' },
                          { value: 'grandparent', label: 'Grandparent' },
                          { value: 'other', label: 'Other' },
                        ].map((option) => {
                          const selected = formData.relationship_to_student === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              aria-pressed={selected}
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  relationship_to_student: selected ? '' : option.value,
                                })
                              }
                              className={`min-h-11 rounded-full px-4 text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                                selected
                                  ? 'bg-brand-blue text-brand-blue-foreground'
                                  : 'bg-muted text-foreground hover:bg-accent'
                              }`}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className={LABEL_CLASSNAME}>Address (Optional)</Label>
                      <Textarea
                        id="address"
                        name="address"
                        placeholder="Enter your address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className={`${FIELD_CLASSNAME} min-h-[88px] py-3`}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Student details + subjects row — the guardian-specific machinery, kept intact
                  and restyled into the settings-list idiom rather than dropped. */}
              <AccordionItem value="student-details" className="px-4">
                <AccordionTrigger className="min-h-[44px] gap-3 py-[14px] text-left hover:no-underline">
                  <span className="flex flex-1 items-center gap-3">
                    <IconDisc tone="muted" size={36} shape="square">
                      <GraduationCap className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    </IconDisc>
                    <span className="text-[14.5px] font-semibold text-foreground">Student details &amp; subjects</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="student_name" className={LABEL_CLASSNAME}>Student Name (Optional)</Label>
                      <Input
                        id="student_name"
                        name="student_name"
                        type="text"
                        placeholder="Enter student's name"
                        value={formData.student_name}
                        onChange={handleInputChange}
                        className={FIELD_CLASSNAME}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="student_date_of_birth" className={LABEL_CLASSNAME}>Student Date of Birth (Optional)</Label>
                      <Input
                        id="student_date_of_birth"
                        name="student_date_of_birth"
                        type="text"
                        placeholder="DD-MM-YYYY (e.g., 15-03-2010)"
                        value={formData.student_date_of_birth}
                        onChange={handleInputChange}
                        maxLength={10}
                        className={`w-full ${FIELD_CLASSNAME}`}
                      />
                      {formData.student_date_of_birth && !isValidDateFormat(formData.student_date_of_birth) && (
                        <p className="text-sm text-destructive">Please enter a valid date in DD-MM-YYYY format</p>
                      )}
                      {profile.student_age && (
                        <p className="text-xs text-muted-foreground">Age: {profile.student_age} years</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="student_grade" className={LABEL_CLASSNAME}>Student Class/Grade (Optional)</Label>
                      <Select
                        value={formData.student_grade || "__none__"}
                        onValueChange={(value) => setFormData({ ...formData, student_grade: value === "__none__" ? "" : value })}
                      >
                        <SelectTrigger id="student_grade" className={FIELD_CLASSNAME}>
                          <SelectValue placeholder="Select class/grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">None</SelectItem>
                          <SelectItem value="1">Class 1</SelectItem>
                          <SelectItem value="2">Class 2</SelectItem>
                          <SelectItem value="3">Class 3</SelectItem>
                          <SelectItem value="4">Class 4</SelectItem>
                          <SelectItem value="5">Class 5</SelectItem>
                          <SelectItem value="6">Class 6</SelectItem>
                          <SelectItem value="7">Class 7</SelectItem>
                          <SelectItem value="8">Class 8</SelectItem>
                          <SelectItem value="9">Class 9</SelectItem>
                          <SelectItem value="10">Class 10</SelectItem>
                          <SelectItem value="11">Class 11</SelectItem>
                          <SelectItem value="12">Class 12</SelectItem>
                          <SelectItem value="1st year">1st Year</SelectItem>
                          <SelectItem value="2nd year">2nd Year</SelectItem>
                          <SelectItem value="3rd year">3rd Year</SelectItem>
                          <SelectItem value="4th year">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="student_school_board" className={LABEL_CLASSNAME}>Student School Board (Optional)</Label>
                      <Select
                        value={formData.student_school_board || "__none__"}
                        onValueChange={(value) => setFormData({ ...formData, student_school_board: value === "__none__" ? "" : value })}
                      >
                        <SelectTrigger id="student_school_board" className={FIELD_CLASSNAME}>
                          <SelectValue placeholder="Select school board" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">None</SelectItem>
                          {boards.map((board) => (
                            <SelectItem key={board} value={board}>
                              {board}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Subjects Selection */}
                  <div className="space-y-3 border-t border-border pt-4 mt-4">
                    <Label className={LABEL_CLASSNAME}>Subjects Interested In (Optional)</Label>
                    <div
                      className={`grid max-h-64 grid-cols-2 gap-3 overflow-y-auto p-4 md:grid-cols-3 lg:grid-cols-4 ${OPTION_GROUP_CLASSNAME}`}
                    >
                      {subjects.map((subject) => (
                        <div key={subject.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`subject-${subject.id}`}
                            checked={studentSubjects.includes(subject.id)}
                            onCheckedChange={() => handleSubjectToggle(subject.id)}
                          />
                          <Label
                            htmlFor={`subject-${subject.id}`}
                            className="cursor-pointer text-sm font-normal text-warm-prose"
                          >
                            {subject.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {subjects.length === 0 && (
                      <p className="text-sm text-warm-meta">No subjects available</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Save Button — pinned below the accordion so it saves whichever section is open */}
            <div className="border-t border-border p-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                variant="primary"
                size={46}
                className="w-full gap-2 md:w-auto"
              >
                <Save className="h-4 w-4" aria-hidden="true" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </section>
      </PageContainer>

      <BottomNavSpacer />
      <PreFooter variant={preFooterFor(location.pathname)} />
      <Footer />
    </div>
  );
}
