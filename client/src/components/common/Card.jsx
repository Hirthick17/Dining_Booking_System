import React from 'react';
import styled, { css } from 'styled-components';
import { colors } from '../../theme/colors';
import { animations } from '../../theme/animations';

const StyledCard = styled.div`
  position: relative;
  background: ${colors.background.primary};
  border-radius: 12px;
  overflow: hidden;
  transition: ${animations.transition.transformOpacity}, ${animations.transition.shadow};
  border: 1px solid ${colors.border.light};
  
  /* Hover Effect */
  ${props => props.$hoverable && css`
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
      border-color: ${colors.border.main};
    }
    
    &:active {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    }
  `}
  
  /* Padding Variants */
  ${props => {
    switch (props.$padding) {
      case 'none': return css`padding: 0;`;
      case 'small': return css`padding: 12px;`;
      case 'large': return css`padding: 24px;`;
      default: return css`padding: 16px;`;
    }
  }}
  
  /* Shadow Variants */
  ${props => {
    switch (props.$shadow) {
      case 'none': return css`box-shadow: none;`;
      case 'small': return css`box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);`;
      case 'medium': return css`box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);`;
      case 'large': return css`box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);`;
      default: return css`box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);`;
    }
  }}
`;

const CardImage = styled.div`
  position: relative;
  width: 100%;
  height: ${props => props.$height || '200px'};
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: ${animations.transition.transform};
  }
  
  ${props => props.$zoom && css`
    ${StyledCard}:hover & img {
      transform: scale(1.05);
    }
  `}
`;

const CardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.$gradient || colors.overlay.gradient};
  pointer-events: none;
`;

const CardContent = styled.div`
  padding: ${props => props.$padding || '16px'};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: ${props => props.$noMargin ? '0' : '12px'};
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '16px';
      case 'large': return '24px';
      default: return '20px';
    }
  }};
  font-weight: 700;
  color: ${colors.text.primary};
  line-height: 1.3;
`;

const CardSubtitle = styled.p`
  margin: 4px 0 0 0;
  font-size: 14px;
  color: ${colors.text.secondary};
  line-height: 1.5;
`;

const CardDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${colors.text.secondary};
  line-height: 1.6;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: ${props => props.$noPadding ? '0' : '12px'};
  margin-top: ${props => props.$noMargin ? '0' : '12px'};
  border-top: ${props => props.$divider ? `1px solid ${colors.border.light}` : 'none'};
`;

const Card = ({
  children,
  hoverable = false,
  padding = 'medium',
  shadow = 'small',
  onClick,
  className,
  ...props
}) => {
  return (
    <StyledCard
      $hoverable={hoverable}
      $padding={padding}
      $shadow={shadow}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

Card.Image = ({ src, alt, height, zoom = true, overlay, children }) => (
  <CardImage $height={height} $zoom={zoom}>
    <img src={src} alt={alt} />
    {overlay && <CardOverlay $gradient={overlay} />}
    {children}
  </CardImage>
);

Card.Content = ({ children, padding }) => (
  <CardContent $padding={padding}>
    {children}
  </CardContent>
);

Card.Header = ({ children, noMargin }) => (
  <CardHeader $noMargin={noMargin}>
    {children}
  </CardHeader>
);

Card.Title = ({ children, size = 'medium' }) => (
  <CardTitle $size={size}>
    {children}
  </CardTitle>
);

Card.Subtitle = ({ children }) => (
  <CardSubtitle>
    {children}
  </CardSubtitle>
);

Card.Description = ({ children }) => (
  <CardDescription>
    {children}
  </CardDescription>
);

Card.Footer = ({ children, divider = false, noMargin, noPadding }) => (
  <CardFooter $divider={divider} $noMargin={noMargin} $noPadding={noPadding}>
    {children}
  </CardFooter>
);

export default Card;
