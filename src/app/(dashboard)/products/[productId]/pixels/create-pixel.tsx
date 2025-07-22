import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/button'
import { TextField } from '@/components/textfield'
import { Option } from '@/components/option'
import { XCircleIcon, FacebookLogoIcon, GoogleLogoIcon } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Switch } from '@/components/switch'

// Schema de validação
const createPixelSchema = z.object({
  name: z.string().min(1, 'Nome do pixel é obrigatório'),
  pixelType: z.enum(['facebook', 'google']),
  pixelId: z.string().min(1, 'ID do pixel é obrigatório'),
  // Facebook fields
  useConversionsApi: z.boolean().optional(),
  accessToken: z.string().optional(),
  // Google fields
  conversionLabel: z.string().optional(),
})

type CreatePixelFormData = z.infer<typeof createPixelSchema>

interface CreatePixelModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePixelModal({ open, onOpenChange }: CreatePixelModalProps) {
  const [pixelType, setPixelType] = useState<'facebook' | 'google'>('facebook')

  // Facebook states
  const [useConversionsApi, setUseConversionsApi] = useState(false)
  const [events, setEvents] = useState({
    pageView: true,
    addToCart: true,
    initiateCheckout: true,
    initiateCheckoutWithData: true,
    addPaymentInfo: true,
    purchase: true,
  })

  // Google states
  const [googleEvents, setGoogleEvents] = useState({
    initiateCheckout: false,
    purchase: false,
  })

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<CreatePixelFormData>({
    resolver: zodResolver(createPixelSchema),
    defaultValues: {
      name: '',
      pixelType: 'facebook',
      pixelId: '',
      useConversionsApi: false,
      accessToken: '',
      conversionLabel: '',
    },
  })

  const onSubmit = (data: CreatePixelFormData) => {
    console.log('Form data:', data)
    console.log('Events:', pixelType === 'facebook'
      ? events
      : googleEvents)
    // TODO: Implementar criação do pixel
    onOpenChange(false)
  }

  const handlePixelTypeChange = (type: 'facebook' | 'google') => {
    setPixelType(type)
    setValue('pixelType', type)
  }

  const toggleEvent = (eventKey: string, isFacebook: boolean = true) => {
    if (isFacebook) {
      setEvents(prev => ({
        ...prev,
        [eventKey]: !prev[eventKey as keyof typeof prev],
      }))
    } else {
      setGoogleEvents(prev => ({
        ...prev,
        [eventKey]: !prev[eventKey as keyof typeof prev],
      }))
    }
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
                Cadastrar novo pixel
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
                {/* Nome do pixel */}
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                    Nome do pixel:
                  </label>
                  <TextField
                    {...register('name')}
                    placeholder="Digite o nome do pixel"
                    error={errors.name?.message}
                  />
                </div>

                {/* Tipo de pixel */}
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                    Tipo de pixel:
                  </label>
                  <div className="w-full flex gap-3">
                    <Option
                      className="w-full justify-center items-center"
                      label="Facebook"
                      icon={FacebookLogoIcon}
                      selected={pixelType === 'facebook'}
                      onSelect={() => handlePixelTypeChange('facebook')}
                    />
                    <Option
                      label="Google"
                      className="w-full justify-center items-center"
                      icon={GoogleLogoIcon}
                      selected={pixelType === 'google'}
                      onSelect={() => handlePixelTypeChange('google')}
                    />
                  </div>
                </div>

                {/* ID do Pixel */}
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                    ID do Pixel:
                  </label>
                  <TextField
                    {...register('pixelId')}
                    placeholder={pixelType === 'facebook'
                      ? 'FB_123456789012345'
                      : 'GA_G-XXXXXXXXXX'}
                    error={errors.pixelId?.message}
                  />
                </div>

                {/* Facebook specific fields */}
                {pixelType === 'facebook' && (
                  <>
                    {/* API de conversões */}
                    <div className="flex items-center justify-between">
                      <label className="text-neutral-1000 font-medium font-araboto text-base">
                        Usar API de conversões:
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                          Recomendado
                        </span>
                      </label>
                      <Switch
                        active={useConversionsApi}
                        setValue={(value) => {
                          setUseConversionsApi(value)
                          setValue('useConversionsApi', value)
                        }}
                      />
                    </div>

                    {/* Token de acesso */}
                    {useConversionsApi && (
                      <div>
                        <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                          Token de acesso:
                        </label>
                        <textarea
                          {...register('accessToken')}
                          className="w-full h-20 px-4 py-3 border border-neutral-200 rounded-lg resize-none text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zhex-base-500 focus:border-transparent"
                          placeholder="EAA..."
                        />
                      </div>
                    )}

                    {/* Eventos */}
                    <div>
                      <label className="text-neutral-1000 font-medium font-araboto text-base mb-4 block">
                        Eventos:
                      </label>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-600">Enviar 'PageView'?</span>
                          <Switch
                            active={events.pageView}
                            setValue={() => toggleEvent('pageView')}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-600">Enviar 'AddToCart'?</span>
                          <Switch
                            active={events.addToCart}
                            setValue={() => toggleEvent('addToCart')}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-600">Enviar 'InitiateCheckout'?</span>
                          <Switch
                            active={events.initiateCheckout}
                            setValue={() => toggleEvent('initiateCheckout')}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-600">Enviar 'InitiateCheckout' somente após o usuário informar os dados pessoais?</span>
                          <Switch
                            active={events.initiateCheckoutWithData}
                            setValue={() => toggleEvent('initiateCheckoutWithData')}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-600">Enviar 'AddPaymentInfo'?</span>
                          <Switch
                            active={events.addPaymentInfo}
                            setValue={() => toggleEvent('addPaymentInfo')}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-600">Enviar 'Purchase'?</span>
                          <Switch
                            active={events.purchase}
                            setValue={() => toggleEvent('purchase')}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Google specific fields */}
                {pixelType === 'google' && (
                  <>
                    {/* Label de conversão */}
                    <div>
                      <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                        Label de conversão:
                      </label>
                      <TextField
                        {...register('conversionLabel')}
                        placeholder="Digite o label de conversão"
                        error={errors.conversionLabel?.message}
                      />
                    </div>

                    {/* Eventos Google */}
                    <div>
                      <label className="text-neutral-1000 font-medium font-araboto text-base mb-4 block">
                        Eventos:
                      </label>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-600">Enviar initiate Checkout?</span>
                          <Switch
                            active={googleEvents.initiateCheckout}
                            setValue={() => toggleEvent('initiateCheckout', false)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-600">Enviar 'Purchase'?</span>
                          <Switch
                            active={googleEvents.purchase}
                            setValue={() => toggleEvent('purchase', false)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Botão de criar - Fixo no final */}
              <div className="px-8 py-6 flex-shrink-0">
                <Button
                  type="submit"
                  variant="primary"
                  size="full"
                  className="w-full"
                >
                  Cadastrar pixel
                </Button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
