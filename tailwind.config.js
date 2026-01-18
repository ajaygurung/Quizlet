/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        punti: {
          bg: "#FFF6FB",
          card: "#FFFFFF",
          pink: "#FF4FA3",
          pink2: "#FF2E93",
          border: "#F2D7E6",
          text: "#1B1B1F",
          muted: "#6B6B73",
        },
      },
      boxShadow: {
        punti: "0 10px 30px rgba(255,79,163,.14)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
