
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#FDFBF9',
        'primary': '#333333',
        'secondary': '#EAEAEA',
        'accent': '#D4AF37', // A soft gold
        'light-gray': '#F5F5F5',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 14px 0 rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '1rem',
      }
    },
  },
  plugins: [],
} satisfies Config
