export interface PaymentMethod {
  id: string
  name: string
  description?: string
  iconUrl?: string
  properties?: string
  code: string
  type: string
  acquirer: string
  isActive: boolean
  supportedRegions: string[]
  currencies: string[]
  minAmount?: number
  maxAmount?: number
  processingFeePercentage?: number
  processingFeeFixed?: number
  requiresConfirmation: boolean
  supportRecurring: boolean
  supportInstallments: boolean
  maxInstallments?: number
  createdAt: string
  updatedAt: string
}

export interface ProductPaymentMethod {
  id: string
  productId: string
  paymentMethodId: string
  isEnabled: boolean
  priority: number
  paymentMethod: PaymentMethod
}
