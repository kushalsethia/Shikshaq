import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, School } from 'lucide-react';

import { supabase } from '@/integrations/supabase/client';
import { schoolSlug } from '@/lib/school-slug';
import { usePageMeta } from '@/hooks/usePageMeta';
import { BentoStack, BentoPanel } from '@/components/layout/PageContainer';
import { NumberedHeading } from '@/components/ui/numbered-heading';
import { EmptyResults } from '@/components/EmptyResults';
import { ListLoading, ListError } from '@/components/ui/list-states';
import { IconDisc } from '@/components/ui/icon-disc';
import { generateBreadcrumbSchema, injectSchemas } from '@/utils/structuredDataGenerators';
import { EyesPanel } from '@/components/home/EyesPanel';
import { useSentenceBuilder } from '@/hooks/useSentenceBuilder';
import { useChromeConfig } from '@/components/layout/AppShell';

/* Schools index — the real destination for TopBar's "Schools" link.
 *
 * Same derivation PastPapers.tsx already uses for its "By school" section:
 * there is no schools table, so the list and each school's dominant
 * board/count come from grouping published `papers` rows by `school`. Each
 * row links to `/school/:slug` (SchoolPage), same as PastPapers' rows.
 */

interface SchoolStat {
  school: string;
  board: string;
  count: number;
  otherBoardCount: number;
}

export default function SchoolsPage() {
  const navigate = useNavigate();

  usePageMeta(
    'All Schools | Shikshaq',
    'Browse past papers from every Kolkata school on Shikshaq, ICSE, CBSE and ISC, classes 9 to 12. Free to read.',
  );

  // Handoff SC-005: this route renders its own eyes panel, replacing
  // AppShell's default (B4) pre-footer. Schools is a papers-funnel surface,
  // so the sentence builder opens in papers mode (matching PastPapers' PP-014).
  useChromeConfig({ preFooter: 'none' });
  const {
    builderMode, setBuilderMode, slots: builderSlots, onSlotChange: handleSlotChange, onSubmit: handleBuilderSubmit,
  } = useSentenceBuilder();
  useEffect(() => { setBuilderMode('papers'); }, [setBuilderMode]);

  const query = useQuery({
    queryKey: ['schools', 'index'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase.from('papers').select('school,board').eq('is_published', true);
      if (error) throw error;

      const bySchool = new Map<string, Map<string, number>>();
      (data || []).forEach((p) => {
        const boards = bySchool.get(p.school) ?? new Map<string, number>();
        boards.set(p.board, (boards.get(p.board) || 0) + 1);
        bySchool.set(p.school, boards);
      });

      const schoolStats: SchoolStat[] = Array.from(bySchool.entries())
        .map(([school, boards]) => {
          const entries = Array.from(boards.entries()).sort((a, b) => b[1] - a[1]);
          const [dominantBoard, dominantCount] = entries[0];
          const total = entries.reduce((sum, [, c]) => sum + c, 0);
          return { school, board: dominantBoard, count: dominantCount, otherBoardCount: total - dominantCount };
        })
        .sort((a, b) => a.school.localeCompare(b.school));

      return schoolStats;
    },
  });

  const schoolStats = query.data ?? [];

  useEffect(() => {
    if (query.isLoading) return;
    injectSchemas([
      generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Schools', url: '/schools' },
      ]),
    ]);
    return () => {
      document.getElementById('page-schemas')?.remove();
    };
  }, [query.isLoading]);

  return (
    <div className="min-h-screen bg-background">
      <main>
        <BentoStack>
          {/* Handoff SC-002: bone header panel, replacing the dark ControlBlock. */}
          <BentoPanel fill="card" edge="top" className="px-[22px] pt-[14px] pb-[22px]">
            <NumberedHeading
              as="h1"
              line1="Papers from"
              ordinal="01"
              line2="every school"
              support="Free to read, with marking schemes where the boards publish them."
            />
          </BentoPanel>

          {/* Handoff SC-003/SC-004: row list wrapped in its own panel; rows
              match PastPapers' By-school row exactly (PP-010) — bg-muted, no
              shadow-border. */}
          <BentoPanel fill="card" className="p-[22px]">
            {query.isLoading ? (
              <ListLoading count={6} media={0} lines={2} className="grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-[10px]" />
            ) : query.isError ? (
              <ListError onRetry={() => query.refetch()} />
            ) : schoolStats.length > 0 ? (
              <div className="stagger-children grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-[10px]">
                {schoolStats.map(({ school, board, count, otherBoardCount }) => (
                  <Link
                    key={school}
                    to={`/school/${schoolSlug(school)}`}
                    className="flex min-h-11 animate-card-reveal items-center gap-3 rounded-2xl bg-muted px-[14px] py-3 text-left transition-transform duration-hover ease-settle hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:animate-none motion-reduce:hover:translate-y-0 lg:px-[15px] lg:py-[13px]"
                  >
                    <IconDisc
                      tone="papers"
                      size={40}
                      shape="square"
                      className="h-[38px] w-[38px] rounded-xl font-display text-[15px] font-extrabold"
                    >
                      {school.charAt(0).toUpperCase()}
                    </IconDisc>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14.5px] font-bold text-foreground">{school}</span>
                      <span className="mt-px block text-[12px] tabular-nums text-muted-foreground">
                        {board} · {count} paper{count === 1 ? '' : 's'}
                        {otherBoardCount > 0 ? ` + ${otherBoardCount} more` : ''}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 flex-none text-warm-quaternary" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyResults
                tone="papers"
                icon={<School className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />}
                heading="Schools are being updated"
                message="We're still gathering papers from Kolkata schools, nothing's uploaded yet."
                action={{ label: 'Browse past papers', onClick: () => navigate('/past-papers') }}
              />
            )}
          </BentoPanel>

          {/* Handoff SC-005: shared tail, pinned to papers mode. */}
          <EyesPanel
            mode={builderMode}
            onModeChange={setBuilderMode}
            heading={(
              <>
                Still deciding? <span className="font-extrabold">We&rsquo;re watching out for you.</span>
              </>
            )}
            subline="Fill in the blanks and we'll take you straight there."
            slots={builderSlots}
            onSlotChange={handleSlotChange}
            onSubmit={handleBuilderSubmit}
          />
        </BentoStack>
      </main>
    </div>
  );
}
