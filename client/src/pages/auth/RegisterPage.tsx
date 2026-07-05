import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, CircularProgress, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import { Person as PersonIcon, Email as EmailIcon, ArrowForward } from '@mui/icons-material';
import { useRegisterMutation } from '../../redux/api/authApi';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(formData).unwrap();
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setError(e?.data?.message || 'Registration failed. Please try again.');
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
      <Box
        sx={{
          position: 'fixed', inset: 0, zIndex: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px', pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}
      >
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
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>Create account</Typography>
          <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem', mt: 0.5 }}>
            Join GoChat and start chatting with AI
          </Typography>
        </Box>

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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
                {error}
              </Alert>
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Alert severity="success" sx={{ mb: 2.5, borderRadius: '8px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#86efac' }}>
                Account created! Redirecting to login...
              </Alert>
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { field: 'username', label: 'Username', icon: <PersonIcon sx={{ color: '#6b7280', fontSize: 18 }} />, type: 'text' },
              { field: 'email', label: 'Email Address', icon: <EmailIcon sx={{ color: '#6b7280', fontSize: 18 }} />, type: 'email' },
            ].map(({ field, label, icon, type }, i) => (
              <motion.div
                key={field}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <TextField
                  fullWidth label={label} type={type}
                  value={formData[field as keyof typeof formData]}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                  required
                  slotProps={{
                    input: { startAdornment: <InputAdornment position="start">{icon}</InputAdornment> }
                  }}
                  sx={{ mb: 2.5 }}
                />
              </motion.div>
            ))}

            <Button
              fullWidth type="submit" variant="contained" disabled={isLoading}
              endIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <ArrowForward />}
              sx={{ height: 48, fontSize: '0.9rem', fontWeight: 600 }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </Box>

        <Typography sx={{ textAlign: 'center', mt: 2.5, color: '#9ca3af', fontSize: '0.85rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#f59e0b', fontWeight: 600 }}>Sign in</Link>
        </Typography>
      </motion.div>
    </Box>
  );
};
