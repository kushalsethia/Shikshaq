# Front end stress test, 2026-10-04

Built (`npm run build`), served the dist on port 4180, walked routes at 375 (mobile preset,
`matchMedia` checked), 768 and 1440 (a Chrome devtools page at 1440, because the in-app pane tops
out near 750). Measured per route: horizontal page scroll, clipped or overflowing text, tap
targets under 40px (elements using `.tap-44` and inline prose links excluded), broken images,
unlabelled controls, half-pixel fonts, console errors and non-2xx requests (bodies read).
The test build carries the preview toggle and intent panel; both are compiled out of live and
were excluded from measurements.

Safety: no form was submitted, nobody signed in, nothing written to the live database.

## Routes covered

Home, teachers list, teacher profile, subject pages, board pages, past-papers library,
results, paper page (live paper, "coming soon" paper, unknown id, UUID id, bad id),
schools, school, subjects, blog, about, contact, faq, more, join, join/apply,
submit-a-paper, recommend-a-teacher, privacy, terms, 404, auth (signed-out gate states).
Result at all three widths: no horizontal page scroll, no broken images, no unlabelled controls,
no half-pixel font sizes, no console errors, no failed Supabase requests (other than the one
below), no dashes in site copy.

## Fixed

| # | Page / viewport | Problem | Fix |
|---|---|---|---|
| 1 | /past-papers/results, all | An unfiltered visit mounted all 1,506 bank papers at once: 31,132 DOM nodes, 195,000px of scroll, on a phone. | Render 48, "Show N more papers" button (44px). Readout still shows the true total. 31k nodes became 2.5k. |
| 2 | /schools, /past-papers, /school/:slug, paper "more papers", 375 | Long school and paper names cut with an ellipsis ("Assembly of Angels Seconda..."). | Wrap to two lines (`line-clamp-2 break-words`). |
| 3 | /past-papers recently-added covers, 375, 768, 1440 | Cover meta lines clipped ("Board · 11 questi..."), and the footer line rendered a bare "· 16 questions" when the title was empty. | Wrap, and join only the non-empty parts. |
| 4 | /past-papers/<garbage>, all | A malformed id reached the UUID reader, Postgres refused it (400, 22P02) and the page said "Unable to load, refresh", which can never work. | Only real UUIDs go to PaperReader; anything else gets the existing "could not find that paper" page with ways forward. |
| 5 | Papers-live announcement, auth hero, onboarding, product tour | Paper count printed as "1506" while the rest of the site prints "1,506". | `toLocaleString("en-IN")`. |
| 6 | Home, "continue where you left off" rows, 375 | Rows 38px tall. | `min-h-[44px]`. |

Commits: see the PR.

## Plumbing

- 195 `supabase.from` calls reviewed. Every `await supabase...` handles or inspects `error`
  except 15 that destructure only `data` (Index x3, Footer x2, TeacherDashboard x2, and one each in
  SchoolPage, TeacherProfile comments, PaperReader siblings, SelectRole, TeacherTermsAgreement,
  Browse subjects, useHelpTopics, GuardianDashboard). All degrade to an empty list rather than
  throwing; none show an error state. Listed for the owner, not changed.
- `select('*')` remains on: `page_content` (Footer, public), `subjects` (public), `teachers_list`
  (view, readable by anon, checked live), admin tables behind admin RLS (`teacher_applications`,
  `admin_audit_log`, `teacher_recommendations`, `teacher_upvote_stats`), and the two documented
  gated ones. No gated table is read with `*` from a public page.
- Live anon check: `bank_paper_questions` returns exactly 2 questions per paper, columns do not
  include `answer_key`, and the string is absent from the payload. Direct `bank_questions` read
  is refused (401, 42501). Unpublished/`needs_review` paper returns 0 rows and the page shows
  "coming soon".

## Left for the owner

1. **Contact form** only opens a `mailto:` and then shows "sent". On a desktop with no mail client
   nothing happens. A real submit (table or function) would be a data/plumbing change.
2. **"School not recorded"** is printed on many result cards (data: `bank_papers.school` empty).
3. **Blog chapter names** such as "Medieval India – Mughals" contain en dashes (bank chapter
   data, exempt as other people's text, but they sit in site headings).
4. **Teacher card names** split on the first word and truncate each line (owner's recorded
   design call): a long first word such as "Mukhopadhyay" is clipped by about 6px at 375.
   Left alone; the full name is in the `title` attribute.
5. **Stacked first-visit modals** on a paper page (tour, "papers are live", copyright notice)
   arrive one after another. By design, but worth a look on a first visit from search.
6. **Product-tour step dots** are 10px wide controls (`aria-label` "Step n of 3"). Not
   reachable by thumb. Decorative-plus-navigation; left.
7. Stale-redirect behaviour: `/auth` shows the hero of whatever gate you last hit for five
   minutes (e.g. "Shikshaq admin"). By design (5 minute TTL), noted because it looks wrong when
   testing.

## Not reachable (signed out, no credentials entered)

Code and component tests reviewed instead; all 1,148 tests pass.

- `/account`, `/liked-teachers`, `/my-teachers`, `/dashboard/*`, `/select-role`,
  `/teacher-terms-agreement`, `/signup-success`: render the sign-in gate when signed out; the
  signed-in views were not seen.
- `/checker` (student checker): gate only. (The brief said `/check`; the route is `/checker`.)
- Every `/admin/*` route, including `/admin/library/:id`, `/admin/paper-approvals/:id`,
  `/admin/checker-log/:key` and the admin queue: gate only. `paper-approvals` was not touched
  (another agent owns it).
- `/join/apply` form fields past the signed-out gate, `/submit-a-paper` upload, and
  `/recommend-teacher` submit were not exercised because they write to the live database.
- Offline and Supabase-outage error states were not provoked; read in code only.
