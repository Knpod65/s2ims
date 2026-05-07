'use client'

interface ShortlistStatusBadgeProps {
  status: 'pending_review' | 'approved' | 'rejected'
}

export default function ShortlistStatusBadge({ status }: ShortlistStatusBadgeProps) {
  const statusConfig = {
    pending_review: {
      bg: 'bg-blue-50 border border-blue-200',
      text: 'text-blue-700',
      icon: '•',
      label: 'Pending Staff Approval',
    },
    approved: {
      bg: 'bg-emerald-50 border border-emerald-200',
      text: 'text-emerald-700',
      icon: '✓',
      label: 'Approved',
    },
    rejected: {
      bg: 'bg-red-50 border border-red-200',
      text: 'text-red-700',
      icon: '✕',
      label: 'Rejected',
    },
  }

  const config = statusConfig[status]

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${config.bg} ${config.text}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  )
}
