import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider } from "@/lib/auth-context";
import { LikesProvider } from "@/lib/likes-context";
import { UpvotesProvider } from "@/lib/upvotes-context";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Chatbot } from "@/components/Chatbot";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import SubjectPage from "./pages/SubjectPage";
import BoardPage from "./pages/BoardPage";
import Auth from "./pages/Auth";
import TeacherProfile from "./pages/TeacherProfile";
import Help from "./pages/Help";
import FAQ from "./pages/FAQ";
import Join from "./pages/Join";
import RecommendTeacher from "./pages/RecommendTeacher";
import AdminRecommendations from "./pages/AdminRecommendations";
import AdminComments from "./pages/AdminComments";
import AdminUpvotes from "./pages/AdminUpvotes";
import LikedTeachers from "./pages/LikedTeachers";
import SelectRole from "./pages/SelectRole";
import SignUpSuccess from "./pages/SignUpSuccess";
import StudentDashboard from "./pages/StudentDashboard";
import GuardianDashboard from "./pages/GuardianDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to redirect old /teacher/:slug routes to new /tuition-teachers/:slug
const TeacherRedirect = () => {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/tuition-teachers/${slug}`} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LikesProvider>
          <UpvotesProvider>
            <Toaster />
            <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Chatbot />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/all-tuition-teachers-in-kolkata" element={<Browse />} />
              <Route path="/browse" element={<Navigate to="/all-tuition-teachers-in-kolkata" replace />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/tuition-teachers/:slug" element={<TeacherProfile />} />
              <Route path="/teacher/:slug" element={<TeacherRedirect />} />
              <Route path="/liked-teachers" element={<LikedTeachers />} />
              <Route path="/help" element={<Help />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/join" element={<Join />} />
              <Route path="/recommend-teacher" element={<RecommendTeacher />} />
              <Route path="/admin" element={<Navigate to="/admin/recommendations" replace />} />
              <Route path="/admin/recommendations" element={<AdminRecommendations />} />
              <Route path="/admin/comments" element={<AdminComments />} />
              <Route path="/admin/upvotes" element={<AdminUpvotes />} />
              <Route path="/select-role" element={<SelectRole />} />
              <Route path="/signup-success" element={<SignUpSuccess />} />
              <Route path="/dashboard/student" element={<StudentDashboard />} />
              <Route path="/dashboard/guardian" element={<GuardianDashboard />} />
              {/* Subject-specific pages */}
              <Route path="/maths-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/english-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/science-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/commercial-studies-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/physics-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/chemistry-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/biology-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/computer-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/hindi-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/history-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/geography-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/economics-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/accounts-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/business-studies-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/commerce-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/psychology-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/sociology-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/political-science-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/environmental-science-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/bengali-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/drawing-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/sat-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/act-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/cat-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/nmat-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/gmat-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/ca-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              <Route path="/cfa-tuition-teachers-in-kolkata" element={<SubjectPage />} />
              {/* Board-specific pages */}
              <Route path="/cbse-ncert-tuition-teachers-in-kolkata" element={<BoardPage />} />
              <Route path="/icse-tuition-teachers-in-kolkata" element={<BoardPage />} />
              <Route path="/igcse-tuition-teachers-in-kolkata" element={<BoardPage />} />
              <Route path="/international-board-tuition-teachers-in-kolkata" element={<BoardPage />} />
              <Route path="/state-board-tuition-teachers-in-kolkata" element={<BoardPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </UpvotesProvider>
        </LikesProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
