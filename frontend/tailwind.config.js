/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f43f5e',      // rose-500
        secondary: '#fb7185',    // rose-400
        accent: '#fda4af',       // rose-300
        'light-bg': '#fef2f2',   // rose-50
        'dark-text': '#881337',  // rose-900
        'light-text': '#f472b6', // pink-400
      },
    },
  },
  plugins: [],
}

