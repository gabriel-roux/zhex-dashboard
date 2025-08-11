/* eslint-disable no-unused-vars */
// Enums baseados nas entidades do backend
export enum TransactionProcessStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
}

export enum TransactionStatus {
  INITIALIZED = 'INITIALIZED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CHARGEBACK = 'CHARGEBACK',
  CHARGEBACK_ALERT = 'CHARGEBACK_ALERT',
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
  CANCELLED = 'CANCELLED',
}

export enum SubscriptionChargeType {
  INITIAL = 'INITIAL',
  RENEWAL = 'RENEWAL',
  RETRY = 'RETRY',
}

// Interface principal da transação (atualizada)
export interface Transaction {
  id: string
  companyId: string
  customerId?: string
  amount: number // em centavos
  currency: string
  provider?: string // Nome do provedor (opcional agora)
  providerId?: string // ID do acquirer (opcional agora)
  providerPaymentId?: string
  transactionProcessStatus: TransactionProcessStatus
  status: TransactionStatus
  paymentMethod?: string
  paymentMethodId?: string // ID do método de pagamento
  fee: number // em centavos
  netAmount: number // em centavos

  // Informações de cartão de crédito
  cardBrand?: string
  cardLastFour?: string
  cardExpiryMonth?: number
  cardExpiryYear?: number

  // Dados de assinatura (atualizados)
  subscriptionId?: string
  subscriptionChargeType?: SubscriptionChargeType
  retryAttempt: number

  processedAt?: string // ISO string
  settledAt?: string // ISO string
  failedAt?: string // ISO string
  createdAt: string // ISO string
  updatedAt: string // ISO string
}

// Interface para tracking de status de pagamento
export interface PaymentStatusTracking {
  id: string
  transactionId: string
  paidAt?: string // ISO string
  refusedAt?: string // ISO string
  refundedAt?: string // ISO string
  chargebackAt?: string // ISO string
  chargebackAlertAt?: string // ISO string
  sendRecuperationEmailAt?: string // ISO string
  createdAt: string // ISO string
  updatedAt: string // ISO string
}

// Interface para UTM de transação
export interface TransactionUTM {
  id: string
  transactionId: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  utmReferrer?: string
  utmLandingPage?: string
  src?: string
  sck?: string
  createdAt: string // ISO string
  updatedAt: string // ISO string
}

// Interface para customer com endereço completo
export interface TransactionCustomer {
  id: string
  name?: string
  email: string
  phone?: string
  address?: string
  state?: string
  neighborhood?: string
  zipcode?: string
  country?: string
}

// Interface para delivery/entrega
export interface TransactionDelivery {
  id: string
  status: string
  carrier?: string
  service?: string
  trackingCode?: string
  addressSnapshot?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
    [key: string]: string | number | boolean | null | undefined
  }
  shippedAt?: string // ISO string
  deliveredAt?: string // ISO string
  createdAt: string // ISO string
  updatedAt: string // ISO string
}

// Interface para método de pagamento
export interface PaymentMethodDetails {
  id: string
  name: string
  type: string
  iconUrl?: string
}

// Interface para detalhes completos da transação (resposta da API)
export interface TransactionDetails {
  transaction: Transaction;
  customer?: TransactionCustomer | null;
  products: Array<{ id: string; name: string; logo: string }>;
  paymentStatusTracking?: PaymentStatusTracking | null;
  transactionUTM?: TransactionUTM | null;
  delivery?: TransactionDelivery | null;
  paymentMethod?: PaymentMethodDetails | null;
  acquirer?: {
    id: string;
    name: string;
    code: string;
  } | null;
  subscription?: TransactionSubscription | null;
}

// Interface para transação com dados relacionados (uso geral)
export interface TransactionWithRelations extends Transaction {
  paymentStatusTracking?: PaymentStatusTracking
  utm?: TransactionUTM
  customer?: TransactionCustomer
  products?: Array<{
    id: string
    name: string
    price?: number
    quantity?: number
  }>
  delivery?: TransactionDelivery
  paymentMethodDetails?: PaymentMethodDetails
}

