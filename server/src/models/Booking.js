import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  // Reference Information
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  
  // Booking Details
  bookingDate: {
    type: Date,
    required: true
  },
  bookingTime: {
    type: String,
    required: true,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
  },
  partySize: {
    type: Number,
    required: true,
    min: 1
  },
  duration: {
    type: Number,
    default: 120 // minutes
  },
  
  // Guest Information
  guestName: {
    type: String,
    required: true
  },
  guestPhone: {
    type: String,
    required: true
  },
  guestEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  specialRequests: {
    type: String,
    maxlength: 500
  },
  occasion: {
    type: String,
    enum: ['none', 'birthday', 'anniversary', 'date', 'business', 'celebration'],
    default: 'none'
  },
  
  // Seating Preferences
  seatingPreference: {
    type: String,
    enum: ['indoor', 'outdoor', 'window', 'bar', 'private', 'no_preference'],
    default: 'no_preference'
  },
  tableNumber: String,
  
  // Status & Workflow
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  
  // Payment Information
  paymentRequired: {
    type: Boolean,
    default: false
  },
  depositAmount: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['not_required', 'pending', 'paid', 'refunded'],
    default: 'not_required'
  },
  paymentId: String,
  
  // Communication
  confirmationSent: {
    type: Boolean,
    default: false
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  
  // Cancellation
  cancellationReason: String,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledAt: Date,
  refundAmount: {
    type: Number,
    default: 0
  },
  
  // AI-Assisted Booking
  isAIAssisted: {
    type: Boolean,
    default: false
  },
  aiConversationId: String,
  
  // Notes
  restaurantNotes: String,
  internalNotes: String,
  
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
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ restaurant: 1, bookingDate: 1 });
// bookingSchema.index({ bookingId: 1 }); // Already unique in schema
bookingSchema.index({ status: 1 });
bookingSchema.index({ bookingDate: 1, bookingTime: 1 });

// Pre-save hook to generate booking ID
bookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    this.bookingId = `BK-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
