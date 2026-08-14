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
import { Save, Lock, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { convertClassesToRoman } from '@/utils/romanNumerals';
import { sanitizeImageUrl, validateImageSrc } from '@/utils/imageSanitizer';
import DOMPurify from 'dompurify';
import { invalidateTeacherCache, removeCache } from '@/utils/cache';
import imageCompression from 'browser-image-compression';
import { SURFACE_TOKENS, ACCENT_TOKENS } from '@/utils/searchFacets';

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
   * Column added via supabase/migrations/20260812060000_add_is_paused_to_shikshaqmine.sql — not
   * yet in the generated Database types, so it's read/written with an `as any` cast below, same
   * as the pre-existing "Min Fees"/"Max Fees" handling in this file.
   */
  is_paused: boolean;
}

// Profile form field/label/panel styling, derived from this page's own SURFACE_TOKENS/ACCENT_TOKENS
// — the same tokens the header, stat tiles and action cards above already use — so the long
// editable form below matches the rest of the page instead of falling back to shadcn's bare
// default input styling.
const FIELD_STYLE: React.CSSProperties = {
  background: SURFACE_TOKENS.shell,
  boxShadow: `0 0 0 1px ${SURFACE_TOKENS.hairline}`,
  borderRadius: 12,
  minHeight: 48,
};
const LOCKED_FIELD_STYLE: React.CSSProperties = { ...FIELD_STYLE, opacity: 0.7 };
const FIELD_CLASSNAME = 'h-auto border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0';
const LABEL_STYLE: React.CSSProperties = { fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary, marginBottom: 6, display: 'block' };
const HELP_TEXT_STYLE: React.CSSProperties = { fontSize: 12.5, color: SURFACE_TOKENS.textTertiary };
const OPTION_GROUP_STYLE: React.CSSProperties = {
  background: SURFACE_TOKENS.shell,
  boxShadow: `0 0 0 1px ${SURFACE_TOKENS.hairline}`,
  borderRadius: 14,
};

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [pausing, setPausing] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number | null>(null);
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
          toast.error('Teacher profile not found. Please contact support.');
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
          is_paused: Boolean((data as any)["is_paused"]),
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

  // "Pause your listing" — confirms, then flips the self-service is_paused flag (see the
  // TeacherData interface note above), reverting on failure. Scoped to this dashboard's own
  // status pill today: it does not yet hide the profile from public Browse/search results.
  const handlePauseToggle = async () => {
    if (!user || !teacherData) return;

    const nextPaused = !isPaused;
    const confirmed = window.confirm(
      nextPaused
        ? 'Pause your listing? Your profile will show as paused until you resume it.'
        : 'Resume your listing? Your profile will show as live again.'
    );
    if (!confirmed) return;

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
        .update({ is_paused: nextPaused } as any)
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
        toast.error('Email not found. Please contact support.');
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
      <div style={{ minHeight: '100vh', background: SURFACE_TOKENS.shell }}>
        <Navbar />
        <main style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,3vw,28px) 56px' }}>
          <div className="animate-pulse">
            <div style={{ height: 32, width: 220, borderRadius: 10, background: '#F0EAE2', marginBottom: 28 }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 40 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ height: 96, borderRadius: 20, background: '#F0EAE2' }} />
              ))}
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{ height: 64, borderRadius: 18, background: '#F0EAE2' }} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!teacherData) {
    return (
      <div style={{ minHeight: '100vh', background: SURFACE_TOKENS.shell }}>
        <Navbar />
        <main style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,3vw,28px) 56px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(23px,3vw,32px)', fontWeight: 700, color: '#1F1F1F', marginBottom: 12 }}>
            {user ? 'Teacher account required' : 'Sign in required'}
          </h1>
          <p style={{ color: '#7B736B', marginBottom: 24 }}>
            {user
              ? "We couldn't find a teacher profile for your account. If you believe this is a mistake, contact support."
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

  // Four stat cards per spec, in order: profile views, WhatsApp enquiries, upvotes, reviews.
  // The first two have no Supabase-backed source today — WhatsApp-click tracking only reaches
  // GA4/Clarity (src/utils/clarityEvents.ts, gaEvents.ts), never Supabase, and profile views
  // aren't tracked anywhere yet — so they're shown as honestly untracked rather than a fabricated
  // number. Upvotes/reviews are real, live counts from teacher_upvotes/teacher_comments.
  const teacherStats = [
    { label: 'Profile views', value: '—', meta: 'Not tracked yet' },
    { label: 'Enquiries', value: '—', meta: 'Not tracked yet' },
    { label: 'Upvotes', value: upvoteCount ?? '—', meta: 'All time' },
    { label: 'Reviews', value: reviewCount ?? '—', meta: 'All time' },
  ];

  // "Recent enquiries" has the same gap: WhatsApp clicks are anonymous (no visitor identity is
  // ever captured — see WhatsAppRedirect.tsx), so there is no real per-enquiry row to show. This
  // stays a real, currently-empty list rather than the prototype's sample names/classes.
  const enquiries: { id: string; initial: string; name: string; meta: string; when: string }[] = [];

  return (
    <div style={{ minHeight: '100vh', background: SURFACE_TOKENS.shell }}>
      <Navbar />

      <main style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,3vw,28px) 56px' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(25px,3.4vw,38px)', lineHeight: 1, fontWeight: 700, color: '#1F1F1F' }}>
              {displayName}
            </h1>
            <p style={{ marginTop: 10, fontSize: 15, color: '#7B736B' }}>
              {summaryLine}
            </p>
          </div>
          <span
            style={{
              flex: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 15px', borderRadius: 999,
              fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
              background: isPaused ? SURFACE_TOKENS.mutedFill : ACCENT_TOKENS.settledBg,
              color: isPaused ? SURFACE_TOKENS.textBody : ACCENT_TOKENS.settledText,
            }}
          >
            {isPaused ? 'Paused' : 'Profile live'}
          </span>
        </div>

        {/* Stat tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginTop: 28 }}>
          {teacherStats.map((st) => (
            <div key={st.label} style={{ padding: 22, borderRadius: 20, background: '#FCFAF7', boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: '#8B837A' }}>
                {st.label}
              </div>
              <div style={{ marginTop: 10, fontSize: 30, fontWeight: 800, letterSpacing: '-.04em', color: '#1F1F1F' }}>
                {st.value}
              </div>
              <div style={{ marginTop: 4, fontSize: 12.5, color: '#8B837A' }}>{st.meta}</div>
            </div>
          ))}
        </div>

        {/* Recent enquiries */}
        <h2 style={{ marginTop: 44, fontSize: 'clamp(21px,2.4vw,26px)', fontWeight: 700, color: '#1F1F1F' }}>
          Recent enquiries
        </h2>
        {enquiries.length > 0 ? (
          <>
            <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
              {enquiries.slice(0, 10).map((en) => (
                <div
                  key={en.id}
                  style={{
                    display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16,
                    padding: '18px 20px', borderRadius: 18, background: '#FCFAF7', boxShadow: '0 0 0 1px rgba(0,0,0,.06)',
                  }}
                >
                  <span
                    style={{
                      flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 42, height: 42, borderRadius: 13, background: SURFACE_TOKENS.mutedFill, fontSize: 15, fontWeight: 700,
                    }}
                  >
                    {en.initial}
                  </span>
                  <span style={{ flex: '1 1 160px', minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 15, fontWeight: 600 }}>{en.name}</span>
                    <span style={{ display: 'block', marginTop: 3, fontSize: 13, color: '#8B837A' }}>{en.meta}</span>
                  </span>
                  <span style={{ fontSize: 12.5, color: '#8B837A' }}>{en.when}</span>
                  <button
                    type="button"
                    style={{
                      flex: 'none', minHeight: 44, padding: '12px 18px', borderRadius: 12,
                      background: ACCENT_TOKENS.whatsappBg, color: ACCENT_TOKENS.whatsappText, fontSize: 13.5, fontWeight: 700,
                    }}
                  >
                    Reply on WhatsApp
                  </button>
                </div>
              ))}
            </div>
            {enquiries.length >= 10 && (
              <div style={{ marginTop: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#8B837A' }}>See all →</span>
              </div>
            )}
          </>
        ) : (
          <p style={{ marginTop: 16, fontSize: 15, color: '#7B736B' }}>No enquiries recorded yet.</p>
        )}

        {/* Your profile */}
        <h2 style={{ marginTop: 44, fontSize: 'clamp(21px,2.4vw,26px)', fontWeight: 700, color: '#1F1F1F' }}>
          Your profile
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 14, marginTop: 16 }}>
          <button
            type="button"
            onClick={scrollToProfileForm}
            className="block w-full text-left transition-transform duration-200 [transition-timing-function:ease] hover:-translate-y-[3px] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            style={{ padding: 22, borderRadius: 20, background: '#FCFAF7', boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }}
          >
            <span style={{ display: 'block', fontSize: 16.5, fontWeight: 700, color: '#1F1F1F' }}>Edit your profile</span>
            <span style={{ display: 'block', marginTop: 7, fontSize: 13.5, lineHeight: 1.55, color: '#7B736B' }}>
              Subjects, classes, boards, areas and fee range.
            </span>
          </button>
          <button
            type="button"
            onClick={handlePauseToggle}
            disabled={pausing}
            className="block w-full text-left transition-transform duration-200 [transition-timing-function:ease] hover:-translate-y-[3px] motion-reduce:transition-none motion-reduce:hover:translate-y-0 disabled:opacity-60"
            style={{ padding: 22, borderRadius: 20, background: '#FCFAF7', boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }}
          >
            <span style={{ display: 'block', fontSize: 16.5, fontWeight: 700, color: '#1F1F1F' }}>
              {isPaused ? 'Resume your listing' : 'Pause your listing'}
            </span>
            <span style={{ display: 'block', marginTop: 7, fontSize: 13.5, lineHeight: 1.55, color: '#7B736B' }}>
              {isPaused
                ? 'Your profile is hidden from students until you resume it.'
                : 'Hide your profile from results while your batches are full.'}
            </span>
          </button>
          <button
            type="button"
            onClick={handleRequestReview}
            className="block w-full text-left transition-transform duration-200 [transition-timing-function:ease] hover:-translate-y-[3px] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            style={{ padding: 22, borderRadius: 20, background: '#FCFAF7', boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }}
          >
            <span style={{ display: 'block', fontSize: 16.5, fontWeight: 700, color: '#1F1F1F' }}>Request a review</span>
            <span style={{ display: 'block', marginTop: 7, fontSize: 13.5, lineHeight: 1.55, color: '#7B736B' }}>
              Send a link to a current student asking them to review you.
            </span>
          </button>
        </div>

        {/* Account Information — locked fields, shown as a stacked list of row cards.
            Not part of the new spec's top section; kept here, right above the editable form it
            summarises, since Name/Honorific/Email are real locked account data this page has
            always surfaced and nowhere else on the page shows them. */}
        <h2 style={{ marginTop: 44, fontSize: 'clamp(21px,2.4vw,26px)', fontWeight: 700, color: '#1F1F1F', marginBottom: 16 }}>
          Account Information
        </h2>
        <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
          {[
            { label: 'Name', value: userName },
            { label: 'Honorific', value: teacherData["Sir/Ma'am?"] },
            { label: 'Email ID', value: teacherData["Email ID"] },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                padding: '18px 20px', borderRadius: 18, background: '#FCFAF7', boxShadow: '0 0 0 1px rgba(0,0,0,.06)',
                display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: '#8B837A' }}>
                  {row.label}
                </div>
                <div style={{ marginTop: 4, fontSize: 15, fontWeight: 600, color: '#1F1F1F' }}>
                  {row.value || '-'}
                </div>
              </div>
              <span style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#8B837A' }}>
                <Lock className="w-3.5 h-3.5" />
                Locked
              </span>
            </div>
          ))}
        </div>

        {/* Profile Form */}
        <div ref={profileFormRef} id="profile-form" style={{ scrollMarginTop: 96, background: SURFACE_TOKENS.field, borderRadius: 20, boxShadow: '0 0 0 1px rgba(0,0,0,.06)', padding: 'clamp(20px,3vw,32px)' }}>
            {/* Editable Fields Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 style={{ fontSize: 'clamp(21px,2.4vw,26px)', fontWeight: 700, color: SURFACE_TOKENS.textPrimary }}>Profile Information</h2>
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
                <Label htmlFor="phoneNumber" style={LABEL_STYLE}>
                  Phone Number <span style={{ color: '#B3261E' }}>*</span>
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
                  style={FIELD_STYLE}
                />
                <p className="text-xs" style={HELP_TEXT_STYLE}>
                  Enter 10 digit phone number. WhatsApp link will be auto-generated.
                </p>
                {teacherData["Link"] && (
                  <p className="text-xs text-primary">
                    WhatsApp link: {teacherData["Link"]}
                  </p>
                )}
              </div>

              {/* Profile Image */}
              <div className="space-y-2">
                <Label style={LABEL_STYLE}>Profile Image</Label>
                {imagePreview && (() => {
                  // Apply DOMPurify as final sanitization — CodeQL recognises it as a known sanitizer
                  const safeSrc = DOMPurify.sanitize(validateImageSrc(imagePreview), {
                    ALLOWED_TAGS: [], ALLOWED_ATTR: [], KEEP_CONTENT: true,
                  });
                  if (!safeSrc) return null;
                  return (
                  <div className="relative w-full max-w-md mb-4">
                    <img
                      src={safeSrc}
                      alt="Hero preview"
                      className="w-full h-48 object-cover"
                      style={{ borderRadius: 14, boxShadow: `0 0 0 1px ${SURFACE_TOKENS.hairline}` }}
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
                  className="flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors hover:bg-black/[.04] w-fit"
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
                <p className="text-xs" style={HELP_TEXT_STYLE}>
                  Max 5MB. Supported formats: JPG, PNG, GIF, WebP
                </p>
              </div>

              {/* Profile Introduction */}
              <div className="space-y-2">
                <Label htmlFor="description" style={LABEL_STYLE}>Profile Introduction</Label>
                <Textarea
                  id="description"
                  value={teacherData["Description"] || ''}
                  onChange={(e) => handleInputChange("Description", e.target.value || null)}
                  rows={5}
                  placeholder="Write about your teaching experience, methodology, and what makes you unique..."
                  maxLength={1000}
                  className={`${FIELD_CLASSNAME} py-3`}
                  style={{ ...FIELD_STYLE, minHeight: 130 }}
                />
                <p className="text-xs" style={HELP_TEXT_STYLE}>Max 1000 characters</p>
              </div>

              {/* Subjects (Multiple Select) */}
              <div className="space-y-2">
                <Label style={LABEL_STYLE}>
                  Subjects <span style={{ color: '#B3261E' }}>*</span>
                </Label>
                <div className="flex flex-wrap gap-2 mt-2 max-h-48 overflow-y-auto p-4" style={OPTION_GROUP_STYLE}>
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
                        <Label htmlFor={`subject-${subject}`} className="cursor-pointer text-sm" style={{ color: SURFACE_TOKENS.textBody }}>
                          {subject}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Featured Subject */}
              <div className="space-y-2">
                <Label htmlFor="featuredSubject" style={LABEL_STYLE}>Featured Subject</Label>
                <Select
                  value={teacherData["Featured Subject"] || "none"}
                  onValueChange={(value) => handleInputChange("Featured Subject", value === "none" ? null : value)}
                >
                  <SelectTrigger id="featuredSubject" className={FIELD_CLASSNAME} style={FIELD_STYLE}>
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
                <p className="text-xs" style={HELP_TEXT_STYLE}>
                  Choose one of your selected subjects to feature on your profile
                </p>
              </div>

              {/* School Boards Catered */}
              <div className="space-y-2">
                <Label style={LABEL_STYLE}>
                  School Boards Catered <span style={{ color: '#B3261E' }}>*</span>
                </Label>
                <div className="flex flex-wrap gap-2 mt-2 p-4" style={OPTION_GROUP_STYLE}>
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
                        <Label htmlFor={`board-${board}`} className="cursor-pointer text-sm" style={{ color: SURFACE_TOKENS.textBody }}>
                          {board}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Classes Taught */}
              <div className="space-y-2">
                <Label style={LABEL_STYLE}>
                  Classes Taught <span style={{ color: '#B3261E' }}>*</span>
                </Label>
                <p className="text-xs mb-2" style={HELP_TEXT_STYLE}>
                  Select the classes you teach. Display format will be automatically computed.
                </p>
                <div className="flex flex-wrap gap-2 mt-2 p-4" style={OPTION_GROUP_STYLE}>
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
                        <Label htmlFor={`class-${cls}`} className="cursor-pointer text-sm" style={{ color: SURFACE_TOKENS.textBody }}>
                          {cls}
                        </Label>
                      </div>
                    );
                  })}
                </div>
                {/* Show Classes Taught (read-only) */}
                {teacherData["Classes Taught"] && (
                  <div className="mt-2">
                    <Label style={{ fontSize: 13, color: SURFACE_TOKENS.textTertiary }}>Classes Taught (Auto-computed):</Label>
                    <Input
                      value={teacherData["Classes Taught"]}
                      disabled
                      className={`${FIELD_CLASSNAME} mt-1 cursor-not-allowed`}
                      style={LOCKED_FIELD_STYLE}
                    />
                  </div>
                )}
              </div>

              {/* Mode of Teaching */}
              <div className="space-y-2">
                <Label style={LABEL_STYLE}>
                  Mode of Teaching <span style={{ color: '#B3261E' }}>*</span>
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {MODE_OF_TEACHING.map((mode) => {
                    const currentValue = teacherData["Mode of Teaching"] as string | null;
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
                        <Label htmlFor={`mode-${mode}`} className="cursor-pointer" style={{ color: SURFACE_TOKENS.textBody }}>
                          {mode}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Structure of classes (stored as Class Size (Group/ Solo)) */}
              <div className="space-y-2">
                <Label style={LABEL_STYLE}>
                  Structure of classes <span style={{ color: '#B3261E' }}>*</span>
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {CLASS_SIZE.map((size) => {
                    const currentValue = teacherData["Class Size (Group/ Solo)"] as string | null;
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
                        <Label htmlFor={`classSize-${size}`} className="cursor-pointer" style={{ color: SURFACE_TOKENS.textBody }}>
                          {size === 'Solo' ? 'One-on-one' : size}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Place of Teaching (Location V2) */}
              <div className="space-y-2">
                <Label htmlFor="locationV2" style={LABEL_STYLE}>
                  Place of Teaching <span style={{ color: '#B3261E' }}>*</span>
                </Label>
                <Select
                  value={teacherData["LOCATION V2"] || "__none__"}
                  onValueChange={(value) => handleInputChange("LOCATION V2", value === "__none__" ? "" : value)}
                >
                  <SelectTrigger id="locationV2" className={FIELD_CLASSNAME} style={FIELD_STYLE}>
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
                  <Label style={LABEL_STYLE}>
                    Student's Home in These Areas <span style={{ color: '#B3261E' }}>*</span>
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2 max-h-48 overflow-y-auto p-4" style={OPTION_GROUP_STYLE}>
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
                          <Label htmlFor={`student-area-${area}`} className="cursor-pointer text-sm" style={{ color: SURFACE_TOKENS.textBody }}>
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
                  <Label style={LABEL_STYLE}>
                    Tutor's Home in These Areas <span style={{ color: '#B3261E' }}>*</span>
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2 max-h-48 overflow-y-auto p-4" style={OPTION_GROUP_STYLE}>
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
                          <Label htmlFor={`tutor-area-${area}`} className="cursor-pointer text-sm" style={{ color: SURFACE_TOKENS.textBody }}>
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
                <Label style={LABEL_STYLE}>Area (Auto-computed)</Label>
                <Input
                  value={teacherData["Area"] || 'Will be computed automatically when you save'}
                  disabled
                  className={`${FIELD_CLASSNAME} cursor-not-allowed`}
                  style={LOCKED_FIELD_STYLE}
                />
                <p className="text-xs" style={HELP_TEXT_STYLE}>
                  This field is automatically computed from Student's Home Areas and Tutor's Home Areas
                </p>
              </div>

              {/* Educational Qualifications */}
              <div className="space-y-2">
                <Label htmlFor="qualifications" style={LABEL_STYLE}>Educational Qualifications</Label>
                <Textarea
                  id="qualifications"
                  value={teacherData["Qualifications etc"] || ''}
                  onChange={(e) => handleInputChange("Qualifications etc", e.target.value || null)}
                  rows={3}
                  placeholder="List your educational qualifications, certifications, etc."
                  maxLength={500}
                  className={`${FIELD_CLASSNAME} py-3`}
                  style={{ ...FIELD_STYLE, minHeight: 90 }}
                />
                <p className="text-xs" style={HELP_TEXT_STYLE}>Max 500 characters</p>
              </div>

              {/* Year you started teaching */}
              <div className="space-y-2">
                <Label htmlFor="yearsStarted" style={LABEL_STYLE}>Year you started teaching</Label>
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
                  style={FIELD_STYLE}
                />
                <p className="text-xs" style={HELP_TEXT_STYLE}>Numbers only, up to 4 digits</p>
              </div>

              {/* Fee range - same line on all screen sizes */}
              <div className="space-y-2">
                <Label className="text-base" style={LABEL_STYLE}>Fee range</Label>
                <div className="flex flex-row gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <Label htmlFor="minFees" className="text-sm font-normal" style={{ color: SURFACE_TOKENS.textTertiary, marginBottom: 6, display: 'block' }}>Min (₹)</Label>
                    <Input
                      id="minFees"
                      type="tel"
                      value={teacherData["Min Fees"]?.toString() || ''}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                        handleInputChange("Min Fees", digits ? parseInt(digits) : null);
                      }}
                      placeholder="e.g., 2000"
                      maxLength={6}
                      inputMode="numeric"
                      className={FIELD_CLASSNAME}
                      style={FIELD_STYLE}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label htmlFor="maxFees" className="text-sm font-normal" style={{ color: SURFACE_TOKENS.textTertiary, marginBottom: 6, display: 'block' }}>Max (₹)</Label>
                    <Input
                      id="maxFees"
                      type="tel"
                      value={teacherData["Max Fees"]?.toString() || ''}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                        handleInputChange("Max Fees", digits ? parseInt(digits) : null);
                      }}
                      placeholder="e.g., 5000"
                      maxLength={6}
                      inputMode="numeric"
                      className={FIELD_CLASSNAME}
                      style={FIELD_STYLE}
                    />
                  </div>
                </div>
                <p className="text-xs" style={HELP_TEXT_STYLE}>Optional</p>
              </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

