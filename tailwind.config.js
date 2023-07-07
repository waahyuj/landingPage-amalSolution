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
      colors: {
        firstPurple: '#7839F3',
        secondPurple: '#ECE3FE',
        thirdPurple: '#4D1CAB',
        fourthPurple: '#211B3D',
        green: '#31B380',
        grey: '#5B5575',
        colorBorder: '#ECE3FE',
        colorFooter: '#F7F7FB',
      },
    },
  },
  plugins: [require("tw-elements/dist/plugin.cjs")],
}
