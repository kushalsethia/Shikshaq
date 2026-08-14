import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';

const NotFound = () => {
  const location = useLocation();

  usePageMeta(
    'Page not found | Shikshaq',
    'This page is not on the syllabus. The link may be old, or the paper may have been unpublished at a school\'s request.'
  );

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div style={{ minHeight: '100vh', background: '#F9F5F1' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(48px,8vw,96px) clamp(16px,3vw,28px) 80px', textAlign: 'center' }}>
        <div style={{ fontSize: 'clamp(64px,12vw,132px)', lineHeight: 1, fontWeight: 800, letterSpacing: '-.06em', color: '#E7DFD5' }}>404</div>
        <h1 style={{ marginTop: 18, fontSize: 'clamp(24px,3.2vw,34px)', fontWeight: 700 }}>This page is not on the syllabus</h1>
        <p style={{ marginTop: 14, fontSize: 16, lineHeight: 1.65, color: '#7B736B' }}>
          The link may be old, or the paper may have been unpublished at a school's request.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 26 }}>
          <Link
            to="/"
            className="active:scale-[0.97] transition-transform duration-150"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '14px 22px', borderRadius: 12, background: '#1F1F1F', color: '#fff', fontSize: 15, fontWeight: 600 }}
          >
            Back home
          </Link>
          <Link
            to="/all-tuition-teachers-in-kolkata"
            className="active:scale-[0.97] transition-transform duration-150"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '14px 22px', borderRadius: 12, boxShadow: '0 0 0 1px #D8CFC4', color: '#1F1F1F', fontSize: 15, fontWeight: 600 }}
          >
            Browse teachers
          </Link>
          <Link
            to="/past-papers"
            className="active:scale-[0.97] transition-transform duration-150"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '14px 22px', borderRadius: 12, boxShadow: '0 0 0 1px #D8CFC4', color: '#1F1F1F', fontSize: 15, fontWeight: 600 }}
          >
            Past papers
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
