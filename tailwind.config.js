/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          wine: '#000000',
          'wine-dark': '#000000',
          'wine-light': '#333333',
          rose: '#666666',
          'rose-light': '#F5F5F5',
          ivory: '#FFFFFF',
          beige: '#E0E0E0',
          'beige-dark': '#CCCCCC',
          gold: '#666666',
          'gold-light': '#F5F5F5',
          charcoal: '#000000',
          muted: '#666666',
        }
      },
      fontFamily: {
        serif: ['Roboto', 'sans-serif'],
        sans: ['Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
