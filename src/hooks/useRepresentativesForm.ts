import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/contexts/auth/context'
import { useApi } from './useApi'

export interface RepresentativeData {
  id?: string
  firstName: string
  lastName: string
  birthDate: string
  cpf: string
  email: string
  phone: string
  zipCode: string
  address: string
  number: string
  city: string
  state: string
  isPoliticallyExposed?: boolean
}

export interface RepresentativesFormData {
  representatives: RepresentativeData[]
}

const representativeSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório.'),
  lastName: z.string().min(1, 'Sobrenome é obrigatório.'),
  birthDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data inválida.'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido.'),
  email: z.string().email('E‑mail inválido.'),
  phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido.'),
  address: z.string().min(1, 'Endereço é obrigatório.'),
  number: z.string().min(1, 'Número é obrigatório.'),
  city: z.string().min(1, 'Cidade é obrigatória.'),
  state: z.string().length(2, 'UF inválida.'),
  zipCode: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido.'),
  isPoliticallyExposed: z.boolean().default(false),
})

const representativesListSchema = z.object({
  representatives: z.array(representativeSchema).min(1, 'Pelo menos um representante é obrigatório.'),
})

export function useRepresentativesForm() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [minimizedForms, setMinimizedForms] = useState<Set<number>>(new Set())
  const { get, put } = useApi()

  const [error, setError] = useState<string | null>(null)

  const form = useForm<RepresentativesFormData>({
    resolver: zodResolver(representativesListSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      representatives: [
        {
          firstName: '',
          lastName: '',
          birthDate: '',
          cpf: '',
          email: '',
          phone: '',
          zipCode: '',
          address: '',
          number: '',
          city: '',
          state: '',
          isPoliticallyExposed: false,
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'representatives',
  })

  // Carregar dados dos representantes
  useEffect(() => {
    const loadRepresentatives = async () => {
      if (!user?.companyId) return

      try {
        const response = await get<{
          success: boolean
          representatives: Array<{
            id: string
            firstName: string
            lastName: string
            birthDate: string
            cpf: string
            email: string
            phone: string
            zipCode: string
            address: string
            number: string
            city: string
            state: string
            isPoliticallyExposed: boolean
          }>
        }>('/company/representatives')

        if (response.data.success) {
          const representatives = response.data.representatives

          // Formatar dados para o formulário
          const formattedRepresentatives = representatives.map(rep => ({
            id: rep.id,
            firstName: rep.firstName || '',
            lastName: rep.lastName || '',
            birthDate: rep.birthDate
              ? rep.birthDate.split('-').reverse().join('/')
              : '', // Converte YYYY-MM-DD para DD/MM/YYYY
            cpf: rep.cpf
              ? rep.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
              : '', // Formata CPF
            email: rep.email || '',
            phone: rep.phone || '',
            zipCode: rep.zipCode || '',
            address: rep.address || '',
            number: rep.number || '',
            city: rep.city || '',
            state: rep.state || '',
            isPoliticallyExposed: rep.isPoliticallyExposed || false,
          }))

          form.reset({
            representatives: formattedRepresentatives.length > 0
              ? formattedRepresentatives
              : [{
                  firstName: '',
                  lastName: '',
                  birthDate: '',
                  cpf: '',
                  email: '',
                  phone: '',
                  zipCode: '',
                  address: '',
                  number: '',
                  city: '',
                  state: '',
                  isPoliticallyExposed: false,
                }],
          })
        }
      } catch (error) {
        console.error('Erro ao carregar representantes:', error)
      }
    }

    loadRepresentatives()
  }, [user?.companyId, get, form])

  const addRepresentative = () => {
    append({
      firstName: '',
      lastName: '',
      birthDate: '',
      cpf: '',
      email: '',
      phone: '',
      zipCode: '',
      address: '',
      number: '',
      city: '',
      state: '',
      isPoliticallyExposed: false,
    })
  }

  const removeRepresentative = (index: number) => {
    if (fields.length > 1) {
      remove(index)
      // Remover da lista de formulários minimizados
      const newMinimized = new Set(minimizedForms)
      newMinimized.delete(index)
      setMinimizedForms(newMinimized)
    }
  }

  const toggleFormMinimization = (index: number) => {
    const newMinimized = new Set(minimizedForms)
    if (newMinimized.has(index)) {
      newMinimized.delete(index)
    } else {
      newMinimized.add(index)
    }
    setMinimizedForms(newMinimized)
  }

  const isFormComplete = (index: number): boolean => {
    const rep = form.watch(`representatives.${index}`)
    return !!(
      rep.firstName &&
      rep.lastName &&
      rep.birthDate &&
      rep.cpf &&
      rep.email &&
      rep.phone &&
      rep.address &&
      rep.number &&
      rep.city &&
      rep.state &&
      rep.zipCode
    )
  }

  const handleSubmit = async (data: RepresentativesFormData) => {
    setLoading(true)
    try {
      // Mapear dados do formulário para o formato da API
      const mappedRepresentatives = data.representatives.map(rep => ({
        id: rep.id,
        firstName: rep.firstName,
        lastName: rep.lastName,
        birthDate: rep.birthDate.split('/').reverse().join('-'), // Converte DD/MM/YYYY para YYYY-MM-DD
        cpf: rep.cpf.replace(/\D/g, ''), // Remove formatação
        email: rep.email,
        phone: rep.phone,
        zipCode: rep.zipCode.replace(/\D/g, ''), // Remove formatação
        address: rep.address,
        number: rep.number,
        city: rep.city,
        state: rep.state,
        isPoliticallyExposed: rep.isPoliticallyExposed || false,
      }))

      const response = await put<{ success: boolean; message: string }>('/company/representatives', {
        representatives: mappedRepresentatives,
      })

      if (response.data.success) {
        setError(null)
        return { success: true, message: 'Representantes atualizados com sucesso' }
      } else {
        setError(response.data.message || 'Erro ao atualizar representantes')
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error
          ? error.message
          : 'Erro ao atualizar representantes',
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    fields,
    loading,
    minimizedForms,
    addRepresentative,
    removeRepresentative,
    toggleFormMinimization,
    isFormComplete,
    handleSubmit,
    error,
  }
}
