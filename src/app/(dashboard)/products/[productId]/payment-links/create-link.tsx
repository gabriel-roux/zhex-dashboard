import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/button'
import { TextField, SelectField } from '@/components/textfield'
import { XCircleIcon } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Switch } from '@/components/switch'

// Schema de validação
const createLinkSchema = z.object({
  name: z.string().min(1, 'Nome do link é obrigatório'),
  status: z.boolean(),
  checkout: z.string().min(1, 'Selecione um checkout'),
  isFreeOffer: z.boolean(),
  price: z.string().min(1, 'Preço é obrigatório').refine((val) => {
    const price = parseFloat(val.replace(/[^\d,]/g, '').replace(',', '.'))
    return !isNaN(price) && price > 0
  }, 'Preço deve ser um valor válido'),
})

type CreateLinkFormData = z.infer<typeof createLinkSchema>

interface CreateLinkModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const checkoutOptions = [
  { value: 'zhex-default', label: 'Zhex Default Checkout' },
  { value: 'custom-1', label: 'Checkout Personalizado 1' },
  { value: 'custom-2', label: 'Checkout Personalizado 2' },
]

export function CreateLinkModal({ open, onOpenChange }: CreateLinkModalProps) {
  const [isFreeOffer, setIsFreeOffer] = useState(false)
  const [isStatusActive, setIsStatusActive] = useState(true)

  const { control, register, handleSubmit, formState: { errors } } = useForm<CreateLinkFormData>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      name: 'Oferta para clientes novos',
      status: true,
      checkout: 'zhex-default',
      isFreeOffer: false,
      price: '190,00',
    },
  })

  const onSubmit = (data: CreateLinkFormData) => {
    console.log('Form data:', data)
    // TODO: Implementar criação do link
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
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
                Criar novo link
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
                    options={checkoutOptions}
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
                    <button
                      type="button"
                      onClick={() => setIsFreeOffer(!isFreeOffer)}
                      className={`w-8 h-5 rounded-full duration-300 transition-colors ${
                      isFreeOffer
? 'bg-green-secondary-500'
: 'bg-neutral-300'
                    } relative cursor-pointer`}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full absolute top-1 duration-300 transition-all ${
                      isFreeOffer
? 'right-1'
: 'left-1'
                    }`}
                      />
                    </button>
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
                  <TextField
                    {...register('price')}
                    placeholder="R$ 190,00"
                    error={errors.price?.message}
                    disabled={isFreeOffer}
                  />
                </div>

              </div>

              {/* Botão de criar - Fixo no final */}
              <div className="px-8 py-6 flex-shrink-0">
                <Button
                  type="submit"
                  variant="primary"
                  size="full"
                  className="w-full"
                >
                  Criar novo link
                </Button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
