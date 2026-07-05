import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import { Sidebar } from '../components/common/Sidebar';
import { TopBar } from '../components/common/TopBar';
import type { RootState } from '../redux/store';

export const AdminLayout = () => {
  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui);
  const sidebarWidth = sidebarCollapsed ? 64 : 200;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          marginLeft: `${sidebarWidth}px`,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <TopBar />
        <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
};
