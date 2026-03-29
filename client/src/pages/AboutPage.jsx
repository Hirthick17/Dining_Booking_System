import React from 'react';
import { Container, Grid, Box, Typography, Paper, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import GroupsIcon from '@mui/icons-material/Groups';
import StarIcon from '@mui/icons-material/Star';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: '#FAFAF9', minHeight: '100vh', py: 6 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #E23744 0%, #F97316 100%)',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" fontWeight={700} gutterBottom>
            About Dinoman
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.95 }}>
            Your trusted partner for restaurant reservations
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Mission Section */}
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: '#E23744' }}>
            Our Mission
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
            At Dinoman, we're passionate about connecting food lovers with exceptional dining experiences. 
            Our platform makes it easy to discover, book, and enjoy the best restaurants in your city. 
            We believe that great food brings people together, and we're here to make every meal memorable.
          </Typography>
        </Paper>

        {/* How It Works */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
            How It Works
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', borderRadius: 3, textAlign: 'center', p: 2 }}>
                <Box sx={{ color: '#F97316', mb: 2 }}>
                  <RestaurantIcon sx={{ fontSize: 64 }} />
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  1. Discover
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Browse through our curated selection of restaurants. Filter by cuisine, location, and ratings to find your perfect match.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', borderRadius: 3, textAlign: 'center', p: 2 }}>
                <Box sx={{ color: '#E23744', mb: 2 }}>
                  <GroupsIcon sx={{ fontSize: 64 }} />
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  2. Book
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Select your preferred date, time, and party size. Our real-time availability system ensures instant confirmation.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', borderRadius: 3, textAlign: 'center', p: 2 }}>
                <Box sx={{ color: '#F97316', mb: 2 }}>
                  <StarIcon sx={{ fontSize: 64 }} />
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  3. Enjoy
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Show up and enjoy your meal! Manage your bookings easily through your dashboard and leave reviews to help others.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Why Choose Us */}
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: '#E23744', mb: 3 }}>
            Why Choose Dinoman?
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <StarIcon sx={{ color: '#F97316', mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>Curated Selection</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Only the best restaurants make it to our platform
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <StarIcon sx={{ color: '#F97316', mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>Instant Confirmation</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Real-time availability and immediate booking confirmation
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <StarIcon sx={{ color: '#F97316', mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>Easy Management</Typography>
                  <Typography variant="body2" color="text.secondary">
                    View, modify, or cancel your bookings anytime
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <StarIcon sx={{ color: '#F97316', mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>Exclusive Deals</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Access special offers and promotions from partner restaurants
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Contact Section */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 100%)' }}>
          <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: '#E23744', mb: 3 }}>
            Get In Touch
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ color: '#F97316', fontSize: 32, mr: 2 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Phone</Typography>
                  <Typography variant="body1" fontWeight={600}>+1 (555) 123-4567</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ color: '#F97316', fontSize: 32, mr: 2 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body1" fontWeight={600}>support@dinoman.com</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon sx={{ color: '#F97316', fontSize: 32, mr: 2 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Location</Typography>
                  <Typography variant="body1" fontWeight={600}>Mumbai, India</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutPage;
