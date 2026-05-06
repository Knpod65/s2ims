import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          '000': '#06080F',
          '100': '#0D111C',
          '200': '#131825',
          '300': '#1A2234',
          '400': '#252F45',
        },
        brand: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          dim: 'rgba(245,158,11,0.12)',
        },
        ink: {
          '1': '#E2E8F5',
          '2': '#7B88A0',
          '3': '#4A5568',
        },
        status: {
          info: '#3B82F6',
          success: '#10B981',
          danger: '#EF4444',
          warning: '#F59E0B',
          ai: '#8B5CF6',
          track: '#14B8A6',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.06)',
        lifted: '0 8px 24px rgba(0,0,0,.5), 0 0 0 1px rgba(245,158,11,.15)',
        glow: '0 0 24px rgba(245,158,11,.15)',
      },
      animation: {
        'pulse-soft': 'pulse-soft 2.5s ease-in-out infinite',
        'ring-draw': 'ring-draw 700ms cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-in': 'fade-in 200ms ease forwards',
        'slide-up': 'slide-up 250ms cubic-bezier(0.4,0,0.2,1) forwards',
        'toast-in': 'toast-in 300ms cubic-bezier(0.34,1.56,0.64,1) forwards',
      },
      keyframes: {
        'pulse-soft': {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'ring-draw': {
          from: { strokeDashoffset: '251' },
          to: { strokeDashoffset: 'var(--target-offset)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateX(100%)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
    },
  },
  plugins: [],
}
export default config
