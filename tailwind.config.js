/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#2F9E62",
        primaryDark: "#247A4B",
        primarySoft: "#E9F7EF",
        secondary: "#F59E42",
        secondarySoft: "#FFF4E8",
        danger: "#E5484D",
        dangerSoft: "#FDECEC",
        bg: "#F5F7F6",
        canvas: "#F5F7F6",
        surface: "#FFFFFF",
        surfaceAlt: "#EEF3F0",
        dark: "#17221B",
        muted: "#69766E",
        line: "#E2E9E5",
        lineStrong: "#D5DFD9",
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
