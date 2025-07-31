import { ArrowsOutSimpleIcon, ClockClockwiseIcon } from '@phosphor-icons/react'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

const subscriptionData = [
  { day: 1, value: 1950 },
  { day: 2, value: 2350 },
  { day: 3, value: 1900 },
  { day: 4, value: 2200 },
  { day: 8, value: 2850 },
  { day: 9, value: 3700 },
  { day: 10, value: 2300 },
  { day: 11, value: 2900 },
  { day: 12, value: 1800 },
  { day: 13, value: 2400 },
  { day: 17, value: 1950 },
  { day: 18, value: 3250 },
]

// Tooltip personalizado
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: number
}) => {
  if (!active || !payload?.length) return null

  const value = payload[0].value ?? 0

  return (
    <div className="rounded-lg border border-neutral-200 bg-white backdrop-blur-md px-3 py-2 shadow-lg text-xs">
      <span className="text-neutral-500">Dia {label}</span>
      <p className="font-semibold text-neutral-950">
        {value.toLocaleString('pt-BR')} novas
      </p>
    </div>
  )
}

export function SubscriptionWidget() {
  const isPositive = true // Mock data - replace with actual logic
  return (
    <div className="w-full h-[380px] bg-white border border-neutral-200 rounded-lg py-5 px-4 flex flex-col gap-4">
      <header className="w-full flex items-center justify-between">
        <h3 className="text-neutral-1000 font-araboto text-lg flex items-center gap-2 font-medium">
          <ClockClockwiseIcon size={22} weight="bold" className="-mt-0.5" />
          Assinaturas
        </h3>

        <button className="w-8 h-8 rounded-lg border text-neutral-500 border-neutral-200 hover:bg-neutral-100 transition-colors flex items-center justify-center">
          <ArrowsOutSimpleIcon size={18} weight="bold" />
        </button>
      </header>

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

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={subscriptionData}
            margin={{ top: 32, right: 0, left: -36, bottom: -10 }}
          >
            {/* dashed grid */}
            <CartesianGrid
              strokeDasharray="6 6"
              strokeOpacity={0.3}
              vertical={false}
            />
            {/* axes */}
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v / 1000}K`}
              ticks={[1000]}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
            />
            {/* bars with gradient */}
            <defs>
              <linearGradient
                id="subscriptionGradient"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#206FEF" />
                <stop offset="100%" stopColor="#9DB3FF" />
              </linearGradient>
            </defs>
            <Bar
              dataKey="value"
              fill="url(#subscriptionGradient)"
              barSize={12}
              radius={[8, 8, 8, 8]}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={<CustomTooltip />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
