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
import { Save, Lock, GraduationCap } from 'lucide-react';
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
  date_of_birth: string | null;
  age: number | null;
  school_college: string | null;
  grade: string | null;
  school_board: string | null;
  guardian_email: string | null;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [studentSubjects, setStudentSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // School board options
  const schoolBoards = ['ICSE', 'CBSE', 'IGCSE', 'IB', 'State', 'College'];
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
          console.error('Error fetching profile:', profileError);
          setLoading(false);
          return;
        }

        setProfile(profileData);

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
        console.error('Error:', error);
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
    const required = {
      phone: formData.phone.trim(),
      date_of_birth: formData.date_of_birth.trim(),
      school_college: formData.school_college.trim(),
      grade: formData.grade.trim(),
    };

    if (!required.phone || !required.date_of_birth || !required.school_college || !required.grade) {
      toast.error('Please fill in all required fields: Phone, Date of Birth, School/College, and Grade');
      return false;
    }

    // Validate date format
    if (!isValidDateFormat(required.date_of_birth)) {
      toast.error('Please enter a valid date in DD-MM-YYYY format (e.g., 15-03-2010)');
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
        console.error('Error updating profile:', profileError);
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
        console.error('Error deleting subjects:', deleteError);
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
          console.error('Error inserting subjects:', insertError);
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
      console.error('Error saving:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
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

  if (!profile || profile.role !== 'student') {
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
      
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-serif text-foreground">
                Student Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground">
              Manage your profile and preferences
            </p>
          </div>

          {/* Profile Form */}
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border space-y-6">
            {/* Locked Fields Section */}
            <div className="space-y-4 pb-6 border-b border-border">
              <h2 className="text-xl font-serif text-foreground flex items-center gap-2">
                <Lock className="w-5 h-5 text-muted-foreground" />
                Account Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={userName}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={userEmail}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Editable Fields Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif text-foreground">Profile Information</h2>
                <Button
                  onClick={handleSave}
                  disabled={saving || !formData.phone.trim() || !formData.date_of_birth.trim() || !formData.school_college.trim() || !formData.grade.trim()}
                  className="gap-2"
                  size="lg"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="91XXXXXXXXXX"
                    value={formData.phone}
                    onChange={handleInputChange}
                    maxLength={12}
                    inputMode="numeric"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">
                    Date of Birth <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="text"
                    placeholder="DD-MM-YYYY (e.g., 15-03-2010)"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    maxLength={10}
                    className="w-full"
                  />
                  {formData.date_of_birth && !isValidDateFormat(formData.date_of_birth) && (
                    <p className="text-xs text-red-500">Please enter a valid date in DD-MM-YYYY format</p>
                  )}
                  {profile.age && (
                    <p className="text-xs text-muted-foreground">Age: {profile.age} years</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school_college">
                    School/College <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="school_college"
                    name="school_college"
                    type="text"
                    placeholder="Enter school or college name"
                    value={formData.school_college}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">
                    Grade <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.grade}
                    onValueChange={(value) => setFormData({ ...formData, grade: value })}
                  >
                    <SelectTrigger id="grade">
                      <SelectValue placeholder="Select grade" />
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
                      <SelectItem value="UG, First Year">UG, First Year</SelectItem>
                      <SelectItem value="UG, Second Year">UG, Second Year</SelectItem>
                      <SelectItem value="UG, Third Year">UG, Third Year</SelectItem>
                      <SelectItem value="UG, Fourth Year">UG, Fourth Year</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school_board">School Board (Optional)</Label>
                  <Select
                    value={formData.school_board}
                    onValueChange={(value) => setFormData({ ...formData, school_board: value })}
                  >
                    <SelectTrigger id="school_board">
                      <SelectValue placeholder="Select school board" />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolBoards.map((board) => (
                        <SelectItem key={board} value={board}>
                          {board}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardian_email">Guardian's Email (Optional)</Label>
                  <Input
                    id="guardian_email"
                    name="guardian_email"
                    type="email"
                    placeholder="guardian@example.com"
                    value={formData.guardian_email}
                    onChange={handleInputChange}
                  />
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

              {/* Subjects Selection */}
              <div className="space-y-3 pt-4 border-t border-border">
                <Label>Subjects Interested In</Label>
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

