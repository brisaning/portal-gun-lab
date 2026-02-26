/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          DEFAULT: "#00ff00",
          bright: "#39ff14",
          lime: "#7cfc00",
          dim: "#2dd10f",
        },
        dark: {
          bg: "#0a0f0a",
          deeper: "#051005",
        },
      },
      fontFamily: {
        sans: ["Poppins", "Quicksand", "system-ui", "sans-serif"],
        display: ["Quicksand", "Poppins", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "neon": "0 0 20px #39ff14, 0 0 40px rgba(57, 255, 20, 0.3)",
        "neon-sm": "0 0 10px #39ff14",
      },
      animation: {
        "gradient": "gradient 8s ease infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", textShadow: "0 0 20px #39ff14, 0 0 40px #39ff14" },
          "50%": { opacity: "0.9", textShadow: "0 0 30px #39ff14, 0 0 60px #2dd10f" },
        },
      },
      backgroundSize: {
        "gradient": "200% 200%",
      },
      transitionDuration: {
        smooth: "300ms",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
}
