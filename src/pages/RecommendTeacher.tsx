import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
import { PageContainer, ControlBlock, BottomNavSpacer } from '@/components/layout/PageContainer';
import { PreFooter, preFooterFor } from '@/components/layout/PreFooter';

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
  const location = useLocation();
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
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit recommendation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* S11 "recommend" — the mockup shows this as step 2 of a 3-step wizard
          shared with /join-apply. This route is a single-page form, not a
          wizard, so the progress bar is not reproduced; header, field and
          footer treatment match the mockup exactly. */}
      <ControlBlock mode="dark">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex h-11 items-center gap-2 text-body-secondary font-semibold text-background/70 transition-colors duration-150 hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
        >
          <ArrowLeft size={15} strokeWidth={2.3} aria-hidden="true" />
          Back
        </button>
        <h1 className="mt-[14px] font-display text-page-title font-black leading-[1.05] tracking-[-0.04em] text-background">
          Know a teacher worth listing?
        </h1>
        <p className="mt-2 text-body-secondary text-background/80">
          Three fields. We verify before anything goes live.
        </p>
      </ControlBlock>

      <main>
      <PageContainer className="pt-8 sm:pt-10 pb-16">
        <div className="mx-auto max-w-3xl rounded-2xl bg-card p-6 shadow-border sm:p-8">
          {submitted ? (
            <div className="py-2 text-center">
              <p className="text-body font-semibold text-foreground">
                Thanks — we will reach out to them this week.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
              <Field
                label="Teacher's name"
                required
                error={nameValidation.error}
              >
                {(controlProps) => (
                  <FieldInput
                    {...controlProps}
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Subject">
                  {(controlProps) => (
                    <FieldInput
                      {...controlProps}
                      name="subject"
                      placeholder="e.g. Maths"
                      value={formData.subject}
                      onChange={handleChange}
                      maxLength={100}
                    />
                  )}
                </Field>
                <Field label="Area they teach in">
                  {(controlProps) => (
                    <FieldInput
                      {...controlProps}
                      name="area"
                      placeholder="e.g. Ballygunge"
                      value={formData.area}
                      onChange={handleChange}
                      maxLength={100}
                    />
                  )}
                </Field>
              </div>

              <Field label="Their contact, if you have it" hint="Phone or WhatsApp — we verify, we never publish it.">
                {(controlProps) => (
                  <FieldInput
                    {...controlProps}
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
                {(controlProps) => (
                  <FieldTextarea
                    {...controlProps}
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

              <Button type="submit" variant="primary" size={52} busy={loading} className="w-full">
                Send recommendation
              </Button>

              <p className="text-meta leading-relaxed text-warm-meta">
                We never publish a teacher's details without their consent, and we do not tell
                them who recommended them unless you ask us to.
              </p>
            </form>
          )}
        </div>
      </PageContainer>
      </main>

      <PageContainer className="pb-8">
        <PreFooter variant={preFooterFor(location.pathname)} />
      </PageContainer>
      <BottomNavSpacer />
      <Footer />
    </div>
  );
}
