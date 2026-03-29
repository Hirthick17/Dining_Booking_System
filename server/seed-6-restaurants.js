import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import Restaurant from './src/models/Restaurant.js';
import User from './src/models/User.js';

const newRestaurants = [
  {
    name: "Spice Garden",
    slug: "spice-garden-mumbai",
    description: "Authentic Indian cuisine with rich flavors and aromatic spices in a warm, cozy ambiance.",
    phone: "+919876543211",
    email: "info@spicegarden.com",
    website: "https://spicegarden.com",
    location: {
      type: "Point",
      coordinates: [72.8777, 19.0760],
      address: "12 MG Road",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      zipCode: "400001"
    },
    cuisineTypes: ["Indian", "Other"],
    mealTypes: ["lunch", "dinner"],
    dietaryOptions: ["vegetarian", "vegan"],
    priceRange: 2,
    averageCostForTwo: 700,
    currency: "INR",
    seatingCapacity: { indoor: 60, outdoor: 20, total: 80 },
    operatingHours: [
      { day: "monday", open: "11:00", close: "23:00", isOpen: true },
      { day: "tuesday", open: "11:00", close: "23:00", isOpen: true },
      { day: "wednesday", open: "11:00", close: "23:00", isOpen: true },
      { day: "thursday", open: "11:00", close: "23:00", isOpen: true },
      { day: "friday", open: "11:00", close: "23:00", isOpen: true },
      { day: "saturday", open: "11:00", close: "23:00", isOpen: true },
      { day: "sunday", open: "12:00", close: "22:00", isOpen: true }
    ],
    images: [{ url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800", isPrimary: true }],
    amenities: ["WiFi", "Parking", "AC"],
    rating: { average: 4.2, count: 38 },
    isVerified: true,
    isActive: true,
    isFeatured: true,
    views: 120
  },
  {
    name: "The Pasta House",
    slug: "pasta-house-mumbai",
    description: "Authentic Italian pasta, wood-fired pizzas, and fine wines in a rustic setting.",
    phone: "+919876543212",
    email: "hello@pastahouse.com",
    website: "https://pastahouse.com",
    location: {
      type: "Point",
      coordinates: [72.8402, 19.0544],
      address: "45 Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      zipCode: "400050"
    },
    cuisineTypes: ["Italian", "Other"],
    mealTypes: ["lunch", "dinner"],
    dietaryOptions: ["vegetarian"],
    priceRange: 3,
    averageCostForTwo: 1200,
    currency: "INR",
    seatingCapacity: { indoor: 50, outdoor: 15, total: 65 },
    operatingHours: [
      { day: "monday", open: "12:00", close: "23:00", isOpen: true },
      { day: "tuesday", open: "12:00", close: "23:00", isOpen: true },
      { day: "wednesday", open: "12:00", close: "23:00", isOpen: true },
      { day: "thursday", open: "12:00", close: "23:00", isOpen: true },
      { day: "friday", open: "12:00", close: "23:00", isOpen: true },
      { day: "saturday", open: "12:00", close: "23:00", isOpen: true },
      { day: "sunday", open: "12:00", close: "22:00", isOpen: true }
    ],
    images: [{ url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800", isPrimary: true }],
    amenities: ["WiFi", "AC", "Live Music"],
    rating: { average: 4.5, count: 72 },
    isVerified: true,
    isActive: true,
    isFeatured: true,
    views: 210
  },
  {
    name: "Dragon Wok",
    slug: "dragon-wok-mumbai",
    description: "Pan-Asian cuisine blending Chinese, Thai and Japanese flavors with a modern twist.",
    phone: "+919876543213",
    email: "contact@dragonwok.com",
    website: "https://dragonwok.com",
    location: {
      type: "Point",
      coordinates: [72.8697, 19.1136],
      address: "8 Andheri East",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      zipCode: "400069"
    },
    cuisineTypes: ["Chinese", "Thai", "Japanese"],
    mealTypes: ["lunch", "dinner"],
    dietaryOptions: ["vegetarian"],
    priceRange: 2,
    averageCostForTwo: 800,
    currency: "INR",
    seatingCapacity: { indoor: 70, outdoor: 0, total: 70 },
    operatingHours: [
      { day: "monday", open: "11:30", close: "22:30", isOpen: true },
      { day: "tuesday", open: "11:30", close: "22:30", isOpen: true },
      { day: "wednesday", open: "11:30", close: "22:30", isOpen: true },
      { day: "thursday", open: "11:30", close: "22:30", isOpen: true },
      { day: "friday", open: "11:30", close: "23:00", isOpen: true },
      { day: "saturday", open: "11:30", close: "23:00", isOpen: true },
      { day: "sunday", open: "12:00", close: "22:00", isOpen: true }
    ],
    images: [{ url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800", isPrimary: true }],
    amenities: ["WiFi", "AC", "Takeaway"],
    rating: { average: 4.0, count: 55 },
    isVerified: true,
    isActive: true,
    isFeatured: false,
    views: 95
  },
  {
    name: "Burger Boulevard",
    slug: "burger-boulevard-mumbai",
    description: "Gourmet burgers, crispy fries, and thick milkshakes — comfort food done right.",
    phone: "+919876543214",
    email: "hi@burgerboulevard.com",
    website: "https://burgerboulevard.com",
    location: {
      type: "Point",
      coordinates: [72.9057, 19.1197],
      address: "22 Powai Lake Drive",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      zipCode: "400076"
    },
    cuisineTypes: ["American", "Other"],
    mealTypes: ["breakfast", "lunch", "dinner"],
    dietaryOptions: ["vegetarian"],
    priceRange: 1,
    averageCostForTwo: 400,
    currency: "INR",
    seatingCapacity: { indoor: 40, outdoor: 10, total: 50 },
    operatingHours: [
      { day: "monday", open: "10:00", close: "23:00", isOpen: true },
      { day: "tuesday", open: "10:00", close: "23:00", isOpen: true },
      { day: "wednesday", open: "10:00", close: "23:00", isOpen: true },
      { day: "thursday", open: "10:00", close: "23:00", isOpen: true },
      { day: "friday", open: "10:00", close: "23:59", isOpen: true },
      { day: "saturday", open: "10:00", close: "23:59", isOpen: true },
      { day: "sunday", open: "11:00", close: "23:00", isOpen: true }
    ],
    images: [{ url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800", isPrimary: true }],
    amenities: ["Takeaway", "Delivery", "AC"],
    rating: { average: 4.3, count: 91 },
    isVerified: true,
    isActive: true,
    isFeatured: false,
    views: 175
  },
  {
    name: "The Coastal Kitchen",
    slug: "coastal-kitchen-mumbai",
    description: "Fresh seafood and coastal Konkani recipes passed down through generations.",
    phone: "+919876543215",
    email: "ocean@coastalkitchen.com",
    website: "https://coastalkitchen.com",
    location: {
      type: "Point",
      coordinates: [72.8232, 18.9432],
      address: "3 Marine Drive",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      zipCode: "400020"
    },
    cuisineTypes: ["Other", "Indian"],
    mealTypes: ["lunch", "dinner"],
    dietaryOptions: [],
    priceRange: 3,
    averageCostForTwo: 1500,
    currency: "INR",
    seatingCapacity: { indoor: 55, outdoor: 30, total: 85 },
    operatingHours: [
      { day: "monday", open: "12:00", close: "22:30", isOpen: true },
      { day: "tuesday", open: "12:00", close: "22:30", isOpen: true },
      { day: "wednesday", open: "12:00", close: "22:30", isOpen: true },
      { day: "thursday", open: "12:00", close: "22:30", isOpen: true },
      { day: "friday", open: "12:00", close: "23:00", isOpen: true },
      { day: "saturday", open: "12:00", close: "23:00", isOpen: true },
      { day: "sunday", open: "12:00", close: "22:00", isOpen: true }
    ],
    images: [{ url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800", isPrimary: true }],
    amenities: ["Sea View", "Parking", "AC", "WiFi"],
    rating: { average: 4.7, count: 113 },
    isVerified: true,
    isActive: true,
    isFeatured: true,
    views: 340
  },
  {
    name: "Green Bowl",
    slug: "green-bowl-mumbai",
    description: "Health-first restaurant offering salads, grain bowls, smoothies and clean eating menus.",
    phone: "+919876543216",
    email: "eat@greenbowl.com",
    website: "https://greenbowl.com",
    location: {
      type: "Point",
      coordinates: [72.8263, 19.1075],
      address: "17 Juhu Beach Road",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      zipCode: "400049"
    },
    cuisineTypes: ["Other", "Mediterranean"],
    mealTypes: ["breakfast", "lunch", "dinner"],
    dietaryOptions: ["vegan", "vegetarian", "gluten-free"],
    priceRange: 2,
    averageCostForTwo: 600,
    currency: "INR",
    seatingCapacity: { indoor: 35, outdoor: 20, total: 55 },
    operatingHours: [
      { day: "monday", open: "08:00", close: "21:00", isOpen: true },
      { day: "tuesday", open: "08:00", close: "21:00", isOpen: true },
      { day: "wednesday", open: "08:00", close: "21:00", isOpen: true },
      { day: "thursday", open: "08:00", close: "21:00", isOpen: true },
      { day: "friday", open: "08:00", close: "22:00", isOpen: true },
      { day: "saturday", open: "08:00", close: "22:00", isOpen: true },
      { day: "sunday", open: "09:00", close: "21:00", isOpen: true }
    ],
    images: [{ url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800", isPrimary: true }],
    amenities: ["WiFi", "AC", "Outdoor Seating"],
    rating: { average: 4.4, count: 67 },
    isVerified: true,
    isActive: true,
    isFeatured: true,
    views: 158
  }
];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Get a default owner (if none exists, create a temporary one or use first admin)
    let owner = await User.findOne({ role: 'admin' });
    if (!owner) {
      console.log('No admin user found. Creating temporary owner...');
      owner = new User({
        username: 'admin',
        email: 'admin@dineai.com',
        password: 'temppass123',
        role: 'admin'
      });
      await owner.save();
    }

    // Add owner to each restaurant
    const restaurantsWithOwner = newRestaurants.map(r => ({
      ...r,
      owner: owner._id
    }));

    // Use upsert to avoid duplicate key errors
    let insertedCount = 0;
    for (const restaurant of restaurantsWithOwner) {
      const result = await Restaurant.findOneAndUpdate(
        { slug: restaurant.slug },
        restaurant,
        { upsert: true, new: true }
      );
      console.log(`Processed: ${restaurant.name}`);
      insertedCount++;
    }

    console.log(`\nSuccessfully processed ${insertedCount} restaurants!`);

    // Verify
    const all = await Restaurant.find({});
    const active = await Restaurant.find({ isActive: true });
    console.log(`Total restaurants in database: ${all.length}`);
    console.log(`Active restaurants: ${active.length}`);

  } catch (error) {
    console.error('Error inserting restaurants:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedData();
