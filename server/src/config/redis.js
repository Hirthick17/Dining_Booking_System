import Redis from 'ioredis';

/**
 * Redis Client Configuration
 * Used for distributed locking in booking system
 */

let redisClient = null;
let isRedisAvailable = false;

// Initialize Redis connection
try {
  redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    retryStrategy: (times) => {
      // Stop retrying after 3 attempts
      if (times > 3) {
        console.warn('⚠️  Redis connection failed after 3 attempts. Using in-memory locking fallback.');
        return null;
      }
      // Retry after 1 second
      return 1000;
    },
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true
  });

  // Event handlers
  redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully');
    isRedisAvailable = true;
  });

  redisClient.on('ready', () => {
    console.log('✅ Redis is ready to accept commands');
    isRedisAvailable = true;
  });

  redisClient.on('error', (err) => {
    console.warn('⚠️  Redis connection error:', err.message);
    console.warn('⚠️  Falling back to in-memory locking (suitable for development only)');
    isRedisAvailable = false;
  });

  redisClient.on('close', () => {
    console.log('ℹ️  Redis connection closed');
    isRedisAvailable = false;
  });

  redisClient.on('reconnecting', () => {
    console.log('🔄 Attempting to reconnect to Redis...');
  });

  // Attempt to connect
  redisClient.connect().catch((err) => {
    console.warn('⚠️  Could not connect to Redis:', err.message);
    console.warn('⚠️  Using in-memory locking fallback');
    isRedisAvailable = false;
  });

} catch (err) {
  console.warn('⚠️  Redis initialization failed:', err.message);
  console.warn('⚠️  Using in-memory locking fallback');
  redisClient = null;
  isRedisAvailable = false;
}

/**
 * Get Redis client instance
 * @returns {Redis|null} Redis client or null if unavailable
 */
export const getRedisClient = () => {
  return isRedisAvailable ? redisClient : null;
};

/**
 * Check if Redis is available
 * @returns {boolean}
 */
export const isRedisConnected = () => {
  return isRedisAvailable;
};

/**
 * Gracefully close Redis connection
 */
export const closeRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    console.log('✅ Redis connection closed gracefully');
  }
};

export default redisClient;
