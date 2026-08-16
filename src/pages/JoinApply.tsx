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
import DOMPurify from 'dompurify';
import { sanitizeImageUrl, validateImageSrc } from '@/utils/imageSanitizer';
import { getSubjectColors } from '@/utils/subjectColors';
import { Link } from 'react-router-dom';
import { NumberedIndex } from '@/components/devices';

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

// Shared token-based classes for form controls, matching the site's design system.
const fieldClassName = 'h-auto w-full min-h-12 border-0 bg-background rounded-lg ring-1 ring-inset ring-warm-hairline px-[15px] py-[13px] text-base focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-0';
const textareaClassName = 'w-full border-0 bg-background rounded-lg ring-1 ring-inset ring-warm-hairline px-[15px] py-[13px] text-base focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-0';

function SectionHeading({ mb = 'mb-4', children }: { mb?: string; children: React.ReactNode }) {
  return (
    <h2 className={`text-2xl sm:text-3xl font-semibold tracking-tight text-foreground ${mb}`}>
      {children}
    </h2>
  );
}

function FieldLabel({ htmlFor, mb = 'mb-2', children }: { htmlFor?: string; mb?: string; children: React.ReactNode }) {
  return (
    <Label htmlFor={htmlFor} className={`block text-sm font-semibold text-warm-prose ${mb}`}>
      {children}
    </Label>
  );
}

