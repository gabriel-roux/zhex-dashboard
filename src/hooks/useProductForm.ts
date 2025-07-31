import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProductProps, ProductImage, ProductClass, ProductType } from '@/@types/product'
import Cookies from 'js-cookie'

// Apenas campos principais do produto
export interface ProductFormData {
  name: string
  description: string
  type: ProductClass
  category: string
  landingPage: string
  language: string
  guarantee: string
  payment?: ProductType
  supportName?: string
  supportEmail?: string
  supportPhone?: string
  newImages?: File[] // Apenas novas imagens
  existingImageIds?: string[] // IDs das imagens existentes que devem ser mantidas
  removedImageIds?: string[] // IDs das imagens existentes que devem ser removidas
}

const productSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  description: z.string().min(1, 'Descrição obrigatória'),
  type: z.enum(ProductClass),
  category: z.string().min(1, 'Categoria obrigatória'),
  landingPage: z.url('URL inválida'),
  language: z.string().min(1, 'Idioma obrigatório'),
  guarantee: z.string().min(1, 'Garantia obrigatória'),
  payment: z.enum(ProductType).optional(),
  supportName: z.string().optional(),
  supportEmail: z.string().optional(),
  supportPhone: z.string().optional(),
  newImages: z.array(z.instanceof(File)).max(4, 'Máximo 4 imagens permitidas').optional().default([]),
  existingImageIds: z.array(z.string()).optional().default([]),
  removedImageIds: z.array(z.string()).optional().default([]),
})

export function useProductForm(product: ProductProps | null, productId: string, removedImageIds: string[] = []) {
  const [loading, setLoading] = useState(false)
  const [existingImages, setExistingImages] = useState<ProductImage[]>([])
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      type: product?.productClass || ProductClass.PHYSICAL,
      category: product?.category || '',
      landingPage: product?.landingPage || '',
      language: product?.language || '',
      guarantee: product?.guarantee || '',
      payment: product?.type,
      supportName: product?.supportName || '',
      supportEmail: product?.supportEmail || '',
      supportPhone: product?.supportPhone || '',
      newImages: [],
      existingImageIds: [],
      removedImageIds: [],
    },
  })

  // Carregar imagens existentes quando o produto for carregado
  useEffect(() => {
    if (product?.images) {
      setExistingImages(product.images)
    }
  }, [product])

  const handleSubmit = async (data: ProductFormData) => {
    setLoading(true)
    try {
      // Preparar FormData
      const formData = new FormData()

      // Campos do produto
      formData.append('name', data.name)
      formData.append('description', data.description)
      formData.append('type', data.type)
      formData.append('category', data.category)
      formData.append('landingPage', data.landingPage)
      formData.append('language', data.language)
      formData.append('guarantee', data.guarantee)
      if (data.payment) formData.append('payment', data.payment)
      if (data.supportName) formData.append('supportName', data.supportName)
      if (data.supportEmail) formData.append('supportEmail', data.supportEmail)
      if (data.supportPhone) formData.append('supportPhone', data.supportPhone)

      // Sempre adicionar pelo menos um campo para garantir que o FormData não seja vazio
      formData.append('hasData', 'true')

      // Novas imagens - usar campo 'file' para compatibilidade com middleware global
      if (data.newImages && data.newImages.length > 0) {
        data.newImages.forEach((file: File) => {
          formData.append('file', file)
        })
      }

      // IDs das imagens existentes e removidas
      const existingImageIds = existingImages.map(img => img.id)
      formData.append('existingImageIds', JSON.stringify(existingImageIds))

      // IDs das imagens removidas
      formData.append('removedImageIds', JSON.stringify(removedImageIds))

      // Debug: verificar FormData
      console.log('FormData contents:')
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value)
      }
      console.log('FormData size:', formData.get('hasData')
        ? 'Has data'
        : 'Empty')

      // Verificar se há imagens para decidir o formato
      const hasNewImages = data.newImages && data.newImages.length > 0

      let response: Response

      if (hasNewImages) {
        // Se há imagens, usar FormData
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${Cookies.get('user-token')}`,
          },
          body: formData,
        })

        if (!response.ok) {
          setError(response.statusText)
        }

        const result = await response.json()

        if (result.success) {
          setError(null)
        } else {
          setError(result.message)
        }
      } else {
        // Se não há imagens, usar JSON
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('user-token')}`,
          },
          body: JSON.stringify({
            name: data.name,
            description: data.description,
            type: data.type,
            category: data.category,
            landingPage: data.landingPage,
            language: data.language,
            guarantee: data.guarantee,
            payment: data.payment,
            supportName: data.supportName,
            supportEmail: data.supportEmail,
            supportPhone: data.supportPhone,
            existingImageIds: existingImages.map(img => img.id),
            removedImageIds,
          }),
        })
      }

      if (!response.ok) {
        throw new Error('Erro ao atualizar produto')
      }

      console.log('response')
      console.log(response)

      if (response.ok) {
        setError(null)
      } else {
        setError(response.statusText)
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
      // TODO: Mostrar toast de erro
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    error,
    loading,
    existingImages,
    setExistingImages,
    handleSubmit,
  }
}
