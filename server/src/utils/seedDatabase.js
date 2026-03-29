import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Restaurant from '../models/Restaurant.js';

dotenv.config();

const sampleRestaurants = [
  {
    name: "Bella Italia",
    description: "Authentic Italian cuisine with a modern twist. Experience the flavors of Italy in a cozy, romantic setting.",
    cuisine: ["Italian"],
    priceRange: 3,
    location: {
      address: "123 Main Street, Downtown",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001"
    },
    operatingHours: {
      monday: { open: "11:00", close: "23:00", isClosed: false },
      tuesday: { open: "11:00", close: "23:00", isClosed: false },
      wednesday: { open: "11:00", close: "23:00", isClosed: false },
      thursday: { open: "11:00", close: "23:00", isClosed: false },
      friday: { open: "11:00", close: "00:00", isClosed: false },
      saturday: { open: "11:00", close: "00:00", isClosed: false },
      sunday: { open: "12:00", close: "23:00", isClosed: false }
    },
    contactInfo: {
      phone: "+91-22-1234-5678",
      email: "info@bellaitalia.com"
    },
    images: ["/images/bella-italia.jpg"],
    menu: [
      {
        category: "Appetizers",
        items: [
          { name: "Bruschetta", description: "Toasted bread with tomatoes and basil", price: 350, isVegetarian: true },
          { name: "Caprese Salad", description: "Fresh mozzarella, tomatoes, and basil", price: 450, isVegetarian: true },
          { name: "Garlic Bread", description: "Crispy bread with garlic butter", price: 250, isVegetarian: true }
        ]
      },
      {
        category: "Main Course",
        items: [
          { name: "Spaghetti Carbonara", description: "Classic pasta with bacon and cream", price: 650, isVegetarian: false },
          { name: "Margherita Pizza", description: "Traditional pizza with tomato and mozzarella", price: 550, isVegetarian: true },
          { name: "Lasagna", description: "Layered pasta with meat sauce and cheese", price: 750, isVegetarian: false },
          { name: "Penne Arrabbiata", description: "Spicy tomato sauce pasta", price: 550, isVegetarian: true, isVegan: true }
        ]
      },
      {
        category: "Desserts",
        items: [
          { name: "Tiramisu", description: "Classic Italian coffee-flavored dessert", price: 400, isVegetarian: true },
          { name: "Panna Cotta", description: "Creamy vanilla dessert", price: 350, isVegetarian: true }
        ]
      }
    ],
    seatingCapacity: 60,
    rating: { average: 4.7, count: 245 },
    amenities: ["wifi", "parking", "outdoor_seating", "bar", "reservations"],
    isActive: true
  },
  {
    name: "Spice Garden",
    description: "Traditional Indian flavors with contemporary presentation. A culinary journey through India's diverse regions.",
    cuisine: ["Indian"],
    priceRange: 2,
    location: {
      address: "45 MG Road",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560001"
    },
    operatingHours: {
      monday: { open: "12:00", close: "23:00", isClosed: false },
      tuesday: { open: "12:00", close: "23:00", isClosed: false },
      wednesday: { open: "12:00", close: "23:00", isClosed: false },
      thursday: { open: "12:00", close: "23:00", isClosed: false },
      friday: { open: "12:00", close: "00:00", isClosed: false },
      saturday: { open: "12:00", close: "00:00", isClosed: false },
      sunday: { open: "12:00", close: "23:00", isClosed: false }
    },
    contactInfo: {
      phone: "+91-80-9876-5432",
      email: "contact@spicegarden.in"
    },
    images: ["/images/spice-garden.jpg"],
    menu: [
      {
        category: "Starters",
        items: [
          { name: "Paneer Tikka", description: "Grilled cottage cheese with spices", price: 320, isVegetarian: true },
          { name: "Chicken Tikka", description: "Marinated grilled chicken", price: 380, isVegetarian: false },
          { name: "Samosa", description: "Crispy pastry with potato filling", price: 150, isVegetarian: true, isVegan: true }
        ]
      },
      {
        category: "Main Course",
        items: [
          { name: "Butter Chicken", description: "Creamy tomato-based chicken curry", price: 480, isVegetarian: false },
          { name: "Dal Makhani", description: "Black lentils in creamy sauce", price: 350, isVegetarian: true },
          { name: "Biryani", description: "Fragrant rice with spices and meat", price: 450, isVegetarian: false },
          { name: "Palak Paneer", description: "Cottage cheese in spinach gravy", price: 380, isVegetarian: true }
        ]
      },
      {
        category: "Breads",
        items: [
          { name: "Naan", description: "Soft leavened bread", price: 60, isVegetarian: true },
          { name: "Garlic Naan", description: "Naan with garlic topping", price: 80, isVegetarian: true },
          { name: "Roti", description: "Whole wheat flatbread", price: 40, isVegetarian: true, isVegan: true }
        ]
      }
    ],
    seatingCapacity: 80,
    rating: { average: 4.5, count: 312 },
    amenities: ["wifi", "parking", "wheelchair_accessible", "takeout", "delivery", "reservations"],
    isActive: true
  },
  {
    name: "Dragon Wok",
    description: "Authentic Chinese cuisine with a focus on Szechuan and Cantonese flavors. Fresh ingredients, bold tastes.",
    cuisine: ["Chinese"],
    priceRange: 2,
    location: {
      address: "78 Park Street",
      city: "Delhi",
      state: "Delhi",
      zipCode: "110001"
    },
    operatingHours: {
      monday: { open: "12:00", close: "22:30", isClosed: false },
      tuesday: { open: "12:00", close: "22:30", isClosed: false },
      wednesday: { open: "12:00", close: "22:30", isClosed: false },
      thursday: { open: "12:00", close: "22:30", isClosed: false },
      friday: { open: "12:00", close: "23:30", isClosed: false },
      saturday: { open: "12:00", close: "23:30", isClosed: false },
      sunday: { open: "12:00", close: "22:30", isClosed: false }
    },
    contactInfo: {
      phone: "+91-11-5555-6666",
      email: "hello@dragonwok.in"
    },
    images: ["/images/dragon-wok.jpg"],
    menu: [
      {
        category: "Appetizers",
        items: [
          { name: "Spring Rolls", description: "Crispy vegetable rolls", price: 280, isVegetarian: true, isVegan: true },
          { name: "Dim Sum", description: "Steamed dumplings (veg/non-veg)", price: 350, isVegetarian: false },
          { name: "Manchurian", description: "Fried vegetable balls in sauce", price: 320, isVegetarian: true }
        ]
      },
      {
        category: "Main Course",
        items: [
          { name: "Kung Pao Chicken", description: "Spicy chicken with peanuts", price: 480, isVegetarian: false },
          { name: "Hakka Noodles", description: "Stir-fried noodles with vegetables", price: 350, isVegetarian: true, isVegan: true },
          { name: "Fried Rice", description: "Wok-tossed rice with vegetables", price: 320, isVegetarian: true },
          { name: "Sweet and Sour Chicken", description: "Crispy chicken in tangy sauce", price: 450, isVegetarian: false }
        ]
      }
    ],
    seatingCapacity: 70,
    rating: { average: 4.3, count: 189 },
    amenities: ["wifi", "takeout", "delivery", "reservations"],
    isActive: true
  },
  {
    name: "Taco Fiesta",
    description: "Vibrant Mexican street food and traditional dishes. Fresh, flavorful, and fun!",
    cuisine: ["Mexican"],
    priceRange: 2,
    location: {
      address: "22 Brigade Road",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560025"
    },
    operatingHours: {
      monday: { open: "12:00", close: "23:00", isClosed: false },
      tuesday: { open: "12:00", close: "23:00", isClosed: false },
      wednesday: { open: "12:00", close: "23:00", isClosed: false },
      thursday: { open: "12:00", close: "23:00", isClosed: false },
      friday: { open: "12:00", close: "00:00", isClosed: false },
      saturday: { open: "12:00", close: "00:00", isClosed: false },
      sunday: { open: "12:00", close: "23:00", isClosed: false }
    },
    contactInfo: {
      phone: "+91-80-7777-8888",
      email: "info@tacofiesta.in"
    },
    images: ["/images/taco-fiesta.jpg"],
    menu: [
      {
        category: "Tacos",
        items: [
          { name: "Chicken Tacos", description: "Grilled chicken with salsa", price: 350, isVegetarian: false },
          { name: "Veggie Tacos", description: "Mixed vegetables with guacamole", price: 300, isVegetarian: true, isVegan: true },
          { name: "Fish Tacos", description: "Battered fish with cabbage slaw", price: 400, isVegetarian: false }
        ]
      },
      {
        category: "Mains",
        items: [
          { name: "Burrito Bowl", description: "Rice, beans, meat, and toppings", price: 450, isVegetarian: false },
          { name: "Quesadilla", description: "Grilled tortilla with cheese", price: 380, isVegetarian: true },
          { name: "Nachos Supreme", description: "Tortilla chips with toppings", price: 420, isVegetarian: true }
        ]
      }
    ],
    seatingCapacity: 50,
    rating: { average: 4.6, count: 156 },
    amenities: ["wifi", "outdoor_seating", "bar", "takeout", "delivery"],
    isActive: true
  },
  {
    name: "Sakura Sushi",
    description: "Premium Japanese cuisine featuring fresh sushi, sashimi, and traditional dishes.",
    cuisine: ["Japanese"],
    priceRange: 4,
    location: {
      address: "15 Linking Road, Bandra",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400050"
    },
    operatingHours: {
      monday: { open: "18:00", close: "23:30", isClosed: false },
      tuesday: { open: "18:00", close: "23:30", isClosed: false },
      wednesday: { open: "18:00", close: "23:30", isClosed: false },
      thursday: { open: "18:00", close: "23:30", isClosed: false },
      friday: { open: "18:00", close: "00:30", isClosed: false },
      saturday: { open: "18:00", close: "00:30", isClosed: false },
      sunday: { open: "18:00", close: "23:30", isClosed: false }
    },
    contactInfo: {
      phone: "+91-22-9999-0000",
      email: "reservations@sakurasushi.in"
    },
    images: ["/images/sakura-sushi.jpg"],
    menu: [
      {
        category: "Sushi Rolls",
        items: [
          { name: "California Roll", description: "Crab, avocado, cucumber", price: 650, isVegetarian: false },
          { name: "Vegetable Roll", description: "Assorted vegetables", price: 500, isVegetarian: true, isVegan: true },
          { name: "Spicy Tuna Roll", description: "Tuna with spicy mayo", price: 750, isVegetarian: false }
        ]
      },
      {
        category: "Main Dishes",
        items: [
          { name: "Teriyaki Chicken", description: "Grilled chicken with teriyaki sauce", price: 850, isVegetarian: false },
          { name: "Ramen", description: "Noodle soup with toppings", price: 700, isVegetarian: false },
          { name: "Tempura", description: "Battered and fried vegetables/seafood", price: 800, isVegetarian: false }
        ]
      }
    ],
    seatingCapacity: 40,
    rating: { average: 4.8, count: 98 },
    amenities: ["wifi", "bar", "reservations", "wheelchair_accessible"],
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing restaurants
    await Restaurant.deleteMany({});
    console.log('🗑️  Cleared existing restaurants');

    // Insert sample restaurants
    const restaurants = await Restaurant.insertMany(sampleRestaurants);
    console.log(`✅ Inserted ${restaurants.length} sample restaurants`);

    console.log('\n📊 Sample Restaurants:');
    restaurants.forEach(r => {
      console.log(`   - ${r.name} (${r.cuisine.join(', ')}) - ${r.location.city}`);
    });

    console.log('\n✨ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
