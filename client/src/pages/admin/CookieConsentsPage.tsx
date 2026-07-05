import {
  Box, Typography, Card, Table, TableHead, TableBody,
  TableRow, TableCell, Chip,
} from '@mui/material';
import { Cookie as CookieIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AnimatedContainer } from '../../components/common/AnimatedContainer';
import { PageHeader } from '../../components/common/PageHeader';

const mockConsents = [
  { user: 'Girish Masade22', email: 'grishmasade22@gmail.com', status: 'Accepted', acceptedOn: '04/7/2026, 16:20:57' },
  { user: 'devCoder', email: 'devcodem13@gmail.com', status: 'Accepted', acceptedOn: '04/7/2026, 16:02:23' },
];

export const CookieConsentsPage = () => {
  return (
    <AnimatedContainer>
      <PageHeader title="Cookie Consents" subtitle="Users who have accepted the cookie policy." />

      {/* Total counter card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card sx={{ borderRadius: '12px', p: 2.5, mb: 3, display: 'inline-flex', alignItems: 'center', gap: 2, minWidth: 200 }}>
          <Box sx={{
            width: 44, height: 44, borderRadius: '10px',
            background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CookieIcon sx={{ fontSize: 22, color: '#f59e0b' }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
              {mockConsents.length}
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Total Accepted
            </Typography>
          </Box>
        </Card>
      </motion.div>

      {/* Consents table */}
      <Card sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              {['User', 'Email', 'Status', 'Accepted On'].map(h => (
                <TableCell key={h}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {mockConsents.map((c, i) => (
              <TableRow
                key={i}
                component={motion.tr}
                // @ts-expect-error - motion component props
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' } }}
              >
                <TableCell>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#e5e7eb' }}>{c.user}</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: '0.82rem', color: '#9ca3af' }}>{c.email}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={`✓ ${c.status}`} size="small"
                    sx={{
                      height: 22, fontSize: '0.7rem', fontWeight: 600,
                      background: 'rgba(34,197,94,0.12)',
                      color: '#22c55e',
                      border: '1px solid rgba(34,197,94,0.3)',
                      borderRadius: '6px',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: '0.8rem', color: '#9ca3af' }}>{c.acceptedOn}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </AnimatedContainer>
  );
};
