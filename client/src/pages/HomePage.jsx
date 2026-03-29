import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchRestaurants, 
  fetchCities, 
  fetchCuisines, 
  fetchFeaturedRestaurants,
  fetchTrendingRestaurants 
} from '../redux/slices/restaurantSlice';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Chip,
  Rating,
  CircularProgress,
  Paper,
  IconButton,
  alpha,
  Badge
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import IcecreamIcon from '@mui/icons-material/Icecream';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import ChatIcon from '@mui/icons-material/Chat';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { getRestaurantStatus, formatDistance } from '../utils/restaurantUtils';

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { 
    restaurants, 
    cities, 
    cuisines, 
    featuredRestaurants,
    trendingRestaurants,
    loading 
  } = useSelector((state) => state.restaurants);

  const [filters, setFilters] = useState({
    city: '',
    cuisine: '',
    search: ''
  });



  useEffect(() => {
    dispatch(fetchRestaurants());
    dispatch(fetchCities());
    dispatch(fetchCuisines());
    dispatch(fetchFeaturedRestaurants());
    dispatch(fetchTrendingRestaurants());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = () => {
    dispatch(fetchRestaurants(filters));
    document.getElementById('restaurants-section')?.scrollIntoView({ behavior: 'smooth' });
  };



  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero Section with Background Image */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '600px', md: '700px' },
          backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          mb: 8
        }}
      >
        {/* Dark Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            {/* AI Badge */}
            <Chip
              icon={<AutoAwesomeIcon />}
              label="AI-POWERED CULINARY DISCOVERY"
              sx={{
                bgcolor: alpha('#F97316', 0.2),
                color: '#F97316',
                fontWeight: 700,
                fontSize: '0.75rem',
                mb: 3,
                border: '2px solid #F97316',
                letterSpacing: 1
              }}
            />

            {/* Hero Heading */}
            <Typography
              variant="h1"
              sx={{
                color: 'white',
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2.5rem', md: '4rem' },
                textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                lineHeight: 1.2
              }}
            >
              Discover Your Next{' '}
              <Box component="span" sx={{ color: '#F97316' }}>
                Unforgettable
              </Box>
              {' '}Meal
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: 'white',
                mb: 5,
                opacity: 0.95,
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.5rem' }
              }}
            >
              Book tables at the finest restaurants with intelligent recommendations
            </Typography>

            {/* Search Bar */}
            <Paper
              elevation={8}
              sx={{
                p: 2,
                borderRadius: 3,
                maxWidth: 800,
                mx: 'auto',
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    select
                    label="Location"
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    InputProps={{
                      startAdornment: <LocationOnIcon sx={{ mr: 1, color: '#F97316' }} />
                    }}
                  >
                    <MenuItem value="">All Cities</MenuItem>
                    {cities.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    select
                    label="Cuisine"
                    name="cuisine"
                    value={filters.cuisine}
                    onChange={handleFilterChange}
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ mr: 1, color: '#F97316', display: 'flex', alignItems: 'center' }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
                          </svg>
                        </Box>
                      )
                    }}
                  >
                    <MenuItem value="">All Cuisines</MenuItem>
                    {cuisines.map((cuisine) => (
                      <MenuItem key={cuisine} value={cuisine}>
                        {cuisine}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleSearch}
                    endIcon={<SearchIcon />}
                    sx={{
                      height: '56px',
                      background: 'linear-gradient(135deg, #E23744 0%, #F97316 100%)',
                      fontWeight: 700,
                      fontSize: '1rem',
                      borderRadius: 2,
                      boxShadow: '0 4px 14px rgba(226, 55, 68, 0.4)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(226, 55, 68, 0.6)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Find Tables
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 8 }}>


        {/* Trending Now Section - Responsive Grid with All Restaurants */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <StarIcon sx={{ color: '#F97316', fontSize: 32, mr: 1 }} />
            <Typography variant="h4" fontWeight={700}>
              Trending Now
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#E23744' }} />
            </Box>
          ) : (trendingRestaurants.length > 0 ? trendingRestaurants : restaurants).length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
              <RestaurantIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No restaurants found
              </Typography>
            </Paper>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(auto-fill, minmax(280px, 1fr))' },
                gap: 3
              }}
            >
              {(trendingRestaurants.length > 0 ? trendingRestaurants : restaurants).map((restaurant) => {
                const status = getRestaurantStatus(restaurant.operatingHours);
                const distance = formatDistance(Math.random() * 9.5 + 0.5);

                return (
                  <Card
                    key={restaurant._id}
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                      }
                    }}
                    onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="240"
                        image={restaurant.images?.[0]?.url || restaurant.images?.[0] || 'https://via.placeholder.com/400x240'}
                        alt={restaurant.name}
                        sx={{ objectFit: 'cover' }}
                      />
                      {restaurant.isFeatured && (
                        <Chip
                          label="FEATURED"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            bgcolor: '#F97316',
                            color: 'white',
                            fontWeight: 700,
                            letterSpacing: 0.5
                          }}
                        />
                      )}
                    </Box>
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" gutterBottom fontWeight={700}>
                        {restaurant.name}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating
                          value={restaurant.rating?.average || 0}
                          precision={0.5}
                          readOnly
                          size="small"
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          ({restaurant.rating?.count || 0})
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
                          {restaurant.location?.city || 'Unknown'}
                        </Typography>
                        <Chip
                          label={status.text}
                          size="small"
                          sx={{
                            bgcolor: alpha(status.color, 0.1),
                            color: status.color,
                            fontWeight: 600,
                            fontSize: '0.7rem'
                          }}
                        />
                      </Box>

                      <Box sx={{ mb: 2, flex: 1 }}>
                        {(restaurant.cuisineTypes || []).slice(0, 2).map((cuisine) => (
                          <Chip
                            key={cuisine}
                            label={cuisine}
                            size="small"
                            sx={{
                              mr: 0.5,
                              mb: 0.5,
                              bgcolor: alpha('#E23744', 0.1),
                              color: '#E23744',
                              fontSize: '0.75rem'
                            }}
                          />
                        ))}
                      </Box>

                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{
                          borderColor: '#F97316',
                          color: '#F97316',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: '#E86D0F',
                            bgcolor: alpha('#F97316', 0.05)
                          }
                        }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}
        </Box>

        {/* AI Guide Section */}
        <Box
          sx={{
            bgcolor: '#1a1a2e',
            borderRadius: 4,
            p: { xs: 4, md: 6 },
            mb: 8,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '50%',
              height: '100%',
              opacity: 0.05,
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}
          />

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip
                icon={<AutoAwesomeIcon />}
                label="MEET YOUR DINING COMPANION"
                sx={{
                  bgcolor: alpha('#F97316', 0.2),
                  color: '#F97316',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  mb: 3,
                  border: '2px solid #F97316',
                  letterSpacing: 1
                }}
              />

              <Typography
                variant="h3"
                sx={{
                  color: 'white',
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Your AI Dining Guide
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  mb: 4,
                  lineHeight: 1.7,
                  fontSize: '1.1rem'
                }}
              >
                Get personalized restaurant recommendations, instant answers about menus, 
                dietary options, and availability. Our AI assistant helps you find the 
                perfect dining experience tailored to your preferences.
              </Typography>

              <Button
                variant="contained"
                size="large"
                startIcon={<ChatIcon />}
                onClick={() => navigate('/chatbot')}
                sx={{
                  bgcolor: '#F97316',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: 2,
                  boxShadow: '0 4px 14px rgba(249, 115, 22, 0.4)',
                  '&:hover': {
                    bgcolor: '#E86D0F',
                    boxShadow: '0 6px 20px rgba(249, 115, 22, 0.6)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Start Chatting
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              {/* Chatbot Mockup */}
              <Paper
                elevation={8}
                sx={{
                  bgcolor: 'white',
                  borderRadius: 3,
                  p: 3,
                  maxWidth: 400,
                  mx: 'auto'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: '#F97316',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}
                  >
                    <ChatIcon sx={{ color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      DineAI Assistant
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Online
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Paper sx={{ p: 2, bgcolor: alpha('#F97316', 0.1), mb: 1 }}>
                    <Typography variant="body2">
                      Hi! I'm looking for Italian restaurants near downtown.
                    </Typography>
                  </Paper>
                  <Paper sx={{ p: 2, bgcolor: alpha('#E23744', 0.1) }}>
                    <Typography variant="body2">
                      I found 5 excellent Italian restaurants near downtown! 
                      Would you like to see options with outdoor seating?
                    </Typography>
                  </Paper>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* All Restaurants Section */}
        <Box id="restaurants-section">
          <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
            All Restaurants
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#E23744' }} />
            </Box>
          ) : restaurants.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
              <RestaurantIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No restaurants found. Try adjusting your filters.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {restaurants.map((restaurant) => {
                const status = getRestaurantStatus(restaurant.operatingHours);

                return (
                  <Grid item xs={12} sm={6} md={4} key={restaurant._id}>
                    <Card
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
                        }
                      }}
                      onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={restaurant.images?.[0]?.url || restaurant.images?.[0] || 'https://via.placeholder.com/400x200'}
                        alt={restaurant.name}
                      />
                      <CardContent>
                        <Typography variant="h6" gutterBottom fontWeight={600}>
                          {restaurant.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={restaurant.rating?.average || 0} precision={0.5} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({restaurant.rating?.count || 0})
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOnIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                            {restaurant.location?.city || 'Unknown'}
                          </Typography>
                          <Chip
                            label={status.text}
                            size="small"
                            sx={{
                              ml: 'auto',
                              bgcolor: alpha(status.color, 0.1),
                              color: status.color,
                              fontWeight: 600,
                              fontSize: '0.7rem'
                            }}
                          />
                        </Box>
                        <Box>
                          {(restaurant.cuisineTypes || []).slice(0, 3).map((cuisine) => (
                            <Chip
                              key={cuisine}
                              label={cuisine}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5, bgcolor: alpha('#F97316', 0.1), color: '#F97316' }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
