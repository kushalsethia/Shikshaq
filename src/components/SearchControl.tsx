import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search, GraduationCap, ChevronDown, Clock, ArrowRight,
  BookOpen, MapPin, Landmark, School as SchoolIcon,
} from 'lucide-react';
import {
  SUBJECTS, CLASSES, BOARDS, AREAS,
  TEACHER_FACET_KEYS, PAPER_FACET_KEYS, FACET_LABELS,
  type SearchMode, type FacetKey,
} from '@/utils/searchFacets';
import { useSearchIndex, type TeacherHit, type PaperHit } from '@/hooks/useSearchIndex';
import { useExitPresence } from '@/hooks/useExitPresence';
import { getRecentSearches, addRecentSearch, type RecentSearch } from '@/utils/recentSearches';
import { setSearchExpanded } from '@/hooks/useSearchExpanded';

type Selections = Record<FacetKey, string[]>;

const EMPTY_SELECTIONS: Selections = { subject: [], cls: [], area: [], board: [], school: [] };

/* 'Past papers', not 'Papers' — the handoff labels this tab in full, and it
   matches the nav and the footer toggle, which already said 'Past papers'.
   The two read as different destinations when they are the same one. */
const MODE_LABEL: Record<SearchMode, string> = { teachers: 'Teachers', papers: 'Past papers' };

const POPULAR: Record<SearchMode, string[]> = {
  teachers: ['Maths near Ballygunge', 'Physics Class 10', 'ICSE tutors', 'Online tuition', 'Class 12 Chemistry'],
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
}

