import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { useRequireRole } from '@/hooks/use-require-role';
import { Footer } from '@/components/Footer';
import { toast } from 'sonner';
import { z } from 'zod';
import { usePageMeta } from '@/hooks/usePageMeta';
import { logger } from '@/utils/logger';
import { Button } from '@/components/ui/button';
import { Field, FieldInput, FieldTextarea, useBlurValidation } from '@/components/ui/field';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BentoStack, BentoPanel } from '@/components/layout/PageContainer';
import { EyesPanel } from '@/components/home/EyesPanel';
import { useSentenceBuilder } from '@/hooks/useSentenceBuilder';
import { SUBJECTS } from '@/utils/searchFacets';
import { getSubjectColors } from '@/utils/subjectColors';

/* JA-004's "Fields" pattern (this changelog's shared control spec, reused
   here since RC-001 does not restate its own): 52px h-[52px] rounded-2xl
   bg-muted inputs, 96px textarea. Applied via `!`-prefixed overrides on
   Field's own controlBase (h-14/rounded-[15px]/bg-card/shadow-border),
   since two Tailwind utilities targeting the same box side are not
   guaranteed to resolve by className string order — only `!important` does
   that deterministically. */
const RC_FIELD_OVERRIDE = '!h-[52px] !rounded-2xl !bg-muted !shadow-none !text-base';
const RC_TEXTAREA_OVERRIDE = '!min-h-[96px] !max-h-none !rounded-2xl !bg-muted !shadow-none !text-base';

const recommendSchema = z.object({
  teacherName: z.string().trim().min(1, "Please enter the teacher's name").max(100, "Teacher's name is too long"),
  subject: z.string().trim().max(100, 'Subject is too long').optional(),
  area: z.string().trim().max(100, 'Area is too long').optional(),
  contact: z.string().trim().max(50, 'Contact is too long').optional(),
  reason: z.string().trim().max(1000, 'Please keep this under 1000 characters').optional(),
});

