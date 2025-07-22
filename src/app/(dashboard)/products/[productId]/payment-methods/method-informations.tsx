import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/image'
import { Button } from '@/components/button'
import { CheckCircleIcon, XCircleIcon } from '@phosphor-icons/react'
import ApplePayLogo from '@/assets/images/methods/apple-pay.png'

interface MethodInformationsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MethodInformationsModal({ open, onOpenChange }: MethodInformationsModalProps) {
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

            {/* Apple Pay Section */}
            <div className="px-8 py-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center">
                    <Image src={ApplePayLogo} alt="Apple Pay" width={32} height={32} quality={100} />
                  </div>
                  <h3 className="text-lg font-araboto font-medium text-neutral-1000">
                    Apple Pay
                  </h3>
                </div>
                <Button variant="ghost" size="small">
                  Ativar
                </Button>
              </div>

              <p className="text-neutral-600 text-sm leading-relaxed">
                Pague com segurança e rapidez usando Apple Pay, o sistema de pagamento da Apple que permite realizar compras com apenas um toque direto do seu iPhone, Apple Watch, iPad ou Mac.
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
                O Apple Pay permite que os clientes realizem pagamentos no seu aplicativo ou site usando cartões de crédito ou débito salvos na Carteira Apple, disponíveis em dispositivos compatíveis como iPhone, Apple Watch, iPad ou Mac. Para ativar o Apple Pay como forma de pagamento utilizando a Zhex, revise os{' '}
                <a href="#" className="text-zhex-base-500 font-medium underline">
                  Termos de Serviço da API Apple Pay
                </a>
                {' '}e a{' '}
                <a href="#" className="text-zhex-base-500 font-medium underline">
                  Política de Privacidade da Apple
                </a>
                . Esses documentos explicam quais dados são utilizados e como a Apple protege as transações.
              </p>

              {/* Details Table */}
              <div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-neutral-1000 text-sm font-bold font-araboto">Tipo:</span>
                  <span className="text-neutral-1000 text-sm font-medium">Carteiras</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-neutral-1000 text-sm font-bold font-araboto">Confirmação:</span>
                  <span className="text-neutral-1000 text-sm font-medium">Imediato</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-neutral-1000 text-sm font-bold font-araboto">Pagamentos recorrentes:</span>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon size={18} className="text-green-secondary-500" weight="bold" />
                    <span className="text-neutral-1000 text-sm font-medium">Sim</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-neutral-1000 text-sm font-bold font-araboto">Suporte a reembolsos:</span>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon size={18} className="text-green-secondary-500" weight="bold" />
                    <span className="text-neutral-1000 text-sm font-medium">Sim</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-neutral-1000 text-sm font-bold font-araboto">Suporte a contestações:</span>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon size={18} className="text-green-secondary-500" weight="bold" />
                    <span className="text-neutral-1000 text-sm font-medium">Sim</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
