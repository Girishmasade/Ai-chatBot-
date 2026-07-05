import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        mb: 3,
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, fontSize: '1.6rem', color: '#fff' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ color: '#9ca3af', fontSize: '0.85rem', mt: 0.25 }}>
            {subtitle}
          </Typography>
        )}
      </motion.div>
      {actions && (
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            {actions}
          </Box>
        </motion.div>
      )}
    </Box>
  );
};
