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

const TOKENS = {
  bg: '#F9F5F1',
  card: '#FCFAF7',
  text: '#1F1F1F',
  textSecondary: '#7B736B',
  textTertiary: '#8B837A',
  hairline: '#E7DFD5',
  error: '#B3261E',
};

const fieldBase: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  border: 'none',
  padding: '13px 15px',
  borderRadius: 12,
  background: TOKENS.bg,
  fontFamily: 'inherit',
  fontSize: 15,
  color: TOKENS.text,
  outline: 'none',
};

function inputStyle(hasError?: boolean): React.CSSProperties {
  return {
    ...fieldBase,
    minHeight: 48,
    boxShadow: hasError ? `0 0 0 1.5px ${TOKENS.error}` : `0 0 0 1px ${TOKENS.hairline}`,
  };
}

const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, marginBottom: 7, color: TOKENS.text };

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
    <div style={{ minHeight: '100vh', background: TOKENS.bg }}>
      <Navbar />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(28px,5vw,56px) clamp(16px,3vw,28px) 56px' }}>
        <h1 style={{ fontSize: 'clamp(26px,3.6vw,38px)', lineHeight: 1.02, fontWeight: 700, color: TOKENS.text }}>
          Recommend a teacher
        </h1>
        <p style={{ marginTop: 14, maxWidth: '58ch', fontSize: 16, lineHeight: 1.65, color: TOKENS.textSecondary }}>
          Tell us who taught you well. We contact them, verify their experience, and list them only if they agree.
        </p>

        <div style={{ marginTop: 28, padding: 'clamp(22px,3vw,32px)', borderRadius: 24, background: TOKENS.card, boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: TOKENS.text }}>
                Thanks — we will reach out to them this week.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
              {/* Teacher's name */}
              <div>
                <div style={labelStyle}>Teacher's name</div>
                <input
                  name="teacherName"
                  placeholder="e.g. Ananya Ghosh"
                  value={formData.teacherName}
                  onChange={handleChange}
                  maxLength={100}
                  style={inputStyle(!!error)}
                />
                {error && <p style={{ marginTop: 6, fontSize: 13, color: TOKENS.error }}>{error}</p>}
              </div>

              {/* Subject / Area pair */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14 }}>
                <div>
                  <div style={labelStyle}>Subject</div>
                  <input
                    name="subject"
                    placeholder="e.g. Maths"
                    value={formData.subject}
                    onChange={handleChange}
                    maxLength={100}
                    style={inputStyle()}
                  />
                </div>
                <div>
                  <div style={labelStyle}>Area they teach in</div>
                  <input
                    name="area"
                    placeholder="e.g. Ballygunge"
                    value={formData.area}
                    onChange={handleChange}
                    maxLength={100}
                    style={inputStyle()}
                  />
                </div>
              </div>

              {/* Contact */}
              <div>
                <div style={labelStyle}>Their contact, if you have it</div>
                <input
                  name="contact"
                  placeholder="Phone or WhatsApp number"
                  value={formData.contact}
                  onChange={handleChange}
                  maxLength={50}
                  style={inputStyle()}
                />
              </div>

              {/* Reason */}
              <div>
                <div style={labelStyle}>Why you would recommend them</div>
                <textarea
                  name="reason"
                  rows={4}
                  placeholder="A line or two is enough."
                  value={formData.reason}
                  onChange={handleChange}
                  maxLength={1000}
                  style={{ ...fieldBase, boxShadow: `0 0 0 1px ${TOKENS.hairline}`, lineHeight: 1.5, resize: 'vertical' }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="hover:opacity-90 active:scale-[0.97] transition-[opacity,transform] duration-150"
                style={{ minHeight: 52, padding: 15, borderRadius: 12, background: TOKENS.text, color: '#fff', textAlign: 'center', fontSize: 15, fontWeight: 600, opacity: loading ? 0.7 : undefined }}
              >
                Send recommendation
              </button>

              <p style={{ fontSize: 12.5, lineHeight: 1.55, color: TOKENS.textTertiary }}>
                We never publish a teacher's details without their consent, and we do not tell them who recommended them unless you ask us to.
              </p>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
