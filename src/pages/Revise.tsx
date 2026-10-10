import { lazy, Suspense, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { BentoPanel, BentoStack } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { EmptyNote, LoadError } from '@/components/hod/HodShared';
import { GameView } from '@/components/revise/GameView';
import { usePageMeta } from '@/hooks/usePageMeta';
import { GAME_PAGES_META } from '@/content/game-pages-meta';
import { GAME_KEYS, realGameQuestionsApi, type GameQuestionsApi } from '@/lib/game-questions/api';
import { checkClass } from '@/lib/game-questions/details';
import type { BankQuestion } from '@/lib/game-questions/rows';
import { GAME_TYPES, makeGame, seedOf, type Game, type GameType, type Item } from '@/lib/games';
import { PREVIEW_TOOLS } from '@/lib/preview-tools';
import { isDummyMode } from '@/lib/dummy-mode';
import { cn } from '@/lib/utils';

/* /revise: students pick their class, subject, chapter and the topics they studied, and play a short puzzle made from
   the approved questions (game_bank, which anyone can read). The puzzles are made on the device by src/lib/games, with
   no AI, and every one is checked before it is shown. Every game the chosen topics allow is offered; one that can't be
   made is greyed out. A signed-in student whose profile has a class starts on that class.

   In a test build with dummy mode on, the same page runs against an in-memory fake (src/dummy/ReviseDummy.tsx). */

const DummyRevise = PREVIEW_TOOLS ? lazy(() => import('@/dummy/ReviseDummy')) : null;

export default function Revise() {
  if (DummyRevise && isDummyMode()) {
    return (
      <Suspense fallback={null}>
        <DummyRevise />
      </Suspense>
    );
  }
  return <RevisePage api={realGameQuestionsApi} />;
}

const plural = (n: number, one: string) => `${n} ${one}${n === 1 ? '' : 's'}`;
const NAMES: Record<GameType, string> = { crossword: 'Crossword', wordsearch: 'Word search', matching: 'Matching', fill: 'Fill in the blank' };

interface Topic {
  key: string;
  no: number | null;
  name: string;
  count: number;
}
interface Chapter {
  id: string;
  cls: number | null;
  subject: string;
  no: number | null;
  name: string;
  topics: Topic[];
  questions: BankQuestion[];
}

const topicKey = (q: BankQuestion) => q.topic_id ?? `${q.chapter_id}|${q.topic}`;

/** Approved questions grouped into chapters and their topics, by class, subject and chapter number. */
function chaptersOf(questions: BankQuestion[]): Chapter[] {
  const byChapter = new Map<string, BankQuestion[]>();
  for (const q of questions) if (q.chapter_id) byChapter.set(q.chapter_id, [...(byChapter.get(q.chapter_id) ?? []), q]);
  return [...byChapter]
    .map(([id, qs]) => {
      const topics = new Map<string, Topic>();
      for (const q of qs) {
        const k = topicKey(q);
        const t = topics.get(k) ?? { key: k, no: q.topic_no, name: q.topic || 'Other questions', count: 0 };
        t.count++;
        topics.set(k, t);
      }
      const q0 = qs[0];
      return {
        id,
        questions: qs,
        cls: q0.class,
        subject: q0.subject,
        no: q0.chapter_no,
        name: q0.chapter,
        topics: [...topics.values()].sort((a, b) => (a.no ?? 99) - (b.no ?? 99)),
      };
    })
    .sort((a, b) => (a.cls ?? 0) - (b.cls ?? 0) || a.subject.localeCompare(b.subject) || (a.no ?? 0) - (b.no ?? 0));
}

const PILL =
  'tap-44 inline-flex min-h-10 items-center rounded-full px-3.5 text-[14px] font-bold transition-[background-color,color,transform] duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100';
const pill = (on: boolean) => cn(PILL, on ? 'bg-panel text-background' : 'bg-muted text-warm-prose hover:text-foreground');

export function RevisePage({ api, dummy = false, banner, dummyGrade }: { api: GameQuestionsApi; dummy?: boolean; banner?: ReactNode; dummyGrade?: string }) {
  usePageMeta(GAME_PAGES_META.revise.title, GAME_PAGES_META.revise.description);
  const { user } = useAuth();
  const scope = dummy ? 'dummy' : 'live';
  const bank = useQuery({ queryKey: GAME_KEYS.bank(scope), queryFn: () => api.bank(), staleTime: 5 * 60 * 1000 });
  // a signed-in student's class, from their profile: the page starts there
  const gradeQ = useQuery({
    queryKey: ['revise', 'grade', user?.id ?? null],
    enabled: !dummy && Boolean(user),
    staleTime: 30 * 60 * 1000,
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('grade').eq('id', user!.id).maybeSingle();
      return (data?.grade as string | null) ?? null;
    },
  });
  const myClass = checkClass((dummy ? dummyGrade : gradeQ.data) ?? '').value;

  const chapters = useMemo(() => chaptersOf(bank.data ?? []), [bank.data]);
  const [pick, setPickState] = useState({ chapter: '', topics: [] as string[] });
  const [round, setRound] = useState(0);
  const [want, setWant] = useState<GameType | null>(null);
  const setPick = (p: { chapter: string; topics: string[] }) => {
    setPickState(p);
    setRound(0);
  };

  const chapter = chapters.find((c) => c.id === pick.chapter) ?? chapters.find((c) => c.cls === myClass) ?? chapters[0];
  const classes = [...new Set(chapters.map((c) => c.cls))];
  const subjects = [...new Set(chapters.filter((c) => c.cls === chapter?.cls).map((c) => c.subject))];
  const inSubject = chapters.filter((c) => c.cls === chapter?.cls && c.subject === chapter?.subject);
  const open = (c: Chapter | undefined) => {
    if (c) setPick({ chapter: c.id, topics: [] });
  };
  const known = new Set(chapter?.topics.map((t) => t.key));
  const chosen = pick.chapter === chapter?.id && pick.topics.some((t) => known.has(t)) ? pick.topics.filter((t) => known.has(t)) : [...known];
  const chosenKey = chosen.join('|');
  const items: Item[] = useMemo(
    () => (chapter?.questions ?? []).filter((q) => chosen.includes(topicKey(q))).map((q) => ({ id: q.id, question: q.question, answer: q.answer })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chapter, chosenKey],
  );
  const seed = seedOf(`${chapter?.id}|${chosen.join(',')}|${round}`);
  // every game these questions can make (each one already checked), so the student can switch between them
  const games = useMemo(() => {
    const out: Partial<Record<GameType, Game>> = {};
    for (const t of GAME_TYPES) {
      const g = makeGame(t, items, seed);
      if (g) out[t] = g;
    }
    return out;
  }, [items, seed]);
  const type = want && games[want] ? want : GAME_TYPES.find((t) => games[t]);
  const game = type && games[type];

  const toggle = (k: string) => {
    const next = chosen.includes(k) ? chosen.filter((t) => t !== k) : [...chosen, k];
    if (next.length) setPick({ chapter: chapter!.id, topics: next });
  };

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content">
        <BentoStack className="mx-auto w-full max-w-6xl">
          <BentoPanel fill="card" edge="top">
            {banner}
            <span className="text-[12px] font-bold uppercase tracking-[0.04em] text-brand-blue">For students</span>
            <h1 className="mt-1.5 text-balance font-display text-[32px] font-normal leading-[1.06] tracking-[-0.045em] text-foreground lg:text-[40px]">
              <span className="font-extrabold text-brand-blue">Revise</span> with a puzzle
            </h1>
            <p className="mt-3 max-w-prose text-pretty text-[15px] leading-[1.6] text-warm-prose">
              Pick the topics you studied, and play a short puzzle made from them: a crossword, a word search, matching or fill in the blank. Teachers
              wrote every question and an HOD checked it.
            </p>
          </BentoPanel>

          {!chapter ? (
            <BentoPanel fill="card" aria-live="polite">
              {bank.isError ? (
                <LoadError what="The questions" onRetry={() => void bank.refetch()} />
              ) : bank.isLoading ? (
                <div className="animate-pulse space-y-3" role="status" aria-label="Loading the questions">
                  <div className="h-10 w-2/3 rounded-full bg-muted" />
                  <div className="grid gap-2 sm:grid-cols-3">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="h-24 rounded-[18px] bg-muted" />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <EmptyNote>
                    <b className="text-foreground">There are no puzzles yet.</b> They appear here once teachers write questions and an HOD approves them.
                  </EmptyNote>
                  <div className="flex justify-center">
                    <Link to="/questions" className={pill(false)}>
                      Teachers: write questions
                    </Link>
                  </div>
                </div>
              )}
            </BentoPanel>
          ) : (
            <>
              <BentoPanel fill="card" className="space-y-4">
                <h2 className="text-balance text-[18px] font-bold text-foreground">What are you revising?</h2>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[12px] font-bold uppercase tracking-[0.04em] text-warm-label" id="revise-class-l">
                      Class
                    </span>
                    <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-labelledby="revise-class-l">
                      {classes.map((n) => (
                        <button key={n} type="button" role="radio" aria-checked={n === chapter.cls} className={pill(n === chapter.cls)} onClick={() => open(chapters.find((c) => c.cls === n))}>
                          Class {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[12px] font-bold uppercase tracking-[0.04em] text-warm-label" id="revise-subject-l">
                      Subject
                    </span>
                    <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-labelledby="revise-subject-l">
                      {subjects.map((s) => (
                        <button
                          key={s}
                          type="button"
                          role="radio"
                          aria-checked={s === chapter.subject}
                          className={pill(s === chapter.subject)}
                          onClick={() => open(chapters.find((c) => c.cls === chapter.cls && c.subject === s))}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[12px] font-bold uppercase tracking-[0.04em] text-warm-label" id="revise-chapter-l">
                    Chapter
                  </span>
                  <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3" aria-labelledby="revise-chapter-l">
                    {inSubject.map((c, i) => (
                      <li key={c.id} className="animate-fade-slide-up [animation-duration:280ms]" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                        <button
                          type="button"
                          aria-pressed={c.id === chapter.id}
                          onClick={() => open(c)}
                          className={cn(
                            'flex h-full min-h-[92px] w-full flex-col items-start gap-0.5 rounded-[18px] px-4 py-3 text-left transition-[background-color,box-shadow,transform] duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                            c.id === chapter.id
                              ? 'bg-brand-blue-subtle shadow-[inset_0_0_0_2px_hsl(var(--brand-blue))]'
                              : 'bg-muted hover:shadow-[inset_0_0_0_1px_hsl(var(--brand-blue))]',
                          )}
                        >
                          <span className="text-[12px] font-bold uppercase tracking-[0.04em] text-brand-blue-deep">Chapter {c.no}</span>
                          <b className="text-balance text-[15px] text-foreground">{c.name}</b>
                          <span className="text-[12px] tabular-nums text-warm-secondary">
                            {plural(c.topics.length, 'topic')} · {plural(c.questions.length, 'question')}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <fieldset>
                  <legend className="text-[14px] font-semibold text-foreground">Which topics of Chapter {chapter.no} did you study?</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {chapter.topics.map((t) => {
                      const on = chosen.includes(t.key);
                      return (
                        <label
                          key={t.key}
                          className={cn(
                            'tap-44 inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full px-3.5 text-[14px] transition-[background-color,color] duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand',
                            on ? 'bg-panel text-background' : 'bg-muted text-warm-prose hover:text-foreground',
                          )}
                        >
                          <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(t.key)} />
                          {t.no !== null ? <b className="tabular-nums">{t.no}</b> : null}
                          {t.name}
                          <span className={cn('tabular-nums', on ? 'text-background/70' : 'text-warm-label')}>({t.count})</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </BentoPanel>

              <BentoPanel fill="card" aria-label="Puzzle" className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div role="tablist" aria-label="Game" className="flex max-w-full flex-wrap gap-1 rounded-[20px] bg-muted p-1 sm:rounded-full">
                    {GAME_TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        role="tab"
                        aria-selected={t === type}
                        disabled={!games[t]}
                        title={games[t] ? undefined : "These topics don't have enough suitable answers for this game"}
                        onClick={() => setWant(t)}
                        className={cn(
                          'flex h-10 items-center rounded-full px-3.5 text-[13px] font-bold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-40',
                          t === type ? 'bg-card text-foreground' : 'text-warm-secondary hover:text-foreground',
                        )}
                      >
                        {NAMES[t]}
                      </button>
                    ))}
                  </div>
                  <Button type="button" variant="muted" size={44} onClick={() => setRound((r) => r + 1)}>
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    New puzzle
                  </Button>
                </div>
                {game ? (
                  <div key={`${type}|${seed}`} className="animate-in fade-in-0 duration-200">
                    <GameView game={game} onNext={() => setRound((r) => r + 1)} />
                  </div>
                ) : (
                  <EmptyNote>These topics don't have enough questions for a puzzle yet. Pick more topics.</EmptyNote>
                )}
              </BentoPanel>
            </>
          )}
        </BentoStack>
      </main>
    </div>
  );
}
