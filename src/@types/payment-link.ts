export interface PaymentLink {
  id: string
  name: string
  checkout: {
    id: string
    name: string
  }
  price: {
    baseAmount: number
    baseCurrency: string
    enabledCurrencies: string[]
  }
  isActive: boolean
  accessUrl: string
}
