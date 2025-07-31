'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/button'
import { TextField } from '@/components/textfield'
import { XCircleIcon, LockIcon, EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import React from 'react'
import { useApi } from '@/hooks/useApi'
import Lottie from 'lottie-react'
import successAnimationData from '@/assets/animations/success.json'

interface PasswordChangeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(8, 'A nova senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
}).refine((data) => data.newPassword !== data.currentPassword, {
  message: 'A nova senha deve ser diferente da atual',
  path: ['newPassword'],
})

type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>

export function PasswordChangeModal({ open, onOpenChange }: PasswordChangeModalProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { put } = useApi()

  const form = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    mode: 'onChange',
  })

  const onSubmit = async (data: PasswordChangeFormData) => {
    setLoading(true)
    try {
      const response = await put<{ success: boolean; message: string }>('/users/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })

      if (response.data.success) {
        setSuccess(true)
        setError(null)
      } else {
        setError(response.data.message)
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
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
    if (!loading) {
      setSuccess(false)
      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
      setError(null)
      form.reset()
      onOpenChange(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-full max-w-md z-50 shadow-xl">
          {!success
            ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-lg font-semibold text-neutral-1000">
                    Alterar senha
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button className="text-neutral-500 hover:text-red-secondary-500 transition-colors">
                      <XCircleIcon size={20} weight="fill" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
                    <LockIcon size={16} className="text-blue-500" weight="bold" />
                    <p className="text-blue-700 text-sm">
                      Sua senha deve ter pelo menos 8 caracteres
                    </p>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Digite sua senha atual e a nova senha desejada para fazer a alteração.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-1000">
                      Senha atual <span className="text-red-secondary-500">*</span>
                    </label>
                    <div className="relative">
                      <TextField
                        {...form.register('currentPassword')}
                        error={form.formState.errors.currentPassword?.message}
                        placeholder="Digite sua senha atual"
                        type={showCurrentPassword
                          ? 'text'
                          : 'password'}
                        rightIcon={
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="text-neutral-500 hover:text-neutral-700"
                          >
                            {showCurrentPassword
                              ? <EyeSlashIcon size={16} />
                              : <EyeIcon size={16} />}
                          </button>
                      }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-1000">
                      Nova senha <span className="text-red-secondary-500">*</span>
                    </label>
                    <div className="relative">
                      <TextField
                        {...form.register('newPassword')}
                        error={form.formState.errors.newPassword?.message}
                        placeholder="Digite sua nova senha"
                        type={showNewPassword
                          ? 'text'
                          : 'password'}
                        rightIcon={
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="text-neutral-500 hover:text-neutral-700"
                          >
                            {showNewPassword
                              ? <EyeSlashIcon size={16} />
                              : <EyeIcon size={16} />}
                          </button>
                      }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-1000">
                      Confirmar nova senha <span className="text-red-secondary-500">*</span>
                    </label>
                    <div className="relative">
                      <TextField
                        {...form.register('confirmPassword')}
                        error={form.formState.errors.confirmPassword?.message}
                        placeholder="Confirme sua nova senha"
                        type={showConfirmPassword
                          ? 'text'
                          : 'password'}
                        rightIcon={
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="text-neutral-500 hover:text-neutral-700"
                          >
                            {showConfirmPassword
                              ? <EyeSlashIcon size={16} />
                              : <EyeIcon size={16} />}
                          </button>
                      }
                      />
                    </div>
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
                        ? 'Alterando...'
                        : 'Alterar senha'}
                    </Button>
                  </div>
                </form>
              </>
              )
            : (
              <div className="text-center flex flex-col items-center gap-4">
                <div className="w-28 h-28">
                  <Lottie
                    animationData={successAnimationData}
                    loop
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>

                <div>
                  <Dialog.Title className="text-lg font-semibold text-neutral-1000 mb-2">
                    Senha alterada com sucesso!
                  </Dialog.Title>

                  <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                    Sua senha foi alterada com sucesso. Use a nova senha no próximo login.
                  </p>
                </div>

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
