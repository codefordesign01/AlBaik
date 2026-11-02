/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50: '#fff1f1', 100: '#ffdede', 200: '#ffc2c3', 300: '#ff9698', 400: '#ff5a5e', 500: '#f12b31', 600: '#e31b23', 700: '#bd1219', 800: '#9b141a', 900: '#7f171b' },
        sun: { 300: '#ffe27a', 400: '#ffd23f', 500: '#ffc400', 600: '#e6a800' },
        ink: { 800: '#241413', 900: '#170c0b', 950: '#0e0706' },
        cream: '#fff8ec',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        urdu: ['"Noto Nastaliq Urdu"', 'serif'],
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(120, 20, 20, .25)',
        glow: '0 10px 40px -8px rgba(227, 27, 35, .55)',
      },
      keyframes: {
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        kenburns: { from: { transform: 'scale(1)' }, to: { transform: 'scale(1.12)' } },
        pop: { '0%': { transform: 'scale(.8)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
        slideUp: { from: { transform: 'translateY(24px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
      },
      animation: {
        floaty: 'floaty 5s ease-in-out infinite',
        marquee: 'marquee 28s linear infinite',
        kenburns: 'kenburns 9s ease-out forwards',
        pop: 'pop .25s ease-out',
        slideUp: 'slideUp .6s ease-out both',
      },
    },
  },
  plugins: [],
}
