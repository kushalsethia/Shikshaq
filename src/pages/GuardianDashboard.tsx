import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
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
import { Save, Lock, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Subject {
  id: string;
  name: string;
  slug: string;
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

export default function GuardianDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [boards, setBoards] = useState<string[]>([]);
  const [studentSubjects, setStudentSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
          console.error('Error fetching profile:', profileError);
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
                if (board) {
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
    
    if (name === 'student_date_of_birth') {
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-32 sm:pt-[120px] pb-8 md:pt-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-muted rounded mb-8" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile || profile.role !== 'guardian') {
    return null;
  }

  // Get user email and name from auth (locked fields)
  const userEmail = user?.email || profile.email || '';
  const userName = user?.user_metadata?.full_name || 
                   user?.user_metadata?.name || 
                   profile.full_name || 
                   '';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-32 sm:pt-30 pb-8 md:pt-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-serif text-foreground">
                Guardian Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground">
              Manage your profile and student details
            </p>
          </div>

          {/* Profile Form */}
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border space-y-6">
            {/* Locked Fields Section */}
            <div className="space-y-4 pb-6 border-b border-border">
              <h2 className="text-xl font-serif text-foreground flex items-center gap-2">
                <Lock className="w-5 h-5 text-muted-foreground" />
                Account Information (Not Changeable)
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={userName}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">Imported from Google Auth</p>
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={userEmail}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">Imported from Google Auth</p>
                </div>
              </div>
            </div>

            {/* Guardian Information Section */}
            <div className="space-y-4 pb-6 border-b border-border">
              <h2 className="text-xl font-serif text-foreground">Guardian Information</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 XXXXXXXXXX"
                    value={formData.phone}
                    onChange={handleInputChange}
                    maxLength={13}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relationship_to_student">Relationship to Student (Optional)</Label>
                  <Select
                    value={formData.relationship_to_student}
                    onValueChange={(value) => setFormData({ ...formData, relationship_to_student: value })}
                  >
                    <SelectTrigger id="relationship_to_student">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="sister/brother">Sister/Brother</SelectItem>
                      <SelectItem value="grandparent">Grandparent</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address (Optional)</Label>
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Student Details Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-serif text-foreground">Student Details</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student_name">Student Name (Optional)</Label>
                  <Input
                    id="student_name"
                    name="student_name"
                    type="text"
                    placeholder="Enter student's name"
                    value={formData.student_name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student_date_of_birth">Student Date of Birth (Optional)</Label>
                  <Input
                    id="student_date_of_birth"
                    name="student_date_of_birth"
                    type="text"
                    placeholder="DD-MM-YYYY (e.g., 15-03-2010)"
                    value={formData.student_date_of_birth}
                    onChange={handleInputChange}
                    maxLength={10}
                    className="w-full"
                  />
                  {formData.student_date_of_birth && !isValidDateFormat(formData.student_date_of_birth) && (
                    <p className="text-xs text-red-500">Please enter a valid date in DD-MM-YYYY format</p>
                  )}
                  {profile.student_age && (
                    <p className="text-xs text-muted-foreground">Age: {profile.student_age} years</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student_grade">Student Class/Grade (Optional)</Label>
                  <Select
                    value={formData.student_grade}
                    onValueChange={(value) => setFormData({ ...formData, student_grade: value })}
                  >
                    <SelectTrigger id="student_grade">
                      <SelectValue placeholder="Select class/grade" />
                    </SelectTrigger>
                    <SelectContent>
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
                  <Label htmlFor="student_school_board">Student School Board (Optional)</Label>
                  <Select
                    value={formData.student_school_board}
                    onValueChange={(value) => setFormData({ ...formData, student_school_board: value })}
                  >
                    <SelectTrigger id="student_school_board">
                      <SelectValue placeholder="Select school board" />
                    </SelectTrigger>
                    <SelectContent>
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
                <Label>Subjects Interested In (Optional)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-4 border border-border rounded-lg">
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
                      >
                        {subject.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {subjects.length === 0 && (
                  <p className="text-sm text-muted-foreground">No subjects available</p>
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

