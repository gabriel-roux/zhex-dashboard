import { useCallback } from 'react'

export const formatCurrency = (value: number, currency: string = 'BRL') => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(value)
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

export const formatDateTime = (iso: string) => {
  const d = new Date(iso)
  const date = d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const time = d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${date} ${time}`
}

// Hook para usar formatters com memoização
export const useFormatters = () => {
  const formatCurrencyMemo = useCallback(formatCurrency, [])
  const formatDateMemo = useCallback(formatDate, [])
  const formatDateTimeMemo = useCallback(formatDateTime, [])

  return {
    formatCurrency: formatCurrencyMemo,
    formatDate: formatDateMemo,
    formatDateTime: formatDateTimeMemo,
  }
}
