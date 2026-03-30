import { useConditionalPolling } from './usePolling';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://dining-booking-system.vercel.app/api';

/**
 * Hook to poll booking status
 * Automatically stops polling when booking reaches a terminal state
 * @param {string} bookingId - Booking ID
 * @param {string} token - Auth token
 * @param {number} interval - Polling interval in milliseconds (default: 5000 = 5 seconds)
 * @returns {Object} { status, loading, error, refetch, stopped }
 */
export const useBookingStatus = (bookingId, token, interval = 5000) => {
  const fetchStatus = async () => {
    if (!bookingId || !token) {
      throw new Error('Booking ID and token are required');
    }

    const response = await axios.get(
      `${API_URL}/bookings/${bookingId}/status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'If-None-Match': localStorage.getItem(`booking-status-etag-${bookingId}`) || ''
        }
      }
    );

    // Store ETag for next request
    const etag = response.headers['etag'];
    if (etag) {
      localStorage.setItem(`booking-status-etag-${bookingId}`, etag);
    }

    return response.data.status;
  };

  // Stop polling when booking reaches terminal state
  const stopCondition = (statusData) => {
    return statusData?.isTerminal === true;
  };

  const { data: status, loading, error, refetch, stopped } = useConditionalPolling(
    fetchStatus,
    stopCondition,
    interval
  );

  return { status, loading, error, refetch, stopped };
};

/**
 * Hook to check if booking is confirmed
 * @param {string} bookingId - Booking ID
 * @param {string} token - Auth token
 * @returns {Object} { isConfirmed, status, loading, error }
 */
export const useIsBookingConfirmed = (bookingId, token) => {
  const { status, loading, error } = useBookingStatus(bookingId, token);

  return {
    isConfirmed: status?.status === 'confirmed',
    status: status?.status,
    loading,
    error
  };
};
