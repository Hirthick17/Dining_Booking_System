import React from 'react';
import { useBookingStatus, useIsBookingConfirmed } from '../hooks/useBookingStatus';
import { useSelector } from 'react-redux';

/**
 * Example component showing booking status with polling
 */
const BookingStatusTracker = ({ bookingId }) => {
  const { token } = useSelector((state) => state.auth);
  
  // Poll every 5 seconds, automatically stops when booking reaches terminal state
  const { status, loading, error, stopped, refetch } = useBookingStatus(
    bookingId,
    token,
    5000
  );

  if (loading && !status) {
    return <div className="status-loading">Loading booking status...</div>;
  }

  if (error) {
    return (
      <div className="status-error">
        <p>Error loading status: {error}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  const getStatusColor = (statusValue) => {
    switch (statusValue) {
      case 'confirmed':
        return 'green';
      case 'pending':
        return 'orange';
      case 'seated':
        return 'blue';
      case 'completed':
        return 'gray';
      case 'cancelled':
      case 'no_show':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (statusValue) => {
    switch (statusValue) {
      case 'confirmed':
        return '✓';
      case 'pending':
        return '⏳';
      case 'seated':
        return '🪑';
      case 'completed':
        return '✅';
      case 'cancelled':
        return '✗';
      case 'no_show':
        return '⚠';
      default:
        return '•';
    }
  };

  return (
    <div className="booking-status-tracker">
      <h3>Booking Status</h3>
      
      <div className="status-card">
        <div className="status-header">
          <span className="booking-id">#{status.bookingId}</span>
          {stopped && <span className="badge badge-info">Final Status</span>}
        </div>

        <div className="status-main" style={{ color: getStatusColor(status.status) }}>
          <span className="status-icon">{getStatusIcon(status.status)}</span>
          <span className="status-text">{status.status.toUpperCase()}</span>
        </div>

        <div className="status-details">
          <p>
            Last updated: {new Date(status.lastUpdated).toLocaleString()}
          </p>
          
          {status.latestChange && (
            <div className="latest-change">
              <p className="change-label">Latest Change:</p>
              <p>
                {status.latestChange.status} at{' '}
                {new Date(status.latestChange.changedAt).toLocaleString()}
              </p>
              {status.latestChange.reason && (
                <p className="change-reason">Reason: {status.latestChange.reason}</p>
              )}
            </div>
          )}
        </div>

        {!stopped && (
          <div className="polling-indicator">
            <span className="pulse-dot"></span>
            <span>Checking for updates...</span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Simple status badge
 */
export const BookingStatusBadge = ({ bookingId }) => {
  const { token } = useSelector((state) => state.auth);
  const { isConfirmed, status, loading } = useIsBookingConfirmed(bookingId, token);

  if (loading) {
    return <span className="badge badge-loading">...</span>;
  }

  return (
    <span className={`badge badge-${isConfirmed ? 'success' : 'warning'}`}>
      {status || 'Unknown'}
    </span>
  );
};

export default BookingStatusTracker;
