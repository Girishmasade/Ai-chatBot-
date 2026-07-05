import { useState } from 'react';
import {
  Box, Typography, Card, Button, TextField, Switch,
  Grid,
} from '@mui/material';
import {
  Save as SaveIcon,
  Security as SecurityIcon,
  Timer as TimerIcon,
  Lock as LockIcon,
  Computer as ComputerIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AnimatedContainer } from '@/components/common/AnimatedContainer';
import { PageHeader } from '@/components/common/PageHeader';

const Section = ({ icon, title, children, delay = 0 }: {
  icon: React.ReactNode; title: string; children: React.ReactNode; delay?: number;
}) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
    <Card sx={{ borderRadius: '12px', p: 3, mb: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
          {icon}
        </Box>
        <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '1rem' }}>{title}</Typography>
      </Box>
      {children}
    </Card>
  </motion.div>
);

const ToggleRow = ({ label, subtitle, checked, onChange }: {
  label: string; subtitle?: string; checked: boolean; onChange: (v: boolean) => void;
}) => (
  <Box sx={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: '#111', border: '1px solid #2d2d2d', borderRadius: '10px', p: 2,
  }}>
    <Box>
      <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#e5e7eb' }}>{label}</Typography>
      {subtitle && <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', mt: 0.25 }}>{subtitle}</Typography>}
    </Box>
    <Switch checked={checked} onChange={(e) => onChange(e.target.checked)} size="small" />
  </Box>
);

export const SettingsPage = () => {
  const [saved, setSaved] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [strongPasswords, setStrongPasswords] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('480');
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');
  const [minPasswordLength, setMinPasswordLength] = useState('8');
  const [passwordExpiry, setPasswordExpiry] = useState('90');

  return (
    <AnimatedContainer>
      <PageHeader
        title="Settings"
        subtitle="Security and platform configuration."
        actions={
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button variant="outlined" sx={{ height: 38, borderColor: '#2d2d2d', color: '#9ca3af', '&:hover': { borderColor: '#f59e0b', color: '#f59e0b' } }}>
              Reset to Defaults
            </Button>
            <Button variant="contained" startIcon={<SaveIcon />}
              onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
              sx={{ height: 38, background: saved ? '#22c55e' : undefined }}>
              {saved ? '✓ Saved!' : 'Save'}
            </Button>
          </Box>
        }
      />

      <Section icon={<SecurityIcon sx={{ fontSize: 18 }} />} title="Two-Factor Authentication" delay={0.05}>
        <ToggleRow
          label="Enable 2FA"
          subtitle="Require two-factor authentication for admin accounts"
          checked={twoFA}
          onChange={setTwoFA}
        />
      </Section>

      <Section icon={<TimerIcon sx={{ fontSize: 18 }} />} title="Session Management" delay={0.1}>
        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af', mb: 0.75, fontWeight: 500 }}>
              Session Timeout (minutes)
            </Typography>
            <TextField fullWidth size="small" type="number" value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af', mb: 0.75, fontWeight: 500 }}>
              Max Login Attempts
            </Typography>
            <TextField fullWidth size="small" type="number" value={maxLoginAttempts}
              onChange={(e) => setMaxLoginAttempts(e.target.value)} />
          </Grid>
        </Grid>

        <Typography sx={{ fontWeight: 600, color: '#e5e7eb', fontSize: '0.88rem', mb: 1.5 }}>
          Active Sessions
        </Typography>
        <Box sx={{
          background: '#111', border: '1px solid #2d2d2d', borderRadius: '10px',
          p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ComputerIcon sx={{ fontSize: 20, color: '#9ca3af' }} />
            <Box>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#e5e7eb' }}>Current Browser</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>Active now</Typography>
            </Box>
          </Box>
          <Box sx={{
            px: 1.5, py: 0.4, borderRadius: '6px',
            background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
          }}>
            <Typography sx={{ fontSize: '0.7rem', color: '#22c55e', fontWeight: 600 }}>Current</Typography>
          </Box>
        </Box>
      </Section>

      <Section icon={<LockIcon sx={{ fontSize: 18 }} />} title="Password Policy" delay={0.15}>
        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af', mb: 0.75, fontWeight: 500 }}>
              Minimum Password Length
            </Typography>
            <TextField fullWidth size="small" type="number" value={minPasswordLength}
              onChange={(e) => setMinPasswordLength(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af', mb: 0.75, fontWeight: 500 }}>
                Password Expiry (days)
              </Typography>
              <TextField fullWidth size="small" type="number" value={passwordExpiry}
                onChange={(e) => setPasswordExpiry(e.target.value)} />
              <Typography sx={{ fontSize: '0.72rem', color: '#6b7280', mt: 0.75 }}>
                Set to 0 for no expiry
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <ToggleRow
          label="Enforce Strong Passwords"
          subtitle="Require uppercase, lowercase, numbers, and special characters"
          checked={strongPasswords}
          onChange={setStrongPasswords}
        />
      </Section>
    </AnimatedContainer>
  );
};
