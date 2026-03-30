import { useSmartPolling } from './usePolling';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://dining-booking-system.vercel.app/api';

/**
 * Hook to poll restaurant availability
 * @param {string} restaurantId - Restaurant ID
 * @param {number} interval - Polling interval in milliseconds (default: 10000 = 10 seconds)
 * @param {boolean} enabled - Whether polling is enabled (default: true)
 * @returns {Object} { availability, loading, error, refetch }
 */
export const useAvailability = (restaurantId, interval = 10000, enabled = true) => {
  const fetchAvailability = async () => {
    if (!restaurantId) {
      throw new Error('Restaurant ID is required');
    }

    const response = await axios.get(
      `${API_URL}/restaurants/${restaurantId}/availability`,
      {
        headers: {
          'If-None-Match': localStorage.getItem(`availability-etag-${restaurantId}`) || ''
        }
      }
    );

    // Store ETag for next request
    const etag = response.headers['etag'];
    if (etag) {
      localStorage.setItem(`availability-etag-${restaurantId}`, etag);
    }

    return response.data.availability;
  };

  const { data: availability, loading, error, refetch } = useSmartPolling(
    fetchAvailability,
    interval,
    enabled && !!restaurantId
  );

  return { availability, loading, error, refetch };
};

/**
 * Hook to check if restaurant has available seats
 * @param {string} restaurantId - Restaurant ID
 * @param {number} interval - Polling interval in milliseconds
 * @returns {Object} { hasSeats, availableSeats, loading, error }
 */
export const useHasAvailableSeats = (restaurantId, interval = 10000) => {
  const { availability, loading, error } = useAvailability(restaurantId, interval);

  return {
    hasSeats: availability ? availability.availableSeats > 0 : false,
    availableSeats: availability?.availableSeats || 0,
    loading,
    error
  };
};
