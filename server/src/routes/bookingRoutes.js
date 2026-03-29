import express from 'express';
import { 
  createBooking, 
  getMyBookings, 
  getBooking, 
  cancelBooking,
  getBookingStatus,
  getAvailableTimeSlots,
  getRestaurantCalendar,
  checkAvailability
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes - availability checking
router.get('/slots/:restaurantId', getAvailableTimeSlots);
router.get('/calendar/:restaurantId', getRestaurantCalendar);
router.get('/check-availability/:restaurantId', checkAvailability);

// Protected routes - require authentication
router.use(protect);

router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);
router.get('/:id', getBooking);
router.get('/:id/status', getBookingStatus);
router.put('/:id/cancel', cancelBooking);

export default router;


