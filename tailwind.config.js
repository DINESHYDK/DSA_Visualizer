/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Colors - Updated with extracted colors
        primary: 'var(--color-primary)', // #fece67
        secondary: 'var(--color-secondary)', // #1e1e1f
        accent: 'var(--color-accent)',
        
        // Background Colors
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'bg-card': 'var(--color-bg-card)',
        
        // Text Colors
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        
        // Interactive States
        hover: 'var(--color-hover)',
        active: 'var(--color-active)',
        focus: 'var(--color-focus)',
        
        // Status Colors
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
        
        // Animation Colors
        comparison: 'var(--color-comparison)',
        swap: 'var(--color-swap)',
        sorted: 'var(--color-sorted)',
        current: 'var(--color-current)',
        pivot: 'var(--color-pivot)',
        minimum: 'var(--color-minimum)',
        maximum: 'var(--color-maximum)',
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