export const colors = {
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#0EA5E9',
  white: '#FFFFFF',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
} as const

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
} as const

export const typography = {
  display1: { size: '48px', weight: 700 },
  display2: { size: '36px', weight: 700 },
  headline: { size: '28px', weight: 600 },
  title: { size: '20px', weight: 600 },
  subtitle: { size: '16px', weight: 500 },
  body: { size: '14px', weight: 400 },
  smallText: { size: '12px', weight: 400 },
  mono: { size: '13px', weight: 400, family: 'monospace' as const },
} as const

export const radius = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
} as const

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
} as const

export const breakpoints = {
  mobile: 640,
  tablet: 1024,
  desktop: 1280,
} as const

export const statusColors = {
  success:  { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
  warning:  { bg: 'bg-amber-100',   text: 'text-amber-800',   border: 'border-amber-200'   },
  error:    { bg: 'bg-red-100',     text: 'text-red-800',     border: 'border-red-200'     },
  info:     { bg: 'bg-sky-100',     text: 'text-sky-800',     border: 'border-sky-200'     },
  neutral:  { bg: 'bg-gray-100',    text: 'text-gray-700',    border: 'border-gray-200'    },
  blocked:  { bg: 'bg-gray-200',    text: 'text-gray-600',    border: 'border-gray-300'    },
  preview:  { bg: 'bg-purple-100',  text: 'text-purple-800',  border: 'border-purple-200'  },
  disabled: { bg: 'bg-gray-100',    text: 'text-gray-400',    border: 'border-gray-200'    },
} as const

export type StatusColorKey = keyof typeof statusColors
