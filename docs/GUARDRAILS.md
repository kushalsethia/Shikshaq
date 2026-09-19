# Guardrails — working checklist

The standing list of what protects this product, what does not yet, and what is
deliberately accepted. Not a plan with an end date: items get ticked, new ones
get added, and the "accepted" section is as important as the open one.

Every claim here was checked against the running system, not inferred. Where a
number appears it was measured. Where something is unverified it says so.

**Priority key:** `P0` before launch · `P1` first weeks after · `P2` when it
earns attention · `ACCEPTED` known and deliberately not doing

**`[~]` means done on our side and waiting on
[`supabase/RUN_THIS_ONE.sql`](../supabase/RUN_THIS_ONE.sql) being run.** That one
file is the only remaining dependency for everything marked that way.

---

## 0. Live verification, 2026-09-18

Checked against the **deployed site** (`shikshaqkanitest.vercel.app`) and the
**production database**, not a dev server and not by reading code.

**Database, as an anonymous caller holding only the bundled publishable key**

| | |
|---|---|
| `get_public_profile_data` | 42501 permission denied (was 206 rows / 52,753 bytes) |
| `purge_read_events`, `teacher_own_contact`, `admin_teacher_contacts`, `is_teacher` | 42501 |
| `read_quota_exceeded`, `reset_approval_on_edit` | 404 |
| `site_counts` | 200, by design |
| `paper_file_url` | null, by design |
| `bank_paper_questions` anon / signed in | **2 / 40 questions** |
| `bank_questions.body`, `Shikshaqmine."Link"` as authenticated | 403 |
| `admin_teacher_contacts` as a non-admin | refused **by the function body**, not the grant |
| `papers` with the new explicit column list | 200 — admin still loads |

**Deployed site**

| | |
|---|---|
| Preview copy | "the first **two** questions" |
| `teacher_viewed` / `contact_started` | fire with `teacher_slug`, `subject`, `area` |
| Pressing **Save** | fires nothing — inflation bug gone |
| Re-viewing the same teacher | fires nothing — one visitor, one count |
| `/auth?redirect=/%5Cevil.com` | blocked, nothing stored |
| `/auth?redirect=/faq` | still works — not over-broad |
| Question text in the DOM | Cyrillic: `"А dеаlеr іn Sіkkіm ѕеllѕ gооdѕ"` |
| `user-select` on protected text | `none` |
| PrintScreen | shield fires, overlay opaque `rgb(27, 26, 24)` |
| 9 routes | own title, own `h1`, no overflow at 375px |
| Same-origin requests | 100 recorded, **all 200** |
| Lazy route chunks | load on real in-app navigation |

**The error boundary proved itself in production, by accident.** A `fetch`
wrapper of mine made every request throw "Illegal invocation". The deployed app
rendered the recovery panel on every route instead of a white page — the exact
scenario it was built for, under production conditions. Worth recording because
it is not a test anyone would have designed.

**Two console errors, both benign and both pre-existing**, confirmed rather
than assumed:
- `401` on `auth/v1/user` with no session — Supabase's normal signed-out
  response. Verified by curling it directly.
- `400` from `google.co.in/ads/ga-audiences` — the Google Ads remarketing ping
  in the GTM container, which 400s when no Ads account is linked. Confirmed not
  ours because it appears on `/terms-of-service`, which fires no mirrored
  analytics events at all.

## 0.5 Confirmed by the post-run query

`retention_trigger 1 · pg_cron 1 · events_logged 1 · events_with_real_ip 1 ·
quotas_enforcing false · anon_callable_functions 19`

- **Retention runs, twice over.** Both the trigger and `pg_cron` installed, so
  the 90 days the privacy policy promises is now performed rather than hoped
  for.
- **`ip_hash` is real.** It is not the hash of an empty string, so
  `request.headers` IS exposed on this project and the network-based bot
  signals in `read_suspicion` work. Better than expected.
- **Logging works.** The signed-in read used to test the gate was recorded.
- **Quotas off**, as intended.

- [x] ~~19 anon-executable functions, unaudited~~ **All 19 audited
      empirically, and there is no new hole.** The number was alarming; the
      content is not. Each was called over REST as an anonymous caller rather
      than reasoned about from its name.
      - **6 trigger functions** (`update_updated_at_column`,
        `set_papers_updated_at`, `update_page_content_updated_at`,
        `prevent_role_escalation`, `calculate_age_from_dob`,
        `calculate_student_age_from_dob`) — PostgREST answers `PGRST202` and
        will not route them at all, because they return `trigger`. The grant is
        inert.
      - **4 pure helpers** (`extract_phone_from_link`,
        `normalize_phone_to_10_digits`, `combine_areas`,
        `generate_unique_slug`) — they transform input the caller already
        holds. `extract_phone_from_link` reads worst and is harmless: given
        `wa.me/919830012345` it returns `919830012345`, which is the number you
        just typed. It looks nothing up.
      - **2 public aggregates** (`home_facet_counts`,
        `get_teacher_upvote_count`) — numbers already printed on the page.
      - **7 SECURITY DEFINER** — the three gates, `is_admin` (false to anon),
        the two sign-in checks that must answer pre-auth, and `paper_file_url`,
        which I flagged on sight and which turns out to be correctly gated by
        `20260909000003`: it returns null to anon, verified.
      Keep the corrected query (4b, `has_function_privilege`) as the standing
      check. The old string match on `proacl` silently missed every function
      with a NULL ACL, which is every function nobody has touched.

