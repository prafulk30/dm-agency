// __define-ocg__ Tailwind config
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5fbff",
          100: "#e6f4ff",
          500: "#0ea5a4",
          700: "#0b8b88"
        }
      }
    }
  },
  plugins: [],
};
