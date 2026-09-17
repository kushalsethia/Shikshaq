# Supabase runbook — everything still pending

Everything that does not touch the database is done and pushed. This is the
queue that does. Each step is: apply a migration, ship a paired client change,
run a verification. Nothing here is exploratory — the migrations are written,
the client edits are specified line by line, and every check is a command.

## Before anything

**There is no test database.** Both deployments share `uvtifolnsneitetzohtn`.
Every migration below is a production change the moment it runs. Each file
carries its own rollback at the bottom. Apply during Kolkata off-hours.

```bash
npx supabase db push          # needs the DB password
```

Or paste the file into the SQL editor. Either way, apply **one file at a time**
and run its verification before the next.

Set these once for the verification commands:

```bash
KEY=$(grep '^VITE_SUPABASE_PUBLISHABLE_KEY=' .env | cut -d= -f2- | tr -d '\r"')
URL=$(grep '^VITE_SUPABASE_URL=' .env | cut -d= -f2- | tr -d '\r"')
```

`$KEY` is the anon key, so these test the anonymous path. For the signed-in
path, get a JWT by signing in on the test site and copying `access_token` out
of localStorage, then send it as `Authorization: Bearer <jwt>` instead.

---

## 1. `20260917120000_gate_authenticated_bulk_reads.sql` — the actual hole

Closes the one-account-dumps-everything path and starts recording reads.

**Ship these client changes in the same deploy.** Not before, not after:

| File | Line | Change |
|---|---|---|
| `src/pages/TeacherDashboard.tsx` | ~219 | `.from('Shikshaqmine').select('*').eq('Email ID', …)` → `supabase.rpc('teacher_own_contact')` for the contact columns, merged with the existing non-contact select |
| `src/pages/TeacherDashboard.tsx` | ~909 | `.update(updateData).eq('Email ID', profile.email)` → `.eq('id', teacherRowId)` |
| `src/pages/TeacherDashboard.tsx` | ~412 | same, the `is_paused` toggle |
| `src/pages/admin/teachers.tsx` | ~156 | `.select('*')` → keep, plus `supabase.rpc('admin_teacher_contacts')` merged by `id` |
| `src/pages/admin/teachers.tsx` | ~414, ~471 | update filters → `.eq('id', …)` |

**Why the filters have to move.** Postgres requires `SELECT` on any column used
in a `WHERE` clause, and this migration revokes `Email ID`. Leave them and
saving breaks.

**Why they must not lag the migration.** Both reads use `.select('*')`, and
PostgREST expands `*` to the columns the role may read rather than erroring. So
the failure is silent: `teacherData["Phone Number"]` becomes `undefined`, the
validation at `TeacherDashboard.tsx:538` and `:761` then refuses to save, and
the teacher sees a required-field error on a field that is not on screen.

If you cannot ship both together, write the client to try the RPC and fall back
to the old select on `PGRST202` (function not found). That works on both sides
of the migration; delete the fallback afterwards.

### Verify

```bash
# anon: unchanged, still blocked
curl -s -o /dev/null -w "%{http_code}\n" "$URL/rest/v1/bank_questions?select=body&limit=1" \
  -H "apikey: $KEY" -H "Authorization: Bearer $KEY"     # expect 401
```

With a **signed-in** JWT — this is the check that matters, and all three should
now fail where they previously succeeded:

```bash
curl -s "$URL/rest/v1/Shikshaqmine?select=%22Link%22&limit=1"        -H "apikey: $KEY" -H "Authorization: Bearer $JWT"
curl -s "$URL/rest/v1/Shikshaqmine?select=%22Phone%20Number%22&limit=1" -H "apikey: $KEY" -H "Authorization: Bearer $JWT"
curl -s "$URL/rest/v1/bank_questions?select=body&limit=1"            -H "apikey: $KEY" -H "Authorization: Bearer $JWT"
# all three: permission denied
```

Then, in the app:

- a teacher opens their dashboard, sees their own number, **and saves successfully** (this is the regression that matters)
- admin's teacher table shows contacts
- a paper still opens, signed in and signed out
- `select count(*) from public.read_events;` increases as you browse

**Check `ip_hash` is populated.** If every row has the hash of an empty string,
`request.headers` is not exposed on this project. That is survivable — the
account-based signals still work, and the account is the real threat — but the
network-based ones in step 4 go blind. Worth knowing either way.

---

## 2. `20260917120001_free_preview_two_questions.sql` — 5 → 2

Drops anonymous reach from 6,410 question bodies to 2,564.

**Paired copy change:** `src/pages/BankPaper.tsx:~306` says "First five free".
Make it derive from the rows actually returned rather than naming a number, so
it cannot drift from the function again.

### Verify

```bash
curl -s -X POST "$URL/rest/v1/rpc/bank_paper_questions" \
  -H "apikey: $KEY" -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
  -d '{"p_paper_id":"0c9771"}' | grep -o '"paper_id"' | wc -l
# expect 2
```

