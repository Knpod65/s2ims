'use client'

interface ShortlistStatusBadgeProps {
  status: 'pending_review' | 'approved' | 'rejected'
}

export default function ShortlistStatusBadge({ status }: ShortlistStatusBadgeProps) {
  const statusConfig = {
    pending_review: {
      bg: 'bg-status-info/[0.12]',
      text: 'text-status-info',
      icon: '⏳',
      label: 'Pending Staff Approval',
    },
    approved: {
      bg: 'bg-status-success/[0.12]',
      text: 'text-status-success',
      icon: '✓',
      label: 'Approved',
    },
    rejected: {
      bg: 'bg-status-danger/[0.12]',
      text: 'text-status-danger',
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
