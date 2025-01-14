import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' }
        },
        float: {
          '0%': { 
            transform: 'translate(calc(-50% + var(--start-x)), calc(-50% + var(--start-y))) scale(var(--scale))',
            opacity: '1'
          },
          '100%': { 
            transform: 'translate(calc(-50% + var(--start-x) + (cos(var(--angle)) * 500px)), calc(-50% + var(--start-y) + (sin(var(--angle)) * 500px))) scale(var(--scale))',
            opacity: '0'
          }
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        }
      },
      animation: {
        'shake': 'shake 0.2s ease-in-out infinite',
        'float-heart': 'float 2s cubic-bezier(0.2, 0, 0.8, 1) forwards',
        'fade-out': 'fadeOut 2s ease-out forwards'
      }
    },
  },
  plugins: [],
}
export default config
