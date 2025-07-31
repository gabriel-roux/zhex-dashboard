'use client'

import { Button } from '@/components/button'
import { PasswordField, TextField } from '@/components/textfield'
import { EnvelopeIcon, LockIcon, InfoIcon } from '@phosphor-icons/react'
import * as Dialog from '@radix-ui/react-dialog'
import Link from 'next/link'
import { WaitlistModal } from './waitlist-modal'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/contexts/auth/context'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CompanyProps } from '@/@types/company'
import { motion, AnimatePresence } from 'framer-motion'
import { CompanySelection } from './company-selection'

export function LoginForm() {
  const { signIn, loginCompany } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [companies, setCompanies] = useState<CompanyProps[]>([])
  const [showCompanySelection, setShowCompanySelection] = useState(false)
  const [isSelectingCompany, setIsSelectingCompany] = useState(false)
  const router = useRouter()

  const loginSchema = z.object({
    email: z.string().nonempty('Email obrigatório').email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  })

  type LoginFormValues = z.infer<typeof loginSchema>

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormValues) {
    console.log('login values →', data)

    const response = await signIn(data.email, data.password)
    console.log('login response →', response)
    const { success, message, companies } = response

    if (success === 1) {
      router.push('/')
    } else if (success === 2) {
      setCompanies(companies || [])
      setShowCompanySelection(true)
    } else {
      console.log('Setting error:', message)
      setError(message)
    }
  }

  async function handleCompanySelect(companyId: string) {
    setIsSelectingCompany(true)
    try {
      const response = await loginCompany(companyId)

      if (response.success) {
        router.push('/')
      } else {
        setError(response.message)
      }
    } catch {
      setError('Erro ao selecionar empresa')
    } finally {
      setIsSelectingCompany(false)
    }
  }

  function handleBackToLogin() {
    setShowCompanySelection(false)
    setCompanies([])
    setError(null)
  }

  return (
    <Dialog.Root>
      <AnimatePresence mode="wait">
        {!showCompanySelection
          ? (
            <motion.form
              key="login-form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6 w-full mt-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-3 w-full">
                <label
                  htmlFor="email"
                  className="text-neutral-950 text-lg font-araboto"
                >
                  Email
                </label>
                <TextField
                  autoFocus
                  id="email"
                  type="email"
                  className="h-[55px]"
                  placeholder="Digite seu email"
                  leftIcon={<EnvelopeIcon size={20} />}
                  {...register('email')}
                  error={errors.email?.message}
                />
              </div>

              <div className="flex flex-col gap-3 w-full">
                <label
                  htmlFor="password"
                  className="text-neutral-950 text-lg font-araboto"
                >
                  Senha
                </label>
                <PasswordField
                  id="password"
                  className="h-[55px]"
                  placeholder="Digite sua senha"
                  leftIcon={<LockIcon size={20} />}
                  {...register('password')}
                  error={errors.password?.message}
                />
              </div>

              {/* Remember‑me + Forgot password ------------------------------------------------ */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none font-araboto text-neutral-900">
                  <input
                    type="checkbox"
                    name="remember"
                    className="
              appearance-none
              w-6 h-6 rounded border border-neutral-100
              flex items-center justify-center
              bg-transparent
              checked:bg-zhex-base-500 checked:border-zhex-base-500
              before:content-[''] before:w-2 before:h-1 before:border-r-2 before:border-b-2
              before:border-white before:rotate-45 before:translate-y-[1px] before:scale-0
              checked:before:scale-100
              transition-all duration-150
            "
                  />
                  <span className="text-neutral-1000 text-base mt-1">Lembrar-me</span>
                </label>

                <Link
                  href="/forgot-password"
                  className="text-zhex-base-600 hover:text-zhex-base-500 font-araboto text-base font-medium"
                >
                  Esqueci a senha e agora?
                </Link>
              </div>

              {/* Error message ------------------------------------------------ */}
              {error && (
                <p className="text-red-secondary-500 text-sm">{error}</p>
              )}

              <div className="flex flex-col gap-4">
                <Button
                  size="full"
                  loading={isSubmitting}
                  variant="primary"
                  className="py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Enviando...'
                    : 'Entrar Agora'}
                </Button>
                <Dialog.Trigger asChild>
                  <Button type="button" size="full" variant="ghost" className="py-3">
                    Quero entrar na lista de espera agora!
                  </Button>
                </Dialog.Trigger>
              </div>

              {/* Wait‑list notice -------------------------------------------------------- */}
              <div className="flex items-center justify-center gap-2 bg-[#181818]/5 rounded-xl px-4 py-3">
                <InfoIcon size={20} weight="bold" className="text-neutral-1000" />
                <span className="text-neutral-1000 text-base font-araboto">
                  Nossa lista de espera é por tempo limitado.
                </span>
              </div>
            </motion.form>
            )
          : (
            <CompanySelection
              companies={companies}
              onCompanySelect={handleCompanySelect}
              onBack={handleBackToLogin}
              isLoading={isSelectingCompany}
            />
            )}
      </AnimatePresence>

      <WaitlistModal />
    </Dialog.Root>
  )
}
