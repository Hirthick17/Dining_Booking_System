import React from 'react';
import styled, { css } from 'styled-components';
import { colors } from '../../theme/colors';

const StyledBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: ${props => {
    switch (props.$size) {
      case 'small': return '2px 8px';
      case 'large': return '6px 14px';
      default: return '4px 10px';
    }
  }};
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '11px';
      case 'large': return '14px';
      default: return '12px';
    }
  }};
  font-weight: 600;
  line-height: 1.4;
  border-radius: ${props => props.$rounded ? '999px' : '6px'};
  white-space: nowrap;
  text-transform: ${props => props.$uppercase ? 'uppercase' : 'none'};
  letter-spacing: ${props => props.$uppercase ? '0.5px' : 'normal'};
  
  /* Variant Styles */
  ${props => {
    switch (props.$variant) {
      case 'primary':
        return css`
          background: ${colors.primary[100]};
          color: ${colors.primary[700]};
        `;
      
      case 'secondary':
        return css`
          background: ${colors.secondary[100]};
          color: ${colors.secondary[700]};
        `;
      
      case 'success':
        return css`
          background: ${colors.success.light};
          color: ${colors.success.dark};
        `;
      
      case 'warning':
        return css`
          background: ${colors.warning.light};
          color: ${colors.warning.dark};
        `;
      
      case 'error':
        return css`
          background: ${colors.error.light};
          color: ${colors.error.dark};
        `;
      
      case 'info':
        return css`
          background: ${colors.info.light};
          color: ${colors.info.dark}; `;
      
      case 'golden':
        return css`
          background: linear-gradient(135deg, ${colors.golden} 0%, ${colors.honey} 100%);
          color: ${colors.neutral[900]};
        `;
      
      case 'mint':
        return css`
          background: ${colors.accent[100]};
          color: ${colors.accent[700]};
        `;
      
      case 'outline':
        return css`
          background: transparent;
          color: ${colors.text.secondary};
          border: 1px solid ${colors.border.main};
        `;
      
      default:
        return css`
          background: ${colors.neutral[200]};
          color: ${colors.text.primary};
        `;
    }
  }}
  
  /* Dot Indicator */
  ${props => props.$dot && css`
    &::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }
  `}
`;

const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  rounded = true,
  uppercase = false,
  dot = false,
  icon,
  ...props
}) => {
  return (
    <StyledBadge
      $variant={variant}
      $size={size}
      $rounded={rounded}
      $uppercase={uppercase}
      $dot={dot}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </StyledBadge>
  );
};

export default Badge;
