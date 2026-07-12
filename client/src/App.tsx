import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard, GuestGuard } from '@/helper/authGuard';
import { AdminLayout } from '@/template/AdminLayout';
import { UserLayout } from '@/template/UserLayout';

// Auth pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';

// Admin pages
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { UsersPage } from '@/pages/admin/UsersPage';
import { SubscriptionsPage } from '@/pages/admin/SubscriptionsPage';
import { AIModelsPage } from '@/pages/admin/AIModelsPage';
import { MenuManagementPage } from '@/pages/admin/MenuManagementPage';
import { FooterCMSPage } from '@/pages/admin/FooterCMSPage';
import { BrandingPage } from '@/pages/admin/BrandingPage';
import { CookieConsentsPage } from '@/pages/admin/CookieConsentsPage';
import { AuditLogsPage } from '@/pages/admin/AuditLogsPage';
import { SettingsPage } from '@/pages/admin/SettingsPage';

// User pages
import { ChatPage } from '@/pages/user/ChatPage';
import { AuthLayout } from './pages/auth/AuthLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ── Guest Routes (redirect if already logged in) ── */}
        <Route element={<GuestGuard />}>
        <Route element={<AuthLayout/>}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        {/* ── Admin Routes (require auth + admin role) ── */}
        <Route element={<AuthGuard requireAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="subscriptions" element={<SubscriptionsPage />} />
            <Route path="ai-models" element={<AIModelsPage />} />
            <Route path="menu" element={<MenuManagementPage />} />
            <Route path="footer-cms" element={<FooterCMSPage />} />
            <Route path="branding" element={<BrandingPage />} />
            <Route path="cookie-consents" element={<CookieConsentsPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* ── User Routes (require auth only) ── */}
        <Route element={<AuthGuard />}>
          <Route element={<UserLayout />}>
            <Route path="/chat" element={<ChatPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
