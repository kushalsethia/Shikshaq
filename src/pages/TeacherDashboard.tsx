import { useState, useEffect, useRef } from 'react';
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
import { Save, Lock, GraduationCap, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { convertClassesToRoman } from '@/utils/romanNumerals';
import { sanitizeImageUrl } from '@/utils/imageSanitizer';
import { invalidateTeacherCache, getShikshaqmineBySlugCacheKey, removeCache } from '@/utils/cache';

const AREAS = [
  // Group 1
  'Alipore', 'Ballygunge', 'Behala', 'Bhowanipore', 'Gariahat', 'Garia', 'Jadavpur', 'Kasba', 
  'New Alipore', 'Southern Avenue', 'Tollygunge', 'Hazra',
  // Group 2
  'Baguihati', 'Belur', 'Howrah', 'Joka', 'Newtown', 'Rajarhat', 'Salt Lake', 'Science City',
  // Group 3
  'Dum Dum', 'Entally', 'Girish Park', 'Nagarbazar', 'Sealdah', 'Shyam Bazar', 'Tangra',
  // Group 4
  'Camac Street', 'College Street', 'Elgin', 'Minto Park', 'Park Street', 'Park Circus',
  // Group 5
  'Kankurgachi', 'Laketown', 'Phoolbagan', 'Ultadanga',
  // Group 6
  'Anandapur', 'Parnasree', 'Rabindra Nagar',
  // Group 7
  'Hooghly'
].sort();

const LOCATION_V2_OPTIONS = [
  "None",
  "TEACHER'S HOME TUTORING",
  "STUDENT'S HOME TUTORING ONLY",
  "BOTH OPTIONS LISTED"
];

const SCHOOL_BOARDS = ['ICSE', 'CBSE', 'IGCSE', 'IB', 'State', 'College'];

const CLASS_NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'UG'];

interface TeacherData {
  "Email ID": string | null;
  Description: string | null;
  "LOCATION V2": string | null;
  "STUDENT'S HOME IN THESE AREAS": string | null;
  "TUTOR'S HOME IN THESE AREAS": string | null;
  "Qualifications etc": string | null;
  "Years they started teaching": string | null;
  "Featured Subject": string | null;
  "School Boards Catered": string | null;
  "Phone Number": string | null;
  "Hero Image": string | null;
  "Classes Taught for Backend": string | null;
  "Classes Taught": string | null;
  Title: string | null;
  "Sir/Ma'am?": string | null;
  Area: string | null;
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<{ name: string; slug: string }[]>([]);

