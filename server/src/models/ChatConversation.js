import mongoose from 'mongoose';

const aiConversationSchema = new mongoose.Schema({
  // Session Information
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Conversation Data
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    
    // AI Metadata
    tokens: {
      prompt: Number,
      completion: Number,
      total: Number
    },
    model: {
      type: String,
      default: 'gemini-pro'
    }
  }],
  
  // Context & Intent
  detectedIntent: {
    type: String,
    enum: ['search_restaurant', 'book_table', 'get_recommendations', 
           'check_availability', 'get_menu', 'general_query']
  },
  
  extractedEntities: {
    cuisine: [String],
    location: String,
    date: Date,
    time: String,
    partySize: Number,
    priceRange: Number,
    dietaryRestrictions: [String],
    restaurantName: String
  },
  
  // Recommendations Given
  recommendedRestaurants: [{
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant'
    },
    score: Number,
    reason: String
  }],
  
  // Booking Intent
  bookingIntent: {
    hasIntent: {
      type: Boolean,
      default: false
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant'
    },
    preferredDate: Date,
    preferredTime: String,
    partySize: Number,
    status: {
      type: String,
      enum: ['gathering_info', 'ready', 'completed', 'abandoned']
    }
  },
  
  // Session Status
  isActive: {
    type: Boolean,
    default: true
  },
  endedAt: Date,
  
  // Analytics
  totalMessages: {
    type: Number,
    default: 0
  },
  totalTokens: {
    type: Number,
    default: 0
  },
  duration: Number, // seconds
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
aiConversationSchema.index({ sessionId: 1 });
aiConversationSchema.index({ user: 1, createdAt: -1 });
aiConversationSchema.index({ isActive: 1 });

const AIConversation = mongoose.model('AIConversation', aiConversationSchema);

export default AIConversation;
