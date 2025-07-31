'use client'

import { useForm, useWatch } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MaskedTextField, TextField } from '@/components/textfield'
import { SelectField } from '@/components/textfield'
import { brazilStates } from '@/assets/lists/brazil-states'
import { LinkIcon, UploadIcon } from '@phosphor-icons/react'
import { CompanyDetailsData } from '@/@types/onboarding'
import { Button } from '@/components/button'
import clsx from 'clsx'
import { useApi } from '@/hooks/useApi'
import { DocumentPreview } from '@/components/document-preview'
import { useOnboardingContext } from '@/contexts/onboarding/context'

interface BusinessFormProps {
  onSubmit: (data: CompanyDetailsData) => Promise<unknown>
  isLoading: boolean
  error: string | null
  setCurrentStep: (step: number) => void
}

const schema = z.object({
  businessDocument: z
    .any()
    .refine((file) => file?.length > 0, 'Documento da empresa é obrigatório.'),
  businessJuridicName: z.string().min(3, 'Razão social é obrigatória.'),
  businessCNPJ: z
    .string()
    .regex(
      /^(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{14})$/,
      'CNPJ inválido. Use formato 00.000.000/0000-00.'),
  businessName: z.string().min(2, 'Nome fantasia é obrigatório.'),
  businessPhone: z
    .string()
    .regex(
      /^(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/,
      'Telefone inválido. Use formato (11) 91234‑5678.',
    ),
  businessAddress: z.string().min(5, 'Endereço incompleto.'),
  businessAddressNumber: z.string().min(1, 'Número é obrigatório.'),
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

export function BusinessForm({
  onSubmit: onSubmitProp,
  isLoading,
  error,
  setCurrentStep,
}: BusinessFormProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const api = useApi()
  const { onboardingToken } = useOnboardingContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessCNPJ: '',
      businessPhone: '',
      businessZip: '',
      businessState: '',
    },
  })

  const uploadDocument = async (file: File): Promise<void> => {
    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('documentType', 'SOCIAL_CONTRACT')

      const response = await api.post<{ success: boolean; documentId: string; fileUrl: string }>(`/onboarding/upload-document?token=${onboardingToken}`, formData)

      if (!response.data.success) {
        throw new Error('Falha no upload do documento')
      }
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'Erro ao fazer upload do documento'
      setUploadError(errorMessage)
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  // Observa o CEP e preenche endereço automaticamente usando ViaCEP
  const zipValue = useWatch({ control, name: 'businessZip' })

  useEffect(() => {
    const digits = zipValue?.replace(/\D/g, '')
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

  const handleFormSubmit = async (data: FormValues) => {
    try {
      // Primeiro, fazer upload do documento se existir
      if (data.businessDocument?.[0]) {
        await uploadDocument(data.businessDocument[0])
      }

      // Mapear dados do formulário para o formato da API
      const mappedData: CompanyDetailsData = {
        legalName: data.businessJuridicName,
        tradeName: data.businessName,
        document: data.businessCNPJ.replace(/\D/g, ''), // Remove formatação
        phone: data.businessPhone,
        website: data.businessWebsite,
        businessNiche: data.businessNiche,
        zipCode: data.businessZip.replace(/\D/g, ''), // Remove formatação
        address: data.businessAddress,
        number: data.businessAddressNumber,
        city: data.businessCity,
        state: data.businessState,
      }

      const result = await onSubmitProp(mappedData) as { nextStep?: { step: number; title: string; description: string } }

      if (result?.nextStep) {
        const nextStepIndex = result.nextStep.step - 1
        setCurrentStep(nextStepIndex)
      }
    } catch (err) {
      console.error('Erro ao atualizar detalhes da empresa:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">

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

        <div className="flex flex-col gap-4">
          <label
            htmlFor="businessDocument"
            className={
              clsx(
                'flex h-[84px] w-[174px] items-center justify-center gap-2 rounded-lg bg-zhex-base-500/5 border-dashed border border-zhex-base-500/20 bg-white font-araboto',
                errors.businessDocument && '!border-red-secondary-500 !text-red-secondary-500 !bg-red-secondary-500/5',
              )
            }
          >
            <input
              type="file"
              id="businessDocument"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="hidden"
              max={1}
              {...register('businessDocument')}
            />
            <span className={
              clsx(
                'text-zhex-base-500 font-medium px-4 py-1.5 font-araboto items-center flex gap-2 rounded-lg bg-zhex-base-500/5 border border-zhex-base-500 hover:bg-zhex-base-500 hover:text-neutral-0 transition-all duration-300 cursor-pointer',
                errors.businessDocument && '!border-red-secondary-500 !text-red-secondary-500 !bg-red-secondary-500/5 hover:!bg-red-secondary-500 hover:!text-neutral-0',
              )
            }
            >
              <UploadIcon size={20} />
              Upload
            </span>
          </label>

          {watch('businessDocument')?.[0] && (
            <DocumentPreview
              file={watch('businessDocument')?.[0] as File}
              onRemove={() => setValue('businessDocument', null)}
            />
          )}

          {errors.businessDocument && (
            <p className="text-red-secondary-500 text-sm">{errors.businessDocument.message as string}</p>
          )}
        </div>
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
            name="businessCNPJ"
            control={control}
            mask="00.000.000/0000-00"
            placeholder="Ex: 12.345.678/0001-90"
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
            name="businessPhone"
            control={control}
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
        <div className="grid grid-cols-6 gap-4 col-span-full">
          <div className="flex flex-col gap-2">
            <label className="text-neutral-950 font-araboto">
              CEP: <span className="text-red-secondary-500">*</span>
            </label>
            <MaskedTextField
              name="businessZip"
              control={control}
              mask="00000-000"
              placeholder="00000-000"
              error={errors.businessZip?.message}
            />
          </div>
          <div className="flex flex-col gap-2 col-span-2">
            <label className="text-neutral-950 font-araboto">
              Endereço: <span className="text-red-secondary-500">*</span>
            </label>
            <TextField
              placeholder="Av. das Américas, 500"
              {...register('businessAddress')}
              error={errors.businessAddress?.message}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-neutral-950 font-araboto">Número: <span className="text-red-secondary-500">*</span></label>
            <TextField
              placeholder="123"
              {...register('businessAddressNumber')}
              error={errors.businessAddressNumber?.message}
            />
          </div>

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
          <div className="flex flex-col gap-2">
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

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{uploadError}</p>
        </div>
      )}

      <div className="flex items-center gap-4 mt-8">
        <Button
          size="large"
          loading={isLoading || isUploading}
          type="submit"
          variant="primary"
          className="w-[222px]"
        >
          Continuar
        </Button>
      </div>
    </form>
  )
}
