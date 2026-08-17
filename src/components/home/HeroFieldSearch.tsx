import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Search, Zap, GraduationCap, MapPin } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SUBJECTS, CLASSES, AREAS } from '@/utils/searchFacets';

/* Redesign C5 desktop variant (desktop-01-home.png).

   The mockup's desktop hero does NOT use the mobile search field. It uses three
   labelled dropdowns — SUBJECT / CLASS / AREA — sitting on one row with a solid
   orange Search button at the end, under a "Find a teacher" title and the line
   "Three fields, then you are talking to them on WhatsApp."

   This renders only at lg and up; below that the mobile SearchControl still owns
   the card, which is what the mobile mockups show. Both write the same query
   string and land on the same route, so the two devices are interchangeable and
   a link copied from one width still works at the other.

   Empty is a valid state for every field: submitting with nothing chosen goes to
   unfiltered browse rather than blocking on a required field. */

type FieldKey = 'subject' | 'cls' | 'area';

interface FieldDef {
  key: FieldKey;
  label: string;
  placeholder: string;
  icon: typeof Zap;
  options: string[];
}

const FIELDS: FieldDef[] = [
  { key: 'subject', label: 'Subject', placeholder: 'Any subject', icon: Zap, options: SUBJECTS },
  {
    key: 'cls',
    label: 'Class',
    placeholder: 'Any class',
    icon: GraduationCap,
    options: CLASSES.map((c) => `Class ${c}`),
  },
  { key: 'area', label: 'Area', placeholder: 'Anywhere in Kolkata', icon: MapPin, options: AREAS },
];

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2';

function Field({
  def,
  value,
  onPick,
}: {
  def: FieldDef;
  value: string;
  onPick: (v: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const Icon = def.icon;

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <span
        id={`hero-field-${def.key}`}
        className="text-label font-bold uppercase tracking-[0.07em] text-warm-label"
      >
        {def.label}
      </span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-labelledby={`hero-field-${def.key}`}
            className={cn(
              'flex h-12 w-full items-center gap-2 rounded-xl bg-background px-3 text-left shadow-border transition-colors duration-150 hover:bg-muted',
              FOCUS,
            )}
          >
            <Icon className="size-4 flex-none text-warm-label" aria-hidden />
            <span
              className={cn(
                'min-w-0 flex-1 truncate text-body-secondary',
                value ? 'font-semibold text-foreground' : 'text-warm-prose',
              )}
            >
              {value || def.placeholder}
            </span>
            <ChevronDown className="size-4 flex-none text-warm-label" aria-hidden />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="max-h-72 w-64 overflow-y-auto p-2">
          <ul className="flex flex-col gap-1">
            {/* An explicit "any" row — without it there is no way back to the
                empty state once a value is chosen, which strands anyone who
                picks the wrong subject. */}
            {['', ...def.options].map((opt) => (
              <li key={opt || '__any'}>
                <button
                  type="button"
                  onClick={() => {
                    onPick(opt);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex h-11 w-full items-center rounded-lg px-3 text-left text-body-secondary transition-colors duration-150 hover:bg-muted',
                    FOCUS,
                    value === opt && 'bg-muted font-semibold',
                  )}
                >
                  {opt || def.placeholder}
                </button>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function HeroFieldSearch({ className = '' }: { className?: string }) {
  const navigate = useNavigate();
  const [values, setValues] = React.useState<Record<FieldKey, string>>({
    subject: '',
    cls: '',
    area: '',
  });

  /* Same parameter names the footer sentence builder writes, so the two
     controls stay one search rather than two that drift apart. */
  const submit = () => {
    const params = new URLSearchParams();
    if (values.subject) params.set('filter_subjects', values.subject);
    if (values.cls) params.set('filter_classes', values.cls.replace(/^Class /, ''));
    if (values.area) params.set('filter_areas', values.area);
    const qs = params.toString();
    navigate(`/all-tuition-teachers-in-kolkata${qs ? `?${qs}` : ''}`);
  };

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="flex items-center gap-2">
        <Search className="size-4 text-brand" aria-hidden />
        <h2 className="font-display text-card-title font-extrabold text-foreground">Find a teacher</h2>
      </div>
      <p className="mt-1 text-meta text-warm-prose">
        Three fields, then you are talking to them on WhatsApp.
      </p>

      <div className="mt-5 flex items-end gap-3">
        {FIELDS.map((def) => (
          <Field
            key={def.key}
            def={def}
            value={values[def.key]}
            onPick={(v) => setValues((prev) => ({ ...prev, [def.key]: v }))}
          />
        ))}
        <button
          type="submit"
          className={cn(
            'inline-flex h-12 flex-none items-center gap-2 rounded-xl bg-brand px-6 font-bold text-brand-foreground transition-colors duration-150 hover:bg-brand-hover active:scale-[0.97]',
            FOCUS,
          )}
        >
          Search
          <Search className="size-4" aria-hidden />
        </button>
      </div>
    </form>
  );
}
