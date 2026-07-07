import type { ReactNode } from 'react'

interface SoftNeonPanelProps {
  children: ReactNode
  className?: string
}

export default function SoftNeonPanel({ children, className = '' }: SoftNeonPanelProps) {
  return (
    <section className={`rounded-xl border border-cyber-border/45 bg-cyber-glass p-4 text-cyber-slate shadow-cyber-soft backdrop-blur ${className}`}>
      {children}
    </section>
  )
}
