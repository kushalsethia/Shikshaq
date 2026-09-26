import { useEffect, useMemo, useState, type DragEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { recordAdminAction } from '@/lib/audit';
import { useAdminGuard, AdminGuardErrorState } from '@/components/AdminConsole';
import {
  adminToast,
  adminFieldStyle,
  adminPanelStyle,
  adminPrimaryBtnStyle,
  adminSecondaryBtnStyle,
  adminDestructiveBtnStyle,
  AdminStatTiles,
} from '@/components/AdminConsole';
import { AdminHeader, AdminAuditNote, buildAdminNav } from '@/pages/admin/shell';
import { AdminTable, AdminPanelHeader, AdminStatusPill, type AdminTableColumn, type AdminTableRow, type AdminStatus } from '@/pages/admin/AdminTable';
import { BentoPanel, BentoStack } from '@/components/layout/PageContainer';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, Save, Search, Upload, X, CheckCircle2, XCircle, FileText } from 'lucide-react';
import { SUBJECTS, CLASSES, BOARDS, EXAM_TYPES } from '@/utils/searchFacets';
import { cn } from '@/lib/utils';

/* A3 "Papers & takedowns" — one of five sections in the redesigned admin
   console (S7). Renders AdminRail + AdminToolbar directly (no AdminConsole
   wrapper, which would duplicate the shell) alongside its own body.

   Ported wholesale from the legacy src/pages/AdminPapers.tsx (795 lines):
   fetchPapers, the publish/draft form (handleSave, handleFileUpload), and
   the publish-toggle mutation (handleUnpublish) all keep their original
   Supabase calls. The one legacy affordance NOT ported is silent unpublish
   via the table's overflow disc — this spec requires "Take down" to always
   collect a reason, so takedown is a dedicated dialog-driven action instead
   of the old one-click overflow toggle. Restore (publishing again) stays a
   single click, matching the legacy "republish" half of handleUnpublish. */

const PAPER_CLASSES = CLASSES.filter((c) => c !== 'UG');

interface PaperRow {
  id: string;
  title: string;
  school: string;
  subject: string;
  class: string;
  board: string;
  exam_type: string;
  year: number;
  file_url: string | null;
  is_published: boolean;
  created_at: string;
}

type FormState = Partial<PaperRow>;

/* Not the same table as PaperRow above -- paper_submissions is the inbox a
   real student's /submit-a-paper upload lands in (migration
   20260829072445_paper_submissions.sql). "Review promotes it into `papers`;
   this row stays as the audit trail" per that migration's own comment, but
   nothing on the frontend ever did the promoting: no admin page read this
   table at all until now, so a real submission had nowhere to be seen. */
