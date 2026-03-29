/**
 * Food-Themed Color System
 * Inspired by culinary aesthetics and successful dining applications
 */

export const colors = {
  // Primary Brand Color (Tomato Red - Appetite-stimulating)
  primary: {
    50: '#FFF5F5',
    100: '#FFE5E5',
    200: '#FFCCCC',
    300: '#FF9999',
    400: '#FF6666',
    500: '#E23744',  // Main brand color - Tomato Red
    600: '#CC1F2D',
    700: '#991721',
    800: '#660F16',
    900: '#33070B',
  },
  
  // Secondary (Saffron Orange - Warm & Inviting)
  secondary: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',  // Saffron Orange
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },
  
  // Accent (Olive Green - Fresh & Natural)
  accent: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#10B981',  // Olive Green
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  
  // Neutral (Cream & Charcoal - Elegant)
  neutral: {
    50: '#FAFAF9',   // Warm white
    100: '#F5F5F4',  // Cream
    200: '#E7E5E4',
    300: '#D6D3D1',
    400: '#A8A29E',
    500: '#78716C',
    600: '#57534E',
    700: '#44403C',  // Warm charcoal
    800: '#292524',
    900: '#1C1917',
  },
  
  // Semantic Colors
  success: {
    light: '#D1FAE5',
    main: '#10B981',
    dark: '#047857',
  },
  warning: {
    light: '#FEF3C7',
    main: '#F59E0B',
    dark: '#D97706',
  },
  error: {
    light: '#FEE2E2',
    main: '#EF4444',
    dark: '#DC2626',
  },
  info: {
    light: '#DBEAFE',
    main: '#3B82F6',
    dark: '#1D4ED8',
  },
  
  // Food-Themed Special Colors
  golden: '#FFC107',      // Premium, ratings
  mint: '#10B981',        // Fresh, verified
  cinnamon: '#F97316',    // Trending, hot
  lavender: '#A78BFA',    // Premium dining
  honey: '#FBBF24',       // Sweet deals
  
  // Gradients (for overlays and backgrounds)
  gradients: {
    primary: 'linear-gradient(135deg, #E23744 0%, #CC1F2D 100%)',
    secondary: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    accent: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    sunset: 'linear-gradient(135deg, #F97316 0%, #E23744 100%)',
    forest: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
    premium: 'linear-gradient(135deg, #FFC107 0%, #F97316 100%)',
    dark: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
  },
  
  // Image Overlays
  overlay: {
    light: 'rgba(255, 255, 255, 0.9)',
    medium: 'rgba(0, 0, 0, 0.4)',
    dark: 'rgba(0, 0, 0, 0.6)',
    gradient: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
    primaryGradient: 'linear-gradient(135deg, rgba(226,55,68,0.9) 0%, rgba(204,31,45,0.9) 100%)',
  },
  
  // Backgrounds
  background: {
    primary: '#FFFFFF',
    secondary: '#FAFAF9',   // Warm white
    tertiary: '#F5F5F4',    // Cream
    dark: '#1C1917',        // Warm charcoal
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Text
  text: {
    primary: '#1C1917',     // Warm charcoal
    secondary: '#57534E',   // Medium gray
    tertiary: '#A8A29E',    // Light gray
    inverse: '#FFFFFF',
    muted: '#78716C',
  },
  
  // Borders
  border: {
    light: '#E7E5E4',
    main: '#D6D3D1',
    dark: '#A8A29E',
    focus: '#E23744',
  },
  
  // Status Colors (for bookings)
  status: {
    pending: '#F59E0B',
    confirmed: '#10B981',
    cancelled: '#EF4444',
    completed: '#6B7280',
  },
};

export default colors;