- [x] ~~`papers.file_url` readable by `authenticated`~~ **Investigated, and I
      am reversing my own recommendation: do NOT revoke it.**
      Tracing the callers changed the answer.
      **No query in `src/` selects `file_url` at all.** Browse, PaperResults
      and Account all use explicit column lists that omit it, so the download
      link at `paper-sheet-card.tsx:132` is dead code — `paper.file_url` is
      always `undefined`. The only consumer is the admin review screen.
      **The revoke would have bought nothing and cost something.** An admin is
      an `authenticated` user, so they could call `paper_file_url()` regardless
      — the privilege is identical either way. What the revoke would actually
      do is blind the admin's own review screen to which papers have files.
      Checked for data loss specifically and there is none: the only
      `update()` calls set `is_published` alone and never write `file_url`
      back. That was the thing worth ruling out before dismissing this.
- [x] **The real defect here was the `select('*')`, and it is fixed.**
      `admin/papers.tsx` fetched with `select('*')`. PostgREST expands `*` to
      the columns a role MAY read and does not error on the rest, so any future
      column revoke turns that query into a silently smaller row — no failure,
      no warning, fields just become undefined. That is the exact pattern
      behind the seven-query incident earlier in this series, one of which
      blanked every teacher card for every signed-out visitor. Now an explicit
      column list, so that decision would fail loudly instead of quietly
      emptying the admin screen.
      Swept the rest: only `Shikshaqmine`, `papers` and `bank_questions` carry
      column-level revokes, and the two remaining `select('*')` calls against
      them — `admin/teachers.tsx:163` and `TeacherDashboard.tsx:230` — are the
      ones deliberately paired with `admin_teacher_contacts()` and
      `teacher_own_contact()`. Those are the designed pattern, not an oversight.

## 0.7 Design-system audit, every template, 375px and 1280px

Swept after the token consolidation, because 268 changed call sites needed
proving rather than assuming. 85 routes reduce to ~18 distinct templates (35 of
them are the same subject-landing component), and each was checked at both
widths with a probe rather than by eye.

**Result: zero concentric-corner breaks, zero half-pixel font sizes, zero
horizontal overflow, on every template at both widths.**

Templates covered: home, browse/subject landing, past-papers index, paper
detail, paper results, teacher profile, school, schools, subjects, about, faq,
contact, help/more, privacy, terms, blog, submit-a-paper, recommend-teacher,
join, account (which `/liked-teachers` and `/dashboard/student` redirect into),
and 404.

**How concentric corners were checked**, so the next person can repeat it: for
every element with a radius, find the nearest ancestor that also has one, and
require `inner == outer - inset` within 2.5px. Two exclusions matter, and
without them the check is noise:
- **pills are not concentric partners.** A `9999px` chip inside a 30px card is a
  chip. The first version of the probe flagged five "breaks" on the home page
  that were all pills and badges.
- **only flush nested surfaces count.** The element must be inset by roughly the
  same amount on all four sides. A badge pinned to one corner is inset on two
  sides and no concentric rule applies to it.

**Observed radii, all on the scale:** 2, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28,
30, 32, plus `9999px` pills and `4px` from Tailwind's bare `rounded`.

Two things the probe surfaces that are **not** defects, noted so they are not
re-reported: `truncate` ellipsising long school and teacher names is that class
working, and `11px` labels are a deliberate scale rung (the 11.5px one became
12px in the token pass).

## 0.9 Every `/opacity` on a theme colour is dead. All 40 of them.

Found while frosting the nav menu, and it is the most widespread defect on this
page.

**Tailwind can only inject an alpha channel into a CSS-variable colour when the
theme defines it with the `<alpha-value>` placeholder.** Nothing in
`tailwind.config.ts` does — `card` is `hsl(var(--card))`, not
`hsl(var(--card) / <alpha-value>)`. When the placeholder is missing Tailwind
**emits no declaration at all** rather than erroring, so the class silently does
nothing and the element falls back to transparent or to an inherited colour.

Measured against the built CSS: **40 distinct classes written, 0 generated.**
Among them `bg-panel/45` (the shared sheet/dialog scrim — so **no modal on the
site has ever dimmed its background**), `text-background/70` ×14,
`text-background/60` ×10, `bg-muted/80` ×7, `bg-foreground/10` ×6,
`bg-card/90`, `bg-brand/25`, `bg-brand-blue/85`.

