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

      // Color Guidance Asset Market
      colors: {
        primary: {
          0: "#000000",
          10: "#410005",
          20: "#68000E",
          30: "#980019",
          40: "#BE0924",
          50: "#E22D39",
          60: "#FF5355",
          70: "#FF8984",
          80: "#FFB3AF",
          90: "#FFDAD7",
          95: "#FFEDEB",
          99: "#FFFBFF",
          100: "#FFFFFF",
        },
        secondary: {
          0: "#000000",
          10: "#233876",
          20: "#1E429F",
          30: "#1A56DB",
          40: "#2563EB",
          50: "#3F83F8",
          60: "#5095FF",
          70: "#78AAFF",
          80: "#AAC9FF",
          90: "#D9E7FF",
          95: "#FFFBFF",
          99: "#FFFBFF",
          100: "#FFFFFF", //bg untuk light mode
        },
        neutral: {
          0: "#000000",
          10: "#171717",
          20: "#212121", //bg untuk dark mode
          25: "#303030", //content manage
          30: "#454747",
          40: "#5D5F5F",
          50: "#767777",
          60: "#9B9B9B",
          70: "#B4B4B4",
          80: "#E3E3E3",
          90: "#ECECEC",
          95: "#F8F9FA",
          99: "#FFFBFF",
          100: "#FFFFFF",
        },
        error: {
          0: "#000000",
          10: "#410002",
          20: "#690005",
          30: "#93000A",
          40: "#BA1A1A",
          50: "#DE3730",
          60: "#FF5449",
          70: "#FF897D",
          80: "#FFB4AB",
          90: "#FFDAD6",
          95: "#FFEDEA",
          99: "#FFFBFF",
          100: "#FFFFFF",
        },
        success: {
          0: "#000000",
          5: "#04FC0E",
          10: "#014737",
          20: "#03543F",
          30: "#046C4E",
          40: "#057A55",
          50: "#0E9F6E",
          60: "#31C48D",
          70: "#84E1BC",
          80: "#BCF0DA",
          90: "#DEF7EC",
          95: "#F3FAF7",
          99: "#FFFBFF",
          100: "#FFFFFF",
        },
      },
    },
  },
  plugins: [require("daisyui"), require("flowbite/plugin")],
};
