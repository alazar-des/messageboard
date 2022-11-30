/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}", "./views/*.pug"],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1",
        secondary: {
          100: "#E2E2E5",
          200: "#888883",
        },
      },
      fontFamily: {
        body: ["Nunito"],
      },
    },
  },
  plugins: [],
};
