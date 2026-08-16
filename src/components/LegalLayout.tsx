import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export interface LegalSection {
  title: string;
  body: ReactNode;
}

export interface LegalPageKey {
  to: string;
  label: string;
}

// The three legal/ownership routes this shared shell cross-links between.
// pages/Legal.md calls for all three pills on every legal page, including the
// Ownership & attribution page — that route/page isn't part of this task's
// scope (only PrivacyPolicy.tsx and TermsOfService.tsx are), so the pill is
// wired up here ready for whoever adds /paper-ownership + its page.
const LEGAL_PAGES: LegalPageKey[] = [
  { to: '/terms-of-service', label: 'Terms of Service' },
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/paper-ownership', label: 'Ownership & attribution' },
];

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
  currentPath: string;
}

/**
 * Shared shell for the three legal/ownership routes (pages/Legal.md).
 * Renders the 720px prose column, the section list, and the cross-link pill
 * row. Each route supplies its own title, "last updated" line, and sections.
 */
export function LegalLayout({ title, lastUpdated, sections, currentPath }: LegalLayoutProps) {
  return (
    <div style={{ minHeight: '100vh', background: '#F9F5F1' }}>
      <Navbar />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(28px,5vw,56px) clamp(16px,3vw,28px) 56px' }}>
        <h1 style={{ fontSize: 'clamp(26px,3.6vw,38px)', lineHeight: 1.02, fontWeight: 700, color: '#1F1F1F' }}>{title}</h1>
        <p style={{ marginTop: 10, fontSize: 13, color: '#8B837A' }}>{lastUpdated}</p>

        <div style={{ marginTop: 30, display: 'grid', gap: 26 }}>
          {sections.map((section) => (
            <section key={section.title}>
              <h2 style={{ fontSize: 21, fontWeight: 700, marginBottom: 10, color: '#1F1F1F' }}>{section.title}</h2>
              {section.body}
            </section>
          ))}
        </div>

        <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {LEGAL_PAGES.map((page) => {
            const isCurrent = page.to === currentPath;
            return (
              <Link
                key={page.to}
                to={page.to}
                className={isCurrent ? 'shikshaq-legal-pill' : 'shikshaq-outline-btn'}
                style={{
                  padding: '11px 18px',
                  borderRadius: 999,
                  fontSize: 13.5,
                  fontWeight: 600,
                  transition: 'filter .15s ease, background-color .15s ease',
                  ...(isCurrent
                    ? { background: '#EDEEFF', color: '#2E3AD6' }
                    : { boxShadow: '0 0 0 1px #E7DFD5', color: '#4A443E' }),
                }}
              >
                {page.label}
              </Link>
            );
          })}
        </div>
      </div>

      <Footer />

      <style>{`
        @media (hover: hover) {
          .shikshaq-legal-pill:hover { filter: brightness(0.96); }
          .shikshaq-outline-btn:hover { background-color: rgba(31,31,31,.05); }
        }
      `}</style>
    </div>
  );
}
