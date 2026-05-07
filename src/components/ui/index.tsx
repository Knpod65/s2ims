/*
  S²IMS Shared UI Primitives
  ──────────────────────────
  All components in this file live INSIDE the AppShell wrapper, meaning
  the [data-role="..."] context is already active and CSS vars are available.

  Key contracts:
  • Daylight surfaces use bg-bg-000 / bg-bg-100 / bg-bg-200.
  • text-ink-1/2/3 are the daylight foreground scale.
  • Role-specific accents flow through CSS vars (--role-primary-hex, --role-tint, etc.).
*/

// ── StatusBadge ──────────────────────────────────────────────────────────
interface StatusBadgeProps {
  label: string
  /** Tailwind colour classes — e.g. "bg-blue-500/10 text-blue-400 border-blue-500/20" */
  color: string
  dot?: boolean
}

export function StatusBadge({ label, color, dot = false }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
                  text-xs font-semibold border ${color}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 shrink-0" />}
      {label}
    </span>
  )
}

// ── StatCard ─────────────────────────────────────────────────────────────
interface StatCardProps {
  label:       string
  value:       string | number
  icon?:       React.ReactNode
  delta?:      string
  deltaUp?:    boolean
  /** Tailwind text colour for the value — defaults to role-adaptive */
  color?:      string
  small?:      boolean
  /** If true, the icon bg uses role-surface + role-primary-hex from CSS vars */
  roleAccent?: boolean
}

export function StatCard({
  label, value, icon, delta, deltaUp,
  color, small, roleAccent = false,
}: StatCardProps) {
  const valueColor = color ?? 'text-role'   // text-role → var(--role-primary-hex)
  const sizeClass  = small ? 'text-2xl' : 'text-3xl'

  return (
    <div className={`card ${small ? 'p-3' : 'p-4'} card-hover`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className={`font-display font-bold ${sizeClass} ${valueColor} leading-none tracking-tight`}>
            {value}
          </div>
          <div className="text-ink-2 text-xs mt-1.5 leading-snug">{label}</div>
        </div>

        {icon && (
          roleAccent ? (
            <div
              className="p-2.5 rounded-xl shrink-0"
              style={{
                background: 'var(--role-surface)',
                color:      'var(--role-primary-hex)',
              }}
            >
              {icon}
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-surface-low text-ink-3 shrink-0">
              {icon}
            </div>
          )
        )}
      </div>

      {delta && (
        <div
          className={`mt-2 text-[11px] font-medium flex items-center gap-1 ${
            deltaUp ? 'text-status-success' : 'text-status-danger'
          }`}
        >
          <span>{deltaUp ? '↑' : '↓'}</span>
          <span>{delta}</span>
        </div>
      )}
    </div>
  )
}

// ── GlassCard ────────────────────────────────────────────────────────────
/**
 * Daylight glass card.
 *
 * variant "default"  → glass-card
 * variant "md"       → glass-card-md
 * variant "role"     → glass-card-role
 */
interface GlassCardProps {
  children:   React.ReactNode
  className?: string
  variant?:   'default' | 'md' | 'role'
  padding?:   string
}

export function GlassCard({
  children, className = '', variant = 'default', padding = 'p-4',
}: GlassCardProps) {
  const base =
    variant === 'role' ? 'glass-card-role' :
    variant === 'md'   ? 'glass-card-md'   :
                         'glass-card'

  return (
    <div className={`${base} ${padding} ${className}`}>
      {children}
    </div>
  )
}

// ── PageHeader ───────────────────────────────────────────────────────────
interface PageHeaderProps {
  title:     string
  subtitle?: string
  actions?:  React.ReactNode
  badge?:    React.ReactNode
  /**
   * If true, renders a small role-coloured dot next to the title.
   * Use this on dashboard & primary-feature pages.
   */
  roleIndicator?: boolean
}

export function PageHeader({
  title, subtitle, actions, badge, roleIndicator = false,
}: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5 mb-1 flex-wrap">
          {roleIndicator && (
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: 'var(--role-primary-hex)' }}
            />
          )}
          <h1 className="font-display font-bold text-xl md:text-2xl text-ink-1 tracking-tight leading-tight">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="text-ink-2 text-sm leading-relaxed mt-0.5">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  )
}

// ── EmptyState ───────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?:        React.ReactNode
  title:        string
  description?: string
  action?:      React.ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div className="text-4xl mb-4 opacity-30 select-none">{icon}</div>
      )}
      <div className="text-ink-2 font-medium mb-1">{title}</div>
      {description && (
        <div className="text-ink-3 text-sm mb-4 max-w-sm leading-relaxed">
          {description}
        </div>
      )}
      {action}
    </div>
  )
}

// ── SectionLabel ─────────────────────────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3 mb-2 mt-6 select-none">
      {children}
    </div>
  )
}

// ── Divider ──────────────────────────────────────────────────────────────
export function Divider({ className = '' }: { className?: string }) {
  return <hr className={`border-line my-4 ${className}`} />
}

// ── Skeleton ─────────────────────────────────────────────────────────────
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`data-role-loading rounded-lg ${className}`} />
  )
}

export function SkeletonCard() {
  return (
    <div className="card p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 w-10" />
      </div>
    </div>
  )
}

// ── RolePill ─────────────────────────────────────────────────────────────
/**
 * Compact role indicator pill — uses CSS vars automatically.
 * Useful in page headers and table rows to show which role an item belongs to.
 */
export function RolePill({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
      style={{
        background:  'var(--role-surface)',
        color:       'var(--role-primary-hex)',
        border:      '1px solid var(--role-border)',
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: 'var(--role-primary-hex)' }}
      />
      {label}
    </span>
  )
}

// ── PrivacyNotice ────────────────────────────────────────────────────────
/**
 * Inline privacy / governance notice.
 * Preserves PDPA/audit appearance — styled as a persistent warning, not dismissible.
 */
interface PrivacyNoticeProps {
  children:  React.ReactNode
  variant?:  'default' | 'warning' | 'strict'
}

export function PrivacyNotice({ children, variant = 'default' }: PrivacyNoticeProps) {
  const colours = {
    default: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-[#FFFBEB] border-[#FDE68A] text-[#78350F]',
    strict:  'bg-red-50 border-red-200 text-red-800',
  }
  const icons = { default: '🔒', warning: '⚠️', strict: '🚫' }

  return (
    <div
      className={`flex items-start gap-2.5 px-3.5 py-3 rounded-lg border text-xs
                  leading-relaxed ${colours[variant]}`}
    >
      <span className="text-sm shrink-0 mt-0.5 select-none">{icons[variant]}</span>
      <span>{children}</span>
    </div>
  )
}
