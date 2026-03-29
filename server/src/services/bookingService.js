import Booking from '../models/Booking.js';
import Restaurant from '../models/Restaurant.js';
import { checkSlotAvailability, updateSlotAvailability } from './availabilityService.js';
import { getRedisClient } from '../config/redis.js';

// In-memory lock fallback (used when Redis is unavailable)
const inMemoryLocks = new Map();

/**
 * Acquire distributed lock
 */
const acquireLock = async (lockKey, lockValue, ttlSeconds = 5) => {
  const redis = getRedisClient();
  if (redis) {
    try {
      const result = await redis.set(lockKey, lockValue, 'EX', ttlSeconds, 'NX');
      return result === 'OK';
    } catch (err) {
      console.warn('Redis lock acquisition failed, using in-memory fallback:', err.message);
    }
  }

  if (inMemoryLocks.has(lockKey)) {
    const lock = inMemoryLocks.get(lockKey);
    if (lock.expiresAt > Date.now()) {
      return false;
    }
  }

  inMemoryLocks.set(lockKey, {
    value: lockValue,
    expiresAt: Date.now() + ttlSeconds * 1000
  });
  return true;
};

/**
 * Release distributed lock
 */
const releaseLock = async (lockKey, lockValue) => {
  const redis = getRedisClient();

  if (redis) {
    try {
      const currentValue = await redis.get(lockKey);
      if (currentValue === lockValue) {
        await redis.del(lockKey);
        return;
      }
    } catch (err) {
      console.warn('Redis lock release failed:', err.message);
    }
  }

  const lock = inMemoryLocks.get(lockKey);
  if (lock && lock.value === lockValue) {
    inMemoryLocks.delete(lockKey);
  }
};

/**
 * Generate unique booking ID
 */
const generateBookingId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `BK${timestamp}${random}`.toUpperCase();
};

/**
 * Create booking with conflict prevention
 */
