/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f2ff',
          100: '#cce0ff',
          200: '#99c2ff',
          300: '#66a3ff',
          400: '#3385ff',
          500: '#0066e6',
          600: '#007bff',
          700: '#0062d9',
          800: '#0047b3',
          900: '#003380',
          950: '#002054',
        },
        accent: {
          DEFAULT: '#007bff',
          light: '#3385ff',
          dark: '#0062d9',
        },
        surface: {
          card: '#ffffff',
          muted: '#f8fafc',
          border: '#e2e8f0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
        header: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
      },
      borderRadius: {
        card: '0.75rem',
        input: '0.5rem',
        button: '9999px',
      },
    },
  },
  plugins: [],
}
