'use client'

import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Option } from '@/components/option'
import { SwitchButton } from '@/components/switch-button'
import { FileDocIcon, CalendarCheckIcon, FileCsvIcon, FunnelSimpleIcon, ArrowUpIcon, CheckCircleIcon, TagIcon, CaretUpIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { Pagination } from '@/components/pagination'

export function FinancesList() {
  const [selectedOption, setSelectedOption] = useState<'extrato' | 'disponivel-em-breve'>('extrato')
  const [selectedStatus, setSelectedStatus] = useState<'Todos' | 'Sucesso' | 'Falha'>('Todos')

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

  // Dados dos recebíveis
  const receivables = [
    { date: '02/08/2025', amount: 42000 },
    { date: '04/08/2025', amount: 42000 },
    { date: '12/08/2025', amount: 42000 },
    { date: '18/08/2025', amount: 42000 },
    { date: '22/08/2025', amount: 42000 },
    { date: '26/08/2025', amount: 42000 },
    { date: '31/08/2025', amount: 42000 },
  ]

  const totalReceivables = receivables.reduce((sum, item) => sum + item.amount, 0)

  // Componente CustomTooltip otimizado
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

  // Componente de transação otimizado
  const TransactionRow = () => (
    <tr className="border-b border-neutral-100 hover:bg-neutral-50">
      <td className="py-4 px-6">
        <div className="w-4 h-4 border border-neutral-300 rounded" />
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <ArrowUpIcon size={16} className="text-red-500" weight="bold" />
          </div>
          <span className="text-neutral-1000 text-base font-araboto">Retirada</span>
        </div>
      </td>
      <td className="py-4 px-6">
        <span className="text-neutral-1000">R$ 42.000,00</span>
      </td>
      <td className="py-4 px-6">
        <span className="text-neutral-1000">Cartão de crédito</span>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-green-100 rounded-full">
            <div className="flex items-center gap-1">
              <CheckCircleIcon size={16} className="text-green-600" weight="fill" />
              <span className="text-green-600 text-sm font-medium">Sucesso</span>
            </div>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <span className="text-neutral-1000">02/08/2025</span>
      </td>
    </tr>
  )

  // Componente de recebível otimizado
  const ReceivableItem = ({ item }: { item: { date: string; amount: number } }) => (
    <div className="flex items-center justify-between py-2 pb-3 border-b border-neutral-200/50 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 bg-yellow-secondary-500/20 rounded-full flex items-center justify-center">
          <CalendarCheckIcon size={18} className="text-yellow-secondary-500" weight="fill" />
        </div>
        <span className="text-neutral-600">
          Para o dia <span className="text-neutral-1000 font-medium">{item.date}</span>
        </span>
      </div>
      <span className="text-neutral-1000 font-medium">
        R$ {item.amount.toLocaleString('pt-BR')}
      </span>
    </div>
  )

  // Componente de gráfico otimizado
  const SalesChart = () => (
    <div className="w-[470px] max-h-[405px] flex-shrink-0">
      <div className="bg-white rounded-lg border border-neutral-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <TagIcon size={16} className="text-neutral-600" />
          <h4 className="text-neutral-1000 font-medium">Total de vendas</h4>
        </div>

        <div className="mb-4">
          <div className="text-2xl font-bold text-neutral-1000 mb-1">
            R$ 13.456,65
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <CaretUpIcon size={16} weight="bold" />
            <span className="text-sm font-medium">19.25% vs mês passado</span>
          </div>
        </div>

        <div className="h-56 w-full">
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
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                tickMargin={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
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
  )

  return (
    <Container>
      <div className="w-full bg-white rounded-lg py-6 px-5 mb-10 border border-neutral-200">
        <div className="flex items-center gap-1">
          <Option icon={FileDocIcon} label="Extrato" onSelect={() => setSelectedOption('extrato')} selected={selectedOption === 'extrato'} className="border-none" />
          <Option icon={CalendarCheckIcon} label="Disponível em breve" onSelect={() => setSelectedOption('disponivel-em-breve')} selected={selectedOption === 'disponivel-em-breve'} className="border-none" />
        </div>

        <AnimatePresence mode="wait">
          {selectedOption === 'extrato' && (
            <motion.div
              key="extrato"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <div className="w-full flex items-center justify-between gap-3 mt-6">
                <SwitchButton
                  items={['Todos', 'Sucesso', 'Falha']}
                  active={selectedStatus}
                  onChange={(value) => setSelectedStatus(value as 'Todos' | 'Sucesso' | 'Falha')}
                />

                <div className="flex items-start gap-4">
                  <Button variant="ghost" size="medium" className="flex items-center gap-2 h-12">
                    <FileCsvIcon size={20} className="flex-shrink-0" />
                    Exportar CSV
                  </Button>

                  <button className="w-12 h-12 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors duration-200 flex items-center justify-center">
                    <FunnelSimpleIcon size={20} />
                  </button>
                </div>
              </div>

              {/* Tabela de Transações */}
              <div className="mt-8 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left rounded-lg overflow-hidden">
                    <thead className="bg-neutral-50">
                      <tr className="text-neutral-600 text-sm">
                        <th className="py-3 px-6 font-medium">
                          <div className="w-4 h-4 border border-neutral-300 rounded" />
                        </th>
                        <th className="py-3 px-6 font-medium">Tipo</th>
                        <th className="py-3 px-6 font-medium">Valor</th>
                        <th className="py-3 px-6 font-medium">Método de pagamento</th>
                        <th className="py-3 px-6 font-medium">Status</th>
                        <th className="py-3 px-6 font-medium">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 4 }).map((_, index) => (
                        <TransactionRow key={index} />
                      ))}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  totalItems={40}
                  pageSize={10}
                  currentPage={1}
                  onPageChange={() => {}}
                />
              </div>
            </motion.div>
          )}

          {selectedOption === 'disponivel-em-breve' && (
            <motion.div
              key="disponivel-em-breve"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              {/* Header e descrição */}
              <div className="mt-6">
                <h3 className="text-lg font-araboto font-medium text-neutral-1000 mb-2">
                  Confira os valores que estão em processamento e que serão liberados em breve:
                </h3>
                <p className="text-neutral-600 text-sm">
                  Acompanhe as datas previstas e organize seu fluxo de caixa com mais segurança.
                </p>
              </div>

              {/* Layout com duas colunas */}
              <div className="mt-6 flex gap-8">
                {/* Coluna esquerda - Recebíveis */}
                <div className="flex-1 max-w-[760px] w-full">
                  <div>
                    {receivables.map((item, index) => (
                      <ReceivableItem key={index} item={item} />
                    ))}
                  </div>

                  {/* Total */}
                  <div className="mt-6 pt-4 border-t border-neutral-200">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600 font-medium">Total de valores à receber:</span>
                      <span className="text-neutral-1000 font-bold text-lg">
                        R$ {totalReceivables.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Coluna direita - Gráfico de vendas */}
                <SalesChart />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </Container>
  )
}
