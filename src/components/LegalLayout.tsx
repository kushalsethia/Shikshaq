import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PageHeader } from '@/components/devices';

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
 * Renders the PageHeader opening, the 720px prose column, the section list,
 * and the cross-link pill row. Each route supplies its own title, "last
 * updated" line, and sections. Legal body copy stays plain per
 * VISUAL_DIRECTION.md §9a — only the opening gets a designed treatment.
 */
export function LegalLayout({ title, lastUpdated, sections, currentPath }: LegalLayoutProps) {
  const isPrivacy = currentPath === '/privacy-policy';
  const accent = isPrivacy ? 'hsl(var(--brand-blue))' : 'hsl(var(--brand))';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader
        eyebrow="Legal"
        title={title}
        lede={`${lastUpdated}. Plain, accurate, and unchanged in substance — restyled, not rewritten.`}
        accent={accent}
        ground="ruled"
      />

      <div className="mx-auto max-w-[720px] px-4 pb-14 pt-10 sm:px-7">
        <div className="grid gap-6">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-2.5 text-subsection font-semibold text-foreground">{section.title}</h2>
              {section.body}
            </section>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2.5">
          {LEGAL_PAGES.map((page) => {
            const isCurrent = page.to === currentPath;
            return (
              <Link
                key={page.to}
                to={page.to}
                className={
                  isCurrent
                    ? 'min-h-11 rounded-full bg-brand-blue-subtle px-[18px] py-[11px] text-[13.5px] font-semibold text-brand-blue-deep transition-[filter] duration-150 hover:brightness-95'
                    : 'min-h-11 rounded-full px-[18px] py-[11px] text-[13.5px] font-semibold text-foreground shadow-border transition-colors duration-150 hover:bg-foreground/5'
                }
              >
                {page.label}
              </Link>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
