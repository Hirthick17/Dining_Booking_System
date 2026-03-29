/**
 * Breakpoints
 * Mobile-first responsive design
 */

export const breakpoints = {
  xs: '0px',      // Extra small devices
  sm: '640px',    // Small devices (mobile landscape)
  md: '768px',    // Medium devices (tablets)
  lg: '1024px',   // Large devices (desktops)
  xl: '1280px',   // Extra large devices
  '2xl': '1536px', // 2X Extra large devices
};

// Media query helpers
export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
};

export default breakpoints;
