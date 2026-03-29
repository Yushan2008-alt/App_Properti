import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm Neutral Luxury palette
        bg: {
          primary: '#FAFAF7',
          secondary: '#F5F0E8',
          tertiary: '#EDE8DF',
          dark: '#1C1917',
        },
        accent: {
          gold: '#C9A96E',
          'gold-hover': '#B8935A',
          'gold-light': '#E8D5B0',
          'gold-pale': '#F7F0E3',
        },
        text: {
          primary: '#1C1917',
          secondary: '#78716C',
          tertiary: '#A8A29E',
          'on-dark': '#FAF9F7',
          'on-gold': '#1C1917',
        },
        border: {
          DEFAULT: '#E7E5E4',
          strong: '#D6D3D1',
          light: '#F5F5F4',
        },
        status: {
          success: '#4A7C59',
          'success-bg': '#F0F7F3',
          error: '#9B3A3A',
          'error-bg': '#FDF2F2',
          warning: '#92613A',
          'warning-bg': '#FEF7EE',
          info: '#3B6B9B',
          'info-bg': '#EFF6FF',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        'serif-display': ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['1.875rem', { lineHeight: '1.25' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        'container': '1400px',
      },
      boxShadow: {
        'luxury': '0 4px 24px -4px rgba(28, 25, 23, 0.08), 0 1px 4px -1px rgba(28, 25, 23, 0.04)',
        'luxury-hover': '0 12px 40px -8px rgba(28, 25, 23, 0.15), 0 4px 12px -2px rgba(28, 25, 23, 0.08)',
        'luxury-lg': '0 24px 64px -12px rgba(28, 25, 23, 0.18)',
        'gold': '0 0 0 2px rgba(201, 169, 110, 0.3)',
        'gold-strong': '0 0 20px rgba(201, 169, 110, 0.25)',
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #FAFAF7 0%, #F5F0E8 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1C1917 0%, #292524 100%)',
        'gradient-gold': 'linear-gradient(135deg, #C9A96E 0%, #E8D5B0 100%)',
        'shimmer': 'linear-gradient(90deg, #F5F0E8 25%, #EDE8DF 50%, #F5F0E8 75%)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}

export default config
