module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      xsm: { min: "280px" },
      sm: { min: "640px" },
      md: { min: "768px" },
      lg: { min: "1024px" },
      xl: { min: "1280px" },
      xxl: { min: "1920px" },
      xxxl: { min: "2140px" },
    },
    fontFamily: {
      poppins: ["Poppins"],
      roboto: ["Roboto"],
    },
    extend: {},
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
