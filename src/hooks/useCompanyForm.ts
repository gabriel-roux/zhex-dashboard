import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/contexts/auth/context'
import { useApi } from './useApi'

export interface CompanyFormData {
  // Detalhes da empresa
  legalName: string
  tradeName?: string
  document: string
  phone: string
  website?: string
  businessNiche?: string
  zipCode: string
  address: string
  number: string
  city: string
  state: string

  // Logo
  logo?: File[]
}

const companySchema = z.object({
  legalName: z.string().min(3, 'Razão social é obrigatória.'),
  tradeName: z.string().optional(),
  document: z
    .string()
    .regex(
      /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{11}|\d{14})$/,
      'CPF/CNPJ inválido. Use formato 000.000.000-00 ou 00.000.000/0000-00.'),
  phone: z
    .string()
    .regex(
      /^(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/,
      'Telefone inválido. Use formato (11) 91234‑5678.',
    ),
  website: z.string().url('URL inválida. Ex.: https://minhaempresa.com').optional().or(z.literal('')),
  businessNiche: z.string().optional(),
  zipCode: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, 'CEP deve estar no formato 00000‑000.')
    .transform((v) => v.replace(/\D/g, '')),
  address: z.string().min(5, 'Endereço incompleto.'),
  number: z.string().min(1, 'Número é obrigatório.'),
  city: z.string().min(2, 'Cidade é obrigatória.'),
  state: z
    .string()
    .length(2, 'UF deve ter 2 letras.')
    .transform((s) => s.toUpperCase()),
  logo: z.any().optional(),
})

export function useCompanyForm() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [companyType, setCompanyType] = useState<'INDIVIDUAL' | 'CORPORATION'>('CORPORATION')
  const { get, put, post } = useApi()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      legalName: '',
      tradeName: '',
      document: '',
      phone: '',
      website: '',
      businessNiche: '',
      zipCode: '',
      address: '',
      number: '',
      city: '',
      state: '',
    },
  })

  // Função para detectar se é CPF ou CNPJ e aplicar formatação
  const formatDocument = (document: string): string => {
    const cleanDocument = document.replace(/\D/g, '')

    if (cleanDocument.length === 11) {
      // CPF
      return cleanDocument.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    } else if (cleanDocument.length === 14) {
      // CNPJ
      return cleanDocument.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }

    return document
  }

  // Função para obter máscara baseada no tipo de documento
  const getDocumentMask = (document: string): string => {
    const cleanDocument = document.replace(/\D/g, '')

    if (cleanDocument.length <= 11) {
      return '000.000.000-00'
    } else {
      return '00.000.000/0000-00'
    }
  }

  // Carregar dados da empresa
  useEffect(() => {
    const loadCompanyData = async () => {
      if (!user?.companyId) return

      try {
        const response = await get<{
          success: boolean
          company: {
            id: string
            legalName: string
            tradeName: string
            document: string
            phone: string
            website: string
            businessNiche: string
            zipCode: string
            address: string
            number: string
            city: string
            state: string
            avatarUrl?: string
            type: 'INDIVIDUAL' | 'CORPORATION'
          }
        }>('/company/company-details')

        if (response.data.success) {
          const company = response.data.company
          setCompanyType(company.type)

          // Formatar documento baseado no tipo
          const formattedDocument = formatDocument(company.document)

          form.reset({
            legalName: company.legalName || '',
            tradeName: company.tradeName || '',
            document: formattedDocument || '',
            phone: company.phone || '',
            website: company.website || '',
            businessNiche: company.businessNiche || '',
            zipCode: company.zipCode || '',
            address: company.address || '',
            number: company.number || '',
            city: company.city || '',
            state: company.state || '',
          })

          if (company.avatarUrl) {
            setLogoPreview(company.avatarUrl)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados da empresa:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCompanyData()
  }, [user?.companyId, get, form])

  const handleLogoChange = (file: File | null) => {
    if (file) {
      // Criar preview da imagem
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      form.setValue('logo', [file])
    } else {
      setLogoPreview(null)
      form.setValue('logo', undefined)
    }
  }

  const uploadLogo = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await post<{ success: boolean; message: string; logoUrl: string }>(`/company/${user?.companyId}/upload-logo`, formData)

    if (!response.data.success) {
      setError(response.data.message)
    }

    return response.data.logoUrl
  }

  const handleSubmit = async (data: CompanyFormData) => {
    setLoading(true)
    try {
      // Upload da logo se existir
      if (data.logo?.[0]) {
        const logoResponse = await uploadLogo(data.logo[0])
        if (!logoResponse) { return }
      }

      // Preparar dados para atualização
      const updateData = {
        legalName: data.legalName,
        tradeName: data.tradeName,
        document: data.document.replace(/\D/g, ''), // Remove formatação
        phone: data.phone,
        website: data.website,
        businessNiche: data.businessNiche,
        zipCode: data.zipCode.replace(/\D/g, ''), // Remove formatação
        address: data.address,
        number: data.number,
        city: data.city,
        state: data.state,
      }

      console.log('📤 Updating company...')
      const response = await put<{ success: boolean; message: string }>(`/company/${user?.companyId}`, updateData)

      if (response.data.success) {
        setError(null)
        return { success: true, message: 'Empresa atualizada com sucesso' }
      } else {
        setError(response.data.message || 'Erro ao atualizar empresa')
      }
    } catch (error) {
      console.error('❌ Error in useCompanyForm handleSubmit:', error)
      return {
        success: false,
        message: error instanceof Error
          ? error.message
          : 'Erro ao atualizar empresa',
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    loading,
    logoPreview,
    companyType,
    handleLogoChange,
    handleSubmit,
    formatDocument,
    getDocumentMask,
    error,
  }
}
