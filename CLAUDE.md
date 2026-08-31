# Shikshaq — working notes

Kolkata tuition-teacher marketplace with a past-papers library.
React 18 + Vite + TypeScript + Tailwind + shadcn/ui, Supabase behind it.

---

## Two remotes, ONE branch

```
origin    kushalsethia/Shikshaq        public,  LIVE      -> real users
kanitest  kaxx4/shikshaqkanitest       private, TEST      -> Vercel preview
```

Working branch: `redesign/handoff-v1`. Both remotes get **the same commits**.

```bash
npm run push:all          # commits -> origin, then mirrors to kanitest/main
```

**The branches must never diverge.** Test-only behaviour is switched by an
environment variable at build time, never by different code in different
repos. Two repos with different code is two codebases, and every future change
would have to be applied and merged twice.

So: the preview tools live in this repo, on this branch, in the live build's
source tree — and are compiled out of the live bundle because the flag is
absent there. Verify with `grep -r PreviewTools dist/assets/*.js`, which
should return nothing for a live build.

If a fresh clone is missing the test remote:

```bash
git remote add kanitest https://github.com/kaxx4/shikshaqkanitest.git
```

## What differs between the two deployments

Only environment variables. Nothing else.

| Variable | live | test | effect |
|---|---|---|---|
| `VITE_SUPABASE_URL` | set | set | same project — see below |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | set | set | same project |
| `VITE_PREVIEW_TOOLS` | **unset** | `true` | role/auth preview toggle |

**Both deployments share ONE Supabase project** (`uvtifolnsneitetzohtn`).
Confirmed as intended. It means the test site reads and writes **live**
teacher, submission and account data. Treat any write from the test site as a
write to production.

The live site deploys from a Vercel account we do not have access to; only the
test project is reachable from here.

### `VITE_` variables are PUBLIC

Vite inlines them into the JS bundle as plain text. Proven:
`grep -o "sb_publishable_[A-Za-z0-9_-]*" dist/assets/*.js` finds the key.

Never put a password, service key or anything secret behind a `VITE_` prefix.
`SUPABASE_SERVICE_ROLE_KEY` is deliberately unprefixed and server-side only
(`scripts/import-bank.ts`); it must never reach Vercel.

## Standing constraints

These have been decided. Do not relitigate them, and do not quietly undo them.

- **Question-paper text is never altered.** Not cleaned, retyped, re-cased or
  "fixed". It is read from `bank_questions.body` and rendered verbatim. Any
  change to how it is stored or moved must be proven byte-exact, not assumed.
- **No em or en dashes** in site copy, terms, teacher bios or meta text. The
  bios were normalised on 2026-08-31 (`supabase/normalise-bio-dashes.sql`,
  originals in `public._dash_backup`). Teacher reviews and question text are
  deliberately exempt — those are other people's words.
- **Papers are soft-gated, not locked.** Five questions read free, the rest
  blur behind sign-in. Every question still renders into the DOM so the 193
  paper pages and 70 school pages stay crawlable. Making the gate real means
  revoking anon `SELECT`, which removes them all from Google.
- **Submit-a-paper is a real upload and review flow**, not a WhatsApp handoff.

## Architecture worth knowing

- **Papers live in Supabase**, in `bank_papers` and `bank_questions` — not in
  the repo. `data/question-bank.json` is the source of record for re-imports
  and is deliberately outside `public/` so it is never served.
- School names are resolved **at import time** (`scripts/school-names.ts`) and
  stored in `bank_papers.school`. Renaming a school is an `UPDATE`, not a
  deploy. Do not re-derive names in the client.
- The sitemap is generated at build time from Supabase (`prebuild`). If the
  env vars are missing it warns and silently omits 458 URLs rather than
  failing, so check the build log.

## Gotchas that have already cost time

- **`npx tsc --noEmit` checks nothing here.** The root config is
  `"files": []` with project references. Use **`npx tsc -b`**.
- `npm run preview` uses port 4173 and a stale one may still hold it; a
  "successful" check against an old server tests old code.
- Measuring the DOM before data loads gives false readings. Settle ~3s.
- When search results look identical for every query, you are reading the page
  *behind* the search overlay, not the results panel.
