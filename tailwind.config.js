// Style Glasmorphism
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aqua: {
          main: '#6ECBD7',    // Primary
          soft: '#E3F8F3',    // Secondary
          accent: '#F4E9D8',  
          dark: '#1A2C42',    // for text
          glass: 'rgba(255, 255, 255, 0.4)', // Base for glass effect
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}
