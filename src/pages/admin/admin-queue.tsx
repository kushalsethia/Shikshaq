import { lazy, Suspense, useState, type ReactNode } from 'react';
import { ChevronDown, Image as ImageIcon } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useAdminGuard, AdminGuardErrorState, adminToast, AdminStatTiles } from '@/components/AdminConsole';
import { AdminHeader, AdminAuditNote, buildAdminNav } from '@/pages/admin/shell';
import { AdminTable, AdminPanelHeader, AdminStatusPill, type AdminTableColumn, type AdminTableRow } from '@/pages/admin/AdminTable';
import { BentoPanel, BentoStack } from '@/components/layout/PageContainer';
import { useAdminSectionCounts } from '@/pages/admin/useAdminSectionCounts';
import { AdminPageIntro } from '@/components/admin/AdminHelp';
import { PaperPageFlip } from '@/components/checker/PaperPageFlip';
import { ReviewQuestionCard } from '@/components/admin/approval/ReviewQuestionCard';
import { cn } from '@/lib/utils';
import { displaySchool } from '@/lib/school-display';
import { kidSentence } from '@/lib/checker-kid-reasons';
import { TIPS } from '@/lib/admin-hints';
import { realAdminQueueApi, type AdminQueueApi, type QueueQuestion } from '@/lib/admin-queue';
import { PREVIEW_TOOLS } from '@/lib/preview-tools';
import { isDummyMode } from '@/lib/dummy-mode';

const DummyAdminQueue = PREVIEW_TOOLS ? lazy(() => import('@/dummy/AdminQueueDummy')) : null;

/* /admin/admin-queue: the questions the checking could not settle. Papers
   first (counts only, so the page opens at once), a paper's questions on
   demand, each with the picture of the page it came from and the reason it
   was flagged in words. Pass, Edit and Set aside are the same controls the
   paper review page uses, so every decision is versioned and logged. */

type Tab = 'waiting' | 'help';

function PagePicture({ q, api, auditPaperId }: { q: QueueQuestion; api: AdminQueueApi; auditPaperId: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'missing'>('idle');
  const path = q.snippet_path ?? q.page_path;
  // No page matched this question (or its picture is gone): show the whole
  // paper as a page-flip instead of asking for a judgement from the words alone.
  const wholePaper = (
    <div className="mb-2">
      <PaperPageFlip paperId={auditPaperId} loadPages={api.paperPages} pictureUrl={api.pictureUrl} questionPage={q.page} />
    </div>
  );
  if (!path || state === 'missing') return wholePaper;
  async function show() {
    setState('loading');
    const u = await api.pictureUrl(path as string);
    if (u) {
      setUrl(u);
      setState('idle');
    } else setState('missing');
  }
  return (
    <div className="mb-2">
      {url ? (
        <img
          src={url}
          alt={q.page ? `Page ${q.page} of the printed paper, where this question is` : 'The printed question'}
          className="max-h-[420px] w-full rounded-xl bg-card object-contain"
        />
      ) : (
        <button
          type="button"
          onClick={() => void show()}
          disabled={state === 'loading'}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-card px-3.5 text-[13px] font-bold text-foreground transition-colors duration-150 hover:bg-warm-hairline disabled:opacity-60"
        >
          <ImageIcon className="h-4 w-4" aria-hidden />
          {state === 'loading' ? 'Loading the picture...' : q.page ? `Show page ${q.page} as printed` : 'Show the printed question'}
        </button>
      )}
    </div>
  );
}

function PaperQuestions({ auditPaperId, api, onChanged }: { auditPaperId: string; api: AdminQueueApi; onChanged: () => void }) {
  const qc = useQueryClient();
  const key = ['admin', 'queue', 'questions', auditPaperId];
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: key, queryFn: () => api.questions(auditPaperId), staleTime: 30_000 });
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2 px-1 py-2" role="status" aria-label="Loading questions">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-[18px] bg-muted" />
        ))}
      </div>
    );
  }
  if (isError) {
    return (
      <div role="alert" className="py-2">
        <p className="text-sm text-foreground">These questions did not load.</p>
        <button type="button" onClick={() => void refetch()} className="tap-44 mt-1 text-sm font-semibold text-brand-blue">Try again</button>
      </div>
    );
  }
  if (!data?.length) return <p className="py-3 text-[14px] text-warm-secondary">Nothing is waiting on this paper any more.</p>;
  return (
    <div className="space-y-3">
      {data.map((q) => (
        <div key={q.row.id}>
          <PagePicture q={q} api={api} auditPaperId={auditPaperId} />
          <ul>
            <ReviewQuestionCard
              row={q.row}
              label={q.row.display_number ?? q.row.number_path}
              depth={0}
              api={api}
              canResolve
              onSaved={() => {
                void qc.invalidateQueries({ queryKey: key });
                onChanged();
              }}
            />
          </ul>
        </div>
      ))}
    </div>
  );
}

