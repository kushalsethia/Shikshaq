import { supabase } from '@/integrations/supabase/client';
import { paperTitleFrom, writeErrorWords } from '@/lib/admin-approval-shape';

/* "Update live paper": the admin button that pushes a live paper's reviewed
   changes (updated text, added rows, hidden rows) to the site. Two RPCs, both
   admin-only SECURITY DEFINER (migration 20261004100000):
     admin_live_paper_pending()          what is waiting, per paper
     admin_update_live_paper(uuid)       do it (refuses while questions are open)
   The browser never writes a table directly. */

export const LIVE_UPDATE_RPC = {
  pending: 'admin_live_paper_pending',
  update: 'admin_update_live_paper',
} as const;

export interface LivePendingRow {
  audit_paper_id: string;
  live_bank_paper_id: string;
  title: string;
  school: string | null;
  updated: number;
  added: number;
  hidden: number;
  open: number;
}

export interface LiveUpdateResult {
  updated: number;
  added: number;
  hidden: number;
}

export interface LiveUpdateApi {
  pending(): Promise<LivePendingRow[]>;
  update(auditPaperId: string): Promise<LiveUpdateResult>;
}

const n = (v: unknown): number => {
  const x = typeof v === 'string' ? Number(v) : v;
  return typeof x === 'number' && Number.isFinite(x) ? x : 0;
};
const s = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v : null);

export function normalisePending(raw: unknown): LivePendingRow | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const id = s(r.audit_paper_id);
  if (!id) return null;
  return {
    audit_paper_id: id,
    live_bank_paper_id: s(r.live_bank_paper_id) ?? '',
    title: paperTitleFrom({ cls: s(r.cls), subject: s(r.subject), year: s(r.year) }),
    school: s(r.school),
    updated: n(r.questions_updated),
    added: n(r.questions_added),
    hidden: n(r.questions_hidden),
    open: n(r.open_questions),
  };
}

export function normaliseResult(raw: unknown): LiveUpdateResult {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return { updated: n(r.updated), added: n(r.added), hidden: n(r.hidden) };
}

/** A paper can be pushed once no question is still open. */
export const canUpdate = (r: LivePendingRow): boolean => r.open === 0;

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

/** "This changes the live paper: 3 questions updated, 2 added, 1 hidden. Logged and reversible." */
export function confirmWords(r: Pick<LivePendingRow, 'updated' | 'added' | 'hidden'>): string {
  return `This changes the live paper: ${plural(r.updated, 'question', 'questions')} updated, ${r.added} added, ${r.hidden} hidden. Logged and reversible.`;
}

export function doneWords(r: LiveUpdateResult): string {
  return `Live paper updated: ${plural(r.updated, 'question', 'questions')} updated, ${r.added} added, ${r.hidden} hidden.`;
}

export function updateErrorWords(e: unknown): string {
  return writeErrorWords(e, 'The live paper was not changed. Check your internet and try again.');
}

export const realLiveUpdateApi: LiveUpdateApi = {
  async pending() {
    const { data, error } = await supabase.rpc(LIVE_UPDATE_RPC.pending as never);
    if (error) throw error;
    return (Array.isArray(data) ? data : []).map(normalisePending).filter((r): r is LivePendingRow => r !== null);
  },
  async update(auditPaperId) {
    const { data, error } = await supabase.rpc(LIVE_UPDATE_RPC.update as never, { p_audit_paper_id: auditPaperId } as never);
    if (error) throw error;
    return normaliseResult(data);
  },
};
