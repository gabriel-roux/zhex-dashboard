'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import SignatureCanvas from 'react-signature-canvas'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs'
import { PasswordField, TextField } from '@/components/textfield'
import { ContractSignatureData, OnboardingStatus } from '@/@types/onboarding'
import { Button } from '@/components/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { OnboardingSuccessModal } from '../onboarding-success-modal'
import { useAuth } from '@/contexts/auth/context'

/* -------------------------------------------------------------------------- */
/* Schema                                                                     */
/* -------------------------------------------------------------------------- */
const signatureSchema = z.object({
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string().min(1, 'Confirme sua senha'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

type SignatureFormValues = z.infer<typeof signatureSchema>

interface SignatureFormProps {
  onSubmit: (data: ContractSignatureData) => Promise<OnboardingStatus>
  isLoading?: boolean
  error?: string | null
  setCurrentStep: (step: number) => void
}

export function SignatureForm({
  onSubmit,
  isLoading = false,
  error,
}: SignatureFormProps) {
  const padRef = useRef<SignatureCanvas | null>(null)
  const [mode, setMode] = useState<'draw' | 'type'>('draw')
  const [typed, setTyped] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const { isAuthenticated } = useAuth()

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm<SignatureFormValues>({
    resolver: isAuthenticated
      ? undefined
      : zodResolver(signatureSchema),
  })

  const clearPad = () => padRef.current?.clear()

  // Ctrl+Z / Cmd+Z triggers clear
  useEffect(() => {
    const handleUndo = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        clearPad()
      }
    }
    window.addEventListener('keydown', handleUndo)
    return () => window.removeEventListener('keydown', handleUndo)
  }, [])

  const handleSubmit = async (data: SignatureFormValues) => {
    const result = await onSubmit({
      signatureType: mode === 'draw'
        ? 'DIGITAL'
        : 'HANDWRITTEN',
      signatureData: padRef.current?.toDataURL()?.split(',')[1],
      acceptTerms: true,
      password: data.password,
    }) as { nextStep?: { step: number; title: string; description: string; accessToken?: string; refreshToken?: string } }

    if (result.nextStep) {
      setShowSuccessModal(true)
    }
  }

  return (
    <>
      <form onSubmit={handleFormSubmit(handleSubmit)} className="flex flex-col gap-6">
        {/* Campos de senha */}
        {!isAuthenticated && (
          <div className="flex flex-col gap-4 max-w-[460px]">
            <div>
              <h3 className="text-lg font-araboto font-semibold text-neutral-950">
                Defina sua senha de acesso
              </h3>
              <p className="text-neutral-500 font-araboto text-sm">
                Crie uma senha segura para acessar sua conta após o onboarding.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-neutral-950 font-araboto">
                  Senha: <span className="text-red-secondary-500">*</span>
                </label>
                <PasswordField
                  type="password"
                  placeholder="Digite sua senha"
                  {...register('password')}
                  error={errors.password?.message}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-neutral-950 font-araboto">
                  Confirmar Senha: <span className="text-red-secondary-500">*</span>
                </label>
                <PasswordField
                  type="password"
                  placeholder="Confirme sua senha"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                />
              </div>
            </div>
          </div>
        )}
        {/* Campos de senha */}

        {/* header */}
        <h2 className="text-lg font-araboto font-semibold text-neutral-950">
          Sua assinatura.
        </h2>

        {/* Card */}
        <Tabs value={mode} onValueChange={(v) => setMode(v as 'draw' | 'type')}>
          <div className="w-full max-w-[460px] rounded-lg border border-neutral-200 overflow-hidden">
            <TabsContent value="draw">
              <SignatureCanvas
                ref={padRef}
                penColor="#0F172A"
                canvasProps={{
                  width: 460,
                  height: 260,
                  className: 'bg-white cursor-crosshair',
                }}
              />
              <div className="flex justify-end p-2">
                <button
                  type="button"
                  onClick={clearPad}
                  className="text-sm text-neutral-500 hover:text-neutral-700"
                >
                  Limpar
                </button>
              </div>
            </TabsContent>
            <TabsContent value="type">
              <div className="p-6 flex flex-col gap-4">
                <TextField
                  placeholder="Digite seu nome"
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                />
                <div className="h-24 flex items-center justify-center border border-neutral-200 rounded-lg">
                  <span className="font-signature text-4xl text-neutral-900">
                    {typed || 'Sua Assinatura'}
                  </span>
                </div>
              </div>
            </TabsContent>
          </div>

          {/* Tab buttons */}
          <TabsList className="grid grid-cols-2 w-full max-w-[460px] mt-4 border border-neutral-200 rounded-lg">
            <TabsTrigger
              value="draw"
              className="py-3 text-sm font-medium data-[state=active]:border data-[state=active]:border-neutral-200 rounded-lg"
            >
              Rabisco
            </TabsTrigger>
            <TabsTrigger
              value="type"
              className="py-3 text-sm font-medium data-[state=active]:border data-[state=active]:border-neutral-200 rounded-lg"
            >
              Escrita
            </TabsTrigger>
          </TabsList>

          {/* Footer */}
          <p className="text-neutral-500 font-araboto text-sm mt-4 max-w-[460px]">
            Para concluir o processo de verificação, é necessário assinar o
            contrato de adesão. Por favor, leia atentamente nossos{' '}
            <Link href="#" className="text-zhex-base-500 underline">
              termos
            </Link>
            .
          </p>

          <p className="text-neutral-500 font-araboto text-sm mt-4 max-w-[460px]">
            Sua assinatura digital serve apenas para formalizar o contrato de
            adesão. Ela fica criptografada em nossos servidores e não é
            compartilhada com terceiros.
          </p>
        </Tabs>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-4 mt-8">
          <Button
            size="large"
            loading={isLoading}
            variant="primary"
            className="w-[222px]"
          >
            Continuar
          </Button>
        </div>
      </form>

      {/* Success Modal */}
      <OnboardingSuccessModal
        isOpen={showSuccessModal}
        onClose={() => { window.location.href = '/login' }}
      />
    </>
  )
}
