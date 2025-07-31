'use client'

import React, { useState } from 'react'
import { Controller, Control } from 'react-hook-form'
import clsx from 'clsx'
import { CaretDownIcon } from '@phosphor-icons/react'
import { currencies } from '@/assets/lists/currencies'

interface PriceFieldProps {
  /** Nome do campo no formulário */
  name: string
  /** Control do react-hook-form */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  /** Exiba erro em vermelho igual ao TextField */
  error?: string
  /** Placeholder do campo */
  placeholder?: string
  /** Valor padrão em centavos */
  defaultValue?: number
  /** Moeda selecionada */
  selectedCurrency?: string
  /** Callback quando moeda muda */
  onCurrencyChange?: (currency: string) => void

  /** Não exibir seletor de moeda */
  withoutCurrencySelector?: boolean

  /** Desabilitado */
  disabled?: boolean
  /** Classe CSS adicional */
  className?: string
}

export function PriceField({
  name,
  control,
  error,
  placeholder = '0,00',
  defaultValue,
  selectedCurrency = 'BRL',
  onCurrencyChange,
  withoutCurrencySelector = false,
  disabled = false,
  className,
}: PriceFieldProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showCurrencySelect, setShowCurrencySelect] = useState(false)

  // Fechar dropdown quando clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.currency-selector')) {
        setShowCurrencySelect(false)
      }
    }

    if (showCurrencySelect) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCurrencySelect])

  // Obter dados da moeda selecionada
  const currentCurrency = currencies.find(c => c.code === selectedCurrency) || currencies[0]

  // Função para formatar valor em centavos para exibição
  const formatCentsToDisplay = (cents: number, isEditing: boolean = false): string => {
    if (!cents) return ''
    const value = cents / 100

    // Se está editando, não formata para permitir digitação contínua
    if (isEditing) {
      return value.toString()
    }

    // Formatação manual para evitar problemas de locale
    if (currentCurrency.decimalSeparator === ',') {
      // BRL, EUR: 1.234,56
      return value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    } else {
      // USD, GBP: 1,234.56
      return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }

  // Função para converter valor formatado para centavos
  const parseDisplayToCents = (displayValue: string): number => {
    if (!displayValue) return 0

    // Remove todos os caracteres não numéricos exceto vírgula e ponto
    let cleanValue = displayValue.replace(/[^\d,.-]/g, '')

    // Validação: não permite múltiplas vírgulas ou pontos
    const commaCount = (cleanValue.match(/,/g) || []).length
    const dotCount = (cleanValue.match(/\./g) || []).length

    if (commaCount > 1 || dotCount > 1) {
      return 0 // Retorna 0 se formato inválido
    }

    // Se está editando, permite digitação mais flexível
    if (isEditing) {
      // Remove separadores de milhares durante edição
      if (currentCurrency.decimalSeparator === ',') {
        cleanValue = cleanValue.replace(/\./g, '').replace(',', '.')
      } else {
        cleanValue = cleanValue.replace(/,/g, '')
      }
    } else {
      // Formatação baseada na moeda quando não está editando
      if (currentCurrency.decimalSeparator === ',') {
        // Moedas que usam vírgula como decimal (BRL, EUR)
        cleanValue = cleanValue.replace(/\./g, '').replace(',', '.')
      } else {
        // Moedas que usam ponto como decimal (USD, GBP, etc.)
        cleanValue = cleanValue.replace(/,/g, '')
      }
    }

    // Converte para número
    const value = parseFloat(cleanValue)

    if (isNaN(value) || value < 0) return 0

    // Converte para centavos
    return Math.round(value * 100)
  }

  // Remover função duplicada

  // Remover variável não utilizada

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue || 0}
      render={({ field: { onChange, value, ref } }) => (
        <div className="flex flex-col gap-2 w-full">
          <div className="relative w-full">
            <span
              className={clsx(
                'absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200',
                isFocused
                  ? 'text-zhex-base-600'
                  : error
                    ? 'text-red-secondary-500'
                    : 'text-zhex-base-500',
              )}
            >
              {currentCurrency.symbol}
            </span>

            <input
              type="text"
              value={isEditing
                ? (value || 0) / 100
                : formatCentsToDisplay(value || 0)}
              onChange={(e) => {
                const cents = parseDisplayToCents(e.target.value)
                onChange(cents)
              }}
              ref={ref}
              onFocus={(e) => {
                setIsFocused(true)
                setIsEditing(true)
                e.target.select()
              }}
              onBlur={(e) => {
                setIsFocused(false)
                setIsEditing(false)
                e.target.blur()
              }}
              disabled={disabled}
              placeholder={placeholder}
              className={clsx(
                'w-full py-3 pr-16 transition-all duration-200', // pr-16 para dar espaço ao seletor
                'pl-12', // Sempre tem ícone
                'rounded-xl border bg-transparent outline-none transition-colors',
                error
                  ? 'border-red-secondary-500'
                  : 'border-neutral-100',
                'text-neutral-1000 placeholder:text-neutral-400',
                'focus:ring-2 focus:ring-zhex-base-500',
                disabled && 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed',
                className,
              )}
            />

            {/* Seletor de moeda */}
            {!withoutCurrencySelector && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 currency-selector">
                <button
                  type="button"
                  onClick={() => setShowCurrencySelect(!showCurrencySelect)}
                  disabled={disabled}
                  className={clsx(
                    'flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium transition-colors',
                    'hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-zhex-base-500',
                    disabled && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  <span className="text-neutral-600">{currentCurrency.code}</span>
                  <CaretDownIcon size={18} className="text-zhex-base-500" />
                </button>

                {/* Dropdown de moedas */}
                {showCurrencySelect && (
                  <div
                    className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-neutral-200 overflow-hidden z-50"
                    style={{
                      width: '240px',
                      maxHeight: '240px',
                    }}
                  >
                    <div style={{ maxHeight: '140px' }} className="overflow-y-auto">
                      {currencies.map((currency) => (
                        <button
                          key={currency.code}
                          type="button"
                          onClick={() => {
                            onCurrencyChange?.(currency.code)
                            setShowCurrencySelect(false)
                          }}
                          className={clsx(
                            'w-full px-3 py-2 text-left text-sm hover:bg-neutral-100 transition-colors',
                            'flex items-center gap-2',
                            selectedCurrency === currency.code && 'bg-zhex-base-50 text-zhex-base-600',
                          )}
                        >
                          <span className="text-neutral-60 w-7">{currency.symbol}</span>
                          <span className="flex-1">{currency.name}</span>
                          <span className="text-xs text-neutral-400">{currency.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {error && <span className="text-red-secondary-500 text-sm">{error}</span>}

          {/* Indicador de valor em centavos para debug */}
          {process.env.NODE_ENV === 'development' && (
            <span className="text-xs text-neutral-400">
              Valor em centavos: {value || 0} | Moeda: {currentCurrency.code}
            </span>
          )}
        </div>
      )}
    />
  )
}
