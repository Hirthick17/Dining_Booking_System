import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  IconButton,
  TextField,
  Typography,
  Avatar,
  CircularProgress,
  Chip,
  Button
} from '@mui/material';
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  SmartToy as BotIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import axios from 'axios';

const ChatbotPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL || 'https://dining-booking-system.vercel.app/api';

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat session
  useEffect(() => {
    const initSession = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.post(
            `${API_URL}/ai/start-session`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setSessionId(res.data.data.sessionId);
          setMessages([
            {
              role: 'assistant',
              content: res.data.data.welcomeMessage,
              timestamp: new Date().toISOString()
            }
          ]);
        } else {
          // Guest mode
          setMessages([
            {
              role: 'assistant',
              content: "Welcome to the DineAI Pro interface. I have access to real-time availability and deep culinary knowledge. How can I assist you today?",
              timestamp: new Date().toISOString()
            }
          ]);
        }
      } catch (error) {
        console.error('Error starting session:', error);
        setMessages([
          {
            role: 'assistant',
            content: "Welcome to the DineAI Pro interface. I have access to real-time availability and deep culinary knowledge. How can I assist you today?",
            timestamp: new Date().toISOString()
          }
        ]);
      }
    };

    initSession();
  }, [API_URL]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(
        `${API_URL}/ai/chat`,
        {
          query: input,
          sessionId: sessionId
        },
        { headers }
      );

      const assistantMessage = {
        role: 'assistant',
        content: res.data.data.answer,
        timestamp: res.data.data.timestamp
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick suggestion chips
  const suggestions = [
    "TABLE FOR 2 TONIGHT",
    "BEST PASTA IN TOWN",
    "QUIET SPOT FOR WORK"
  ];

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        pt: 2,
        pb: 2
      }}
    >
      <Container maxWidth="md" sx={{ height: 'calc(100vh - 100px)' }}>
        <Paper
          elevation={4}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #E23744 0%, #F97316 100%)',
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <IconButton onClick={() => navigate('/')} sx={{ color: 'white' }}>
              <ArrowBackIcon />
            </IconButton>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                bgcolor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box
                component="img"
                src="/logo.png"
                alt="DineAI"
                sx={{
                  width: 32,
                  height: 32
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="#F97316"><path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/></svg>';
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                DineAI
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Your AI Dining Companion
              </Typography>
            </Box>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 3,
              bgcolor: '#fafafa',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  gap: 1.5
                }}
              >
                {msg.role === 'assistant' && (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: '#F97316',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <BotIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                )}
                <Box sx={{ maxWidth: '70%' }}>
                  {msg.role === 'assistant' && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mb: 0.5, display: 'block' }}>
                      DineAI Assistant
                    </Typography>
                  )}
                  <Paper
                    elevation={msg.role === 'user' ? 0 : 1}
                    sx={{
                      p: 2,
                      bgcolor: msg.role === 'user' ? '#E23744' : 'white',
                      color: msg.role === 'user' ? 'white' : 'text.primary',
                      borderRadius: 2,
                      borderTopRightRadius: msg.role === 'user' ? 4 : 2,
                      borderTopLeftRadius: msg.role === 'assistant' ? 4 : 2
                    }}
                  >
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                      {msg.content}
                    </Typography>
                  </Paper>
                  {msg.role === 'assistant' && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mt: 0.5, display: 'block' }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  )}
                </Box>
                {msg.role === 'user' && (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: '#F97316',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <PersonIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                )}
              </Box>
            ))}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: '#F97316',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <BotIcon sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                  <CircularProgress size={24} sx={{ color: '#F97316' }} />
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Quick Suggestions */}
          {messages.length <= 1 && (
            <Box sx={{ px: 3, py: 2, bgcolor: 'white', borderTop: '1px solid #e0e0e0' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
                Quick suggestions:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {suggestions.map((suggestion, index) => (
                  <Chip
                    key={index}
                    label={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{
                      bgcolor: 'rgba(249, 115, 22, 0.1)',
                      color: '#F97316',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      letterSpacing: 0.5,
                      '&:hover': {
                        bgcolor: 'rgba(249, 115, 22, 0.2)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Input */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'white',
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              gap: 1
            }}
          >
            <TextField
              fullWidth
              placeholder="Ask me to find anything or make a reservation..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '&.Mui-focused fieldset': {
                    borderColor: '#F97316'
                  }
                }
              }}
            />
            <IconButton
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              sx={{
                bgcolor: '#F97316',
                color: 'white',
                width: 56,
                height: 56,
                '&:hover': {
                  bgcolor: '#E86D0F'
                },
                '&:disabled': {
                  bgcolor: '#e0e0e0'
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ChatbotPage;
