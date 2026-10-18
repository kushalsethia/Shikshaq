# Affordances audit, 18 October 2026

**What this is.** A hunt for information gaps: any place where a person does something and the screen does not say what happened, why a control is off, what comes next, or how to recover. Judged against `docs/CRAFT.md` section 4 (affordances) and 5 (flows).

**How it was done.** Three read-only Haiku auditors read the checker, the HOD desk plus Admin, and the public site, against the code as of `cf0b14f` (Undo last removed, Enter after a tile tap, enlarge icon moved, whole-page failure explained, HOD Move keeps its pick). They produced 72 candidate findings. Every one listed below as FIXED or OWNER was checked against the code by hand. Haiku over-reports, so several were dropped (see the end).

Status key: **FIXED** in this branch, **OWNER** needs a decision or a database/server change, **LATER** real but not yet done.

## Top findings, ranked

| # | Surface | Gap | Status |
|---|---|---|---|
| 1 | Checker | Marks field with a non-number turned "Looks right" off and Enter did nothing, with only a red ring and no words | FIXED: message under the field, and the button's tooltip says why |
| 2 | Checker | "Looks right" or Save did nothing at all when the drafts belonged to a different question | FIXED: says the question changed and nothing was saved |
| 3 | Checker | No offline state anywhere in the checker | FIXED: a banner by the buttons says answers stay on the device and send on reconnect |
| 4 | Checker | Paper's question list failed to load with no retry, and blamed "not yours any more" for a plain network error | FIXED: Try again button, copy covers both causes |
| 5 | Checker | Looks right disabled for an empty question gave no reason on the button | FIXED: tooltip carries the reason |
| 6 | HOD | Any 42501 refusal showed raw server text or a generic line, so a non-HOD account could not tell it was a permission problem | FIXED: `errorWords` maps 42501 to a plain sentence |
| 7 | HOD | "Pass" greyed out for a blank question with no reason | FIXED: line under the buttons |
| 8 | Admin | Verifier Details opened a blank form when the profile load failed; Save would then overwrite real data with blanks | FIXED: the form is not opened, and a message says nothing was changed |
| 9 | Admin | Approve, reject application and remove verifier failures dropped the reason | FIXED: use `writeErrorWords` (handles 42501, 40001 and so on) |
| 10 | Public | Question report stayed on "Sending..." for ever if the network threw | FIXED: try/catch routes to the error state |
| 11 | Public | Search overlay could not recover if the index failed to load | FIXED: message and Try again button |
| 12 | Public | Google sign-in failure on both gate sheets was silent | FIXED: toast |
| 13 | Public | Past papers "Load more" failure was silent | FIXED: toast says results are still there |
| 14 | Public | Feedback "Send it" disabled with no hint | FIXED: line says to pick how it felt |

## Needs the owner (decisions, product copy or server work)

1. **Checker says "Saved." before the server confirms.** `submitVerdict` writes to the outbox and shows "Saved." / "Marked as right." / "Sent to your HOD." at once. The not-saved chip appears only after the first failed send. This is how the outbox was designed (the screen moves on at once). Options: say "Kept, sending" until acknowledged, or keep as is. The offline banner now covers the worst case (no connection).
2. **WhatsApp falls back to Shikshaq's own number** when the teacher lookup fails or a teacher has no link (`src/utils/whatsapp.ts`, `src/pages/WhatsAppRedirect.tsx`), while the screen still names the teacher, and a contact is recorded. The fallback is documented, but it does not tell "no number on file" from "lookup failed". Needs a product decision before changing a contact path.
3. **Sign-in says "Invalid email or password" for every failure** (`src/pages/Auth.tsx:335`). It is deliberate (no information disclosure), but an unconfirmed email gets the same words and there is no resend there. Decision: allow a distinct "confirm your email" message with a resend.
4. **Teacher dashboard pill is hard-coded "Live and verified"** for any unpaused profile (`TeacherDashboard.tsx:1150`). A truth claim; needs a real approval field or softer copy.
5. **Footer fallback copy** claims every teacher is verified when the content fetch fails (`Footer.tsx`).
6. **Sign-up success** is one toast plus a cleared form; `SignUpSuccess.tsx` (with resend) exists but is not used on this path. **Teacher application "Save and continue"** saves nothing (state is in memory only). Both are flow changes.
7. **"Auto assign all"** hands out every unassigned paper with no count and no confirm (`AssignmentsTab.tsx`). The code comment says it is deliberate; the owner may want a "Give N papers to M verifiers?" confirm.
8. **No server change was needed or made.** No migrations, no database writes.

## Still to do (real, smaller, not done in this pass)

Checker: warn notices disappear after 8 seconds even when they carry an instruction; the next-question failure shows "check your internet" for an expired sign-in too; "You are not a verifier yet" has no link onward; loading placeholders lack `role="status"`; the profile card is blank while loading.

HOD: the Publish refusal does not say "nothing was published"; "Save, keep open" with no changes does nothing visible; "Check again" gives no result line; undo failure shows at the top of the list, not on the line; add-reviewer, verifier details and trust-switch errors lose the server reason; the tab badges vanish without a note when counts fail.

Admin: sign-out failure is swallowed and the page still navigates; activity-feed failure always blames the internet; Verify-this-paper and conflict-reload failures use thin text; `reviews.tsx` catch blocks were not read.

Public: paper page and paper reader load failures have no Try again; broken paper figures and teacher photos show a broken-image icon; saved-teachers, guardian dashboard and upvote counts fail silently into an empty or zero state; recommend-a-teacher shows raw network text; magic-link "sent" has no resend; saved pages lose the return path on sign-in; no global offline banner outside the checker.

## Auditor claims checked and dropped or softened

- "Split here is off with no reason": the split preview already says it.
- "Search stays on Searching forever": only true if the request throws; the fix handles that case, and a plain error still shows "no results".
- Findings about Undo last, Enter, the tile enlarge icon and Move refusals: already handled by `cf0b14f`, not counted.

## Checks run

`npx tsc -b` clean. `npx eslint .` 0 errors (212 existing warnings). `npx vitest run --dir src`: 2564 pass, 1 fails (`verifier-peek-migration.test.ts`), which compares SQL text and fails on this Windows checkout because the migration file has CRLF line endings; it reads a file this branch did not touch. Dummy-mode checker in the browser: the marks message, the disabled button's tooltip and the offline banner (and its removal on reconnect) were confirmed by reading the page. Screenshots timed out because the browser pane was hidden.
