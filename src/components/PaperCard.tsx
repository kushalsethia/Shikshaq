import { Link } from 'react-router-dom';
import { HelpCircle, Award } from 'lucide-react';
import { getSubjectPalette } from '@/lib/subject-palette';

export interface PaperCardPaper {
  id: string;
  title: string;
  school: string;
  subject: string;
  class: string;
  board: string;
  exam_type: string;
  year: number;
  /** Not yet collected by the papers table — undefined hides the stat, never "0 questions". */
  question_count?: number | null;
  total_marks?: number | null;
  file_url: string | null;
}

export type PaperCardVariant = 'recent' | 'result' | 'compact';

interface PaperCardProps {
  paper: PaperCardPaper;
  variant?: PaperCardVariant;
  /** Recent-only, factual sticker text (e.g. "New this week"). Never marketing copy. */
  sticker?: string;
}

export function PaperCard({ paper, variant = 'result', sticker }: PaperCardProps) {
  // VISUAL_LANGUAGE §3 subject palette — the ONE sanctioned source for subject
  // color. Was previously reading from the now-superseded src/utils/subjectColors.ts;
  // both implementations agreed on the formula, but subject-palette.ts is the
  // canonical one going forward (per HANDOFF.md §4).
  const colors = getSubjectPalette(paper.subject);
  const isCompact = variant === 'compact';
  const isRecent = variant === 'recent';
  const isResult = variant === 'result';

  const stats = isResult
    ? [
        paper.question_count ? { icon: HelpCircle, label: `${paper.question_count} questions` } : null,
        paper.total_marks ? { icon: Award, label: `${paper.total_marks} marks` } : null,
      ].filter((s): s is { icon: typeof HelpCircle; label: string } => s !== null)
    : [];

  return (
    <Link
      to={`/past-papers/${paper.id}`}
      className="shikshaq-paper-card"
      style={{
        position: 'relative',
        display: 'block',
        padding: isRecent ? 22 : 20,
        borderRadius: 20,
        background: colors.tint,
        textAlign: 'left',
      }}
    >
      {isRecent && sticker && (
        // VISUAL_LANGUAGE §1.5 — tilted, overhanging sticker. White text on
        // near-black (`--foreground`, which is the handoff's #1F1F1F), not a raw
        // hex literal.
        <span
          style={{
            position: 'absolute',
            top: -11,
            right: 16,
            transform: 'rotate(5deg)',
            padding: '6px 12px',
            borderRadius: 999,
            background: 'hsl(var(--foreground))',
            color: 'white',
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {sticker}
        </span>
      )}

      {!isCompact && (
        <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 999,
              background: colors.solid,
              color: colors.badgeText,
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {paper.subject}
          </span>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 999,
              background: 'hsl(var(--foreground) / 0.07)',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            Class {paper.class} {paper.board}
          </span>
        </span>
      )}

      <span
        style={{
          display: 'block',
          fontSize: isRecent ? 21 : isResult ? 20 : 19,
          fontWeight: 700,
          letterSpacing: '-.035em',
        }}
      >
        {paper.title}
      </span>

      <span
        style={{
          display: 'block',
          marginTop: isRecent ? 6 : 5,
          fontSize: isCompact ? 13.5 : 14,
          fontWeight: 500,
          color: colors.meta,
        }}
      >
        {paper.school}
      </span>

      {stats.length > 0 && (
        <span style={{ display: 'flex', gap: 14, marginTop: 16, fontSize: 12, fontWeight: 500, color: colors.meta }}>
          {stats.map(({ icon: Icon, label }) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon size={13} color={colors.meta} strokeWidth={2} />
              {label}
            </span>
          ))}
        </span>
      )}

      {(isRecent || isResult) && (
        <span
          style={{
            display: 'block',
            marginTop: isRecent ? 14 : 16,
            paddingTop: isRecent ? 12 : 13,
            fontSize: isRecent ? 11.5 : 12,
            color: colors.meta,
            boxShadow: 'inset 0 1px 0 hsl(var(--foreground) / 0.09)',
          }}
        >
          Paper © {paper.school}
        </span>
      )}

      {isCompact && (
        <span style={{ display: 'block', marginTop: 14, fontSize: 12, color: colors.meta }}>
          {paper.board} · Class {paper.class} · {paper.exam_type} {paper.year}
        </span>
      )}
    </Link>
  );
}