export function AdminQueuePage({
  api = realAdminQueueApi,
  dummy = false,
  banner,
}: {
  api?: AdminQueueApi;
  dummy?: boolean;
  banner?: ReactNode;
}) {
  usePageMeta('Admin queue | Shikshaq Admin', 'Questions waiting for an admin decision.');
  const { user, profile } = useAuth();
  const signedIn = dummy ? 'admin@example.com' : user?.email ?? profile?.full_name ?? 'Signed-in admin';
  const guard = useAdminGuard(dummy ? null : user, { redirectOnDenied: !dummy });
  const isAdmin = dummy ? true : guard.isAdmin;
  const checkingAdmin = dummy ? false : guard.checkingAdmin;
  const qc = useQueryClient();
  const sectionCounts = useAdminSectionCounts();
  const [tab, setTab] = useState<Tab>('waiting');
  const [open, setOpen] = useState<string | null>(null);

  const papersQ = useQuery({ queryKey: ['admin', 'queue', 'papers', dummy], queryFn: () => api.papers(), enabled: isAdmin, staleTime: 30_000 });
  const helpQ = useQuery({ queryKey: ['admin', 'queue', 'help', dummy], queryFn: () => api.helpRequests(), enabled: isAdmin, staleTime: 30_000 });

  const papers = papersQ.data ?? [];
  const total = papers.reduce((a, p) => a + p.waiting, 0);
  const help = helpQ.data ?? [];
  const nav = buildAdminNav('admin-queue', { ...sectionCounts, adminQueue: papersQ.data ? total : sectionCounts.adminQueue });
  const refreshCounts = () => {
    void qc.invalidateQueries({ queryKey: ['admin', 'queue', 'papers'] });
    void qc.invalidateQueries({ queryKey: ['admin', 'section-counts'] });
  };

  if (checkingAdmin) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <AdminHeader nav={nav} signedInEmail={signedIn} />
        <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
          <div className="animate-pulse space-y-3 px-[18px]" role="status" aria-label="Loading the queue">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 rounded-2xl bg-muted" />
            ))}
          </div>
        </BentoPanel>
      </BentoStack>
    );
  }
  if (!dummy && guard.error) return <AdminGuardErrorState onRetry={guard.retry} />;
  if (!isAdmin) return null;

  const helpColumns: AdminTableColumn[] = [
    { key: 'school', label: 'School', width: '1.4fr', hint: TIPS['col.school'] },
    { key: 'subject', label: 'Subject', width: '1fr', hint: TIPS['col.subject'] },
    { key: 'number', label: 'Question', width: '0.6fr', hint: 'The question number as printed on the paper.' },
    { key: 'reasons', label: 'Why they asked', width: '1.8fr', hint: 'What the checker said was wrong, in words.' },
  ];
  const helpRows: AdminTableRow[] = help.map((e) => ({
    id: e.question_id,
    cells: [
      e.school ? displaySchool(e.school) : 'Unknown',
      e.subject ?? '-',
      e.display_number ?? '-',
      <span key="r" className="whitespace-normal">{e.flag_reasons.map(kidSentence).join(' ') || '-'}</span>,
    ],
    actions: [
      {
        label: 'Accept as-is',
        tone: 'mint',
        onClick: () => {
          api
            .resolveHelp(e.question_id)
            .then(() => {
              adminToast('Marked resolved');
              void qc.invalidateQueries({ queryKey: ['admin', 'queue', 'help'] });
            })
            .catch(() => adminToast('Failed to resolve this one'));
        },
      },
    ],
  }));

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'waiting', label: 'Waiting for an admin', count: papersQ.data ? total : undefined },
    { key: 'help', label: 'Asked for help', count: helpQ.data ? help.length : undefined },
  ];

  return (
    <BentoStack className="min-h-screen bg-muted">
      <AdminHeader nav={nav} signedInEmail={signedIn} />
      {banner}

      <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
        <div className="mb-3 px-[18px]">
          <AdminPageIntro page="admin-queue" />
        </div>
        <AdminPanelHeader title="Admin queue" meta={papersQ.data ? `${total} questions on ${papers.length} papers` : undefined} />
        <div className="px-[18px]">
          <AdminStatTiles
            stats={[
              { label: 'Questions waiting', value: papersQ.isLoading ? '...' : papersQ.data ? total : '?', hint: TIPS['queue.questions'] },
              { label: 'Papers', value: papersQ.isLoading ? '...' : papersQ.data ? papers.length : '?', hint: TIPS['queue.papers'] },
              { label: 'Asked for help', value: helpQ.isLoading ? '...' : help.length, hint: 'Questions a student checker could not decide and sent to you.' },
            ]}
          />
        </div>

        <div role="tablist" aria-label="Admin queue view" className="mb-4 inline-flex h-11 items-center rounded-full bg-muted p-1 mx-[18px]">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'flex h-9 items-center gap-1.5 rounded-full px-[14px] text-[13px] font-bold transition-colors duration-150',
                tab === t.key ? 'bg-card text-foreground' : 'text-warm-secondary hover:text-foreground',
              )}
            >
              {t.label}
              {typeof t.count === 'number' && t.count > 0 ? (
                <span className="inline-flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-brand px-[5px] text-[11px] font-bold tabular-nums text-foreground">{t.count}</span>
              ) : null}
            </button>
          ))}
        </div>

        {tab === 'waiting' ? (
          papersQ.isLoading ? (
            <div className="animate-pulse space-y-2 px-[18px]" role="status" aria-label="Loading the queue">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 rounded-2xl bg-muted" />
              ))}
            </div>
          ) : papersQ.data === null ? (
            <p className="px-[18px] py-6 text-[14px] text-warm-secondary" role="status">
              The list of waiting questions needs a database update that has not been applied yet. Until then the number on the tab is the only count available.
            </p>
          ) : papers.length === 0 ? (
            <p className="px-[18px] py-8 text-center text-[15px] text-warm-meta">Nothing is waiting for an admin.</p>
          ) : (
            <ul className="space-y-2 px-[18px]">
              {papers.map((p) => {
                const isOpen = open === p.audit_paper_id;
                return (
                  <li key={p.audit_paper_id} className="rounded-[18px] bg-muted">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : p.audit_paper_id)}
                      className="flex w-full min-h-14 items-center gap-3 rounded-[18px] px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-bold text-foreground">{p.title}</span>
                        <span className="block text-[13px] text-warm-secondary">{p.school ? displaySchool(p.school) : 'School not recorded'}</span>
                      </span>
                      <AdminStatusPill status={p.is_live ? 'live' : 'paused'} label={p.is_live ? 'Live' : 'Not live yet'} />
                      <span className="rounded-full bg-brand px-2.5 py-1 text-[12px] font-bold tabular-nums text-foreground">{p.waiting} waiting</span>
                      <ChevronDown className={cn('h-4 w-4 shrink-0 text-warm-secondary transition-transform duration-150', isOpen && 'rotate-180')} aria-hidden />
                    </button>
                    {isOpen ? (
                      <div className="px-3 pb-3">
                        <PaperQuestions auditPaperId={p.audit_paper_id} api={api} onChanged={refreshCounts} />
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )
        ) : helpQ.isLoading ? (
          <div className="animate-pulse space-y-3 px-[18px]">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 rounded-2xl bg-muted" />
            ))}
          </div>
        ) : helpRows.length === 0 ? (
          <p className="px-[18px] py-8 text-center text-[15px] text-warm-meta">No checker has asked for help right now.</p>
        ) : (
          <AdminTable columns={helpColumns} rows={helpRows} />
        )}
      </BentoPanel>

      <AdminAuditNote />
    </BentoStack>
  );
}

export default function AdminQueue() {
  if (DummyAdminQueue && isDummyMode()) {
    return (
      <Suspense fallback={null}>
        <DummyAdminQueue />
      </Suspense>
    );
  }
  return <AdminQueuePage />;
}
