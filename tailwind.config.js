/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#F18FDF',
          200: '#DA49BF',
        },
        secondary: {
          100: '#363840',
          200: '#27272A',
          300: '#16171A',
        },
      },
    },
  },
  plugins: [],
};