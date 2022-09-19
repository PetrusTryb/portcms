/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#13003f",
        accent2: "#b89aff",
        dark: "#111111"
      },
      opacity: {
        disabled: "0.04"
      },
      height: {
        "36px": "36px",
      },
      screens: {
        "md": "990px",
        "lg": "1200px",
        "xl": "1600px",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
