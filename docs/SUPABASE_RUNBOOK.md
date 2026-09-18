# Supabase runbook

Everything that does not touch the database is done, tested and deployed.

**There is exactly one thing left to run:**
[`supabase/RUN_THIS_ONE.sql`](../supabase/RUN_THIS_ONE.sql)

Paste the whole file into the Supabase SQL editor. It is idempotent, each
section is wrapped so a failure applies nothing, and every rollback is written
inline beside the thing it undoes.

**There is no test database.** Both deployments share `uvtifolnsneitetzohtn`, so
this is production the moment it runs. Prefer Kolkata off-hours.

---

## Why it is urgent

Verified by curl against production on 2026-09-18, as an anonymous caller
holding only the publishable key that ships inside the JS bundle:

| Endpoint | Response |
|---|---|
| `POST /rpc/get_public_profile_data` | **200, 52,753 bytes, 206 rows** |
| `POST /rpc/purge_read_events` | **200** |

The first returns every profile with `full_name`, `school_college`, `grade` and
`avatar_url`. Many are school students at named Kolkata schools, downloadable as
one list by anyone. It has **no call sites** in `src/` — the app reads commenter
names through a join on `teacher_comments.profiles` — so closing it breaks
nothing.

The second is an unauthenticated DELETE against the audit table.

Neither was introduced by the redesign. The cause is that
`revoke ... from public` does not remove Supabase's **direct** `anon` grant, so
`20260918100000` left them open. Section 1 of the file closes both.

## What the file does

1. **Security.** Revokes EXECUTE by role name, not just from `PUBLIC`, and
   re-grants explicitly to the three functions that are meant to be public, so
   the intent is chosen rather than inherited from a default nobody picked.
2. **Retention.** The 90-day purge existed but nothing ever called it, so real
   retention was "forever" on a table recording what minors read. Installs two
   mechanisms: `pg_cron` if this project can enable it, and an insert trigger
   that needs no scheduler and no extension. The privacy policy now states 90
   days, so this had to become true.
3. **Diagnostics.** Read-only. Prints its own verdict on three things nobody had
   established: whether `ip_hash` is real, whether `check_user_exists` is inert
   or broken, and whether `question_count` matches the actual question rows.

## After it runs

Section 4 of the file is the verification, with the expected answer written
beside each query. The two that matter most:

- Query **4b** lists every function `anon` can still execute. Read it and agree
  with each line. Only the three gates belong there.
- Query **4d** must show `enforcing = false`.

Then in the app: a teacher opens their dashboard, sees their own number, **and
saves successfully** — that is the regression that matters, because the failure
mode is silent rather than loud. Admin's teacher table shows contacts. A paper
opens signed in and signed out. `select count(*) from public.read_events;` rises
as you browse.

## Then leave the quotas alone

`enforcing` defaults to `false` and should stay false at launch. Every threshold
is a guess — there were 3 rows of read telemetry when they were written — and the
first person a bad guess stops is a Class 10 student working through past papers
the week before boards.

After two to four weeks of real traffic:

```sql
-- what a real reader looks like
select percentile_cont(0.50) within group (order by n) p50,
       percentile_cont(0.99) within group (order by n) p99, max(n)
from (select user_id, date_trunc('day', created_at) d, count(*) n
      from public.read_events where kind='paper' group by 1,2) daily;

-- who these limits would have stopped
select limit_hit, count(distinct user_id) from public.read_quota_breaches group by 1 order by 2 desc;

-- anything obviously automated
select * from public.read_suspicion order by score desc limit 20;
```

Set the limits above the observed p99, then
`update public.read_quota_config set enforcing = true;`.

---

## Not a migration, and deliberately left to you

**Google-only sign-in.** Disable the Email provider in Authentication →
Providers, and drop the email/password branch from `src/pages/Auth.tsx`. Contact
the 9 password accounts first — 545 of 553 are already on Google. The query is at
the bottom of `RUN_THIS_ONE.sql`. Do this **after** quotas are enforced; its
whole value is making per-account limits expensive to evade.

**Canary teacher rows.** `teachers_list` is anon-readable in bulk, so a decoy row
with a number you control is picked up by any directory scrape, and `read_events`
says which account pulled it. Set `is_paused = true` so it stays out of Browse.
Left as a decision rather than a migration because it inserts fake data into a
live directory.

Canary *questions* do not work and I would not build them: a canary paper has to
be published to be reachable, which puts a fake paper in the catalogue, and a
canary question inside a real paper breaks the byte-exact rule. Watermarking has
the same problem — it belongs in surrounding DOM or per-account figure variants,
never in the text.

---

## Still open, deliberately

| | |
|---|---|
| Paper figures not resized | 25 MB, largest 312 kB, painted at 300px. Dimensions are set so there is no layout shift, but real resizing needs `sharp` or a CDN and someone able to watch the build |
| ~376 `text-[Npx]` sizes | browser text scaling is inert. Gated as "top 20, measure, decide" |
| Footer `page_content` fallback | three sequential queries per new route; collapsible, but the specificity ordering is subtle and it is already cached per route |
| Teacher reviews not copy-protected | they are other people's words; your call whether they should be |