export const createBooking = async (bookingData) => {
  console.log('🟢 [BOOKING SERVICE] Starting createBooking');
  console.log('📦 [BOOKING SERVICE] Received data:', bookingData);

  const {
    restaurantId,
    userId,
    bookingDate,
    bookingTime,
    partySize,
    guestName,
    guestPhone,
    guestEmail,
    specialRequests,
    occasion,
    seatingPreference
  } = bookingData;

  if (!restaurantId || !bookingDate || !bookingTime || !partySize) {
    console.log('❌ [BOOKING SERVICE] Missing required fields');
    throw new Error('Missing required booking information');
  }

  console.log('✅ [BOOKING SERVICE] Validation passed');

  const lockKey = `booking:lock:${restaurantId}:${bookingDate}:${bookingTime}`;
  const lockValue = `${userId}:${Date.now()}`;

  console.log('🔒 [BOOKING SERVICE] Attempting to acquire lock:', lockKey);

  const lockAcquired = await acquireLock(lockKey, lockValue, 5);

  if (!lockAcquired) {
    console.log('❌ [BOOKING SERVICE] Lock acquisition failed');
    throw new Error('This time slot is currently being booked by another user. Please try again in a moment.');
  }

  console.log('✅ [BOOKING SERVICE] Lock acquired');

  try {
    // Check availability — fail open if check errors
    console.log('🔍 [BOOKING SERVICE] Checking availability...');
    let availability;
    try {
      availability = await checkSlotAvailability(
        restaurantId,
        bookingDate,
        bookingTime,
        partySize
      );
      console.log('📊 [BOOKING SERVICE] Availability result:', availability);
    } catch (error) {
      console.warn('⚠️ [BOOKING SERVICE] Availability check failed, allowing booking anyway:', error.message);
      availability = { available: true };
    }

    if (availability && availability.available === false) {
      console.log('❌ [BOOKING SERVICE] Not enough seats available');
      throw new Error(`Not enough seats available. Only ${availability.availableSeats} seats remaining.`);
    }

    // Fetch restaurant
    console.log('🏪 [BOOKING SERVICE] Fetching restaurant...');
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      console.log('❌ [BOOKING SERVICE] Restaurant not found');
      throw new Error('Restaurant not found');
    }

    console.log('✅ [BOOKING SERVICE] Restaurant found:', restaurant.name);

    // Validate booking settings safely with defaults
    const settings = restaurant.bookingSettings || {};
    const minAdvance = settings.minAdvanceBooking ?? 0;
    const maxAdvanceDays = (settings.maxAdvanceBooking ?? 720) / 24;
    const maxParty = settings.maxPartySize ?? 20;
    const isBookingEnabled = settings.isBookingEnabled !== false;

    if (!isBookingEnabled) {
      throw new Error('This restaurant is not accepting online bookings at the moment.');
    }

    const bookingDateTime = new Date(bookingDate);
    const [bHours, bMinutes] = bookingTime.split(':');
    bookingDateTime.setHours(parseInt(bHours), parseInt(bMinutes), 0, 0);

    const now = new Date();
    const hoursUntilBooking = (bookingDateTime - now) / (1000 * 60 * 60);

    if (minAdvance > 0 && hoursUntilBooking < minAdvance) {
      throw new Error(`Bookings must be made at least ${minAdvance} hour(s) in advance`);
    }

    const daysUntilBooking = hoursUntilBooking / 24;
    if (daysUntilBooking > maxAdvanceDays) {
      throw new Error(`Bookings can only be made up to ${maxAdvanceDays} days in advance`);
    }

    if (Number(partySize) > maxParty) {
      throw new Error(`Maximum party size is ${maxParty}. Please contact the restaurant directly for larger groups.`);
    }

    console.log('✅ [BOOKING SERVICE] All validations passed, creating booking object...');

    const booking = new Booking({
      bookingId: generateBookingId(),
      user: userId,
      restaurant: restaurantId,
      bookingDate: new Date(bookingDate),
      bookingTime,
      partySize: Number(partySize),
      guestName: guestName || 'Guest',
      guestPhone: guestPhone || '',
      guestEmail: guestEmail || '',
      specialRequests: specialRequests || '',
      occasion: occasion || 'none',
      seatingPreference: seatingPreference || 'no_preference',
      status: 'confirmed',
      isAIAssisted: bookingData.isAIAssisted || false,
      aiConversationId: bookingData.aiConversationId || null
    });

    console.log('💾 [BOOKING SERVICE] Saving booking to database...');
    await booking.save();
    console.log('✅ [BOOKING SERVICE] Booking saved successfully:', booking.bookingId);

    // Update slot availability — must never throw after booking is saved
    console.log('📅 [BOOKING SERVICE] Updating slot availability...');
    try {
      await updateSlotAvailability(booking._id, 'create');
      console.log('✅ [BOOKING SERVICE] Slot availability updated');
    } catch (slotError) {
      console.warn('⚠️ [BOOKING SERVICE] Slot update failed (non-fatal, booking still saved):', slotError.message);
    }

    return booking;
  } finally {
    console.log('🔓 [BOOKING SERVICE] Releasing lock...');
    await releaseLock(lockKey, lockValue);
    console.log('✅ [BOOKING SERVICE] Lock released');
  }
};

/**
 * Cancel booking and update availability
 */
export const cancelBooking = async (bookingId, userId) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.user && booking.user.toString() !== userId) {
    throw new Error('Not authorized to cancel this booking');
  }

  if (booking.status === 'cancelled') {
    throw new Error('Booking is already cancelled');
  }

  // Check cancellation policy safely
  const restaurant = await Restaurant.findById(booking.restaurant);
  if (restaurant && restaurant.bookingSettings) {
    const cancellationDeadline = restaurant.bookingSettings.cancellationPolicy?.cancellationDeadline
      ?? restaurant.bookingSettings.cancellationDeadline
      ?? 0;

    if (cancellationDeadline > 0) {
      const bookingDateTime = new Date(booking.bookingDate);
      const [hours, minutes] = booking.bookingTime.split(':');
      bookingDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const now = new Date();
      const hoursUntilBooking = (bookingDateTime - now) / (1000 * 60 * 60);

      if (hoursUntilBooking < cancellationDeadline) {
        throw new Error(
          `Cancellations must be made at least ${cancellationDeadline} hours before the booking time`
        );
      }
    }
  }

  booking.status = 'cancelled';
  booking.cancelledAt = new Date();
  booking.cancelledBy = userId;

  booking.statusHistory.push({
    status: 'cancelled',
    changedBy: userId,
    changedAt: new Date(),
    note: 'Cancelled by user'
  });

  await booking.save();

  // Update slot availability — non-fatal
  try {
    await updateSlotAvailability(booking._id, 'cancel');
  } catch (slotError) {
    console.warn('⚠️ [CANCEL] Slot update failed (non-fatal):', slotError.message);
  }

  return booking;
};

export default {
  createBooking,
  cancelBooking,
  generateBookingId
};