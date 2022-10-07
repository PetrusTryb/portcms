/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#a2b5cd",
        accent2: "#bebebe",
        dark: "#111111"
      },
      opacity: {
        disabled: "0.04"
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
