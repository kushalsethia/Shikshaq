# Guardrails — working checklist

The standing list of what protects this product, what does not yet, and what is
deliberately accepted. Not a plan with an end date: items get ticked, new ones
get added, and the "accepted" section is as important as the open one.

Every claim here was checked against the running system, not inferred. Where a
number appears it was measured. Where something is unverified it says so.

**Priority key:** `P0` before launch · `P1` first weeks after · `P2` when it
earns attention · `ACCEPTED` known and deliberately not doing

---

## 1. Open now

- [ ] **`P0` Run `20260918140000_revoke_execute_by_role_name.sql`. STILL OPEN,
      RE-CONFIRMED LIVE 2026-09-18.** Not theory and not stale: curled against
      production today, as an anonymous caller holding only the publishable key
      that ships in the bundle.
      - `POST /rpc/get_public_profile_data` → **200, 52,753 bytes, 206 rows**,
        each with `full_name`, `school_college`, `grade`, `role` and
        `avatar_url`. Real named children at named Kolkata schools, in one
        request, by anyone. This is the single most serious item on this page.
      - `POST /rpc/purge_read_events` → **200**. An unauthenticated DELETE
        against the audit table, so a scraper can trim the record of their own
        scraping.
      `revoke … from public` does not remove Supabase's direct `anon` grant, so
      the previous migration did not close these. The corrective file is written
      and ready; it has not been applied.
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
- [ ] **`P1` Schedule `purge_read_events()`.** 90-day retention is written but
      nothing runs it. `pg_cron` is not installed. Retention that starts late is
      retention that did not happen, and this table records what minors read.
- [ ] **`P1` Confirm `request.headers` populates `read_events.ip_hash`.** If
      every row is the hash of an empty string
      (`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`), the
      network-based bot signals are blind. Account-based ones still work.
- [ ] **`P1` 11 production dependency vulnerabilities** (4 high, 6 moderate,
      1 low; GitHub counts 51 including dev). Nobody has triaged which are
      reachable. `npm audit --omit=dev` is the real list.
- [ ] **`P2` `check_user_exists` / `check_user_has_password` are
      user-enumeration shaped** and must stay anon-callable because sign-in uses
      them pre-auth. Both return `false` for a known-real address, so they are
      either inert or broken — establish which before anyone relies on them.

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

- [ ] **`P0` No tests. None.** No test script, no test files, no CI gate.
      Everything is verified by hand, including by me this session. The first
      candidates are the ones where a silent break is expensive: the
      `bank_paper_questions` gate returning the right count per auth state, the
      sitemap generator's row counts, and the prerenderer's no-question-text
      assertion.
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
- [ ] **`P1` No CI.** Nothing runs typecheck, lint or build on push. Every
      guarantee in this file is enforced by whoever remembers.
- [ ] **`P2` `src/pages/` has four unrouted pages** (~95 KB) kept deliberately.
      Not shipped, but they confuse a reader.
- [ ] **`P2` Three unused dependencies** (`recharts`, `cmdk`,
      `embla-carousel-react`) — tree-shaken out, but they cost install time.
- [ ] **`P2` Six caching layers** with different lifetimes. Works; hard to reason
      about.
- [ ] **`P2` CLAUDE.md is stale** — says 193 papers and 70 school pages; it is
      1,282 and 259.

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
- [ ] **`P0` Nothing measures the funnel that matters.** The product's purpose
      is a parent reaching a teacher. Nobody can currently answer: how many
      visitors reach a profile, how many reveal a number, how many message.
      `read_events` will answer the middle step once it fills — the rest needs
      deliberate events.
- [ ] **`P1` No teacher-side view.** 148 teachers are the supply, 31 have
      accounts. Nobody knows which listings get seen or contacted, which is the
      single most useful thing to tell a teacher to keep them engaged.
- [ ] **`P1` Privacy policy has not been updated for `read_events`.** It records
      which papers each account opens, and many account holders are minors.
      This must land before the table fills, not after.
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
