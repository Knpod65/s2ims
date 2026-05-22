import * as React from 'react'

export interface DisabledActionHintProps {
  apCode?: 'AP-10B' | 'AP-10C' | 'AP-11'
  reason: string
  children?: React.ReactNode
  className?: string
}

const apCodeMessages: Record<'AP-10B' | 'AP-10C' | 'AP-11', string> = {
  'AP-10B': 'AP-10B',
  'AP-10C': 'AP-10C',
  'AP-11':  'AP-11',
}

export function DisabledActionHint({
  apCode,
  reason,
  children,
  className = '',
}: DisabledActionHintProps) {
  return (
    <div className={['inline-flex flex-col gap-1', className].filter(Boolean).join(' ')}>
      {/* The disabled control renders here — it is always visible, never hidden. */}
      {children}
      <span
        role="note"
        className="inline-flex items-start gap-1 text-xs text-[#5C5C5C]"
      >
        <span aria-hidden="true" className="shrink-0 mt-px">⊘</span>
        <span>
          {apCode && (
            <span className="font-mono font-semibold mr-1">{apCodeMessages[apCode]}</span>
          )}
          {reason}
        </span>
      </span>
    </div>
  )
}
