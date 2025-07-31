'use client'

import { useWatch } from 'react-hook-form'
import { SelectField, TextField } from '@/components/textfield'
import { banks } from '@/assets/lists/banks'
import { BankFormData } from '@/hooks/useBankForm'
import { UseFormReturn } from 'react-hook-form'
import { WarningCircleIcon } from '@phosphor-icons/react'

interface BankFormProps {
  form: UseFormReturn<BankFormData>
  error: string | null
}

export function BankForm({ form, error }: BankFormProps) {
  const { register, formState: { errors }, control } = form

  // Observa o banco selecionado para mostrar o nome
  const selectedBank = useWatch({ control, name: 'bank' })
  const selectedBankName = banks.find(b => b.COMPE === selectedBank)?.LongName

  return (
    <div className="space-y-6 mt-6">
      <div className="flex flex-col gap-4">
        {/* Select banco */}
        <div className="flex flex-col gap-2">
          <label className="text-neutral-950 font-araboto font-medium">
            Banco: <span className="text-red-secondary-500">*</span>
          </label>
          <SelectField
            name="bank"
            control={control}
            options={banks.map((b) => ({
              value: b.COMPE,
              label: b.LongName,
            }))}
            placeholder="Selecione o banco"
            error={errors.bank?.message}
          />
          {selectedBankName && (
            <p className="text-sm text-neutral-600 mt-1">
              Banco selecionado: <span className="font-medium">{selectedBankName}</span>
            </p>
          )}
        </div>

        {/* Agência e Conta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-neutral-950 font-araboto font-medium">
              Agência: <span className="text-red-secondary-500">*</span>
            </label>
            <TextField
              placeholder="0001"
              {...register('agencyNumber')}
              error={errors.agencyNumber?.message}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-neutral-950 font-araboto font-medium">
              Conta: <span className="text-red-secondary-500">*</span>
            </label>
            <TextField
              placeholder="123456-7"
              {...register('accountNumber')}
              error={errors.accountNumber?.message}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-neutral-950 font-araboto font-medium">
              Confirmar Conta: <span className="text-red-secondary-500">*</span>
            </label>
            <TextField
              placeholder="123456-7"
              {...register('confirmAccountNumber')}
              error={errors.confirmAccountNumber?.message}
            />
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <WarningCircleIcon size={20} className="text-zhex-base-500" />

            <p className="text-sm text-zhex-base-500">
              Os dados bancários são utilizados exclusivamente para processar pagamentos.
              Certifique-se de que as informações estão corretas para evitar problemas
              na transferência de valores.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