This is the same failure that shipped the capture shield invisible, and the
`warm-*` block already carries a "literal-hex vars, so no `/opacity`" warning —
but the rule is broader than that comment says: it applies to the `hsl()` tokens
too, because none of them carry `<alpha-value>` either.

- [x] The sheet/dialog scrim is fixed — `bg-[#1B1A18]/45`, a literal hex, which
      takes the modifier. Verified: `rgba(27, 26, 24, 0.45)`. Every modal in the
      product now dims its background, which is what the spec always said.
- [ ] **`P1` Fix the root cause: add `<alpha-value>` to the `hsl()` tokens.**
      One line per token (`hsl(var(--card) / <alpha-value>)`), after which
      `bg-card/75` works everywhere and the remaining ~38 classes come alive.
      **They come alive all at once**, which is 38 places that currently render
      with no colour declaration suddenly rendering translucent — an improvement
      per the authors' intent, but a broad visual change that needs a pass over
      the site. Do it as its own piece of work, not folded into something else.
- [ ] **`P2` The literal-hex tokens still cannot take `/opacity` at all**
      (`panel`, and everything in the `warm-*` block). `<alpha-value>` cannot
      help those; they would have to be stored as channels. Use an explicit
      literal-hex class or an arbitrary `hsl(var(--x)/0.75)` value instead.

## 0.95 Security review follow-ups, 2026-09-19

A `/security-review` pass over the branch found **no HIGH or MEDIUM
vulnerabilities**. The two items below came out of it and are fixed.

- [x] **The in-body guards did not stop `anon`.** `20260818120000` wrote them as
      `IF auth.uid() IS NOT NULL AND NOT is_admin()`. For an anonymous caller
      `auth.uid()` is NULL, so the condition is false and **no exception is
      raised** — it caught a signed-in non-admin and waved through anon, the
      opposite order to the one you would pick. Not exploitable: EXECUTE is
      revoked from every client role and granted only to `service_role`. It
      still mattered, because that file calls these a layer "a future GRANT
      cannot silently reopen", and the next person restoring a grant would have
      been relying on a protection that was not there. One of the two returns
      every account's id and email.
      Fixed in `20260919090000` — **pending a run**. It does not retype either
      body: the larger one is renamed aside and wrapped, the technique
      `20260818120000` itself used, because restating a 50-line
      `INSERT ... ON CONFLICT` merge is how you introduce a worse bug than the
      one you set out to fix. (I tried retyping it first and got three details
      wrong before checking.)
- [x] **A stale grant in `scripts/generate-bank-sql.ts`.** It emitted
      `grant select on public.bank_questions to authenticated`, which
      `20260918100000` revoked nine days after that line was written. Nothing
      was exposed — the output is gitignored, is not a migration, and only
      reaches the database if a human pastes it — but the file is regenerated
      rather than read, so it was a footgun aimed at whoever next runs an
      import. Removed, and `src/lib/bank-sql-grants.test.ts` now fails if it
      returns. The test was checked by reintroducing the grant and watching it
      fail, because a guard nobody has seen fail is not yet a guard.

**Noted, not fixed:** `home_facet_counts` is called from `Index.tsx` but has no
migration in the repo, so it was created outside the migration history and its
body cannot be reviewed here. Worth capturing into a migration so the schema is
reproducible from this repo alone.

## 1. Open now

- [x] ~~Anonymous callers could read 206 children's profiles and delete the
      audit log~~ **CLOSED AND VERIFIED 2026-09-18.** `RUN_THIS_ONE.sql` was
      applied. Re-curled production afterwards as an anonymous caller holding
      only the publishable key:
      `get_public_profile_data`, `purge_read_events`, `teacher_own_contact`,
      `admin_teacher_contacts` and `is_teacher` all return **42501 permission
      denied** — 110 bytes of error where there used to be 52,753 bytes of
      names, schools and grades. `read_quota_exceeded` and
      `reset_approval_on_edit` return 404.
      Note for next time: the refusal code is **401/42501, not the 404 I
      predicted**. PostgREST hides some things and refuses others; read the
      body, not the status.
      No regressions, checked with a real signed-in token rather than assumed:
      a signed-in student gets the **full 40-question paper** while anon gets
      2; `teacher_own_contact` answers 200 so the teacher dashboard still
      loads; a direct `bank_questions` select returns 403 so the bulk dump
      stays shut; and `admin_teacher_contacts` refuses a non-admin from its
      **own body** rather than its grant — the two-layer pattern doing exactly
      what it exists for, since the grant alone would have handed a student 148
      phone numbers.
- [x] ~~No error boundary~~ **Done.** Two boundaries: one outermost for a
      provider failing at boot, one around `<Routes>` so a broken page keeps the
      chrome. Verified by injecting a real render-time throw into `/faq` — the
      recovery panel rendered, the bottom nav survived, the page was not blank.
      Deliberately styled with inline CSS and a plain `<a>`, because anything it
      depended on could be the thing that broke.
