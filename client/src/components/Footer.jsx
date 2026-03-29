import React, { useState } from 'react';
import { Box, Container, Grid, Typography, TextField, Button, Link, IconButton } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle subscription logic
    console.log('Subscribe:', email);
    setEmail('');
  };

  return (
    <Box sx={{ bgcolor: '#1a1a2e', color: 'white', pt: 6, pb: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Branding */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box 
                sx={{ 
                  bgcolor: '#F97316', 
                  borderRadius: 1, 
                  p: 0.5, 
                  display: 'flex',
                  mr: 1
                }}
              >
                <RestaurantIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Typography variant="h6" fontWeight={700}>
                DineAI
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.7 }}>
              Revolutionizing how you discover and book culinary experiences through the power of artificial intelligence.
            </Typography>
          </Grid>

          {/* Company */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/about" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
                About Us
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
                Careers
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
                Contact
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
                Newsroom
              </Link>
            </Box>
          </Grid>

          {/* Legal */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
                Terms of Service
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
                Privacy Policy
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
                Cookie Policy
              </Link>
            </Box>
          </Grid>

          {/* Subscribe */}
          <Grid item xs={12} md={5}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Subscribe
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
              Get the latest dining deals and AI updates.
            </Typography>
            <Box component="form" onSubmit={handleSubscribe} sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  flexGrow: 1,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                  },
                }}
              />
              <Button 
                type="submit"
                variant="contained" 
                sx={{ 
                  bgcolor: '#F97316',
                  '&:hover': { bgcolor: '#E86D0F' },
                  px: 3
                }}
              >
                Join
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box sx={{ 
          borderTop: '1px solid rgba(255,255,255,0.1)', 
          mt: 4, 
          pt: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            © 2024 DineAI. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small" sx={{ color: 'white', opacity: 0.6, '&:hover': { opacity: 1 } }}>
              <TwitterIcon />
            </IconButton>
            <IconButton size="small" sx={{ color: 'white', opacity: 0.6, '&:hover': { opacity: 1 } }}>
              <InstagramIcon />
            </IconButton>
            <IconButton size="small" sx={{ color: 'white', opacity: 0.6, '&:hover': { opacity: 1 } }}>
              <LinkedInIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