Signed in, the same call should still return the whole paper.

### Then watch, for four weeks

Signup conversion from paper pages, and impressions/position on
`/past-papers/*` in Search Console. If conversion does not move, five was
buying nothing. If it drops, it is one integer in one function.

---

## 3. `20260917120002_site_counts_rpc.sql` — biggest data-layer win

**Paired client change:** `src/hooks/useSiteCounts.ts` — replace the three-part
`Promise.all` with `supabase.rpc('site_counts').single()` and drop the
`fetchBankSchoolValues()` call. `About.tsx` and the live-papers banner have the
same scan and can move in the same pass.

This removes a paginated scan of all 1,282 `bank_papers` rows that ran on
**every page load**, for one number in the footer.

### Verify

```bash
curl -s -X POST "$URL/rest/v1/rpc/site_counts" -H "apikey: $KEY" \
  -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" -d '{}'
# expect one row: teachers / papers / schools, matching the footer
```

Then load the homepage with devtools open and confirm the two `bank_papers`
requests are gone.

---

## 4. `20260917120003_read_quotas_soft_fail.sql` — installed, switched off

Ships with `enforcing = false`. It counts and records breaches; it refuses
nothing.

**Do not turn this on at launch.** Thresholds are guesses until `read_events`
has real traffic, and the first person a bad guess stops is a student working
through papers before boards.

**Paired client change (can ship any time):** handle a quota rejection in
`src/lib/question-bank.ts` and `resolveWhatsAppLink()` — show an explanatory
message with a contact route, never a bare failure.

### After two to four weeks, decide with data

```sql
-- what a real reader looks like
select percentile_cont(0.50) within group (order by n) p50,
       percentile_cont(0.99) within group (order by n) p99, max(n)
from (select user_id, date_trunc('day', created_at) d, count(*) n
      from public.read_events where kind='paper' group by 1,2) daily;

-- who these limits would have stopped
select limit_hit, count(distinct user_id) from public.read_quota_breaches
group by 1 order by 2 desc;

-- anything obviously automated
select * from public.read_suspicion order by score desc limit 20;
```

Set the limits above the observed p99, then:

```sql
update public.read_quota_config set enforcing = true;
```

### Scheduling the purge

90-day retention, and it needs a scheduler. **`pg_cron` is not installed on this
project** — I checked. Either enable it in the dashboard:

```sql
select cron.schedule('purge-read-events', '0 3 * * *', 'select public.purge_read_events()');
```

…or call `select public.purge_read_events();` from anywhere on a schedule. It is
idempotent. **Do this before launch traffic arrives**, not after — retention
that starts late is retention that did not happen.

---

## 5. Dashboard settings — no migration

**Google-only sign-in (Phase 6a).** Disable the Email provider in
Authentication → Providers, and remove the email/password branch from
`src/pages/Auth.tsx`.

**Contact the 9 password accounts first.** 545 of 553 users are already on
Google; these 9 are not, and they lose access the moment the provider is off.
Same email address on Google works if identity linking is on — confirm that
before relying on it.

```sql
select u.email from auth.identities i
join auth.users u on u.id = i.user_id
where i.provider = 'email'
  and not exists (select 1 from auth.identities g
                  where g.user_id = i.user_id and g.provider = 'google');
```

Ship this **after** step 4's limits are on: its whole value is making per-account
quotas expensive to evade, and until quotas exist it buys nothing.

---

## 6. Canary records — a decision, not a migration

Deliberately not written as a migration, because it inserts fake data into a
live directory and that is a product call.

**Teacher canaries work.** `teachers_list` is still anon-readable in bulk, so a
decoy row is picked up by any directory scrape. Give it a real-looking name and
a number you control, set `is_paused = true` so it stays out of Browse, and
record which account pulled it via `read_events`.

**Question canaries do not, and I would not build them.** A canary paper has to
be `is_published` to be reachable at all, which means it appears in the library
as a fake paper — the catalogue is the product. And a canary *question* inside a
real paper would violate the standing rule that question text is byte-exact from
the source. Watermarking has the same problem: it must live in surrounding DOM
or in per-account figure variants, never in the text.

---

## Status of the rest

| Area | State |
|---|---|
| Prerendering, 1,700 routes | done, verified on the kanitest deploy |
| Sitemap 1,560 → 1,830, fails hard | done |
| Seven revoked-column queries that 401'd for signed-out users | done, verified |
| First paint 341 kB → 301 kB gzip | done |
| Responsiveness defects | done |
| SEOHead stale titles, shared SEO defaults | done |
| Placeholder papers excluded | done |
| Paper figures: dimensions set, **files not resized** | partial — 25 MB, needs `sharp` or a CDN, wants someone watching the build |
| ~376 `text-[Npx]` sizes | not started — gated in the plan as "top 20, measure, decide" |
| Footer `page_content` 3-step fallback | not done — collapsible, but subtle ordering and already cached per route |
