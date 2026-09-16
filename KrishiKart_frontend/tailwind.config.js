/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        moss: {
          50: '#f2f6ee',
          100: '#e1ecd6',
          200: '#c5dab0',
          300: '#a1c283',
          400: '#7fa85e',
          500: '#5f8a41',
          600: '#496d32',
          700: '#3a5629',
          800: '#2f4523',
          900: '#28391f',
          950: '#131f0f',
        },
        harvest: {
          50: '#fdf8ec',
          100: '#faedc8',
          200: '#f4d98d',
          300: '#eec052',
          400: '#e9ab2e',
          500: '#da8f1c',
          600: '#bd6d15',
          700: '#974e15',
          800: '#7c3e18',
          900: '#683418',
        },
        soil: {
          50: '#f7f4f0',
          100: '#e9e1d6',
          200: '#d3c1ab',
          300: '#b89b7c',
          400: '#a37f5c',
          500: '#8a6749',
          600: '#71533c',
          700: '#5a4232',
          800: '#423124',
          900: '#2b201a',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
