import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { BentoPanel, BentoStack } from '@/components/layout/PageContainer';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PipelineRoute } from '@/components/admin/PipelineRoute';
import { LoadError } from '@/components/hod/HodShared';
import { isHod } from '@/lib/hod-api';
import { realPipelineRouteApi, type PipelineRouteApi } from '@/lib/pipeline-route';
import { CHIP } from '@/lib/checker-button-styles';
import { PREVIEW_TOOLS } from '@/lib/preview-tools';
import { isDummyMode } from '@/lib/dummy-mode';
import { cn } from '@/lib/utils';

const DummyHodPipeline = PREVIEW_TOOLS ? lazy(() => import('@/dummy/HodPipelineDummy')) : null;

/* /hod/pipeline: the pipeline overview for HODs (owner, 12 October 2026: "one
   pipeline overview page ... for admin AND HOD").

   It is the same papers route the Admin page shows in its System tab, read
   through the same admin_pipeline_route() function, which lets HODs and admins
   in and refuses everyone else with a 42501. This page only decides what to
   draw: the guard below is the polite version of that refusal.

   What an HOD does not get, because those parts are admin pages: the desk's
   searchable list of every paper, the library numbers and the activity log. Every
   link on the route goes to a tab of the HOD desk, which an HOD can open.

   The HOD desk header links here (one Link in Hod.tsx). In a test build with
   dummy mode on it runs against the in-memory fake (src/dummy/HodPipelineDummy.tsx). */

export default function HodPipeline() {
  if (DummyHodPipeline && isDummyMode()) {
    return (
      <Suspense fallback={null}>
        <DummyHodPipeline />
      </Suspense>
    );
  }
  return <HodPipelinePage />;
}

export function HodPipelinePage({
  routeApi = realPipelineRouteApi,
  dummy = false,
  banner,
  checkAccess = isHod,
}: {
  routeApi?: PipelineRouteApi;
  /** Dummy mode (D75): no sign-in, no real HOD check, a fake API. */
  dummy?: boolean;
  banner?: ReactNode;
  /** The is_hod() call; tests and dummy mode hand in their own. */
  checkAccess?: () => Promise<boolean>;
}) {
  usePageMeta('Pipeline | HOD desk | Shikshaq', 'Every paper on its way from a PDF on the computer to live.');
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState<boolean | null>(dummy ? true : null);
  /** The is_hod() call itself failed: say so, rather than telling an HOD their account is not one. */
  const [checkFailed, setCheckFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (dummy) return;
    if (authLoading) return;
    if (!user) {
      navigate('/auth?redirect=' + encodeURIComponent('/hod/pipeline'));
      return;
    }
    let cancelled = false;
    setCheckFailed(false);
    checkAccess()
      .then((ok) => {
        if (!cancelled) setAllowed(ok);
      })
      .catch(() => {
        if (!cancelled) setCheckFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, navigate, dummy, checkAccess, attempt]);

  if (checkFailed && allowed === null) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <BentoPanel fill="card" edge="top" className="mx-auto w-full max-w-lg py-16">
          {banner}
          <LoadError what="Your access to the pipeline" onRetry={() => setAttempt((n) => n + 1)} />
        </BentoPanel>
      </BentoStack>
    );
  }

  if ((!dummy && authLoading) || allowed === null) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <BentoPanel fill="card" edge="top" className="mx-auto w-full max-w-5xl">
          {banner}
          <div className="h-40 animate-pulse rounded-2xl bg-muted" role="status" aria-label="Loading the pipeline" />
        </BentoPanel>
      </BentoStack>
    );
  }

  if (allowed === false) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <BentoPanel fill="card" edge="top" className="mx-auto max-w-lg py-24 text-center">
          <h1 className="text-balance text-xl font-bold text-foreground">This page is for HODs</h1>
          <p className="mt-2 text-[14px] text-warm-secondary">
            Your account is not set up as a Head of Department. If you should have this, ask an admin to add you.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link to="/" className={cn(CHIP, 'bg-muted text-warm-secondary')}>
              Back to the site
            </Link>
          </div>
        </BentoPanel>
      </BentoStack>
    );
  }

  return (
    <BentoStack className="min-h-screen bg-muted">
      <BentoStack className="mx-auto w-full max-w-6xl bg-transparent">
        <BentoPanel fill="card" edge="top" className="px-4 py-[14px] sm:px-6 sm:py-[18px] lg:px-6 lg:py-[18px]">
          {banner}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-lg font-bold text-foreground">Pipeline</h1>
            <Link to="/hod" className={cn(CHIP, 'bg-muted text-warm-secondary')}>
              Back to the HOD desk
            </Link>
          </div>
          <p className="mt-2 max-w-3xl text-pretty text-[14px] leading-[1.5] text-warm-secondary">
            Every paper on its way from a PDF on Kanishk&apos;s computer to live. A stop with an arrow opens its tab on the HOD desk.
          </p>
        </BentoPanel>
        <PipelineRoute api={routeApi} audience="hod" onShowRegistry={() => {}} />
      </BentoStack>
    </BentoStack>
  );
}
