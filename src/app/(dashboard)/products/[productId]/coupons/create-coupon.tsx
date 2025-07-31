import * as Dialog from '@radix-ui/react-dialog'
import * as Checkbox from '@radix-ui/react-checkbox'
import { Button } from '@/components/button'
import { MaskedTextField, TextField } from '@/components/textfield'
import { Option } from '@/components/option'
import { XCircleIcon, CheckIcon, CoinIcon, PercentIcon, CalendarIcon, UserIcon } from '@phosphor-icons/react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { Switch } from '@/components/switch'
import { useApi } from '@/hooks/useApi'
import { PriceField } from '@/components/price-field'
import { Coupon } from '@/@types/coupon'

// Schema de validação
const couponSchema = z.object({
  name: z.string().min(1, 'Nome do cupom é obrigatório'),
  status: z.boolean(),
  code: z.string().min(1, 'Código do cupom é obrigatório'),
  discountType: z.enum(['FIXED', 'PERCENTAGE']),
  discountValue: z.number().min(1, 'Valor do desconto é obrigatório'),
  expirationDate: z.string().optional(),
  noExpiration: z.boolean(),
  usageLimit: z.string().min(1, 'Limite de uso é obrigatório'),
  noLimit: z.boolean(),
})

type CouponFormData = z.infer<typeof couponSchema>

interface CouponModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string
  onCouponCreated: () => void
  mode: 'create' | 'edit'
  couponToEdit?: Coupon | null
}

