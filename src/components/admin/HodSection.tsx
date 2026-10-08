import { useCallback, useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { toast as sonnerToast } from 'sonner';
import { ChevronDown, Search, UserPlus } from 'lucide-react';
import { AdminPanelHeader, AdminTable, type AdminTableColumn, type AdminTableRow } from '@/pages/admin/AdminTable';
import { useConfirm } from '@/components/ui/use-confirm';
import { addHodSteps, HOD_NOTE } from '@/lib/checker-onboarding';
import { looksLikeEmail } from '@/lib/email-shape';
import type { CheckerAdminApi } from '@/lib/checker-admin-api';
import type { UserSearchRow } from '@/lib/checker-api';
import type { HodAdminApi, HodRow } from '@/lib/hod-api';

/* The HODs section of /admin/checkers: who leads the checkers. Search for a
   person, press Make HOD, and they get the /hod screen. Admins always have it.
   Same flow and look as the checkers list above it, with its own short guide. */

function HodGuide() {
  const origin = typeof window === 'undefined' ? '' : window.location.origin;
  return (
    <details className="group mx-[18px] mb-4 rounded-2xl bg-muted" data-testid="add-hod-guide">
      <summary className="tap-44 flex cursor-pointer list-none items-center justify-between gap-2 rounded-2xl px-4 py-2.5 text-[14px] font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand [&::-webkit-details-marker]:hidden">
        How to add an HOD
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-150 group-open:rotate-180" aria-hidden />
      </summary>
      <div className="px-4 pb-3">
        <ol className="list-decimal space-y-1.5 pl-5 text-[14px] leading-snug text-foreground">
          {addHodSteps(origin).map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <p className="mt-3 text-pretty text-[13px] leading-snug text-warm-secondary">{HOD_NOTE}</p>
      </div>
    </details>
  );
}

export function HodSection({ hodApi, searchUsers }: { hodApi: HodAdminApi; searchUsers: CheckerAdminApi['searchUsers'] }) {
  const [hods, setHods] = useState<HodRow[] | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchRow[]>([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { confirm, confirmDialog } = useConfirm();

  const load = useCallback(async () => {
    try {
      setHods(await hodApi.listHods());
    } catch {
      setHods([]);
      sonnerToast.error('Failed to load the HOD list');
    }
  }, [hodApi]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    let cancelled = false;
    setSearching(true);
    const timer = setTimeout(() => {
      searchUsers(q)
        .then((r) => {
          if (!cancelled) setResults(r);
        })
        .catch(() => {
          if (!cancelled) setError('The search did not work. Try again.');
        })
        .finally(() => {
          if (!cancelled) setSearching(false);
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, searchUsers]);

  const active = (hods ?? []).filter((h) => h.active);

  async function add(email: string, key: string) {
    const trimmed = email.trim();
    if (!looksLikeEmail(trimmed)) {
      setError('That person has no email on file. Ask them to update their profile.');
      return;
    }
    setError(null);
    setAdding(key);
    try {
      await hodApi.addHod(trimmed);
      setQuery('');
      setResults([]);
      sonnerToast.success(`${trimmed} is now an HOD`);
      await load();
    } catch (e) {
      setError(
        e instanceof Error && /no account|not found|sign up/i.test(e.message)
          ? 'No Shikshaq account has that email yet. They may not have signed up, or they used a different email.'
          : 'Could not make that person an HOD. Check the email and try again.',
      );
    } finally {
      setAdding(null);
    }
  }

  async function remove(h: HodRow) {
    const who = h.name ?? h.email ?? 'this person';
    const ok = await confirm({
      title: `Remove ${who} as an HOD?`,
      description: 'They will no longer be able to open the HOD desk. Decisions they already made stay as they are.',
      confirmLabel: 'Remove HOD',
    });
    if (!ok) return;
    try {
      await hodApi.removeHod(h.user_id);
      sonnerToast.success(`${who} removed as an HOD`);
      await load();
    } catch {
      sonnerToast.error('Failed to remove that HOD');
    }
  }

  const columns: AdminTableColumn[] = [
    { key: 'who', label: 'HOD', width: '1.6fr', hint: 'A person who leads the verifiers.' },
    { key: 'added', label: 'Added', width: '1fr', hint: 'When they became an HOD.' },
  ];
  const tableRows: AdminTableRow[] = active.map((h) => ({
    id: h.user_id,
    cells: [
      <div key="who" className="min-w-0">
        <p className="truncate font-semibold text-foreground">{h.name || h.email || 'Unnamed account'}</p>
        {h.name && h.email ? <p className="truncate text-[12px] text-warm-label">{h.email}</p> : null}
      </div>,
      <span key="added" className="text-warm-meta">
        {h.granted_at ? formatDistanceToNow(new Date(h.granted_at), { addSuffix: true }) : '-'}
      </span>,
    ],
    actions: [{ label: 'Remove', tone: 'destructive', onClick: () => remove(h) }],
  }));

  return (
    <section aria-labelledby="hods-heading" className="mt-8" data-testid="hod-section">
      <h2 id="hods-heading" className="sr-only">
        HODs
      </h2>
      <HodGuide />
      <AdminPanelHeader title="HODs" meta={hods ? `${active.length} ${active.length === 1 ? 'HOD' : 'HODs'}` : undefined} />
      <div className="mb-4 px-[18px]">
        <label className="flex max-w-md flex-col gap-1">
          <span className="text-[12px] font-semibold text-warm-secondary">Find a person to make an HOD</span>
          <span className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-label" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setError(null);
              }}
              placeholder="Search by name or email"
              aria-label="Search by name or email to make an HOD"
              className="h-11 w-full rounded-full bg-muted pl-10 pr-4 text-sm text-foreground placeholder:text-warm-label outline-none transition-shadow duration-150 focus-visible:ring-2 focus-visible:ring-brand"
            />
          </span>
        </label>
        {query.trim().length >= 2 ? (
          <ul className="mt-2 max-w-md space-y-1.5" aria-label="People found for HOD">
            {searching ? (
              <li className="text-[13px] text-warm-meta">Searching...</li>
            ) : results.length === 0 ? (
              <li className="rounded-xl bg-muted px-3 py-2.5 text-[13px] text-warm-secondary">
                No account matches that.{' '}
                {looksLikeEmail(query.trim()) ? (
                  <button
                    type="button"
                    onClick={() => void add(query, 'typed')}
                    disabled={adding !== null}
                    className="font-bold text-brand-blue disabled:opacity-60"
                  >
                    {adding === 'typed' ? 'Adding...' : `Try adding ${query.trim()} anyway`}
                  </button>
                ) : (
                  'Only people who have signed up on Shikshaq can be added.'
                )}
              </li>
            ) : (
              results.map((u) => {
                const already = active.some((h) => h.user_id === u.user_id);
                return (
                  <li key={u.user_id} className="flex items-center justify-between gap-3 rounded-xl bg-muted px-3 py-2">
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-semibold text-foreground">{u.full_name || 'Unnamed account'}</span>
                      <span className="block truncate text-[12px] text-warm-meta">{u.email ?? 'No email on file'}</span>
                    </span>
                    {already ? (
                      <span className="shrink-0 text-[12px] font-semibold text-warm-secondary">Already an HOD</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void add(u.email ?? '', u.user_id)}
                        disabled={adding !== null}
                        className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-brand px-4 text-sm font-semibold text-foreground transition-transform duration-150 active:scale-[0.97] disabled:opacity-50"
                      >
                        <UserPlus className="h-4 w-4" aria-hidden />
                        {adding === u.user_id ? 'Adding...' : 'Make HOD'}
                      </button>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        ) : null}
      </div>
      {error ? (
        <p role="alert" className="mb-3 px-[18px] text-[13px] text-destructive">
          {error}
        </p>
      ) : null}
      {hods === null ? (
        <div className="h-14 animate-pulse rounded-2xl bg-muted" aria-label="Loading the HODs" role="status" />
      ) : active.length === 0 ? (
        <div className="rounded-2xl bg-muted p-8 text-center">
          <p className="text-sm text-warm-label">No HOD yet. Admins can still open the HOD desk. Search above to add one.</p>
        </div>
      ) : (
        <AdminTable columns={columns} rows={tableRows} />
      )}
      {confirmDialog}
    </section>
  );
}
