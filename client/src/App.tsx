import React from "react";
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
import { ActiveScreen } from "./types";
import { useAuth } from "./hooks/useAuth";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import ChatPage from "./pages/ChatPage";
import ImagePage from "./pages/ImagePage";
import VideoPage from "./pages/VideoPage";
import PromptStudioPage from "./pages/PromptStudioPage";
import ModelsListPage from "./pages/ModelsListPage";
import AssetsLibraryPage from "./pages/AssetsLibraryPage";
import BusinessPlanPage from "./pages/BusinessPlanPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import UserSettingsPage from "./pages/UserSettingsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import { TermsOfServicePage, PrivacyPolicyPage, AboutUsPage, ContactUsPage } from "./pages/FooterPages";
import AuthPage from "./pages/AuthPage";
import AppSidebar from "./components/AppSidebar";
import AppTopBar from "./components/AppTopBar";
import CookieBanner from "./components/CookieBanner";
import AppFooter from "./components/AppFooter";

/* ================================================================== */
/*  NAVIGATION HELPERS                                                 */
/*  Translates screen id-based navigation to real URL paths.           */
/* ================================================================== */

function useScreenNavigate() {
  const navigate = useNavigate();
  return (screen: ActiveScreen) => {
    if (screen === "landing") {
      navigate("/");
      return;
    }
    if (screen === "auth") {
      navigate("/login");
      return;
    }
    if (screen === "admin") {
      navigate("/admin/overview");
      return;
    }
    navigate(`/app/${screen}`);
  };
}

/* ================================================================== */
/*  ROUTE GUARDS                                                       */
/* ================================================================== */

function RequireAuth({ children }: { children: React.ReactElement }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

function RequireAdmin({ children }: { children: React.ReactElement }) {
  const { currentUser } = useAuth();
  const isEmployee = currentUser.role === "Administrator" || currentUser.role === "Developer";
  if (!isEmployee) {
    return <Navigate to="/app/dashboard" replace />;
  }
  return children;
}

/* ================================================================== */
/*  PUBLIC ROUTES ("/" and "/login")                                   */
/* ================================================================== */

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
  const { isAuthenticated, login } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <AuthPage
      onLoginSuccess={(email: string, name: string) => {
        login(email, name);
        navigate("/app/dashboard");
      }}
      onBackToLanding={() => navigate("/")}
    />
  );
}

/* ================================================================== */
/*  WORKSPACE SHELL                                                     */
/*  Shared layout configuration.                                       */
/* ================================================================== */

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

  const setAdminActiveTab = (tab: any) => navigate(`/admin/${tab}`);

  const setIsAdminWorkspace = (val: boolean) => {
    navigate(val ? "/admin/overview" : "/app/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white flex select-none overflow-hidden relative w-full">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/[0.015] rounded-full blur-[100px] pointer-events-none" />

      <div className="flex w-full h-screen overflow-hidden">
        <AppSidebar
          activeScreen={activeScreen}
          setActiveScreen={goToScreen}
          currentUser={currentUser}
          onLogout={handleLogout}
          adminActiveTab={adminActiveTab}
          setAdminActiveTab={setAdminActiveTab}
          isAdminWorkspace={isAdminSection}
          setIsAdminWorkspace={setIsAdminWorkspace}
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
                  <div className="flex-1">{outlet}</div>
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

/* ================================================================== */
/*  USER ROUTE ELEMENTS                                                */
/* ================================================================== */

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

/* ================================================================== */
/*  ADMIN ROUTE ELEMENT                                                 */
/* ================================================================== */

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

/* ================================================================== */
/*  ROOT APP — Route configurations                                    */
/* ================================================================== */

export default function App() {
  return (
    <BrowserRouter>
      {/* Global Cookie Preference Banner */}
      <CookieBanner />

      <Routes>
        {/* ---------------- Public routes ---------------- */}
        <Route path="/" element={<LandingRoute />} />
        <Route path="/login" element={<LoginRoute />} />

        {/* ---------------- User workspace routes ---------------- */}
        <Route
          path="/app"
          element={
            <RequireAuth>
              <WorkspaceShell isAdminSection={false} />
            </RequireAuth>
          }
        >
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

        {/* ---------------- Admin control-room routes ---------------- */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <RequireAdmin>
                <WorkspaceShell isAdminSection />
              </RequireAdmin>
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path=":tab" element={<AdminTabRoute />} />
        </Route>

        {/* ---------------- Fallback ---------------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
