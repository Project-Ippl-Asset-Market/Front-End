/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      colors: {
        primary: {
          1: "#980019",
          2: "#2563EB",
          3: "#000000",
          4: "#201E43",
          5: "#171717",
          6: "#212121",
          7: "#9B9B9B",
          8: "#B4B4B4",
          9: "#E3E3E3",
          10: "#ECECEC",
          11: "#F8F9FA",
          12: "#FFFFFF",
        },
        secondary: {
          1: "#FF5722",
          2: "#FFC107",
          3: "#4CAF50",
          4: "#03A9F4",
          5: "#9C27B0",
          6: "#FFEB3B",
          7: "#487cf5",
          8: "#346EF1",
        },
        neutral: {
          1: "#F5F5F5",
          2: "#DCDCDC",
          3: "#A0A0A0",
          4: "#606060",
          5: "#303030",
        },
        error: {
          1: "#D32F2F",
          2: "#F44336",
        },
        success: {
          1: "#04FC0E",
          2: "#388E3C",
          3: "#4CAF50",
        },
      },
    },
  },
  plugins: [require("daisyui"), require("flowbite/plugin")],
};
