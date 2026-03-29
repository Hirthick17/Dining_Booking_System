import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixBookingIndex = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const bookingsCollection = db.collection('bookings');

    console.log('\n📋 Current indexes on bookings collection:');
    const indexes = await bookingsCollection.indexes();
    indexes.forEach(index => {
      console.log(`  - ${index.name}:`, index.key);
    });

    // Drop the problematic bookingReference index
    console.log('\n🗑️  Dropping bookingReference_1 index...');
    try {
      await bookingsCollection.dropIndex('bookingReference_1');
      console.log('✅ Successfully dropped bookingReference_1 index');
    } catch (error) {
      if (error.code === 27 || error.message.includes('index not found')) {
        console.log('ℹ️  Index bookingReference_1 does not exist (already dropped)');
      } else {
        throw error;
      }
    }

    console.log('\n📋 Remaining indexes:');
    const remainingIndexes = await bookingsCollection.indexes();
    remainingIndexes.forEach(index => {
      console.log(`  - ${index.name}:`, index.key);
    });

    console.log('\n✅ Migration complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

fixBookingIndex();
