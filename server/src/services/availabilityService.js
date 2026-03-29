// availabilityService.js

import TimeSlot from '../models/TimeSlot.js';
import Restaurant from '../models/Restaurant.js';
import Booking from '../models/Booking.js';

/**
 * Generate time slots based on operating hours and slot duration
 */
export const generateTimeSlots = (shifts, slotDuration = 30) => {
  const slots = [];
  
  if (!shifts || !Array.isArray(shifts)) return slots;

  for (const shift of shifts) {
    if (!shift.openTime || !shift.closeTime) continue;
    
    const [openHour, openMin] = shift.openTime.split(':').map(Number);
    const [closeHour, closeMin] = shift.closeTime.split(':').map(Number);
    
    let currentMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    
    while (currentMinutes <= closeMinutes - slotDuration) {
      const hours = Math.floor(currentMinutes / 60);
      const minutes = currentMinutes % 60;
      const timeSlot = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      slots.push(timeSlot);
      currentMinutes += slotDuration;
    }
  }
  
  return slots;
};

/**
 * Check if a specific time slot is available
 */
export const checkSlotAvailability = async (restaurantId, date, timeSlot, partySize) => {
  try {
    console.log('🔍 [AVAILABILITY] Checking:', { restaurantId, date, timeSlot, partySize });

    const restaurant = await Restaurant.findById(restaurantId)
      .select('seatingCapacity bookingSettings name');

    if (!restaurant) {
      console.warn('⚠️ [AVAILABILITY] Restaurant not found, failing open');
      return { available: true, availableSeats: 50, totalSeats: 50, bookedSeats: 0 };
    }

    // Safe total seats with multiple fallbacks
    const totalSeats =
      restaurant.seatingCapacity?.total ||
      (restaurant.seatingCapacity?.indoor || 0) + (restaurant.seatingCapacity?.outdoor || 0) ||
      50;

    console.log('💺 [AVAILABILITY] Total seats:', totalSeats);

    // Count existing bookings for this exact slot
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await Booking.find({
      restaurant: restaurantId,
      bookingDate: { $gte: startOfDay, $lte: endOfDay },
      bookingTime: timeSlot,
      status: { $in: ['pending', 'confirmed', 'seated'] }
    });

    const bookedSeats = existingBookings.reduce((sum, b) => sum + (b.partySize || 0), 0);
    const availableSeats = totalSeats - bookedSeats;

    console.log('📊 [AVAILABILITY]:', { totalSeats, bookedSeats, availableSeats, requested: partySize });

    return {
      available: availableSeats >= Number(partySize),
      availableSeats,
      totalSeats,
      bookedSeats,
      timeSlot,
      date: new Date(date)
    };
  } catch (error) {
    console.error('❌ [AVAILABILITY] Check error:', error.message);
    // Fail open — never block a booking due to availability check errors
    return {
      available: true,
      availableSeats: 50,
      totalSeats: 50,
      bookedSeats: 0,
      timeSlot,
      date: new Date(date)
    };
  }
};

/**
 * Get all available slots for a specific date
 */
export const getAvailableSlots = async (restaurantId, date, partySize = 1) => {
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return { date, isOpen: false, slots: [] };
    }

    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();

    const operatingHours = (restaurant.operatingHours || []).find(
      h => h.dayOfWeek === dayOfWeek
    );

    if (!operatingHours || !operatingHours.isOpen) {
      return { date, isOpen: false, slots: [] };
    }

    const timeSlots = generateTimeSlots(
      operatingHours.shifts,
      restaurant.bookingSettings?.slotDuration || 30
    );

    const availableSlots = [];
    for (const timeSlot of timeSlots) {
      const availability = await checkSlotAvailability(
        restaurantId, date, timeSlot, partySize
      );
      if (availability.available) {
        availableSlots.push({
          time: timeSlot,
          availableSeats: availability.availableSeats
        });
      }
    }

    return { date, isOpen: true, slots: availableSlots };
  } catch (error) {
    console.error('Error getting available slots:', error);
    return { date, isOpen: false, slots: [] };
  }
};

/**
 * Get availability calendar for date range
 */
export const getAvailabilityCalendar = async (restaurantId, startDate, days = 7) => {
  try {
    const calendar = [];
    const start = new Date(startDate);

    for (let i = 0; i < days; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      const dayAvailability = await getAvailableSlots(restaurantId, currentDate, 1);
      calendar.push({
        date: currentDate,
        isOpen: dayAvailability.isOpen,
        totalAvailableSlots: dayAvailability.slots.length,
        slots: dayAvailability.slots
      });
    }

    return calendar;
  } catch (error) {
    console.error('Error getting availability calendar:', error);
    return [];
  }
};

/**
 * Update slot availability when booking is created or cancelled
 * THIS MUST NEVER THROW — booking is already saved at this point
 */
