import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/button'
import { TextField, SelectField } from '@/components/textfield'
import { XCircleIcon } from '@phosphor-icons/react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { Switch } from '@/components/switch'
import { useApi } from '@/hooks/useApi'
import { Subscription } from '@/@types/subscription'
import { PriceField } from '@/components/price-field'

// Schema de validação
const subscriptionSchema = z.object({
  name: z.string().min(1, 'Nome da assinatura é obrigatório'),
  isActive: z.boolean(),
  billingInterval: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']),
  billingIntervalCount: z.number().min(1, 'Intervalo deve ser pelo menos 1'),
  price: z.number().min(1, 'Preço é obrigatório'),
  trialEnabled: z.boolean(),
  trialPeriodDays: z.string().optional(),
  paymentLinkIds: z.array(z.string()).min(1, 'Pelo menos um link de pagamento é obrigatório'),
})

type SubscriptionFormData = z.infer<typeof subscriptionSchema>

interface CreatePlanModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string
  onSubscriptionCreated: () => void
  mode: 'create' | 'edit'
  subscriptionToEdit?: Subscription | null
}

const billingIntervalOptions = [
  { value: 'DAY', label: 'Diário' },
  { value: 'WEEK', label: 'Semanal' },
  { value: 'MONTH', label: 'Mensal' },
  { value: 'YEAR', label: 'Anual' },
]

const trialOptions = [
  { value: 7, label: '7 dias de gratuidade' },
  { value: 14, label: '14 dias de gratuidade' },
  { value: 30, label: '30 dias de gratuidade' },
]

