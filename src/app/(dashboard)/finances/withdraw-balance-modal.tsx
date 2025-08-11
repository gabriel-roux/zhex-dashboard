import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/button'
import { XCircleIcon, WalletIcon, BankIcon } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { useApi } from '@/hooks/useApi'
import { PriceField } from '@/components/price-field'
import { WalletBalance, CreateWithdrawalData } from '@/@types/wallet'

// Schema de validação
const withdrawSchema = z.object({
  amount: z.number().min(1, 'Valor é obrigatório').positive('Valor deve ser maior que zero'),
})

type WithdrawFormData = z.infer<typeof withdrawSchema>

interface WithdrawBalanceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  walletBalance: WalletBalance | null
  onWithdrawCreated: () => void
}

export function WithdrawBalanceModal({
  open,
  onOpenChange,
  walletBalance,
  onWithdrawCreated,
}: WithdrawBalanceModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { post } = useApi()

  const { control, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<WithdrawFormData>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: 0,
    },
  })

  // Resetar formulário quando modal abre/fecha
  useEffect(() => {
    if (open) {
      reset({
        amount: 0,
      })
      setError(null)
    }
  }, [open, reset])

  const availableBalance = walletBalance?.availableBalanceInReais || 0
  const formattedBalance = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(availableBalance)

  const onSubmit = async (data: WithdrawFormData) => {
    try {
      setLoading(true)
      setError(null)

      // Validar se o valor não excede o saldo disponível
      // data.amount vem em centavos, availableBalance está em reais
      if (data.amount > availableBalance * 100) {
        setError('Valor solicitado excede o saldo disponível')
        return
      }

      const withdrawData: CreateWithdrawalData = {
        amount: data.amount,
        method: 'BANK_TRANSFER',
      }

      const response = await post<{ success: boolean; data: unknown; message: string }>('/wallet/withdrawals', withdrawData)

      if (response.data.success) {
        onWithdrawCreated()
        onOpenChange(false)
        setError(null)
      } else {
        setError(response.data.message || 'Erro ao processar retirada')
      }
    } catch (error) {
      console.error('Erro ao processar retirada:', error)
      setError('Erro ao processar retirada. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleMaxAmount = () => {
    // availableBalance já vem em reais, mas PriceField espera em centavos
    setValue('amount', availableBalance * 100)
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open)
        reset()
        setError(null)
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-neutral-1000/50 backdrop-blur-sm z-50" />
        <Dialog.Content
          style={{
            maxWidth: 440,
            right: 0,
            top: 0,
          }}
          className="fixed right-0 top-0 h-full w-[440px] bg-white shadow-2xl z-50 flex flex-col"
        >
          <div className="flex flex-col h-full">

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-200 flex-shrink-0">
              <Dialog.Title className="text-lg font-araboto font-medium text-neutral-1000">
                Retirar saldo disponível
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="text-neutral-400 hover:text-red-secondary-600 transition-colors"
                  aria-label="Fechar"
                >
                  <XCircleIcon size={30} weight="fill" />
                </button>
              </Dialog.Close>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
              <div className="flex-1 px-8 py-6 space-y-6 overflow-y-auto">
                {/* Saldo disponível */}
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zhex-base-500/20 rounded-full flex items-center justify-center">
                      <WalletIcon size={16} className="text-zhex-base-500" weight="fill" />
                    </div>
                    <span className="text-neutral-600 font-araboto">
                      Saldo disponível: {' '}
                      <span className="text-lg font-medium text-neutral-1000">
                        {formattedBalance}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Valor da retirada */}
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                    Valor da retirada:
                  </label>
                  <div className="space-y-2">
                    <PriceField
                      name="amount"
                      placeholder="0,00"
                      withoutCurrencySelector
                      control={control}
                      error={errors.amount?.message}
                    />
                    <button
                      type="button"
                      onClick={handleMaxAmount}
                      className="text-sm text-zhex-base-500 hover:text-zhex-base-600 underline transition-colors"
                    >
                      Usar valor máximo
                    </button>
                  </div>
                </div>

                {/* Informações da conta bancária */}
                {walletBalance && (
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-7 h-7 bg-zhex-base-500/20 rounded-full flex items-center justify-center">
                        <BankIcon size={16} className="text-zhex-base-500" weight="fill" />
                      </div>
                      <span className="text-neutral-1000 font-medium text-base">Conta de destino</span>
                    </div>
                    <div className="text-sm text-neutral-600">
                      <p>Configure sua conta bancária em: </p>
                      <p className="text-zhex-base-500 font-medium mt-0.5">Gerenciarz Conta → Dados Bancários</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
              </div>

              {/* Botão de confirmar - Fixo no final */}
              <div className="px-8 py-6 flex-shrink-0">
                <Button
                  type="submit"
                  variant="primary"
                  size="full"
                  className="w-full"
                  loading={loading}
                  disabled={!watch('amount') || watch('amount') <= 0}
                >
                  Confirmar retirada
                </Button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
