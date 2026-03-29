import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Restaurant from '../models/Restaurant.js';

dotenv.config();

const sampleRestaurants = [
  {
    name: "Barbeque Nation",
    cuisine: ["Indian", "BBQ", "Continental"],
    description: "India's favorite buffet restaurant chain offering unlimited grills and global cuisines. Experience live grills on your table with a wide variety of vegetarian and non-vegetarian options.",
    location: {
      address: "Phoenix Marketcity Mall, LBS Marg",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400070"
    },
    operatingHours: {
      monday: { opens: "12:00", closes: "23:00", isClosed: false },
      tuesday: { opens: "12:00", closes: "23:00", isClosed: false },
      wednesday: { opens: "12:00", closes: "23:00", isClosed: false },
      thursday: { opens: "12:00", closes: "23:00", isClosed: false },
      friday: { opens: "12:00", closes: "23:30", isClosed: false },
      saturday: { opens: "12:00", closes: "23:30", isClosed: false },
      sunday: { opens: "12:00", closes: "23:30", isClosed: false }
    },
    contactInfo: {
      phone: "+91-22-1234-5678",
      email: "mumbai@barbequenation.com"
    },
    images: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
    ],
    averageRating: 4.5,
    totalReviews: 1250,
    priceRange: "$$$",
    isActive: true
  },
  {
    name: "The Spice Route",
    cuisine: ["Indian", "Thai", "Asian"],
    description: "An exquisite fine dining restaurant offering authentic Asian flavors with a modern twist. Elegant ambiance perfect for special occasions.",
    location: {
      address: "Connaught Place, Block A",
      city: "Delhi",
      state: "Delhi",
      zipCode: "110001"
    },
    operatingHours: {
      monday: { opens: "12:00", closes: "22:30", isClosed: false },
      tuesday: { opens: "12:00", closes: "22:30", isClosed: false },
      wednesday: { opens: "12:00", closes: "22:30", isClosed: false },
      thursday: { opens: "12:00", closes: "22:30", isClosed: false },
      friday: { opens: "12:00", closes: "23:00", isClosed: false },
      saturday: { opens: "12:00", closes: "23:00", isClosed: false },
      sunday: { opens: "12:00", closes: "22:30", isClosed: false }
    },
    contactInfo: {
      phone: "+91-11-2345-6789",
      email: "reservations@spiceroute.com"
    },
    images: [
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800"
    ],
    averageRating: 4.7,
    totalReviews: 890,
    priceRange: "$$$$",
    isActive: true
  },
  {
    name: "Coastal Kitchen",
    cuisine: ["Seafood", "Continental", "Mediterranean"],
    description: "Fresh seafood and coastal delicacies in a relaxed beachside atmosphere. Specializing in grilled fish and Mediterranean cuisine.",
    location: {
      address: "Bandra West, Linking Road",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400050"
    },
    operatingHours: {
      monday: { opens: "11:30", closes: "23:00", isClosed: false },
      tuesday: { opens: "11:30", closes: "23:00", isClosed: false },
      wednesday: { opens: "11:30", closes: "23:00", isClosed: false },
      thursday: { opens: "11:30", closes: "23:00", isClosed: false },
      friday: { opens: "11:30", closes: "00:00", isClosed: false },
      saturday: { opens: "11:30", closes: "00:00", isClosed: false },
      sunday: { opens: "11:30", closes: "23:00", isClosed: false }
    },
    contactInfo: {
      phone: "+91-22-3456-7890",
      email: "info@coastalkitchen.com"
    },
    images: [
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800"
    ],
    averageRating: 4.3,
    totalReviews: 567,
    priceRange: "$$$",
    isActive: true
  },
  {
    name: "Punjab Grill",
    cuisine: ["North Indian", "Punjabi", "Mughlai"],
    description: "Authentic North Indian cuisine with rich flavors and traditional recipes. Famous for butter chicken and tandoori specialties.",
    location: {
      address: "MG Road, Brigade Road",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560001"
    },
    operatingHours: {
      monday: { opens: "12:00", closes: "22:30", isClosed: false },
      tuesday: { opens: "12:00", closes: "22:30", isClosed: false },
      wednesday: { opens: "12:00", closes: "22:30", isClosed: false },
      thursday: { opens: "12:00", closes: "22:30", isClosed: false },
      friday: { opens: "12:00", closes: "23:00", isClosed: false },
      saturday: { opens: "12:00", closes: "23:00", isClosed: false },
      sunday: { opens: "12:00", closes: "22:30", isClosed: false }
    },
    contactInfo: {
      phone: "+91-80-4567-8901",
      email: "bangalore@punjabgrill.com"
    },
    images: [
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800"
    ],
    averageRating: 4.6,
    totalReviews: 1034,
    priceRange: "$$",
    isActive: true
  },
  {
    name: "Italiano Bistro",
    cuisine: ["Italian", "Continental", "Pizza"],
    description: "Authentic Italian cuisine with handmade pasta and wood-fired pizzas. Cozy ambiance with an extensive wine selection.",
    location: {
      address: "Koramangala, 5th Block",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560095"
    },
    operatingHours: {
      monday: { opens: "12:00", closes: "22:00", isClosed: false },
      tuesday: { opens: "12:00", closes: "22:00", isClosed: false },
      wednesday: { opens: "12:00", closes: "22:00", isClosed: false },
      thursday: { opens: "12:00", closes: "22:00", isClosed: false },
      friday: { opens: "12:00", closes: "23:00", isClosed: false },
      saturday: { opens: "12:00", closes: "23:00", isClosed: false },
      sunday: { opens: "12:00", closes: "22:00", isClosed: false }
    },
    contactInfo: {
      phone: "+91-80-5678-9012",
      email: "reservations@italianobistro.com"
    },
    images: [
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800"
    ],
    averageRating: 4.4,
    totalReviews: 723,
    priceRange: "$$",
    isActive: true
  },
  {
    name: "The Royal Dine",
    cuisine: ["Indian", "Mughlai", "Continental"],
    description: "Experience royal dining with traditional Indian and Mughlai cuisines in a luxurious setting. Perfect for celebrations and special events.",
    location: {
      address: "Saket, Select Citywalk Mall",
      city: "Delhi",
      state: "Delhi",
      zipCode: "110017"
    },
    operatingHours: {
      monday: { opens: "11:00", closes: "23:00", isClosed: false },
      tuesday: { opens: "11:00", closes: "23:00", isClosed: false },
      wednesday: { opens: "11:00", closes: "23:00", isClosed: false },
      thursday: { opens: "11:00", closes: "23:00", isClosed: false },
      friday: { opens: "11:00", closes: "23:30", isClosed: false },
      saturday: { opens: "11:00", closes: "23:30", isClosed: false },
      sunday: { opens: "11:00", closes: "23:00", isClosed: false }
    },
    contactInfo: {
      phone: "+91-11-6789-0123",
      email: "contact@theroyaldine.com"
    },
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
      "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=800"
    ],
    averageRating: 4.8,
    totalReviews: 1456,
    priceRange: "$$$$",
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Clear existing restaurants
    await Restaurant.deleteMany({});
    console.log('🗑️  Cleared existing restaurants');

    // Insert sample restaurants
    const restaurants = await Restaurant.insertMany(sampleRestaurants);
    console.log(`✅ Added ${restaurants.length} sample restaurants`);

    console.log('\n📋 Sample Restaurants:');
    restaurants.forEach((restaurant, index) => {
      console.log(`${index + 1}. ${restaurant.name} - ${restaurant.location.city}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
