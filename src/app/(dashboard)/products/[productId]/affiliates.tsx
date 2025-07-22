import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField, SelectField } from '@/components/textfield'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as Dialog from '@radix-ui/react-dialog'
import { CheckIcon, XCircleIcon } from '@phosphor-icons/react'
import { Switch } from '@/components/switch'
import { useState, useRef } from 'react'
import { Button } from '@/components/button'

const affiliateFormSchema = z.object({
  active: z.boolean(),
  autoApprove: z.boolean().optional(),
  extendCommission: z.boolean().optional(),
  shareCustomerData: z.boolean().optional(),
  commissionPrice: z.string().optional(),
  validityPeriod: z.string().optional(),
  affiliateName: z.string().optional(),
  affiliateEmail: z.string().optional(),
  affiliatePhone: z.string().optional(),
  salesPage: z.string().optional(),
  affiliateRule: z.string().optional(),
})

type AffiliateFormData = z.infer<typeof affiliateFormSchema>

const validityOptions = [
  { value: '30', label: '30 dias' },
  { value: '60', label: '60 dias' },
  { value: '90', label: '90 dias' },
  { value: '180', label: '6 meses' },
  { value: '365', label: '1 ano' },
]

export function ProductAffiliates() {
  const { register, watch, setValue, control, formState: { errors } } = useForm<AffiliateFormData>({
    resolver: zodResolver(affiliateFormSchema),
    defaultValues: {
      active: false,
      autoApprove: false,
      extendCommission: false,
      shareCustomerData: false,
    },
  })

  const active = watch('active')
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value)

    // Atualizar estado dos botões
    setIsBold(document.queryCommandState('bold'))
    setIsItalic(document.queryCommandState('italic'))
    setIsUnderline(document.queryCommandState('underline'))
  }

  const handleDeactivate = () => {
    setValue('active', false)
    setShowDeactivateModal(false)
  }

  const ToggleField = ({
    name,
    label,
  }: {
    name: keyof AffiliateFormData
    label: string
  }) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex items-center gap-3">
          <Switch active={field.value as boolean} setValue={field.onChange} />
          <span className="text-sm font-medium text-neutral-700 whitespace-nowrap">
            {label}
          </span>
        </div>
      )}
    />
  )

  return (
    <>
      <div className="flex flex-col gap-8 mt-10">
        {/* Toggle de Status */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <Switch
              active={active}
              setValue={(value) => {
                if (active && !value) {
                  // Se está ativo e quer desativar, mostra modal
                  setShowDeactivateModal(true)
                } else {
                  setValue('active', value)
                }
              }}
            />
            <span className={`font-araboto font-semibold text-base ${active
? 'text-neutral-1000'
: 'text-neutral-700'}`}
            >
              {active
                ? 'Afiliado está ativo'
                : 'Afiliado ainda não está ativo'}
            </span>
          </div>
          <p className={`text-sm ${active
? 'text-neutral-500'
: 'text-neutral-400'} max-w-2xl`}
          >
            {active
              ? 'Configure as comissões para esse afiliado.'
              : 'Para começar a divulgar e receber comissões, aguarde a aprovação da equipe ou finalize as etapas obrigatórias no seu cadastro. Assim que tudo estiver pronto, você terá acesso completo ao painel de afiliado.'}
          </p>
        </div>

        {/* Conteúdo quando ativo */}
        {active && (
          <div className="flex flex-col gap-8">
            {/* Toggles de configurações */}
            <div className="flex flex-row gap-12 items-center">
              <ToggleField
                name="autoApprove"
                label="Aprovar afiliados automaticamente"
              />
              <ToggleField
                name="extendCommission"
                label="Estender comissão: order bump, cross sell, upsell e downsell"
              />
              <ToggleField
                name="shareCustomerData"
                label="Compartilhar os dados do comprador com o afiliado"
              />
            </div>

            {/* Comissão e Validade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-700">
                  Comissão de preço único:
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">
                    %
                  </span>
                  <TextField
                    {...register('commissionPrice')}
                    placeholder="0"
                    className="pl-8"
                    error={errors.commissionPrice?.message}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-700">
                  Validade do afiliado:
                </label>
                <SelectField
                  name="validityPeriod"
                  control={control}
                  options={validityOptions}
                  placeholder="Selecione um período"
                  error={errors.validityPeriod?.message}
                />
              </div>
            </div>

            {/* Links de pagamento */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold text-neutral-1000">
                  Links de pagamento:
                </h3>
                <p className="text-sm text-neutral-500">
                  Você pode criar uma assinatura com um ou mais planos. Essas opções estarão disponíveis para o comprador no Checkout.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Link 1 */}
                <div className="border border-neutral-100 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox.Root
                        className="w-5 h-5 border-2 border-neutral-300 rounded-md bg-white flex items-center justify-center data-[state=checked]:bg-zhex-base-500 data-[state=checked]:border-zhex-base-500 transition-colors"
                      >
                        <Checkbox.Indicator>
                          <CheckIcon size={14} className="text-white" />
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                      <span className="font-medium text-lg text-neutral-1000">Nome do link</span>
                    </div>
                    <div className="text-lg font-semibold text-neutral-500">
                      R${' '}
                      <span className="font-semibold text-lg text-neutral-1000">30,00</span>
                    </div>
                  </div>
                  <div className="text-base text-neutral-400 mt-2">
                    <p>https://designdodiadia.com.br/produto 1</p>
                    <div className="flex items-center justify-between gap-4 mt-4">
                      <span className="text-base">Taxas: <span className="text-red-500">R$ 2,49</span></span>
                      <span className="text-base">Você recebe: <span className="text-green-500">R$ 12,49</span></span>
                      <span className="text-base">Afiliado recebe: <span className="text-neutral-1000 font-semibold">R$ 14,00</span></span>
                    </div>
                  </div>
                </div>

                {/* Link 2 */}
                <div className="border border-neutral-100 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox.Root
                        className="w-5 h-5 border-2 border-neutral-300 rounded-md bg-white flex items-center justify-center data-[state=checked]:bg-zhex-base-500 data-[state=checked]:border-zhex-base-500 transition-colors"
                      >
                        <Checkbox.Indicator>
                          <CheckIcon size={14} className="text-white" />
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                      <span className="font-medium text-lg text-neutral-1000">Nome do link</span>
                    </div>
                    <div className="text-lg font-semibold text-neutral-500">
                      R${' '}
                      <span className="font-semibold text-lg text-neutral-1000">30,00</span>
                    </div>
                  </div>
                  <div className="text-base text-neutral-400 mt-2">
                    <p>https://designdodiadia.com.br/produto 1</p>
                    <div className="flex items-center justify-between gap-4 mt-4">
                      <span className="text-base">Taxas: <span className="text-red-500">R$ 2,49</span></span>
                      <span className="text-base">Você recebe: <span className="text-green-500">R$ 12,49</span></span>
                      <span className="text-base">Afiliado recebe: <span className="text-neutral-1000 font-semibold">R$ 14,00</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Suporte para afiliado */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold text-neutral-1000">
                  Suporte para afiliado
                </h3>
                <p className="text-sm text-neutral-500">
                  Você pode criar uma assinatura com um ou mais planos. Essas opções estarão disponíveis para o comprador no Checkout.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-neutral-700">Nome:</label>
                  <TextField
                    {...register('affiliateName')}
                    placeholder="Digite o nome"
                    error={errors.affiliateName?.message}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-neutral-700">E-mail:</label>
                  <TextField
                    {...register('affiliateEmail')}
                    placeholder="nome@suporte.com"
                    type="email"
                    error={errors.affiliateEmail?.message}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-neutral-700">Telefone:</label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-3 py-3 border border-neutral-100 rounded-xl bg-neutral-50 min-w-[80px]">
                      <span className="text-sm">🇧🇷</span>
                      <span className="text-sm text-neutral-500">+55</span>
                    </div>
                    <TextField
                      {...register('affiliatePhone')}
                      placeholder="(00) 00000-0000"
                      className="flex-1"
                      error={errors.affiliatePhone?.message}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-neutral-700">Página de vendas:</label>
                  <TextField
                    {...register('salesPage')}
                    placeholder="🔗 https://exemplo.com"
                    error={errors.salesPage?.message}
                  />
                </div>
              </div>
            </div>

            {/* Regra de afiliação */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-neutral-1000">
                  Regra de afiliação:
                </h3>
                <span className="text-sm text-neutral-400">
                  {editorRef.current?.innerText.length || 0}/1000
                </span>
              </div>

              <div className="relative">
                <div className="border border-neutral-100 rounded-xl">
                  <div className="flex p-2 px-5 gap-4 bg-neutral-50 border-b border-neutral-100">
                    <button
                      type="button"
                      onClick={() => formatText('bold')}
                      className={`p-1 rounded transition-colors ${
                        isBold
                          ? 'text-zhex-base-500'
                          : 'text-neutral-600 hover:text-neutral-800'
                      } font-bold`}
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('italic')}
                      className={`p-1 rounded transition-colors ${
                        isItalic
                          ? 'text-zhex-base-500'
                          : 'text-neutral-600 hover:text-neutral-800'
                      } italic`}
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('underline')}
                      className={`p-1 rounded transition-colors ${
                        isUnderline
                          ? 'text-zhex-base-500'
                          : 'text-neutral-600 hover:text-neutral-800'
                      } underline`}
                    >
                      U
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('insertUnorderedList')}
                      className="p-1 rounded transition-colors text-neutral-600 hover:text-neutral-800"
                    >
                      ≡
                    </button>
                  </div>

                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="w-full h-32 p-4 bg-transparent text-neutral-1000 placeholder:text-neutral-400 focus:ring-2 focus:ring-zhex-base-500 outline-none resize-none border-0 min-h-[128px] rounded-b-xl transition-all duration-200"
                    onInput={(e) => {
                      const target = e.target as HTMLDivElement
                      setValue('affiliateRule', target.innerText)
                    }}
                    onKeyUp={() => {
                      setIsBold(document.queryCommandState('bold'))
                      setIsItalic(document.queryCommandState('italic'))
                      setIsUnderline(document.queryCommandState('underline'))
                    }}
                    onMouseUp={() => {
                      setIsBold(document.queryCommandState('bold'))
                      setIsItalic(document.queryCommandState('italic'))
                      setIsUnderline(document.queryCommandState('underline'))
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Confirmação */}
      <Dialog.Root open={showDeactivateModal} onOpenChange={setShowDeactivateModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-full max-w-md z-50 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-semibold text-neutral-1000">
                Desativar afiliação
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-neutral-500 hover:text-red-secondary-500 transition-colors">
                  <XCircleIcon size={20} weight="fill" />
                </button>
              </Dialog.Close>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-sm text-neutral-600 leading-relaxed">
                Ao desativar a afiliação do produto, seus afiliados não poderão efetuar novas vendas e serão avisados disso. O link de convite será desativado.
              </p>
              <p className="text-sm text-neutral-1000 font-medium leading-relaxed">
                Caso deseja continuar recebendo comissões por vendas através de afiliados, não desative a afiliação
              </p>
            </div>

            <div className="flex gap-3">
              <Dialog.Close asChild>
                <Button variant="ghost" size="medium" className="w-1/2">
                  Cancelar
                </Button>
              </Dialog.Close>
              <button
                onClick={handleDeactivate}
                className="flex-1 w-full px-4 py-2 bg-red-secondary-500 text-white rounded-lg hover:bg-red-secondary-600 transition-colors cursor-pointer"
              >
                Desativar
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
