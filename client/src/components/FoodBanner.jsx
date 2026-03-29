import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Rating,
  Chip,
  IconButton,
  alpha
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const FoodBanner = ({ 
  images = [], 
  title, 
  description,
  price, 
  location, 
  rating = 0,
  currency = '$',
  onClick,
  badge = null
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const displayImages = images.length > 0 
    ? images 
    : ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'];

  return (
    <Card
      onClick={onClick}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        bgcolor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
        }
      }}
    >
      {/* Image Gallery Section */}
      <Box sx={{ position: 'relative', height: 240 }}>
        <CardMedia
          component="img"
          height="240"
          image={displayImages[currentImageIndex]}
          alt={title}
          sx={{ 
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
        />

        {/* Badge (e.g., "20% OFF") */}
        {badge && (
          <Chip
            label={badge}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              bgcolor: '#F97316',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: 0.5,
              px: 1
            }}
          />
        )}

        {/* Rating Badge */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            bgcolor: 'white',
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          <Typography 
            variant="body2" 
            fontWeight={700}
            sx={{ color: '#F97316' }}
          >
            ★
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {rating.toFixed(1)}
          </Typography>
        </Box>

        {/* Image Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevImage}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  bgcolor: 'white'
                },
                width: 32,
                height: 32
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={handleNextImage}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  bgcolor: 'white'
                },
                width: 32,
                height: 32
              }}
            >
              <ChevronRightIcon />
            </IconButton>

            {/* Image Indicators */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 0.5
              }}
            >
              {displayImages.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: index === currentImageIndex 
                      ? 'white' 
                      : 'rgba(255, 255, 255, 0.5)',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Box>
          </>
        )}
      </Box>

      {/* Content Section */}
      <CardContent sx={{ p: 2.5 }}>
        {/* Title */}
        <Typography 
          variant="h6" 
          fontWeight={700}
          sx={{ 
            mb: 1,
            fontSize: '1.1rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {title}
        </Typography>

        {/* Description */}
        {description && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              mb: 1.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.5
            }}
          >
            {description}
          </Typography>
        )}

        {/* Location */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mb: 1.5,
            color: 'text.secondary'
          }}
        >
          <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
          <Typography variant="body2" fontSize="0.875rem">
            {location}
          </Typography>
        </Box>

        {/* Price */}
        <Typography 
          variant="h5" 
          fontWeight={700}
          sx={{ 
            color: '#E23744',
            fontSize: '1.5rem'
          }}
        >
          {currency}{typeof price === 'number' ? price.toFixed(2) : price}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FoodBanner;
