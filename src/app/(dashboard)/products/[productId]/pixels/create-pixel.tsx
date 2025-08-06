import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/button'
import { TextField } from '@/components/textfield'
import { Option } from '@/components/option'
import { XCircleIcon, FacebookLogoIcon, GoogleLogoIcon } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { Switch } from '@/components/switch'
import { useApi } from '@/hooks/useApi'
import { Pixel } from '@/@types/pixel'

// Schema de validação
const pixelSchema = z.object({
  name: z.string().min(1, 'Nome do pixel é obrigatório'),
  pixelType: z.enum(['FACEBOOK', 'GOOGLE_ANALYTICS', 'GOOGLE_TAG_MANAGER', 'TIKTOK']),
  pixelId: z.string().min(1, 'ID do pixel é obrigatório'),
  useConversionsApi: z.boolean().optional(),
  accessToken: z.string().optional(),
  trackPageView: z.boolean().optional(),
  trackAddToCart: z.boolean().optional(),
  trackInitiateCheckout: z.boolean().optional(),
  trackPurchase: z.boolean().optional(),
  trackAddPaymentInfo: z.boolean().optional(),
})

type PixelFormData = z.infer<typeof pixelSchema>

interface PixelModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string
  onPixelCreated: () => void
  mode: 'create' | 'edit'
  pixelToEdit?: Pixel | null
}

