import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { colors } from '../../theme/colors';
import { animations } from '../../theme/animations';

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: ${props => props.$noMargin ? '0' : '20px'};
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${props => props.$hasIcon ? '12px 12px 12px 40px' : '12px 16px'};
  font-size: 15px;
  font-family: inherit;
  color: ${colors.text.primary};
  background: ${colors.background.primary};
  border: 2px solid ${colors.border.main};
  border-radius: 8px;
  transition: ${animations.transition.all};
  outline: none;
  
  /* Placeholder */
  &::placeholder {
    color: ${colors.text.tertiary};
    opacity: 1;
  }
  
  /* Focus State */
  &:focus {
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[500]}20;
  }
  
  /* Disabled State */
  &:disabled {
    background: ${colors.neutral[100]};
    color: ${colors.text.tertiary};
    cursor: not-allowed;
  }
  
  /* Error State */
  ${props => props.$error && css`
    border-color: ${colors.error.main};
    
    &:focus {
      border-color: ${colors.error.main};
      box-shadow: 0 0 0 3px ${colors.error.main}20;
    }
  `}
  
  /* Success State */
  ${props => props.$success && css`
    border-color: ${colors.success.main};
    
    &:focus {
      border-color: ${colors.success.main};
      box-shadow: 0 0 0 3px ${colors.success.main}20;
    }
  `}
  
  /* Floating Label */
  ${props => props.$hasFloatingLabel && css`
    padding-top: 20px;
    padding-bottom: 4px;
  `}
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  font-family: inherit;
  color: ${colors.text.primary};
  background: ${colors.background.primary};
  border: 2px solid ${colors.border.main};
  border-radius: 8px;
  transition: ${animations.transition.all};
  outline: none;
  resize: vertical;
  min-height: 100px;
  
  &::placeholder {
    color: ${colors.text.tertiary};
  }
  
  &:focus {
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[500]}20;
  }
  
  &:disabled {
    background: ${colors.neutral[100]};
    color: ${colors.text.tertiary};
    cursor: not-allowed;
  }
  
  ${props => props.$error && css`
    border-color: ${colors.error.main};
    
    &:focus {
      border-color: ${colors.error.main};
      box-shadow: 0 0 0 3px ${colors.error.main}20;
    }
  `}
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text.primary};
  
  ${props => props.$required && css`
    &::after {
      content: ' *';
      color: ${colors.error.main};
    }
  `}
`;

const FloatingLabel = styled.label`
  position: absolute;
  left: 16px;
  top: ${props => props.$active ? '8px' : '50%'};
  transform: translateY(${props => props.$active ? '0' : '-50%'});
  font-size: ${props => props.$active ? '12px' : '15px'};
  color: ${props => props.$active ? colors.primary[500] : colors.text.tertiary};
  pointer-events: none;
  transition: ${animations.transition.all};
  background: ${colors.background.primary};
  padding: 0 4px;
  
  ${props => props.$error && css`
    color: ${colors.error.main};
  `}
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.text.tertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const HelperText = styled.span`
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: ${props => {
    if (props.$error) return colors.error.main;
    if (props.$success) return colors.success.main;
    return colors.text.secondary;
  }};
`;

const Input = React.forwardRef(({
  label,
  floatingLabel,
  required,
  error,
  success,
  helperText,
  icon,
  type = 'text',
  noMargin,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    setIsFocused(false);
    setHasValue(e.target.value !== '');
  };
  
  const showFloatingLabel = floatingLabel && (isFocused || hasValue || props.value);
  
  return (
    <InputWrapper $noMargin={noMargin}>
      {label && !floatingLabel && (
        <Label $required={required}>{label}</Label>
      )}
      
      {icon && <IconWrapper>{icon}</IconWrapper>}
      
      <StyledInput
        ref={ref}
        type={type}
        $error={error}
        $success={success}
        $hasIcon={!!icon}
        $hasFloatingLabel={!!floatingLabel}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      
      {floatingLabel && (
        <FloatingLabel $active={showFloatingLabel} $error={error}>
          {floatingLabel}
          {required && ' *'}
        </FloatingLabel>
      )}
      
      {helperText && (
        <HelperText $error={error} $success={success}>
          {helperText}
        </HelperText>
      )}
    </InputWrapper>
  );
});

Input.displayName = 'Input';

export const Textarea = React.forwardRef(({
  label,
  required,
  error,
  helperText,
  noMargin,
  ...props
}, ref) => {
  return (
    <InputWrapper $noMargin={noMargin}>
      {label && <Label $required={required}>{label}</Label>}
      
      <StyledTextarea
        ref={ref}
        $error={error}
        {...props}
      />
      
      {helperText && (
        <HelperText $error={error}>
          {helperText}
        </HelperText>
      )}
    </InputWrapper>
  );
});

Textarea.displayName = 'Textarea';

export default Input;
