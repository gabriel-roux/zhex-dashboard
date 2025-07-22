'use client'

import { useState, useEffect } from 'react'
import * as Slider from '@radix-ui/react-slider'
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts'
import { motion } from 'framer-motion'

type RiskLevel = 1 | 2 | 3

const RISK_CONFIG: Record<
  RiskLevel,
  {
    title: string
    subtitle: string
    chargeback: string
    knobPosition: number // 0, 50, 100
    circlePosition: number // 0, 50, 100
    color: string
  }
> = {
  1: {
    title: 'Nível 1 <strong>( Conservador )</strong>',
    subtitle:
      'Começamos com limites conservadores e eles podem escalar conforme seu desempenho. Direcionamos suas vendas para as adquirentes mais eficientes.',
    chargeback: 'Até 1% Limite de chargeback',
    knobPosition: 0,
    circlePosition: 3,
    color: '#16A34A',
  },
  2: {
    title: 'Nível 2 <strong>( Moderado )</strong>',
    subtitle:
      'Limites flexíveis que evoluem de acordo com sua performance real. O direcionamento inteligente garante a melhor aprovação e custo.',
    chargeback: '1% a 3% Limite de chargeback',
    knobPosition: 50,
    circlePosition: 50,
    color: '#FACC15',
  },
  3: {
    title: 'Nível 3 <strong>( Alto Risco )</strong>',
    subtitle:
      'Aceitamos índices maiores, ajustando limites continuamente segundo seus resultados. Direcionamos automaticamente para as adquirentes mais adequadas.',
    chargeback: '3% a 5% Limite de chargeback',
    knobPosition: 100,
    circlePosition: 97,
    color: '#EF4444',
  },
}

export function OperationRisk() {
  const [level, setLevel] = useState<RiskLevel>(1)
  const [sliderValue, setSliderValue] = useState<number>(
    RISK_CONFIG[1].knobPosition,
  )

  const cfg = RISK_CONFIG[level]

  useEffect(() => {
    setSliderValue(cfg.knobPosition)
  }, [level])

  const handleDrag = (value: number[]) => setSliderValue(value[0])

  const handleCommit = (value: number[]) => {
    const v = value[0]
    if (v < 33) setLevel(1)
    else if (v < 66) setLevel(2)
    else setLevel(3)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <h2 className="text-lg font-araboto font-semibold text-neutral-950">
          Escolha um nível de risco
        </h2>
        <p className="text-neutral-500 font-araboto">
          Deslize para selecionar o perfil que melhor representa sua operação.
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-[460px] h-[320px] rounded-lg border border-neutral-200 overflow-hidden">
        <header className="w-full h-14 bg-neutral-100/60 flex items-center justify-center">
          <h3
            dangerouslySetInnerHTML={{ __html: cfg.title }}
            className="text-neutral-950 font-araboto text-base"
          />
        </header>

        {/* Chart area */}
        <ResponsiveContainer width="100%" height={90} className="mt-4">
          <AreaChart
            data={Array.from(
              { length: level === 1 ? 5 : level === 2 ? 10 : 15 },
              (_, i) => ({
                pv:
                  level === 1
                    ? 4 + Math.sin(i) * 2
                    : level === 2
                      ? 8 + Math.cos(i) * 4
                      : 14 + (Math.sin(i) + Math.cos(i)) * 4,
              }),
            )}
          >
            <defs>
              <linearGradient
                id={`riskFill-${level}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={cfg.color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={cfg.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="pv"
              stroke={cfg.color}
              fill={`url(#riskFill-${level})`}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Slider */}
        <div className="px-6 py-8 flex flex-col items-center gap-4">
          <Slider.Root
            className="relative flex w-full touch-none select-none items-center"
            value={[sliderValue]}
            max={100}
            step={50}
            onValueChange={handleDrag}
            onValueCommit={handleCommit}
          >
            <div
              className="absolute h-5 w-full rounded-full transition-colors duration-300"
              style={{
                background:
                  'linear-gradient(90deg, #16A34A 0%, #FACC15 50%, #EF4444 100%)',
              }}
            />
            {/* static markers */}
            {[1, 2, 3].map((lvl) => (
              <span
                key={lvl}
                className="absolute top-1/2 h-2 w-2 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white pointer-events-none"
                style={{
                  left: `${RISK_CONFIG[lvl as RiskLevel].circlePosition}%`,
                  backgroundColor: RISK_CONFIG[lvl as RiskLevel].color,
                }}
              />
            ))}
            <Slider.Thumb asChild>
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="block h-8 w-8 rounded-full border-4 border-white cursor-pointer"
                style={{ backgroundColor: cfg.color }}
              />
            </Slider.Thumb>
          </Slider.Root>

          <div className="flex flex-col items-center mt-3">
            <p className="text-base font-araboto font-semibold text-neutral-950">
              {cfg.chargeback}
            </p>
            <p className="text-neutral-500 font-araboto text-center text-sm">
              {cfg.subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
