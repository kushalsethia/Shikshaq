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

const SCHOOL_BOARDS = ['ICSE', 'CBSE', 'IGCSE', 'IB', 'State', 'College'];

const CLASS_NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'UG'];

const SUBJECTS = [
  'Accounts', 'ACT', 'AP', 'Bengali', 'Biology', 'Business Studies', 'CA', 'CAT', 'Chemistry',
  'Commerce', 'Computers', 'Drawing & Painting', 'Economics', 'English', 'Environmental Science',
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
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
          console.log(`Image compressed: ${originalSize}MB → ${compressedSize}MB`);
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
      // Validate file size (10MB limit - will be compressed to ~1MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size must be less than 10MB');
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
      toast.error('Please select a class size');
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
        "Classes Taught": teacherData["Classes Taught"] || null,
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
              <h1 className="text-3xl md:text-4xl font-sans text-foreground">
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
              <h2 className="text-xl font-sans text-foreground flex items-center gap-2">
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

                <div className="space-y-2">
                  <Label>
                    Email ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={teacherData["Email ID"] || ''}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Editable Fields Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-sans text-foreground">Profile Information</h2>
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
                <Label htmlFor="phoneNumber">
                  Phone Number <span className="text-red-500">*</span>
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
                  placeholder="10 digit number"
                  maxLength={10}
                  required
                />
                <p className="text-xs text-muted-foreground">
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
                <Label>Profile Image</Label>
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
                  );
                })()}
                
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
                  Upload an image file (max 10MB, will be compressed automatically). Supported formats: JPG, PNG, GIF, WebP
                </p>
              </div>

              {/* Profile Introduction */}
              <div className="space-y-2">
                <Label htmlFor="description">Profile Introduction</Label>
                <Textarea
                  id="description"
                  value={teacherData["Description"] || ''}
                  onChange={(e) => handleInputChange("Description", e.target.value || null)}
                  rows={5}
                  placeholder="Write about your teaching experience, methodology, and what makes you unique..."
                />
              </div>

              {/* Subjects (Multiple Select) */}
              <div className="space-y-2">
                <Label>
                  Subjects <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-wrap gap-2 mt-2 max-h-48 overflow-y-auto border rounded-lg p-4">
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
                        <Label htmlFor={`subject-${subject}`} className="cursor-pointer text-sm">
                          {subject}
                        </Label>
                      </div>
                    );
                  })}
                </div>
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
                    {(teacherData.Subjects || '').split(',').map(s => s.trim()).filter(Boolean).map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose one of your selected subjects to feature on your profile
                </p>
              </div>

              {/* School Boards Catered */}
              <div className="space-y-2">
                <Label>
                  School Boards Catered <span className="text-red-500">*</span>
                </Label>
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

              {/* Classes Taught */}
              <div className="space-y-2">
                <Label>
                  Classes Taught <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Select the classes you teach. Display format will be automatically computed.
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

              {/* Mode of Teaching */}
              <div className="space-y-2">
                <Label>
                  Mode of Teaching <span className="text-red-500">*</span>
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
                        <Label htmlFor={`mode-${mode}`} className="cursor-pointer">
                          {mode}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Class Size */}
              <div className="space-y-2">
                <Label>
                  Class Size <span className="text-red-500">*</span>
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
                        <Label htmlFor={`classSize-${size}`} className="cursor-pointer">
                          {size}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Place of Teaching (Location V2) */}
              <div className="space-y-2">
                <Label htmlFor="locationV2">
                  Place of Teaching <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={teacherData["LOCATION V2"] || ""}
                  onValueChange={(value) => handleInputChange("LOCATION V2", value)}
                  required
                >
                  <SelectTrigger id="locationV2">
                    <SelectValue placeholder="Select place of teaching" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEACHER'S HOME TUTORING">Teacher's Home Tutoring Only</SelectItem>
                    <SelectItem value="STUDENT'S HOME TUTORING ONLY">Student's Home Tutoring Only</SelectItem>
                    <SelectItem value="BOTH OPTIONS LISTED">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Student's Home Areas - Show when Place of Teaching is "STUDENT'S HOME TUTORING ONLY" or "BOTH OPTIONS LISTED" */}
              {(teacherData["LOCATION V2"] === "STUDENT'S HOME TUTORING ONLY" || teacherData["LOCATION V2"] === "BOTH OPTIONS LISTED") && (
                <div className="space-y-2">
                  <Label>
                    Student's Home in These Areas <span className="text-red-500">*</span>
                  </Label>
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
                            required={teacherData["LOCATION V2"] === "STUDENT'S HOME TUTORING ONLY" || teacherData["LOCATION V2"] === "BOTH OPTIONS LISTED"}
                          />
                          <Label htmlFor={`student-area-${area}`} className="cursor-pointer text-sm">
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
                  <Label>
                    Tutor's Home in These Areas <span className="text-red-500">*</span>
                  </Label>
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
                            required={teacherData["LOCATION V2"] === "TEACHER'S HOME TUTORING" || teacherData["LOCATION V2"] === "BOTH OPTIONS LISTED"}
                          />
                          <Label htmlFor={`tutor-area-${area}`} className="cursor-pointer text-sm">
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

              {/* Min Fees */}
              <div className="space-y-2">
                <Label htmlFor="minFees">Minimum Fees per Month (₹)</Label>
                <Input
                  id="minFees"
                  type="tel"
                  value={teacherData["Min Fees"]?.toString() || ''}
                  onChange={(e) => {
                    // Only allow digits, limit to 6 digits
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                    handleInputChange("Min Fees", digits ? parseInt(digits) : null);
                  }}
                  placeholder="e.g., 2000"
                  maxLength={6}
                  inputMode="numeric"
                />
                <p className="text-xs text-muted-foreground">Optional - Enter minimum monthly fees</p>
              </div>

              {/* Max Fees */}
              <div className="space-y-2">
                <Label htmlFor="maxFees">Maximum Fees per Month (₹)</Label>
                <Input
                  id="maxFees"
                  type="tel"
                  value={teacherData["Max Fees"]?.toString() || ''}
                  onChange={(e) => {
                    // Only allow digits, limit to 6 digits
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                    handleInputChange("Max Fees", digits ? parseInt(digits) : null);
                  }}
                  placeholder="e.g., 5000"
                  maxLength={6}
                  inputMode="numeric"
                />
                <p className="text-xs text-muted-foreground">Optional - Enter maximum monthly fees</p>
              </div>


            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

