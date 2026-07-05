import { Box, Grid } from '@mui/material';
import {
  People as PeopleIcon,
  CreditCard as CreditCardIcon,
  SmartToy as AIIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { AnimatedContainer } from '@/components/common/AnimatedContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { useGetDashboardQuery } from '@/redux/api/adminApi';
import { motion } from 'framer-motion';
import { Typography, Card, Box as MuiBox } from '@mui/material';

const recentActivity = [
  { action: 'Admin Login', type: 'auth', admin: 'System Admin', status: 'success', time: '2 min ago' },
  { action: 'Subscription Plan Created', type: 'subscription', admin: 'System Admin', status: 'success', time: '5 min ago' },
  { action: 'AI Model Added', type: 'model', admin: 'System Admin', status: 'success', time: '12 min ago' },
  { action: 'Footer Settings Updated', type: 'footer', admin: 'System Admin', status: 'success', time: '20 min ago' },
  { action: 'User Registered', type: 'auth', admin: 'System Admin', status: 'success', time: '1 hr ago' },
];

const typeColors: Record<string, string> = {
  auth: '#3b82f6',
  subscription: '#f59e0b',
  model: '#8b5cf6',
  footer: '#22c55e',
};

export const DashboardPage = () => {
  const { data, isLoading } = useGetDashboardQuery();
  const stats = data?.data;

  return (
    <AnimatedContainer>
      <PageHeader title="Dashboard" subtitle="Welcome back — here's what's happening." />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { title: 'Total Users', value: stats?.totalUsers ?? 1240, icon: <PeopleIcon />, color: '#3b82f6', subtitle: '+12% this month', delay: 0 },
          { title: 'Active Subscriptions', value: stats?.totalSubscriptions ?? 340, icon: <CreditCardIcon />, color: '#f59e0b', subtitle: '85% retention rate', delay: 0.05 },
          { title: 'AI Requests Today', value: stats?.totalAIRequests ?? 8920, icon: <AIIcon />, color: '#8b5cf6', subtitle: '↑ 24% vs yesterday', delay: 0.1 },
          { title: 'Active Users', value: stats?.activeUsers ?? 890, icon: <TrendingIcon />, color: '#22c55e', subtitle: 'Online right now', delay: 0.15 },
        ].map((card) => (
          <Grid item xs={12} sm={6} xl={3} key={card.title}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <MuiBox
            sx={{
              px: 3, py: 2,
              borderBottom: '1px solid #2d2d2d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
              Recent Activity
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#f59e0b', cursor: 'pointer', fontWeight: 500 }}>
              View all →
            </Typography>
          </MuiBox>

          {recentActivity.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.06 }}
            >
              <MuiBox
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 3,
                  py: 1.75,
                  borderBottom: i < recentActivity.length - 1 ? '1px solid #2d2d2d' : 'none',
                  '&:hover': { background: 'rgba(255,255,255,0.02)' },
                  gap: 2,
                }}
              >
                <MuiBox
                  sx={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: typeColors[item.type] || '#9ca3af',
                  }}
                />
                <MuiBox sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.85rem', color: '#e5e7eb', fontWeight: 500 }}>
                    {item.action}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {item.admin}
                  </Typography>
                </MuiBox>
                <MuiBox
                  sx={{
                    px: 1.25, py: 0.25, borderRadius: '6px',
                    background: `${typeColors[item.type] || '#9ca3af'}1a`,
                    border: `1px solid ${typeColors[item.type] || '#9ca3af'}33`,
                  }}
                >
                  <Typography sx={{ fontSize: '0.7rem', color: typeColors[item.type] || '#9ca3af', fontWeight: 600 }}>
                    {item.type}
                  </Typography>
                </MuiBox>
                <MuiBox
                  sx={{
                    px: 1.5, py: 0.25, borderRadius: '99px',
                    background: 'rgba(34,197,94,0.12)',
                    border: '1px solid rgba(34,197,94,0.3)',
                  }}
                >
                  <Typography sx={{ fontSize: '0.7rem', color: '#22c55e', fontWeight: 600 }}>
                    ✓ success
                  </Typography>
                </MuiBox>
                <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', minWidth: 60, textAlign: 'right' }}>
                  {item.time}
                </Typography>
              </MuiBox>
            </motion.div>
          ))}
        </Card>
      </motion.div>
    </AnimatedContainer>
  );
};
