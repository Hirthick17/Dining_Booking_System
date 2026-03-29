import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings, cancelBooking, clearMessages } from '../redux/slices/bookingSlice';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { bookings, loading, successMessage, error } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setSnackbarSeverity('success');
      setShowSnackbar(true);
      // Refresh bookings after cancel so list updates with populated data
      dispatch(fetchMyBookings());
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (error) {
      setSnackbarSeverity('error');
      setShowSnackbar(true);
    }
  }, [error]);

  const handleOpenCancelDialog = (booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
    setSelectedBooking(null);
    setCancelReason('');
  };

  const handleCancelBooking = () => {
    if (selectedBooking) {
      dispatch(cancelBooking({ id: selectedBooking._id, reason: cancelReason }));
      handleCloseCancelDialog();
    }
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    dispatch(clearMessages());
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const statusMap = ['', 'confirmed', 'completed', 'cancelled'];
    dispatch(fetchMyBookings(statusMap[newValue]));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending':   return 'warning';
      case 'seated':    return 'info';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      case 'no_show':   return 'error';
      default:          return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  /**
   * Safely get restaurant name.
   * After cancel the Redux state may update booking.restaurant to just an ObjectId string.
   * We guard against both cases.
   */
  const getRestaurantName = (booking) => {
    if (!booking?.restaurant) return 'Unknown Restaurant';
    if (typeof booking.restaurant === 'string') return 'Restaurant';
    return booking.restaurant.name || 'Unknown Restaurant';
  };

  /**
   * Safely get restaurant location string.
   * Guards against restaurant being an unpopulated ObjectId or location being missing.
   */
  const getRestaurantLocation = (booking) => {
    if (!booking?.restaurant || typeof booking.restaurant === 'string') return '';
    const loc = booking.restaurant.location;
    if (!loc) return '';
    const parts = [loc.address, loc.city, loc.state].filter(Boolean);
    return parts.join(', ');
  };

  if (loading && bookings.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Welcome, {user?.firstName || 'back'}!
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage your restaurant bookings
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="All Bookings" />
          <Tab label="Confirmed" />
          <Tab label="Completed" />
          <Tab label="Cancelled" />
        </Tabs>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={32} />
        </Box>
      )}

      {!loading && bookings.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No bookings found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Start exploring restaurants and make your first reservation!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => {
            const restaurantName = getRestaurantName(booking);
            const restaurantLocation = getRestaurantLocation(booking);

            return (
              <Grid item xs={12} key={booking._id}>
                <Card elevation={2} sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        {/* Restaurant Name + Status */}
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                          <Typography variant="h6" fontWeight={600}>
                            {restaurantName}
                          </Typography>
                          <Chip
                            label={(booking.status || 'pending').toUpperCase()}
                            color={getStatusColor(booking.status)}
                            size="small"
                          />
                        </Box>

                        {/* Location — only shown if populated */}
                        {restaurantLocation && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {restaurantLocation}
                            </Typography>
                          </Box>
                        )}

                        {/* Booking Details */}
                        <Box sx={{ mt: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EventIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {formatDate(booking.bookingDate)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {booking.bookingTime || 'N/A'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PeopleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {booking.partySize} {booking.partySize === 1 ? 'person' : 'people'}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Special Requests */}
                        {booking.specialRequests && (
                          <Box sx={{ mt: 2, p: 1.5, bgcolor: 'grey.100', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Special Requests:
                            </Typography>
                            <Typography variant="body2">
                              {booking.specialRequests}
                            </Typography>
                          </Box>
                        )}

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 2, display: 'block' }}
                        >
                          Booking ID: {booking.bookingId || booking._id}
                        </Typography>
                      </Grid>

                      {/* Cancel Button */}
                      <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}
                      >
                        {(booking.status === 'confirmed' || booking.status === 'pending') && (
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleOpenCancelDialog(booking)}
                            disabled={loading}
                          >
                            Cancel Booking
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onClose={handleCloseCancelDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Are you sure you want to cancel your booking at{' '}
            <strong>{selectedBooking ? getRestaurantName(selectedBooking) : ''}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {selectedBooking ? formatDate(selectedBooking.bookingDate) : ''}{' '}
            {selectedBooking?.bookingTime ? `at ${selectedBooking.bookingTime}` : ''}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason for cancellation (optional)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog}>Keep Booking</Button>
          <Button onClick={handleCancelBooking} color="error" variant="contained">
            Yes, Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarSeverity === 'error' ? error : successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DashboardPage;