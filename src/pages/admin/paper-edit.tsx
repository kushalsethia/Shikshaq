import { memo, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useAdminGuard, AdminGuardErrorState, adminToast, adminPrimaryBtnStyle, adminSecondaryBtnStyle } from '@/components/AdminConsole';
import { AdminHeader, buildAdminNav } from '@/pages/admin/shell';
import { AdminStatusPill } from '@/pages/admin/AdminTable';
import { BentoPanel, BentoStack } from '@/components/layout/PageContainer';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { MathText } from '@/components/papers/math-text';
import { cn } from '@/lib/utils';
import { usePageMeta } from '@/hooks/usePageMeta';
import { kidSentence } from '@/lib/checker-kid-reasons';
import {
  adminPaperDraft,
  adminSaveDraftQuestion,
  adminVerifyPaper,
  adminEditBankPaper,
  snippetUrls,
  DRAFT_CONFLICT_CODE,
  type DraftRow,
  type VerifyPaperResult,
} from '@/lib/checker-api';
import {
  autosaveReducer,
  initialAutosave,
  hasUnsavedWork,
  saveStatusLabel,
  parseMarks,
  numberForSave,
  fieldsEqual,
  summarizeForVerify,
  verifyConfirmLines,
  verifyResultHeadline,
  depthMap,
  PAPER_DETAIL_FIELDS,
  paperDetailValue,
  type DraftFields,
  type PaperDetailField,
  type SaveStatus,
} from '@/lib/paper-edit';

/* Admin paper edit page -- W12. Owner: "paper edit button should open a
   paper edit page where the paper is loaded and text can be edited and saved
   automatically and then verify button verifies it all".

   Every edit autosaves into the DRAFT (audit_questions, the live paper's
   working copy) through admin_save_draft_question(). Readers see nothing
   until Verify: admin_verify_paper() passes every question and flips the
   draft's paper_passed, which fires the chokepoint that copies the draft onto
   bank_questions. Nothing on this page writes bank_questions directly; doing
   so would be overwritten by the older draft on the next flip.

   The one exception is "Paper details" (school, year, incomplete note...),
   which are bank_papers fields with no draft copy. That dialog is the old
   Edit dialog from the Paper review list, moved here, and it says plainly
   that it saves straight to the live paper. */

const AUTOSAVE_MS = 800;

const KIND_LABEL: Record<string, string> = {
  master_instruction: 'Paper instructions',
  section_break: 'Section',
  section_instruction: 'Section instructions',
};

type QuestionRow = DraftRow & { question_id: string };

function toFieldStrings(r: { body: string | null; display_number: string | null; marks: number | null }) {
  return { body: r.body ?? '', number: r.display_number ?? '', marks: r.marks != null ? String(r.marks) : '' };
}

