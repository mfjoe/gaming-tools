/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // EA Sports FC Brand Colors
        'ea-blue': {
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#0066ff',  // Primary EA Blue
          600: '#0052cc',
          700: '#003d99',
          800: '#002966',
          900: '#001433',
        },
        'ea-green': {
          50: '#e6f7ed',
          100: '#b3e6c9',
          200: '#80d6a6',
          300: '#4dc582',
          400: '#1ab55e',
          500: '#00a650',  // FIFA Green
          600: '#008540',
          700: '#006430',
          800: '#004220',
          900: '#002110',
        },
        'pitch': {
          light: '#1a8f45',
          DEFAULT: '#0d7a3a',
          dark: '#0a5a2b',
          darker: '#073a1c',
        },
        'fut': {
          gold: '#ffc107',
          silver: '#c0c0c0',
          bronze: '#cd7f32',
          rare: '#ffeb3b',
          common: '#8d6e63',
          totw: '#000000',
          icon: '#ff4081',
          hero: '#9c27b0',
        },
        // Chemistry Colors
        'chem': {
          perfect: '#00e676',    // 3 chemistry - bright green
          good: '#ffd740',       // 2 chemistry - yellow
          okay: '#ff9100',       // 1 chemistry - orange
          bad: '#ff1744',        // 0 chemistry - red
        }
      },
      backgroundImage: {
        'pitch-gradient': 'linear-gradient(180deg, #1a8f45 0%, #0a5a2b 100%)',
        'pitch-radial': 'radial-gradient(ellipse at center, #1a8f45 0%, #0a5a2b 100%)',
        'fifa-gradient': 'linear-gradient(135deg, #0066ff 0%, #00a650 100%)',
        'gold-gradient': 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        'glow-green': '0 0 20px rgba(0, 230, 118, 0.5)',
        'glow-blue': '0 0 20px rgba(0, 102, 255, 0.5)',
      },
      fontFamily: {
        'fifa': ['din-2014', 'Arial', 'sans-serif'],
        'fut': ['din-2014-narrow', 'Arial Narrow', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 230, 118, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 230, 118, 0.6)' },
        },
      },
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
}
