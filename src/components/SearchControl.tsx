import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, GraduationCap, ChevronDown, Clock, ArrowRight, X,
  BookOpen, MapPin, Landmark, School as SchoolIcon,
} from 'lucide-react';
import {
  SUBJECTS, CLASSES, BOARDS, AREAS,
  TEACHER_FACET_KEYS, PAPER_FACET_KEYS, FACET_LABELS,
  type SearchMode, type FacetKey,
} from '@/utils/searchFacets';
import { useSearchIndex, type TeacherHit, type PaperHit } from '@/hooks/useSearchIndex';
import { useExitPresence } from '@/hooks/useExitPresence';
import { useIntent } from '@/lib/intent-context';
import { recordSignal } from '@/lib/intent/signals';
import { suggestedSearches } from '@/lib/intent/copy';
import { getRecentSearches, addRecentSearch, type RecentSearch } from '@/utils/recentSearches';
import { setSearchExpanded } from '@/hooks/useSearchExpanded';

type Selections = Record<FacetKey, string[]>;

const EMPTY_SELECTIONS: Selections = { subject: [], cls: [], area: [], board: [], school: [] };

/* 'Past papers', not 'Papers' — the handoff labels this tab in full, and it
   matches the nav and the footer toggle, which already said 'Past papers'.
   The two read as different destinations when they are the same one. */
const MODE_LABEL: Record<SearchMode, string> = { teachers: 'Teachers', papers: 'Past papers' };

const POPULAR: Record<SearchMode, string[]> = {
  teachers: ['Maths near Ballygunge', 'Physics Class 10', 'ICSE teachers', 'Online tuition', 'Class 12 Chemistry'],
  papers: ['ICSE Class 10 Maths', 'CBSE Class 12', 'Class 10 Science 2024', 'State Board Bengali', 'ISC Prelims'],
};

const FACET_ICON: Record<FacetKey, typeof BookOpen> = {
  subject: BookOpen,
  cls: GraduationCap,
  area: MapPin,
  board: Landmark,
  school: SchoolIcon,
};

/* Per-mode accent classes. DESIGN_SYSTEM.md §2: accents only — orange for
   teachers, blue for papers. No literals anywhere in this file. */
const ACCENT = {
  teachers: {
    solid: 'bg-brand text-brand-foreground hover:bg-brand-hover',
    subtle: 'bg-brand-subtle text-brand',
    text: 'text-brand',
    ring: 'focus-visible:ring-brand',
  },
  papers: {
    solid: 'bg-brand-blue text-brand-blue-foreground hover:bg-brand-blue-hover',
    subtle: 'bg-brand-blue-subtle text-brand-blue',
    text: 'text-brand-blue',
    ring: 'focus-visible:ring-brand-blue',
  },
} as const;

/* Shared focus treatment — §1.5 requires a visible ring on every interactive element. */
const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

