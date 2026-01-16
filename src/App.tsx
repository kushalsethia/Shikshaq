import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth-context";
import { LikesProvider } from "@/lib/likes-context";
import { UpvotesProvider } from "@/lib/upvotes-context";
import { ScrollToTop } from "@/components/ScrollToTop";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { Chatbot } from "@/components/Chatbot";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
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
            <FloatingWhatsAppButton />
            <Chatbot />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/teacher/:slug" element={<TeacherProfile />} />
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
