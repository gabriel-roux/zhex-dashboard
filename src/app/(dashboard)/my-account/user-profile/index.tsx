'use client'

import { useState } from 'react'
import { MaskedTextField, TextField } from '@/components/textfield'
import { PencilSimpleLineIcon } from '@phosphor-icons/react'
import { UseFormReturn } from 'react-hook-form'
import { UserFormData } from '@/hooks/useUserForm'
import { useAuth } from '@/contexts/auth/context'
import { EmailChangeModal } from './email-change-modal'
import { PasswordChangeModal } from './password-change-modal'

interface UserProfileProps {
  form: UseFormReturn<UserFormData>
}

export function UserProfile({ form }: UserProfileProps) {
  const { register, formState, control } = form
  const { user } = useAuth()
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)

  return (
    <div className="w-full mt-6">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex flex-col gap-4 w-full">
            <label htmlFor="firstName" className="text-neutral-1000 font-medium text-base font-araboto">
              Nome <span className="text-red-secondary-500">*</span>
            </label>
            <TextField
              {...register('firstName')}
              error={formState.errors.firstName?.message}
              name="firstName"
              placeholder="Seu nome"
            />
          </div>
          <div className="flex flex-col gap-4 w-full">
            <label htmlFor="lastName" className="text-neutral-1000 font-medium text-base font-araboto">
              Sobrenome <span className="text-red-secondary-500">*</span>
            </label>
            <TextField
              {...register('lastName')}
              error={formState.errors.lastName?.message}
              name="lastName"
              placeholder="Seu sobrenome"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="email" className="text-neutral-1000 font-medium text-base font-araboto">
            E-mail
          </label>
          <TextField
            name="email"
            value={user?.email || ''}
            disabled
            placeholder="Seu e-mail"
            rightIcon={
              <button
                type="button"
                className="text-zhex-base-500 hover:text-zhex-base-600 flex items-center gap-1 transition-all duration-300 font-medium font-araboto text-base"
                onClick={() => setEmailModalOpen(true)}
              >
                <PencilSimpleLineIcon size={16} />
                Alterar
              </button>
              }
            className="bg-neutral-100 cursor-not-allowed"
          />
          <span className="text-neutral-500 text-sm">
            Enviaremos um e-mail de confirmação para alterar seu e-mail.
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="phone" className="text-neutral-1000 font-medium text-base font-araboto">
            Telefone
          </label>
          <MaskedTextField
            mask="(00) 00000-0000"
            control={control}
            error={formState.errors.phone?.message}
            name="phone"
            placeholder="(00) 00000-0000"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="password" className="text-neutral-1000 font-medium text-base font-araboto">
            Senha
          </label>
          <TextField
            name="password"
            type="password"
            value="••••••••••••••"
            disabled
            rightIcon={
              <button
                type="button"
                className="text-zhex-base-500 hover:text-zhex-base-600 flex items-center gap-1 transition-all duration-300 font-medium font-araboto text-base"
                onClick={() => setPasswordModalOpen(true)}
              >
                <PencilSimpleLineIcon size={16} />
                Alterar
              </button>
              }
            placeholder="Sua senha"
            className="bg-neutral-100 cursor-not-allowed"
          />
          <span className="text-neutral-500 text-sm">
            Confirmaremos sua senha antes de alterá-la.
          </span>
        </div>
      </div>

      {/* Modais */}
      <EmailChangeModal
        open={emailModalOpen}
        onOpenChange={setEmailModalOpen}
        currentEmail={user?.email || ''}
      />
      <PasswordChangeModal
        open={passwordModalOpen}
        onOpenChange={setPasswordModalOpen}
      />
    </div>
  )
}
