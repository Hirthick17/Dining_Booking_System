/**
 * Utility functions for restaurant operations
 */

/**
 * Check if a restaurant is currently open based on operating hours
 * @param {Array} operatingHours - Array of operating hours from restaurant schema
 * @returns {boolean} - True if restaurant is currently open
 */
export const isRestaurantOpen = (operatingHours) => {
  if (!operatingHours || operatingHours.length === 0) {
    return false;
  }

  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // Find today's operating hours
  const todayHours = operatingHours.find(oh => oh.dayOfWeek === currentDay);

  if (!todayHours || !todayHours.isOpen) {
    return false;
  }

  // Check if current time falls within any shift
  if (todayHours.shifts && todayHours.shifts.length > 0) {
    return todayHours.shifts.some(shift => {
      return currentTime >= shift.openTime && currentTime <= shift.closeTime;
    });
  }

  return false;
};

/**
 * Get the next available time slot for a restaurant
 * @param {Array} operatingHours - Array of operating hours from restaurant schema
 * @returns {string|null} - Next available time slot or null
 */
export const getNextAvailableSlot = (operatingHours) => {
  if (!operatingHours || operatingHours.length === 0) {
    return null;
  }

  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // Check today's remaining slots
  const todayHours = operatingHours.find(oh => oh.dayOfWeek === currentDay);
  if (todayHours && todayHours.isOpen && todayHours.shifts) {
    for (const shift of todayHours.shifts) {
      if (currentTime < shift.openTime) {
        return `Today at ${formatTime(shift.openTime)}`;
      }
    }
  }

  // Check next 7 days
  for (let i = 1; i <= 7; i++) {
    const nextDay = (currentDay + i) % 7;
    const nextDayHours = operatingHours.find(oh => oh.dayOfWeek === nextDay);
    
    if (nextDayHours && nextDayHours.isOpen && nextDayHours.shifts && nextDayHours.shifts.length > 0) {
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][nextDay];
      return `${dayName} at ${formatTime(nextDayHours.shifts[0].openTime)}`;
    }
  }

  return null;
};

/**
 * Format time from 24-hour to 12-hour format
 * @param {string} time - Time in HH:MM format
 * @returns {string} - Formatted time
 */
export const formatTime = (time) => {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  
  return `${displayHour}:${minutes} ${ampm}`;
};

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} - Formatted distance string
 */
export const formatDistance = (distance) => {
  if (!distance) return '';
  
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m away`;
  }
  
  return `${distance.toFixed(1)}km away`;
};

/**
 * Get restaurant status text
 * @param {Array} operatingHours - Array of operating hours
 * @returns {Object} - Status object with text and color
 */
export const getRestaurantStatus = (operatingHours) => {
  const isOpen = isRestaurantOpen(operatingHours);
  
  if (isOpen) {
    return {
      text: 'Open Now',
      color: '#4CAF50'
    };
  }
  
  const nextSlot = getNextAvailableSlot(operatingHours);
  return {
    text: nextSlot ? `Opens ${nextSlot}` : 'Closed',
    color: '#F44336'
  };
};

/**
 * Calculate mock distance (placeholder for actual geolocation)
 * @param {Object} restaurantLocation - Restaurant location object
 * @param {Object} userLocation - User location object (optional)
 * @returns {number} - Distance in kilometers
 */
export const calculateDistance = (restaurantLocation, userLocation = null) => {
  // Mock implementation - returns random distance between 0.5 and 10 km
  // In production, use actual geolocation calculation
  return Math.random() * 9.5 + 0.5;
};
