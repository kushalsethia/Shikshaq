# Craft guardrails

The bar every audit is judged against and every fix must meet. CLAUDE.md's
standing constraints still win where the two touch; this file is about
making the product feel **crafted, intentional, fast and fun**, not about
what it is allowed to do.

**The one sentence:** a Kolkata parent reaches the right teacher, and a
student reads the right paper, with the fewest taps, zero doubt, and a
little delight on the way.

---

## 1. Speed is a feature

| Budget | Target |
|---|---|
| Tap to visual response | < 100 ms (press state, route change starts) |
| Route switch, chunk already prefetched | next page's shell paints in < 150 ms |
| Skeleton to content | crossfade, never a jump; no layout shift (CLS ~0) |
| Repeat visit to a page | from cache, no skeleton at all |

- **Prefetch on intent.** Hover, focus or touchstart on a link warms that
  route's chunk and its first query (`src/lib/route-prefetch.ts`).
- **Skeletons are the final layout,** same boxes and radii, so content
  settles into them rather than pushing them.
- **Cache before network.** React Query `staleTime` and placeholder data
  for anything already seen; never re-skeleton data we already hold.
- **Nothing blocks the first paint** that is not on screen.

## 2. Motion: snappy, fluid, never in the way

- Interactions: 120 to 180 ms. Enter: 200 to 300 ms. Exits are softer and
  shorter than enters.
- Easing `cubic-bezier(0.2, 0, 0, 1)` for UI, springs with no bounce for
  anything spatial.
- Animate `opacity` and `transform` only. Never `transition: all`.
- Stagger list and card entrances around 30 to 50 ms each, capped so a
  long list is never slow to finish.
- Press: `scale(0.96)`. Hover lifts on cards are subtle (1 to 2 px, shadow).
- `prefers-reduced-motion`: keep the fades, drop the movement.
- **Fun, not noise.** Delight sits at moments of success: saving a
  teacher, first paper read, a search that finds results. Not on every
  element.

## 3. Visual system

- Radii only from the scale: 2, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 30, 32.
  Nested corners are concentric: inner = outer minus inset.
- No half-pixel font sizes. Headings `text-wrap: balance`, body `pretty`.
- Dynamic numbers use `tabular-nums`.
- Shadows over hard borders for depth; one elevation language sitewide.
- Colour through tokens only. Tailwind `/opacity` does not work on
  `var(--x)` raw hex (CLAUDE.md).
- Same component, same look, on every page it appears (chips, cards,
  buttons, empty states, section headers).

## 4. Affordances

- Every interactive element has hover, focus-visible, pressed and
  disabled states, and a hit area of at least 40x40 px.
- Every async surface has four designed states: loading (skeleton),
  empty (says what to do next, with a button), error (says what happened,
  with a retry), and success.
- Links look like links; buttons look like buttons; nothing clickable is
  a bare `div`.
- Filters show what is applied and how to undo it, one tap each.

## 5. Flows (each must be short, obvious and recoverable)

1. **Parent:** search (subject, class, area) -> results -> profile -> WhatsApp.
2. **Student:** papers -> filter or search -> paper -> read two free ->
   sign in -> keep reading.
3. **Teacher:** join -> apply -> approval -> dashboard -> edit profile.
4. **Contributor:** submit a paper -> upload -> confirmation.
5. **Admin:** review queues with counts, one-tap actions, audit trail.

Back always returns you to where you were. Every dead end offers a way
forward.

## 6. Content

- Every number is live and true (`useSiteCounts`). No inflated claims, no
  "Kolkata schools" count (see the 2026-09-26 audit).
- Question text is never altered. No em or en dashes in site copy.
- Voice: warm, plain, local, short. Say what happens next.
- SEO: every route has its own title, description and canonical;
  prerendered pages match what React renders.

## 7. Stakeholders to audit as

Parent · student (ICSE, CBSE, ISC; Classes IV to XII) · teacher (applying,
live, paused) · paper contributor · admin · a school that set a paper ·
Google (crawl, prerender, schema) · a phone on patchy 4G · a screen-reader
user.

## Severity

- **P0**: broken, wrong or untrue (bug, false number, dead flow).
- **P1**: visibly unpolished or slow (layout shift, missing state, janky
  motion, inconsistent component).
- **P2**: delight and craft (micro-interactions, transitions, copy polish).
