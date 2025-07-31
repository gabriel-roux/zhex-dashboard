import clsx from 'clsx'
import React from 'react'

interface SkeletonProps {
  className?: string
  children?: React.ReactNode
}

export function Skeleton({ className, children }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'bg-neutral-200 animate-pulse skeleton-shimmer',
        className,
      )}
    >
      {children}
    </div>
  )
}
