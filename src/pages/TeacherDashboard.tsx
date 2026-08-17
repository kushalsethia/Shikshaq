import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PreFooter, preFooterFor } from '@/components/layout/PreFooter';
import { Sticker } from '@/components/ui/sticker';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Save, Lock, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { convertClassesToRoman } from '@/utils/romanNumerals';
import { sanitizeImageUrl, validateImageSrc } from '@/utils/imageSanitizer';
import DOMPurify from 'dompurify';
import { invalidateTeacherCache, removeCache } from '@/utils/cache';
import imageCompression from 'browser-image-compression';

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
  "TEACHER'S HOME TUTORING",
  "STUDENT'S HOME TUTORING ONLY",
  "BOTH OPTIONS LISTED"
];

const SCHOOL_BOARDS = ['ICSE', 'CBSE', 'IGCSE', 'IB', 'State', 'N/A'];

const CLASS_NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'UG'];

const SUBJECTS = [
  'Accounts', 'ACT', 'AP', 'Bengali', 'Biology', 'Business Studies', 'CA', 'CAT', 'Chemistry',
  'CLAT', 'Commerce', 'Computers', 'Drawing & Painting', 'Economics', 'English', 'Environmental Science',
  'Geography', 'Hindi', 'History & Civics', 'Home Science', 'JEE', 'Legal Studies', 'Maths',
  'NEET', 'NMAT', 'Physics', 'Political Science', 'Psychology', 'SAT', 'Science',
  'Sanskrit', 'Social Studies', 'Sociology'
];

const MODE_OF_TEACHING = ['Online', 'Offline'];

const CLASS_SIZE = ['Group', 'Solo'];

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
  "Link": string | null;
  Subjects: string | null;
  "Mode of Teaching": string | null;
  "Class Size (Group/ Solo)": string | null;
  "Min Fees": number | null;
  "Max Fees": number | null;
  Slug: string | null;
  /**
   * Self-service pause toggle (design_handoff_shikshaq/pages/TeacherDashboard.md "Pause listing").
   * Column added via supabase/migrations/20260812060000_add_is_paused_to_shikshaqmine.sql — this
   * migration has been applied to the live database, but src/integrations/supabase/types.ts has
   * not yet been regenerated, so the generated Shikshaqmine Row/Update types below still don't
   * know about it. Read/written below via `ShikshaqmineRowWithPause`/`ShikshaqmineUpdateWithPause`
   * (narrow additions of just this one column) instead of a blanket `as any`, same as the
   * pre-existing "Min Fees"/"Max Fees" handling in this file. Once the types are regenerated,
   * these two aliases and their casts can be dropped in favor of the real generated types.
   */
  is_paused: boolean;
}

type ShikshaqmineRow = Database['public']['Tables']['Shikshaqmine']['Row'];
type ShikshaqmineUpdate = Database['public']['Tables']['Shikshaqmine']['Update'];
/** `data` from a `Shikshaqmine` select, with the not-yet-generated `is_paused` column added. */
type ShikshaqmineRowWithPause = ShikshaqmineRow & { is_paused: boolean | null };
/** Payload for a `Shikshaqmine` update that includes the not-yet-generated `is_paused` column. */
type ShikshaqmineUpdateWithPause = ShikshaqmineUpdate & { is_paused: boolean };

// Profile form field/label/panel styling, on the token system so the long editable form below
// matches the rest of the page instead of falling back to shadcn's bare default input styling.
const FIELD_CLASSNAME =
  'h-auto min-h-12 rounded-lg border-0 bg-background text-base shadow-border focus-visible:ring-0 focus-visible:ring-offset-0';
