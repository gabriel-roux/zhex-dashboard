import * as Dialog from '@radix-ui/react-dialog'
import * as Checkbox from '@radix-ui/react-checkbox'
import { Button } from '@/components/button'
import { TextField } from '@/components/textfield'
import { Option } from '@/components/option'
import { XCircleIcon, CheckIcon, CoinIcon, PercentIcon, CalendarIcon, UserIcon } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Switch } from '@/components/switch'

// Schema de validação
const createCouponSchema = z.object({
  name: z.string().min(1, 'Nome do cupom é obrigatório'),
  status: z.boolean(),
  code: z.string().min(1, 'Código do cupom é obrigatório'),
  discountType: z.enum(['value', 'percentage']),
  discountValue: z.string().min(1, 'Valor do desconto é obrigatório'),
  expirationDate: z.string().optional(),
  noExpiration: z.boolean(),
  usageLimit: z.string().min(1, 'Limite de uso é obrigatório'),
  noLimit: z.boolean(),
})

type CreateCouponFormData = z.infer<typeof createCouponSchema>

interface CreateCouponModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCouponModal({ open, onOpenChange }: CreateCouponModalProps) {
  const [isStatusActive, setIsStatusActive] = useState(true)
  const [discountType, setDiscountType] = useState<'value' | 'percentage'>('value')
  const [noExpiration, setNoExpiration] = useState(false)
  const [noLimit, setNoLimit] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<CreateCouponFormData>({
    resolver: zodResolver(createCouponSchema),
    defaultValues: {
      name: '',
      status: true,
      code: 'ZHEX10',
      discountType: 'value',
      discountValue: '00,00',
      expirationDate: '',
      noExpiration: false,
      usageLimit: '0',
      noLimit: false,
    },
  })

  const onSubmit = (data: CreateCouponFormData) => {
    console.log('Form data:', data)
    // TODO: Implementar criação do cupom
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
                Criar nova cupom de desconto
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
                {/* Nome do cupom */}
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                    Nome do cupom:
                  </label>
                  <TextField
                    {...register('name')}
                    placeholder="Digite o nome do cupom"
                    error={errors.name?.message}
                  />
                </div>

                {/* Status do cupom */}
                <div className="flex items-center justify-between">
                  <label className="text-neutral-1000 font-medium font-araboto text-base">
                    Status do cupom:
                  </label>
                  <Switch active={isStatusActive} setValue={setIsStatusActive} />
                </div>

                {/* Código do cupom */}
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                    Código do cupom:
                  </label>
                  <TextField
                    {...register('code')}
                    placeholder="ZHEX10"
                    error={errors.code?.message}
                  />
                </div>

                {/* Regras para aplicação de cupom */}
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                    Regras para aplicação de cupom:
                  </label>
                  <p className="text-neutral-600 text-sm mb-3">
                    There are many variations of passages of Lorem Ipsum available.
                  </p>
                  <div className="flex gap-3">
                    <Option
                      label="Valor em reais"
                      icon={CoinIcon}
                      selected={discountType === 'value'}
                      onSelect={() => setDiscountType('value')}
                    />
                    <Option
                      label="Porcentagem"
                      icon={PercentIcon}
                      selected={discountType === 'percentage'}
                      onSelect={() => setDiscountType('percentage')}
                    />
                  </div>
                </div>

                {/* Desconto de */}
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                    Desconto de:
                  </label>
                  <TextField
                    {...register('discountValue')}
                    placeholder={discountType === 'value'
                      ? 'R$ 00,00'
                      : '00%'}
                    error={errors.discountValue?.message}
                  />
                </div>

                {/* Vencimento */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                      Vencimento:
                    </label>
                    <TextField
                      {...register('expirationDate')}
                      leftIcon={<CalendarIcon size={20} weight="bold" />}
                      placeholder="00/00/0000"
                      disabled={noExpiration}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <Checkbox.Root
                        checked={noExpiration}
                        onCheckedChange={(checked: boolean | 'indeterminate') => setNoExpiration(checked === true)}
                        className="w-4 h-4 rounded border border-neutral-300 flex items-center justify-center data-[state=checked]:bg-zhex-base-500 data-[state=checked]:border-zhex-base-500"
                      >
                        <Checkbox.Indicator>
                          <CheckIcon size={12} className="text-white" />
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                      <label className="text-neutral-600 text-sm">Não há vencimento</label>
                    </div>
                  </div>

                  {/* Limite de uso */}
                  <div>
                    <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                      Limite de uso:
                    </label>
                    <TextField
                      {...register('usageLimit')}
                      leftIcon={<UserIcon size={20} weight="bold" />}
                      placeholder="0"
                      disabled={noLimit}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <Checkbox.Root
                        checked={noLimit}
                        onCheckedChange={(checked: boolean | 'indeterminate') => setNoLimit(checked === true)}
                        className="w-4 h-4 rounded border border-neutral-300 flex items-center justify-center data-[state=checked]:bg-zhex-base-500 data-[state=checked]:border-zhex-base-500"
                      >
                        <Checkbox.Indicator>
                          <CheckIcon size={12} className="text-white" />
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                      <label className="text-neutral-600 text-sm">Não há limite</label>
                    </div>
                  </div>
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
                  Criar novo cupom
                </Button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
