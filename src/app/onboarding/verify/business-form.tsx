'use client'

import { useForm, useWatch } from 'react-hook-form'
import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MaskedTextField, TextField } from '@/components/textfield'
import { SelectField } from '@/components/textfield'
import { brazilStates } from '@/assets/lists/brazil-states'
import { LinkIcon, UploadIcon } from '@phosphor-icons/react'

const schema = z.object({
  businessDocument: z
    .any()
    .refine((file) => file?.length > 0, 'Documento da empresa é obrigatório.'),
  businessJuridicName: z.string().min(3, 'Razão social é obrigatória.'),
  businessCNPJ: z
    .string()
    .regex(/^\d{14}$/, 'CNPJ deve ter 14 dígitos (apenas números).'),
  businessName: z.string().min(2, 'Nome fantasia é obrigatório.'),
  businessPhone: z
    .string()
    .regex(
      /^(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/,
      'Telefone inválido. Use formato (11) 91234‑5678.',
    ),
  businessAddress: z.string().min(5, 'Endereço incompleto.'),
  businessCity: z.string().min(2, 'Cidade é obrigatória.'),
  businessState: z
    .string()
    .length(2, 'UF deve ter 2 letras.')
    .transform((s) => s.toUpperCase()),
  businessZip: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, 'CEP deve estar no formato 00000‑000.')
    .transform((v) => v.replace(/\D/g, '')),
  businessNiche: z.string().min(1, 'Selecione um nicho.'),
  businessWebsite: z
    .string()
    .url('URL inválida. Ex.: https://minhaempresa.com'),
})

type FormValues = z.infer<typeof schema>

export function BusinessForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  // Observa o CEP e preenche endereço automaticamente usando ViaCEP
  const zipValue = useWatch({ control, name: 'businessZip' })

  useEffect(() => {
    const digits = zipValue?.replace(/\D/g, '')
    console.log('CEP digits →', digits)

    if (digits && digits.length === 8) {
      fetch(`https://viacep.com.br/ws/${digits}/json/`)
        .then((r) => r.json())
        .then((d) => {
          if (!d.erro) {
            setValue('businessAddress', d.logradouro || '')
            setValue('businessCity', d.localidade || '')
            setValue('businessState', d.uf || '')
          }
        })
        .catch(() => {})
    }
  }, [zipValue, setValue])

  const onSubmit = (d: FormValues) => console.log(d)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <h2 className="text-lg font-araboto font-semibold text-neutral-950">
            Documento da Empresa.
          </h2>
          <p className="text-neutral-500 font-araboto">
            Envie o contrato social ou outro documento oficial para validarmos
            os dados da sua empresa com segurança.
          </p>
        </div>

        <label
          htmlFor="businessDocument"
          className="flex h-[84px] w-[174px] items-center justify-center gap-2 rounded-lg bg-zhex-base-500/5 border-dashed border border-zhex-base-500/20 bg-white font-araboto"
        >
          <input
            type="file"
            id="businessDocument"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="hidden"
            {...register('businessDocument')}
          />
          <span className="text-zhex-base-500 font-medium px-4 py-1.5 font-araboto items-center flex gap-2 rounded-lg bg-zhex-base-500/5 border border-zhex-base-500 hover:bg-zhex-base-500 hover:text-neutral-0 transition-all duration-300 cursor-pointer">
            <UploadIcon size={20} />
            Upload
          </span>
        </label>
      </div>

      <div className="flex flex-col">
        <h2 className="text-lg font-araboto font-semibold text-neutral-950">
          Detalhes da Empresa.
        </h2>
        <p className="text-neutral-500 font-araboto">
          Insira as informações necessárias para concluirmos o cadastro da sua
          empresa.
        </p>
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ----- Primeira linha ------------------------------------------------ */}
        <div className="flex flex-col gap-2">
          <label className="text-neutral-950 font-araboto">
            Razão Social: <span className="text-red-secondary-500">*</span>
          </label>
          <TextField
            placeholder="Ex: Zhex Pagamentos LTDA"
            {...register('businessJuridicName')}
            error={errors.businessJuridicName?.message}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-neutral-950 font-araboto">
            CNPJ: <span className="text-red-secondary-500">*</span>
          </label>
          <MaskedTextField
            mask="00.000.000/0000-00"
            placeholder="Ex: 12.345.678/0001-90"
            {...register('businessCNPJ')}
            error={errors.businessCNPJ?.message}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-neutral-950 font-araboto">
            Nome Fantasia: <span className="text-red-secondary-500">*</span>
          </label>
          <TextField
            placeholder="Ex: Zhex"
            {...register('businessName')}
            error={errors.businessName?.message}
          />
        </div>

        {/* ----- Segunda linha ------------------------------------------------- */}
        <div className="flex flex-col gap-2">
          <label className="text-neutral-950 font-araboto">
            Telefone Comercial:{' '}
            <span className="text-red-secondary-500">*</span>
          </label>
          <MaskedTextField
            mask="(00) 00000-0000"
            placeholder="(11) 91234‑5678"
            {...register('businessPhone')}
            error={errors.businessPhone?.message}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-neutral-950 font-araboto">
            Website: <span className="text-red-secondary-500">*</span>
          </label>
          <TextField
            type="url"
            leftIcon={<LinkIcon size={20} className="text-zhex-base-500" />}
            placeholder="https://exemplo.com"
            {...register('businessWebsite')}
            error={errors.businessWebsite?.message}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-neutral-950 font-araboto">
            Nicho de Atuação: <span className="text-red-secondary-500">*</span>
          </label>
          <TextField
            placeholder="Ex: Marketing Digital"
            {...register('businessNiche')}
            error={errors.businessNiche?.message}
          />
        </div>

        {/* ----- Terceira linha ------------------------------------------------ */}
        <div className="flex flex-col gap-2">
          <label className="text-neutral-950 font-araboto">
            CEP: <span className="text-red-secondary-500">*</span>
          </label>
          <MaskedTextField
            mask="00000-000"
            placeholder="00000-000"
            {...register('businessZip')}
            error={errors.businessZip?.message}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-neutral-950 font-araboto">
            Endereço: <span className="text-red-secondary-500">*</span>
          </label>
          <TextField
            placeholder="Av. das Américas, 500"
            {...register('businessAddress')}
            error={errors.businessAddress?.message}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-neutral-950 font-araboto">
              UF: <span className="text-red-secondary-500">*</span>
            </label>
            <SelectField
              name="businessState"
              control={control}
              options={brazilStates}
              placeholder="Selecione"
              error={errors.businessState?.message}
            />
          </div>
          <div className="flex flex-col gap-2 col-span-2">
            <label className="text-neutral-950 font-araboto">
              Cidade: <span className="text-red-secondary-500">*</span>
            </label>
            <TextField
              placeholder="Rio de Janeiro"
              {...register('businessCity')}
              error={errors.businessCity?.message}
            />
          </div>
        </div>
      </div>
    </form>
  )
}
