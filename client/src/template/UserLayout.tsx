import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export const UserLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        background: '#0a0a0a',
        overflow: 'hidden',
      }}
    >
      <Outlet />
    </Box>
  );
};
