import { useState } from 'react';
import { History, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminStatusPill } from '@/pages/admin/AdminTable';
import { adminFlagLines, OCR_ONLY_REMINDER } from '@/lib/paper-edit';
import {
  changesFromDraft,
  draftOf,
  writeErrorWords,
  type ApprovalApi,
  type Draft,
  type QuestionState,
  type ReviewRow,
} from '@/lib/admin-approval-shape';
import { QuestionBody } from '@/components/admin/approval/QuestionBody';
import { QuestionVersions } from '@/components/admin/approval/QuestionVersions';

/* One question on the approval review page: drawn the way a visitor sees it,
   with its check state, an inline editor (each save is a new version, logged
   with the admin's name) and its Versions list. Question text in the editor
   is the stored text, byte for byte; nothing here cleans or retypes it. */

const STATE_PILL: Record<QuestionState, { status: 'live' | 'pending' | 'paused'; label: string }> = {
  passed: { status: 'live', label: 'Passed' },
  open: { status: 'pending', label: 'Open' },
  set_aside: { status: 'paused', label: 'Set aside' },
};

export function ReviewQuestionCard({
  row,
  label,
  depth,
  api,
  onSaved,
  now,
}: {
  row: ReviewRow;
  /** The number shown on the badge (display number, else the printed path). */
  label: string | null;
  depth: number;
  api: Pick<ApprovalApi, 'editQuestion' | 'questionHistory' | 'revertQuestion'>;
  onSaved: () => void;
  now?: Date;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Draft>(() => draftOf(row));
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVersions, setShowVersions] = useState(false);
  const [versionsKey, setVersionsKey] = useState(0);
  const pill = STATE_PILL[row.state];
  const why = row.state === 'open' ? adminFlagLines(row.flag_reasons, row.flag_detail) : [];
  const qName = label ? `question ${label}` : 'this question';

  function startEdit() {
    setDraft(draftOf(row));
    setNote('');
    setError(null);
    setEditing(true);
  }

  async function save() {
    const changes = changesFromDraft(row, draft);
    if (changes === 'bad-marks') {
      setError('Marks must be a number, like 2 or 1.5. Leave it empty if the paper prints none.');
      return;
    }
    if (Object.keys(changes).length === 0) {
      setEditing(false);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api.editQuestion(row.id, row.version, changes, note.trim());
      setEditing(false);
      setVersionsKey((k) => k + 1);
      onSaved();
    } catch (e) {
      setError(writeErrorWords(e, 'Your change was not saved. Nothing on the site changed. Try again.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <li
      id={`q-${row.id}`}
      style={depth > 0 ? { marginLeft: `${Math.min(depth, 3) * 16}px` } : undefined}
      className={cn(
        'min-w-0 rounded-[18px] bg-muted p-[16px]',
        depth > 0 && 'border-l-2 border-border pl-3',
        row.state === 'open' && 'ring-2 ring-inset ring-brand',
      )}
    >
      {editing ? (
        <div>
          <p className="mb-2 text-[13px] text-warm-secondary">{OCR_ONLY_REMINDER}</p>
          <div className="grid grid-cols-2 gap-2 sm:max-w-[320px]">
            <label className="flex flex-col gap-1 text-[12px] font-semibold text-warm-secondary">
              Question number
              <input
                value={draft.number}
                onChange={(e) => setDraft({ ...draft, number: e.target.value })}
                className="min-h-10 rounded-xl bg-card px-3 text-[14px] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-brand"
              />
            </label>
            <label className="flex flex-col gap-1 text-[12px] font-semibold text-warm-secondary">
              Marks
              <input
                inputMode="decimal"
                value={draft.marks}
                onChange={(e) => setDraft({ ...draft, marks: e.target.value })}
                className="min-h-10 rounded-xl bg-card px-3 text-[14px] tabular-nums text-foreground outline-none focus-visible:ring-2 focus-visible:ring-brand"
              />
            </label>
          </div>
          <label className="mt-2 flex flex-col gap-1 text-[12px] font-semibold text-warm-secondary">
            Question text
            <textarea
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              rows={Math.min(14, Math.max(4, draft.body.split('\n').length + 1))}
              className="rounded-xl bg-card px-3 py-2 font-mono text-[14px] leading-[1.55] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-brand"
            />
          </label>
          {draft.options.length > 0 ? (
            <fieldset className="mt-2">
              <legend className="mb-1 text-[12px] font-semibold text-warm-secondary">Answer choices</legend>
              <div className="space-y-1.5">
                {draft.options.map((o, i) => (
                  <label key={i} className="flex items-center gap-2">
                    <span className="w-8 shrink-0 text-center text-[13px] font-bold text-warm-label">
                      {o.label ? `(${o.label})` : `${i + 1}.`}
                    </span>
                    <input
                      aria-label={o.label ? `Choice ${o.label}` : `Choice ${i + 1}`}
                      value={o.text}
                      onChange={(e) => {
                        const options = draft.options.map((x, j) => (j === i ? { ...x, text: e.target.value } : x));
                        setDraft({ ...draft, options });
                      }}
                      className="min-h-10 min-w-0 flex-1 rounded-xl bg-card px-3 text-[14px] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    />
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}
          <label className="mt-2 flex flex-col gap-1 text-[12px] font-semibold text-warm-secondary">
            Why (optional, shown in the history)
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={300}
              placeholder="For example: the scan misread 7 as 1"
              className="min-h-10 rounded-xl bg-card px-3 text-[14px] text-foreground outline-none placeholder:text-warm-label focus-visible:ring-2 focus-visible:ring-brand"
            />
          </label>
          {error ? (
            <p role="alert" className="mt-2 text-[13px] text-destructive">
              {error}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => void save()}
              className="inline-flex min-h-11 items-center rounded-full bg-panel px-5 text-[13px] font-bold text-background transition-transform duration-150 active:scale-[0.96] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {saving ? 'Saving...' : 'Save as a new version'}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => setEditing(false)}
              className="inline-flex min-h-11 items-center rounded-full bg-card px-5 text-[13px] font-bold text-warm-secondary"
            >
              Cancel
            </button>
          </div>
          {row.live_bank_question_id ? (
            <p className="mt-2 text-[12px] text-warm-meta">This paper is live, so a saved change shows on the site at once.</p>
          ) : null}
        </div>
      ) : (
        <QuestionBody
          number={label}
          marks={row.marks}
          instructions={row.instructions}
          body={row.body}
          options={row.options}
          figure={row.figure}
          chips={
            <>
              <AdminStatusPill status={pill.status} label={pill.label} />
              <span className="rounded-full bg-card px-2 py-0.5 text-[12px] font-semibold tabular-nums text-warm-secondary shadow-border">
                v{row.version}
              </span>
            </>
          }
        />
      )}

      {why.length ? (
        <ul className="mt-2 space-y-0.5 rounded-[12px] bg-brand-subtle px-3 py-2 text-[13px] text-brand-deep">
          {why.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      ) : null}
      {row.state === 'set_aside' ? (
        <p className="mt-2 text-[13px] text-warm-secondary">
          Set aside. Visitors see a short card saying this question is being checked, with no text.
        </p>
      ) : null}

      {!editing ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={startEdit}
            aria-label={`Edit ${qName}`}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-card px-3.5 text-[13px] font-bold text-foreground transition-transform duration-150 hover:bg-warm-hairline active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden />
            Edit
          </button>
          <button
            type="button"
            aria-expanded={showVersions}
            aria-label={`${showVersions ? 'Hide versions of' : 'Versions of'} ${qName}`}
            onClick={() => setShowVersions((v) => !v)}
            className={cn(
              'inline-flex min-h-10 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-bold transition-transform duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              showVersions ? 'bg-panel text-background' : 'bg-card text-foreground hover:bg-warm-hairline',
            )}
          >
            <History className="h-3.5 w-3.5" aria-hidden />
            Versions
          </button>
        </div>
      ) : null}

      {showVersions ? (
        <div className="mt-3">
          <QuestionVersions
            api={api}
            questionId={row.id}
            questionLabel={label}
            figure={row.figure}
            reloadKey={versionsKey}
            onRestored={() => onSaved()}
            now={now}
          />
        </div>
      ) : null}
    </li>
  );
}
