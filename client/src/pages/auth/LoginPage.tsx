import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box, TextField, Button, Typography, Divider,
  CircularProgress, Alert, InputAdornment,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Google as GoogleIcon, GitHub as GitHubIcon } from '@mui/icons-material';
import { Email as EmailIcon, Lock as LockIcon, ArrowForward } from '@mui/icons-material';
import { useLoginMutation } from '../../redux/api/authApi';
import { setCredentials } from '../../redux/slices/authSlice';
import { tokenStorage } from '../../utils/tokenStorage';
import { VITE_BACKEND_URI } from '../../env/EnvImport';
import { useVerifyOtpMutation } from '@/redux/api/verifyOtpApi';

// NOTE: this component now renders only the form card. The full-page
// split-screen shell (background, grid, visual panel) lives in AuthLayout,
// which should wrap this route — see the router snippet shared alongside
// this file.
export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [verifyOtp, { isLoading: verifyOtpLoading }] = useVerifyOtpMutation();

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email }).unwrap();
      setOtpSent(true);
      setStep('otp');
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setError(e?.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await verifyOtp({ email, otp }).unwrap();

      if (response?.data?.accessToken) {
        tokenStorage.setToken(response?.data?.accessToken);
      } else {
        setError('No access token received. Please try again.');
        return;
      }

      dispatch(setCredentials({
        id: response?.data?.user._id,
        username: response?.data?.user.username,
        email: response?.data?.user.email,
        role: response?.data?.user.role,
      }));

      navigate(response?.data?.user?.role === 'admin' ? '/admin' : '/chat');
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setError(e?.data?.message || 'Invalid OTP. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{ width: '100%', maxWidth: 520 }}
    >
      {/* Logo */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box
          sx={{
            width: 52, height: 52, borderRadius: '14px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(245,158,11,0.4)', mb: 2,
          }}
        >
          <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#000' }}>G</Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
          Welcome back
        </Typography>
        <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem', mt: 0.5 }}>
          Sign in to your GoChat account
        </Typography>
      </Box>

      {/* Card */}
      <Box
        sx={{
          background: 'rgba(26,26,26,0.9)',
          border: '1px solid #2d2d2d',
          borderRadius: '16px',
          p: 3.5,
          backdropFilter: 'blur(12px)',
        }}
      >
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step === 'email' ? (
            <motion.form
              key="email"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleEmailSubmit}
            >
              <TextField
                fullWidth label="Email Address" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#6b7280', fontSize: 18 }} /></InputAdornment>,
                  },
                }}
                sx={{ mb: 2.5 }}
              />
              <Button
                fullWidth type="submit" variant="contained" disabled={isLoading}
                endIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <ArrowForward />}
                sx={{ height: 48, fontSize: '0.9rem', fontWeight: 600 }}
              >
                {isLoading ? 'Sending OTP...' : 'Continue with Email'}
              </Button>
            </motion.form>
          ) : (
            <motion.form
              key="otp"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleOtpSubmit}
            >
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                  OTP sent to <strong style={{ color: '#f59e0b' }}>{email}</strong>
                </Typography>
                {otpSent && (
                  <Typography sx={{ color: '#22c55e', fontSize: '0.75rem', mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    ✓ Check your inbox
                  </Typography>
                )}
              </Box>
              <TextField
                fullWidth label="Enter OTP" type="text" value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                slotProps={{
                  htmlInput: { maxLength: 6 },
                  input: {
                    startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#6b7280', fontSize: 18 }} /></InputAdornment>,
                  },
                }}
                sx={{ mb: 2.5 }}
              />
              <Button
                fullWidth type="submit" variant="contained"
                disabled={verifyOtpLoading || otp.length < 4}
                endIcon={verifyOtpLoading ? <CircularProgress size={16} color="inherit" /> : <ArrowForward />}
                sx={{ height: 48, fontSize: '0.9rem', fontWeight: 600 }}
              >
                {verifyOtpLoading ? 'Verifying...' : 'Verify & Sign In'}
              </Button>
              <Button
                fullWidth variant="text" sx={{ mt: 1, color: '#9ca3af', fontSize: '0.82rem' }}
                onClick={() => { setStep('email'); setOtp(''); setError(''); }}
              >
                ← Change email
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        <Divider sx={{ my: 2.5, borderColor: '#2d2d2d', '&::before, &::after': { borderColor: '#2d2d2d' } }}>
          <Typography sx={{ color: '#6b7280', fontSize: '0.78rem', px: 1 }}>or continue with</Typography>
        </Divider>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <Button
            variant="outlined" startIcon={<GoogleIcon />}
            href={`${VITE_BACKEND_URI}/api/v1/auth/google`}
            sx={{
              borderColor: '#2d2d2d', color: '#e5e7eb', height: 44,
              '&:hover': { borderColor: '#f59e0b', background: 'rgba(245,158,11,0.06)' },
            }}
          >
            Google
          </Button>
          <Button
            variant="outlined" startIcon={<GitHubIcon />}
            href={`${VITE_BACKEND_URI}/api/v1/auth/github`}
            sx={{
              borderColor: '#2d2d2d', color: '#e5e7eb', height: 44,
              '&:hover': { borderColor: '#f59e0b', background: 'rgba(245,158,11,0.06)' },
            }}
          >
            GitHub
          </Button>
        </Box>
      </Box>

      <Typography sx={{ textAlign: 'center', mt: 2.5, color: '#9ca3af', fontSize: '0.85rem' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#f59e0b', fontWeight: 600 }}>
          Sign up
        </Link>
      </Typography>
    </motion.div>
  );
};