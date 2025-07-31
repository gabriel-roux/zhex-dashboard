export interface Currency {
  code: string
  symbol: string
  name: string
  locale: string
  decimalSeparator: string
  thousandsSeparator: string
}

export const currencies: Currency[] = [
  {
    code: 'BRL',
    symbol: 'R$',
    name: 'Real Brasileiro',
    locale: 'pt-BR',
    decimalSeparator: ',',
    thousandsSeparator: '.',
  },
  {
    code: 'USD',
    symbol: '$',
    name: 'Dólar Americano',
    locale: 'en-US',
    decimalSeparator: '.',
    thousandsSeparator: ',',
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'de-DE',
    decimalSeparator: ',',
    thousandsSeparator: '.',
  },
  {
    code: 'GBP',
    symbol: '£',
    name: 'Libra Esterlina',
    locale: 'en-GB',
    decimalSeparator: '.',
    thousandsSeparator: ',',
  },
  {
    code: 'CAD',
    symbol: 'C$',
    name: 'Dólar Canadense',
    locale: 'en-CA',
    decimalSeparator: '.',
    thousandsSeparator: ',',
  },
  {
    code: 'AUD',
    symbol: 'A$',
    name: 'Dólar Australiano',
    locale: 'en-AU',
    decimalSeparator: '.',
    thousandsSeparator: ',',
  },
  {
    code: 'JPY',
    symbol: '¥',
    name: 'Iene Japonês',
    locale: 'ja-JP',
    decimalSeparator: '.',
    thousandsSeparator: ',',
  },
  {
    code: 'CHF',
    symbol: 'CHF',
    name: 'Franco Suíço',
    locale: 'de-CH',
    decimalSeparator: '.',
    thousandsSeparator: "'",
  },
  {
    code: 'CNY',
    symbol: '¥',
    name: 'Yuan Chinês',
    locale: 'zh-CN',
    decimalSeparator: '.',
    thousandsSeparator: ',',
  },
  {
    code: 'INR',
    symbol: '₹',
    name: 'Rúpia Indiana',
    locale: 'en-IN',
    decimalSeparator: '.',
    thousandsSeparator: ',',
  },
]

export function getCurrencyByCode(code: string): Currency | undefined {
  return currencies.find(currency => currency.code === code)
}

export function getDefaultCurrency(): Currency {
  return currencies[0] // BRL
}
