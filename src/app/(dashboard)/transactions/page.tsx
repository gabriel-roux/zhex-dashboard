'use client'

import { Container } from '@/components/container'
import { ArrowUpIcon, ChartBarIcon, ChartLineIcon, FileCsvIcon, FunnelSimpleIcon, MagnifyingGlassIcon, PercentIcon, EyeIcon } from '@phosphor-icons/react'
import { Button } from '@/components/button'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { TextField } from '@/components/textfield'
import { useApi } from '@/hooks/useApi'
import { Pagination } from '@/components/pagination'
import { StatusBadge, getStatusMeta } from '@/components/status-badge'
import { formatCurrency, formatDateTime } from '@/utils/formatters'
import { exportToCSV } from '@/utils/csv-export'
import { TransactionTableList } from '@/@types/transaction'
import { EmptyState } from '@/components/empty-state'
import { TransactionsRowSkeleton } from '@/components/skeletons/transactions-row-skeleton'
import { FilterFormData, TransactionFilters } from './transaction-filters'
import { SwitchButton } from '@/components/switch-button'

function Card({ label, value, delta, icon }: { label: string, value: string, delta: number, icon: ReactNode }) {
  return (
    <article className="border border-neutral-200 rounded-xl p-5 flex flex-col gap-2 bg-white w-full">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-neutral-700 text-lg font-araboto font-medium">{label}</span>
      </div>

      <div className="flex items-start gap-2.5 mt-2">
        <span className="text-neutral-1000 font-semibold text-xl leading-none">
          {value}
        </span>

        <div className="flex items-center">
          <ArrowUpIcon size={14} weight="bold" className="text-green-600" />
          <span className="text-green-600 text-sm font-semibold">
            {delta}%
            <span className="text-neutral-500 text-sm">{' '}vs mês passado</span>
          </span>
        </div>
      </div>
    </article>
  )
}

