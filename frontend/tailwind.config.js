/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f0ff',
          100: '#e5e4ff',
          200: '#cecefd',
          300: '#aaa8fb',
          400: '#8079f7',
          500: '#6254f3',
          600: '#5436e9',
          700: '#4826d5',
          800: '#3c21ab',
          900: '#331e88',
          950: '#1e115c',
        },
        dark: {
          50: '#f6f6f7',
          100: '#e1e2e5',
          200: '#c2c4cb',
          300: '#9b9fab',
          400: '#787d8e',
          500: '#5e6374',
          600: '#4b4f5e',
          700: '#3d404d',
          800: '#1e2030',
          900: '#13151f',
          950: '#0d0f17',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
