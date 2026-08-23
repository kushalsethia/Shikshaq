import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";
import { lazy, Suspense, type ReactNode } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { LikesProvider } from "@/lib/likes-context";
import { UpvotesProvider } from "@/lib/upvotes-context";
import { StudiesWithProvider } from "@/lib/studies-with-context";
import { ScrollToTop } from "@/components/ScrollToTop";
import { CanonicalTag } from "@/components/CanonicalTag";
import { Chatbot } from "@/components/Chatbot";
import { AppShell } from "@/components/layout/AppShell";
import { OnboardingModal } from "@/components/OnboardingModal";
/* Index stays EAGER: it is the landing route, so code-splitting it would only
   add a round trip before first paint. Everything else is lazy - an /impeccable
   audit flagged a 474KB main chunk with 10 pages bundled in eagerly. */
import Index from "./pages/Index";
import Sandbox from "@/pages/Sandbox";
import SchoolPage from "@/pages/SchoolPage";
const Browse = lazy(() => import("./pages/Browse"));
const Auth = lazy(() => import("./pages/Auth"));
const TeacherProfile = lazy(() => import("./pages/TeacherProfile"));
const Help = lazy(() => import("./pages/Help"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Join = lazy(() => import("./pages/Join"));
const JoinApply = lazy(() => import("./pages/JoinApply"));
const PastPapers = lazy(() => import("./pages/PastPapers"));
const PaperResults = lazy(() => import("./pages/PaperResults"));
const PaperReader = lazy(() => import("./pages/PaperReader"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const SubjectsPage = lazy(() => import("./pages/SubjectsPage"));
const SchoolsPage = lazy(() => import("./pages/SchoolsPage"));

// Lazy load heavy components for better performance on mobile
const SubjectPage = lazy(() => import("./pages/SubjectPage"));
const WhatsAppRedirect = lazy(() => import("./pages/WhatsAppRedirect"));
const BoardPage = lazy(() => import("./pages/BoardPage"));
const RecommendTeacher = lazy(() => import("./pages/RecommendTeacher"));
const AdminApprovals = lazy(() => import("./pages/admin/approvals"));
const AdminTeachersPage = lazy(() => import("./pages/admin/teachers"));
const AdminPapersPage = lazy(() => import("./pages/admin/papers"));
const AdminReviews = lazy(() => import("./pages/admin/reviews"));
const AdminAuditLog = lazy(() => import("./pages/admin/audit"));
const LikedTeachers = lazy(() => import("./pages/LikedTeachers"));
const MyTeachers = lazy(() => import("./pages/MyTeachers"));
const SelectRole = lazy(() => import("./pages/SelectRole"));
const TeacherTermsAgreement = lazy(() => import("./pages/TeacherTermsAgreement"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const SignUpSuccess = lazy(() => import("./pages/SignUpSuccess"));
const Account = lazy(() => import("./pages/Account"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-pulse text-muted-foreground">Loading...</div>
  </div>
);

// Optimize QueryClient for mobile devices
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Reduce refetch intervals for better mobile performance
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1, // Reduce retries on mobile
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

// Component to redirect old /teacher/:slug routes to new /tuition-teachers/:slug
const TeacherRedirect = () => {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/tuition-teachers/${slug}`} replace />;
};

// Short, subtle crossfade on route change. Keyed on pathname only (not query
// params) so filter/search changes within a page never re-trigger it.
const RouteTransition = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  return (
    <div key={location.pathname} className="route-fade pb-20 lg:pb-0">
      {children}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LikesProvider>
          <UpvotesProvider>
            <StudiesWithProvider>
            <Toaster />
            <Sonner />
          {/* Opt into the v7 behaviours now rather than at the upgrade. Both
              warnings fired on every page load; startTransition also stops
              route changes blocking paint on slow renders. */}
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            {/* Skip link. The href stayed #main-content, but only Index.tsx ever
                set that id — so on every route except the home page this, the
                first control a keyboard or screen-reader user meets, pointed at
                an element that does not exist and moved focus nowhere. A broken
                skip link is worse than none: it looks like the affordance is
                there and quietly is not.

                Fixed by targeting the page's <main> at click time rather than by
                adding the id to twenty-five files and relying on the next page
                to remember it. The href is kept so the control still reads and
                behaves as a link, and Index's id still satisfies it directly. */}
            <a
              href="#main-content"
              onClick={(e) => {
                const target =
                  document.getElementById('main-content') ?? document.querySelector('main');
                if (!target) return; // let the href do whatever it can
                e.preventDefault();
                /* <main> is not focusable by default; -1 makes it programmatically
                   focusable without adding it to the tab order. */
                if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
                (target as HTMLElement).focus({ preventScroll: true });
                target.scrollIntoView({ block: 'start' });
              }}
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:ring-2 focus:ring-ring"
            >
              Skip to content
            </a>
            <ScrollToTop />
            <CanonicalTag />
            <Chatbot />
            <OnboardingModal />
            <AppShell>
            <RouteTransition>
            {/* One Suspense boundary around the whole route table. The routes
                that were eager until now are lazy, and each would otherwise
                need its own wrapper; the per-route boundaries below still work
                and are left alone. */}
            <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Dev-only design sandbox for the admin shell, which is otherwise
                  unreachable without an admin login. Renders mock props only —
                  no Supabase access, not the real console, and NOT a way past
                  the admin gate. The guard is a build-time constant, so this
                  route does not exist in a production bundle. */}
              {import.meta.env.DEV && <Route path="/__sandbox" element={<Sandbox />} />}
              <Route path="/" element={<Index />} />
              <Route path="/all-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <Browse />
                </Suspense>
              } />
              <Route path="/browse" element={<Navigate to="/all-tuition-teachers-in-kolkata" replace />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/tuition-teachers/:slug" element={
                <Suspense fallback={<PageLoader />}>
                  <TeacherProfile />
                </Suspense>
              } />
              <Route path="/tuition-teachers/:slug/whatsapp-click" element={
                <Suspense fallback={<PageLoader />}>
                  <WhatsAppRedirect />
                </Suspense>
              } />
              <Route path="/teacher/:slug" element={<TeacherRedirect />} />
              {/* pages.md §11 O-05: "/liked-teachers" and "/my-teachers" become deep
                  links into the unified /account screen rather than 301s — the
                  more conservative, reversible choice per the spec's own framing
                  ("do not pick for the owner"); a permanent redirect is the other
                  option the spec leaves open if the owner wants that instead. */}
              <Route path="/liked-teachers" element={<Navigate to="/account?tab=saved" replace />} />
              <Route path="/my-teachers" element={<Navigate to="/account?tab=contacted" replace />} />
              <Route path="/account" element={
                <Suspense fallback={<PageLoader />}>
                  <Account />
                </Suspense>
              } />
              <Route path="/more" element={<Help />} />
              <Route path="/help" element={<Navigate to="/more" replace />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/join" element={<Join />} />
              <Route path="/join/apply" element={
                <Suspense fallback={<PageLoader />}>
                  <JoinApply />
                </Suspense>
              } />
              <Route path="/past-papers" element={<PastPapers />} />
              <Route path="/past-papers/results" element={
                <Suspense fallback={<PageLoader />}>
                  <PaperResults />
                </Suspense>
              } />
              <Route path="/past-papers/:id" element={
                <Suspense fallback={<PageLoader />}>
                  <PaperReader />
                </Suspense>
              } />
              {/* S16. a-to-z.md marks this the one route that is `new` — the
                  by-school rows on /past-papers previously went nowhere. */}
              <Route path="/school/:slug" element={<SchoolPage />} />
              {/* TopBar's "Subjects" and "Schools" nav links used to fall back to
                  BROWSE_PATH/PAST_PAPERS_PATH with `match: () => false` because
                  neither index existed. These are their real destinations. */}
              <Route path="/subjects" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectsPage />
                </Suspense>
              } />
              <Route path="/schools" element={
                <Suspense fallback={<PageLoader />}>
                  <SchoolsPage />
                </Suspense>
              } />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={
                <Suspense fallback={<PageLoader />}>
                  <Contact />
                </Suspense>
              } />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/recommend-teacher" element={
                <Suspense fallback={<PageLoader />}>
                  <RecommendTeacher />
                </Suspense>
              } />
              <Route path="/admin" element={<Navigate to="/admin/approvals" replace />} />
              <Route path="/admin/approvals" element={
                <Suspense fallback={<PageLoader />}>
                  <AdminApprovals />
                </Suspense>
              } />
              <Route path="/admin/teachers" element={
                <Suspense fallback={<PageLoader />}>
                  <AdminTeachersPage />
                </Suspense>
              } />
              <Route path="/admin/papers" element={
                <Suspense fallback={<PageLoader />}>
                  <AdminPapersPage />
                </Suspense>
              } />
              <Route path="/admin/reviews" element={
                <Suspense fallback={<PageLoader />}>
                  <AdminReviews />
                </Suspense>
              } />
              <Route path="/admin/audit" element={
                <Suspense fallback={<PageLoader />}>
                  <AdminAuditLog />
                </Suspense>
              } />
              {/* Legacy admin URLs redirect into the 5-section console (pages.md §15). */}
              <Route path="/admin/applications" element={<Navigate to="/admin/approvals" replace />} />
              <Route path="/admin/recommendations" element={<Navigate to="/admin/reviews" replace />} />
              <Route path="/admin/comments" element={<Navigate to="/admin/reviews" replace />} />
              <Route path="/admin/upvotes" element={<Navigate to="/admin/reviews" replace />} />
              <Route path="/admin/feedback" element={<Navigate to="/admin/reviews" replace />} />
              <Route path="/select-role" element={
                <Suspense fallback={<PageLoader />}>
                  <SelectRole />
                </Suspense>
              } />
              <Route path="/teacher-terms-agreement" element={
                <Suspense fallback={<PageLoader />}>
                  <TeacherTermsAgreement />
                </Suspense>
              } />
              <Route path="/signup-success" element={
                <Suspense fallback={<PageLoader />}>
                  <SignUpSuccess />
                </Suspense>
              } />
              {/* StudentDashboard.tsx / GuardianDashboard.tsx are folded into
                  /account (pages.md §11) — these two routes now redirect there
                  instead of rendering the old pages directly. The files are
                  kept, unrouted, in case anything still imports a piece of them. */}
              <Route path="/dashboard/student" element={<Navigate to="/account?tab=saved" replace />} />
              <Route path="/dashboard/guardian" element={<Navigate to="/account?tab=contacted" replace />} />
              <Route path="/dashboard/teacher" element={
                <Suspense fallback={<PageLoader />}>
                  <TeacherDashboard />
                </Suspense>
              } />
              <Route path="/teacher-dashboard" element={<Navigate to="/dashboard/teacher" replace />} />
              {/* Subject-specific pages */}
              <Route path="/maths-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/english-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/science-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/commercial-studies-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/physics-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/chemistry-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/biology-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/computer-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/hindi-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/history-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/geography-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/economics-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/accounts-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/business-studies-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/commerce-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/psychology-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/sociology-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/political-science-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/environmental-science-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/bengali-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/drawing-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/sat-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/act-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/cat-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/nmat-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/gmat-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/ca-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/cfa-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/clat-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              <Route path="/social-studies-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <SubjectPage />
                </Suspense>
              } />
              {/* Board-specific pages */}
              <Route path="/cbse-ncert-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <BoardPage />
                </Suspense>
              } />
              <Route path="/icse-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <BoardPage />
                </Suspense>
              } />
              <Route path="/igcse-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <BoardPage />
                </Suspense>
              } />
              <Route path="/international-board-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <BoardPage />
                </Suspense>
              } />
              <Route path="/state-board-tuition-teachers-in-kolkata" element={
                <Suspense fallback={<PageLoader />}>
                  <BoardPage />
                </Suspense>
              } />
              <Route path="/404" element={<NotFound />} />
              {/* Render in place rather than Navigate to /404: redirecting
                  rewrote the address bar and destroyed the URL that actually
                  failed, so a broken link could not be reported or shared, and
                  the diagnostic below logged the useless string "/404". /404
                  stays as an explicit alias. */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
            </RouteTransition>
            </AppShell>
          </BrowserRouter>
            </StudiesWithProvider>
          </UpvotesProvider>
        </LikesProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
