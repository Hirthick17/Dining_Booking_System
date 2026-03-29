import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createBooking } from './src/services/bookingService.js';
import User from './src/models/User.js';
import Restaurant from './src/models/Restaurant.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    // Get a user and restaurant
    const user = await User.findOne();
    const restaurant = await Restaurant.findOne();

    if (!user || !restaurant) {
      console.error('No user or restaurant found to test with');
      process.exit(1);
    }

    console.log('Testing with User:', user.email);
    console.log('Testing with Restaurant:', restaurant.name);

    const bookingData = {
      restaurantId: restaurant._id,
      userId: user._id,
      bookingDate: new Date().toISOString().split('T')[0],
      bookingTime: '18:00',
      partySize: 2,
      guestName: 'Test User',
      guestPhone: '1234567890',
      guestEmail: 'test@example.com',
      specialRequests: '',
      occasion: '', // Testing empty string
      seatingPreference: '' // Testing empty string
    };

    console.log('Calling createBooking with:', bookingData);

    try {
      const booking = await createBooking(bookingData);
      console.log('Booking created successfully:', booking);
    } catch (error) {
      console.error('Error creating booking:', error);
    }

  } catch (error) {
    console.error('Script error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

run();
