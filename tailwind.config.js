/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#6B7280',
        background: '#F3F4F6',
      },
      spacing: {
        sidebar: '240px',
        header: '60px',
      }
    }
  },
  plugins: [],
}