function toggleValue(arr: string[], v: string): string[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

function facetDisplayLabel(key: FacetKey, values: string[]): string {
  if (values.length === 0) return FACET_LABELS[key];
  if (values.length === 1) return values[0];
  return `${values[0]} +${values.length - 1}`;
}

function initial(name: string): string {
  return (name.trim()[0] || '?').toUpperCase();
}

interface SearchControlProps {
  className?: string;
  /** Wrapper + inner row alignment. 'center' for the homepage hero, 'flex-start' for left-aligned page heroes. */
  align?: 'center' | 'flex-start';
  /** Segmented toggle placement: inline inside the bar (default) or stacked above it. Never both. */
  stackedToggle?: boolean;
  /**
   * Renders the field for a dark control block: translucent white fill, white
   * text, white/45 placeholder.
   *
   * pages.md §2 puts browse's search field INSIDE the near-black block
   * ("`bg-white/10` field, white text, white/45 placeholder"), where home's
   * sits in its own bone card overhanging the block. Same component, two
   * grounds — without this the browse field rendered bone-on-black, which is
   * the one combination the spec never draws.
   */
  onDark?: boolean;
  /** Only meaningful with `stackedToggle`: keeps the stacked toggle visible at rest instead of
   *  gating it behind `reveal` (expanded/focused). Lets a page surface Teachers/Papers as an
   *  always-present control on first fold without touching the reveal-gated bar/facet-row logic. */
  alwaysShowModeToggle?: boolean;
  /** Force a starting mode instead of inferring it from the current route. */
  initialMode?: SearchMode;
  /** Notified whenever the mode changes, so a page can morph copy (headline, placeholder text) alongside it. */
  onModeChange?: (mode: SearchMode) => void;
  /**
   * Handoff H-009: the home hero's field grows to 60px / rounded-[22px] /
   * bg-muted with a dedicated 46px round submit disc, instead of the shared
   * h-14/rounded-2xl/shadow-border bar Browse and PastPapers still use. Opt-in
   * so this session's Home work doesn't reach into those other pages' own
   * change-log entries ahead of their turn.
   */
  heroDesk?: boolean;
  /** Hide the Subject/Class/Area facet row. Browse carries a full filter rail
   *  of its own, so the row there was a second, weaker copy of the same
   *  controls sitting directly above them. */
  hideFacets?: boolean;
  /**
   * Desktop-only: renders the facet trigger chips (Subject/Class/Board/
   * School or Area, per mode) in a persistent row to the right of the search
   * bar, instead of only after the control is focused/expanded. Opt-in —
   * most callers want the quieter reveal-gated behaviour; PastPapers' hero
   * has the horizontal room and asked for the filters visible up front.
   */
  inlineFacetsDesktop?: boolean;
}

export function SearchControl({ className = '', align = 'center', stackedToggle = false, alwaysShowModeToggle = false, onDark = false, initialMode, onModeChange, heroDesk = false, hideFacets = false, inlineFacetsDesktop = false }: SearchControlProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { ensureLoaded, search, schools, ready, featuredTeachers, recentPapers } = useSearchIndex();

  const [mode, setMode] = useState<SearchMode>(initialMode || (location.pathname === '/past-papers' ? 'papers' : 'teachers'));
  const { intent } = useIntent();
  // Frozen with the rest of the intent index (see intent-context.tsx's freeze
  // rule) — the resting chips don't reshuffle while this control is open,
  // only between one page view and the next. Falls back to the same
  // hardcoded POPULAR list this always showed when the index has nothing.
  const restingChips = useMemo(() => suggestedSearches(mode, intent) ?? POPULAR[mode], [mode, intent]);

  useEffect(() => {
    onModeChange?.(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Below ~560px the collapsed bar's fixed-width children (mode toggle, Search
  // button) don't leave room for the input — shrink them so nothing overflows
  // the viewport on small phones.
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 560px)');
    const onMq = () => setNarrow(mq.matches);
    onMq();
    mq.addEventListener('change', onMq);
    return () => mq.removeEventListener('change', onMq);
  }, []);

  const [q, setQ] = useState('');
  const [field, setField] = useState<FacetKey | 'q' | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [selections, setSelections] = useState<Selections>(EMPTY_SELECTIONS);
  const [recents, setRecents] = useState<RecentSearch[]>([]);

  /* Persistent inline chips (inlineFacetsDesktop) open their own small
     per-chip dropdown instead of routing through `field`, which is what
     drives the whole reveal/pinned/scrim search-popup machinery below. A
     quick "pick a subject" tap on the hero was launching the full
     fixed-position, scroll-locked, scrim-and-close-button overlay meant for
     the search field itself — this keeps that interaction lightweight and
     anchored to the chip that opened it. Only meaningful with
     inlineFacetsDesktop; unused otherwise. */
  const [inlineOpenFacet, setInlineOpenFacet] = useState<FacetKey | null>(null);
  const inlineGroupRef = useRef<HTMLDivElement>(null);

  /* Was a bare `ensureLoaded()` on mount. Every page carrying a search bar
     (Home, Browse, Past papers) therefore pulled the entire search index —
     teachers_list at limit 2000, plus bank_papers and papers — into the
     first-paint connection window, for a feature the reader has not
     touched yet. Measured on Home: 25 concurrent REST calls against the
     browser's 6-per-host limit, the tail not settling until ~4.5s, with
     these three among the heaviest.

     Deferred to idle instead, so it still preloads (search is instant when
     it IS opened) without competing with above-the-fold data. `expandBar`
     also calls it, so focusing the field never waits on the idle callback,
     and ensureLoaded is idempotent (shared module-level loadPromise), so
     the two paths can safely race. */
  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    if (typeof w.requestIdleCallback === 'function') {
      const handle = w.requestIdleCallback(() => { void ensureLoaded(); }, { timeout: 2500 });
      return () => w.cancelIdleCallback?.(handle);
    }
    const timer = setTimeout(() => { void ensureLoaded(); }, 1200);
    return () => clearTimeout(timer);
  }, [ensureLoaded]);

  const reveal = expanded || field !== null;

  // The facet row animates open from max-h-0. During that transition the browser can leave
  // it mid-scroll (observed at scrollLeft ≈ 75 on first paint at 375px), hiding the first
  // facet chips before the user has touched anything. Reset to the start whenever it opens.
  const facetRowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reveal && facetRowRef.current) facetRowRef.current.scrollLeft = 0;
  }, [reveal]);

  // Only the stacked-toggle wrapper below reads this — the bar, facet row, and scrim
  // stay tied to `reveal` so the rest of the expand/collapse choreography is untouched.
  const stackedToggleVisible = stackedToggle && (reveal || alwaysShowModeToggle);

  // "Focused mode", every width now: once revealed, the bar/facet-row/results
  // pin near the top of the viewport instead of sitting wherever the collapsed
  // pill happened to be in normal flow, the scrim darkens further, and
  // background scroll locks. Was mobile-only (isMobile, <768px) — desktop kept
  // the plain in-flow dropdown, which meant an open search on a wide screen
  // didn't block scroll and could visually collide with page content below it
  // (the recurring "search bar overlaps X" reports). Same pinned treatment at
  // every width now; there is no narrower-viewport-only branch left to gate on.
  //
  // `pinEngaged` deliberately lags `reveal` by one animation frame. The very
  // tap/click that focuses the field is what sets `reveal` true — if pinning
  // (a `relative` → `fixed inset-x-3 top-3` swap) applied on that SAME render,
  // the control physically jumped out from under the pointer mid-gesture: the
  // browser resolves `mousedown` against the field at its in-flow position, the
  // reflow happens before `mouseup`, and the click/tap that completes the
  // gesture lands on whatever page content the jump just exposed underneath —
  // a teacher card, a "See all" link, anything that happened to sit at that
  // pixel. That is what read as the popup "taking me" somewhere else and
  // "overflowing": it wasn't the popup misbehaving, it was a real navigation on
  // an unrelated element one frame after open. Engaging the pin a frame later
  // lets the tap resolve against the field first; the pin then settles in
  // without ever occupying the space under an in-flight pointer.
  const [pinEngaged, setPinEngaged] = useState(false);
  useEffect(() => {
    if (!reveal) {
      setPinEngaged(false);
      return;
    }
    const id = requestAnimationFrame(() => setPinEngaged(true));
    return () => cancelAnimationFrame(id);
  }, [reveal]);
  const pinned = reveal && pinEngaged;

  // Notifies the sticky header to drop below the scrim while this control is
  // expanded, so nothing of the header shows through the scrim unblurred.
  useEffect(() => {
    setSearchExpanded(reveal);
    return () => setSearchExpanded(false);
  }, [reveal]);

  // Locks background scroll while pinned open, at every width now — the scrim
  // alone doesn't stop the page from being dragged/scrolled (touch) or wheeled
  // (desktop) underneath it. Storing and restoring scrollY (instead of a bare
  // `overflow:hidden`) avoids the page jumping back to the top on iOS Safari
  // when the lock engages/releases.
  useEffect(() => {
    if (!pinned) return;
    const y = window.scrollY;
    const body = document.body.style;
    body.position = 'fixed';
    body.top = `-${y}px`;
    body.left = '0';
    body.right = '0';
    body.width = '100%';
    body.overflow = 'hidden';
    return () => {
      body.position = '';
      body.top = '';
      body.left = '';
      body.right = '';
      body.width = '';
      body.overflow = '';
      window.scrollTo(0, y);
    };
  }, [pinned]);

  const accent = ACCENT[mode];
  const facetKeys = mode === 'teachers' ? TEACHER_FACET_KEYS : PAPER_FACET_KEYS;
  const hasChips = facetKeys.some((k) => selections[k].length > 0);

  /* Deferred so the input never waits on the index. The field updates from
     the keystroke at high priority; re-running Fuse over every teacher and
     paper is allowed to land a frame later, and React drops intermediate
     queries when someone types faster than a search completes. Typing stays
     at the speed of the keyboard however large the index grows. */
  const deferredQ = useDeferredValue(q);
  const results = useMemo(() => search(deferredQ), [deferredQ, search]);
  const trimmedQ = q.trim();

  // Collapse on outside click / Escape
  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setField(null);
        setExpanded(false);
      }
      // Independent of the above: the inline chip dropdown isn't part of
      // the reveal/pinned popup, so it gets its own outside-click check
      // against its own group rather than piggybacking on rootRef (which
      // it's a descendant of either way).
      if (inlineGroupRef.current && !inlineGroupRef.current.contains(e.target as Node)) {
        setInlineOpenFacet(null);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setField(null);
        setExpanded(false);
        setInlineOpenFacet(null);
        inputRef.current?.blur();
      }
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const expandBar = useCallback(() => {
    setExpanded(true);
    setField('q');
    setRecents(getRecentSearches());
    /* Guarantees the index for the one interaction that actually needs it,
       rather than relying on the idle preload above having already run.
       Idempotent, so this is free when it has. */
    void ensureLoaded();
  }, [ensureLoaded]);

  const buildParams = useCallback((query: string, sel: Selections, forMode: SearchMode) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (sel.subject.length) params.set('filter_subjects', sel.subject.join(','));
    if (sel.cls.length) params.set('filter_classes', sel.cls.join(','));
    if (sel.board.length) params.set('filter_boards', sel.board.join(','));
    if (forMode === 'teachers' && sel.area.length) params.set('filter_areas', sel.area.join(','));
    if (forMode === 'papers' && sel.school.length) params.set('filter_schools', sel.school.join(','));
    return params.toString();
  }, []);

  const closeControl = useCallback(() => {
    setField(null);
    setExpanded(false);
  }, []);

  const runSearch = useCallback(() => {
    /* Every facet the overlay holds, in full. recordSearch() only ever took
       three of them and only the first value of each, so a search made with
       two subjects and a board selected reached the index as one subject and
       nothing else. recordSignal takes the arrays directly; the hero's
       one-sentence trail record still reads the primary of each, which it
       derives itself. */
    recordSignal('search_submitted', {
      query: trimmedQ || null,
      subject: selections.subject,
      classLevel: selections.cls,
      area: selections.area,
      board: selections.board,
      school: selections.school,
      mode,
    });
    const qs = buildParams(trimmedQ, selections, mode);
    const path = mode === 'teachers' ? '/all-tuition-teachers-in-kolkata' : '/past-papers';
    navigate(qs ? `${path}?${qs}` : path);
    closeControl();
  }, [trimmedQ, mode, selections, buildParams, navigate, closeControl]);

  const seeAll = useCallback((forMode: SearchMode) => {
    if (trimmedQ) addRecentSearch(trimmedQ, forMode);
    const path = forMode === 'teachers' ? '/all-tuition-teachers-in-kolkata' : '/past-papers';
    navigate(trimmedQ ? `${path}?q=${encodeURIComponent(trimmedQ)}` : path);
    closeControl();
  }, [trimmedQ, navigate, closeControl]);

  const openTeacher = useCallback((t: TeacherHit) => {
    if (trimmedQ) addRecentSearch(trimmedQ, 'teachers');
    navigate(`/tuition-teachers/${t.slug}`);
    closeControl();
  }, [trimmedQ, navigate, closeControl]);

  const openPaper = useCallback((p: PaperHit) => {
    if (trimmedQ) addRecentSearch(trimmedQ, 'papers');
    // Always route through the reader. This previously did
    // `window.open(p.file_url)`, handing out the raw public bucket URL and
    // walking straight past the reader's sign-in wall, its visit tracking and
    // its redistribution notice — so the "gate" wasn't one for anybody who
    // arrived via search. Papers without a file still fall back to a filtered
    // browse rather than a dead click.
    if (p.id) {
      navigate(`/past-papers/${p.id}`);
    } else {
      navigate(`/past-papers?q=${encodeURIComponent(`${p.title} ${p.school}`)}`);
    }
    closeControl();
  }, [trimmedQ, navigate, closeControl]);

  const pickRecent = useCallback((r: RecentSearch) => {
    setQ(r.q);
    setMode(r.mode);
    setField('q');
  }, []);

  const pickPopular = useCallback((label: string) => {
    setQ(label);
    setField('q');
  }, []);

  const panelOpen = field !== null && field !== 'q';
  const overlayOpen = field === 'q';
  const panelPresence = useExitPresence(panelOpen);
  const overlayPresence = useExitPresence(overlayOpen);
  const overlayResting = overlayOpen && trimmedQ === '';
  const overlayTyping = overlayOpen && trimmedQ !== '';

  // Freeze the facet/overlay content while a dropdown plays its exit transition,
  // since `field` already resets to null the instant a close is triggered.
  const lastFacetFieldRef = useRef<FacetKey | null>(null);
  if (panelOpen) lastFacetFieldRef.current = field as FacetKey;
  const displayField = (panelOpen ? field : lastFacetFieldRef.current) as FacetKey | null;

  const lastOverlayStateRef = useRef({ resting: false, typing: false });
  if (overlayOpen) lastOverlayStateRef.current = { resting: overlayResting, typing: overlayTyping };
  const displayOverlayResting = overlayOpen ? overlayResting : lastOverlayStateRef.current.resting;
  const displayOverlayTyping = overlayOpen ? overlayTyping : lastOverlayStateRef.current.typing;
  const searchActive = trimmedQ.length >= 2;

  const teacherCount = results.teachersTotal;
  const paperCount = results.papersTotal;
  const currentCount = mode === 'teachers' ? teacherCount : paperCount;
  const otherCount = mode === 'teachers' ? paperCount : teacherCount;
  const indexLoading = !ready;
  const showEmptyBanner = overlayTyping && searchActive && !indexLoading && currentCount === 0;
  const totalCount = teacherCount + paperCount;

  // Shared by the popup's facet panel and the inline chips' own dropdown —
  // both list the same option set for a given facet key.
  const optionsForFacet = useCallback((key: FacetKey | null): string[] => {
    if (!key) return [];
    switch (key) {
      case 'subject': return SUBJECTS;
      case 'cls': return mode === 'papers' ? CLASSES.filter((c) => c !== 'UG') : CLASSES;
      case 'area': return AREAS;
      case 'board': return BOARDS;
      case 'school': return schools;
      default: return [];
    }
  }, [mode, schools]);

  const facetPanelOptions = useMemo(() => optionsForFacet(displayField), [optionsForFacet, displayField]);

  /* Guided step-through (brief: "once they choose a filter they should
     automatically guide to the next filter"): the facet immediately after
     `key` in this mode's own order, or null once it was the last one. Used
     by both the popup's "Narrow it" panel and the inline chips' dropdown so
     picking a value always advances to the next unfilled decision instead
     of leaving the user to reopen the row themselves. */
  const nextFacetAfter = useCallback((key: FacetKey): FacetKey | null => {
    // facetKeys is TeacherFacetKey[] | PaperFacetKey[] — a union of two
    // narrower arrays, so TS's own indexOf overload resolution narrows the
    // accepted argument to their intersection rather than the full FacetKey
    // `key` is typed as. Both key and facetKeys agree at runtime (key only
    // ever comes from this same mode's facetKeys to begin with); the cast
    // just tells TS what's already true.
    const keys = facetKeys as readonly FacetKey[];
    const idx = keys.indexOf(key);
    return keys[idx + 1] ?? null;
  }, [facetKeys]);

  /* Dropdown surface: one shared shell for the facet panel and the suggestions
     overlay. §5 — shadow-border only, never border + shadow. */
  const dropdownShell = (closing: boolean) =>
    `absolute left-0 right-0 top-[calc(100%+0.75rem)] z-20 rounded-2xl bg-card text-left shadow-border-hover transition-[opacity,translate] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
      closing ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'
    } ${pinned ? 'max-h-[max(220px,calc(100vh-240px))] overflow-y-auto' : ''}`;

  const sectionLabel = 'text-xs font-medium uppercase tracking-wide text-muted-foreground';

  /* grid-cols-2, not flex + flex-1. `flex-1` is `flex: 1 1 0%`, but a flex
     item will not shrink below its own min-content, and with
     `whitespace-nowrap` that floor is the label width — so "Past papers" held
     94px while "Teachers" took the 76px left over. The two segments were never
     equal, and the indicator (a fixed `calc(50% - 0.25rem)`) sat under neither
     of them properly. Grid cells are exactly half each, which is what the
     indicator has always assumed. */
  const segmentedToggle = (
    <div className="relative grid grid-cols-2 flex-none rounded-full bg-muted p-1">
      <motion.span
        aria-hidden="true"
        layout
        className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full shadow-border backdrop-blur-sm motion-reduce:transition-none ${
          mode === 'papers' ? 'bg-brand-blue' : 'bg-panel'
        }`}
        animate={{ x: mode === 'papers' ? '100%' : '0%' }}
        transition={{ type: 'spring', stiffness: 460, damping: 36 }}
      />
      {(['teachers', 'papers'] as SearchMode[]).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => setMode(m)}
          aria-pressed={mode === m}
          /* whitespace-nowrap + tracking-tight: "Past papers" is the longer of
             the two labels, and at the fixed 40px toggle height (pages.md §1)
             plus this button's own px padding, it was wrapping to 2 lines on
             narrow phones and blowing out the pill's height. Tightened
             tracking buys back a few px before padding needs to shrink
             further, rather than truncating the label. */
          className={`relative z-10 flex min-h-11 min-w-0 items-center justify-center whitespace-nowrap rounded-full text-sm font-medium tracking-tight transition-colors duration-150 ${FOCUS} focus-visible:ring-ring ${
            narrow ? 'px-2.5' : 'px-3.5'
          } ${mode === m ? 'font-bold text-background' : 'text-muted-foreground'}`}
        >
          {MODE_LABEL[m]}
          {searchActive && !indexLoading && (
            <span
              className={`ml-1.5 tabular-nums text-xs font-semibold ${
                mode === m ? 'text-background/65' : 'text-muted-foreground/70'
              }`}
            >
              {m === 'teachers' ? teacherCount : paperCount}
            </span>
          )}
        </button>
      ))}
    </div>
  );

  const rowBase = `flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors duration-150 hover:bg-muted ${FOCUS} focus-visible:ring-ring`;

  return (
    <>
      {/* Scrim: dims and blurs the rest of the page while the control is
          expanded, like a modal. Click anywhere on it to collapse.

          The z-index depends on whether the control is PINNED, which now
          happens at every width once `reveal` settles (see `pinned` above).
          Pinned, the control itself sits at z-70, so the scrim belongs above
          the nav at z-65 and covers everything. The lighter/lower z-30 branch
          only ever shows for the single frame between `reveal` turning true
          and `pinEngaged` catching up a frame later — kept rather than
          removed, since that's still a real (if brief) state. */}
      <div
        onClick={closeControl}
        aria-hidden={!reveal}
        className={`fixed inset-0 backdrop-blur-md transition-opacity duration-300 ${
          pinned ? 'z-[65] bg-foreground/55' : 'z-30 bg-foreground/20'
        } ${reveal ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <div
        ref={rootRef}
        /* The base width is conditional, not `w-full` plus a `w-auto` override.
           This is a plain template string — no tailwind-merge — so when pinned
           BOTH classes were emitted and `w-full` won on stylesheet order. With
           `inset-x-3` pinning the left edge at 12px, a 100%-of-viewport width
           put the right edge at 402px on a 390px screen: the results panel,
           the submit disc and the mode toggle were all sliced by 12px, which
           is the "things are overflowing / touching the corners" report. When
           pinned the two insets define the width, so it must not be set. */
        className={`${pinned ? '' : 'w-full'} ${align === 'center' ? 'mx-auto' : ''} ${
          pinned
            ? 'fixed inset-x-3 top-[max(0.75rem,env(safe-area-inset-top))] z-[70] max-w-none animate-search-pop motion-reduce:animate-none'
            /* z-[45] was unconditional — TopBar is z-40 and fixed, so on any
               page where this control sits in the normal scroll flow near
               the top, scrolling slid the (at-rest) search bar's box up
               past/through the fixed navbar and it painted ON TOP of it
               (45 > 40), even though nothing was actually open. Only needs
               to clear the navbar while genuinely showing its dropdown/
               facets (`reveal`) — at rest it stays below it instead. */
            /* inlineFacetsDesktop:!reveal narrows the field specifically at
               lg — the chip row + its own Search button sit to the field's
               right at a fixed content width (each chip sized for its
               label, not flexible), and on a ~1280px laptop width there
               wasn't room left for all four chips plus the button once it
               moved outside the bar; the row pushed past the viewport edge
               and put a horizontal scrollbar on the whole page. Trading
               some of the field's own width back to the row it shares
               fixes that without capping how many facets show. */
            : `relative ${reveal ? 'z-[45]' : 'z-20'} ${expanded ? 'max-w-3xl' : 'max-w-2xl'} ${
                inlineFacetsDesktop && !reveal ? 'lg:max-w-lg' : ''
              }`
        } ${className}`}
      >
        {/* Pinned close button — the only way to leave the expanded search
            was clicking the scrim or hitting Escape, neither of which is
            discoverable. Was top-left; on mobile that corner sits directly
            over the mode toggle/facet chips stacked above the field
            (stackedToggle), so the two overlapped. Bottom-right of the
            whole pinned card instead — nothing else renders there at any
            width, toggle included. */}
        {pinned && (
          <button
            type="button"
            onClick={closeControl}
            aria-label="Close search"
            className={`absolute -bottom-2 -right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground shadow-border-hover transition-colors duration-150 hover:bg-muted active:scale-[0.97] ${FOCUS} focus-visible:ring-ring`}
          >
            <X className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
          </button>
        )}

        {/* Persistent desktop filter row — the facet chips normally only
            show once the control is focused/expanded (the "Narrow it" row
            below), which on a wide hero with room to spare just reads as
            filters that don't exist until you go looking. Positioned off
            the root's own box so it never touches the reveal-gated facet
            row's absolute-positioned siblings; hidden once `reveal` is true
            since the focused-state UI (which includes this same row, just
            below the field) takes over from there.

            Each chip owns a small dropdown anchored to itself, driven by
            `inlineOpenFacet` rather than `field` — `field` is what turns on
            the whole reveal/pinned/scrim search popup below, and a tap on
            "Subject" here isn't the same gesture as focusing the search
            field. Picking a value advances straight to the next facet's
            dropdown (nextFacetAfter) so filling Subject → Class → Board
            reads as one guided pass instead of four separate opens; the
            main bar's own Search button (already brand-solid, per mode)
            sits right there the whole time for whenever they're done. */}
        {inlineFacetsDesktop && !reveal && (
          <div
            ref={inlineGroupRef}
            /* Below lg: same chips, but there's no room to the field's
               right on a phone width, so they wrap onto their own row
               under the field instead of sitting beside it — still visible
               before the user has tapped anything, which was the point;
               previously this whole block was lg-only and mobile only ever
               saw facets after focusing the field. */
            className={`pointer-events-auto absolute left-0 right-0 top-[calc(100%+8px)] flex flex-wrap items-center gap-2 lg:left-[calc(100%+12px)] lg:right-auto lg:top-0 lg:flex-nowrap ${
              heroDesk ? 'lg:h-[60px]' : 'lg:h-14'
            }`}
          >
            {facetKeys.map((key) => {
              const Icon = FACET_ICON[key];
              const selected = selections[key].length > 0;
              const open = inlineOpenFacet === key;
              const options = optionsForFacet(open ? key : null);
              return (
                <div key={key} className="relative">
                  <button
                    type="button"
                    onClick={() => setInlineOpenFacet((cur) => (cur === key ? null : key))}
                    aria-expanded={open}
                    className={`flex h-11 flex-none items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors duration-150 active:scale-[0.97] ${FOCUS} focus-visible:ring-ring ${
                      selected ? accent.solid : `${accent.subtle} hover:opacity-90`
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                    {facetDisplayLabel(key, selections[key])}
                    <ChevronDown className={`h-3 w-3 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>

                  {open && (
                    <div className="absolute left-0 top-[calc(100%+0.5rem)] z-30 min-w-[260px] max-w-[320px] rounded-2xl bg-card p-3 text-left shadow-border-hover">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className={sectionLabel}>{FACET_LABELS[key]}</span>
                        <button
                          type="button"
                          onClick={() => setInlineOpenFacet(nextFacetAfter(key))}
                          className={`flex h-9 flex-none items-center gap-1.5 rounded-full pl-4 pr-3 text-sm font-bold transition-colors duration-150 active:scale-[0.97] ${FOCUS} focus-visible:ring-ring ${accent.solid}`}
                        >
                          {nextFacetAfter(key) ? 'Next' : 'Done'}
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      {options.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          {key === 'school' ? 'No schools yet. Check back once papers are added.' : 'No options available yet.'}
                        </p>
                      ) : (
                        <div className="scrollbar-slim -mr-1 flex max-h-[160px] flex-wrap gap-2 overflow-y-auto overscroll-contain pr-2">
                          {options.map((opt) => {
                            const picked = selections[key].includes(opt);
                            return (
                              <button
                                key={opt}
                                type="button"
                                aria-pressed={picked}
                                onClick={() => setSelections((s) => ({ ...s, [key]: toggleValue(s[key], opt) }))}
                                className={`flex min-h-11 items-center rounded-full px-4 text-sm font-medium transition-colors duration-150 active:scale-[0.97] ${FOCUS} focus-visible:ring-ring ${
                                  picked ? accent.solid : 'bg-muted text-foreground hover:bg-accent'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* The bar's own Search button only hides at lg in this mode
                (see its `inlineFacetsDesktop` note) — below lg it's still
                the one visible Search button, so this replacement stays
                lg-only too. Without the gate, mobile briefly had two
                Search buttons: the bar's own plus this one wrapped onto a
                lone third row under the chips. Last in the row at lg so it
                reads as "field, then filters, then go" left to right
                instead of sitting before the filters it follows. */}
            <button
              type="button"
              onClick={runSearch}
              className={`hidden h-11 flex-none items-center gap-2 whitespace-nowrap rounded-full px-5 text-sm font-bold transition-colors duration-150 active:scale-[0.97] lg:flex ${FOCUS} ${accent.solid} ${accent.ring}`}
            >
              Search
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>
        )}

        {stackedToggle && (
          <div
            className={`flex overflow-hidden transition-[margin,max-height,opacity] duration-300 ease-out ${
              align === 'center' ? 'justify-center' : 'justify-start'
            } ${stackedToggleVisible ? 'mb-3 max-h-16 opacity-100' : 'mb-0 max-h-0 opacity-0'}`}
          >
            {segmentedToggle}
          </div>
        )}

        <div className="relative">
          {/* The search field. §11 hero spec: full width, h-14, rounded-2xl,
              shadow-border, leading icon, text-base (16px so iOS never zooms).
              Handoff H-009 overrides this to a 60px/rounded-[22px]/bg-muted
              field with its own 46px round submit disc when heroDesk is set. */}
          <div
            className={
              heroDesk
                ? 'flex h-[60px] items-center gap-[10px] rounded-[22px] bg-muted pl-[18px] pr-2 transition-shadow duration-150 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background'
                : `flex h-14 items-center gap-2 rounded-2xl pl-4 pr-2 transition-shadow duration-150 ${
                    onDark
                      ? 'bg-white/10 focus-within:bg-white/[0.14]'
                      : 'bg-card shadow-border focus-within:shadow-border-hover'
                  }`
            }
          >
            <Search
              className={heroDesk ? 'h-[19px] w-[19px] flex-none text-warm-meta' : `h-5 w-5 flex-none ${onDark ? 'text-white/45' : 'text-muted-foreground'}`}
              strokeWidth={2.25}
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => { setQ(e.target.value); setField('q'); setExpanded(true); }}
              onFocus={expandBar}
              onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
              aria-label={mode === 'teachers' ? 'Search teachers' : 'Search past papers'}
              /* "Subject, class or area" — the placeholder in Home concepts 2a.
                 The "e.g. maths near Ballygunge" wording was invented here; the
                 spec's version says what the field accepts rather than showing
                 one example, which matters because the field takes all three. */
              placeholder={mode === 'teachers' ? 'Subject, class or area' : 'Board, class, subject or school'}
              /* h-full, not the intrinsic 24px line box: the field reads as a
                 60px (or 56px) row, so the whole row has to be focusable —
                 otherwise the 18px above and below the text is a dead zone and
                 the real tap target is well under the 44px floor (C-011). An
                 input centres its own value vertically, so this is a no-op
                 visually. */
              /* `focus-visible:outline-none`, not just `outline-none`. The
                 global focus rule in index.css is scoped with
                 `:not([class*="focus-visible:outline-"])`, so a plain
                 `outline-none` does not exclude an element — the field was
                 getting the global 2px outline plus its 4px white halo, drawn
                 as a hard RECTANGLE inside a rounded-[22px] pill. The
                 indicator now lives on the pill itself as a focus-within
                 ring, so focus is still clearly shown, in the field's own
                 shape. */
              className={
                heroDesk
                  ? 'h-full min-w-0 flex-1 border-0 bg-transparent text-base text-foreground outline-none focus-visible:outline-none placeholder:text-warm-prose'
                  : `h-full min-w-0 flex-1 border-0 bg-transparent text-base outline-none focus-visible:outline-none ${
                      onDark ? 'text-white placeholder:text-white/45' : 'text-foreground placeholder:text-muted-foreground'
                    }`
              }
            />

            {/* Inline segmented toggle */}
            {!stackedToggle && segmentedToggle}

            <button
              type="button"
              onClick={runSearch}
              aria-label="Search"
              /* inlineFacetsDesktop hides this copy at lg: that mode gets its
                 own Search button after the chip row instead (extreme
                 right, once the chips it's meant to follow), so this one
                 would otherwise sit both before the chips AND duplicate it.
                 Still the only Search button below lg, where the chip row
                 itself is hidden. */
              className={`${inlineFacetsDesktop && !reveal ? 'lg:hidden' : ''} ${
                heroDesk
                  ? `flex h-[46px] flex-none items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition-colors duration-150 active:scale-[0.97] ${FOCUS} ${accent.solid} ${accent.ring}`
                  : `flex h-11 flex-none items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors duration-150 active:scale-[0.97] ${FOCUS} ${accent.solid} ${accent.ring} ${
                      narrow ? 'w-11' : 'px-4'
                    }`
              }`}
            >
              {/* Arrow, not a magnifier. dc.html draws this as a 44x44 orange
                  tile holding `M5 12h14M13 6l6 6-6 6` — the magnifier already
                  sits at the other end of the field, so repeating it says
                  nothing, where the arrow says "go".
                  heroDesk carries the "Search" label too now — an icon-only
                  disc read as decoration rather than the button that
                  actually submits, per owner review; text on every width
                  this control renders at removes the ambiguity. */}
              <ArrowRight className={heroDesk ? 'h-[18px] w-[18px]' : 'h-[17px] w-[17px]'} strokeWidth={2.5} aria-hidden="true" />
              {(heroDesk || !narrow) && <span className="whitespace-nowrap">Search</span>}
            </button>
          </div>

          {/* Facet row — horizontal snap-scroll on mobile, never ragged wrapped rows (§11). */}
          <div
            className={`overflow-hidden transition-[margin,max-height,opacity] duration-300 ease-out ${
              reveal && !hideFacets ? 'mt-3 max-h-48 opacity-100' : 'invisible mt-0 max-h-0 opacity-0'
            }`}
          >
            <div className={`relative ${pinned ? 'rounded-2xl bg-card px-3 py-2.5 shadow-border' : ''}`}>
              {/* The "Narrow it" label lives OUTSIDE the scroller. It used to be the scroller's
                  first child, which meant it scrolled away from the very chips it labels — and
                  because this row animates open (max-h-0 → max-h-40), the browser landed it at
                  scrollLeft ≈ 75 on first paint, so mobile users never saw it at all. */}
              <span className={`${sectionLabel} mb-1.5 block ${align === 'center' ? 'sm:text-center' : ''}`}>
                Narrow it
              </span>
              <div
                key={mode}
                ref={facetRowRef}
                /* key={mode}: Area (teachers) and School (papers) are different
                   facet sets, so a mode switch swaps this row's chips outright —
                   animate-fade-slide-up (the project's one whitelisted entrance
                   keyframe) cross-fades that swap instead of it snapping,
                   matching the resting shelf below. */
                className={`flex snap-x animate-fade-slide-up items-center gap-2 overflow-x-auto scrollbar-hide sm:flex-wrap sm:overflow-visible ${
                  align === 'center' ? 'sm:justify-center' : 'sm:justify-start'
                }`}
              >
              {facetKeys.map((key) => {
                const Icon = FACET_ICON[key];
                const selected = selections[key].length > 0;
                const open = field === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setField(open ? 'q' : key)}
                    aria-expanded={open}
                    className={`flex min-h-11 flex-none snap-start items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors duration-150 active:scale-[0.97] ${FOCUS} focus-visible:ring-ring ${
                      /* accent.subtle (idle) → accent.solid (has a value):
                         one mode-matched hue applied to the whole facet
                         cluster, not a per-chip neutral gray — same "exactly
                         one accent" reading as the rest of the page, just
                         carried by every chip in this row instead of none of
                         them. */
                      selected ? accent.solid : `${accent.subtle} hover:opacity-90`
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                    {facetDisplayLabel(key, selections[key])}
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
              {hasChips && (
                <button
                  type="button"
                  onClick={() => setSelections(EMPTY_SELECTIONS)}
                  className={`flex min-h-11 flex-none items-center whitespace-nowrap rounded-lg px-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground ${FOCUS} focus-visible:ring-ring`}
                >
                  Clear
                </button>
              )}
              </div>
            </div>
          </div>

          {/* Facet panel */}
          {panelPresence.mounted && displayField && (
            <div className={`${dropdownShell(panelPresence.closing)} p-4 sm:p-6`}>
              {/* Owner revision: auto-jumping to the next facet the instant
                  one value was picked didn't leave room to pick a second
                  value in the SAME facet first ("board" can be multi-select
                  too) — replaced with a plain toggle below (stays open,
                  multi-select) plus this explicit Next, right half of the
                  header per the brief, bigger than a text link since it's
                  now the primary way through the sequence rather than an
                  automatic side-effect. */}
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className={sectionLabel}>{FACET_LABELS[displayField]}</span>
                <button
                  type="button"
                  onClick={() => setField(nextFacetAfter(displayField) ?? 'q')}
                  className={`flex h-9 flex-none items-center gap-1.5 rounded-full pl-4 pr-3 text-sm font-bold transition-colors duration-150 active:scale-[0.97] ${FOCUS} focus-visible:ring-ring ${accent.solid}`}
                >
                  {nextFacetAfter(displayField) ? 'Next' : 'Done'}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
              {facetPanelOptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {displayField === 'school' ? 'No schools yet. Check back once papers are added.' : 'No options available yet.'}
                </p>
              ) : (
                <div className="scrollbar-slim -mr-1 flex max-h-[130px] flex-wrap gap-2 overflow-y-auto overscroll-contain pr-2">
                  {facetPanelOptions.map((opt) => {
                    const picked = selections[displayField].includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        aria-pressed={picked}
                        onClick={() => setSelections((s) => ({ ...s, [displayField]: toggleValue(s[displayField], opt) }))}
                        className={`flex min-h-11 items-center rounded-full px-4 text-sm font-medium transition-colors duration-150 active:scale-[0.97] ${FOCUS} focus-visible:ring-ring ${
                          picked ? accent.solid : 'bg-muted text-foreground hover:bg-accent'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Suggestions overlay */}
          {overlayPresence.mounted && (
            <div className={`${dropdownShell(overlayPresence.closing)} overflow-hidden`}>
              {displayOverlayResting && (
                /* key={mode} cross-fades the whole resting shelf (facet-driven
                   copy, popular chips, suggestions) in on a mode switch instead
                   of the content just snapping to its Papers/Teachers values —
                   requirement 6. animate-fade-slide-up is the project's one
                   whitelisted entrance keyframe (tailwind.config.ts), reused
                   rather than inventing a new one. */
                <div key={mode} className="animate-blur-swap p-4 sm:p-6 motion-reduce:animate-none">
                  <div className={`${sectionLabel} mb-2`}>Popular right now</div>
                  <div className="flex snap-x gap-2 overflow-x-auto scrollbar-hide sm:flex-wrap sm:overflow-visible">
                    {restingChips.map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => pickPopular(label)}
                        className={`flex min-h-11 flex-none snap-start items-center whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors duration-150 active:scale-[0.97] ${FOCUS} focus-visible:ring-ring ${accent.subtle}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {recents.length > 0 && (
                    <>
                      <div className={`${sectionLabel} mb-2 mt-6`}>Recent searches</div>
                      <div className="grid gap-1">
                        {recents.map((r, i) => (
                          <button
                            key={`${r.q}-${i}`}
                            type="button"
                            onClick={() => pickRecent(r)}
                            className={rowBase}
                          >
                            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-muted">
                              <Clock className="h-4 w-4 text-muted-foreground" strokeWidth={2} aria-hidden="true" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-base font-semibold text-foreground">{r.q}</span>
                              <span className="block text-sm text-muted-foreground">in {MODE_LABEL[r.mode]}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  {/* Suggested/recent shelf — teachers flavor reuses the same real
                      `is_featured` column Browse.tsx's "Featured teachers" shelf
                      reads; papers flavor is the head of the already
                      year-descending papers fetch. Hidden (not a fabricated
                      empty state) until the index has real rows to show. */}
                  {/* Both shelves at rest, not just the active mode's. The
                      typing state already shows teachers AND papers together
                      ("both types always shown here"); resting showed only one,
                      so opening the control told you less than typing one letter
                      into it did. Active mode leads, and the order is the DOM's
                      so focus follows what you see. */}
                  {(() => {
                    const teachersShelf =
                      featuredTeachers.length > 0 ? (
                        <div key="shelf-teachers">
                          <div className={`${sectionLabel} mb-2 mt-6`}>Suggested teachers</div>
                          {/* Was a single-column list ("not just top to
                              bottom") — a real grid at sm+ now, where there's
                              width to actually use for more than one card a
                              row. */}
                          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {featuredTeachers.map((t) => (
                              <button key={t.id} type="button" onClick={() => openTeacher(t)} className={rowBase}>
                                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-brand-subtle text-sm font-semibold text-brand">
                                  {initial(t.name)}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-base font-semibold text-foreground">{t.name}</span>
                                  <span className="block truncate text-sm text-muted-foreground">
                                    {[t.subjects?.split(',')[0]?.trim(), t.location?.split(',')[0]?.trim()].filter(Boolean).join(' · ')}
                                  </span>
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null;
                    const papersShelf =
                      recentPapers.length > 0 ? (
                        <div key="shelf-papers">
                          <div className={`${sectionLabel} mb-2 mt-6`}>Recently added papers</div>
                          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {recentPapers.map((p) => (
                              <button key={p.id} type="button" onClick={() => openPaper(p)} className={rowBase}>
                                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-brand-blue-subtle text-sm font-semibold text-brand-blue">
                                  {initial(p.school)}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-base font-semibold text-foreground">{p.title}</span>
                                  <span className="block truncate text-sm text-muted-foreground">
                                    {p.school} · {p.board} Class {p.class}
                                  </span>
                                </span>
                                <span className="flex-none text-xs tabular-nums text-muted-foreground">{p.year}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null;
                    return mode === 'papers'
                      ? [papersShelf, teachersShelf]
                      : [teachersShelf, papersShelf];
                  })()}
                </div>
              )}

              {displayOverlayTyping && (
                <div key={mode} className="animate-blur-swap motion-reduce:animate-none">
                  {/* Loading — skeleton matching the result rows' shape (§9). */}
                  {searchActive && indexLoading && (
                    <div className="grid gap-2 p-4 sm:p-6" aria-busy="true" aria-live="polite">
                      <span className="sr-only">Searching…</span>
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="h-10 w-10 flex-none rounded-lg bg-muted bg-[length:200%_100%] animate-shimmer" />
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="h-4 w-1/2 rounded-lg bg-muted bg-[length:200%_100%] animate-shimmer" />
                            <div className="h-3 w-1/3 rounded-lg bg-muted bg-[length:200%_100%] animate-shimmer" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {showEmptyBanner && (
                    <div className="p-4 sm:p-6">
                      <p className="text-base font-semibold text-foreground">
                        Nothing matches &ldquo;{trimmedQ}&rdquo; in {MODE_LABEL[mode]}
                      </p>
                      {otherCount > 0 ? (
                        <>
                          <p className="mt-2 text-sm text-muted-foreground">
                            But we found {otherCount} {mode === 'teachers' ? 'past paper' : 'teacher'}{otherCount === 1 ? '' : 's'} for this, see below.
                          </p>
                          <button
                            type="button"
                            onClick={() => setMode(mode === 'teachers' ? 'papers' : 'teachers')}
                            className={`mt-4 flex min-h-11 items-center rounded-lg px-4 text-sm font-medium transition-colors duration-150 active:scale-[0.97] ${FOCUS} focus-visible:ring-ring bg-muted text-foreground hover:bg-accent`}
                          >
                            Search {MODE_LABEL[mode === 'teachers' ? 'papers' : 'teachers']} instead
                          </button>
                        </>
                      ) : (
                        <p className="mt-2 text-sm text-muted-foreground">
                          Try a different subject, class, or spelling.
                        </p>
                      )}
                    </div>
                  )}

                  {!searchActive && (
                    <p className="p-4 text-sm text-muted-foreground sm:p-6">
                      Keep typing to search teachers and papers…
                    </p>
                  )}

                  {/* Group order follows the mode in the DOM, not with CSS
                      `order`. Reordering visually while leaving the DOM alone
                      put the group you asked for first on screen but second in
                      the tab and screen-reader sequence — WCAG 2.4.3. */}
                  {(() => {
                    const teachersGroup =
                      searchActive && teacherCount > 0 ? (
                        <div key="teachers" className="border-b border-border p-4 sm:p-6">
                          <div className="mb-2 flex items-baseline justify-between gap-2">
                            <span className={sectionLabel}>Teachers</span>
                            <span className="flex-none whitespace-nowrap text-xs tabular-nums text-muted-foreground">
                              {teacherCount} found
                            </span>
                          </div>
                          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {results.teachers.map((t) => (
                              <button key={t.id} type="button" onClick={() => openTeacher(t)} className={rowBase}>
                                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-brand-subtle text-sm font-semibold text-brand">
                                  {initial(t.name)}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-base font-semibold text-foreground">{t.name}</span>
                                  <span className="block truncate text-sm text-muted-foreground">
                                    {[t.subjects?.split(',')[0]?.trim(), t.location?.split(',')[0]?.trim()].filter(Boolean).join(' · ')}
                                  </span>
                                </span>
                              </button>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => seeAll('teachers')}
                            className={`mt-2 flex min-h-11 items-center whitespace-nowrap rounded-lg px-1 text-sm font-medium text-brand transition-colors duration-150 hover:underline ${FOCUS} focus-visible:ring-ring`}
                          >
                            See all {teacherCount} teacher{teacherCount === 1 ? '' : 's'} →
                          </button>
                        </div>
                      ) : null;
                    const papersGroup =
                      paperCount > 0 ? (
                        <div key="papers" className="border-b border-border p-4 sm:p-6">
                          <div className="mb-2 flex items-baseline justify-between gap-2">
                            <span className={sectionLabel}>Past Papers</span>
                            <span className="flex-none whitespace-nowrap text-xs tabular-nums text-muted-foreground">
                              {paperCount} found
                            </span>
                          </div>
                          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {results.papers.map((p) => (
                              <button key={p.id} type="button" onClick={() => openPaper(p)} className={rowBase}>
                                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-brand-blue-subtle text-sm font-semibold text-brand-blue">
                                  {initial(p.school)}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-base font-semibold text-foreground">{p.title}</span>
                                  <span className="block truncate text-sm text-muted-foreground">
                                    {p.school} · {p.board} Class {p.class}
                                  </span>
                                </span>
                                <span className="flex-none text-xs tabular-nums text-muted-foreground">{p.year}</span>
                              </button>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => seeAll('papers')}
                            className={`mt-2 flex min-h-11 items-center whitespace-nowrap rounded-lg px-1 text-sm font-medium text-brand-blue transition-colors duration-150 hover:underline ${FOCUS} focus-visible:ring-ring`}
                          >
                            See all {paperCount} paper{paperCount === 1 ? '' : 's'} →
                          </button>
                        </div>
                      ) : null;
                    return mode === 'papers'
                      ? [papersGroup, teachersGroup]
                      : [teachersGroup, papersGroup];
                  })()}

                  {totalCount > 0 && (
                    <p className="bg-muted px-4 py-3 text-xs text-muted-foreground sm:px-6">
                      Press Enter to see all {MODE_LABEL[mode]} results · both types always shown here
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
