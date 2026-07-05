import { useState } from 'react';
import {
  Box, Typography, Card, Avatar, Chip, TextField, InputAdornment,
  Select, MenuItem, FormControl, Table, TableHead, TableBody,
  TableRow, TableCell, IconButton, Pagination,
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon, MoreVert as MoreIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AnimatedContainer } from '../../components/common/AnimatedContainer';
import { PageHeader } from '../../components/common/PageHeader';

const mockUsers = [
  { _id: '1', username: 'Girish Masade22', email: 'grishmasade22@gmail.com', role: 'user', isVerified: true, createdAt: '04/07/2026', avatar: '', status: 'active' },
  { _id: '2', username: 'devCoder', email: 'devcodem13@gmail.com', role: 'admin', isVerified: true, createdAt: '04/07/2026', avatar: '', status: 'active' },
  { _id: '3', username: 'aibuilder99', email: 'ai@example.com', role: 'user', isVerified: false, createdAt: '05/07/2026', avatar: '', status: 'inactive' },
  { _id: '4', username: 'techwriter', email: 'tech@example.com', role: 'user', isVerified: true, createdAt: '01/07/2026', avatar: '', status: 'active' },
];

export const UsersPage = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = mockUsers.filter(u => {
    const matchSearch = u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <AnimatedContainer>
      <PageHeader title="Users" subtitle="Manage registered platform users." />

      <Card sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        {/* Filters */}
        <Box sx={{ px: 3, py: 2, display: 'flex', gap: 2, borderBottom: '1px solid #2d2d2d', flexWrap: 'wrap' }}>
          <TextField
            size="small" placeholder="Search users..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#6b7280' }} /></InputAdornment> }
            }}
            sx={{ minWidth: 240 }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} displayEmpty
              startAdornment={<FilterIcon sx={{ fontSize: 16, color: '#6b7280', mr: 0.5 }} />}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2d2d2d' } }}
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              {['User', 'Email', 'Role', 'Status', 'Verified', 'Joined'].map(h => (
                <TableCell key={h}>{h}</TableCell>
              ))}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((user, i) => (
              <TableRow
                key={user._id}
                component={motion.tr}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' } }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 34, height: 34, background: 'linear-gradient(135deg,#f59e0b,#d97706)', fontSize: '0.8rem', fontWeight: 700, color: '#000' }}>
                      {user.username[0].toUpperCase()}
                    </Avatar>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#e5e7eb' }}>
                      {user.username}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: '0.82rem', color: '#9ca3af' }}>{user.email}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    size="small"
                    sx={{
                      height: 22, fontSize: '0.7rem', fontWeight: 600,
                      background: user.role === 'admin' ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)',
                      color: user.role === 'admin' ? '#f59e0b' : '#3b82f6',
                      border: `1px solid ${user.role === 'admin' ? 'rgba(245,158,11,0.3)' : 'rgba(59,130,246,0.3)'}`,
                      borderRadius: '6px',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: user.status === 'active' ? '#22c55e' : '#6b7280' }} />
                    <Typography sx={{ fontSize: '0.8rem', color: user.status === 'active' ? '#22c55e' : '#6b7280', textTransform: 'capitalize' }}>
                      {user.status}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.isVerified ? 'Verified' : 'Unverified'} size="small"
                    sx={{
                      height: 22, fontSize: '0.7rem',
                      background: user.isVerified ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                      color: user.isVerified ? '#22c55e' : '#ef4444',
                      border: `1px solid ${user.isVerified ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                      borderRadius: '6px',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: '0.8rem', color: '#9ca3af' }}>{user.createdAt}</Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" sx={{ color: '#6b7280', '&:hover': { color: '#f59e0b' } }}>
                    <MoreIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #2d2d2d' }}>
          <Typography sx={{ fontSize: '0.8rem', color: '#9ca3af' }}>
            Showing {filtered.length} of {mockUsers.length} users
          </Typography>
          <Pagination count={3} size="small" sx={{ '& .MuiPaginationItem-root': { color: '#9ca3af', borderColor: '#2d2d2d' }, '& .Mui-selected': { background: 'rgba(245,158,11,0.2)', color: '#f59e0b', borderColor: 'rgba(245,158,11,0.4)' } }} />
        </Box>
      </Card>
    </AnimatedContainer>
  );
};
