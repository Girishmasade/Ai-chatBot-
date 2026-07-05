import { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, TextField, IconButton, Avatar, Chip,
  CircularProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as AIIcon,
  Add as AddIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { animate, stagger } from 'animejs';
import type { RootState } from '../../redux/store';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const mockConversations = [
  { id: '1', title: 'Generate a Python web scraper', time: '2m ago', active: true },
  { id: '2', title: 'Explain quantum computing', time: '1h ago', active: false },
  { id: '3', title: 'Write a marketing email', time: '3h ago', active: false },
  { id: '4', title: 'Debug my React component', time: 'Yesterday', active: false },
];

const TypingIndicator = () => {
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dotsRef.current) {
      animate(dotsRef.current.querySelectorAll('.dot'), {
        translateY: [-4, 0],
        delay: stagger(150),
        duration: 500,
        loop: true,
        ease: 'easeInOutSine',
        direction: 'alternate',
      });
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <Box sx={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <AIIcon sx={{ fontSize: 16, color: '#000' }} />
      </Box>
      <Box sx={{ background: '#1a1a1a', border: '1px solid #2d2d2d', borderRadius: '12px 12px 12px 4px', px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Box ref={dotsRef} sx={{ display: 'flex', gap: 0.75 }}>
          {[0, 1, 2].map(i => (
            <Box key={i} className="dot" sx={{ width: 7, height: 7, borderRadius: '50%', background: '#9ca3af' }} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export const ChatPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: `Hello ${user?.username || 'there'}! I'm GoChat AI, your intelligent assistant. How can I help you today?`, timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    await new Promise(r => setTimeout(r, 1500));
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'I received your message. This is a demo response — connect the backend `/api/v1/ai-request/execute` endpoint to get real AI responses powered by your configured providers.',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Conversation Sidebar */}
      <Box
        sx={{
          width: 260, background: '#111', borderRight: '1px solid #2d2d2d',
          display: 'flex', flexDirection: 'column', flexShrink: 0,
        }}
      >
        {/* Logo */}
        <Box sx={{ p: 2.5, borderBottom: '1px solid #2d2d2d', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#000' }}>G</Typography>
          </Box>
          <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>GoChat AI</Typography>
        </Box>

        {/* New chat */}
        <Box sx={{ p: 1.5 }}>
          <Box
            sx={{
              display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.25,
              border: '1px dashed #2d2d2d', borderRadius: '8px', cursor: 'pointer',
              color: '#9ca3af', transition: 'all 0.15s',
              '&:hover': { borderColor: '#f59e0b', color: '#f59e0b', background: 'rgba(245,158,11,0.05)' },
            }}
          >
            <AddIcon sx={{ fontSize: 16 }} />
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 500, color: 'inherit' }}>New conversation</Typography>
          </Box>
        </Box>

        {/* Conversation list */}
        <Box sx={{ flex: 1, overflowY: 'auto', px: 1.5, pb: 1 }}>
          <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, px: 1, mb: 0.75 }}>
            Recent
          </Typography>
          {mockConversations.map((conv, i) => (
            <motion.div key={conv.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
              <Box
                sx={{
                  px: 1.5, py: 1.25, borderRadius: '8px', cursor: 'pointer', mb: 0.5,
                  background: conv.active ? 'rgba(245,158,11,0.1)' : 'transparent',
                  border: conv.active ? '1px solid rgba(245,158,11,0.2)' : '1px solid transparent',
                  transition: 'all 0.15s',
                  '&:hover': { background: conv.active ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.04)' },
                }}
              >
                <Typography sx={{ fontSize: '0.82rem', color: conv.active ? '#f59e0b' : '#e5e7eb', fontWeight: conv.active ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {conv.title}
                </Typography>
                <Typography sx={{ fontSize: '0.72rem', color: '#6b7280', mt: 0.25 }}>{conv.time}</Typography>
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* User info */}
        <Box sx={{ p: 2, borderTop: '1px solid #2d2d2d', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 28, height: 28, background: 'linear-gradient(135deg,#f59e0b,#d97706)', fontSize: '0.72rem', fontWeight: 700, color: '#000' }}>
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </Avatar>
            <Typography sx={{ fontSize: '0.8rem', color: '#e5e7eb', fontWeight: 500 }}>
              {user?.username || 'User'}
            </Typography>
          </Box>
          {user?.role === 'admin' && (
            <IconButton size="small" onClick={() => navigate('/admin/dashboard')}
              sx={{ color: '#f59e0b', '&:hover': { background: 'rgba(245,158,11,0.1)' } }}
              title="Go to Admin Panel">
              <AdminIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Chat area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #2d2d2d', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AIIcon sx={{ fontSize: 18, color: '#000' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>GoChat AI</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
              <Typography sx={{ fontSize: '0.72rem', color: '#22c55e' }}>Online</Typography>
            </Box>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Chip label="GPT-4o" size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '6px' }} />
          </Box>
        </Box>

        {/* Messages */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column' }}>
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    mb: 2,
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32, height: 32, flexShrink: 0,
                      background: msg.role === 'assistant' ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
                      fontSize: '0.72rem',
                    }}
                  >
                    {msg.role === 'assistant' ? <AIIcon sx={{ fontSize: 16, color: '#000' }} /> : user?.username?.[0]?.toUpperCase() || 'U'}
                  </Avatar>
                  <Box
                    sx={{
                      maxWidth: '72%',
                      background: msg.role === 'assistant' ? '#1a1a1a' : 'linear-gradient(135deg,#f59e0b,#d97706)',
                      border: msg.role === 'assistant' ? '1px solid #2d2d2d' : 'none',
                      borderRadius: msg.role === 'assistant' ? '12px 12px 12px 4px' : '12px 12px 4px 12px',
                      px: 2, py: 1.5,
                    }}
                  >
                    <Typography sx={{ fontSize: '0.88rem', color: msg.role === 'assistant' ? '#e5e7eb' : '#000', lineHeight: 1.6, fontWeight: msg.role === 'user' ? 500 : 400 }}>
                      {msg.content}
                    </Typography>
                    <Typography sx={{ fontSize: '0.68rem', color: msg.role === 'assistant' ? '#6b7280' : 'rgba(0,0,0,0.5)', mt: 0.75, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box sx={{ p: 2.5, borderTop: '1px solid #2d2d2d' }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end', background: '#1a1a1a', border: '1px solid #2d2d2d', borderRadius: '12px', p: 1.5, transition: 'border-color 0.2s', '&:focus-within': { borderColor: '#f59e0b' } }}>
            <TextField
              multiline maxRows={6} fullWidth placeholder="Message GoChat AI..."
              value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
              variant="standard"
              slotProps={{
                input: { disableUnderline: true, style: { fontSize: '0.9rem', color: '#e5e7eb' } }
              }}
              sx={{ '& .MuiInputBase-root': { padding: 0 } }}
            />
            <IconButton
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              sx={{
                width: 38, height: 38, borderRadius: '8px', flexShrink: 0,
                background: input.trim() ? 'linear-gradient(135deg,#f59e0b,#d97706)' : '#2d2d2d',
                color: input.trim() ? '#000' : '#6b7280',
                transition: 'all 0.2s',
                '&:hover': { background: 'linear-gradient(135deg,#fbbf24,#f59e0b)' },
                '&:disabled': { background: '#2d2d2d', color: '#4b5563' },
              }}
            >
              {isTyping ? <CircularProgress size={16} sx={{ color: '#6b7280' }} /> : <SendIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          </Box>
          <Typography sx={{ fontSize: '0.7rem', color: '#4b5563', textAlign: 'center', mt: 1 }}>
            Press Enter to send · Shift+Enter for new line
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
