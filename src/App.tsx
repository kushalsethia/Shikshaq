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
import { BottomNav } from "@/components/BottomNav";
import Index from "./pages/Index";
const Browse = lazy(() => import("./pages/Browse"));
import Auth from "./pages/Auth";
const TeacherProfile = lazy(() => import("./pages/TeacherProfile"));
import Help from "./pages/Help";
import FAQ from "./pages/FAQ";
import Join from "./pages/Join";
const JoinApply = lazy(() => import("./pages/JoinApply"));
import PastPapers from "./pages/PastPapers";
const PaperResults = lazy(() => import("./pages/PaperResults"));
const PaperReader = lazy(() => import("./pages/PaperReader"));
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

// Lazy load heavy components for better performance on mobile
const SubjectPage = lazy(() => import("./pages/SubjectPage"));
const WhatsAppRedirect = lazy(() => import("./pages/WhatsAppRedirect"));
const BoardPage = lazy(() => import("./pages/BoardPage"));
const RecommendTeacher = lazy(() => import("./pages/RecommendTeacher"));
const AdminRecommendations = lazy(() => import("./pages/AdminRecommendations"));
const AdminComments = lazy(() => import("./pages/AdminComments"));
const AdminUpvotes = lazy(() => import("./pages/AdminUpvotes"));
const AdminFeedback = lazy(() => import("./pages/AdminFeedback"));
const AdminTeachers = lazy(() => import("./pages/AdminTeachers"));
const AdminApplications = lazy(() => import("./pages/AdminApplications"));
const AdminPapers = lazy(() => import("./pages/AdminPapers"));
const LikedTeachers = lazy(() => import("./pages/LikedTeachers"));
const MyTeachers = lazy(() => import("./pages/MyTeachers"));
const SelectRole = lazy(() => import("./pages/SelectRole"));
const TeacherTermsAgreement = lazy(() => import("./pages/TeacherTermsAgreement"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const SignUpSuccess = lazy(() => import("./pages/SignUpSuccess"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const GuardianDashboard = lazy(() => import("./pages/GuardianDashboard"));

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
          <BrowserRouter>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:ring-2 focus:ring-ring"
            >
              Skip to content
            </a>
            <ScrollToTop />
            <CanonicalTag />
            <Chatbot />
            <RouteTransition>
            <Routes>
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
              <Route path="/liked-teachers" element={
                <Suspense fallback={<PageLoader />}>
                  <LikedTeachers />
                </Suspense>
              } />
              <Route path="/my-teachers" element={
                <Suspense fallback={<PageLoader />}>
                  <MyTeachers />
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
              <Route path="/about" element={<About />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/recommend-teacher" element={
                <Suspense fallback={<PageLoader />}>
                  <RecommendTeacher />
                </Suspense>
              } />
              <Route path="/admin" element={<Navigate to="/admin/recommendations" replace />} />
              <Route path="/admin/recommendations" element={
                <Suspense fallback={<PageLoader />}>
                  <AdminRecommendations />
                </Suspense>
              } />
              <Route path="/admin/comments" element={
                <Suspense fallback={<PageLoader />}>
                  <AdminComments />
                </Suspense>
              } />
              <Route path="/admin/upvotes" element={
                <Suspense fallback={<PageLoader />}>
                  <AdminUpvotes />
                </Suspense>
              } />
              <Route path="/admin/feedback" element={
                <Suspense fallback={<PageLoader />}>
                  <AdminFeedback />
                </Suspense>
              } />
              <Route path="/admin/teachers" element={
                <Suspense fallback={<PageLoader />}>
                  <AdminTeachers />
                </Suspense>
              } />
              <Route path="/admin/applications" element={
                <Suspense fallback={<PageLoader />}>
                  <AdminApplications />
                </Suspense>
              } />
              <Route path="/admin/papers" element={
                <Suspense fallback={<PageLoader />}>
                  <AdminPapers />
                </Suspense>
              } />
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
              <Route path="/dashboard/student" element={
                <Suspense fallback={<PageLoader />}>
                  <StudentDashboard />
                </Suspense>
              } />
              <Route path="/dashboard/teacher" element={
                <Suspense fallback={<PageLoader />}>
                  <TeacherDashboard />
                </Suspense>
              } />
              <Route path="/dashboard/guardian" element={
                <Suspense fallback={<PageLoader />}>
                  <GuardianDashboard />
                </Suspense>
              } />
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
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
            </RouteTransition>
            <BottomNav />
          </BrowserRouter>
            </StudiesWithProvider>
          </UpvotesProvider>
        </LikesProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