export default function RecommendTeacher() {
  usePageMeta(
    'Recommend a Tuition Teacher in Kolkata | Shikshaq',
    'Know a great tuition teacher in Kolkata? Recommend them to Shikshaq so other students and parents can find them. Free to submit, takes under a minute.'
  );

  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    teacherName: '',
    subject: '',
    area: '',
    contact: '',
    reason: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Ensure user has selected a role
  useRequireRole();

  const { builderMode, setBuilderMode, slots, onSlotChange, onSubmit } = useSentenceBuilder();

  const nameValidation = useBlurValidation(formData.teacherName, (v) =>
    v.trim().length === 0 ? "Please enter the teacher's name" : undefined
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is signed in
    if (!user) {
      toast.error('Please sign in to submit a recommendation');
      navigate('/auth');
      return;
    }

    const result = recommendSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.errors[0]?.message || "Please enter the teacher's name");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const notesParts: string[] = [];
      if (formData.subject.trim()) notesParts.push(`Subject: ${formData.subject.trim()}`);
      if (formData.area.trim()) notesParts.push(`Area: ${formData.area.trim()}`);
      if (formData.reason.trim()) notesParts.push(`Why: ${formData.reason.trim()}`);

      // Submit to Supabase with user_id; recommender identity comes from the
      // signed-in account since the form itself only collects details about
      // the teacher being recommended.
      const { error: submitError } = await supabase
        .from('teacher_recommendations')
        .insert({
          user_id: user.id,
          recommender_name: profile?.full_name || user.email || 'Shikshaq user',
          recommender_contact: user.email || user.phone || '',
          teacher_name: formData.teacherName.trim(),
          teacher_contact: formData.contact.trim(),
          status: 'pending',
          notes: notesParts.length ? notesParts.join('\n') : null,
        });

      if (submitError) {
        logger.error('RecommendTeacher.submit', submitError);
        if (submitError.message?.includes('RATE_LIMIT_EXCEEDED')) {
          throw new Error("You've reached the daily limit for recommendations. Please try again tomorrow.");
        }
        throw new Error(submitError.message || 'Failed to submit recommendation');
      }

      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit recommendation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BentoStack>
      <main className="contents">
        {/* RC-001 header. The mockup draws this as step 2 of a shared 3-step
            wizard with /join/apply — this route has no such step state (it
            is, and has always been, a single-page form; see the pre-existing
            comment this replaces). Rendering a "Step 2 of 3" pill here would
            fabricate wizard progress that does not exist, which the G-5
            honesty gate rules out, so the pill is dropped and only the
            heading/support line (existing copy, unchanged) are kept. */}
        <BentoPanel fill="dark" edge="top" className="px-5 pt-5 pb-6 lg:px-8">
          <h1 className="font-display text-[30px] font-black leading-[1.05] tracking-[-0.04em] text-background">
            Know a teacher worth listing?
          </h1>
          <p className="mt-2 text-[14.5px] leading-[1.55] text-background/80">
            Three fields. We verify before anything goes live.
          </p>
        </BentoPanel>

        <BentoPanel fill="card" className="px-5 py-5 lg:px-8 lg:py-8">
          {submitted ? (
            <div className="rounded-2xl bg-brand p-6 text-center text-brand-foreground sm:p-8">
              <p className="text-body font-semibold">
                Thanks — we will reach out to them this week.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
              <Field label="Teacher's name" required error={nameValidation.error}>
                {(p) => (
                  <FieldInput
                    {...p}
                    className={`${p.className} ${RC_FIELD_OVERRIDE}`}
                    name="teacherName"
                    placeholder="e.g. Ananya Ghosh"
                    value={formData.teacherName}
                    onChange={handleChange}
                    onBlur={nameValidation.onBlur}
                    maxLength={100}
                    autoComplete="name"
                  />
                )}
              </Field>

              {/* Real, working functionality the changelog's own "four
                  fields" count omits (name/area/phone/why-them) — the
                  changelog was evidently written against an earlier version
                  of this file. This chip row replaced a free-text Subject
                  field specifically to stop admins reconciling "maths" /
                  "Mathematics" / "Math" by hand against the canonical list;
                  dropping it back to prose would silently regress that fix.
                  Kept, and restyled to this file's own JA-004 multi-select
                  chip spec: selected in the subject's tint/text with a
                  trailing check, unselected bg-muted/text-warm-secondary. */}
              <div>
                <Eyebrow as="p" className="mb-2">Subject</Eyebrow>
                <div
                  role="group"
                  aria-label="Subject"
                  className="flex flex-wrap gap-2"
                >
                  {SUBJECTS.map((subject) => {
                    const selected = formData.subject === subject;
                    const sc = getSubjectColors(subject);
                    return (
                      <button
                        key={subject}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, subject: selected ? '' : subject }))
                        }
                        className={`inline-flex h-11 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-[14px] font-semibold transition-colors duration-150 ${
                          selected ? '' : 'bg-muted text-warm-secondary'
                        }`}
                        style={selected ? { background: sc.tint, color: sc.titleText } : undefined}
                      >
                        {subject}
                        {selected && <Check className="h-[14px] w-[14px]" aria-hidden />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Field label="Area they teach in">
                {(p) => (
                  <FieldInput
                    {...p}
                    className={`${p.className} ${RC_FIELD_OVERRIDE}`}
                    name="area"
                    placeholder="e.g. Ballygunge"
                    value={formData.area}
                    onChange={handleChange}
                    maxLength={100}
                  />
                )}
              </Field>

              <Field label="Their contact, if you have it" hint="Phone or WhatsApp — we verify, we never publish it.">
                {(p) => (
                  <FieldInput
                    {...p}
                    className={`${p.className} ${RC_FIELD_OVERRIDE}`}
                    type="tel"
                    name="contact"
                    placeholder="e.g. +91 98300 00000"
                    value={formData.contact}
                    onChange={handleChange}
                    maxLength={50}
                    autoComplete="tel"
                  />
                )}
              </Field>

              <Field label="Why you would recommend them">
                {(p) => (
                  <FieldTextarea
                    {...p}
                    className={`${p.className} ${RC_TEXTAREA_OVERRIDE}`}
                    name="reason"
                    rows={4}
                    placeholder="A line or two is enough."
                    value={formData.reason}
                    onChange={handleChange}
                    maxLength={1000}
                  />
                )}
              </Field>

              {error ? (
                <p role="alert" className="text-meta text-facet-destructive">
                  {error}
                </p>
              ) : null}

              <Button type="submit" variant="primary" size={54} busy={loading} className="w-full">
                Send recommendation
              </Button>
            </form>
          )}
        </BentoPanel>

        {/* RC-001 privacy note — load-bearing copy, literal per the entry. */}
        <BentoPanel fill="brandTint" className="px-5 py-5 lg:px-8">
          <p className="text-[14px] leading-[1.55] text-warm-prose">
            We contact them ourselves. Their number is never published, and nothing goes live until they agree.
          </p>
        </BentoPanel>

        <EyesPanel
          mode={builderMode}
          onModeChange={setBuilderMode}
          heading={
            <>
              Still deciding? <span className="font-extrabold">We&apos;re watching out for you.</span>
            </>
          }
          subline="Fill in the blanks and we'll take you straight there."
          slots={slots}
          onSlotChange={onSlotChange}
          onSubmit={onSubmit}
        />
      </main>

      <Footer />
    </BentoStack>
  );
}
