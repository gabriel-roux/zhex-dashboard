import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/contexts/auth/context'
import { useApi } from './useApi'
import { banks } from '@/assets/lists/banks'

export interface BankFormData {
  bank: string
  agencyNumber: string
  accountNumber: string
  confirmAccountNumber: string
}

const bankSchema = z
  .object({
    bank: z.string().min(1, 'Selecione o banco.'),
    agencyNumber: z.string().min(1, 'Agência obrigatória.'),
    accountNumber: z.string().min(1, 'Conta obrigatória.'),
    confirmAccountNumber: z.string().min(1, 'Confirme a conta.'),
  })
  .refine((data) => data.accountNumber === data.confirmAccountNumber, {
    message: 'Contas não conferem.',
    path: ['confirmAccountNumber'],
  })

export function useBankForm() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const { get, put } = useApi()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<BankFormData>({
    resolver: zodResolver(bankSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      bank: '',
      agencyNumber: '',
      accountNumber: '',
      confirmAccountNumber: '',
    },
  })

  // Carregar dados bancários
  useEffect(() => {
    const loadBankData = async () => {
      if (!user?.companyId) return

      try {
        const response = await get<{
          success: boolean
          bankAccount: {
            id: string
            bankCode: string
            bankName: string
            agency: string
            account: string
            accountType: string
          }
        }>('/company/bank-account')

        if (response.data.success && response.data.bankAccount) {
          const bankAccount = response.data.bankAccount

          form.reset({
            bank: bankAccount.bankCode || '',
            agencyNumber: bankAccount.agency || '',
            accountNumber: bankAccount.account || '',
            confirmAccountNumber: bankAccount.account || '',
          })
        }
      } catch (error) {
        console.error('Erro ao carregar dados bancários:', error)
      }
    }

    loadBankData()
  }, [user?.companyId, get, form])

  const handleSubmit = async (data: BankFormData) => {
    setLoading(true)
    try {
      // Mapear dados do formulário para o formato da API
      const bankData = {
        bankCode: data.bank,
        bankName: banks.find(b => b.COMPE === data.bank)?.LongName || '',
        agency: data.agencyNumber,
        account: data.accountNumber,
        accountType: 'CHECKING', // Default para conta corrente
      }

      const response = await put<{ success: boolean; message: string }>('/company/bank-account', bankData)

      if (response.data.success) {
        setError(null)
        return { success: true, message: 'Dados bancários atualizados com sucesso' }
      } else {
        setError(response.data.message || 'Erro ao atualizar dados bancários')
      }
    } catch (error) {
      console.error('❌ Error in useBankForm handleSubmit:', error)
      return {
        success: false,
        message: error instanceof Error
          ? error.message
          : 'Erro ao atualizar dados bancários',
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    loading,
    handleSubmit,
    error,
  }
}
