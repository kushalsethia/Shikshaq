import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Loader2, Upload, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useAdminGuard, AdminGuardErrorState, adminToast } from '@/components/AdminConsole';
import { recordAdminAction } from '@/lib/audit';
import { toast as sonnerToast } from 'sonner';
import DOMPurify from 'dompurify';
import imageCompression from 'browser-image-compression';
import { validateImageSrc } from '@/utils/imageSanitizer';
import { invalidateTeacherCache, removeCache } from '@/utils/cache';
import { convertClassesToRoman } from '@/utils/romanNumerals';
import { AdminHeader, AdminAuditNote, buildAdminNav } from '@/pages/admin/shell';
import { AdminTable, AdminPanelHeader, AdminStatusPill, type AdminTableColumn, type AdminTableRow } from '@/pages/admin/AdminTable';
import { BentoPanel, BentoStack } from '@/components/layout/PageContainer';

/* Handoff 09i AD-005 "Teachers" — one of the 5 sections of the admin
   console redesign. Renders AdminHeader (pill tab row) directly, not the
   superseded AdminRail/AdminToolbar sidebar, plus its own BentoPanel body.
   Queries/mutations are ported from the legacy src/pages/AdminTeachers.tsx
   (Shikshaqmine table) rather than rewritten. */

// Constants matching FilterPanel / legacy AdminTeachers.tsx
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
  /** Self-service pause flag (see TeacherDashboard.tsx) — a real column, selected via
   *  `select('*')`, just not yet in the generated Database types. This is the field
   *  "Unlist" toggles: it is exactly what a teacher's own "Pause listing" control flips,
   *  and it's what Browse/search already filter on to hide a profile from public results. */
  is_paused?: boolean | null;
  /** Row creation timestamp — used for the "Joined" column. Real column on Shikshaqmine
   *  (Supabase auto-adds created_at), not yet in the generated Database types either. */
  created_at?: string | null;
}

