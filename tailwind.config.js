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
        primary: '#a4b8c4',
        input: '#f9f9f9',
        alert: '#EF4444',
      },
    },
  },
  plugins: [],
}
