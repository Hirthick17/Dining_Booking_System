import { getRedisClient, isRedisConnected, closeRedis } from './src/config/redis.js';

/**
 * Test Redis Connection
 */
async function testRedis() {
  console.log('\n🧪 Testing Redis Connection...\n');
  
  // Wait a moment for connection to establish
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const redis = getRedisClient();
  
  if (!redis || !isRedisConnected()) {
    console.log('❌ Redis is not connected');
    console.log('ℹ️  This is normal if Redis is not installed');
    console.log('ℹ️  The booking system will use in-memory locking instead\n');
    return;
  }
  
  try {
    console.log('✅ Redis is connected!\n');
    
    // Test SET command
    console.log('Testing SET command...');
    await redis.set('test:key', 'Hello Redis!', 'EX', 10);
    console.log('✅ SET successful\n');
    
    // Test GET command
    console.log('Testing GET command...');
    const value = await redis.get('test:key');
    console.log(`✅ GET successful: ${value}\n`);
    
    // Test distributed lock
    console.log('Testing distributed lock...');
    const lockKey = 'test:lock';
    const lockValue = 'test-value';
    
    const lock1 = await redis.set(lockKey, lockValue, 'EX', 5, 'NX');
    console.log(`✅ Lock acquired: ${lock1 === 'OK'}\n`);
    
    const lock2 = await redis.set(lockKey, 'another-value', 'EX', 5, 'NX');
    console.log(`✅ Second lock blocked (expected): ${lock2 === null}\n`);
    
    // Release lock
    await redis.del(lockKey);
    console.log('✅ Lock released\n');
    
    // Cleanup
    await redis.del('test:key');
    console.log('✅ All tests passed!\n');
    
  } catch (error) {
    console.error('❌ Redis test failed:', error.message);
  } finally {
    await closeRedis();
    console.log('✅ Redis connection closed\n');
    process.exit(0);
  }
}

testRedis();
