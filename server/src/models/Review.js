import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // References
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
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  
  // Rating Details
  overallRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  ratings: {
    food: {
      type: Number,
      min: 1,
      max: 5
    },
    service: {
      type: Number,
      min: 1,
      max: 5
    },
    ambiance: {
      type: Number,
      min: 1,
      max: 5
    },
    value: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  
  // Review Content
  title: {
    type: String,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    maxlength: 2000
  },
  
  // Media
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String
  }],
  
  // Visit Information
  visitDate: Date,
  visitType: {
    type: String,
    enum: ['dine-in', 'takeout', 'delivery']
  },
  
  // Social Engagement
  helpfulCount: {
    type: Number,
    default: 0
  },
  helpfulBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Restaurant Response
  restaurantReply: {
    comment: String,
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    repliedAt: Date
  },
  
  // Moderation
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged'],
    default: 'approved'
  },
  flaggedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  flagReason: String,
  
  // Verification
  isVerifiedVisit: {
    type: Boolean,
    default: false
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
  timestamps: true
});

// Indexes
reviewSchema.index({ restaurant: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ overallRating: -1 });

// Ensure one review per booking
reviewSchema.index({ booking: 1 }, { unique: true, sparse: true });

// Update restaurant rating after review is saved
reviewSchema.post('save', async function() {
  const Review = mongoose.model('Review');
  const Restaurant = mongoose.model('Restaurant');
  
  const stats = await Review.aggregate([
    { $match: { restaurant: this.restaurant } },
    {
      $group: {
        _id: '$restaurant',
        averageRating: { $avg: '$overallRating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);
  
  if (stats.length > 0) {
    // Calculate rating distribution
    const distribution = await Review.aggregate([
      { $match: { restaurant: this.restaurant } },
      {
        $group: {
          _id: '$overallRating',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    distribution.forEach(d => {
      dist[d._id] = d.count;
    });
    
    await Restaurant.findByIdAndUpdate(this.restaurant, {
      'rating.average': Math.round(stats[0].averageRating * 10) / 10,
      'rating.count': stats[0].totalReviews,
      'rating.distribution': dist
    });
  }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
