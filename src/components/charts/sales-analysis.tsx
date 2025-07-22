'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

const baseAnterior = 450
const data = [
  { dia: '01', atual: 300, anterior: baseAnterior + 5 },
  { dia: '02', atual: 480, anterior: baseAnterior + 10 },
  { dia: '03', atual: 620, anterior: baseAnterior + 15 },
  { dia: '04', atual: 500, anterior: baseAnterior + 20 },
  { dia: '05', atual: 900, anterior: baseAnterior + 25 }, // pico campanha
  { dia: '06', atual: 740, anterior: baseAnterior + 30 },
  { dia: '07', atual: 680, anterior: baseAnterior + 35 },
  { dia: '08', atual: 950, anterior: baseAnterior + 40 }, // novo pico
  { dia: '09', atual: 790, anterior: baseAnterior + 45 },
  { dia: '10', atual: 720, anterior: baseAnterior + 50 },
  { dia: '11', atual: 860, anterior: baseAnterior + 55 },
  { dia: '12', atual: 640, anterior: baseAnterior + 60 },
  { dia: '13', atual: 910, anterior: baseAnterior + 65 },
  { dia: '14', atual: 980, anterior: baseAnterior + 70 },
  { dia: '15', atual: 750, anterior: baseAnterior + 75 },
]

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

export function SalesAnalysisChart() {
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: any[]
    label?: string
  }) => {
    if (active && payload && payload.length) {
      const atual = payload.find((p) => p.dataKey === 'atual')?.value
      const anterior = payload.find((p) => p.dataKey === 'anterior')?.value
      return (
        <div className="rounded-md border border-neutral-200 bg-white px-3 py-2 shadow-sm">
          <p className="text-xs text-neutral-500 mb-1">Dia {label}</p>
          <p className="text-sm font-medium text-neutral-900">
            Vendas: {currency.format(atual ?? 0)}
          </p>
          <p className="text-xs text-neutral-400">
            Mês passado: {currency.format(anterior ?? 0)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ left: -10, right: 0, top: 10, bottom: 0 }}
      >
        {/* grades horizontais tracejadas */}
        <CartesianGrid
          stroke="#D9D9DE"
          strokeDasharray="3 6"
          vertical={false}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: '#CBD5E1', strokeDasharray: '3 6' }}
        />

        {/* eixo-Y customizado */}
        <YAxis
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `R$ ${(v / 1000).toFixed(1)}K`}
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
          domain={[0, 1200]}
        />

        {/* eixo-X com dias */}
        <XAxis
          dataKey="dia"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
          padding={{ left: 10, right: 10 }}
        />

        {/* mês passado (linha cinza-claro) */}
        <Line
          type="linear"
          dataKey="anterior"
          stroke="#A3A3C2"
          strokeWidth={2}
          dot={false}
          opacity={0.4}
          strokeLinecap="round"
        />

        {/* mês atual (linha preta) */}
        <Line
          type="linear"
          dataKey="atual"
          stroke="#0F172A"
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 4 }}
          strokeLinecap="round"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
