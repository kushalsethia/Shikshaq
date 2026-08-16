import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Save, Lock, Users, Heart, CircleUserRound } from 'lucide-react';
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

// Profile form field/label/panel styling, on the token system so the editable form matches
// the rest of the page instead of falling back to shadcn's bare default input styling.
const FIELD_CLASSNAME =
  'h-auto min-h-12 rounded-lg border-0 bg-background text-base shadow-border focus-visible:ring-0 focus-visible:ring-offset-0';
const LOCKED_FIELD_CLASSNAME = `${FIELD_CLASSNAME} cursor-not-allowed opacity-70`;
const LABEL_CLASSNAME = 'mb-1.5 block text-sm font-semibold text-foreground';
const SECTION_HEADING_CLASSNAME = 'text-lg font-semibold text-foreground';
const OPTION_GROUP_CLASSNAME = 'rounded-2xl bg-background shadow-border';

export default function GuardianDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  if (!profile || profile.role !== 'guardian') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
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

  const subLineParts = [
    userEmail,
    profile.student_name ? `Student: ${profile.student_name}` : null,
    profile.student_grade ? `Class ${profile.student_grade}` : null,
    profile.student_school_board || null,
  ].filter(Boolean);

  // Squircle stat-tile treatment (learning-education-squircles reference): a different flat
  // token fill per tile. Kept neutral/mint — no brand orange/blue — so the accent budget stays
  // spent on the "Save Changes" CTA.
  const dashboardStats = [
    { label: 'teachers you study with', value: studiesWithCount, fill: 'bg-card shadow-border' },
    { label: 'teachers saved', value: likedCount, fill: 'bg-mint' },
    { label: 'subjects selected', value: studentSubjects.length, fill: 'bg-muted' },
  ];

  // Profile-completeness ring — derived from already-loaded form state, no new fetching.
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
      <Navbar />

      <main className="container pt-8 pb-16">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Users className="h-7 w-7 text-brand-deep" />
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Hi, {firstName}
          </h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {subLineParts.length > 0 ? subLineParts.join(' · ') : 'Manage your profile and student details'}
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

        {/* Saved teachers */}
        <h2 className="mt-8 mb-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Teachers you saved</h2>
        {savedTeachersLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-shimmer rounded-2xl bg-muted" />
            ))}
          </div>
        ) : savedTeachers.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {savedTeachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                id={teacher.id}
                name={teacher.name}
                slug={teacher.slug}
                subject={teacher.subjects?.name || 'Tuition Teacher'}
                subjectSlug={teacher.subjects?.slug}
                imageUrl={teacher.image_url || undefined}
                sirMaam={teacher.sirMaam}
              />
            ))}
          </div>
        ) : (
          <EmptyResults
            icon={<Heart className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />}
            heading="No saved teachers yet"
            message="Tap the heart on any teacher's profile to save them here for later."
            action={{ label: 'Browse teachers', onClick: () => navigate('/all-tuition-teachers-in-kolkata') }}
          />
        )}

        {/* Profile completeness — circular progress ring, computed from the loaded profile fields */}
        <div className="mx-auto mt-11 flex max-w-4xl items-center gap-4 rounded-2xl bg-card p-4 shadow-border sm:p-6">
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

        <div className="mx-auto max-w-4xl">
          {/* Profile Form */}
          <div className="mt-6 space-y-6 rounded-2xl bg-card p-5 shadow-border sm:p-8">
            {/* Locked Fields Section */}
            <div className="space-y-4 border-b border-border pb-6">
              <h2 className={`${SECTION_HEADING_CLASSNAME} flex items-center gap-2`}>
                <Lock className="h-5 w-5 text-warm-meta" />
                Account Information (Not Changeable)
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountName" className={LABEL_CLASSNAME}>Name</Label>
                  <Input
                    id="accountName"
                    value={userName}
                    disabled
                    className={LOCKED_FIELD_CLASSNAME}
                  />
                  <p className="text-xs text-muted-foreground">Imported from Google Auth</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountEmail" className={LABEL_CLASSNAME}>Email</Label>
                  <Input
                    id="accountEmail"
                    value={userEmail}
                    disabled
                    className={LOCKED_FIELD_CLASSNAME}
                  />
                  <p className="text-xs text-muted-foreground">Imported from Google Auth</p>
                </div>
              </div>
            </div>

            {/* Guardian Information Section */}
            <div className="space-y-4 border-b border-border pb-6">
              <h2 className={SECTION_HEADING_CLASSNAME}>Guardian Information</h2>

              <div className="grid md:grid-cols-2 gap-4">
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
                  {/* Segmented pill toggle — 4 fixed options, the dominant filter pattern per the
                      squircles reference. Tap the active pill again to clear the selection. */}
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
                          className={`min-h-11 rounded-full px-4 text-sm font-semibold transition-colors duration-150 ${
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
            </div>

            {/* Student Details Section */}
            <div className="space-y-4">
              <h2 className={SECTION_HEADING_CLASSNAME}>Student Details</h2>

              <div className="grid md:grid-cols-2 gap-4">
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
              <div className="space-y-3 pt-4 border-t border-border">
                <Label className={LABEL_CLASSNAME}>Subjects Interested In (Optional)</Label>
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
