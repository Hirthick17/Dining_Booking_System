import React from 'react';
import styled from 'styled-components';
import { colors } from '../../../theme/colors';
import { animations } from '../../../theme/animations';
import Card from '../../common/Card';
import Badge from '../../common/Badge';

const RestaurantCardWrapper = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const BadgeContainer = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  z-index: 1;
`;

const InfoOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: ${colors.overlay.gradient};
  z-index: 1;
`;

const RestaurantName = styled.h3`
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 700;
  color: ${colors.text.inverse};
  line-height: 1.3;
`;

const CuisineText = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${colors.text.inverse};
  opacity: 0.9;
`;

const ContentSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: ${colors.text.secondary};
  
  svg {
    width: 16px;
    height: 16px;
    color: ${colors.text.tertiary};
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: ${colors.success.main};
  color: ${colors.text.inverse};
  border-radius: 6px;
  font-size: 14px;
  font-weight: 700;
  
  svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
  }
`;

const PriceRange = styled.span`
  color: ${colors.golden};
  font-weight: 600;
`;

const Description = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${colors.text.secondary};
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid ${colors.border.light};
`;

const StatusBadge = styled(Badge)`
  ${props => props.$isOpen && `
    animation: ${animations.classes.pulse};
  `}
`;

// Icons (simplified SVG components)
const StarIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

const RestaurantCard = ({
  restaurant,
  onClick
}) => {
  const {
    name,
    cuisine = [],
    location,
    images = [],
    rating,
    priceRange,
    averageCostForTwo,
    description,
    isOpen = true,
    distance
  } = restaurant;
  
  // Get primary image
  const primaryImage = images.find(img => img.isPrimary)?.url || images[0]?.url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4';
  
  // Format cuisine list
  const cuisineText = cuisine.slice(0, 3).join(', ');
  
  // Price range symbols
  const priceSymbols = '₹'.repeat(priceRange || 2);
  
  return (
    <RestaurantCardWrapper hoverable onClick={onClick} padding="none">
      <ImageContainer>
        <BadgeContainer>
          {rating?.average >= 4.5 && (
            <Badge variant="golden" size="small">
              Top Rated
            </Badge>
          )}
          {!isOpen && (
            <Badge variant="error" size="small">
              Closed
            </Badge>
          )}
        </BadgeContainer>
        
        <Card.Image
          src={primaryImage}
          alt={name}
          height="220px"
          zoom
        >
          <InfoOverlay>
            <RestaurantName>{name}</RestaurantName>
            <CuisineText>{cuisineText}</CuisineText>
          </InfoOverlay>
        </Card.Image>
      </ImageContainer>
      
      <Card.Content>
        <ContentSection>
          <MetaRow>
            {rating?.average && (
              <RatingContainer>
                <StarIcon />
                {rating.average.toFixed(1)}
              </RatingContainer>
            )}
            
            <MetaItem>
              <PriceRange>{priceSymbols}</PriceRange>
              {averageCostForTwo && (
                <span>₹{averageCostForTwo} for two</span>
              )}
            </MetaItem>
            
            {distance && (
              <MetaItem>
                <LocationIcon />
                {distance} km
              </MetaItem>
            )}
          </MetaRow>
          
          {description && (
            <Description>{description}</Description>
          )}
        </ContentSection>
        
        <FooterRow>
          <MetaItem>
            <ClockIcon />
            {location?.city || 'Location'}
          </MetaItem>
          
          <StatusBadge
            variant={isOpen ? 'mint' : 'error'}
            size="small"
            dot
            $isOpen={isOpen}
          >
            {isOpen ? 'Open Now' : 'Closed'}
          </StatusBadge>
        </FooterRow>
      </Card.Content>
    </RestaurantCardWrapper>
  );
};

export default RestaurantCard;
