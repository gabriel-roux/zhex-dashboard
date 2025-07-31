'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/button'
import { TextField } from '@/components/textfield'
import { XCircleIcon, EnvelopeIcon } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import React from 'react'
import { useApi } from '@/hooks/useApi'
import { useWebSocket, EmailChangedData } from '@/contexts/websocket/context'
import { useAuth } from '@/contexts/auth/context'
import Lottie from 'lottie-react'
import successAnimationData from '@/assets/animations/success.json'

interface EmailChangeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentEmail: string
}

const emailChangeSchema = z.object({
  newEmail: z.string().email('E-mail inválido'),
  confirmEmail: z.string().email('E-mail inválido'),
}).refine((data) => data.newEmail === data.confirmEmail, {
  message: 'Os e-mails não coincidem',
  path: ['confirmEmail'],
})

type EmailChangeFormData = z.infer<typeof emailChangeSchema>

export function EmailChangeModal({ open, onOpenChange, currentEmail }: EmailChangeModalProps) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [verified, setVerified] = useState(false)
  const { post } = useApi()
  const { onEmailChanged, isConnected } = useWebSocket()
  const [error, setError] = useState<string | null>(null)
  const { user, updateUser } = useAuth()

  console.log('🔌 WebSocket connection status:', isConnected)

  const form = useForm<EmailChangeFormData>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: {
      newEmail: '',
      confirmEmail: '',
    },
  })

  // Configurar listeners do WebSocket
  useEffect(() => {
    console.log('🔌 Setting up WebSocket listeners...')

    // Listener para mudança de email confirmada
    const handleEmailChanged = (data: EmailChangedData) => {
      console.log('📧 Email changed via WebSocket:', data)
      setVerified(true)
      setLoading(false) // Parar loading quando confirmado

      // Atualizar dados do usuário no contexto
      if (user) {
        updateUser({
          ...user,
          email: data.newEmail,
        })
        console.log('👤 User context updated with new email:', data.newEmail)
      }
    }

    // Registrar listeners
    onEmailChanged(handleEmailChanged)
    console.log('✅ WebSocket listener registered for email_changed')

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up WebSocket listeners')
      // Os listeners são limpos automaticamente pelo socket.io
    }
  }, [onEmailChanged, user, updateUser])

  const onSubmit = async (data: EmailChangeFormData) => {
    setLoading(true)
    try {
      const response = await post<{ success: boolean; message: string }>('/users/change-email', {
        newEmail: data.newEmail,
      })

      console.log('API Response:', response)

      if (response.data.success) {
        console.log('Setting sent to true')
        setSent(true)
        setError(null)
      } else {
        setError(response.data.message)
      }
    } catch (error) {
      console.error('Erro ao alterar e-mail:', error)
      // Aqui você pode adicionar um toast de erro
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit(onSubmit)(e)
  }

  const handleClose = () => {
    setLoading(false)
    setSent(false)
    setVerified(false)
    setError(null)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-full max-w-md z-50 shadow-xl">
          {!sent
            ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-lg font-semibold text-neutral-1000">
                    Alterar e-mail
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button className="text-neutral-500 hover:text-red-secondary-500 transition-colors">
                      <XCircleIcon size={20} weight="fill" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
                    <EnvelopeIcon size={16} className="text-blue-500" weight="bold" />
                    <p className="text-blue-700 text-sm">
                      E-mail atual: <strong>{currentEmail}</strong>
                    </p>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Digite seu novo e-mail abaixo. Enviaremos um e-mail de confirmação para validar a alteração.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-1000">
                      Novo e-mail <span className="text-red-secondary-500">*</span>
                    </label>
                    <TextField
                      {...form.register('newEmail')}
                      error={form.formState.errors.newEmail?.message}
                      placeholder="Digite seu novo e-mail"
                      type="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-1000">
                      Confirmar novo e-mail <span className="text-red-secondary-500">*</span>
                    </label>
                    <TextField
                      {...form.register('confirmEmail')}
                      error={form.formState.errors.confirmEmail?.message}
                      placeholder="Confirme seu novo e-mail"
                      type="email"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Dialog.Close asChild>
                      <Button variant="ghost" size="medium" className="w-1/2" disabled={loading}>
                        Cancelar
                      </Button>
                    </Dialog.Close>
                    <Button
                      type="submit"
                      variant="primary"
                      size="medium"
                      className="w-1/2"
                      loading={loading}
                    >
                      {loading
                        ? 'Enviando...'
                        : 'Enviar confirmação'}
                    </Button>
                  </div>
                </form>
              </>
              )
            : !verified
                ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>

                    <Dialog.Title className="text-lg font-semibold text-neutral-1000 mb-2">
                      {loading
                        ? 'Aguardando confirmação...'
                        : 'E-mail de confirmação enviado!'}
                    </Dialog.Title>

                    <p className="text-sm text-neutral-600 leading-relaxed mb-3">
                      Enviamos um e-mail de confirmação para {form.getValues('newEmail')}. Clique no link do e-mail para confirmar a alteração.
                    </p>

                    <div className="flex items-baseline justify-center gap-1 text-blue-600 text-sm mb-6">
                      <span>Verificando em tempo real</span>
                      <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse" />
                      <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>

                    <Button
                      onClick={handleClose}
                      variant="ghost"
                      size="medium"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading
                        ? 'Aguardando...'
                        : 'Fechar'}
                    </Button>
                  </div>
                  )
                : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-28 h-28">
                      <Lottie
                        animationData={successAnimationData}
                        loop
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>

                    <Dialog.Title className="text-lg font-semibold text-neutral-1000 mb-2">
                      E-mail alterado com sucesso! 🎉
                    </Dialog.Title>

                    <p className="text-sm text-neutral-600 leading-relaxed mb-6 text-center">
                      Seu e-mail foi alterado para <strong>{form.getValues('newEmail')}</strong> com sucesso.
                      Agora você pode continuar usando a Zhex com seu novo e-mail.
                    </p>

                    <Button
                      onClick={handleClose}
                      variant="primary"
                      size="medium"
                      className="w-full"
                    >
                      Fechar
                    </Button>
                  </div>
                  )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
