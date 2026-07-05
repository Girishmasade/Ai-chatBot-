import { useState } from 'react';
import {
  Box, Typography, Card, TextField, InputAdornment,
  Select, MenuItem, FormControl, Table, TableHead,
  TableBody, TableRow, TableCell, Chip,
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AnimatedContainer } from '../../components/common/AnimatedContainer';
import { PageHeader } from '../../components/common/PageHeader';

const mockLogs = [
  { action: 'Admin Login', description: 'Logged in from dashboard', type: 'auth', admin: 'System Admin', ip: '—', status: 'success', date: '07/06/2026, 17:12:56' },
  { action: 'Subscription Plan Created', description: 'Created Pro plan', type: 'subscription', admin: 'System Admin', ip: '—', status: 'success', date: '07/06/2026, 17:12:56' },
  { action: 'AI Model Added', description: 'Added GPT-4o model', type: 'model', admin: 'System Admin', ip: '—', status: 'success', date: '07/06/2026, 17:12:56' },
  { action: 'Footer Settings Updated', description: 'Updated company information', type: 'footer', admin: 'System Admin', ip: '—', status: 'success', date: '07/06/2026, 17:12:56' },
  { action: 'User Role Updated', description: 'Promoted user to admin', type: 'auth', admin: 'System Admin', ip: '192.168.1.1', status: 'success', date: '07/06/2026, 16:45:20' },
  { action: 'Token Package Deleted', description: 'Deleted Basic package', type: 'token', admin: 'System Admin', ip: '—', status: 'failed', date: '07/06/2026, 15:30:10' },
];

const typeColors: Record<string, string> = {
  auth: '#3b82f6',
  subscription: '#f59e0b',
  model: '#8b5cf6',
  footer: '#22c55e',
  token: '#ec4899',
};

export const AuditLogsPage = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = mockLogs.filter(l => {
    const matchSearch = l.action.toLowerCase().includes(search.toLowerCase()) || l.description.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || l.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <AnimatedContainer>
      <PageHeader title="Audit Logs" subtitle="Track all administrative actions." />

      <Card sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        {/* Filters */}
        <Box sx={{ px: 3, py: 2, display: 'flex', gap: 2, borderBottom: '1px solid #2d2d2d', flexWrap: 'wrap' }}>
          <TextField
            size="small" placeholder="Search logs..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#6b7280' }} /></InputAdornment> }
            }}
            sx={{ minWidth: 220 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
              startAdornment={<FilterIcon sx={{ fontSize: 16, color: '#6b7280', mr: 0.5 }} />}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2d2d2d' } }}
            >
              <MenuItem value="all">All Types</MenuItem>
              {Object.keys(typeColors).map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              {['Action', 'Type', 'Admin', 'IP Address', 'Status', 'Date'].map(h => (
                <TableCell key={h}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((log, i) => (
              <TableRow
                key={i}
                component={motion.tr}
                // @ts-expect-error - motion component props
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' } }}
              >
                <TableCell>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#e5e7eb' }}>{log.action}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>{log.description}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={log.type} size="small"
                    sx={{
                      height: 20, fontSize: '0.68rem', fontWeight: 600, borderRadius: '5px',
                      background: `${typeColors[log.type] || '#9ca3af'}1a`,
                      color: typeColors[log.type] || '#9ca3af',
                      border: `1px solid ${typeColors[log.type] || '#9ca3af'}33`,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: '0.82rem', color: '#e5e7eb' }}>{log.admin}</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: '0.82rem', color: '#9ca3af' }}>{log.ip}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={log.status === 'success' ? '✓ success' : '✗ failed'} size="small"
                    sx={{
                      height: 22, fontSize: '0.7rem', fontWeight: 600, borderRadius: '99px',
                      background: log.status === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                      color: log.status === 'success' ? '#22c55e' : '#ef4444',
                      border: `1px solid ${log.status === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af' }}>{log.date}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </AnimatedContainer>
  );
};
