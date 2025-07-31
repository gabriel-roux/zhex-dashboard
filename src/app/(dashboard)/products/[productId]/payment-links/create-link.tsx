import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/button'
import { TextField, SelectField } from '@/components/textfield'
import { XCircleIcon } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { Switch } from '@/components/switch'
import { useApi } from '@/hooks/useApi'
import { PriceField } from '@/components/price-field'

interface PaymentLink {
  id: string
  name: string
  checkout: {
    id: string
    name: string
  }
  price: {
    baseAmount: number
    baseCurrency: string
    enabledCurrencies: string[]
  }
  isActive: boolean
  accessUrl: string
}

// Schema de validação
const linkSchema = z.object({
  name: z.string().min(1, 'Nome do link é obrigatório'),
  checkout: z.string().min(1, 'Selecione um checkout'),
  isFreeOffer: z.boolean(),
  price: z.number().optional(),
})

type LinkFormData = z.infer<typeof linkSchema>

interface PaymentLinkModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string
  checkouts: Array<{ id: string; name: string; isActive: boolean }>
  onLinkCreated: () => void
  mode: 'create' | 'edit'
  linkToEdit?: PaymentLink | null
}

export function PaymentLinkModal({
  open,
  onOpenChange,
  productId,
  checkouts,
  onLinkCreated,
  mode,
  linkToEdit,
}: PaymentLinkModalProps) {
  const [isFreeOffer, setIsFreeOffer] = useState(false)
  const [isStatusActive, setIsStatusActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { post, put } = useApi()

  const { control, register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      name: mode === 'edit' && linkToEdit
        ? linkToEdit.name
        : 'Oferta para clientes novos',
      checkout: mode === 'edit' && linkToEdit
        ? linkToEdit.checkout.id
        : '',
      isFreeOffer: mode === 'edit' && linkToEdit
        ? linkToEdit.price.baseAmount === 0
        : false,
      price: mode === 'edit' && linkToEdit
        ? linkToEdit.price.baseAmount
        : 0,
    },
  })

  // Watch isFreeOffer para validação condicional
  const watchedIsFreeOffer = watch('isFreeOffer')

  // Atualizar schema quando isFreeOffer muda
  useEffect(() => {
    if (watchedIsFreeOffer) {
      setValue('price', 0)
    }
  }, [watchedIsFreeOffer, setValue])

  // Resetar formulário quando modal abre/fecha ou muda o modo
  useEffect(() => {
    if (open) {
      reset({
        name: mode === 'edit' && linkToEdit
          ? linkToEdit.name
          : 'Oferta para clientes novos',
        checkout: mode === 'edit' && linkToEdit
          ? linkToEdit.checkout.id
          : '',
        isFreeOffer: mode === 'edit' && linkToEdit
          ? linkToEdit.price.baseAmount === 0
          : false,
        price: mode === 'edit' && linkToEdit
          ? linkToEdit.price.baseAmount
          : 0,
      })
      setIsFreeOffer(mode === 'edit' && linkToEdit
        ? linkToEdit.price.baseAmount === 0
        : false)
      setIsStatusActive(mode === 'edit' && linkToEdit
        ? linkToEdit.isActive
        : true)
    }
  }, [open, mode, linkToEdit, reset])

  const onSubmit = async (data: LinkFormData) => {
    try {
      setLoading(true)

      if (mode === 'create') {
        const response = await post<{ success: boolean; data: unknown; message: string }>(`/products/${productId}/payment-links`, {
          name: data.name,
          checkoutId: data.checkout,
          isFreeOffer: data.isFreeOffer,
          price: data.price || 0,
        })

        if (response.data.success) {
          onLinkCreated()
          onOpenChange(false)
          setError(null)
        } else {
          setError(response.data.message)
        }
      } else if (mode === 'edit' && linkToEdit) {
        const response = await put<{ success: boolean; data: unknown; message: string }>(`/products/${productId}/payment-links/${linkToEdit.id}`, {
          name: data.name,
          checkoutId: data.checkout,
          isActive: isStatusActive,
          isFreeOffer: data.isFreeOffer,
          price: data.price || 0,
        })

        if (response.data.success) {
          onLinkCreated()
          onOpenChange(false)
          setError(null)
        } else {
          setError(response.data.message)
        }
      }
    } catch (error) {
      console.error(`Erro ao ${mode === 'create'
? 'criar'
: 'editar'} link:`, error)
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
                  ? 'Criar novo link'
                  : 'Editar link'}
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
                {/* Nome do link */}
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                    Nome do link de pagamento:
                  </label>
                  <TextField
                    {...register('name')}
                    placeholder="Oferta para clientes novos"
                    error={errors.name?.message}
                  />
                </div>

                {/* Status do link */}
                <div className="flex items-center justify-between">
                  <label className="text-neutral-1000 font-medium font-araboto text-base">
                    Status do link:
                  </label>
                  <Switch active={isStatusActive} setValue={setIsStatusActive} />
                </div>

                {/* Checkout */}
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                    Checkout:
                  </label>
                  <p className="text-neutral-600 text-sm mb-3">
                    Para utilizar um novo layout de checkout você deve: acessar a aba Checkout, criar um novo, editar esse link de pagamento (selecionando o checkout criado).
                  </p>
                  <SelectField
                    name="checkout"
                    control={control}
                    options={checkouts.map(checkout => ({ value: checkout.id, label: checkout.name }))}
                    placeholder="Selecione o checkout"
                    error={errors.checkout?.message}
                  />
                </div>

                {/* Oferta gratuita */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-neutral-1000 font-medium font-araboto text-base">
                      Oferta gratuita:
                    </label>
                    <Switch active={isFreeOffer} setValue={setIsFreeOffer} />
                  </div>
                  <p className="text-neutral-500 text-sm">
                    Ao ativar, você não poderá editar o preço da oferta.
                  </p>
                </div>

                {/* Preço */}
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                    Preço:
                  </label>
                  <PriceField
                    name="price"
                    placeholder="129,40"
                    withoutCurrencySelector
                    control={control}
                    error={errors.price?.message}
                    disabled={isFreeOffer}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
              </div>

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
                    ? 'Criar novo link'
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
