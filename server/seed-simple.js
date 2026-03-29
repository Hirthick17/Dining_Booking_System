import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import Restaurant from './src/models/Restaurant.js';

dotenv.config();

async function seedSimple() {
  try {
    console.log('🌱 Starting simple database seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create admin user
    console.log('👥 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@restaurant.com',
      password: hashedPassword,
      phone: '+919876543212',
      role: 'admin'
    });
    console.log(`✅ Created admin user\n`);

    // Create one simple restaurant
    console.log('🍽️  Creating restaurant...');
    const restaurant = await Restaurant.create({
      name: 'Test Restaurant',
      slug: 'test-restaurant-mumbai',
      description: 'A test restaurant for development',
      cuisine: ['Indian'],
      city: 'Mumbai',
      location: {
        type: 'Point',
        coordinates: [72.8777, 19.0760],
        address: '123 Test Street, Mumbai',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        zipCode: '400001'
      },
      phone: '+919876543210',
      email: 'test@restaurant.com',
      averageCostForTwo: 1000,
      seatingCapacity: {
        total: 50,
        indoor: 40,
        outdoor: 10
      },
      priceRange: 3, // 1=Budget, 2=Moderate, 3=Upscale, 4=Fine Dining
      currency: 'INR',
      operatingHours: [
        { dayOfWeek: 0, isOpen: true, shifts: [{ openTime: '11:00', closeTime: '23:00' }] },
        { dayOfWeek: 1, isOpen: true, shifts: [{ openTime: '11:00', closeTime: '23:00' }] },
        { dayOfWeek: 2, isOpen: true, shifts: [{ openTime: '11:00', closeTime: '23:00' }] },
        { dayOfWeek: 3, isOpen: true, shifts: [{ openTime: '11:00', closeTime: '23:00' }] },
        { dayOfWeek: 4, isOpen: true, shifts: [{ openTime: '11:00', closeTime: '23:00' }] },
        { dayOfWeek: 5, isOpen: true, shifts: [{ openTime: '11:00', closeTime: '23:00' }] },
        { dayOfWeek: 6, isOpen: true, shifts: [{ openTime: '11:00', closeTime: '23:00' }] }
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
          category: 'exterior',
          isPrimary: true
        }
      ],
      owner: adminUser._id
    });
    console.log(`✅ Created restaurant: ${restaurant.name}\n`);

    console.log('═══════════════════════════════════════');
    console.log('🎉 Simple seeding completed!');
    console.log('═══════════════════════════════════════');
    console.log(`Admin: admin@restaurant.com / admin123`);
    console.log(`Restaurant: ${restaurant.name}`);
    console.log('═══════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    console.error('Error details:', error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        console.error(`  - ${key}: ${error.errors[key].message}`);
      });
    }
    process.exit(1);
  }
}

seedSimple();
