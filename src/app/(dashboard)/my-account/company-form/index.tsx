'use client'

import { useWatch } from 'react-hook-form'
import { useEffect } from 'react'
import { MaskedTextField, TextField } from '@/components/textfield'
import { SelectField } from '@/components/textfield'
import { brazilStates } from '@/assets/lists/brazil-states'
import { BuildingsIcon, LinkIcon, UploadIcon, UserIcon, XIcon } from '@phosphor-icons/react'
import { CompanyFormData } from '@/hooks/useCompanyForm'
import Image from 'next/image'
import { UseFormReturn } from 'react-hook-form'
import clsx from 'clsx'
import { CompanyFormSkeleton } from '@/components/skeletons/company-form-skeleton'
import { Option } from '@/components/option'

interface CompanyFormProps {
  form: UseFormReturn<CompanyFormData>
  logoPreview: string | null
  companyType: 'INDIVIDUAL' | 'CORPORATION'
  onLogoChange: (file: File | null) => void
  loading: boolean
  error: string | null
}

export function CompanyForm({ form, logoPreview, companyType, onLogoChange, loading, error }: CompanyFormProps) {
  const { register, formState: { errors }, control, setValue } = form

  // Observa o CEP e preenche endereço automaticamente usando ViaCEP
  const zipValue = useWatch({ control, name: 'zipCode' })
  const documentValue = useWatch({ control, name: 'document' })

  useEffect(() => {
    const digits = zipValue?.replace(/\D/g, '')
    if (digits && digits.length === 8) {
      fetch(`https://viacep.com.br/ws/${digits}/json/`)
        .then((r) => r.json())
        .then((d) => {
          if (!d.erro) {
            setValue('address', d.logradouro || '')
            setValue('city', d.localidade || '')
            setValue('state', d.uf || '')
          }
        })
        .catch(() => {})
    }
  }, [zipValue, setValue])

  // Função para obter máscara baseada no tipo de documento
  const getDocumentMask = (document: string): string => {
    const cleanDocument = document.replace(/\D/g, '')

    if (cleanDocument.length <= 11) {
      return '000.000.000-00'
    } else {
      return '00.000.000/0000-00'
    }
  }

  // Determinar se é pessoa física (Individual)
  const isIndividual = companyType === 'INDIVIDUAL'

  if (loading) {
    return <CompanyFormSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between w-full gap-5">
        {/* Formulário à esquerda */}
        <div className="w-full max-w-[780px]">
          <div className="flex flex-col gap-6">
            {/* Grid de campos */}
            <div className="flex flex-col gap-4">
              {/* Primeira linha */}
              <div className="flex flex-col gap-2">
                <label className="text-neutral-950 font-araboto font-medium">
                  {isIndividual
                    ? 'Nome Completo'
                    : 'Razão Social'}: <span className="text-red-secondary-500">*</span>
                </label>
                <TextField
                  placeholder={isIndividual
                    ? 'Ex: João Silva Santos'
                    : 'Ex: Zhex Pagamentos LTDA'}
                  {...register('legalName')}
                  error={errors.legalName?.message}
                  disabled
                  className="bg-neutral-100 cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-neutral-950 font-araboto font-medium">
                  {isIndividual
                    ? 'CPF'
                    : 'CNPJ'}: <span className="text-red-secondary-500">*</span>
                </label>
                <MaskedTextField
                  name="document"
                  control={control}
                  mask={getDocumentMask(documentValue || '')}
                  placeholder={isIndividual
                    ? 'Ex: 123.456.789-00'
                    : 'Ex: 12.345.678/0001-90'}
                  error={errors.document?.message}
                  disabled
                  className="bg-neutral-100 cursor-not-allowed"
                />
              </div>

              {/* Nome Fantasia - apenas para empresas */}
              {!isIndividual && (
                <div className="flex flex-col gap-2">
                  <label className="text-neutral-950 font-araboto font-medium">
                    Nome Fantasia: <span className="text-red-secondary-500">*</span>
                  </label>
                  <TextField
                    placeholder="Ex: Zhex"
                    {...register('tradeName')}
                    error={errors.tradeName?.message}
                  />
                </div>
              )}

              <div className={
                clsx(
                  'grid grid-cols-2 gap-4',
                  isIndividual && '!grid-cols-1',
                )
              }
              >
                <div className="flex flex-col gap-2">
                  <label className="text-neutral-950 font-araboto font-medium">
                    Telefone: <span className="text-red-secondary-500">*</span>
                  </label>
                  <MaskedTextField
                    mask="(00) 00000-0000"
                    placeholder="(11) 91234‑5678"
                    name="phone"
                    control={control}
                    error={errors.phone?.message}
                  />
                </div>

                {/* Nicho de Atuação - apenas para empresas */}
                {!isIndividual && (
                  <div className="flex flex-col gap-2">
                    <label className="text-neutral-950 font-araboto font-medium">
                      Nicho de Atuação: <span className="text-red-secondary-500">*</span>
                    </label>
                    <TextField
                      placeholder="Ex: Marketing Digital"
                      {...register('businessNiche')}
                      error={errors.businessNiche?.message}
                    />
                  </div>
                )}
              </div>

              {/* Website - apenas para empresas */}
              {!isIndividual && (
                <div className="flex flex-col gap-2">
                  <label className="text-neutral-950 font-araboto font-medium">
                    Website: <span className="text-red-secondary-500">*</span>
                  </label>
                  <TextField
                    type="url"
                    leftIcon={<LinkIcon size={20} className="text-zhex-base-500" />}
                    placeholder="https://exemplo.com"
                    {...register('website')}
                    error={errors.website?.message}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-neutral-950 font-araboto font-medium">
                Tipo de Empresa: <span className="text-red-secondary-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <Option
                  label="Pessoa Física ( PF )"
                  icon={UserIcon}
                  selected={companyType === 'INDIVIDUAL'}
                  disabled
                />
                <Option
                  label="Pessoa Jurídica ( PJ )"
                  icon={BuildingsIcon}
                  disabled
                  selected={companyType === 'CORPORATION'}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Upload de logo à direita */}
        <div className="w-full rounded-lg py-6 px-5 border border-neutral-200 max-w-[490px]">
          <div>
            <label className="block text-neutral-1000 text-base font-medium font-araboto mb-4">
              {isIndividual
                ? 'Foto do Perfil'
                : 'Logo da Empresa'}
            </label>

            <div
              className="border-2 border-dashed border-zhex-base-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer mb-4 min-h-[200px]"
              onClick={() => document.getElementById('companyLogo')?.click()}
            >
              {!logoPreview
                ? (
                  <>
                    <input
                      type="file"
                      id="companyLogo"
                      accept="image/png, image/jpeg"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          onLogoChange(file)
                        }
                      }}
                    />

                    <UploadIcon size={24} className="text-zhex-base-500 mb-2" />
                    <span className="text-neutral-1000 text-center font-araboto mb-2">
                      Clique aqui para adicionar {isIndividual
                      ? 'sua foto'
                      : 'a logo'}
                    </span>
                    <span className="text-neutral-400 text-sm text-center">
                      Máx. 5MB em formato PNG ou JPEG
                    </span>
                  </>
                  )
                : (
                  <div className="relative mb-4">
                    <div className="w-32 h-32 mx-auto overflow-hidden rounded-lg">
                      <Image
                        src={logoPreview}
                        alt={isIndividual
                          ? 'Foto preview'
                          : 'Logo preview'}
                        width={120}
                        height={120}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute -top-1 -right-1 text-neutral-1000 hover:text-red-secondary-500 bg-neutral-100 transition-all duration-300 rounded-full p-1"
                      onClick={() => onLogoChange(null)}
                    >
                      <XIcon size={16} />
                    </button>
                  </div>
                  )}
            </div>

            {logoPreview && (
              <div className="text-center">
                <button
                  type="button"
                  className="text-zhex-base-500 hover:text-zhex-base-600 text-sm font-medium"
                  onClick={() => document.getElementById('companyLogo')?.click()}
                >
                  Trocar {isIndividual
                  ? 'foto'
                  : 'logo'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <div className="flex flex-col">
          <h2 className="text-lg font-araboto font-semibold text-neutral-950">
            Endereço {isIndividual
            ? 'pessoal'
            : 'da empresa'}
          </h2>
          <p className="text-neutral-500 font-araboto">
            Insira o endereço {isIndividual
            ? 'para que possamos enviar premiações'
            : 'da sua empresa para que possamos enviar premiações'}.
          </p>
        </div>

        {/* Endereço */}
        <div className="grid grid-cols-6 gap-4 col-span-full">
          <div className="flex flex-col gap-2">
            <label className="text-neutral-950 font-araboto">
              CEP: <span className="text-red-secondary-500">*</span>
            </label>
            <MaskedTextField
              name="zipCode"
              control={control}
              mask="00000-000"
              placeholder="00000-000"
              error={errors.zipCode?.message}
            />
          </div>
          <div className="flex flex-col gap-2 col-span-2">
            <label className="text-neutral-950 font-araboto">
              Endereço: <span className="text-red-secondary-500">*</span>
            </label>
            <TextField
              placeholder="Av. das Américas, 500"
              {...register('address')}
              error={errors.address?.message}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-neutral-950 font-araboto">
              Número: <span className="text-red-secondary-500">*</span>
            </label>
            <TextField
              placeholder="123"
              {...register('number')}
              error={errors.number?.message}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-neutral-950 font-araboto">
              UF: <span className="text-red-secondary-500">*</span>
            </label>
            <SelectField
              name="state"
              control={control}
              options={brazilStates}
              placeholder="Selecione"
              error={errors.state?.message}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-neutral-950 font-araboto">
              Cidade: <span className="text-red-secondary-500">*</span>
            </label>
            <TextField
              placeholder="Rio de Janeiro"
              {...register('city')}
              error={errors.city?.message}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}
