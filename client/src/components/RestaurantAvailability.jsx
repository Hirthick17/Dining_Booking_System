import React from 'react';
import { useAvailability, useHasAvailableSeats } from '../hooks/useAvailability';

/**
 * Example component showing restaurant availability with polling
 */
const RestaurantAvailability = ({ restaurantId }) => {
  // Poll every 10 seconds for availability updates
  const { availability, loading, error, refetch } = useAvailability(restaurantId, 10000);

  if (loading && !availability) {
    return <div className="availability-loading">Loading availability...</div>;
  }

  if (error) {
    return (
      <div className="availability-error">
        <p>Error loading availability: {error}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  if (!availability) {
    return null;
  }

  return (
    <div className="restaurant-availability">
      <h3>Real-Time Availability</h3>
      
      <div className="availability-stats">
        <div className="stat">
          <span className="label">Available Seats:</span>
          <span className="value">{availability.availableSeats}</span>
        </div>
        
        <div className="stat">
          <span className="label">Booked Seats:</span>
          <span className="value">{availability.bookedSeats}</span>
        </div>
        
        <div className="stat">
          <span className="label">Total Seats:</span>
          <span className="value">{availability.totalSeats}</span>
        </div>
      </div>

      <div className="availability-status">
        {availability.isBookingEnabled ? (
          availability.availableSeats > 0 ? (
            <span className="status-available">✓ Available for booking</span>
          ) : (
            <span className="status-full">✗ Fully booked</span>
          )
        ) : (
          <span className="status-disabled">Booking currently disabled</span>
        )}
      </div>

      {availability.upcomingSlots && availability.upcomingSlots.length > 0 && (
        <div className="upcoming-slots">
          <h4>Upcoming Available Slots</h4>
          <ul>
            {availability.upcomingSlots.map((slot, index) => (
              <li key={index}>
                {slot.time} - {slot.availableSeats} seats available
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="last-updated">
        Last updated: {new Date(availability.lastUpdated).toLocaleTimeString()}
      </p>
    </div>
  );
};

/**
 * Simple availability indicator
 */
export const AvailabilityBadge = ({ restaurantId }) => {
  const { hasSeats, availableSeats, loading } = useHasAvailableSeats(restaurantId);

  if (loading) {
    return <span className="badge badge-loading">Checking...</span>;
  }

  return (
    <span className={`badge ${hasSeats ? 'badge-success' : 'badge-danger'}`}>
      {hasSeats ? `${availableSeats} seats available` : 'Fully booked'}
    </span>
  );
};

export default RestaurantAvailability;
