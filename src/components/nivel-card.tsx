'use client'

import { DiamondIcon } from '@phosphor-icons/react'
import { NivelBadge } from '@/assets/images/nivel-badge-bg'
import NivelGrid from '@/assets/images/nivel-grid.png'
import NivelRadial from '@/assets/images/nivel-radial-header.png'
import Image from 'next/image'
import { NivelDiamond } from '@/assets/images/nivel-diamond'

/**
 * Informações de cada nível que serão renderizadas pelo componente.
 */
export type NivelInfo = {
  label: string // ex: “Silver”
  maxLabel: string // ex: “R$ 50 k”
  /**
   * Classes tailwind para o background principal.
   * Use “bg-gradient-to-br …” para gradientes ou bg-zinc-900 etc.
   */
  bgClass: string
  /**
   * Classe tailwind para o background do diamante / marcadores.
   * Use “bg-[#3B7BFF]/20” ou similar.
   */
  accentBgClass?: string // opcional, usado para Silver
  /**
   * Cor de textos principais (normalmente branco ou zinc‑1000)
   */
  textColor?: string
}

/**
 * Variantes possíveis do card de nível.
 */
export type NivelVariant = 'silver' | 'gold' | 'zhelix' | 'lymnia' | 'valeon'

/**
 * Mapeamento das variantes para as configurações visuais.
 */
const NIVEL_VARIANTS: Record<NivelVariant, NivelInfo> = {
  silver: {
    label: 'Silver',
    maxLabel: 'R$ 50 k',
    bgClass: 'bg-gradient-to-br from-[#012C72] to-[#0055E1] text-white',
    accentBgClass: 'bg-[#3B7BFF]',
  },
  gold: {
    label: 'Gold',
    maxLabel: 'R$ 100 k',
    bgClass: 'bg-gradient-to-br from-[#8e6b13] to-[#d49702] text-white',
    accentBgClass: 'bg-yellow-secondary-500',
    textColor: 'text-white',
  },
  zhelix: {
    label: 'ZHELIX',
    maxLabel: 'R$ 1 M',
    bgClass: 'bg-gradient-to-br from-[#2A2A2A] to-[#131416]',
    accentBgClass: 'bg-zinc-400',
    textColor: 'text-white',
  },
  lymnia: {
    label: 'LYMNIA',
    maxLabel: 'R$ 10 M',
    bgClass: 'bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]',
    accentBgClass: 'bg-zinc-400',
    textColor: 'text-white',
  },
  valeon: {
    label: 'VALEON',
    maxLabel: 'R$ 30 M',
    bgClass: 'bg-gradient-to-br from-[#000] to-[#050505]',
    accentBgClass: 'bg-zinc-400',
    textColor: 'text-white',
  },
}

interface NivelCardProps {
  variant: NivelVariant
}

export function NivelCard({ variant }: NivelCardProps) {
  const {
    maxLabel,
    bgClass,
    accentBgClass,
    textColor = 'text-white',
  } = NIVEL_VARIANTS[variant]

  return (
    <article
      className={`relative w-[184px] h-[180px] rounded-2xl overflow-hidden flex flex-col gap-4 p-4 ${bgClass}`}
    >
      {/* radial de fundo */}
      <Image
        src={NivelRadial}
        alt="Radial de fundo do card de nível"
        className="absolute top-[0.5px] left-0 w-full"
      />
      {/* pontilhado de fundo  */}
      <Image
        src={NivelGrid}
        alt="Padrão de fundo do card de nível"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-60"
      />

      {/* título */}
      <header className={`w-full flex items-center justify-between`}>
        <h3 className={`relative text-base text-white font-araboto`}>
          Seu nível
        </h3>

        {variant === 'valeon' && (
          <div className="flex items-center justify-center w-7 h-7 rounded-full border-[3px] border-[#242424]">
            <NivelDiamond nivel="valeon" />
          </div>
        )}
      </header>

      {/* barra de progresso simplificada */}
      {variant !== 'valeon' && (
        <div className="relative flex items-center">
          <div className="h-2 flex-1 rounded-full bg-neutral-100/10" />
          <div
            className={`${accentBgClass} absolute h-2 w-[20%] rounded-full`}
          />
          <div
            className="absolute -translate-x-1/2 w-5 h-5 rounded-full bg-white flex items-center justify-center border-2 border-white/10 shadow-md"
            style={{ left: '20%' /* posição ilustrativa */ }}
          >
            <NivelDiamond nivel={variant} />
          </div>
        </div>
      )}

      {/* badge do nível */}
      <NivelBadge nivel={variant} />

      {/* texto inferior */}
      <div
        className={`w-full flex items-center justify-between gap-1 text-sm leading-snug ${textColor}`}
      >
        <div className="flex w-[120px] flex-col gap-1">
          <span className="text-xs font-araboto">Fatura até:</span>
          <span className="font-bold text-xs font-araboto">{maxLabel}</span>
        </div>

        <div className="w-[2px] h-8 bg-white/10" />

        <p className="mt-2 text-[9px] font-medium text-right w-fit">
          <span className="text-white font-bold">Suba de nível</span>
          <br /> e garanta suas recompensas.
        </p>
      </div>
    </article>
  )
}