export default function AdminTeachersPage() {
  const { user, profile } = useAuth();
  const actorName = profile?.full_name || user?.email || 'an admin';

  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<TeacherData[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherData | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'fees' | 'joined'>('name');
  const [pendingApplicationsCount, setPendingApplicationsCount] = useState<number | undefined>(undefined);
  const [rowBusyId, setRowBusyId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<TeacherData>>({});

  const { isAdmin, checkingAdmin, error: adminGuardError, retry: retryAdminGuard } = useAdminGuard(user, {
    onGranted: fetchTeachers,
    redirectOnDenied: true,
  });

  useEffect(() => {
    if (!checkingAdmin) setLoading(false);
  }, [checkingAdmin]);

  // Real pending count for the Approvals nav item — cheap head:true count query.
  useEffect(() => {
    let cancelled = false;
    async function loadPendingCount() {
      const { count, error } = await supabase
        .from('teacher_applications')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');
      if (!cancelled && !error && typeof count === 'number') {
        setPendingApplicationsCount(count);
      }
    }
    loadPendingCount();
    return () => {
      cancelled = true;
    };
  }, []);

  async function fetchTeachers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Shikshaqmine')
        .select('*')
        .order('Title', { ascending: true });

      if (error) {
        if (import.meta.env.DEV) console.error('Error fetching teachers:', error);
        sonnerToast.error('Failed to load teachers');
        return;
      }

      setTeachers(data || []);
      setFilteredTeachers(data || []);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error:', error);
      sonnerToast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  }

  // Filter, then sort — same logic as legacy AdminTeachers.tsx, plus a "joined" sort option.
  useEffect(() => {
    let filtered = teachers;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = teachers.filter(
        (teacher) =>
          teacher.Title?.toLowerCase().includes(query) ||
          teacher.Slug?.toLowerCase().includes(query) ||
          teacher["Email ID"]?.toLowerCase().includes(query) ||
          teacher["Phone Number"]?.includes(query)
      );
    }

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'fees') {
        const aFee = a['Min Fees'] ?? Number.POSITIVE_INFINITY;
        const bFee = b['Min Fees'] ?? Number.POSITIVE_INFINITY;
        return aFee - bFee;
      }
      if (sortBy === 'joined') {
        const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bTime - aTime;
      }
      return (a.Title || '').localeCompare(b.Title || '');
    });

    setFilteredTeachers(filtered);
  }, [searchQuery, teachers, sortBy]);

  const normalizeValue = (value: string): string => value.trim().toLowerCase();

  const valueExistsInString = (str: string | null | undefined, value: string): boolean => {
    if (!str) return false;
    const values = str.split(',').map((v) => normalizeValue(v));
    return values.includes(normalizeValue(value));
  };

  // Initialize form data when a teacher is opened in the editor
  useEffect(() => {
    if (selectedTeacher) {
      let schoolBoards = selectedTeacher["School Boards Catered"];
      if (schoolBoards) {
        schoolBoards = schoolBoards
          .split(',')
          .map((board) => {
            const trimmed = board.trim();
            if (trimmed.toLowerCase() === 'icse' && trimmed.toLowerCase() !== 'icse/isc') {
              return 'ICSE/ISC';
            }
            return trimmed;
          })
          .join(', ');
      }

      setFormData({ ...selectedTeacher, "School Boards Catered": schoolBoards });
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

  const sanitizeImageUrl = (url: string): string | null => {
    if (!url || typeof url !== 'string') return null;

    const sanitizedString = DOMPurify.sanitize(url.trim(), {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
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
        const dataUriMatch = sanitizedString.match(dataUriPattern);
        if (dataUriMatch) return sanitizedString;
      }
    }
    return null;
  };

  const handleImageUpload = async (file: File) => {
    if (!selectedTeacher) return;

    try {
      setUploadingImage(true);

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: file.type,
      };

      let compressedFile: File;
      try {
        compressedFile = await imageCompression(file, options);
      } catch (compressionError) {
        if (import.meta.env.DEV) console.warn('Image compression failed, using original file:', compressionError);
        compressedFile = file;
      }

      const fileExt = 'jpg';
      const fileName = `hero-images/${selectedTeacher.id}-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('hero-images')
        .upload(fileName, compressedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpeg',
        });

      if (error) {
        sonnerToast.error('Image upload failed. Please use a URL instead or set up the storage bucket.');
        if (import.meta.env.DEV) console.error('Upload error:', error);
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from('hero-images').getPublicUrl(data.path);

      const sanitizedUrl = sanitizeImageUrl(publicUrl);
      if (sanitizedUrl) {
        handleInputChange("Hero Image", sanitizedUrl);
        setImagePreview(sanitizedUrl);
      } else {
        sonnerToast.error('Failed to generate valid image URL');
      }
      sonnerToast.success('Image uploaded successfully');
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error uploading image:', error);
      sonnerToast.error('Failed to upload image. Please use a URL instead.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      sonnerToast.error('Please select an image file');
      return;
    }

    const lowerName = file.name.toLowerCase();
    const isHeicLike =
      lowerName.endsWith('.heic') ||
      lowerName.endsWith('.heif') ||
      file.type === 'image/heic' ||
      file.type === 'image/heif';
    if (isHeicLike) {
      sonnerToast.error('HEIC images are not supported. Please upload a JPG or PNG image instead.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      sonnerToast.error('Image size must be less than 5MB');
      return;
    }

    handleImageUpload(file);
  };

  // Clears the localStorage caches touched by any Shikshaqmine mutation (edit, unlist, feature).
  const invalidateCachesFor = (teacher: TeacherData) => {
    if (teacher.Slug) invalidateTeacherCache(teacher.Slug);
    removeCache('featured_teachers_browse');
    removeCache('featured_teachers_index');
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.includes('shikshaq_cache_') && key.includes('shikshaqmine')) {
        localStorage.removeItem(key);
      }
    });
  };

  const applyUpdatedTeacher = (updated: TeacherData) => {
    setTeachers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setFilteredTeachers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setSelectedTeacher((prev) => (prev && prev.id === updated.id ? updated : prev));
  };

  // Edit — full-form save, ported from legacy handleSave().
  const handleSave = async () => {
    if (!selectedTeacher) return;

    try {
      setSaving(true);

      const updateData: any = {};
      Object.keys(formData).forEach((key) => {
        if (key !== 'EXPANDED' && key !== 'Slug' && key !== 'id' && key !== 'Area') {
          updateData[key] = formData[key as keyof TeacherData] ?? null;
        }
      });
      updateData["Classes Taught"] = convertClassesToRoman(formData["Classes Taught for Backend"] ?? null);
      if (updateData["Email ID"] != null && typeof updateData["Email ID"] === 'string') {
        updateData["Email ID"] = updateData["Email ID"].trim().toLowerCase();
      }

      const { error } = await supabase
        .from('Shikshaqmine')
        .update(updateData)
        .eq('id', selectedTeacher.id);

      if (error) {
        if (import.meta.env.DEV) console.error('Error updating teacher:', error);
        sonnerToast.error('Failed to update teacher');
        return;
      }

      sonnerToast.success('Teacher updated successfully');

      if (user) {
        void recordAdminAction({
          actorId: user.id,
          actorName,
          action: 'edit',
          targetType: 'teacher',
          targetId: String(selectedTeacher.id),
          targetLabel: selectedTeacher.Title || 'teacher',
        });
      }

      invalidateCachesFor(selectedTeacher);

      const { data: updatedTeacher, error: fetchError } = await supabase
        .from('Shikshaqmine')
        .select('*')
        .eq('id', selectedTeacher.id)
        .single();

      if (!fetchError && updatedTeacher) {
        applyUpdatedTeacher(updatedTeacher);
        setEditorOpen(false);
      } else {
        await fetchTeachers();
        setEditorOpen(false);
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error:', error);
      sonnerToast.error('Failed to update teacher');
    } finally {
      setSaving(false);
    }
  };

  // Pause / Unpause — toggles the same self-service `is_paused` flag TeacherDashboard's own
  // "Pause listing" control flips. No reason is collected (spec: only Approvals-reject and
  // Papers-takedown require a reason).
  //
  // AD-005 ⚠: pause is reversible, so it gets no confirmation dialog — it applies immediately
  // and offers a toast with Undo instead. The Supabase mutation itself is unchanged from the
  // legacy confirm()-gated version; only how consent is gathered beforehand has changed.
  const commitPauseToggle = async (teacher: TeacherData, nextPaused: boolean) => {
    setRowBusyId(String(teacher.id));
    try {
      const { error } = await supabase
        .from('Shikshaqmine')
        .update({ is_paused: nextPaused } as any)
        .eq('id', teacher.id);

      if (error) {
        if (import.meta.env.DEV) console.error('Error toggling is_paused:', error);
        sonnerToast.error(nextPaused ? 'Failed to pause teacher' : 'Failed to unpause teacher');
        return;
      }

      if (user) {
        void recordAdminAction({
          actorId: user.id,
          actorName,
          action: nextPaused ? 'unlist' : 'relist',
          targetType: 'teacher',
          targetId: String(teacher.id),
          targetLabel: teacher.Title || 'teacher',
        });
      }

      invalidateCachesFor(teacher);
      applyUpdatedTeacher({ ...teacher, is_paused: nextPaused });

      adminToast(nextPaused ? `"${teacher.Title}" paused` : `"${teacher.Title}" unpaused`, {
        description: nextPaused ? 'Hidden from Browse and search results.' : 'Visible in Browse and search results again.',
        undo: () => commitPauseToggle(teacher, !nextPaused),
      });
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error:', error);
      sonnerToast.error('Failed to update listing status');
    } finally {
      setRowBusyId(null);
    }
  };

  const handleToggleUnlisted = (teacher: TeacherData) => commitPauseToggle(teacher, !teacher.is_paused);

  const openEditor = (teacher: TeacherData) => {
    setSelectedTeacher(teacher);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setSelectedTeacher(null);
  };

  const fieldClassName = 'h-auto border border-warm-hairline bg-card focus-visible:ring-1 focus-visible:ring-ring';
  const optionLabelStyle = 'text-[13px] text-warm-prose';

  const nav = buildAdminNav('teachers', { approvals: pendingApplicationsCount });

  // AD-005 columns: Name · Area · Subjects · Fee · Status · Updated. The real Shikshaqmine
  // schema has no `updated_at` (only the `created_at` join timestamp already used elsewhere
  // in this file) — labelled "Joined" here rather than the spec's "Updated" so the column
  // never implies data this table doesn't track.
  const teacherColumns: AdminTableColumn[] = [
    { key: 'name', label: 'Name', width: '1.8fr' },
    { key: 'area', label: 'Area', width: '1fr' },
    { key: 'subjects', label: 'Subjects', width: '1.6fr' },
    { key: 'fee', label: 'Fee', width: '1fr' },
    { key: 'status', label: 'Status', width: '0.9fr' },
    { key: 'joined', label: 'Joined', width: '1fr' },
  ];

  const teacherRows: AdminTableRow[] = filteredTeachers.map((teacher) => {
    const joined = teacher.created_at
      ? new Date(teacher.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      : '-';
    const fee = teacher['Min Fees'] || teacher['Max Fees']
      ? `₹${teacher['Min Fees'] ?? '-'}-${teacher['Max Fees'] ?? '-'}`
      : '-';
    const busy = rowBusyId === String(teacher.id);

    return {
      id: String(teacher.id),
      cells: [
        teacher.Title || 'Untitled',
        teacher.Area || '-',
        teacher.Subjects || '-',
        fee,
        <AdminStatusPill
          key="status"
          status={teacher.is_paused ? 'paused' : 'live'}
          label={teacher.is_paused ? 'Paused' : teacher.Featured ? 'Featured' : 'Live'}
        />,
        joined,
      ],
      actions: [
        { label: busy ? '…' : 'Edit', tone: 'primary', onClick: () => openEditor(teacher), disabled: busy },
        {
          label: busy ? '…' : teacher.is_paused ? 'Unpause' : 'Pause',
          tone: teacher.is_paused ? 'mint' : 'muted',
          onClick: () => commitPauseToggle(teacher, !teacher.is_paused),
          disabled: busy,
        },
      ],
    };
  });

  if (checkingAdmin || loading) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <AdminHeader nav={nav} signedInEmail={user?.email ?? actorName} />
        <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 rounded-2xl bg-muted" />
            ))}
          </div>
        </BentoPanel>
        <AdminAuditNote />
      </BentoStack>
    );
  }

  if (adminGuardError) return <AdminGuardErrorState onRetry={retryAdminGuard} />;

  if (!isAdmin) {
    return null;
  }

  const searchSlot = (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-label" aria-hidden />
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search teachers..."
        aria-label="Search teachers"
        className="h-11 w-[240px] rounded-full bg-muted pl-9 pr-4 text-sm text-foreground placeholder:text-warm-label outline-none transition-shadow duration-150 focus-visible:ring-2 focus-visible:ring-brand"
      />
    </div>
  );

  const sortSlot = (
    <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'name' | 'fees' | 'joined')}>
      <SelectTrigger className="h-11 w-[160px] rounded-full border-0 bg-muted text-sm font-semibold">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="name">Name (A-Z)</SelectItem>
        <SelectItem value="fees">Fees: low to high</SelectItem>
        <SelectItem value="joined">Joined: newest</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <BentoStack className="min-h-screen bg-muted">
      <AdminHeader nav={nav} signedInEmail={user?.email ?? actorName} />

      {/* AD-003 gives this panel literally: `px-1.5 py-[18px]`. It had been
          px-[18px], which pushed the table 18px off the panel edge and the
          header to 36px (6+18 inner). Measured against the mockup: table at
          6px, heading at 24px. The inner `px-[18px]` rows are unchanged. */}
      <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
        <AdminPanelHeader title="All teachers" meta={`${teachers.length} listed · ${teachers.filter((t) => t.is_paused).length} paused`} />

        <div className="mb-4 flex flex-wrap items-center gap-2 px-[18px]">
          {searchSlot}
          {sortSlot}
        </div>

        {filteredTeachers.length === 0 ? (
          <div className="rounded-2xl bg-muted py-8 text-center">
            <p className="text-sm text-warm-prose">
              {searchQuery.trim() ? `No teachers match "${searchQuery.trim()}".` : 'No teachers listed yet.'}
            </p>
            {searchQuery.trim() ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-3 text-sm font-semibold text-brand underline-offset-2 hover:underline"
              >
                Clear search
              </button>
            ) : null}
          </div>
        ) : (
          <AdminTable columns={teacherColumns} rows={teacherRows} />
        )}
      </BentoPanel>

      <AdminAuditNote />

      {/* Edit dialog — the full teacher profile form, ported from legacy AdminTeachers.tsx. */}
      <Dialog open={editorOpen} onOpenChange={(open) => (open ? setEditorOpen(true) : closeEditor())}>
        <DialogContent aria-describedby={undefined} className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTeacher?.Title || 'Edit teacher'}</DialogTitle>
          </DialogHeader>

          {selectedTeacher ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="title">Name (Title)</Label>
                  <Input
                    id="title"
                    value={formData.Title || ''}
                    onChange={(e) => handleInputChange('Title', e.target.value)}
                    className={fieldClassName}
                  />
                </div>

                <div>
                  <Label htmlFor="featuredSubject">Featured Subject</Label>
                  <Select
                    value={formData["Featured Subject"] ? formData["Featured Subject"] : "none"}
                    onValueChange={(value) => handleInputChange("Featured Subject", value === "none" ? null : value)}
                  >
                    <SelectTrigger id="featuredSubject" className={fieldClassName}>
                      <SelectValue placeholder="Select featured subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {SUBJECTS.map((subject) => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Classes Taught</Label>
                  <p className="mb-2 text-xs text-warm-label">Select the classes. Display format is auto-computed.</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {CLASSES.map((cls) => {
                      const selected = valueExistsInString(formData["Classes Taught for Backend"], cls);
                      return (
                        <div key={cls} className="flex items-center space-x-2">
                          <Checkbox
                            id={`class-${cls}`}
                            checked={selected}
                            onCheckedChange={(checked) => handleMultiSelectChange("Classes Taught for Backend", cls, checked as boolean)}
                          />
                          <Label htmlFor={`class-${cls}`} className={`cursor-pointer ${optionLabelStyle}`}>{cls}</Label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label>School Boards Catered</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {BOARDS.map((board) => {
                      const selected = valueExistsInString(formData["School Boards Catered"], board);
                      return (
                        <div key={board} className="flex items-center space-x-2">
                          <Checkbox
                            id={`board-${board}`}
                            checked={selected}
                            onCheckedChange={(checked) => handleMultiSelectChange("School Boards Catered", board, checked as boolean)}
                          />
                          <Label htmlFor={`board-${board}`} className={`cursor-pointer ${optionLabelStyle}`}>{board}</Label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label>Mode of Teaching</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {MODE_OF_TEACHING.map((mode) => {
                      const selected = valueExistsInString(formData["Mode of Teaching"], mode);
                      return (
                        <div key={mode} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mode-${mode}`}
                            checked={selected}
                            onCheckedChange={(checked) => handleMultiSelectChange("Mode of Teaching", mode, checked as boolean)}
                          />
                          <Label htmlFor={`mode-${mode}`} className={`cursor-pointer ${optionLabelStyle}`}>{mode}</Label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label>Subjects</Label>
                  <div className="mt-2 flex max-h-48 flex-wrap gap-2 overflow-y-auto">
                    {SUBJECTS.map((subject) => {
                      const selected = valueExistsInString(formData.Subjects, subject);
                      return (
                        <div key={subject} className="flex items-center space-x-2">
                          <Checkbox
                            id={`subject-${subject}`}
                            checked={selected}
                            onCheckedChange={(checked) => handleMultiSelectChange("Subjects", subject, checked as boolean)}
                          />
                          <Label htmlFor={`subject-${subject}`} className={`cursor-pointer ${optionLabelStyle}`}>{subject}</Label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData["Phone Number"] || ''}
                    onChange={(e) => handleInputChange("Phone Number", e.target.value)}
                    className={fieldClassName}
                  />
                </div>

                <div>
                  <Label htmlFor="emailId">Email ID</Label>
                  <Input
                    id="emailId"
                    type="email"
                    value={formData["Email ID"] || ''}
                    onChange={(e) => handleInputChange("Email ID", e.target.value)}
                    className={fieldClassName}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.Featured || false}
                    onCheckedChange={(checked) => handleInputChange("Featured", checked)}
                  />
                  <Label htmlFor="featured" className="cursor-pointer text-sm font-semibold">Featured</Label>
                </div>

                <div>
                  <Label htmlFor="sirMaam">Sir/Ma'am?</Label>
                  <Select
                    value={formData["Sir/Ma'am?"] || "none"}
                    onValueChange={(value) => handleInputChange("Sir/Ma'am?", value === "none" ? null : value)}
                  >
                    <SelectTrigger id="sirMaam" className={fieldClassName}>
                      <SelectValue placeholder="Select Sir or Ma'am" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {SIR_MAAM.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Structure of classes</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {CLASS_SIZE.map((size) => {
                      const selected = valueExistsInString(formData["Class Size (Group/ Solo)"], size);
                      return (
                        <div key={size} className="flex items-center space-x-2">
                          <Checkbox
                            id={`classSize-${size}`}
                            checked={selected}
                            onCheckedChange={(checked) => handleMultiSelectChange("Class Size (Group/ Solo)", size, checked as boolean)}
                          />
                          <Label htmlFor={`classSize-${size}`} className={`cursor-pointer ${optionLabelStyle}`}>
                            {size === 'Solo' ? 'One-on-one' : size}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="heroImage">Hero Image</Label>
                  <div className="space-y-3">
                    {imagePreview && (() => {
                      const safeUrl = sanitizeImageUrl(imagePreview);
                      if (!safeUrl) {
                        setImagePreview(null);
                        return null;
                      }
                      const purifiedSrc = DOMPurify.sanitize(
                        validateImageSrc(safeUrl),
                        { ALLOWED_TAGS: [], ALLOWED_ATTR: [], KEEP_CONTENT: true }
                      );
                      if (!purifiedSrc) return null;
                      return (
                        <div className="relative w-full max-w-md">
                          <img
                            src={purifiedSrc}
                            alt="Hero preview"
                            className="h-48 w-full rounded-[14px] object-cover shadow-border"
                            onError={() => setImagePreview(null)}
                            crossOrigin="anonymous"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="before:absolute before:-inset-[4px] before:content-[''] absolute right-2 top-2 border-0 bg-white/90"
                            onClick={() => {
                              handleInputChange("Hero Image", null);
                              setImagePreview(null);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })()}

                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="heroImageUpload"
                        className="flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-foreground shadow-border transition-colors hover:bg-black/[.04]"
                      >
                        <Upload className="h-4 w-4" />
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
                      <span className="text-xs text-warm-label">or</span>
                    </div>

                    <Input
                      id="heroImage"
                      placeholder="Or enter image URL"
                      value={formData["Hero Image"] || ''}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const sanitizedUrl = inputValue ? sanitizeImageUrl(inputValue) : null;
                        if (sanitizedUrl !== null || !inputValue) {
                          handleInputChange("Hero Image", sanitizedUrl || '');
                          setImagePreview(sanitizedUrl);
                        } else {
                          sonnerToast.error('Please enter a valid image URL (http:// or https://)');
                        }
                      }}
                      className={fieldClassName}
                    />
                    <p className="text-xs text-warm-label">Upload an image file or paste an image URL. Max file size: 5MB</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="video">Video URL</Label>
                  <Input
                    id="video"
                    value={formData.Video || ''}
                    onChange={(e) => handleInputChange("Video", e.target.value)}
                    className={fieldClassName}
                  />
                </div>

                <div>
                  <Label htmlFor="videoLink">Video Link</Label>
                  <Input
                    id="videoLink"
                    value={formData["Video Link"] || ''}
                    onChange={(e) => handleInputChange("Video Link", e.target.value)}
                    className={fieldClassName}
                  />
                </div>

                <div>
                  <Label htmlFor="link">WhatsApp Link</Label>
                  <Input
                    id="link"
                    value={formData.Link || ''}
                    onChange={(e) => handleInputChange("Link", e.target.value)}
                    className={fieldClassName}
                  />
                </div>

                <div>
                  <Label htmlFor="locationV2">Location V2</Label>
                  <Select
                    value={formData["LOCATION V2"] || "none"}
                    onValueChange={(value) => handleInputChange("LOCATION V2", value === "none" ? null : value)}
                  >
                    <SelectTrigger id="locationV2" className={fieldClassName}>
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

                <div>
                  <Label>Student's Home in These Areas</Label>
                  <div className="mt-2 flex max-h-48 flex-wrap gap-2 overflow-y-auto">
                    {AREAS.map((area) => {
                      const selected = valueExistsInString(formData["STUDENT'S HOME IN THESE AREAS"], area);
                      return (
                        <div key={area} className="flex items-center space-x-2">
                          <Checkbox
                            id={`student-area-${area}`}
                            checked={selected}
                            onCheckedChange={(checked) => handleMultiSelectChange("STUDENT'S HOME IN THESE AREAS", area, checked as boolean)}
                          />
                          <Label htmlFor={`student-area-${area}`} className={`cursor-pointer ${optionLabelStyle}`}>{area}</Label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label>Tutor's Home in These Areas</Label>
                  <div className="mt-2 flex max-h-48 flex-wrap gap-2 overflow-y-auto">
                    {AREAS.map((area) => {
                      const selected = valueExistsInString(formData["TUTOR'S HOME IN THESE AREAS"], area);
                      return (
                        <div key={area} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tutor-area-${area}`}
                            checked={selected}
                            onCheckedChange={(checked) => handleMultiSelectChange("TUTOR'S HOME IN THESE AREAS", area, checked as boolean)}
                          />
                          <Label htmlFor={`tutor-area-${area}`} className={`cursor-pointer ${optionLabelStyle}`}>{area}</Label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.Description || ''}
                    onChange={(e) => handleInputChange("Description", e.target.value)}
                    rows={5}
                    className={fieldClassName}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="qualifications">Qualifications etc</Label>
                  <Textarea
                    id="qualifications"
                    value={formData["Qualifications etc"] || ''}
                    onChange={(e) => handleInputChange("Qualifications etc", e.target.value)}
                    rows={3}
                    className={fieldClassName}
                  />
                </div>

                <div>
                  <Label htmlFor="yearsStarted">Year they started teaching</Label>
                  <Input
                    id="yearsStarted"
                    value={formData["Years they started teaching"] || ''}
                    onChange={(e) => handleInputChange("Years they started teaching", e.target.value)}
                    className={fieldClassName}
                  />
                </div>

                <div>
                  <Label htmlFor="minFees">Minimum Fees per Month (₹)</Label>
                  <Input
                    id="minFees"
                    type="tel"
                    value={formData["Min Fees"]?.toString() || ''}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                      handleInputChange("Min Fees", digits ? parseInt(digits) : null);
                    }}
                    placeholder="e.g., 2000"
                    maxLength={6}
                    inputMode="numeric"
                    className={fieldClassName}
                  />
                </div>

                <div>
                  <Label htmlFor="maxFees">Maximum Fees per Month (₹)</Label>
                  <Input
                    id="maxFees"
                    type="tel"
                    value={formData["Max Fees"]?.toString() || ''}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                      handleInputChange("Max Fees", digits ? parseInt(digits) : null);
                    }}
                    placeholder="e.g., 5000"
                    maxLength={6}
                    inputMode="numeric"
                    className={fieldClassName}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="review1">Review 1</Label>
                  <Textarea
                    id="review1"
                    value={formData["Review 1"] || ''}
                    onChange={(e) => handleInputChange("Review 1", e.target.value)}
                    rows={3}
                    className={fieldClassName}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="review2">Review 2</Label>
                  <Textarea
                    id="review2"
                    value={formData["Review 2"] || ''}
                    onChange={(e) => handleInputChange("Review 2", e.target.value)}
                    rows={3}
                    className={fieldClassName}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="review3">Review 3</Label>
                  <Textarea
                    id="review3"
                    value={formData["Review 3"] || ''}
                    onChange={(e) => handleInputChange("Review 3", e.target.value)}
                    rows={3}
                    className={fieldClassName}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-warm-hairline pt-4">
                <Button variant="ghost" onClick={closeEditor} disabled={saving}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save changes'
                  )}
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </BentoStack>
  );
}
