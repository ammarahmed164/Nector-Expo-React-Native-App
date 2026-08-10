/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#53B175",
        primaryDark: "#3E8E5A",
        secondary: "#F8A44C",
        danger: "#F53E3E",
        bg: "#F2F3F2",
        dark: "#181725",
        muted: "#7C7C7C",
        line: "#E2E2E2",
      },
      fontFamily: {
        sans: ["Poppins_400Regular"],
        medium: ["Poppins_500Medium"],
        semibold: ["Poppins_600SemiBold"],
        bold: ["Poppins_700Bold"],
      },
    },
  },
  plugins: [],
};
