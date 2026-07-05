import { useEffect, useRef } from 'react';
import { Box, Card, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { animate } from 'animejs';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
  subtitle?: string;
  delay?: number;
}

export const StatCard = ({ title, value, icon, color = '#f59e0b', subtitle, delay = 0 }: StatCardProps) => {
  const valueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof value === 'number' && valueRef.current) {
      const obj = { val: 0 };
      animate(obj, {
        val: value,
        round: 1,
        duration: 1200,
        delay: delay * 1000 + 300,
        ease: 'easeOutExpo',
        update: () => {
          if (valueRef.current) {
            valueRef.current.textContent = obj.val.toLocaleString();
          }
        },
      });
    }
  }, [value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card
        sx={{
          p: 2.5,
          background: '#1a1a1a',
          border: '1px solid #2d2d2d',
          borderRadius: '12px',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'default',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          '&:hover': {
            borderColor: `${color}44`,
            boxShadow: `0 8px 32px ${color}22`,
          },
        }}
      >
        {/* Glow orb */}
        <Box
          sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}22, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>
              {title}
            </Typography>
            <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
              {typeof value === 'number' ? (
                <span ref={valueRef}>0</span>
              ) : (
                value
              )}
            </Typography>
            {subtitle && (
              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', mt: 0.75 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              background: `${color}1a`,
              border: `1px solid ${color}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>
      </Card>
    </motion.div>
  );
};
