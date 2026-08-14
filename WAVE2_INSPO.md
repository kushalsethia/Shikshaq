# Wave 2 — reference material

Four inspo screenshots were shared in chat during the 2026-08-14 session, pasted inline (not
uploaded as files) — there is no image file to hand off, only these descriptions, written down
in enough detail to act on. **Colors in all four are reference-only for layout/interaction
patterns.** Brand orange `#FF8000` and blue `#4351FF` are locked regardless of what hues appear
in any inspo image — this was an explicit, repeated owner instruction this session, treat it as
durable across all of Wave 2, not just what's already built.

---

## 1. Course-app dashboard (mobile) — informed BottomNav, already applied

Mobile app screen, warm off-white background. Top-left: small blue flower/asterisk logomark +
"monday work management" wordmark; top-right: search icon and add-person icon in light-grey
circular buttons. Below that, a large rounded-corner **indigo/periwinkle card** ("My favorites")
spanning the width, with a white arrow-button top-right, containing a stacked-card preview
(a small workspace-item card peeking out from behind a fuller one titled "Start from scratch /
Main workspace" with a yellow star icon) and three pagination dots below. Under that, a second
white rounded card ("Recently visited") listing two rows, each with a small square app-icon
thumbnail, a title, a subtitle ("Main workspace"), a "changed an hour ago" timestamp, and a star
(filled/unfilled) on the right — plain list rows, divider between them, arrow-button top-right
matching the first card. Below that, a third white pill-shaped row ("Workspaces") with a small
indigo icon-tile and a chevron. A large filled indigo circular **floating action button** (+)
sits bottom-right, overlapping the workspaces row. At the very bottom: a **dark, floating,
rounded bottom tab bar**, detached from the screen edges with visible margin, containing 4 icon
tabs (Home/My work/Notifications/More) — the active tab (Home) is rendered in solid indigo/blue
with a filled house icon, the others are grey outline icons on the dark ground.

**Already applied** to `src/components/BottomNav.tsx`: dark floating pill (`bg-panel`), detached
from screen edges, expand-on-select active tab (adapted from a solid circular highlight to a
flex-grow icon+label reveal, since our nav needs 4 destinations to stay legible without a
separate label row). Not yet applied anywhere: the "Recently visited" list-row visual style
(square thumbnail + title + subtitle + timestamp + star) — our own `HomeActivitySection.tsx`
built this independently and simpler (icon-in-circle instead of thumbnail, no timestamp). Worth
comparing side by side if revisiting that component.

---

## 2. Ruang Edit — design-class landing page — reviewed against Home agent output, mostly covered

Desktop-width landing page, white background, light purple/lavender accent color. Top nav: logo
mark (small triangle) + "Ruang Edit" wordmark centered, "Home / Services / About" on the left,
"Class / Contacts us" pill button on the right. Below: two small pill badges top-right
("RE Production" / "2024.09"). Large bold black headline, mixed weight, three lines: "Level Up
Your / Design [pill-icon] with Our / Design Class" — the pill-icon is a small rounded-rectangle
**orange badge containing a white sparkle/star icon, sitting inline mid-sentence, roughly
headline-cap-height**. Scattered purple 4-point sparkle/star decorations float around the
headline at various sizes, plus one small curved arrow/swoosh line. Below the headline: a small
stat line ("With more than / 2K+ MEMBERS / 500+ TUTORIALS") on the left, a "Join us ↗" pill
button on the right. Below that: a horizontal row of 4 large rounded-square icon tiles in
different flat colors (pink, purple, cyan, orange), each containing a small 3D-style icon
illustration, with left/right circular arrow-nav buttons flanking the row. Further down: a large
white rounded card titled "Our Class" containing 3 sub-cards side by side ("UI/UX Design",
"Motion Graphics" — highlighted in solid purple, "Visual Identity"), each with a small circular
arrow-button, a short description line, and a small illustration thumbnail at the bottom; dot
pagination and prev/next arrows below the row. Below that: a centered testimonial-style block
("- Ruang Edit Class -" / bold headline with "Ruang Edit" highlighted in orange / supporting
line) with sparkle decorations. Footer: "Part of Ruang Edit" left, small mail/phone/instagram
icons + "Archived by ashzahh · 2024" right.

**Reviewed against the finished Home agent output** — sparkles, mixed-weight headline, saturated
rounded slabs, and subject-tinted color-blocked cards (via `getSubjectPalette` on
`SubjectCard`/`TeacherCard`) already cover most of this independently. **Deliberately not
applied**: the inline icon-pill sitting mid-headline-text — not in `VISUAL_LANGUAGE.md`, would
be new unreviewed scope on an already-verified, owner-facing hero. Worth a specific ask if
wanted for Wave 2's Home revisit (not currently in scope — Home is done, not part of the Wave 2
table).

---

## 3. Truus.co — agency footer — reviewed against Chrome agent output, partially applied

