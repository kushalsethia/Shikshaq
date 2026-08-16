import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Search, Loader2, Upload, X, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import DOMPurify from 'dompurify';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { logger } from '@/utils/logger';
import imageCompression from 'browser-image-compression';
import { validateImageSrc } from '@/utils/imageSanitizer';
import { invalidateTeacherCache, removeCache } from '@/utils/cache';
import { convertClassesToRoman } from '@/utils/romanNumerals';
import { SURFACE_TOKENS, ACCENT_TOKENS } from '@/utils/searchFacets';
import {
  AdminConsole,
  adminFieldStyle,
  adminPanelStyle,
  adminPrimaryBtnStyle,
  adminSecondaryBtnStyle,
  adminDestructiveBtnStyle,
  adminToast,
} from '@/components/AdminConsole';

// Constants matching FilterPanel
const SUBJECTS = [
  'Accounts', 'ACT', 'AP', 'Bengali', 'Biology', 'Business Studies', 'CA', 'CAT', 'Chemistry',
  'CLAT', 'Commerce', 'Computers', 'Drawing & Painting', 'Economics', 'English', 'Environmental Science',
  'Geography', 'Hindi', 'History & Civics', 'Home Science', 'JEE', 'Legal Studies', 'Maths',
  'NEET', 'NMAT', 'Physics', 'Political Science', 'Psychology', 'SAT', 'Science',
  'Sanskrit', 'Social Studies', 'Sociology'
];

const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'UG'];

const BOARDS = ['ICSE/ISC', 'CBSE', 'IGCSE', 'IB', 'State', 'N/A'];

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

const MODE_OF_TEACHING = ['Online', 'Offline'];


const CLASS_SIZE = ['Group', 'Solo'];

const SIR_MAAM = ['Sir', "Ma'am"];

interface TeacherData {
  id: number;
  Slug: string | null;
  Title: string | null;
  Featured: boolean | null;
  "Sir/Ma'am?": string | null;
  "Featured Subject": string | null;
  "Classes Taught for Backend": string | null;

  "School Boards Catered": string | null;
  Area: string | null;
  "Mode of Teaching": string | null;
  Subjects: string | null;
  "Phone Number": string | null;
  "Classes Taught": string | null;
  "Hero Image": string | null;
  "Email ID": string | null;
  "Class Size (Group/ Solo)": string | null;
  Description: string | null;
  Video: string | null;
  "Review 1": string | null;
  "Review 2": string | null;
  "Review 3": string | null;
  Link: string | null;
  "Video Link": string | null;
  "LOCATION V2": string | null;
  "STUDENT'S HOME IN THESE AREAS": string | null;
  "TUTOR'S HOME IN THESE AREAS": string | null;
  "Qualifications etc": string | null;
  "Years they started teaching": string | null;
  "Min Fees": number | null;
  "Max Fees": number | null;
}

const TEACHERS_TINT = { bg: SURFACE_TOKENS.mutedFill, text: SURFACE_TOKENS.textBody }; // #F0EAE2 / #4A443E per spec

