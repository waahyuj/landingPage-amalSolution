/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.{pug, html}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['"Poppins"', "sans-serif"],
      },
    },
  },
  plugins: [require("tw-elements/dist/plugin.cjs")],
}
