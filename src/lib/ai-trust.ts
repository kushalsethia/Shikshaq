/**
 * The "AI trust" meter on the HOD view (20261007120000_ai_trust_levels.sql).
 *
 * Everything the AI settles goes to a person until a confidence level has
 * earned the bar: 97% passed with no edit, over at least 200 checks. A
 * question the AI marks "probably has an issue" always goes to a person.
 * This file shapes ai_trust_meter() rows and words the numbers; it is pure.
 *
 * Checkers never see the AI's confidence (it would bias them), so nothing
 * here is imported by the checker screen.
 */

export type TrustLevel = 'high' | 'medium' | 'low';
export type TrustDecision = 'pass' | 'fix';

export const TRUST_LEVELS: TrustLevel[] = ['high', 'medium', 'low'];
export const TRUST_DECISIONS: TrustDecision[] = ['pass', 'fix'];

export const LEVEL_LABEL: Record<TrustLevel, string> = {
  high: 'High confidence',
  medium: 'Medium confidence',
  low: 'Low confidence',
};

export const DECISION_LABEL: Record<TrustDecision, string> = {
  pass: 'AI said it was right',
  fix: 'AI changed the words',
};

export const TRUST_EXPLAINER =
  'Everything the AI settles goes to a person to check. A level stops going to people only after it earns 97% over at least 200 checks, and an admin then switches it on. Even then, 1 in 20 is still checked. A question the AI says probably has an issue always goes to a person.';

export interface TrustRow {
  level: TrustLevel;
  decision: TrustDecision;
  /** null = all subjects. */
  subject: string | null;
  checked: number;
  as_is: number;
  /** 0 to 1, or null when nothing has been checked. */
  rate: number | null;
  waiting: number;
  trusted: boolean;
  eligible: boolean;
  auto_off_at: string | null;
  auto_off_reason: string | null;
  min_rate: number;
  min_checked: number;
  spot_check_every: number;
}

const num = (v: unknown, fallback = 0): number => {
  const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN;
  return Number.isFinite(n) ? n : fallback;
};
const str = (v: unknown): string | null => (typeof v === 'string' && v.trim() !== '' ? v : null);

export function normaliseTrustRows(raw: unknown): TrustRow[] {
  const out: TrustRow[] = [];
  for (const x of Array.isArray(raw) ? raw : []) {
    const r = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>;
    const level = r.level;
    const decision = r.decision;
    if (!TRUST_LEVELS.includes(level as TrustLevel) || !TRUST_DECISIONS.includes(decision as TrustDecision)) continue;
    out.push({
      level: level as TrustLevel,
      decision: decision as TrustDecision,
      subject: str(r.subject),
      checked: num(r.checked),
      as_is: num(r.as_is),
      rate: r.rate === null || r.rate === undefined || r.rate === '' ? null : num(r.rate),
      waiting: num(r.waiting),
      trusted: r.trusted === true,
      eligible: r.eligible === true,
      auto_off_at: str(r.auto_off_at),
      auto_off_reason: str(r.auto_off_reason),
      min_rate: num(r.min_rate, 0.97),
      min_checked: num(r.min_checked, 200),
      spot_check_every: num(r.spot_check_every, 20),
    });
  }
  return out;
}

/** "97%", "96.4%", or "No checks yet". */
export function formatRate(rate: number | null): string {
  if (rate === null) return 'No checks yet';
  const pct = Math.round(rate * 1000) / 10;
  return `${Number.isInteger(pct) ? pct.toFixed(0) : pct.toFixed(1)}%`;
}

/** "120 of 200 checks needed"; once enough have been done, "250 checks done (200 needed)". */
export function checksNeeded(row: Pick<TrustRow, 'checked' | 'min_checked'>): string {
  if (row.checked >= row.min_checked) return `${row.checked} checks done (${row.min_checked} needed)`;
  return `${row.checked} of ${row.min_checked} checks needed`;
}

/** Where the rate sits, 0 to 100, and where the bar is, for the progress track. */
export function barPosition(row: Pick<TrustRow, 'rate' | 'min_rate'>): { fill: number; bar: number } {
  const clamp = (n: number) => Math.min(100, Math.max(0, n));
  return { fill: clamp(Math.round((row.rate ?? 0) * 100)), bar: clamp(Math.round(row.min_rate * 100)) };
}

export type TrustStatusKind = 'people' | 'trusted' | 'auto_off';

export function trustStatus(row: Pick<TrustRow, 'trusted' | 'auto_off_at' | 'auto_off_reason' | 'spot_check_every'>): {
  kind: TrustStatusKind;
  label: string;
} {
  if (row.trusted) return { kind: 'trusted', label: `Trusted, 1 in ${row.spot_check_every} still checked` };
  if (row.auto_off_at) {
    return {
      kind: 'auto_off',
      label: row.auto_off_reason ? `Switched off automatically: ${row.auto_off_reason}` : 'Switched off automatically',
    };
  }
  return { kind: 'people', label: 'Checked by people' };
}

/** What the admin button does and whether it may be pressed (with the reason when it may not). */
export function switchState(
  row: Pick<TrustRow, 'trusted' | 'eligible' | 'checked' | 'rate' | 'min_checked' | 'min_rate'>,
): { action: 'trust' | 'stop'; label: string; disabled: boolean; reason: string | null } {
  if (row.trusted) return { action: 'stop', label: 'Stop trusting', disabled: false, reason: null };
  if (row.eligible) return { action: 'trust', label: 'Trust', disabled: false, reason: null };
  return {
    action: 'trust',
    label: 'Trust',
    disabled: true,
    reason: `Not earned yet: needs ${row.min_checked} checks at ${Math.round(row.min_rate * 100)}% right. It has ${row.checked} checks at ${formatRate(row.rate)}.`,
  };
}

export interface TrustCell {
  level: TrustLevel;
  decision: TrustDecision;
  /** The all-subjects row, or null when the server sent none. */
  total: TrustRow | null;
  /** One row per subject, most checked first. */
  subjects: TrustRow[];
}

/** The 3 by 2 grid, High to Low down the side, "AI said it was right" then "AI changed the words" across. */
export function buildTrustGrid(rows: TrustRow[]): TrustCell[][] {
  return TRUST_LEVELS.map((level) =>
    TRUST_DECISIONS.map((decision) => {
      const mine = rows.filter((r) => r.level === level && r.decision === decision);
      return {
        level,
        decision,
        total: mine.find((r) => r.subject === null) ?? null,
        subjects: mine.filter((r) => r.subject !== null).sort((a, b) => b.checked - a.checked || (a.subject ?? '').localeCompare(b.subject ?? '')),
      };
    }),
  );
}
