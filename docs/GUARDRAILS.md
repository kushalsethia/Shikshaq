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

Everything below was checked against the **deployed site**
(`shikshaqkanitest.vercel.app`) and the **production database**, not against a
dev server and not by reading code. Where a check is not reproducible from
outside, that is said rather than glossed.

| Check | Result |
|---|---|
| `get_public_profile_data` as anon | **42501 permission denied** (was 206 rows, 52,753 bytes) |
| `purge_read_events` as anon | 42501 permission denied |
| `teacher_own_contact` / `admin_teacher_contacts` / `is_teacher` as anon | 42501 permission denied |
| `read_quota_exceeded`, `reset_approval_on_edit` as anon | 404 |
| `bank_paper_questions` as anon | **2 questions** |
| `bank_paper_questions` as a signed-in student | **40 questions** (full paper) |
| `teacher_own_contact` as authenticated | 200 — dashboard still loads its own number |
| `admin_teacher_contacts` as a non-admin | refused **by the function body**, not the grant |
| `bank_questions` direct select as authenticated | 403 — bulk dump shut |
| Preview copy on the live paper page | "the first **two** questions" |
| `teacher_viewed` on the live site | fires with `teacher_slug`, `subject`, `area` |
| `contact_started` on pressing Message | fires with the same three |
| `contact_started` on pressing **Save** | **does not fire** — the inflation bug is gone |
| Repeat view of the same teacher | **does not re-fire** — one visitor, one count |
| `/auth?redirect=/%5Cevil.com` | **blocked**, nothing stored |
| `/auth?redirect=/faq` | still stored — the fix is not over-broad |
| Question text in the DOM | Cyrillic homoglyphs: `"А dеаlеr іn Sіkkіm ѕеllѕ gооdѕ"` |
| `user-select` on protected text | `none` |
| PrintScreen on a paper | shield fires, overlay **opaque** `rgb(27, 26, 24)` |
| Supabase calls on Browse | 7 requests, **all 200**, zero failures |
| 375px on paper, teacher, privacy | no horizontal overflow, each with its own `h1` |
| Prerendered paper page, bare path | own title, own canonical, 3 JSON-LD blocks |

**The one console error is benign and pre-existing**: `auth/v1/user` returns 401
when there is no session, which is Supabase's normal signed-out response and
has nothing to do with the lockdown. Confirmed by curling it directly.

**Not verifiable from outside, by design** — `read_events` and its retention
bookkeeping are unreadable over REST, which is the point. The retention
trigger being armed, `read_events` logging, and whether `ip_hash` carries real
values all need the one query at the end of the runbook.

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
- [ ] **`P1` Paper figures are unresized.** 25 MB across 1,023 files, largest
      312 kB, every one painted at most 300px tall. Dimensions are set so there
      is no layout shift, but the bytes are unchanged. Needs `sharp` at build
      time or an image CDN — and someone able to watch the build.
- [ ] **`P2` Teacher photos are served at full resolution**, including into
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
- [ ] **`P2` ~376 `text-[Npx]` sizes, zero rem** — browser text scaling does
      nothing. Gated as "top 20 components, measure, decide".
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
- [ ] **`P2` Six caching layers** with different lifetimes. Works; hard to reason
      about.
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
- [ ] **`P1` Launch is a manual merge** to `origin/main` with no rehearsal and
      no rollback plan beyond `git revert`.
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
