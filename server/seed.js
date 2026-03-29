import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import Restaurant from './src/models/Restaurant.js';
import Booking from './src/models/Booking.js';
import Review from './src/models/Review.js';
import TimeSlot from './src/models/TimeSlot.js';

dotenv.config();

// Sample data
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'];
const cuisines = ['Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 'Thai', 'Continental', 'Mediterranean'];
const restaurantTypes = ['Fine Dining', 'Casual Dining', 'Cafe', 'Quick Service', 'Bar & Grill'];

const sampleRestaurants = [
  {
    name: 'The Spice Route',
    slug: 'the-spice-route-mumbai',
    description: 'Experience authentic Indian flavors in a modern setting with panoramic city views.',
    cuisine: ['Indian', 'Continental'],
    city: 'Mumbai',
    location: {
      type: 'Point',
      coordinates: [72.8777, 19.0760],
      address: '123 Marine Drive, Nariman Point, Mumbai, Maharashtra 400021',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      zipCode: '400021'
    },
    phone: '+912212345678',
    email: 'info@spiceroute.com',
    website: 'https://spiceroute.com',
    seatingCapacity: {
      total: 100,
      indoor: 70,
      outdoor: 30
    },
    averageCostForTwo: 1800,
    priceRange: 3, // Upscale
    currency: 'INR',
    operatingHours: [
      {
        dayOfWeek: 0, isOpen: true,
        shifts: [{ openTime: '11:00', closeTime: '15:00' }, { openTime: '18:00', closeTime: '23:00' }]
      },
      {
        dayOfWeek: 1, isOpen: true,
        shifts: [{ openTime: '11:00', closeTime: '15:00' }, { openTime: '18:00', closeTime: '23:00' }]
      },
      {
        dayOfWeek: 2, isOpen: true,
        shifts: [{ openTime: '11:00', closeTime: '15:00' }, { openTime: '18:00', closeTime: '23:00' }]
      },
      {
        dayOfWeek: 3, isOpen: true,
        shifts: [{ openTime: '11:00', closeTime: '15:00' }, { openTime: '18:00', closeTime: '23:00' }]
      },
      {
        dayOfWeek: 4, isOpen: true,
        shifts: [{ openTime: '11:00', closeTime: '15:00' }, { openTime: '18:00', closeTime: '23:00' }]
      },
      {
        dayOfWeek: 5, isOpen: true,
        shifts: [{ openTime: '11:00', closeTime: '15:00' }, { openTime: '18:00', closeTime: '23:30' }]
      },
      {
        dayOfWeek: 6, isOpen: true,
        shifts: [{ openTime: '11:00', closeTime: '15:00' }, { openTime: '18:00', closeTime: '23:30' }]
      }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        category: 'exterior',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b',
        category: 'food'
      }
    ],
    amenities: ['wifi', 'parking', 'outdoor_seating', 'bar', 'valet_parking', 'air_conditioning'],
    bookingSettings: {
      isBookingEnabled: true,
      minAdvanceBooking: 2,
      maxAdvanceBooking: 720,
      slotDuration: 30,
      minPartySize: 1,
      maxPartySize: 20,
      cancellationPolicy: {
        allowCancellation: true,
        cancellationDeadline: 24,
        refundPercentage: 100
      }
    }
  },
  {
    name: 'Bella Italia',
    slug: 'bella-italia-bangalore',
    description: 'Authentic Italian cuisine with handmade pasta and wood-fired pizzas.',
    cuisine: ['Italian', 'Mediterranean'],
    city: 'Bangalore',
    location: {
      type: 'Point',
      coordinates: [77.5946, 12.9716],
      address: '45 MG Road, Indiranagar, Bangalore, Karnataka 560001',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      zipCode: '560001'
    },
    phone: '+918087654321',
    email: 'hello@bellaitalia.in',
    website: 'https://bellaitalia.in',
    seatingCapacity: {
      total: 80,
      indoor: 60,
      outdoor: 20
    },
    averageCostForTwo: 1400,
    priceRange: 2, // Moderate
    currency: 'INR',
    operatingHours: [
      { dayOfWeek: 0, isOpen: true, shifts: [{ openTime: '12:00', closeTime: '23:00' }] },
      { dayOfWeek: 1, isOpen: true, shifts: [{ openTime: '12:00', closeTime: '23:00' }] },
      { dayOfWeek: 2, isOpen: true, shifts: [{ openTime: '12:00', closeTime: '23:00' }] },
      { dayOfWeek: 3, isOpen: true, shifts: [{ openTime: '12:00', closeTime: '23:00' }] },
      { dayOfWeek: 4, isOpen: true, shifts: [{ openTime: '12:00', closeTime: '23:00' }] },
      { dayOfWeek: 5, isOpen: true, shifts: [{ openTime: '12:00', closeTime: '00:00' }] },
      { dayOfWeek: 6, isOpen: true, shifts: [{ openTime: '12:00', closeTime: '00:00' }] }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
        category: 'exterior',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9',
        category: 'food'
      }
    ],
    amenities: ['wifi', 'outdoor_seating', 'bar', 'air_conditioning', 'live_music'],
    bookingSettings: {
      isBookingEnabled: true,
      minAdvanceBooking: 1,
      maxAdvanceBooking: 720,
      slotDuration: 30,
      minPartySize: 1,
      maxPartySize: 15,
      cancellationPolicy: {
        allowCancellation: true,
        cancellationDeadline: 12,
        refundPercentage: 100
      }
    }
  },
  {
    name: 'Dragon Wok',
    slug: 'dragon-wok-delhi',
    description: 'Contemporary Chinese cuisine with a modern twist and stunning ambiance.',
    cuisine: ['Chinese', 'Thai', 'Asian'],
    city: 'Delhi',
    location: {
      type: 'Point',
      coordinates: [77.2090, 28.6139],
      address: '78 Connaught Place, Central Delhi, Delhi 110001',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      zipCode: '110001'
    },
    phone: '+911198765432',
    email: 'contact@dragonwok.com',
    seatingCapacity: {
      total: 120,
      indoor: 100,
      outdoor: 20
    },
    averageCostForTwo: 1600,
    priceRange: 3, // Upscale
    currency: 'INR',
    operatingHours: [
      { dayOfWeek: 0, isOpen: true, shifts: [{ openTime: '12:00', closeTime: '23:30' }] },
      { dayOfWeek: 1, isOpen: true, shifts: [{ openTime: '12:00', closeTime: '23:30' }] },
      { dayOfWeek: 2, isOpen: true, shifts: [{ openTime: '12:00', closeTime: '23:30' }] },
      { dayOfWeek: 3, isOpen: true, shifts: [{ openTime: '12:00', closeTime: '23:30' }] },
      { dayOfWeek: 4, isOpen: true, shifts: [{ openTime: '12:00', closeTime: '23:30' }] },
      { dayOfWeek: 5, isOpen: true, shifts: [{ openTime: '12:00', closeTime: '00:30' }] },
      { dayOfWeek: 6, isOpen: true, shifts: [{ openTime: '12:00', closeTime: '00:30' }] }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9',
        category: 'exterior',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        category: 'food'
      }
    ],
    amenities: ['wifi', 'parking', 'bar', 'valet_parking', 'air_conditioning', 'private_dining'],
    bookingSettings: {
      isBookingEnabled: true,
      minAdvanceBooking: 2,
      maxAdvanceBooking: 720,
      slotDuration: 30,
      minPartySize: 1,
      maxPartySize: 25,
      cancellationPolicy: {
        allowCancellation: true,
        cancellationDeadline: 24,
        refundPercentage: 100
      }
    }
  }
];

const sampleUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    phone: '+919876543210',
    role: 'user'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    phone: '+919876543211',
    role: 'user'
  },
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@restaurant.com',
    password: 'admin123',
    phone: '+919876543212',
    role: 'admin'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await TimeSlot.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create users
    console.log('👥 Creating users...');
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );
    const users = await User.insertMany(hashedUsers);
    console.log(`✅ Created ${users.length} users\n`);

    // Create restaurants
    console.log('🍽️  Creating restaurants...');
    
    // Add owner (admin user) to each restaurant
    const adminUser = users.find(u => u.role === 'admin');
    const restaurantsWithOwner = sampleRestaurants.map(r => ({
      ...r,
      owner: adminUser._id
    }));
    
    const restaurants = await Restaurant.insertMany(restaurantsWithOwner);
    console.log(`✅ Created ${restaurants.length} restaurants\n`);

    // Create sample bookings
    console.log('📅 Creating sample bookings...');
    const bookings = [];
    const today = new Date();
    
    for (let i = 0; i < 10; i++) {
      const bookingDate = new Date(today);
      bookingDate.setDate(today.getDate() + Math.floor(Math.random() * 14)); // Next 14 days
      
      const timeSlots = ['12:00', '13:00', '18:00', '19:00', '20:00', '21:00'];
      const randomTime = timeSlots[Math.floor(Math.random() * timeSlots.length)];
      
      const booking = {
        bookingId: `BK${Date.now()}${i}`,
        user: users[i % users.length]._id,
        restaurant: restaurants[i % restaurants.length]._id,
        bookingDate,
        bookingTime: randomTime,
        partySize: Math.floor(Math.random() * 6) + 2,
        guestName: `${users[i % users.length].firstName} ${users[i % users.length].lastName}`,
        guestPhone: users[i % users.length].phone,
        guestEmail: users[i % users.length].email,
        status: 'confirmed',
        specialRequests: i % 3 === 0 ? 'Window seat preferred' : ''
      };
      
      bookings.push(booking);
    }
    
    const createdBookings = await Booking.insertMany(bookings);
    console.log(`✅ Created ${createdBookings.length} bookings\n`);

    // Create TimeSlots for bookings
    // Note: TimeSlots will be created automatically when bookings are made through the API
    console.log('⏰ Skipping time slot creation (will be created via API)\n');

    // Create sample reviews
    console.log('⭐ Creating sample reviews...');
    const reviews = [];
    
    for (let i = 0; i < 15; i++) {
      const review = {
        user: users[i % users.length]._id,
        restaurant: restaurants[i % restaurants.length]._id,
        rating: {
          overall: Math.floor(Math.random() * 2) + 4, // 4-5 stars
          food: Math.floor(Math.random() * 2) + 4,
          service: Math.floor(Math.random() * 2) + 4,
          ambiance: Math.floor(Math.random() * 2) + 4,
          value: Math.floor(Math.random() * 2) + 4
        },
        title: 'Great experience!',
        comment: 'The food was excellent and the service was outstanding. Highly recommended!',
        visitDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
        verified: true
      };
      
      reviews.push(review);
    }
    
    const createdReviews = await Review.insertMany(reviews);
    console.log(`✅ Created ${createdReviews.length} reviews\n`);

    // Summary
    console.log('═══════════════════════════════════════');
    console.log('🎉 Database seeding completed!');
    console.log('═══════════════════════════════════════');
    console.log(`👥 Users created:        ${users.length}`);
    console.log(`🍽️  Restaurants created:  ${restaurants.length}`);
    console.log(`📅 Bookings created:     ${createdBookings.length}`);
    console.log(`⭐ Reviews created:      ${createdReviews.length}`);
    console.log('═══════════════════════════════════════\n');

    console.log('📝 Sample Login Credentials:');
    console.log('User:  john.doe@example.com / password123');
    console.log('User:  jane.smith@example.com / password123');
    console.log('Admin: admin@restaurant.com / admin123\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    console.error('\nError details:', error.message);
    if (error.errors) {
      console.error('\nValidation errors:');
      Object.keys(error.errors).forEach(key => {
        console.error(`  - ${key}: ${error.errors[key].message}`);
      });
    }
    process.exit(1);
  }
}

seedDatabase();
