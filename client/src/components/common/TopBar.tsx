import { Box, Typography, IconButton, Avatar, Chip } from '@mui/material';
import { Menu as MenuIcon, Notifications as NotifIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../redux/slices/uiSlice';
import type { RootState } from '../../redux/store';

export const TopBar = () => {
  const dispatch = useDispatch();
  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        height: 60,
        background: '#111111',
        borderBottom: '1px solid #2d2d2d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          onClick={() => dispatch(toggleSidebar())}
          size="small"
          sx={{ color: '#9ca3af', '&:hover': { color: '#f59e0b', background: 'rgba(245,158,11,0.08)' } }}
        >
          <MenuIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Box
          sx={{
            width: 1,
            height: 20,
            background: '#2d2d2d',
            mx: 0.5,
            display: { xs: 'none', sm: 'block' }
          }}
        />
        <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af', display: { xs: 'none', sm: 'block' } }}>
          {sidebarCollapsed ? 'GoChat Admin' : 'Admin Panel'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconButton
          size="small"
          sx={{ color: '#9ca3af', '&:hover': { color: '#f59e0b', background: 'rgba(245,158,11,0.08)' } }}
        >
          <NotifIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            src={user?.avatar}
            sx={{ width: 30, height: 30, background: 'linear-gradient(135deg, #f59e0b, #d97706)', fontSize: '0.78rem', fontWeight: 700, color: '#000' }}
          >
            {user?.username?.[0]?.toUpperCase() || 'A'}
          </Avatar>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
              {user?.username || 'Admin'}
            </Typography>
            <Chip
              label="Admin"
              size="small"
              sx={{
                height: 14,
                fontSize: '0.6rem',
                fontWeight: 600,
                background: 'rgba(245,158,11,0.15)',
                color: '#f59e0b',
                border: '1px solid rgba(245,158,11,0.3)',
                '& .MuiChip-label': { px: 0.75, py: 0 },
              }}
            />
          </Box>
        </Box>
      </Box>
    </motion.header>
  );
};
