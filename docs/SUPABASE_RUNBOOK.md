# Supabase runbook

Everything that does not touch the database is done and deployed. This is what
is left: **one migration, then one two-line code change.**

## Before you run it

**There is no test database.** Both deployments share `uvtifolnsneitetzohtn`, so
this is a production change the moment it runs. The rollback is at the bottom of
the migration file. Apply during Kolkata off-hours.

**The deployed code already handles both sides of it.** `src/lib/teacher-contact.ts`
and `src/hooks/useSiteCounts.ts` call the new functions and fall back to the old
direct selects while those functions do not exist. So today you will see a 404 on
`/rest/v1/rpc/site_counts` in the console and the fallback serving the footer
counts; after the migration the function answers and the 404 stops. Nothing
breaks in either direction, and the order does not matter.

## Step 1 — run the migration

`supabase/migrations/20260918100000_lock_down_bulk_reads_and_meter_them.sql`

```bash
npx supabase db push          # needs the DB password
```

Or paste the file into the SQL editor. It is idempotent.

It does seven things: revokes `authenticated`'s bulk read on `bank_questions`
and on Shikshaqmine's contact columns; adds `read_events`; adds
`teacher_own_contact()` and `admin_teacher_contacts()`; adds `site_counts()`;
adds read logging to the two existing gates; drops the signed-out preview from
five questions to two; and installs the quota machinery **switched off**.

### Pre-flight, already checked against the live database

| | |
|---|---|
| `pgcrypto` | installed, in the `extensions` schema — which is why `digest()` is qualified. Unqualified it fails at apply time |
| `is_admin()` | exists |
| `profiles.id/email/role` | all present |
| `Shikshaqmine.id` | `bigint`, matching the functions' `RETURNS TABLE` |
| `read_events`, `read_quota_config` | do not exist yet, so this is a clean apply |
| `site_counts()` body | returns 148 / 1282 / 283, matching the footer exactly |
| `teacher_own_contact()` join | resolves all 31 teacher profiles, every one with a phone number |
| `read_suspicion` view SQL | runs, and scores a metronomic 60s gap pattern correctly |

### Verify after

```sql
select has_column_privilege('anon','public."Shikshaqmine"','Link','SELECT');           -- f
select has_column_privilege('authenticated','public."Shikshaqmine"','Link','SELECT');  -- f  <- the point
select has_column_privilege('authenticated','public.bank_questions','body','SELECT');  -- f
```

Anonymous preview should now be two:

```bash
curl -s -X POST "$URL/rest/v1/rpc/bank_paper_questions" -H "apikey: $KEY" \
  -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
  -d '{"p_paper_id":"0c9771"}' | grep -o '"paper_id"' | wc -l
```

Then in the app: **a teacher opens their dashboard, sees their own number, and
saves successfully** — that is the regression that matters, because the failure
mode here is silent rather than loud. Admin's teacher table shows contacts. A
paper opens signed in and signed out. `select count(*) from public.read_events;`
rises as you browse.

**Check `ip_hash` is not the hash of an empty string**
(`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`). If it is,
`request.headers` is not exposed on this project and the network-based signals in
`read_suspicion` go blind. Account-based ones still work, and the account is the
real threat.

## Step 2 — deploy the copy change

The migration drops the preview to two. Seven places promise the reader a
number, and they all read from one constant:

```ts
// src/lib/free-preview.ts
export const FREE_PREVIEW_QUESTIONS = 2;
export const FREE_PREVIEW_WORD = 'two';
```

Until this ships, the page promises five and hands over two.

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

Set the limits above the observed p99, then `update public.read_quota_config set
enforcing = true;`.

**Schedule the 90-day purge before launch traffic arrives**, not after —
retention that starts late is retention that did not happen. `pg_cron` is **not**
installed here, so either enable it:

```sql
select cron.schedule('purge-read-events', '0 3 * * *', 'select public.purge_read_events()');
```

…or call `select public.purge_read_events();` from any scheduler. It is idempotent.

---

## Not a migration

**Google-only sign-in.** Disable the Email provider in Authentication →
Providers, and drop the email/password branch from `src/pages/Auth.tsx`. Contact
the 9 password accounts first — 545 of 553 are already on Google:

```sql
select u.email from auth.identities i join auth.users u on u.id = i.user_id
where i.provider = 'email'
  and not exists (select 1 from auth.identities g where g.user_id = i.user_id and g.provider = 'google');
```

Do this **after** quotas are enforced; its whole value is making per-account
limits expensive to evade.

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
| ~376 `text-[Npx]` sizes | browser text scaling is inert. Gated in the plan as "top 20, measure, decide" |
| Footer `page_content` fallback | three sequential queries per new route; collapsible, but the specificity ordering is subtle and it is already cached per route |
| Teacher reviews not copy-protected | they are other people's words; your call whether they should be |
