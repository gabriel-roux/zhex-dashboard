/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApi } from './useApi'

// Schema para um order bump individual
const orderBumpSchema = z.object({
  id: z.string(),
  product: z.string().min(1, 'Produto é obrigatório'),
  paymentLink: z.string().min(1, 'Link de pagamento é obrigatório'),
  priceFrom: z.number().optional(),
  priceTo: z.number().optional(),
  currency: z.string().optional(),
  offer: z.string().min(1, 'Oferta é obrigatória'),
  description: z.string().min(1, 'Descrição é obrigatória'),
})

// Schema de validação
const offersSchema = z.object({
  enableTimer: z.boolean(),
  days: z.string().optional(),
  hours: z.string().optional(),
  minutes: z.string().optional(),
  seconds: z.string().optional(),

  offerText: z.string().min(1, 'Texto da oferta é obrigatório'),
  timerBackgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  timerTextColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  timerCountdownColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  timerCountdownBorderColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  timerCountdownTextColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),

  enableOrderBumps: z.boolean(),
  orderBumps: z.array(orderBumpSchema),
  titleColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  orderBumpTextColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  orderBumpCardColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  orderBumpBorderColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  orderBumpFakePriceColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  orderBumpPriceColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
})

export type OffersFormData = z.infer<typeof offersSchema>
export type OrderBump = z.infer<typeof orderBumpSchema>

export function useCheckoutOffersForm(productId?: string, checkoutId?: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const api = useApi()

  const form = useForm<OffersFormData>({
    resolver: zodResolver(offersSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      enableTimer: false,
      days: '02',
      hours: '14',
      minutes: '36',
      seconds: '59',
      offerText: 'Oferta por tempo limitado! Não perca essa oportunidade única.',
      timerBackgroundColor: '#FFFFFF',
      timerTextColor: '#27283A',
      timerCountdownColor: '#161616',
      timerCountdownBorderColor: '#5C7DFA',
      timerCountdownTextColor: '#FFFFFF',
      enableOrderBumps: false,
      orderBumps: [],
      titleColor: '#27283A',
      orderBumpTextColor: '#9394A9',
      orderBumpCardColor: '#F5F5F5',
      orderBumpBorderColor: '#5C7DFA',
      orderBumpFakePriceColor: '#9394A9',
      orderBumpPriceColor: '#27283A',
    },
  })

  // Função para adicionar um novo order bump
  const addOrderBump = () => {
    const currentOrderBumps = form.getValues('orderBumps')
    const newOrderBump: OrderBump = {
      id: `order-bump-${Date.now()}`,
      product: '',
      paymentLink: '',
      priceFrom: 0,
      priceTo: 0,
      currency: 'BRL',
      offer: '',
      description: '',
    }
    form.setValue('orderBumps', [...currentOrderBumps, newOrderBump])
  }

  // Função para remover um order bump
  const removeOrderBump = (id: string) => {
    const currentOrderBumps = form.getValues('orderBumps')
    const filteredOrderBumps = currentOrderBumps.filter(bump => bump.id !== id)
    form.setValue('orderBumps', filteredOrderBumps)
  }

  // Função para atualizar um order bump
  const updateOrderBump = (id: string, field: keyof OrderBump, value: string | number) => {
    const currentOrderBumps = form.getValues('orderBumps')
    const updatedOrderBumps = currentOrderBumps.map(bump =>
      bump.id === id
        ? { ...bump, [field]: value }
        : bump,
    )
    form.setValue('orderBumps', updatedOrderBumps)
  }

  // Carregar dados das ofertas quando o componente montar
  useEffect(() => {
    if (productId && checkoutId) {
      loadOffersData()
    }
  }, [productId, checkoutId])

  const loadOffersData = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/products/${productId}/checkouts/${checkoutId}/offers`)

      if ((response.data as any)?.success && (response.data as any)?.data) {
        const offersData = (response.data as any).data

        const formData = {
          enableTimer: offersData.timerEnabled,
          days: offersData.timerDays?.toString().padStart(2, '0') || '02',
          hours: offersData.timerHours?.toString().padStart(2, '0') || '14',
          minutes: offersData.timerMinutes?.toString().padStart(2, '0') || '36',
          seconds: offersData.timerSeconds?.toString().padStart(2, '0') || '59',
          offerText: offersData.offerText || '',
          timerBackgroundColor: offersData.timerBackground || '#FFFFFF',
          timerTextColor: offersData.timerTextColor || '#27283A',
          timerCountdownColor: offersData.timerCountdownColor || '#161616',
          timerCountdownBorderColor: offersData.timerCountdownBorderColor || '#5C7DFA',
          timerCountdownTextColor: offersData.timerCountdownTextColor || '#FFFFFF',
          enableOrderBumps: offersData.orderBumpsEnabled,
          orderBumps: offersData.orderBumps || [],
          titleColor: offersData.titleColor || '#27283A',
          orderBumpTextColor: offersData.orderBumpTextColor || '#9394A9',
          orderBumpCardColor: offersData.orderBumpCardColor || '#F5F5F5',
          orderBumpBorderColor: offersData.orderBumpBorderColor || '#5C7DFA',
          orderBumpFakePriceColor: offersData.orderBumpFakePriceColor || '#9394A9',
          orderBumpPriceColor: offersData.orderBumpPriceColor || '#27283A',
        }

        form.reset(formData)
      }
    } catch (error) {
      console.error('Erro ao carregar dados das ofertas:', error)
      setError('Erro ao carregar dados das ofertas')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: OffersFormData) => {
    if (!productId || !checkoutId) {
      return { success: false, message: 'ID do produto ou checkout não encontrado' }
    }

    setLoading(true)
    try {
      const payload = {
        timerEnabled: data.enableTimer,
        timerDays: parseInt(data.days || '0'),
        timerHours: parseInt(data.hours || '0'),
        timerMinutes: parseInt(data.minutes || '0'),
        timerSeconds: parseInt(data.seconds || '0'),
        offerText: data.offerText,
        timerBackground: data.timerBackgroundColor,
        timerTextColor: data.timerTextColor,
        timerCountdownColor: data.timerCountdownColor,
        timerCountdownBorderColor: data.timerCountdownBorderColor,
        timerCountdownTextColor: data.timerCountdownTextColor,
        orderBumpsEnabled: data.enableOrderBumps,
        orderBumps: data.orderBumps,
        titleColor: data.titleColor,
        orderBumpTextColor: data.orderBumpTextColor,
        orderBumpCardColor: data.orderBumpCardColor,
        orderBumpBorderColor: data.orderBumpBorderColor,
        orderBumpFakePriceColor: data.orderBumpFakePriceColor,
        orderBumpPriceColor: data.orderBumpPriceColor,
      }

      const response = await api.put(`/products/${productId}/checkouts/${checkoutId}/offers`, payload)

      if ((response.data as any)?.success) {
        setError(null)
        return { success: true, message: 'Ofertas atualizadas com sucesso' }
      } else {
        setError((response.data as any)?.error || 'Erro ao atualizar ofertas')
        return { success: false, message: (response.data as any)?.error || 'Erro ao atualizar ofertas' }
      }
    } catch (error) {
      console.error('Erro ao atualizar ofertas:', error)
      setError('Erro ao atualizar ofertas')
      return {
        success: false,
        message: error instanceof Error
          ? error.message
          : 'Erro ao atualizar ofertas',
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    loading,
    error,
    handleSubmit,
    addOrderBump,
    removeOrderBump,
    updateOrderBump,
  }
}
