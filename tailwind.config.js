const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#14aede',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      transitionProperty: {
        height: 'height',
      },
    },
  },
  plugins: [],
};
