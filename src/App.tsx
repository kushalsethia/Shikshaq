import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth-context";
import { LikesProvider } from "@/lib/likes-context";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import Auth from "./pages/Auth";
import TeacherProfile from "./pages/TeacherProfile";
import Help from "./pages/Help";
import Join from "./pages/Join";
import RecommendTeacher from "./pages/RecommendTeacher";
import AdminRecommendations from "./pages/AdminRecommendations";
import LikedTeachers from "./pages/LikedTeachers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LikesProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/teacher/:slug" element={<TeacherProfile />} />
              <Route path="/liked-teachers" element={<LikedTeachers />} />
              <Route path="/help" element={<Help />} />
              <Route path="/join" element={<Join />} />
              <Route path="/recommend-teacher" element={<RecommendTeacher />} />
              <Route path="/admin" element={<Navigate to="/admin/recommendations" replace />} />
              <Route path="/admin/recommendations" element={<AdminRecommendations />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LikesProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
