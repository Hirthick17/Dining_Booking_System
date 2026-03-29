# MongoDB Database Schema Documentation

## Database Overview

**Database Name:** `restaurant-booking`  
**Collections:** 3 (users, restaurants, bookings)  
**ODM:** Mongoose

---

## Collections

### 1. Users Collection

Stores user account information and authentication data.

```javascript
{
  _id: ObjectId,
  firstName: String,        // Required, trimmed
  lastName: String,         // Required, trimmed
  email: String,            // Required, unique, lowercase, validated
  phone: String,            // Required, unique
  password: String,         // Required, bcrypt hashed, min 6 chars
  bookingHistory: [ObjectId], // References to bookings
  createdAt: Date,          // Auto-generated
  updatedAt: Date           // Auto-generated
}
```

**Indexes:**
- `email` (unique)
- `phone` (unique)

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+91-98765-43210",
  "password": "$2a$10$hashed_password",
  "bookingHistory": ["507f191e810c19729de860ea"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. Restaurants Collection

Stores restaurant information including location, hours, and contact details.

```javascript
{
  _id: ObjectId,
  name: String,             // Required, indexed for search
  cuisine: [String],        // Required, array of cuisine types
  description: String,      // Required, indexed for search
  location: {
    address: String,        // Required
    city: String,           // Required, indexed
    state: String,          // Required
    zipCode: String         // Required
  },
  operatingHours: {
    monday: { opens: String, closes: String, isClosed: Boolean },
    tuesday: { opens: String, closes: String, isClosed: Boolean },
    // ... (same for all days)
  },
  contactInfo: {
    phone: String,          // Required
    email: String           // Required
  },
  images: [String],         // Array of image URLs
  averageRating: Number,    // 0-5, default: 0
  totalReviews: Number,     // Default: 0
  priceRange: String,       // Enum: $, $$, $$$, $$$$
  isActive: Boolean,        // Default: true
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `name, description` (text index for search)
- `location.city`
- `isActive`

**Sample Document:**
```json
{
  "_id": "507f191e810c19729de860ea",
  "name": "Barbeque Nation",
  "cuisine": ["Indian", "BBQ", "Continental"],
  "description": "Unlimited grills and global cuisines",
  "location": {
    "address": "Phoenix Marketcity Mall",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400070"
  },
  "operatingHours": {
    "monday": { "opens": "12:00", "closes": "23:00", "isClosed": false }
  },
  "contactInfo": {
    "phone": "+91-22-1234-5678",
    "email": "mumbai@barbequenation.com"
  },
  "images": ["https://example.com/image.jpg"],
  "averageRating": 4.5,
  "totalReviews": 1250,
  "priceRange": "$$$",
  "isActive": true
}
```

---

### 3. Bookings Collection

Stores reservation information linking users to restaurants.

```javascript
{
  _id: ObjectId,
  bookingReference: String,  // Unique, auto-generated (BR + random)
  restaurant: ObjectId,      // Reference to restaurants
  customer: ObjectId,        // Reference to users
  reservationDetails: {
    date: Date,              // Required, indexed
    time: String,            // Required, format: HH:MM
    partySize: Number        // Required, 1-20
  },
  specialRequests: String,   // Optional
  status: String,            // Enum: confirmed, completed, cancelled
  cancellationReason: String, // Optional
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `bookingReference` (unique)
- `customer, createdAt` (compound, descending on createdAt)
- `restaurant, reservationDetails.date` (compound)
- `status`
- `reservationDetails.date`

**Sample Document:**
```json
{
  "_id": "507f191e810c19729de860eb",
  "bookingReference": "BRA3X9K2LM7891",
  "restaurant": "507f191e810c19729de860ea",
  "customer": "507f1f77bcf86cd799439011",
  "reservationDetails": {
    "date": "2024-02-14T00:00:00.000Z",
    "time": "19:30",
    "partySize": 4
  },
  "specialRequests": "Window seat preferred",
  "status": "confirmed",
  "createdAt": "2024-01-15T14:20:00.000Z",
  "updatedAt": "2024-01-15T14:20:00.000Z"
}
```

---

## Relationships

### User ↔ Bookings (One-to-Many)
- `User.bookingHistory` contains array of `Booking._id`
- `Booking.customer` references `User._id`

### Restaurant ↔ Bookings (One-to-Many)
- `Booking.restaurant` references `Restaurant._id`

### ER Diagram
```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│    User     │         │   Booking    │         │  Restaurant  │
├─────────────┤         ├──────────────┤         ├──────────────┤
│ _id         │◄───────┤│ customer     │         │ _id          │
│ firstName   │         │ restaurant   │────────►│ name         │
│ lastName    │         │ reference    │         │ cuisine[]    │
│ email       │         │ details      │         │ location     │
│ phone       │         │ status       │         │ hours        │
│ password    │         │ requests     │         │ contact      │
│ history[]   │         └──────────────┘         │ images[]     │
└─────────────┘                                  │ rating       │
                                                 └──────────────┘
```

---

## Validation Rules

### Users
- Email: Valid format, unique, lowercase
- Phone: Unique, trimmed
- Password: Minimum 6 characters, bcrypt hashed (10 rounds)

### Restaurants
- Cuisine: At least one type required
- Price Range: Must be $, $$, $$$, or $$$$
- Rating: Between 0 and 5

### Bookings
- Party Size: Between 1 and 20
- Status: Must be confirmed, completed, or cancelled
- Booking Reference: Auto-generated, unique, format: BR + 8 chars + 4 digits

---

## Query Optimization

### Common Queries

**Find user's bookings:**
```javascript
Booking.find({ customer: userId })
  .populate('restaurant', 'name location images')
  .sort({ 'reservationDetails.date': -1 });
```

**Search restaurants:**
```javascript
Restaurant.find({
  $text: { $search: searchTerm },
  'location.city': city,
  isActive: true
}).sort({ averageRating: -1 });
```

**Get booking with full details:**
```javascript
Booking.findById(bookingId)
  .populate('restaurant')
  .populate('customer', 'firstName lastName email phone');
```

---

## Scripts

### Create Indexes
```bash
node src/database/createIndexes.js
```

### Seed Sample Data
```bash
npm run seed
```

---

## Performance Considerations

1. **Text Search**: Indexed on restaurant name and description
2. **City Filter**: Indexed for fast location-based queries
3. **User Bookings**: Compound index on customer + createdAt for efficient sorting
4. **Date Queries**: Indexed for reservation date lookups
5. **Status Filter**: Indexed for booking status queries
