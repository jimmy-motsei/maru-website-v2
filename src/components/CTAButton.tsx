import clsx from 'clsx'
import * as React from 'react'

type CTAButtonProps = {
  /** visual style */
  variant?: 'black' | 'gray' | 'outline' | 'link'
  /** size scale */
  size?: 'sm' | 'md' | 'lg'
  /** make the button full width */
  full?: boolean
  /** optional loading state */
  loading?: boolean
  /** optional icons */
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

/**
 * Clean, solid CTA button for dark UIs.
 * - No gradients, no shadows
 * - Accessible focus ring
 * - Uses Mulish via `font-display`
 */
export default function CTAButton({
  children,
  variant = 'black',
  size = 'md',
  full = false,
  loading = false,
  iconLeft,
  iconRight,
  className,
  disabled,
  ...props
}: CTAButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 select-none rounded-xl font-display font-medium tracking-[0.02em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-50 disabled:pointer-events-none';

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-5 text-base',
    lg: 'h-12 px-6 text-lg',
  } as const

  const variants = {
    black: 'bg-black text-white hover:bg-neutral-900 active:bg-neutral-800',
    gray: 'bg-neutral-800 text-white hover:bg-neutral-700 active:bg-neutral-600',
    outline: 'bg-transparent text-white ring-1 ring-white/20 hover:bg-white/5',
    link: 'bg-transparent text-white/90 hover:text-white underline underline-offset-4 decoration-white/30 hover:decoration-white/70 px-0',
  } as const

  return (
    <button
      className={clsx(base, sizes[size], variants[variant], full && 'w-full', className)}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      {...props}
    >
      {iconLeft && <span aria-hidden>{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && <span aria-hidden>{iconRight}</span>}
    </button>
  )
}
