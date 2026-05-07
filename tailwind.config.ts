import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {

      /* ── Colour palette ─────────────────────────────────────────────── */
      colors: {
        /* Daylight surface scale */
        bg: {
          '000': '#FAF8FF',
          '100': '#FFFFFF',
          '200': '#F4F1FB',
          '300': '#ECE8F6',
          '400': '#DED9EA',
        },
        surface: {
          DEFAULT: '#FAF8FF',
          bright: '#FFFFFF',
          low: '#F4F1FB',
          muted: '#ECE8F6',
        },
        line: {
          DEFAULT: '#D9D9E6',
          strong: '#C7C7D8',
        },
        /* Legacy brand amber — kept for backward compat with inner pages */
        brand: {
          DEFAULT: '#F59E0B',
          light:   '#FCD34D',
          dim:     'rgba(245,158,11,0.12)',
        },
        /* Text ink scale */
        ink: {
          DEFAULT: '#0F172A',
          '1': '#0F172A',
          '2': '#434656',
          '3': '#737688',
        },
        /* Semantic status */
        status: {
          info:    '#3B82F6',
          success: '#10B981',
          danger:  '#EF4444',
          warning: '#F59E0B',
          ai:      '#8B5CF6',
          track:   '#14B8A6',
        },
        /* ── Role-adaptive colours via CSS custom properties ──
           Set on the [data-role="..."] wrapper in AppShell.
           Use: text-role-primary, bg-role-surface, border-role-border, etc.
        ── */
        role: {
          primary:  'var(--role-primary-hex)',
          'primary-2': 'var(--role-secondary)',
          secondary:'var(--role-secondary)',
          tint:     'var(--role-tint)',
          surface:  'var(--role-surface)',
          border:   'var(--role-border)',
          glow:     'var(--role-glow)',
          'grad-from': 'var(--role-grad-from)',
          'grad-to':   'var(--role-grad-to)',
        },
      },

      /* ── Typography ─────────────────────────────────────────────────── */
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)',    'sans-serif'],
        mono:    ['var(--font-mono)',    'monospace'],
      },

      /* ── Border radius ──────────────────────────────────────────────── */
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
      },

      /* ── Shadows ────────────────────────────────────────────────────── */
      boxShadow: {
        card:   '0 18px 45px rgba(15,23,42,.07), 0 1px 0 rgba(255,255,255,.85) inset',
        lifted: '0 22px 60px rgba(15,23,42,.12), 0 0 0 1px var(--role-border)',
        glow:   '0 0 24px var(--role-glow)',
        'role-sm': '0 2px 8px var(--role-glow)',
        inner:  'inset 0 1px 0 rgba(255,255,255,.75)',
      },

      /* ── Animations ─────────────────────────────────────────────────── */
      animation: {
        'pulse-soft': 'pulse-soft 2.5s ease-in-out infinite',
        'ring-draw':  'ring-draw 700ms cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-in':    'fade-in 200ms ease forwards',
        'slide-up':   'slide-up 250ms cubic-bezier(0.4,0,0.2,1) forwards',
        'toast-in':   'toast-in 300ms cubic-bezier(0.34,1.56,0.64,1) forwards',
        'shimmer':    'shimmer 1.6s ease-in-out infinite',
      },

      /* ── Keyframes ──────────────────────────────────────────────────── */
      keyframes: {
        'pulse-soft': {
          '0%,100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        'ring-draw': {
          from: { strokeDashoffset: '251' },
          to:   { strokeDashoffset: 'var(--target-offset)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'none' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'none' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateX(100%)' },
          to:   { opacity: '1', transform: 'none' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },

    },
  },
  plugins: [],
}

export default config
