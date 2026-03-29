/**
 * Animation System
 * Smooth transitions and micro-interactions
 */

export const animations = {
  // Transition Durations (in milliseconds)
  duration: {
    instant: 100,
    fast: 150,
    normal: 200,
    medium: 300,
    slow: 400,
    slower: 600,
  },
  
  // Easing Functions
  easing: {
    // Standard easing
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    
    // Deceleration (easeOut) - Elements entering the screen
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    
    // Acceleration (easeIn) - Elements leaving the screen
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
    
    // Sharp - Quick and snappy
    sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
    
    // Bounce - Playful effect
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    
    // Smooth - Very smooth transitions
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  
  // Common Transition Strings
  transition: {
    // All properties
    all: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    allFast: 'all 150ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    allSlow: 'all 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    
    // Specific properties
    transform: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    opacity: 'opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    color: 'color 150ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    background: 'background-color 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    border: 'border-color 150ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    shadow: 'box-shadow 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    
    // Combined
    transformOpacity: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1), opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  },
  
  // Keyframe Animations (CSS)
  keyframes: {
    // Fade animations
    fadeIn: `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `,
    fadeOut: `
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `,
    
    // Slide animations
    slideInUp: `
      @keyframes slideInUp {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `,
    slideInDown: `
      @keyframes slideInDown {
        from {
          transform: translateY(-20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `,
    slideInLeft: `
      @keyframes slideInLeft {
        from {
          transform: translateX(-20px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `,
    slideInRight: `
      @keyframes slideInRight {
        from {
          transform: translateX(20px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `,
    
    // Scale animations
    scaleIn: `
      @keyframes scaleIn {
        from {
          transform: scale(0.9);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
    `,
    scaleOut: `
      @keyframes scaleOut {
        from {
          transform: scale(1);
          opacity: 1;
        }
        to {
          transform: scale(0.9);
          opacity: 0;
        }
      }
    `,
    
    // Pulse animation
    pulse: `
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
    `,
    
    // Spin animation (for loaders)
    spin: `
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `,
    
    // Bounce animation
    bounce: `
      @keyframes bounce {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }
    `,
    
    // Shake animation (for errors)
    shake: `
      @keyframes shake {
        0%, 100% {
          transform: translateX(0);
        }
        10%, 30%, 50%, 70%, 90% {
          transform: translateX(-5px);
        }
        20%, 40%, 60%, 80% {
          transform: translateX(5px);
        }
      }
    `,
    
    // Success checkmark
    checkmark: `
      @keyframes checkmark {
        0% {
          stroke-dashoffset: 50;
        }
        100% {
          stroke-dashoffset: 0;
        }
      }
    `,
    
    // Shimmer (for skeleton loading)
    shimmer: `
      @keyframes shimmer {
        0% {
          background-position: -1000px 0;
        }
        100% {
          background-position: 1000px 0;
        }
      }
    `,
  },
  
  // Animation Classes (for use with styled-components or CSS)
  classes: {
    fadeIn: 'fadeIn 300ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
    fadeOut: 'fadeOut 300ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
    slideInUp: 'slideInUp 400ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
    slideInDown: 'slideInDown 400ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
    slideInLeft: 'slideInLeft 400ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
    slideInRight: 'slideInRight 400ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
    scaleIn: 'scaleIn 200ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
    scaleOut: 'scaleOut 200ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
    pulse: 'pulse 2s cubic-bezier(0.4, 0.0, 0.6, 1) infinite',
    spin: 'spin 1s linear infinite',
    bounce: 'bounce 1s ease-in-out infinite',
    shake: 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
    shimmer: 'shimmer 2s linear infinite',
  },
  
  // Hover Effects
  hover: {
    lift: {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
      transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    },
    scale: {
      transform: 'scale(1.05)',
      transition: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    },
    glow: {
      boxShadow: '0 0 20px rgba(226, 55, 68, 0.4)',
      transition: 'box-shadow 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    },
  },
};

// Helper function to create staggered animations
export const stagger = (index, baseDelay = 50) => ({
  animationDelay: `${index * baseDelay}ms`,
});

// Helper function to create transition strings
export const createTransition = (properties, duration = 200, easing = 'standard') => {
  const easingFunc = animations.easing[easing] || animations.easing.standard;
  return properties
    .map(prop => `${prop} ${duration}ms ${easingFunc}`)
    .join(', ');
};

export default animations;