  // Redirect if not authenticated or not a teacher
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }
    if (!loading && teacherData === null && !loading) {
      // Check if user is a teacher
      const checkTeacher = async () => {
        if (!user) return;
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
        
        if (profile?.role !== 'teacher') {
          navigate('/');
        }
      };
      checkTeacher();
    }
  }, [user, teacherData, loading, navigate]);

  // Fetch teacher data
  useEffect(() => {
    async function fetchTeacherData() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get user's email
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, role')
          .eq('id', user.id)
          .maybeSingle();

        if (!profile || profile.role !== 'teacher' || !profile.email) {
          setLoading(false);
          return;
        }

        // Fetch teacher data from Shikshaqmine by email
        const { data, error } = await supabase
          .from('Shikshaqmine')
          .select('*')
          .eq('Email ID', profile.email)
          .maybeSingle();

        if (error) {
          if (import.meta.env.DEV) {
            console.error('Error fetching teacher data:', error);
          }
          toast.error('Failed to load your profile');
          setLoading(false);
          return;
        }

        if (!data) {
          toast.error('Teacher profile not found. Please contact support.');
          setLoading(false);
          return;
        }

        // Set teacher data
        const teacher: TeacherData = {
          "Email ID": data["Email ID"] || null,
          Description: data["Description"] || null,
          "LOCATION V2": data["LOCATION V2"] || data["Location V2"] || null,
          "STUDENT'S HOME IN THESE AREAS": data["STUDENT'S HOME IN THESE AREAS"] || null,
          "TUTOR'S HOME IN THESE AREAS": data["TUTOR'S HOME IN THESE AREAS"] || null,
          "Qualifications etc": data["Qualifications etc"] || null,
          "Years they started teaching": data["Years they started teaching"] || null,
          "Featured Subject": data["Featured Subject"] || null,
          "School Boards Catered": data["School Boards Catered"] || null,
          "Phone Number": data["Phone Number"] || null,
          "Hero Image": data["Hero Image"] || null,
          "Classes Taught for Backend": data["Classes Taught for Backend"] || null,
          "Classes Taught": data["Classes Taught"] || null,
          Title: data["Title"] || null,
          "Sir/Ma'am?": data["Sir/Ma'am?"] || null,
          Area: data["Area"] || null,
        };

        setTeacherData(teacher);
        setImagePreview(teacher["Hero Image"]);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error:', error);
        }
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    fetchTeacherData();
  }, [user]);

  // Fetch subjects for Featured Subject dropdown
  useEffect(() => {
    async function fetchSubjects() {
      const { data, error } = await supabase
        .from('subjects')
        .select('name, slug')
        .order('name');

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching subjects:', error);
        }
        return;
      }

      setSubjects(data || []);
    }

    fetchSubjects();
  }, []);

  // Helper function to check if value exists in comma-separated string
  const valueExistsInString = (str: string | null, value: string): boolean => {
    if (!str) return false;
    return str.split(',').some((item) => item.trim() === value);
  };

  const handleInputChange = (field: keyof TeacherData, value: string | null) => {
    setTeacherData((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [field]: value };
      
      // Auto-update Classes Taught when Classes Taught for Backend changes
      if (field === "Classes Taught for Backend") {
        const romanClasses = convertClassesToRoman(value);
        updated["Classes Taught"] = romanClasses;
      }
      
      return updated;
    });
  };

  const handleMultiSelectChange = (field: keyof TeacherData, value: string, checked: boolean) => {
    if (!teacherData) return;
    
    const currentValue = teacherData[field] as string | null;
    const currentArray = currentValue ? currentValue.split(',').map((v) => v.trim()) : [];
    
    let newArray: string[];
    if (checked) {
      newArray = [...currentArray, value].filter((v) => v !== '');
    } else {
      newArray = currentArray.filter((v) => v !== value);
    }

    handleInputChange(field, newArray.join(', ') || null);
  };

  const handleImageUpload = async (file: File) => {
    if (!user || !teacherData) return;

    try {
      setUploadingImage(true);

      // Get old image URL before uploading new one
      const oldImageUrl = teacherData["Hero Image"];

      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-images/${user.id}-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('hero-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        toast.error('Image upload failed. Please check storage setup.');
        if (import.meta.env.DEV) {
          console.error('Upload error:', error);
        }
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('hero-images')
        .getPublicUrl(data.path);

      // Sanitize the URL
      const sanitizedUrl = sanitizeImageUrl(publicUrl);
      if (sanitizedUrl) {
        handleInputChange("Hero Image", sanitizedUrl);
        setImagePreview(sanitizedUrl);
        
        // Delete old image from storage if it exists in the bucket
        if (oldImageUrl && oldImageUrl.includes('hero-images')) {
          // Extract the file path from the URL
          // URL format: https://[project].supabase.co/storage/v1/object/public/hero-images/[path]
          // Or: https://[project].supabase.co/storage/v1/object/sign/hero-images/[path]
          let oldFilePath: string | null = null;
          
          // Try multiple URL patterns
          // Pattern 1: /hero-images/[filename]
          const urlMatch1 = oldImageUrl.match(/\/hero-images\/([^?#]+)/);
          if (urlMatch1 && urlMatch1[1]) {
            oldFilePath = `hero-images/${urlMatch1[1]}`;
          }
          
          // Pattern 2: If URL contains the full path already
          if (!oldFilePath && oldImageUrl.includes('/storage/v1/object/public/hero-images/')) {
            const parts = oldImageUrl.split('/hero-images/');
            if (parts.length > 1) {
              const filename = parts[1].split('?')[0].split('#')[0]; // Remove query params and hash
              oldFilePath = `hero-images/${filename}`;
            }
          }
          
          // Only delete if it's the teacher's own file (contains their user ID)
          if (oldFilePath && oldFilePath.includes(user.id)) {
            try {
              // The remove function expects paths relative to the bucket root
              // If oldFilePath is "hero-images/user-id-123.jpg", we need just "user-id-123.jpg"
              // But if it's already just "user-id-123.jpg", use it as is
              let pathToDelete = oldFilePath;
              if (oldFilePath.startsWith('hero-images/')) {
                pathToDelete = oldFilePath.replace('hero-images/', '');
              }
              
              const { error: deleteError } = await supabase.storage
                .from('hero-images')
                .remove([pathToDelete]);
              
              if (deleteError) {
                if (import.meta.env.DEV) {
                  console.warn('Error deleting old image:', deleteError);
                  console.warn('Attempted to delete path:', pathToDelete);
                  console.warn('Original URL:', oldImageUrl);
                }
                // Don't show error to user - old image deletion is not critical
              } else if (import.meta.env.DEV) {
                console.log('Successfully deleted old image:', pathToDelete);
              }
            } catch (deleteErr) {
              if (import.meta.env.DEV) {
                console.warn('Error deleting old image:', deleteErr);
              }
            }
          } else if (import.meta.env.DEV && oldImageUrl.includes('hero-images')) {
            console.warn('Could not extract file path from URL or file does not belong to user:', oldImageUrl);
            console.warn('Extracted path:', oldFilePath);
            console.warn('User ID:', user.id);
          }
        }
        
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Failed to generate valid image URL');
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error uploading image:', error);
      }
      toast.error('Failed to upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      handleImageUpload(file);
    }
  };

  const handleSave = async () => {
    if (!user || !teacherData) return;

    setSaving(true);

    try {
      // Get user's email to find their record
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile?.email) {
        toast.error('Email not found. Please contact support.');
        setSaving(false);
        return;
      }

      // Prepare update data
      const updateData: any = {
        "Email ID": teacherData["Email ID"],
        Description: teacherData["Description"] || null,
        "LOCATION V2": teacherData["LOCATION V2"] || null,
        "STUDENT'S HOME IN THESE AREAS": teacherData["STUDENT'S HOME IN THESE AREAS"] || null,
        "TUTOR'S HOME IN THESE AREAS": teacherData["TUTOR'S HOME IN THESE AREAS"] || null,
        "Qualifications etc": teacherData["Qualifications etc"] || null,
        "Years they started teaching": teacherData["Years they started teaching"] || null,
        "Featured Subject": teacherData["Featured Subject"] || null,
        "School Boards Catered": teacherData["School Boards Catered"] || null,
        "Phone Number": teacherData["Phone Number"] || null,
        "Hero Image": teacherData["Hero Image"] || null,
        "Classes Taught for Backend": teacherData["Classes Taught for Backend"] || null,
        "Classes Taught": teacherData["Classes Taught"] || null,
      };

      // Get the teacher's slug before updating (for cache invalidation)
      const { data: teacherRecord } = await supabase
        .from('Shikshaqmine')
        .select('Slug')
        .eq('Email ID', profile.email)
        .maybeSingle();

      const { error } = await supabase
        .from('Shikshaqmine')
        .update(updateData)
        .eq('Email ID', profile.email);

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error updating teacher data:', error);
        }
        toast.error('Failed to update profile');
        setSaving(false);
        return;
      }

      // Invalidate cache for this teacher's profile
      if (teacherRecord?.Slug) {
        invalidateTeacherCache(teacherRecord.Slug);
      }
      
      // Also invalidate Shikshaqmine cache by email (if cached)
      const shikshaqCacheKey = `shikshaqmine_email_${profile.email.toLowerCase().trim()}`;
      removeCache(shikshaqCacheKey);
      
      // Invalidate featured teachers cache (they might appear on browse/home)
      removeCache('featured_teachers_browse');
      removeCache('featured_teachers_index');
      
      // Clear all Shikshaqmine chunk caches
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('shikshaq_cache_') && key.includes('shikshaqmine')) {
          localStorage.removeItem(key);
        }
      });

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

  if (!teacherData) {
    return null;
  }

  // Get user email and name (locked fields)
  const userEmail = user?.email || teacherData["Email ID"] || '';
  const userName = teacherData["Title"] || user?.user_metadata?.full_name || '';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-32 sm:pt-30 pb-8 md:pt-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-serif text-foreground">
                Teacher Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground">
              Manage your profile and teaching information
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
                    Honorific
                  </Label>
                  <Input
                    value={teacherData["Sir/Ma'am?"] || ''}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Editable Fields Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif text-foreground">Profile Information</h2>
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

              {/* Email ID */}
              <div className="space-y-2">
                <Label htmlFor="emailId">Email ID</Label>
                <Input
                  id="emailId"
                  value={teacherData["Email ID"] || ''}
                  onChange={(e) => handleInputChange("Email ID", e.target.value || null)}
                  type="email"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={teacherData["Phone Number"] || ''}
                  onChange={(e) => handleInputChange("Phone Number", e.target.value || null)}
                  type="tel"
                  placeholder="+91XXXXXXXXXX"
                />
              </div>

              {/* Hero Image */}
              <div className="space-y-2">
                <Label>Hero Image</Label>
                {imagePreview && (
                  <div className="relative w-full max-w-md mb-4">
                    <img
                      src={imagePreview}
                      alt="Hero preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        handleInputChange("Hero Image", null);
                        setImagePreview(null);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                
                <label
                  htmlFor="heroImageUpload"
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-muted transition-colors w-fit"
                >
                  <Upload className="w-4 h-4" />
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                  <input
                    id="heroImageUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFileChange}
                    disabled={uploadingImage}
                  />
                </label>
                <p className="text-xs text-muted-foreground">
                  Upload an image file (max 5MB). Supported formats: JPG, PNG, GIF, WebP
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={teacherData["Description"] || ''}
                  onChange={(e) => handleInputChange("Description", e.target.value || null)}
                  rows={5}
                  placeholder="Write about your teaching experience, methodology, and what makes you unique..."
                />
              </div>

              {/* Location V2 */}
              <div className="space-y-2">
                <Label htmlFor="locationV2">Location V2</Label>
                <Select
                  value={teacherData["LOCATION V2"] || "None"}
                  onValueChange={(value) => handleInputChange("LOCATION V2", value === "None" ? null : value)}
                >
                  <SelectTrigger id="locationV2">
                    <SelectValue placeholder="Select location option" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATION_V2_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Student's Home Areas */}
              <div className="space-y-2">
                <Label>Student's Home in These Areas</Label>
                <div className="flex flex-wrap gap-2 mt-2 max-h-48 overflow-y-auto border rounded-lg p-4">
                  {AREAS.map((area) => {
                    const currentValue = teacherData["STUDENT'S HOME IN THESE AREAS"] as string | null;
                    const selected = valueExistsInString(currentValue, area);
                    return (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={`student-area-${area}`}
                          checked={selected}
                          onCheckedChange={(checked) =>
                            handleMultiSelectChange("STUDENT'S HOME IN THESE AREAS", area, checked as boolean)
                          }
                        />
                        <Label htmlFor={`student-area-${area}`} className="cursor-pointer text-sm">
                          {area}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tutor's Home Areas */}
              <div className="space-y-2">
                <Label>Tutor's Home in These Areas</Label>
                <div className="flex flex-wrap gap-2 mt-2 max-h-48 overflow-y-auto border rounded-lg p-4">
                  {AREAS.map((area) => {
                    const currentValue = teacherData["TUTOR'S HOME IN THESE AREAS"] as string | null;
                    const selected = valueExistsInString(currentValue, area);
                    return (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tutor-area-${area}`}
                          checked={selected}
                          onCheckedChange={(checked) =>
                            handleMultiSelectChange("TUTOR'S HOME IN THESE AREAS", area, checked as boolean)
                          }
                        />
                        <Label htmlFor={`tutor-area-${area}`} className="cursor-pointer text-sm">
                          {area}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Area (read-only, auto-computed) */}
              <div className="space-y-2">
                <Label>Area (Auto-computed)</Label>
                <Input
                  value={teacherData["Area"] || 'Will be computed automatically when you save'}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  This field is automatically computed from Student's Home Areas and Tutor's Home Areas
                </p>
              </div>

              {/* Qualifications */}
              <div className="space-y-2">
                <Label htmlFor="qualifications">Qualifications</Label>
                <Textarea
                  id="qualifications"
                  value={teacherData["Qualifications etc"] || ''}
                  onChange={(e) => handleInputChange("Qualifications etc", e.target.value || null)}
                  rows={3}
                  placeholder="List your educational qualifications, certifications, etc."
                />
              </div>

              {/* Years they started teaching */}
              <div className="space-y-2">
                <Label htmlFor="yearsStarted">Years they started teaching</Label>
                <Input
                  id="yearsStarted"
                  value={teacherData["Years they started teaching"] || ''}
                  onChange={(e) => handleInputChange("Years they started teaching", e.target.value || null)}
                  type="text"
                  placeholder="e.g., 2015"
                />
              </div>

              {/* Featured Subject */}
              <div className="space-y-2">
                <Label htmlFor="featuredSubject">Featured Subject</Label>
                <Select
                  value={teacherData["Featured Subject"] || "none"}
                  onValueChange={(value) => handleInputChange("Featured Subject", value === "none" ? null : value)}
                >
                  <SelectTrigger id="featuredSubject">
                    <SelectValue placeholder="Select featured subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.slug} value={subject.name}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* School Boards Catered */}
              <div className="space-y-2">
                <Label>School Boards Catered</Label>
                <div className="flex flex-wrap gap-2 mt-2 border rounded-lg p-4">
                  {SCHOOL_BOARDS.map((board) => {
                    const currentValue = teacherData["School Boards Catered"] as string | null;
                    const selected = valueExistsInString(currentValue, board);
                    return (
                      <div key={board} className="flex items-center space-x-2">
                        <Checkbox
                          id={`board-${board}`}
                          checked={selected}
                          onCheckedChange={(checked) =>
                            handleMultiSelectChange("School Boards Catered", board, checked as boolean)
                          }
                        />
                        <Label htmlFor={`board-${board}`} className="cursor-pointer text-sm">
                          {board}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Classes Taught for Backend */}
              <div className="space-y-2">
                <Label>Classes Taught for Backend</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Select classes (1-12). Classes Taught will be automatically updated to Roman numerals.
                </p>
                <div className="flex flex-wrap gap-2 mt-2 border rounded-lg p-4">
                  {CLASS_NUMBERS.map((cls) => {
                    const currentValue = teacherData["Classes Taught for Backend"] as string | null;
                    const selected = valueExistsInString(currentValue, cls);
                    return (
                      <div key={cls} className="flex items-center space-x-2">
                        <Checkbox
                          id={`class-${cls}`}
                          checked={selected}
                          onCheckedChange={(checked) =>
                            handleMultiSelectChange("Classes Taught for Backend", cls, checked as boolean)
                          }
                        />
                        <Label htmlFor={`class-${cls}`} className="cursor-pointer text-sm">
                          {cls}
                        </Label>
                      </div>
                    );
                  })}
                </div>
                {/* Show Classes Taught (read-only) */}
                {teacherData["Classes Taught"] && (
                  <div className="mt-2">
                    <Label className="text-sm text-muted-foreground">Classes Taught (Auto-computed):</Label>
                    <Input
                      value={teacherData["Classes Taught"]}
                      disabled
                      className="bg-muted cursor-not-allowed mt-1"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

