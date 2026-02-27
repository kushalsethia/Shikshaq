import { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Upload, X, CheckCircle2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import DOMPurify from 'dompurify';
import { sanitizeImageUrl, validateImageSrc } from '@/utils/imageSanitizer';

// Constants matching AdminTeachers
const SUBJECTS = [
  'Accounts', 'ACT', 'AP', 'Bengali', 'Biology', 'Business Studies', 'CA', 'CAT', 'Chemistry',
  'Commerce', 'Computers', 'Drawing & Painting', 'Economics', 'English', 'Environmental Science',
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

    handleInputChange(field, newArray.join(', ') || '');
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
        console.log(`Image compressed from ${file.size / 1024 / 1024} MB to ${compressedFile.size / 1024 / 1024} MB`);
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
        if (import.meta.env.DEV) {
          console.error('Upload error:', error);
        }
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
      if (import.meta.env.DEV) {
        console.error('Error uploading image:', error);
      }
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
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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
    if (!formData.reference_number.trim()) {
      toast.error('Please enter the reference student\'s phone number');
      return false;
    }
    // Validate reference number: must be exactly 10 digits
    const referenceDigits = formData.reference_number.replace(/\D/g, '');
    if (referenceDigits.length !== 10) {
      toast.error('Reference phone number must be exactly 10 digits');
      return false;
    }
    // Hero image is required: user must have selected a file to upload
    if (!selectedImageFile) {
      toast.error('Please upload a hero image');
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
          email: formData.email.trim().toLowerCase(),
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
        if (import.meta.env.DEV) {
          console.error('Error submitting application:', error);
        }
        toast.error('Failed to submit application. Please try again.');
        return;
      }

      setSubmitted(true);
      toast.success('Application submitted successfully! We will review it and get back to you soon.');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container pt-32 sm:pt-[120px] pb-16 md:pt-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-card rounded-3xl p-8 border border-border">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-sans text-foreground mb-4">
                Application Submitted!
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Thank you for your interest in joining Shikshaq as a teacher. 
                We have received your application and will review it shortly.
              </p>
              <p className="text-sm text-muted-foreground">
                You will be notified via email once your application has been reviewed.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container pt-32 sm:pt-[120px] pb-16 md:pt-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-sans text-foreground mb-4">
              Join Shikshaq as a Teacher
            </h1>
            <p className="text-lg text-muted-foreground">
              Fill out the form below to apply. All fields marked with * are required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-3xl p-6 md:p-8 border border-border space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-sans text-foreground border-b border-border pb-2">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <Label htmlFor="phone_number">Phone Number *</Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => {
                      // Only allow digits, limit to 10 digits
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                      handleInputChange('phone_number', digits);
                    }}
                    placeholder="10 digit number"
                    maxLength={10}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">Enter 10 digit phone number (country code +91 will be added automatically)</p>
                </div>

                {/* Sir/Ma'am */}
                <div>
                  <Label htmlFor="sir_maam">Sir/Ma'am? *</Label>
                  <Select
                    value={formData.sir_maam}
                    onValueChange={(value) => handleInputChange('sir_maam', value as 'Sir' | "Ma'am")}
                    required
                  >
                    <SelectTrigger id="sir_maam">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {SIR_MAAM.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Teaching Details */}
            <div className="space-y-6">
              <h2 className="text-2xl font-sans text-foreground border-b border-border pb-2">
                Teaching Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subjects */}
                <div className="md:col-span-2">
                  <Label>Subjects *</Label>
                  <div className="flex flex-wrap gap-2 mt-2 max-h-48 overflow-y-auto p-4 border border-border rounded-lg">
                    {SUBJECTS.map((subject) => {
                      const selected = valueExistsInString(formData.subjects, subject);
                      return (
                        <div key={subject} className="flex items-center space-x-2">
                          <Checkbox
                            id={`subject-${subject}`}
                            checked={selected}
                            onCheckedChange={(checked) =>
                              handleMultiSelectChange('subjects', subject, checked as boolean)
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

                {/* Classes Taught */}
                <div className="md:col-span-2">
                  <Label>Classes Taught *</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {CLASSES.map((cls) => {
                      const selected = valueExistsInString(formData.classes_taught_for_backend, cls);
                      return (
                        <div key={cls} className="flex items-center space-x-2">
                          <Checkbox
                            id={`class-${cls}`}
                            checked={selected}
                            onCheckedChange={(checked) =>
                              handleMultiSelectChange('classes_taught_for_backend', cls, checked as boolean)
                            }
                          />
                          <Label htmlFor={`class-${cls}`} className="cursor-pointer">
                            {cls}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* School Boards Catered */}
                <div className="md:col-span-2">
                  <Label>School Boards Catered *</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {BOARDS.map((board) => {
                      const selected = valueExistsInString(formData.school_boards_catered, board);
                      return (
                        <div key={board} className="flex items-center space-x-2">
                          <Checkbox
                            id={`board-${board}`}
                            checked={selected}
                            onCheckedChange={(checked) =>
                              handleMultiSelectChange('school_boards_catered', board, checked as boolean)
                            }
                          />
                          <Label htmlFor={`board-${board}`} className="cursor-pointer">
                            {board}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Location V2 */}
                <div>
                  <Label htmlFor="location_v2">Location *</Label>
                  <Select
                    value={formData.location_v2 || ""}
                    onValueChange={(value) => handleInputChange('location_v2', value)}
                    required
                  >
                    <SelectTrigger id="location_v2">
                      <SelectValue placeholder="Select location option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEACHER'S HOME TUTORING">Teacher's Home Tutoring Only</SelectItem>
                      <SelectItem value="STUDENT'S HOME TUTORING ONLY">Student's Home Tutoring Only</SelectItem>
                      <SelectItem value="BOTH OPTIONS LISTED">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Featured Subject */}
                <div>
                  <Label htmlFor="featured_subject">Featured Subject</Label>
                  <Select
                    value={formData.featured_subject || "none"}
                    onValueChange={(value) => handleInputChange('featured_subject', value === "none" ? "" : value)}
                  >
                    <SelectTrigger id="featured_subject">
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

                {/* Mode of Teaching */}
                <div>
                  <Label>Mode of Teaching *</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {MODE_OF_TEACHING.map((mode) => {
                      const selected = valueExistsInString(formData.mode_of_teaching, mode);
                      return (
                        <div key={mode} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mode-${mode}`}
                            checked={selected}
                            onCheckedChange={(checked) =>
                              handleMultiSelectChange('mode_of_teaching', mode, checked as boolean)
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

                {/* Structure of classes (stored as class_size) */}
                <div>
                  <Label>Structure of classes *</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {CLASS_SIZE.map((size) => {
                      const selected = valueExistsInString(formData.class_size, size);
                      return (
                        <div key={size} className="flex items-center space-x-2">
                          <Checkbox
                            id={`classSize-${size}`}
                            checked={selected}
                            onCheckedChange={(checked) =>
                              handleMultiSelectChange('class_size', size, checked as boolean)
                            }
                          />
                          <Label htmlFor={`classSize-${size}`} className="cursor-pointer">
                            {size === 'Solo' ? 'One-on-one' : size}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Student's Home Areas - Show when Location is "STUDENT'S HOME TUTORING ONLY" or "BOTH OPTIONS LISTED" */}
                {(formData.location_v2 === "STUDENT'S HOME TUTORING ONLY" || formData.location_v2 === "BOTH OPTIONS LISTED") && (
                  <div className="md:col-span-2">
                    <Label>Student's Home in These Areas *</Label>
                    <div className="flex flex-wrap gap-2 mt-2 max-h-48 overflow-y-auto p-4 border border-border rounded-lg">
                      {AREAS.map((area) => {
                        const selected = valueExistsInString(formData.students_home_areas, area);
                        return (
                          <div key={area} className="flex items-center space-x-2">
                            <Checkbox
                              id={`student-area-${area}`}
                              checked={selected}
                              onCheckedChange={(checked) =>
                                handleMultiSelectChange('students_home_areas', area, checked as boolean)
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
                )}

                {/* Tutor's Home Areas - Show when Location is "TEACHER'S HOME TUTORING" or "BOTH OPTIONS LISTED" */}
                {(formData.location_v2 === "TEACHER'S HOME TUTORING" || formData.location_v2 === "BOTH OPTIONS LISTED") && (
                  <div className="md:col-span-2">
                    <Label>Tutor's Home in These Areas *</Label>
                    <div className="flex flex-wrap gap-2 mt-2 max-h-48 overflow-y-auto p-4 border border-border rounded-lg">
                      {AREAS.map((area) => {
                        const selected = valueExistsInString(formData.tutors_home_areas, area);
                        return (
                          <div key={area} className="flex items-center space-x-2">
                            <Checkbox
                              id={`tutor-area-${area}`}
                              checked={selected}
                              onCheckedChange={(checked) =>
                                handleMultiSelectChange('tutors_home_areas', area, checked as boolean)
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
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-sans text-foreground border-b border-border pb-2">
                Additional Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Introduction */}
                <div className="md:col-span-2">
                  <Label htmlFor="description">Profile Introduction</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={5}
                    placeholder="Tell us about yourself and your teaching approach..."
                  />
                </div>

                {/* Qualifications */}
                <div className="md:col-span-2">
                  <Label htmlFor="qualifications_etc">Qualifications</Label>
                  <Textarea
                    id="qualifications_etc"
                    value={formData.qualifications_etc}
                    onChange={(e) => handleInputChange('qualifications_etc', e.target.value)}
                    rows={3}
                    placeholder="Your educational qualifications, certifications, etc."
                  />
                </div>

                {/* Experience (years started teaching) */}
                <div>
                  <Label htmlFor="years_started_teaching">Experience</Label>
                  <Input
                    id="years_started_teaching"
                    value={formData.years_started_teaching}
                    onChange={(e) => handleInputChange('years_started_teaching', e.target.value)}
                    placeholder="e.g., 2015"
                  />
                </div>

                {/* Reference Name */}
                <div>
                  <Label htmlFor="reference_name">Student who referred you (we may contact them for verification) *</Label>
                  <Input
                    id="reference_name"
                    value={formData.reference_name}
                    onChange={(e) => handleInputChange('reference_name', e.target.value)}
                    placeholder="Name of the student who referred you"
                    required
                  />
                </div>

                {/* Reference Number */}
                <div>
                  <Label htmlFor="reference_number">Reference Number (Student's Number) *</Label>
                  <Input
                    id="reference_number"
                    type="tel"
                    value={formData.reference_number}
                    onChange={(e) => {
                      // Only allow digits, limit to 10
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                      handleInputChange('reference_number', digits);
                    }}
                    placeholder="10 digit number"
                    maxLength={10}
                    required
                  />
                </div>

                {/* Min Fees */}
                <div>
                  <Label htmlFor="min_fees">Minimum Fees per Month (₹)</Label>
                  <Input
                    id="min_fees"
                    type="tel"
                    value={formData.min_fees}
                    onChange={(e) => {
                      // Only allow digits, limit to 6 digits
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                      handleInputChange('min_fees', digits);
                    }}
                    placeholder="e.g., 2000"
                    maxLength={6}
                    inputMode="numeric"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Optional - Enter minimum monthly fees</p>
                </div>

                {/* Max Fees */}
                <div>
                  <Label htmlFor="max_fees">Maximum Fees per Month (₹)</Label>
                  <Input
                    id="max_fees"
                    type="tel"
                    value={formData.max_fees}
                    onChange={(e) => {
                      // Only allow digits, limit to 6 digits
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                      handleInputChange('max_fees', digits);
                    }}
                    placeholder="e.g., 5000"
                    maxLength={6}
                    inputMode="numeric"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Optional - Enter maximum monthly fees</p>
                </div>

                {/* Hero Image */}
                <div className="md:col-span-2">
                  <Label htmlFor="hero_image">Hero Image *</Label>
                  <div className="space-y-3">
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
                        <div className="relative w-full max-w-md">
                          <img
                            src={safeSrc}
                            alt="Hero preview"
                            className="w-full h-48 object-cover rounded-lg border"
                            onError={() => setImagePreview(null)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              // Clean up object URL if it's a blob URL
                              if (imagePreview && imagePreview.startsWith('blob:')) {
                                URL.revokeObjectURL(imagePreview);
                              }
                              setSelectedImageFile(null);
                              setImagePreview(null);
                              handleInputChange('hero_image_url', '');
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
                    <p className="text-xs text-muted-foreground">
                      {selectedImageFile 
                        ? 'Image will be uploaded when you submit the form. Max file size: 5MB'
                        : 'Select a professional photo. Image will be uploaded on form submission. Max file size: 5MB'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* MOU Consent */}
            <div className="space-y-6">
              <h2 className="text-2xl font-sans text-foreground border-b border-border pb-2">
                Memorandum of Understanding *
              </h2>

              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <p className="text-sm text-foreground leading-relaxed">
                  This Memorandum of Understanding confirms that you grant Shikshaq permission to display your submitted profile (name, locality, place of teaching, subjects, boards, classes, photo, and WhatsApp link) on our platform for the sole purpose of connecting you with students and enhancing their learning experience.
                </p>

                <p className="text-sm font-medium text-foreground">
                  Please review the statement below and provide your consent in order to proceed.
                </p>

                <div className="space-y-2 text-sm text-foreground">
                  <p><strong>I have read and understood the above Memorandum of Understanding and consent to:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Shikshaq displaying my educator profile as previously submitted;</li>
                    <li>The use of my Whatsapp link to let students land directly on my Whatsapp chat through Shikshaq for communication;</li>
                    <li>The use of my provided information for student outreach and internal communication;</li>
                    <li>This digital form serving as a legally binding agreement.</li>
                  </ol>
                </div>

                <div className="flex items-start space-x-3 pt-4 border-t border-border">
                  <Checkbox
                    id="mou_consent"
                    checked={formData.mou_consent}
                    onCheckedChange={(checked) => handleInputChange('mou_consent', checked)}
                    required
                  />
                  <Label htmlFor="mou_consent" className="cursor-pointer text-sm leading-relaxed">
                    <span className="font-medium">I consent. *</span>
                  </Label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-border">
              <Button
                type="submit"
                size="lg"
                className="w-full md:w-auto"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

