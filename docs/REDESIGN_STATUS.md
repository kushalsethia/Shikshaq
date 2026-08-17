# ShikshAQ redesign — status, and what is still open

Branch `redesign/handoff-v1`, built against the Claude design handoff
(`Design Redesign & UX Audit (2)/` for docs and `.dc.html` frames,
`Design Redesign & UX Audit (3)/exports/` for the 61 rendered PNGs).

This file exists because the work is large and partly incomplete. Anyone picking
it up should read the "Still open" section first — several items were left
deliberately, with reasons, rather than half-done.

---

## Decisions that were made, and why

**City is Kolkata.** `copy.md` says "Ranchi" and "Lalpur" in a few places while
`design.md` says "Ballygunge"; the handoff contradicts itself. The codebase is
Kolkata in 353 places including all ~35 indexed route slugs, so Kolkata won and
copy strings were substituted. If ShikshAQ is genuinely moving city this needs
revisiting — but it is a business decision, not a code one.

**Pixel-exact over the token scale.** The owner chose to transcribe the mockups'
literal px via arbitrary Tailwind values rather than round to the
`1 2 3 4 6 8 12 16 20 24` scale that `tokens.md §5` and `design.md §0.2`
mandate. The costs were stated first: it breaks those rules and leaves no
spacing system for screens added later. Later screens should follow the mockups.

**Mockup wins over `design.md` on layout conflicts** — also the owner's call.
Three rules were held above the mockup anyway, and should stay that way:
nothing overlaps a teacher's face; every count is real or dropped; 44px tap
targets (grown via the `.tap-44` hit-area utility, not by resizing the design).

**Rebuild the view, keep the machinery.** Editing the old JSX kept producing
screens that still read as the old design, so pages had their render block
replaced while data fetching, state, handlers, routes and SEO stayed untouched.

---

## Data honesty — what is deliberately NOT shown

These come from the handoff's rule that every count shown is a real count. Each
was checked against `src/integrations/supabase/types.ts` before being dropped.

| Not shown | Why |
|---|---|
| Star rating on cards and profiles | `teacher_comments` has NO rating column. Open question O-02 is unresolved. Deriving one from upvotes would put a fabricated number against a named real person. `TeacherCard.rating` exists but no caller sets it. |
| Teacher-dashboard "profile views" / "WhatsApp taps" | No table records them; `WhatsAppRedirect` fires GA4/Clarity events only. O-04. |
| Papers streak pill, "12 new papers", "Most read" panel | No streak table, no per-user new-paper count, no view counter on `papers`. `GoalRing` is built and deliberately unwired. |
| Admin: approved-this-week, sent-back, contacted-this-month, reported, held-for-check, takedown-requests | No backing columns. |
| About's "2 min median reply time" | No backing query. |

If you later add any of these columns, the components are already built and
waiting — wire the data, do not invent it.

---

## Still open

### 1. `Browse.tsx` data layer — the big one
Roughly lines 860–1020. The unfiltered path pages `teachers_list` 500 rows at a
time up to 3000, then chunks slugs 50 at a time and fires ~60 parallel queries
at `Shikshaqmine` to stitch them in the browser. The filtered path does the
inverse.

Three separate attempts stopped here, for the same reason each time, and that
reason is worth respecting:
- `filterShikshaqRecords` has **three** call sites, not two — the filtered
  fetch, an empty-state diagnostic, and the `EmptyResults` chip-removal recount.
- `applyServerPrefilters` and `SHIKSHAQ_COLUMNS` are `FilterState`-aware, so
  they are not generic slug-lookup helpers and do not move cleanly into
  `src/lib/teachers.ts`.
- The per-chunk cache carries an `is_paused` retry fallback whose semantics are
  load-bearing.
- This file renders ~35 indexed SEO routes via `SubjectPage`/`BoardPage`, so a
  silent change to the result set or its order is an SEO regression, not just a
  bug.

A dedicated pass should: move only the paging/chunking mechanics into
`teachers.ts`, leave the filter semantics in `Browse.tsx`, and verify result
COUNTS before and after on at least two filter combinations plus a subject route.

### 2. react-query is partially adopted
`QueryClient` was configured app-wide but `useQuery` appeared in zero files.
`PastPapers.tsx` and `TeacherProfile.tsx` are migrated. `Index.tsx` is not — its
effect is ~180 lines with a stale-while-revalidate localStorage cache. Do not
delete `src/utils/cache.ts`; other call sites still use it.

### 3. No audit log exists
Mockup `admin-05-audit-log.png` shows a full page — actor, action, target,
reason, timestamp. Nothing in the schema records any of it. This is a new table
plus instrumentation on every admin mutation, not a UI task.

### 4. Two URLs serve one result set
`/commerce-tuition-teachers-in-kolkata` and
`/commercial-studies-tuition-teachers-in-kolkata` both map to the filter value
`Commerce` in `src/utils/subjectMapping.ts` and return an **identical
29-teacher list in identical order** (verified against live data). Same pattern:
`Science` = `Physics,Chemistry,Biology`, `Social Studies` =
`History & Civics,Geography` — though those two do return distinct sets.

The prose now differs per route; the results do not. Options are differentiate,
canonicalise one to the other, or leave — see `docs/SEO_STRATEGY.md`. This is a
product decision.

### 5. Screens not compared against their mockup
Most were. Not compared: the admin console frames (need an admin session), the
dashboards (need a session), the paper reader shell and gate (the dev database
has zero published papers, so `/past-papers/:id` never resolves — **nobody has
ever seen the reader rendered**), and the desktop grid card stickers.

### 6. Legal copy has never been reviewed by a lawyer
Open question O-06. The operative clauses were restored after a rebuild
replaced them with the mockup's short summary copy — Terms and Privacy each
carry the plain-English answer AND the original clause beneath it. Both files
open with a `TODO(O-06)`.

### 7. Verification documents (O-07)
The join form deliberately does not build the mockup's ID/degree upload block:
where those documents live, who can read them and what deletes them after a
decision is undecided.

---

## Traps worth knowing about

- **`cn()` silently dropped classes.** `tailwind-merge` does not know this
  project's custom fontSize keys, so `text-body-secondary` and friends were
  bucketed as text-*colour* and clobbered real colour utilities. Fixed in
  `src/lib/utils.ts` with `extendTailwindMerge`. **If you add a fontSize key to
  `tailwind.config.ts`, add it there too** or it will start eating colours.
- **`display:none` does not remove text** from `textContent` or the accessible
  name. Rendering two copies of a string and hiding one per breakpoint puts the
  duplicate in every search snippet — this happened on Contact's h1.
- **HMR goes stale** in this repo after concurrent edits. Restart the dev server
  before trusting a screenshot; several "defects" were stale modules.
- **Do not `git stash` or create a worktree** while other work is in flight. A
  stash once clobbered a whole rebuilt page (recovered from a dangling commit);
  a worktree once reset to a stale pre-redesign commit.
- **`spacing` sits under `extend`**, so the ten-step scale merges with
  Tailwind's defaults rather than replacing them. `h-11` (44px) depends on that.

---

## Verified state at time of writing

Typecheck (`npx tsc --noEmit -p tsconfig.app.json`) and `npm run build` both
clean. Across 11 routes at 390px: exactly one `h1` each, no heading-level skips,
exactly one `banner` landmark, zero horizontal scroll. Desktop 1440px: one top
bar, bottom nav correctly hidden.

Supabase: every `SECURITY DEFINER` function is `anon=false` except the six
sign-in helpers deliberately left open. Migration applied and verified against
`pg_proc.proacl`.
