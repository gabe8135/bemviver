import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#3b82f6', dark: '#2563eb', light: '#93c5fd' },
        accent: '#0ea5a8'
      },
      boxShadow: {
        card: '0 10px 25px -10px rgba(2,8,23,.35)',
        glow: '0 0 0 1px rgba(59,130,246,.25), 0 8px 40px -12px rgba(59,130,246,.35)'
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(1200px 600px at 10% -10%, rgba(147,197,253,.35), transparent 60%), radial-gradient(800px 400px at 90% 10%, rgba(59,130,246,.25), transparent 60%)'
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pulseSoft: { '0%,100%': { opacity: '.9' }, '50%': { opacity: '1' } }
      },
      animation: {
        fadeIn: 'fadeIn .6s ease-out both',
        pulseSoft: 'pulseSoft 3s ease-in-out infinite'
      }
    },
  },
  plugins: [],
};
export default config;
