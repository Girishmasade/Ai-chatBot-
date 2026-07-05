import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, Tooltip } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  CreditCard as CreditCardIcon,
  SmartToy as AIIcon,
  Menu as MenuIcon,
  Article as FooterIcon,
  Palette as BrandingIcon,
  Cookie as CookieIcon,
  Description as AuditIcon,
  Settings as SettingsIcon,
  OpenInNew as UserSideIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { animate, stagger } from 'animejs';
import { setActiveRoute } from '../../redux/slices/uiSlice';
import { logout } from '../../redux/slices/authSlice';
import { tokenStorage } from '../../utils/tokenStorage';
import type { RootState } from '../../redux/store';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const mainNavItems: NavItem[] = [
  { label: 'Dashboard', icon: <DashboardIcon sx={{ fontSize: 18 }} />, path: '/admin/dashboard' },
  { label: 'Users', icon: <PeopleIcon sx={{ fontSize: 18 }} />, path: '/admin/users' },
  { label: 'Subscriptions', icon: <CreditCardIcon sx={{ fontSize: 18 }} />, path: '/admin/subscriptions' },
  { label: 'AI Models', icon: <AIIcon sx={{ fontSize: 18 }} />, path: '/admin/ai-models' },
  { label: 'Menu Management', icon: <MenuIcon sx={{ fontSize: 18 }} />, path: '/admin/menu' },
  { label: 'Footer CMS', icon: <FooterIcon sx={{ fontSize: 18 }} />, path: '/admin/footer-cms' },
  { label: 'Branding', icon: <BrandingIcon sx={{ fontSize: 18 }} />, path: '/admin/branding' },
  { label: 'Cookie Consents', icon: <CookieIcon sx={{ fontSize: 18 }} />, path: '/admin/cookie-consents' },
  { label: 'Audit Logs', icon: <AuditIcon sx={{ fontSize: 18 }} />, path: '/admin/audit-logs' },
  { label: 'Settings', icon: <SettingsIcon sx={{ fontSize: 18 }} />, path: '/admin/settings' },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navRef.current) {
      animate(navRef.current.querySelectorAll('.nav-item'), {
        translateX: [-20, 0],
        opacity: [0, 1],
        delay: stagger(60, { start: 100 }),
        ease: 'easeOutCubic',
        duration: 400,
      });
    }
  }, []);

  const handleNavClick = (path: string) => {
    dispatch(setActiveRoute(path));
    navigate(path);
  };

  const handleLogout = () => {
    tokenStorage.clearToken();
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 200 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        background: '#111111',
        borderRight: '1px solid #2d2d2d',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid #2d2d2d',
          minHeight: 60,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#000' }}>G</Typography>
        </Box>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff', whiteSpace: 'nowrap' }}>
                GoChat
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Admin Panel label */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))',
                  border: '1px solid rgba(245,158,11,0.3)',
                  borderRadius: '6px',
                  px: 1.5,
                  py: 0.5,
                  display: 'inline-block',
                }}
              >
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#f59e0b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Admin Panel
                </Typography>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Nav */}
      <Box ref={navRef} sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1 }}>
        {mainNavItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Tooltip
              key={item.path}
              title={sidebarCollapsed ? item.label : ''}
              placement="right"
              arrow
            >
              <Box
                className="nav-item"
                onClick={() => handleNavClick(item.path)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1,
                  mx: 1,
                  mb: 0.25,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  position: 'relative',
                  background: active ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                  color: active ? '#f59e0b' : '#9ca3af',
                  transition: 'all 0.18s ease',
                  '&:hover': {
                    background: active ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255,255,255,0.04)',
                    color: active ? '#f59e0b' : '#e5e7eb',
                  },
                }}
              >
                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    style={{
                      position: 'absolute',
                      left: -8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 3,
                      height: 24,
                      borderRadius: '0 3px 3px 0',
                      background: '#f59e0b',
                    }}
                  />
                )}
                <Box sx={{ flexShrink: 0, display: 'flex' }}>{item.icon}</Box>
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap', color: 'inherit' }}>
                        {item.label}
                      </Typography>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </Tooltip>
          );
        })}
      </Box>

      {/* Bottom actions */}
      <Box sx={{ borderTop: '1px solid #2d2d2d', py: 1 }}>
        <Tooltip title={sidebarCollapsed ? 'User Side' : ''} placement="right" arrow>
          <Box
            onClick={() => navigate('/chat')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 1,
              mx: 1,
              mb: 0.25,
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#9ca3af',
              transition: 'all 0.18s ease',
              '&:hover': { background: 'rgba(255,255,255,0.04)', color: '#e5e7eb' },
            }}
          >
            <UserSideIcon sx={{ fontSize: 18, flexShrink: 0 }} />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Typography sx={{ fontSize: '0.82rem', whiteSpace: 'nowrap', color: 'inherit' }}>
                    User Side
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Tooltip>
        <Tooltip title={sidebarCollapsed ? 'Logout' : ''} placement="right" arrow>
          <Box
            onClick={handleLogout}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 1,
              mx: 1,
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#9ca3af',
              transition: 'all 0.18s ease',
              '&:hover': { background: 'rgba(239,68,68,0.08)', color: '#ef4444' },
            }}
          >
            <LogoutIcon sx={{ fontSize: 18, flexShrink: 0 }} />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Typography sx={{ fontSize: '0.82rem', whiteSpace: 'nowrap', color: 'inherit' }}>
                    Logout
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Tooltip>
      </Box>
    </motion.aside>
  );
};
