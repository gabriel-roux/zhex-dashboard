'use client'

import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Option } from '@/components/option'
import { SwitchButton } from '@/components/switch-button'
import { CalendarCheckIcon, FileCsvIcon, FunnelSimpleIcon, ArrowUpIcon, TagIcon, CaretUpIcon, WalletIcon, BankIcon, CalendarDotsIcon } from '@phosphor-icons/react'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { Pagination } from '@/components/pagination'
import { useApi } from '@/hooks/useApi'
import { WithdrawalsList, Withdrawal } from '@/@types/wallet'
import { WithdrawalRowSkeleton } from '@/components/skeletons/withdrawal-row-skeleton'
import { UpcomingBalanceSkeleton } from '@/components/skeletons/upcoming-balance-skeleton'
import { EmptyState } from '@/components/empty-state'
import { StatusBadge, getStatusMeta } from '@/components/status-badge'
import { exportToCSV } from '@/utils/csv-export'

// Tipos para o "disponível em breve"
interface UpcomingBalanceBreakdown {
  date: string;
  amount: number; // em centavos
  amountFormatted: string;
  transactionIds: string[];
  formattedDate: string;
}

interface UpcomingBalance {
  totalUpcoming: number; // em centavos
  totalUpcomingFormatted: string;
  breakdown: UpcomingBalanceBreakdown[];
}

interface WalletWithUpcomingBalance {
  id: string;
  companyId: string;
  currency: string;
  availableBalance: number;
  processingBalance: number;
  reservedBalance: number;
  totalBalance: number;
  availableBalanceInReais: number;
  processingBalanceInReais: number;
  reservedBalanceInReais: number;
  totalBalanceInReais: number;
  autoWithdrawalEnabled: boolean;
  withdrawalThreshold?: number;
  upcomingBalance: UpcomingBalance;
}

