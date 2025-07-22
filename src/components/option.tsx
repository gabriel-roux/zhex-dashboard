'use client'

import clsx from 'clsx'
import { ElementType } from 'react'

interface OptionProps {
  /** Texto exibido dentro do botão */
  label: string
  /** Ícone ao lado esquerdo (Phosphor ou similar) */
  icon: ElementType
  /** Estado selecionado */
  selected?: boolean
  /** Função ao clicar */
  onSelect?: () => void
  /** Classe do botão */
  className?: string
}

export function Option({
  label,
  icon: Icon,
  selected = false,
  onSelect,
  className,
}: OptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={clsx(
        'flex items-center gap-2 px-6 h-12 rounded-xl border transition-colors',
        selected
          ? 'bg-zhex-base-500/20 text-zhex-base-500 border-zhex-base-500'
          : 'bg-neutral-0 text-neutral-1000 border-neutral-200 hover:bg-neutral-100',
        className,
      )}
    >
      <Icon
        size={20}
        weight="regular"
        className={
          selected
            ? 'text-zhex-base-500 flex-shrink-0'
            : 'text-neutral-1000 flex-shrink-0'
        }
      />
      <span className="whitespace-nowrap font-araboto text-base">{label}</span>
    </button>
  )
}
