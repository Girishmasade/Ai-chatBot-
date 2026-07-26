import React, { Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  useParams,
  useOutlet
} from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

// Types & Hooks
import { ActiveScreen } from "./types";
import { useAuth } from "./hooks/useAuth";

// Route Guards
import { PrivateRoute } from "./secure/PrivateRoute";

import { AdminRoute } from "./secure/AdminRoute";
import { PublicRoute } from "./secure/PublicRoute";

// Core Components (Eagerly Loaded)
import AppSidebar from "./components/AppSidebar";
import AppTopBar from "./components/AppTopBar";
import CookieBanner from "./components/CookieBanner";
import AppFooter from "./components/AppFooter";

// Lazy-loaded Main Pages
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const ChatPage = React.lazy(() => import("./pages/ChatPage"));
const ImagePage = React.lazy(() => import("./pages/ImagePage"));
const VideoPage = React.lazy(() => import("./pages/VideoPage"));
const PromptStudioPage = React.lazy(() => import("./pages/PromptStudioPage"));
const ModelsListPage = React.lazy(() => import("./pages/ModelsListPage"));
const AssetsLibraryPage = React.lazy(() => import("./pages/AssetsLibraryPage"));
const BusinessPlanPage = React.lazy(() => import("./pages/BusinessPlanPage"));
const SubscriptionPage = React.lazy(() => import("./pages/SubscriptionPage"));
const UserSettingsPage = React.lazy(() => import("./pages/UserSettingsPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const AdminPage = React.lazy(() => import("./pages/AdminPage"));
const AuthPage = React.lazy(() => import("./pages/AuthPage"));


// Lazy-loaded Footer Pages (Handling Named Exports)
const TermsOfServicePage = React.lazy(() => import("./pages/FooterPages").then(m => ({ default: m.TermsOfServicePage })));
const PrivacyPolicyPage = React.lazy(() => import("./pages/FooterPages").then(m => ({ default: m.PrivacyPolicyPage })));
const AboutUsPage = React.lazy(() => import("./pages/FooterPages").then(m => ({ default: m.AboutUsPage })));
const ContactUsPage = React.lazy(() => import("./pages/FooterPages").then(m => ({ default: m.ContactUsPage })));

// Loading Fallback Component
const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[50vh] bg-transparent">
    <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// ------------------------------------------------------------------
//  NAVIGATION HELPERS
// ------------------------------------------------------------------

function useScreenNavigate() {
  const navigate = useNavigate();
  return (screen: ActiveScreen) => {
    switch (screen) {
      case "landing":
        return navigate("/");
      case "auth":
        return navigate("/login");
      case "admin":
        return navigate("/admin/overview");
      default:
        return navigate(`/app/${screen}`);
    }
  };
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const mainContainer = document.querySelector("main");
    if (mainContainer) mainContainer.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// ------------------------------------------------------------------
//  PUBLIC ROUTE HANDLERS
// ------------------------------------------------------------------

function LandingRoute() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const goToScreen = useScreenNavigate();

  return (
    <LandingPage
      onEnterApp={() => navigate(isAuthenticated ? "/app/dashboard" : "/login")}
      setActiveScreen={goToScreen}
    />
  );
}

function LoginRoute() {
  const navigate = useNavigate();

  return (
    <PublicRoute restricted={true}>
      <AuthPage
        onLoginSuccess={() => navigate("/app/dashboard")}
        onBackToLanding={() => navigate("/")}
      />
    </PublicRoute>
  );
}

// ------------------------------------------------------------------
//  WORKSPACE SHELL (Layout)
// ------------------------------------------------------------------

function WorkspaceShell({ isAdminSection }: { isAdminSection: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const outlet = useOutlet();
  
  const { currentUser, logout, refreshCredits } = useAuth();
  const goToScreen = useScreenNavigate();

  const segments = location.pathname.split("/").filter(Boolean);
  const screenParam = segments[1] || (isAdminSection ? "overview" : "dashboard");
  
  const activeScreen: ActiveScreen = isAdminSection ? "admin" : (screenParam as ActiveScreen);
  const adminActiveTab = isAdminSection ? screenParam : "overview";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white flex select-none overflow-hidden relative w-full">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/[0.015] rounded-full blur-[100px] pointer-events-none" />

      <div className="flex w-full h-screen overflow-hidden">
        <AppSidebar
          activeScreen={activeScreen}
          setActiveScreen={goToScreen}
          currentUser={currentUser}
          onLogout={handleLogout}
          adminActiveTab={adminActiveTab}
          setAdminActiveTab={(tab) => navigate(`/admin/${tab}`)}
          isAdminWorkspace={isAdminSection}
          setIsAdminWorkspace={(val) => navigate(val ? "/admin/overview" : "/app/dashboard")}
        />

        <div className="flex-1 flex flex-col h-full bg-[#090909] overflow-hidden">
          <AppTopBar
            activeScreen={activeScreen}
            setActiveScreen={goToScreen}
            currentUser={currentUser}
            onRefreshCredits={refreshCredits}
          />

          <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative">
            <AnimatePresence mode="wait" initial={false}>
              {outlet && (
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="min-h-full flex flex-col justify-between"
                >
                  <div className="flex-1">
                    <Suspense fallback={<PageLoader />}>
                      {outlet}
                    </Suspense>
                  </div>
                  <AppFooter setActiveScreen={goToScreen} activeScreen={activeScreen} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
//  WRAPPED USER & ADMIN ROUTES
// ------------------------------------------------------------------

function DashboardRoute() {
  const { currentUser } = useAuth();
  const goToScreen = useScreenNavigate();
  return <DashboardPage currentUser={currentUser} setActiveScreen={goToScreen} />;
}

function ProfileRoute() {
  const { currentUser, updateName } = useAuth();
  return <ProfilePage currentUser={currentUser} onUpdateName={updateName} />;
}

function SubscriptionRoute() {
  const { upgrade } = useAuth();
  return <SubscriptionPage onUpgrade={upgrade} />;
}

function AdminTabRoute() {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  return (
    <AdminPage
      activeTab={tab || "overview"}
      setActiveTab={(t: string) => navigate(`/admin/${t}`)}
    />
  );
}

// ------------------------------------------------------------------
//  MAIN APP COMPONENT
// ------------------------------------------------------------------

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CookieBanner />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingRoute />} />
          <Route path="/login" element={<LoginRoute />} />

          {/* User Workspace Routes */}
          <Route path="/app" element={<PrivateRoute><WorkspaceShell isAdminSection={false} /></PrivateRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardRoute />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="image" element={<ImagePage />} />
            <Route path="video" element={<VideoPage />} />
            <Route path="prompt-studio" element={<PromptStudioPage />} />
            <Route path="models-list" element={<ModelsListPage />} />
            <Route path="assets-library" element={<AssetsLibraryPage />} />
            <Route path="business-plan" element={<BusinessPlanPage />} />
            <Route path="subscription" element={<SubscriptionRoute />} />
            <Route path="settings" element={<UserSettingsPage />} />
            <Route path="profile" element={<ProfileRoute />} />
            <Route path="terms" element={<TermsOfServicePage />} />
            <Route path="privacy" element={<PrivacyPolicyPage />} />
            <Route path="about" element={<AboutUsPage />} />
            <Route path="contact" element={<ContactUsPage />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Admin Workspace Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <WorkspaceShell isAdminSection={true} />
            </AdminRoute>
          }>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path=":tab" element={<AdminTabRoute />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
