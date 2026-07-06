/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#D81B60',
          600: '#be185d',
          700: '#9d174d',
          800: '#831843',
          900: '#4A148C',
        },
        ink: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -8px rgba(15, 23, 42, 0.08)',
        card: '0 1px 3px rgba(15,23,42,0.04), 0 8px 24px -12px rgba(15,23,42,0.08)',
        glow: '0 12px 40px -12px rgba(216, 27, 96, 0.35)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #D81B60 0%, #4A148C 100%)',
        'brand-soft': 'linear-gradient(135deg, rgba(216, 27, 96, 0.08) 0%, rgba(74, 20, 140, 0.08) 100%)',
        'mesh': 'radial-gradient(at 20% 10%, rgba(216, 27, 96, 0.10) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(74, 20, 140, 0.10) 0px, transparent 50%), radial-gradient(at 100% 60%, rgba(216, 27, 96, 0.08) 0px, transparent 50%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
