import clsx from 'clsx'
import { CheckCircleIcon, InfoIcon, ProhibitIcon, WarningIcon } from '@phosphor-icons/react'
import WarningBackground from '@/assets/images/warning-background'

interface WarningProps {
  variant: 'info' | 'warning' | 'error' | 'success'
  size?: 'sm' | 'md'
  title: string
  description: string
  onButtonClick?: () => void
  buttonText?: string
}

export function Warning({ variant, size = 'md', title, description, onButtonClick, buttonText }: WarningProps) {
  let className = ''
  let icon = null
  let iconSize = 20
  let iconClassName = ''
  let sizeClassName = ''
  let titleClassName = ''
  let descriptionClassName = ''
  let svgColor = ''

  switch (size) {
    case 'sm':
      iconSize = 20
      sizeClassName = 'w-10 h-10'
      titleClassName = 'text-sm'
      descriptionClassName = 'text-xs'
      break
    case 'md':
      iconSize = 26
      sizeClassName = 'w-14 h-14'
      titleClassName = 'text-base'
      descriptionClassName = 'text-sm'
      break
  }

  switch (variant) {
    case 'info':
      className = 'bg-[#F1F4FF] border border-zhex-base-500/10'
      icon = <InfoIcon size={iconSize} weight="duotone" className="text-zhex-base-500" />
      iconClassName = 'bg-zhex-base-500/30'
      svgColor = '#0c41ff'
      break
    case 'warning':
      className = 'bg-[#FFF3E0] border border-yellow-secondary-600/10'
      icon = <WarningIcon size={iconSize} weight="bold" className="text-yellow-secondary-500" />
      iconClassName = 'bg-[#FFE8B8]'
      svgColor = '#ff9900'
      break
    case 'error':
      className = 'bg-[#FFE8E8] border border-red-secondary-500/10'
      icon = <ProhibitIcon size={iconSize} weight="duotone" className="text-red-secondary-500" />
      iconClassName = 'bg-[#f386863c]'
      svgColor = '#ff0000'
      break
    case 'success':
      className = 'bg-[#E8FFF3] border border-green-500/10'
      icon = <CheckCircleIcon size={iconSize} weight="duotone" className="text-green-500" />
      iconClassName = 'bg-[#8fe2b75b]'
      svgColor = '#00ff00'
      break
  }

  return (
    <div className={clsx('w-full rounded-xl py-2 px-5 gap-5 flex items-center relative transition-all duration-300', className)}>
      <div className={clsx('rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300', iconClassName, sizeClassName)}>
        {icon}
      </div>

      <div className="flex flex-col">
        <h2 className={clsx('text-neutral-1000 font-araboto font-medium', titleClassName)}>{title}</h2>
        <p className={clsx('text-neutral-600', descriptionClassName)}>
          {description} {' '}
          {onButtonClick && buttonText && (
            <span
              onClick={onButtonClick}
              style={{ color: svgColor }}
              className="cursor-pointer underline opacity-75 hover:opacity-100 transition-all duration-300"
            >
              {buttonText}
            </span>
          )}
        </p>
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <WarningBackground color={svgColor} />
      </div>
    </div>
  )
}
