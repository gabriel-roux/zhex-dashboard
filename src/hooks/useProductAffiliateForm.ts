import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApi } from './useApi'

export interface AffiliateProgramData {
  id: string
  productId: string
  commissionType: 'PERCENTAGE'
  commissionValue: number
  isActive: boolean
  autoApproveAffiliates: boolean
  enableExtendedCommission: boolean
  shareBuyerDataWithAffiliate: boolean
  commissionValidityPeriod?: string
  supportName?: string
  supportEmail?: string
  supportPhone?: string
  supportUrl?: string
  affiliationRules?: string
  paymentLinksCount: number
  createdAt: string
  updatedAt: string
}

export interface AffiliateFormData {
  isActive: boolean
  autoApproveAffiliates: boolean
  enableExtendedCommission: boolean
  shareBuyerDataWithAffiliate: boolean
  commissionValue: number // Percentual
  commissionValidityPeriod: string
  supportName: string
  supportEmail: string
  supportPhone: string
  supportUrl: string
  affiliationRules: string
  paymentLinkIds: string[]
}

const affiliateSchema = z.object({
  isActive: z.boolean(),
  autoApproveAffiliates: z.boolean(),
  enableExtendedCommission: z.boolean(),
  shareBuyerDataWithAffiliate: z.boolean(),
  commissionValue: z.number().min(1, 'Comissão deve ser maior ou igual a 1').max(100, 'Comissão deve ser menor ou igual a 100%'),
  commissionValidityPeriod: z.string().min(1, 'Período de validade é obrigatório'),
  supportName: z.string('Nome do suporte é obrigatório'),
  supportEmail: z.email('E-mail inválido'),
  supportPhone: z.string(),
  supportUrl: z.url('URL inválida'),
  affiliationRules: z.string().min(1, 'Regras de afiliação são obrigatórias').max(1000, 'Regras de afiliação devem ter no máximo 1000 caracteres'),
  paymentLinkIds: z.array(z.string()).min(1, 'Pelo menos um payment link é obrigatório'),
})

export function useProductAffiliateForm(productId: string) {
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [affiliateData, setAffiliateData] = useState<AffiliateProgramData | null>(null)
  const [paymentLinks, setPaymentLinks] = useState<Array<{ id: string; name: string; price: { baseAmount: number } }>>([])
  const { get, post, put } = useApi()

  const form = useForm<AffiliateFormData>({
    resolver: zodResolver(affiliateSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      isActive: false,
      autoApproveAffiliates: false,
      enableExtendedCommission: false,
      shareBuyerDataWithAffiliate: false,
      commissionValue: 0,
      commissionValidityPeriod: '',
      supportName: '',
      supportEmail: '',
      supportPhone: '',
      supportUrl: '',
      affiliationRules: '',
      paymentLinkIds: [],
    },
  })

  const fetchAffiliateProgram = async () => {
    try {
      setInitialLoading(true)
      const response = await get<{ success: boolean; data: AffiliateProgramData | null }>(`/products/${productId}/affiliate-program`)

      if (response.data.success && response.data.data) {
        const data = response.data.data
        setAffiliateData(data)

        // Atualizar formulário com dados existentes
        form.reset({
          isActive: data.isActive,
          autoApproveAffiliates: data.autoApproveAffiliates,
          enableExtendedCommission: data.enableExtendedCommission,
          shareBuyerDataWithAffiliate: data.shareBuyerDataWithAffiliate,
          commissionValue: data.commissionValue,
          commissionValidityPeriod: data.commissionValidityPeriod || '',
          supportName: data.supportName || '',
          supportEmail: data.supportEmail || '',
          supportPhone: data.supportPhone || '',
          supportUrl: data.supportUrl || '',
          affiliationRules: data.affiliationRules || '',
          paymentLinkIds: [], // Será preenchido separadamente
        })

        // Buscar payment links vinculados
        await fetchAffiliatePaymentLinks()
      }
    } catch (error) {
      console.error('Erro ao carregar programa de afiliados:', error)
    } finally {
      setInitialLoading(false)
    }
  }

  const fetchPaymentLinks = async () => {
    try {
      const response = await get<{ success: boolean; data: { paymentLinks: Array<{ id: string; name: string; price: { baseAmount: number } }> } }>(`/products/${productId}/payment-links`)

      if (response.data.success) {
        setPaymentLinks(response.data.data.paymentLinks)
      }
    } catch (error) {
      console.error('Erro ao carregar payment links:', error)
    }
  }

  const fetchAffiliatePaymentLinks = async () => {
    try {
      const response = await get<{ success: boolean; data: { affiliateLinks: Array<{ paymentLinkId: string }> } }>(`/products/${productId}/affiliate-program/payment-links`)

      if (response.data.success) {
        const linkedIds = response.data.data.affiliateLinks.map(link => link.paymentLinkId)
        form.setValue('paymentLinkIds', linkedIds)
      }
    } catch (error) {
      console.error('Erro ao carregar payment links do afiliado:', error)
    }
  }

  useEffect(() => {
    fetchAffiliateProgram()
    fetchPaymentLinks()
  }, [productId])

  const handleSubmit = async (data: AffiliateFormData) => {
    setLoading(true)
    try {
      let response

      if (affiliateData) {
        // Atualizar programa existente
        response = await put<{ success: boolean; data: AffiliateProgramData; message: string }>(`/products/${productId}/affiliate-program`, {
          isActive: data.isActive,
          autoApproveAffiliates: data.autoApproveAffiliates,
          enableExtendedCommission: data.enableExtendedCommission,
          shareBuyerDataWithAffiliate: data.shareBuyerDataWithAffiliate,
          commissionValue: data.commissionValue,
          commissionValidityPeriod: data.commissionValidityPeriod,
          supportName: data.supportName,
          supportEmail: data.supportEmail,
          supportPhone: data.supportPhone,
          supportUrl: data.supportUrl,
          affiliationRules: data.affiliationRules,
          paymentLinkIds: data.paymentLinkIds,
        })
      } else {
        // Criar novo programa
        response = await post<{ success: boolean; data: AffiliateProgramData; message: string }>(`/products/${productId}/affiliate-program`, {
          commissionType: 'PERCENTAGE' as const,
          commissionValue: data.commissionValue,
          isActive: data.isActive,
          autoApproveAffiliates: data.autoApproveAffiliates,
          enableExtendedCommission: data.enableExtendedCommission,
          shareBuyerDataWithAffiliate: data.shareBuyerDataWithAffiliate,
          commissionValidityPeriod: data.commissionValidityPeriod,
          supportName: data.supportName,
          supportEmail: data.supportEmail,
          supportPhone: data.supportPhone,
          supportUrl: data.supportUrl,
          affiliationRules: data.affiliationRules,
          paymentLinkIds: data.paymentLinkIds,
        })
      }

      if (response.data.success) {
        setAffiliateData(response.data.data)
        return { success: true, message: response.data.message }
      } else {
        throw new Error(response.data.message || 'Erro ao salvar programa de afiliados')
      }
    } catch (error) {
      console.error('Erro ao salvar programa de afiliados:', error)
      return {
        success: false,
        message: error instanceof Error
          ? error.message
          : 'Erro ao salvar programa de afiliados',
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    loading,
    initialLoading,
    affiliateData,
    paymentLinks,
    handleSubmit,
    fetchAffiliateProgram,
  }
}
