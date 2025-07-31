'use client'

import { useForm, useWatch } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TextField, MaskedTextField, SelectField } from '@/components/textfield'
import { brazilStates } from '@/assets/lists/brazil-states'
import { UploadIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { RepresentativesData, RepresentativeData } from '@/@types/onboarding'
import { Button } from '@/components/button'
import { useApi } from '@/hooks/useApi'
import clsx from 'clsx'
import { DocumentPreview } from '@/components/document-preview'
import { useOnboardingContext } from '@/contexts/onboarding/context'

interface RepresentativesFormProps {
  onSubmit: (data: RepresentativesData) => Promise<unknown>
  isLoading: boolean
  error: string | null
  setCurrentStep: (step: number) => void
}

/* -------------------------------------------------------------------------- */
/* Schema                                                                     */
/* -------------------------------------------------------------------------- */
const representativeSchema = z.object({
  representativeDocument: z
    .any()
    .refine(
      (file) => file?.length > 0,
      'Documento do representante é obrigatório.',
    ),
  civilFirstName: z.string().min(1, 'Nome é obrigatório.'),
  civilLastName: z.string().min(1, 'Sobrenome é obrigatório.'),
  birthDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data inválida.'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido.'),
  email: z.string().email('E‑mail inválido.'),
  phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido.'),
  address: z.string().min(1, 'Endereço é obrigatório.'),
  addressNumber: z.string().min(1, 'Número é obrigatório.'),
  city: z.string().min(1, 'Cidade é obrigatória.'),
  state: z.string().length(2, 'UF inválida.'),
  zip: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido.'),
  politicallyExposed: z.boolean().optional(),
})

const representativesListSchema = z.object({
  representatives: z.array(representativeSchema).min(1, 'Pelo menos um representante é obrigatório.'),
})

