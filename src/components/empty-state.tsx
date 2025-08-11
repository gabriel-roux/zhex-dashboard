import { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  size?: 'sm' | 'md' | 'lg'
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action, size = 'md' }: EmptyStateProps) {
  const sizeClasses = {
    sm: 'py-6',
    md: 'py-12',
    lg: 'py-16',
  }

  return (
    <div className={`flex flex-col items-center justify-center ${sizeClasses[size]}`}>
      <div className="text-neutral-1000 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-araboto font-medium text-neutral-1000 mb-1">
        {title}
      </h3>
      <p className="text-neutral-600 text-center max-w-xl mx-auto leading-relaxed mb-4">
        {description}
      </p>
      {action && action}
    </div>
  )
}
