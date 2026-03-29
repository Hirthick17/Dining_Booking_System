/**
 * MongoDB Schema Definitions
 * 
 * This file documents the database schema structure for the Restaurant Booking System.
 * The actual schemas are implemented using Mongoose models in the /models directory.
 * 
 * Database: restaurant-booking
 * Collections: users, restaurants, bookings
 */

// ============================================
// COLLECTION: users
// ============================================
const userSchema = {
  _id: "ObjectId",
  firstName: "String (required, trimmed)",
  lastName: "String (required, trimmed)",
  email: "String (required, unique, lowercase, validated email format)",
  phone: "String (required, unique, trimmed)",
  password: "String (required, hashed with bcrypt, min 6 chars, not returned by default)",
  bookingHistory: "[ObjectId] (references bookings collection)",
  createdAt: "Date (auto-generated)",
  updatedAt: "Date (auto-generated)",
  __v: "Number (version key)"
};

// Indexes:
// - email: unique index
// - phone: unique index

// ============================================
// COLLECTION: restaurants
// ============================================
const restaurantSchema = {
  _id: "ObjectId",
  name: "String (required, trimmed, indexed for search)",
  cuisine: "[String] (array of cuisine types, required)",
  description: "String (required)",
  location: {
    address: "String (required)",
    city: "String (required, indexed)",
    state: "String (required)",
    zipCode: "String (required)"
  },
  operatingHours: {
    monday: {
      opens: "String (time format: HH:MM)",
      closes: "String (time format: HH:MM)",
      isClosed: "Boolean (default: false)"
    },
    tuesday: "{ opens, closes, isClosed }",
    wednesday: "{ opens, closes, isClosed }",
    thursday: "{ opens, closes, isClosed }",
    friday: "{ opens, closes, isClosed }",
    saturday: "{ opens, closes, isClosed }",
    sunday: "{ opens, closes, isClosed }"
  },
  contactInfo: {
    phone: "String (required)",
    email: "String (required)"
  },
  images: "[String] (array of image URLs)",
  averageRating: "Number (default: 0, min: 0, max: 5)",
  totalReviews: "Number (default: 0)",
  priceRange: "String (enum: ['$', '$$', '$$$', '$$$$'], default: '$$')",
  isActive: "Boolean (default: true)",
  createdAt: "Date (auto-generated)",
  updatedAt: "Date (auto-generated)",
  __v: "Number (version key)"
};

// Indexes:
// - name: text index (for search)
// - description: text index (for search)
// - location.city: regular index

// ============================================
// COLLECTION: bookings
// ============================================
const bookingSchema = {
  _id: "ObjectId",
  bookingReference: "String (required, unique, auto-generated, indexed, format: BR + 8 random chars + 4 timestamp digits)",
  restaurant: "ObjectId (required, references restaurants collection)",
  customer: "ObjectId (required, references users collection)",
  reservationDetails: {
    date: "Date (required, indexed)",
    time: "String (required, format: HH:MM)",
    partySize: "Number (required, min: 1, max: 20)"
  },
  specialRequests: "String (optional, default: '')",
  status: "String (enum: ['confirmed', 'completed', 'cancelled'], default: 'confirmed')",
  cancellationReason: "String (optional)",
  createdAt: "Date (auto-generated)",
  updatedAt: "Date (auto-generated)",
  __v: "Number (version key)"
};

// Indexes:
// - bookingReference: unique index
// - customer + createdAt: compound index (descending on createdAt)
// - restaurant + reservationDetails.date: compound index
// - status: regular index

// ============================================
// RELATIONSHIPS
// ============================================
/**
 * User → Bookings (One-to-Many)
 * - User.bookingHistory contains array of Booking._id
 * - Booking.customer references User._id
 * 
 * Restaurant → Bookings (One-to-Many)
 * - Booking.restaurant references Restaurant._id
 * 
 * Populated Queries:
 * - User bookings: populate('bookingHistory').populate({ path: 'bookingHistory', populate: 'restaurant' })
 * - Booking details: populate('restaurant').populate('customer')
 */

// ============================================
// VALIDATION RULES
// ============================================
/**
 * Users:
 * - Email must be valid format and unique
 * - Phone must be unique
 * - Password minimum 6 characters, hashed before storage
 * 
 * Restaurants:
 * - At least one cuisine type required
 * - Price range must be one of: $, $$, $$$, $$$$
 * - Rating between 0 and 5
 * 
 * Bookings:
 * - Party size between 1 and 20
 * - Date cannot be in the past (enforced at application level)
 * - Status must be: confirmed, completed, or cancelled
 * - Booking reference auto-generated and unique
 */

// ============================================
// SAMPLE DOCUMENTS
// ============================================

// Sample User Document
const sampleUser = {
  _id: "507f1f77bcf86cd799439011",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+91-98765-43210",
  password: "$2a$10$hashed_password_here",
  bookingHistory: [
    "507f191e810c19729de860ea",
    "507f191e810c19729de860eb"
  ],
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-15T10:30:00.000Z",
  __v: 0
};

// Sample Restaurant Document
const sampleRestaurant = {
  _id: "507f191e810c19729de860ea",
  name: "Barbeque Nation",
  cuisine: ["Indian", "BBQ", "Continental"],
  description: "India's favorite buffet restaurant chain offering unlimited grills and global cuisines.",
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
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800"
  ],
  averageRating: 4.5,
  totalReviews: 1250,
  priceRange: "$$$",
  isActive: true,
  createdAt: "2024-01-10T08:00:00.000Z",
  updatedAt: "2024-01-10T08:00:00.000Z",
  __v: 0
};

// Sample Booking Document
const sampleBooking = {
  _id: "507f191e810c19729de860eb",
  bookingReference: "BRA3X9K2LM7891",
  restaurant: "507f191e810c19729de860ea",
  customer: "507f1f77bcf86cd799439011",
  reservationDetails: {
    date: "2024-02-14T00:00:00.000Z",
    time: "19:30",
    partySize: 4
  },
  specialRequests: "Window seat preferred, celebrating anniversary",
  status: "confirmed",
  createdAt: "2024-01-15T14:20:00.000Z",
  updatedAt: "2024-01-15T14:20:00.000Z",
  __v: 0
};

export { userSchema, restaurantSchema, bookingSchema };
