import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
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
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';
import { Loader2, Upload, X, CheckCircle2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import DOMPurify from 'dompurify';
import { sanitizeImageUrl, validateImageSrc } from '@/utils/imageSanitizer';
import { getSubjectColors } from '@/utils/subjectColors';
import { Link } from 'react-router-dom';

// Constants matching AdminTeachers
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
  'Alipore', 'Ballygunge', 'Behala', 'Bhowanipore', 'Gariahat', 'Garia', 'Jadavpur', 'Kasba',
  'New Alipore', 'Southern Avenue', 'Tollygunge', 'Hazra',
  'Baguihati', 'Belur', 'Howrah', 'Joka', 'Newtown', 'Rajarhat', 'Salt Lake', 'Science City',
  'Dum Dum', 'Entally', 'Girish Park', 'Nagarbazar', 'Sealdah', 'Shyam Bazar', 'Tangra',
  'Camac Street', 'College Street', 'Elgin', 'Minto Park', 'Park Street', 'Park Circus',
  'Kankurgachi', 'Laketown', 'Phoolbagan', 'Ultadanga',
  'Anandapur', 'Parnasree', 'Rabindra Nagar',
  'Hooghly'
].sort();

const MODE_OF_TEACHING = ['Online', 'Offline'];

const CLASS_SIZE = ['Group', 'Solo'];

const SIR_MAAM = ['Sir', "Ma'am"];

// Stepper labels per design_handoff_shikshaq/pages/JoinApply.md
const STEPS = [
  { label: 'About you' },
  { label: 'What you teach' },
  { label: 'Where & fees' },
  { label: 'Review' },
];

// Shared token-based styles for form controls, matching the site's design system.
// Field styling everywhere on this page (per spec): label 13px/600; input
// min-height:48px; padding:13px 15px; border-radius:12px; background:#F9F5F1;
// ring #E7DFD5; 15px.
const fieldStyle: React.CSSProperties = {
  background: '#F9F5F1',
  boxShadow: '0 0 0 1px #E7DFD5',
  borderRadius: 12,
  minHeight: 48,
};

const textareaStyle: React.CSSProperties = {
  background: '#F9F5F1',
  boxShadow: '0 0 0 1px #E7DFD5',
  borderRadius: 12,
};

const fieldClassName = 'h-auto w-full border-0 bg-transparent rounded-none px-[15px] py-[13px] text-[15px] focus-visible:ring-0 focus-visible:ring-offset-0';
const textareaClassName = 'w-full border-0 bg-transparent rounded-none px-[15px] py-[13px] text-[15px] focus-visible:ring-0 focus-visible:ring-offset-0';

function SectionHeading({ mb = 18, children }: { mb?: number; children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: 'clamp(21px,2.4vw,26px)', fontWeight: 700, color: '#1F1F1F', marginBottom: mb }}>
      {children}
    </h2>
  );
}

function FieldLabel({ htmlFor, mb = 7, children }: { htmlFor?: string; mb?: number; children: React.ReactNode }) {
  return (
    <Label htmlFor={htmlFor} style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4A443E', marginBottom: mb }}>
      {children}
    </Label>
  );
}

// Pill: default selected state is the neutral mutedFill (#F0EAE2). Pass `tint`
// for chip groups where colour is meaningful (subjects, boards, areas), per
// "Multi-select chips" in the spec.
function Pill({
  label,
  selected,
  onClick,
  tint,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  tint?: { bg: string; color: string };
}) {
  const selectedBg = tint?.bg ?? '#F0EAE2';
  const selectedColor = tint?.color ?? '#1F1F1F';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={selected ? 'active:scale-[0.97]' : 'shikshaq-pill-unselected active:scale-[0.97]'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: 44,
        padding: '10px 16px',
        borderRadius: 999,
        fontSize: 13.5,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        background: selected ? selectedBg : 'transparent',
        color: selected ? selectedColor : '#4A443E',
        boxShadow: selected ? 'none' : '0 0 0 1px #E7DFD5',
        transition: 'background .15s ease, color .15s ease, box-shadow .15s ease, transform .15s ease-out',
      }}
    >
      {label}
    </button>
  );
}

interface FormData {
  name: string;
  email: string;
  phone_number: string;
  sir_maam: 'Sir' | "Ma'am" | '';
  subjects: string;
  classes_taught_for_backend: string;
  school_boards_catered: string;
  location_v2: string;
  students_home_areas: string;
  tutors_home_areas: string;
  mode_of_teaching: string;
  class_size: string;
  description: string;
  qualifications_etc: string;
  years_started_teaching: string;
  featured_subject: string;
  hero_image_url: string;
  reference_name: string;
  reference_number: string;
  min_fees: string;
  max_fees: string;
  mou_consent: boolean;
}

