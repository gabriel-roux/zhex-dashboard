import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Schema de validação
const linksSchema = z.object({
  customLink: z.string().url('Link inválido').min(1, 'Link é obrigatório'),
})

export type LinksFormData = z.infer<typeof linksSchema>

export function useCheckoutLinksForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<LinksFormData>({
    resolver: zodResolver(linksSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      customLink: 'https://checkout.zhex.com.br',
    },
  })

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // TODO: Integrar com API para salvar dados dos links

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))

      setError(null)
      return { success: true, message: 'Links atualizados com sucesso' }
    } catch (error) {
      console.error('Erro ao atualizar links:', error)
      setError('Erro ao atualizar links')
      return {
        success: false,
        message: error instanceof Error
          ? error.message
          : 'Erro ao atualizar links',
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
  }
}
