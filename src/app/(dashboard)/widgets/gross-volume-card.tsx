'use client'

import { ArrowsOutSimpleIcon, ChartLineUpIcon } from '@phosphor-icons/react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

/* ------------------------------------------------------------------ */
/* MOCK DATA (substitua pelos dados da API)                            */
/* ------------------------------------------------------------------ */
const days = [1, 2, 3, 4, 8, 9, 10, 12, 13, 17, 18]
const currentMonth = [
  500, 750, 650, 900, 1_200, 830, 1_050, 1_260, 1_120, 980, 1_400,
]
const lastMonth = [
  420, 580, 700, 300, 1_450, 950, 760, 1_320, 1_000, 870, 1_100,
]

const chartData = days.map((d, i) => ({
  day: d,
  current: currentMonth[i],
  previous: lastMonth[i],
}))

/* ------------------------------------------------------------------ */
/* Tooltip custom                                                    */
/* ------------------------------------------------------------------ */
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number; dataKey: string }[]
  label?: number
}) => {
  if (!active || !payload?.length) return null

  const fmt = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="rounded-lg border border-neutral-200 bg-white/90 backdrop-blur-md px-3 py-2 shadow-lg text-xs space-y-1">
      <p className="font-semibold text-neutral-950">Dia {label}</p>
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#2563eb]" />
        <span className="text-neutral-700">Este mês:</span>
        <span className="font-medium text-neutral-950">
          {fmt(payload.find((p) => p.dataKey === 'current')?.value ?? 0)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#9db5ff]" />
        <span className="text-neutral-700">Mês passado:</span>
        <span className="font-medium text-neutral-950">
          {fmt(payload.find((p) => p.dataKey === 'previous')?.value ?? 0)}
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* COMPONENT                                                           */
/* ------------------------------------------------------------------ */
export function GrossVolumeWidget() {
  const isPositive = true // Mock data - replace with actual logic
  return (
    <div className="w-full h-[380px] bg-white border border-neutral-200 rounded-lg py-5 px-4 flex flex-col gap-4">
      {/* Header ---------------------------------------------------- */}
      <header className="flex items-start justify-between">
        <h3 className="text-neutral-1000 font-araboto text-lg flex items-center gap-2 font-medium">
          <ChartLineUpIcon size={22} weight="bold" className="-mt-0.5" />
          Volume Bruto
        </h3>

        <button className="w-8 h-8 rounded-lg border text-neutral-500 border-neutral-200 hover:bg-neutral-100 transition-colors flex items-center justify-center">
          <ArrowsOutSimpleIcon size={18} weight="bold" />
        </button>
      </header>

      {/* Valor total + variação ----------------------------------- */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-semibold">R$9.400,50</span>
        <span
          className={`text-sm font-medium ${
            isPositive
? 'text-green-secondary-600'
: 'text-red-secondary-600'
          } flex items-center gap-1`}
        >
          {isPositive
            ? '↑'
            : '↓'}
          6% <span className="text-neutral-400">vs mês passado</span>
        </span>
      </div>
      {/* Legenda custom ------------------------------------------- */}
      <div className="flex items-center gap-6 text-sm text-neutral-500">
        <p className="text-sm font-araboto flex-shrink-0">
          Performance em vendas
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-3 h-3 rounded-full bg-white border-[3.5px] border-[#2563eb]" />{' '}
          <span className="text-neutral-1000">Este mês</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-3 h-3 rounded-full bg-white border-[3.5px] border-[#9db5ff]" />{' '}
          <span>Mês passado</span>
        </div>
      </div>

      {/* Gráfico --------------------------------------------------- */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height={210}>
          <LineChart
            data={chartData}
            margin={{ top: 32, right: 0, left: -36, bottom: -10 }}
          >
            {/* Grade tracejada horizontal ------------------------- */}
            <CartesianGrid
              strokeDasharray="6 6"
              strokeOpacity={0.3}
              vertical={false}
            />

            {/* Eixo X -------------------------------------------- */}
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />

            {/* Eixo Y -------------------------------------------- */}
            <YAxis
              domain={[0, 1800]}
              ticks={[1000]}
              tickFormatter={(v) => `${v / 1000}K`}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />

            {/* Gradientes ---------------------------------------- */}
            <defs>
              <linearGradient id="lineCurrentGross" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient
                id="linePreviousGross"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#9db5ff" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#9db5ff" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            {/* Linha Mês Passado (mais clara) -------------------- */}
            <Line
              type="monotone"
              dataKey="previous"
              stroke="url(#linePreviousGross)"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 0, fill: '#9db5ff' }}
              activeDot={{ r: 6 }}
            />

            {/* Linha Este Mês (cor forte) ------------------------ */}
            <Line
              type="monotone"
              dataKey="current"
              stroke="url(#lineCurrentGross)"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 0, fill: '#2563eb' }}
              activeDot={{ r: 6 }}
            />

            {/* Tooltip ------------------------------------------ */}
            <Tooltip
              cursor={{ stroke: 'transparent' }}
              content={<CustomTooltip />}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
