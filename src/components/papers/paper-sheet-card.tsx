import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Download, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { getSubjectPalette } from "@/lib/subject-palette";
import { IconDisc } from "@/components/ui/icon-disc";

/* Redesign C3 (components.md §2).

   The grid variant of a paper: stacked sheet edges behind the card, a folded
   corner, ruled lines standing in for body text, a dashed divider above the
   action row, and Read + download discs. */
export interface PaperSheetCardPaper {
  id: string;
  title: string;
  school: string;
  subject: string;
  class: string;
  board: string;
  exam_type: string;
  year: number;
  file_url: string | null;
}

export interface PaperSheetCardProps {
  paper: PaperSheetCardPaper;
  locked?: boolean;
  className?: string;
}

function PaperSheetCard({ paper, locked = false, className }: PaperSheetCardProps) {
  const palette = getSubjectPalette(paper.subject);
  const navigate = useNavigate();
  const href = `/past-papers/${paper.id}`;

  return (
    <div className={cn("relative", className)}>
      {/* Stacked sheet edges behind the card. */}
      <span
        aria-hidden
        className="absolute inset-x-2 -bottom-2 top-2 rounded-2xl"
        style={{ backgroundColor: palette.meta, opacity: 0.12 }}
      />
      <span
        aria-hidden
        className="absolute inset-x-1 -bottom-1 top-1 rounded-2xl"
        style={{ backgroundColor: palette.meta, opacity: 0.2 }}
      />

      {/* A plain div (not <a>) so the download anchor in the footer can be a
          real nested link — two nested <a> elements are invalid HTML. Card-body
          navigation is handled via onClick/keyboard instead. */}
      <div
        role="link"
        tabIndex={0}
        onClick={() => navigate(href)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate(href); } }}
        className="relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl p-4 text-left transition-transform duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-6"
        style={{ backgroundColor: palette.tint }}
      >
        {/* Folded corner. */}
        <span
          aria-hidden
          className="absolute right-0 top-0 h-6 w-6"
          style={{
            background: `linear-gradient(135deg, transparent 50%, ${palette.meta}33 50%)`,
          }}
        />

        <span className="mb-2 flex flex-wrap items-center gap-2 pr-6">
          <span
            className="inline-flex min-h-6 items-center rounded-full px-3 py-1 text-label font-bold uppercase tabular-nums"
            style={{ backgroundColor: palette.solid, color: palette.badgeText }}
          >
            {paper.board}
          </span>
          <span
            className="inline-flex min-h-6 items-center rounded-full px-3 py-1 text-label font-bold uppercase tabular-nums"
            style={{ backgroundColor: palette.tint, color: palette.text, boxShadow: `inset 0 0 0 1px ${palette.meta}` }}
          >
            Class {paper.class}
          </span>
          {locked ? (
            <IconDisc tone="dark" size={26} className="ml-auto" label="Sign in to read">
              <Lock size={13} strokeWidth={2.25} aria-hidden="true" />
            </IconDisc>
          ) : null}
        </span>

        <span className="block break-words text-card-title-lg font-bold" style={{ color: palette.text }}>
          {paper.title}
        </span>
        <span className="mt-1 block break-words text-meta font-medium" style={{ color: palette.meta }}>
          {paper.school}
        </span>

        {/* Ruled lines standing in for body text. */}
        <span className="mt-3 flex flex-col gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-px"
              style={{ backgroundColor: palette.meta, opacity: 0.25, width: i === 2 ? "60%" : "100%" }}
            />
          ))}
        </span>

        {/* Dashed action divider. */}
        <span
          className="mt-auto flex items-center justify-between gap-3 pt-4"
          style={{ borderTop: `1.5px dashed ${palette.meta}55` }}
        >
          <Link
            to={href}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex min-h-8 items-center rounded-full px-4 text-label font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{ backgroundColor: palette.solid, color: palette.badgeText }}
          >
            {locked ? "Sign in to read" : "Read"}
          </Link>
          {!locked && paper.file_url ? (
            <a
              href={paper.file_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="Download"
              className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full"
            >
              <IconDisc as="span" tone="muted" size={36} shape="circle">
                <Download size={16} strokeWidth={2} aria-hidden="true" />
              </IconDisc>
            </a>
          ) : null}
        </span>
      </div>
    </div>
  );
}

export { PaperSheetCard };
