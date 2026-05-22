import * as React from 'react'

export type SafetyBannerTone = 'preview' | 'blocked' | 'warning' | 'info'

export interface SafetyBannerProps {
  tone?: SafetyBannerTone
  title: string
  description?: string
  items?: string[]
  apCodes?: Array<'AP-10B' | 'AP-10C' | 'AP-11'>
  className?: string
}

const toneClasses: Record<SafetyBannerTone, { bg: string; border: string; text: string; title: string }> = {
  preview: {
    bg:     'bg-[#F3E9F8]',
    border: 'border-[#6B3B8C]',
    text:   'text-[#4A2A5C]',
    title:  'text-[#3B2E7E]',
  },
  blocked: {
    bg:     'bg-[#F0F0F0]',
    border: 'border-[#5C5C5C]',
    text:   'text-[#3A3A3A]',
    title:  'text-[#1B1D1F]',
  },
  warning: {
    bg:     'bg-[#F5EDE3]',
    border: 'border-[#8B5E2B]',
    text:   'text-[#5C3E1C]',
    title:  'text-[#5C3E1C]',
  },
  info: {
    bg:     'bg-[#E8EEF6]',
    border: 'border-[#2E5B8C]',
    text:   'text-[#1F3D5C]',
    title:  'text-[#1F3D5C]',
  },
}

const apCodeLabels: Record<'AP-10B' | 'AP-10C' | 'AP-11', string> = {
  'AP-10B': 'AP-10B',
  'AP-10C': 'AP-10C',
  'AP-11':  'AP-11',
}

export function SafetyBanner({
  tone = 'info',
  title,
  description,
  items,
  apCodes,
  className = '',
}: SafetyBannerProps) {
  const c = toneClasses[tone]

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        'w-full rounded-md border-l-4 px-4 py-3',
        c.bg,
        c.border,
        className,
      ].filter(Boolean).join(' ')}
    >
      <div className="flex flex-wrap items-start gap-2">
        <p className={['font-semibold text-sm', c.title].join(' ')}>
          {title}
        </p>
        {apCodes && apCodes.length > 0 && (
          <span className="flex gap-1">
            {apCodes.map((code) => (
              <span
                key={code}
                className={[
                  'inline-flex items-center rounded px-1.5 py-0.5 text-xs font-mono font-semibold border',
                  c.border,
                  c.text,
                ].join(' ')}
              >
                {apCodeLabels[code]}
              </span>
            ))}
          </span>
        )}
      </div>
      {description && (
        <p className={['mt-1 text-sm', c.text].join(' ')}>{description}</p>
      )}
      {items && items.length > 0 && (
        <ul className={['mt-1 list-disc list-inside text-sm space-y-0.5', c.text].join(' ')}>
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
