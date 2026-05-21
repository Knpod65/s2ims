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
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-500 text-white border-transparent hover:bg-blue-600 focus-visible:ring-blue-500',
  secondary:
    'bg-transparent text-gray-700 border-gray-300 hover:bg-gray-100 focus-visible:ring-blue-500',
  ghost:
    'bg-transparent text-gray-700 border-transparent hover:bg-gray-50 focus-visible:ring-blue-500',
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
