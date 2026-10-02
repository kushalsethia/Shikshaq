import { supabase } from '@/integrations/supabase/client';

/**
 * Client wrapper for the admin Activity page and the per-question version
 * history (20261002090000_checker_versions_and_activity.sql, plus
 * admin_revert_to_version from 20261001090000_content_versions_lock.sql).
 * Same `as never` escape hatch as checker-api.ts: these RPCs predate the
 * generated types.
 *
 * Nothing here carries a name or an email: the feed returns actor ids and
 * labels only, and version snapshots never include answer_key.
 */

export type ActivityScope = 'people' | 'ai' | 'all';

export type VersionedTable = 'bank_questions' | 'bank_papers' | 'audit_questions' | 'audit_papers';

export interface ActivityRow {
  at: string;
  /** 'log' (audit_review_log), 'version' (content_versions), 'check' (content_checks). */
  stream: 'log' | 'version' | 'check' | string;
  event_id: string;
  actor_user_id: string | null;
  /** 'ai:sonnet', 'system', 'pipeline', 'haiku_pdf' ... only when there is no user id. */
  actor_label: string | null;
  actor_kind: 'checker' | 'admin' | 'ai' | 'pipeline' | 'system' | 'person' | string;
  action: string;
  table_name: VersionedTable | string | null;
  row_id: string | null;
  paper_id: string | null;
  question_id: string | null;
  version: number | null;
  detail: string | null;
}

export interface VersionRow {
  version: number;
  op: 'backfill' | 'insert' | 'update' | 'delete' | 'revert' | string;
  content_sha256: string;
  /** The content fields of that version. Never includes answer_key. */
  snapshot: Record<string, unknown>;
  has_answer_key: boolean;
  actor: string | null;
  actor_user_id: string | null;
  source: string | null;
  reason: string | null;
  created_at: string;
  is_current: boolean;
}

function rows<T>(data: unknown): T[] {
  return ((data ?? []) as unknown) as T[];
}

export async function adminActivityFeed(scope: ActivityScope, before: string | null, limit = 200): Promise<ActivityRow[]> {
  const { data, error } = await supabase.rpc('admin_activity_feed' as never, {
    p_limit: limit,
    p_before: before,
    p_scope: scope,
  } as never);
  if (error) throw error;
  return rows<ActivityRow>(data).map((r) => ({ ...r, version: r.version == null ? null : Number(r.version) }));
}

export async function adminVersionHistory(table: VersionedTable, rowId: string): Promise<VersionRow[]> {
  const { data, error } = await supabase.rpc('admin_version_history' as never, {
    p_table: table,
    p_row_id: rowId,
  } as never);
  if (error) throw error;
  return rows<VersionRow>(data).map((r) => ({ ...r, version: Number(r.version), snapshot: r.snapshot ?? {} }));
}

/** Writes the chosen version back as a NEW version; history is never rewritten. Returns the new version. */
export async function adminRevertToVersion(
  table: VersionedTable,
  rowId: string,
  version: number,
  reason: string | null,
): Promise<number | null> {
  const { data, error } = await supabase.rpc('admin_revert_to_version' as never, {
    p_table: table,
    p_row_id: rowId,
    p_version: version,
    p_reason: reason?.trim() || null,
  } as never);
  if (error) throw error;
  return data == null ? null : Number(data);
}

export interface ActivityApi {
  feed: typeof adminActivityFeed;
  versionHistory: typeof adminVersionHistory;
  revert: typeof adminRevertToVersion;
}

export const realActivityApi: ActivityApi = {
  feed: adminActivityFeed,
  versionHistory: adminVersionHistory,
  revert: adminRevertToVersion,
};