export const updateSlotAvailability = async (bookingId, action) => {
  try {
    console.log('📅 [SLOT UPDATE] Starting for booking:', bookingId, 'action:', action);

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.warn('⚠️ [SLOT UPDATE] Booking not found, skipping slot update');
      return; // ← RETURN, don't throw
    }

    const restaurant = await Restaurant.findById(booking.restaurant)
      .select('seatingCapacity');

    if (!restaurant) {
      console.warn('⚠️ [SLOT UPDATE] Restaurant not found, skipping slot update');
      return; // ← RETURN, don't throw
    }

    const totalSeats =
      restaurant.seatingCapacity?.total ||
      (restaurant.seatingCapacity?.indoor || 0) + (restaurant.seatingCapacity?.outdoor || 0) ||
      50;

    // Find or CREATE the time slot — never throw if missing
    let slot = await TimeSlot.findOne({
      restaurant: booking.restaurant,
      date: booking.bookingDate,
      timeSlot: booking.bookingTime
    });

    if (!slot) {
      console.log('📝 [SLOT UPDATE] No existing slot found, creating one...');
      try {
        slot = await TimeSlot.create({
          restaurant: booking.restaurant,
          date: booking.bookingDate,
          timeSlot: booking.bookingTime,
          totalSeats,
          bookedSeats: 0,
          availableSeats: totalSeats,
          isAvailable: true,
          isClosed: false,
          bookings: []
        });
        console.log('✅ [SLOT UPDATE] New slot created');
      } catch (createError) {
        // Slot may have been created by concurrent request (duplicate key)
        slot = await TimeSlot.findOne({
          restaurant: booking.restaurant,
          date: booking.bookingDate,
          timeSlot: booking.bookingTime
        });
        if (!slot) {
          console.error('⚠️ [SLOT UPDATE] Could not find or create slot, skipping');
          return; // ← RETURN, don't throw
        }
      }
    }

    // Update based on action
    if (action === 'create' || action === 'confirm') {
      slot.bookedSeats = Math.min(slot.bookedSeats + booking.partySize, slot.totalSeats);
      if (!slot.bookings.some(id => id.equals(bookingId))) {
        slot.bookings.push(bookingId);
      }
    } else if (action === 'cancel') {
      slot.bookedSeats = Math.max(0, slot.bookedSeats - booking.partySize);
      slot.bookings = slot.bookings.filter(id => !id.equals(bookingId));
    }

    slot.updateAvailability();
    await slot.save();

    console.log('✅ [SLOT UPDATE] Slot updated successfully');

    // Update restaurant availability cache (non-fatal)
    try {
      await updateRestaurantAvailabilityCache(booking.restaurant);
    } catch (cacheError) {
      console.warn('⚠️ [SLOT UPDATE] Cache update failed (non-fatal):', cacheError.message);
    }

    return slot;
  } catch (error) {
    // CRITICAL: Log but never throw from this function
    // The booking is already saved — we must not fail the HTTP response
    console.error('⚠️ [SLOT UPDATE] Non-fatal error during slot update:', error.message);
  }
};

/**
 * Update restaurant availability cache
 */
export const updateRestaurantAvailabilityCache = async (restaurantId) => {
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const upcomingSlots = await TimeSlot.find({
      restaurant: restaurantId,
      date: { $gte: today },
      isAvailable: true,
      availableSeats: { $gt: 0 }
    })
      .sort({ date: 1, timeSlot: 1 })
      .limit(5)
      .select('date timeSlot availableSeats');

    const todaySlots = await TimeSlot.find({
      restaurant: restaurantId,
      date: today
    });

    const totalAvailable = todaySlots.reduce((sum, slot) => sum + slot.availableSeats, 0);
    const totalBooked = todaySlots.reduce((sum, slot) => sum + slot.bookedSeats, 0);

    restaurant.currentAvailability = {
      lastUpdated: new Date(),
      availableSeats: totalAvailable,
      bookedSeats: totalBooked,
      upcomingSlots: upcomingSlots.map(slot => ({
        date: slot.date,
        time: slot.timeSlot,
        availableSeats: slot.availableSeats
      }))
    };

    await restaurant.save();
    return restaurant.currentAvailability;
  } catch (error) {
    console.error('⚠️ [CACHE] Non-fatal cache update error:', error.message);
  }
};

/**
 * Cleanup old time slots
 */
export const cleanupOldSlots = async (daysToKeep = 7) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    const result = await TimeSlot.deleteMany({ date: { $lt: cutoffDate } });
    console.log(`Cleaned up ${result.deletedCount} old time slots`);
    return result;
  } catch (error) {
    console.error('Error cleaning up old slots:', error);
  }
};

export default {
  generateTimeSlots,
  checkSlotAvailability,
  getAvailableSlots,
  getAvailabilityCalendar,
  updateSlotAvailability,
  updateRestaurantAvailabilityCache,
  cleanupOldSlots
};