Desktop-width footer section, on a periwinkle-blue page background. Top bar: "★ work" pill
badge left, italic script "truus" wordmark centered, WhatsApp icon circle top-right. Below: a
full-width **saturated blue rounded card** containing 3 columns — "looking for a job?" pill
label + bold white "experienced camera/edit" heading; "office" pill label + address ("papaverhof
21 / 1032 LX amsterdam") + underlined "Google Maps" link; "contact" pill label + email
("hello@truus.co") + bold "send us a whatsapp*" line + small disclaimer ("*we're millennials and
gen-z: please do not call us.") + LinkedIn/Instagram/TikTok icon row. Below the 3 columns: a
**huge script/cursive wordmark "truus"** rendered in off-white, spanning nearly the full card
width, with several **tilted circular/blob sticker badges scattered across and overlapping the
lettering** — a blue smiley-face circle, an orange "BAM!" comic-burst badge, a magenta heart
badge, a green hand-heart-gesture blob, a black camera-icon badge with a crown. A small black
"credits" pill sits bottom-right of the card.

**Reviewed against the finished Chrome agent output** — dark panel, saturated CTA tiles, and a
WhatsApp icon link were already present. **Applied**: one tilted "Free" sticker badge on the
Teachers CTA tile in `Footer.tsx`, reusing the already-approved sticker pattern (same rotation/
shadow treatment as `TeacherCard`'s "Featured" badge) rather than inventing new scope. **Not
applied**: the giant script wordmark spanning the footer, and the "send us a whatsapp" prominent
CTA line as separate emphasized text (we currently only have a WhatsApp icon-button, not a text
CTA line) — both are larger additions than a footer character-pass touch-up; flag to the owner
before adding, since a large wordmark is new visual real estate not in `VISUAL_LANGUAGE.md`.

---

## 4. Books-app shelf/library page (mobile) — logged for Wave 2 past-papers flow, not yet applied

Mobile app screen, purple gradient header fading to white. Top-left: small icon (list+lightning
bolt) + "Wow! 25 Days without a break" bold line, "You're ahead of 81% of readers" subtitle grey,
three-dot pagination indicator top-right. Below: large bold black headline "You Have 12 New
Books Design" (3 lines). Below: a section header row "Design" (bold, left) + "‹ 16 books ›"
pager (right, grey). Below that: a **horizontal shelf of book covers** — 4 partially-visible
book-spine images (Bauhaus/blue, Dieter Rams/orange, The Design of Everyday Things/yellow,
partial black cover) sitting on a visible horizontal shelf-ledge line, drop-shadowed, angled
slightly as if standing upright on a shelf. Below the shelf: a row of **filter pills with live
counts** — "All 23" (selected, indigo bg + count badge), "Design 10", "Fantasy 5", "Mystery 8"
(unselected, plain text + grey count badge). Below that: a large white rounded card containing a
"Collections / Books" segmented toggle (top-left), a bold heading "Autumn Reads" + subtitle "The
Most Popular Books", a 2×2 grid of 4 small book-cover thumbnails (Van Gogh/olive, Us/red, Making
Short Films/multicolor, The Apple/blue) on the right, and a **large bold numeric stat "250"**
with a small "Top" label beside it, bottom-left of the card. Below the card: a circular avatar
photo, "Marina Minchukova" name, "Follow me" subtitle, centered.

**Not yet applied** — logged against Wave 2's `PastPapers.tsx`/`PaperResults.tsx`/
`PaperReader.tsx` task. Relevant devices to extract when that agent runs: (a) horizontal-scroll
paper-cover shelf for a subject/board — `PaperCard.tsx` already has subject-tinted styling and
stickers from the Primitives pass, so this would be a new horizontal-scroll *container* reusing
the existing card, not a new card design; (b) filter chips showing live counts next to each
label (Subject/Class/Board filters on these pages currently don't show counts inline — check
against what data is already fetched, e.g. `subjectCounts` state already exists in
`PastPapers.tsx`); (c) a bold numeric stat callout style (e.g. total papers count, "New this
week" count) similar to the "250 Top" treatment — note `PastPapers.tsx` already has a "Browse
all X papers →" line that could be restyled this way rather than adding a net-new element.
**Do not** adopt the purple/pink/olive palette shown — subject tints already come from
`getSubjectPalette`, brand orange/blue elsewhere, per the standing color-lock rule.

---

## How to use this on resume

Each Wave 2 task in the session's task list (`TaskList` tool, tasks #15–20 as of 2026-08-14) has
a one-line description of its file scope. Cross-reference against the relevant section above
before implementing — in most cases the finished character-pass work (subject-palette tinting,
sticker pattern, saturated slabs, dark-panel-safe tokens) already gives you the pieces; the job
is assembling them into these new page layouts, not inventing new visual language. Read
`DESIGN_SYSTEM.md` and `VISUAL_LANGUAGE.md` in full before starting any Wave 2 file, same as the
character-pass agents were briefed. Work directly against the checkout, not an isolated
worktree, until this commit and all following ones are in — worktrees only carry committed
history (see `HANDOFF.md` §5 for the incident this caused earlier in the session).