export default function TransactionsPage() {
  const api = useApi()

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<TransactionTableList | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<FilterFormData>({})

  // Cache simples por chave (status + página + busca)
  const [cache, setCache] = useState<Map<string, { data: TransactionTableList; timestamp: number }>>(new Map())

  const pageSize = 22

  const formatId = useCallback((code?: string, id?: string) => {
    const value = code || id || ''
    if (value.length <= 10) return value
    return `${value.slice(0, 3)}…${value.slice(-4)}`
  }, [])

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams()
      params.append('page', currentPage.toString())
      params.append('limit', pageSize.toString())

      if (searchTerm.trim().length > 0) {
        params.append('search', searchTerm.trim())
      }

      // Advanced filters
      if (appliedFilters.statuses && appliedFilters.statuses.length > 0) {
        params.append('statuses', appliedFilters.statuses.join(','))
      }
      if (appliedFilters.startDate) {
        // Garantir formato ISO para a data inicial (início do dia)
        const startDate = new Date(appliedFilters.startDate)
        startDate.setHours(0, 0, 0, 0)
        params.append('startDate', startDate.toISOString())
      }
      if (appliedFilters.endDate) {
        // Garantir formato ISO para a data final (fim do dia)
        const endDate = new Date(appliedFilters.endDate)
        endDate.setHours(23, 59, 59, 999)
        params.append('endDate', endDate.toISOString())
      }
      if (appliedFilters.dateRange) {
        params.append('dateRange', appliedFilters.dateRange)
      }
      if (appliedFilters.customerName && appliedFilters.customerName.trim() !== '') {
        params.append('customerName', appliedFilters.customerName.trim())
      }
      if (appliedFilters.customerEmail && appliedFilters.customerEmail.trim() !== '') {
        params.append('customerEmail', appliedFilters.customerEmail.trim())
      }

      if (appliedFilters.paymentMethods && appliedFilters.paymentMethods.length > 0) {
        params.append('paymentMethods', appliedFilters.paymentMethods.join(','))
      }
      if (appliedFilters.cardBrands && appliedFilters.cardBrands.length > 0) {
        params.append('cardBrands', appliedFilters.cardBrands.join(','))
      }
      if (appliedFilters.minAmount && appliedFilters.minAmount > 0) {
        params.append('minAmount', (appliedFilters.minAmount).toString()) // Converter para centavos
      }
      if (appliedFilters.maxAmount && appliedFilters.maxAmount > 0) {
        params.append('maxAmount', (appliedFilters.maxAmount).toString()) // Converter para centavos
      }
      if (appliedFilters.products && appliedFilters.products.length > 0) {
        params.append('products', appliedFilters.products.join(','))
      }
      if (appliedFilters.productTypes && appliedFilters.productTypes.length > 0) {
        params.append('productTypes', appliedFilters.productTypes.join(','))
      }
      if (appliedFilters.productClasses && appliedFilters.productClasses.length > 0) {
        params.append('productClasses', appliedFilters.productClasses.join(','))
      }
      if (appliedFilters.isSubscription !== undefined) {
        params.append('isSubscription', appliedFilters.isSubscription.toString())
      }

      // Debug logs para filtros de customer e assinaturas
      console.log('=== DEBUG CUSTOMER & SUBSCRIPTION FILTERS ===')
      console.log('appliedFilters.customerName:', appliedFilters.customerName)
      console.log('appliedFilters.customerEmail:', appliedFilters.customerEmail)
      console.log('appliedFilters.isSubscription:', appliedFilters.isSubscription)
      console.log('customerName param:', params.get('customerName'))
      console.log('customerEmail param:', params.get('customerEmail'))
      console.log('isSubscription param:', params.get('isSubscription'))
      console.log('=== END DEBUG CUSTOMER & SUBSCRIPTION FILTERS ===')

      if (appliedFilters.subscriptionChargeTypes && appliedFilters.subscriptionChargeTypes.length > 0) {
        params.append('subscriptionChargeTypes', appliedFilters.subscriptionChargeTypes.join(','))
      }
      if (appliedFilters.utmSource) {
        params.append('utmSource', appliedFilters.utmSource)
      }
      if (appliedFilters.utmCampaign) {
        params.append('utmCampaign', appliedFilters.utmCampaign)
      }
      if (appliedFilters.utmMedium) {
        params.append('utmMedium', appliedFilters.utmMedium)
      }
      if (appliedFilters.utmTerm) {
        params.append('utmTerm', appliedFilters.utmTerm)
      }
      if (appliedFilters.utmContent) {
        params.append('utmContent', appliedFilters.utmContent)
      }
      if (appliedFilters.src) {
        params.append('src', appliedFilters.src)
      }
      if (appliedFilters.sck) {
        params.append('sck', appliedFilters.sck)
      }

      const cacheKey = `${currentPage}-${searchTerm.trim()}-${JSON.stringify(appliedFilters)}`
      const now = Date.now()
      const cached = cache.get(cacheKey)
      if (cached && now - cached.timestamp < 2 * 60 * 1000) {
        setData(cached.data)
        setLoading(false)
        return
      }

      const url = `/transactions?${params.toString()}`
      console.log('URL da API:', url)
      console.log('Parâmetros enviados:', Object.fromEntries(params.entries()))

      const response = await api.get<{ success: boolean; data?: TransactionTableList; message?: string }>(url)

      if (response.data.success && response.data.data) {
        setData(response.data.data)
        const newCache = new Map(cache)
        newCache.set(cacheKey, { data: response.data.data, timestamp: now })
        setCache(newCache)
      } else {
        console.error(response.data.message || 'Erro ao carregar transações')
      }
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, searchTerm, appliedFilters, api, cache])

  useEffect(() => {
    loadTransactions()
  }, [currentPage, searchTerm, appliedFilters])

  const handleExportCSV = useCallback(() => {
    if (!data?.transactions?.length) return

    const headers = ['ID', 'Produtos', 'Cliente', 'Status', 'Valor', 'Pagamento', 'Data do pedido']
    const rows = data.transactions.map(t => [
      t.code || t.id,
      t.productsSummary || '-',
      `${t.customerName || '-'} (${t.customerEmail || '-'})`,
      getStatusMeta(t.status, 'transaction').label,
      formatCurrency(t.amountInCurrency / 100),
      t.paymentDisplay || '-',
      formatDateTime(t.createdAt),
    ])

    exportToCSV([headers, ...rows], `transacoes_${new Date().toISOString().split('T')[0]}.csv`)
  }, [data])

  const tableBody = useMemo(() => {
    if (loading) {
      return (
        <>
          <TransactionsRowSkeleton rows={8} />
        </>
      )
    }

    if (!data?.transactions?.length) {
      return (
        <tr>
          <td colSpan={7} className="py-10 px-4 w-full">
            <EmptyState
              title="Nenhuma transação encontrada"
              description="Comece a vender e veja as transações aqui."
              icon={<ChartBarIcon size={24} weight="bold" />}
            />
          </td>
        </tr>
      )
    }

    return data!.transactions.map((t) => (
      <tr key={t.id} className="border-b border-neutral-100 hover:bg-neutral-50">
        <td className="py-3 px-4 text-neutral-1000 whitespace-nowrap truncate" title={t.code || t.id}>{formatId(t.code, t.id)}</td>
        <td className="py-3 px-4 text-neutral-1000 truncate" title={t.productsSummary || '—'}>{t.productsSummary || '—'}</td>
        <td className="py-3 px-4">
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-neutral-1000 truncate" title={t.customerName || '—'}>{t.customerName || '—'}</span>
            <span className="text-neutral-500 text-xs truncate" title={t.customerEmail || '—'}>{t.customerEmail || '—'}</span>
          </div>
        </td>
        <td className="py-3 px-4">
          <StatusBadge status={t.status} domain="transaction" size="sm" />
        </td>
        <td className="py-3 px-4 text-neutral-1000 text-sm whitespace-nowrap">{formatCurrency(t.amountInCurrency / 100)}</td>
        <td className="py-3 px-4 text-neutral-1000 text-sm truncate" title={t.paymentDisplay || '—'}>{t.paymentDisplay || '—'}</td>
        <td className="py-3 px-4 text-neutral-600 text-sm whitespace-nowrap">
          <div className="flex items-center justify-end gap-2">
            <span>{formatDateTime(t.createdAt)}</span>
            <a
              href={`/transactions/${t.id}`}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg"
              title="Ver detalhes da transação"
            >
              <EyeIcon size={16} className="text-neutral-600" />
            </a>
          </div>
        </td>
      </tr>
    ))
  }, [loading, data, formatId, formatDateTime])

  return (
    <>
      <Container className="mt-6 px-2">
        <h1 className="text-lg text-neutral-950 font-araboto font-medium">Histórico de Transações</h1>
        <p className="text-neutral-500 text-base font-araboto mb-6">Acompanhe e gerencie todos os pagamentos e vendas da sua conta.</p>
      </Container>

      <Container className="flex flex-col gap-6">
        {/* Cards de resumo (placeholder) */}
        <div className="grid grid-cols-3 gap-6">
          <Card label="Taxa de aprovação" value="88,09%" delta={10} icon={<PercentIcon size={18} weight="bold" className="-mt-1 text-neutral-400" />} />
          <Card label="Número de vendas" value="867" delta={10} icon={<ChartLineIcon size={18} weight="bold" className="-mt-1 text-neutral-400" />} />
          <Card label="Total de vendas" value="R$ 10.000,00" delta={10} icon={<ChartBarIcon size={18} weight="bold" className="-mt-1 text-neutral-400" />} />
        </div>

        {/* Barra de ações */}
        <div className="w-full bg-white rounded-lg py-6 px-5 mb-8 border border-neutral-200">
          <div className="w-full flex items-center justify-between gap-3">
            <SwitchButton
              items={['Todos', 'Aprovados', 'Rejeitados']}
              active={useMemo(() => {
                if (!appliedFilters.statuses || appliedFilters.statuses.length === 0) return 'Todos'
                if (appliedFilters.statuses.includes('COMPLETED')) return 'Aprovados'
                if (appliedFilters.statuses.includes('FAILED') || appliedFilters.statuses.includes('CANCELLED')) return 'Rejeitados'
                return 'Todos'
              }, [appliedFilters.statuses])}
              onChange={useCallback((label) => {
                let newStatuses: string[] = []
                if (label === 'Aprovados') {
                  newStatuses = ['COMPLETED']
                } else if (label === 'Rejeitados') {
                  newStatuses = ['FAILED']
                }
                setAppliedFilters(prev => {
                  // Evitar re-render se os statuses são os mesmos
                  if (JSON.stringify(prev.statuses) === JSON.stringify(newStatuses)) {
                    return prev
                  }
                  return { ...prev, statuses: newStatuses }
                })
              }, [])}
            />

            <div className="flex items-start gap-4">
              <div className="w-full max-w-[320px]">
                <TextField
                  leftIcon={<MagnifyingGlassIcon size={20} weight="bold" />}
                  placeholder="Buscar na listagem"
                  value={searchTerm}
                  onChange={(e) => {
                    setCurrentPage(1)
                    setSearchTerm(e.target.value)
                  }}
                />
              </div>

              <Button
                variant="ghost"
                size="medium"
                className="flex items-center gap-2 h-12 flex-shrink-0"
                onClick={handleExportCSV}
                disabled={!data?.transactions?.length}
              >
                <FileCsvIcon size={20} className="flex-shrink-0" />
                Exportar CSV
              </Button>

              <button
                onClick={() => setFiltersOpen(true)}
                className="flex-shrink-0 w-12 h-12 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors duration-200 flex items-center justify-center"
              >
                <FunnelSimpleIcon size={20} />
              </button>
            </div>
          </div>

          {/* Tabela */}
          <div className="mt-6">
            <table className="w-full text-left rounded-lg overflow-hidden table-fixed">
              <colgroup>
                <col style={{ width: '10%' }} />
                <col style={{ width: '22%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '12%' }} />
              </colgroup>
              <thead className="bg-neutral-50 w-full">
                <tr className="text-neutral-600 text-sm w-full">
                  <th className="py-2.5 px-4 font-medium">ID</th>
                  <th className="py-2.5 px-4 font-medium">Produtos</th>
                  <th className="py-2.5 px-4 font-medium">Nome e E-mail</th>
                  <th className="py-2.5 px-4 font-medium">Status</th>
                  <th className="py-2.5 px-4 font-medium">Valor R$</th>
                  <th className="py-2.5 px-4 font-medium">Pagamento</th>
                  <th className="py-2.5 px-4 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {tableBody}
              </tbody>
            </table>

            <Pagination
              totalItems={data?.pagination.total || 0}
              pageSize={data?.pagination.limit || pageSize}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </Container>

      {/* Modal de Filtros */}
      <TransactionFilters
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        onFiltersApplied={useCallback((filters) => {
          setAppliedFilters(prev => {
            // Evitar re-render se os filtros são os mesmos
            if (JSON.stringify(prev) === JSON.stringify(filters)) {
              return prev
            }
            return filters
          })
          setCurrentPage(1) // Reset to first page when filters change
        }, [])}
        initialFilters={appliedFilters}
      />
    </>
  )
}
