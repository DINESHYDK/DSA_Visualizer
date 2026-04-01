/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'bg-primary':   'var(--color-bg-primary)',   // #1a1a2e
        'bg-secondary': 'var(--color-bg-secondary)', // #282828
        'bg-card':      'var(--color-bg-card)',       // #303030
        'bg-elevated':  'var(--color-bg-elevated)',   // #3e3e3e

        // Borders
        border:         'var(--color-border)',        // #3e3e3e
        'border-hover': 'var(--color-border-hover)',  // #525252

        // Text
        'text-primary':   'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted':     'var(--color-text-muted)',

        // Accent
        accent:       'var(--color-accent)',       // #ffa116
        'accent-hover': 'var(--color-accent-hover)', // #ffb84d

        // Status
        success: 'var(--color-success)', // #2cbb5d
        warning: 'var(--color-warning)', // #ffc01e
        error:   'var(--color-error)',   // #ff375f
        info:    'var(--color-info)',    // #3b82f6

        // Visualization
        comparison: 'var(--color-comparison)', // #7c3aed
        swap:       'var(--color-swap)',        // #ec4899
        sorted:     'var(--color-sorted)',      // #2cbb5d
        current:    'var(--color-current)',     // #ffa116
        pivot:      'var(--color-pivot)',       // #f97316
        minimum:    'var(--color-minimum)',     // #3b82f6
        maximum:    'var(--color-maximum)',     // #ff375f
        found:      'var(--color-found)',       // #2cbb5d
      },
      borderRadius: {
        DEFAULT: 'var(--radius-md)',
        sm:  'var(--radius-sm)',
        md:  'var(--radius-md)',
        lg:  'var(--radius-lg)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Ubuntu', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'Cascadia Code', 'Consolas', 'monospace'],
      },
      screens: {
        xs: '475px',
      },
    },
  },
  plugins: [],
};
