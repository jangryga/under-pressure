/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          900: "#121212",
          500: "#383838",
        },
        primaryText: {
          200: "#F9F9F9",
          400: "#F5F6F5",
        },
      },
    },
  },
  plugins: [],
};
