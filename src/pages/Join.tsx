import { useState } from 'react';
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

// Constants matching AdminTeachers
const SUBJECTS = [
  'Accounts', 'ACT', 'AP', 'Bengali', 'Biology', 'Business Studies', 'CA', 'CAT', 'Chemistry',
  'Commerce', 'Computers', 'Drawing & Painting', 'Economics', 'English', 'Environmental Science',
  'Geography', 'Hindi', 'History & Civics', 'Home Science', 'JEE', 'Legal Studies', 'Maths',
  'NEET', 'NMAT', 'Physics', 'Political Science', 'Psychology', 'SAT', 'Science',
  'Sanskrit', 'Social Studies', 'Sociology'
];

const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'UG'];

const BOARDS = ['ICSE/ISC', 'CBSE', 'IGCSE', 'IB', 'State', 'College'];

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
  whatsapp_link: string;
  hero_image_url: string;
  mou_consent: boolean;
}

export default function Join() {
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
    whatsapp_link: '',
    hero_image_url: '',
    mou_consent: false,
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Helper function to check if a value exists in a comma-separated string (case-insensitive)
  const valueExistsInString = (str: string | null, value: string): boolean => {
    if (!str) return false;
    const values = str.split(',').map(v => v.trim().toLowerCase());
    return values.includes(value.trim().toLowerCase());
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
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

  const sanitizeImageUrl = (url: string): string | null => {
    if (!url || typeof url !== 'string') return null;
    
    const sanitizedString = DOMPurify.sanitize(url.trim(), { 
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true 
    });
    
    if (!sanitizedString) return null;
    
    try {
      const urlObj = new URL(sanitizedString);
      if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
        return urlObj.href;
      }
    } catch {
      if (sanitizedString.startsWith('data:image/')) {
        const dataUriPattern = new RegExp('^data:image/(jpeg|jpg|png|gif|webp);base64,[A-Za-z0-9+/=]+$', 'i');
        if (dataUriPattern.test(sanitizedString)) {
          return sanitizedString;
        }
      }
    }
    return null;
  };

  const handleImageUpload = async (file: File) => {
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
        toast.error('Image upload failed. Please try again.');
        if (import.meta.env.DEV) {
          console.error('Upload error:', error);
        }
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('hero-images')
        .getPublicUrl(data.path);

      const sanitizedUrl = sanitizeImageUrl(publicUrl);
      if (sanitizedUrl) {
        handleInputChange('hero_image_url', sanitizedUrl);
        setImagePreview(sanitizedUrl);
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Failed to generate valid image URL');
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error uploading image:', error);
      }
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    handleImageUpload(file);
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

      const { error } = await supabase
        .from('teacher_applications')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone_number: formData.phone_number.trim(),
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
          whatsapp_link: formData.whatsapp_link.trim() || null,
          hero_image_url: formData.hero_image_url || null,
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
              <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
                Application Submitted!
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Thank you for your interest in joining ShikshAQ as a teacher. 
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
            <h1 className="text-3xl md:text-5xl font-serif text-foreground mb-4">
              Join ShikshAQ as a Teacher
            </h1>
            <p className="text-lg text-muted-foreground">
              Fill out the form below to apply. All fields marked with * are required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-3xl p-6 md:p-8 border border-border space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-foreground border-b border-border pb-2">
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
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    required
                  />
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
              <h2 className="text-2xl font-serif text-foreground border-b border-border pb-2">
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
                  <Label>School Boards Catered</Label>
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
                  <Label htmlFor="location_v2">Location</Label>
                  <Select
                    value={formData.location_v2}
                    onValueChange={(value) => handleInputChange('location_v2', value)}
                  >
                    <SelectTrigger id="location_v2">
                      <SelectValue placeholder="Select location option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      <SelectItem value="TEACHER'S HOME TUTORING">TEACHER'S HOME TUTORING</SelectItem>
                      <SelectItem value="STUDENT'S HOME TUTORING ONLY">STUDENT'S HOME TUTORING ONLY</SelectItem>
                      <SelectItem value="BOTH OPTIONS LISTED">BOTH OPTIONS LISTED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Featured Subject */}
                <div>
                  <Label htmlFor="featured_subject">Featured Subject</Label>
                  <Select
                    value={formData.featured_subject}
                    onValueChange={(value) => handleInputChange('featured_subject', value)}
                  >
                    <SelectTrigger id="featured_subject">
                      <SelectValue placeholder="Select featured subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
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
                  <Label>Mode of Teaching</Label>
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

                {/* Class Size */}
                <div>
                  <Label>Class Size</Label>
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
                            {size}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Student's Home Areas */}
                <div className="md:col-span-2">
                  <Label>Student's Home in These Areas</Label>
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

                {/* Tutor's Home Areas */}
                <div className="md:col-span-2">
                  <Label>Tutor's Home in These Areas</Label>
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
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-foreground border-b border-border pb-2">
                Additional Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Description */}
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
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

                {/* Years Started Teaching */}
                <div>
                  <Label htmlFor="years_started_teaching">Years Started Teaching</Label>
                  <Input
                    id="years_started_teaching"
                    value={formData.years_started_teaching}
                    onChange={(e) => handleInputChange('years_started_teaching', e.target.value)}
                    placeholder="e.g., 2015"
                  />
                </div>

                {/* WhatsApp Link */}
                <div>
                  <Label htmlFor="whatsapp_link">WhatsApp Link</Label>
                  <Input
                    id="whatsapp_link"
                    value={formData.whatsapp_link}
                    onChange={(e) => handleInputChange('whatsapp_link', e.target.value)}
                    placeholder="https://wa.me/..."
                  />
                </div>

                {/* Hero Image */}
                <div className="md:col-span-2">
                  <Label htmlFor="hero_image">Hero Image</Label>
                  <div className="space-y-3">
                    {imagePreview && (
                      <div className="relative w-full max-w-md">
                        <img
                          src={imagePreview}
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
                            handleInputChange('hero_image_url', '');
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
                      Upload a professional photo. Max file size: 5MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* MOU Consent */}
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-foreground border-b border-border pb-2">
                Memorandum of Understanding
              </h2>

              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <p className="text-sm text-foreground leading-relaxed">
                  This Memorandum of Understanding confirms that you grant ShikshAq permission to display your submitted profile (name, locality, place of teaching, subjects, boards, classes, photo, and WhatsApp link) on our platform for the sole purpose of connecting you with students and enhancing their learning experience. Your mobile number will remain confidential and used only for identity verification and internal communication.
                </p>

                <p className="text-sm font-medium text-foreground">
                  Please review the statement below and provide your consent in order to proceed.
                </p>

                <div className="space-y-2 text-sm text-foreground">
                  <p><strong>I have read and understood the above Memorandum of Understanding and consent to:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>ShikshAq displaying my educator profile as previously submitted;</li>
                    <li>The use of my Whatsapp link to let students land directly on my Whatsapp chat through ShikshAq for communication;</li>
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
                    <span className="font-medium">I consent.</span> I do not consent (in this case, we will not be able to legally display your profile on ShikshAq).
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
