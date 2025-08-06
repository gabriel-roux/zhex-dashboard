'use client'

import {
  TrashIcon,
  CaretDownIcon,
  CheckIcon,
} from '@phosphor-icons/react'
import { Button } from '@/components/button'
import { SelectField, Textarea, TextField } from '@/components/textfield'
import { Switch } from '@/components/switch'
import { ColorPicker } from '@/components/color-picker'
import { PriceField } from '@/components/price-field'
import { UseFormReturn } from 'react-hook-form'
import { OffersFormData, OrderBump } from '@/hooks/useCheckoutOffersForm'
import { useApi } from '@/hooks/useApi'
import { useCallback, useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { OrderBumpPreview } from './order-bump-preview'
import clsx from 'clsx'
import { ProductProps } from '@/@types/product'

interface OffersCheckoutProps {
  form: UseFormReturn<OffersFormData>
  orderBumps: OrderBump[]
  addOrderBump: () => void
  removeOrderBump: (id: string) => void
}

interface PaymentLink {
  id: string
  name: string
  slug: string
  isActive: boolean
  checkout: {
    id: string
    name: string
  }
  price: {
    id: string
    baseAmount: number
    baseCurrency: string
    paymentDescription: string
  }
}

export function OffersCheckout({
  form,
  orderBumps,
  addOrderBump,
  removeOrderBump,
}: OffersCheckoutProps) {
  const { register, watch, setValue, control, formState: { errors } } = form
  const { get } = useApi()
  const params = useParams()
  const productId = params.productId as string

  const [products, setProducts] = useState<ProductProps[]>([])
  const [productPaymentLinks, setProductPaymentLinks] = useState<Record<string, PaymentLink[]>>({})
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loadingPaymentLinks, setLoadingPaymentLinks] = useState<Record<string, boolean>>({})
  const [minimizedOrderBumps, setMinimizedOrderBumps] = useState<Set<string>>(new Set())
  const isUpdatingPricesRef = useRef(false)

  const timeOptions = Array.from({ length: 60 }, (_, i) => ({
    value: i.toString().padStart(2, '0'),
    label: i.toString().padStart(2, '0'),
  }))

  // Buscar produtos da empresa
  const fetchProducts = async () => {
    setLoadingProducts(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await get<any>('/products?page=1&limit=100')

      if (response.success && response.data) {
        // Filtrar apenas produtos ativos e diferentes do produto atual
        const products = response.data.data.products || response.data.data

        const filteredProducts = products.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (product: any) => product.status === 'ACTIVE' && product.id !== productId,
        )

        setProducts(filteredProducts)
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    } finally {
      setLoadingProducts(false)
    }
  }

  // Buscar links de pagamento de um produto específico
  const fetchPaymentLinksForProduct = useCallback(async (selectedProductId: string) => {
    setLoadingPaymentLinks(prev => ({ ...prev, [selectedProductId]: true }))
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await get<any>(`/products/${selectedProductId}/payment-links?page=1&limit=100`)

      if (response.success && response.data) {
        // Filtrar apenas links ativos
        const paymentLinks = response.data.data.paymentLinks
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const activeLinks = paymentLinks.filter((link: any) => link.isActive)
        setProductPaymentLinks(prev => ({
          ...prev,
          [selectedProductId]: activeLinks,
        }))
      }
    } catch (error) {
      console.error('Erro ao buscar links de pagamento:', error)
    } finally {
      setLoadingPaymentLinks(prev => ({ ...prev, [selectedProductId]: false }))
    }
  }, [get])

  // Carregar dados quando o componente montar
  useEffect(() => {
    if (productId) {
      fetchProducts()
    }
  }, [productId])

  // Buscar payment links quando um produto for selecionado
  useEffect(() => {
    orderBumps.forEach((orderBump, index) => {
      const currentProduct = watch(`orderBumps.${index}.product`)
      if (currentProduct && !productPaymentLinks[currentProduct] && !loadingPaymentLinks[currentProduct]) {
        fetchPaymentLinksForProduct(currentProduct)
      }
    })
  }, [orderBumps.map((_, index) => watch(`orderBumps.${index}.product`)), productPaymentLinks, loadingPaymentLinks]) // eslint-disable-line react-hooks/exhaustive-deps

  // Escutar mudanças diretas nos campos de produto do formulário
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && name.includes('.product')) {
        const match = name.match(/orderBumps\.(\d+)\.product/)
        if (match) {
          const index = parseInt(match[1])
          const productId = value.orderBumps?.[index]?.product

          if (productId && !productPaymentLinks[productId] && !loadingPaymentLinks[productId]) {
            fetchPaymentLinksForProduct(productId)
          }
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, fetchPaymentLinksForProduct, productPaymentLinks, loadingPaymentLinks])

  // Atualizar preço quando payment link for selecionado
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      // Evitar loop durante atualizações de preço
      if (isUpdatingPricesRef.current) return

      if (name && name.includes('.paymentLink')) {
        const match = name.match(/orderBumps\.(\d+)\.paymentLink/)
        if (match) {
          const index = parseInt(match[1])
          const paymentLinkId = value.orderBumps?.[index]?.paymentLink
          const productId = value.orderBumps?.[index]?.product

          if (paymentLinkId && productId) {
            const productLinks = productPaymentLinks[productId] || []
            const selectedLink = productLinks.find(link => link.id === paymentLinkId)

            if (selectedLink) {
              const priceInCents = selectedLink.price.baseAmount
              const currency = selectedLink.price.baseCurrency

              // Definir flag para evitar loops
              isUpdatingPricesRef.current = true

              // Usar setValue diretamente
              setValue(`orderBumps.${index}.priceTo`, priceInCents, { shouldValidate: false, shouldTouch: false })
              setValue(`orderBumps.${index}.currency`, currency, { shouldValidate: false, shouldTouch: false })

              // Resetar flag após um pequeno delay
              setTimeout(() => {
                isUpdatingPricesRef.current = false
              }, 100)
            }
          }
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, productPaymentLinks, setValue])

  // Limpar payment links quando o produto mudar
  useEffect(() => {
    orderBumps.forEach((orderBump, index) => {
      const currentProduct = watch(`orderBumps.${index}.product`)
      const currentPaymentLink = watch(`orderBumps.${index}.paymentLink`)

      // Se o produto mudou e ainda tem um payment link selecionado, limpe-o
      if (currentProduct !== orderBump.product && currentPaymentLink) {
        setValue(`orderBumps.${index}.paymentLink`, '')
      }
    })
  }, [orderBumps.map(ob => ob.product)]) // eslint-disable-line react-hooks/exhaustive-deps

  // Converter produtos para formato do SelectField
  const productOptions = products.map(product => ({
    value: product.id,
    label: product.name,
  }))

  // Função para obter as opções de payment links para um produto específico
  const getPaymentLinkOptionsForProduct = (selectedProductId: string) => {
    const links = productPaymentLinks[selectedProductId] || []
    return links.map(link => ({
      value: link.id,
      label: `${link.name} - ${link.price.paymentDescription}`,
    }))
  }

  // Função para verificar se um order bump está completo
  const isOrderBumpComplete = (orderBump: OrderBump) => {
    return orderBump.product && orderBump.paymentLink && orderBump.offer && orderBump.description && orderBump.priceTo && orderBump.priceTo > 0
  }

  // Função para alternar o estado minimizado de um order bump
  const toggleMinimized = (orderBumpId: string) => {
    setMinimizedOrderBumps(prev => {
      const newSet = new Set(prev)
      if (newSet.has(orderBumpId)) {
        newSet.delete(orderBumpId)
      } else {
        newSet.add(orderBumpId)
      }
      return newSet
    })
  }

  // Função para obter nome do produto
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId)
    return product?.name || 'Produto não encontrado'
  }

  // Função para obter URL da imagem do produto
  const getProductImageUrl = (productId: string) => {
    const product = products.find(p => p.id === productId)
    return product?.defaultImage?.fileUrl || ''
  }

  return (
    <div className="space-y-8">
      {/* Header com Toggle */}
      <div className="flex items-center gap-4">
        <Switch
          active={watch('enableTimer')}
          setValue={(value: boolean) => setValue('enableTimer', value)}
        />
        <span className="text-neutral-1000 font-medium font-araboto text-base">
          Habilitar Timer
        </span>
      </div>

      {/* Campos de Tempo */}
      {watch('enableTimer') && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-neutral-1000 font-medium font-araboto text-base block">
                Horas:
              </label>
              <div className="relative">
                <SelectField
                  options={timeOptions}
                  control={control}
                  name="hours"
                  placeholder="Horas"
                  error={errors.hours?.message}
                />
              </div>
            </div>

            <div>
              <label className="text-neutral-1000 font-medium font-araboto text-base block">
                Minutos:
              </label>
              <div className="relative">
                <SelectField
                  options={timeOptions}
                  control={control}
                  name="minutes"
                  placeholder="Minutos"
                  error={errors.minutes?.message}
                />
              </div>
            </div>

            <div>
              <label className="text-neutral-1000 font-medium font-araboto text-base block">
                Segundos:
              </label>
              <div className="relative">
                <SelectField
                  options={timeOptions}
                  control={control}
                  name="seconds"
                  placeholder="Segundos"
                  error={errors.seconds?.message}
                />
              </div>
            </div>
          </div>

          {/* Texto da oferta */}
          <div>
            <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
              Texto da oferta:
            </label>
            <Textarea
              {...register('offerText')}
              placeholder="Digite aqui"
              error={errors.offerText?.message}
            />
          </div>

          {/* Cores do card */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-neutral-1000 font-medium font-araboto text-base block">
                Cor do background:
              </label>
              <ColorPicker
                value={watch('timerBackgroundColor')}
                onChange={(color) => setValue('timerBackgroundColor', color)}
                error={errors.timerBackgroundColor?.message}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-neutral-1000 font-medium font-araboto text-base block">
                Cor da oferta:
              </label>
              <ColorPicker
                value={watch('timerTextColor')}
                onChange={(color) => setValue('timerTextColor', color)}
                error={errors.timerTextColor?.message}
              />
            </div>
          </div>

          {/* Cor do texto / Background */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-neutral-1000 font-medium font-araboto text-base block">
                Cor do texto do timer:
              </label>
              <ColorPicker
                value={watch('timerCountdownTextColor')}
                onChange={(color) => setValue('timerCountdownTextColor', color)}
                error={errors.timerCountdownTextColor?.message}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-neutral-1000 font-medium font-araboto text-base block">
                Cor do timer:
              </label>
              <ColorPicker
                value={watch('timerCountdownColor')}
                onChange={(color) => setValue('timerCountdownColor', color)}
                error={errors.timerCountdownColor?.message}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-neutral-1000 font-medium font-araboto text-base block">
                Cor da borda do timer:
              </label>
              <ColorPicker
                value={watch('timerCountdownBorderColor')}
                onChange={(color) => setValue('timerCountdownBorderColor', color)}
                error={errors.timerCountdownBorderColor?.message}
              />
            </div>
          </div>
        </>
      )}

      {/* Habilitar Order Bumps */}
      <div className="flex items-center gap-4">
        <Switch
          active={watch('enableOrderBumps')}
          setValue={(value: boolean) => setValue('enableOrderBumps', value)}
        />
        <span className="text-neutral-1000 font-medium font-araboto text-base">
          Habilitar Order Bumps
        </span>
      </div>

      {/* Preview dos Order Bumps */}
      {watch('enableOrderBumps') && orderBumps.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-neutral-1000 font-medium font-araboto text-base">
            Preview dos Order Bumps:
          </h3>
          <div
            className="p-6 rounded-lg"
          >
            <div className="grid grid-cols-1 gap-4">
              {orderBumps.map((orderBump, index) => {
                // Combinar dados do state com valores do formulário
                const formOrderBump = {
                  ...orderBump,
                  priceTo: watch(`orderBumps.${index}.priceTo`) || orderBump.priceTo,
                  currency: watch(`orderBumps.${index}.currency`) || orderBump.currency,
                  offer: watch(`orderBumps.${index}.offer`) || orderBump.offer,
                  description: watch(`orderBumps.${index}.description`) || orderBump.description,
                }

                return (
                  <OrderBumpPreview
                    key={orderBump.id}
                    orderBump={formOrderBump}
                    colors={watch()}
                    productImageUrl={getProductImageUrl(orderBump.product)}
                    productName={getProductName(orderBump.product)}
                  />
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Lista de Order Bumps */}
      {watch('enableOrderBumps') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-neutral-1000 font-medium font-araboto text-base">
              Order Bumps ({orderBumps.length})
            </h3>
          </div>

          {orderBumps.map((orderBump, index) => {
            const isComplete = isOrderBumpComplete(orderBump)
            const isMinimized = minimizedOrderBumps.has(orderBump.id)
            const selectedProductPaymentLinks = getPaymentLinkOptionsForProduct(orderBump.product)
            const isLoadingLinksForProduct = loadingPaymentLinks[orderBump.product] || false

            return (
              <div key={orderBump.id} className="border border-neutral-200 rounded-lg overflow-hidden">
                {/* Header do order bump */}
                <div className="flex items-center justify-between px-4 pt-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleMinimized(orderBump.id)}
                      className="p-1 hover:bg-neutral-100 rounded transition-colors"
                      disabled={!isComplete}
                    >
                      <CaretDownIcon
                        weight="bold"
                        size={16}
                        className={`text-neutral-600 transition-all duration-300 ${!isMinimized
? 'rotate-180'
: ''}`}
                      />
                    </button>
                    <h4 className="text-neutral-1000 font-medium font-araboto text-base">
                      Order Bump {index + 1}
                    </h4>
                    {isComplete && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        <CheckIcon size={12} />
                        Completo
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="small"
                    onClick={() => removeOrderBump(orderBump.id)}
                    className="border-none"
                  >
                    <TrashIcon size={16} />
                  </Button>
                </div>

                {/* Conteúdo do order bump */}
                <div className={clsx(
                  'transition-all duration-300 ease-in-out relative',
                  isMinimized
                    ? 'max-h-64 overflow-hidden'
                    : 'max-h-none',
                )}
                >
                  <div className="p-4 space-y-4">
                    {/* Produto */}
                    <div className="flex flex-col gap-2">
                      <label className="text-neutral-1000 font-medium font-araboto text-base block">
                        Produto:
                      </label>
                      <div className="relative">
                        <SelectField
                          options={productOptions}
                          control={control}
                          name={`orderBumps.${index}.product`}
                          placeholder={loadingProducts
                            ? 'Carregando produtos...'
                            : 'Selecionar produto'}
                          error={errors.orderBumps?.[index]?.product?.message}
                          disabled={loadingProducts || isMinimized}
                        />
                      </div>
                    </div>

                    {/* Link de pagamento */}
                    <div className="flex flex-col gap-2">
                      <label className="text-neutral-1000 font-medium font-araboto text-base block">
                        Link de pagamento:
                      </label>
                      <div className="relative">
                        <SelectField
                          options={selectedProductPaymentLinks}
                          control={control}
                          name={`orderBumps.${index}.paymentLink`}
                          placeholder={
                            !orderBump.product
                              ? 'Selecione um produto primeiro'
                              : isLoadingLinksForProduct
                                ? 'Carregando links...'
                                : selectedProductPaymentLinks.length === 0
                                  ? 'Nenhum link encontrado'
                                  : 'Selecionar link de pagamento'
                          }
                          error={errors.orderBumps?.[index]?.paymentLink?.message}
                          disabled={!orderBump.product || isLoadingLinksForProduct || isMinimized}
                        />
                      </div>
                    </div>

                    {/* Oferta */}
                    <div className="flex flex-col gap-2">
                      <label className="text-neutral-1000 font-medium font-araboto text-base block">
                        Defina a Oferta:
                      </label>
                      <div className="relative">
                        <TextField
                          {...register(`orderBumps.${index}.offer`)}
                          placeholder="Digite a oferta"
                          error={errors.orderBumps?.[index]?.offer?.message}
                          disabled={isMinimized}
                        />
                      </div>
                    </div>

                    {/* Descrição */}
                    <div className="flex flex-col gap-2">
                      <label className="text-neutral-1000 font-medium font-araboto text-base block">
                        Defina a Descrição:
                      </label>
                      <div className="relative">
                        <Textarea
                          {...register(`orderBumps.${index}.description`)}
                          placeholder="Digite a descrição do produto"
                          error={errors.orderBumps?.[index]?.description?.message}
                          disabled={isMinimized}
                        />
                      </div>
                    </div>

                    {/* Preço fictício */}
                    <div className="flex flex-col gap-4">
                      <label className="text-neutral-1000 font-medium font-araboto text-base block">
                        Preço fictício:
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-neutral-1000 font-medium font-araboto text-base block">
                            De:
                          </label>

                          <PriceField
                            control={control}
                            name={`orderBumps.${index}.priceFrom`}
                            withoutCurrencySelector
                            selectedCurrency={productPaymentLinks[orderBump.product]?.find(link => link.id === orderBump.paymentLink)?.price.baseCurrency || 'BRL'}
                            placeholder="R$ 139,99"
                            disabled={isMinimized}
                            error={errors.orderBumps?.[index]?.priceFrom?.message}
                          />
                        </div>

                        <div>
                          <label className="text-neutral-1000 font-medium font-araboto text-base block">
                            Por:
                          </label>

                          <TextField
                            value={
                              watch(`orderBumps.${index}.priceTo`) && (watch(`orderBumps.${index}.priceTo`) || 0) > 0
                                ? new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: watch(`orderBumps.${index}.currency`) || 'BRL',
                                  }).format((watch(`orderBumps.${index}.priceTo`) || 0) / 100)
                                : ''
                            }
                            placeholder="R$ 00,00"
                            disabled
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gradient com seta quando minimizado */}
                  {isMinimized && isComplete && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />
                  )}
                </div>

                {/* Botão para expandir quando minimizado */}
                {isMinimized && isComplete && (
                  <div className="flex justify-center pb-1 absolute bottom-0 left-0 right-0">
                    <button
                      type="button"
                      onClick={() => toggleMinimized(orderBump.id)}
                      className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                    >
                      <CaretDownIcon weight="bold" size={16} className="text-neutral-600" />
                    </button>
                  </div>
                )}
              </div>
            )
          })}

          <Button
            type="button"
            variant="ghost"
            size="medium"
            className="w-full"
            onClick={addOrderBump}
          >
            Adicionar mais Order Bumps
          </Button>
        </div>
      )}

      {/* Personalização de Cores */}
      {watch('enableOrderBumps') && (
        <div className="flex flex-col gap-2">
          <label className="text-neutral-1000 font-medium font-araboto text-base mb-4 block">
            Personalização de Cores:
          </label>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-neutral-1000 font-medium font-araboto text-base block">
                  Cor do título:
                </label>
                <ColorPicker
                  value={watch('titleColor')}
                  onChange={(color) => setValue('titleColor', color)}
                  error={errors.titleColor?.message}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-neutral-1000 font-medium font-araboto text-base block">
                  Cor do card:
                </label>
                <ColorPicker
                  value={watch('orderBumpCardColor')}
                  onChange={(color) => setValue('orderBumpCardColor', color)}
                  error={errors.orderBumpCardColor?.message}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-neutral-1000 font-medium font-araboto text-base block">
                  Cor do Preço fictício:
                </label>
                <ColorPicker
                  value={watch('orderBumpFakePriceColor')}
                  onChange={(color) => setValue('orderBumpFakePriceColor', color)}
                  error={errors.orderBumpFakePriceColor?.message}
                />
              </div>

            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-neutral-1000 font-medium font-araboto text-base block">
                  Cor do texto:
                </label>
                <ColorPicker
                  value={watch('orderBumpTextColor')}
                  onChange={(color) => setValue('orderBumpTextColor', color)}
                  error={errors.orderBumpTextColor?.message}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-neutral-1000 font-medium font-araboto text-base block">
                  Cor da borda:
                </label>
                <ColorPicker
                  value={watch('orderBumpBorderColor')}
                  onChange={(color) => setValue('orderBumpBorderColor', color)}
                  error={errors.orderBumpBorderColor?.message}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-neutral-1000 font-medium font-araboto text-base block">
                  Cor do Preço:
                </label>
                <ColorPicker
                  value={watch('orderBumpPriceColor')}
                  onChange={(color) => setValue('orderBumpPriceColor', color)}
                  error={errors.orderBumpPriceColor?.message}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
