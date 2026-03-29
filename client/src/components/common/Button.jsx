import React from 'react';
import styled, { css } from 'styled-components';
import { colors } from '../../theme/colors';
import { animations } from '../../theme/animations';

const StyledButton = styled.button`
  /* Base Styles */
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: ${props => {
    switch (props.$size) {
      case 'small': return '8px 16px';
      case 'large': return '14px 32px';
      default: return '10px 24px';
    }
  }};
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '14px';
      case 'large': return '16px';
      default: return '15px';
    }
  }};
  font-weight: 600;
  line-height: 1.5;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: ${animations.transition.all};
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  
  /* Disabled State */
  ${props => props.disabled && css`
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  `}
  
  /* Loading State */
  ${props => props.$loading && css`
    cursor: wait;
    pointer-events: none;
  `}
  
  /* Full Width */
  ${props => props.$fullWidth && css`
    width: 100%;
  `}
  
  /* Variant Styles */
  ${props => {
    switch (props.$variant) {
      case 'primary':
        return css`
          background: ${colors.primary[500]};
          color: ${colors.text.inverse};
          
          &:hover:not(:disabled) {
            background: ${colors.primary[600]};
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(226, 55, 68, 0.3);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 4px 8px rgba(226, 55, 68, 0.2);
          }
        `;
      
      case 'secondary':
        return css`
          background: ${colors.secondary[500]};
          color: ${colors.text.inverse};
          
          &:hover:not(:disabled) {
            background: ${colors.secondary[600]};
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(249, 115, 22, 0.3);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 4px 8px rgba(249, 115, 22, 0.2);
          }
        `;
      
      case 'outline':
        return css`
          background: transparent;
          color: ${colors.primary[500]};
          border-color: ${colors.primary[500]};
          
          &:hover:not(:disabled) {
            background: ${colors.primary[50]};
            border-color: ${colors.primary[600]};
            color: ${colors.primary[600]};
          }
          
          &:active:not(:disabled) {
            background: ${colors.primary[100]};
          }
        `;
      
      case 'ghost':
        return css`
          background: transparent;
          color: ${colors.text.primary};
          
          &:hover:not(:disabled) {
            background: ${colors.neutral[100]};
          }
          
          &:active:not(:disabled) {
            background: ${colors.neutral[200]};
          }
        `;
      
      case 'success':
        return css`
          background: ${colors.success.main};
          color: ${colors.text.inverse};
          
          &:hover:not(:disabled) {
            background: ${colors.success.dark};
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
          }
        `;
      
      case 'danger':
        return css`
          background: ${colors.error.main};
          color: ${colors.text.inverse};
          
          &:hover:not(:disabled) {
            background: ${colors.error.dark};
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(239, 68, 68, 0.3);
          }
        `;
      
      default:
        return css`
          background: ${colors.neutral[200]};
          color: ${colors.text.primary};
          
          &:hover:not(:disabled) {
            background: ${colors.neutral[300]};
          }
        `;
    }
  }}
`;

const LoadingSpinner = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ${animations.classes.spin};
`;

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  ...props
}, ref) => {
  return (
    <StyledButton
      ref={ref}
      $variant={variant}
      $size={size}
      $loading={loading}
      $fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && leftIcon && <span>{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span>{rightIcon}</span>}
    </StyledButton>
  );
});

Button.displayName = 'Button';

export default Button;
