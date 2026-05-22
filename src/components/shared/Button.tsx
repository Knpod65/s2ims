'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps {
  children?: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  iconStart?: React.ReactNode
  iconEnd?: React.ReactNode
  'aria-label'?: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  className?: string
  /** Optional governance context — forwarded as data-ap-code attribute. No behavior change in MC87. */
  apCode?: 'AP-10B' | 'AP-10C' | 'AP-11'
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#2E5B4A] text-white border-transparent hover:bg-[#1F3D32] focus-visible:ring-[#2E5B4A]',
  secondary:
    'bg-[#FBFAF6] text-[#1B1D1F] border-[#4A4E52] hover:bg-[#F4F0E6] focus-visible:ring-[#2E5B4A]',
  ghost:
    'bg-transparent text-[#1B1D1F] border-transparent hover:bg-[#F4F0E6] focus-visible:ring-[#2E5B4A]',
  danger:
    'bg-red-500 text-white border-transparent hover:bg-red-600 focus-visible:ring-red-500',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-4 py-1 text-xs gap-1.5',
  md: 'h-10 px-5 py-2 text-sm gap-2',
  lg: 'h-11 px-6 py-2.5 text-sm gap-2',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  iconStart,
  iconEnd,
  'aria-label': ariaLabel,
  type = 'button',
  onClick,
  className = '',
  apCode,
}: ButtonProps) {
  const isDisabled = disabled || loading

  const classes = [
    'inline-flex items-center justify-center rounded-md border font-medium',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    variantClasses[variant],
    sizeClasses[size],
    isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      aria-disabled={isDisabled || undefined}
      disabled={isDisabled}
      onClick={onClick}
      className={classes}
      data-ap-code={apCode}
    >
      {loading && (
        <Loader2
          className="animate-spin shrink-0"
          aria-hidden="true"
          size={size === 'sm' ? 12 : 14}
        />
      )}
      {!loading && iconStart && (
        <span className="shrink-0" aria-hidden="true">{iconStart}</span>
      )}
      {children}
      {!loading && iconEnd && (
        <span className="shrink-0" aria-hidden="true">{iconEnd}</span>
      )}
    </button>
  )
}
