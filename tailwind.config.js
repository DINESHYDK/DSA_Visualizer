/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Colors - Enhanced for visibility
        primary: 'var(--color-primary)', // #fbbf24 - Brighter yellow
        secondary: 'var(--color-secondary)', // #1f2937 - Dark gray
        accent: 'var(--color-accent)', // #374151 - Medium gray
        
        // Background Colors - Better contrast
        'bg-primary': 'var(--color-bg-primary)', // #111827
        'bg-secondary': 'var(--color-bg-secondary)', // #1f2937
        'bg-card': 'var(--color-bg-card)', // #374151
        
        // Text Colors - High contrast
        'text-primary': 'var(--color-text-primary)', // #f9fafb
        'text-secondary': 'var(--color-text-secondary)', // #d1d5db
        'text-muted': 'var(--color-text-muted)', // #9ca3af
        
        // Interactive States
        hover: 'var(--color-hover)', // #f59e0b
        active: 'var(--color-active)', // #d97706
        focus: 'var(--color-focus)', // #fbbf24
        
        // Status Colors - High contrast
        success: 'var(--color-success)', // #10b981
        warning: 'var(--color-warning)', // #f59e0b
        error: 'var(--color-error)', // #ef4444
        info: 'var(--color-info)', // #3b82f6
        
        // Animation Colors - Enhanced visibility
        comparison: 'var(--color-comparison)', // #8b5cf6
        swap: 'var(--color-swap)', // #ec4899
        sorted: 'var(--color-sorted)', // #10b981
        current: 'var(--color-current)', // #fbbf24
        pivot: 'var(--color-pivot)', // #f97316
        minimum: 'var(--color-minimum)', // #3b82f6
        maximum: 'var(--color-maximum)', // #ef4444
        found: 'var(--color-found)', // #059669
      },
      borderRadius: {
        'curvy': 'var(--radius-md)',
        'curvy-sm': 'var(--radius-sm)',
        'curvy-lg': 'var(--radius-lg)',
        'curvy-xl': 'var(--radius-xl)',
        'curvy-2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        'curvy': 'var(--shadow-md)',
        'curvy-sm': 'var(--shadow-sm)',
        'curvy-lg': 'var(--shadow-lg)',
        'curvy-xl': 'var(--shadow-xl)',
        'glow': 'var(--shadow-glow)',
        'glow-hover': 'var(--shadow-glow-hover)',
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-secondary': 'var(--gradient-secondary)',
        'gradient-dark': 'var(--gradient-dark)',
        'gradient-card': 'var(--gradient-card)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
      screens: {
        'xs': '475px',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};