// Interface para listagem de transações (API response)
export interface TransactionsList {
  transactions: TransactionWithRelations[]
  pagination: {
    total: number
    limit: number
    page: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Interface para estatísticas de transações
export interface TransactionStats {
  totalTransactions: number
  totalAmount: number // em centavos
  totalNetAmount: number // em centavos
  totalFees: number // em centavos
  approvalRate: number // porcentagem
  averageTicket: number // em centavos
  byStatus: Record<TransactionStatus, number>
  byProcessStatus: Record<TransactionProcessStatus, number>
  byProvider: Record<string, number>
  byPaymentMethod: Record<string, number>
}

// Interface para resposta da API de transações
export interface TransactionApiResponse {
  success: boolean
  data?: TransactionsList | TransactionWithRelations | TransactionStats | TransactionDetails
  message?: string
  error?: string
}

// Interface específica para resposta de detalhes da transação
export interface TransactionDetailsApiResponse {
  success: boolean
  data?: TransactionDetails
  message?: string
  error?: string
}

// Tipos para componentes de UI
export type TransactionStatusFilter = 'Todos' | 'Aprovadas' | 'Rejeitadas' | 'Pendentes' | 'Processando'

export type TransactionStatusApi = 'COMPLETED' | 'FAILED' | 'PENDING' | 'PROCESSING'

// Interface para item de transação na tabela (otimizada para UI)
export interface TransactionTableItem {
  id: string
  code?: string
  productsSummary?: string
  customerName?: string
  customerEmail?: string
  status: TransactionStatusApi
  amountInCurrency: number // em reais, já formatável
  paymentDisplay?: string
  createdAt: string
  provider?: string
  providerId?: string // ID do acquirer
  fee?: number
  netAmount?: number
  // Subscription data (atualizado)
  isSubscription?: boolean
  subscriptionChargeType?: string
  // billingCycle e nextRenewalDate agora vêm de subscription
  retryAttempt?: number
}

// Interface para listagem otimizada para tabela
export interface TransactionTableList {
  transactions: TransactionTableItem[]
  pagination: {
    total: number
    limit: number
    page: number
  }
}

// Tipos úteis para formatação
export type PaymentMethodType = 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BANK_TRANSFER' | 'BOLETO'

// Interface para dados de cartão mascarados (para exibição)
export interface MaskedCardInfo {
  brand: string
  lastFour: string
  expiryMonth: number
  expiryYear: number
  displayName: string // Ex: "Visa ••••4242"
}

// Interface para endereço formatado
export interface FormattedAddress {
  full: string // Endereço completo em uma linha
  short: string // Versão resumida
  parts: {
    street?: string
    neighborhood?: string
    city?: string
    state?: string
    zipcode?: string
    country?: string
  }
}

// Interface para helpers de formatação da transação
export interface TransactionDisplayHelpers {
  formattedAmount: string // Ex: "R$ 297,00"
  formattedFee: string // Ex: "R$ 14,85"
  formattedNetAmount: string // Ex: "R$ 282,15"
  statusBadge: {
    text: string
    variant: 'success' | 'warning' | 'error' | 'info'
  }
  paymentInfo?: {
    method: string
    card?: MaskedCardInfo
  }
  customerAddress?: FormattedAddress
  deliveryStatus?: {
    text: string
    variant: 'success' | 'warning' | 'error' | 'info'
    trackingUrl?: string
  }
}

// Interface para dados de assinatura da transação
export interface TransactionSubscription {
  id: string;
  status: string;
  interval: string;
  intervalCount: number;
  nextBillingDate?: string | null;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  currentBillingCycle: number; // Campo obrigatório agora
  retryAttempt: number;
}
