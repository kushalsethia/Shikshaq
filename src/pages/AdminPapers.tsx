import { useEffect, useState, type DragEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2, Lock, Plus, Save, Search, Trash2, Upload, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { SUBJECTS, CLASSES, BOARDS, EXAM_TYPES, SURFACE_TOKENS, MODE_TOKENS } from '@/utils/searchFacets';
import {
  AdminPill,
  adminRowStyle,
  adminRowListStyle,
  adminFieldStyle,
  adminPanelStyle,
  adminPrimaryBtnStyle,
  adminSecondaryBtnStyle,
  adminDestructiveBtnStyle,
  adminToast,
} from '@/components/AdminConsole';

const PAPER_CLASSES = CLASSES.filter((c) => c !== 'UG');
const PAPERS_TINT = MODE_TOKENS.papers; // indigo — this route's own accent, not a console tab

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

export default function AdminPapers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'upload' ? 'upload' : 'manage';

  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [papers, setPapers] = useState<PaperRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<PaperRow | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<FormState>(BLANK_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setCheckingAdmin(false);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase.from('admins').select('id').eq('id', user.id).maybeSingle();
        if (error || !data) {
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
          fetchPapers();
        }
      } catch (error) {
        if (import.meta.env.DEV) console.error('Error:', error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
        setLoading(false);
      }
    }
    checkAdminStatus();
  }, [user, navigate]);

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

  const filteredPapers = papers.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.school.toLowerCase().includes(q) || p.subject.toLowerCase().includes(q);
  });

  function selectPaper(p: PaperRow | null) {
    setSelected(p);
    setFormData(p ? { ...p } : BLANK_FORM);
    setEditing(true);
  }

  function closeEditor() {
    setEditing(false);
    setSelected(null);
    setFormData(BLANK_FORM);
  }

  function handleChange<K extends keyof FormState>(field: K, value: FormState[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      const { data: { publicUrl } } = supabase.storage.from('paper-files').getPublicUrl(fileName);
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

  async function handleSave() {
    if (!formData.title?.trim() || !formData.school?.trim() || !formData.subject || !formData.class || !formData.board || !formData.year) {
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
        is_published: formData.is_published ?? true,
      };

      if (selected) {
        const { error } = await supabase.from('papers').update(payload).eq('id', selected.id);
        if (error) throw error;
        adminToast('Paper updated');
      } else {
        const { error } = await supabase.from('papers').insert(payload);
        if (error) throw error;
        adminToast('Paper published');
      }

      await fetchPapers();
      closeEditor();
      setSearchParams({ tab: 'manage' });
    } catch (error) {
      if (import.meta.env.DEV) console.error('Save error:', error);
      adminToast('Failed to save paper');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selected) return;
    if (!window.confirm(`Delete "${selected.title}"? This cannot be undone.`)) return;
    try {
      setDeleting(true);
      const { error } = await supabase.from('papers').delete().eq('id', selected.id);
      if (error) throw error;
      adminToast('Paper deleted');
      await fetchPapers();
      closeEditor();
    } catch (error) {
      if (import.meta.env.DEV) console.error('Delete error:', error);
      adminToast('Failed to delete paper');
    } finally {
      setDeleting(false);
    }
  }

  // Reversible: the same update call handleSave already uses, scoped to one
  // field, so the Manage row's Unpublish action toasts with an Undo that
  // just flips is_published back — no new mutation path.
  async function handleUnpublish(paper: PaperRow) {
    const nextPublished = !paper.is_published;
    setPapers((prev) => prev.map((p) => (p.id === paper.id ? { ...p, is_published: nextPublished } : p)));
    try {
      const { error } = await supabase.from('papers').update({ is_published: nextPublished }).eq('id', paper.id);
      if (error) throw error;
      adminToast(nextPublished ? 'Paper republished' : 'Paper unpublished', {
        undo: async () => {
          setPapers((prev) => prev.map((p) => (p.id === paper.id ? { ...p, is_published: paper.is_published } : p)));
          await supabase.from('papers').update({ is_published: paper.is_published }).eq('id', paper.id);
        },
      });
    } catch (error) {
      if (import.meta.env.DEV) console.error('Unpublish error:', error);
      setPapers((prev) => prev.map((p) => (p.id === paper.id ? { ...p, is_published: paper.is_published } : p)));
      adminToast('Failed to update paper');
    }
  }

  if (checkingAdmin || loading) {
    return (
      <div style={{ minHeight: '100vh', background: SURFACE_TOKENS.shell }} className="flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 rounded mb-8" style={{ background: SURFACE_TOKENS.mutedFill }} />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 rounded-2xl" style={{ background: SURFACE_TOKENS.field, boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: SURFACE_TOKENS.shell }} className="flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div style={{ padding: 32, borderRadius: 20, background: SURFACE_TOKENS.field, boxShadow: '0 0 0 1px rgba(0,0,0,.06)', textAlign: 'center', maxWidth: 380 }}>
            <div style={{ width: 56, height: 56, borderRadius: 999, background: SURFACE_TOKENS.mutedFill, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Lock className="w-6 h-6" style={{ color: SURFACE_TOKENS.textTertiary }} />
            </div>
            <h1 style={{ fontSize: 'clamp(20px,2.6vw,26px)', fontWeight: 700, marginBottom: 8, color: SURFACE_TOKENS.textPrimary }}>Sign In Required</h1>
            <p style={{ fontSize: 14, color: SURFACE_TOKENS.textSecondary, marginBottom: 20 }}>You need to sign in to access the admin panel.</p>
            <button
              onClick={() => navigate('/auth')}
              style={{ minHeight: 44, padding: '0 22px', borderRadius: 12, background: SURFACE_TOKENS.ink, color: '#fff', fontSize: 14, fontWeight: 600 }}
            >
              Sign In
            </button>
            <div className="mt-4">
              <button
                onClick={() => navigate('/')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44, padding: '0 8px', fontSize: 13, fontWeight: 600, color: SURFACE_TOKENS.textTertiary }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to home
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', background: SURFACE_TOKENS.shell }} className="flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="mb-4" style={{ fontSize: 'clamp(23px,3vw,32px)', fontWeight: 700, color: SURFACE_TOKENS.textPrimary }}>Access Denied</h1>
            <p className="mb-6" style={{ color: SURFACE_TOKENS.textSecondary }}>
              You need to be an admin to access this page.
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const maxWidth = activeTab === 'upload' ? 900 : 1000;

  return (
    <div style={{ minHeight: '100vh', background: SURFACE_TOKENS.shell }} className="flex flex-col">
      <Navbar />
      <main
        className="flex-1 w-full mx-auto"
        style={{ maxWidth, padding: 'clamp(24px,4vw,48px) clamp(16px,3vw,28px) 56px' }}
      >
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate('/admin')}
            aria-label="Back to admin console"
            className="inline-flex items-center justify-center transition-colors"
            style={{ width: 40, height: 40, borderRadius: 12, boxShadow: `0 0 0 1px ${SURFACE_TOKENS.hairline}`, color: SURFACE_TOKENS.textPrimary, flexShrink: 0 }}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 style={{ fontSize: 'clamp(23px,3vw,32px)', lineHeight: 1, fontWeight: 700, color: SURFACE_TOKENS.textPrimary }}>
            {activeTab === 'upload' ? 'Upload papers' : 'Manage papers'}
          </h1>
        </div>
        <p style={{ marginTop: 10, fontSize: 15, color: SURFACE_TOKENS.textSecondary }}>
          {activeTab === 'upload'
            ? 'Nothing commits until you have seen this summary. Commit is per file.'
            : 'Unpublish is reversible and is the default action for a removal request.'}
        </p>

        {/* Upload / Manage sub-tabs */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            marginTop: 18,
            padding: 5,
            width: 'max-content',
            maxWidth: '100%',
            borderRadius: 999,
            background: SURFACE_TOKENS.mutedFill,
          }}
        >
          {(['upload', 'manage'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { closeEditor(); setSearchParams({ tab }); }}
              style={{
                minHeight: 42,
                padding: '11px 18px',
                borderRadius: 999,
                fontSize: 13.5,
                fontWeight: 600,
                background: activeTab === tab ? SURFACE_TOKENS.field : 'transparent',
                color: activeTab === tab ? SURFACE_TOKENS.textPrimary : SURFACE_TOKENS.textBody,
                boxShadow: activeTab === tab ? `0 0 0 1px ${SURFACE_TOKENS.hairline}` : 'none',
              }}
            >
              {tab === 'upload' ? 'Upload' : 'Manage'}
            </button>
          ))}
        </div>

        {activeTab === 'upload' ? (
          <div style={{ marginTop: 22 }}>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDropZoneDrop}
              style={{
                padding: 30,
                borderRadius: 20,
                textAlign: 'center',
                background: dragOver ? PAPERS_TINT.tintBg : SURFACE_TOKENS.field,
                boxShadow: `0 0 0 1px ${dragOver ? PAPERS_TINT.color : SURFACE_TOKENS.hairline}`,
                transition: 'background .2s, box-shadow .2s',
              }}
            >
              {formData.file_url ? (
                <div className="flex items-center justify-center gap-2">
                  <a href={formData.file_url} target="_blank" rel="noopener noreferrer" className="text-sm underline truncate" style={{ color: PAPERS_TINT.tintText }}>
                    {formData.file_url.split('/').pop()}
                  </a>
                  <button onClick={() => handleChange('file_url', null)} aria-label="Remove file" style={{ color: SURFACE_TOKENS.textTertiary }}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  {uploadingFile ? (
                    <Loader2 className="w-5 h-5 mx-auto mb-2 animate-spin" style={{ color: SURFACE_TOKENS.textTertiary }} />
                  ) : (
                    <Upload className="w-5 h-5 mx-auto mb-2" style={{ color: SURFACE_TOKENS.textTertiary }} />
                  )}
                  <div style={{ fontSize: 15, fontWeight: 600, color: SURFACE_TOKENS.textPrimary }}>
                    {uploadingFile ? 'Uploading…' : 'Drop a paper PDF here'}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 13, color: SURFACE_TOKENS.textTertiary }}>
                    One file, or click to browse
                  </div>
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

            <h2 style={{ margin: '28px 0 14px', fontSize: 20, fontWeight: 700, color: SURFACE_TOKENS.textPrimary }}>
              Paper details
            </h2>

            <div style={{ ...adminPanelStyle, padding: 20 }}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" style={{ fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary, marginBottom: 6, display: 'block' }}>Title</Label>
                  <input
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g. Prelims 2025"
                    className="w-full px-3 outline-none"
                    style={{ ...adminFieldStyle, color: SURFACE_TOKENS.textPrimary }}
                  />
                </div>
                <div>
                  <Label htmlFor="school" style={{ fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary, marginBottom: 6, display: 'block' }}>School</Label>
                  <input
                    id="school"
                    value={formData.school || ''}
                    onChange={(e) => handleChange('school', e.target.value)}
                    placeholder="e.g. La Martiniere for Boys"
                    className="w-full px-3 outline-none"
                    style={{ ...adminFieldStyle, color: SURFACE_TOKENS.textPrimary }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label style={{ fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary, marginBottom: 6, display: 'block' }}>Subject</Label>
                    <Select value={formData.subject} onValueChange={(v) => handleChange('subject', v)}>
                      <SelectTrigger className="h-auto border-0" style={adminFieldStyle}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label style={{ fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary, marginBottom: 6, display: 'block' }}>Class</Label>
                    <Select value={formData.class} onValueChange={(v) => handleChange('class', v)}>
                      <SelectTrigger className="h-auto border-0" style={adminFieldStyle}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {PAPER_CLASSES.map((c) => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label style={{ fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary, marginBottom: 6, display: 'block' }}>Board</Label>
                    <Select value={formData.board} onValueChange={(v) => handleChange('board', v)}>
                      <SelectTrigger className="h-auto border-0" style={adminFieldStyle}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {BOARDS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label style={{ fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary, marginBottom: 6, display: 'block' }}>Exam type</Label>
                    <Select value={formData.exam_type} onValueChange={(v) => handleChange('exam_type', v)}>
                      <SelectTrigger className="h-auto border-0" style={adminFieldStyle}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {EXAM_TYPES.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="year" style={{ fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary, marginBottom: 6, display: 'block' }}>Year</Label>
                  <input
                    id="year"
                    type="number"
                    value={formData.year ?? ''}
                    onChange={(e) => handleChange('year', e.target.value === '' ? undefined : Number(e.target.value))}
                    className="w-full px-3 outline-none"
                    style={{ ...adminFieldStyle, color: SURFACE_TOKENS.textPrimary }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="is_published"
                    type="checkbox"
                    checked={formData.is_published ?? true}
                    onChange={(e) => handleChange('is_published', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="is_published" className="!mb-0" style={{ fontSize: 13.5, color: SURFACE_TOKENS.textBody }}>
                    Publish immediately (uncheck to save as draft)
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap" style={{ marginTop: 22 }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ ...adminPrimaryBtnStyle, minHeight: 48 }}
                className="disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Publish this paper
              </button>
              <button
                onClick={() => { handleChange('is_published', false); handleSave(); }}
                disabled={saving}
                style={adminSecondaryBtnStyle}
                className="disabled:opacity-60"
              >
                Save as draft
              </button>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 24 }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: SURFACE_TOKENS.textTertiary }} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search papers..."
                  className="w-full pl-9 pr-3 outline-none"
                  style={{ ...adminFieldStyle, color: SURFACE_TOKENS.textPrimary }}
                />
              </div>
              <button onClick={() => { setSearchParams({ tab: 'upload' }); }} style={adminPrimaryBtnStyle} className="flex-shrink-0">
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {filteredPapers.length === 0 ? (
              <div className="text-center" style={{ ...adminPanelStyle, padding: 48 }}>
                <p style={{ color: SURFACE_TOKENS.textTertiary, fontSize: 14.5 }}>No papers yet.</p>
              </div>
            ) : (
              <div style={adminRowListStyle}>
                {filteredPapers.map((p) => (
                  <div key={p.id} style={adminRowStyle}>
                    <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                      <div style={{ fontSize: 15.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary }}>
                        {p.title} — {p.school}
                      </div>
                      <div style={{ marginTop: 4, fontSize: 12.5, color: SURFACE_TOKENS.textTertiary }}>
                        {p.subject} · Class {p.class} · {p.board} · {p.exam_type} · {p.year}
                      </div>
                    </div>
                    <AdminPill tone={p.is_published ? 'settled' : 'pending'}>
                      {p.is_published ? 'Published' : 'Draft'}
                    </AdminPill>
                    <span style={{ fontSize: 13, color: SURFACE_TOKENS.textTertiary, minWidth: 70 }}>
                      {new Date(p.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => selectPaper(p)} style={{ ...adminSecondaryBtnStyle, minHeight: 'auto', padding: '9px 14px' }}>
                        Edit
                      </button>
                      <button onClick={() => handleUnpublish(p)} style={{ ...adminSecondaryBtnStyle, minHeight: 'auto', padding: '9px 14px' }}>
                        {p.is_published ? 'Unpublish' : 'Republish'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Edit panel (Manage tab -> Edit) */}
        {editing && activeTab === 'manage' && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeEditor}
          >
            <div
              className="max-w-lg w-full max-h-[90vh] overflow-y-auto"
              style={{ ...adminPanelStyle, padding: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5 gap-4">
                <h2 style={{ fontSize: 'clamp(19px,2.4vw,24px)', fontWeight: 700, color: SURFACE_TOKENS.textPrimary }}>
                  {selected ? 'Edit paper' : 'Add a new paper'}
                </h2>
                <button onClick={closeEditor} style={{ fontSize: 13, fontWeight: 600, color: SURFACE_TOKENS.textTertiary }}>Close</button>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="etitle" style={{ fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary, marginBottom: 6, display: 'block' }}>Title</Label>
                  <input id="etitle" value={formData.title || ''} onChange={(e) => handleChange('title', e.target.value)} className="w-full px-3 outline-none" style={{ ...adminFieldStyle, color: SURFACE_TOKENS.textPrimary }} />
                </div>
                <div>
                  <Label htmlFor="eschool" style={{ fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary, marginBottom: 6, display: 'block' }}>School</Label>
                  <input id="eschool" value={formData.school || ''} onChange={(e) => handleChange('school', e.target.value)} className="w-full px-3 outline-none" style={{ ...adminFieldStyle, color: SURFACE_TOKENS.textPrimary }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label style={{ fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary, marginBottom: 6, display: 'block' }}>Subject</Label>
                    <Select value={formData.subject} onValueChange={(v) => handleChange('subject', v)}>
                      <SelectTrigger className="h-auto border-0" style={adminFieldStyle}><SelectValue /></SelectTrigger>
                      <SelectContent>{SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label style={{ fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary, marginBottom: 6, display: 'block' }}>Class</Label>
                    <Select value={formData.class} onValueChange={(v) => handleChange('class', v)}>
                      <SelectTrigger className="h-auto border-0" style={adminFieldStyle}><SelectValue /></SelectTrigger>
                      <SelectContent>{PAPER_CLASSES.map((c) => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label style={{ fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary, marginBottom: 6, display: 'block' }}>Board</Label>
                    <Select value={formData.board} onValueChange={(v) => handleChange('board', v)}>
                      <SelectTrigger className="h-auto border-0" style={adminFieldStyle}><SelectValue /></SelectTrigger>
                      <SelectContent>{BOARDS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label style={{ fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary, marginBottom: 6, display: 'block' }}>Exam type</Label>
                    <Select value={formData.exam_type} onValueChange={(v) => handleChange('exam_type', v)}>
                      <SelectTrigger className="h-auto border-0" style={adminFieldStyle}><SelectValue /></SelectTrigger>
                      <SelectContent>{EXAM_TYPES.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="eyear" style={{ fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary, marginBottom: 6, display: 'block' }}>Year</Label>
                  <input id="eyear" type="number" value={formData.year ?? ''} onChange={(e) => handleChange('year', e.target.value === '' ? undefined : Number(e.target.value))} className="w-full px-3 outline-none" style={{ ...adminFieldStyle, color: SURFACE_TOKENS.textPrimary }} />
                </div>
                <div>
                  <Label style={{ fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary, marginBottom: 6, display: 'block' }}>PDF file</Label>
                  {formData.file_url ? (
                    <div className="flex items-center gap-2 mt-1">
                      <a href={formData.file_url} target="_blank" rel="noopener noreferrer" className="text-sm underline truncate flex-1" style={{ color: PAPERS_TINT.tintText }}>
                        {formData.file_url.split('/').pop()}
                      </a>
                      <button onClick={() => handleChange('file_url', null)} aria-label="Remove file"><X className="w-4 h-4" style={{ color: SURFACE_TOKENS.textTertiary }} /></button>
                    </div>
                  ) : (
                    <label className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer text-sm" style={{ boxShadow: `0 0 0 1px ${SURFACE_TOKENS.hairline}`, color: SURFACE_TOKENS.textTertiary }}>
                      {uploadingFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {uploadingFile ? 'Uploading...' : 'Upload PDF (optional)'}
                      <input type="file" accept="application/pdf" className="hidden" disabled={uploadingFile} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); e.target.value = ''; }} />
                    </label>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input id="eis_published" type="checkbox" checked={formData.is_published ?? true} onChange={(e) => handleChange('is_published', e.target.checked)} className="w-4 h-4" />
                  <Label htmlFor="eis_published" className="!mb-0" style={{ fontSize: 13.5, color: SURFACE_TOKENS.textBody }}>Published (visible on the site)</Label>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button onClick={handleSave} disabled={saving} style={adminPrimaryBtnStyle} className="disabled:opacity-60">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {selected ? 'Save changes' : 'Add paper'}
                  </button>
                  {selected && (
                    <button onClick={handleDelete} disabled={deleting} style={adminDestructiveBtnStyle} className="disabled:opacity-60">
                      {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
