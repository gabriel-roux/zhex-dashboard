import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/contexts/auth/context'
import { useApi } from './useApi'

export interface UserFormData {
  firstName: string
  lastName: string
  email: string
  phone?: string
}

const userSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório').max(50, 'Nome deve ter no máximo 50 caracteres'),
  lastName: z.string().min(1, 'Sobrenome é obrigatório').max(50, 'Sobrenome deve ter no máximo 50 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
})

export function useUserForm() {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const { put } = useApi()

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
  })

  // Carregar dados do usuário quando disponível
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      })
    }
  }, [user, form])

  const handleSubmit = async (data: UserFormData) => {
    setLoading(true)
    try {
      // Atualizar dados do usuário
      const updateResponse = await put<{ success: boolean; message: string; user: { id: string; firstName: string; lastName: string; email: string; phone?: string; avatarUrl?: string } }>('/users/profile', {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      })

      if (updateResponse.data.success) {
        // Atualizar contexto do usuário com os novos dados
        const updatedUser = {
          ...user!,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        }

        updateUser(updatedUser)

        return { success: true, message: 'Dados atualizados com sucesso' }
      } else {
        throw new Error(updateResponse.data.message || 'Erro ao atualizar dados')
      }
    } catch (error) {
      console.error('❌ Error in useUserForm handleSubmit:', error)
      return {
        success: false,
        message: error instanceof Error
          ? error.message
          : 'Erro ao atualizar dados',
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    loading,
    handleSubmit,
  }
}