export function PixelModal({ open, onOpenChange, productId, onPixelCreated, mode, pixelToEdit }: PixelModalProps) {
  const [pixelType, setPixelType] = useState<'FACEBOOK' | 'GOOGLE_ANALYTICS' | 'GOOGLE_TAG_MANAGER' | 'TIKTOK'>('FACEBOOK')
  const [error, setError] = useState<string | null>(null)

  // Facebook states
  const [useConversionsApi, setUseConversionsApi] = useState(false)
  const [events, setEvents] = useState({
    pageView: true,
    addToCart: true,
    initiateCheckout: true,
    purchase: true,
    addPaymentInfo: false,
  })

  // Google states
  const [googleEvents, setGoogleEvents] = useState({
    initiateCheckout: false,
    purchase: false,
  })

  const { post, put } = useApi()

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<PixelFormData>({
    resolver: zodResolver(pixelSchema),
    defaultValues: {
      name: mode === 'edit' && pixelToEdit
        ? pixelToEdit.name
        : '',
      pixelType: mode === 'edit' && pixelToEdit
        ? pixelToEdit.pixelType
        : 'FACEBOOK',
      pixelId: mode === 'edit' && pixelToEdit
        ? pixelToEdit.pixelId
        : '',
      useConversionsApi: mode === 'edit' && pixelToEdit
        ? pixelToEdit.useConversionsApi
        : false,
      accessToken: mode === 'edit' && pixelToEdit
        ? pixelToEdit.accessToken || ''
        : '',
      trackPageView: mode === 'edit' && pixelToEdit
        ? pixelToEdit.trackPageView
        : true,
      trackAddToCart: mode === 'edit' && pixelToEdit
        ? pixelToEdit.trackAddToCart
        : true,
      trackInitiateCheckout: mode === 'edit' && pixelToEdit
        ? pixelToEdit.trackInitiateCheckout
        : true,
      trackPurchase: mode === 'edit' && pixelToEdit
        ? pixelToEdit.trackPurchase
        : true,
      trackAddPaymentInfo: mode === 'edit' && pixelToEdit
        ? pixelToEdit.trackAddPaymentInfo
        : false,
    },
  })

  // Resetar formulário quando modal abre/fecha ou muda o modo
  useEffect(() => {
    if (open) {
      reset({
        name: mode === 'edit' && pixelToEdit
          ? pixelToEdit.name
          : '',
        pixelType: mode === 'edit' && pixelToEdit
          ? pixelToEdit.pixelType
          : 'FACEBOOK',
        pixelId: mode === 'edit' && pixelToEdit
          ? pixelToEdit.pixelId
          : '',
        useConversionsApi: mode === 'edit' && pixelToEdit
          ? pixelToEdit.useConversionsApi
          : false,
        accessToken: mode === 'edit' && pixelToEdit
          ? pixelToEdit.accessToken || ''
          : '',
        trackPageView: mode === 'edit' && pixelToEdit
          ? pixelToEdit.trackPageView
          : true,
        trackAddToCart: mode === 'edit' && pixelToEdit
          ? pixelToEdit.trackAddToCart
          : true,
        trackInitiateCheckout: mode === 'edit' && pixelToEdit
          ? pixelToEdit.trackInitiateCheckout
          : true,
        trackPurchase: mode === 'edit' && pixelToEdit
          ? pixelToEdit.trackPurchase
          : true,
        trackAddPaymentInfo: mode === 'edit' && pixelToEdit
          ? pixelToEdit.trackAddPaymentInfo
          : false,
      })
      setPixelType(mode === 'edit' && pixelToEdit
        ? pixelToEdit.pixelType
        : 'FACEBOOK')
      setUseConversionsApi(mode === 'edit' && pixelToEdit
        ? pixelToEdit.useConversionsApi
        : false)
      setEvents({
        pageView: mode === 'edit' && pixelToEdit
          ? pixelToEdit.trackPageView
          : true,
        addToCart: mode === 'edit' && pixelToEdit
          ? pixelToEdit.trackAddToCart
          : true,
        initiateCheckout: mode === 'edit' && pixelToEdit
          ? pixelToEdit.trackInitiateCheckout
          : true,
        purchase: mode === 'edit' && pixelToEdit
          ? pixelToEdit.trackPurchase
          : true,
        addPaymentInfo: mode === 'edit' && pixelToEdit
          ? pixelToEdit.trackAddPaymentInfo
          : false,
      })
      setGoogleEvents({
        initiateCheckout: mode === 'edit' && pixelToEdit
          ? pixelToEdit.trackInitiateCheckout
          : false,
        purchase: mode === 'edit' && pixelToEdit
          ? pixelToEdit.trackPurchase
          : false,
      })
    }
  }, [open, mode, pixelToEdit, reset])

  const onSubmit = async (data: PixelFormData) => {
    try {
      if (mode === 'create') {
        const response = await post<{ success: boolean; message: string }>(`/products/${productId}/pixels`, {
          name: data.name,
          pixelType: data.pixelType,
          pixelId: data.pixelId,
          useConversionsApi: data.pixelType === 'FACEBOOK'
            ? useConversionsApi
            : false,
          accessToken: data.pixelType === 'FACEBOOK' && useConversionsApi
            ? data.accessToken
            : undefined,
          trackPageView: data.pixelType === 'FACEBOOK'
            ? events.pageView
            : true,
          trackAddToCart: data.pixelType === 'FACEBOOK'
            ? events.addToCart
            : true,
          trackInitiateCheckout: data.pixelType === 'FACEBOOK'
            ? events.initiateCheckout
            : googleEvents.initiateCheckout,
          trackPurchase: data.pixelType === 'FACEBOOK'
            ? events.purchase
            : googleEvents.purchase,
          trackAddPaymentInfo: data.pixelType === 'FACEBOOK'
            ? events.addPaymentInfo
            : false,
        })

        if (response.data.success) {
          onPixelCreated()
          onOpenChange(false)
          setError(null)
        } else {
          setError(response.data.message)
        }
      } else if (mode === 'edit' && pixelToEdit) {
        const response = await put<{ success: boolean; message: string }>(`/products/${productId}/pixels/${pixelToEdit.id}`, {
          name: data.name,
          pixelType: data.pixelType,
          pixelId: data.pixelId,
          useConversionsApi: data.pixelType === 'FACEBOOK'
            ? useConversionsApi
            : false,
          accessToken: data.pixelType === 'FACEBOOK' && useConversionsApi
            ? data.accessToken
            : undefined,
          trackPageView: data.pixelType === 'FACEBOOK'
            ? events.pageView
            : true,
          trackAddToCart: data.pixelType === 'FACEBOOK'
            ? events.addToCart
            : true,
          trackInitiateCheckout: data.pixelType === 'FACEBOOK'
            ? events.initiateCheckout
            : googleEvents.initiateCheckout,
          trackPurchase: data.pixelType === 'FACEBOOK'
            ? events.purchase
            : googleEvents.purchase,
          trackAddPaymentInfo: data.pixelType === 'FACEBOOK'
            ? events.addPaymentInfo
            : false,
        })

        if (response.data.success) {
          onPixelCreated()
    onOpenChange(false)
          setError(null)
        } else {
          setError(response.data.message)
        }
      }
    } catch (error) {
      console.error(`Erro ao ${mode === 'create'
? 'criar'
: 'editar'} pixel:`, error)
    }
  }

  const handlePixelTypeChange = (type: 'FACEBOOK' | 'GOOGLE_ANALYTICS' | 'GOOGLE_TAG_MANAGER' | 'TIKTOK') => {
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
                  ? 'Cadastrar novo pixel'
                  : 'Editar pixel'}
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
                      selected={pixelType === 'FACEBOOK'}
                      onSelect={() => handlePixelTypeChange('FACEBOOK')}
                    />
                    <Option
                      label="Google"
                      className="w-full justify-center items-center"
                      icon={GoogleLogoIcon}
                      selected={pixelType === 'GOOGLE_ANALYTICS' || pixelType === 'GOOGLE_TAG_MANAGER'}
                      onSelect={() => handlePixelTypeChange('GOOGLE_ANALYTICS')}
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
                    placeholder={pixelType === 'FACEBOOK'
                      ? 'FB_123456789012345'
                      : 'GA_G-XXXXXXXXXX'}
                    error={errors.pixelId?.message}
                  />
                </div>

                {/* Facebook specific fields */}
                {pixelType === 'FACEBOOK' && (
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
                {(pixelType === 'GOOGLE_ANALYTICS' || pixelType === 'GOOGLE_TAG_MANAGER') && (
                  <>
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
                >
                  {mode === 'create'
                    ? 'Cadastrar pixel'
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
