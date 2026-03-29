# Booking System - Installation & Testing Guide

## Installation

### 1. Install Redis (Optional but Recommended)

**Windows**:
```powershell
# Using Chocolatey
choco install redis-64

# Or download from: https://github.com/microsoftarchive/redis/releases
```

**macOS**:
```bash
brew install redis
brew services start redis
```

**Linux**:
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

### 2. Install Node Dependencies

The booking system uses `ioredis` for distributed locking:

```bash
cd server
npm install ioredis
```

> **Note**: If Redis is not available, the system automatically falls back to in-memory locking (suitable for development).

### 3. Environment Variables

Add to your `.env` file (optional):

```env
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## Testing the System

### 1. Start the Server

```bash
cd server
npm run dev
```

### 2. Test Availability Endpoints

#### Get Available Slots

```bash
# Replace RESTAURANT_ID with actual ID from your database
curl "http://localhost:5000/api/bookings/slots/RESTAURANT_ID?date=2024-02-20&partySize=4"
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "date": "2024-02-20T00:00:00.000Z",
    "isOpen": true,
    "slots": [
      { "time": "18:00", "availableSeats": 100 },
      { "time": "18:30", "availableSeats": 100 },
      { "time": "19:00", "availableSeats": 100 }
    ]
  }
}
```

#### Check Specific Slot

```bash
curl "http://localhost:5000/api/bookings/check-availability/RESTAURANT_ID?date=2024-02-20&time=19:00&partySize=4"
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "available": true,
    "availableSeats": 100,
    "totalSeats": 100,
    "bookedSeats": 0,
    "timeSlot": "19:00",
    "date": "2024-02-20T00:00:00.000Z"
  }
}
```

### 3. Test Booking Creation

First, get an auth token by logging in:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Then create a booking:

```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "RESTAURANT_ID",
    "bookingDate": "2024-02-20",
    "bookingTime": "19:00",
    "partySize": 4,
    "guestName": "John Doe",
    "guestPhone": "+1234567890",
    "guestEmail": "john@example.com",
    "specialRequests": "Window seat please"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Booking created successfully",
  "booking": {
    "_id": "...",
    "bookingId": "BK...",
    "restaurant": {...},
    "bookingDate": "2024-02-20",
    "bookingTime": "19:00",
    "partySize": 4,
    "status": "confirmed"
  }
}
```

### 4. Verify Availability Updated

Check the same slot again:

```bash
curl "http://localhost:5000/api/bookings/check-availability/RESTAURANT_ID?date=2024-02-20&time=19:00&partySize=4"
```

**Expected**: `availableSeats` should be reduced by 4

```json
{
  "success": true,
  "data": {
    "available": true,
    "availableSeats": 96,  // ← Reduced from 100
    "totalSeats": 100,
    "bookedSeats": 4,      // ← Increased from 0
    ...
  }
}
```

### 5. Test Concurrent Bookings

Create a test script to simulate concurrent requests:

**test-concurrent.js**:
```javascript
const axios = require('axios');

const token = 'YOUR_TOKEN_HERE';
const restaurantId = 'RESTAURANT_ID';

const bookingData = {
  restaurantId,
  bookingDate: '2024-02-20',
  bookingTime: '20:00',
  partySize: 50, // Half capacity
  guestName: 'Test User',
  guestPhone: '+1234567890',
  guestEmail: 'test@example.com'
};

// Send 2 requests simultaneously
Promise.all([
  axios.post('http://localhost:5000/api/bookings', bookingData, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  axios.post('http://localhost:5000/api/bookings', bookingData, {
    headers: { Authorization: `Bearer ${token}` }
  })
])
.then(([res1, res2]) => {
  console.log('Request 1:', res1.data);
  console.log('Request 2:', res2.data);
})
.catch(err => {
  console.error('Error:', err.response?.data || err.message);
});
```

Run:
```bash
node test-concurrent.js
```

**Expected**: One succeeds, one gets 409 Conflict error

### 6. Test Cancellation

```bash
curl -X PUT http://localhost:5000/api/bookings/BOOKING_ID/cancel \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected**: Booking cancelled, seats freed up

---

## Troubleshooting

### Redis Connection Issues

If you see warnings about Redis:
```
Redis unavailable, using in-memory locking
```

This is normal if Redis is not installed. The system will work fine for development, but for production, install Redis for distributed locking.

### Booking Creation Fails

**Error**: "Not enough seats available"
- **Solution**: Check if the time slot is already fully booked

**Error**: "This time slot is currently being booked"
- **Solution**: Wait a moment and try again (lock timeout is 5 seconds)

**Error**: "Bookings must be made at least X hours in advance"
- **Solution**: Choose a future date/time that meets the restaurant's advance booking requirement

### No Available Slots

If `getAvailableSlots` returns empty array:
1. Check if restaurant has operating hours configured for that day
2. Verify the date is not in the past
3. Check if all slots are fully booked

---

## Database Verification

### Check TimeSlot Documents

```javascript
// In MongoDB shell or Compass
db.timeslots.find({ 
  restaurant: ObjectId("RESTAURANT_ID"),
  date: ISODate("2024-02-20")
}).pretty()
```

### Check Booking Documents

```javascript
db.bookings.find({
  restaurant: ObjectId("RESTAURANT_ID"),
  bookingDate: ISODate("2024-02-20")
}).pretty()
```

---

## Performance Testing

### Load Test with Artillery

Install Artillery:
```bash
npm install -g artillery
```

Create `load-test.yml`:
```yaml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Check availability"
    flow:
      - get:
          url: "/api/bookings/slots/RESTAURANT_ID?date=2024-02-20&partySize=4"
```

Run:
```bash
artillery run load-test.yml
```

---

## Next Steps

1. ✅ Test all endpoints manually
2. ✅ Verify concurrent booking prevention
3. ✅ Check availability updates correctly
4. ⏳ Write automated tests (optional)
5. ⏳ Set up background jobs for cleanup (optional)

The booking system is ready to use! 🚀
