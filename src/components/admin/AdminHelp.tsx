import { Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { BentoPanel } from '@/components/layout/PageContainer';
import { ADMIN_PAGES, TIPS, type AdminPageKey, type TipKey } from '@/lib/admin-hints';

/* The two pieces of help every admin page shares: a small "i" that opens a
   one-line explanation (a popover, so it works on a phone as well as with a
   mouse), and the "What this page is for" strip under the nav. All wording
   lives in src/lib/admin-hints.ts. */

export function InfoTip({ tip, text, label, className }: { tip?: TipKey; text?: string; label?: string; className?: string }) {
  const words = text ?? (tip ? TIPS[tip] : '');
  if (!words) return null;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={label ? `What is ${label}?` : 'What is this?'}
          className={cn(
            'relative inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-warm-label transition-colors duration-150 before:absolute before:-inset-3 before:content-[""] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            className,
          )}
        >
          <Info className="h-4 w-4" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" className="w-64 rounded-2xl bg-card p-3 text-[13px] font-normal normal-case leading-[1.5] tracking-normal text-foreground">
        {words}
      </PopoverContent>
    </Popover>
  );
}

/** "What this page is for" plus what each button does. */
export function AdminPageIntro({ page, className }: { page: AdminPageKey; className?: string }) {
  const copy = ADMIN_PAGES[page];
  return (
    <section
      aria-label="What this page is for"
      className={cn('rounded-[18px] bg-brand-blue-subtle px-4 py-3.5 lg:px-5', className)}
    >
      <p className="text-[11px] font-bold uppercase tracking-[.06em] text-warm-label">What this page is for</p>
      <p className="mt-1 text-pretty text-[14px] leading-[1.55] text-foreground">{copy.purpose}</p>
      <p className="mt-1 text-pretty text-[13px] leading-[1.5] text-warm-secondary">{copy.flow}</p>
      {copy.buttons.length > 0 ? (
        <details className="group mt-2">
          <summary className="inline-flex min-h-8 cursor-pointer list-none items-center text-[13px] font-bold text-brand-blue marker:hidden [&::-webkit-details-marker]:hidden">
            What the buttons do
          </summary>
          <dl className="mt-1 space-y-1.5">
            {copy.buttons.map((b) => (
              <div key={b.label} className="text-[13px] leading-[1.5]">
                <dt className="inline font-bold text-foreground">{b.label}: </dt>
                <dd className="inline text-warm-secondary">{b.does}</dd>
              </div>
            ))}
          </dl>
        </details>
      ) : null}
    </section>
  );
}

/** The intro as its own panel under the nav, for pages that do not already
 *  hold it inside their first panel. */
export function AdminPageIntroPanel({ page }: { page: AdminPageKey }) {
  return (
    <BentoPanel fill="card" className="px-4 py-4 lg:px-[18px] lg:py-4">
      <AdminPageIntro page={page} />
    </BentoPanel>
  );
}
