/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        info: "#0070BF",
        accent: "#0066EE",
        accent2: "#1943CF",
        dark: "#222628"
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
