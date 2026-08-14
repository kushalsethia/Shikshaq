import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TeacherCard } from '@/components/TeacherCard';
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
import { Save, Lock, Users, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useLikes } from '@/lib/likes-context';
import { useStudiesWith } from '@/lib/studies-with-context';
import { SURFACE_TOKENS } from '@/utils/searchFacets';

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

// Profile form field/label/panel styling, derived from SURFACE_TOKENS — the same palette this
// page's header and stat tiles already use as hardcoded hex literals — so the editable form
// matches the rest of the page instead of falling back to shadcn's bare default input styling.
const FIELD_STYLE: React.CSSProperties = {
  background: SURFACE_TOKENS.shell,
  boxShadow: `0 0 0 1px ${SURFACE_TOKENS.hairline}`,
  borderRadius: 12,
  minHeight: 48,
};
const LOCKED_FIELD_STYLE: React.CSSProperties = { ...FIELD_STYLE, opacity: 0.7 };
const FIELD_CLASSNAME = 'h-auto border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0';
const LABEL_STYLE: React.CSSProperties = { fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary, marginBottom: 6, display: 'block' };
const SECTION_HEADING_STYLE: React.CSSProperties = { fontSize: 19, fontWeight: 700, color: SURFACE_TOKENS.textPrimary };

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

        setProfile(profileData);

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

        // Fetch all subjects
        const { data: subjectsData } = await supabase
          .from('subjects')
          .select('*')
          .order('name');

        if (subjectsData) {
          setSubjects(subjectsData);
        }

        // Fetch unique boards from Shikshaqmine table
        const { data: shikshaqData } = await supabase
          .from('Shikshaqmine')
          .select('"School Boards Catered"');

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

        // Fetch guardian's selected subjects for student
        const { data: guardianSubjectsData } = await supabase
          .from('guardian_student_subjects')
          .select('subject_id')
          .eq('guardian_id', user.id);

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
      // Delete existing subjects
      const { error: deleteError } = await supabase
        .from('guardian_student_subjects')
        .delete()
        .eq('guardian_id', user.id);

      if (deleteError) {
        if (import.meta.env.DEV) {
          console.error('Error deleting subjects:', deleteError);
        }
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
        setProfile(updatedProfile);
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
      <div style={{ minHeight: '100vh', background: '#F9F5F1' }}>
        <Navbar />
        <div className="container pb-8" style={{ paddingTop: 'clamp(120px,14vw,150px)' }}>
          <div className="animate-pulse">
            <div className="h-8 w-48 rounded mb-8" style={{ background: '#F0EAE2' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 24 }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{ height: 90, borderRadius: 20, background: '#F0EAE2' }} />
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 rounded-lg" style={{ background: '#F0EAE2' }} />
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
      <div style={{ minHeight: '100vh', background: '#F9F5F1' }}>
        <Navbar />
        <main className="container" style={{ paddingTop: 'clamp(120px,14vw,150px)', paddingBottom: 60, textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(23px,3vw,32px)', fontWeight: 700, color: '#1F1F1F', marginBottom: 12 }}>
            {user ? 'Guardian account required' : 'Sign in required'}
          </h1>
          <p style={{ color: '#7B736B', marginBottom: 24 }}>
            {user
              ? 'This dashboard is only available to guardian accounts.'
              : 'Please sign in to view your dashboard.'}
          </p>
          <Button onClick={() => navigate(user ? '/' : '/auth')}>
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

  const dashboardStats = [
    { label: 'teachers you study with', value: studiesWithCount },
    { label: 'teachers saved', value: likedCount },
    { label: 'subjects selected', value: studentSubjects.length },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F9F5F1' }}>
      <Navbar />

      <main style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(20px,3vw,32px) clamp(16px,3vw,28px) 60px', paddingTop: 'clamp(120px,14vw,150px)' }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-7 h-7" style={{ color: '#B35900' }} />
          <h1 style={{ fontSize: 'clamp(25px,3.4vw,38px)', lineHeight: 1.1, fontWeight: 700 }}>
            Hi, {firstName}
          </h1>
        </div>
        <p style={{ marginTop: 6, fontSize: 15, color: '#7B736B' }}>
          {subLineParts.length > 0 ? subLineParts.join(' · ') : 'Manage your profile and student details'}
        </p>

        {/* Stat tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginTop: 28 }}>
          {dashboardStats.map((st) => (
            <div key={st.label} style={{ padding: 22, borderRadius: 20, background: '#FCFAF7', boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.04em', color: '#8B837A', textTransform: 'uppercase' }}>
                {st.label}
              </div>
              <div style={{ marginTop: 6, fontSize: 30, fontWeight: 800, letterSpacing: '-.04em' }}>
                {st.value}
              </div>
            </div>
          ))}
        </div>

        {/* Saved teachers */}
        <h2 style={{ marginTop: 44, fontSize: 'clamp(20px,2.2vw,24px)', fontWeight: 700 }}>Teachers you saved</h2>
        <div style={{ marginTop: 18 }}>
          {savedTeachersLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse" style={{ borderRadius: 20, aspectRatio: '4/5', background: '#F0EAE2' }} />
              ))}
            </div>
          ) : savedTeachers.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
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
            <div style={{ background: '#FCFAF7', boxShadow: '0 0 0 1px #E7DFD5', padding: 36, borderRadius: 22 }}>
              <Heart className="w-8 h-8" style={{ color: '#8B837A' }} />
              <h3 style={{ marginTop: 14, fontSize: 19, fontWeight: 700 }}>No saved teachers yet</h3>
              <p style={{ marginTop: 6, fontSize: 14.5, lineHeight: 1.6, color: '#7B736B', maxWidth: 480 }}>
                Tap the heart on any teacher's profile to save them here for later.
              </p>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Profile Form */}
          <div style={{ marginTop: 44, padding: 'clamp(20px,3vw,32px)', borderRadius: 20, background: SURFACE_TOKENS.field, boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }} className="space-y-6">
            {/* Locked Fields Section */}
            <div className="space-y-4 pb-6 border-b border-border">
              <h2 style={SECTION_HEADING_STYLE} className="flex items-center gap-2">
                <Lock className="w-5 h-5" style={{ color: SURFACE_TOKENS.textTertiary }} />
                Account Information (Not Changeable)
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountName" style={LABEL_STYLE}>Name</Label>
                  <Input
                    id="accountName"
                    value={userName}
                    disabled
                    className={`${FIELD_CLASSNAME} cursor-not-allowed`}
                    style={LOCKED_FIELD_STYLE}
                  />
                  <p className="text-xs" style={{ color: SURFACE_TOKENS.textTertiary }}>Imported from Google Auth</p>
                </div>

                <div className="space-y-2">
                  <Label style={LABEL_STYLE}>Email</Label>
                  <Input
                    value={userEmail}
                    disabled
                    className={`${FIELD_CLASSNAME} cursor-not-allowed`}
                    style={LOCKED_FIELD_STYLE}
                  />
                  <p className="text-xs" style={{ color: SURFACE_TOKENS.textTertiary }}>Imported from Google Auth</p>
                </div>
              </div>
            </div>

            {/* Guardian Information Section */}
            <div className="space-y-4 pb-6 border-b border-border">
              <h2 style={SECTION_HEADING_STYLE}>Guardian Information</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" style={LABEL_STYLE}>Phone Number (Optional)</Label>
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
                    style={FIELD_STYLE}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relationship_to_student" style={LABEL_STYLE}>Relationship to Student (Optional)</Label>
                  <Select
                    value={formData.relationship_to_student || "__none__"}
                    onValueChange={(value) => setFormData({ ...formData, relationship_to_student: value === "__none__" ? "" : value })}
                  >
                    <SelectTrigger id="relationship_to_student" className={FIELD_CLASSNAME} style={FIELD_STYLE}>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">None</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="sister/brother">Sister/Brother</SelectItem>
                      <SelectItem value="grandparent">Grandparent</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" style={LABEL_STYLE}>Address (Optional)</Label>
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`${FIELD_CLASSNAME} py-3`}
                    style={{ ...FIELD_STYLE, minHeight: 88 }}
                  />
                </div>
              </div>
            </div>

            {/* Student Details Section */}
            <div className="space-y-4">
              <h2 style={SECTION_HEADING_STYLE}>Student Details</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student_name" style={LABEL_STYLE}>Student Name (Optional)</Label>
                  <Input
                    id="student_name"
                    name="student_name"
                    type="text"
                    placeholder="Enter student's name"
                    value={formData.student_name}
                    onChange={handleInputChange}
                    className={FIELD_CLASSNAME}
                    style={FIELD_STYLE}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student_date_of_birth" style={LABEL_STYLE}>Student Date of Birth (Optional)</Label>
                  <Input
                    id="student_date_of_birth"
                    name="student_date_of_birth"
                    type="text"
                    placeholder="DD-MM-YYYY (e.g., 15-03-2010)"
                    value={formData.student_date_of_birth}
                    onChange={handleInputChange}
                    maxLength={10}
                    className={`w-full ${FIELD_CLASSNAME}`}
                    style={FIELD_STYLE}
                  />
                  {formData.student_date_of_birth && !isValidDateFormat(formData.student_date_of_birth) && (
                    <p className="text-xs" style={{ color: '#B3261E' }}>Please enter a valid date in DD-MM-YYYY format</p>
                  )}
                  {profile.student_age && (
                    <p className="text-xs" style={{ color: SURFACE_TOKENS.textTertiary }}>Age: {profile.student_age} years</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student_grade" style={LABEL_STYLE}>Student Class/Grade (Optional)</Label>
                  <Select
                    value={formData.student_grade || "__none__"}
                    onValueChange={(value) => setFormData({ ...formData, student_grade: value === "__none__" ? "" : value })}
                  >
                    <SelectTrigger id="student_grade" className={FIELD_CLASSNAME} style={FIELD_STYLE}>
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
                  <Label htmlFor="student_school_board" style={LABEL_STYLE}>Student School Board (Optional)</Label>
                  <Select
                    value={formData.student_school_board || "__none__"}
                    onValueChange={(value) => setFormData({ ...formData, student_school_board: value === "__none__" ? "" : value })}
                  >
                    <SelectTrigger id="student_school_board" className={FIELD_CLASSNAME} style={FIELD_STYLE}>
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
                <Label style={LABEL_STYLE}>Subjects Interested In (Optional)</Label>
                <div
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-4"
                  style={{ background: SURFACE_TOKENS.shell, boxShadow: `0 0 0 1px ${SURFACE_TOKENS.hairline}`, borderRadius: 14 }}
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
                        className="text-sm font-normal cursor-pointer"
                        style={{ color: SURFACE_TOKENS.textBody }}
                      >
                        {subject.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {subjects.length === 0 && (
                  <p className="text-sm" style={{ color: SURFACE_TOKENS.textTertiary }}>No subjects available</p>
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