export function CouponModal({ open, onOpenChange, productId, onCouponCreated, mode, couponToEdit }: CouponModalProps) {
  const [isStatusActive, setIsStatusActive] = useState(true)
  const [noExpiration, setNoExpiration] = useState(false)
  const [noLimit, setNoLimit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { post, put } = useApi()

  const { register, handleSubmit, formState: { errors }, control, reset, watch } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      name: mode === 'edit' && couponToEdit
        ? couponToEdit.name
        : '',
      status: mode === 'edit' && couponToEdit
        ? couponToEdit.isActive
        : true,
      code: mode === 'edit' && couponToEdit
        ? couponToEdit.code
        : 'ZHEX10',
      discountType: mode === 'edit' && couponToEdit
        ? couponToEdit.discountType
        : 'FIXED',
      discountValue: mode === 'edit' && couponToEdit
        ? couponToEdit.discountValue
        : 0,
      expirationDate: mode === 'edit' && couponToEdit && couponToEdit.expiresAt
        ? new Date(couponToEdit.expiresAt).toLocaleDateString('pt-BR').split('/').reverse().join('-')
        : '',
      noExpiration: mode === 'edit' && couponToEdit
        ? !couponToEdit.expiresAt
        : false,
      usageLimit: mode === 'edit' && couponToEdit && couponToEdit.usageLimit
        ? couponToEdit.usageLimit.toString()
        : '0',
      noLimit: mode === 'edit' && couponToEdit
        ? !couponToEdit.usageLimit
        : false,
    },
  })

  // Resetar formulário quando modal abre/fecha ou muda o modo
  useEffect(() => {
    if (open) {
      reset({
        name: mode === 'edit' && couponToEdit
          ? couponToEdit.name
          : '',
        status: mode === 'edit' && couponToEdit
          ? couponToEdit.isActive
          : true,
        code: mode === 'edit' && couponToEdit
          ? couponToEdit.code
          : 'ZHEX10',
        discountType: mode === 'edit' && couponToEdit
          ? couponToEdit.discountType
          : 'FIXED',
        discountValue: mode === 'edit' && couponToEdit
          ? couponToEdit.discountValue
          : 0,
        expirationDate: mode === 'edit' && couponToEdit && couponToEdit.expiresAt
          ? new Date(couponToEdit.expiresAt).toLocaleDateString('pt-BR').split('/').reverse().join('-')
          : '',
        noExpiration: mode === 'edit' && couponToEdit
          ? !couponToEdit.expiresAt
          : false,
        usageLimit: mode === 'edit' && couponToEdit && couponToEdit.usageLimit
          ? couponToEdit.usageLimit.toString()
          : '0',
        noLimit: mode === 'edit' && couponToEdit
          ? !couponToEdit.usageLimit
          : false,
      })
      setIsStatusActive(mode === 'edit' && couponToEdit
        ? couponToEdit.isActive
        : true)
      setNoExpiration(mode === 'edit' && couponToEdit
        ? !couponToEdit.expiresAt
        : false)
      setNoLimit(mode === 'edit' && couponToEdit
        ? !couponToEdit.usageLimit
        : false)
    }
  }, [open, mode, couponToEdit, reset])

  const onSubmit = async (data: CouponFormData) => {
    try {
      setLoading(true)

      // Converter valor do desconto
      const discountValue = data.discountValue

      if (mode === 'create') {
        const response = await post<{ success: boolean; message: string }>(`/products/${productId}/coupons`, {
          name: data.name,
          code: data.code,
          discountType: data.discountType,
          discountValue,
          isActive: isStatusActive,
          usageLimit: noLimit
            ? undefined
            : parseInt(data.usageLimit),
          expiresAt: noExpiration
            ? undefined
            : data.expirationDate,
        })

        if (response.data.success) {
          onCouponCreated()
          onOpenChange(false)
          setError(null)
        } else {
          setError(response.data.message)
        }
      } else if (mode === 'edit' && couponToEdit) {
        const response = await put<{ success: boolean; message: string }>(`/products/${productId}/coupons/${couponToEdit.id}`, {
          name: data.name,
          code: data.code,
          discountType: data.discountType,
          discountValue,
          isActive: isStatusActive,
          usageLimit: noLimit
            ? undefined
            : parseInt(data.usageLimit),
          expiresAt: noExpiration
            ? undefined
            : data.expirationDate,
        })

        if (response.data.success) {
          onCouponCreated()
          onOpenChange(false)
          setError(null)
        } else {
          setError(response.data.message)
        }
      }
    } catch (error) {
      console.error(`Erro ao ${mode === 'create'
? 'criar'
: 'editar'} cupom:`, error)
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
                  ? 'Criar nova cupom de desconto'
                  : 'Editar cupom'}
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
                    <Controller
                      control={control}
                      name="discountType"
                      render={({ field }) => (
                        <Option
                          label="Valor em reais"
                          icon={CoinIcon}
                          selected={field.value === 'FIXED'}
                          onSelect={() => field.onChange('FIXED')}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="discountType"
                      render={({ field }) => (
                        <Option
                          label="Porcentagem"
                          icon={PercentIcon}
                          selected={field.value === 'PERCENTAGE'}
                          onSelect={() => field.onChange('PERCENTAGE')}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Desconto de */}
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                    Desconto de:
                  </label>

                  {watch('discountType') === 'FIXED'
                    ? (
                      <PriceField
                        control={control}
                        name="discountValue"
                        withoutCurrencySelector
                        placeholder="00,00"
                        error={errors.discountValue?.message}
                      />
                      )
                    : (
                      <TextField
                        {...register('discountValue', { valueAsNumber: true })}
                        placeholder="00%"
                        type="number"
                        max={100}
                        min={1}
                        error={errors.discountValue?.message}
                      />
                      )}
                </div>

                {/* Vencimento */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                      Vencimento:
                    </label>
                    <MaskedTextField
                      mask="00/00/0000"
                      control={control}
                      name="expirationDate"
                      leftIcon={<CalendarIcon size={20} weight="bold" />}
                      placeholder="00/00/0000"
                      error={errors.expirationDate?.message}
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

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
              </div>

              {/* Botão de criar/editar - Fixo no final */}
              <div className="px-8 py-6 flex-shrink-0">
                <Button
                  type="submit"
                  variant="primary"
                  size="full"
                  className="w-full"
                  loading={loading}
                >
                  {mode === 'create'
                    ? 'Criar novo cupom'
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
