/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApi } from './useApi'
import Cookies from 'js-cookie'

// Schema de validação
const checkoutLayoutSchema = z.object({
  name: z.string().min(1, 'Nome do checkout é obrigatório'),
  title: z.string().min(1, 'Título do checkout é obrigatório'),
  faviconUrl: z.string().nullable().optional(),
  requireEmailConfirmation: z.boolean(),
  requireDocument: z.boolean(),
  requireAddress: z.boolean(),
  requireCoupon: z.boolean(),
  enableBanner: z.boolean(),
  bannerLayout: z.enum(['LAYOUT_1', 'LAYOUT_2', 'LAYOUT_3']),
  mainBannerUrl: z.string().nullable().optional(),
  sideBannerUrl: z.string().nullable().optional(),
  cardColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  secondaryCardColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  placeholderColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  chipColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  selectColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  securityCodeColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),

  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  backgroundImageUrl: z.string().nullable().optional(),

  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),

  boxColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  boxBorderColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),

  primaryTextColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  secondaryTextColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),

  inputColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  inputBorderColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
})

export type CheckoutLayoutFormData = z.infer<typeof checkoutLayoutSchema>

export function useCheckoutLayoutForm(productId?: string, checkoutId?: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedBannerLayout, setSelectedBannerLayout] = useState<'LAYOUT_1' | 'LAYOUT_2' | 'LAYOUT_3'>('LAYOUT_1')
  const [selectedFiles, setSelectedFiles] = useState<Map<string, File>>(new Map())
  const api = useApi()

  // Função para upload de imagens
  const uploadImage = async (
    imageType: 'favicon' | 'mainBanner' | 'sideBanner' | 'background',
    file: File,
  ): Promise<string | null> => {
    if (!productId || !checkoutId) {
      setError('IDs não encontrados')
      return null
    }
    try {
      const token = Cookies.get('user-token')

      const formData = new FormData()
      formData.append('file', file)
      formData.append('imageType', imageType)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/checkouts/${checkoutId}/upload-image`,
        {
          method: 'POST',
          credentials: 'include', // se precisar de cookie de auth
          headers: {
            Authorization: `Bearer ${token}`,
            // NÃO defina Content-Type, o browser faz isso automaticamente para FormData!
            // 'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      )

      const data = await res.json()
      if (data.success && data.imageUrl) {
        return data.imageUrl
      } else {
        setError(data.message || 'Erro ao fazer upload da imagem')
        return null
      }
    } catch {
      setError('Erro ao fazer upload da imagem')
      return null
    }
  }

  const form = useForm<CheckoutLayoutFormData>({
    resolver: zodResolver(checkoutLayoutSchema), // Temporariamente desabilitado para teste
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      title: '',
      requireEmailConfirmation: true,
      requireDocument: true,
      requireAddress: true,
      requireCoupon: true,
      enableBanner: true,
      bannerLayout: 'LAYOUT_1',
      mainBannerUrl: '',
      sideBannerUrl: '',
      cardColor: '#FFFFFF',
      secondaryCardColor: '#F5F5F5',
      placeholderColor: '#9394A9',
      chipColor: '#EAE9F0',
      selectColor: '#F4F6F9',
      securityCodeColor: '#DDDEE7',
      backgroundColor: '#FFFFFF',
      backgroundImageUrl: '',
      primaryColor: '#5C7DFA',
      boxColor: '#FFFFFF',
      boxBorderColor: '#DDDEE7',
      primaryTextColor: '#27283A',
      secondaryTextColor: '#9394A9',
      inputColor: '#FFFFFF',
      inputBorderColor: '#DDDEE7',
    },
  })

  const handleBannerLayoutChange = (layout: 'LAYOUT_1' | 'LAYOUT_2' | 'LAYOUT_3') => {
    setSelectedBannerLayout(layout)
    form.setValue('bannerLayout', layout)
  }

  // Função para capturar arquivo selecionado
  const handleFileSelect = (imageType: 'favicon' | 'mainBanner' | 'sideBanner' | 'background', file: File) => {
    setSelectedFiles(prev => new Map(prev).set(imageType, file))
  }

  // Carregar dados do layout quando o componente montar
  useEffect(() => {
    if (productId && checkoutId) {
      loadLayoutData()
    }
  }, [productId, checkoutId])

  const loadLayoutData = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/products/${productId}/checkouts/${checkoutId}/layout`)

      if ((response.data as any)?.success && (response.data as any)?.data) {
        const layoutData = (response.data as any).data
        form.reset(layoutData)
        setSelectedBannerLayout(layoutData.bannerLayout || 'LAYOUT_1')
      }
    } catch (error) {
      console.error('Erro ao carregar dados do layout:', error)
      setError('Erro ao carregar dados do layout')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: CheckoutLayoutFormData) => {
    if (!productId || !checkoutId) {
      return { success: false, message: 'ID do produto ou checkout não encontrado' }
    }

    setLoading(true)
    try {
      // Processar uploads de imagens se necessário
      const processedData = { ...data }

      // Fazer upload das imagens selecionadas
      const imageTypeMap = {
        faviconUrl: 'favicon' as const,
        mainBannerUrl: 'mainBanner' as const,
        sideBannerUrl: 'sideBanner' as const,
        backgroundImageUrl: 'background' as const,
      }

      for (const [field, imageType] of Object.entries(imageTypeMap)) {
        const file = selectedFiles.get(imageType)
        if (file) {
          const imageUrl = await uploadImage(imageType, file)
          if (imageUrl) {
            ;(processedData as any)[field] = imageUrl
          } else {
            return { success: false, message: `Erro ao fazer upload da imagem ${imageType}` }
          }
        }
      }

      const response = await api.put(`/products/${productId}/checkouts/${checkoutId}/layout`, processedData)

      if ((response.data as any)?.success) {
        setError(null)
        return { success: true, message: 'Layout atualizado com sucesso' }
      } else {
        setError((response.data as any)?.error || 'Erro ao atualizar layout')
        return { success: false, message: (response.data as any)?.error || 'Erro ao atualizar layout' }
      }
    } catch (error) {
      console.error('Erro ao atualizar layout:', error)
      setError('Erro ao atualizar layout')
      return {
        success: false,
        message: error instanceof Error
          ? error.message
          : 'Erro ao atualizar layout',
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    loading,
    error,
    selectedBannerLayout,
    handleBannerLayoutChange,
    handleFileSelect,
    handleSubmit,
  }
}