export default function AdminPaperEditPage() {
  const { paperId = '' } = useParams<{ paperId: string }>();
  usePageMeta('Edit paper | Shikshaq Admin', 'Edit a paper draft and verify it for readers.');
  const { user, profile } = useAuth();
  const actorName = profile?.full_name || user?.email || 'an admin';
  const { isAdmin, checkingAdmin, error: adminGuardError, retry } = useAdminGuard(user, { redirectOnDenied: true });

  const [rows, setRows] = useState<DraftRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [editorEpoch, setEditorEpoch] = useState(0);
  const [snippets, setSnippets] = useState<Map<string, string>>(new Map());
  const [statuses, setStatuses] = useState<Record<string, SaveStatus>>({});

  const [verifyOpen, setVerifyOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<VerifyPaperResult | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailField, setDetailField] = useState<PaperDetailField>('incomplete_note');
  const [detailValue, setDetailValue] = useState('');
  const [detailSaving, setDetailSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await adminPaperDraft(paperId);
      setRows(data);
      setStatuses({});
      setEditorEpoch((n) => n + 1);
      const auditPaperId = data[0]?.audit_paper_id;
      const ids = data.filter((r) => r.kind === 'question' && r.question_id).map((r) => r.question_id as string);
      if (auditPaperId && ids.length > 0) {
        snippetUrls(auditPaperId, ids).then(setSnippets).catch(() => setSnippets(new Map()));
      } else {
        setSnippets(new Map());
      }
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [paperId]);

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin, load]);

  const paper = rows[0] ?? null;
  const items = useMemo(() => rows.filter((r): r is QuestionRow => !!r.question_id), [rows]);
  const depths = useMemo(() => depthMap(items.map((r) => ({ id: r.question_id, parent_id: r.parent_id }))), [items]);
  const summary = useMemo(
    () =>
      summarizeForVerify(
        items.map((r) => ({
          kind: r.kind ?? '',
          question_passed: !!r.question_passed,
          review_bucket: r.review_bucket,
          flag_reasons: r.flag_reasons,
        })),
      ),
    [items],
  );

  const unsavedCount = Object.values(statuses).filter((s) => s === 'dirty' || s === 'saving' || s === 'failed').length;
  const savingNow = Object.values(statuses).some((s) => s === 'saving' || s === 'dirty');
  const failedCount = Object.values(statuses).filter((s) => s === 'failed').length;

  // Leaving with text the server has not stored yet asks first.
  useEffect(() => {
    if (unsavedCount === 0) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [unsavedCount]);

  const onStatus = useCallback((id: string, status: SaveStatus) => {
    setStatuses((prev) => (prev[id] === status ? prev : { ...prev, [id]: status }));
  }, []);

  // Keep the page's copy of a row in step with what the server stored, so
  // the verify counts and a later reload agree with the editor.
  const onSaved = useCallback((id: string, saved: DraftFields) => {
    setRows((prev) => prev.map((r) => (r.question_id === id ? { ...r, ...saved } : r)));
  }, []);

  // 40001: someone else changed this question. Fetch the paper again and
  // hand the editor the stored version of just that question.
  const reloadQuestion = useCallback(
    async (id: string): Promise<DraftRow | null> => {
      try {
        const data = await adminPaperDraft(paperId);
        const fresh = data.find((r) => r.question_id === id) ?? null;
        if (fresh) setRows((prev) => prev.map((r) => (r.question_id === id ? fresh : r)));
        return fresh;
      } catch {
        return null;
      }
    },
    [paperId],
  );

  async function doVerify() {
    setVerifying(true);
    try {
      const result = await adminVerifyPaper(paperId);
      setVerifyOpen(false);
      setVerifyResult(result);
      await load();
    } catch (e) {
      const msg = (e as { message?: string })?.message;
      adminToast('Could not verify this paper', msg ? { description: msg } : undefined);
    } finally {
      setVerifying(false);
    }
  }

  function openDetails() {
    const field: PaperDetailField = 'incomplete_note';
    setDetailField(field);
    setDetailValue(paper ? paperDetailValue(paper, field) : '');
    setDetailsOpen(true);
  }

  async function saveDetails() {
    setDetailSaving(true);
    try {
      await adminEditBankPaper(paperId, detailField, detailValue);
      adminToast('Saved to the live paper');
      setDetailsOpen(false);
      await load();
    } catch {
      adminToast('Failed to save that field');
    } finally {
      setDetailSaving(false);
    }
  }

  const nav = buildAdminNav('paper-review', {});

  if (checkingAdmin) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <AdminHeader nav={nav} signedInEmail={user?.email ?? actorName} />
        <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 rounded-2xl bg-muted" />
            ))}
          </div>
        </BentoPanel>
      </BentoStack>
    );
  }

  if (adminGuardError) return <AdminGuardErrorState onRetry={retry} />;
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted px-4">
        <div className="max-w-[380px] rounded-bento bg-card p-8 text-center">
          <h1 className="mb-2 text-xl font-bold text-foreground">Access denied</h1>
          <p className="text-sm text-warm-secondary">You need to be an admin to access this page.</p>
        </div>
      </div>
    );
  }

  const hasDraft = !!paper?.audit_paper_id && items.length > 0;
  const confirmLines = verifyConfirmLines(summary, { isRed: !!paper?.is_red, reason: paper?.red_reason ?? null });
  const verifyBlocked = !hasDraft || summary.total === 0 || unsavedCount > 0 || verifying;

  return (
    <BentoStack className="min-h-screen bg-muted">
      <AdminHeader nav={nav} signedInEmail={user?.email ?? actorName} />

      <BentoPanel fill="card" className="px-4 py-[18px] lg:px-[18px]">
        <Link to="/admin/paper-review" className="inline-flex min-h-11 items-center text-[13px] font-semibold text-warm-secondary hover:text-foreground">
          Back to paper review
        </Link>

        {loading && rows.length === 0 ? (
          <div className="mt-3 animate-pulse space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-muted" />
            ))}
          </div>
        ) : loadError ? (
          <div className="py-10 text-center">
            <p className="text-[15px] text-warm-secondary">Could not load this paper.</p>
            <button onClick={() => void load()} className={cn('mt-4', adminPrimaryBtnStyle)}>Try again</button>
          </div>
        ) : !paper ? (
          <p className="py-10 text-center text-[15px] text-warm-meta">No paper with this id.</p>
        ) : (
          <>
            <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-[22px] font-extrabold tracking-[-0.03em] text-foreground">{paper.school || 'Unnamed school'}</h1>
                <p className="mt-0.5 text-[13px] text-warm-meta">
                  {[paper.subject, paper.cls ? `Class ${paper.cls}` : null, paper.exam, paper.year].filter(Boolean).join(' · ')}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <AdminStatusPill
                  status={!paper.is_published ? 'hidden' : paper.needs_review ? 'pending' : 'live'}
                  label={!paper.is_published ? 'Hidden' : paper.needs_review ? 'Needs review' : 'Live'}
                />
                <button onClick={openDetails} className={adminSecondaryBtnStyle}>Paper details</button>
              </div>
            </div>

            <p className="mt-3 rounded-2xl bg-muted px-4 py-3 text-[13px] leading-relaxed text-warm-secondary">
              Changes save by themselves into the draft. Readers keep seeing the current paper until you press Verify.
            </p>

            {verifyResult ? (
              <div
                role="status"
                className={cn('mt-3 rounded-2xl px-4 py-3', verifyResult.is_live ? 'bg-mint' : 'bg-brand-subtle')}
              >
                <p className="text-[15px] font-bold text-foreground">{verifyResultHeadline(verifyResult)}</p>
                {verifyResult.reason ? <p className="mt-1 text-[13px] text-foreground">{verifyResult.reason}</p> : null}
                <p className="mt-1 text-[12px] text-warm-secondary">
                  {verifyResult.questions_newly_passed} of {verifyResult.questions_total} questions were marked checked just now.
                </p>
                <button onClick={() => setVerifyResult(null)} className="mt-2 min-h-11 text-[13px] font-semibold text-warm-secondary">
                  Dismiss
                </button>
              </div>
            ) : null}

            {!hasDraft ? (
              <p className="py-10 text-center text-[15px] text-warm-meta">
                This paper has no working copy yet, so there is nothing to edit here.
              </p>
            ) : (
              <ol className="mt-4 space-y-3">
                {items.map((r) =>
                  r.kind === 'question' ? (
                    <QuestionEditor
                      key={`${editorEpoch}-${r.question_id}`}
                      row={r}
                      depth={depths.get(r.question_id) ?? 0}
                      snippetUrl={snippets.get(r.question_id) ?? null}
                      onStatus={onStatus}
                      onSaved={onSaved}
                      reloadQuestion={reloadQuestion}
                    />
                  ) : (
                    <li key={r.question_id} className="border-l-2 border-warm-hairline py-2 pl-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.04em] text-warm-meta">
                        {KIND_LABEL[r.kind ?? ''] ?? r.kind}
                      </p>
                      {r.body ? <MathText text={r.body} className="mt-1 text-[14px] leading-relaxed text-warm-secondary" /> : null}
                    </li>
                  ),
                )}
              </ol>
            )}
          </>
        )}
      </BentoPanel>

      {hasDraft ? (
        <div className="sticky bottom-3 z-20 mx-auto w-full">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-bento bg-panel px-4 py-3 text-background">
            <div className="min-w-0 text-[13px]" aria-live="polite">
              <p className="font-bold">
                {summary.total} questions, {summary.stillFlagged} still flagged
              </p>
              <p className="opacity-80">
                {failedCount > 0
                  ? `${failedCount} not saved. Fix or retry them before verifying.`
                  : savingNow
                    ? 'Saving...'
                    : 'All changes saved'}
              </p>
            </div>
            <button
              onClick={() => setVerifyOpen(true)}
              disabled={verifyBlocked}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-mint px-5 text-[14px] font-bold text-foreground transition-transform duration-150 active:scale-[0.97] disabled:opacity-50"
            >
              Verify
            </button>
          </div>
        </div>
      ) : null}

      <Dialog open={verifyOpen} onOpenChange={(open) => { if (!open && !verifying) setVerifyOpen(false); }}>
        <DialogContent aria-describedby={undefined} className="w-full max-w-md rounded-bento bg-card p-6">
          <DialogTitle className="text-xl font-bold text-foreground">Verify this paper?</DialogTitle>
          <ul className="mt-3 space-y-1.5 text-[14px] text-warm-secondary">
            {confirmLines.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => void doVerify()} disabled={verifying} className={cn('disabled:opacity-60', adminPrimaryBtnStyle)}>
              {verifying ? 'Verifying...' : 'Verify and publish'}
            </button>
            <button onClick={() => setVerifyOpen(false)} disabled={verifying} className={adminSecondaryBtnStyle}>Cancel</button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={detailsOpen} onOpenChange={(open) => { if (!open) setDetailsOpen(false); }}>
        <DialogContent aria-describedby={undefined} className="w-full max-w-md rounded-bento bg-card p-6">
          <DialogTitle className="text-xl font-bold text-foreground">Paper details</DialogTitle>
          <p className="mt-1.5 text-[13px] text-warm-secondary">
            These fields have no draft. Saving here changes the live paper straight away, and History can undo it.
          </p>
          <label className="mt-3 block text-[13px] font-semibold text-foreground" htmlFor="detail-field">Field</label>
          <select
            id="detail-field"
            value={detailField}
            onChange={(e) => {
              const f = e.target.value as PaperDetailField;
              setDetailField(f);
              setDetailValue(paper ? paperDetailValue(paper, f) : '');
            }}
            className="mt-1 h-11 w-full rounded-xl bg-muted px-3 text-sm"
          >
            {PAPER_DETAIL_FIELDS.map((f) => (
              <option key={f.key} value={f.key}>{f.label}</option>
            ))}
          </select>
          <Textarea value={detailValue} onChange={(e) => setDetailValue(e.target.value)} rows={3} className="mt-3" />
          <div className="mt-4 flex gap-2">
            <button onClick={() => void saveDetails()} disabled={detailSaving} className={cn('disabled:opacity-60', adminPrimaryBtnStyle)}>
              {detailSaving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setDetailsOpen(false)} className={adminSecondaryBtnStyle}>Cancel</button>
          </div>
        </DialogContent>
      </Dialog>
    </BentoStack>
  );
}

