'use client'
import Image from 'next/image'
import { SelectField, TextField } from '@/components/textfield'
import { Button } from '@/components/button'
import ApplePayLogo from '@/assets/images/methods/apple-pay.png'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { InfoIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { MethodInformationsModal } from './method-informations'

const paymentMethods = Array(7).fill(null).map(() => ({
  name: 'Apple Pay',
  type: 'Carteira digital',
  region: 'Todas regiões',
  logo: ApplePayLogo, // coloque o caminho correto do logo
}))

const allCurrencies = ['EUR', 'USD', 'BRL', 'GBP', 'JPY']

const paymentMethodsSchema = z.object({
  preco: z.string().nonempty('Preço obrigatório'),
  moedas: z.array(z.string()).min(1, 'Selecione pelo menos uma moeda'),
  descricaoPagamento: z.string().nonempty('Descrição de pagamento obrigatória'),
})

type PaymentMethodsFormData = z.infer<typeof paymentMethodsSchema>

export function PaymentMethods() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { control, register, formState: { errors } } = useForm<PaymentMethodsFormData>({
    resolver: zodResolver(paymentMethodsSchema),
    defaultValues: {
      preco: '',
      moedas: ['EUR', 'USD', 'BRL'],
      descricaoPagamento: '',
    },
  })

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
                {paymentMethods.map((method, idx) => (
                  <tr key={idx} className="border-b last:border-b-0">
                    <td className="py-3 flex items-center gap-3">
                      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-neutral-200">
                        <Image src={method.logo} alt={method.name} width={28} height={28} quality={100} />
                      </span>
                      <span className="font-araboto text-base text-neutral-1000">{method.name}</span>
                    </td>
                    <td className="py-3 text-base text-neutral-500">{method.type}</td>
                    <td className="py-3 text-base text-neutral-500">{method.region}</td>
                    <td className="py-3 flex justify-end">
                      <Button
                        variant="ghost"
                        size="small"
                        type="button"
                        className="text-sm"
                        onClick={() => setIsModalOpen(true)}
                      >
                        Ativar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-[1px] h-[475px] bg-neutral-200" />
        {/* Coluna lateral direita */}
        <div className="w-[445px] flex flex-col gap-4">
          <div>
            <label className="text-neutral-1000 font-medium font-araboto text-base mb-1 block">
              Preço do produto: <span className="text-red-secondary-500">*</span>
            </label>
            <TextField
              {...register('preco')}
              name="preco"
              placeholder="129,40"
              error={errors.preco?.message}
            />
          </div>
          <div>
            <label className="text-neutral-1000 font-medium font-araboto text-base mb-1 block">
              Moedas: <span className="text-red-secondary-500">*</span>
            </label>
            <p className="text-neutral-400 text-sm mb-1">
              A conversão de moedas ocorre automaticamente pela localização que o cliente abrir o checkout.
              <span className="inline-flex items-center gap-1 ml-1 align-middle">
                <InfoIcon size={18} className="text-zhex-base-500" />
              </span>
            </p>
            <SelectField
              name="moedas"
              control={control}
              options={allCurrencies.map(cur => ({ value: cur, label: cur }))}
              placeholder="Selecione as moedas"
              multiple
              error={errors.moedas?.message}
            />
          </div>
          <div>
            <label className="text-neutral-1000 font-medium font-araboto text-base mb-1 block">
              Descrição de pagamento: <span className="text-red-secondary-500">*</span>
            </label>
            <TextField
              {...register('descricaoPagamento')}
              name="descricaoPagamento"
              placeholder="Zhex*"
              error={errors.descricaoPagamento?.message}
            />
          </div>
        </div>
      </div>

      <MethodInformationsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  )
}
