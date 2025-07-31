'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SelectField, TextField } from '@/components/textfield'
import { banks } from '@/assets/lists/banks'
import { BankAccountData, OnboardingStatus } from '@/@types/onboarding'
import { Button } from '@/components/button'

/* -------------------------------------------------------------------------- */
/* Schema                                                                     */
/* -------------------------------------------------------------------------- */
const bankSchema = z
  .object({
    bank: z.string().min(1, 'Selecione o banco.'),
    agencyNumber: z.string().min(1, 'Agência obrigatória.'),
    accountNumber: z.string().min(1, 'Conta obrigatória.'),
    confirmAccountNumber: z.string().min(1, 'Confirme a conta.'),
  })
  .refine((data) => data.accountNumber === data.confirmAccountNumber, {
    message: 'Contas não conferem.',
    path: ['confirmAccountNumber'],
  })

type FormValues = z.infer<typeof bankSchema>

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
interface BankFormProps {
  onSubmit: (data: BankAccountData) => Promise<OnboardingStatus>
  isLoading?: boolean
  error?: string | null
  setCurrentStep: (step: number) => void
}

export default function BankForm({
  onSubmit,
  isLoading = false,
  error,
  setCurrentStep,
}: BankFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(bankSchema),
  })

  const handleFormSubmit = async (data: FormValues) => {
    try {
      // Mapear dados do formulário para o formato da API
      const bankData: BankAccountData = {
        bankCode: data.bank,
        bankName: banks.find(b => b.COMPE === data.bank)?.LongName || '',
        agency: data.agencyNumber,
        account: data.accountNumber,
        accountType: 'CHECKING', // Default para conta corrente
      }

      const result = await onSubmit(bankData) as { nextStep?: { step: number; title: string; description: string } }

      if (result?.nextStep) {
        const nextStepIndex = result.nextStep.step - 1
        setCurrentStep(nextStepIndex)
      }
    } catch (error) {
      console.error('Erro ao enviar dados bancários:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="flex flex-col gap-4">
        {/* header */}
        <div className="flex flex-col">
          <h2 className="text-lg font-araboto font-semibold text-neutral-950">
            Adicione um Banco.
          </h2>
          <p className="text-neutral-500 font-araboto">
            Para receber pagamentos, é necessário adicionar uma conta bancária
            válida. Insira os dados bancários abaixo para completar o processo
            de verificação.
          </p>
        </div>

        {/* Select banco */}
        <div className="flex flex-col gap-2">
          <label className="text-neutral-950 font-araboto">
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
        </div>

        {/* Agência e conta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-neutral-950 font-araboto">
              Agência: <span className="text-red-secondary-500">*</span>
            </label>
            <TextField
              placeholder="0001"
              {...register('agencyNumber')}
              error={errors.agencyNumber?.message}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-neutral-950 font-araboto">
              Conta: <span className="text-red-secondary-500">*</span>
            </label>
            <TextField
              placeholder="123456-7"
              {...register('accountNumber')}
              error={errors.accountNumber?.message}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-neutral-950 font-araboto">
              Confirmar Conta:
            </label>
            <TextField
              placeholder="123456-7"
              {...register('confirmAccountNumber')}
              error={errors.confirmAccountNumber?.message}
            />
          </div>
        </div>

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
            type="submit"
            variant="primary"
            className="w-[222px]"
          >
            Continuar
          </Button>
        </div>
      </div>
    </form>
  )
}