// ---------------------------------------------------------------------------

interface QuestionEditorProps {
  row: QuestionRow;
  depth: number;
  snippetUrl: string | null;
  onStatus: (id: string, status: SaveStatus) => void;
  onSaved: (id: string, saved: DraftFields) => void;
  reloadQuestion: (id: string) => Promise<DraftRow | null>;
}

const QuestionEditor = memo(function QuestionEditor({ row, depth, snippetUrl, onStatus, onSaved, reloadQuestion }: QuestionEditorProps) {
  const id = row.question_id;
  const [fields, setFields] = useState(() => toFieldStrings(row));
  const [state, dispatch] = useReducer(autosaveReducer, initialAutosave);
  const [preview, setPreview] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [lostText, setLostText] = useState<string | null>(null);

  // What the server holds. p_body_before is always this body.
  const baselineRef = useRef<DraftFields>({ body: row.body ?? '', display_number: row.display_number, marks: row.marks });
  const fieldsRef = useRef(fields);
  fieldsRef.current = fields;
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    onStatus(id, state.status);
  }, [id, state.status, onStatus]);

  const save = useCallback(async () => {
    const f = fieldsRef.current;
    const marks = parseMarks(f.marks);
    if (!marks.ok) {
      dispatch({ type: 'save_fail', error: 'Marks must be a number, like 4 or 0.5.' });
      return;
    }
    if (f.body.trim() === '') {
      dispatch({ type: 'save_fail', error: 'Question text cannot be blank.' });
      return;
    }
    const next: DraftFields = { body: f.body, display_number: numberForSave(f.number), marks: marks.value };
    dispatch({ type: 'save_start' });
    if (fieldsEqual(next, baselineRef.current)) {
      dispatch({ type: 'save_ok' });
      return;
    }
    try {
      const saved = await adminSaveDraftQuestion(id, next, baselineRef.current.body);
      const stored: DraftFields = saved
        ? { body: saved.body, display_number: saved.display_number, marks: saved.marks != null ? Number(saved.marks) : null }
        : next;
      baselineRef.current = stored;
      onSaved(id, stored);
      dispatch({ type: 'save_ok' });
    } catch (e) {
      const err = e as { code?: string; message?: string };
      if (err?.code === DRAFT_CONFLICT_CODE) {
        dispatch({ type: 'conflict' });
        setLostText(f.body);
        const fresh = await reloadQuestion(id);
        if (fresh) {
          baselineRef.current = { body: fresh.body ?? '', display_number: fresh.display_number, marks: fresh.marks };
          setFields(toFieldStrings(fresh));
        }
        return;
      }
      dispatch({ type: 'save_fail', error: err?.message || 'Could not save. Check your connection.' });
    }
  }, [id, onSaved, reloadQuestion]);

  // Debounced autosave: each edit restarts the timer.
  useEffect(() => {
    if (state.status !== 'dirty') return;
    const t = setTimeout(() => void save(), AUTOSAVE_MS);
    return () => clearTimeout(t);
  }, [state.status, state.editVersion, save]);

  // Leaving the page (or a reload after Verify) with a pending edit still
  // sends it rather than dropping it.
  useEffect(
    () => () => {
      if (stateRef.current.status === 'dirty') void save();
    },
    [save],
  );

  function edit(patch: Partial<typeof fields>) {
    setFields((prev) => ({ ...prev, ...patch }));
    dispatch({ type: 'edit' });
  }

  const flags = row.flag_reasons ?? [];
  const passed = !!row.question_passed;
  const escalated = row.review_bucket === 'escalated' && !passed;
  const statusLabel = saveStatusLabel(state.status);
  const lineCount = fields.body.split('\n').length;
  const showPicture = !!snippetUrl && !imgFailed;
  const inputId = `q-${id}`;

  return (
    <li
      className="rounded-[24px] bg-muted p-3"
      style={depth > 0 ? { marginLeft: `${Math.min(depth, 3) * 12}px` } : undefined}
    >
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-1.5 text-[13px] font-semibold text-warm-secondary">
          No.
          <input
            value={fields.number}
            onChange={(e) => edit({ number: e.target.value })}
            aria-label="Question number"
            className="h-11 w-20 rounded-xl bg-card px-2 text-center text-[15px] font-bold text-foreground outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
        <label className="flex items-center gap-1.5 text-[13px] font-semibold text-warm-secondary">
          Marks
          <input
            value={fields.marks}
            onChange={(e) => edit({ marks: e.target.value })}
            inputMode="decimal"
            aria-label="Marks"
            className="h-11 w-16 rounded-xl bg-card px-2 text-center text-[15px] text-foreground outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-[12px] font-semibold',
            passed ? 'bg-mint text-foreground' : escalated ? 'bg-brand text-foreground' : 'bg-brand-subtle text-foreground',
          )}
        >
          {passed ? 'Checked' : escalated ? 'Sent for help' : 'Flagged'}
        </span>
        <span
          aria-live="polite"
          className={cn(
            'ml-auto text-[12px] font-semibold',
            state.status === 'failed' || state.status === 'conflict' ? 'text-destructive' : 'text-warm-meta',
          )}
        >
          {statusLabel}
        </span>
      </div>

      {!passed && flags.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {flags.map((f) => (
            <span key={f} className="rounded-full bg-card px-2.5 py-1 text-[12px] text-warm-secondary">{kidSentence(f)}</span>
          ))}
        </div>
      ) : null}
      {!passed && row.flag_detail ? <p className="mt-1.5 text-[12px] text-warm-meta">{row.flag_detail}</p> : null}

      <div className={cn('mt-3 grid gap-3', showPicture && 'lg:grid-cols-2')}>
        {showPicture ? (
          <div className="flex max-h-[40vh] items-center justify-center overflow-hidden rounded-xl bg-card lg:max-h-[60vh]">
            <img
              src={snippetUrl as string}
              alt={`The printed question ${row.display_number ?? ''}`.trim()}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="h-full w-full object-contain"
            />
          </div>
        ) : null}

        <div className="min-w-0">
          {preview ? (
            <div className="min-h-[96px] rounded-xl bg-card p-3">
              <MathText text={fields.body} className="text-[15px] leading-relaxed text-foreground" />
            </div>
          ) : (
            <textarea
              id={inputId}
              value={fields.body}
              onChange={(e) => edit({ body: e.target.value })}
              rows={Math.min(Math.max(lineCount + 1, 3), 18)}
              aria-label="Question text"
              spellCheck={false}
              className="w-full rounded-xl bg-card p-3 text-[15px] leading-relaxed text-foreground outline-none focus:ring-2 focus:ring-brand"
            />
          )}
          {row.options && row.options.length > 0 ? (
            <ul className="mt-2 space-y-1 text-[13px] text-warm-secondary">
              {row.options.map((o, i) => (
                <li key={i}>
                  <span className="font-semibold">{o.label ? `(${o.label}) ` : ''}</span>
                  {o.text}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPreview((v) => !v)}
              className="min-h-11 rounded-full bg-card px-4 text-[13px] font-semibold text-warm-secondary"
            >
              {preview ? 'Edit text' : 'Preview'}
            </button>
            {state.status === 'failed' ? (
              <button
                type="button"
                onClick={() => dispatch({ type: 'edit' })}
                className="min-h-11 rounded-full bg-card px-4 text-[13px] font-semibold text-foreground"
              >
                Retry
              </button>
            ) : null}
            {!snippetUrl || imgFailed ? <span className="text-[12px] text-warm-meta">No picture for this question</span> : null}
          </div>
          {state.status === 'failed' && state.error ? <p className="mt-1.5 text-[13px] text-destructive">{state.error}</p> : null}
          {lostText !== null ? (
            <div className="mt-2 rounded-xl bg-brand-subtle p-3">
              <p className="text-[13px] font-semibold text-foreground">
                Someone else changed this question, so their version is loaded above. Your text was not saved:
              </p>
              <textarea
                readOnly
                value={lostText}
                rows={Math.min(Math.max(lostText.split('\n').length, 2), 8)}
                aria-label="Your unsaved text"
                className="mt-2 w-full rounded-xl bg-card p-2 text-[13px] text-foreground"
              />
              <button onClick={() => setLostText(null)} className="mt-1 min-h-11 text-[13px] font-semibold text-warm-secondary">
                Dismiss
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
});
