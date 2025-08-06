import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/button'
import { TextField } from '@/components/textfield'
import { XCircleIcon } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useApi } from '@/hooks/useApi'
import WhiteTheme from '@/assets/images/white-theme.svg'
import BlackTheme from '@/assets/images/dark-theme.svg'
import Image from 'next/image'

// Schema de validação
const checkoutSchema = z.object({
  name: z.string().min(1, 'Nome do checkout é obrigatório'),
  theme: z.string().min(1, 'Tema é obrigatório'),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

interface CreateCheckoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string
  onCheckoutCreated: () => void
}

export function CreateCheckoutModal({
  open,
  onOpenChange,
  productId,
  onCheckoutCreated,
}: CreateCheckoutModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { post } = useApi()

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: 'Checkout #001',
      theme: 'white',
    },
  })

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setLoading(true)
      setError(null)

      const response = await post<{ success: boolean; message?: string; error?: string }>(`/products/${productId}/checkouts`, {
        name: data.name,
        theme: data.theme,
      })

      if (response.data.success) {
        onCheckoutCreated()
        reset()
      } else {
        setError(response.data.error || response.data.message || 'Erro ao criar checkout')
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error)
      setError('Erro ao criar checkout. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) {
          reset()
          setError(null)
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-neutral-1000/50 backdrop-blur-sm z-50" />
        <Dialog.Content
          style={{
            maxWidth: 440,
            right: 0,
            top: 0,
          }}
          className="fixed right-0 top-0 h-full w-[440px] bg-white shadow-2xl z-50 flex flex-col"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-200 flex-shrink-0">
              <Dialog.Title className="text-lg font-araboto font-medium text-neutral-1000">
                Criar novo checkout
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
                {/* Nome do checkout */}
                <div>
                  <label className="text-neutral-1000 font-medium font-araboto text-base block mb-2">
                    Nome do checkout:
                  </label>

                  <TextField
                    {...register('name')}
                    placeholder="Checkout #001"
                    error={errors.name?.message}
                  />
                </div>

                <div>
                  <div>
                    <label className="text-neutral-1000 font-medium font-araboto text-base mb-1 block">
                      Defina um tema para o checkout:
                    </label>
                    <p className="text-neutral-600 text-sm mb-4">
                      Você poderá personalizar cores, layouts e funcionalidades para oferecer uma experiência única aos seus clientes.
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      className={`rounded-lg border-2 relative border-dashed transition-all duration-300 ${watch('theme') === 'white'
? 'border-zhex-base-500'
: 'border-transparent'}`} onClick={() => setValue('theme', 'white')}
                    >
                      <Image
                        src={WhiteTheme} alt="Tema 1" width={185} height={110} className="w-full h-full"
                      />

                      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-4 h-4 border-2 border-zhex-base-500 rounded-full flex items-center justify-center">
                        {watch('theme') === 'white' && <div className="w-2 h-2 bg-zhex-base-500 rounded-full" />}
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`rounded-lg border-2 relative border-dashed transition-all duration-300 ${watch('theme') === 'dark'
? 'border-zhex-base-500'
: 'border-transparent'}`} onClick={() => setValue('theme', 'dark')}
                    >
                      <Image
                        src={BlackTheme} alt="Tema 1" width={185} height={110} className="w-full h-full"
                      />

                      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-4 h-4 border-2 border-zhex-base-500 rounded-full flex items-center justify-center">
                        {watch('theme') === 'dark' && <div className="w-2 h-2 bg-zhex-base-500 rounded-full" />}
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="px-8">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Botão de criar - Fixo no final */}
              <div className="px-8 py-6 flex-shrink-0">
                <Button
                  type="submit"
                  variant="primary"
                  size="full"
                  className="w-full"
                  loading={loading}
                >
                  Criar checkout
                </Button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
