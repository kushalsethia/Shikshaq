import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/Logo';

const TOKENS = {
  bg: '#F9F5F1',
  card: '#FCFAF7',
  text: '#1F1F1F',
  textSecondary: '#7B736B',
  green: '#228B22',
  greenTint: '#E6F4E6',
  blue: '#4351FF',
  blueTint: '#EDEEFF',
};

export default function SignUpSuccess() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not authenticated, redirect to auth
    if (!user) {
      navigate('/auth', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: TOKENS.bg, display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(32px,6vw,64px) 16px' }}>
        <div style={{ width: '100%', maxWidth: 440, textAlign: 'center' }}>
          <div style={{ marginBottom: 32 }}>
            <Logo size="lg" className="mx-auto mb-6" />
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{ borderRadius: 999, background: TOKENS.greenTint, padding: 16 }}>
                <CheckCircle style={{ width: 40, height: 40, color: TOKENS.green }} />
              </div>
            </div>
            <h1 style={{ fontSize: 'clamp(26px,3.6vw,38px)', lineHeight: 1.02, fontWeight: 700, color: TOKENS.text }}>
              Account created successfully!
            </h1>
            <p style={{ marginTop: 10, fontSize: 16, lineHeight: 1.6, color: TOKENS.textSecondary }}>
              Welcome to Shikshaq
            </p>
          </div>

          <div style={{ padding: 'clamp(20px,3vw,28px)', borderRadius: 20, background: TOKENS.card, boxShadow: '0 0 0 1px rgba(0,0,0,.06)', marginBottom: 24, textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ borderRadius: 999, background: TOKENS.blueTint, padding: 10, marginTop: 2, flexShrink: 0 }}>
                <Mail style={{ width: 18, height: 18, color: TOKENS.blue }} />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: TOKENS.text, marginBottom: 8 }}>
                  Verify your email
                </h2>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: TOKENS.textSecondary, marginBottom: 10 }}>
                  We've sent a verification email to <strong style={{ color: TOKENS.text }}>{user.email}</strong>. Please check your inbox and click the verification link to activate your account.
                </p>
                <p style={{ fontSize: 12.5, lineHeight: 1.5, color: '#8B837A' }}>
                  Didn't receive the email? Check your spam folder or try signing in again to resend.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={() => navigate('/')}
              className="active:scale-[0.98] transition-transform duration-150"
              style={{ width: '100%', minHeight: 50, borderRadius: 12, background: TOKENS.text, color: '#fff', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              Continue to home
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/auth"
              className="active:scale-[0.98] transition-transform duration-150"
              style={{ width: '100%', minHeight: 50, borderRadius: 12, background: TOKENS.card, boxShadow: '0 0 0 1px rgba(0,0,0,.06)', color: TOKENS.text, fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