export function SearchControl({ className = '', align = 'center', stackedToggle = false, alwaysShowModeToggle = false, onDark = false, initialMode, onModeChange }: SearchControlProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { ensureLoaded, search, schools, ready } = useSearchIndex();

  const [mode, setMode] = useState<SearchMode>(initialMode || (location.pathname === '/past-papers' ? 'papers' : 'teachers'));

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

  // Separate from `narrow` above (which only resizes icon/button chrome) — this
  // is the app's general mobile cutoff (see use-mobile.tsx / index.css's 768px
  // convention). Below it, the expanded control switches to a pinned-to-top,
  // scroll-locked "focused mode" instead of the in-flow dropdown desktop uses.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onMq = () => setIsMobile(mq.matches);
    onMq();
    mq.addEventListener('change', onMq);
    return () => mq.removeEventListener('change', onMq);
  }, []);
  const [q, setQ] = useState('');
  const [field, setField] = useState<FacetKey | 'q' | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [selections, setSelections] = useState<Selections>(EMPTY_SELECTIONS);
  const [recents, setRecents] = useState<RecentSearch[]>([]);

  useEffect(() => {
    ensureLoaded();
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

  // Mobile-only "focused mode": once revealed, the bar/facet-row/results pin near
  // the top of the viewport instead of sitting wherever the collapsed pill happened
  // to be in normal flow, the scrim darkens further, and background scroll locks.
  // Desktop keeps the original in-flow dropdown + light scrim untouched.
  const mobilePinned = reveal && isMobile;

  // Notifies the sticky header to drop below the scrim while this control is
  // expanded, so nothing of the header shows through the scrim unblurred.
  useEffect(() => {
    setSearchExpanded(reveal);
    return () => setSearchExpanded(false);
  }, [reveal]);

  // Locks background scroll on mobile while pinned open — the scrim alone doesn't
  // stop the page from being dragged/scrolled underneath it. Storing and restoring
  // scrollY (instead of a bare `overflow:hidden`) avoids the page jumping back to
  // the top on iOS Safari when the lock engages/releases.
  useEffect(() => {
    if (!mobilePinned) return;
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
  }, [mobilePinned]);

  const accent = ACCENT[mode];
  const facetKeys = mode === 'teachers' ? TEACHER_FACET_KEYS : PAPER_FACET_KEYS;
  const hasChips = facetKeys.some((k) => selections[k].length > 0);

  const results = useMemo(() => search(q), [q, search]);
  const trimmedQ = q.trim();

  // Collapse on outside click / Escape
  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setField(null);
        setExpanded(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setField(null);
        setExpanded(false);
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
  }, []);

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
    if (trimmedQ) addRecentSearch(trimmedQ, mode);
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

  const facetPanelOptions = useMemo(() => {
    if (!displayField) return [] as string[];
    switch (displayField) {
      case 'subject': return SUBJECTS;
      case 'cls': return mode === 'papers' ? CLASSES.filter((c) => c !== 'UG') : CLASSES;
      case 'area': return AREAS;
      case 'board': return BOARDS;
      case 'school': return schools;
      default: return [];
    }
  }, [displayField, mode, schools]);

  /* Dropdown surface: one shared shell for the facet panel and the suggestions
     overlay. §5 — shadow-border only, never border + shadow. */
  const dropdownShell = (closing: boolean) =>
    `absolute left-0 right-0 top-[calc(100%+0.75rem)] z-20 rounded-2xl bg-card text-left shadow-border-hover transition-all duration-150 ease-out ${
      closing ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'
    } ${mobilePinned ? 'max-h-[max(220px,calc(100vh-240px))] overflow-y-auto' : ''}`;

  const sectionLabel = 'text-xs font-medium uppercase tracking-wide text-muted-foreground';

  const segmentedToggle = (
    <div className="relative flex flex-none rounded-full bg-muted p-1">
      <span
        aria-hidden="true"
        className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-panel shadow-border transition-transform duration-300 ease-out motion-reduce:transition-none ${
          mode === 'papers' ? 'translate-x-full' : 'translate-x-0'
        }`}
      />
      {(['teachers', 'papers'] as SearchMode[]).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => setMode(m)}
          aria-pressed={mode === m}
          className={`relative z-10 flex min-h-11 items-center justify-center rounded-full text-sm font-medium transition-colors duration-150 ${FOCUS} focus-visible:ring-ring ${
            narrow ? 'min-w-[76px] px-3' : 'min-w-[92px] px-3.5'
          } ${mode === m ? 'font-bold text-background' : 'text-muted-foreground'}`}
        >
          {MODE_LABEL[m]}
        </button>
      ))}
    </div>
  );

  const rowBase = `flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors duration-150 hover:bg-muted ${FOCUS} focus-visible:ring-ring`;

  return (
    <>
      {/* Scrim — dims and blurs the rest of the page while the control is expanded, like a modal.
          Click anywhere on it (or outside the control) to collapse. */}
      <div
        onClick={closeControl}
        aria-hidden={!reveal}
        className={`fixed inset-0 z-[65] bg-foreground/50 backdrop-blur-sm transition-opacity duration-300 ${
          reveal ? 'opacity-100' : 'pointer-events-none opacity-0'
        } ${mobilePinned ? '' : 'md:bg-foreground/20'}`}
      />
      <div
        ref={rootRef}
        className={`w-full ${align === 'center' ? 'mx-auto' : ''} ${
          mobilePinned
            ? 'fixed inset-x-3 top-[max(0.75rem,env(safe-area-inset-top))] z-[70] w-auto max-w-none'
            : `relative z-[45] ${expanded ? 'max-w-3xl' : 'max-w-2xl'}`
        } ${className}`}
      >
        {stackedToggle && (
          <div
            className={`flex overflow-hidden transition-all duration-300 ease-out ${
              align === 'center' ? 'justify-center' : 'justify-start'
            } ${stackedToggleVisible ? 'mb-3 max-h-16 opacity-100' : 'mb-0 max-h-0 opacity-0'}`}
          >
            {segmentedToggle}
          </div>
        )}

        <div className="relative">
          {/* The search field. §11 hero spec: full width, h-14, rounded-2xl,
              shadow-border, leading icon, text-base (16px so iOS never zooms). */}
          <div
            className={`flex h-14 items-center gap-2 rounded-2xl pl-4 pr-2 transition-shadow duration-150 ${
              onDark
                ? 'bg-white/10 focus-within:bg-white/[0.14]'
                : 'bg-card shadow-border focus-within:shadow-border-hover'
            }`}
          >
            <Search
              className={`h-5 w-5 flex-none ${onDark ? 'text-white/45' : 'text-muted-foreground'}`}
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
              className={`min-w-0 flex-1 border-0 bg-transparent text-base outline-none ${
                onDark ? 'text-white placeholder:text-white/45' : 'text-foreground placeholder:text-muted-foreground'
              }`}
            />

            {/* Inline segmented toggle */}
            {!stackedToggle && segmentedToggle}

            <button
              type="button"
              onClick={runSearch}
              aria-label="Search"
              className={`flex h-11 flex-none items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors duration-150 active:scale-[0.97] ${FOCUS} ${accent.solid} ${accent.ring} ${
                narrow ? 'w-11' : 'px-4'
              }`}
            >
              {/* Arrow, not a magnifier. dc.html draws this as a 44x44 orange
                  tile holding `M5 12h14M13 6l6 6-6 6` — the magnifier already
                  sits at the other end of the field, so repeating it says
                  nothing, where the arrow says "go". */}
              <ArrowRight className="h-[17px] w-[17px]" strokeWidth={2.5} aria-hidden="true" />
              {!narrow && <span className="whitespace-nowrap">Search</span>}
            </button>
          </div>

          {/* Facet row — horizontal snap-scroll on mobile, never ragged wrapped rows (§11). */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              reveal ? 'mt-3 max-h-40 opacity-100' : 'invisible mt-0 max-h-0 opacity-0'
            }`}
          >
            <div className="relative">
              {/* The "Narrow it" label lives OUTSIDE the scroller. It used to be the scroller's
                  first child, which meant it scrolled away from the very chips it labels — and
                  because this row animates open (max-h-0 → max-h-40), the browser landed it at
                  scrollLeft ≈ 75 on first paint, so mobile users never saw it at all. */}
              <span className={`${sectionLabel} mb-1.5 block ${align === 'center' ? 'sm:text-center' : ''}`}>
                Narrow it
              </span>
              {/* Scroll cue (§8/§11): the facet row hides its own scrollability on mobile with
                  no affordance — a trailing edge fade signals "more chips this way" without
                  a border/shadow stack. sm:hidden since the row wraps instead of scrolling at sm+. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent sm:hidden"
              />
              <div
                ref={facetRowRef}
                className={`flex snap-x items-center gap-2 overflow-x-auto scrollbar-hide sm:flex-wrap sm:overflow-visible ${
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
                      /* Matches the Chip primitive's own facet tone
                         ("bg-muted text-foreground hover:bg-accent") — this
                         button is hand-rolled rather than <Chip>, and had
                         dropped the hover half of that pair, so an unselected
                         facet pill gave no feedback on pointer-hover devices
                         until the moment it was clicked. */
                      selected ? accent.subtle : 'bg-muted text-foreground hover:bg-accent'
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
              <div className={`${sectionLabel} mb-3`}>{FACET_LABELS[displayField]}</div>
              {facetPanelOptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {displayField === 'school' ? 'No schools yet. Check back once papers are added.' : 'No options available yet.'}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {facetPanelOptions.map((opt) => {
                    const picked = selections[displayField].includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        aria-pressed={picked}
                        onClick={() => setSelections((s) => ({ ...s, [displayField]: toggleValue(s[displayField], opt) }))}
                        className={`flex min-h-11 items-center rounded-full px-4 text-sm font-medium transition-colors duration-150 active:scale-[0.97] ${FOCUS} focus-visible:ring-ring ${
                          picked ? accent.subtle : 'bg-muted text-foreground hover:bg-accent'
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
                <div className="p-4 sm:p-6">
                  {recents.length > 0 && (
                    <>
                      <div className={`${sectionLabel} mb-2`}>Recent searches</div>
                      <div className="mb-6 grid gap-1">
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
                  <div className={`${sectionLabel} mb-2`}>Popular right now</div>
                  <div className="flex snap-x gap-2 overflow-x-auto scrollbar-hide sm:flex-wrap sm:overflow-visible">
                    {POPULAR[mode].map((label) => (
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
                </div>
              )}

              {displayOverlayTyping && (
                <div>
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

                  {searchActive && teacherCount > 0 && (
                    <div className="border-b border-border p-4 sm:p-6">
                      <div className="mb-2 flex items-baseline justify-between gap-2">
                        <span className={sectionLabel}>Teachers</span>
                        <span className="flex-none whitespace-nowrap text-xs tabular-nums text-muted-foreground">
                          {teacherCount} found
                        </span>
                      </div>
                      <div className="grid gap-1">
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
                        className={`mt-2 flex min-h-11 items-center whitespace-nowrap rounded-lg px-1 text-sm font-medium text-brand-blue transition-colors duration-150 hover:underline ${FOCUS} focus-visible:ring-ring`}
                      >
                        See all {teacherCount} teacher{teacherCount === 1 ? '' : 's'} →
                      </button>
                    </div>
                  )}

                  {paperCount > 0 && (
                    <div className="border-b border-border p-4 sm:p-6">
                      <div className="mb-2 flex items-baseline justify-between gap-2">
                        <span className={sectionLabel}>Past Papers</span>
                        <span className="flex-none whitespace-nowrap text-xs tabular-nums text-muted-foreground">
                          {paperCount} found
                        </span>
                      </div>
                      <div className="grid gap-1">
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
                  )}

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