export default function JoinApply() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone_number: '',
    sir_maam: '',
    subjects: '',
    classes_taught_for_backend: '',
    school_boards_catered: '',
    location_v2: '',
    students_home_areas: '',
    tutors_home_areas: '',
    mode_of_teaching: '',
    class_size: '',
    description: '',
    qualifications_etc: '',
    years_started_teaching: '',
    featured_subject: '',
    hero_image_url: '',
    reference_name: '',
    reference_number: '',
    min_fees: '',
    max_fees: '',
    mou_consent: false,
  });

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Helper function to check if a value exists in a comma-separated string (case-insensitive)
  const valueExistsInString = (str: string | null, value: string): boolean => {
    if (!str) return false;
    const values = str.split(',').map(v => v.trim().toLowerCase());
    return values.includes(value.trim().toLowerCase());
  };

  const handleInputChange = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMultiSelectChange = (field: keyof FormData, value: string, checked: boolean) => {
    const currentValue = formData[field] as string;
    const currentArray = currentValue ? currentValue.split(',').map((v) => v.trim()) : [];

    let newArray: string[];
    if (checked) {
      newArray = [...currentArray, value].filter((v) => v !== '');
    } else {
      newArray = currentArray.filter((v) => v !== value);
    }

    const newValue = newArray.join(', ') || '';
    if (field === 'subjects') {
      const currentFeatured = formData.featured_subject;
      if (currentFeatured && !newArray.includes(currentFeatured)) {
        setFormData((prev) => ({ ...prev, [field]: newValue, featured_subject: '' }));
        return;
      }
    }
    handleInputChange(field, newValue);
  };

  // Clean up object URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedImageFile(null);
      setImagePreview(null);
      handleInputChange('hero_image_url', '');
      return;
    }

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

    // Store the file for later upload
    setSelectedImageFile(file);

    // Create preview using object URL (blob URLs are safe for image src)
    const previewUrl = URL.createObjectURL(file);

    // Validate that the blob URL is properly formed
    if (!previewUrl.startsWith('blob:')) {
      toast.error('Failed to create image preview');
      return;
    }

    // Clean up previous preview URL if it exists
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(previewUrl);
    // Don't set hero_image_url yet - will be set after upload on submit
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true);

      // Compress image
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/jpeg',
      });

      if (import.meta.env.DEV) {
        logger.log(`Image compressed from ${file.size / 1024 / 1024} MB to ${compressedFile.size / 1024 / 1024} MB`);
      }

      // Create a unique filename
      // Note: Path is relative to bucket root (bucket is already specified in .from('hero-images'))
      const fileExt = compressedFile.name.split('.').pop();
      const fileName = `application-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('hero-images')
        .upload(fileName, compressedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        logger.error('JoinApply.uploadImage', error);
        throw new Error('Image upload failed');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('hero-images')
        .getPublicUrl(data.path);

      const sanitizedUrl = sanitizeImageUrl(publicUrl);
      if (!sanitizedUrl) {
        throw new Error('Failed to generate valid image URL');
      }

      return sanitizedUrl;
    } catch (error) {
      logger.error('JoinApply.uploadImage.catch', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (formData.name.length > 200) {
      toast.error('Name must be at most 200 characters');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    if (formData.email.length > 254) {
      toast.error('Email must be at most 254 characters');
      return false;
    }
    const emailTrimmed = formData.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!formData.phone_number.trim()) {
      toast.error('Please enter your phone number');
      return false;
    }
    // Validate phone number: must be exactly 10 digits
    const phoneDigits = formData.phone_number.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      toast.error('Phone number must be exactly 10 digits');
      return false;
    }
    if (!formData.sir_maam) {
      toast.error('Please select Sir or Ma\'am');
      return false;
    }
    if (!formData.subjects.trim()) {
      toast.error('Please select at least one subject');
      return false;
    }
    if (!formData.classes_taught_for_backend.trim()) {
      toast.error('Please select at least one class');
      return false;
    }
    if (!formData.school_boards_catered.trim()) {
      toast.error('Please select at least one school board');
      return false;
    }
    if (!formData.mode_of_teaching.trim()) {
      toast.error('Please select at least one mode of teaching');
      return false;
    }
    if (!formData.class_size.trim()) {
      toast.error('Please select at least one structure of classes option');
      return false;
    }
    if (!formData.location_v2) {
      toast.error('Please select a location option');
      return false;
    }
    // Validate area fields based on location selection
    if (formData.location_v2 === "STUDENT'S HOME TUTORING ONLY") {
      if (!formData.students_home_areas.trim()) {
        toast.error('Please select at least one area for Student\'s Home Tutoring');
        return false;
      }
    } else if (formData.location_v2 === "TEACHER'S HOME TUTORING") {
      if (!formData.tutors_home_areas.trim()) {
        toast.error('Please select at least one area for Teacher\'s Home Tutoring');
        return false;
      }
    } else if (formData.location_v2 === "BOTH OPTIONS LISTED") {
      if (!formData.students_home_areas.trim()) {
        toast.error('Please select at least one area for Student\'s Home Tutoring');
        return false;
      }
      if (!formData.tutors_home_areas.trim()) {
        toast.error('Please select at least one area for Teacher\'s Home Tutoring');
        return false;
      }
    }
    if (!formData.reference_name.trim()) {
      toast.error('Please enter the reference student\'s name');
      return false;
    }
    if (formData.reference_name.length > 200) {
      toast.error('Student name (for verification) must be at most 200 characters');
      return false;
    }
    if (!formData.reference_number.trim()) {
      toast.error('Please enter the reference student\'s phone number');
      return false;
    }
    if (formData.years_started_teaching.trim()) {
      const yearDigits = formData.years_started_teaching.replace(/\D/g, '');
      if (yearDigits.length > 4) {
        toast.error('Years of experience must be at most 4 digits');
        return false;
      }
      if (yearDigits.length > 0 && !/^\d{1,4}$/.test(yearDigits)) {
        toast.error('Years of experience must contain only numbers');
        return false;
      }
    }
    // Validate reference number: must be exactly 10 digits
    const referenceDigits = formData.reference_number.replace(/\D/g, '');
    if (referenceDigits.length !== 10) {
      toast.error('Student number must be exactly 10 digits');
      return false;
    }
    // Hero image is required: user must have selected a file to upload
    if (!selectedImageFile) {
      toast.error('Please upload a hero image');
      return false;
    }
    if (formData.description.length > 1000) {
      toast.error('Profile introduction must be at most 1000 characters');
      return false;
    }
    if (formData.qualifications_etc.length > 500) {
      toast.error('Educational qualifications must be at most 500 characters');
      return false;
    }
    if (!formData.mou_consent) {
      toast.error('You must consent to the Memorandum of Understanding to proceed');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      // Upload image if one was selected
      let heroImageUrl = formData.hero_image_url;
      if (selectedImageFile) {
        try {
          heroImageUrl = await uploadImage(selectedImageFile);
          if (!heroImageUrl) {
            toast.error('Failed to upload image. Please try again.');
            return;
          }
        } catch (error) {
          toast.error('Failed to upload image. Please try again.');
          return;
        }
      }

      const { error } = await supabase
        .from('teacher_applications')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(), // normalize for consistent lookup
          phone_number: formData.phone_number.replace(/\D/g, ''), // Store only digits (10 digits)
          sir_maam: formData.sir_maam,
          subjects: formData.subjects.trim() || null,
          classes_taught_for_backend: formData.classes_taught_for_backend.trim() || null,
          school_boards_catered: formData.school_boards_catered.trim() || null,
          location_v2: formData.location_v2 || null,
          students_home_areas: formData.students_home_areas.trim() || null,
          tutors_home_areas: formData.tutors_home_areas.trim() || null,
          mode_of_teaching: formData.mode_of_teaching.trim() || null,
          class_size: formData.class_size.trim() || null,
          description: formData.description.trim() || null,
          qualifications_etc: formData.qualifications_etc.trim() || null,
          years_started_teaching: formData.years_started_teaching.trim() || null,
          featured_subject: formData.featured_subject || null,
          hero_image_url: heroImageUrl || null,
          reference_name: formData.reference_name.trim() || null,
          reference_number: formData.reference_number.replace(/\D/g, '') || null, // Store only digits
          min_fees: formData.min_fees ? parseInt(formData.min_fees.replace(/\D/g, '')) || null : null,
          max_fees: formData.max_fees ? parseInt(formData.max_fees.replace(/\D/g, '')) || null : null,
          mou_consent: true,
          mou_consent_timestamp: new Date().toISOString(),
          status: 'pending',
        });

      if (error) {
        logger.error('JoinApply.submit', error);
        if (error.message?.includes('DUPLICATE_PENDING_APPLICATION')) {
          toast.error('You already have an application under review with this email. We will get back to you soon.');
        } else {
          toast.error('Failed to submit application. Please try again.');
        }
        return;
      }

      setSubmitted(true);
      toast.success('Application submitted successfully! We will review it and get back to you soon.');
    } catch (error) {
      logger.error('JoinApply.submit.catch', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#F9F5F1' }}>
        <Navbar />
        <main style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,3vw,28px) 56px' }}>
          <div style={{ padding: 'clamp(28px,4vw,40px)', borderRadius: 24, background: '#FCFAF7', boxShadow: '0 0 0 1px rgba(0,0,0,.06), 0 2px 6px rgba(0,0,0,.04)', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 999, background: '#E6F4E6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle2 className="w-8 h-8" style={{ color: '#228B22' }} />
            </div>
            <h1 style={{ fontSize: 'clamp(24px,3.4vw,32px)', fontWeight: 700, color: '#1F1F1F', marginBottom: 12 }}>
              Application submitted!
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: '#7B736B', marginBottom: 8 }}>
              Thank you for your interest in joining Shikshaq as a teacher. We have received your application and will review it shortly.
            </p>
            <p style={{ fontSize: 14, color: '#8B837A' }}>
              You will be notified via email once your application has been reviewed.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isLastStep = step === STEPS.length - 1;

  // Validates only the fields shown on the given step, so users get feedback
  // as they go instead of clicking through 3 blank steps and hitting every
  // error at once on final submit (which still runs the full validateForm).
  const validateStep = (stepIndex: number): boolean => {
    if (stepIndex === 0) {
      if (!formData.name.trim()) {
        toast.error('Please enter your name');
        return false;
      }
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        toast.error('Please enter a valid email address');
        return false;
      }
      if (!formData.sir_maam) {
        toast.error("Please select Sir or Ma'am");
        return false;
      }
      if (formData.phone_number.replace(/\D/g, '').length !== 10) {
        toast.error('Phone number must be exactly 10 digits');
        return false;
      }
      return true;
    }
    if (stepIndex === 1) {
      if (!formData.subjects.trim()) {
        toast.error('Please select at least one subject');
        return false;
      }
      if (!formData.school_boards_catered.trim()) {
        toast.error('Please select at least one school board');
        return false;
      }
      if (!formData.classes_taught_for_backend.trim()) {
        toast.error('Please select at least one class');
        return false;
      }
      if (!formData.class_size.trim()) {
        toast.error('Please select at least one structure of classes option');
        return false;
      }
      return true;
    }
    if (stepIndex === 2) {
      if (!formData.location_v2) {
        toast.error('Please select a location option');
        return false;
      }
      if (formData.location_v2 === "STUDENT'S HOME TUTORING ONLY" && !formData.students_home_areas.trim()) {
        toast.error("Please select at least one area for Student's Home Tutoring");
        return false;
      }
      if (formData.location_v2 === "TEACHER'S HOME TUTORING" && !formData.tutors_home_areas.trim()) {
        toast.error("Please select at least one area for Teacher's Home Tutoring");
        return false;
      }
      if (formData.location_v2 === 'BOTH OPTIONS LISTED') {
        if (!formData.students_home_areas.trim()) {
          toast.error("Please select at least one area for Student's Home Tutoring");
          return false;
        }
        if (!formData.tutors_home_areas.trim()) {
          toast.error("Please select at least one area for Teacher's Home Tutoring");
          return false;
        }
      }
      if (!formData.mode_of_teaching.trim()) {
        toast.error('Please select at least one mode of teaching');
        return false;
      }
      return true;
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const showStudentAreas = formData.location_v2 === "STUDENT'S HOME TUTORING ONLY" || formData.location_v2 === "BOTH OPTIONS LISTED";
  const showTutorAreas = formData.location_v2 === "TEACHER'S HOME TUTORING" || formData.location_v2 === "BOTH OPTIONS LISTED";

  // Step 4 summary lines, built from the actual entered values (not placeholders).
  const selectedSubjectsList = formData.subjects ? formData.subjects.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const selectedBoardsList = formData.school_boards_catered ? formData.school_boards_catered.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const selectedClassesList = formData.classes_taught_for_backend ? formData.classes_taught_for_backend.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const summaryAreas = Array.from(new Set([
    ...(formData.students_home_areas ? formData.students_home_areas.split(',').map((s) => s.trim()).filter(Boolean) : []),
    ...(formData.tutors_home_areas ? formData.tutors_home_areas.split(',').map((s) => s.trim()).filter(Boolean) : []),
  ]));
  const summaryNameLine = [formData.name.trim(), formData.sir_maam].filter(Boolean).join(', ')
    + (formData.years_started_teaching.trim() ? ` · ${formData.years_started_teaching.trim()} years` : '');
  const summaryTeachLine = [
    selectedSubjectsList.length ? selectedSubjectsList.join(', ') : null,
    selectedBoardsList.length ? selectedBoardsList.join(', ') : null,
    selectedClassesList.length ? `Classes ${selectedClassesList.join(', ')}` : null,
  ].filter(Boolean).join(' · ');
  const summaryFeeRange = formData.min_fees && formData.max_fees
    ? `₹${formData.min_fees} – ₹${formData.max_fees} / month`
    : formData.min_fees
    ? `From ₹${formData.min_fees} / month`
    : formData.max_fees
    ? `Up to ₹${formData.max_fees} / month`
    : null;
  const summaryWhereLine = [summaryAreas.length ? summaryAreas.join(', ') : null, summaryFeeRange].filter(Boolean).join(' · ');

  return (
    <div style={{ minHeight: '100vh', background: '#F9F5F1' }}>
      <Navbar />

      <main style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,3vw,28px) 56px' }}>
        <Link
          to="/join"
          style={{ display: 'inline-block', fontSize: 13, fontWeight: 600, color: '#8B837A', marginBottom: 20, textDecoration: 'none' }}
        >
          ← Why join Shikshaq
        </Link>

        {/* Stepper */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 28 }}>
          {STEPS.map((s, i) => {
            const state = i === step ? 'current' : i < step ? 'done' : 'upcoming';
            const numeralBg = state === 'current' ? '#fff' : state === 'done' ? '#228B22' : '#F0EAE2';
            const numeralColor = state === 'current' ? '#1F1F1F' : state === 'done' ? '#fff' : '#8B837A';
            const labelColor = state === 'current' ? '#1F1F1F' : state === 'done' ? '#4A443E' : '#8B837A';
            return (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 30, height: 30, borderRadius: 999, flexShrink: 0,
                    fontSize: 12.5, fontWeight: 700,
                    background: numeralBg, color: numeralColor,
                    transition: 'background .25s ease',
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: labelColor, whiteSpace: 'nowrap' }}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            // Prevent an Enter keypress in an earlier step from submitting the whole form
            if (e.key === 'Enter' && !isLastStep && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
              e.preventDefault();
            }
          }}
          style={{ padding: 'clamp(22px,3vw,32px)', borderRadius: 24, background: '#FCFAF7', boxShadow: '0 0 0 1px rgba(0,0,0,.06), 0 2px 6px rgba(0,0,0,.04)' }}
        >
          {/* Step 1: About you */}
          {step === 0 && (
            <div className="joinApplyRise">
              <SectionHeading>About you</SectionHeading>

              <div style={{ display: 'grid', gap: 14 }}>
                {/* Full name */}
                <div>
                  <FieldLabel htmlFor="name">Full name *</FieldLabel>
                  <Input
                    id="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Ananya Ghosh"
                    maxLength={200}
                    required
                    className={fieldClassName}
                    style={fieldStyle}
                  />
                  <p style={{ fontSize: 12, color: '#8B837A', marginTop: 6 }}>Max 200 characters</p>
                </div>

                {/* Email */}
                <div>
                  <FieldLabel htmlFor="email">Email *</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="e.g. name@example.com"
                    maxLength={254}
                    required
                    className={fieldClassName}
                    style={fieldStyle}
                  />
                  <p style={{ fontSize: 12, color: '#8B837A', marginTop: 6 }}>Enter a valid email address</p>
                </div>

                {/* Sir or Ma'am */}
                <div>
                  <FieldLabel>Sir or Ma'am *</FieldLabel>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {SIR_MAAM.map((option) => (
                      <Pill
                        key={option}
                        label={option}
                        selected={formData.sir_maam === option}
                        onClick={() => handleInputChange('sir_maam', option)}
                      />
                    ))}
                  </div>
                </div>

                {/* WhatsApp number */}
                <div>
                  <FieldLabel htmlFor="phone_number">WhatsApp number *</FieldLabel>
                  <Input
                    id="phone_number"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={formData.phone_number}
                    onChange={(e) => {
                      // Only allow digits, limit to 10 digits
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                      handleInputChange('phone_number', digits);
                    }}
                    placeholder="10-digit number"
                    maxLength={10}
                    required
                    className={fieldClassName}
                    style={fieldStyle}
                  />
                  <p style={{ fontSize: 12, color: '#8B837A', marginTop: 6 }}>Country code +91 is added automatically</p>
                </div>

                {/* Years of experience */}
                <div>
                  <FieldLabel htmlFor="years_started_teaching">Years of experience</FieldLabel>
                  <Input
                    id="years_started_teaching"
                    value={formData.years_started_teaching}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                      handleInputChange('years_started_teaching', digits);
                    }}
                    placeholder="e.g. 12"
                    maxLength={4}
                    inputMode="numeric"
                    className={fieldClassName}
                    style={fieldStyle}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: What you teach */}
          {step === 1 && (
            <div className="joinApplyRise">
              <SectionHeading>What you teach</SectionHeading>

              {/* Subjects */}
              <div style={{ marginBottom: 20 }}>
                <FieldLabel mb={9}>Subjects *</FieldLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {SUBJECTS.map((subject) => {
                    const selected = valueExistsInString(formData.subjects, subject);
                    const sc = getSubjectColors(subject);
                    return (
                      <Pill
                        key={subject}
                        label={subject}
                        selected={selected}
                        tint={{ bg: sc.tint, color: sc.titleText }}
                        onClick={() => handleMultiSelectChange('subjects', subject, !selected)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Boards catered */}
              <div style={{ marginBottom: 20 }}>
                <FieldLabel mb={9}>Boards catered *</FieldLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {BOARDS.map((board) => {
                    const selected = valueExistsInString(formData.school_boards_catered, board);
                    return (
                      <Pill
                        key={board}
                        label={board}
                        selected={selected}
                        tint={{ bg: '#EDEEFF', color: '#2E3AD6' }}
                        onClick={() => handleMultiSelectChange('school_boards_catered', board, !selected)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Classes */}
              <div style={{ marginBottom: 20 }}>
                <FieldLabel mb={9}>Classes *</FieldLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {CLASSES.map((cls) => {
                    const selected = valueExistsInString(formData.classes_taught_for_backend, cls);
                    return (
                      <Pill
                        key={cls}
                        label={cls}
                        selected={selected}
                        onClick={() => handleMultiSelectChange('classes_taught_for_backend', cls, !selected)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Structure of classes (stored as class_size) */}
              <div style={{ marginBottom: 20 }}>
                <FieldLabel mb={9}>Structure of classes *</FieldLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {CLASS_SIZE.map((size) => {
                    const selected = valueExistsInString(formData.class_size, size);
                    return (
                      <Pill
                        key={size}
                        label={size === 'Solo' ? 'One-on-one' : size}
                        selected={selected}
                        onClick={() => handleMultiSelectChange('class_size', size, !selected)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Featured Subject - only from selected subjects */}
              <div>
                <FieldLabel htmlFor="featured_subject">Featured subject</FieldLabel>
                <Select
                  value={(() => {
                    const selectedSubjects = (formData.subjects || '').split(',').map((s) => s.trim()).filter(Boolean);
                    const current = formData.featured_subject;
                    return current && selectedSubjects.includes(current) ? current : 'none';
                  })()}
                  onValueChange={(value) => handleInputChange('featured_subject', value === "none" ? "" : value)}
                >
                  <SelectTrigger id="featured_subject" className={fieldClassName} style={fieldStyle}>
                    <SelectValue placeholder="Select featured subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {(formData.subjects || '').split(',').map((s) => s.trim()).filter(Boolean).map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p style={{ fontSize: 12, color: '#8B837A', marginTop: 6 }}>
                  Choose one of your selected subjects to feature on your profile
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Where & fees */}
          {step === 2 && (
            <div className="joinApplyRise">
              <SectionHeading>Where &amp; fees</SectionHeading>

              {/* Location */}
              <div style={{ marginBottom: 20 }}>
                <FieldLabel htmlFor="location_v2">Location *</FieldLabel>
                <Select
                  value={formData.location_v2 || "__none__"}
                  onValueChange={(value) => handleInputChange('location_v2', value === "__none__" ? "" : value)}
                >
                  <SelectTrigger id="location_v2" className={fieldClassName} style={fieldStyle}>
                    <SelectValue placeholder="Select location option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None</SelectItem>
                    <SelectItem value="TEACHER'S HOME TUTORING">Teacher's Home Tutoring Only</SelectItem>
                    <SelectItem value="STUDENT'S HOME TUTORING ONLY">Student's Home Tutoring Only</SelectItem>
                    <SelectItem value="BOTH OPTIONS LISTED">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Student's Home Areas - Show when Location is "STUDENT'S HOME TUTORING ONLY" or "BOTH OPTIONS LISTED" */}
              {showStudentAreas && (
                <div style={{ marginBottom: 20 }}>
                  <FieldLabel mb={9}>Areas you teach in (student's home) *</FieldLabel>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {AREAS.map((area) => {
                      const selected = valueExistsInString(formData.students_home_areas, area);
                      return (
                        <Pill
                          key={area}
                          label={area}
                          selected={selected}
                          tint={{ bg: '#FFF4E8', color: '#B35900' }}
                          onClick={() => handleMultiSelectChange('students_home_areas', area, !selected)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tutor's Home Areas - Show when Location is "TEACHER'S HOME TUTORING" or "BOTH OPTIONS LISTED" */}
              {showTutorAreas && (
                <div style={{ marginBottom: 20 }}>
                  <FieldLabel mb={9}>Areas you teach in (your home) *</FieldLabel>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {AREAS.map((area) => {
                      const selected = valueExistsInString(formData.tutors_home_areas, area);
                      return (
                        <Pill
                          key={area}
                          label={area}
                          selected={selected}
                          tint={{ bg: '#FFF4E8', color: '#B35900' }}
                          onClick={() => handleMultiSelectChange('tutors_home_areas', area, !selected)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mode of Teaching */}
              <div style={{ marginBottom: 20 }}>
                <FieldLabel mb={9}>Mode of teaching *</FieldLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {MODE_OF_TEACHING.map((mode) => {
                    const selected = valueExistsInString(formData.mode_of_teaching, mode);
                    return (
                      <Pill
                        key={mode}
                        label={mode}
                        selected={selected}
                        onClick={() => handleMultiSelectChange('mode_of_teaching', mode, !selected)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Monthly fee range */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14 }}>
                <div>
                  <FieldLabel htmlFor="min_fees">Minimum fee / month</FieldLabel>
                  <Input
                    id="min_fees"
                    type="tel"
                    value={formData.min_fees}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                      handleInputChange('min_fees', digits);
                    }}
                    placeholder="₹3,000"
                    maxLength={6}
                    inputMode="numeric"
                    className={fieldClassName}
                    style={fieldStyle}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="max_fees">Maximum fee / month</FieldLabel>
                  <Input
                    id="max_fees"
                    type="tel"
                    value={formData.max_fees}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                      handleInputChange('max_fees', digits);
                    }}
                    placeholder="₹5,000"
                    maxLength={6}
                    inputMode="numeric"
                    className={fieldClassName}
                    style={fieldStyle}
                  />
                </div>
              </div>
              <p style={{ fontSize: 12, color: '#8B837A', marginTop: 6 }}>Fee range is optional</p>
            </div>
          )}

          {/* Step 4: Review and send */}
          {step === 3 && (
            <div className="joinApplyRise">
              <SectionHeading mb={12}>Review and send</SectionHeading>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: '#7B736B', marginBottom: 20 }}>
                Our team checks qualifications and existing student references before a profile goes live. That usually takes three working days.
              </p>
              <div style={{ padding: 20, borderRadius: 16, background: '#F9F5F1', boxShadow: '0 0 0 1px #E7DFD5', fontSize: 14.5, lineHeight: 1.9, color: '#4A443E', marginBottom: 24 }}>
                {summaryNameLine || 'Add your name in step 1'}
                <br />
                {summaryTeachLine || 'Add subjects, boards and classes in step 2'}
                <br />
                {summaryWhereLine || 'Add areas and a fee range in step 3'}
              </div>

              <div style={{ display: 'grid', gap: 20 }}>
                {/* Profile Introduction */}
                <div>
                  <FieldLabel htmlFor="description">Profile introduction</FieldLabel>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={5}
                    placeholder="Tell us about yourself and your teaching approach..."
                    maxLength={1000}
                    className={textareaClassName}
                    style={textareaStyle}
                  />
                  <p style={{ fontSize: 12, color: '#8B837A', marginTop: 6 }}>Max 1000 characters</p>
                </div>

                {/* Educational Qualifications */}
                <div>
                  <FieldLabel htmlFor="qualifications_etc">Educational qualifications</FieldLabel>
                  <Textarea
                    id="qualifications_etc"
                    value={formData.qualifications_etc}
                    onChange={(e) => handleInputChange('qualifications_etc', e.target.value)}
                    rows={3}
                    placeholder="Your educational qualifications, certifications, etc."
                    maxLength={500}
                    className={textareaClassName}
                    style={textareaStyle}
                  />
                  <p style={{ fontSize: 12, color: '#8B837A', marginTop: 6 }}>Max 500 characters</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14 }}>
                  {/* Reference Name */}
                  <div>
                    <FieldLabel htmlFor="reference_name">Student name (for verification) *</FieldLabel>
                    <Input
                      id="reference_name"
                      value={formData.reference_name}
                      onChange={(e) => handleInputChange('reference_name', e.target.value)}
                      placeholder="Name of a student we can contact"
                      maxLength={200}
                      required
                      className={fieldClassName}
                      style={fieldStyle}
                    />
                    <p style={{ fontSize: 12, color: '#8B837A', marginTop: 6 }}>We will call them to verify you're a teacher</p>
                  </div>

                  {/* Student number for verification */}
                  <div>
                    <FieldLabel htmlFor="reference_number">Student number (for verification) *</FieldLabel>
                    <Input
                      id="reference_number"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="off"
                      value={formData.reference_number}
                      onChange={(e) => {
                        // Only allow digits, limit to 10
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                        handleInputChange('reference_number', digits);
                      }}
                      placeholder="10-digit number"
                      maxLength={10}
                      required
                      className={fieldClassName}
                      style={fieldStyle}
                    />
                  </div>
                </div>

                {/* Profile Picture */}
                <div>
                  <FieldLabel htmlFor="hero_image">Profile picture *</FieldLabel>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {(() => {
                      // Early return if no preview
                      if (!imagePreview) return null;

                      // Sanitize user-controlled image URL to prevent XSS
                      // validateImageSrc ensures only safe URLs (blob, http/https, data:image) are used
                      const validatedUrl = validateImageSrc(imagePreview);

                      // Only render if URL is validated and safe
                      if (!validatedUrl || validatedUrl.length === 0) return null;

                      // Apply DOMPurify.sanitize to break the taint chain — CodeQL recognises
                      // DOMPurify as a known sanitizer, so this stops the
                      // "DOM text reinterpreted as HTML" finding while adding defence-in-depth.
                      // DOMPurify with ALLOWED_TAGS:[] strips any HTML but leaves the plain URL intact.
                      const safeSrc = DOMPurify.sanitize(validatedUrl, {
                        ALLOWED_TAGS: [],
                        ALLOWED_ATTR: [],
                        KEEP_CONTENT: true,
                      });

                      if (!safeSrc) return null;

                      return (
                        <div style={{ position: 'relative', width: '100%', maxWidth: 340 }}>
                          <img
                            src={safeSrc}
                            alt="Profile picture preview"
                            style={{ width: '100%', height: 190, objectFit: 'cover', borderRadius: 16, boxShadow: '0 0 0 1px #E7DFD5' }}
                            onError={() => setImagePreview(null)}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              // Clean up object URL if it's a blob URL
                              if (imagePreview && imagePreview.startsWith('blob:')) {
                                URL.revokeObjectURL(imagePreview);
                              }
                              setSelectedImageFile(null);
                              setImagePreview(null);
                              handleInputChange('hero_image_url', '');
                            }}
                            style={{ position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 999, background: 'rgba(255,255,255,.92)', boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }}
                          >
                            <X className="w-4 h-4" style={{ color: '#1F1F1F' }} />
                          </button>
                        </div>
                      );
                    })()}
                    <label
                      htmlFor="heroImageUpload"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, width: 'fit-content', minHeight: 44, padding: '0 18px', borderRadius: 12, fontSize: 13.5, fontWeight: 600, color: '#1F1F1F', boxShadow: '0 0 0 1px #E7DFD5', cursor: 'pointer' }}
                    >
                      <Upload className="w-4 h-4" />
                      {selectedImageFile ? 'Change Image' : 'Select Image'}
                      <input
                        id="heroImageUpload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageFileChange}
                        disabled={submitting}
                      />
                    </label>
                    <p style={{ fontSize: 12, color: '#8B837A' }}>
                      {selectedImageFile
                        ? 'Image will be uploaded when you submit the form. Max file size: 5MB'
                        : 'Select a professional photo. Image will be uploaded on form submission. Max file size: 5MB'}
                    </p>
                  </div>
                </div>

                {/* Memorandum of Understanding */}
                <div style={{ borderRadius: 16, background: '#F9F5F1', boxShadow: '0 0 0 1px #E7DFD5', padding: 20, display: 'grid', gap: 16 }}>
                  <p style={{ fontSize: 14.5, fontWeight: 600, color: '#1F1F1F' }}>
                    Memorandum of Understanding
                  </p>
                  <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#4A443E' }}>
                    This Memorandum of Understanding confirms that you grant Shikshaq permission to display your submitted profile (name, locality, place of teaching, subjects, boards, classes, photo, and WhatsApp link) on our platform for the sole purpose of connecting you with students and enhancing their learning experience.
                  </p>

                  <div style={{ fontSize: 14.5, color: '#4A443E' }}>
                    <p style={{ fontWeight: 600, marginBottom: 8 }}>I have read and understood the above Memorandum of Understanding and consent to:</p>
                    <ol style={{ listStyleType: 'decimal', listStylePosition: 'inside', display: 'grid', gap: 6, marginLeft: 8 }}>
                      <li>Shikshaq displaying my educator profile as previously submitted;</li>
                      <li>The use of my Whatsapp link to let students land directly on my Whatsapp chat through Shikshaq for communication;</li>
                      <li>The use of my provided information for student outreach and internal communication;</li>
                      <li>This digital form serving as a legally binding agreement.</li>
                    </ol>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingTop: 16, borderTop: '1px solid #E7DFD5' }}>
                    <Checkbox
                      id="mou_consent"
                      checked={formData.mou_consent}
                      onCheckedChange={(checked) => handleInputChange('mou_consent', checked)}
                      required
                    />
                    <Label htmlFor="mou_consent" style={{ fontSize: 14.5, lineHeight: 1.5, cursor: 'pointer' }}>
                      <span style={{ fontWeight: 600, color: '#1F1F1F' }}>I consent. *</span>
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 26 }}>
            {!isLastStep ? (
              <button
                type="button"
                onClick={goNext}
                className="active:scale-[0.97] transition-transform duration-150"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 50, padding: '14px 24px', borderRadius: 12, fontSize: 15, fontWeight: 600, background: '#1F1F1F', color: '#fff' }}
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="active:scale-[0.97] transition-transform duration-150"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 50, padding: '14px 24px', borderRadius: 12, fontSize: 15, fontWeight: 600, background: '#228B22', color: '#fff', opacity: submitting ? 0.75 : 1 }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Send application'
                )}
              </button>
            )}

            {step > 0 && (
              <button
                type="button"
                onClick={goBack}
                className="active:scale-[0.97] transition-transform duration-150"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 50, padding: '14px 22px', borderRadius: 12, fontSize: 15, fontWeight: 600, color: '#1F1F1F', boxShadow: '0 0 0 1px #E7DFD5' }}
              >
                Back
              </button>
            )}
          </div>
        </form>
      </main>

      <Footer />

      {/* Step content entry animation ("rise" per _tokens.md) and hover feedback
          for unselected Pill toggles, which otherwise have no cue that they're
          clickable on a mouse. Scoped locally since this file may not touch
          index.css / tailwind.config.ts. The global prefers-reduced-motion rule
          in index.css already zeroes out this animation's duration. */}
      <style>{`
        @keyframes joinApplyRise {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
        .joinApplyRise { animation: joinApplyRise .28s cubic-bezier(.16,1,.3,1) both; }
        @media (hover: hover) {
          .shikshaq-pill-unselected:hover { background: rgba(31,31,31,.04); box-shadow: 0 0 0 1px #D9CFC2; }
        }
      `}</style>
    </div>
  );
}
