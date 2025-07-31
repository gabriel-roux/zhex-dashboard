export interface Subscription {
  id: string
  name: string
  billingInterval: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'
  billingIntervalCount: number
  trialEnabled: boolean
  trialPeriodDays?: number
  isActive: boolean
  price: {
    id: string
    baseAmount: number
    baseCurrency: string
    enabledCurrencies: string[]
    paymentDescription: string
  }
  paymentLinksCount: number
  createdAt: string
  updatedAt: string
}

export interface SubscriptionLink {
  id: string
  subscriptionId: string
  paymentLinkId: string
  createdAt: string
  updatedAt: string
}
