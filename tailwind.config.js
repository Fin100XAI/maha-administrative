/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary — State-Intelligence government blue.
        // Ranges from a bright DigiIndia-style Google blue at 500 to a deep sovereign navy at 900.
        brand: {
          50:  '#EFF4FC',
          100: '#D9E5F8',
          200: '#B5CBF1',
          300: '#88A9E5',
          400: '#5482D5',
          500: '#0B57D0',
          600: '#0A47AA',
          700: '#083684',
          800: '#062868',
          900: '#031A45',
        },
        // Google-style secondary palette for accents, charts, and multi-series data viz.
        google: {
          blue:   { 50: '#E8F0FE', 100: '#D2E3FC', 400: '#78A9F9', 500: '#4285F4', 600: '#3B78E7', 700: '#2C5FBF' },
          red:    { 50: '#FCE8E6', 100: '#F9DCDA', 400: '#EE675C', 500: '#EA4335', 600: '#D33B2C', 700: '#B4271A' },
          yellow: { 50: '#FEF7E0', 100: '#FCE8B2', 400: '#FCC934', 500: '#FBBC05', 600: '#F5A623', 700: '#EA8600' },
          green:  { 50: '#E6F4EA', 100: '#CEEAD6', 400: '#5BB974', 500: '#34A853', 600: '#2A8C42', 700: '#1E7332' },
        },
        ink: {
          50:  '#f8fafc',
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
        glow: '0 12px 40px -12px rgba(11, 87, 208, 0.35)',
      },
      backgroundImage: {
        // Blue government gradient — bright signal to deep navy sovereignty.
        'brand-gradient': 'linear-gradient(135deg, #0B57D0 0%, #062868 100%)',
        'brand-soft':    'linear-gradient(135deg, rgba(11, 87, 208, 0.08) 0%, rgba(6, 40, 104, 0.08) 100%)',
        // Google multi-color arc — for hero highlights and accents.
        'google-arc':    'linear-gradient(90deg, #4285F4 0%, #EA4335 33%, #FBBC05 66%, #34A853 100%)',
        'mesh':          'radial-gradient(at 20% 10%, rgba(11, 87, 208, 0.10) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(6, 40, 104, 0.10) 0px, transparent 50%), radial-gradient(at 100% 60%, rgba(66, 133, 244, 0.08) 0px, transparent 50%)',
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