export default function AdminTeachers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<TeacherData[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<TeacherData>>({});

  // Check if current user is an admin
  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setCheckingAdmin(false);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admins')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          if (import.meta.env.DEV) {
            console.error('Error checking admin status:', error);
          }
          setIsAdmin(false);
        } else if (data && data.id === user.id) {
          setIsAdmin(true);
          fetchTeachers();
        } else {
          if (import.meta.env.DEV) {
            logger.log('User is not an admin');
          }
          setIsAdmin(false);
          navigate('/');
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error:', error);
        }
        setIsAdmin(false);
        navigate('/');
      } finally {
        setCheckingAdmin(false);
        setLoading(false);
      }
    }

    checkAdminStatus();
  }, [user, navigate]);

  async function fetchTeachers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Shikshaqmine')
        .select('*')
        .order('Title', { ascending: true });

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching teachers:', error);
        }
        adminToast('Failed to load teachers');
        return;
      }

      setTeachers(data || []);
      setFilteredTeachers(data || []);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      adminToast('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  }

  // Filter teachers based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTeachers(teachers);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = teachers.filter(
      (teacher) =>
        teacher.Title?.toLowerCase().includes(query) ||
        teacher.Slug?.toLowerCase().includes(query) ||
        teacher["Email ID"]?.toLowerCase().includes(query) ||
        teacher["Phone Number"]?.includes(query)
    );
    setFilteredTeachers(filtered);
  }, [searchQuery, teachers]);

  // Helper function to normalize multi-select values for comparison
  const normalizeValue = (value: string): string => {
    return value.trim().toLowerCase();
  };

  // Helper function to check if a value exists in a comma-separated string (case-insensitive)
  const valueExistsInString = (str: string | null, value: string): boolean => {
    if (!str) return false;
    const values = str.split(',').map(v => normalizeValue(v));
    return values.includes(normalizeValue(value));
  };

  // Initialize form data when teacher is selected
  useEffect(() => {
    if (selectedTeacher) {
      // Handle "School Boards Catered" - normalize "ICSE" to "ICSE/ISC"
      let schoolBoards = selectedTeacher["School Boards Catered"];
      if (schoolBoards) {
        // Replace "ICSE" (standalone or as part of comma-separated list) with "ICSE/ISC"
        schoolBoards = schoolBoards
          .split(',')
          .map(board => {
            const trimmed = board.trim();
            // Match "ICSE" but not "ICSE/ISC" (case-insensitive)
            if (trimmed.toLowerCase() === 'icse' && trimmed.toLowerCase() !== 'icse/isc') {
              return 'ICSE/ISC';
            }
            return trimmed;
          })
          .join(', ');
      }
      
      setFormData({
        ...selectedTeacher,
        "School Boards Catered": schoolBoards,
      });
      // Sanitize image URL when loading from database
      const heroImage = selectedTeacher["Hero Image"];
      const sanitizedHeroImage = heroImage ? sanitizeImageUrl(heroImage) : null;
      setImagePreview(sanitizedHeroImage);
    } else {
      setFormData({});
      setImagePreview(null);
    }
  }, [selectedTeacher]);

  const handleInputChange = (field: keyof TeacherData, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-update Classes Taught when Classes Taught for Backend changes (same as teacher dashboard)
      if (field === "Classes Taught for Backend") {
        updated["Classes Taught"] = convertClassesToRoman(value);
      }
      return updated;
    });
  };

  const handleMultiSelectChange = (field: keyof TeacherData, value: string, checked: boolean) => {
    const currentValue = formData[field] as string | null;
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
    if (!selectedTeacher) return;

    try {
      setUploadingImage(true);

      // Compress image before upload
      const options = {
        maxSizeMB: 1, // Maximum size in MB (1MB)
        maxWidthOrHeight: 1920, // Maximum width or height
        useWebWorker: true, // Use web worker for better performance
        fileType: file.type, // Preserve original file type
      };

      let compressedFile: File;
      try {
        compressedFile = await imageCompression(file, options);
        if (import.meta.env.DEV) {
          const originalSize = (file.size / 1024 / 1024).toFixed(2);
          const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2);
          logger.log(`Image compressed: ${originalSize}MB → ${compressedSize}MB`);
        }
      } catch (compressionError) {
        if (import.meta.env.DEV) {
          console.warn('Image compression failed, using original file:', compressionError);
        }
        // If compression fails, use original file
        compressedFile = file;
      }

      // Create a unique filename (use .jpg for compressed images)
      const fileExt = 'jpg'; // Use jpg for better compression
      const fileName = `hero-images/${selectedTeacher.id}-${Date.now()}.${fileExt}`;

      // Upload compressed image to Supabase Storage
      // Note: You'll need to create a 'hero-images' bucket in Supabase Storage
      // and set up appropriate storage policies for admins
      const { data, error } = await supabase.storage
        .from('hero-images')
        .upload(fileName, compressedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpeg' // Set content type for compressed images
        });

      if (error) {
        // If bucket doesn't exist or upload fails, fall back to URL input
        adminToast('Image upload failed. Please use a URL instead or set up the storage bucket.');
        if (import.meta.env.DEV) {
          console.error('Upload error:', error);
        }
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('hero-images')
        .getPublicUrl(data.path);

      // Sanitize the URL before setting (Supabase URLs are safe, but we sanitize for consistency)
      const sanitizedUrl = sanitizeImageUrl(publicUrl);
      if (sanitizedUrl) {
        // Update form data with the sanitized URL
        handleInputChange("Hero Image", sanitizedUrl);
        setImagePreview(sanitizedUrl);
      } else {
        adminToast('Failed to generate valid image URL');
      }
      adminToast('Image uploaded successfully');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error uploading image:', error);
      }
      adminToast('Failed to upload image. Please use a URL instead.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Validate and sanitize image URL to prevent XSS attacks
  // This function ensures user input is properly sanitized before being used in DOM
  const sanitizeImageUrl = (url: string): string | null => {
    if (!url || typeof url !== 'string') return null;
    
    // First, sanitize the URL string using DOMPurify to remove any potential XSS
    // This ensures no malicious scripts or HTML entities are present
    const sanitizedString = DOMPurify.sanitize(url.trim(), { 
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true 
    });
    
    if (!sanitizedString) return null;
    
    // Validate URL format - allow only http/https URLs or safe data URIs
    try {
      const urlObj = new URL(sanitizedString);
      // Allow http/https URLs only
      if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
        // Reconstruct URL from validated parts to ensure it's safe
        // This breaks the taint flow by creating a new URL object
        return urlObj.href;
      }
    } catch {
      // If URL parsing fails, check if it's a safe data URI
      if (sanitizedString.startsWith('data:image/')) {
        // Validate data URI format: data:image/[type];base64,[data]
        // Use RegExp constructor to avoid potential parsing issues with forward slashes
        const dataUriPattern = new RegExp('^data:image/(jpeg|jpg|png|gif|webp);base64,[A-Za-z0-9+/=]+$', 'i');
        const dataUriMatch = sanitizedString.match(dataUriPattern);
        if (dataUriMatch) {
          return sanitizedString;
        }
      }
    }
    return null;
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      adminToast('Please select an image file');
      return;
    }

    // Block HEIC/HEIF formats which most browsers can't display
    const lowerName = file.name.toLowerCase();
    const isHeicLike =
      lowerName.endsWith('.heic') ||
      lowerName.endsWith('.heif') ||
      file.type === 'image/heic' ||
      file.type === 'image/heif';
    if (isHeicLike) {
      adminToast('HEIC images are not supported. Please upload a JPG or PNG image instead.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      adminToast('Image size must be less than 5MB');
      return;
    }

    handleImageUpload(file);
  };

  const handleSave = async () => {
    if (!selectedTeacher) return;

    try {
      setSaving(true);

      // Prepare update data (exclude EXPANDED, Slug, and Area - Area is auto-computed)
      const updateData: any = {};
      Object.keys(formData).forEach((key) => {
        if (key !== 'EXPANDED' && key !== 'Slug' && key !== 'id' && key !== 'Area') {
          updateData[key] = formData[key as keyof TeacherData] ?? null;
        }
      });
      // Always write auto-computed Classes Taught to DB so it is displayed everywhere
      updateData["Classes Taught"] = convertClassesToRoman(formData["Classes Taught for Backend"] ?? null);
      // Normalize Email ID to lowercase for consistent lookup (e.g. TeacherDashboard)
      if (updateData["Email ID"] != null && typeof updateData["Email ID"] === 'string') {
        updateData["Email ID"] = updateData["Email ID"].trim().toLowerCase();
      }

      const { error } = await supabase
        .from('Shikshaqmine')
        .update(updateData)
        .eq('id', selectedTeacher.id);

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error updating teacher:', error);
        }
        adminToast('Failed to update teacher');
        return;
      }

      adminToast('Teacher updated successfully');
      
      // Invalidate cache for this teacher's profile (so changes show immediately)
      if (selectedTeacher.Slug) {
        invalidateTeacherCache(selectedTeacher.Slug);
        // Also clear featured teachers cache and Shikshaqmine chunk caches
        removeCache('featured_teachers_browse');
        removeCache('featured_teachers_index');
        // Clear all Shikshaqmine chunk caches that might include this teacher
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.includes('shikshaq_cache_') && key.includes('shikshaqmine')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      // Fetch updated teacher data
      const { data: updatedTeacher, error: fetchError } = await supabase
        .from('Shikshaqmine')
        .select('*')
        .eq('id', selectedTeacher.id)
        .single();

      if (!fetchError && updatedTeacher) {
        // Update selected teacher
        setSelectedTeacher(updatedTeacher);
        
        // Update teachers list with the updated teacher
        setTeachers((prev) =>
          prev.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t))
        );
        setFilteredTeachers((prev) =>
          prev.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t))
        );
      } else {
        // If fetch failed, refresh entire list
        await fetchTeachers();
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      adminToast('Failed to update teacher');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTeacher) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${selectedTeacher.Title}"? This will remove them from Shikshaqmine and their profile role will be reverted to student.`
    );
    if (!confirmed) return;

    try {
      setDeleting(true);

      const { error } = await supabase
        .from('Shikshaqmine')
        .delete()
        .eq('id', selectedTeacher.id);

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error deleting teacher:', error);
        }
        adminToast('Failed to delete teacher');
        return;
      }

      adminToast(`"${selectedTeacher.Title}" has been deleted`);

      if (selectedTeacher.Slug) {
        invalidateTeacherCache(selectedTeacher.Slug);
        removeCache('featured_teachers_browse');
        removeCache('featured_teachers_index');
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.includes('shikshaq_cache_') && key.includes('shikshaqmine')) {
            localStorage.removeItem(key);
          }
        });
      }

      setSelectedTeacher(null);
      setFormData({});
      setImagePreview(null);
      await fetchTeachers();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      adminToast('Failed to delete teacher');
    } finally {
      setDeleting(false);
    }
  };

  // Field/panel styling reuses AdminConsole's shared tokens (adminFieldStyle/adminPanelStyle)
  // instead of redefining the palette locally, so this form matches every other admin screen.
  const fieldClassName = 'h-auto border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0';
  const labelStyle: React.CSSProperties = { fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary, marginBottom: 6, display: 'block' };
  const optionLabelStyle: React.CSSProperties = { fontSize: 13, color: SURFACE_TOKENS.textBody };

  if (checkingAdmin || loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#F9F5F1' }}>
        <Navbar />
        <main className="flex-1 container mx-auto px-[clamp(16px,3vw,28px)] py-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 rounded mb-8" style={{ background: '#F0EAE2' }} />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 rounded-2xl" style={{ background: '#FCFAF7', boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#F9F5F1' }}>
        <Navbar />
        <main className="flex-1 container mx-auto px-[clamp(16px,3vw,28px)] py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="mb-4" style={{ fontSize: 'clamp(23px,3vw,32px)', fontWeight: 700, color: '#1F1F1F' }}>Access Denied</h1>
            <p className="mb-6" style={{ color: '#7B736B' }}>
              You need to be an admin to access this page.
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <AdminConsole
      activeTab="teachers"
      title="Listed teachers"
      subtitle="Everything currently visible in browse results."
      tint={TEACHERS_TINT}
      tabCount={teachers.length}
    >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Teacher List */}
          <div className="lg:col-span-1">
            <div
              className="sticky top-4"
              style={{ ...adminPanelStyle, padding: 16 }}
            >
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: SURFACE_TOKENS.textTertiary }} />
                  <Input
                    type="text"
                    placeholder="Search teachers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 ${fieldClassName}`}
                    style={adminFieldStyle}
                  />
                </div>
              </div>
              <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {filteredTeachers.length === 0 ? (
                  <p className="text-sm text-center py-4" style={{ color: SURFACE_TOKENS.textSecondary }}>No teachers found</p>
                ) : (
                  filteredTeachers.map((teacher) => {
                    const isSelected = selectedTeacher?.id === teacher.id;
                    return (
                      <button
                        key={teacher.id}
                        onClick={() => setSelectedTeacher(teacher)}
                        className={`w-full text-left transition-colors ${isSelected ? '' : 'hover:bg-black/[.04]'}`}
                        style={{
                          padding: '12px 16px',
                          borderRadius: 14,
                          background: isSelected ? SURFACE_TOKENS.textPrimary : 'transparent',
                          color: isSelected ? '#fff' : SURFACE_TOKENS.textPrimary,
                        }}
                      >
                        <div style={{ fontSize: 15.5, fontWeight: 600 }}>{teacher.Title || 'Untitled'}</div>
                        {teacher.Slug && (
                          <div style={{ fontSize: 12.5, marginTop: 4, color: isSelected ? 'rgba(255,255,255,0.7)' : SURFACE_TOKENS.textTertiary }}>
                            {teacher.Slug}
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Teacher Form */}
          <div className="lg:col-span-2">
            {selectedTeacher ? (
              <div
                className="space-y-6"
                style={{ ...adminPanelStyle, padding: 24 }}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 style={{ fontSize: 'clamp(19px,2.4vw,24px)', fontWeight: 700, color: SURFACE_TOKENS.textPrimary }}>
                      {selectedTeacher.Title || 'Untitled Teacher'}
                    </h2>
                    {selectedTeacher.Slug && (
                      <p style={{ fontSize: 13, color: SURFACE_TOKENS.textTertiary, marginTop: 4 }}>Slug: {selectedTeacher.Slug}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving || deleting}
                      style={adminPrimaryBtnStyle}
                      className="disabled:opacity-60"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={saving || deleting}
                      style={adminDestructiveBtnStyle}
                      className="disabled:opacity-60"
                    >
                      {deleting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name (Title) */}
                  <div>
                    <Label htmlFor="title" style={labelStyle}>Name (Title)</Label>
                    <Input
                      id="title"
                      value={formData.Title || ''}
                      onChange={(e) => handleInputChange('Title', e.target.value)}
                      className={fieldClassName}
                      style={adminFieldStyle}
                    />
                  </div>

                  {/* Featured Subject */}
                  <div>
                    <Label htmlFor="featuredSubject" style={labelStyle}>Featured Subject</Label>
                    <Select
                      value={formData["Featured Subject"] ? formData["Featured Subject"] : "none"}
                      onValueChange={(value) => handleInputChange("Featured Subject", value === "none" ? null : value)}
                    >
                      <SelectTrigger id="featuredSubject" className={fieldClassName} style={adminFieldStyle}>
                        <SelectValue placeholder="Select featured subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {SUBJECTS.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Classes Taught for Backend - display is auto-computed */}
                  <div>
                    <Label style={labelStyle}>Classes Taught <span style={{ color: ACCENT_TOKENS.destructive }}>*</span></Label>
                    <p className="mb-2" style={{ fontSize: 12, color: SURFACE_TOKENS.textTertiary }}>
                      Select the classes. Display format will be automatically computed.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {CLASSES.map((cls) => {
                        const currentValue = formData["Classes Taught for Backend"] as string | null;
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
                            <Label htmlFor={`class-${cls}`} className="cursor-pointer" style={optionLabelStyle}>
                              {cls}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                    {formData["Classes Taught"] != null && formData["Classes Taught"] !== '' && (
                      <div className="mt-2">
                        <Label style={{ fontSize: 12.5, color: SURFACE_TOKENS.textTertiary }}>Classes Taught (Auto-computed):</Label>
                        <Input
                          value={formData["Classes Taught"]}
                          disabled
                          className={`${fieldClassName} mt-1 cursor-not-allowed`}
                          style={{ ...adminFieldStyle, opacity: 0.7 }}
                        />
                      </div>
                    )}
                  </div>

                  {/* School Boards Catered */}
                  <div>
                    <Label style={labelStyle}>School Boards Catered</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {BOARDS.map((board) => {
                        const currentValue = formData["School Boards Catered"] as string | null;
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
                            <Label htmlFor={`board-${board}`} className="cursor-pointer" style={optionLabelStyle}>
                              {board}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Area - Auto-computed from Student's Home Areas and Tutor's Home Areas */}
                  {/* Note: Area field is automatically computed as union of the two area fields */}
                  {/* It is not editable directly - update Student's Home Areas or Tutor's Home Areas instead */}

                  {/* Mode of Teaching */}
                  <div>
                    <Label style={labelStyle}>Mode of Teaching</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {MODE_OF_TEACHING.map((mode) => {
                        const currentValue = formData["Mode of Teaching"] as string | null;
                        const selected = valueExistsInString(currentValue, mode);
                        return (
                          <div key={mode} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mode-${mode}`}
                              checked={selected}
                              onCheckedChange={(checked) =>
                                handleMultiSelectChange("Mode of Teaching", mode, checked as boolean)
                              }
                            />
                            <Label htmlFor={`mode-${mode}`} className="cursor-pointer" style={optionLabelStyle}>
                              {mode}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Subjects (Multiple Select) */}
                  <div>
                    <Label style={labelStyle}>Subjects</Label>
                    <div className="flex flex-wrap gap-2 mt-2 max-h-48 overflow-y-auto">
                      {SUBJECTS.map((subject) => {
                        const currentValue = formData.Subjects as string | null;
                        const selected = valueExistsInString(currentValue, subject);
                        return (
                          <div key={subject} className="flex items-center space-x-2">
                            <Checkbox
                              id={`subject-${subject}`}
                              checked={selected}
                              onCheckedChange={(checked) =>
                                handleMultiSelectChange("Subjects", subject, checked as boolean)
                              }
                            />
                            <Label htmlFor={`subject-${subject}`} className="cursor-pointer" style={optionLabelStyle}>
                              {subject}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <Label htmlFor="phoneNumber" style={labelStyle}>Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={formData["Phone Number"] || ''}
                      onChange={(e) => handleInputChange("Phone Number", e.target.value)}
                      className={fieldClassName}
                      style={adminFieldStyle}
                    />
                  </div>

                  {/* Email ID */}
                  <div>
                    <Label htmlFor="emailId" style={labelStyle}>Email ID</Label>
                    <Input
                      id="emailId"
                      type="email"
                      value={formData["Email ID"] || ''}
                      onChange={(e) => handleInputChange("Email ID", e.target.value)}
                      className={fieldClassName}
                      style={adminFieldStyle}
                    />
                  </div>

                  {/* Featured */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.Featured || false}
                      onCheckedChange={(checked) => handleInputChange("Featured", checked)}
                    />
                    <Label htmlFor="featured" className="cursor-pointer" style={{ fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary }}>
                      Featured
                    </Label>
                  </div>

                  {/* Sir/Ma'am? */}
                  <div>
                    <Label htmlFor="sirMaam" style={labelStyle}>Sir/Ma'am?</Label>
                    <Select
                      value={formData["Sir/Ma'am?"] || "none"}
                      onValueChange={(value) => handleInputChange("Sir/Ma'am?", value === "none" ? null : value)}
                    >
                      <SelectTrigger id="sirMaam" className={fieldClassName} style={adminFieldStyle}>
                        <SelectValue placeholder="Select Sir or Ma'am" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {SIR_MAAM.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Structure of classes (stored as Class Size (Group/ Solo)) */}
                  <div>
                    <Label style={labelStyle}>Structure of classes</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {CLASS_SIZE.map((size) => {
                        const currentValue = formData["Class Size (Group/ Solo)"] as string | null;
                        const selected = valueExistsInString(currentValue, size);
                        return (
                          <div key={size} className="flex items-center space-x-2">
                            <Checkbox
                              id={`classSize-${size}`}
                              checked={selected}
                              onCheckedChange={(checked) =>
                                handleMultiSelectChange("Class Size (Group/ Solo)", size, checked as boolean)
                              }
                            />
                            <Label htmlFor={`classSize-${size}`} className="cursor-pointer" style={optionLabelStyle}>
                              {size === 'Solo' ? 'One-on-one' : size}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hero Image */}
                  <div className="md:col-span-2">
                    <Label htmlFor="heroImage" style={labelStyle}>Hero Image</Label>
                    <div className="space-y-3">
                      {/* Image Preview */}
                      {imagePreview && (() => {
                        // Always sanitize right before rendering to break taint flow
                        // sanitizeImageUrl uses DOMPurify.sanitize() and URL reconstruction (urlObj.href)
                        // which breaks the taint flow by creating a new string from validated URL components
                        const safeUrl = sanitizeImageUrl(imagePreview);
                        if (!safeUrl) {
                          // If URL becomes invalid, clear preview
                          setImagePreview(null);
                          return null;
                        }
                        // Apply DOMPurify as a final sanitization step for defence-in-depth.
                        // CodeQL recognises DOMPurify as a known sanitizer, preventing
                        // "DOM text reinterpreted as HTML" findings.
                        const purifiedSrc = DOMPurify.sanitize(
                          safeUrl ? validateImageSrc(safeUrl) : '',
                          { ALLOWED_TAGS: [], ALLOWED_ATTR: [], KEEP_CONTENT: true }
                        );
                        if (!purifiedSrc) return null;
                        return (
                          <div className="relative w-full max-w-md">
                            <img
                              src={purifiedSrc}
                              alt="Hero preview"
                              className="w-full h-48 object-cover"
                              style={{ borderRadius: 14, boxShadow: `0 0 0 1px ${SURFACE_TOKENS.hairline}` }}
                              onError={() => setImagePreview(null)}
                              crossOrigin="anonymous"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2 border-0"
                              style={{ background: 'rgba(255,255,255,0.9)', color: SURFACE_TOKENS.textPrimary, borderRadius: 10 }}
                              onClick={() => {
                                handleInputChange("Hero Image", null);
                                setImagePreview(null);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        );
                      })()}

                      {/* Upload Button */}
                      <div className="flex gap-2 items-center">
                        <label
                          htmlFor="heroImageUpload"
                          className="flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors hover:bg-black/[.04]"
                          style={{ borderRadius: 12, boxShadow: `0 0 0 1px ${SURFACE_TOKENS.hairline}`, color: SURFACE_TOKENS.textPrimary, fontSize: 13.5, fontWeight: 600 }}
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
                        <span style={{ fontSize: 13, color: SURFACE_TOKENS.textTertiary }}>or</span>
                      </div>

                      {/* URL Input */}
                      <Input
                        id="heroImage"
                        placeholder="Or enter image URL"
                        value={formData["Hero Image"] || ''}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          // Sanitize and validate URL before setting
                          const sanitizedUrl = inputValue ? sanitizeImageUrl(inputValue) : null;
                          if (sanitizedUrl !== null || !inputValue) {
                            handleInputChange("Hero Image", sanitizedUrl || '');
                            setImagePreview(sanitizedUrl);
                          } else {
                            adminToast('Please enter a valid image URL (http:// or https://)');
                          }
                        }}
                        className={fieldClassName}
                        style={adminFieldStyle}
                      />
                      <p style={{ fontSize: 12, color: SURFACE_TOKENS.textTertiary }}>
                        Upload an image file or paste an image URL. Max file size: 5MB
                      </p>
                    </div>
                  </div>

                  {/* Video */}
                  <div>
                    <Label htmlFor="video" style={labelStyle}>Video URL</Label>
                    <Input
                      id="video"
                      value={formData.Video || ''}
                      onChange={(e) => handleInputChange("Video", e.target.value)}
                      className={fieldClassName}
                      style={adminFieldStyle}
                    />
                  </div>

                  {/* Video Link */}
                  <div>
                    <Label htmlFor="videoLink" style={labelStyle}>Video Link</Label>
                    <Input
                      id="videoLink"
                      value={formData["Video Link"] || ''}
                      onChange={(e) => handleInputChange("Video Link", e.target.value)}
                      className={fieldClassName}
                      style={adminFieldStyle}
                    />
                  </div>

                  {/* Link (WhatsApp) */}
                  <div>
                    <Label htmlFor="link" style={labelStyle}>WhatsApp Link</Label>
                    <Input
                      id="link"
                      value={formData.Link || ''}
                      onChange={(e) => handleInputChange("Link", e.target.value)}
                      className={fieldClassName}
                      style={adminFieldStyle}
                    />
                  </div>

                  {/* Location V2 */}
                  <div>
                    <Label htmlFor="locationV2" style={labelStyle}>Location V2</Label>
                    <Select
                      value={formData["LOCATION V2"] || "none"}
                      onValueChange={(value) => handleInputChange("LOCATION V2", value === "none" ? null : value)}
                    >
                      <SelectTrigger id="locationV2" className={fieldClassName} style={adminFieldStyle}>
                        <SelectValue placeholder="Select location option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="TEACHER'S HOME TUTORING">TEACHER'S HOME TUTORING</SelectItem>
                        <SelectItem value="STUDENT'S HOME TUTORING ONLY">STUDENT'S HOME TUTORING ONLY</SelectItem>
                        <SelectItem value="BOTH OPTIONS LISTED">BOTH OPTIONS LISTED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Student's Home Areas */}
                  <div>
                    <Label style={labelStyle}>Student's Home in These Areas</Label>
                    <div className="flex flex-wrap gap-2 mt-2 max-h-48 overflow-y-auto">
                      {AREAS.map((area) => {
                        const currentValue = formData["STUDENT'S HOME IN THESE AREAS"] as string | null;
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
                            <Label htmlFor={`student-area-${area}`} className="cursor-pointer" style={optionLabelStyle}>
                              {area}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tutor's Home Areas */}
                  <div>
                    <Label style={labelStyle}>Tutor's Home in These Areas</Label>
                    <div className="flex flex-wrap gap-2 mt-2 max-h-48 overflow-y-auto">
                      {AREAS.map((area) => {
                        const currentValue = formData["TUTOR'S HOME IN THESE AREAS"] as string | null;
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
                            <Label htmlFor={`tutor-area-${area}`} className="cursor-pointer" style={optionLabelStyle}>
                              {area}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <Label htmlFor="description" style={labelStyle}>Description</Label>
                    <Textarea
                      id="description"
                      value={formData.Description || ''}
                      onChange={(e) => handleInputChange("Description", e.target.value)}
                      rows={5}
                      className="border-0"
                      style={{ ...adminFieldStyle, minHeight: 120, paddingTop: 12 }}
                    />
                  </div>

                  {/* Qualifications etc */}
                  <div className="md:col-span-2">
                    <Label htmlFor="qualifications" style={labelStyle}>Qualifications etc</Label>
                    <Textarea
                      id="qualifications"
                      value={formData["Qualifications etc"] || ''}
                      onChange={(e) => handleInputChange("Qualifications etc", e.target.value)}
                      rows={3}
                      className="border-0"
                      style={{ ...adminFieldStyle, minHeight: 90, paddingTop: 12 }}
                    />
                  </div>

                  {/* Year they started teaching */}
                  <div>
                    <Label htmlFor="yearsStarted" style={labelStyle}>Year they started teaching</Label>
                    <Input
                      id="yearsStarted"
                      value={formData["Years they started teaching"] || ''}
                      onChange={(e) => handleInputChange("Years they started teaching", e.target.value)}
                      className={fieldClassName}
                      style={adminFieldStyle}
                    />
                  </div>

                  {/* Min Fees */}
                  <div>
                    <Label htmlFor="minFees" style={labelStyle}>Minimum Fees per Month (₹)</Label>
                    <Input
                      id="minFees"
                      type="tel"
                      value={formData["Min Fees"]?.toString() || ''}
                      onChange={(e) => {
                        // Only allow digits, limit to 6 digits
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                        handleInputChange("Min Fees", digits ? parseInt(digits) : null);
                      }}
                      placeholder="e.g., 2000"
                      maxLength={6}
                      inputMode="numeric"
                      className={fieldClassName}
                      style={adminFieldStyle}
                    />
                    <p style={{ fontSize: 12, color: SURFACE_TOKENS.textTertiary, marginTop: 4 }}>Optional - Enter minimum monthly fees</p>
                  </div>

                  {/* Max Fees */}
                  <div>
                    <Label htmlFor="maxFees" style={labelStyle}>Maximum Fees per Month (₹)</Label>
                    <Input
                      id="maxFees"
                      type="tel"
                      value={formData["Max Fees"]?.toString() || ''}
                      onChange={(e) => {
                        // Only allow digits, limit to 6 digits
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                        handleInputChange("Max Fees", digits ? parseInt(digits) : null);
                      }}
                      placeholder="e.g., 5000"
                      maxLength={6}
                      inputMode="numeric"
                      className={fieldClassName}
                      style={adminFieldStyle}
                    />
                    <p style={{ fontSize: 12, color: SURFACE_TOKENS.textTertiary, marginTop: 4 }}>Optional - Enter maximum monthly fees</p>
                  </div>

                  {/* Review 1 */}
                  <div className="md:col-span-2">
                    <Label htmlFor="review1" style={labelStyle}>Review 1</Label>
                    <Textarea
                      id="review1"
                      value={formData["Review 1"] || ''}
                      onChange={(e) => handleInputChange("Review 1", e.target.value)}
                      rows={3}
                      className="border-0"
                      style={{ ...adminFieldStyle, minHeight: 90, paddingTop: 12 }}
                    />
                  </div>

                  {/* Review 2 */}
                  <div className="md:col-span-2">
                    <Label htmlFor="review2" style={labelStyle}>Review 2</Label>
                    <Textarea
                      id="review2"
                      value={formData["Review 2"] || ''}
                      onChange={(e) => handleInputChange("Review 2", e.target.value)}
                      rows={3}
                      className="border-0"
                      style={{ ...adminFieldStyle, minHeight: 90, paddingTop: 12 }}
                    />
                  </div>

                  {/* Review 3 */}
                  <div className="md:col-span-2">
                    <Label htmlFor="review3" style={labelStyle}>Review 3</Label>
                    <Textarea
                      id="review3"
                      value={formData["Review 3"] || ''}
                      onChange={(e) => handleInputChange("Review 3", e.target.value)}
                      rows={3}
                      className="border-0"
                      style={{ ...adminFieldStyle, minHeight: 90, paddingTop: 12 }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="text-center"
                style={{ ...adminPanelStyle, padding: 48 }}
              >
                <p style={{ color: SURFACE_TOKENS.textTertiary, fontSize: 14.5 }}>Select a teacher from the list to edit</p>
              </div>
            )}
          </div>
        </div>
    </AdminConsole>
  );
}

