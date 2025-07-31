'use client'

import { useEffect, useCallback } from 'react'
import { TextField, MaskedTextField, SelectField } from '@/components/textfield'
import { brazilStates } from '@/assets/lists/brazil-states'
import { PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { RepresentativesFormData } from '@/hooks/useRepresentativesForm'
import { UseFormReturn } from 'react-hook-form'

interface RepresentativesFormProps {
  form: UseFormReturn<RepresentativesFormData>
  companyType: string
  minimizedForms: Set<number>
  addRepresentative: () => void
  removeRepresentative: (index: number) => void
  toggleFormMinimization: (index: number) => void
  isFormComplete: (index: number) => boolean
  error: string | null
}

export function RepresentativesForm({
  form,
  companyType,
  minimizedForms,
  addRepresentative,
  removeRepresentative,
  toggleFormMinimization,
  isFormComplete,
  error,
}: RepresentativesFormProps) {
  const { register, formState: { errors }, control, setValue, watch } = form

  // Observa todos os CEPs e preenche endereço automaticamente usando ViaCEP
  const representatives = watch('representatives')

  // Função para preencher endereço via ViaCEP (memoizada)
  const fillAddressFromZipCode = useCallback(async (zipCode: string, index: number) => {
    const digits = zipCode.replace(/\D/g, '')
    if (digits && digits.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
        const data = await response.json()

        if (!data.erro) {
          setValue(`representatives.${index}.address`, data.logradouro || '')
          setValue(`representatives.${index}.city`, data.localidade || '')
          setValue(`representatives.${index}.state`, data.uf || '')
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error)
      }
    }
  }, [setValue])

  // Debounce para evitar muitas requisições
  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = []

    representatives.forEach((rep, index) => {
      if (rep.zipCode && rep.zipCode.replace(/\D/g, '').length === 8) {
        // Clear previous timeout for this index
        if (timeouts[index]) {
          clearTimeout(timeouts[index])
        }

        // Set new timeout
        timeouts[index] = setTimeout(() => {
          fillAddressFromZipCode(rep.zipCode, index)
        }, 500) // 500ms debounce
      }
    })

    // Cleanup timeouts on unmount or when representatives change
    return () => {
      timeouts.forEach(timeout => {
        if (timeout) clearTimeout(timeout)
      })
    }
  }, [representatives, fillAddressFromZipCode])

  return (
    <div className="space-y-6 mt-6">
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
                      <p className="font-medium">{representatives[index].firstName} {representatives[index].lastName}</p>
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
                {/* Dados pessoais */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* nome */}
                  <div className="flex flex-col gap-2">
                    <label className="text-neutral-950 font-araboto font-medium">
                      Nome: <span className="text-red-secondary-500">*</span>
                    </label>
                    <TextField
                      placeholder="Primeiro nome"
                      {...register(`representatives.${index}.firstName`)}
                      error={errors.representatives?.[index]?.firstName?.message}
                      disabled
                      className="bg-neutral-100 cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-neutral-950 font-araboto font-medium">
                      Sobrenome: <span className="text-red-secondary-500">*</span>
                    </label>
                    <TextField
                      placeholder="Sobrenome"
                      {...register(`representatives.${index}.lastName`)}
                      error={errors.representatives?.[index]?.lastName?.message}
                      disabled
                      className="bg-neutral-100 cursor-not-allowed"
                    />
                  </div>
                  {/* nascimento */}
                  <div className="flex flex-col gap-2">
                    <label className="text-neutral-950 font-araboto font-medium">
                      Data de Nascimento: <span className="text-red-secondary-500">*</span>
                    </label>
                    <MaskedTextField
                      mask="00/00/0000"
                      name={`representatives.${index}.birthDate`}
                      control={control}
                      placeholder="dd/mm/aaaa"
                      disabled
                      error={errors.representatives?.[index]?.birthDate?.message}
                    />
                  </div>

                  {/* CPF */}
                  <div className="flex flex-col gap-2">
                    <label className="text-neutral-950 font-araboto font-medium">
                      CPF: <span className="text-red-secondary-500">*</span>
                    </label>
                    <MaskedTextField
                      mask="000.000.000-00"
                      name={`representatives.${index}.cpf`}
                      control={control}
                      placeholder="000.000.000-00"
                      error={errors.representatives?.[index]?.cpf?.message}
                      disabled
                      className="bg-neutral-100 cursor-not-allowed"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-neutral-950 font-araboto font-medium">E‑mail: <span className="text-red-secondary-500">*</span></label>
                    <TextField
                      type="email"
                      placeholder="exemplo@email.com"
                      {...register(`representatives.${index}.email`)}
                      error={errors.representatives?.[index]?.email?.message}
                    />
                  </div>

                  {/* Telefone */}
                  <div className="flex flex-col gap-2">
                    <label className="text-neutral-950 font-araboto font-medium">Telefone:</label>
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
                      <label className="text-neutral-950 font-araboto font-medium">CEP: <span className="text-red-secondary-500">*</span></label>
                      <MaskedTextField
                        mask="00000-000"
                        name={`representatives.${index}.zipCode`}
                        control={control}
                        placeholder="00000-000"
                        error={errors.representatives?.[index]?.zipCode?.message}
                      />
                    </div>

                    {/* Endereço */}
                    <div className="flex flex-col gap-2 col-span-2">
                      <label className="text-neutral-950 font-araboto font-medium">Endereço: <span className="text-red-secondary-500">*</span></label>
                      <TextField
                        placeholder="Rua das Flores"
                        {...register(`representatives.${index}.address`)}
                        error={errors.representatives?.[index]?.address?.message}
                      />
                    </div>

                    {/* Número */}
                    <div className="flex flex-col gap-2">
                      <label className="text-neutral-950 font-araboto font-medium">Número: <span className="text-red-secondary-500">*</span></label>
                      <TextField
                        placeholder="123"
                        {...register(`representatives.${index}.number`)}
                        error={errors.representatives?.[index]?.number?.message}
                      />
                    </div>

                    {/* UF */}
                    <div className="flex flex-col gap-2">
                      <label className="text-neutral-950 font-araboto font-medium">UF: <span className="text-red-secondary-500">*</span></label>
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
                      <label className="text-neutral-950 font-araboto font-medium">Cidade: <span className="text-red-secondary-500">*</span></label>
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
                      {...register(`representatives.${index}.isPoliticallyExposed`)}
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
      {companyType === 'CORPORATION' &&
        <div className="flex justify-center">
          <button
            type="button"
            onClick={addRepresentative}
            className="flex items-center gap-2 transition-colors font-medium text-zhex-base-500 hover:text-zhex-base-600"
          >
            <PlusIcon size={20} />
            <span>
              Adicionar outro representante
            </span>
          </button>
        </div>}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}
