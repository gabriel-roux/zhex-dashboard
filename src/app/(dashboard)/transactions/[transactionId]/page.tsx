/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { StatusBadge } from '@/components/status-badge'
import { ArrowLeftIcon, FileCsvIcon, InfoIcon } from '@phosphor-icons/react'
import Link from 'next/link'
import { use, useEffect, useState } from 'react'
import { formatCurrency } from '@/utils/formatters'
import { TransactionDetailsSkeleton } from '@/components/skeletons/transaction-details-skeleton'
import { useApi } from '@/hooks/useApi'
import type { TransactionDetails, TransactionDetailsApiResponse } from '@/@types/transaction'
import Image from 'next/image'
import { EmptyState } from '@/components/empty-state'

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 bg-neutral-50 rounded-md px-2 py-1">
      <span className="text-neutral-600 text-sm font-medium">{label}</span>
      <span className="text-neutral-600 text-sm">{value}</span>
    </div>
  )
}

function formatDateTime(date: Date) {
  const dd = date.toLocaleDateString('pt-BR', { day: '2-digit' })
  const mmm = date.toLocaleDateString('pt-BR', { month: 'short' })
  const hh = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${dd} ${mmm} às ${hh}h`
}

interface TransactionPageProps {
  params: Promise<{
    transactionId: string
  }>
}

export default function TransactionPage({ params }: TransactionPageProps) {
  const { transactionId } = use(params)
  const { get } = useApi()
  const [loading, setLoading] = useState(true)
  const [transaction, setTransaction] = useState<TransactionDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await get<TransactionDetailsApiResponse>(`/transactions/${transactionId}`)

        if (response.success && response.data?.data) {
          setTransaction(response.data.data)
        } else {
          setError(response.data?.error || 'Erro ao carregar detalhes da transação')
        }
      } catch (err) {
        setError('Erro ao conectar com o servidor')
        console.error('Erro ao buscar detalhes da transação:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactionDetails()
  }, [transactionId, get])

  // Helper functions for formatting
  const formatCardInfo = (transaction: TransactionDetails) => {
    if (!transaction.transaction.cardBrand || !transaction.transaction.cardLastFour) return null
    return {
      brand: transaction.transaction.cardBrand,
      lastFour: transaction.transaction.cardLastFour,
      expiryMonth: transaction.transaction.cardExpiryMonth,
      expiryYear: transaction.transaction.cardExpiryYear,
    }
  }

  const formatAddress = (customer: TransactionDetails['customer']) => {
    if (!customer?.address) return null

    const parts = [
      customer.address,
      customer.neighborhood,
      customer.state,
      customer.zipcode,
    ].filter(Boolean)

    return {
      full: parts.join(', '),
      short: customer.address + (customer.neighborhood
        ? `, ${customer.neighborhood}`
        : ''),
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED': return 'COMPLETED'
      case 'FAILED': return 'FAILED'
      case 'REFUNDED': return 'REFUNDED'
      case 'CHARGEBACK': return 'CHARGEBACK'
      case 'CHARGEBACK_ALERT': return 'CHARGEBACK_ALERT'
      case 'PENDING': return 'PENDING'
      case 'PROCESSING': return 'PROCESSING'
      case 'INITIALIZED': return 'INITIALIZED'
      default: return 'PENDING'
    }
  }

  const getDeliveryStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED': return 'COMPLETED'
      case 'SHIPPED': return 'PROCESSING'
      case 'PENDING': return 'PENDING'
      case 'CANCELLED': return 'FAILED'
      case 'RETURNED': return 'FAILED'
      default: return 'PENDING'
    }
  }

  if (loading) {
    return (
      <Container className="w-full mt-6">
        <Link href="/transactions" className="flex items-center gap-2 text-neutral-1000 text-base font-araboto font-medium mb-6 hover:text-zhex-base-500 transition-all duration-300">
          <ArrowLeftIcon size={20} weight="bold" className="text-zhex-base-500" />
          Voltar
        </Link>

        <TransactionDetailsSkeleton />
      </Container>
    )
  }

  if (error || !transaction) {
    return (
      <Container className="w-full mt-6">
        <Link href="/transactions" className="flex items-center gap-2 text-neutral-1000 text-base font-araboto font-medium mb-6 hover:text-zhex-base-500 transition-all duration-300">
          <ArrowLeftIcon size={20} weight="bold" className="text-zhex-base-500" />
          Voltar
        </Link>

        <div className="w-full bg-white rounded-lg py-12 px-5 border border-neutral-200 text-center">
          <h2 className="text-lg text-neutral-950 font-araboto font-medium mb-2">
            {error || 'Transação não encontrada'}
          </h2>
          <p className="text-neutral-500 text-base font-araboto mb-6">
            Não foi possível carregar os detalhes desta transação.
          </p>
          <Button
            variant="primary"
            size="medium"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </Button>
        </div>
      </Container>
    )
  }

  // Prepared data for display
  const cardInfo = formatCardInfo(transaction)
  const customerAddress = formatAddress(transaction.customer)
  const statusBadge = getStatusBadgeVariant(transaction.transaction.status)
  const deliveryStatusBadge = transaction.delivery
    ? getDeliveryStatusBadge(transaction.delivery.status)
    : null

  return (
    <Container className="w-full mt-6">
      <Link href="/transactions" className="flex items-center gap-2 text-neutral-1000 text-base font-araboto font-medium mb-6 hover:text-zhex-base-500 transition-all duration-300">
        <ArrowLeftIcon size={20} weight="bold" className="text-zhex-base-500" />
        Voltar
      </Link>

      <div className="w-full bg-white rounded-lg py-6 px-5 mb-10 border border-neutral-200">
        <div>
          <h1 className="text-lg text-neutral-950 font-araboto font-medium">
            Visão geral da transação
          </h1>
          <p className="text-neutral-500 text-base font-araboto mb-6">
            Veja as informações da transação e as ações que podem ser realizadas.
          </p>
        </div>

        <div className="w-full mt-4 border border-neutral-200 rounded-lg p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-neutral-950 text-base font-araboto font-medium">
                Transação #{transaction.transaction.id}
              </h2>
              <StatusBadge status={statusBadge as any} domain="transaction" showIcon size="md" />
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="medium" className="flex items-center gap-2">
                <FileCsvIcon size={20} weight="bold" />
                Exportar dados
              </Button>
              {transaction.transaction.status !== 'REFUNDED' && transaction.transaction.status !== 'CHARGEBACK' && (
                <Button variant="primary" size="medium">
                  Reembolsar
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-3">
            {/* Tags de assinatura */}
            {transaction.transaction.subscriptionId && (
              <>
                <InfoPill
                  label="Assinatura:"
                  value={`${transaction.transaction.subscriptionChargeType === 'INITIAL'
                    ? 'Primeira cobrança'
                    : transaction.transaction.subscriptionChargeType === 'RENEWAL'
                      ? 'Renovação'
                      : transaction.transaction.subscriptionChargeType === 'RETRY'
                        ? 'Tentativa'
                        : 'Assinatura'}`}
                />
                {transaction.subscription?.intervalCount && (
                  <InfoPill
                    label="Ciclo:"
                    value={`${transaction.subscription.intervalCount}º`}
                  />
                )}

                {transaction.subscription?.nextBillingDate && transaction.transaction.subscriptionChargeType !== 'RETRY' && (
                  <InfoPill
                    label="Próxima cobrança:"
                    value={formatDateTime(new Date(transaction.subscription.nextBillingDate)).split(' às')[0]}
                  />
                )}
              </>
            )}

            {/* Pills de status de pagamento */}
            {transaction.paymentStatusTracking?.chargebackAlertAt && (
              <InfoPill
                label="Alerta de chargeback em:"
                value={formatDateTime(new Date(transaction.paymentStatusTracking.chargebackAlertAt))}
              />
            )}
            {transaction.paymentStatusTracking?.refundedAt && (
              <InfoPill
                label="Reembolsado em:"
                value={formatDateTime(new Date(transaction.paymentStatusTracking.refundedAt))}
              />
            )}
            {transaction.paymentStatusTracking?.chargebackAt && (
              <InfoPill
                label="Chargeback em:"
                value={formatDateTime(new Date(transaction.paymentStatusTracking.chargebackAt))}
              />
            )}

            {transaction.paymentStatusTracking?.paidAt && (
              <InfoPill
                label="Pago em:"
                value={formatDateTime(new Date(transaction.paymentStatusTracking.paidAt))}
              />
            )}
            <InfoPill
              label="Iniciado em:"
              value={formatDateTime(new Date(transaction.transaction.createdAt))}
            />
            {transaction.transaction.processedAt && (
              <InfoPill
                label="Processado em:"
                value={formatDateTime(new Date(transaction.transaction.processedAt))}
              />
            )}
          </div>
        </div>

        {/* Grid de detalhes */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Bloco 1: Detalhes */}
          <div className="bg-white border border-neutral-200 rounded-lg p-5 min-h-[257px]">
            <h3 className="text-neutral-950 font-araboto text-lg font-medium mb-4">Detalhes</h3>
            <dl className="grid grid-cols-2 gap-y-3 text-base">
              <dt className="text-neutral-500">ID da transação:</dt>
              <dd className="text-neutral-1000 font-medium break-all text-right">{transaction.transaction.id}</dd>

              <dt className="text-neutral-500">Nome:</dt>
              <dd className="text-neutral-1000 font-medium break-all text-right">
                {transaction.customer?.name || 'N/A'}
              </dd>

              <dt className="text-neutral-500">E-mail:</dt>
              <dd className="text-neutral-1000 font-medium break-all text-right">
                {transaction.customer?.email || 'N/A'}
              </dd>

              <dt className="text-neutral-500">Telefone:</dt>
              <dd className="text-neutral-1000 font-medium break-all text-right">
                {transaction.customer?.phone || 'N/A'}
              </dd>

              <dt className="text-neutral-500">País:</dt>
              <dd className="text-neutral-1000 font-medium break-all text-right">
                {transaction.customer?.country || 'N/A'}
              </dd>
            </dl>
          </div>

          {/* Bloco 2: Info de Pagamento */}
          <div className="bg-white border border-neutral-200 rounded-lg p-5 min-h-[257px]">
            <h3 className="text-neutral-950 font-araboto text-lg font-medium mb-4">Info de Pagamento</h3>
            <dl className="grid grid-cols-2 gap-y-3 text-base">
              <dt className="text-neutral-500">Método:</dt>
              <dd className="text-neutral-1000 font-medium break-all text-right capitalize">
                {transaction.paymentMethod?.name || transaction.transaction.paymentMethod || 'N/A'}
              </dd>

              {cardInfo && (
                <>
                  <dt className="text-neutral-500">Últimos 4 dígitos:</dt>
                  <dd className="text-neutral-1000 font-medium break-all text-right">
                    •••• {cardInfo.lastFour}
                  </dd>

                  <dt className="text-neutral-500">Bandeira:</dt>
                  <dd className="text-neutral-1000 font-medium break-all text-right capitalize">
                    {cardInfo.brand}
                  </dd>

                  <dt className="text-neutral-500">Validade:</dt>
                  <dd className="text-neutral-1000 font-medium break-all text-right">
                    {cardInfo.expiryMonth
                      ? `${String(cardInfo.expiryMonth).padStart(2, '0')}/${cardInfo.expiryYear}`
                      : 'N/A'}
                  </dd>
                </>
              )}

              <dt className="text-neutral-500">Valor:</dt>
              <dd className="text-neutral-1000 font-medium break-all text-right">
                {formatCurrency(transaction.transaction.amount / 100)}
              </dd>
            </dl>
          </div>

          {/* Bloco 3: Assinatura/Entrega/Endereço */}
          <div className="bg-white border border-neutral-200 rounded-lg p-5 min-h-[257px]">
            <h3 className="text-neutral-950 font-araboto text-lg font-medium mb-4">
              {transaction.transaction.subscriptionId
                ? 'Informações da Assinatura'
                : transaction.delivery
                  ? 'Status de entrega'
                  : 'Endereço do cliente'}
            </h3>
            <dl className="grid grid-cols-2 gap-y-3 text-base">
              {transaction.transaction.subscriptionId
                ? (
                  <>
                    <dt className="text-neutral-500">Status:</dt>
                    <dd className="text-neutral-1000 font-medium break-all text-right flex justify-end">
                      <StatusBadge status={transaction.subscription?.status as any} domain="subscription" showIcon size="sm" />
                    </dd>

                    <dt className="text-neutral-500">Intervalo:</dt>
                    <dd className="text-neutral-1000 font-medium break-all text-right">
                      {transaction.subscription?.interval === 'MONTHLY'
                        ? 'Mensal'
                        : transaction.subscription?.interval === 'YEARLY'
                          ? 'Anual'
                          : transaction.subscription?.interval || 'N/A'}
                    </dd>

                    <dt className="text-neutral-500">Ciclo atual:</dt>
                    <dd className="text-neutral-1000 font-medium break-all text-right">
                      {transaction.subscription?.intervalCount
                        ? `${transaction.subscription.intervalCount}º ciclo`
                        : 'N/A'}
                    </dd>

                    {transaction.subscription?.currentPeriodStart && (
                      <>
                        <dt className="text-neutral-500">Período atual:</dt>
                        <dd className="text-neutral-1000 font-medium break-all text-right">
                          {formatDateTime(new Date(transaction.subscription.currentPeriodStart)).split(' às')[0]} - {
                            transaction.subscription.currentPeriodEnd
                              ? formatDateTime(new Date(transaction.subscription.currentPeriodEnd)).split(' às')[0]
                              : 'N/A'
                          }
                        </dd>
                      </>
                    )}

                    {transaction.subscription?.nextBillingDate && (
                      <>
                        <dt className="text-neutral-500">Próxima cobrança:</dt>
                        <dd className="text-neutral-1000 font-medium break-all text-right">
                          {formatDateTime(new Date(transaction.subscription.nextBillingDate)).split(' às')[0]}
                        </dd>
                      </>
                    )}
                  </>
                  )
                : transaction.delivery
                  ? (
                    <>
                      <dt className="text-neutral-500">Status:</dt>
                      <dd className="text-neutral-1000 font-medium break-all flex justify-end">
                        <StatusBadge status={deliveryStatusBadge as any} domain="generic" showIcon size="sm" />
                      </dd>

                      <dt className="text-neutral-500">Transportadora:</dt>
                      <dd className="text-neutral-1000 font-medium break-all text-right">
                        {transaction.delivery.carrier || 'N/A'}
                      </dd>

                      <dt className="text-neutral-500">Endereço:</dt>
                      <dd className="text-neutral-1000 font-medium break-all text-right truncate">
                        {customerAddress?.short || 'N/A'}
                      </dd>

                      {transaction.delivery.deliveredAt && (
                        <>
                          <dt className="text-neutral-500">Data da entrega:</dt>
                          <dd className="text-neutral-1000 font-medium break-all text-right">
                            {formatDateTime(new Date(transaction.delivery.deliveredAt)).split(' às')[0]}
                          </dd>
                        </>
                      )}

                      {transaction.delivery.shippedAt && !transaction.delivery.deliveredAt && (
                        <>
                          <dt className="text-neutral-500">Data do envio:</dt>
                          <dd className="text-neutral-1000 font-medium break-all text-right">
                            {formatDateTime(new Date(transaction.delivery.shippedAt)).split(' às')[0]}
                          </dd>
                        </>
                      )}
                    </>
                    )
                  : (
                    <>
                      <dt className="text-neutral-500">Endereço:</dt>
                      <dd className="text-neutral-1000 font-medium break-all text-right" title={customerAddress?.full}>
                        {customerAddress?.short || 'N/A'}
                      </dd>

                      <dt className="text-neutral-500">Bairro:</dt>
                      <dd className="text-neutral-1000 font-medium break-all text-right">
                        {transaction.customer?.neighborhood || 'N/A'}
                      </dd>

                      <dt className="text-neutral-500">CEP:</dt>
                      <dd className="text-neutral-1000 font-medium break-all text-right">
                        {transaction.customer?.zipcode || 'N/A'}
                      </dd>

                      <dt className="text-neutral-500">Estado:</dt>
                      <dd className="text-neutral-1000 font-medium break-all text-right">
                        {transaction.customer?.state || 'N/A'}
                      </dd>
                    </>
                    )}
            </dl>
            {transaction.delivery?.trackingCode && (
              <div className="mt-4">
                <span className="text-zhex-base-600 hover:text-zhex-base-700 text-base underline font-medium cursor-pointer">
                  Rastrear entrega
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Detalhes do pedido */}
        <div className="mt-8">
          <h3 className="text-neutral-950 font-araboto text-lg font-medium mb-4">Detalhes do pedido</h3>

          <div className="w-full rounded-lg overflow-hidden">
            {/* Cabeçalho */}
            <div className="grid grid-cols-12 bg-neutral-50 text-neutral-600 text-sm font-medium px-4 py-3">
              <div className="col-span-5">Nome</div>
              <div className="col-span-2">SKU</div>
              <div className="col-span-2">Quantidade</div>
              <div className="col-span-2">Preço</div>
              <div className="col-span-1 text-right">Total</div>
            </div>

            {/* Linhas */}
            {transaction.products.length > 0
              ? transaction.products.map((product) => (
                <div key={product.id} className="grid grid-cols-12 items-center px-4 py-4 border-t border-neutral-100">
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    {/* placeholder de imagem */}
                    {product.logo
                      ? (
                        <Image src={product.logo} alt={product.name} width={32} height={32} className="rounded-md object-cover w-8 h-10" />
                        )
                      : (
                        <div className="w-8 h-10 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                          <span className="text-[10px] text-neutral-500">Img</span>
                        </div>
                        )}
                    <span className="text-neutral-1000 truncate" title={product.name}>{product.name}</span>
                  </div>
                  <div className="col-span-2 text-neutral-1000">-</div>
                  <div className="col-span-2 text-neutral-1000">1</div>
                  <div className="col-span-2 text-neutral-1000">{formatCurrency(transaction.transaction.amount / 100)}</div>
                  <div className="col-span-1 text-neutral-1000 text-right">{formatCurrency(transaction.transaction.amount / 100)}</div>
                </div>
                ))
              : (
                <div className="px-4 py-8 border-t border-neutral-100 text-center text-neutral-500">
                  Nenhum produto encontrado
                </div>
                )}

            {/* Rodapé: pagamento e subtotal */}
            <div className="px-4 py-4 border-t border-neutral-100">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3 text-neutral-600">
                  <span>Método de pagamento:</span>
                  <span className="inline-flex items-center gap-2 text-neutral-800">
                    {cardInfo && transaction.paymentMethod?.iconUrl && (
                      <>
                        <Image src={transaction.paymentMethod.iconUrl} alt={transaction.paymentMethod.name} width={32} height={20} className="rounded-full" />
                        <span className="text-sm font-medium text-neutral-1000">
                          ••••{cardInfo.lastFour}
                        </span>
                      </>
                    )}
                    {!cardInfo && (
                      <span className="text-sm font-medium text-neutral-1000 capitalize">
                        {transaction.paymentMethod?.name || transaction.transaction.paymentMethod}
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 text-neutral-1000">
                  <span className="text-neutral-600">Subtotal:</span>
                  <span className="font-semibold text-base">{formatCurrency(transaction.transaction.amount / 100)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards: Taxas e UTM */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-neutral-200 rounded-lg p-5">
            <h3 className="text-neutral-950 font-araboto text-lg font-medium mb-4">Taxas</h3>
            <dl className="grid grid-cols-2 gap-y-3 text-base">
              <dt className="text-neutral-500">Valor bruto:</dt>
              <dd className="text-neutral-1000 font-medium break-all text-right">
                {formatCurrency(transaction.transaction.amount / 100)}
              </dd>

              <dt className="text-neutral-500">Taxa de processamento:</dt>
              <dd className="text-neutral-1000 font-medium break-all text-right">
                4.9% + R$ 2,00
              </dd>

              <dt className="text-neutral-500">Taxa aplicada:</dt>
              <dd className="text-neutral-1000 font-medium break-all text-right">
                {formatCurrency(transaction.transaction.fee / 100)}
              </dd>

              <dt className="text-neutral-500">Valor líquido:</dt>
              <dd className="text-neutral-1000 font-medium break-all text-right">
                {formatCurrency(transaction.transaction.netAmount / 100)}
              </dd>
            </dl>
          </div>

          <div className="bg-white border border-neutral-200 rounded-lg p-5">
            <h3 className="text-neutral-950 font-araboto text-lg font-medium mb-4">UTM e Tracking</h3>
            {transaction.transactionUTM
              ? (
                <dl className="grid grid-cols-2 gap-y-3 text-base">
                  <dt className="text-neutral-500">utmSource:</dt>
                  <dd className="text-neutral-1000 font-medium break-all text-right">
                    {transaction.transactionUTM.utmSource || 'N/A'}
                  </dd>

                  <dt className="text-neutral-500">utmCampaign:</dt>
                  <dd className="text-neutral-1000 font-medium break-all text-right">
                    {transaction.transactionUTM.utmCampaign || 'N/A'}
                  </dd>

                  <dt className="text-neutral-500">utmMedium:</dt>
                  <dd className="text-neutral-1000 font-medium break-all text-right">
                    {transaction.transactionUTM.utmMedium || 'N/A'}
                  </dd>

                  <dt className="text-neutral-500">utmTerm:</dt>
                  <dd className="text-neutral-1000 font-medium break-all text-right">
                    {transaction.transactionUTM.utmTerm || 'N/A'}
                  </dd>

                  <dt className="text-neutral-500">src:</dt>
                  <dd className="text-neutral-1000 font-medium break-all text-right">
                    {transaction.transactionUTM.src || 'N/A'}
                  </dd>

                  <dt className="text-neutral-500">sck:</dt>
                  <dd className="text-neutral-1000 font-medium break-all text-right">
                    {transaction.transactionUTM.sck || 'N/A'}
                  </dd>
                </dl>
                )
              : (
                <EmptyState
                  size="sm"
                  title="Nenhum dado de tracking UTM disponível"
                  description="Não há dados de tracking UTM disponíveis para esta transação."
                  icon={<InfoIcon size={24} weight="bold" className="text-zhex-base-500" />}
                />
                )}
          </div>
        </div>
      </div>
    </Container>
  )
}
