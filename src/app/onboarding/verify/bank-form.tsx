'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SelectField, TextField } from '@/components/textfield'
import { banks } from '@/assets/lists/banks'

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
export default function BankForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(bankSchema),
  })

  const onSubmit = (data: FormValues) => console.log(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
      </div>
    </form>
  )
}
