/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'forest-green': '#1a4d2e',
        'forest-green-light': '#2d5f3f',
        'earth-brown': '#6b4423',
        'earth-brown-light': '#8b5a3c',
        'elegant-gold': '#d4af37',
        'elegant-gold-light': '#f4e5c2',
        'soft-sand': '#f5f2e8',
        'dark-charcoal': '#2c3e50',
        'light-gray': '#ecf0f1',
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'Georgia', 'serif'],
        'inter': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1a4d2e 0%, #2d5f3f 50%, #3a6b4a 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #6b4423 0%, #8b5a3c 50%, #a0704f 100%)',
        'gradient-accent': 'linear-gradient(135deg, #d4af37 0%, #f4e5c2 50%, #fff9e6 100%)',
        'gradient-hero': 'linear-gradient(135deg, #1a4d2e 0%, #2d5f3f 25%, #3a6b4a 50%, #6b4423 75%, #8b5a3c 100%)',
      },
      boxShadow: {
        'luxury': '0 20px 60px rgba(26, 77, 46, 0.15)',
        'luxury-hover': '0 30px 80px rgba(26, 77, 46, 0.25)',
        'gold': '0 10px 40px rgba(212, 175, 55, 0.2)',
      },
    },
  },
  plugins: [],
};

