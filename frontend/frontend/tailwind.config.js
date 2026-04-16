/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#34d399',
          DEFAULT: '#10b981', // Emerald Green
          dark: '#059669',
        },
        accent: {
          DEFAULT: '#f59e0b', // Amber
        },
        background: '#f8fafc',
        surface: '#ffffff',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
