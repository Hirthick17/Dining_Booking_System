import express from 'express';
import { 
  getRestaurants, 
  getRestaurant, 
  getCities, 
  getCuisines,
  getAvailability,
  getFeaturedRestaurants,
  getTrendingRestaurants
} from '../controllers/restaurantController.js';

const router = express.Router();

router.get('/', getRestaurants);
router.get('/cities/all', getCities);
router.get('/cuisines/all', getCuisines);
router.get('/featured', getFeaturedRestaurants);
router.get('/trending', getTrendingRestaurants);
router.get('/:id', getRestaurant);
router.get('/:id/availability', getAvailability);

export default router;


