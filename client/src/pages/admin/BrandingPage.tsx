import { useState, useRef } from 'react';
import { Box, Typography, Card, Button, TextField } from '@mui/material';
import { Save as SaveIcon, Upload as UploadIcon, ImageOutlined as ImageIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AnimatedContainer } from '@/components/common/AnimatedContainer';
import { PageHeader } from '@/components/common/PageHeader';

interface UploadZoneProps {
  label: string;
  subtitle: string;
  preview?: string;
}

const UploadZone = ({ label, subtitle, preview }: UploadZoneProps) => {
  const [file, setFile] = useState<string | undefined>(preview);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(URL.createObjectURL(f));
  };

  return (
    <Card sx={{ borderRadius: '12px', p: 3, mb: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 600, color: '#e5e7eb', fontSize: '0.95rem' }}>{label}</Typography>
          <Typography sx={{ fontSize: '0.78rem', color: '#f59e0b', mt: 0.25 }}>{subtitle}</Typography>
        </Box>
        <Button
          size="small" startIcon={<UploadIcon sx={{ fontSize: 14 }} />}
          variant="outlined" onClick={() => inputRef.current?.click()}
          sx={{ height: 34, borderColor: '#2d2d2d', color: '#9ca3af', fontSize: '0.78rem', '&:hover': { borderColor: '#f59e0b', color: '#f59e0b' } }}
        >
          Upload
        </Button>
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
      </Box>

      <motion.div
        whileHover={{ borderColor: 'rgba(245,158,11,0.4)' }}
        style={{
          border: '2px dashed #2d2d2d',
          borderRadius: '10px',
          minHeight: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
        }}
        onClick={() => inputRef.current?.click()}
      >
        {file ? (
          <img src={file} alt={label} style={{ maxHeight: 100, maxWidth: '100%', objectFit: 'contain', borderRadius: 6 }} />
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <ImageIcon sx={{ fontSize: 36, color: '#3d3d3d', mb: 1 }} />
            <Typography sx={{ fontSize: '0.8rem', color: '#6b7280' }}>No image uploaded</Typography>
            <Typography sx={{ fontSize: '0.72rem', color: '#4b5563', mt: 0.25 }}>Click or drag & drop</Typography>
          </Box>
        )}
      </motion.div>
    </Card>
  );
};

export const BrandingPage = () => {
  const [appName, setAppName] = useState('GoChat AI');
  const [saved, setSaved] = useState(false);

  return (
    <AnimatedContainer>
      <PageHeader
        title="Branding"
        subtitle="Manage logos and app identity."
        actions={
          <Button variant="contained" startIcon={<SaveIcon />}
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
            sx={{ height: 38, background: saved ? '#22c55e' : undefined }}>
            {saved ? '✓ Saved!' : 'Save Changes'}
          </Button>
        }
      />

      <Card sx={{ borderRadius: '12px', p: 3, mb: 2.5 }}>
        <Typography sx={{ fontWeight: 600, color: '#e5e7eb', mb: 2 }}>Application Name</Typography>
        <TextField
          value={appName} onChange={(e) => setAppName(e.target.value)}
          fullWidth size="small" sx={{ maxWidth: 360 }}
        />
      </Card>

      <UploadZone label="Main Logo" subtitle="Shown in sidebar, dashboard, and auth pages" />
      <UploadZone label="Favicon" subtitle="Browser tab icon (Recommended: 32×32 or 64×64)" />
      <UploadZone label="Mobile Logo" subtitle="Optimized logo for mobile devices" />
    </AnimatedContainer>
  );
};
