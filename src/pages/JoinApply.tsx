import { useState, useEffect } from 'react';
import { Footer } from '@/components/Footer';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field, FieldInput, FieldTextarea, useBlurValidation } from '@/components/ui/field';
import { Eyebrow } from '@/components/ui/eyebrow';
import { ProgressSteps } from '@/components/join/progress-bar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';
import { Loader2, Upload, X, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import DOMPurify from 'dompurify';
import { sanitizeImageUrl, validateImageSrc } from '@/utils/imageSanitizer';
import { getSubjectColors } from '@/utils/subjectColors';
import { Link } from 'react-router-dom';

/* Redesign C-060 (changelog) — five-step teacher listing form (mockup J1–J5).
   Rewritten on top of the shared Field/FieldInput/FieldTextarea/useBlurValidation
   primitives and the new ProgressSteps segmented bar (C14). Every field this form
   collected before is still collected here — the approve_teacher_application RPC
   reads ~22 columns off teacher_applications, so nothing was dropped, only
   regrouped into the J1–J5 step order. See the task report for the full field
   inventory and the O-07 note on why no ID/degree upload was added. */

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

// J1–J5: head + lede, verbatim from copy.md §8.
const STEPS = [
  { label: 'Who you are', head: "Let's get you listed", lede: 'Free to list, free to stay. We never take a cut of your fee.' },
  { label: 'What you teach', head: 'What do you teach?', lede: 'Pick everything you genuinely teach. Guardians filter on this, so be honest.' },
  { label: 'Where you teach', head: 'Where do you teach?', lede: 'Travel radius matters more than an address. Nobody sees your exact address.' },
  { label: 'Your fee, your terms', head: 'What do you charge?', lede: 'You set it, you keep it. ShikshAQ takes nothing and never handles the money.' },
  { label: 'With us now', head: 'With us now', lede: 'A person reads every application. Usually the same day, at worst two.' },
];

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

  const valueExistsInString = (str: string | null, value: string): boolean => {
    if (!str) return false;
    const values = str.split(',').map((v) => v.trim().toLowerCase());
    return values.includes(value.trim().toLowerCase());
  };

  const handleInputChange = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

    setSelectedImageFile(file);
    const previewUrl = URL.createObjectURL(file);

    if (!previewUrl.startsWith('blob:')) {
      toast.error('Failed to create image preview');
      return;
    }

    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(previewUrl);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true);

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

      // Path is relative to bucket root — this is the storage location the app
      // has always used for application photos. Unrelated to O-07 (verification
      // documents); this bucket only ever holds the profile photo.
      const fileExt = compressedFile.name.split('.').pop();
      const fileName = `application-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('hero-images')
        .upload(fileName, compressedFile, { cacheControl: '3600', upsert: false });

      if (error) {
        logger.error('JoinApply.uploadImage', error);
        throw new Error('Image upload failed');
      }

      const { data: { publicUrl } } = supabase.storage.from('hero-images').getPublicUrl(data.path);

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
      toast.error('Please enter your WhatsApp number');
      return false;
    }
    const phoneDigits = formData.phone_number.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      toast.error('WhatsApp number must be exactly 10 digits');
      return false;
    }
    if (!formData.sir_maam) {
      toast.error("Please select Sir or Ma'am");
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
    if (formData.location_v2 === "STUDENT'S HOME TUTORING ONLY") {
      if (!formData.students_home_areas.trim()) {
        toast.error("Please select at least one area for Student's Home Tutoring");
        return false;
      }
    } else if (formData.location_v2 === "TEACHER'S HOME TUTORING") {
      if (!formData.tutors_home_areas.trim()) {
        toast.error("Please select at least one area for Teacher's Home Tutoring");
        return false;
      }
    } else if (formData.location_v2 === 'BOTH OPTIONS LISTED') {
      if (!formData.students_home_areas.trim()) {
        toast.error("Please select at least one area for Student's Home Tutoring");
        return false;
      }
      if (!formData.tutors_home_areas.trim()) {
        toast.error("Please select at least one area for Teacher's Home Tutoring");
        return false;
      }
    }
    if (!formData.reference_name.trim()) {
      toast.error("Please enter the reference student's name");
      return false;
    }
    if (formData.reference_name.length > 200) {
      toast.error('Student name (for verification) must be at most 200 characters');
      return false;
    }
    if (!formData.reference_number.trim()) {
      toast.error("Please enter the reference student's phone number");
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
    const referenceDigits = formData.reference_number.replace(/\D/g, '');
    if (referenceDigits.length !== 10) {
      toast.error('Student number must be exactly 10 digits');
      return false;
    }
    if (!selectedImageFile) {
      toast.error('Please upload a photo');
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

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      let heroImageUrl = formData.hero_image_url;
      if (selectedImageFile) {
        try {
          heroImageUrl = await uploadImage(selectedImageFile);
          if (!heroImageUrl) {
            toast.error('Failed to upload image. Please try again.');
            return;
          }
        } catch {
          toast.error('Failed to upload image. Please try again.');
          return;
        }
      }

      const { error } = await supabase.from('teacher_applications').insert({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone_number: formData.phone_number.replace(/\D/g, ''),
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
        reference_number: formData.reference_number.replace(/\D/g, '') || null,
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

  // Blur-only validators for the plain text fields (Field primitive contract).
  const nameV = useBlurValidation(formData.name, (v) => (!v.trim() ? 'Enter your name.' : v.length > 200 ? 'Name must be at most 200 characters.' : undefined));
  const emailV = useBlurValidation(formData.email, (v) =>
    !v.trim() ? 'Enter your email.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? 'That email address does not look right.' : undefined,
  );
  const phoneV = useBlurValidation(formData.phone_number, (v) => (v.replace(/\D/g, '').length !== 10 ? 'Enter a 10-digit WhatsApp number.' : undefined));
  const refNameV = useBlurValidation(formData.reference_name, (v) => (!v.trim() ? "Enter the student's name." : undefined));
  const refNumberV = useBlurValidation(formData.reference_number, (v) => (v.replace(/\D/g, '').length !== 10 ? 'Enter a 10-digit number.' : undefined));

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-16">
          <div className="p-6 sm:p-10 rounded-2xl bg-card shadow-border text-center">
            <div className="w-16 h-16 rounded-full bg-mint flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-3">
              Application submitted!
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground mb-2">
              Nothing goes live until a human has read it. If something is missing we message you on WhatsApp instead of rejecting you.
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
        toast.error('WhatsApp number must be exactly 10 digits');
        return false;
      }
      if (!selectedImageFile) {
        toast.error('Please upload a photo');
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
    if (stepIndex === 3) {
      if (!formData.mou_consent) {
        // MOU lives on the final step, but fee/terms is where we ask them to read it isn't blocking here.
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

  const showStudentAreas = formData.location_v2 === "STUDENT'S HOME TUTORING ONLY" || formData.location_v2 === 'BOTH OPTIONS LISTED';
  const showTutorAreas = formData.location_v2 === "TEACHER'S HOME TUTORING" || formData.location_v2 === 'BOTH OPTIONS LISTED';

  const currentStep = STEPS[step];

  return (
    <div className="min-h-screen bg-background">

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-16">
        <Link to="/join" className="-my-3 inline-flex min-h-11 items-center text-sm font-semibold text-warm-meta no-underline">
          ← Why join ShikshAQ
        </Link>

        <ProgressSteps steps={STEPS.length} current={step} label={currentStep.label} className="mt-6 mb-6" />

        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isLastStep && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
              e.preventDefault();
            }
          }}
          className="p-6 sm:p-8 rounded-2xl bg-card shadow-border"
        >
          {/* Step body scrolls on the longer steps (J4/J5) rather than fixing a
              height — changelog.json C-060 note. */}
          <div className="max-h-[70vh] overflow-y-auto sm:max-h-none sm:overflow-visible">
            {/* J1 — who you are */}
            {step === 0 && (
              <div className="joinApplyRise">
                <h1 className="font-display text-3xl font-black leading-[1.02] tracking-tight text-foreground sm:text-4xl">
                  {currentStep.head}
                </h1>
                <p className="mt-2 mb-6 max-w-prose text-base leading-relaxed text-muted-foreground">{currentStep.lede}</p>

                <div className="grid gap-4">
                  <Field label="Full name" required error={nameV.error}>
                    {(p) => (
                      <FieldInput
                        {...p}
                        autoComplete="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        onBlur={nameV.onBlur}
                        placeholder="e.g. Ananya Ghosh"
                        maxLength={200}
                      />
                    )}
                  </Field>

                  <Field label="Email" required error={emailV.error}>
                    {(p) => (
                      <FieldInput
                        {...p}
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        autoCapitalize="none"
                        spellCheck={false}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onBlur={emailV.onBlur}
                        placeholder="e.g. name@example.com"
                        maxLength={254}
                      />
                    )}
                  </Field>

                  <div>
                    <Eyebrow as="p" className="mb-2">Sir or Ma'am *</Eyebrow>
                    <div className="flex gap-2">
                      {SIR_MAAM.map((option) => (
                        <Pill key={option} label={option} selected={formData.sir_maam === option} onClick={() => handleInputChange('sir_maam', option)} />
                      ))}
                    </div>
                  </div>

                  <Field label="WhatsApp number" required error={phoneV.error} hint="Shown only once a guardian taps WhatsApp — never on the open page, never in search results.">
                    {(p) => (
                      <FieldInput
                        {...p}
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        autoCapitalize="none"
                        spellCheck={false}
                        value={formData.phone_number}
                        onChange={(e) => handleInputChange('phone_number', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        onBlur={phoneV.onBlur}
                        placeholder="10-digit number"
                        maxLength={10}
                      />
                    )}
                  </Field>

                  <Field label="Years of experience" hint="Optional">
                    {(p) => (
                      <FieldInput
                        {...p}
                        value={formData.years_started_teaching}
                        onChange={(e) => handleInputChange('years_started_teaching', e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="e.g. 12"
                        maxLength={4}
                        inputMode="numeric"
                      />
                    )}
                  </Field>

                  {/* Photo — moved up from the old final-step location to match J1
                      ("who you are: name, WhatsApp, years, photo"). */}
                  <div>
                    <Eyebrow as="p" className="mb-2">Photo *</Eyebrow>
                    <div className="grid gap-3">
                      {imagePreview && (() => {
                        const validatedUrl = validateImageSrc(imagePreview);
                        if (!validatedUrl) return null;
                        const safeSrc = DOMPurify.sanitize(validatedUrl, { ALLOWED_TAGS: [], ALLOWED_ATTR: [], KEEP_CONTENT: true });
                        if (!safeSrc) return null;
                        return (
                          <div className="relative w-full max-w-[340px]">
                            <img
                              src={safeSrc}
                              alt="Photo preview"
                              className="w-full h-[190px] object-cover rounded-2xl ring-1 ring-inset ring-warm-hairline"
                              onError={() => setImagePreview(null)}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (imagePreview && imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
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
                        {selectedImageFile ? 'Change photo' : 'Select photo'}
                        <input id="heroImageUpload" type="file" accept="image/*" className="hidden" onChange={handleImageFileChange} disabled={submitting} />
                      </label>
                      <p className="text-meta text-warm-meta">
                        {selectedImageFile ? 'Uploaded when you submit the form. Max 5MB.' : 'A professional photo helps. Max 5MB.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* J2 — what you teach */}
            {step === 1 && (
              <div className="joinApplyRise">
                <h1 className="font-display text-3xl font-black leading-[1.02] tracking-tight text-foreground sm:text-4xl">{currentStep.head}</h1>
                <p className="mt-2 mb-6 max-w-prose text-base leading-relaxed text-muted-foreground">{currentStep.lede}</p>

                <div className="mb-6">
                  <Eyebrow as="p" className="mb-3">Subjects *</Eyebrow>
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

                <div className="mb-6">
                  <Eyebrow as="p" className="mb-3">Boards catered *</Eyebrow>
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

                <div className="mb-6">
                  <Eyebrow as="p" className="mb-3">Classes *</Eyebrow>
                  <div className="flex flex-wrap gap-2">
                    {CLASSES.map((cls) => {
                      const selected = valueExistsInString(formData.classes_taught_for_backend, cls);
                      return (
                        <Pill key={cls} label={cls} selected={selected} onClick={() => handleMultiSelectChange('classes_taught_for_backend', cls, !selected)} />
                      );
                    })}
                  </div>
                </div>

                <div className="mb-6">
                  <Eyebrow as="p" className="mb-3">Structure of classes *</Eyebrow>
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

                <Field label="Featured subject" hint="Choose one of your selected subjects to feature on your profile">
                  {(p) => (
                    <Select
                      value={(() => {
                        const selectedSubjects = (formData.subjects || '').split(',').map((s) => s.trim()).filter(Boolean);
                        const current = formData.featured_subject;
                        return current && selectedSubjects.includes(current) ? current : 'none';
                      })()}
                      onValueChange={(value) => handleInputChange('featured_subject', value === 'none' ? '' : value)}
                    >
                      <SelectTrigger id={p.id} className={p.className}>
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
                  )}
                </Field>
              </div>
            )}

            {/* J3 — where you teach */}
            {step === 2 && (
              <div className="joinApplyRise">
                <h1 className="font-display text-3xl font-black leading-[1.02] tracking-tight text-foreground sm:text-4xl">{currentStep.head}</h1>
                <p className="mt-2 mb-6 max-w-prose text-base leading-relaxed text-muted-foreground">{currentStep.lede}</p>

                <Field label="Location" required className="mb-6">
                  {(p) => (
                    <Select value={formData.location_v2 || '__none__'} onValueChange={(value) => handleInputChange('location_v2', value === '__none__' ? '' : value)}>
                      <SelectTrigger id={p.id} className={p.className}>
                        <SelectValue placeholder="Select location option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">None</SelectItem>
                        <SelectItem value="TEACHER'S HOME TUTORING">Teacher's home tutoring only</SelectItem>
                        <SelectItem value="STUDENT'S HOME TUTORING ONLY">Student's home tutoring only</SelectItem>
                        <SelectItem value="BOTH OPTIONS LISTED">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </Field>

                {showStudentAreas && (
                  <div className="mb-6">
                    <Eyebrow as="p" className="mb-3">Areas you teach in (student's home) *</Eyebrow>
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

                {showTutorAreas && (
                  <div className="mb-6">
                    <Eyebrow as="p" className="mb-3">Areas you teach in (your home) *</Eyebrow>
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

                <p className="mb-2 text-meta text-warm-meta">We show your locality and radius — "Doranda, travels 5 km" — and nothing more precise than that.</p>

                <div className="mb-6">
                  <Eyebrow as="p" className="mb-3">Mode of teaching *</Eyebrow>
                  <div className="flex flex-wrap gap-2">
                    {MODE_OF_TEACHING.map((mode) => {
                      const selected = valueExistsInString(formData.mode_of_teaching, mode);
                      return (
                        <Pill key={mode} label={mode} selected={selected} onClick={() => handleMultiSelectChange('mode_of_teaching', mode, !selected)} />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* J4 — your fee, your terms */}
            {step === 3 && (
              <div className="joinApplyRise">
                <h1 className="font-display text-3xl font-black leading-[1.02] tracking-tight text-foreground sm:text-4xl">{currentStep.head}</h1>
                <p className="mt-2 mb-4 max-w-prose text-base leading-relaxed text-muted-foreground">{currentStep.lede}</p>

                {/* copy.md §8 J4 — required disclosure, verbatim. */}
                <p className="mb-6 rounded-2xl bg-background p-4 text-sm leading-relaxed text-warm-prose ring-1 ring-inset ring-warm-hairline">
                  Guardians and teachers settle fees between themselves. We never invoice, never hold a deposit, and never show a "platform price".
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <Field label="Minimum fee / month" hint="Optional">
                    {(p) => (
                      <FieldInput
                        {...p}
                        type="tel"
                        value={formData.min_fees}
                        onChange={(e) => handleInputChange('min_fees', e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="₹3,000"
                        maxLength={6}
                        inputMode="numeric"
                      />
                    )}
                  </Field>
                  <Field label="Maximum fee / month" hint="Optional">
                    {(p) => (
                      <FieldInput
                        {...p}
                        type="tel"
                        value={formData.max_fees}
                        onChange={(e) => handleInputChange('max_fees', e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="₹5,000"
                        maxLength={6}
                        inputMode="numeric"
                      />
                    )}
                  </Field>
                </div>

                <div className="grid gap-6">
                  <Field label="Profile introduction, in your own words" hint={`${formData.description.length}/1000`}>
                    {(p) => (
                      <FieldTextarea
                        {...p}
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={5}
                        placeholder="Tell us about yourself and your teaching approach..."
                        maxLength={1000}
                      />
                    )}
                  </Field>

                  <Field label="Educational qualifications" hint={`${formData.qualifications_etc.length}/500`}>
                    {(p) => (
                      <FieldTextarea
                        {...p}
                        value={formData.qualifications_etc}
                        onChange={(e) => handleInputChange('qualifications_etc', e.target.value)}
                        rows={3}
                        placeholder="Your educational qualifications, certifications, etc."
                        maxLength={500}
                      />
                    )}
                  </Field>
                </div>
              </div>
            )}

            {/* J5 — with us now */}
            {step === 4 && (
              <div className="joinApplyRise">
                <h1 className="font-display text-3xl font-black leading-[1.02] tracking-tight text-foreground sm:text-4xl">{currentStep.head}</h1>
                <p className="mt-2 mb-6 max-w-prose text-base leading-relaxed text-muted-foreground">
                  {currentStep.lede} Nothing goes live until a human has read it. If something is missing we message you on WhatsApp instead of rejecting you.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <Field label="Student name (for verification)" required error={refNameV.error} hint="We will call them to verify you're a teacher">
                    {(p) => (
                      <FieldInput
                        {...p}
                        value={formData.reference_name}
                        onChange={(e) => handleInputChange('reference_name', e.target.value)}
                        onBlur={refNameV.onBlur}
                        placeholder="Name of a student we can contact"
                        maxLength={200}
                      />
                    )}
                  </Field>

                  <Field label="Student number (for verification)" required error={refNumberV.error}>
                    {(p) => (
                      <FieldInput
                        {...p}
                        type="tel"
                        inputMode="numeric"
                        autoComplete="off"
                        value={formData.reference_number}
                        onChange={(e) => handleInputChange('reference_number', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        onBlur={refNumberV.onBlur}
                        placeholder="10-digit number"
                        maxLength={10}
                      />
                    )}
                  </Field>
                </div>

                <div className="rounded-2xl bg-background ring-1 ring-inset ring-warm-hairline p-4 grid gap-4">
                  <p className="text-sm font-semibold text-foreground">Memorandum of Understanding</p>
                  <p className="text-sm leading-relaxed text-warm-prose">
                    This Memorandum of Understanding confirms that you grant ShikshAQ permission to display your submitted profile (name, locality, place of
                    teaching, subjects, boards, classes, photo, and WhatsApp link) on our platform for the sole purpose of connecting you with students and
                    enhancing their learning experience.
                  </p>
                  <div className="text-sm text-warm-prose">
                    <p className="font-semibold mb-2">I have read and understood the above Memorandum of Understanding and consent to:</p>
                    <ol className="list-decimal list-inside grid gap-1.5 ml-2">
                      <li>ShikshAQ displaying my educator profile as previously submitted;</li>
                      <li>The use of my WhatsApp link to let students land directly on my WhatsApp chat through ShikshAQ for communication;</li>
                      <li>The use of my provided information for student outreach and internal communication;</li>
                      <li>This digital form serving as a legally binding agreement.</li>
                    </ol>
                  </div>
                  <div className="flex items-start gap-3 pt-4 border-t border-warm-hairline">
                    <Checkbox id="mou_consent" checked={formData.mou_consent} onCheckedChange={(checked) => handleInputChange('mou_consent', checked === true)} required />
                    <label htmlFor="mou_consent" className="text-sm leading-relaxed cursor-pointer">
                      <span className="font-semibold text-foreground">I consent. *</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions — join-01-who-you-are.png puts a small square Back on the
              LEFT and a wide solid-orange Continue filling the rest of the row.
              This had them the other way round, with Continue rendered first, so
              on a phone Back sat to the right of the button it undoes; and
              Continue was `dark` where every join mockup shows it orange, which
              made the step's primary action read as secondary. */}
          <div className="mt-6 flex items-center gap-2">
            {step > 0 && (
              <Button
                type="button"
                onClick={goBack}
                variant="muted"
                size={54}
                aria-label="Back to the previous step"
                className="flex-none"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}

            {!isLastStep ? (
              <Button type="button" onClick={goNext} variant="primary" size={54} className="flex-1">
                Continue
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={submitting}
                busy={submitting}
                variant="primary"
                size={54}
                className="flex-1"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Send application'
                )}
              </Button>
            )}
          </div>
        </form>
      </main>

      <Footer />

      <style>{`
        .joinApplyRise { animation: fade-slide-up .28s cubic-bezier(.16,1,.3,1) both; }
        @media (hover: hover) {
          .shikshaq-pill-unselected:hover { background-color: hsl(var(--foreground) / 0.04); }
        }
      `}</style>
    </div>
  );
}
