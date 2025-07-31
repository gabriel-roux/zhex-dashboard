import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApi } from './useApi'

export interface ProductPriceData {
  id: string
  productId: string
  baseAmount: number
  baseCurrency: string
  enabledCurrencies: string[]
  paymentDescription: string
}

export interface ProductPriceFormData {
  baseAmount: number // String para o campo de preço
  baseCurrency: string
  enabledCurrencies: string[]
  paymentDescription: string
}

const productPriceSchema = z.object({
  baseAmount: z.number().min(1, 'Preço obrigatório'),
  baseCurrency: z.string().min(1, 'Moeda base obrigatória'),
  enabledCurrencies: z.array(z.string()).min(1, 'Selecione pelo menos uma moeda'),
  paymentDescription: z.string().min(1, 'Descrição de pagamento obrigatória'),
})

export function useProductPriceForm(productId: string) {
  const [loading, setLoading] = useState(false)
  const [priceData, setPriceData] = useState<ProductPriceData | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const { get, put } = useApi()

  const form = useForm<ProductPriceFormData>({
    resolver: zodResolver(productPriceSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      baseAmount: 0,
      baseCurrency: 'USD',
      enabledCurrencies: ['USD', 'BRL', 'EUR'],
      paymentDescription: '',
    },
  })

  const fetchProductPrice = async () => {
    try {
      setInitialLoading(true)

      console.log('fetching product price', productId)

      const response = await get<{ success: boolean; data: ProductPriceData }>(`/products/${productId}/price`)

      console.log(response.data)

      if (response.data.success) {
        const data = response.data.data
        setPriceData(data)

        // Converter centavos para reais e atualizar formulário
        const amountInReais = (data.baseAmount / 100).toFixed(2)
        form.reset({
          baseAmount: Number(amountInReais),
          baseCurrency: data.baseCurrency,
          enabledCurrencies: data.enabledCurrencies,
          paymentDescription: data.paymentDescription,
        })
      }
    } catch (error) {
      console.error('Erro ao carregar preço do produto:', error)
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSubmit = async (data: ProductPriceFormData) => {
    setLoading(true)
    try {
      // Converter reais para centavos
      const amountInCents = Math.round(data.baseAmount * 100)

      // Garantir que a moeda base sempre esteja nas moedas habilitadas
      const enabledCurrenciesWithBase = data.enabledCurrencies.includes(data.baseCurrency)
        ? data.enabledCurrencies
        : [...data.enabledCurrencies, data.baseCurrency]

      const response = await put<{ success: boolean; data: ProductPriceData; message: string }>(`/products/${productId}/price`, {
        baseAmount: amountInCents,
        baseCurrency: data.baseCurrency,
        enabledCurrencies: enabledCurrenciesWithBase,
        paymentDescription: data.paymentDescription,
      })

      if (response.data.success) {
        setPriceData(response.data.data)
        return { success: true, message: response.data.message }
      } else {
        throw new Error(response.data.message || 'Erro ao atualizar preço')
      }
    } catch (error) {
      console.error('Erro ao atualizar preço:', error)
      return {
        success: false,
        message: error instanceof Error
          ? error.message
          : 'Erro ao atualizar preço',
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    loading,
    initialLoading,
    priceData,
    handleSubmit,
    fetchProductPrice,
  }
}
