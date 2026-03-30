import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/authRoutes.js';
import restaurantRoutes from './src/routes/restaurantRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';
import reviewRoutes from './src/routes/reviewRoutes.js';
import aiChatRoutes from './src/routes/aiChatRoutes.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import './src/config/redis.js'; // Initialize Redis connection

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  // Vercel production and preview deployments
  'https://diningbooking.vercel.app',
  'https://diningbooking-git-main-hirthicks-projects-a7b6dc59.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    // Allow any *.vercel.app preview deploy automatically
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    console.warn(`[CORS] Blocked request from: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Restaurant Booking API', 
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      restaurants: '/api/restaurants',
      bookings: '/api/bookings',
      reviews: '/api/reviews',
      ai: '/api/ai'

      
    }
  });
});

app.get('/api/debug', async (req, res) => {
  try {
    const { default: Restaurant } = await import('./src/models/Restaurant.js');

    const dbState = mongoose.connection.readyState;
    // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting

    const count = await Restaurant.countDocuments();
    const sample = await Restaurant.findOne().lean();

    res.json({
      dbState,
      restaurantCount: count,
      sampleDoc: sample,
      env: {
        hasMongoUri: !!process.env.MONGODB_URI,
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasGeminiKey: !!process.env.GEMINI_API_KEY,
        nodeEnv: process.env.NODE_ENV,
        frontendUrl: process.env.FRONTEND_URL
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiChatRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app;
