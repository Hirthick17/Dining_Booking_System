import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import { createBooking as createBookingService, cancelBooking as cancelBookingService } from '../services/bookingService.js';
import { getAvailableSlots, getAvailabilityCalendar, checkSlotAvailability } from '../services/availabilityService.js';

// @desc    Get available time slots for a restaurant
// @route   GET /api/bookings/slots/:restaurantId
// @access  Public
export const getAvailableTimeSlots = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const { date, partySize = 2 } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    const availability = await getAvailableSlots(
      restaurantId,
      new Date(date),
      parseInt(partySize)
    );

    res.status(200).json({
      success: true,
      data: availability
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get availability calendar for a restaurant
// @route   GET /api/bookings/calendar/:restaurantId
// @access  Public
export const getRestaurantCalendar = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const { startDate, days = 7 } = req.query;

    const start = startDate ? new Date(startDate) : new Date();
    const calendar = await getAvailabilityCalendar(
      restaurantId,
      start,
      parseInt(days)
    );

    res.status(200).json({
      success: true,
      data: calendar
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check specific slot availability
// @route   GET /api/bookings/check-availability/:restaurantId
// @access  Public
export const checkAvailability = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const { date, time, partySize } = req.query;

    if (!date || !time || !partySize) {
      return res.status(400).json({
        success: false,
        message: 'Date, time, and party size are required'
      });
    }

    const availability = await checkSlotAvailability(
      restaurantId,
      new Date(date),
      time,
      parseInt(partySize)
    );

    res.status(200).json({
      success: true,
      data: availability
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new booking with availability check
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
  try {
    console.log('🔵 [BOOKING CONTROLLER] Received request');
    console.log('📦 [BOOKING CONTROLLER] req.body:', req.body);
    console.log('👤 [BOOKING CONTROLLER] req.user:', req.user);

    const {
      restaurantId,
      bookingDate,
      bookingTime,
      partySize,
      guestName,
      guestPhone,
      guestEmail,
      specialRequests,
      occasion,
      seatingPreference
    } = req.body;

    console.log('✅ [BOOKING CONTROLLER] Extracted fields:', {
      restaurantId,
      bookingDate,
      bookingTime,
      partySize,
      guestName,
      guestPhone,
      guestEmail,
      specialRequests,
      occasion,
      seatingPreference
    });

    // Validate required fields
    if (!restaurantId || !bookingDate || !bookingTime || !partySize) {
      console.log('❌ [BOOKING CONTROLLER] Validation failed - missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Restaurant, date, time, and party size are required'
      });
    }

    console.log('✅ [BOOKING CONTROLLER] Validation passed, calling service...');

    // Create booking using service (includes conflict prevention)
    const booking = await createBookingService({
      restaurantId,
      userId: req.user.id,
      bookingDate,
      bookingTime,
      partySize,
      guestName: guestName || `${req.user.firstName} ${req.user.lastName}`,
      guestPhone: guestPhone || req.user.phone,
      guestEmail: guestEmail || req.user.email,
      specialRequests,
      // Handle empty strings for enum fields by falling back to undefined (which uses schema defaults)
      occasion: occasion || undefined,
      seatingPreference: seatingPreference || undefined
    });

    console.log('✅ [BOOKING CONTROLLER] Booking created successfully:', booking._id);

    // Add booking to user's history
    await User.findByIdAndUpdate(req.user.id, {
      $push: { bookingHistory: booking._id }
    });

    // Populate restaurant details
    await booking.populate('restaurant', 'name location images phone email');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.log('❌ [BOOKING CONTROLLER] Error caught:', error.message);
    console.log('📋 [BOOKING CONTROLLER] Error stack:', error.stack);
    
    // Handle specific errors
    if (error.message.includes('being booked')) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }
    if (error.message.includes('Not enough seats')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    let query = { user: req.user.id };
    
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('restaurant', 'name location images phone email')
      .sort({ bookingDate: -1, bookingTime: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('restaurant', 'name location images phone email operatingHours')
      .populate('user', 'firstName lastName email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.user && booking.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking with availability update
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await cancelBookingService(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    if (error.message.includes('Not authorized')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    if (error.message.includes('already cancelled') || error.message.includes('cancellation')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

// @desc    Get booking status (for polling)
// @route   GET /api/bookings/:id/status
// @access  Private
export const getBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .select('status bookingId bookingDate bookingTime statusHistory updatedAt user');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.user && booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }

    const statusData = {
      bookingId: booking.bookingId,
      status: booking.status,
      lastUpdated: booking.updatedAt,
      isTerminal: ['completed', 'cancelled', 'no_show'].includes(booking.status),
      latestChange: booking.statusHistory && booking.statusHistory.length > 0
        ? booking.statusHistory[booking.statusHistory.length - 1]
        : null
    };

    // Generate ETag
    const etag = `"${booking.updatedAt.getTime()}-${booking.status}"`;
    
    if (req.headers['if-none-match'] === etag) {
      return res.status(304).end(); // Not Modified
    }

    res.setHeader('ETag', etag);
    res.setHeader('Cache-Control', 'no-cache');

    res.status(200).json({
      success: true,
      status: statusData
    });
  } catch (error) {
    next(error);
  }
};

