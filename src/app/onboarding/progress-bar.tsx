'use client'

import { CheckIcon } from '@phosphor-icons/react'
import clsx from 'clsx'

interface ProgressBarProps {
  steps: {
    label: string
    completed: boolean
  }[]
  /** Índice do passo atual (0-based) */
  currentStep: number
}

/** Diâmetro visual do círculo (h-7 / w-7 = 1.75 rem ≈ 28 px) */
const CIRCLE_DIAMETER = 32
const HALF_CIRCLE = CIRCLE_DIAMETER / 2

export function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  const total = steps.length
  const stepPercent = total > 1 ? 100 / (total - 1) : 0         // distância centro-a-centro em %
  // const filledWidth = currentStep * stepPercent                 // barra azul até o centro do passo atual
  const ratio = total > 1 ? currentStep / (total - 1) : 0

  return (
    <div className="relative w-full select-none mb-6">
      {/* Linha base (cinza) */}
      <div
        className="absolute h-0.5 bg-neutral-200"
        style={{ top: HALF_CIRCLE, left: HALF_CIRCLE, right: HALF_CIRCLE }}
      />

      {/* Linha preenchida (azul) */}
      <div
        className="absolute h-0.5 bg-zhex-base-500 transition-all"
        style={{
          top: HALF_CIRCLE,
          left: HALF_CIRCLE,
          width: `calc( (100% - ${CIRCLE_DIAMETER}px) * ${ratio} + 1px)`,
        }}
      />

      {/* Passos */}
      <div className="flex justify-between items-center w-full relative z-10">
        {steps.map((step, idx) => {
          const completed = idx < currentStep
          const active = idx === currentStep

          return (
            <div key={step.label} className="flex flex-col items-center gap-2">
              {/* Círculo */}
              <div
                className={clsx(
                  'flex items-center justify-center h-8 w-8 rounded-full border-2 text-xs font-medium transition-colors',
                  completed
                    ? 'bg-zhex-base-500 border-zhex-base-500 text-white'
                    : active
                    ? 'border-zhex-base-500 text-zhex-base-500 bg-white'
                    : 'border-neutral-200 text-neutral-1000 bg-white'
                )}
              >
                {completed ? <CheckIcon size={14} /> : idx + 1}
              </div>

              {/* Label */}
              <span
                className={clsx(
                  'text-sm font-araboto whitespace-nowrap',
                  completed
                    ? 'text-zhex-base-500 font-medium'
                    : active
                    ? 'text-neutral-1000 font-medium'
                    : 'text-neutral-300'
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}