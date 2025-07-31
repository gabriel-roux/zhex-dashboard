import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/image'
import { Button } from '@/components/button'
import { CheckCircleIcon, XCircleIcon } from '@phosphor-icons/react'
import { PaymentMethod } from '@/@types/payment-methods'

interface MethodInformationsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  method: PaymentMethod | null
  onActivate: () => Promise<void>
  onDeactivate: () => Promise<void>
  isActive: boolean
}

export function MethodInformationsModal({
  open,
  onOpenChange,
  method,
  onActivate,
  onDeactivate,
  isActive,
}: MethodInformationsModalProps) {
  if (!method) return null

  const typeLabel = method.type === 'DIGITAL_WALLET'
    ? 'Carteira digital'
    : method.type === 'CREDIT_CARD'
      ? 'Cartão de crédito'
      : method.type

  const confirmationLabel = method.requiresConfirmation
    ? 'Requer confirmação'
    : 'Imediato'

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-neutral-1000/50 backdrop-blur-sm z-50" />
        <Dialog.Content
          style={{
            maxWidth: 440,
            right: 0,
            top: 0,
          }} className="fixed right-0 top-0 h-full w-[440px] bg-white shadow-2xl z-50 overflow-y-auto"
        >
          <div className="py-6">
            {/* Header */}
            <div className="flex items-center justify-between px-8 pb-6 border-b border-neutral-200">
              <Dialog.Title className="text-lg font-araboto font-medium text-neutral-1000">
                Método de pagamento:
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

            {/* Payment Method Section */}
            <div className="px-8 py-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center">
                    {method.iconUrl
                      ? (
                        <Image
                          src={method.iconUrl}
                          alt={method.name}
                          width={32}
                          height={32}
                          quality={100}
                        />
                        )
                      : (
                        <span className="text-sm font-medium text-neutral-500">
                          {method.name.charAt(0)}
                        </span>
                        )}
                  </div>
                  <h3 className="text-lg font-araboto font-medium text-neutral-1000">
                    {method.name}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={isActive
                    ? onDeactivate
                    : onActivate}
                >
                  {isActive
                    ? 'Desativar'
                    : 'Ativar'}
                </Button>
              </div>

              <p className="text-neutral-600 text-sm leading-relaxed">
                {method.description || `${method.name} é um método de pagamento seguro e confiável para suas transações.`}
              </p>
            </div>

            {/* Properties Section */}
            <div className="px-8">
              <div style={{ paddingBottom: 8 }} className="w-full mb-4 border-b border-neutral-200">
                <div className="relative w-fit">
                  <h4 className="text-base font-araboto font-medium text-neutral-1000">
                    Propriedade
                  </h4>
                  <div className="absolute -bottom-2 left-0 h-[1px] bg-zhex-base-500 w-full" />
                </div>
              </div>

              <p className="text-neutral-1000 text-sm leading-relaxed mb-6">
                O {method.name} permite que os clientes realizem pagamentos de forma segura e rápida.
                Este método oferece uma experiência de pagamento otimizada com suporte a múltiplas moedas
                e regiões. Para mais informações sobre termos de serviço e políticas de privacidade,
                consulte a documentação oficial.
              </p>

              {/* Details Table */}
              <div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-neutral-1000 text-sm font-bold font-araboto">Tipo:</span>
                  <span className="text-neutral-1000 text-sm font-medium">{typeLabel}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-neutral-1000 text-sm font-bold font-araboto">Confirmação:</span>
                  <span className="text-neutral-1000 text-sm font-medium">{confirmationLabel}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-neutral-1000 text-sm font-bold font-araboto">Pagamentos recorrentes:</span>
                  <div className="flex items-center gap-2">
                    {method.supportRecurring
                      ? (
                        <CheckCircleIcon size={18} className="text-green-secondary-500" weight="bold" />
                        )
                      : (
                        <XCircleIcon size={18} className="text-red-500" weight="bold" />
                        )}
                    <span className="text-neutral-1000 text-sm font-medium">
                      {method.supportRecurring
                        ? 'Sim'
                        : 'Não'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-neutral-1000 text-sm font-bold font-araboto">Suporte a parcelamento:</span>
                  <div className="flex items-center gap-2">
                    {method.supportInstallments
                      ? (
                        <CheckCircleIcon size={18} className="text-green-secondary-500" weight="bold" />
                        )
                      : (
                        <XCircleIcon size={18} className="text-red-500" weight="bold" />
                        )}
                    <span className="text-neutral-1000 text-sm font-medium">
                      {method.supportInstallments
                        ? 'Sim'
                        : 'Não'}
                    </span>
                  </div>
                </div>

                {method.supportInstallments && method.maxInstallments && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-neutral-1000 text-sm font-bold font-araboto">Máximo de parcelas:</span>
                    <span className="text-neutral-1000 text-sm font-medium">{method.maxInstallments}x</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2">
                  <span className="text-neutral-1000 text-sm font-bold font-araboto">Taxa de processamento:</span>
                  <span className="text-neutral-1000 text-sm font-medium">
                    {method.processingFeePercentage}% + ${(method.processingFeeFixed || 0) / 100}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-neutral-1000 text-sm font-bold font-araboto">Moedas suportadas:</span>
                  <span className="text-neutral-1000 text-sm font-medium">
                    {method.currencies.slice(0, 3).join(', ')}
                    {method.currencies.length > 3 && '...'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-neutral-1000 text-sm font-bold font-araboto">Regiões:</span>
                  <span className="text-neutral-1000 text-sm font-medium">
                    {method.supportedRegions.length > 10
                      ? 'Todas regiões'
                      : method.supportedRegions.slice(0, 3).join(', ') +
                     (method.supportedRegions.length > 3
                       ? '...'
                       : '')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
