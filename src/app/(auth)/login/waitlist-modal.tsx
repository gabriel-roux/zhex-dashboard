/* eslint-disable @stylistic/jsx-closing-tag-location */
'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { InfoIcon, XCircleIcon } from '@phosphor-icons/react'
import {
  SelectField,
  Textarea,
  TextField,
} from '@/components/textfield'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/button'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Lottie from 'lottie-react'
import successAnimationData from '@/assets/animations/email.json'
import { useAuth } from '@/contexts/auth/context'

interface WaitlistFormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  revenue: string
  solution: string
  referral: string
  socialMedia?: string
  reason: string
}

export const WaitlistModal = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<WaitlistFormValues>()
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)
  const [error, setError] = useState<string>('')
  const { registerInWaitlist } = useAuth()

  // anima a largura do container quando o estado muda
  const containerVariants = {
    form: { maxWidth: 990 },
    success: { maxWidth: 678 },
  } as const

  const onSubmit = async (data: WaitlistFormValues) => {
    try {
      const response = await registerInWaitlist({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        socialMedia: data.socialMedia,
        role: data.role,
        revenue: data.revenue,
        solution: data.solution,
        referral: data.referral,
        reason: data.reason,
      })

      console.log('response →', response)

      if (response.success) {
        setAlreadySubmitted(true)
        reset()
      } else {
        setError(response.message)
      }
    } catch (error) {
      console.error('Error registering in waitlist:', error)
      // TODO: Show error toast
    }
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-neutral-1000/50 backdrop-blur-sm z-40" />

      <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div
          layout="size" // 👈 faz width *e* height animarem juntas
          style={{ width: '100%' }}
          className="rounded-2xl bg-white p-8 shadow-xl overflow-hidden"
          variants={containerVariants}
          initial={alreadySubmitted
            ? 'success'
            : 'form'}
          animate={alreadySubmitted
            ? 'success'
            : 'form'}
          transition={{ type: 'spring', damping: 20, stiffness: 120 }}
        >
          {!alreadySubmitted
            ? <>
              {/* Header ------------------------------------------------------ */}
              <div className="flex justify-between">
                <div>
                  <Dialog.Title className="text-2xl font-medium font-araboto text-neutral-1000">
                    Nossa lista de espera.
                  </Dialog.Title>
                  <Dialog.Description className="text-neutral-700 mt-1">
                    Preencha os dados abaixo para entrar em nossa lista.
                  </Dialog.Description>
                </div>

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

              {/* Info banner ------------------------------------------------- */}
              <div className="flex items-center gap-2 bg-zhex-base-500/10 rounded-lg px-3 py-2 mt-6">
                <InfoIcon
                  size={16}
                  className="text-zhex-base-500"
                  weight="bold"
                />
                <p className="text-zhex-base-600 text-sm">
                  Nossa lista está aberta por tempo limitado e as vantagens são
                  exclusivas só para quem garantir sua vaga antes do lançamento.
                </p>
              </div>

              {/* Form -------------------------------------------------------- */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 flex flex-col gap-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-neutral-950 font-araboto font-medium">
                      Primeiro Nome{' '}
                      <span className="text-red-secondary-500">*</span>
                    </label>
                    <TextField
                      placeholder="Digite seu primeiro nome"
                      {...register('firstName', { required: true })}
                      error={errors.firstName && 'Campo obrigatório'}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-neutral-950 font-araboto font-medium">
                      Sobrenome{' '}
                      <span className="text-red-secondary-500">*</span>
                    </label>
                    <TextField
                      placeholder="Digite seu sobrenome"
                      {...register('lastName', { required: true })}
                      error={errors.lastName && 'Campo obrigatório'}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-neutral-950 font-araboto font-medium">
                      E-mail <span className="text-red-secondary-500">*</span>
                    </label>
                    <TextField
                      type="email"
                      placeholder="Digite seu e-mail"
                      {...register('email', { required: true })}
                      error={errors.email && 'Campo obrigatório'}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-neutral-950 font-araboto font-medium">
                      Telefone <span className="text-red-secondary-500">*</span>
                    </label>
                    <TextField
                      placeholder="(00) 00000-0000"
                      {...register('phone', { required: true })}
                      error={errors.phone && 'Campo obrigatório'}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-neutral-950 font-araboto font-medium">
                      Rede social{' '}
                      <span className="text-red-secondary-500">*</span>
                    </label>
                    <TextField
                      placeholder="@Digite seu usuário"
                      {...register('socialMedia', { required: true })}
                      error={errors.socialMedia && 'Campo obrigatório'}
                    />
                  </div>

                  {/* Selects ------------------------------------------------ */}
                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-neutral-950 font-araboto font-medium">
                      Cargo? <span className="text-red-secondary-500">*</span>
                    </label>
                    <SelectField
                      name="role"
                      control={control}
                      options={[
                        { value: 'founder_ceo', label: 'Founder / CEO' },
                        {
                          value: 'c_level',
                          label: 'C-Level (CTO / CFO / COO)',
                        },
                        { value: 'product', label: 'Produto / UX' },
                        {
                          value: 'marketing_growth',
                          label: 'Marketing / Growth',
                        },
                        { value: 'sales', label: 'Vendas' },
                        { value: 'finance', label: 'Financeiro / Back-Office' },
                        { value: 'tech_lead', label: 'Tech Lead / Dev' },
                        {
                          value: 'ops_compliance',
                          label: 'Operações / Compliance',
                        },
                        { value: 'other', label: 'Outro' },
                      ]}
                      placeholder="Selecione seu cargo"
                      error={errors.role && 'Campo obrigatório'}
                    />
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-neutral-950 font-araboto font-medium">
                      Volume anual de faturamento em Reais:{' '}
                      <span className="text-red-secondary-500">*</span>
                    </label>
                    <SelectField
                      name="revenue"
                      control={control}
                      options={[
                        { value: '<100k', label: '≤ R$100 mil' },
                        { value: '100k-1m', label: 'R$100 mil – R$1 mi' },
                        { value: '1m-5m', label: 'R$1 mi – R$5 mi' },
                        { value: '>5m', label: '≥ R$5 mi' },
                      ]}
                      placeholder="Selecione"
                      error={errors.revenue && 'Campo obrigatório'}
                    />
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-neutral-950 font-araboto font-medium">
                      Que solução você está procurando?{' '}
                      <span className="text-red-secondary-500">*</span>
                    </label>
                    <SelectField
                      name="solution"
                      control={control}
                      options={[
                        { value: 'gateway', label: 'Gateway de Pagamentos' },
                        { value: 'checkout', label: 'Checkout' },
                        { value: 'anti_fraud', label: 'Anti‑Fraude' },
                        { value: 'analytics', label: 'Analytics & BI' },
                        { value: 'split', label: 'Split de Pagamentos' },
                        {
                          value: 'subscriptions',
                          label: 'Recorrência / Subscriptions',
                        },
                      ]}
                      placeholder="Selecione"
                      error={errors.solution && 'Campo obrigatório'}
                    />
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-neutral-950 font-araboto font-medium">
                      Como você ficou sabendo de nós?
                    </label>
                    <TextField
                      placeholder="Ex: Redes Sociais"
                      {...register('referral')}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-neutral-950 font-araboto">
                    Conte nos um pouco mais sobre sua operação e sua empresa{' '}
                    <span className="text-red-secondary-500">*</span>
                  </label>
                  <Textarea
                    rows={4}
                    placeholder="Conte-nos mais sobre sua operação e empresa"
                    error={errors.reason && 'Campo obrigatório'}
                    {...register('reason', { required: true })}
                    className="w-full p-4 min-h-14 h-14 rounded-xl border border-neutral-100 bg-transparent text-neutral-1000 placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                {error && (
                  <p className="text-red-secondary-500 text-sm">{error}</p>
                )}

                <Button variant="primary" size="full" disabled={isSubmitting}>
                  {isSubmitting
                    ? 'Enviando...'
                    : 'Entrar na lista'}
                </Button>
              </form>
            </>
            : (
              <div className="flex flex-col items-center gap-6 w-full">
                <div className="w-28 h-28">
                  <Lottie
                    animationData={successAnimationData}
                    loop={false}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>

                <div className="flex flex-col items-center">
                  <Dialog.Title className="text-2xl font-araboto font-medium text-neutral-1000">
                    Obrigado por se inscrever na lista de espera!
                  </Dialog.Title>
                  <p className="text-neutral-700 text-center max-w-xl">
                    Em breve, você receberá um e-mail com o link para concluir a
                    etapa final do processo. Por favor, acompanhe sua caixa de
                    entrada e verifique também a pasta de spam ou promoções para
                    garantir que não perca nossa comunicação.
                  </p>
                </div>

                <Dialog.Close asChild>
                  <Button variant="primary" size="full">
                    Fechar
                  </Button>
                </Dialog.Close>
              </div>
              )}
        </motion.div>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
