'use client'

import {
  ArrowsOutSimpleIcon,
  HeartbeatIcon,
  ThumbsUpIcon,
} from '@phosphor-icons/react'

/**
 * Card: Controle de Chargeback
 *
 * Mostra o percentual já utilizado no mês em relação ao limite,
 * um aviso de status e uma descrição educativa.
 */
export function ChargebackControlWidget() {
  // Mock – valores estáticos; troque por dados vindos da API
  const usedPercent = 0.21 // 0,21 %
  const limitPercent = 2 // 2,00 %

  /* ---- Helpers gráfica (círculo de progresso) -------------------- */
  const radius = 28
  const stroke = 2
  const circumference = 2 * Math.PI * radius

  // dotted config ---------------------------------------------------
  const dotCount = 30 // quantidade de “pontinhos” ao redor
  const gap = circumference / dotCount // distância entre os centros
  const dotPattern = `0 ${gap}` // comprimento zero + gap (pontinho arredondado)

  const progress = (usedPercent / limitPercent) * 100 // 10,5 %
  const dashGapFix = 0.5
  const dashOffset =
    circumference - (progress / 100) * circumference + dashGapFix

  return (
    <div className="w-full h-[380px] bg-white border border-neutral-200 rounded-lg py-5 px-4 flex flex-col gap-6">
      {/* header ---------------------------------------------------- */}
      <header className="w-full flex items-center justify-between">
        <h3 className="text-neutral-1000 font-araboto text-lg flex items-center gap-2 font-medium">
          <HeartbeatIcon size={22} weight="bold" className="-mt-0.5" />
          Controle de Chargeback
        </h3>

        <button className="w-8 h-8 rounded-lg text-neutral-500 border border-neutral-200 hover:bg-neutral-100 transition-colors flex items-center justify-center">
          <ArrowsOutSimpleIcon size={18} weight="bold" />
        </button>
      </header>

      {/* métricas -------------------------------------------------- */}
      <section className="flex-1 flex items-start justify-between">
        {/* usado */}
        <div className="flex flex-col gap-3">
          <span className="text-neutral-500 text-sm">Utilizado este mês</span>

          <div className="flex items-center gap-3">
            {/* círculo de progresso */}
            <svg
              width={radius * 2 + stroke}
              height={radius * 2 + stroke}
              className="-rotate-90"
            >
              {/* trilha tracejada */}
              <circle
                cx={radius + stroke / 2}
                cy={radius + stroke / 2}
                r={radius}
                fill="none"
                stroke="#d9d9d9"
                strokeWidth={stroke}
                radius={radius}
                strokeDasharray={dotPattern}
                strokeLinecap="round"
              />
              {/* progresso */}
              <circle
                cx={radius + stroke / 2}
                cy={radius + stroke / 2}
                r={radius}
                fill="none"
                stroke="#2563eb"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinejoin="round"
              />
            </svg>

            <span className="text-neutral-1000 font-araboto text-[28px] font-semibold leading-none">
              {usedPercent.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              %
            </span>
          </div>
        </div>

        {/* limite */}
        <div className="flex flex-col items-end gap-6">
          <span className="text-neutral-500 text-sm">Limite mensal</span>
          <span className="text-neutral-400 font-araboto text-[28px] font-semibold leading-none">
            {limitPercent.toFixed(2).replace('.', ',')}%
          </span>
        </div>
      </section>

      {/* aviso/banner --------------------------------------------- */}
      <div className="w-full rounded-lg bg-zhex-base-500/10 py-2 px-4 flex items-center justify-center gap-2 text-zhex-base-500 font-semibold text-sm">
        <ThumbsUpIcon size={16} weight="bold" />
        Índice excelente, Operação segura!
      </div>

      {/* descrição ------------------------------------------------- */}
      <p className="text-neutral-600 text-sm leading-relaxed">
        A taxa padrão de chargeback da ZHEX é uma das mais competitivas do
        mercado, refletindo nosso compromisso com segurança e eficiência. À
        medida que você evolui dentro da plataforma, novos níveis liberam
        condições ainda melhores.
      </p>
    </div>
  )
}
