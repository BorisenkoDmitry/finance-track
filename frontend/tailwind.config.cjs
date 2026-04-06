/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "#f0e6ef",
        primary: {
          300: "#ffa0aa",
          400: "#ff8d98",
          500: "#FF7582",
          600: "#e8606e",
          700: "#5a3a4a",
          800: "#1c1525",
          900: "#140f1c",
        },
        secondary: {
          400: "#5a8aaa",
          500: "#355C7D",
          600: "#2a4d6a",
        },
        accent: {
          400: "#d48a9e",
          500: "#C56C86",
          600: "#a85a72",
        },
        muted: {
          400: "#8e72a0",
          500: "#725A7A",
          600: "#5e4966",
        },
        grey: {
          0: "#f0e6ef",
          50: "#e5dbe4",
          100: "#d4c8d3",
          200: "#a89ba7",
          300: "#7a6e79",
        },
        bg: {
          body: "#1a2535",
          nav: "#1e2d3f",
          menu: "#152231",
        },
        popup: {
          overlay: "#0d1520cc",
        },
        logo: {
          sub: "#000000",
          up: "#355C7D",
          icon: "#000000",
        },
        brand: {
          primary: "#355C7D",
          "primary-light": "#1e3348",
        },
        success: "#4ade80",
        danger: "#FF7582",
        warning: "#fbbf24",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-sm": "0 0 15px -3px rgba(255, 117, 130, 0.25)",
        "glow-md": "0 0 30px -5px rgba(255, 117, 130, 0.3)",
        "glow-lg": "0 0 50px -8px rgba(255, 117, 130, 0.35)",
        "glow-teal": "0 0 25px -5px rgba(53, 92, 125, 0.4)",
        "glow-accent": "0 0 20px -5px rgba(197, 108, 134, 0.35)",
        "glow-success": "0 0 20px -5px rgba(74, 222, 128, 0.3)",
        "glow-danger": "0 0 20px -5px rgba(255, 117, 130, 0.35)",
        "card": "0 8px 32px -8px rgba(0, 0, 0, 0.45), 0 0 1px rgba(197, 108, 134, 0.12)",
        "card-hover": "0 16px 48px -12px rgba(0, 0, 0, 0.55), 0 0 30px -10px rgba(255, 117, 130, 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "fade-in-up": "fadeInUp 0.5s ease-out",
        "fade-in-down": "fadeInDown 0.4s ease-out",
        "slide-in-left": "slideInLeft 0.4s ease-out",
        "slide-in-right": "slideInRight 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        drawLetter: {
          "0%": { strokeDashoffset: "200" },
          "100%": { strokeDashoffset: "0" },
        },
        drawLine: {
          "0%": { strokeDashoffset: "100" },
          "100%": { strokeDashoffset: "0" },
        },
        popIn: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "60%": { transform: "scale(1.3)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        lookAround: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-1.5px) translateY(0.5px)" },
          "40%": { transform: "translateX(2px) translateY(-0.5px)" },
          "60%": { transform: "translateX(1px) translateY(1px)" },
          "80%": { transform: "translateX(-1px) translateY(-0.5px)" },
        },
        lookAroundAlt: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(2px) translateY(-0.5px)" },
          "40%": { transform: "translateX(-1px) translateY(1px)" },
          "60%": { transform: "translateX(-2px) translateY(-0.5px)" },
          "80%": { transform: "translateX(1.5px) translateY(0.5px)" },
        },
        blink: {
          "0%, 8%, 100%": { transform: "scaleY(0)", opacity: "0" },
          "4%": { transform: "scaleY(1)", opacity: "1" },
        },
        waveLeft: {
          "0%, 100%": { transform: "rotate(0deg)", transformOrigin: "right center" },
          "25%": { transform: "rotate(-12deg)", transformOrigin: "right center" },
          "75%": { transform: "rotate(5deg)", transformOrigin: "right center" },
        },
        waveRight: {
          "0%, 100%": { transform: "rotate(0deg)", transformOrigin: "left center" },
          "25%": { transform: "rotate(12deg)", transformOrigin: "left center" },
          "75%": { transform: "rotate(-5deg)", transformOrigin: "left center" },
        },
      },
    },
  },
};
