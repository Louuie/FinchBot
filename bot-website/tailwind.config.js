module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  important: "#root",
  theme: {
    screens: {
      'xsm': { 'min': '280px' }, // Anything smaller than most phones (i.e. Galaxy Fold)
      'sm': {'min': '640px'}, // Anything smaller than an iPad Air or iPad Mini (i.e. iPhones, Samsung Galaxies, etc) 
      'md': {'min': '768px'}, // Anything smaller than a Nest Hub (i.e. iPad Air & iPad Mini)
      'lg': {'min': '1024px'}, // Nest Hub (non-max version)
      'xl': {'min': '1280px'}, // Nest Hub Max & MacBook Pro 2020 Displays (i.e. 720p)
      'xxl': {'min': '1920px'}, // 1080p displays/monitors
      'xxxl': { 'min': '2140px' } // 1440p displays/monitors
    },
    fontFamily: {
      poppins: ['Poppins'],
      roboto: ['Roboto']
    },
    extend: {},
  },
  plugins: [ require('tailwind-scrollbar-hide') ],
}