interface SubmissionRow {
  id: string;
  created_at: string;
  school: string;
  board: string | null;
  class: string | null;
  subject: string;
  year: string | null;
  exam_type: string | null;
  submitter_name: string | null;
  submitter_contact: string | null;
  file_paths: string[];
  status: 'pending' | 'approved' | 'rejected';
  review_note: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

/* SubmitPaper.tsx's own EXAM_TYPES ('Prelim / Pre-board', 'Half-yearly',
   'Annual / Final', 'Unit test', 'Other') is a different, hand-written list
   from this one (EXAM_TYPES below, from searchFacets.ts) -- and `papers`
   has a CHECK constraint restricted to exactly this file's five values.
   Caught by inserting a real test row before wiring this up: an unmapped
   exam_type 23514-violated the constraint and would have failed to approve
   every real submission, since the public form only ever offers its own
   spelling. Approximate on open; the admin can still correct it via the
   Select in the approve dialog before publishing. */
function mapSubmittedExamType(raw: string | null): string {
  const key = (raw ?? '').trim().toLowerCase();
  if (key.startsWith('prelim')) return 'Prelims';
  if (key.startsWith('half')) return 'Half-Yearly';
  if (key.startsWith('annual') || key.startsWith('final')) return 'Final';
  if (key.startsWith('unit')) return 'Unit Test';
  return EXAM_TYPES[0];
}

function submissionStatusTone(status: SubmissionRow['status']): AdminStatus {
  if (status === 'approved') return 'live';
  if (status === 'rejected') return 'hidden';
  return 'pending';
}

const BLANK_FORM: FormState = {
  title: '',
  school: '',
  subject: SUBJECTS[0],
  class: PAPER_CLASSES[0],
  board: BOARDS[0],
  exam_type: EXAM_TYPES[0],
  year: new Date().getFullYear(),
  is_published: true,
};

export default function AdminPapersPage() {
  const { user, profile } = useAuth();
  const actorName = profile?.full_name || user?.email || 'an admin';
  const { isAdmin, checkingAdmin, error: adminGuardError, retry: retryAdminGuard } = useAdminGuard(user, { redirectOnDenied: true });

  const [papers, setPapers] = useState<PaperRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [pendingCount, setPendingCount] = useState<number | undefined>(undefined);

  // Upload flow (ported from the legacy Upload sub-tab; lives in a modal here).
  const [uploadOpen, setUploadOpen] = useState(false);
  const [formData, setFormData] = useState<FormState>(BLANK_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Take-down flow — reason is required, unlike the legacy silent overflow toggle.
  const [takedownTarget, setTakedownTarget] = useState<PaperRow | null>(null);
  const [takedownReason, setTakedownReason] = useState('');
  const [takedownBusy, setTakedownBusy] = useState(false);
  const [restoreBusyId, setRestoreBusyId] = useState<string | null>(null);

  // Same page, second view: "Published" (the table above) and "Submissions"
  // (paper_submissions -- real uploads from /submit-a-paper, previously
  // invisible to every admin).
  const [view, setView] = useState<'published' | 'submissions'>('published');
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);
  const [reviewTarget, setReviewTarget] = useState<SubmissionRow | null>(null);
  const [reviewFileUrls, setReviewFileUrls] = useState<{ path: string; url: string | null }[]>([]);
  const [reviewFilesLoading, setReviewFilesLoading] = useState(false);
  const [approveTitle, setApproveTitle] = useState('');
  // Editable, pre-filled from the submission -- exam_type in particular is
  // never trusted as-is (see mapSubmittedExamType's comment: the submitted
  // spelling fails papers' own CHECK constraint outright).
  const [approveBoard, setApproveBoard] = useState('');
  const [approveClass, setApproveClass] = useState('');
  const [approveExamType, setApproveExamType] = useState('');
  const [approveYear, setApproveYear] = useState('');
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [reviewBusy, setReviewBusy] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchPapers();
      fetchSubmissions();
    }
  }, [isAdmin]);

  useEffect(() => {
    async function fetchNavCount() {
      const { count } = await supabase
        .from('teacher_applications')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');
      if (typeof count === 'number') setPendingCount(count);
    }
    if (isAdmin) fetchNavCount();
  }, [isAdmin]);

  async function fetchPapers() {
    try {
      setLoading(true);
      /* An explicit column list, not select('*').
         PostgREST expands `*` to the columns the current role MAY read and
         does NOT error on the ones it may not. So a column revoke turns this
         query into a silently smaller row: no failure, no warning, just fields
         that are suddenly undefined. That exact pattern was found in seven
         queries earlier in this migration series, one of which blanked every
         teacher card for every signed-out visitor for weeks.
         papers.file_url is the live candidate here -- it is already revoked
         from anon, and the case for revoking it from authenticated keeps
         coming up. Naming the columns means that decision would fail loudly
         here instead of quietly emptying the admin review screen. */
      const { data, error } = await supabase
        .from('papers')
        .select(
          'id,title,school,subject,class,board,exam_type,year,file_url,is_published,created_at',
        )
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPapers((data as PaperRow[]) || []);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error fetching papers:', error);
      adminToast('Failed to load papers');
    } finally {
      setLoading(false);
    }
  }

  async function fetchSubmissions() {
    try {
      setSubmissionsLoading(true);
      const { data, error } = await supabase
        .from('paper_submissions')
        .select(
          'id,created_at,school,board,class,subject,year,exam_type,submitter_name,submitter_contact,file_paths,status,review_note,reviewed_at,reviewed_by',
        )
        .order('created_at', { ascending: false });
      if (error) throw error;
      setSubmissions((data as SubmissionRow[]) || []);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error fetching submissions:', error);
      adminToast('Failed to load submissions');
    } finally {
      setSubmissionsLoading(false);
    }
  }

  const filteredPapers = useMemo(() => {
    return papers
      .filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.school.toLowerCase().includes(q) ||
          p.subject.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        return sortOrder === 'newest' ? -diff : diff;
      });
  }, [papers, searchQuery, sortOrder]);

  const filteredSubmissions = useMemo(() => {
    return submissions
      .filter((s) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          s.school.toLowerCase().includes(q) ||
          s.subject.toLowerCase().includes(q) ||
          (s.submitter_name ?? '').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        return sortOrder === 'newest' ? -diff : diff;
      });
  }, [submissions, searchQuery, sortOrder]);

  function handleChange<K extends keyof FormState>(field: K, value: FormState[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function openUpload() {
    setFormData(BLANK_FORM);
    setUploadOpen(true);
  }

  function closeUpload() {
    setUploadOpen(false);
    setFormData(BLANK_FORM);
  }

  async function handleFileUpload(file: File) {
    if (file.type !== 'application/pdf') {
      adminToast('Only PDF files are supported');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      adminToast('File must be under 20MB');
      return;
    }
    try {
      setUploadingFile(true);
      const fileName = `papers/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { error } = await supabase.storage.from('paper-files').upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'application/pdf',
      });
      if (error) throw error;
      const {
        data: { publicUrl },
      } = supabase.storage.from('paper-files').getPublicUrl(fileName);
      handleChange('file_url', publicUrl);
      adminToast('File uploaded');
    } catch (error) {
      if (import.meta.env.DEV) console.error('Upload error:', error);
      adminToast('File upload failed');
    } finally {
      setUploadingFile(false);
    }
  }

  function handleDropZoneDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  }

  /* publishedOverride exists because "Save as draft" used to call
     handleChange('is_published', false) and handleSave() in the same tick.
     handleChange is a setState, so handleSave still read the PRE-update
     formData from its render closure and wrote is_published: true (the
     BLANK_FORM default) — every paper "saved as a draft" went live
     immediately. Passing the value in sidesteps the stale closure entirely.
     Ported verbatim from the legacy file. */
  async function handleSave(publishedOverride?: boolean) {
    if (
      !formData.title?.trim() ||
      !formData.school?.trim() ||
      !formData.subject ||
      !formData.class ||
      !formData.board ||
      !formData.year
    ) {
      adminToast('Title, school, subject, class, board and year are required');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        title: formData.title.trim(),
        school: formData.school.trim(),
        subject: formData.subject,
        class: formData.class,
        board: formData.board,
        exam_type: formData.exam_type || EXAM_TYPES[0],
        year: Number(formData.year),
        file_url: formData.file_url || null,
        is_published: publishedOverride ?? formData.is_published ?? true,
      };

      const { data, error } = await supabase.from('papers').insert(payload).select('id').single();
      if (error) throw error;
      adminToast('Paper published');
      if (user) {
        void recordAdminAction({
          actorId: user.id,
          actorName,
          action: 'publish',
          targetType: 'paper',
          targetId: data?.id || payload.title,
          targetLabel: payload.title,
        });
      }

      await fetchPapers();
      closeUpload();
    } catch (error) {
      if (import.meta.env.DEV) console.error('Save error:', error);
      /* The PDF, if any, already made it to storage in handleFileUpload
         before this insert ran -- clean it up so a failed publish doesn't
         leave an orphaned file nothing in `papers` will ever reference
         (the same class of bug already fixed in SubmitPaper.tsx). */
      if (formData.file_url) {
        const marker = '/paper-files/';
        const idx = formData.file_url.indexOf(marker);
        if (idx !== -1) {
          const path = formData.file_url.slice(idx + marker.length);
          void supabase.storage.from('paper-files').remove([path]).catch(() => {});
        }
      }
      adminToast('Failed to save paper');
    } finally {
      setSaving(false);
    }
  }

  function openTakedown(paper: PaperRow) {
    setTakedownTarget(paper);
    setTakedownReason('');
  }

  function closeTakedown() {
    setTakedownTarget(null);
    setTakedownReason('');
  }

  async function confirmTakedown() {
    if (!takedownTarget) return;
    const reason = takedownReason.trim();
    if (!reason) {
      adminToast('A reason is required to take a paper down');
      return;
    }
    const target = takedownTarget;
    try {
      setTakedownBusy(true);
      const { error } = await supabase.from('papers').update({ is_published: false }).eq('id', target.id);
      if (error) throw error;
      setPapers((prev) => prev.map((p) => (p.id === target.id ? { ...p, is_published: false } : p)));
      adminToast('Paper taken down');
      if (user) {
        void recordAdminAction({
          actorId: user.id,
          actorName,
          action: 'takedown',
          targetType: 'paper',
          targetId: target.id,
          targetLabel: target.title,
          reason,
        });
      }
      closeTakedown();
    } catch (error) {
      if (import.meta.env.DEV) console.error('Takedown error:', error);
      adminToast('Failed to take the paper down');
    } finally {
      setTakedownBusy(false);
    }
  }

  async function handleRestore(paper: PaperRow) {
    try {
      setRestoreBusyId(paper.id);
      const { error } = await supabase.from('papers').update({ is_published: true }).eq('id', paper.id);
      if (error) throw error;
      setPapers((prev) => prev.map((p) => (p.id === paper.id ? { ...p, is_published: true } : p)));
      adminToast('Paper restored');
      if (user) {
        void recordAdminAction({
          actorId: user.id,
          actorName,
          action: 'publish',
          targetType: 'paper',
          targetId: paper.id,
          targetLabel: paper.title,
        });
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Restore error:', error);
      adminToast('Failed to restore the paper');
    } finally {
      setRestoreBusyId(null);
    }
  }

  /* Opens the review dialog and, for a pending submission, resolves signed
     URLs for its files -- the `paper-submissions` bucket is private (an
     unreviewed upload from a stranger, per that migration's own comment), so
     a plain public URL would 404. Regenerated every open rather than cached:
     signed URLs expire, and this dialog is not opened often enough for that
     to matter. */
  async function openReview(submission: SubmissionRow) {
    setReviewTarget(submission);
    setApproveTitle(`${submission.subject}${submission.exam_type ? ` ${submission.exam_type}` : ''}`.trim());
    setApproveBoard(submission.board && BOARDS.includes(submission.board) ? submission.board : BOARDS[0]);
    setApproveClass(submission.class && PAPER_CLASSES.includes(submission.class) ? submission.class : PAPER_CLASSES[0]);
    setApproveExamType(mapSubmittedExamType(submission.exam_type));
    const yearNum = Number(submission.year);
    setApproveYear(String(Number.isFinite(yearNum) && yearNum >= 2000 && yearNum <= 2100 ? yearNum : new Date().getFullYear()));
    setShowReject(false);
    setRejectReason('');
    setReviewFileUrls(submission.file_paths.map((path) => ({ path, url: null })));
    if (submission.file_paths.length === 0) return;
    setReviewFilesLoading(true);
    try {
      const results = await Promise.all(
        submission.file_paths.map(async (path) => {
          const { data, error } = await supabase.storage
            .from('paper-submissions')
            .createSignedUrl(path, 60 * 10);
          return { path, url: error ? null : data?.signedUrl ?? null };
        }),
      );
      setReviewFileUrls(results);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error signing submission files:', error);
    } finally {
      setReviewFilesLoading(false);
    }
  }

  function closeReview() {
    setReviewTarget(null);
    setReviewFileUrls([]);
    setApproveTitle('');
    setApproveBoard('');
    setApproveClass('');
    setApproveExamType('');
    setApproveYear('');
    setShowReject(false);
    setRejectReason('');
  }

  /* Approve: promotes the submission into the real `papers` table (the
     table admin/papers.tsx's own upload form writes to) and marks the
     submission reviewed. `papers.file_url` is a single column -- a
     submission can carry several photographed pages, but there is nowhere
     to put more than one, so only the first file is copied across; this is
     an existing schema limitation, not something introduced here. The copy
     goes through the client (download then re-upload) because the
     `paper-submissions` bucket is private and `paper-files` is the bucket
     admin/papers.tsx's own handleFileUpload already writes to -- same
     bucket, same path convention, so an approved submission's paper opens
     exactly like one uploaded directly through this page. */
  async function handleApprove() {
    if (!reviewTarget || !user) return;
    if (!approveTitle.trim()) {
      adminToast('A title is required to publish this paper');
      return;
    }
    const target = reviewTarget;
    try {
      setReviewBusy(true);

      let file_url: string | null = null;
      const firstPath = target.file_paths[0];
      if (firstPath) {
        const { data: fileBlob, error: downloadError } = await supabase.storage
          .from('paper-submissions')
          .download(firstPath);
        if (downloadError) throw downloadError;
        const baseName = firstPath.split('/').pop() || 'submission';
        const destPath = `papers/${Date.now()}-${baseName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const { error: uploadError } = await supabase.storage
          .from('paper-files')
          .upload(destPath, fileBlob, { cacheControl: '3600', upsert: false });
        if (uploadError) throw uploadError;
        file_url = supabase.storage.from('paper-files').getPublicUrl(destPath).data.publicUrl;
      }

      const yearNum = Number(approveYear);
      const { data: inserted, error: insertError } = await supabase
        .from('papers')
        .insert({
          title: approveTitle.trim(),
          school: target.school,
          subject: target.subject,
          class: approveClass || PAPER_CLASSES[0],
          board: approveBoard || BOARDS[0],
          /* Must be one of EXAM_TYPES' exact spellings -- papers has a CHECK
             constraint on this column and the submission's own exam_type
             (a different vocabulary written by SubmitPaper.tsx) violates it
             outright. approveExamType is seeded by mapSubmittedExamType()
             and editable in the dialog, never the raw submission value. */
          exam_type: EXAM_TYPES.includes(approveExamType) ? approveExamType : EXAM_TYPES[0],
          year: Number.isFinite(yearNum) && yearNum >= 2000 && yearNum <= 2100 ? yearNum : new Date().getFullYear(),
          file_url,
          is_published: true,
        })
        .select('id')
        .single();
      if (insertError) throw insertError;

      const { error: reviewError } = await supabase
        .from('paper_submissions')
        .update({ status: 'approved', reviewed_at: new Date().toISOString(), reviewed_by: user.id })
        .eq('id', target.id);
      if (reviewError) throw reviewError;

      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === target.id
            ? { ...s, status: 'approved', reviewed_at: new Date().toISOString(), reviewed_by: user.id }
            : s,
        ),
      );
      adminToast('Submission approved and published');
      void recordAdminAction({
        actorId: user.id,
        actorName,
        action: 'approve',
        targetType: 'paper_submission',
        targetId: target.id,
        targetLabel: `${target.school} - ${target.subject}`,
      });
      if (inserted?.id) {
        void recordAdminAction({
          actorId: user.id,
          actorName,
          action: 'publish',
          targetType: 'paper',
          targetId: inserted.id,
          targetLabel: approveTitle.trim(),
        });
      }
      await fetchPapers();
      closeReview();
    } catch (error) {
      if (import.meta.env.DEV) console.error('Approve submission error:', error);
      adminToast('Failed to approve this submission');
    } finally {
      setReviewBusy(false);
    }
  }

  async function handleRejectSubmission() {
    if (!reviewTarget || !user) return;
    const reason = rejectReason.trim();
    if (!reason) {
      adminToast('A reason is required to reject a submission');
      return;
    }
    const target = reviewTarget;
    try {
      setReviewBusy(true);
      const { error } = await supabase
        .from('paper_submissions')
        .update({
          status: 'rejected',
          review_note: reason,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq('id', target.id);
      if (error) throw error;
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === target.id
            ? { ...s, status: 'rejected', review_note: reason, reviewed_at: new Date().toISOString(), reviewed_by: user.id }
            : s,
        ),
      );
      adminToast('Submission rejected');
      void recordAdminAction({
        actorId: user.id,
        actorName,
        action: 'reject',
        targetType: 'paper_submission',
        targetId: target.id,
        targetLabel: `${target.school} - ${target.subject}`,
        reason,
      });
      closeReview();
    } catch (error) {
      if (import.meta.env.DEV) console.error('Reject submission error:', error);
      adminToast('Failed to reject this submission');
    } finally {
      setReviewBusy(false);
    }
  }

  const nav = buildAdminNav('papers', { approvals: pendingCount });

  // AD-006 columns: Title · School · Board · Class · Year · Status. The real `papers` schema
  // has only an `is_published` boolean — no separate "pending upload review" queue distinct
  // from published/unpublished, so AD-006's Pending→Review/Reject half of the action spec has
  // no backing state to render; Live rows get the spec's Open + Unpublish (destructive, tinted,
  // last), and taken-down rows get the one real action the schema supports: Restore (mint).
  const columns: AdminTableColumn[] = [
    { key: 'title', label: 'Title', width: '2fr' },
    { key: 'school', label: 'School', width: '1.4fr' },
    { key: 'board', label: 'Board', width: '0.8fr' },
    { key: 'class', label: 'Class', width: '0.6fr' },
    { key: 'year', label: 'Year', width: '0.6fr' },
    { key: 'status', label: 'Status', width: '0.9fr' },
  ];

  const rows: AdminTableRow[] = filteredPapers.map((p) => ({
    id: p.id,
    cells: [
      p.title,
      p.school,
      p.board,
      p.class,
      String(p.year),
      <AdminStatusPill key="status" status={p.is_published ? 'live' : 'hidden'} label={p.is_published ? 'Live' : 'Taken down'} />,
    ],
    actions: p.is_published
      ? [
          { label: 'Open', tone: 'primary', onClick: () => window.open(`/past-papers/${p.id}`, '_blank', 'noopener') },
          { label: 'Unpublish', tone: 'destructive', onClick: () => openTakedown(p) },
        ]
      : [
          { label: restoreBusyId === p.id ? '…' : 'Restore', tone: 'mint', onClick: () => handleRestore(p), disabled: restoreBusyId === p.id },
        ],
  }));

  const submissionColumns: AdminTableColumn[] = [
    { key: 'school', label: 'School', width: '1.6fr' },
    { key: 'subject', label: 'Subject', width: '1fr' },
    { key: 'board', label: 'Board', width: '0.8fr' },
    { key: 'class', label: 'Class', width: '0.6fr' },
    { key: 'submitter', label: 'Submitted by', width: '1.4fr' },
    { key: 'status', label: 'Status', width: '0.9fr' },
  ];

  const submissionRows: AdminTableRow[] = filteredSubmissions.map((s) => ({
    id: s.id,
    cells: [
      s.school,
      s.subject,
      s.board || '—',
      s.class || '—',
      s.submitter_name || 'Not given',
      <AdminStatusPill
        key="status"
        status={submissionStatusTone(s.status)}
        label={s.status.charAt(0).toUpperCase() + s.status.slice(1)}
      />,
    ],
    actions: [
      { label: s.status === 'pending' ? 'Review' : 'View', tone: 'primary', onClick: () => openReview(s) },
    ],
  }));

  const searchSlot = (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-meta"
        aria-hidden
      />
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search papers..."
        aria-label="Search papers"
        className="h-11 w-[240px] rounded-full bg-muted pl-9 pr-4 text-sm text-foreground placeholder:text-warm-label outline-none transition-shadow duration-150 focus-visible:ring-2 focus-visible:ring-brand"
      />
    </div>
  );

  const sortSlot = (
    <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as 'newest' | 'oldest')}>
      <SelectTrigger className="h-11 w-[160px] rounded-full border-0 bg-muted text-sm font-semibold">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest upload</SelectItem>
        <SelectItem value="oldest">Oldest upload</SelectItem>
      </SelectContent>
    </Select>
  );

  if (checkingAdmin || (loading && !adminGuardError)) {
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
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted px-4">
        <div className={cn(adminPanelStyle, 'max-w-[380px] p-8 text-center')}>
          <h1 className="mb-2 text-xl font-bold text-foreground">Access denied</h1>
          <p className="text-sm text-warm-secondary">You need to be an admin to access this page.</p>
        </div>
      </div>
    );
  }

  const pendingSubmissionCount = submissions.filter((s) => s.status === 'pending').length;

  const viewToggle = (
    <div role="tablist" aria-label="Papers view" className="inline-flex h-11 shrink-0 items-center rounded-full bg-muted p-1">
      {(['published', 'submissions'] as const).map((v) => (
        <button
          key={v}
          role="tab"
          aria-selected={view === v}
          onClick={() => setView(v)}
          className={cn(
            'flex h-9 items-center gap-1.5 rounded-full px-[14px] text-[13px] font-bold capitalize transition-colors duration-150',
            view === v ? 'bg-card text-foreground' : 'text-warm-secondary hover:text-foreground',
          )}
        >
          {v === 'published' ? 'Published papers' : 'Submissions'}
          {v === 'submissions' && pendingSubmissionCount > 0 ? (
            <span className="inline-flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-brand px-[5px] text-[11px] font-bold tabular-nums text-foreground">
              {pendingSubmissionCount}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );

  return (
    <BentoStack className="min-h-screen bg-muted">
      <AdminHeader nav={nav} signedInEmail={user?.email ?? actorName} />

      <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-[18px]">
          <AdminPanelHeader
            title={view === 'published' ? 'Uploaded papers' : 'Submissions from students'}
            meta={
              view === 'published'
                ? `${papers.filter((p) => p.is_published).length} published · ${papers.filter((p) => !p.is_published).length} taken down`
                : `${submissions.length} total`
            }
          />
          <div className="flex flex-wrap items-center gap-2">
            {viewToggle}
            {view === 'published' ? (
              <button onClick={openUpload} className={adminPrimaryBtnStyle}>
                <Plus className="w-4 h-4" />
                Upload paper
              </button>
            ) : null}
          </div>
        </div>

        {view === 'published' ? (
          <div className="mb-4 px-[18px]">
            <AdminStatTiles
              stats={[
                { label: 'In the library', value: papers.length },
                { label: 'Live', value: papers.filter((p) => p.is_published).length },
                { label: 'Taken down', value: papers.filter((p) => !p.is_published).length },
              ]}
            />
          </div>
        ) : (
          <div className="mb-4 px-[18px]">
            <AdminStatTiles
              stats={[
                { label: 'Pending review', value: submissions.filter((s) => s.status === 'pending').length },
                { label: 'Approved', value: submissions.filter((s) => s.status === 'approved').length },
                { label: 'Rejected', value: submissions.filter((s) => s.status === 'rejected').length },
              ]}
            />
          </div>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-2 px-[18px]">{searchSlot}{sortSlot}</div>

        {view === 'published' ? (
        filteredPapers.length === 0 ? (
          <div className="rounded-2xl bg-muted p-12 text-center">
            <p className="text-[15px] text-warm-meta">
              {searchQuery.trim() ? `No papers match "${searchQuery.trim()}".` : 'No papers yet.'}
            </p>
            {searchQuery.trim() ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-3 text-[15px] font-semibold text-brand underline-offset-2 hover:underline"
              >
                Clear search
              </button>
            ) : null}
          </div>
        ) : (
          <AdminTable columns={columns} rows={rows} />
        )
        ) : submissionsLoading ? (
          <div className="animate-pulse space-y-3 px-[18px]">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 rounded-2xl bg-muted" />
            ))}
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="rounded-2xl bg-muted p-12 text-center">
            <p className="text-[15px] text-warm-meta">
              {searchQuery.trim() ? `No submissions match "${searchQuery.trim()}".` : 'No papers submitted yet.'}
            </p>
            {searchQuery.trim() ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-3 text-[15px] font-semibold text-brand underline-offset-2 hover:underline"
              >
                Clear search
              </button>
            ) : null}
          </div>
        ) : (
          <AdminTable columns={submissionColumns} rows={submissionRows} />
        )}
      </BentoPanel>

      <AdminAuditNote />

      {/* Take-down dialog — reason is required (hard requirement, unlike the
          legacy silent overflow-disc toggle). */}
      <Dialog open={!!takedownTarget} onOpenChange={(open) => { if (!open) closeTakedown(); }}>
        <DialogContent aria-describedby={undefined} className={cn(adminPanelStyle, 'w-full max-w-md p-6')}>
          <DialogTitle className="text-xl font-bold text-foreground">
            Take down “{takedownTarget?.title}”?
          </DialogTitle>
          <p className="mt-1.5 text-[14px] text-warm-secondary">
            The paper stops being readable straight away. This is reversible with Restore.
          </p>
          <div className="mt-4">
            <Label htmlFor="takedown-reason" className="mb-1.5 block text-[14px] font-semibold text-foreground">
              Reason <span className="font-normal text-warm-meta">(required, kept in the admin audit log)</span>
            </Label>
            <Textarea
              id="takedown-reason"
              value={takedownReason}
              onChange={(e) => setTakedownReason(e.target.value)}
              placeholder="e.g. Copyright complaint from the school"
              rows={3}
              autoFocus
            />
          </div>
          <div className="mt-5 flex items-center gap-2">
            <button
              onClick={confirmTakedown}
              disabled={takedownBusy || !takedownReason.trim()}
              className={`disabled:opacity-60 ${adminDestructiveBtnStyle}`}
            >
              {takedownBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Take down
            </button>
            <button onClick={closeTakedown} className={adminSecondaryBtnStyle}>
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload dialog — ported from the legacy Upload sub-tab (dropzone +
          storage upload + paper-details form + handleSave). */}
      <Dialog open={uploadOpen} onOpenChange={(open) => { if (!open) closeUpload(); }}>
        <DialogContent aria-describedby={undefined} className={cn(adminPanelStyle, 'max-h-[90vh] w-full max-w-lg overflow-y-auto p-6')}>
          <DialogTitle className="text-xl font-bold text-foreground">Upload a paper</DialogTitle>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDropZoneDrop}
            className={cn(
              'mt-4 rounded-2xl p-[26px] text-center shadow-[0_0_0_1px_var(--warm-hairline)] transition-colors',
              dragOver ? 'bg-warm-muted' : 'bg-warm-card',
            )}
          >
            {formData.file_url ? (
              <div className="flex items-center justify-center gap-2">
                <a href={formData.file_url} target="_blank" rel="noopener noreferrer" className="truncate text-sm text-foreground underline">
                  {formData.file_url.split('/').pop()}
                </a>
                <button onClick={() => handleChange('file_url', null)} aria-label="Remove file" className="text-warm-meta">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                {uploadingFile ? (
                  <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-warm-meta" />
                ) : (
                  <Upload className="mx-auto mb-2 h-5 w-5 text-warm-meta" />
                )}
                <div className="text-[15px] font-semibold text-foreground">
                  {uploadingFile ? 'Uploading…' : 'Drop a paper PDF here'}
                </div>
                <div className="mt-1 text-[13px] text-warm-meta">One file, or click to browse</div>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  disabled={uploadingFile}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); e.target.value = ''; }}
                />
              </label>
            )}
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="u-title" className="mb-1.5 block text-[14px] font-semibold text-foreground">Title</Label>
              <input
                id="u-title"
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g. Prelims 2025"
                className={cn(adminFieldStyle, 'w-full px-3 text-foreground outline-none transition-shadow duration-150 focus-visible:ring-2 focus-visible:ring-brand')}
              />
            </div>
            <div>
              <Label htmlFor="u-school" className="mb-1.5 block text-[14px] font-semibold text-foreground">School</Label>
              <input
                id="u-school"
                value={formData.school || ''}
                onChange={(e) => handleChange('school', e.target.value)}
                placeholder="e.g. La Martiniere for Boys"
                className={cn(adminFieldStyle, 'w-full px-3 text-foreground outline-none transition-shadow duration-150 focus-visible:ring-2 focus-visible:ring-brand')}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 block text-[14px] font-semibold text-foreground">Subject</Label>
                <Select value={formData.subject} onValueChange={(v) => handleChange('subject', v)}>
                  <SelectTrigger className={cn(adminFieldStyle, 'h-auto border-0')}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block text-[14px] font-semibold text-foreground">Class</Label>
                <Select value={formData.class} onValueChange={(v) => handleChange('class', v)}>
                  <SelectTrigger className={cn(adminFieldStyle, 'h-auto border-0')}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PAPER_CLASSES.map((c) => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block text-[14px] font-semibold text-foreground">Board</Label>
                <Select value={formData.board} onValueChange={(v) => handleChange('board', v)}>
                  <SelectTrigger className={cn(adminFieldStyle, 'h-auto border-0')}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {BOARDS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block text-[14px] font-semibold text-foreground">Exam type</Label>
                <Select value={formData.exam_type} onValueChange={(v) => handleChange('exam_type', v)}>
                  <SelectTrigger className={cn(adminFieldStyle, 'h-auto border-0')}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {EXAM_TYPES.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="u-year" className="mb-1.5 block text-[14px] font-semibold text-foreground">Year</Label>
              <input
                id="u-year"
                type="number"
                value={formData.year ?? ''}
                onChange={(e) => handleChange('year', e.target.value === '' ? undefined : Number(e.target.value))}
                className={cn(adminFieldStyle, 'w-full px-3 text-foreground outline-none transition-shadow duration-150 focus-visible:ring-2 focus-visible:ring-brand')}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="u-is-published"
                type="checkbox"
                checked={formData.is_published ?? true}
                onChange={(e) => handleChange('is_published', e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="u-is-published" className="!mb-0 text-[14px] text-warm-prose">
                Publish immediately (uncheck to save as draft)
              </Label>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => handleSave()} disabled={saving} className={`disabled:opacity-60 ${adminPrimaryBtnStyle}`}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Publish this paper
            </button>
            <button
              onClick={() => { handleChange('is_published', false); handleSave(false); }}
              disabled={saving}
              className={`disabled:opacity-60 ${adminSecondaryBtnStyle}`}
            >
              Save as draft
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Submission review dialog — the screen paper_submissions never had
          one of before. Pending gets the file list + Approve/Reject;
          approved/rejected are read-only (already reviewed, shown for the
          audit trail). */}
      <Dialog open={!!reviewTarget} onOpenChange={(open) => { if (!open) closeReview(); }}>
        <DialogContent aria-describedby={undefined} className={cn(adminPanelStyle, 'max-h-[90vh] w-full max-w-lg overflow-y-auto p-6')}>
          {reviewTarget && (
            <>
              <DialogTitle className="text-xl font-bold text-foreground">
                {reviewTarget.school} &middot; {reviewTarget.subject}
              </DialogTitle>
              <div className="mt-3 space-y-1.5 text-[14px] text-warm-prose">
                <div><strong className="text-foreground">Board:</strong> {reviewTarget.board || 'Not given'}</div>
                <div><strong className="text-foreground">Class:</strong> {reviewTarget.class || 'Not given'}</div>
                <div><strong className="text-foreground">Year:</strong> {reviewTarget.year || 'Not given'}</div>
                <div><strong className="text-foreground">Exam type:</strong> {reviewTarget.exam_type || 'Not given'}</div>
                <div><strong className="text-foreground">Submitted by:</strong> {reviewTarget.submitter_name || 'Not given'}{reviewTarget.submitter_contact ? ` (${reviewTarget.submitter_contact})` : ''}</div>
                <div><strong className="text-foreground">Submitted:</strong> {new Date(reviewTarget.created_at).toLocaleString()}</div>
              </div>

              <div className="mt-4">
                <Label className="mb-1.5 block text-[14px] font-semibold text-foreground">
                  Files ({reviewTarget.file_paths.length})
                </Label>
                {reviewTarget.file_paths.length === 0 ? (
                  <p className="text-[14px] text-warm-meta">No files were attached to this submission.</p>
                ) : reviewFilesLoading ? (
                  <p className="flex items-center gap-2 text-[14px] text-warm-meta">
                    <Loader2 className="h-4 w-4 animate-spin" /> Preparing files…
                  </p>
                ) : (
                  <ul className="space-y-1.5">
                    {reviewFileUrls.map((f, i) => (
                      <li key={f.path}>
                        {f.url ? (
                          <a
                            href={f.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-blue hover:text-brand-blue-deep"
                          >
                            <FileText className="h-4 w-4" /> File {i + 1}
                          </a>
                        ) : (
                          <span className="text-[14px] text-warm-meta">File {i + 1} (couldn't be opened)</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {reviewTarget.status === 'pending' ? (
                <div className="mt-5 flex flex-col gap-3 border-t border-warm-hairline pt-4">
                  {showReject ? (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="reject-note" className="text-[13px] font-semibold text-foreground">
                        Reason <span className="font-normal text-warm-meta">(required, kept in the admin audit log)</span>
                      </Label>
                      <Textarea
                        id="reject-note"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="e.g. Pages are unreadable, please resend clearer photos"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleRejectSubmission}
                          disabled={reviewBusy || !rejectReason.trim()}
                          className={`disabled:opacity-60 ${adminDestructiveBtnStyle}`}
                        >
                          {reviewBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                          Confirm rejection
                        </button>
                        <button onClick={() => { setShowReject(false); setRejectReason(''); }} className={adminSecondaryBtnStyle}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <Label htmlFor="approve-title" className="mb-1.5 block text-[14px] font-semibold text-foreground">
                          Title (shown on the paper's page)
                        </Label>
                        <input
                          id="approve-title"
                          value={approveTitle}
                          onChange={(e) => setApproveTitle(e.target.value)}
                          placeholder="e.g. Prelims 2025"
                          className={cn(adminFieldStyle, 'w-full px-3 text-foreground outline-none transition-shadow duration-150 focus-visible:ring-2 focus-visible:ring-brand')}
                        />
                        {reviewTarget.file_paths.length > 1 ? (
                          <p className="mt-1.5 text-[12px] text-warm-meta">
                            Only the first file is published — the papers table holds one file per paper.
                          </p>
                        ) : null}
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label className="mb-1.5 block text-[14px] font-semibold text-foreground">Board</Label>
                          <Select value={approveBoard} onValueChange={setApproveBoard}>
                            <SelectTrigger className={cn(adminFieldStyle, 'h-auto border-0')}><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {BOARDS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="mb-1.5 block text-[14px] font-semibold text-foreground">Class</Label>
                          <Select value={approveClass} onValueChange={setApproveClass}>
                            <SelectTrigger className={cn(adminFieldStyle, 'h-auto border-0')}><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {PAPER_CLASSES.map((c) => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="approve-year" className="mb-1.5 block text-[14px] font-semibold text-foreground">Year</Label>
                          <input
                            id="approve-year"
                            type="number"
                            value={approveYear}
                            onChange={(e) => setApproveYear(e.target.value)}
                            className={cn(adminFieldStyle, 'w-full px-3 text-foreground outline-none transition-shadow duration-150 focus-visible:ring-2 focus-visible:ring-brand')}
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="mb-1.5 block text-[14px] font-semibold text-foreground">
                          Exam type <span className="font-normal text-warm-meta">(guessed from "{reviewTarget.exam_type || 'not given'}" — check it)</span>
                        </Label>
                        <Select value={approveExamType} onValueChange={setApproveExamType}>
                          <SelectTrigger className={cn(adminFieldStyle, 'h-auto border-0')}><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {EXAM_TYPES.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleApprove}
                          disabled={reviewBusy || !approveTitle.trim()}
                          className={`disabled:opacity-60 ${adminPrimaryBtnStyle}`}
                        >
                          {reviewBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                          Approve &amp; publish
                        </button>
                        <button onClick={() => setShowReject(true)} className={adminSecondaryBtnStyle}>
                          Reject
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="mt-5 border-t border-warm-hairline pt-4 text-[14px] text-warm-prose">
                  <div>
                    <strong className="text-foreground">Status:</strong>{' '}
                    {reviewTarget.status.charAt(0).toUpperCase() + reviewTarget.status.slice(1)}
                    {reviewTarget.reviewed_at ? ` on ${new Date(reviewTarget.reviewed_at).toLocaleString()}` : ''}
                  </div>
                  {reviewTarget.review_note ? (
                    <div className="mt-1"><strong className="text-foreground">Note:</strong> {reviewTarget.review_note}</div>
                  ) : null}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </BentoStack>
  );
}