- [ ] **`P1` Error reporting is weaker than it looks.** Correcting my own
      earlier note: `logger.error` *does* forward to Microsoft Clarity in
      production, so it is not zero. But there are no stack traces, no alerting
      and no search by message, so nobody finds out unless they go looking. The
      `ErrorBoundary` is where a real service plugs in.
- [x] ~~Free-preview copy change~~ **Done.** Verified the live RPC hands an
      anonymous caller exactly 2 questions, then flipped the one constant the
      seven copy sites read from, so the page no longer promises five and
      delivers two. Checked in the browser: the paper page now reads "the first
      two questions ... no account needed".
- [~] **Retention is written and queued to run.** `RUN_THIS_ONE.sql` installs
      two mechanisms, because the reliable one may not be available: `pg_cron`
      if this project can enable it, and an insert trigger on `read_events`
      that purges at most hourly and needs no scheduler and no extension. The
      trigger only runs when someone reads something, but a table nobody is
      writing to is not growing, so the case it misses is the case that does
      not matter. **Pending the SQL file being run.**
- [~] **`ip_hash` health is now a query rather than a question.** Section 3a
      of `RUN_THIS_ONE.sql` prints its own verdict: blind, working, or no data
      yet. If blind, the network-based bot signals do not work and the
      account-based ones still do — and the account is the real threat.
      **Pending the SQL file being run.**
- [x] ~~11 production dependency vulnerabilities, untriaged~~ **Triaged and
      down to 3.** `npm audit fix` (no `--force`, so no majors) took production
      from 11 to 3 and from 4 high to **zero high**. What remains, and why:
      `dompurify` (moderate, **no fix published**, and it is pinned to a git SHA
      rather than a release); `react-router` / `react-router-dom` (moderate,
      open redirect, fix requires the v7 major — not a bump to make in launch
      week). The critical and high that `npm audit` now reports are `vitest` and
      `vite`, both **dev-only and never shipped**: the vitest advisory concerns
      its UI server, which is never started here.
- [x] ~~Router open redirect treated as a library problem~~ **It was our code,
      and it was reachable.** Chasing the advisory found the same hand-written
      check in four places —
      `!!path && path.startsWith('/') && !path.startsWith('//')` — guarding the
      `redirect` query parameter on `/auth`, `/select-role` and
      `/teacher-terms-agreement`. A backslash defeats it: `/\evil.com` starts
      with one slash, is not `//`, and the browser normalises it into a
      protocol-relative URL. Working chain: send a parent a genuine
      `shikshaq.in/auth?redirect=…` link, they sign in with Google on the real
      site, and land somewhere that is not ours still believing it is.
      Replaced with `src/lib/safe-redirect.ts`, which resolves the candidate
      against our own origin using the same parser the browser will use, so it
      is correct by construction rather than by having guessed the tricks.
      37 tests, every published bypass among them. Verified live: `/%5Cevil.com`
      stores nothing, `/faq` still works.
- [~] **`check_user_exists` assessed by query, not by guess.** Section 3b of
      `RUN_THIS_ONE.sql` tests a real address against a fake one and prints
      which of three states it is in: a working enumeration oracle worth rate
      limiting, inert/broken, or always-true. It stays anon-callable either way
      because sign-in calls it pre-auth. **Pending the SQL file being run.**

## 2. Security and data

- [x] `anon` cannot read question bodies, WhatsApp, phone, email or paper files
      — verified by curl, not by reading policy
- [x] `authenticated` cannot either, as of `20260918100000`
- [x] Bulk dump closed: was 148 contacts in one request and 46,873 questions in
      ~47; now every read goes through a function that sees `auth.uid()`
- [x] Every gated read is logged to `read_events`, unreadable over REST
- [x] Preview tools and their credentials compile out of a live build, proven
      with a control grep
- [x] Preview tools also refuse to render on the live hostname regardless of
      env config, because that config lives in a Vercel account we cannot see
- [ ] **`P1` Quota thresholds are guesses.** `enforcing = false` and should stay
      so until `read_events` has 2–4 weeks of real traffic. Set above the
      observed p99.
- [ ] **`P1` Google-only sign-in.** 545 of 553 already use it; 9 password
      accounts need contacting first. Its value is making per-account quotas
      expensive to evade, so it belongs after quotas are on.
- [ ] **`P2` Canary teacher rows** for attribution. Decided as a product call,
      not a migration.
- [ ] **`P2` No ToS clause covering bulk extraction**, and no prepared takedown
      template. A day's work that gives legal standing.
- `ACCEPTED` Screenshots cannot be blocked on the web, on any platform. The
  shield blanks text on detectable chords and focus loss; a phone camera defeats
  all of it.
- `ACCEPTED` Glyph substitution is a reversible cipher. It defeats naive
  extraction and keyword matching; someone who recognises it undoes it with a
  public table.
