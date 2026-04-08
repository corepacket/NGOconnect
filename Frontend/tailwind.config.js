/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        earth: {
          50: '#f6f7f6',
          100: '#e3e6e3',
          200: '#c7cdc7',
          300: '#a4aea4',
          400: '#818d81',
          500: '#677567',
          600: '#4f5b4f',
          700: '#404940',
          800: '#343b34',
          900: '#2c312c',
        },
        hope: {
          50: '#fef7ee',
          100: '#fdecd9',
          200: '#fad5b3',
          300: '#f5b880',
          400: '#ef9648',
          500: '#ea7d2c',
          600: '#d6691b',
          700: '#b45316',
          800: '#92400e',
          900: '#78350f',
        },
        compassion: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'ngo-pattern': "url('https://images.unsplash.com/photo-1594708767771-a7502209ff51?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        'ngo-gradient': 'linear-gradient(135deg, rgba(44, 62, 80, 0.95) 0%, rgba(52, 152, 219, 0.9) 100%)',
        'hero-pattern': 'radial-gradient(circle at 10% 20%, rgba(44, 62, 80, 0.8) 0%, rgba(52, 152, 219, 0.8) 90%)',
        'hope-gradient': 'linear-gradient(135deg, #ea7d2c 0%, #ec4899 50%, #7c3aed 100%)',
        'compassion-gradient': 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #0ea5e9 100%)',
        'earth-gradient': 'linear-gradient(135deg, #677567 0%, #404940 50%, #2c312c 100%)',
        'volunteer-gradient': 'linear-gradient(135deg, #f5b880 0%, #f9a8d4 25%, #a78bfa 50%, #38bdf8 75%, #4ade80 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}