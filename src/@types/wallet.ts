export interface WalletBalance {
  id: string
  companyId: string
  currency: string
  availableBalance: number
  processingBalance: number
  reservedBalance: number
  totalBalance: number
  availableBalanceInCurrency: number
  processingBalanceInCurrency: number
  reservedBalanceInCurrency: number
  totalBalanceInCurrency: number
  availableBalanceInReais: number
  processingBalanceInReais: number
  reservedBalanceInReais: number
  totalBalanceInReais: number
  autoWithdrawalEnabled: boolean
  withdrawalThreshold?: number
}

export interface Withdrawal {
  id: string
  walletId: string
  amount: number
  amountInCurrency: number
  amountInReais: number
  status: string
  statusDescription: string
  method: string
  methodDescription: string
  bankAccountId?: string
  processingFee: number
  processingFeeInCurrency: number
  processingFeeInReais: number
  netAmount: number
  netAmountInCurrency: number
  netAmountInReais: number
  feePercentage: number
  processedAt?: string
  settledAt?: string
  failedAt?: string
  createdAt: string
  bankAccount?: {
    id: string
    bankName: string
    bankCode: string
    agency: string
    account: string
    accountType: string
  }
}

export interface WithdrawalsList {
  withdrawals: Withdrawal[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface CreateWithdrawalData {
  amount: number
  method: 'BANK_TRANSFER' | 'PIX'
  bankAccountId?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export type WalletBalanceResponse = ApiResponse<WalletBalance>
export type CreateWithdrawalResponse = ApiResponse<Withdrawal>
export type ListWithdrawalsResponse = ApiResponse<WithdrawalsList>
export type GetWithdrawalResponse = ApiResponse<Withdrawal>
