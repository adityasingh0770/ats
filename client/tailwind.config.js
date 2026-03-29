/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange:  '#FF6500',
          yellow:  '#FFD700',
          bg:      '#F8F6F3',
          card:    '#FFFFFF',
          border:  '#E8E5E0',
          muted:   '#888888',
          // per-topic colors
          teal:    '#0D9488',
          blue:    '#3B82F6',
          purple:  '#8B5CF6',
          rose:    '#F43F5E',
          amber:   '#F59E0B',
          green:   '#22C55E',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:    '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
        'card-md': '0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