const LOCKED_FIELD_CLASSNAME = `${FIELD_CLASSNAME} cursor-not-allowed opacity-70`;
const LABEL_CLASSNAME = 'mb-1.5 block text-sm font-semibold text-foreground';
const HELP_TEXT_CLASSNAME = 'text-xs text-muted-foreground';
const OPTION_GROUP_CLASSNAME = 'rounded-2xl bg-background shadow-border';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [pausing, setPausing] = useState(false);
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number | null>(null);
  // Set when the Shikshaqmine lookup/write by profile.email fails to find a matching row — lets
  // the "not found" screen tell the teacher which email to reference when contacting support,
  // instead of the old dead-end "Teacher profile not found" toast with no recovery path.
  const [lookupFailedEmail, setLookupFailedEmail] = useState<string | null>(null);
  const profileFormRef = useRef<HTMLDivElement>(null);

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
          // profile.email didn't match any "Email ID" in Shikshaqmine — surface the email so the
          // teacher has something concrete to give support instead of a dead-end toast.
          setLookupFailedEmail(profile.email);
          setLoading(false);
          return;
        }

        // Normalize phone number to 10 digits (remove 91 prefix if present)
        let phoneNumber = data["Phone Number"] || null;
        if (phoneNumber) {
          const digits = phoneNumber.replace(/\D/g, '');
          if (digits.length === 12 && digits.startsWith('91')) {
            // Remove 91 prefix, keep last 10 digits
            phoneNumber = digits.slice(2);
          } else if (digits.length > 10) {
            // Take last 10 digits
            phoneNumber = digits.slice(-10);
          } else if (digits.length === 10) {
            phoneNumber = digits;
          } else {
            phoneNumber = null;
          }
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
          "Phone Number": phoneNumber,
          "Hero Image": data["Hero Image"] || null,
          "Classes Taught for Backend": data["Classes Taught for Backend"] || null,
          "Classes Taught": data["Classes Taught"] || null,
          Title: data["Title"] || null,
          "Sir/Ma'am?": data["Sir/Ma'am?"] || null,
          Area: data["Area"] || null,
          "Link": data["Link"] || null,
          Subjects: data["Subjects"] || null,
          "Mode of Teaching": data["Mode of Teaching"] || null,
          "Class Size (Group/ Solo)": data["Class Size (Group/ Solo)"] || null,
          "Min Fees": (data as any)["Min Fees"] || null,
          "Max Fees": (data as any)["Max Fees"] || null,
          Slug: data["Slug"] || null,
          is_paused: Boolean((data as ShikshaqmineRowWithPause)["is_paused"]),
        };

        setTeacherData(teacher);
        setImagePreview(teacher["Hero Image"]);
        setIsPaused(teacher.is_paused);
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

  // Real "Upvotes"/"Reviews" stat-card counts. teacher_upvotes/teacher_comments both key off
  // teachers_list.id (not the Shikshaqmine row), so this looks that id up by slug first.
  useEffect(() => {
    async function fetchCounts() {
      const slug = teacherData?.Slug;
      if (!slug) return;

      try {
        const { data: listRow } = await supabase
          .from('teachers_list')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();

        if (!listRow) return;

        const [{ count: upvotes }, { count: reviews }] = await Promise.all([
          supabase.from('teacher_upvotes').select('id', { count: 'exact', head: true }).eq('teacher_id', listRow.id),
          supabase.from('teacher_comments').select('id', { count: 'exact', head: true }).eq('teacher_id', listRow.id).eq('approved', true),
        ]);

        setUpvoteCount(upvotes ?? 0);
        setReviewCount(reviews ?? 0);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching upvote/review counts:', error);
        }
      }
    }

    fetchCounts();
  }, [teacherData?.Slug]);

  // "Pause your listing" — flips the self-service is_paused flag (see the TeacherData interface
  // note above), reverting on failure. Browse/search now filter on is_paused too (see Browse.tsx),
  // so pausing here does hide the profile from public results, not just this dashboard's pill.
  // Confirmation is handled by the AlertDialog below (pauseDialogOpen); this just performs the toggle.
  const handlePauseToggle = async () => {
    if (!user || !teacherData) return;

    const nextPaused = !isPaused;
    const previousPaused = isPaused;
    setIsPaused(nextPaused); // optimistic
    setPausing(true);

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile?.email) {
        throw new Error('Email not found');
      }

      const { error } = await supabase
        .from('Shikshaqmine')
        .update({ is_paused: nextPaused } as ShikshaqmineUpdateWithPause)
        .eq('Email ID', profile.email);

      if (error) throw error;

      setTeacherData((prev) => (prev ? { ...prev, is_paused: nextPaused } : prev));
      toast.success(nextPaused ? 'Listing paused.' : 'Listing resumed.');
    } catch (error) {
      setIsPaused(previousPaused);
      if (import.meta.env.DEV) {
        console.error('Error toggling pause state:', error);
      }
      toast.error("Couldn't update your listing status. Try again shortly.");
    } finally {
      setPausing(false);
    }
  };

  // "Request a review" — copies the teacher's public profile link so they can send it to a
  // current student. No new backend: the review form students use already lives on that page.
  const handleRequestReview = async () => {
    const slug = teacherData?.Slug;
    if (!slug) {
      toast.error('Add your profile details first.');
      return;
    }
    const url = `${window.location.origin}/tuition-teachers/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Review link copied.');
    } catch {
      toast.error('Could not copy the link. Copy it from your profile page instead.');
    }
  };

  const scrollToProfileForm = () => {
    profileFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Helper function to check if value exists in comma-separated string
  const valueExistsInString = (str: string | null, value: string): boolean => {
    if (!str) return false;
    return str.split(',').some((item) => item.trim() === value);
  };

  const handleInputChange = (field: keyof TeacherData, value: string | null) => {
    setTeacherData((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [field]: value };

      // Auto-clear Featured Subject if it's no longer in the selected Subjects
      if (field === "Subjects") {
        const selectedSubjects = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];
        if (updated["Featured Subject"] && !selectedSubjects.includes(updated["Featured Subject"])) {
          updated["Featured Subject"] = null;
        }
      }

      // Auto-update Classes Taught when Classes Taught for Backend changes
      if (field === "Classes Taught for Backend") {
        const romanClasses = convertClassesToRoman(value);
        updated["Classes Taught"] = romanClasses;
      }

      // Auto-generate WhatsApp link when Phone Number changes
      if (field === "Phone Number") {
        if (value && value.trim()) {
          // Extract only digits from phone number
          const phoneDigits = value.replace(/\D/g, '');
          // If it's exactly 10 digits, generate WhatsApp link
          if (phoneDigits.length === 10) {
            updated["Link"] = `https://wa.me/91${phoneDigits}`;
          } else if (phoneDigits.length > 10) {
            // If more than 10 digits, take the last 10
            const last10Digits = phoneDigits.slice(-10);
            updated["Link"] = `https://wa.me/91${last10Digits}`;
          } else {
            // If less than 10 digits, clear the WhatsApp link
            updated["Link"] = null;
          }
        } else {
          // If phone number is cleared, clear WhatsApp link
          updated["Link"] = null;
        }
      }

      // Clear areas when Location V2 changes
      if (field === "LOCATION V2") {
        const locationV2 = value as string | null;
        // If switching to "TEACHER'S HOME TUTORING", clear student's home areas
        if (locationV2 === "TEACHER'S HOME TUTORING") {
          updated["STUDENT'S HOME IN THESE AREAS"] = null;
        }
        // If switching to "STUDENT'S HOME TUTORING ONLY", clear tutor's home areas
        if (locationV2 === "STUDENT'S HOME TUTORING ONLY") {
          updated["TUTOR'S HOME IN THESE AREAS"] = null;
        }
      }

      return updated;
    });
  };

  // "Min Fees"/"Max Fees" are the only numeric fields on TeacherData — handleInputChange above is
  // typed for the string fields that make up the rest of the form, so this is a small dedicated
  // setter for the two numeric ones rather than widening handleInputChange's value type (which
  // would remove the string narrowing that its Subjects/Classes Taught/Phone Number branches rely on).
  const handleFeeChange = (field: 'Min Fees' | 'Max Fees', value: number | null) => {
    setTeacherData((prev) => (prev ? { ...prev, [field]: value } : prev));
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

  // Helper function to check if form is valid
  const isFormValid = (): boolean => {
    if (!teacherData) return false;

    // Check phone number (must be 10 digits)
    if (!teacherData["Phone Number"] || teacherData["Phone Number"].replace(/\D/g, '').length !== 10) {
      return false;
    }

    // Check Location V2 (Place of Teaching)
    if (!teacherData["LOCATION V2"]) {
      return false;
    }

    // Check areas based on Location V2
    const locationV2 = teacherData["LOCATION V2"];
    if (locationV2 === "STUDENT'S HOME TUTORING ONLY" || locationV2 === "BOTH OPTIONS LISTED") {
      if (!teacherData["STUDENT'S HOME IN THESE AREAS"] || !teacherData["STUDENT'S HOME IN THESE AREAS"].trim()) {
        return false;
      }
    }

    if (locationV2 === "TEACHER'S HOME TUTORING" || locationV2 === "BOTH OPTIONS LISTED") {
      if (!teacherData["TUTOR'S HOME IN THESE AREAS"] || !teacherData["TUTOR'S HOME IN THESE AREAS"].trim()) {
        return false;
      }
    }

    // Check Subjects (required)
    if (!teacherData.Subjects || !teacherData.Subjects.trim()) {
      return false;
    }

    // Check School Boards Catered (required)
    if (!teacherData["School Boards Catered"] || !teacherData["School Boards Catered"].trim()) {
      return false;
    }

    // Check Classes Taught (required)
    if (!teacherData["Classes Taught for Backend"] || !teacherData["Classes Taught for Backend"].trim()) {
      return false;
    }

    // Check Mode of Teaching (required)
    if (!teacherData["Mode of Teaching"] || !teacherData["Mode of Teaching"].trim()) {
      return false;
    }

    // Check Class Size (required)
    if (!teacherData["Class Size (Group/ Solo)"] || !teacherData["Class Size (Group/ Solo)"].trim()) {
      return false;
    }

    return true;
  };

  const handleImageUpload = async (file: File) => {
    if (!user || !teacherData) return;

    try {
      setUploadingImage(true);

      // Get old image URL before uploading new one
      const oldImageUrl = teacherData["Hero Image"];

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

      // Create a unique filename (use .jpg for compressed images to ensure compatibility)
      const fileExt = 'jpg'; // Use jpg for better compression
      const fileName = `hero-images/${user.id}-${Date.now()}.${fileExt}`;

      // Upload compressed image to Supabase Storage
      const { data, error } = await supabase.storage
        .from('hero-images')
        .upload(fileName, compressedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpeg' // Set content type for compressed images
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
                logger.log('Successfully deleted old image:', pathToDelete);
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

      // Block HEIC/HEIF formats which most browsers can't display
      const lowerName = file.name.toLowerCase();
      const isHeicLike =
        lowerName.endsWith('.heic') ||
        lowerName.endsWith('.heif') ||
        file.type === 'image/heic' ||
        file.type === 'image/heif';
      if (isHeicLike) {
        toast.error('HEIC images are not supported. Please upload a JPG or PNG image instead.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      handleImageUpload(file);
    }
  };

  const handleSave = async () => {
    if (!user || !teacherData) return;

    // Validate required fields
    if (!teacherData["Phone Number"] || teacherData["Phone Number"].replace(/\D/g, '').length !== 10) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    if (!teacherData["LOCATION V2"]) {
      toast.error('Place of Teaching is required');
      return;
    }

    // Validate areas based on Location V2
    const locationV2 = teacherData["LOCATION V2"];
    if (locationV2 === "STUDENT'S HOME TUTORING ONLY" || locationV2 === "BOTH OPTIONS LISTED") {
      if (!teacherData["STUDENT'S HOME IN THESE AREAS"] || !teacherData["STUDENT'S HOME IN THESE AREAS"].trim()) {
        toast.error('Student\'s Home in These Areas is required');
        return;
      }
    }

    if (locationV2 === "TEACHER'S HOME TUTORING" || locationV2 === "BOTH OPTIONS LISTED") {
      if (!teacherData["TUTOR'S HOME IN THESE AREAS"] || !teacherData["TUTOR'S HOME IN THESE AREAS"].trim()) {
        toast.error('Tutor\'s Home in These Areas is required');
        return;
      }
    }

    // Validate Subjects (required)
    if (!teacherData.Subjects || !teacherData.Subjects.trim()) {
      toast.error('Please select at least one subject');
      return;
    }

    // Validate School Boards Catered (required)
    if (!teacherData["School Boards Catered"] || !teacherData["School Boards Catered"].trim()) {
      toast.error('Please select at least one school board');
      return;
    }

    // Validate Classes Taught (required)
    if (!teacherData["Classes Taught for Backend"] || !teacherData["Classes Taught for Backend"].trim()) {
      toast.error('Please select at least one class');
      return;
    }

    // Validate Mode of Teaching (required)
    if (!teacherData["Mode of Teaching"] || !teacherData["Mode of Teaching"].trim()) {
      toast.error('Please select a mode of teaching');
      return;
    }

    // Validate Class Size (required)
    if (!teacherData["Class Size (Group/ Solo)"] || !teacherData["Class Size (Group/ Solo)"].trim()) {
      toast.error('Please select structure of classes');
      return;
    }

    setSaving(true);

    try {
      // Get user's email to find their record
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile?.email) {
        toast.error(
          "We couldn't find an email on your account, so we can't save your listing. Contact support@shikshaq.com for help."
        );
        setSaving(false);
        return;
      }

      // Normalize phone number to 10 digits before saving
      let normalizedPhoneNumber: string | null = null;
      if (teacherData["Phone Number"]) {
        const digits = teacherData["Phone Number"].replace(/\D/g, '');
        if (digits.length === 10) {
          normalizedPhoneNumber = digits;
        } else if (digits.length > 10) {
          // Take last 10 digits
          normalizedPhoneNumber = digits.slice(-10);
        } else if (digits.length === 12 && digits.startsWith('91')) {
          // Remove 91 prefix
          normalizedPhoneNumber = digits.slice(2);
        }
      }

      // Auto-generate WhatsApp link if phone number is valid
      let whatsappLink: string | null = teacherData["Link"] || null;
      if (normalizedPhoneNumber && normalizedPhoneNumber.length === 10) {
        whatsappLink = `https://wa.me/91${normalizedPhoneNumber}`;
      } else if (!normalizedPhoneNumber) {
        whatsappLink = null;
      }

      // Prepare update data
      // Use profile email (locked field) instead of teacherData email
      const updateData: any = {
        "Email ID": profile.email, // Use locked email from profile
        Description: teacherData["Description"] || null,
        "LOCATION V2": teacherData["LOCATION V2"] || null,
        "STUDENT'S HOME IN THESE AREAS": teacherData["STUDENT'S HOME IN THESE AREAS"] || null,
        "TUTOR'S HOME IN THESE AREAS": teacherData["TUTOR'S HOME IN THESE AREAS"] || null,
        "Qualifications etc": teacherData["Qualifications etc"] || null,
        "Years they started teaching": teacherData["Years they started teaching"] || null,
        "Featured Subject": teacherData["Featured Subject"] || null,
        "School Boards Catered": teacherData["School Boards Catered"] || null,
        "Phone Number": normalizedPhoneNumber,
        "Hero Image": teacherData["Hero Image"] || null,
        "Classes Taught for Backend": teacherData["Classes Taught for Backend"] || null,
        "Classes Taught": convertClassesToRoman(teacherData["Classes Taught for Backend"]) || null, // always write computed value to DB
        "Link": whatsappLink,
        Subjects: teacherData.Subjects || null,
        "Mode of Teaching": teacherData["Mode of Teaching"] || null,
        "Class Size (Group/ Solo)": teacherData["Class Size (Group/ Solo)"] || null,
        "Min Fees": teacherData["Min Fees"] || null,
        "Max Fees": teacherData["Max Fees"] || null,
      };

      // Get the teacher's slug before updating (for cache invalidation)
      const { data: teacherRecord } = await supabase
        .from('Shikshaqmine')
        .select('Slug')
        .eq('Email ID', profile.email)
        .maybeSingle();

      // No matching "Email ID" row to update — same email-match fragility as the initial fetch.
      // Surface it with a concrete next step instead of a silent no-op save.
      if (!teacherRecord) {
        toast.error(
          `We couldn't find a listing matching ${profile.email}. Contact support@shikshaq.com with this email so we can fix the mismatch.`
        );
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from('Shikshaqmine')
        .update(updateData)
        .eq('Email ID', profile.email);

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error updating teacher data:', error);
        }
        toast.error('Failed to update profile. Please try again, or contact support@shikshaq.com if it persists.');
        setSaving(false);
        return;
      }

      // Invalidate cache for this teacher's profile
      if (teacherRecord?.Slug) {
        invalidateTeacherCache(teacherRecord.Slug);
      }

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
        <main className="container pt-8 pb-16">
          <div className="animate-pulse">
            <div className="mb-7 h-8 w-56 rounded-lg bg-muted" />
            <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-muted" />
              ))}
            </div>
            <div className="grid gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-2xl bg-muted" />
              ))}
            </div>
          </div>
        </main>
        <PreFooter variant={preFooterFor(location.pathname)} />
        <Footer />
      </div>
    );
  }

  if (!teacherData) {
    // Email-match failure: profile.email had no matching "Email ID" row in Shikshaqmine. Give the
    // teacher a concrete next step — their account email to quote to support — rather than a
    // generic "account required" dead end.
    if (lookupFailedEmail) {
      return (
        <div className="min-h-screen bg-background">
          <main className="container py-16 pb-16 text-center sm:py-20">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              We couldn't find your teacher listing
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Your account email doesn't match any listing in our system, so we can't load your
              profile. This usually means your listing was created under a different email address.
            </p>
            <p className="mt-4 text-sm font-semibold text-foreground">
              Contact support at{' '}
              <a href="mailto:support@shikshaq.com" className="text-brand-blue underline underline-offset-2">
                support@shikshaq.com
              </a>{' '}
              and include this email:
            </p>
            <p className="mt-1 text-sm font-semibold text-brand-blue">{lookupFailedEmail}</p>
            <Button className="mt-6" onClick={() => navigate('/')}>
              Go Home
            </Button>
          </main>
          <PreFooter variant={preFooterFor(location.pathname)} />
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <main className="container py-16 pb-16 text-center sm:py-20">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {user ? 'Teacher account required' : 'Sign in required'}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {user
              ? "We couldn't find a teacher profile for your account. If you believe this is a mistake, contact support."
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

  // Get user email and name (locked fields)
  const userEmail = user?.email || teacherData["Email ID"] || '';
  const userName = teacherData["Title"] || user?.user_metadata?.full_name || '';

  // "{name}, {honorific}" per TeacherDashboard.md's header, same rule TeacherCard.tsx uses:
  // omit the comma entirely when there's no recognisable honorific.
  const honorific = teacherData["Sir/Ma'am?"];
  const displayName = (() => {
    const name = userName || 'Your profile';
    if (!honorific) return name;
    const lower = String(honorific).toLowerCase().trim();
    let h: string | null = null;
    if (lower === 'sir' || lower.includes('sir')) h = 'Sir';
    else if (lower === "ma'am" || lower === 'maam' || lower.includes("ma'am")) h = "Ma'am";
    return h ? `${name}, ${h}` : name;
  })();

  // Derived, read-only summary values from the already-fetched teacherData (no new fetching/logic)
  const subjectsList = (teacherData.Subjects || '').split(',').map((s) => s.trim()).filter(Boolean);
  const boardsList = (teacherData["School Boards Catered"] || '').split(',').map((s) => s.trim()).filter(Boolean);

  // "subjects · boards · classes · area", per spec.
  const summaryParts = [
    subjectsList.length ? subjectsList.slice(0, 3).join(', ') + (subjectsList.length > 3 ? ` +${subjectsList.length - 3} more` : '') : null,
    boardsList.length ? boardsList.join(', ') : null,
    teacherData["Classes Taught"] || null,
    teacherData.Area || null,
  ].filter(Boolean);
  const summaryLine = summaryParts.length
    ? summaryParts.join(' · ')
    : 'Fill in your subjects, boards, classes and area to complete your profile';

  // Two stat cards, both real, live counts from teacher_upvotes/teacher_comments.
  //
  // "Profile views" and "Enquiries" tiles were removed rather than shipped as permanent
  // placeholders. Neither has a real data source today: WhatsApp-click tracking
  // (src/pages/WhatsAppRedirect.tsx) only reaches GA4/Clarity, never Supabase, and profile
  // views aren't tracked anywhere. A real "Enquiries" count would need, at minimum:
  //   1. A Supabase table (e.g. `whatsapp_clicks(teacher_id, created_at)`, insert-only, with an
  //      RLS policy that allows anonymous inserts scoped to a valid teacher id) written to from
  //      WhatsAppRedirect.tsx at the point it already calls trackWhatsAppClick/trackWhatsAppClickGA.
  //   2. A read path here (count query keyed by teachers_list.id, same join this file already
  //      does for upvotes/reviews above) once that table exists.
  //   3. Regenerating src/integrations/supabase/types.ts after the migration lands.
  // That's a schema change outside this file's ownership, so the tiles are removed instead of
  // left showing '—' forever.
  // Squircle stat-tile treatment (learning-education-squircles reference): a different flat
  // token fill per tile. Kept neutral/mint — no brand orange/blue — so the accent budget stays
  // spent on the "Save Changes" CTA and the live/paused status pill.
  const teacherStats = [
    { label: 'Upvotes', value: upvoteCount ?? '—', meta: 'All time', fill: 'bg-mint' },
    { label: 'Reviews', value: reviewCount ?? '—', meta: 'All time', fill: 'bg-card shadow-border' },
  ];

  // Profile-completeness bar — derived from already-loaded teacherData, no new fetching.
  // Mirrors the required-field checklist isFormValid() already uses, plus the two optional
  // fields (description, hero image) that most affect how complete a listing feels.
  // design.md §4 (S10): "a profile-completeness bar with a next-step line" — a plain bar, not a
  // ring; GoalRing is reserved for the weekly paper-reading goal only.
  const completenessChecks: { ok: boolean; label: string; action: string }[] = [
    { ok: Boolean(teacherData["Hero Image"]), label: 'photo', action: 'Add a profile photo' },
    { ok: Boolean(teacherData["Description"]), label: 'introduction', action: 'Write your profile introduction' },
    { ok: Boolean(teacherData["Phone Number"]), label: 'phone', action: 'Add your phone number' },
    { ok: Boolean(teacherData["LOCATION V2"]), label: 'place of teaching', action: 'Set where you teach' },
    { ok: Boolean(teacherData.Subjects), label: 'subjects', action: 'Pick the subjects you teach' },
    { ok: Boolean(teacherData["School Boards Catered"]), label: 'boards', action: 'Pick the boards you cover' },
    { ok: Boolean(teacherData["Classes Taught for Backend"]), label: 'classes', action: 'Pick the classes you teach' },
    { ok: Boolean(teacherData["Mode of Teaching"]), label: 'mode', action: 'Set your mode of teaching' },
    { ok: Boolean(teacherData["Class Size (Group/ Solo)"]), label: 'structure', action: 'Set your class structure' },
  ];
  const completenessFilled = completenessChecks.filter((c) => c.ok).length;
  const completenessTotal = completenessChecks.length;
  const completenessPct = Math.round((completenessFilled / completenessTotal) * 100);
  const nextCompletenessStep = completenessChecks.find((c) => !c.ok)?.action ?? null;

  return (
    <div className="min-h-screen bg-background">

      <main className="container pt-8 pb-16">
        {/* Header — orange slab, teacher mode (design.md §4 S10) */}
        <div className="relative overflow-visible rounded-3xl bg-brand p-4 text-brand-foreground shadow-glow-brand sm:p-6">
          {!isPaused && (
            <Sticker tone="brand" tilt={-3} size={30} className="!bg-panel !text-background">
              Live profile
            </Sticker>
          )}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-page-title font-extrabold tracking-tight">
                {displayName}
              </h1>
              <p className="mt-2 text-body-secondary opacity-90">
                {summaryLine}
              </p>
            </div>
            <span
              className={`flex flex-none items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
                isPaused ? 'bg-panel text-background' : 'bg-card text-foreground'
              }`}
            >
              {isPaused ? 'Paused' : 'Profile live'}
            </span>
          </div>

          {/* Completeness bar — names one next action, never a ring (ring is the weekly paper
              goal only). */}
          <div className="mt-6 rounded-2xl bg-card/95 p-4 text-foreground sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold">Profile completeness</span>
              <span className="text-sm font-semibold tabular-nums text-warm-meta">{completenessPct}%</span>
            </div>
            <div aria-hidden className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-brand transition-[width] duration-300 ease-settle"
                style={{ width: `${completenessPct}%` }}
              />
            </div>
            <p className="mt-2 text-body-secondary text-warm-prose">
              {nextCompletenessStep ? nextCompletenessStep : 'Your profile has everything filled in.'}
            </p>
          </div>
        </div>

        {/* Stat tiles — 2x2 (design.md §4 S10). Profile views / WhatsApp taps have no real data
            source yet (see final report O-04) so this stays the two real counts the dashboard can
            actually query, rather than inventing the other two tiles. */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {teacherStats.map((st) => (
            <div key={st.label} className={`rounded-2xl p-4 sm:p-6 ${st.fill}`}>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {st.label}
              </div>
              <div className="mt-2 text-3xl font-semibold tracking-tight tabular-nums text-foreground">
                {st.value}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{st.meta}</div>
            </div>
          ))}
        </div>

        {/* Your profile */}
        <h2 className="mt-8 mb-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Your profile
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          <button
            type="button"
            onClick={scrollToProfileForm}
            className="block w-full rounded-2xl bg-card p-4 text-left shadow-border transition-transform duration-150 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-6"
          >
            <span className="block text-base font-semibold text-foreground">Edit your profile</span>
            <span className="mt-1.5 block text-sm text-muted-foreground">
              Subjects, classes, boards, areas and fee range.
            </span>
          </button>
          <button
            type="button"
            onClick={() => setPauseDialogOpen(true)}
            disabled={pausing}
            className="block w-full rounded-2xl bg-card p-4 text-left shadow-border transition-transform duration-150 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 disabled:opacity-60 sm:p-6"
          >
            <span className="block text-base font-semibold text-foreground">
              {isPaused ? 'Resume your listing' : 'Pause your listing'}
            </span>
            <span className="mt-1.5 block text-sm text-muted-foreground">
              {isPaused
                ? 'Your profile is hidden from students until you resume it.'
                : 'Hide your profile from results while your batches are full.'}
            </span>
          </button>
          <button
            type="button"
            onClick={handleRequestReview}
            className="block w-full rounded-2xl bg-card p-4 text-left shadow-border transition-transform duration-150 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-6"
          >
            <span className="block text-base font-semibold text-foreground">Request a review</span>
            <span className="mt-1.5 block text-sm text-muted-foreground">
              Send a link to a current student asking them to review you.
            </span>
          </button>
        </div>

        {/* Account Information — locked fields, shown as a stacked list of row cards.
            Not part of the new spec's top section; kept here, right above the editable form it
            summarises, since Name/Honorific/Email are real locked account data this page has
            always surfaced and nowhere else on the page shows them. */}
        <h2 className="mt-8 mb-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Account Information
        </h2>
        <div className="mb-6 grid gap-2.5">
          {[
            { label: 'Name', value: userName },
            { label: 'Honorific', value: teacherData["Sir/Ma'am?"] },
            { label: 'Email ID', value: teacherData["Email ID"] },
          ].map((row) => (
            <div
              key={row.label}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card p-4 shadow-border sm:p-5"
            >
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {row.label}
                </div>
                <div className="mt-1 text-base font-semibold text-foreground">
                  {row.value || '-'}
                </div>
              </div>
              <span className="flex flex-none items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Lock className="h-3.5 w-3.5" />
                Locked
              </span>
            </div>
          ))}
        </div>

        {/* Profile Form */}
        <div ref={profileFormRef} id="profile-form" className="scroll-mt-24 rounded-2xl bg-card p-5 shadow-border sm:p-8">
            {/* Editable Fields Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Profile Information</h2>
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

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className={LABEL_CLASSNAME}>
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  value={teacherData["Phone Number"] || ''}
                  onChange={(e) => {
                    // Only allow digits, limit to 10 digits
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                    handleInputChange("Phone Number", digits || null);
                  }}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="10 digit number"
                  maxLength={10}
                  required
                  className={FIELD_CLASSNAME}
                />
                <p className={HELP_TEXT_CLASSNAME}>
                  Enter 10 digit phone number. WhatsApp link will be auto-generated.
                </p>
                {teacherData["Link"] && (
                  <p className="text-xs text-brand-blue">
                    WhatsApp link: {teacherData["Link"]}
                  </p>
                )}
              </div>

              {/* Profile Image */}
              <div className="space-y-2">
                <Label className={LABEL_CLASSNAME}>Profile Image</Label>
                {imagePreview && (() => {
                  // Apply DOMPurify as final sanitization — CodeQL recognises it as a known sanitizer
                  const safeSrc = DOMPurify.sanitize(validateImageSrc(imagePreview), {
                    ALLOWED_TAGS: [], ALLOWED_ATTR: [], KEEP_CONTENT: true,
                  });
                  if (!safeSrc) return null;
                  return (
                  <div className="relative mb-4 w-full max-w-md">
                    <img
                      src={safeSrc}
                      alt="Hero preview"
                      loading="lazy"
                      className="h-48 w-full rounded-lg object-cover shadow-border"
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
                  );
                })()}

                <label
                  htmlFor="heroImageUpload"
                  className="flex w-fit cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-foreground shadow-border transition-colors duration-150 hover:bg-muted"
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
                <p className={HELP_TEXT_CLASSNAME}>
                  Max 5MB. Supported formats: JPG, PNG, GIF, WebP
                </p>
              </div>

              {/* Profile Introduction */}
              <div className="space-y-2">
                <Label htmlFor="description" className={LABEL_CLASSNAME}>Profile Introduction</Label>
                <Textarea
                  id="description"
                  value={teacherData["Description"] || ''}
                  onChange={(e) => handleInputChange("Description", e.target.value || null)}
                  rows={5}
                  placeholder="Write about your teaching experience, methodology, and what makes you unique..."
                  maxLength={1000}
                  className={`${FIELD_CLASSNAME} min-h-[130px] py-3`}
                />
                <p className={HELP_TEXT_CLASSNAME}>Max 1000 characters</p>
              </div>

              {/* Subjects (Multiple Select) */}
              <div className="space-y-2">
                <Label className={LABEL_CLASSNAME}>
                  Subjects <span className="text-destructive">*</span>
                </Label>
                <div className={`mt-2 flex max-h-48 flex-wrap gap-2 overflow-y-auto p-4 ${OPTION_GROUP_CLASSNAME}`}>
                  {SUBJECTS.map((subject) => {
                    const currentValue = teacherData.Subjects as string | null;
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
                        <Label htmlFor={`subject-${subject}`} className="cursor-pointer text-sm text-warm-prose">
                          {subject}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Featured Subject */}
              <div className="space-y-2">
                <Label htmlFor="featuredSubject" className={LABEL_CLASSNAME}>Featured Subject</Label>
                <Select
                  value={teacherData["Featured Subject"] || "none"}
                  onValueChange={(value) => handleInputChange("Featured Subject", value === "none" ? null : value)}
                >
                  <SelectTrigger id="featuredSubject" className={FIELD_CLASSNAME}>
                    <SelectValue placeholder="Select featured subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {(teacherData.Subjects || '').split(',').map(s => s.trim()).filter(Boolean).map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className={HELP_TEXT_CLASSNAME}>
                  Choose one of your selected subjects to feature on your profile
                </p>
              </div>

              {/* School Boards Catered */}
              <div className="space-y-2">
                <Label className={LABEL_CLASSNAME}>
                  School Boards Catered <span className="text-destructive">*</span>
                </Label>
                <div className={`mt-2 flex flex-wrap gap-2 p-4 ${OPTION_GROUP_CLASSNAME}`}>
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
                        <Label htmlFor={`board-${board}`} className="cursor-pointer text-sm text-warm-prose">
                          {board}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Classes Taught */}
              <div className="space-y-2">
                <Label className={LABEL_CLASSNAME}>
                  Classes Taught <span className="text-destructive">*</span>
                </Label>
                <p className={`${HELP_TEXT_CLASSNAME} mb-2`}>
                  Select the classes you teach. Display format will be automatically computed.
                </p>
                <div className={`mt-2 flex flex-wrap gap-2 p-4 ${OPTION_GROUP_CLASSNAME}`}>
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
                        <Label htmlFor={`class-${cls}`} className="cursor-pointer text-sm text-warm-prose">
                          {cls}
                        </Label>
                      </div>
                    );
                  })}
                </div>
                {/* Show Classes Taught (read-only) */}
                {teacherData["Classes Taught"] && (
                  <div className="mt-2">
                    <Label className="text-sm text-warm-meta">Classes Taught (Auto-computed):</Label>
                    <Input
                      value={teacherData["Classes Taught"]}
                      disabled
                      className={`${LOCKED_FIELD_CLASSNAME} mt-1`}
                    />
                  </div>
                )}
              </div>

              {/* Mode of Teaching — segmented pill toggle (2 fixed options, still multi-select:
                  a teacher offering both Online and Offline taps both pills on). */}
              <div className="space-y-2">
                <Label className={LABEL_CLASSNAME}>
                  Mode of Teaching <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-wrap gap-2 mt-2" role="group" aria-label="Mode of teaching">
                  {MODE_OF_TEACHING.map((mode) => {
                    const currentValue = teacherData["Mode of Teaching"] as string | null;
                    const selected = valueExistsInString(currentValue, mode);
                    return (
                      <button
                        key={mode}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => handleMultiSelectChange("Mode of Teaching", mode, !selected)}
                        className={`min-h-11 rounded-full px-4 text-sm font-semibold transition-colors duration-150 ${
                          selected
                            ? 'bg-brand-blue text-brand-blue-foreground'
                            : 'bg-muted text-foreground hover:bg-accent'
                        }`}
                      >
                        {mode}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Structure of classes (stored as Class Size (Group/ Solo)) — segmented pill
                  toggle (2 fixed options), same multi-select semantics as above. */}
              <div className="space-y-2">
                <Label className={LABEL_CLASSNAME}>
                  Structure of classes <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-wrap gap-2 mt-2" role="group" aria-label="Structure of classes">
                  {CLASS_SIZE.map((size) => {
                    const currentValue = teacherData["Class Size (Group/ Solo)"] as string | null;
                    const selected = valueExistsInString(currentValue, size);
                    return (
                      <button
                        key={size}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => handleMultiSelectChange("Class Size (Group/ Solo)", size, !selected)}
                        className={`min-h-11 rounded-full px-4 text-sm font-semibold transition-colors duration-150 ${
                          selected
                            ? 'bg-brand-blue text-brand-blue-foreground'
                            : 'bg-muted text-foreground hover:bg-accent'
                        }`}
                      >
                        {size === 'Solo' ? 'One-on-one' : size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Place of Teaching (Location V2) */}
              <div className="space-y-2">
                <Label htmlFor="locationV2" className={LABEL_CLASSNAME}>
                  Place of Teaching <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={teacherData["LOCATION V2"] || "__none__"}
                  onValueChange={(value) => handleInputChange("LOCATION V2", value === "__none__" ? "" : value)}
                >
                  <SelectTrigger id="locationV2" className={FIELD_CLASSNAME}>
                    <SelectValue placeholder="Select place of teaching" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None</SelectItem>
                    <SelectItem value="TEACHER'S HOME TUTORING">Teacher's Home Tutoring Only</SelectItem>
                    <SelectItem value="STUDENT'S HOME TUTORING ONLY">Student's Home Tutoring Only</SelectItem>
                    <SelectItem value="BOTH OPTIONS LISTED">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Student's Home Areas - Show when Place of Teaching is "STUDENT'S HOME TUTORING ONLY" or "BOTH OPTIONS LISTED" */}
              {(teacherData["LOCATION V2"] === "STUDENT'S HOME TUTORING ONLY" || teacherData["LOCATION V2"] === "BOTH OPTIONS LISTED") && (
                <div className="space-y-2">
                  <Label className={LABEL_CLASSNAME}>
                    Student's Home in These Areas <span className="text-destructive">*</span>
                  </Label>
                  <div className={`mt-2 flex max-h-48 flex-wrap gap-2 overflow-y-auto p-4 ${OPTION_GROUP_CLASSNAME}`}>
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
                            required={teacherData["LOCATION V2"] === "STUDENT'S HOME TUTORING ONLY" || teacherData["LOCATION V2"] === "BOTH OPTIONS LISTED"}
                          />
                          <Label htmlFor={`student-area-${area}`} className="cursor-pointer text-sm text-warm-prose">
                            {area}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tutor's Home Areas - Show when Place of Teaching is "TEACHER'S HOME TUTORING" or "BOTH OPTIONS LISTED" */}
              {(teacherData["LOCATION V2"] === "TEACHER'S HOME TUTORING" || teacherData["LOCATION V2"] === "BOTH OPTIONS LISTED") && (
                <div className="space-y-2">
                  <Label className={LABEL_CLASSNAME}>
                    Tutor's Home in These Areas <span className="text-destructive">*</span>
                  </Label>
                  <div className={`mt-2 flex max-h-48 flex-wrap gap-2 overflow-y-auto p-4 ${OPTION_GROUP_CLASSNAME}`}>
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
                            required={teacherData["LOCATION V2"] === "TEACHER'S HOME TUTORING" || teacherData["LOCATION V2"] === "BOTH OPTIONS LISTED"}
                          />
                          <Label htmlFor={`tutor-area-${area}`} className="cursor-pointer text-sm text-warm-prose">
                            {area}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Area (read-only, auto-computed) */}
              <div className="space-y-2">
                <Label className={LABEL_CLASSNAME}>Area (Auto-computed)</Label>
                <Input
                  value={teacherData["Area"] || 'Will be computed automatically when you save'}
                  disabled
                  className={LOCKED_FIELD_CLASSNAME}
                />
                <p className={HELP_TEXT_CLASSNAME}>
                  This field is automatically computed from Student's Home Areas and Tutor's Home Areas
                </p>
              </div>

              {/* Educational Qualifications */}
              <div className="space-y-2">
                <Label htmlFor="qualifications" className={LABEL_CLASSNAME}>Educational Qualifications</Label>
                <Textarea
                  id="qualifications"
                  value={teacherData["Qualifications etc"] || ''}
                  onChange={(e) => handleInputChange("Qualifications etc", e.target.value || null)}
                  rows={3}
                  placeholder="List your educational qualifications, certifications, etc."
                  maxLength={500}
                  className={`${FIELD_CLASSNAME} min-h-[90px] py-3`}
                />
                <p className={HELP_TEXT_CLASSNAME}>Max 500 characters</p>
              </div>

              {/* Year you started teaching */}
              <div className="space-y-2">
                <Label htmlFor="yearsStarted" className={LABEL_CLASSNAME}>Year you started teaching</Label>
                <Input
                  id="yearsStarted"
                  value={teacherData["Years they started teaching"] || ''}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                    handleInputChange("Years they started teaching", digits || null);
                  }}
                  type="text"
                  placeholder="e.g. 2015"
                  maxLength={4}
                  inputMode="numeric"
                  className={FIELD_CLASSNAME}
                />
                <p className={HELP_TEXT_CLASSNAME}>Numbers only, up to 4 digits</p>
              </div>

              {/* Fee range - same line on all screen sizes */}
              <div className="space-y-2">
                <Label className={LABEL_CLASSNAME}>Fee range</Label>
                <div className="flex flex-row gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <Label htmlFor="minFees" className="mb-1.5 block text-sm font-normal text-warm-meta">Min (₹)</Label>
                    <Input
                      id="minFees"
                      type="tel"
                      value={teacherData["Min Fees"]?.toString() || ''}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                        handleFeeChange("Min Fees", digits ? parseInt(digits) : null);
                      }}
                      placeholder="e.g., 2000"
                      maxLength={6}
                      inputMode="numeric"
                      className={FIELD_CLASSNAME}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label htmlFor="maxFees" className="mb-1.5 block text-sm font-normal text-warm-meta">Max (₹)</Label>
                    <Input
                      id="maxFees"
                      type="tel"
                      value={teacherData["Max Fees"]?.toString() || ''}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                        handleFeeChange("Max Fees", digits ? parseInt(digits) : null);
                      }}
                      placeholder="e.g., 5000"
                      maxLength={6}
                      inputMode="numeric"
                      className={FIELD_CLASSNAME}
                    />
                  </div>
                </div>
                <p className={HELP_TEXT_CLASSNAME}>Optional</p>
              </div>
            </div>
        </div>
      </main>

      <AlertDialog open={pauseDialogOpen} onOpenChange={setPauseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isPaused ? 'Resume your listing?' : 'Pause your listing?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isPaused
                ? 'Your profile will show as live and reappear in Browse and search results.'
                : 'Your profile will be hidden from Browse and search results until you resume it.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setPauseDialogOpen(false);
                handlePauseToggle();
              }}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PreFooter variant={preFooterFor(location.pathname)} />
      <Footer />
    </div>
  );
}
