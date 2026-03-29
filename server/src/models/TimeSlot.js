import mongoose from 'mongoose';

/**
 * TimeSlot Schema
 * Tracks seat availability for each restaurant at specific date/time combinations
 */
const timeSlotSchema = new mongoose.Schema({
  // Restaurant reference
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
    index: true
  },
  
  // Date and time
  date: {
    type: Date,
    required: true,
    index: true
  },
  timeSlot: {
    type: String,
    required: true,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
  },
  
  // Capacity tracking
  totalSeats: {
    type: Number,
    required: true,
    min: 0
  },
  bookedSeats: {
    type: Number,
    default: 0,
    min: 0
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Booking references for quick lookup
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  
  // Status flags
  isAvailable: {
    type: Boolean,
    default: true,
    index: true
  },
  isClosed: {
    type: Boolean,
    default: false
  },
  
  // Metadata
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound unique index to prevent duplicate slots
timeSlotSchema.index({ restaurant: 1, date: 1, timeSlot: 1 }, { unique: true });

// Index for availability queries
timeSlotSchema.index({ isAvailable: 1, date: 1 });

// Index for cleanup queries
timeSlotSchema.index({ date: 1 });

// Virtual to check if slot is in the past
timeSlotSchema.virtual('isPast').get(function() {
  const slotDateTime = new Date(this.date);
  const [hours, minutes] = this.timeSlot.split(':');
  slotDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return slotDateTime < new Date();
});

// Method to update availability
timeSlotSchema.methods.updateAvailability = function() {
  this.availableSeats = this.totalSeats - this.bookedSeats;
  this.isAvailable = this.availableSeats > 0 && !this.isClosed;
  this.lastUpdated = new Date();
};

// Static method to find or create slot
timeSlotSchema.statics.findOrCreateSlot = async function(restaurantId, date, timeSlot, totalSeats) {
  let slot = await this.findOne({
    restaurant: restaurantId,
    date: new Date(date),
    timeSlot
  });
  
  if (!slot) {
    slot = await this.create({
      restaurant: restaurantId,
      date: new Date(date),
      timeSlot,
      totalSeats,
      bookedSeats: 0,
      availableSeats: totalSeats,
      isAvailable: true,
      isClosed: false
    });
  }
  
  return slot;
};

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);

export default TimeSlot;
