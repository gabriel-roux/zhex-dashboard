import Image from 'next/image'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ProductCover from '@/assets/images/product-cover.png'
import { ArrowsOutIcon, ArrowUpIcon } from '@phosphor-icons/react'

// Dados do gráfico
const chartData = [
  { date: 'Mar 1', sales: 1200 },
  { date: 'Mar 5', sales: 1800 },
  { date: 'Mar 10', sales: 1400 },
  { date: 'Mar 15', sales: 2200 },
  { date: 'Mar 20', sales: 1900 },
  { date: 'Mar 25', sales: 2800 },
  { date: 'Mar 30', sales: 3200 },
]
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number; dataKey: string }[]
  label?: string
}) => {
  if (!active || !payload?.length) return null

  const fmt = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="rounded-lg border border-neutral-200 bg-white/90 backdrop-blur-md px-3 py-2 shadow-lg text-xs space-y-1">
      <p className="font-semibold text-neutral-950">{label}</p>
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#3B82F6]" />
        <span className="text-neutral-700">Vendas:</span>
        <span className="font-medium text-neutral-950">
          {fmt(payload[0]?.value ?? 0)}
        </span>
      </div>
    </div>
  )
}

export function ProductSalesInformations() {
  return (
    <div className="flex items-center gap-6 w-full mt-4">
      {/* Left Section - Product Card */}
      <div className="flex items-start gap-6">
        <div className="w-[180px] min-h-[180px] flex-shrink-0">
          <div className="bg-neutral-50 rounded-2xl p-4 h-[180px] w-full shadow-sm border-2 border-dashed justify-center items-center flex border-neutral-200">
            <Image src={ProductCover} alt="Product Cover" width={86} height={130} className="object-contain" />
          </div>
        </div>

        {/* Middle Section - Product Details */}
        <div className="">
          {/* Status */}
          <div className="flex items-center gap-2 mb-2 bg-green-secondary-500/20 rounded-md px-2 py-1 w-fit">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-green-600">Ativo</span>
          </div>

          {/* Product Title */}
          <h2 className="text-xl font-araboto font-bold text-neutral-1000 mb-2">
            Livro de Donald A. Norman, Publicado em 2016: O Design do Dia a Dia
          </h2>

          {/* Product Description */}
          <p className="text-neutral-600 text-base leading-relaxed">
            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words.
          </p>
        </div>
      </div>

      {/* Right Section - Sales Analytics */}
      <div className="w-[380px] max-h-[245px] flex-shrink-0">
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-neutral-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-araboto font-medium text-neutral-1000">
              Total de vendas
            </h3>
            <button className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-200 transition-colors">
              <ArrowsOutIcon size={16} className="text-neutral-600" />
            </button>
          </div>

          {/* Sales Amount and Growth */}
          <div className="flex items-center gap-2 mb-6">
            <div className="text-base font-araboto font-bold text-neutral-1000">
              R$ 13.456,65
            </div>
            <div className="flex items-center gap-1 text-green-secondary-500 text-sm font-medium">
              <ArrowUpIcon size={16} />
              19.25%
              <span className="text-neutral-400">
                vs mês passado
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-[140px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  tickMargin={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  tickMargin={8}
                  tickFormatter={(value) => `${value / 1000}K`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="linear"
                  dataKey="sales"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
