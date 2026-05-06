// ── StatusBadge ──────────────────────────────────────────────────
export function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
      {label}
    </span>
  )
}

// ── StatCard ─────────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  delta?: string
  deltaUp?: boolean
  color?: string
  small?: boolean
}

export function StatCard({ label, value, icon, delta, deltaUp, color = 'text-brand', small }: StatCardProps) {
  return (
    <div className={`card p-4 ${small ? 'p-3' : 'p-4'}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className={`font-display font-bold ${small ? 'text-2xl' : 'text-3xl'} ${color} leading-none`}>
            {value}
          </div>
          <div className="text-ink-2 text-xs mt-1.5">{label}</div>
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-white/[0.04] text-ink-3">
            {icon}
          </div>
        )}
      </div>
      {delta && (
        <div className={`mt-2 text-[11px] font-medium ${deltaUp ? 'text-status-success' : 'text-status-danger'}`}>
          {deltaUp ? '↑' : '↓'} {delta}
        </div>
      )}
    </div>
  )
}

// ── PageHeader ───────────────────────────────────────────────────
interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  badge?: React.ReactNode
}

export function PageHeader({ title, subtitle, actions, badge }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <h1 className="font-display font-bold text-xl md:text-2xl text-ink-1 tracking-tight">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="text-ink-2 text-sm">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  )
}

// ── EmptyState ───────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="text-4xl mb-4 opacity-40">{icon}</div>}
      <div className="text-ink-2 font-medium mb-1">{title}</div>
      {description && <div className="text-ink-3 text-sm mb-4 max-w-sm">{description}</div>}
      {action}
    </div>
  )
}

// ── SectionLabel ─────────────────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-3 mb-2 mt-6">
      {children}
    </div>
  )
}

// ── Divider ──────────────────────────────────────────────────────
export function Divider() {
  return <hr className="border-white/[0.06] my-4" />
}

// ── Skeleton ─────────────────────────────────────────────────────
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-white/[0.06] rounded-lg ${className}`} />
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
