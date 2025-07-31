import { Controller } from 'react-hook-form'
import { TextField, SelectField } from '@/components/textfield'
import * as Checkbox from '@radix-ui/react-checkbox'
import { CheckIcon, LinkIcon, PercentIcon } from '@phosphor-icons/react'
import { Switch } from '@/components/switch'
import { useState, useRef, useEffect } from 'react'
import { useProductAffiliateForm, AffiliateFormData } from '@/hooks/useProductAffiliateForm'
import { ConfirmationModal } from '@/components/confirmation-modal'
import clsx from 'clsx'

const validityOptions = [
  { value: '30', label: '30 dias' },
  { value: '60', label: '60 dias' },
  { value: '90', label: '90 dias' },
  { value: '180', label: '6 meses' },
  { value: '365', label: '1 ano' },
]

interface ProductAffiliatesProps {
  form: ReturnType<typeof useProductAffiliateForm>['form']
  paymentLinks: Array<{ id: string; name: string; price: { baseAmount: number } }>
}

export function ProductAffiliates({ form, paymentLinks }: ProductAffiliatesProps) {
  const { watch, setValue, control, formState: { errors } } = form

  const active = watch('isActive')
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

  // Sincronizar o conteúdo do editor quando o valor do campo mudar
  useEffect(() => {
    const currentValue = watch('affiliationRules')
    if (editorRef.current && currentValue !== undefined) {
      // Só atualiza se o conteúdo for diferente para evitar conflitos
      if (editorRef.current.innerText !== currentValue) {
        editorRef.current.innerText = currentValue || ''
      }
    }
  }, [watch('affiliationRules')])

  const handleDeactivate = () => {
    setValue('isActive', false)
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount / 100)
  }

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
                  setValue('isActive', value)
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
                name="autoApproveAffiliates"
                label="Aprovar afiliados automaticamente"
              />
              <ToggleField
                name="enableExtendedCommission"
                label="Estender comissão: order bump, cross sell, upsell e downsell"
              />
              <ToggleField
                name="shareBuyerDataWithAffiliate"
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
                  <Controller
                    name="commissionValue"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        placeholder="0"
                        leftIcon={<PercentIcon size={18} />}
                        min={1}
                        max={100}
                        error={errors.commissionValue?.message}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-700">
                  Validade do afiliado:
                </label>
                <SelectField
                  name="commissionValidityPeriod"
                  control={control}
                  options={validityOptions}
                  placeholder="Selecione um período"
                  error={errors.commissionValidityPeriod?.message}
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
                  Selecione os links de pagamento que estarão disponíveis para afiliados.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentLinks.map((link) => {
                  const isSelected = watch('paymentLinkIds').includes(link.id)
                  const commissionAmount = (link.price.baseAmount * watch('commissionValue')) / 100
                  const netAmount = link.price.baseAmount - commissionAmount

                  return (
                    <div key={link.id} className="border border-neutral-100 rounded-xl p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox.Root
                            className="w-5 h-5 border-2 border-neutral-300 rounded-md bg-white flex items-center justify-center data-[state=checked]:bg-zhex-base-500 data-[state=checked]:border-zhex-base-500 transition-colors"
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              const currentIds = watch('paymentLinkIds')
                              if (checked) {
                                setValue('paymentLinkIds', [...currentIds, link.id])
                              } else {
                                setValue('paymentLinkIds', currentIds.filter(id => id !== link.id))
                              }
                            }}
                          >
                            <Checkbox.Indicator>
                              <CheckIcon size={14} className="text-white" />
                            </Checkbox.Indicator>
                          </Checkbox.Root>
                          <span className="font-medium text-lg text-neutral-1000">{link.name}</span>
                        </div>
                        <div className="text-lg font-semibold text-neutral-500">
                          {formatCurrency(link.price.baseAmount)}
                        </div>
                      </div>
                      <div className="text-base text-neutral-400 mt-2">
                        <div className="flex items-center justify-between gap-4 mt-4">
                          <span className="text-base">Taxas: <span className="text-red-500">R$ 2,49</span></span>
                          <span className="text-base">Você recebe: <span className="text-green-500">{formatCurrency(netAmount)}</span></span>
                          <span className="text-base">Afiliado recebe: <span className="text-neutral-1000 font-semibold">{formatCurrency(commissionAmount)}</span></span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {
                errors.paymentLinkIds && (
                  <p className="text-sm text-red-secondary-500">
                    {errors.paymentLinkIds.message}
                  </p>
                )
              }
            </div>

            {/* Suporte para afiliado */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold text-neutral-1000">
                  Suporte para afiliado
                </h3>
                <p className="text-sm text-neutral-500">
                  Configure as informações de suporte que serão exibidas para os afiliados.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-neutral-700">Nome:</label>
                  <TextField
                    {...form.register('supportName')}
                    placeholder="Digite o nome"
                    error={errors.supportName?.message}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-neutral-700">E-mail:</label>
                  <TextField
                    {...form.register('supportEmail')}
                    placeholder="nome@suporte.com"
                    type="email"
                    error={errors.supportEmail?.message}
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
                      {...form.register('supportPhone')}
                      placeholder="(00) 00000-0000"
                      className="flex-1"
                      error={errors.supportPhone?.message}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-neutral-700">Página de vendas:</label>
                  <TextField
                    {...form.register('supportUrl')}
                    leftIcon={<LinkIcon size={18} />}
                    placeholder="https://exemplo.com"
                    error={errors.supportUrl?.message}
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
                  {watch('affiliationRules')?.length || 0}/1000
                </span>
              </div>

              <div className="relative">
                <div className={
                  clsx(
                    'border border-neutral-100 rounded-xl',
                    errors.affiliationRules && 'border-red-secondary-500',
                  )
                }
                >
                  <div className={
                    clsx(
                      'flex p-2 px-5 gap-4 bg-neutral-50 rounded-t-xl border-b border-neutral-100',
                      errors.affiliationRules && 'border-red-secondary-500',
                    )
                  }
                  >
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

                  <Controller
                    name="affiliationRules"
                    control={control}
                    render={({ field }) => (
                      <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        className="w-full h-32 p-4 bg-transparent text-neutral-1000 placeholder:text-neutral-400 focus:ring-2 focus:ring-zhex-base-500 outline-none resize-none border-0 min-h-[128px] rounded-b-xl transition-all duration-200"
                        onInput={(e) => {
                          const target = e.target as HTMLDivElement
                          field.onChange(target.innerText)
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
                        onBlur={() => {
                          const target = editorRef.current
                          if (target) {
                            field.onChange(target.innerText)
                          }
                        }}
                      />
                    )}
                  />
                </div>
              </div>

              {
                errors.affiliationRules && (
                  <p className="text-sm text-red-secondary-500">
                    {errors.affiliationRules.message}
                  </p>
                )
              }
            </div>
          </div>
        )}
      </div>

      {/* Modal de Confirmação */}
      <ConfirmationModal
        open={showDeactivateModal}
        onOpenChange={setShowDeactivateModal}
        onConfirm={handleDeactivate}
        title="Desativar afiliação"
        description="Ao desativar a afiliação do produto, seus afiliados não poderão efetuar novas vendas e serão avisados disso. O link de convite será desativado."
        confirmText="Desativar"
        variant="danger"
      />
    </>
  )
}
