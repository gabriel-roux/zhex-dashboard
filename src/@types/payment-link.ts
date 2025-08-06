export interface PaymentLink {
  id: string
  name: string
  checkout: {
    id: string
    name: string
  }
  price: {
    id: string
    baseAmount: number
    baseCurrency: string
    enabledCurrencies: string[]
  }
  subscription: {
    id: string
    name: string
    billingInterval: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'
    billingIntervalCount: number
    trialEnabled: boolean
    trialPeriodDays: number
    isActive: boolean
  }
  isFreeOffer: boolean
  usePriceFromProduct: boolean
  isActive: boolean
  accessUrl: string
}
