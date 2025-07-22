import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/button'
import { TextField, SelectField } from '@/components/textfield'
import { XCircleIcon, PlusIcon } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Switch } from '@/components/switch'

// Schema de validação
const createSubscriptionSchema = z.object({
  name: z.string().min(1, 'Nome da assinatura é obrigatório'),
  status: z.boolean(),
  plan: z.string().min(1, 'Selecione um plano'),
  price: z.string().min(1, 'Preço é obrigatório').refine((val) => {
    const price = parseFloat(val.replace(/[^\d,]/g, '').replace(',', '.'))
    return !isNaN(price) && price > 0
  }, 'Preço deve ser um valor válido'),
  freeTrial: z.boolean(),
  trialDuration: z.string().optional(),
  paymentLinks: z.array(z.string()).min(1, 'Pelo menos um link de pagamento é obrigatório'),
})

type CreateSubscriptionFormData = z.infer<typeof createSubscriptionSchema>

interface CreatePlanModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const planOptions = [
  { value: 'mensal', label: 'Mensal' },
  { value: 'semestral', label: 'Semestral' },
  { value: 'anual', label: 'Anual' },
]

const trialOptions = [
  { value: '7-dias', label: '7 dias de gratuidade' },
  { value: '14-dias', label: '14 dias de gratuidade' },
  { value: '30-dias', label: '30 dias de gratuidade' },
]

export function CreatePlanModal({ open, onOpenChange }: CreatePlanModalProps) {
  const [isStatusActive, setIsStatusActive] = useState(true)
  const [isFreeTrialActive, setIsFreeTrialActive] = useState(true)
  const [paymentLinks, setPaymentLinks] = useState(['https://designdodiadia.com.br/pro...'])

  const { control, register, handleSubmit, formState: { errors } } = useForm<CreateSubscriptionFormData>({
    resolver: zodResolver(createSubscriptionSchema),
    defaultValues: {
      name: 'Assinatura #001',
      status: true,
      plan: 'mensal',
      price: '190,00',
      freeTrial: true,
      trialDuration: '7-dias',
      paymentLinks: ['https://designdodiadia.com.br/pro...'],
    },
  })

  const onSubmit = (data: CreateSubscriptionFormData) => {
    console.log('Form data:', data)
    // TODO: Implementar criação da assinatura
    onOpenChange(false)
  }

  const addPaymentLink = () => {
    setPaymentLinks([...paymentLinks, ''])
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
                Criar nova assinatura
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
                  <Switch active={isStatusActive} setValue={setIsStatusActive} />
                </div>

                {/* Planos de assinatura */}
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                    Planos de assinatura:
                  </label>
                  <p className="text-neutral-600 text-sm mb-3">
                    Você pode criar uma assinatura com um ou mais planos. Essas opções estarão disponíveis para o comprador no Checkout.
                  </p>
                  <SelectField
                    name="plan"
                    control={control}
                    options={planOptions}
                    placeholder="Selecione o plano"
                    error={errors.plan?.message}
                  />
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
                  />
                </div>

                {/* Free Trial */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-neutral-1000 font-medium font-araboto text-base">
                      Free Trial:
                    </label>
                    <Switch active={isFreeTrialActive} setValue={setIsFreeTrialActive} />
                  </div>
                  {isFreeTrialActive && (
                    <SelectField
                      name="trialDuration"
                      control={control}
                      options={trialOptions}
                      placeholder="Selecione a duração"
                      error={errors.trialDuration?.message}
                    />
                  )}
                </div>

                {/* Links de pagamento */}
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                    Links de pagamento:
                  </label>
                  <p className="text-neutral-600 text-sm mb-3">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  {paymentLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <TextField
                        value={link}
                        onChange={(e) => {
                          const newLinks = [...paymentLinks]
                          newLinks[index] = e.target.value
                          setPaymentLinks(newLinks)
                        }}
                        placeholder="https://exemplo.com.br/..."
                        className="flex-1"
                      />
                      {index === paymentLinks.length - 1 && (
                        <button
                          type="button"
                          onClick={addPaymentLink}
                          className="w-10 h-10 bg-zhex-base-500 text-white rounded-lg flex items-center justify-center hover:bg-zhex-base-600 transition-colors flex-shrink-0"
                        >
                          <PlusIcon size={20} />
                        </button>
                      )}
                    </div>
                  ))}
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
                  Criar nova assinatura
                </Button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
