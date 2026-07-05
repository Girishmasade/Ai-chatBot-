import { useState } from 'react';
import {
  Box, Typography, Card, Button, TextField, Grid,
} from '@mui/material';
import { Save as SaveIcon, Menu as MenuIcon, Add as AddIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AnimatedContainer } from '@/components/common/AnimatedContainer';
import { PageHeader } from '@/components/common/PageHeader';

const defaultItems = [
  { label: 'Home', url: '/', order: 1, isActive: true },
  { label: 'Features', url: '#features', order: 2, isActive: true },
  { label: 'Pricing', url: '#pricing', order: 3, isActive: true },
  { label: 'About', url: '#about', order: 4, isActive: true },
  { label: 'Contact', url: '#contact', order: 5, isActive: true },
];

export const MenuManagementPage = () => {
  const [items, setItems] = useState(defaultItems);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AnimatedContainer>
      <PageHeader
        title="Menu Management"
        subtitle="Configure the navigation menu items."
        actions={
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} sx={{ height: 38, background: saved ? '#22c55e' : undefined }}>
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: '12px', p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MenuIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                </Box>
                <Typography sx={{ fontWeight: 600, color: '#fff' }}>Navigation Items</Typography>
              </Box>
              <Button size="small" startIcon={<AddIcon sx={{ fontSize: 14 }} />} variant="outlined"
                onClick={() => setItems(prev => [...prev, { label: 'New Item', url: '/', order: prev.length + 1, isActive: true }])}
                sx={{ height: 32, borderColor: '#2d2d2d', color: '#9ca3af', fontSize: '0.78rem', '&:hover': { borderColor: '#f59e0b', color: '#f59e0b' } }}>
                Add Item
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Box sx={{
                    display: 'flex', gap: 1.5, alignItems: 'center',
                    background: '#111', border: '1px solid #2d2d2d',
                    borderRadius: '8px', p: 1.5,
                  }}>
                    <Typography sx={{ width: 20, color: '#6b7280', fontSize: '0.78rem', flexShrink: 0 }}>{i + 1}</Typography>
                    <TextField size="small" value={item.label}
                      onChange={(e) => setItems(prev => prev.map((it, idx) => idx === i ? { ...it, label: e.target.value } : it))}
                      sx={{ flex: 1 }} inputProps={{ style: { fontSize: '0.85rem' } }} />
                    <TextField size="small" value={item.url}
                      onChange={(e) => setItems(prev => prev.map((it, idx) => idx === i ? { ...it, url: e.target.value } : it))}
                      sx={{ flex: 1 }} inputProps={{ style: { fontSize: '0.85rem' } }} />
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: '12px', p: 3 }}>
            <Typography sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>Preview</Typography>
            <Box sx={{ background: '#0a0a0a', borderRadius: '8px', p: 2, border: '1px solid #2d2d2d' }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {items.filter(i => i.isActive).map((item, i) => (
                  <Typography key={i} sx={{
                    fontSize: '0.82rem', color: '#9ca3af', cursor: 'pointer',
                    '&:hover': { color: '#f59e0b' }, transition: 'color 0.15s',
                  }}>
                    {item.label}
                  </Typography>
                ))}
              </Box>
            </Box>
            <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', mt: 1.5 }}>
              Live preview of how the navigation will appear
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </AnimatedContainer>
  );
};
