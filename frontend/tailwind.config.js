export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FBF8F4",
        ink: "#1A1815",
        crimson: {
          DEFAULT: "#C41E3A",
          dark: "#9E1730",
          light: "#FCE8EB",
        },
        amber: {
          DEFAULT: "#E8A33D",
          light: "#FDF3E2",
        },
        verified: {
          DEFAULT: "#2F6844",
          light: "#E7F1EA",
        },
        slate: {
          DEFAULT: "#5B6472",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};