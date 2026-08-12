import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/features/auth/context";
import { NotificationProvider } from "@/features/notifications/context";
import { Toaster } from "@/components/ui/sonner";
import { ConnectionStatus } from "@/components/ConnectionStatus";

import { AuthLayout } from "./pages/AuthLayout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Verify } from "./pages/Verify";
import { DashboardLayout } from "./pages/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { Profile } from "./pages/Profile";
import { Onboarding } from "./pages/Onboarding";
import CreateProjectWizard from "./features/projects/pages/CreateProjectWizard";
import ProjectFeed from "./features/projects/pages/ProjectFeed";
import ProjectDetails from "./features/projects/pages/ProjectDetails";
import { OAuth2Callback } from "./pages/OAuth2Callback";
import { MyProjects } from "./pages/MyProjects";
import Messages from "./features/messaging/pages/Messages";
import { NotesDashboard } from "./features/notes/pages/NotesDashboard";

import { PublicProfile } from "./pages/PublicProfile";
import { SearchProfiles } from "./pages/SearchProfiles";
import { AiRoadmap } from "./pages/AiRoadmap";
import { LandingPage } from "./pages/LandingPage";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsOfService } from "./pages/TermsOfService";
import { CookiePolicy } from "./pages/CookiePolicy";

import { ExplorePage } from "./pages/ExplorePage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/oauth2/callback" element={<OAuth2Callback />} />
            
            <Route path="/" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="verify" element={<Verify />} />
            </Route>

            <Route path="/" element={<DashboardLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profiles/:userId" element={<PublicProfile />} />
              <Route path="search" element={<SearchProfiles />} />
              <Route path="onboarding" element={<Onboarding />} />
              <Route path="roadmap" element={<AiRoadmap />} />
              <Route path="projects" element={<MyProjects />} />
              <Route path="projects/new" element={<CreateProjectWizard />} />
              <Route path="projects/:projectId" element={<ProjectDetails />} />
              <Route path="discover" element={<ProjectFeed />} />
              <Route path="messages" element={<Messages />} />
              <Route path="notes" element={<NotesDashboard />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster richColors position="top-right" />
          <div className="fixed bottom-6 right-6 z-[100]">
            <ConnectionStatus />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;