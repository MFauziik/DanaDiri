/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00A2ED',
        secondary: '#3A7DF0',
        tertiary: '#38BDF8',
        skyLight: '#F0F9FF',
        darkText: '#0F172A',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      fontSize: {
        'xs': 'clamp(0.65rem, 0.5vw + 0.5rem, 0.75rem)',
        'sm': 'clamp(0.75rem, 0.8vw + 0.5rem, 0.875rem)',
        'base': 'clamp(0.875rem, 1vw + 0.5rem, 1rem)',
        'lg': 'clamp(1rem, 1.25vw + 0.5rem, 1.125rem)',
        'xl': 'clamp(1.125rem, 1.5vw + 0.5rem, 1.25rem)',
        '2xl': 'clamp(1.25rem, 2vw + 0.5rem, 1.5rem)',
        '3xl': 'clamp(1.5rem, 2.5vw + 0.5rem, 1.875rem)',
        '4xl': 'clamp(1.875rem, 3vw + 0.5rem, 2.25rem)',
        '5xl': 'clamp(2.25rem, 4vw + 0.5rem, 3rem)',
        '6xl': 'clamp(3rem, 5vw + 0.5rem, 4rem)',
      }
    },
  },
  plugins: [],
}