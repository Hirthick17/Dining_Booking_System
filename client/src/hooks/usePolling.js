import { useState, useEffect, useRef } from 'react';

/**
 * Generic polling hook
 * @param {Function} fetchFn - Function to fetch data
 * @param {number} interval - Polling interval in milliseconds
 * @param {boolean} shouldPoll - Whether polling should be active
 * @returns {Object} { data, loading, error, refetch }
 */
export const usePolling = (fetchFn, interval = 5000, shouldPoll = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);

  const fetchData = async () => {
    try {
      const result = await fetchFn();
      if (isMountedRef.current) {
        setData(result);
        setError(null);
        setLoading(false);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    if (!shouldPoll) {
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchData();

    // Set up polling
    intervalRef.current = setInterval(fetchData, interval);

    // Cleanup
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval, shouldPoll]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

/**
 * Smart polling hook - stops polling when tab is inactive
 * @param {Function} fetchFn - Function to fetch data
 * @param {number} interval - Polling interval in milliseconds
 * @param {boolean} enabled - Whether polling should be enabled
 * @returns {Object} { data, loading, error, refetch }
 */
export const useSmartPolling = (fetchFn, interval = 5000, enabled = true) => {
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return usePolling(fetchFn, interval, enabled && isVisible);
};

/**
 * Conditional polling hook - stops polling when condition is met
 * @param {Function} fetchFn - Function to fetch data
 * @param {Function} stopCondition - Function that returns true when polling should stop
 * @param {number} interval - Polling interval in milliseconds
 * @returns {Object} { data, loading, error, refetch, stopped }
 */
export const useConditionalPolling = (fetchFn, stopCondition, interval = 5000) => {
  const [stopped, setStopped] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const wrappedFetchFn = async () => {
    const result = await fetchFn();
    if (stopCondition(result)) {
      setStopped(true);
    }
    return result;
  };

  const pollingResult = usePolling(wrappedFetchFn, interval, !stopped);

  useEffect(() => {
    setData(pollingResult.data);
    setLoading(pollingResult.loading);
    setError(pollingResult.error);
  }, [pollingResult.data, pollingResult.loading, pollingResult.error]);

  return { data, loading, error, refetch: pollingResult.refetch, stopped };
};