export function FinancesList() {
  const api = useApi()
  const [selectedOption, setSelectedOption] = useState<'extrato' | 'disponivel-em-breve'>('extrato')
  const [selectedStatus, setSelectedStatus] = useState<'Todos' | 'Sucesso' | 'Falha'>('Todos')
  const [withdrawals, setWithdrawals] = useState<WithdrawalsList | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedWithdrawals, setSelectedWithdrawals] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)

  // Estados para "disponível em breve"
  const [walletBalance, setWalletBalance] = useState<WalletWithUpcomingBalance | null>(null)
  const [walletLoading, setWalletLoading] = useState(false)
  const [walletError, setWalletError] = useState<string | null>(null)

  // Cache para evitar requests desnecessários
  const [walletCache, setWalletCache] = useState<{
    data: WalletWithUpcomingBalance | null
    timestamp: number
    isValid: boolean
  }>({ data: null, timestamp: 0, isValid: false })

  // Cache para withdrawals por filtro
  const [withdrawalsCache, setWithdrawalsCache] = useState<Map<string, {
    data: WithdrawalsList
    timestamp: number
  }>>(new Map())

  // Função para carregar dados do wallet com cache
  const loadWalletBalance = useCallback(async (forceRefresh = false) => {
    const now = Date.now()
    const cacheAge = 5 * 60 * 1000 // 5 minutos de cache

    // Verifica se há cache válido e não é force refresh
    if (!forceRefresh && walletCache.data && walletCache.isValid && (now - walletCache.timestamp) < cacheAge) {
      setWalletBalance(walletCache.data)
      return
    }

    try {
      setWalletLoading(true)
      setWalletError(null)

      const response = await api.get<{
        success: boolean;
        data: WalletWithUpcomingBalance;
        message?: string;
      }>('/wallet/balance-with-upcoming')

      if (response.data.success) {
        const data = response.data.data
        setWalletBalance(data)

        // Atualiza cache
        setWalletCache({
          data,
          timestamp: now,
          isValid: true,
        })
      } else {
        setWalletError(response.data.message || 'Erro ao carregar saldo da carteira')
      }
    } catch (err) {
      console.error('Erro ao carregar saldo da carteira:', err)
      setWalletError('Erro ao carregar saldo da carteira')
    } finally {
      setWalletLoading(false)
    }
  }, [api, walletCache])

  // Função para carregar withdrawals com cache
  const loadWithdrawals = useCallback(async () => {
    const now = Date.now()
    const cacheAge = 2 * 60 * 1000 // 2 minutos de cache para withdrawals

    // Cria chave do cache baseada nos filtros
    const cacheKey = `${selectedStatus}-${currentPage}`
    const cachedData = withdrawalsCache.get(cacheKey)

    // Verifica se há cache válido
    if (cachedData && (now - cachedData.timestamp) < cacheAge) {
      setWithdrawals(cachedData.data)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const filters: {
        page: number
        limit: number
        status?: string
      } = {
        page: currentPage,
        limit: 10,
      }

      if (selectedStatus !== 'Todos') {
        filters.status = selectedStatus === 'Sucesso'
          ? 'COMPLETED'
          : 'FAILED'
      }

      const params = new URLSearchParams()
      params.append('page', currentPage.toString())
      params.append('limit', '10')
      if (filters.status) {
        params.append('status', filters.status)
      }
      const url = `/wallet/withdrawals?${params.toString()}`
      const response = await api.get<{ success: boolean; data?: WithdrawalsList; message?: string }>(url)

      if (response.data.success && response.data.data) {
        setWithdrawals(response.data.data)

        // Atualiza cache
        const newCache = new Map(withdrawalsCache)
        newCache.set(cacheKey, {
          data: response.data.data,
          timestamp: now,
        })
        setWithdrawalsCache(newCache)
      } else {
        setError(response.data.message || 'Erro ao carregar saques')
      }
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'Erro ao carregar saques'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [selectedStatus, currentPage, api, withdrawalsCache])

  useEffect(() => {
    loadWithdrawals()
  }, [loadWithdrawals])

  // Carregar dados do wallet quando mudar para "disponível em breve"
  useEffect(() => {
    if (selectedOption === 'disponivel-em-breve') {
      loadWalletBalance()
    }
  }, [selectedOption])

  // Limpa seleção quando mudar filtros ou página
  useEffect(() => {
    setSelectedWithdrawals(new Set())
    setSelectAll(false)
  }, [selectedStatus, currentPage])

  // Dados do gráfico memoizados
  const chartData = useMemo(() => [
    { date: 'Mar 1', sales: 1200 },
    { date: 'Mar 5', sales: 1800 },
    { date: 'Mar 10', sales: 1400 },
    { date: 'Mar 15', sales: 2200 },
    { date: 'Mar 20', sales: 1900 },
    { date: 'Mar 25', sales: 2800 },
    { date: 'Mar 30', sales: 3200 },
  ], [])

  // Funções para gerenciar seleção de checkboxes
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedWithdrawals(new Set())
      setSelectAll(false)
    } else {
      const allIds = withdrawals?.withdrawals.map(w => w.id) || []
      setSelectedWithdrawals(new Set(allIds))
      setSelectAll(true)
    }
  }

  const handleSelectWithdrawal = (withdrawalId: string) => {
    const newSelected = new Set(selectedWithdrawals)
    if (newSelected.has(withdrawalId)) {
      newSelected.delete(withdrawalId)
    } else {
      newSelected.add(withdrawalId)
    }
    setSelectedWithdrawals(newSelected)

    // Atualiza selectAll baseado na seleção atual
    const allIds = withdrawals?.withdrawals.map(w => w.id) || []
    setSelectAll(newSelected.size === allIds.length && allIds.length > 0)
  }

  const isWithdrawalSelected = (withdrawalId: string) => {
    return selectedWithdrawals.has(withdrawalId)
  }

  // Função para exportar CSV
  const handleExportCSV = () => {
    if (!withdrawals || selectedWithdrawals.size === 0) {
      alert('Selecione pelo menos um saque para exportar')
      return
    }

    const selectedData = withdrawals.withdrawals.filter(w => selectedWithdrawals.has(w.id))

    // Cabeçalhos do CSV
    const headers = [
      'ID',
      'Tipo',
      'Valor',
      'Método de Pagamento',
      'Status',
      'Data de Criação',
      'Data de Atualização',
    ]

    // Dados do CSV
    const csvData = selectedData.map(withdrawal => [
      withdrawal.id,
      'Retirada',
      formatCurrency(withdrawal.amountInCurrency),
      withdrawal.methodDescription,
      getStatusMeta(withdrawal.status, 'withdrawal').label,
      formatDate(withdrawal.createdAt),
      '',
    ])

    exportToCSV([headers, ...csvData], `saques_${new Date().toISOString().split('T')[0]}.csv`)
  }

  // Funções memoizadas para melhor performance
  const formatCurrency = useCallback((value: number, currency: string = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency,
    }).format(value)
  }, [])

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }, [])

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

  // Componente de transação memoizado para melhor performance
  const TransactionRow = useCallback(({ withdrawal }: { withdrawal: Withdrawal }) => (
    <tr className="border-b border-neutral-100 hover:bg-neutral-50">
      <td className="py-4 px-6">
        <button
          onClick={() => handleSelectWithdrawal(withdrawal.id)}
          className="w-4 h-4 border border-zhex-base-500 rounded flex items-center justify-center transition-colors duration-200 hover:bg-neutral-100"
        >
          {isWithdrawalSelected(withdrawal.id) && (
            <div className="w-2.5 h-2.5 bg-zhex-base-500 rounded-sm" />
          )}
        </button>
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
        <span className="text-neutral-1000">{formatCurrency(withdrawal.amountInCurrency)}</span>
      </td>
      <td className="py-4 px-6">
        <span className="text-neutral-1000">{withdrawal.methodDescription}</span>
      </td>
      <td className="py-4 px-6">
        <StatusBadge status={withdrawal.status} domain="withdrawal" />
      </td>
      <td className="py-4 px-6">
        <span className="text-neutral-600">{formatDate(withdrawal.createdAt)}</span>
      </td>
    </tr>
  ), [handleSelectWithdrawal, isWithdrawalSelected, formatCurrency, formatDate])

  // Componente de gráfico otimizado
  const SalesChart = useCallback(() => (
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
  ), [chartData])

  return (
    <Container>
      <div className="w-full bg-white rounded-lg py-6 px-5 mb-10 border border-neutral-200">
        <div className="flex items-center gap-1">
          <Option icon={BankIcon} label="Extrato" onSelect={() => setSelectedOption('extrato')} selected={selectedOption === 'extrato'} className="border-none" />
          <Option icon={CalendarCheckIcon} label="Disponível em breve" onSelect={() => setSelectedOption('disponivel-em-breve')} selected={selectedOption === 'disponivel-em-breve'} className="border-none" />
        </div>

        <AnimatePresence mode="sync">
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
                  <Button
                    variant="ghost"
                    size="medium"
                    className="flex items-center gap-2 h-12"
                    onClick={handleExportCSV}
                    disabled={selectedWithdrawals.size === 0}
                  >
                    <FileCsvIcon size={20} className="flex-shrink-0" />
                    Exportar CSV {selectedWithdrawals.size > 0 && `(${selectedWithdrawals.size})`}
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
                          <button
                            onClick={handleSelectAll}
                            className="w-4 h-4 border border-zhex-base-500 rounded flex items-center justify-center transition-colors duration-200 hover:bg-neutral-100"
                          >
                            {selectAll && (
                              <div className="w-2.5 h-2.5 bg-zhex-base-500 rounded-sm" />
                            )}
                          </button>
                        </th>
                        <th className="py-3 px-6 font-medium">Tipo</th>
                        <th className="py-3 px-6 font-medium">Valor</th>
                        <th className="py-3 px-6 font-medium">Método de pagamento</th>
                        <th className="py-3 px-6 font-medium">Status</th>
                        <th className="py-3 px-6 font-medium">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading
                        ? (
                          <>
                            {Array.from({ length: 4 }).map((_, index) => (
                              <WithdrawalRowSkeleton key={index} />
                            ))}
                          </>
                          )
                        : error
                          ? (
                            <tr>
                              <td colSpan={6} className="py-4 px-6 text-center text-red-600">
                                {error}
                              </td>
                            </tr>
                            )
                          : withdrawals && withdrawals.withdrawals.length === 0
                            ? (
                              <tr>
                                <td colSpan={6} className="py-12">
                                  <EmptyState
                                    icon={<WalletIcon size={28} weight="bold" className="text-neutral-400" />}
                                    title="Nenhum saque encontrado"
                                    description="Você ainda não realizou nenhuma retirada. Faça sua primeira retirada para ver os detalhes aqui ou comece a vender para receber valores."
                                  />
                                </td>
                              </tr>
                              )
                            : (
                                withdrawals?.withdrawals.map((withdrawal: Withdrawal, index: number) => (
                                  <TransactionRow key={index} withdrawal={withdrawal} />
                                ))
                              )}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  totalItems={withdrawals?.pagination.total || 0}
                  pageSize={withdrawals?.pagination.limit || 10}
                  currentPage={currentPage}
                  onPageChange={(page) => setCurrentPage(page)}
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
                  {walletLoading
                    ? (
                      <UpcomingBalanceSkeleton />
                      )
                    : walletError
                      ? (
                        <div className="text-center py-8">
                          <div className="text-red-600 mb-2">{walletError}</div>
                          <button
                            onClick={() => loadWalletBalance(true)}
                            className="text-blue-600 hover:text-blue-700 underline text-sm"
                          >
                            Tentar novamente
                          </button>
                        </div>
                        )
                      : !walletBalance || !walletBalance.upcomingBalance || walletBalance.upcomingBalance.breakdown.length === 0
                          ? (
                            <div className="text-center pt-20">
                              <CalendarCheckIcon size={32} className="text-neutral-1000 mb-4 mx-auto" weight="bold" />
                              <h3 className="text-lg font-araboto font-medium text-neutral-1000 mb-1">
                                Nenhum valor disponível em breve
                              </h3>
                              <p className="text-neutral-600 text-center max-w-xl mx-auto leading-relaxed">
                                Você ainda não tem valores em processamento que estarão disponíveis nos próximos 7 dias. Continue vendendo para ver os valores futuros aqui.
                              </p>
                            </div>
                            )
                          : (
                            <>
                              <div>
                                {walletBalance.upcomingBalance.breakdown.map((item, index) => (
                                  <div key={index} className="flex items-center justify-between py-2 pb-3 border-b border-neutral-200/50 last:border-b-0">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                        <CalendarDotsIcon size={18} className="text-yellow-500" weight="bold" />
                                      </div>
                                      <span className="text-neutral-600">
                                        Para o dia <span className="text-neutral-1000 font-medium">{item.formattedDate}</span>
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-neutral-1000 font-medium">
                                        {item.amountFormatted}
                                      </div>
                                      <div className="text-yellow-500/70 text-xs">
                                        {item.transactionIds.length} transação{item.transactionIds.length > 1
                                          ? 'ões'
                                          : 'ão'}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Total */}
                              <div className="mt-6 pt-4 border-t border-neutral-200">
                                <div className="flex items-center justify-between">
                                  <span className="text-neutral-600 font-medium">Total disponível em breve:</span>
                                  <span className="text-neutral-1000 font-bold text-lg">
                                    {walletBalance.upcomingBalance.totalUpcomingFormatted}
                                  </span>
                                </div>
                              </div>
                            </>
                            )}
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
