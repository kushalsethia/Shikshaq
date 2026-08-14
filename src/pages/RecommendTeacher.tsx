import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { useRequireRole } from '@/hooks/use-require-role';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { toast } from 'sonner';
import { z } from 'zod';
import { usePageMeta } from '@/hooks/usePageMeta';
import { logger } from '@/utils/logger';

const FIELD_BASE =
  'w-full box-border min-h-12 px-4 py-3 rounded-lg bg-background text-base text-foreground outline-none ring-1 ring-inset ring-warm-hairline shikshaq-recommend-field';
const FIELD_ERROR = 'ring-destructive';
const LABEL = 'text-sm font-semibold text-foreground mb-2';

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
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-16">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight text-foreground">
          Recommend a teacher
        </h1>
        <p className="mt-3 max-w-prose text-base leading-relaxed text-muted-foreground">
          Tell us who taught you well. We contact them, verify their experience, and list them only if they agree.
        </p>

        <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-card shadow-border">
          {submitted ? (
            <div className="text-center py-2">
              <p className="text-lg font-semibold text-foreground">
                Thanks — we will reach out to them this week.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              {/* Teacher's name */}
              <div>
                <label htmlFor="teacherName" className={LABEL}>Teacher's name</label>
                <input
                  id="teacherName"
                  name="teacherName"
                  placeholder="e.g. Ananya Ghosh"
                  value={formData.teacherName}
                  onChange={handleChange}
                  maxLength={100}
                  className={`${FIELD_BASE} ${error ? FIELD_ERROR : ''}`}
                />
                {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
              </div>

              {/* Subject / Area pair */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="subject" className={LABEL}>Subject</label>
                  <input
                    id="subject"
                    name="subject"
                    placeholder="e.g. Maths"
                    value={formData.subject}
                    onChange={handleChange}
                    maxLength={100}
                    className={FIELD_BASE}
                  />
                </div>
                <div>
                  <label htmlFor="area" className={LABEL}>Area they teach in</label>
                  <input
                    id="area"
                    name="area"
                    placeholder="e.g. Ballygunge"
                    value={formData.area}
                    onChange={handleChange}
                    maxLength={100}
                    className={FIELD_BASE}
                  />
                </div>
              </div>

              {/* Contact */}
              <div>
                <label htmlFor="contact" className={LABEL}>Their contact, if you have it</label>
                <input
                  id="contact"
                  name="contact"
                  placeholder="Phone or WhatsApp number"
                  value={formData.contact}
                  onChange={handleChange}
                  maxLength={50}
                  className={FIELD_BASE}
                />
              </div>

              {/* Reason */}
              <div>
                <label htmlFor="reason" className={LABEL}>Why you would recommend them</label>
                <textarea
                  id="reason"
                  name="reason"
                  rows={4}
                  placeholder="A line or two is enough."
                  value={formData.reason}
                  onChange={handleChange}
                  maxLength={1000}
                  className={`${FIELD_BASE} leading-relaxed resize-y`}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="hover:opacity-90 active:scale-[0.97] transition-[opacity,transform] duration-150 min-h-[52px] p-4 rounded-lg bg-foreground text-background text-center text-base font-semibold disabled:opacity-70"
              >
                Send recommendation
              </button>

              <p className="text-xs leading-relaxed text-warm-meta">
                We never publish a teacher's details without their consent, and we do not tell them who recommended them unless you ask us to.
              </p>
            </form>
          )}
        </div>
      </div>

      <Footer />

      <style>{`
        .shikshaq-recommend-field { transition: box-shadow .15s ease; }
        .shikshaq-recommend-field:focus { box-shadow: 0 0 0 2px hsl(var(--foreground)); outline: none; }
      `}</style>
    </div>
  );
}
