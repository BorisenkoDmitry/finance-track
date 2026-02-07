/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "#f5f6ff",
        primary: {
          500: "#6359e9",
          600: "#4e44d4",
          700: "#322e68",
          800: "#0b0a22",
          900: "#080714",
        },
        secondary: {
          500: "#2BD2BE",
        },
        grey: {
          0: "#f5f6ff",
          100: "#e9e9e9",
          200: "#bdbdbd",
        },
        bg: {
          body: "#141432",
          nav: "#1c1d41",
          menu: "#10122b",
        },
        popup: {
          overlay: "#080714b4",
        },
        logo: {
          sub: "#000000",
          up: "#547171",
          icon: "#000000",
        },
        brand: {
          primary: "#547171",
          "primary-light": "#1a1e46",
        },
      },
      fontFamily: {
        sans: ["Montserrat", "Arial", "sans-serif"],
      },
    },
  },
};