// Pill: default selected state is the neutral muted fill. Pass `tintClass`
// for chip groups where a static accent colour is meaningful (boards, areas —
// tokens known ahead of time). Pass `dynamicTint` only for the sanctioned
// data-driven case (subject colors from getSubjectColors / subject-palette),
// per the inline-style exception documented in src/lib/subject-palette.ts.
function Pill({
  label,
  selected,
  onClick,
  tintClass,
  dynamicTint,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  tintClass?: string;
  dynamicTint?: { bg: string; color: string };
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex items-center min-h-11 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-150 active:scale-[0.97] ${
        selected ? (dynamicTint ? '' : tintClass ?? 'bg-muted text-foreground') : 'shikshaq-pill-unselected ring-1 ring-inset ring-warm-hairline text-warm-prose'
      }`}
      style={selected && dynamicTint ? { background: dynamicTint.bg, color: dynamicTint.color } : undefined}
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

      // Compress image (loaded on demand — only needed once a user picks an image)
      const { default: imageCompression } = await import('browser-image-compression');
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-16">
          <div className="p-6 sm:p-10 rounded-2xl bg-card shadow-border text-center">
            {/* No semantic "success" token exists in the design system (see final report) —
                nearest existing token used: mint background + foreground icon. */}
            <div className="w-16 h-16 rounded-full bg-mint flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-3">
              Application submitted!
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground mb-2">
              Thank you for your interest in joining Shikshaq as a teacher. We have received your application and will review it shortly.
            </p>
            <p className="text-sm text-warm-meta">
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-16">
        <Link
          to="/join"
          className="-my-3 inline-flex min-h-11 items-center text-sm font-semibold text-warm-meta no-underline"
        >
          ← Why join Shikshaq
        </Link>

        {/* Real opening fold for the wizard, shown once before step 1 — a heavy
            display headline plus a NumberedIndex overview of all four steps so the
            ~20-field form reads as navigable rather than daunting up front. */}
        {step === 0 && (
          <div className="mt-6 mb-8">
            <h1 className="font-display text-3xl font-black leading-[1.02] tracking-tight text-foreground sm:text-4xl">
              Join as a{' '}
              <span
                className="marker-highlight marker-highlight--pill"
                style={{ '--marker-color': 'hsl(var(--brand))' } as React.CSSProperties}
              >
                tuition teacher
              </span>
            </h1>
            <p className="mt-2 max-w-prose text-base leading-relaxed text-muted-foreground">
              Four short steps, about five minutes. No commission, no listing fee.
            </p>
            <NumberedIndex
              className="mt-2"
              items={[
                { key: '1', title: 'About you', description: 'Name, contact and years of experience.', color: 'hsl(var(--brand))' },
                { key: '2', title: 'What you teach', description: 'Subjects, boards and classes.', color: 'hsl(var(--brand-blue))' },
                { key: '3', title: 'Where & fees', description: 'Areas you teach in and your monthly rate.', color: 'hsl(var(--brand))' },
                { key: '4', title: 'Review', description: 'Confirm details and send for verification.', color: 'hsl(var(--brand-blue))' },
              ]}
            />
          </div>
        )}

        {/* Stepper — numerals sit on a connecting rail so the four steps read as one
            continuous path rather than four loose chips (bolder card-based step
            presentation per VISUAL_UPGRADE_PLAN, mobile-vibes reference). The current step's
            numeral is now sized up (h-10 vs h-8) and filled solid brand instead of a same-size
            ring — at equal size a ring reads as barely different from "done"/"upcoming",
            which is the "too light a touch" the owner flagged. Logic/order unchanged. */}
        <div className="mb-3 flex items-center">
          {STEPS.map((s, i) => {
            const state = i === step ? 'current' : i < step ? 'done' : 'upcoming';
            // "done" state uses mint/foreground — see success-token note above; no green
            // token exists in the design system.
            const numeralClass =
              state === 'current'
                ? 'h-10 w-10 bg-brand text-brand-foreground shadow-border'
                : state === 'done'
                ? 'h-8 w-8 bg-mint text-foreground'
                : 'h-8 w-8 bg-muted text-warm-meta';
            const labelClass =
              state === 'current' ? 'font-bold text-foreground' : state === 'done' ? 'text-warm-prose' : 'text-warm-meta';
            const railClass = state === 'upcoming' ? 'bg-warm-hairline' : 'bg-mint';
            return (
              <div key={s.label} className={i === STEPS.length - 1 ? 'flex items-center shrink-0' : 'flex flex-1 items-center'}>
                <div className="flex shrink-0 flex-col items-center gap-1.5 sm:flex-row sm:gap-2">
                  <span
                    className={`flex shrink-0 items-center justify-center rounded-full text-xs font-bold transition-[background-color,color,width,height] duration-150 ${numeralClass}`}
                  >
                    {i + 1}
                  </span>
                  <span className={`hidden text-sm whitespace-nowrap sm:inline ${labelClass}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <span className={`mx-2 h-0.5 flex-1 rounded-full transition-colors duration-150 ${railClass}`} aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>
        {/* Step label on mobile — the STEPS labels are hidden below sm: so a phone user only
            ever saw bare numerals with no name for what step they're on. One honest line,
            drawn from the same STEPS array, no new state. */}
        <p className="mb-8 text-sm font-semibold text-warm-meta sm:hidden">
          Step {step + 1} of {STEPS.length} · {STEPS[step].label}
        </p>

        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            // Prevent an Enter keypress in an earlier step from submitting the whole form
            if (e.key === 'Enter' && !isLastStep && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
              e.preventDefault();
            }
          }}
          className="p-6 sm:p-8 rounded-2xl bg-card shadow-border"
        >
          {/* Step 1: About you */}
          {step === 0 && (
            <div className="joinApplyRise">
              <SectionHeading>About you</SectionHeading>

              <div className="grid gap-4">
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
                  />
                  <p className="text-xs text-warm-meta mt-2">Max 200 characters</p>
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
                  />
                  <p className="text-xs text-warm-meta mt-2">Enter a valid email address</p>
                </div>

                {/* Sir or Ma'am */}
                <div>
                  <FieldLabel>Sir or Ma'am *</FieldLabel>
                  <div className="flex gap-2">
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
                  />
                  <p className="text-xs text-warm-meta mt-2">Country code +91 is added automatically</p>
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
              <div className="mb-6">
                <FieldLabel mb="mb-3">Subjects *</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map((subject) => {
                    const selected = valueExistsInString(formData.subjects, subject);
                    const sc = getSubjectColors(subject);
                    return (
                      <Pill
                        key={subject}
                        label={subject}
                        selected={selected}
                        dynamicTint={{ bg: sc.tint, color: sc.titleText }}
                        onClick={() => handleMultiSelectChange('subjects', subject, !selected)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Boards catered */}
              <div className="mb-6">
                <FieldLabel mb="mb-3">Boards catered *</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {BOARDS.map((board) => {
                    const selected = valueExistsInString(formData.school_boards_catered, board);
                    return (
                      <Pill
                        key={board}
                        label={board}
                        selected={selected}
                        tintClass="bg-brand-blue-subtle text-brand-blue-deep"
                        onClick={() => handleMultiSelectChange('school_boards_catered', board, !selected)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Classes */}
              <div className="mb-6">
                <FieldLabel mb="mb-3">Classes *</FieldLabel>
                <div className="flex flex-wrap gap-2">
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
              <div className="mb-6">
                <FieldLabel mb="mb-3">Structure of classes *</FieldLabel>
                <div className="flex flex-wrap gap-2">
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
                  <SelectTrigger id="featured_subject" className={fieldClassName}>
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
                <p className="text-xs text-warm-meta mt-2">
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
              <div className="mb-6">
                <FieldLabel htmlFor="location_v2">Location *</FieldLabel>
                <Select
                  value={formData.location_v2 || "__none__"}
                  onValueChange={(value) => handleInputChange('location_v2', value === "__none__" ? "" : value)}
                >
                  <SelectTrigger id="location_v2" className={fieldClassName}>
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
                <div className="mb-6">
                  <FieldLabel mb="mb-3">Areas you teach in (student's home) *</FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {AREAS.map((area) => {
                      const selected = valueExistsInString(formData.students_home_areas, area);
                      return (
                        <Pill
                          key={area}
                          label={area}
                          selected={selected}
                          tintClass="bg-brand-subtle text-brand-deep"
                          onClick={() => handleMultiSelectChange('students_home_areas', area, !selected)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tutor's Home Areas - Show when Location is "TEACHER'S HOME TUTORING" or "BOTH OPTIONS LISTED" */}
              {showTutorAreas && (
                <div className="mb-6">
                  <FieldLabel mb="mb-3">Areas you teach in (your home) *</FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {AREAS.map((area) => {
                      const selected = valueExistsInString(formData.tutors_home_areas, area);
                      return (
                        <Pill
                          key={area}
                          label={area}
                          selected={selected}
                          tintClass="bg-brand-subtle text-brand-deep"
                          onClick={() => handleMultiSelectChange('tutors_home_areas', area, !selected)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mode of Teaching */}
              <div className="mb-6">
                <FieldLabel mb="mb-3">Mode of teaching *</FieldLabel>
                <div className="flex flex-wrap gap-2">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  />
                </div>
              </div>
              <p className="text-xs text-warm-meta mt-2">Fee range is optional</p>
            </div>
          )}

          {/* Step 4: Review and send */}
          {step === 3 && (
            <div className="joinApplyRise">
              <SectionHeading mb="mb-3">Review and send</SectionHeading>
              <p className="text-base leading-relaxed text-muted-foreground mb-6">
                Our team checks qualifications and existing student references before a profile goes live. That usually takes three working days.
              </p>
              <div className="p-4 rounded-2xl bg-background ring-1 ring-inset ring-warm-hairline text-sm leading-loose text-warm-prose mb-6">
                {summaryNameLine || 'Add your name in step 1'}
                <br />
                {summaryTeachLine || 'Add subjects, boards and classes in step 2'}
                <br />
                {summaryWhereLine || 'Add areas and a fee range in step 3'}
              </div>

              <div className="grid gap-6">
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
                  />
                  <p className="text-xs text-warm-meta mt-2">Max 1000 characters</p>
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
                  />
                  <p className="text-xs text-warm-meta mt-2">Max 500 characters</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    />
                    <p className="text-xs text-warm-meta mt-2">We will call them to verify you're a teacher</p>
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
                    />
                  </div>
                </div>

                {/* Profile Picture */}
                <div>
                  <FieldLabel htmlFor="hero_image">Profile picture *</FieldLabel>
                  <div className="grid gap-3">
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
                        <div className="relative w-full max-w-[340px]">
                          <img
                            src={safeSrc}
                            alt="Profile picture preview"
                            className="w-full h-[190px] object-cover rounded-2xl ring-1 ring-inset ring-warm-hairline"
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
                            className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 rounded-full bg-card/90 shadow-border"
                          >
                            <X className="w-4 h-4 text-foreground" />
                          </button>
                        </div>
                      );
                    })()}
                    <label
                      htmlFor="heroImageUpload"
                      className="inline-flex items-center gap-2 w-fit min-h-11 px-4 rounded-lg text-sm font-semibold text-foreground ring-1 ring-inset ring-warm-hairline cursor-pointer"
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
                    <p className="text-xs text-warm-meta">
                      {selectedImageFile
                        ? 'Image will be uploaded when you submit the form. Max file size: 5MB'
                        : 'Select a professional photo. Image will be uploaded on form submission. Max file size: 5MB'}
                    </p>
                  </div>
                </div>

                {/* Memorandum of Understanding */}
                <div className="rounded-2xl bg-background ring-1 ring-inset ring-warm-hairline p-4 grid gap-4">
                  <p className="text-sm font-semibold text-foreground">
                    Memorandum of Understanding
                  </p>
                  <p className="text-sm leading-relaxed text-warm-prose">
                    This Memorandum of Understanding confirms that you grant Shikshaq permission to display your submitted profile (name, locality, place of teaching, subjects, boards, classes, photo, and WhatsApp link) on our platform for the sole purpose of connecting you with students and enhancing their learning experience.
                  </p>

                  <div className="text-sm text-warm-prose">
                    <p className="font-semibold mb-2">I have read and understood the above Memorandum of Understanding and consent to:</p>
                    <ol className="list-decimal list-inside grid gap-1.5 ml-2">
                      <li>Shikshaq displaying my educator profile as previously submitted;</li>
                      <li>The use of my Whatsapp link to let students land directly on my Whatsapp chat through Shikshaq for communication;</li>
                      <li>The use of my provided information for student outreach and internal communication;</li>
                      <li>This digital form serving as a legally binding agreement.</li>
                    </ol>
                  </div>

                  <div className="flex items-start gap-3 pt-4 border-t border-warm-hairline">
                    <Checkbox
                      id="mou_consent"
                      checked={formData.mou_consent}
                      onCheckedChange={(checked) => handleInputChange('mou_consent', checked)}
                      required
                    />
                    <Label htmlFor="mou_consent" className="text-sm leading-relaxed cursor-pointer">
                      <span className="font-semibold text-foreground">I consent. *</span>
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 mt-6">
            {!isLastStep ? (
              <button
                type="button"
                onClick={goNext}
                className="active:scale-[0.97] transition-transform duration-150 flex items-center justify-center min-h-[50px] px-6 py-4 rounded-lg text-sm font-semibold bg-foreground text-background"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="active:scale-[0.97] transition-transform duration-150 flex items-center justify-center gap-2 min-h-[50px] px-6 py-4 rounded-lg text-sm font-semibold bg-brand text-brand-foreground disabled:opacity-75"
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
                className="active:scale-[0.97] transition-transform duration-150 flex items-center justify-center min-h-[50px] px-6 py-4 rounded-lg text-sm font-semibold text-foreground ring-1 ring-inset ring-warm-hairline"
              >
                Back
              </button>
            )}
          </div>
        </form>
      </main>

      <Footer />

      {/* Step content entry animation and hover feedback for unselected Pill
          toggles, which otherwise have no cue that they're clickable on a
          mouse. Uses the contract's whitelisted fade-slide-up motion. */}
      <style>{`
        .joinApplyRise { animation: fade-slide-up .28s cubic-bezier(.16,1,.3,1) both; }
        @media (hover: hover) {
          .shikshaq-pill-unselected:hover { background-color: hsl(var(--foreground) / 0.04); }
        }
      `}</style>
    </div>
  );
}
