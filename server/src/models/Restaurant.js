import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  // Contact & Location
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true
  },
  website: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true // [longitude, latitude]
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    landmark: String
  },
  
  // Classification
  cuisineTypes: [{
    type: String,
    required: true,
    enum: ['Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 
           'Thai', 'French', 'American', 'Mediterranean', 'Korean',
           'Vietnamese', 'Spanish', 'Greek', 'Lebanese', 'Other']
  }],
  mealTypes: [{
    type: String,
    enum: ['breakfast', 'brunch', 'lunch', 'dinner', 'dessert']
  }],
  dietaryOptions: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'halal', 
           'kosher', 'dairy-free', 'nut-free']
  }],
  
  // Pricing & Capacity
  priceRange: {
    type: Number,
    required: true,
    min: 1,
    max: 4 // 1=Budget, 2=Moderate, 3=Upscale, 4=Fine Dining
  },
  averageCostForTwo: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  
  seatingCapacity: {
    indoor: {
      type: Number,
      default: 0
    },
    outdoor: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  
  // Operating Hours
  operatingHours: [{
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6 // 0=Sunday, 6=Saturday
    },
    isOpen: {
      type: Boolean,
      default: true
    },
    shifts: [{
      openTime: {
        type: String,
        match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
      },
      closeTime: {
        type: String,
        match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
      }
    }]
  }],
  
  specialHours: [{
    date: {
      type: Date,
      required: true
    },
    reason: String, // 'holiday', 'special_event', etc.
    isOpen: {
      type: Boolean,
      default: false
    },
    openTime: String,
    closeTime: String
  }],
  
  // Media
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    category: {
      type: String,
      enum: ['exterior', 'interior', 'food', 'ambiance', 'other'],
      default: 'other'
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Menu
  menu: [{
    category: {
      type: String,
      required: true // 'Appetizers', 'Main Course', etc.
    },
    items: [{
      name: {
        type: String,
        required: true
      },
      description: String,
      price: {
        type: Number,
        required: true
      },
      image: String,
      isAvailable: {
        type: Boolean,
        default: true
      },
      isVegetarian: {
        type: Boolean,
        default: false
      },
      isVegan: {
        type: Boolean,
        default: false
      },
      spiceLevel: {
        type: Number,
        min: 0,
        max: 5
      },
      allergens: [String],
      preparationTime: Number // in minutes
    }]
  }],
  
  menuPDFUrl: String,
  
  // Amenities & Features
  amenities: [{
    type: String,
    enum: ['wifi', 'parking', 'outdoor_seating', 'wheelchair_accessible',
           'pet_friendly', 'live_music', 'bar', 'takeout', 'delivery',
           'reservations', 'credit_cards', 'valet_parking', 'private_dining',
           'kids_friendly', 'smoking_area', 'air_conditioning']
  }],
  
  // Booking Configuration
  bookingSettings: {
    isBookingEnabled: {
      type: Boolean,
      default: true
    },
    minAdvanceBooking: {
      type: Number,
      default: 0 // hours
    },
    maxAdvanceBooking: {
      type: Number,
      default: 720 // hours (30 days)
    },
    slotDuration: {
      type: Number,
      default: 120 // minutes
    },
    minPartySize: {
      type: Number,
      default: 1
    },
    maxPartySize: {
      type: Number,
      default: 20
    },
    requiresDeposit: {
      type: Boolean,
      default: false
    },
    depositAmount: {
      type: Number,
      default: 0
    },
    cancellationPolicy: {
      allowCancellation: {
        type: Boolean,
        default: true
      },
      cancellationDeadline: {
        type: Number,
        default: 24 // hours before
      },
      refundPercentage: {
        type: Number,
        default: 100
      }
    }
  },
  
  // Real-time Seat Availability
  currentAvailability: {
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    availableSeats: {
      type: Number,
      default: 0
    },
    bookedSeats: {
      type: Number,
      default: 0
    },
    upcomingSlots: [{
      time: String,
      availableSeats: Number
    }]
  },
  
  // Ratings & Reviews
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    distribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },
  
  // Ownership
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  managementTeam: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['owner', 'manager', 'staff']
    },
    permissions: [String]
  }],
  
  // Status & Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
restaurantSchema.index({ 'location.coordinates': '2dsphere' });
restaurantSchema.index({ slug: 1 });
restaurantSchema.index({ name: 'text', description: 'text' });
restaurantSchema.index({ cuisineTypes: 1 });
restaurantSchema.index({ priceRange: 1 });
restaurantSchema.index({ 'rating.average': -1 });
restaurantSchema.index({ createdAt: -1 });

// Virtual for reviews
restaurantSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'restaurant'
});

// Pre-save hook to generate slug
restaurantSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
