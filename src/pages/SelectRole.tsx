import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GraduationCap, Users, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from '@/components/Logo';
import { invalidateUserProfileCache } from '@/utils/cache';
import { BentoPanel } from '@/components/layout/PageContainer';

const FIELD_CLASS =
  'w-full min-h-12 rounded-lg bg-background text-base text-foreground outline-none ring-1 ring-inset ring-warm-hairline px-4 shikshaq-role-field';
const LABEL_CLASS = 'block text-sm font-semibold text-foreground mb-2';

function isValidRedirect(path: string | null): path is string {
  return !!path && path.startsWith('/') && !path.startsWith('//');
}

export default function SelectRole() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const [role, setRole] = useState<'student' | 'guardian' | ''>('');
  const [schoolCollege, setSchoolCollege] = useState('');
  const [grade, setGrade] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const [hasRole, setHasRole] = useState(false);

  // Check once on mount if user already has a role - only run once
  useEffect(() => {
    let isMounted = true;

    const checkExistingRole = async () => {
      // Wait for auth to finish loading
      if (authLoading) return;

      // If no user, allow them to see the sign-in message
      if (!user) {
        if (isMounted) {
          setCheckingRole(false);
        }
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, terms_agreement')
          .eq('id', user.id)
          .maybeSingle();

        if (isMounted) {
          if (profile && profile.role) {
            // User already has a role
            const returnPath = isValidRedirect(redirectTo) ? redirectTo : '/';
            if (profile.role === 'teacher') {
              // If teacher hasn't agreed to terms, redirect to teacher terms agreement (preserve return URL)
              if (profile.terms_agreement !== true) {
                const to = isValidRedirect(redirectTo) ? `/teacher-terms-agreement?redirect=${encodeURIComponent(redirectTo)}` : '/teacher-terms-agreement';
                navigate(to, { replace: true });
                return;
              }
              // If teacher has agreed, redirect back or home
              navigate(returnPath, { replace: true });
            } else {
              // Student or guardian - redirect back or home
              navigate(returnPath, { replace: true });
            }
            setHasRole(true);
          } else {
            // User doesn't have a role - show the form (guarded)
            setCheckingRole(false);
          }
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error checking role:', error);
        }
        if (isMounted) {
          setCheckingRole(false);
        }
      }
    };

    checkExistingRole();

    return () => {
      isMounted = false;
    };
  }, [user, authLoading, navigate, redirectTo]); // Only run when user or authLoading changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      toast.error('Please select whether you are a student or guardian');
      return;
    }

    if (role === 'student') {
      if (!schoolCollege.trim()) {
        toast.error('Please enter your school or college name');
        return;
      }
      if (!grade) {
        toast.error('Please select your grade');
        return;
      }
    }

    if (!termsAgreed) {
      toast.error('Please agree to the Terms and Privacy Policy to continue');
      return;
    }

    if (!user) {
      toast.error('You must be signed in to continue');
      const to = isValidRedirect(redirectTo) ? `/auth?redirect=${encodeURIComponent(redirectTo)}` : '/auth';
      navigate(to);
      return;
    }

    setLoading(true);

    try {
      const upsertData = {
        id: user.id,
        role: role,
        terms_agreement: termsAgreed,
        ...(role === 'student' ? { school_college: schoolCollege.trim(), grade } : {}),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(upsertData, {
          onConflict: 'id'
        });

      if (error) {
        if (import.meta.env.DEV) console.error('Error updating profile:', error);
        toast.error('Failed to update profile. Please try again.');
        setLoading(false);
        return;
      }

      // Invalidate cache to ensure fresh data on next page load
      if (user) {
        invalidateUserProfileCache(user.id);
      }

      toast.success('Profile created successfully!');

      // Small delay to ensure cache is cleared, then redirect back or home
      const returnPath = isValidRedirect(redirectTo) ? redirectTo : '/';
      setTimeout(() => {
        navigate(returnPath, { replace: true });
      }, 100);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  // Show loading state only while checking auth or initial role check
  if (authLoading || checkingRole) {
    return (
      <BentoPanel fill="card" edge="top" className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-warm-hairline border-b-brand mx-auto mb-4" />
          <p className="text-muted-foreground text-base">Loading...</p>
        </div>
      </BentoPanel>
    );
  }

  // If user already has a role, don't render (they should be redirected)
  if (hasRole) {
    return null;
  }

  // If no user, show sign-in prompt
  if (!user) {
    return (
      <BentoPanel fill="card" edge="top" className="flex min-h-screen flex-col">
        {/* <main>, not <div> — the signed-out branch is the one an unauthenticated
            visitor actually reaches, and it was the only branch of this page with
            no main landmark, so skip-to-content and landmark navigation had
            nothing to target exactly when the page is at its most confusing. */}
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
          <Logo size="lg" className="mb-6" />
          <h1 className="mb-4 font-display text-[30px] font-black leading-[1.05] tracking-[-0.04em] text-foreground">
            You must be signed in to continue.
          </h1>
          <button
            onClick={() => navigate(isValidRedirect(redirectTo) ? `/auth?redirect=${encodeURIComponent(redirectTo)}` : '/auth')}
            className="active:scale-[0.98] transition-transform duration-150 min-h-12 px-6 rounded-lg bg-foreground text-background text-base font-bold"
          >
            Sign In
          </button>
        </main>
      </BentoPanel>
    );
  }

  // SR-001 — one full-height card panel. Two r24 role cards (Guardian first,
  // Student second, per the mockup and this entry's own listed order —
  // ordering only, the submit logic below is unchanged either way);
  // selection is communicated with an inset ring in the card's own solid
  // colour, never a fill swap, so the card does not restyle under the
  // finger. Role copy is unchanged except the support line, which the entry
  // supplies verbatim ("This only changes what your account shows you. You
  // can search either way.") — the app's existing line did not contain that
  // sentence, so this is the one line this entry authorizes changing.
  return (
    <BentoPanel fill="card" edge="top" className="flex min-h-screen flex-col px-4 pb-8 pt-[22px] sm:px-6 sm:pb-16">
      <main className="mx-auto flex w-full max-w-[480px] flex-1 flex-col">
        <div className="mb-2 text-center">
          <Logo size="lg" className="mx-auto mb-4" />
          <h1 className="font-display text-[30px] font-black leading-[1.05] tracking-[-0.04em] text-foreground">
            Who's using ShikshAQ?
          </h1>
          <p className="mt-2 text-[14.5px] leading-[1.55] text-warm-prose">
            This only changes what your account shows you. You can search either way.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-[18px] flex flex-1 flex-col">
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => setRole('guardian')}
              aria-pressed={role === 'guardian'}
              className={`flex items-center gap-[14px] rounded-[24px] bg-brand-subtle p-5 text-left transition-transform duration-150 active:scale-[0.98] ${
                role === 'guardian' ? 'shadow-[inset_0_0_0_2px_hsl(var(--brand))]' : ''
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-brand text-brand-foreground">
                <Users className="h-[19px] w-[19px]" strokeWidth={2} />
              </span>
              <span className="flex-1">
                <span className="mt-[14px] block font-display text-[21px] font-extrabold tracking-[-0.04em] text-brand-deep">Guardian</span>
                <span className="mt-[3px] block text-[14px] leading-[1.5] text-warm-prose">
                  Your relationship to the student, plus their details.
                </span>
              </span>
              <ChevronRight className="h-[18px] w-[18px] shrink-0 text-warm-meta" strokeWidth={2.4} />
            </button>

            <button
              type="button"
              onClick={() => setRole('student')}
              aria-pressed={role === 'student'}
              className={`flex items-center gap-[14px] rounded-[24px] bg-brand-blue-subtle p-5 text-left transition-transform duration-150 active:scale-[0.98] ${
                role === 'student' ? 'shadow-[inset_0_0_0_2px_hsl(var(--brand-blue))]' : ''
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-brand-blue text-brand-blue-foreground">
                <GraduationCap className="h-[19px] w-[19px]" strokeWidth={2} />
              </span>
              <span className="flex-1">
                <span className="mt-[14px] block font-display text-[21px] font-extrabold tracking-[-0.04em] text-brand-blue-deep">Student</span>
                <span className="mt-[3px] block text-[14px] leading-[1.5] text-warm-prose">
                  School, board, class and the subjects you need help with.
                </span>
              </span>
              <ChevronRight className="h-[18px] w-[18px] shrink-0 text-warm-meta" strokeWidth={2.4} />
            </button>
          </div>

          {role === 'student' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 mt-[18px] flex flex-col gap-[18px]">
              <div>
                <label htmlFor="school_college" className={LABEL_CLASS}>
                  School / College <span className="text-destructive">*</span>
                </label>
                <input
                  id="school_college"
                  placeholder="e.g. Delhi Public School"
                  value={schoolCollege}
                  onChange={(e) => setSchoolCollege(e.target.value)}
                  className={FIELD_CLASS}
                />
              </div>
              <div>
                <label htmlFor="grade" className={LABEL_CLASS}>
                  Grade <span className="text-destructive">*</span>
                </label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger id="grade" className={FIELD_CLASS}>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Class 1</SelectItem>
                    <SelectItem value="2">Class 2</SelectItem>
                    <SelectItem value="3">Class 3</SelectItem>
                    <SelectItem value="4">Class 4</SelectItem>
                    <SelectItem value="5">Class 5</SelectItem>
                    <SelectItem value="6">Class 6</SelectItem>
                    <SelectItem value="7">Class 7</SelectItem>
                    <SelectItem value="8">Class 8</SelectItem>
                    <SelectItem value="9">Class 9</SelectItem>
                    <SelectItem value="10">Class 10</SelectItem>
                    <SelectItem value="11">Class 11</SelectItem>
                    <SelectItem value="12">Class 12</SelectItem>
                    <SelectItem value="UG, First Year">UG, First Year</SelectItem>
                    <SelectItem value="UG, Second Year">UG, Second Year</SelectItem>
                    <SelectItem value="UG, Third Year">UG, Third Year</SelectItem>
                    <SelectItem value="UG, Fourth Year">UG, Fourth Year</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Terms and Privacy Policy Checkbox */}
          <div className="mt-[18px] flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={termsAgreed}
              onCheckedChange={(checked) => setTermsAgreed(checked === true)}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm leading-relaxed text-warm-prose cursor-pointer">
              I agree to the{' '}
              <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-brand-blue underline">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand-blue underline">
                Privacy Policy
              </a>
              {' '}to connect with teachers.
            </label>
          </div>

          {/* SR-001: a pinned h54 rounded-full bg-brand Continue. `mt-auto`
              inside this flex-1 form pushes it to the panel's bottom edge on
              a tall viewport without a second scroll region — this route is
              chromeless (no bottom nav to clear). */}
          <div className="mt-auto pt-6">
            <button
              type="submit"
              disabled={loading || !role || !termsAgreed || (role === 'student' && (!schoolCollege.trim() || !grade))}
              className="flex h-[54px] w-full items-center justify-center rounded-full bg-brand text-[15px] font-extrabold text-brand-foreground transition-transform duration-150 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Creating profile...' : 'Continue'}
            </button>
          </div>
        </form>

        {/* account-03-pick-role.png / pages.md §10: a fourth ghost row lets
            a visitor move on without choosing. design.md's own rule for this
            screen — "the answer sets home emphasis... it never gates
            content" — means role is a personalization hint, not a
            requirement, so skipping has to be possible. */}
        <button
          type="button"
          onClick={() => navigate(isValidRedirect(redirectTo) ? redirectTo : '/')}
          className="mx-auto mt-4 block min-h-11 px-2 text-center text-sm font-semibold text-warm-meta"
        >
          Skip for now
        </button>
      </main>

      <style>{`
        .shikshaq-role-field:focus,
        .shikshaq-role-field:focus-within { box-shadow: 0 0 0 2px hsl(var(--foreground)); outline: none; }
      `}</style>
    </BentoPanel>
  );
}
