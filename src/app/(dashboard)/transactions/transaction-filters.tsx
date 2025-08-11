import * as Dialog from '@radix-ui/react-dialog'
import * as Checkbox from '@radix-ui/react-checkbox'
import { Button } from '@/components/button'
import { TextField } from '@/components/textfield'
import { SwitchButton } from '@/components/switch-button'
import { XCircleIcon, CheckIcon, CalendarIcon, FunnelSimpleIcon, UserIcon } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Switch } from '@/components/switch'
import { useApi } from '@/hooks/useApi'
import { PriceField } from '@/components/price-field'

// Schema de validação para filtros
const filterSchema = z.object({
  // Datas
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  dateRange: z.string().optional(), // "today", "yesterday", "last_7_days", etc.

  // Status das transações
  statuses: z.array(z.string()).optional(),

  // Dados do cliente
  customerName: z.string().optional(),
  customerEmail: z.string().optional(),

  // Dados de pagamento
  paymentMethods: z.array(z.string()).optional(), // credit_card, pix, boleto
  cardBrands: z.array(z.string()).optional(), // visa, mastercard, etc.

  // Valores
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),

  // Produtos
  products: z.array(z.string()).optional(),
  productTypes: z.array(z.string()).optional(), // 'PHYSICAL' | 'DIGITAL'
  productClasses: z.array(z.string()).optional(), // 'SUBSCRIPTION' | 'ONE_TIME'

  // Subscription filters
  isSubscription: z.boolean().optional(),
  subscriptionChargeTypes: z.array(z.string()).optional(), // 'INITIAL' | 'RENEWAL' | 'RETRY'

  // UTM Tracking
  utmSource: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmMedium: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  src: z.string().optional(),
  sck: z.string().optional(),
})

export type FilterFormData = z.infer<typeof filterSchema>

interface TransactionFiltersProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFiltersApplied: (filters: FilterFormData) => void
  initialFilters?: Partial<FilterFormData>
}

const dateRangeOptions = [
  { label: 'Hoje', value: 'today' },
  { label: 'Ontem', value: 'yesterday' },
  { label: 'Últimos 7 dias', value: 'last_7_days' },
]

const dateRangeOptions2 = [
  { label: 'Últimos 30 dias', value: 'last_30_days' },
  { label: 'Últimos 90 dias', value: 'last_90_days' },
  { label: 'Últimos 12 meses', value: 'last_12_months' },
]

const transactionStatuses = [
  { label: 'Inicializado', value: 'INITIALIZED' },
  { label: 'Processando', value: 'PROCESSING' },
  { label: 'Concluído', value: 'COMPLETED' },
  { label: 'Falhada/Rejeitada', value: 'FAILED' },
  { label: 'Cancelado', value: 'CANCELLED' },
  { label: 'Reembolsado', value: 'REFUNDED' },
  { label: 'Chargeback', value: 'CHARGEBACK' },
  { label: 'Alerta de Chargeback', value: 'CHARGEBACK_ALERT' },
]

const paymentMethodOptions = [
  { label: 'Cartão de Crédito', value: 'credit_card' },
  { label: 'PIX', value: 'pix' },
  { label: 'Boleto', value: 'boleto' },
  { label: 'Cartão de Débito', value: 'debit_card' },
  { label: 'Apple Pay', value: 'apple_pay' },
  { label: 'Google Pay', value: 'google_pay' },
]

const cardBrandOptions = [
  { label: 'Visa', value: 'visa' },
  { label: 'Mastercard', value: 'mastercard' },
  { label: 'Elo', value: 'elo' },
  { label: 'American Express', value: 'amex' },
  { label: 'Hipercard', value: 'hipercard' },
  { label: 'Diners Club', value: 'diners' },
]

const productTypeOptions = [
  { label: 'Pagamento Único', value: 'ONE_TIME' },
  { label: 'Pagamento Recorrente', value: 'RECURRING' },
]

const productClassOptions = [
  { label: 'Produto Físico', value: 'PHYSICAL' },
  { label: 'Produto Digital', value: 'DIGITAL' },
]

const subscriptionChargeTypeOptions = [
  { label: 'Primeira Cobrança', value: 'INITIAL' },
  { label: 'Renovação', value: 'RENEWAL' },
  { label: 'Tentativa', value: 'RETRY' },
]

