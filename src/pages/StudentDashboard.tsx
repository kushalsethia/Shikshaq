import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TeacherCard } from '@/components/TeacherCard';
import { EmptyResults } from '@/components/EmptyResults';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, Lock, Heart, BookOpen, CircleUserRound } from 'lucide-react';
import { toast } from 'sonner';
import { useLikes } from '@/lib/likes-context';
import { PaperCard, type PaperCardPaper } from '@/components/PaperCard';

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
  date_of_birth: string | null;
  age: number | null;
  school_college: string | null;
  grade: string | null;
  school_board: string | null;
  guardian_email: string | null;
}

// Profile form field/label/panel styling, on the token system so the editable form matches
// the rest of the page instead of falling back to shadcn's bare default input styling.
const FIELD_CLASSNAME =
  'h-auto min-h-12 rounded-lg border-0 bg-background text-base shadow-border focus-visible:ring-0 focus-visible:ring-offset-0';
const LOCKED_FIELD_CLASSNAME = `${FIELD_CLASSNAME} cursor-not-allowed opacity-70`;
const LABEL_CLASSNAME = 'mb-1.5 block text-sm font-semibold text-foreground';
const SECTION_HEADING_CLASSNAME = 'text-lg font-semibold text-foreground';
const OPTION_GROUP_CLASSNAME = 'rounded-2xl bg-background shadow-border';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [studentSubjects, setStudentSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { likedTeacherIds, likedCount, loading: likesLoading } = useLikes();
  const [savedTeachers, setSavedTeachers] = useState<SavedTeacher[]>([]);
  const [savedTeachersLoading, setSavedTeachersLoading] = useState(true);
  const [papersContributedCount, setPapersContributedCount] = useState(0);

  // Reading history/progress has no backend yet (pages/PaperReader.md hasn't been built — no
  // reader page, no progress table). "Continue reading" and the "Papers read" stat therefore stay
  // honestly empty/zero rather than showing fabricated numbers; this is real, just currently nil.
  const readingHistory: { paper: PaperCardPaper; questionsRead: number; totalQuestions: number }[] = [];
  const papersReadCount = 0;

  // School board options
  const schoolBoards = ['ICSE', 'CBSE', 'IGCSE', 'IB', 'State'];
  const [formData, setFormData] = useState({
    phone: '',
    school_college: '',
    grade: '',
    school_board: '',
    address: '',
    guardian_email: '',
    date_of_birth: '',
  });

  // Redirect if not authenticated or not a student
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }
    if (!loading && profile && profile.role !== 'student') {
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
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

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
            school_college: profileData.school_college || '',
            grade: profileData.grade || '',
            school_board: profileData.school_board || '',
            address: profileData.address || '',
            guardian_email: profileData.guardian_email || '',
            date_of_birth: formatDateForDisplay(profileData.date_of_birth),
          });
        }

        // Fetch all subjects
        const { data: subjectsData } = await supabase
          .from('subjects')
          .select('*')
          .order('name');

        if (subjectsData) {
          setSubjects(subjectsData);
        }

        // Fetch student's selected subjects
        const { data: studentSubjectsData } = await supabase
          .from('student_subjects')
          .select('subject_id')
          .eq('student_id', user.id);

        if (studentSubjectsData) {
          setStudentSubjects(studentSubjectsData.map(s => s.subject_id));
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

  // Fetch full teacher records for the student's saved (liked) teachers
  useEffect(() => {
    async function fetchSavedTeachers() {
      if (likesLoading) return;

      if (likedTeacherIds.size === 0) {
        setSavedTeachers([]);
        setSavedTeachersLoading(false);
        return;
      }

      try {
        const teacherIds = Array.from(likedTeacherIds);
        const { data: teachersData, error: teachersError } = await supabase
          .from('teachers_list')
          .select('id, name, slug, image_url, subjects(name, slug)')
          .in('id', teacherIds);

        if (teachersError) throw teachersError;

        if (!teachersData || teachersData.length === 0) {
          setSavedTeachers([]);
          setSavedTeachersLoading(false);
          return;
        }

        const slugs = teachersData.map((t) => t.slug);
        const { data: shikshaqData } = await supabase
          .from('Shikshaqmine')
          .select('*')
          .in('Slug', slugs);

        const sirMaamMap = new Map<string, string | null>();
        if (shikshaqData) {
          shikshaqData.forEach((record: any) => {
            sirMaamMap.set(record.Slug, record["Sir/Ma'am?"] || null);
          });
        }

        setSavedTeachers(
          teachersData.map((teacher) => ({
            ...teacher,
            sirMaam: sirMaamMap.get(teacher.slug) || null,
          }))
        );
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching saved teachers:', error);
        }
      } finally {
        setSavedTeachersLoading(false);
      }
    }

    fetchSavedTeachers();
  }, [likedTeacherIds, likesLoading]);

  // "Papers contributed" stat — real count of papers this student has submitted (papers.created_by),
  // regardless of publish state, since a pending submission is still a real contribution.
  useEffect(() => {
    async function fetchPapersContributed() {
      if (!user) return;
      try {
        const { count, error } = await supabase
          .from('papers')
          .select('id', { count: 'exact', head: true })
          .eq('created_by', user.id);
        if (!error && typeof count === 'number') {
          setPapersContributedCount(count);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching papers contributed count:', error);
        }
      }
    }
    fetchPapersContributed();
  }, [user]);

  // Helper function to convert yyyy-mm-dd to dd-mm-yyyy
  const formatDateForDisplay = (dateStr: string | null): string => {
    if (!dateStr) return '';
    // If already in dd-mm-yyyy format, return as is
    if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) return dateStr;
    // If in yyyy-mm-dd format, convert to dd-mm-yyyy
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateStr.split('-');
      return `${day}-${month}-${year}`;
    }
    return dateStr;
  };

  // Helper function to convert dd-mm-yyyy to yyyy-mm-dd for database
  const formatDateForDatabase = (dateStr: string): string | null => {
    if (!dateStr || !dateStr.trim()) return null;
    // If in dd-mm-yyyy format, convert to yyyy-mm-dd
    const match = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (match) {
      const [, day, month, year] = match;
      return `${year}-${month}-${day}`;
    }
    // If already in yyyy-mm-dd format, return as is
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
    return null;
  };

  // Helper function to validate dd-mm-yyyy date format
  const isValidDateFormat = (dateStr: string): boolean => {
    if (!dateStr) return false;
    const match = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (!match) return false;

    const [, day, month, year] = match;
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    // Basic validation
    if (monthNum < 1 || monthNum > 12) return false;
    if (dayNum < 1 || dayNum > 31) return false;
    if (yearNum < 1900 || yearNum > 2100) return false;

    // Check if date is valid (e.g., not 31 Feb)
    const date = new Date(yearNum, monthNum - 1, dayNum);
    return (
      date.getFullYear() === yearNum &&
      date.getMonth() === monthNum - 1 &&
      date.getDate() === dayNum
    );
  };

  // Helper function to format date input as user types (dd-mm-yyyy)
  const formatDateInput = (value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');

    // Limit to 8 digits (ddmmyyyy)
    const limitedDigits = digits.slice(0, 8);

    // Format as dd-mm-yyyy
    if (limitedDigits.length === 0) return '';
    if (limitedDigits.length <= 2) return limitedDigits;
    if (limitedDigits.length <= 4) return `${limitedDigits.slice(0, 2)}-${limitedDigits.slice(2)}`;
    return `${limitedDigits.slice(0, 2)}-${limitedDigits.slice(2, 4)}-${limitedDigits.slice(4)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // For phone number, only allow numeric characters
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, ''); // Remove all non-digit characters
      setFormData({ ...formData, [name]: numericValue });
    } else if (name === 'date_of_birth') {
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

  const validateRequiredFields = (): boolean => {
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number');
      return false;
    }

    if (formData.phone.trim().length !== 10) {
      toast.error('Phone number must be exactly 10 digits');
      return false;
    }

    if (!formData.date_of_birth.trim()) {
      toast.error('Please enter your date of birth');
      return false;
    }

    if (!isValidDateFormat(formData.date_of_birth.trim())) {
      toast.error('Please enter a valid date in DD-MM-YYYY format (e.g., 15-03-2010)');
      return false;
    }

    if (!formData.school_college.trim()) {
      toast.error('Please enter your school or college name');
      return false;
    }

    if (!formData.grade.trim()) {
      toast.error('Please select your grade');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    // Validate required fields
    if (!validateRequiredFields()) {
      return;
    }

    setSaving(true);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          phone: formData.phone || null,
          school_college: formData.school_college || null,
          grade: formData.grade || null,
          school_board: formData.school_board || null,
          address: formData.address || null,
          guardian_email: formData.guardian_email || null,
          date_of_birth: formatDateForDatabase(formData.date_of_birth),
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

      // Update student subjects
      // Delete existing subjects
      const { error: deleteError } = await supabase
        .from('student_subjects')
        .delete()
        .eq('student_id', user.id);

      if (deleteError) {
        if (import.meta.env.DEV) {
          console.error('Error deleting subjects:', deleteError);
        }
      }

      // Insert new subjects
      if (studentSubjects.length > 0) {
        const { error: insertError } = await supabase
          .from('student_subjects')
          .insert(
            studentSubjects.map(subjectId => ({
              student_id: user.id,
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
        <Navbar />
        <div className="container pt-8 pb-8">
          <div className="animate-pulse">
            <div className="mb-8 h-8 w-48 rounded-lg bg-muted" />
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-muted" />
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 rounded-lg bg-muted" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile || profile.role !== 'student') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-16 pb-16 text-center sm:py-20">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {user ? 'Student account required' : 'Sign in required'}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {user
              ? 'This dashboard is only available to student accounts.'
              : 'Please sign in to view your dashboard.'}
          </p>
          <Button className="mt-6" onClick={() => navigate(user ? '/' : '/auth')}>
            {user ? 'Go Home' : 'Sign In'}
          </Button>
        </main>
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

  const subLineParts = [
    userEmail,
    profile.grade ? `Class ${profile.grade}` : null,
    profile.school_board || null,
  ].filter(Boolean);

  // Labels and order are literal, per design_handoff_shikshaq/pages/StudentDashboard.md.
  // Squircle stat-tile treatment (learning-education-squircles reference): each tile gets a
  // different flat token fill instead of three identical cards. Fills stay neutral/mint —
  // no brand orange/blue here — so the accent budget stays spent on the single "Save Changes" CTA.
  const dashboardStats = [
    { label: 'Papers read', value: papersReadCount, fill: 'bg-card shadow-border' },
    { label: 'Favourite teachers', value: likedCount, fill: 'bg-mint' },
    { label: 'Papers contributed', value: papersContributedCount, fill: 'bg-muted' },
  ];

  const SAVED_TEACHERS_SHOWN = 8;
  const shownSavedTeachers = savedTeachers.slice(0, SAVED_TEACHERS_SHOWN);
  const hasMoreSavedTeachers = likedCount > shownSavedTeachers.length;

  // Profile-completeness ring — derived purely from already-loaded form state (no new fetching),
  // for the circular-progress device from the squircles reference. Real fields, real fraction.
  const completenessChecks = [
    Boolean(formData.phone),
    Boolean(formData.date_of_birth),
    Boolean(formData.school_college),
    Boolean(formData.grade),
    Boolean(formData.school_board),
    Boolean(formData.address),
    studentSubjects.length > 0,
  ];
  const completenessFilled = completenessChecks.filter(Boolean).length;
  const completenessTotal = completenessChecks.length;
  const completenessPct = Math.round((completenessFilled / completenessTotal) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container pt-8 pb-16">
        {/* Header */}
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Your dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {subLineParts.length > 0 ? subLineParts.join(' · ') : 'Manage your profile and preferences'}
        </p>

        {/* Stat tiles — squircle treatment, one flat fill per tile */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {dashboardStats.map((st) => (
            <div key={st.label} className={`rounded-2xl p-4 sm:p-6 ${st.fill}`}>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {st.label}
              </div>
              <div className="mt-2 text-3xl font-semibold tracking-tight tabular-nums text-foreground">
                {st.value}
              </div>
            </div>
          ))}
        </div>

        {/* Teachers you saved */}
        <div className="mt-8 mb-4 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Teachers you saved</h2>
          {hasMoreSavedTeachers && (
            <Link to="/liked-teachers" className="text-sm font-semibold text-brand-blue transition-colors duration-150 hover:text-brand-blue-deep">
              See all {likedCount} →
            </Link>
          )}
        </div>
        {savedTeachersLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-shimmer rounded-2xl bg-muted" />
            ))}
          </div>
        ) : shownSavedTeachers.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
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
                size="sm"
              />
            ))}
          </div>
        ) : (
          <EmptyResults
            icon={<Heart className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />}
            heading="Nothing saved yet"
            message="Tap the heart on any teacher's profile to save them here for later."
            action={{ label: 'Browse teachers', onClick: () => navigate('/all-tuition-teachers-in-kolkata') }}
          />
        )}

        {/* Continue reading */}
        <h2 className="mt-8 mb-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Continue reading</h2>
        {readingHistory.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {readingHistory.map(({ paper }) => (
              <PaperCard key={paper.id} paper={paper} variant="compact" />
            ))}
          </div>
        ) : (
          <EmptyResults
            icon={<BookOpen className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />}
            heading="Nothing read yet"
            message="Papers you open will show up here so you can pick up where you left off."
            action={{ label: 'Browse past papers', onClick: () => navigate('/past-papers') }}
          />
        )}

        {/* Profile completeness — circular progress ring, computed from the loaded profile fields */}
        <div className="mt-11 flex items-center gap-4 rounded-2xl bg-card p-4 shadow-border sm:p-6">
          <div
            className="relative flex h-16 w-16 flex-none items-center justify-center rounded-full"
            style={{ background: `conic-gradient(hsl(var(--brand)) ${completenessPct * 3.6}deg, hsl(var(--muted)) 0deg)` }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card">
              <CircleUserRound className="h-5 w-5 text-brand" strokeWidth={1.75} aria-hidden="true" />
            </div>
          </div>
          <div>
            <div className="text-base font-semibold text-foreground">Profile completeness</div>
            <div className="mt-0.5 text-sm text-muted-foreground tabular-nums">
              {completenessFilled}/{completenessTotal} fields · {completenessPct}%
            </div>
          </div>
        </div>

        <div>
          {/* Profile Form */}
          <div className="mt-6 space-y-6 rounded-2xl bg-card p-5 shadow-border sm:p-8">
            {/* Locked Fields Section */}
            <div className="space-y-4 border-b border-border pb-6">
              <h2 className={`${SECTION_HEADING_CLASSNAME} flex items-center gap-2`}>
                <Lock className="h-5 w-5 text-warm-meta" />
                Account Information
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="accountName" className={LABEL_CLASSNAME}>
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="accountName"
                    value={userName}
                    disabled
                    className={LOCKED_FIELD_CLASSNAME}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountEmail" className={LABEL_CLASSNAME}>
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="accountEmail"
                    value={userEmail}
                    disabled
                    className={LOCKED_FIELD_CLASSNAME}
                  />
                </div>
              </div>
            </div>

            {/* Editable Fields Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className={SECTION_HEADING_CLASSNAME}>Profile Information</h2>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="gap-2"
                  size="lg"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className={LABEL_CLASSNAME}>
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="10-digit phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    maxLength={10}
                    inputMode="numeric"
                    className={`w-full ${FIELD_CLASSNAME}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_birth" className={LABEL_CLASSNAME}>
                    Date of Birth <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="text"
                    placeholder="DD-MM-YYYY (e.g., 15-03-2010)"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    maxLength={10}
                    className={`w-full ${FIELD_CLASSNAME}`}
                  />
                  {formData.date_of_birth && !isValidDateFormat(formData.date_of_birth) && (
                    <p className="text-sm text-destructive">Please enter a valid date in DD-MM-YYYY format</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school_college" className={LABEL_CLASSNAME}>
                    School/College <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="school_college"
                    name="school_college"
                    type="text"
                    placeholder="Enter school or college name"
                    value={formData.school_college}
                    onChange={handleInputChange}
                    className={FIELD_CLASSNAME}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade" className={LABEL_CLASSNAME}>
                    Grade <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.grade || "__none__"}
                    onValueChange={(value) => setFormData({ ...formData, grade: value === "__none__" ? "" : value })}
                  >
                    <SelectTrigger id="grade" className={FIELD_CLASSNAME}>
                      <SelectValue placeholder="Select grade" />
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
                      <SelectItem value="UG, First Year">UG, First Year</SelectItem>
                      <SelectItem value="UG, Second Year">UG, Second Year</SelectItem>
                      <SelectItem value="UG, Third Year">UG, Third Year</SelectItem>
                      <SelectItem value="UG, Fourth Year">UG, Fourth Year</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className={LABEL_CLASSNAME}>School Board (Optional)</Label>
                  {/* Segmented pill toggle — 5 fixed options, the dominant filter pattern per the
                      squircles reference. Tap the active pill again to clear the selection. */}
                  <div className="flex flex-wrap gap-2" role="group" aria-label="School board">
                    {schoolBoards.map((board) => {
                      const selected = formData.school_board === board;
                      return (
                        <button
                          key={board}
                          type="button"
                          aria-pressed={selected}
                          onClick={() =>
                            setFormData({ ...formData, school_board: selected ? '' : board })
                          }
                          className={`min-h-11 rounded-full px-4 text-sm font-semibold transition-colors duration-150 ${
                            selected
                              ? 'bg-brand-blue text-brand-blue-foreground'
                              : 'bg-muted text-foreground hover:bg-accent'
                          }`}
                        >
                          {board}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardian_email" className={LABEL_CLASSNAME}>Guardian's Email (Optional)</Label>
                  <Input
                    id="guardian_email"
                    name="guardian_email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="guardian@example.com"
                    value={formData.guardian_email}
                    onChange={handleInputChange}
                    className={FIELD_CLASSNAME}
                  />
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

              {/* Subjects Selection */}
              <div className="space-y-3 pt-4 border-t border-border">
                <Label className={LABEL_CLASSNAME}>Subjects Interested In</Label>
                <div
                  className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-4 ${OPTION_GROUP_CLASSNAME}`}
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
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-border">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full md:w-auto gap-2"
                size="lg"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
