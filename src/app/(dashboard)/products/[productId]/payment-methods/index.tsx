'use client'
import Image from 'next/image'
import { SelectField, TextField } from '@/components/textfield'
import { Button } from '@/components/button'
import { UseFormReturn } from 'react-hook-form'
import { CheckCircleIcon, InfoIcon } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'
import { MethodInformationsModal } from './method-informations'
import { PriceField } from '@/components/price-field'
import { useApi } from '@/hooks/useApi'
import { PaymentMethod, ProductPaymentMethod } from '@/@types/payment-methods'
import { ProductPriceFormData } from '@/hooks/useProductPriceForm'
import { PaymentMethodsTableSkeleton } from '@/components/skeletons/payment-methods-skeleton'
import { PaymentPriceFormSkeleton } from '@/components/skeletons/payment-price-form-skeleton'

interface PaymentMethodsData {
  paymentMethods: PaymentMethod[]
  productPaymentMethods: ProductPaymentMethod[]
}

const allCurrencies = ['EUR', 'USD', 'BRL', 'GBP', 'JPY']

interface PaymentMethodsProps {
  productId: string
  priceForm?: UseFormReturn<ProductPriceFormData>
}

export function PaymentMethods({ productId, priceForm }: PaymentMethodsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [paymentMethodsData, setPaymentMethodsData] = useState<PaymentMethodsData | null>(null)
  const [loading, setLoading] = useState(true)
  const { get, post } = useApi()

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true)

      const response = await get<{ success: boolean; data: PaymentMethodsData; message?: string }>(`/products/${productId}/payment-methods`)

      console.log(response.data)

      if (response.data.success) {
        setPaymentMethodsData(response.data.data)
      }
    } finally {
      setLoading(false)
    }
  }

  const deactivatePaymentMethod = async (paymentMethodId: string) => {
    try {
      const response = await post<{ success: boolean; message?: string }>(`/products/${productId}/payment-methods/deactivate`, {
        paymentMethodId,
      })

      if (response.data.success) {
        await fetchPaymentMethods() // Recarregar dados
      } else {
        console.error('Erro ao desativar:', response.data.message)
      }
    } catch (err: unknown) {
      console.error('Erro ao desativar método:', err)
    }
  }

  const activatePaymentMethod = async (paymentMethodId: string) => {
    try {
      const response = await post<{ success: boolean; message?: string }>(`/products/${productId}/payment-methods/activate`, {
        paymentMethodId,
      })

      if (response.data.success) {
        await fetchPaymentMethods() // Recarregar dados
      } else {
        console.error('Erro ao ativar:', response.data.message)
      }
    } catch (err: unknown) {
      console.error('Erro ao ativar método:', err)
    }
  }

  const handleMethodClick = (method: PaymentMethod) => {
    setSelectedMethod(method)
    setIsModalOpen(true)
  }

  const handleActivateMethod = async (idFromTable?: string) => {
    if (idFromTable) {
      await activatePaymentMethod(idFromTable)
      return
    }

    if (selectedMethod) {
      await activatePaymentMethod(selectedMethod.id)
      setIsModalOpen(false)
      setSelectedMethod(null)
    }
  }

  const isMethodActive = (methodId: string) => {
    return paymentMethodsData?.productPaymentMethods.some(
      ppm => ppm.paymentMethodId === methodId && ppm.isEnabled,
    ) || false
  }

  useEffect(() => {
    if (productId) {
      fetchPaymentMethods()
    }
  }, [productId])

  return (
    <>
      <div className="mb-3">
        <h2 className="text-lg font-araboto font-medium text-neutral-1000 mb-1">
          Selecione o método de pagamento:
        </h2>
        <p className="text-neutral-400 text-sm mb-4">
          Adicione produtos em sua loja
        </p>
      </div>
      <div className="flex gap-8 w-full">
        {/* Lista de métodos de pagamento */}
        {loading
          ? (
            <PaymentMethodsTableSkeleton />
            )
          : (
            <div className="flex-1 my-3">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-neutral-400 text-sm">
                      <th className="py-3 font-normal">Forma de pagamento</th>
                      <th className="py-3 font-normal">Tipo</th>
                      <th className="py-3 font-normal">Região</th>
                      <th className="py-3 font-normal" />
                    </tr>
                  </thead>
                  <tbody>
                    {paymentMethodsData?.paymentMethods.map((method) => {
                      const isActive = isMethodActive(method.id)
                      const typeLabel = method.type === 'DIGITAL_WALLET'
                        ? 'Carteira digital'
                        : method.type === 'CREDIT_CARD'
                          ? 'Cartão de crédito'
                          : method.type
                      const regionLabel = method.supportedRegions.length > 10
                        ? 'Todas regiões'
                        : method.supportedRegions.slice(0, 3).join(', ') +
                                       (method.supportedRegions.length > 3
                                         ? '...'
                                         : '')

                      return (
                        <tr
                          key={method.id}
                          className="border-b last:border-b-0 hover:bg-neutral-50 cursor-pointer transition-colors duration-200"
                        >
                          <td
                            className="py-3" onClick={() => handleMethodClick(method)}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-neutral-200">
                                {method.iconUrl
                                  ? (
                                    <Image
                                      src={method.iconUrl}
                                      alt={method.name}
                                      width={28}
                                      height={28}
                                      quality={100}
                                      className="w-7 h-7 object-contain rounded-full"
                                    />
                                    )
                                  : (
                                    <span className="text-xs font-medium text-neutral-500">
                                      {method.name.charAt(0)}
                                    </span>
                                    )}
                              </span>
                              <span className="font-araboto text-base text-neutral-1000 mt-1">{method.name}</span>
                            </div>
                          </td>
                          <td
                            className="py-3 text-base text-neutral-500" onClick={() => handleMethodClick(method)}
                          >{typeLabel}
                          </td>
                          <td
                            className="py-3 text-base text-neutral-500" onClick={() => handleMethodClick(method)}
                          >{regionLabel}
                          </td>
                          <td className="py-3">
                            <div className="flex justify-end">
                              {isActive
                                ? (
                                  <span className="text-base font-araboto text-green-500 flex items-center gap-1">
                                    <CheckCircleIcon size={18} className="text-green-500" />
                                    Ativo
                                  </span>
                                  )
                                : (
                                  <Button
                                    variant="ghost"
                                    size="small"
                                    type="button"
                                    className="text-sm"
                                    onClick={() => handleActivateMethod(method.id)}
                                  >
                                    Ativar
                                  </Button>
                                  )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            )}
        <div className="w-[1px] h-[475px] bg-neutral-200" />
        {/* Coluna lateral direita */}
        <div className="w-[445px] flex flex-col gap-4">
          {priceForm
            ? (
              <>
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base mb-1 block">
                    Preço do produto: <span className="text-red-secondary-500">*</span>
                  </label>
                  <PriceField
                    control={priceForm.control}
                    name="baseAmount"
                    placeholder="129,40"
                    selectedCurrency={priceForm.watch('baseCurrency')}
                    withoutCurrencySelector
                    error={priceForm.formState.errors.baseAmount?.message}
                  />
                </div>
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base mb-1 block">
                    Moeda base: <span className="text-red-secondary-500">*</span>
                  </label>
                  <p className="text-neutral-400 text-sm mb-1">
                    <span className="font-medium text-zhex-base-500">{priceForm.watch('baseCurrency')}</span> está sempre incluída como moeda base.
                  </p>
                  <SelectField
                    name="baseCurrency"
                    control={priceForm.control}
                    options={allCurrencies.map(cur => ({ value: cur, label: cur }))}
                    disabled
                    multiple={false}
                    placeholder="Selecione a moeda base"
                  />
                </div>
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base mb-1 block">
                    Moedas habilitadas: <span className="text-red-secondary-500">*</span>
                  </label>
                  <p className="text-neutral-400 text-sm mb-1">
                    A conversão de moedas ocorre automaticamente pela localização que o cliente abrir o checkout.
                    <span className="inline-flex items-center gap-1 ml-1 align-middle">
                      <InfoIcon size={18} className="text-zhex-base-500" />
                    </span>
                  </p>

                  <SelectField
                    name="enabledCurrencies"
                    control={priceForm.control}
                    options={allCurrencies
                      .filter(cur => cur !== priceForm.watch('baseCurrency'))
                      .map(cur => ({ value: cur, label: cur }))}
                    placeholder="Selecione as moedas"
                    multiple
                    error={priceForm.formState.errors.enabledCurrencies?.message}
                  />
                </div>
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base mb-1 block">
                    Descrição de pagamento: <span className="text-red-secondary-500">*</span>
                  </label>
                  <TextField
                    {...priceForm.register('paymentDescription')}
                    name="paymentDescription"
                    placeholder="Zhex*"
                    error={priceForm.formState.errors.paymentDescription?.message}
                  />
                </div>
              </>
              )
            : (
              <PaymentPriceFormSkeleton />
              )}
        </div>
      </div>

      <MethodInformationsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        method={selectedMethod}
        onDeactivate={() => selectedMethod
          ? deactivatePaymentMethod(selectedMethod.id)
          : Promise.resolve()}
        onActivate={handleActivateMethod}
        isActive={selectedMethod
          ? isMethodActive(selectedMethod.id)
          : false}
      />
    </>
  )
}
