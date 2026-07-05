import { useState } from 'react';
import {
  Box, Typography, Card, Button, TextField, Grid,
} from '@mui/material';
import { Save as SaveIcon, Article as FooterIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AnimatedContainer } from '@/components/common/AnimatedContainer';
import { PageHeader } from '@/components/common/PageHeader';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
    <Card sx={{ borderRadius: '12px', p: 3, mb: 2.5 }}>
      <Typography sx={{ fontWeight: 600, color: '#e5e7eb', mb: 2.5, fontSize: '0.95rem' }}>{title}</Typography>
      {children}
    </Card>
  </motion.div>
);

const Field = ({ label, defaultValue, placeholder, multiline }: { label: string; defaultValue?: string; placeholder?: string; multiline?: boolean }) => (
  <Box>
    <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af', mb: 0.75, fontWeight: 500 }}>{label}</Typography>
    <TextField fullWidth size="small" defaultValue={defaultValue} placeholder={placeholder} multiline={multiline} rows={multiline ? 3 : undefined} />
  </Box>
);

export const FooterCMSPage = () => {
  const [saved, setSaved] = useState(false);

  return (
    <AnimatedContainer>
      <PageHeader
        title="Footer Management"
        subtitle="Manage your site footer content."
        actions={
          <Button variant="contained" startIcon={<SaveIcon />} onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
            sx={{ height: 38, background: saved ? '#22c55e' : undefined }}>
            {saved ? '✓ Saved!' : 'Save Changes'}
          </Button>
        }
      />

      <Section title="Company Details">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><Field label="Company Name" defaultValue="GoChat AI" /></Grid>
          <Grid item xs={12} sm={6}><Field label="Email" defaultValue="hello@gochat.ai" /></Grid>
          <Grid item xs={12} sm={6}><Field label="Phone" placeholder="+1 (555) 000-0000" /></Grid>
          <Grid item xs={12} sm={6}><Field label="Address" defaultValue="San Francisco, CA" /></Grid>
          <Grid item xs={12}>
            <Field label="Description" defaultValue="Next-generation AI platform for chat, image, video, and asset generation. Built for creators and enterprises." multiline />
          </Grid>
        </Grid>
      </Section>

      <Section title="Newsletter">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><Field label="Title" defaultValue="Stay Updated" /></Grid>
          <Grid item xs={12} sm={6}><Field label="Subtitle" defaultValue="Get the latest AI features and updates." /></Grid>
        </Grid>
      </Section>

      <Section title="Social Links">
        <Grid container spacing={2}>
          {[
            { label: 'Facebook', placeholder: 'https://facebook.com/...' },
            { label: 'LinkedIn', defaultValue: 'https://linkedin.com/company/gochatai' },
            { label: 'X / Twitter', defaultValue: 'https://x.com/gochatai' },
            { label: 'GitHub', defaultValue: 'https://github.com/gochatai' },
            { label: 'Instagram', placeholder: 'https://instagram.com/...' },
            { label: 'YouTube', placeholder: 'https://youtube.com/...' },
          ].map(({ label, defaultValue, placeholder }) => (
            <Grid item xs={12} sm={6} key={label}>
              <Field label={label} defaultValue={defaultValue} placeholder={placeholder} />
            </Grid>
          ))}
        </Grid>
      </Section>

      <Section title="Footer Links">
        <Grid container spacing={2}>
          {[
            { label: 'Privacy Policy URL', defaultValue: '#privacy' },
            { label: 'Terms of Service URL', defaultValue: '#terms' },
            { label: 'Contact URL', defaultValue: '#contact' },
            { label: 'About URL', defaultValue: '#about' },
          ].map(({ label, defaultValue }) => (
            <Grid item xs={12} sm={6} key={label}>
              <Field label={label} defaultValue={defaultValue} />
            </Grid>
          ))}
        </Grid>
      </Section>
    </AnimatedContainer>
  );
};