export function CreatePlanModal({
  open,
  onOpenChange,
  productId,
  onSubscriptionCreated,
  mode,
  subscriptionToEdit,
}: CreatePlanModalProps) {
  const [paymentLinks, setPaymentLinks] = useState<Array<{ id: string; name: string }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { post, put, get } = useApi()

  const { control, register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: mode === 'edit' && subscriptionToEdit
        ? subscriptionToEdit.name
        : 'Assinatura #001',
      isActive: mode === 'edit' && subscriptionToEdit
        ? subscriptionToEdit.isActive
        : true,
      billingInterval: mode === 'edit' && subscriptionToEdit
        ? subscriptionToEdit.billingInterval
        : 'MONTH',
      billingIntervalCount: mode === 'edit' && subscriptionToEdit
        ? subscriptionToEdit.billingIntervalCount
        : 1,
      price: mode === 'edit' && subscriptionToEdit
        ? subscriptionToEdit.price.baseAmount
        : 19000,
      trialEnabled: mode === 'edit' && subscriptionToEdit
        ? subscriptionToEdit.trialEnabled
        : false,
      trialPeriodDays: mode === 'edit' && subscriptionToEdit
        ? subscriptionToEdit.trialPeriodDays?.toString()
        : undefined,
      paymentLinkIds: mode === 'edit' && subscriptionToEdit
        ? []
        : [], // Será preenchido após buscar payment links
    },
  })

  // Buscar payment links disponíveis
  const fetchPaymentLinks = async () => {
    try {
      const response = await get<{ success: boolean; data: { paymentLinks: Array<{ id: string; name: string }> } }>(`/products/${productId}/payment-links`)

      if (response.success) {
        setPaymentLinks(response.data.data.paymentLinks)
      }
    } catch (error) {
      console.error('Erro ao buscar payment links:', error)
    }
  }

  // Buscar payment links vinculados à assinatura (para modo edit)
  const fetchSubscriptionPaymentLinks = async (subscriptionId: string): Promise<string[]> => {
    try {
      const response = await get<{ success: boolean; data: { subscriptionLinks: Array<{ paymentLinkId: string }> } }>(`/products/${productId}/subscriptions/${subscriptionId}/payment-links`)

      if (response.success) {
        const linkedPaymentLinkIds = response.data.data.subscriptionLinks.map(link => link.paymentLinkId)
        console.log('Payment links encontrados:', linkedPaymentLinkIds)
        return linkedPaymentLinkIds
      }
      return []
    } catch (error) {
      console.error('Erro ao buscar payment links da assinatura:', error)
      return []
    }
  }

  // Resetar formulário quando modal abrir/fechar
  useEffect(() => {
    if (open) {
      fetchPaymentLinks()

      // Se estiver em modo de edição, buscar payment links vinculados primeiro
      if (mode === 'edit' && subscriptionToEdit) {
        fetchSubscriptionPaymentLinks(subscriptionToEdit.id).then((linkedIds) => {
          // Depois de buscar os payment links, resetar o formulário com os valores corretos
          reset({
            name: subscriptionToEdit.name,
            isActive: subscriptionToEdit.isActive,
            billingInterval: subscriptionToEdit.billingInterval,
            billingIntervalCount: subscriptionToEdit.billingIntervalCount,
            price: subscriptionToEdit.price.baseAmount,
            trialEnabled: subscriptionToEdit.trialEnabled,
            trialPeriodDays: subscriptionToEdit.trialPeriodDays?.toString(),
            paymentLinkIds: linkedIds, // Usar os IDs encontrados
          })
        })
      } else {
        // Modo create - resetar com valores padrão
        reset({
          name: 'Assinatura #001',
          isActive: true,
          billingInterval: 'MONTH',
          billingIntervalCount: 1,
          price: 19000,
          trialEnabled: false,
          trialPeriodDays: undefined,
          paymentLinkIds: [],
        })
      }
    }
  }, [open, mode, subscriptionToEdit, reset])

  const onSubmit = async (data: SubscriptionFormData) => {
    try {
      setLoading(true)

      // Converter preço para centavos
      const priceInCents = data.price

      // Converter trialPeriodDays de string para número
      const trialPeriodDaysNumber = data.trialPeriodDays
        ? parseInt(data.trialPeriodDays)
        : undefined

      if (mode === 'create') {
        const response = await post<{ success: boolean; message: string }>(`/products/${productId}/subscriptions`, {
          name: data.name,
          billingInterval: data.billingInterval,
          billingIntervalCount: data.billingIntervalCount,
          trialEnabled: data.trialEnabled,
          trialPeriodDays: trialPeriodDaysNumber,
          price: priceInCents,
          baseCurrency: 'BRL',
          enabledCurrencies: ['BRL'],
          paymentDescription: '',
          paymentLinkIds: data.paymentLinkIds,
        })

        if (response.data.success) {
          onSubscriptionCreated()
          onOpenChange(false)
          setError(null)
        } else {
          setError(response.data.message)
        }
      } else if (mode === 'edit' && subscriptionToEdit) {
        console.log('Enviando paymentLinkIds:', data.paymentLinkIds)
        const response = await put<{ success: boolean; message: string }>(`/products/${productId}/subscriptions/${subscriptionToEdit.id}`, {
          name: data.name,
          billingInterval: data.billingInterval,
          billingIntervalCount: data.billingIntervalCount,
          trialEnabled: data.trialEnabled,
          trialPeriodDays: trialPeriodDaysNumber,
          isActive: data.isActive,
          price: priceInCents,
          baseCurrency: 'BRL',
          enabledCurrencies: ['BRL'],
          paymentDescription: '',
          paymentLinkIds: data.paymentLinkIds,
        })

        if (response.data.success) {
          onSubscriptionCreated()
          onOpenChange(false)
          setError(null)
        } else {
          setError(response.data.message)
        }
      }
    } catch (error) {
      console.error('Erro ao salvar assinatura:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root
      open={open} onOpenChange={
      (open) => {
        onOpenChange(open)
        reset()
        setError(null)
      }
    }
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-neutral-1000/50 backdrop-blur-sm z-50" />
        <Dialog.Content
          style={{
            maxWidth: 440,
            right: 0,
            top: 0,
          }} className="fixed right-0 top-0 h-full w-[440px] bg-white shadow-2xl z-50 flex flex-col"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-200 flex-shrink-0">
              <Dialog.Title className="text-lg font-araboto font-medium text-neutral-1000">
                {mode === 'create'
                  ? 'Criar nova assinatura'
                  : 'Editar assinatura'}
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
                {/* Nome da assinatura */}
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                    Nome da assinatura:
                  </label>
                  <TextField
                    {...register('name')}
                    placeholder="Assinatura #001"
                    error={errors.name?.message}
                  />
                </div>

                {/* Status da assinatura */}
                <div className="flex items-center justify-between">
                  <label className="text-neutral-1000 font-medium font-araboto text-base">
                    Status da assinatura:
                  </label>
                  <Switch active={watch('isActive')} setValue={() => setValue('isActive', !watch('isActive'))} />
                </div>

                {/* Intervalo de cobrança */}
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                    Intervalo de cobrança:
                  </label>
                  <p className="text-neutral-600 text-sm mb-3">
                    Defina com que frequência o cliente será cobrado.
                  </p>
                  <Controller
                    name="billingInterval"
                    control={control}
                    render={({ field }) => (
                      <SelectField
                        {...field}
                        control={control}
                        options={billingIntervalOptions}
                        placeholder="Selecione o intervalo"
                        error={errors.billingInterval?.message}
                      />
                    )}
                  />
                </div>

                {/* Contador de intervalo */}
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                    A cada quantos intervalos:
                  </label>
                  <TextField
                    {...register('billingIntervalCount', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    placeholder="1"
                    error={errors.billingIntervalCount?.message}
                  />
                </div>

                {/* Preço */}
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                    Preço:
                  </label>
                  <PriceField
                    control={control}
                    name="price"
                    placeholder="R$ 190,00"
                    withoutCurrencySelector
                    error={errors.price?.message}
                  />
                </div>

                {/* Free Trial */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-neutral-1000 font-medium font-araboto text-base">
                      Free Trial:
                    </label>
                    <Switch active={watch('trialEnabled')} setValue={() => setValue('trialEnabled', !watch('trialEnabled'))} />
                  </div>
                  {watch('trialEnabled') && (
                    <Controller
                      name="trialPeriodDays"
                      control={control}
                      render={() => (
                        <SelectField
                          name="trialPeriodDays"
                          control={control}
                          options={trialOptions.map(option => ({
                            value: option.value.toString(),
                            label: option.label,
                          }))}
                          placeholder="Selecione a duração"
                          error={errors.trialPeriodDays?.message}
                        />
                      )}
                    />
                  )}
                </div>

                {/* Links de pagamento */}
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                    Links de pagamento:
                  </label>
                  <p className="text-neutral-600 text-sm mb-3">
                    Selecione os links de pagamento que serão vinculados a esta assinatura.
                  </p>
                  <Controller
                    name="paymentLinkIds"
                    control={control}
                    render={({ field }) => (
                      <SelectField
                        {...field}
                        control={control}
                        options={paymentLinks.map(link => ({
                          value: link.id,
                          label: link.name,
                        }))}
                        placeholder="Selecione os links de pagamento"
                        error={errors.paymentLinkIds?.message}
                        multiple
                      />
                    )}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Botão de criar - Fixo no final */}
              <div className="px-8 py-6 flex-shrink-0">
                <Button
                  type="submit"
                  variant="primary"
                  size="full"
                  className="w-full"
                  loading={loading}
                >
                  {mode === 'create'
                    ? 'Criar nova assinatura'
                    : 'Salvar alterações'}
                </Button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