- `ACCEPTED` Screen readers read protected prose as Cyrillic. Owner's explicit
  decision, recorded in `src/lib/glyph-substitution.ts`.

## 3. Reliability and observability

This is the weakest area and the one with the least attention on it.

- [x] ~~No tests at all~~ **Started: 37 tests, and a CI gate.** `npm test`
      (vitest 2, pinned to match vite 5) covers the glyph-substitution round
      trip, `canonicalPathFor`, and the free-preview number/word agreement.
      **The first run found a real bug**: `canonicalPathFor('//')` returned an
      empty string, so a request with a stray double slash emitted a canonical
      URL with no path. Fixed in the same commit.
      `.github/workflows/ci.yml` gates on `tsc -b` and `npm test`, and reports
      lint without blocking — there are 855 pre-existing lint errors and a gate
      that is red on arrival gets ignored inside a week.
- [ ] **`P1` Extend coverage to the expensive silent breaks.** Still untested:
      the `bank_paper_questions` gate returning the right count per auth state,
      the sitemap generator's row counts, and the prerenderer's
      no-question-text assertion. Each needs either live credentials or a
      fixture layer, which is why they did not come first.
- [x] ~~855 lint errors~~ **There were 108, and now there are none.**
      Correcting my own number: eslint was linting `.claude/worktrees`, seven
      stale copies of this whole codebase, so every finding was counted about
      seven times. They are gitignored and are now lint-ignored too.
      Of the real 108, **103 were `no-explicit-any`**, now a warning — the
      compiler already runs with `strict: false` and `noImplicitAny: false`, so
      erroring on the explicit annotation while permitting the silent implicit
      one punishes the honest form. The other five were fixed, including a
      `return` inside a `finally` in `Browse.tsx` that swallows nothing today
      but would eat an exception the moment that `catch` started rethrowing.
      **Lint now blocks in CI.**
- [x] Error boundaries in place — see section 1
- [ ] **`P1` No alerting on the errors that are reported** — see section 1
- [ ] **`P1` No uptime check.** Nobody is told if the site stops serving.
- [ ] **`P1` Nobody can read the live Vercel build logs.** A failed deploy is
      diagnosed by guessing. This shaped real decisions here: the sitemap
      generator fails hard, and native dependencies were avoided.
- [ ] **`P2` No staging database.** Both deployments share one Supabase project,
      so every migration is production. Mitigated by writing rollbacks inline;
      not solved.
- [x] Sitemap generation fails the build rather than shipping a truncated file
- [x] Prerender asserts no question text reaches `dist/` and fails the build

## 4. Performance

- [x] First paint 341 kB → 301 kB gzip
- [x] `index-*.js` 454 kB → 313 kB
- [x] `BankPaper` 283 kB → 74 kB (KaTeX split out)
- [x] Footer no longer scans all 1,282 `bank_papers` rows on every page load
- [x] KaTeX memoised — was re-parsing every formula on every keystroke
- [x] Search index no longer speculatively downloads ~550 kB on metered
      connections
- [x] ~~Paper figures are unresized~~ **Done, and the framing was wrong.**
      "25 MB across 1,023 files" sounds library-wide and is not: a reader opens
      ONE paper, and the **median paper carries 58 kB** of figures. The real
      finding was the distribution — **one paper shipped 4.3 MB on its own**, a
      fifth of the whole directory, from 21 scans of 250–312 kB.
      So `scripts/resize-paper-figures.ts` caps height at 600px (2× the
      `max-h-[300px]` render) and re-encodes at WebP q82, but **only above
      40 kB**. Measured: touching 87 files captures 20% of the bytes, touching
      all 1,023 captures 25%, and that last 5% costs a lossy re-encode of 936
      images that are already fine. **21.9 MB → 17.5 MB; the worst paper
      4,395 kB → 2,284 kB.**
      Quality checked on the hardest case before applying — the largest file, a
      graph-paper scan — rendered at the size a reader sees. Indistinguishable:
      scale text, axis numbers and grid all equally legible.
      **`sharp` is deliberately NOT in `package.json`.** Vercel installs
      devDependencies, so an entry there would put a native build in the deploy
      path of a site whose build logs nobody here can read. Install it ad hoc,
      run the script, let it go. The script is excluded from `tsconfig.node.json`
      for the same reason, so the CI gate does not fail on a module that is
      correctly absent.
      `figure-dimensions.ts` was regenerated and **all 1,023 entries verified to
      match their files** — a resize without that would have reinstated the
      layout shift those numbers exist to prevent.
