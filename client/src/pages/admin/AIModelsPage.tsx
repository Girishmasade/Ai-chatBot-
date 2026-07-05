import { useState } from 'react';
import {
  Box, Typography, Card, Button, Chip, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import { Add as AddIcon, SmartToy as AIIcon, Speed as SpeedIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AnimatedContainer } from '@/components/common/AnimatedContainer';
import { PageHeader } from '@/components/common/PageHeader';

const mockModels = [
  { id: '1', name: 'GPT-4o', provider: 'OpenAI', service: 'CHAT', status: 'active', costPer1k: 0.03, maxTokens: 128000 },
  { id: '2', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', service: 'CHAT', status: 'active', costPer1k: 0.015, maxTokens: 200000 },
  { id: '3', name: 'Gemini 1.5 Pro', provider: 'Google', service: 'CHAT', status: 'active', costPer1k: 0.0035, maxTokens: 1000000 },
  { id: '4', name: 'DALL-E 3', provider: 'OpenAI', service: 'IMAGE', status: 'active', costPer1k: 0.04, maxTokens: 4096 },
  { id: '5', name: 'Llama 3.1 70B', provider: 'Meta', service: 'CHAT', status: 'inactive', costPer1k: 0.0009, maxTokens: 32000 },
  { id: '6', name: 'Whisper v3', provider: 'OpenAI', service: 'AUDIO', status: 'active', costPer1k: 0.006, maxTokens: 25000 },
];

const providerColors: Record<string, string> = {
  OpenAI: '#22c55e',
  Anthropic: '#f59e0b',
  Google: '#3b82f6',
  Meta: '#8b5cf6',
};

const serviceColors: Record<string, string> = {
  CHAT: '#3b82f6',
  IMAGE: '#ec4899',
  AUDIO: '#8b5cf6',
};

export const AIModelsPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <AnimatedContainer>
      <PageHeader
        title="AI Models"
        subtitle="Configure AI providers and available models."
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ height: 38 }}>
            Add Model
          </Button>
        }
      />

      <Grid container spacing={2}>
        {mockModels.map((model, i) => {
          const color = providerColors[model.provider] || '#9ca3af';
          return (
            <Grid item xs={12} sm={6} lg={4} key={model.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #2d2d2d', height: '100%',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  '&:hover': { borderColor: `${color}44`, boxShadow: `0 8px 32px ${color}18` },
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: `${color}1a`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                        <AIIcon sx={{ fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{model.name}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af' }}>{model.provider}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: model.status === 'active' ? '#22c55e' : '#6b7280' }} />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip label={model.service} size="small" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 600,
                      background: `${serviceColors[model.service] || '#9ca3af'}1a`,
                      color: serviceColors[model.service] || '#9ca3af',
                      border: `1px solid ${serviceColors[model.service] || '#9ca3af'}33`, borderRadius: '5px' }} />
                    <Chip label={model.provider} size="small" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 600,
                      background: `${color}1a`, color, border: `1px solid ${color}33`, borderRadius: '5px' }} />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <SpeedIcon sx={{ fontSize: 14, color: '#6b7280' }} />
                      <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        {(model.maxTokens / 1000).toFixed(0)}K ctx
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      ${model.costPer1k}/1K tokens
                    </Typography>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { background: '#1a1a1a', border: '1px solid #2d2d2d', borderRadius: '14px' } }}>
        <DialogTitle sx={{ color: '#fff' }}>Add AI Model</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField label="Model Name" placeholder="e.g. GPT-4o" fullWidth size="small" />
            <FormControl size="small" fullWidth>
              <InputLabel>Service Type</InputLabel>
              <Select label="Service Type" defaultValue="CHAT">
                {['CHAT', 'IMAGE', 'AUDIO', 'VIDEO'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Provider" placeholder="e.g. OpenAI" fullWidth size="small" />
            <TextField label="Cost per 1K tokens (USD)" placeholder="0.03" fullWidth size="small" />
            <TextField label="Max Context (tokens)" placeholder="128000" fullWidth size="small" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setOpen(false)} variant="outlined" sx={{ borderColor: '#2d2d2d', color: '#9ca3af' }}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpen(false)}>Add Model</Button>
        </DialogActions>
      </Dialog>
    </AnimatedContainer>
  );
};
