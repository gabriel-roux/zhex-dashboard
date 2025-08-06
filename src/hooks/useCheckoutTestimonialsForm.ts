/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApi } from './useApi'
import Cookies from 'js-cookie'

// Schema de validação
const testimonialsSchema = z.object({
  enabled: z.boolean(),
  profileImage: z.string().optional(),
  starRating: z.enum(['1', '2', '3', '4', '5']),
  name: z.string().min(1, 'Nome é obrigatório'),
  socialNetwork: z.string().optional(),
  text: z.string().min(1, 'Texto é obrigatório'),
  nameColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  textColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  cardColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  borderColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  starsColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
})

export type TestimonialsFormData = z.infer<typeof testimonialsSchema>

export function useCheckoutTestimonialsForm(productId?: string, checkoutId?: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<Map<string, File>>(new Map())
  const api = useApi()

  const [testimonials, setTestimonials] = useState<{
    id: string;
    profileImage: string;
    starRating: string;
    name: string;
    socialNetwork: string;
    text: string;
    nameColor: string;
    textColor: string;
    cardColor: string;
    borderColor: string;
    starsColor: string;
    backgroundColor: string;
    order: number;
  }[]>([])

  const form = useForm<TestimonialsFormData>({
    resolver: zodResolver(testimonialsSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      enabled: false,
      starRating: '5',
      name: 'João Silva',
      socialNetwork: '@joaosilva',
      text: 'Produto incrível! Recomendo muito para todos que querem aprender sobre design.',
      nameColor: '#27283A',
      textColor: '#9394A9',
      cardColor: '#F5F5F5',
      borderColor: '#DDDEE7',
      starsColor: '#FDC41B',
      backgroundColor: '#FFFFFF',
    },
  })

  const addTestimonial = () => {
    const newTestimonial = {
      id: crypto.randomUUID(),
      profileImage: '',
      starRating: '5',
      name: '',
      socialNetwork: '',
      text: '',
      nameColor: '#27283A',
      textColor: '#9394A9',
      cardColor: '#F5F5F5',
      borderColor: '#DDDEE7',
      starsColor: '#FDC41B',
      backgroundColor: '#FFFFFF',
      order: testimonials.length,
    }
    setTestimonials([...testimonials, newTestimonial])
  }

  const removeTestimonial = (id: string) => {
    setTestimonials(testimonials.filter(t => t.id !== id))
  }

  const updateTestimonial = (id: string, field: string, value: string) => {
    setTestimonials(testimonials.map(t =>
      t.id === id
        ? { ...t, [field]: value }
        : t,
    ))
  }

  // Função para capturar arquivo selecionado
  const handleFileSelect = (testimonialId: string, file: File) => {
    setSelectedFiles(prev => new Map(prev).set(testimonialId, file))
  }

  // Carregar dados dos depoimentos quando o componente montar
  useEffect(() => {
    if (productId && checkoutId) {
      loadTestimonialsData()
    }
  }, [productId, checkoutId])

  const loadTestimonialsData = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/products/${productId}/checkouts/${checkoutId}/testimonials`)

      if ((response.data as any)?.success && (response.data as any)?.data) {
        const testimonialsData = (response.data as any).data

        // Atualizar o estado de depoimentos
        if (testimonialsData.testimonials && testimonialsData.testimonials.length > 0) {
          const mappedTestimonials = testimonialsData.testimonials.map((testimonial: any) => ({
            id: testimonial.id,
            profileImage: testimonial.profileImage || '',
            starRating: testimonial.starRating?.toString() || '5',
            name: testimonial.name || '',
            socialNetwork: testimonial.socialMedia || '',
            text: testimonial.text || '',
            nameColor: testimonial.nameColor || '#27283A',
            textColor: testimonial.textColor || '#9394A9',
            cardColor: testimonial.cardColor || '#F5F5F5',
            borderColor: testimonial.borderColor || '#DDDEE7',
            starsColor: testimonial.starsColor || '#FDC41B',
            backgroundColor: testimonial.backgroundColor || '#FFFFFF',
            order: testimonial.order || 0,
          }))
          setTestimonials(mappedTestimonials)
        }

        // Atualizar o formulário
        form.reset({
          enabled: testimonialsData.testimonialsEnabled || false,
          starRating: '5',
          name: 'João Silva',
          socialNetwork: '@joaosilva',
          text: 'Produto incrível! Recomendo muito para todos que querem aprender sobre design.',
          nameColor: '#27283A',
          textColor: '#9394A9',
          cardColor: '#F5F5F5',
          borderColor: '#DDDEE7',
          starsColor: '#FDC41B',
          backgroundColor: '#FFFFFF',
        })
      }
    } catch (error) {
      console.error('Erro ao carregar dados dos depoimentos:', error)
      setError('Erro ao carregar dados dos depoimentos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: TestimonialsFormData) => {
    if (!productId || !checkoutId) {
      return { success: false, message: 'ID do produto ou checkout não encontrado' }
    }

    setLoading(true)
    try {
      // Primeiro: Salvar depoimentos e obter IDs
      const testimonialsData = testimonials.map(testimonial => ({
        id: testimonial.id,
        profileImage: testimonial.profileImage,
        starRating: parseInt(testimonial.starRating),
        name: testimonial.name,
        socialMedia: testimonial.socialNetwork,
        text: testimonial.text,
        nameColor: testimonial.nameColor,
        textColor: testimonial.textColor,
        cardColor: testimonial.cardColor,
        borderColor: testimonial.borderColor,
        starsColor: testimonial.starsColor,
        backgroundColor: testimonial.backgroundColor,
        order: testimonial.order,
      }))

      const payload = {
        testimonialsEnabled: data.enabled,
        testimonials: testimonialsData,
      }

      const saveResponse = await api.put(`/products/${productId}/checkouts/${checkoutId}/testimonials`, payload)

      if (!(saveResponse.data as any).success) {
        setError((saveResponse.data as any).error || 'Erro ao salvar depoimentos')
        return { success: false, message: (saveResponse.data as any).error || 'Erro ao salvar depoimentos' }
      }

      // Segundo: Fazer upload das imagens se houver
      if (selectedFiles.size > 0) {
        const token = Cookies.get('user-token')
        const formData = new FormData()

        // Adicionar arquivos e seus IDs
        const testimonialIds: string[] = []
        for (const [testimonialId, file] of selectedFiles.entries()) {
          testimonialIds.push(testimonialId)
          formData.append('file', file)
        }
        formData.append('testimonialId', JSON.stringify(testimonialIds))

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/checkouts/${checkoutId}/testimonials/upload-images`,
          {
            method: 'POST',
            credentials: 'include', // se precisar de cookie de auth
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          },
        )

        const uploadResponse = await res.json()
        if (!uploadResponse.success) {
          setError(uploadResponse.message || 'Erro ao fazer upload das imagens')
          return { success: false, message: uploadResponse.message || 'Erro ao fazer upload das imagens' }
        }
      }

      setError(null)
      // Limpar arquivos selecionados após sucesso
      setSelectedFiles(new Map())
      return { success: true, message: 'Depoimentos atualizados com sucesso' }
    } catch (error) {
      console.error('Erro ao atualizar depoimentos:', error)
      setError('Erro ao atualizar depoimentos')
      return {
        success: false,
        message: error instanceof Error
          ? error.message
          : 'Erro ao atualizar depoimentos',
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    loading,
    error,
    testimonials,
    addTestimonial,
    removeTestimonial,
    updateTestimonial,
    handleFileSelect,
    handleSubmit,
  }
}
