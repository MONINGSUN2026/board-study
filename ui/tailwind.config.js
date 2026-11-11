/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './html/**/*.html',
    './js/**/*.js',
  ],
  theme: {
    // desktop-first 브레이크포인트 (D-05)
    screens: {
      tablet: { max: '1024px' },
      mobile: { max: '640px' },
    },
    extend: {},
  },
  plugins: [],
};
