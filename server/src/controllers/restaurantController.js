import Restaurant from '../models/Restaurant.js';

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
export const getRestaurants = async (req, res, next) => {
  try {
    const { city, cuisine, search } = req.query;
    
    // Build query
    let query = { isActive: true };
    
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    
    if (cuisine) {
      query.cuisineTypes = { $in: [cuisine] };
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    const limit = parseInt(req.query.limit) || 20;

    const restaurants = await Restaurant.find(query)
      .select('name slug location cuisineTypes priceRange averageCostForTwo images rating operatingHours isFeatured')
      .sort({ 'rating.average': -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
export const getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.status(200).json({
      success: true,
      restaurant
    });
  } catch (error) {
    next(error);
  }
};

export const getCities = async (req, res, next) => {
  try {
    const cities = await Restaurant.distinct('location.city', { isActive: true });
    
    res.status(200).json({
      success: true,
      cities: cities.sort()
    });
  } catch (error) {
    next(error);
  }
};

export const getCuisines = async (req, res, next) => {
  try {
    const cuisines = await Restaurant.distinct('cuisineTypes', { isActive: true });
    
    res.status(200).json({
      success: true,
      cuisines: cuisines.sort()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get restaurant availability (for polling)
// @route   GET /api/restaurants/:id/availability
// @access  Public
export const getAvailability = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .select('currentAvailability seatingCapacity bookingSettings');

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    const availability = {
      lastUpdated: restaurant.currentAvailability?.lastUpdated || new Date(),
      availableSeats: restaurant.currentAvailability?.availableSeats || restaurant.seatingCapacity?.total || 0,
      bookedSeats: restaurant.currentAvailability?.bookedSeats || 0,
      totalSeats: restaurant.seatingCapacity?.total || 0,
      upcomingSlots: restaurant.currentAvailability?.upcomingSlots || [],
      isBookingEnabled: restaurant.bookingSettings?.isBookingEnabled !== false
    };

    // Generate ETag for caching
    const etag = `"${Buffer.from(JSON.stringify(availability)).toString('base64')}"`;
    
    // Check if client has cached version
    if (req.headers['if-none-match'] === etag) {
      return res.status(304).end(); // Not Modified
    }

    res.setHeader('ETag', etag);
    res.setHeader('Cache-Control', 'no-cache'); // Must revalidate
    
    res.status(200).json({
      success: true,
      availability
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured restaurants
// @route   GET /api/restaurants/featured
// @access  Public
export const getFeaturedRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ 
      isActive: true, 
      isFeatured: true 
    })
      .select('-__v')
      .sort({ 'rating.average': -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending restaurants
// @route   GET /api/restaurants/trending
// @access  Public
export const getTrendingRestaurants = async (req, res, next) => {
  try {
    // Get restaurants sorted by recent bookings and high ratings
    const restaurants = await Restaurant.find({ isActive: true })
      .select('-__v')
      .sort({ totalBookings: -1, 'rating.average': -1, views: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants
    });
  } catch (error) {
    next(error);
  }
};

