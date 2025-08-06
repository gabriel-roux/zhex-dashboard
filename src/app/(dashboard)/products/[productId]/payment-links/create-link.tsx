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
import { ProductType } from '@/@types/product'
import { PaymentLink } from '@/@types/payment-link'
import { Warning } from '@/components/warning'

// Schema de validação
const linkSchema = z.object({
  name: z.string().min(1, 'Nome do link é obrigatório'),
  isActive: z.boolean(),
  checkout: z.string().min(1, 'Selecione um checkout'),
  isFreeOffer: z.boolean(),
  usePriceFromProduct: z.boolean(),
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
  productType: ProductType
}

export function PaymentLinkModal({
  open,
  onOpenChange,
  productId,
  checkouts,
  onLinkCreated,
  mode,
  linkToEdit,
  productType,
}: PaymentLinkModalProps) {
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
      isActive: mode === 'edit' && linkToEdit
        ? linkToEdit.isActive
        : true,
      isFreeOffer: mode === 'edit' && linkToEdit
        ? linkToEdit.isFreeOffer
        : false,
      price: mode === 'edit' && linkToEdit
        ? linkToEdit.price.baseAmount
        : 0,
      usePriceFromProduct: mode === 'edit' && linkToEdit
        ? linkToEdit.usePriceFromProduct
        : false,
    },
  })

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
          ? linkToEdit.isFreeOffer
          : false,
        price: mode === 'edit' && linkToEdit && productType === ProductType.ONE_TIME
          ? linkToEdit.price.baseAmount > 0
            ? linkToEdit.price.baseAmount
            : 0
          : 0,
        usePriceFromProduct: mode === 'edit' && linkToEdit
          ? linkToEdit.usePriceFromProduct
          : false,
        isActive: mode === 'edit' && linkToEdit
          ? linkToEdit.isActive
          : true,
      })
    }
  }, [open, mode, linkToEdit, reset])

  const onSubmit = async (data: LinkFormData) => {
    try {
      setLoading(true)

      if (mode === 'create') {
        const createData: {
          name: string
          checkoutId: string
          isFreeOffer: boolean
          usePriceFromProduct?: boolean
          price?: number
        } = {
          name: data.name,
          checkoutId: data.checkout,
          isFreeOffer: data.isFreeOffer,
        }

        // Só incluir usePriceFromProduct se for produto ONE_TIME
        if (productType === ProductType.ONE_TIME) {
          createData.usePriceFromProduct = data.usePriceFromProduct
        }

        // Só incluir price se não for gratuito e for produto ONE_TIME
        if (!data.isFreeOffer && data.price && data.price > 0 && productType === ProductType.ONE_TIME) {
          createData.price = data.price
        }

        const response = await post<{ success: boolean; data: unknown; message: string }>(`/products/${productId}/payment-links`, createData)

        if (response.data.success) {
          onLinkCreated()
          onOpenChange(false)
          setError(null)
        } else {
          setError(response.data.message)
        }
      } else if (mode === 'edit' && linkToEdit) {
        const updateData: {
          name: string
          checkoutId: string
          isActive: boolean
          isFreeOffer: boolean
          usePriceFromProduct: boolean
          price?: number
        } = {
          name: data.name,
          checkoutId: data.checkout,
          isActive: data.isActive,
          isFreeOffer: data.isFreeOffer,
          usePriceFromProduct: data.usePriceFromProduct,
        }

        // Só incluir price se não for gratuito, tiver um preço válido E for produto ONE_TIME
        if (!data.isFreeOffer && data.price && data.price > 0 && productType === ProductType.ONE_TIME) {
          updateData.price = data.price
        }

        console.log('🔄 Enviando dados para atualização:', updateData)

        const response = await put<{ success: boolean; data: unknown; message: string }>(`/products/${productId}/payment-links/${linkToEdit.id}`, updateData)

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
                  <Switch
                    active={watch('isActive')}
                    setValue={(value) => setValue('isActive', value)}
                  />
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

                {/* Usar preço do produto */}
                {/* Oferta gratuita */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-neutral-1000 font-medium font-araboto text-base">
                      Oferta gratuita:
                    </label>
                    <Switch
                      active={watch('isFreeOffer')}
                      setValue={(value) => setValue('isFreeOffer', value)}
                    />
                  </div>
                  <p className="text-neutral-500 text-sm">
                    Ao ativar, você não poderá editar o preço da oferta.
                  </p>
                </div>

                {productType === ProductType.ONE_TIME && !watch('isFreeOffer') && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-neutral-1000 font-medium font-araboto text-base">
                        Usar preço do produto:
                      </label>
                      <Switch
                        active={watch('usePriceFromProduct')}
                        setValue={(value) => setValue('usePriceFromProduct', value)}
                      />
                    </div>
                    <p className="text-neutral-500 text-sm">
                      Ao ativar, o preço do link será o mesmo do produto.
                    </p>
                  </div>
                )}

                {/* Preço */}
                {!watch('isFreeOffer') && !watch('usePriceFromProduct') && productType === ProductType.ONE_TIME && (
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
                      disabled={watch('isFreeOffer')}
                    />
                  </div>
                )}

                {productType === ProductType.RECURRING && !watch('isFreeOffer') && (
                  <Warning
                    size="sm"
                    variant="warning"
                    title="Preço indisponível para edição"
                    description="Para produtos com recorrência, o ajuste de preço é feito na aba “Assinaturas”."
                  />
                )}

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