- [~] **Teacher photos: the 64 on Cloudinary are now sized; the 79 on Supabase
      cannot be.** They were served at upload resolution into cards ~150px wide
      and 30px avatars. `imageAtWidth()` in `imageSanitizer.ts` asks the CDN for
      the width actually painted (`w_400,q_auto,f_auto`), wrapping
      `validateImageSrc` so sanitisation still runs first.
      **Measured on the photos Browse actually loads: 1.6 MB → 451 kB, a 73%
      saving.** Not the 98% a single file suggested — that was one 1.81 MB
      outlier, which does go to 32 kB, but the typical photo is 76 kB → 20 kB.
      Quoting the outlier as the norm would have been the wrong number.
      **Supabase's `/render/image/` endpoint answers 403 on this project** — it
      is plan-gated and this plan lacks it, verified rather than assumed — so
      79 of 148 photos pass through untouched and stay at upload size. Fixing
      those needs either a plan change or re-hosting them on Cloudinary.
- [ ] **`P2` ~~Teacher photos are served at full resolution~~ The 79 Supabase
      photos still are**, including into
      30px avatar circles. No Supabase image transform anywhere.
- [ ] **`P2` No real-user performance data.** All measurements here are local.
      Core Web Vitals from actual Kolkata connections would change priorities.
- [ ] **`P2` Browse accumulates unboundedly** while scrolling — up to 3,000
      cards in the DOM, no virtualisation.

## 5. SEO and discovery

- [x] 1,700 routes prerendered with their own title, canonical, OG and JSON-LD
- [x] Verified working on real Vercel at the bare extensionless path
- [x] Sitemap 1,560 → 1,830 URLs; the 1,000-row truncation is fixed
- [x] Placeholder-content papers excluded from both sitemap and prerender
- [x] Teacher bio prose does not reach prerendered HTML — re-verified 2026-09-18
      by pulling seven real `Description` values from the live database and
      searching all 148 prerendered teacher files for a distinctive interior
      slice of each. Zero hits. The only `description` in a teacher page's
      JSON-LD is the site-level boilerplate, and its `<meta name="description">`
      is generated from structured fields (subjects, classes, area), not from
      the prose. Metadata ranks; the amassed writing stays behind the app.
- [x] Stale titles on navigation fixed; one source of SEO defaults
- [ ] **`P1` Nothing is in Search Console yet** for the new URLs. Submit the
      sitemap on launch and watch coverage, not just impressions.
- [ ] **`P1` Pages are frozen at build time.** Deploy hooks are unavailable, so
      publishing a paper needs a manual redeploy before it can be indexed. Write
      this into whoever's runbook publishes papers.
- [ ] **`P2` Measure the 5 → 2 preview cut.** Signup conversion from paper pages
      and `/past-papers/*` position, four weeks either side. It is one integer
      if it turns out to cost more than it saves.

## 6. Design and responsiveness

- [x] All 11 key routes verified at 375px and 1265px: zero overflow, one `<h1>`
- [x] `viewport-fit=cover` added — eight safe-area call sites were inert on iOS
- [x] iOS zoom-on-focus fixed on three inputs
- [x] Touch-scroll trap removed from the dashboard option groups
- [ ] **`P1` Nothing has been tested on a real phone.** Everything here is
      browser emulation, and emulation lied twice during this audit — once
      reporting 200px of phantom overflow, once reporting a collapsed viewport.
      One session on a real mid-range Android would be worth more than another
      emulated pass.
- [x] ~~Half-pixel type and near-duplicate radii~~ **Consolidated, 268 call
      sites plus the tokens themselves.** The measured cause of the site
      reading as "vibe coded": one page used **39 distinct font sizes** (615
      usages), fifteen of them between 10 and 17.5px including eight inside a
      3.5px range, plus 15 border radii (30 *and* 32, 18 *and* 20, 22 *and*
      24), 13 paddings and 17 gaps.
      Every half-pixel size now snaps to the nearest whole pixel, rounding up
      so text never gets smaller. The two half-pixels that survived the first
      pass lived in the tokens rather than the call sites — `meta` was 13.5px
      and `label` was 11.5px — and were fixed there, which also makes `label`
      the one merge that is an accessibility gain: uppercase at 11.5px was the
      smallest type on the site. The dead `12.5`/`14.5`/`15.5` rungs were
      removed, because a scale offering 14 *and* 14.5 invites the drift it
      exists to stop.
      Radii merge only into a neighbour 1–2px away that is clearly more used.
      One merge went the wrong way at first — `rounded-[30px]` became 32 when
      30px is the named `bento` token with real call sites — so those moved to
      the token instead.
      **Resulting radius scale: 2, 6, 10, 12, 14, 16, 18, 20, 24, 30, 32.**
      Zero half-pixel font sizes render anywhere. Verified on 7 routes at 375px
      and 1280px: no overflow, no new clipping, no visual change.
- [ ] **`P2` ~376 `text-[Npx]` sizes, zero rem** — browser text scaling does
      nothing. Gated as "top 20 components, measure, decide".
- [x] ~~The glass tracked the pointer and the gyroscope~~ **Removed.** It read
      as a fault rather than as glass: a specular that chases the cursor keeps
      announcing itself, so the eye goes to the panel instead of through it,
      and on chrome rather than content that is exactly backwards. The hook and
      both listeners are gone. What remains is lit from above, which is the one
      direction that needs no explanation, and it also removes the whole
      reduced-motion and iOS-permission surface that tracking dragged in.
