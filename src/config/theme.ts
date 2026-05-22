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

// ── Soft Civic Intelligence tokens (MC87) ────────────────────────────────────
// Additive only — existing exports above are unchanged.

export const softCivicColors = {
  surface: {
    paper:   '#FBFAF6',
    warm:    '#F4F0E6',
    card:    '#FFFFFF',
    overlay: 'rgba(27, 29, 31, 0.04)',
  },
  text: {
    ink:     '#1B1D1F',
    muted:   '#4A4E52',
    inverse: '#FFFFFF',
    link:    '#2E5B8C',
  },
  status: {
    // preview is magenta-violet — NEVER amber/warning
    preview:  { base: '#6B3B8C', light: '#F3E9F8', text: '#4A2A5C' },
    blocked:  { base: '#5C5C5C', light: '#F0F0F0', text: '#3A3A3A' },
    disabled: { base: '#8A8A8A', light: '#F5F5F5', text: '#5C5C5C' },
    success:  { base: '#2E5B4A', light: '#E8F1ED', text: '#1F3D32' },
    warning:  { base: '#8B5E2B', light: '#F5EDE3', text: '#5C3E1C' },
    error:    { base: '#8B3B3B', light: '#F5E9E9', text: '#5C2727' },
    info:     { base: '#2E5B8C', light: '#E8EEF6', text: '#1F3D5C' },
  },
} as const

export const softCivicRoles = {
  admin:    { base: '#3B2E7E', light: '#EDE9F8' },
  staff:    { base: '#2E5B4A', light: '#E8F1ED' },
  provider: { base: '#8B5E2B', light: '#F5EDE3' },
  student:  { base: '#2E5B8C', light: '#E8EEF6' },
  esq:      { base: '#6B3B6B', light: '#F3E9F3' },
  public:   { base: '#4A5B3A', light: '#EEF2E8' },
} as const

export const softCivicGovernance = {
  ap10b: { base: '#6B3B8C', light: '#F3E9F8', text: '#4A2A5C' },
  ap10c: { base: '#8B5E2B', light: '#F5EDE3', text: '#5C3E1C' },
  ap11:  { base: '#8B3B3B', light: '#F5E9E9', text: '#5C2727' },
} as const

export const softCivicRadius = {
  small:   '4px',
  control: '8px',
  card:    '14px',
  full:    '9999px',
} as const

export const softCivicShadow = {
  soft:   '0 2px 8px rgba(27, 29, 31, 0.08)',
  medium: '0 4px 16px rgba(27, 29, 31, 0.12)',
  strong: '0 8px 32px rgba(27, 29, 31, 0.16)',
} as const

export const softCivicTypography = {
  // Font strategy: CSS-first via @font-face / Google Fonts in a future milestone.
  // IBM Plex Sans / Thai / Mono are NOT installed as npm packages in MC87.
  fontFamily: {
    sans: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    thai: "'IBM Plex Sans Thai', 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  scale: {
    xs: '12px', sm: '14px', base: '16px', lg: '18px',
    xl: '20px', '2xl': '24px', '3xl': '28px', '4xl': '32px',
  },
  weight:     { regular: 400, medium: 500, semibold: 600, bold: 700 },
  lineHeight: { tight: 1.2, normal: 1.5, relaxed: 1.7 },
} as const

export const softCivicSpacing = {
  '0':  '0px',  '1':  '4px',  '2':  '8px',  '3': '12px',
  '4':  '16px', '5':  '20px', '6':  '24px', '8': '32px',
  '10': '40px', '12': '48px', '16': '64px',
} as const

// Aggregate — import this for one-stop access to all Soft Civic tokens.
export const softCivicTheme = {
  colors:     softCivicColors,
  roles:      softCivicRoles,
  governance: softCivicGovernance,
  radius:     softCivicRadius,
  shadow:     softCivicShadow,
  typography: softCivicTypography,
  spacing:    softCivicSpacing,
} as const

export type SoftCivicRoleKey       = keyof typeof softCivicRoles
export type SoftCivicGovernanceKey = keyof typeof softCivicGovernance
