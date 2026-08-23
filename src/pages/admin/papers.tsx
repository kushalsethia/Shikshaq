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
  AdminAuditFootnote,
} from '@/components/AdminConsole';
import { AdminRail, AdminToolbar, type AdminNavItem } from '@/pages/admin/shell';
import { AdminTable, type AdminTableColumn, type AdminTableRow } from '@/pages/admin/AdminTable';
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
import { Loader2, Plus, Save, Search, Upload, X } from 'lucide-react';
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

  useEffect(() => {
    if (isAdmin) fetchPapers();
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
      const { data, error } = await supabase
        .from('papers')
        .select('*')
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

  const nav: AdminNavItem[] = [
    { key: 'approvals', label: 'Approvals', path: '/admin/approvals', count: pendingCount, active: false },
    { key: 'teachers', label: 'Live teachers', path: '/admin/teachers', active: false },
    { key: 'papers', label: 'Papers', path: '/admin/papers', active: true },
    { key: 'reviews', label: 'Reviews', path: '/admin/reviews', active: false },
    { key: 'audit', label: 'Audit log', path: '/admin/audit', active: false },
  ];

  const columns: AdminTableColumn[] = [
    { key: 'paper', label: 'Paper', width: '2.2fr' },
    { key: 'school', label: 'School', width: '1.2fr' },
    { key: 'board', label: 'Board', width: '0.9fr' },
    { key: 'uploaded', label: 'Uploaded', width: '1fr' },
    { key: 'reports', label: 'Reports', width: '0.8fr' },
  ];

  const rows: AdminTableRow[] = filteredPapers.map((p) => ({
    id: p.id,
    title: p.title,
    subtitle: `${p.subject} · Class ${p.class} · ${p.exam_type} · ${p.year}`,
    cells: [p.school, p.board, new Date(p.created_at).toLocaleDateString(), '-'],
    tone: p.is_published ? 'ok' : 'bad',
    tag: p.is_published ? 'Live' : 'Taken down',
    actionLabel: p.is_published ? 'Take down' : 'Restore',
    onAction: () => (p.is_published ? openTakedown(p) : handleRestore(p)),
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
      <div className="min-h-screen bg-background">
        <AdminRail nav={nav} signedInName={actorName} />
        <div className="lg:pl-[244px]">
          <AdminToolbar title="Papers" />
          <main className="px-4 py-8 lg:px-7">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 rounded-2xl bg-warm-card shadow-border" />
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (adminGuardError) return <AdminGuardErrorState onRetry={retryAdminGuard} />;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className={cn(adminPanelStyle, 'max-w-[380px] p-8 text-center')}>
          <h1 className="mb-2 text-xl font-bold text-foreground">Access denied</h1>
          <p className="text-sm text-warm-secondary">You need to be an admin to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminRail nav={nav} signedInName={actorName} />
      <div className="lg:pl-[244px]">
        <AdminToolbar title="Papers" badge={`${papers.length} in library`} search={searchSlot} sort={sortSlot} />

        <main className="px-4 py-8 lg:px-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-[clamp(19px,2.4vw,24px)] font-bold text-foreground">
                Papers &amp; takedowns
              </h1>
              <p className="mt-1.5 text-[14.5px] text-warm-secondary">
                Take down is reversible with Restore, but always requires a reason.
              </p>
            </div>
            <button onClick={openUpload} className={adminPrimaryBtnStyle}>
              <Plus className="w-4 h-4" />
              Upload paper
            </button>
          </div>

          <AdminStatTiles
            stats={[
              { label: 'In the library', value: papers.length },
              { label: 'Live', value: papers.filter((p) => p.is_published).length },
              { label: 'Taken down', value: papers.filter((p) => !p.is_published).length },
            ]}
          />

          <div className="relative mb-4 lg:hidden">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-meta" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search papers..."
              className={cn(adminFieldStyle, 'w-full pl-9 pr-3 text-foreground outline-none')}
            />
          </div>

          {filteredPapers.length === 0 ? (
            <div className={cn(adminPanelStyle, 'p-12 text-center')}>
              <p className="text-[14.5px] text-warm-meta">
                {searchQuery.trim() ? `No papers match "${searchQuery.trim()}".` : 'No papers yet.'}
              </p>
              {searchQuery.trim() ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-[14.5px] font-semibold text-brand underline-offset-2 hover:underline"
                >
                  Clear search
                </button>
              ) : null}
            </div>
          ) : (
            <AdminTable columns={columns} rows={rows} />
          )}
          <AdminAuditFootnote />
        </main>
      </div>

      {/* Take-down dialog — reason is required (hard requirement, unlike the
          legacy silent overflow-disc toggle). */}
      <Dialog open={!!takedownTarget} onOpenChange={(open) => { if (!open) closeTakedown(); }}>
        <DialogContent aria-describedby={undefined} className={cn(adminPanelStyle, 'w-full max-w-md p-6')}>
          <DialogTitle className="text-xl font-bold text-foreground">
            Take down “{takedownTarget?.title}”?
          </DialogTitle>
          <p className="mt-1.5 text-[13.5px] text-warm-secondary">
            The paper stops being readable straight away. This is reversible with Restore.
          </p>
          <div className="mt-4">
            <Label htmlFor="takedown-reason" className="mb-1.5 block text-[13.5px] font-semibold text-foreground">
              Reason <span className="font-normal text-warm-meta">(required, the reported party can read this)</span>
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
                <div className="text-[14.5px] font-semibold text-foreground">
                  {uploadingFile ? 'Uploading…' : 'Drop a paper PDF here'}
                </div>
                <div className="mt-1 text-[12.5px] text-warm-meta">One file, or click to browse</div>
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
              <Label htmlFor="u-title" className="mb-1.5 block text-[13.5px] font-semibold text-foreground">Title</Label>
              <input
                id="u-title"
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g. Prelims 2025"
                className={cn(adminFieldStyle, 'w-full px-3 text-foreground outline-none')}
              />
            </div>
            <div>
              <Label htmlFor="u-school" className="mb-1.5 block text-[13.5px] font-semibold text-foreground">School</Label>
              <input
                id="u-school"
                value={formData.school || ''}
                onChange={(e) => handleChange('school', e.target.value)}
                placeholder="e.g. La Martiniere for Boys"
                className={cn(adminFieldStyle, 'w-full px-3 text-foreground outline-none')}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 block text-[13.5px] font-semibold text-foreground">Subject</Label>
                <Select value={formData.subject} onValueChange={(v) => handleChange('subject', v)}>
                  <SelectTrigger className={cn(adminFieldStyle, 'h-auto border-0')}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block text-[13.5px] font-semibold text-foreground">Class</Label>
                <Select value={formData.class} onValueChange={(v) => handleChange('class', v)}>
                  <SelectTrigger className={cn(adminFieldStyle, 'h-auto border-0')}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PAPER_CLASSES.map((c) => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block text-[13.5px] font-semibold text-foreground">Board</Label>
                <Select value={formData.board} onValueChange={(v) => handleChange('board', v)}>
                  <SelectTrigger className={cn(adminFieldStyle, 'h-auto border-0')}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {BOARDS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block text-[13.5px] font-semibold text-foreground">Exam type</Label>
                <Select value={formData.exam_type} onValueChange={(v) => handleChange('exam_type', v)}>
                  <SelectTrigger className={cn(adminFieldStyle, 'h-auto border-0')}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {EXAM_TYPES.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="u-year" className="mb-1.5 block text-[13.5px] font-semibold text-foreground">Year</Label>
              <input
                id="u-year"
                type="number"
                value={formData.year ?? ''}
                onChange={(e) => handleChange('year', e.target.value === '' ? undefined : Number(e.target.value))}
                className={cn(adminFieldStyle, 'w-full px-3 text-foreground outline-none')}
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
              <Label htmlFor="u-is-published" className="!mb-0 text-[13.5px] text-warm-prose">
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
    </div>
  );
}
