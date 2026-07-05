import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box, TextField, Button, Typography, Divider,
  CircularProgress, Alert, IconButton, InputAdornment,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Google as GoogleIcon, GitHub as GitHubIcon } from '@mui/icons-material';
import { Email as EmailIcon, Lock as LockIcon, ArrowForward } from '@mui/icons-material';
import { useLoginMutation } from '../../redux/api/authApi';
import { setCredentials } from '../../redux/slices/authSlice';
import { tokenStorage } from '../../utils/tokenStorage';
import { VITE_BACKEND_URI } from '../../env/EnvImport';
import { useVerifyOtpMutation } from '@/redux/api/verifyOtpApi';

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [verifyOtp, {isLoading: verifyOtpLoading} ] = useVerifyOtpMutation()

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const OtpPayload = {
    email: email,
    otp: otp,
  }



  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({email: email}).unwrap();
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
      role: response?.data?.user.role ,
    }));

    navigate(response?.data?.user?.role === 'admin' ? '/admin' : '/chat');
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } };
    setError(e?.data?.message || 'Invalid OTP. Please try again.');
  }
};


  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.08) 0%, #0a0a0a 60%)',
        p: 2,
      }}
    >
      {/* Background grid */}
      <Box
        sx={{
          position: 'fixed', inset: 0, zIndex: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}
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
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
                {error}
              </Alert>
            </motion.div>
          )}

          {step === 'email' ? (
            <motion.form key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleEmailSubmit}>
              <TextField
                fullWidth label="Email Address" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#6b7280', fontSize: 18 }} /></InputAdornment>,
                  }
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
            <motion.form key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleOtpSubmit}>
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                  OTP sent to <strong style={{ color: '#f59e0b' }}>{email}</strong>
                </Typography>
                {otpSent && (
                  <Typography
                    sx={{ color: '#22c55e', fontSize: '0.75rem', mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}
                  >
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
                  }
                }}
                sx={{ mb: 2.5 }}
              />
              <Button
                fullWidth type="submit" variant="contained"
                disabled={isLoading || otp.length < 4}
                endIcon={<ArrowForward />}
                sx={{ height: 48, fontSize: '0.9rem', fontWeight: 600 }}
              >
                Verify & Sign In
              </Button>
              <Button
                fullWidth variant="text" sx={{ mt: 1, color: '#9ca3af', fontSize: '0.82rem' }}
                onClick={() => { setStep('email'); setOtp(''); setError(''); }}
              >
                ← Change email
              </Button>
            </motion.form>
          )}

          <Divider sx={{ my: 2.5, borderColor: '#2d2d2d', '&::before, &::after': { borderColor: '#2d2d2d' } }}>
            <Typography sx={{ color: '#6b7280', fontSize: '0.78rem', px: 1 }}>or continue with</Typography>
          </Divider>

          {/* Social buttons */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <Button
              variant="outlined" startIcon={<GoogleIcon />}
              href={`${VITE_BACKEND_URI}/api/v1/auth/google`}
              sx={{
                borderColor: '#2d2d2d', color: '#e5e7eb', height: 44,
                '&:hover': { borderColor: '#f59e0b', background: 'rgba(245,158,11,0.06)' }
              }}
            >
              Google
            </Button>
            <Button
              variant="outlined" startIcon={<GitHubIcon />}
              href={`${VITE_BACKEND_URI}/api/v1/auth/auth/github`}
              sx={{
                borderColor: '#2d2d2d', color: '#e5e7eb', height: 44,
                '&:hover': { borderColor: '#f59e0b', background: 'rgba(245,158,11,0.06)' }
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
    </Box>
  );
};
