import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.cuisine) params.append('cuisine', filters.cuisine);
      if (filters.search) params.append('search', filters.search);
      
      const response = await api.get(`/restaurants?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch restaurants');
    }
  }
);

export const fetchRestaurant = createAsyncThunk(
  'restaurants/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/restaurants/${id}`);
      return response.data.restaurant;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch restaurant');
    }
  }
);

export const fetchCities = createAsyncThunk(
  'restaurants/fetchCities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/restaurants/cities/all');
      return response.data.cities;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchCuisines = createAsyncThunk(
  'restaurants/fetchCuisines',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/restaurants/cuisines/all');
      return response.data.cuisines;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchFeaturedRestaurants = createAsyncThunk(
  'restaurants/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/restaurants/featured');
      return response.data.restaurants;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured restaurants');
    }
  }
);

export const fetchTrendingRestaurants = createAsyncThunk(
  'restaurants/fetchTrending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/restaurants/trending');
      return response.data.restaurants;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trending restaurants');
    }
  }
);

const initialState = {
  restaurants: [],
  selectedRestaurant: null,
  featuredRestaurants: [],
  trendingRestaurants: [],
  cities: [],
  cuisines: [],
  loading: false,
  error: null
};

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    clearSelectedRestaurant: (state) => {
      state.selectedRestaurant = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all restaurants
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload.restaurants;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single restaurant
      .addCase(fetchRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRestaurant = action.payload;
      })
      .addCase(fetchRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch cities
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.cities = action.payload;
      })
      // Fetch cuisines
      .addCase(fetchCuisines.fulfilled, (state, action) => {
        state.cuisines = action.payload;
      })
      // Fetch featured restaurants
      .addCase(fetchFeaturedRestaurants.fulfilled, (state, action) => {
        state.featuredRestaurants = action.payload;
      })
      // Fetch trending restaurants
      .addCase(fetchTrendingRestaurants.fulfilled, (state, action) => {
        state.trendingRestaurants = action.payload;
      });
  }
});

export const { clearSelectedRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
