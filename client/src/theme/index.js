/**
 * Theme Configuration
 * Centralized design system for consistent styling
 */

import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { breakpoints } from './breakpoints';
import { shadows } from './shadows';
import { transitions } from './transitions';

const theme = {
  colors,
  typography,
  spacing,
  breakpoints,
  shadows,
  transitions,
  
  // Component-specific styles
  components: {
    button: {
      borderRadius: '8px',
      fontWeight: 600,
      transition: 'all 0.2s ease',
    },
    card: {
      borderRadius: '12px',
      boxShadow: shadows.sm,
      transition: transitions.default,
    },
    input: {
      borderRadius: '8px',
      borderWidth: '1px',
      fontSize: typography.fontSize.base,
    },
  },
  
  // Layout
  layout: {
    maxWidth: '1280px',
    containerPadding: spacing[4],
    headerHeight: '64px',
    footerHeight: '200px',
  },
};

export default theme;
