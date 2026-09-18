# Launch runbook

Merging `shikshaq-2.0` into `main` **is** the public launch. Vercel builds the
live site from `main`, so the moment that push lands, real users get the
redesign. There is no staging step between the two.

---

## The good news, verified rather than assumed

```
git merge-base --is-ancestor origin/main HEAD   # exit 0
git push --dry-run origin HEAD:main             # 593c447..ef862f8
```

`origin/main` is **an ancestor of** `shikshaq-2.0`. The launch is a
**fast-forward**, not a merge:

- **Zero conflict risk.** There is nothing to resolve, because `main` has no
  commits we do not already have.
- Nothing on `main` is discarded, so nothing can be lost in a conflict
  resolution done under pressure.
- `main` has not moved since **13 July 2026** (`593c447`). Everything a live
  user has ever seen is that build.

`main` gains 406 commits: 271 files under `src/`, 20 migrations, and 1,028
files under `public/`.

## Before you push

1. **The database is already done.** `RUN_THIS_ONE.sql` has been applied and
   verified against production. There is no migration to run at launch, which
   removes the usual worst-case: code and schema landing out of step.
2. **Check the live Vercel env vars are unchanged.** The build needs
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`, which live already
   has, and needs `VITE_PREVIEW_TOOLS` to stay **absent**.
3. **Off-hours.** The first request after deploy is the slowest, and Kolkata
   evening is when students are reading.

## The push

```bash
git push origin shikshaq-2.0:main
```

That is the whole launch.

## If the build fails, nothing breaks

Worth knowing so nobody panics: **a failed build does not take the site down.**
Vercel keeps serving the last successful deployment. The two ways this build can
fail are both loud and both safe:

- `prebuild` generates the sitemap and now **exits non-zero** when the Supabase
  env vars are missing, rather than shipping a silently truncated file.
- `postbuild` prerenders 1,700 routes and **fails the build** if any question
  text reaches `dist/`.

Either way the old site stays up and you fix forward.

## Rollback

The live Vercel account is not reachable from here, so its dashboard rollback is
not an option. Rolling back means moving `main`. The commit that was live for
the whole pre-launch period is tagged, so this needs no SHA:

```bash
git push --force-with-lease origin pre-2.0-live:main
```

`--force-with-lease`, not `--force`: it refuses if someone else has pushed to
`main` since you last fetched, which is exactly the case where a blind force
would destroy their work.

Rolling back the **code** does not roll back the **database**, and it does not
need to. Every schema change is additive or a privilege revoke. The 13 July
build does not read `read_events`, does not call the new functions, and reads
teacher contacts through columns it still has access to. The one thing to know:
the old build shows **five** free questions in its copy while the gate now
serves **two**, so a rollback reintroduces the mismatch this launch fixed.

## After the push, check these in order

1. `https://www.shikshaq.in/` loads and shows the new home page.
2. A paper page at its bare path — `/past-papers/<id>` — returns its **own**
   title and canonical, which proves the prerendered files are being served
   rather than the SPA catch-all.
3. Signed out, a paper shows **two** questions and says "two" in the copy.
4. Sign in, and the same paper shows all of them.
5. A teacher opens their dashboard, sees their own number, **and saves**. This
   is the regression that matters most, because its failure mode is silent.
6. `select count(*) from public.read_events;` rises as you browse.
7. The live bundle contains none of `PreviewRoleToggle`, `IntentDebugPanel`,
   `TEST BUILD`, `preview-student@`.

## What launch does not fix, and is fine

- **Pages are frozen at build time.** Publishing a paper needs a redeploy for it
  to appear in the prerendered HTML and the sitemap. Deploy hooks are not
  available, so that redeploy is manual.
- **Quotas stay off.** `enforcing = false` until `read_events` has two to four
  weeks of real traffic. Do not turn them on for launch day.
- **Nobody can read the live build logs.** That constraint shaped several
  decisions above, including why both build steps fail loudly rather than
  degrading quietly.