export function TransactionFilters({ open, onOpenChange, onFiltersApplied, initialFilters }: TransactionFiltersProps) {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Array<{ id: string; name: string; logo?: string }>>([])
  const { get } = useApi()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    getValues,
  } = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
      dateRange: '',
      statuses: [],
      customerName: '',
      customerEmail: '',
      paymentMethods: [],
      cardBrands: [],
      minAmount: undefined,
      maxAmount: undefined,
      products: [],
      productTypes: [],
      productClasses: [],
      isSubscription: undefined,
      subscriptionChargeTypes: [],
      utmSource: '',
      utmCampaign: '',
      utmMedium: '',
      utmTerm: '',
      utmContent: '',
      src: '',
      sck: '',
      ...initialFilters,
    },
  })

  const isSubscriptionValue = watch('isSubscription')

  // Carregar produtos para o filtro
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await get<{
          success: boolean;
          data?: Array<{
            id: string;
            name: string;
            logo?: string;
          }>
        }>('/products')
        if (response.data.success && response.data.data) {
          setProducts(response.data.data)
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
      }
    }

    if (open) {
      loadProducts()
    }
  }, [open, get])

  // Resetar formulário quando modal abre/fecha
  useEffect(() => {
    if (open && initialFilters) {
      reset(initialFilters as FilterFormData)
    }
  }, [open, initialFilters, reset])

  const onSubmit = async (data: FilterFormData) => {
    try {
      setLoading(true)

      // Remover campos vazios
      const cleanedData = Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(data).filter(([_, value]) => {
          if (typeof value === 'string') return value.trim() !== ''
          if (Array.isArray(value)) return value.length > 0
          if (typeof value === 'boolean') return value !== undefined
          return value !== null && value !== undefined
        }),
      ) as FilterFormData

      console.log('Filtros aplicados:', cleanedData)
      onFiltersApplied(cleanedData)
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao aplicar filtros:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClearFilters = () => {
    const defaultValues = {
      startDate: '',
      endDate: '',
      dateRange: '',
      statuses: [],
      customerName: '',
      customerEmail: '',
      paymentMethods: [],
      cardBrands: [],
      minAmount: undefined,
      maxAmount: undefined,
      products: [],
      productTypes: [],
      productClasses: [],
      isSubscription: undefined,
      subscriptionChargeTypes: [],
      utmSource: '',
      utmCampaign: '',
      utmMedium: '',
      utmTerm: '',
      utmContent: '',
      src: '',
      sck: '',
    }
    reset(defaultValues)
    onFiltersApplied({} as FilterFormData)
    onOpenChange(false)
  }

  const handleStatusToggle = (status: string) => {
    const currentStatuses = getValues('statuses') || []
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status]
    setValue('statuses', newStatuses)
  }

  const handlePaymentMethodToggle = (method: string) => {
    const currentMethods = getValues('paymentMethods') || []
    const newMethods = currentMethods.includes(method)
      ? currentMethods.filter(m => m !== method)
      : [...currentMethods, method]
    setValue('paymentMethods', newMethods)
  }

  const handleCardBrandToggle = (brand: string) => {
    const currentBrands = getValues('cardBrands') || []
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand]
    setValue('cardBrands', newBrands)
  }

  const handleProductToggle = (productId: string) => {
    const currentProducts = getValues('products') || []
    const newProducts = currentProducts.includes(productId)
      ? currentProducts.filter(p => p !== productId)
      : [...currentProducts, productId]
    setValue('products', newProducts)
  }

  const handleProductTypeToggle = (type: string) => {
    const currentTypes = getValues('productTypes') || []
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type]
    setValue('productTypes', newTypes)
  }

  const handleProductClassToggle = (productClass: string) => {
    const currentClasses = getValues('productClasses') || []
    const newClasses = currentClasses.includes(productClass)
      ? currentClasses.filter(c => c !== productClass)
      : [...currentClasses, productClass]
    setValue('productClasses', newClasses)
  }

  const handleSubscriptionChargeTypeToggle = (chargeType: string) => {
    const currentTypes = getValues('subscriptionChargeTypes') || []
    const newTypes = currentTypes.includes(chargeType)
      ? currentTypes.filter(t => t !== chargeType)
      : [...currentTypes, chargeType]
    setValue('subscriptionChargeTypes', newTypes)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-neutral-1000/50 backdrop-blur-sm z-50" />
        <Dialog.Content
          style={{
            maxWidth: 600,
            right: 0,
            top: 0,
          }}
          className="fixed right-0 top-0 h-full w-[600px] bg-white shadow-2xl z-50 flex flex-col"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-200 flex-shrink-0">
              <div className="flex items-center gap-3">
                <FunnelSimpleIcon size={24} weight="bold" className="text-zhex-base-500" />
                <Dialog.Title className="text-lg font-araboto font-medium text-neutral-1000">
                  Filtros Avançados
                </Dialog.Title>
              </div>
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
              <div className="flex-1 px-8 py-6 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)]">

                {/* Período de Data */}
                <div className="border-b border-neutral-200 pb-6">
                  <h3 className="text-neutral-1000 font-medium font-araboto text-base mb-4">Período</h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-neutral-600 text-sm mb-2 block">Data inicial:</label>
                        <TextField
                          {...register('startDate')}
                          type="date"
                          leftIcon={<CalendarIcon size={20} weight="bold" />}
                        />
                      </div>
                      <div>
                        <label className="text-neutral-600 text-sm mb-2 block">Data final:</label>
                        <TextField
                          {...register('endDate')}
                          type="date"
                          leftIcon={<CalendarIcon size={20} weight="bold" />}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <SwitchButton
                        items={dateRangeOptions.map(opt => opt.label)}
                        active={dateRangeOptions.find(opt => opt.value === watch('dateRange'))?.label || ''}
                        onChange={(label) => {
                          const option = dateRangeOptions.find(opt => opt.label === label)
                          setValue('dateRange', option?.value || '')
                        }}
                      />

                      <SwitchButton
                        items={dateRangeOptions2.map(opt => opt.label)}
                        active={dateRangeOptions2.find(opt => opt.value === watch('dateRange'))?.label || ''}
                        onChange={(label) => {
                          const option = dateRangeOptions2.find(opt => opt.label === label)
                          setValue('dateRange', option?.value || '')
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Status das Transações */}
                <div className="border-b border-neutral-200 pb-6">
                  <h3 className="text-neutral-1000 font-medium font-araboto text-base mb-4">Status</h3>

                  <div className="space-y-3">
                    {transactionStatuses.map((status) => (
                      <div key={status.value} className="flex items-center justify-between">
                        <span className="text-neutral-600 text-sm">{status.label}</span>
                        <Switch
                          active={(watch('statuses') || []).includes(status.value)}
                          setValue={() => handleStatusToggle(status.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dados do Cliente */}
                <div className="border-b border-neutral-200 pb-6">
                  <h3 className="text-neutral-1000 font-medium font-araboto text-base mb-4">Cliente</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-neutral-600 text-sm mb-2 block">Nome do cliente:</label>
                      <TextField
                        {...register('customerName')}
                        placeholder="Digite o nome do cliente"
                        leftIcon={<UserIcon size={20} weight="bold" />}
                      />
                    </div>

                    <div>
                      <label className="text-neutral-600 text-sm mb-2 block">E-mail do cliente:</label>
                      <TextField
                        {...register('customerEmail')}
                        type="email"
                        placeholder="Digite o e-mail do cliente"
                      />
                    </div>
                  </div>
                </div>

                {/* Produtos */}
                <div className="border-b border-neutral-200 pb-6">
                  <h3 className="text-neutral-1000 font-medium font-araboto text-base mb-4">Produtos</h3>

                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {products && products.length > 0
                      ? products.map((product) => (
                        <div key={product.id} className="flex items-center gap-3">
                          <Checkbox.Root
                            checked={(watch('products') || []).includes(product.id)}
                            onCheckedChange={() => handleProductToggle(product.id)}
                            className="w-4 h-4 rounded border border-neutral-300 flex items-center justify-center data-[state=checked]:bg-zhex-base-500 data-[state=checked]:border-zhex-base-500"
                          >
                            <Checkbox.Indicator>
                              <CheckIcon size={12} className="text-white" />
                            </Checkbox.Indicator>
                          </Checkbox.Root>
                          {product.logo && (
                            <img
                              src={product.logo}
                              alt={product.name}
                              className="w-8 h-8 rounded object-cover flex-shrink-0"
                            />
                          )}
                          <label className="text-neutral-600 text-sm truncate" title={product.name}>
                            {product.name}
                          </label>
                        </div>
                        ))
                      : (
                        <div className="text-center py-4">
                          <p className="text-neutral-500 text-sm">Nenhum produto encontrado</p>
                        </div>
                        )}
                  </div>
                </div>

                {/* Tipos de Produto */}
                <div className="border-b border-neutral-200 pb-6">
                  <h3 className="text-neutral-1000 font-medium font-araboto text-base mb-4">Tipo de Produto</h3>

                  <div className="space-y-3">
                    {productTypeOptions.map((type) => (
                      <div key={type.value} className="flex items-center justify-between">
                        <span className="text-neutral-600 text-sm">{type.label}</span>
                        <Switch
                          active={(watch('productTypes') || []).includes(type.value)}
                          setValue={() => handleProductTypeToggle(type.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Classe de Produto */}
                <div className="border-b border-neutral-200 pb-6">
                  <h3 className="text-neutral-1000 font-medium font-araboto text-base mb-4">Classe de Produto</h3>

                  <div className="space-y-3">
                    {productClassOptions.map((productClass) => (
                      <div key={productClass.value} className="flex items-center justify-between">
                        <span className="text-neutral-600 text-sm">{productClass.label}</span>
                        <Switch
                          active={(watch('productClasses') || []).includes(productClass.value)}
                          setValue={() => handleProductClassToggle(productClass.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filtros de Assinatura */}
                <div className="border-b border-neutral-200 pb-6">
                  <h3 className="text-neutral-1000 font-medium font-araboto text-base mb-4">Assinaturas</h3>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <span className="text-neutral-600 text-sm">Apenas Assinaturas</span>
                        {isSubscriptionValue === true && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Sim</span>
                        )}
                        {isSubscriptionValue === false && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Não</span>
                        )}
                        {isSubscriptionValue === undefined && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Todos</span>
                        )}
                      </div>
                      <SwitchButton
                        items={['Sim', 'Não', 'Todos']}
                        active={useMemo(() => {
                          if (isSubscriptionValue === true) return 'Sim'
                          if (isSubscriptionValue === false) return 'Não'
                          return 'Todos'
                        }, [isSubscriptionValue])}
                        onChange={useCallback((label) => {
                          if (label === 'Sim') {
                            setValue('isSubscription', true)
                          } else if (label === 'Não') {
                            setValue('isSubscription', false)
                          } else {
                            setValue('isSubscription', undefined)
                          }
                        }, [setValue])}
                      />
                    </div>

                    <div className="space-y-3">
                      <span className="text-neutral-600 text-sm font-medium">Tipo de Cobrança:</span>
                      {subscriptionChargeTypeOptions.map((chargeType) => (
                        <div key={chargeType.value} className="flex items-center justify-between pl-4">
                          <span className="text-neutral-600 text-sm">{chargeType.label}</span>
                          <Switch
                            active={(watch('subscriptionChargeTypes') || []).includes(chargeType.value)}
                            setValue={() => handleSubscriptionChargeTypeToggle(chargeType.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Métodos de Pagamento */}
                <div className="border-b border-neutral-200 pb-6">
                  <h3 className="text-neutral-1000 font-medium font-araboto text-base mb-4">Métodos de Pagamento</h3>

                  <div className="space-y-3">
                    {paymentMethodOptions.map((method) => (
                      <div key={method.value} className="flex items-center justify-between">
                        <span className="text-neutral-600 text-sm">{method.label}</span>
                        <Switch
                          active={(watch('paymentMethods') || []).includes(method.value)}
                          setValue={() => handlePaymentMethodToggle(method.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bandeiras de Cartão */}
                <div className="border-b border-neutral-200 pb-6">
                  <h3 className="text-neutral-1000 font-medium font-araboto text-base mb-4">Bandeiras de Cartão</h3>

                  <div className="space-y-3">
                    {cardBrandOptions.map((brand) => (
                      <div key={brand.value} className="flex items-center justify-between">
                        <span className="text-neutral-600 text-sm">{brand.label}</span>
                        <Switch
                          active={(watch('cardBrands') || []).includes(brand.value)}
                          setValue={() => handleCardBrandToggle(brand.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Valores */}
                <div className="border-b border-neutral-200 pb-6">
                  <h3 className="text-neutral-1000 font-medium font-araboto text-base mb-4">Valores</h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-neutral-600 text-sm mb-2 block">Valor mínimo:</label>
                      <PriceField
                        control={control}
                        name="minAmount"
                        withoutCurrencySelector
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-600 text-sm mb-2 block">Valor máximo:</label>
                      <PriceField
                        control={control}
                        name="maxAmount"
                        withoutCurrencySelector
                        placeholder="1.000,00"
                      />
                    </div>
                  </div>
                </div>

                {/* UTM Tracking */}
                <div className="pb-6">
                  <h3 className="text-neutral-1000 font-medium font-araboto text-base mb-4">Tracking UTM</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-neutral-600 text-sm mb-2 block">UTM Source:</label>
                      <TextField
                        {...register('utmSource')}
                        placeholder="Ex: google, facebook"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-600 text-sm mb-2 block">UTM Campaign:</label>
                      <TextField
                        {...register('utmCampaign')}
                        placeholder="Ex: summer_sale"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-600 text-sm mb-2 block">UTM Medium:</label>
                      <TextField
                        {...register('utmMedium')}
                        placeholder="Ex: email, social"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-600 text-sm mb-2 block">UTM Term:</label>
                      <TextField
                        {...register('utmTerm')}
                        placeholder="Ex: curso+online"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-600 text-sm mb-2 block">UTM Content:</label>
                      <TextField
                        {...register('utmContent')}
                        placeholder="Ex: banner_topo"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-600 text-sm mb-2 block">SRC:</label>
                      <TextField
                        {...register('src')}
                        placeholder="Source parameter"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-600 text-sm mb-2 block">SCK:</label>
                      <TextField
                        {...register('sck')}
                        placeholder="Sub-campaign key"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Botões - Fixo no final */}
              <div className="px-8 py-6 flex-shrink-0 border-t border-neutral-200">
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="full"
                    className="flex-1"
                    onClick={handleClearFilters}
                  >
                    Limpar Filtros
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="full"
                    className="flex-1"
                    loading={loading}
                  >
                    Aplicar Filtros
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