type FormValues = z.infer<typeof representativesListSchema>

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export function RepresentativesForm({
  onSubmit: onSubmitProp,
  isLoading,
  error,
  setCurrentStep,
}: RepresentativesFormProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [minimizedForms, setMinimizedForms] = useState<Set<number>>(new Set())
  const api = useApi()
  // Get token from URL since it's not in context yet
  const { onboardingProgress, onboardingToken } = useOnboardingContext()

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(representativesListSchema),
    defaultValues: {
      representatives: [
        {
          representativeDocument: null,
          zip: '',
          cpf: '',
          phone: '',
          birthDate: '',
          state: '',
          civilFirstName: '',
          civilLastName: '',
          email: '',
          address: '',
          addressNumber: '',
          city: '',
          politicallyExposed: false,
        },
      ],
    },
  })

  const representatives = watch('representatives')

  const uploadDocument = async (file: File, representativeId: string): Promise<void> => {
    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('documentType', 'RG')
      formData.append('isRepresentative', 'true')
      formData.append('representativeId', representativeId)

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

  const addRepresentative = () => {
    const currentRepresentatives = watch('representatives')
    setValue('representatives', [
      ...currentRepresentatives,
      {
        representativeDocument: null,
        zip: '',
        cpf: '',
        phone: '',
        birthDate: '',
        state: '',
        civilFirstName: '',
        civilLastName: '',
        email: '',
        address: '',
        addressNumber: '',
        city: '',
        politicallyExposed: false,
      },
    ])
  }

  const removeRepresentative = (index: number) => {
    const currentRepresentatives = watch('representatives')
    if (currentRepresentatives.length > 1) {
      const newRepresentatives = currentRepresentatives.filter((_, i) => i !== index)
      setValue('representatives', newRepresentatives)

      // Remover da lista de formulários minimizados
      const newMinimized = new Set(minimizedForms)
      newMinimized.delete(index)
      setMinimizedForms(newMinimized)
    }
  }

  const toggleFormMinimization = (index: number) => {
    const newMinimized = new Set(minimizedForms)
    if (newMinimized.has(index)) {
      newMinimized.delete(index)
    } else {
      newMinimized.add(index)
    }
    setMinimizedForms(newMinimized)
  }

  const isFormComplete = (index: number): boolean => {
    const rep = representatives[index]
    return !!(
      rep.civilFirstName &&
      rep.civilLastName &&
      rep.birthDate &&
      rep.cpf &&
      rep.email &&
      rep.phone &&
      rep.address &&
      rep.addressNumber &&
      rep.city &&
      rep.state &&
      rep.zip &&
      rep.representativeDocument?.[0]
    )
  }

  const canAddMoreRepresentatives = onboardingProgress?.companyType === 'CORPORATION' || representatives.length === 0

  const handleFormSubmit = async (data: FormValues) => {
    try {
      // Mapear dados do formulário para o formato da API
      const mappedRepresentatives: RepresentativeData[] = data.representatives.map(rep => ({
        firstName: rep.civilFirstName,
        lastName: rep.civilLastName,
        birthDate: rep.birthDate.split('/').reverse().join('-'), // Converte DD/MM/YYYY para YYYY-MM-DD
        cpf: rep.cpf.replace(/\D/g, ''), // Remove formatação
        email: rep.email,
        phone: rep.phone,
        zipCode: rep.zip.replace(/\D/g, ''), // Remove formatação
        address: rep.address,
        number: rep.addressNumber,
        city: rep.city,
        state: rep.state,
        isPoliticallyExposed: rep.politicallyExposed || false,
      }))

      const mappedData: RepresentativesData = {
        representatives: mappedRepresentatives,
      }

      // Primeiro, criar os representantes
      const result = await onSubmitProp(mappedData) as {
        nextStep?: { step: number; title: string; description: string },
        representatives?: Array<{ id: string }>
      }

      // Depois, fazer upload dos documentos se existirem
      if (result?.representatives) {
        for (let i = 0; i < data.representatives.length; i++) {
          const rep = data.representatives[i]
          const repId = result.representatives[i]?.id

          if (rep.representativeDocument?.[0] && repId) {
            await uploadDocument(rep.representativeDocument[0], repId)
          }
        }
      }

      if (result?.nextStep) {
        const nextStepIndex = result.nextStep.step - 1
        setCurrentStep(nextStepIndex)
      }
    } catch (err) {
      console.error('Erro ao atualizar representantes:', err)
    }
  }

  /* CEP inteligente ------------------------------------------------------- */
  const zipValue = useWatch({ control, name: 'representatives.0.zip' })

  useEffect(() => {
    const digits = zipValue?.replace(/\D/g, '')
    if (digits && digits.length === 8) {
      fetch(`https://viacep.com.br/ws/${digits}/json/`)
        .then((r) => r.json())
        .then((d) => {
          if (!d.erro) {
            setValue('representatives.0.address', d.logradouro || '')
            setValue('representatives.0.city', d.localidade || '')
            setValue('representatives.0.state', d.uf || '')
          }
        })
        .catch(() => {})
    }
  }, [zipValue, setValue])

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-araboto font-semibold text-neutral-950">
          Fundadores e Representantes.
        </h2>
        <p className="text-neutral-500 font-araboto max-w-lg">
          Adicione os dados pessoais dos fundadores ou representantes legais.
          Essas informações são necessárias para verificações de KYC.
        </p>
      </div>

      {/* Lista de representantes */}
      {representatives.map((_, index) => {
        const isMinimized = minimizedForms.has(index)
        const isComplete = isFormComplete(index)

        return (
          <div key={index} className="border border-neutral-200 rounded-lg bg-white">
            {/* Header do representante */}
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <h3 className="text-md font-araboto font-semibold text-neutral-950">
                  Representante {index + 1}
                </h3>
                {isComplete && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    ✓ Completo
                  </span>
                )}
                {!isComplete && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                    ⚠ Incompleto
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isComplete && (
                  <button
                    type="button"
                    onClick={() => toggleFormMinimization(index)}
                    className="flex items-center gap-2 text-zhex-base-500 hover:text-zhex-base-600 transition-colors"
                  >
                    {isMinimized
                      ? (
                        <>
                          <span className="text-sm">Editar</span>
                        </>
                        )
                      : (
                        <>
                          <span className="text-sm">Minimizar</span>
                        </>
                        )}
                  </button>
                )}

                {representatives.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRepresentative(index)}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon size={16} />
                    <span className="text-sm">Remover</span>
                  </button>
                )}
              </div>
            </div>

            {/* Conteúdo minimizado */}
            {isMinimized && isComplete && (
              <div className="px-6 pb-6">
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-500">Nome:</span>
                      <p className="font-medium">{representatives[index].civilFirstName} {representatives[index].civilLastName}</p>
                    </div>
                    <div>
                      <span className="text-neutral-500">CPF:</span>
                      <p className="font-medium">{representatives[index].cpf}</p>
                    </div>
                    <div>
                      <span className="text-neutral-500">Email:</span>
                      <p className="font-medium">{representatives[index].email}</p>
                    </div>
                    <div>
                      <span className="text-neutral-500">Telefone:</span>
                      <p className="font-medium">{representatives[index].phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Formulário completo */}
            {!isMinimized && (
              <div className="px-6 pb-6">
                {/* Documento do representante */}
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex flex-col">
                    <h4 className="text-sm font-araboto font-semibold text-neutral-950 mb-2">
                      Documento do Representante
                    </h4>
                    <p className="text-neutral-500 font-araboto text-sm mb-4">
                      Envie um documento que comprove a identidade do representante, como RG, CNH ou passaporte.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <label
                      htmlFor={`representativeDocument-${index}`}
                      className={
                        clsx(
                          'flex h-[84px] w-[174px] items-center justify-center gap-2 rounded-lg bg-zhex-base-500/5 border-dashed border border-zhex-base-500/20 bg-white font-araboto',
                          errors.representatives?.[index]?.representativeDocument && '!border-red-secondary-500 !text-red-secondary-500 !bg-red-secondary-500/5',
                        )
                      }
                    >
                      <input
                        type="file"
                        id={`representativeDocument-${index}`}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="hidden"
                        {...register(`representatives.${index}.representativeDocument`)}
                      />
                      <span
                        className={
                          clsx(
                            'text-zhex-base-500 font-medium px-4 py-1.5 font-araboto items-center flex gap-2 rounded-lg bg-zhex-base-500/5 border border-zhex-base-500 hover:bg-zhex-base-500 hover:text-neutral-0 transition-all duration-300 cursor-pointer',
                            errors.representatives?.[index]?.representativeDocument && '!border-red-secondary-500 !text-red-secondary-500 !bg-red-secondary-500/5 hover:!bg-red-secondary-500 hover:!text-neutral-0',
                          )
                        }
                      >
                        <UploadIcon size={20} />
                        Upload
                      </span>
                    </label>

                    {watch(`representatives.${index}.representativeDocument`)?.[0] && (
                      <DocumentPreview
                        file={watch(`representatives.${index}.representativeDocument`)?.[0] as File}
                        onRemove={() => setValue(`representatives.${index}.representativeDocument`, null)}
                      />
                    )}

                    {errors.representatives?.[index]?.representativeDocument?.message && (
                      <p className="text-red-secondary-500 text-sm">{errors.representatives?.[index]?.representativeDocument?.message as string}</p>
                    )}
                  </div>
                </div>

                {/* Dados pessoais */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* nome */}
                  <div className="flex flex-col gap-2">
                    <label className="text-neutral-950 font-araboto">
                      Nome: <span className="text-red-secondary-500">*</span>
                    </label>
                    <TextField
                      placeholder="Primeiro nome"
                      {...register(`representatives.${index}.civilFirstName`)}
                      error={errors.representatives?.[index]?.civilFirstName?.message}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-neutral-950 font-araboto">
                      Sobrenome: <span className="text-red-secondary-500">*</span>
                    </label>
                    <TextField
                      placeholder="Sobrenome"
                      {...register(`representatives.${index}.civilLastName`)}
                      error={errors.representatives?.[index]?.civilLastName?.message}
                    />
                  </div>
                  {/* nascimento */}
                  <div className="flex flex-col gap-2">
                    <label className="text-neutral-950 font-araboto">
                      Data de Nascimento: <span className="text-red-secondary-500">*</span>
                    </label>
                    <MaskedTextField
                      mask="00/00/0000"
                      name={`representatives.${index}.birthDate`}
                      control={control}
                      placeholder="dd/mm/aaaa"
                      error={errors.representatives?.[index]?.birthDate?.message}
                    />
                  </div>

                  {/* CPF */}
                  <div className="flex flex-col gap-2">
                    <label className="text-neutral-950 font-araboto">
                      CPF: <span className="text-red-secondary-500">*</span>
                    </label>
                    <MaskedTextField
                      mask="000.000.000-00"
                      name={`representatives.${index}.cpf`}
                      control={control}
                      placeholder="000.000.000-00"
                      error={errors.representatives?.[index]?.cpf?.message}
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-neutral-950 font-araboto">E‑mail: <span className="text-red-secondary-500">*</span></label>
                    <TextField
                      type="email"
                      placeholder="exemplo@email.com"
                      {...register(`representatives.${index}.email`)}
                      error={errors.representatives?.[index]?.email?.message}
                    />
                  </div>

                  {/* Telefone */}
                  <div className="flex flex-col gap-2">
                    <label className="text-neutral-950 font-araboto">Telefone:</label>
                    <MaskedTextField
                      mask="(00) 00000-0000"
                      name={`representatives.${index}.phone`}
                      control={control}
                      placeholder="(11) 91234-5678"
                      error={errors.representatives?.[index]?.phone?.message}
                    />
                  </div>

                  {/* Endereço completo em uma linha ----------------------------------------- */}
                  <div className="grid grid-cols-6 gap-4 col-span-full">
                    {/* CEP */}
                    <div className="flex flex-col gap-2">
                      <label className="text-neutral-950 font-araboto">CEP: <span className="text-red-secondary-500">*</span></label>
                      <MaskedTextField
                        mask="00000-000"
                        name={`representatives.${index}.zip`}
                        control={control}
                        placeholder="00000-000"
                        error={errors.representatives?.[index]?.zip?.message}
                      />
                    </div>

                    {/* Endereço */}
                    <div className="flex flex-col gap-2 col-span-2">
                      <label className="text-neutral-950 font-araboto">Endereço: <span className="text-red-secondary-500">*</span></label>
                      <TextField
                        placeholder="Rua das Flores"
                        {...register(`representatives.${index}.address`)}
                        error={errors.representatives?.[index]?.address?.message}
                      />
                    </div>

                    {/* Número */}
                    <div className="flex flex-col gap-2">
                      <label className="text-neutral-950 font-araboto">Número: <span className="text-red-secondary-500">*</span></label>
                      <TextField
                        placeholder="123"
                        {...register(`representatives.${index}.addressNumber`)}
                        error={errors.representatives?.[index]?.addressNumber?.message}
                      />
                    </div>

                    {/* UF */}
                    <div className="flex flex-col gap-2">
                      <label className="text-neutral-950 font-araboto">UF: <span className="text-red-secondary-500">*</span></label>
                      <SelectField
                        name={`representatives.${index}.state`}
                        control={control}
                        options={brazilStates}
                        placeholder="UF"
                        error={errors.representatives?.[index]?.state?.message}
                      />
                    </div>

                    {/* Cidade */}
                    <div className="flex flex-col gap-2">
                      <label className="text-neutral-950 font-araboto">Cidade: <span className="text-red-secondary-500">*</span></label>
                      <TextField
                        placeholder="São Paulo"
                        {...register(`representatives.${index}.city`)}
                        error={errors.representatives?.[index]?.city?.message}
                      />
                    </div>
                  </div>

                  {/* Politicamente exposto */}
                  <div className="flex items-center gap-2 col-span-full">
                    <input
                      type="checkbox"
                      id={`pep-${index}`}
                      {...register(`representatives.${index}.politicallyExposed`)}
                      className="w-5 h-5 rounded border border-neutral-100 checked:bg-zhex-base-500 checked:border-zhex-base-500"
                    />
                    <label htmlFor={`pep-${index}`} className="text-neutral-950 font-araboto">
                      Declaro que sou pessoa politicamente exposta e que os dados
                      fornecidos são verdadeiros.
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Botão adicionar representante */}
      {canAddMoreRepresentatives && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={addRepresentative}
            disabled={!canAddMoreRepresentatives}
            className={clsx(
              'flex items-center gap-2 transition-colors font-medium',
              canAddMoreRepresentatives
                ? 'text-zhex-base-500 hover:text-zhex-base-600'
                : 'text-neutral-400 cursor-not-allowed',
            )}
          >
            <PlusIcon size={20} />
            <span>
              Adicionar outro representante
            </span>
          </button>
        </div>
      )}

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
