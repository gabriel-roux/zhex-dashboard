import { ReactNode } from 'react'
import { CheckCircleIcon, XCircleIcon, ClockIcon, CalendarCheckIcon, ArrowUpIcon, ArrowsCounterClockwiseIcon, ShieldWarningIcon, ProhibitIcon } from '@phosphor-icons/react'

export type StatusDomain = 'transaction' | 'withdrawal' | 'generic' | 'subscription'

export type StatusValue =
  | 'INITIALIZED'
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED'
  | 'CHARGEBACK'
  | 'CHARGEBACK_ALERT'
  | 'REQUESTED'
  | 'SCHEDULED'
  | 'CANCELED'
  | string

interface StatusMeta {
  label: string
  colorClass: string
  icon: ReactNode
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconBySize = (Icon: any, size: 'sm' | 'md') => (
  <Icon
    className="flex-shrink-0"
    size={size === 'sm'
      ? 14
      : 16} weight={Icon === ArrowUpIcon
        ? 'bold'
        : 'fill'}
  />
)

function mapStatus(status: string, domain: StatusDomain, size: 'sm' | 'md'): StatusMeta {
  const s = (status || '').toUpperCase()

  // Base mappings (generic)
  const generic: Record<string, StatusMeta> = {
    COMPLETED: { label: 'Concluído', colorClass: 'bg-green-100 text-green-600', icon: iconBySize(CheckCircleIcon, size) },
    FAILED: { label: 'Falhou', colorClass: 'bg-red-100 text-red-600', icon: iconBySize(XCircleIcon, size) },
    PENDING: { label: 'Pendente', colorClass: 'bg-yellow-100 text-yellow-700', icon: iconBySize(ClockIcon, size) },
    PROCESSING: { label: 'Processando', colorClass: 'bg-blue-100 text-blue-600', icon: iconBySize(ClockIcon, size) },
    INITIALIZED: { label: 'Inicializado', colorClass: 'bg-neutral-100 text-neutral-700', icon: iconBySize(CalendarCheckIcon, size) },
    REFUNDED: { label: 'Reembolsada', colorClass: 'bg-purple-100 text-purple-600', icon: iconBySize(ArrowsCounterClockwiseIcon, size) },
    CHARGEBACK: { label: 'Chargeback', colorClass: 'bg-orange-100 text-orange-700', icon: iconBySize(ShieldWarningIcon, size) },
    CHARGEBACK_ALERT: { label: 'Alerta de chargeback', colorClass: 'bg-orange-100 text-orange-700', icon: iconBySize(ShieldWarningIcon, size) },
    CANCELED: { label: 'Cancelado', colorClass: 'bg-neutral-100 text-neutral-600', icon: iconBySize(ProhibitIcon, size) },
    REQUESTED: { label: 'Solicitado', colorClass: 'bg-blue-100 text-blue-700', icon: iconBySize(CalendarCheckIcon, size) },
    SCHEDULED: { label: 'Agendado', colorClass: 'bg-indigo-100 text-indigo-600', icon: iconBySize(CalendarCheckIcon, size) },
  }

  // Domain-specific overrides (if needed)
  if (domain === 'withdrawal') {
    const map = {
      REQUESTED: { label: 'Solicitado', colorClass: 'bg-blue-100 text-blue-700', icon: iconBySize(CalendarCheckIcon, size) },
      PROCESSING: { label: 'Processando', colorClass: 'bg-blue-100 text-blue-600', icon: iconBySize(ClockIcon, size) },
      COMPLETED: { label: 'Concluído', colorClass: 'bg-green-100 text-green-600', icon: iconBySize(CheckCircleIcon, size) },
      FAILED: { label: 'Falhou', colorClass: 'bg-red-100 text-red-600', icon: iconBySize(XCircleIcon, size) },
      CANCELED: { label: 'Cancelado', colorClass: 'bg-neutral-100 text-neutral-600', icon: iconBySize(ProhibitIcon, size) },
      SCHEDULED: { label: 'Agendado', colorClass: 'bg-indigo-100 text-indigo-600', icon: iconBySize(CalendarCheckIcon, size) },
    } as Record<string, StatusMeta>
    return map[s] || generic[s] || { label: s || '—', colorClass: 'bg-gray-100 text-gray-600', icon: iconBySize(ArrowUpIcon, size) }
  }

  if (domain === 'transaction') {
    const map = {
      INITIALIZED: { label: 'Inicializado', colorClass: 'bg-neutral-100 text-neutral-700', icon: iconBySize(CalendarCheckIcon, size) },
      PENDING: { label: 'Pendente', colorClass: 'bg-yellow-100 text-yellow-700', icon: iconBySize(ClockIcon, size) },
      PROCESSING: { label: 'Processando', colorClass: 'bg-blue-100 text-blue-600', icon: iconBySize(ClockIcon, size) },
      COMPLETED: { label: 'Sucesso', colorClass: 'bg-green-100 text-green-600', icon: iconBySize(CheckCircleIcon, size) },
      FAILED: { label: 'Rejeitada', colorClass: 'bg-red-100 text-red-600', icon: iconBySize(XCircleIcon, size) },
      REFUNDED: { label: 'Reembolsada', colorClass: 'bg-purple-100 text-purple-600', icon: iconBySize(ArrowsCounterClockwiseIcon, size) },
      CHARGEBACK: { label: 'Chargeback', colorClass: 'bg-orange-100 text-orange-700', icon: iconBySize(ShieldWarningIcon, size) },
      CHARGEBACK_ALERT: { label: 'Alerta', colorClass: 'bg-orange-100 text-orange-700', icon: iconBySize(ShieldWarningIcon, size) },
    } as Record<string, StatusMeta>
    return map[s] || generic[s] || { label: s || '—', colorClass: 'bg-gray-100 text-gray-600', icon: iconBySize(ArrowUpIcon, size) }
  }

  if (domain === 'subscription') {
    const map = {
      TRIALING: { label: 'Trial', colorClass: 'bg-yellow-100 text-yellow-700', icon: iconBySize(ClockIcon, size) },
      PAST_DUE: { label: 'Vencido', colorClass: 'bg-red-100 text-red-600', icon: iconBySize(XCircleIcon, size) },
      CANCELED: { label: 'Cancelado', colorClass: 'bg-neutral-100 text-neutral-600', icon: iconBySize(ProhibitIcon, size) },
      UNPAID: { label: 'Não pago', colorClass: 'bg-red-100 text-red-600', icon: iconBySize(XCircleIcon, size) },
      INCOMPLETE: { label: 'Incompleto', colorClass: 'bg-neutral-100 text-neutral-600', icon: iconBySize(ProhibitIcon, size) },
      ACTIVE: { label: 'Ativo', colorClass: 'bg-green-100 text-green-600', icon: iconBySize(CheckCircleIcon, size) },
    } as Record<string, StatusMeta>
    return map[s] || generic[s] || { label: s || '—', colorClass: 'bg-gray-100 text-gray-600', icon: iconBySize(ArrowUpIcon, size) }
  }

  return generic[s] || { label: s || '—', colorClass: 'bg-gray-100 text-gray-600', icon: iconBySize(ArrowUpIcon, size) }
}

export function getStatusMeta(status: StatusValue, domain: StatusDomain = 'generic') {
  return mapStatus(status, domain, 'md')
}

interface StatusBadgeProps {
  status: StatusValue
  domain?: StatusDomain
  showIcon?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export function StatusBadge({ status, domain = 'generic', showIcon = true, size = 'md', className = '' }: StatusBadgeProps) {
  const { colorClass, icon, label } = mapStatus(status, domain, size)
  const paddings = size === 'sm'
    ? 'px-2 py-0.5'
    : 'px-3 py-1'
  const textSize = 'text-sm'

  return (
    <div className={`${paddings} rounded-full w-fit ${colorClass} ${className}`}>
      <div className="flex items-center gap-1">
        {showIcon && icon}
        <span className={`${textSize} font-medium flex-shrink-0`}>{label}</span>
      </div>
    </div>
  )
}
