/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      'poppins-regular': 'poppins-regular',
      'poppins-medium': 'poppins-medium',
      'poppins-semibold': 'poppins-semibold',
      'poppins-bold': 'poppins-bold',
      'inter-regular': 'inter-regular',
      'inter-medium': 'inter-medium',
    },
    fontWeight: {},
    extend: {
      colors: {
        primary: '#8b6cef',
        input: '#f5f5f5',
      },
    },
  },
  plugins: [],
};
