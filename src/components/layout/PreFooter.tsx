import * as React from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, MessageCircle, FileText, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sticker } from "@/components/ui/sticker";
import { Eyebrow } from "@/components/ui/eyebrow";
import { IconDisc } from "@/components/ui/icon-disc";
import { PageContainer } from "@/components/layout/PageContainer";
import logoImage from "@/assets/shikshaq-logo.svg";
import { BROWSE_PATH, PAST_PAPERS_PATH } from "@/lib/nav-config";

/* Redesign S5 — the pre-footer block family (design.md §6).

   Four variants, CHOSEN BY ROUTE, never hand-placed on a page:
     B1 full explainer   home, about, help
     B2 three-count strip browse, subject, board, profile
     B3 papers explainer  papers list, reader, school
     B4 one-liner         account, dashboards, admin, forms

   Counts (B2) are real or absent — design.md §0.10. The component takes them as
   optional props and drops any clause whose number is undefined rather than
   rendering a zero or a placeholder. */

export type PreFooterVariant = "B1" | "B2" | "B3" | "B4";

/** Route → variant. One place, so no page picks its own block. */
export function preFooterFor(pathname: string): PreFooterVariant {
  if (pathname === "/" || pathname === "/about" || pathname === "/more" || pathname === "/help")
    return "B1";
  if (pathname.startsWith(PAST_PAPERS_PATH)) return "B3";
  if (
    pathname === BROWSE_PATH ||
    pathname === "/browse" ||
    pathname.endsWith("-tuition-teachers-in-kolkata") ||
    pathname.startsWith("/tuition-teachers/")
  )
    return "B2";
  return "B4";
}

/* ---------- B1 · full explainer ---------- */

function B1() {
  return (
    <div className="relative rounded-3xl bg-card p-6 shadow-border sm:p-8">
      <Sticker tone="brand" tilt={-3} size={30}>
        What is ShikshAQ?
      </Sticker>
      <h2 className="font-display text-section-head font-extrabold text-foreground">
        A list of real teachers, and their numbers
      </h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { icon: <BadgeCheck />, text: "ID and degree verified, every one." },
          { icon: <MessageCircle />, text: "You message the teacher yourself on WhatsApp." },
          { icon: <FileText />, text: "Past papers are free, and stay free." },
        ].map((p, i) => (
          <li key={i} className="flex items-start gap-3">
            <IconDisc tone="brand-subtle" size={36}>
              {p.icon}
            </IconDisc>
            <span className="text-body-secondary text-warm-prose">{p.text}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild variant="primary" size={44}>
          <Link to={BROWSE_PATH}>Find a teacher</Link>
        </Button>
        <Button asChild variant="muted" size={44}>
          <Link to={PAST_PAPERS_PATH}>Read past papers</Link>
        </Button>
      </div>
    </div>
  );
}

/* ---------- B2 · three-count strip ---------- */

export interface B2Counts {
  teachers?: number;
  reviews?: number;
}

function B2({ counts }: { counts?: B2Counts }) {
  /* Only render a counter whose number actually arrived. The commission line is
     a fact, not a query, so it always shows. */
  const items = [
    counts?.teachers !== undefined
      ? { value: String(counts.teachers), label: "verified teachers" }
      : null,
    counts?.reviews !== undefined
      ? { value: String(counts.reviews), label: "student reviews" }
      : null,
    { value: "₹0", label: "commission, ever" },
  ].filter(Boolean) as { value: string; label: string }[];

  return (
    <div className="rounded-3xl bg-brand p-6 text-brand-foreground shadow-glow-brand sm:p-8">
      <Eyebrow onDark>Why this list is trustworthy</Eyebrow>
      <dl className="mt-4 grid gap-6 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.label}>
            <dt className="sr-only">{it.label}</dt>
            <dd>
              <span className="block font-display text-page-title font-extrabold tabular-nums">
                {it.value}
              </span>
              <span className="text-body-secondary opacity-90">{it.label}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 max-w-prose text-body-secondary opacity-90">
        Teachers keep every rupee of their fee. We never take a cut, and we never sell your
        number.
      </p>
    </div>
  );
}

/* ---------- B3 · papers explainer ---------- */

function B3() {
  return (
    <div className="rounded-3xl bg-brand-blue-subtle p-6 sm:p-8">
      <h2 className="font-display text-section-head font-extrabold text-brand-blue-deep">
        Where these papers come from
      </h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          "Shared by students, year after year.",
          "Read them in the browser — no download needed.",
          "The schools own them. We only host them for revision.",
        ].map((t) => (
          <li key={t} className="flex items-start gap-3">
            <IconDisc tone="papers-subtle" size={36}>
              <FileText />
            </IconDisc>
            <span className="text-body-secondary text-warm-prose">{t}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild variant="indigo" size={44}>
          <Link to={PAST_PAPERS_PATH}>Browse papers</Link>
        </Button>
      </div>
    </div>
  );
}

/* ---------- B4 · one-liner ---------- */

function B4() {
  return (
    <Link
      to="/about"
      className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-border transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-border-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-6"
    >
      {/* Logo renders its own <Link>, so it must NOT be used inside this one —
          that produced nested anchors (invalid HTML, real console warning).
          The mark is decorative here; the row itself is the link. */}
      <img
        src={logoImage}
        alt=""
        aria-hidden
        width={252}
        height={92}
        className="h-10 w-auto shrink-0"
      />
      <span className="flex-1 text-body-secondary text-warm-prose">
        Two people, one list of teachers, no commission.
      </span>
      <ChevronRight aria-hidden className="size-5 shrink-0 text-warm-label" />
    </Link>
  );
}

export interface PreFooterProps {
  variant: PreFooterVariant;
  counts?: B2Counts;
  className?: string;
}

/** 32px above the footer (design.md §1). */
function PreFooter({ variant, counts, className }: PreFooterProps) {
  return (
    <PageContainer as="section" className={cn("pb-8", className)}>
      {variant === "B1" ? <B1 /> : null}
      {variant === "B2" ? <B2 counts={counts} /> : null}
      {variant === "B3" ? <B3 /> : null}
      {variant === "B4" ? <B4 /> : null}
    </PageContainer>
  );
}

export { PreFooter };
