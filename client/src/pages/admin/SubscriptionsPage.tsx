import { useState } from 'react';
import {
  Box, Typography, Card, Button, Chip, Grid, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  IconButton, Switch,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AnimatedContainer } from '../../components/common/AnimatedContainer';
import { PageHeader } from '../../components/common/PageHeader';
import { useGetSubscriptionsQuery, useCreateSubscriptionMutation, useDeleteSubscriptionMutation } from '../../redux/api/subscriptionApi';

const mockPlans = [
  { _id: '1', name: 'Free', price: 0, tokenLimit: 10000, duration: 30, features: ['10K tokens/month', 'Basic models', 'Community support'], isActive: true },
  { _id: '2', name: 'Pro', price: 19, tokenLimit: 200000, duration: 30, features: ['200K tokens/month', 'GPT-4, Claude', 'Priority support', 'API access'], isActive: true },
  { _id: '3', name: 'Enterprise', price: 99, tokenLimit: 2000000, duration: 30, features: ['2M tokens/month', 'All models', '24/7 support', 'Custom integrations', 'SLA'], isActive: true },
];

export const SubscriptionsPage = () => {
  const [open, setOpen] = useState(false);
  const { data } = useGetSubscriptionsQuery({ page: 1, limit: 10 });
  const plans = data?.data ?? mockPlans;

  const planColors = ['#3b82f6', '#f59e0b', '#8b5cf6'];

  return (
    <AnimatedContainer>
      <PageHeader
        title="Subscriptions"
        subtitle="Manage subscription plans and tiers."
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ height: 38 }}>
            New Plan
          </Button>
        }
      />

      <Grid container spacing={2.5}>
        {plans.map((plan, i) => {
          const color = planColors[i % planColors.length];
          return (
            <Grid size={{ xs: 12, md: 4 }} key={plan._id}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <Card
                  sx={{
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: '1px solid #2d2d2d',
                    position: 'relative',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    '&:hover': { borderColor: `${color}44`, boxShadow: `0 12px 40px ${color}18` },
                  }}
                >
                  {/* Top accent bar */}
                  <Box sx={{ height: 3, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />

                  <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>{plan.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 0.5 }}>
                          <Typography sx={{ fontSize: '2rem', fontWeight: 800, color }}>
                            ${plan.price}
                          </Typography>
                          <Typography sx={{ color: '#6b7280', fontSize: '0.82rem' }}>/month</Typography>
                        </Box>
                      </Box>
                      <Switch size="small" checked={plan.isActive} sx={{ '& .Mui-checked': { color } }} />
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af', mb: 1, fontWeight: 500 }}>
                        {(plan.tokenLimit / 1000).toFixed(0)}K tokens · {plan.duration} days
                      </Typography>
                      {plan.features.map((f) => (
                        <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                          <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
                          <Typography sx={{ fontSize: '0.82rem', color: '#e5e7eb' }}>{f}</Typography>
                        </Box>
                      ))}
                    </Box>

                    <Chip
                      label={plan.isActive ? 'Active' : 'Inactive'} size="small"
                      sx={{
                        height: 22, fontSize: '0.7rem', fontWeight: 600,
                        background: plan.isActive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                        color: plan.isActive ? '#22c55e' : '#ef4444',
                        border: `1px solid ${plan.isActive ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                        borderRadius: '6px', mb: 2,
                      }}
                    />

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<EditIcon sx={{ fontSize: 14 }} />} variant="outlined"
                        sx={{ flex: 1, height: 34, borderColor: '#2d2d2d', color: '#9ca3af', '&:hover': { borderColor: color, color } }}>
                        Edit
                      </Button>
                      <IconButton size="small" sx={{ border: '1px solid #2d2d2d', borderRadius: '8px', color: '#9ca3af', '&:hover': { borderColor: '#ef4444', color: '#ef4444', background: 'rgba(239,68,68,0.08)' } }}>
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>

      {/* Create Plan Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { background: '#1a1a1a', border: '1px solid #2d2d2d', borderRadius: '14px' } } }}
      >
        <DialogTitle sx={{ color: '#fff' }}>Create Subscription Plan</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {[
              { label: 'Plan Name', placeholder: 'e.g. Pro' },
              { label: 'Price (USD/month)', placeholder: '19' },
              { label: 'Token Limit', placeholder: '200000' },
              { label: 'Duration (days)', placeholder: '30' },
            ].map(({ label, placeholder }) => (
              <TextField key={label} label={label} placeholder={placeholder} fullWidth size="small" />
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setOpen(false)} variant="outlined" sx={{ borderColor: '#2d2d2d', color: '#9ca3af' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => setOpen(false)}>Create Plan</Button>
        </DialogActions>
      </Dialog>
    </AnimatedContainer>
  );
};