- [ ] **`P2` The frosted glass is not verified on a real device.** It is now on
      four surfaces — the menu sheet, the mobile header pill, the desktop top
      bar and the bottom nav — sharing one `.glass` material in `index.css`
      with a light and a dark body.
      **Contrast is the thing to watch.** A translucent bar over arbitrary
      content is a legibility trade; the bodies sit at 0.55 and 0.62 with a
      40px blur, which held up over the busiest part of the home page here, but
      "held up in my emulator" is not the same as a parent reading it outdoors.
      **Cost is unmeasured.** Four simultaneous `backdrop-filter: blur(40px)
      saturate(200%)` surfaces, two of them fixed over a scrolling page, is now
      the most expensive paint in the product by some distance. It is fine on
      this machine. A mid-range Android is the case that matters and it has not
      been tried.
      `useGlassReflection` drives the highlight from `deviceorientation` where
      it is free (Android, desktop sensors) and from pointer everywhere else. It
      **deliberately never calls `DeviceOrientationEvent.requestPermission()`**:
      iOS gates the sensor behind a system dialog, and asking a parent for
      motion access so a menu can be shiny is not a trade worth making. On iOS
      the highlight therefore follows touch, which is untested on hardware.
      Reduced-motion turns the tracking off entirely (not damped) and the static
      rim remains — verified by reading the code path, not by emulating the
      setting, which this browser pane cannot toggle.
      Also unmeasured: a 40px `backdrop-blur` with `saturate(200%)` on a
      scrolling panel is the most expensive paint in the product. It is fine on
      this machine; a mid-range Android is the case that matters.
- `ACCEPTED` **True Liquid Glass refraction is not implemented**, because CSS
      cannot do it. Apple's material bends content at the rim like a lens, which
      needs an SVG displacement filter on the backdrop and is not reliably
      supported. What is here is heavy blur, a 200% saturation lift so colour
      survives rather than greying, a static sheen and rim light on the top lip,
      and layered inset shadows for thickness. It reads as glass; it does not
      refract, and chasing that with motion was tried and reverted.
- [ ] **`P2` The capture shield fires on every alt-tab**, blanking text for
      2.2s. Correct mechanism, possibly intrusive in real use. One constant.
- [ ] **`P2` No dark mode** despite tokens existing for it.

## 7. Codebase health

- [x] `npx tsc -b` clean (note: `--noEmit` checks nothing here — project refs)
- [x] eslint clean on everything added this session
- [x] Seven queries naming revoked columns found and fixed — a whole class of
      silent failure
- [x] CI runs typecheck and tests on every push — see section 3
- [ ] **`P2` `src/pages/` has four unrouted pages** (~95 KB) kept deliberately.
      Not shipped, but they confuse a reader.
- [x] ~~Three unused dependencies~~ **Removed**, with the three shadcn
      components that were their only importers and that nothing imported in
      turn. 40 packages out of `node_modules`.
- [x] ~~Six caching layers, hard to reason about~~ **Mapped, and it was hiding
      a live bug.** The layers turn out to be mostly split by domain and that
      split is defensible: teacher data in `src/utils/cache.ts` (localStorage,
      5 min to 24 h TTLs), papers and counts in React Query (in-memory, 5 min
      stale). The module-load `clearExpiredCache()` scan was already fixed.
      **What the duplication was actually costing:** the site's three headline
      numbers were fetched five different ways, and the Navbar counted the
      wrong table. It read `papers` (**18** rows) while the Footer, About and
      the papers announcement read `bank_papers` (**1,282**). The menu said
      "18, free to read" while a footer one screen down said 1,282 — the same
      site disagreeing with itself by a factor of 71.
      That bug had already been found and fixed on About, whose comment says
      that page "was the only surface reading the old one". It was not. Fixing
      one copy fixed one copy.
      All four hand-rolled copies now use `useSiteCounts`. This also removed a
      `fetchBankSchoolValues(true)` call in the papers announcement that paged
      every one of the 1,282 rows (~100 kB) to count distinct schools — exactly
      what `site_counts()` was written to replace. Verified live: the menu now
      reads "1282, free to read".
- [ ] **`P2` ~~Six~~ Remaining hand-rolled caches** with their own TTL logic:
      `upvotes-context.tsx` and `use-toggle-relation.ts` each roll their own
      localStorage-plus-timestamp. Smaller than the counts problem and not
      currently wrong, but they are the same shape.
- [x] ~~CLAUDE.md is stale~~ **Corrected.** It said 193 papers, 70 school
      pages, five free questions and a working branch of `redesign/handoff-v1`.
      Now: 1,282 papers, 273 schools, 1,258 and 259 prerendered, two free
      questions, `shikshaq-2.0`. It is what every future session reads first,
      so a stale number there propagates.

## 8. Data integrity

