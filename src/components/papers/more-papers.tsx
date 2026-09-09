import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

export interface MorePapersItem {
  id: string;
  title: string;
  year: string | number | null;
}

/**
 * "More papers like this" — same subject/class/board, at the end of a
 * paper's own reading page. Both readers (BankPaper.tsx, PaperReader.tsx)
 * already had this exact query as a signed-in-only side rail for prev/next
 * navigation; this is the same data, unrelated to that gate — paper titles
 * and years are already public metadata (anon-readable on both bank_papers
 * and papers), so there's no reason this discovery section should be
 * signed-in only too. Each reader fetches its own list (different source
 * table, same shape) and passes it in here.
 */
export function MorePapers({ items, currentId }: { items: MorePapersItem[]; currentId: string }) {
  const others = items.filter((p) => p.id !== currentId).slice(0, 6);
  if (others.length === 0) return null;

  return (
    <div className="mt-4 rounded-[24px] bg-muted p-[18px]">
      <p className="text-[17px] font-extrabold tracking-[-0.03em] text-foreground">More papers like this</p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {others.map((p) => (
          <li key={p.id}>
            <Link
              to={`/past-papers/${p.id}`}
              className="flex items-center gap-2.5 rounded-2xl bg-card p-3 transition-transform duration-tap hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-muted">
                <FileText className="h-4 w-4 text-warm-label" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[14px] font-semibold text-foreground">{p.title}</span>
                {p.year && <span className="block text-[12.5px] text-warm-label">{p.year}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
