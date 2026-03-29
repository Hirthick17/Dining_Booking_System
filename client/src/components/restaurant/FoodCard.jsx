import React from 'react';
import styled from 'styled-components';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { colors } from '../../theme/colors';
import { animations } from '../../theme/animations';

const FoodCardWrapper = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  animation: ${animations.classes.fadeIn};
  transition: ${animations.transition.transformOpacity};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
`;

const FoodImage = styled(Card.Image)`
  img {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const TopRow = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`;

const RatingPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.7);
  color: ${colors.text.inverse};
  font-size: 12px;
  font-weight: 600;

  svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
  }
`;

const Title = styled.h3`
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 700;
  color: ${colors.text.primary};
`;

const Description = styled.p`
  margin: 0 0 8px 0;
  font-size: 13px;
  color: ${colors.text.secondary};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Price = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.error.main};
`;

const StarIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const FoodCard = ({
  image,
  title,
  description,
  price,
  currency = '$',
  badge,
  rating,
  onClick,
}) => {
  return (
    <FoodCardWrapper hoverable padding="none" onClick={onClick}>
      <div style={{ position: 'relative' }}>
        <FoodImage src={image} alt={title} height="220px" zoom>
          <TopRow>
            {badge && (
              <Badge variant="warning" size="small" uppercase>
                {badge}
              </Badge>
            )}
            {rating != null && (
              <RatingPill>
                <StarIcon />
                {rating.toFixed(1)}
              </RatingPill>
            )}
          </TopRow>
        </FoodImage>
      </div>

      <Card.Content>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
        <Price>
          {currency}
          {price?.toFixed ? price.toFixed(2) : price}
        </Price>
      </Card.Content>
    </FoodCardWrapper>
  );
};

export default FoodCard;