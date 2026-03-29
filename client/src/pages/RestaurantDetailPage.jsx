import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurant } from '../redux/slices/restaurantSlice';
import { createBooking, clearMessages } from '../redux/slices/bookingSlice';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  Typography,
  Box,
  TextField,
  Button,
  Chip,
  Rating,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  Divider,
  alpha
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

/**
 * Safely build guest name from user object without duplication
 */
const buildGuestName = (user) => {
  if (!user) return 'Guest';

  const first = (user.firstName || '').trim();
  const last = (user.lastName || '').trim();

  if (!first && !last) return user.name?.trim() || 'Guest';

  // Prevent duplication where firstName already contains full name
  if (first && last) {
    const firstLower = first.toLowerCase();
    const lastLower = last.toLowerCase();
    if (firstLower.includes(lastLower) || lastLower.includes(firstLower)) {
      return first.length >= last.length ? first : last;
    }
    return `${first} ${last}`;
  }

  return first || last || 'Guest';
};

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedRestaurant: restaurant, loading } = useSelector((state) => state.restaurants);
  const { loading: bookingLoading, successMessage, error } = useSelector((state) => state.bookings);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    partySize: 2,
    specialRequests: ''
  });

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchRestaurant(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (successMessage) {
      setShowSnackbar(true);
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormError('');
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!bookingData.date || !bookingData.time) {
      setFormError('Please select both date and time for your booking');
      return;
    }

    const selectedDateTime = new Date(`${bookingData.date}T${bookingData.time}`);
    if (selectedDateTime < new Date()) {
      setFormError('Please select a future date and time');
      return;
    }

    const partyNum = Number(bookingData.partySize);
    if (!partyNum || partyNum < 1 || partyNum > 20) {
      setFormError('Party size must be between 1 and 20');
      return;
    }

    const guestName = buildGuestName(user);
    const guestPhone = user?.phone || '';
    const guestEmail = user?.email || '';

    const payload = {
      restaurantId: restaurant._id,
      bookingDate: selectedDateTime.toISOString(),
      bookingTime: bookingData.time,
      partySize: partyNum,
      specialRequests: bookingData.specialRequests || '',
      guestName,
      guestPhone,
      guestEmail
    };

    console.log('📦 [BOOKING] Payload:', payload);
    dispatch(createBooking(payload));
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    dispatch(clearMessages());
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#E23744' }} size={60} />
      </Box>
    );
  }

  if (!restaurant) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <RestaurantMenuIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary">
            Restaurant not found
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ mt: 3, background: 'linear-gradient(135deg, #E23744 0%, #F97316 100%)' }}
          >
            Back to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  const primaryImage =
    restaurant.images?.find((img) => img.isPrimary)?.url ||
    restaurant.images?.[0]?.url ||
    restaurant.images?.[0] ||
    'https://via.placeholder.com/1200x450?text=No+Image';

  const cuisines = restaurant.cuisineTypes || restaurant.cuisine || [];
  const avgRating = restaurant.rating?.average || restaurant.averageRating || 0;
  const reviewCount = restaurant.rating?.count || restaurant.totalReviews || 0;
  const phone = restaurant.phone || restaurant.contactInfo?.phone || 'N/A';
  const email = restaurant.email || restaurant.contactInfo?.email || 'N/A';
  const address = restaurant.location?.address || '';
  const city = restaurant.location?.city || '';
  const state = restaurant.location?.state || '';

  const formatOperatingHours = () => {
    const hours = restaurant.operatingHours;
    if (!hours || !Array.isArray(hours) || hours.length === 0) return null;

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Handle array of objects with dayOfWeek number
    if (typeof hours[0].dayOfWeek === 'number') {
      return hours.map((h) => ({
        day: dayNames[h.dayOfWeek] || `Day ${h.dayOfWeek}`,
        display: h.isOpen
          ? h.shifts?.map((s) => `${s.openTime} - ${s.closeTime}`).join(', ') || 'Open'
          : 'Closed'
      }));
    }

    // Handle object keyed by day name
    if (!Array.isArray(hours)) {
      return Object.entries(hours).map(([day, val]) => ({
        day: day.charAt(0).toUpperCase() + day.slice(1),
        display: val?.isClosed ? 'Closed' : `${val?.opens || val?.open || 'N/A'} - ${val?.closes || val?.close || 'N/A'}`
      }));
    }

    // Handle array with day string
    return hours.map((h) => ({
      day: (h.day || '').charAt(0).toUpperCase() + (h.day || '').slice(1),
      display: h.isOpen !== false
        ? `${h.open || h.openTime || 'N/A'} - ${h.close || h.closeTime || 'N/A'}`
        : 'Closed'
    }));
  };

  const formattedHours = formatOperatingHours();

  return (
    <Box sx={{ bgcolor: '#FAFAF9', pb: 6 }}>
      {/* Hero Image */}
      <Box sx={{ position: 'relative', height: { xs: '300px', md: '450px' }, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          image={primaryImage}
          alt={restaurant.name || 'Restaurant'}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
            p: 4
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              sx={{ color: 'white', fontWeight: 700, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
            >
              {restaurant.name || 'Restaurant'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Rating value={avgRating} precision={0.5} readOnly sx={{ color: '#F97316' }} />
              <Typography variant="h6" sx={{ color: 'white', ml: 1 }}>
                {avgRating} ({reviewCount} reviews)
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={7}>
            {/* Cuisine Tags */}
            {cuisines.length > 0 && (
              <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {cuisines.map((cuisine) => (
                    <Chip
                      key={cuisine}
                      label={cuisine}
                      sx={{
                        bgcolor: alpha('#E23744', 0.1),
                        color: '#E23744',
                        fontWeight: 600,
                        fontSize: '0.9rem'
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            )}

            {/* Description */}
            <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight={600} sx={{ color: '#E23744' }}>
                About
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {restaurant.description || 'No description available.'}
              </Typography>
            </Paper>

            {/* Contact Information */}
            <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight={600} sx={{ color: '#E23744', mb: 2 }}>
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      bgcolor: alpha('#F97316', 0.05),
                      borderRadius: 2
                    }}
                  >
                    <LocationOnIcon sx={{ color: '#F97316', mr: 2, fontSize: 28 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Address
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {[address, city, state].filter(Boolean).join(', ') || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      bgcolor: alpha('#E23744', 0.05),
                      borderRadius: 2
                    }}
                  >
                    <PhoneIcon sx={{ color: '#E23744', mr: 2, fontSize: 28 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {phone}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      bgcolor: alpha('#E23744', 0.05),
                      borderRadius: 2
                    }}
                  >
                    <EmailIcon sx={{ color: '#E23744', mr: 2, fontSize: 28 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Operating Hours */}
            {formattedHours && formattedHours.length > 0 && (
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight={600} sx={{ color: '#E23744', mb: 2 }}>
                  <AccessTimeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Operating Hours
                </Typography>
                <Grid container spacing={1}>
                  {formattedHours.map((h, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          p: 1.5,
                          bgcolor: alpha('#F97316', 0.05),
                          borderRadius: 1
                        }}
                      >
                        <Typography variant="body2" fontWeight={600}>
                          {h.day}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {h.display}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}
          </Grid>

          {/* Booking Form Sidebar */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={6}
              sx={{
                p: 4,
                position: 'sticky',
                top: 100,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 100%)',
                border: '2px solid',
                borderColor: alpha('#E23744', 0.2)
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" gutterBottom fontWeight={700} sx={{ color: '#E23744' }}>
                  Reserve a Table
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Book your dining experience now
                </Typography>
              </Box>

              {(error || formError) && (
                <Alert
                  severity="error"
                  sx={{ mb: 2, borderRadius: 2 }}
                  onClose={() => {
                    setFormError('');
                    dispatch(clearMessages());
                  }}
                >
                  {formError || error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  name="date"
                  value={bookingData.date}
                  onChange={handleChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: getTodayDate() }}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#E23744' },
                      '&.Mui-focused fieldset': { borderColor: '#E23744' }
                    }
                  }}
                  InputProps={{
                    startAdornment: <EventIcon sx={{ mr: 1, color: '#F97316' }} />
                  }}
                />
                <TextField
                  fullWidth
                  type="time"
                  label="Time"
                  name="time"
                  value={bookingData.time}
                  onChange={handleChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#E23744' },
                      '&.Mui-focused fieldset': { borderColor: '#E23744' }
                    }
                  }}
                  InputProps={{
                    startAdornment: <AccessTimeIcon sx={{ mr: 1, color: '#F97316' }} />
                  }}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Party Size"
                  name="partySize"
                  value={bookingData.partySize}
                  onChange={handleChange}
                  margin="normal"
                  inputProps={{ min: 1, max: 20 }}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#E23744' },
                      '&.Mui-focused fieldset': { borderColor: '#E23744' }
                    }
                  }}
                  InputProps={{
                    startAdornment: <PeopleIcon sx={{ mr: 1, color: '#F97316' }} />
                  }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Special Requests (Optional)"
                  name="specialRequests"
                  value={bookingData.specialRequests}
                  onChange={handleChange}
                  margin="normal"
                  placeholder="Any dietary restrictions, special occasions, etc."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#E23744' },
                      '&.Mui-focused fieldset': { borderColor: '#E23744' }
                    }
                  }}
                />
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 3,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #E23744 0%, #F97316 100%)',
                    borderRadius: 2,
                    boxShadow: '0 4px 14px rgba(226, 55, 68, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #CC1F2D 0%, #EA580C 100%)',
                      boxShadow: '0 6px 20px rgba(226, 55, 68, 0.5)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? 'Booking...' : 'Confirm Reservation'}
                </Button>

                {!isAuthenticated && (
                  <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                    You'll be redirected to login to complete your booking
                  </Alert>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%', borderRadius: 2 }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RestaurantDetailPage;