- [x] 24 papers with placeholder question bodies excluded from public surfaces
- [ ] **`P1` The underlying import is still wrong.** "Questlon-1" is an OCR
      misread. 99 placeholder bodies and 1,222 under 15 characters remain in the
      bank; the exclusion hides them rather than fixing them.
- [ ] **`P1` The exclusion list is hardcoded** in `scripts/excluded-papers.ts`
      and must be regenerated after every import. The real fix is a
      `has_readable_body` column maintained at import time.
- [ ] **`P2` No verified backup/restore drill.** Supabase takes backups;
      nobody has tested restoring one.
- [ ] **`P2` `question_count` can disagree with reality** — one paper claims 15
      and has 3.

## 9. Commercial, analytics and the business view

- [x] GA4 and Microsoft Clarity are live
- [x] WhatsApp contact clicks are tracked per teacher
- [x] ~~Nothing measures the funnel that matters~~ **Done, and it was not
      missing instrumentation.** Every step was already recorded — exactly once
      each — through `recordSignal`, and all of it stopped at the device in
      localStorage. The funnel was being measured and thrown away.
      `src/lib/intent/analytics-mirror.ts` forwards a curated allowlist to GA4
      and Clarity from that one chokepoint: `search_submitted`,
      `filters_applied`, `builder_submitted`, `teacher_viewed`, `paper_viewed`,
      `teacher_saved`, `contact_started`, `contact_completed`. Weak, high-volume
      signals are deliberately excluded, and no query text, name, path or image
      URL is ever sent.
      **Two defects in the funnel itself, found while wiring it up and fixed:**
      `contact_started` lived inside `openSignInSheet`, so a signed-out reader
      pressing **Save** recorded a contact they never started, and a
      **signed-in** reader pressing Message recorded nothing at all — the middle
      of the funnel was missing for exactly the people most likely to complete
      it, while being inflated by people who only bookmarked someone.
      Verified in a real browser: `teacher_viewed` and `contact_started` both
      fire with `teacher_slug`, `subject` and `area`; pressing Save now fires
      nothing.
- [ ] **`P1` No teacher-side view.** 148 teachers are the supply, 31 have
      accounts. Nobody knows which listings get seen or contacted, which is the
      single most useful thing to tell a teacher to keep them engaged.
- [x] ~~Privacy policy silent on `read_events`~~ **Written and deployed.**
      Says what is recorded (that a paper or contact was opened, the account, a
      one-way hash of the network address), what is not (dwell time, anything
      typed), why it exists (telling a student working through past papers
      apart from a script taking all of them), that it is never sold or shared,
      and that it is deleted after 90 days. The 90 days is why the retention
      item above had to stop being aspirational — a policy must not promise a
      deletion that nothing performs.
- [ ] **`P2` No consent mechanism** for analytics. Worth checking against Indian
      DPDP Act obligations for minors' data specifically.
- [ ] **`P2` 553 accounts, ~50 active in 90 days.** Nobody is measuring
      retention or why the other 500 stopped.

## 10. Operational

- [x] One branch, both remotes, same commit — the invariant holds
- [x] `push:all` targets the launch branch rather than a stale hardcoded name
- [x] Repo cleaned: 23 branches → 2, with unique work preserved as tags
- [ ] **`P0` Live Vercel is inaccessible.** Cannot read logs, set env vars, use
      deploy hooks, or configure the firewall. This is the single largest
      constraint on everything above and should be resolved as an access
      question, not engineered around indefinitely.
- [x] ~~Launch is a manual merge with no rehearsal or rollback~~ **Both done.**
      Rehearsed: `origin/main` is an **ancestor** of `shikshaq-2.0`, so the
      launch is a fast-forward with zero conflict risk, and the dry run prints
      `593c447..ef862f8`. Rolling back is one command against a tag rather than
      a SHA hunted out of scrollback:
      `git push --force-with-lease origin pre-2.0-live:main`.
      Full sequence, failure modes and post-launch checks in `docs/LAUNCH.md`.
- [ ] **`P2` `SUPABASE_SERVICE_ROLE_KEY` is in a local `.env`.** Correct that it
      is unprefixed and never reaches Vercel; worth confirming nobody has copied
      it anywhere it could leak.

---

## How this list is used

An item moves to `[x]` only when it has been verified against the running
system, with the evidence stated. "I changed the code" is not done; "I changed
the code and the request that used to return 200 now returns 401" is.

Two things this audit is a standing reminder of:

**Measure the right thing.** `innerWidth` said no overflow while
`clientWidth` said 143px; sampling a container said text was not blanked while
its children were transparent; a stale console buffer produced 401s that had not
happened for an hour. Three findings that looked real and were not, and one that
looked like nothing and was a live hole.

**Two layers, always.** `admin_teacher_contacts()` survived a grant mistake that
exposed every other function, because it also checked `is_admin()` in its body.
Everything else was protected by one thing, and one thing was not enough.
