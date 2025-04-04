/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/theme/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",

        textPrimary: "var(--color-text-primary)",
        textSecondary: "var(--color-text-secondary)",
        textlight: "var(--color-text-light)",
        textblack: "var(--color-text-black)",

        sidebar: "var(--color-sidebar)",

        background: "var(--color-background)",
        backgrounddark: "var(--color-background-dark)",
        backgroundcard: "var(--color-background-card)",
        backgroundfooter: "var(--color-background-footer)",

        card: "var(--color-card)",
      },
      fontFamily: {
        themefont: "var(--font)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        rotateinplace: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        zoomInPlace: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.9)" },
        },
        jump: {
          "0%, 100%": { transform: "translateY(10%)" },
          "50%": { transform: "translateY(0%)" },
        },
        move: {
          "0%, 100%": { transform: "translateX(-10%)" },
          "50%": { transform: "translateX(0%)" },
        },
        zoom: {
          "0%, 100%": { transform: "scale(90%)" },
          "50%": { transform: "scale(100%)" },
        },
        justZoom: {
          "100%": { transform: "scale(105%)" },
        },
        flip: {
          from: { transform: "rotateX(0deg)", transformOrigin: "50% bottom" },
          to: { transform: "rotateX(180deg)", transformOrigin: "50% bottom" },
        },
      },
      animation: {
        rotateinplace: "rotateinplace 4s linear infinite",
        jump: "jump 4s linear infinite",
        move: "move 4s linear infinite",
        zoom: "zoom 4s linear infinite",
        justZoom: "justZoom 1s 1",
        flip: "flip 1s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [],
};
