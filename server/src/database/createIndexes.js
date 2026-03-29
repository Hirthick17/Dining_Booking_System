/**
 * MongoDB Index Creation Script
 * 
 * This script creates all necessary indexes for optimal query performance.
 * Run this script after setting up the database to ensure all indexes are created.
 * 
 * Usage: node src/database/createIndexes.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const createIndexes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // ============================================
    // USERS COLLECTION INDEXES
    // ============================================
    console.log('\n📊 Creating indexes for users collection...');
    
    await db.collection('users').createIndex(
      { email: 1 },
      { unique: true, name: 'email_unique' }
    );
    console.log('  ✓ Created unique index on email');

    await db.collection('users').createIndex(
      { phone: 1 },
      { unique: true, name: 'phone_unique' }
    );
    console.log('  ✓ Created unique index on phone');

    // ============================================
    // RESTAURANTS COLLECTION INDEXES
    // ============================================
    console.log('\n📊 Creating indexes for restaurants collection...');
    
    await db.collection('restaurants').createIndex(
      { name: 'text', description: 'text' },
      { name: 'restaurant_text_search' }
    );
    console.log('  ✓ Created text index on name and description');

    await db.collection('restaurants').createIndex(
      { 'location.city': 1 },
      { name: 'city_index' }
    );
    console.log('  ✓ Created index on location.city');

    await db.collection('restaurants').createIndex(
      { isActive: 1 },
      { name: 'active_status_index' }
    );
    console.log('  ✓ Created index on isActive');

    // ============================================
    // BOOKINGS COLLECTION INDEXES
    // ============================================
    console.log('\n📊 Creating indexes for bookings collection...');
    
    await db.collection('bookings').createIndex(
      { bookingReference: 1 },
      { unique: true, name: 'booking_reference_unique' }
    );
    console.log('  ✓ Created unique index on bookingReference');

    await db.collection('bookings').createIndex(
      { customer: 1, createdAt: -1 },
      { name: 'customer_bookings_index' }
    );
    console.log('  ✓ Created compound index on customer and createdAt');

    await db.collection('bookings').createIndex(
      { restaurant: 1, 'reservationDetails.date': 1 },
      { name: 'restaurant_date_index' }
    );
    console.log('  ✓ Created compound index on restaurant and date');

    await db.collection('bookings').createIndex(
      { status: 1 },
      { name: 'status_index' }
    );
    console.log('  ✓ Created index on status');

    await db.collection('bookings').createIndex(
      { 'reservationDetails.date': 1 },
      { name: 'reservation_date_index' }
    );
    console.log('  ✓ Created index on reservationDetails.date');

    // ============================================
    // VERIFY INDEXES
    // ============================================
    console.log('\n🔍 Verifying all indexes...\n');
    
    const userIndexes = await db.collection('users').indexes();
    console.log('Users collection indexes:', userIndexes.length);
    userIndexes.forEach(idx => console.log(`  - ${idx.name}`));

    const restaurantIndexes = await db.collection('restaurants').indexes();
    console.log('\nRestaurants collection indexes:', restaurantIndexes.length);
    restaurantIndexes.forEach(idx => console.log(`  - ${idx.name}`));

    const bookingIndexes = await db.collection('bookings').indexes();
    console.log('\nBookings collection indexes:', bookingIndexes.length);
    bookingIndexes.forEach(idx => console.log(`  - ${idx.name}`));

    console.log('\n✅ All indexes created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    process.exit(1);
  }
};

createIndexes();
