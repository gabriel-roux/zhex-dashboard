'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRef, useState } from 'react'
import { TextField, SelectField, Textarea } from '@/components/textfield'
import { CheckCircleIcon, LinkIcon, UploadIcon, XIcon } from '@phosphor-icons/react'
import Image from 'next/image'
import React from 'react'

const productSchema = z.object({
  name: z.string().nonempty('Nome obrigatório'),
  type: z.string().nonempty('Tipo obrigatório'),
  category: z.string().nonempty('Categoria obrigatória'),
  language: z.string().nonempty('Idioma obrigatório'),
  payment: z.string().optional(),
  landingPage: z.string().url('URL inválida'),
  guarantee: z.string().nonempty('Garantia obrigatória'),
  description: z.string().nonempty('Descrição obrigatória'),
})

export function ProductInformations() {
  const { control, watch, register, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      type: '',
      category: '',
      language: '',
      payment: '',
      landingPage: '',
      guarantee: '',
      description: '',
    },
  })

  const [images, setImages] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const type = watch('type')

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter(
      (file) =>
        ['image/png', 'image/jpeg'].includes(file.type) &&
        file.size <= 50 * 1024 * 1024,
    )
    if (images.length + files.length > 4) return
    setImages((prev) => [...prev, ...files].slice(0, 4))
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).filter(
      (file) =>
        ['image/png', 'image/jpeg'].includes(file.type) &&
        file.size <= 50 * 1024 * 1024,
    )
    if (images.length + files.length > 4) return
    setImages((prev) => [...prev, ...files].slice(0, 4))
  }

  function handleRemove(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  function handleClick() {
    inputRef.current?.click()
  }

  return (
    <>
      <div className="flex items-start justify-between w-full gap-5">
        {/* Formulário à esquerda */}
        <div className="w-full max-w-[780px]">
          <div className="flex flex-col gap-4">
            <label htmlFor="name" className="text-neutral-1000 font-medium text-base font-araboto">
              Nome do produto <span className="text-red-secondary-500">*</span>
            </label>
            <TextField
              {...register('name')}
              error={errors.name?.message}
              name="name"
              placeholder="Nome do produto"
            />
            <div className="flex gap-4">
              <div className="flex flex-col gap-4 w-full">
                <label htmlFor="type" className="text-neutral-1000 font-medium text-base font-araboto">
                  Tipo <span className="text-red-secondary-500">*</span>
                </label>
                <SelectField
                  {...register('type')}
                  error={errors.type?.message}
                  name="type"
                  control={control}
                  options={[
                    { value: 'digital', label: 'Digital' },
                    { value: 'fisico', label: 'Físico' },
                  ]}
                  placeholder="Selecione o tipo"
                />
              </div>
              <div className="flex flex-col gap-4 w-full">
                <label htmlFor="guarantee" className="text-neutral-1000 font-medium text-base font-araboto">
                  Garantia <span className="text-red-secondary-500">*</span>
                </label>
                <SelectField
                  {...register('guarantee')}
                  error={errors.guarantee?.message}
                  name="guarantee"
                  control={control}
                  options={[
                    { value: '15 dias', label: '15 dias' },
                    { value: '30 dias', label: '30 dias' },
                    { value: '60 dias', label: '60 dias' },
                    { value: '90 dias', label: '90 dias' },
                    { value: '120 dias', label: '120 dias' },
                    { value: '180 dias', label: '180 dias' },
                    { value: '365 dias', label: '365 dias' },
                  ]}
                  placeholder="Selecione a garantia"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-4 w-full">
                <label htmlFor="type" className="text-neutral-1000 font-medium text-base font-araboto">
                  Idioma <span className="text-red-secondary-500">*</span>
                </label>
                <SelectField
                  {...register('language')}
                  error={errors.language?.message}
                  name="language"
                  control={control}
                  options={[
                    { value: 'pt-BR', label: 'Português' },
                    { value: 'en-US', label: 'Inglês' },
                  ]}
                  placeholder="Selecione o idioma"
                />
              </div>
              <div className="flex flex-col gap-4 w-full">
                <label htmlFor="category" className="text-neutral-1000 font-medium text-base font-araboto">
                  Categoria <span className="text-red-secondary-500">*</span>
                </label>
                <SelectField
                  {...register('category')}
                  error={errors.category?.message}
                  name="category"
                  control={control}
                  options={[
                    { value: 'livro', label: 'Livro' },
                    { value: 'curso', label: 'Curso' },
                  ]}
                  placeholder="Selecione a categoria"
                />
              </div>
            </div>

            <label htmlFor="description" className="text-neutral-1000 font-medium text-base font-araboto">
              O que é seu produto? <span className="text-red-secondary-500">*</span>
            </label>
            <Textarea
              {...register('description')}
              error={errors.description?.message}
              name="description"
              placeholder="Descreva seu produto"
              maxLength={200}
            />
            <div className="flex gap-4">
              {type !== 'fisico' && (
                <div className="flex flex-col gap-4 w-full">
                  <label htmlFor="payment" className="text-neutral-1000 font-medium text-base font-araboto">
                    Pagamento <span className="text-red-secondary-500">*</span>
                  </label>
                  <SelectField
                    {...register('payment')}
                    error={errors.payment?.message}
                    name="payment"
                    control={control}
                    options={[
                      { value: 'unico', label: 'Único' },
                      { value: 'recorrente', label: 'Recorrente' },
                    ]}
                    placeholder="Selecione o pagamento"
                  />
                </div>
              )}
              <div className="flex flex-col gap-4 w-full">
                <label htmlFor="landingPage" className="text-neutral-1000 font-medium text-base font-araboto">
                  Landing Page <span className="text-red-secondary-500">*</span>
                </label>
                <TextField
                  {...register('landingPage')}
                  error={errors.landingPage?.message}
                  name="landingPage"
                  leftIcon={<LinkIcon size={20} />}
                  placeholder="https://"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Upload de imagem à direita */}
        <div className="w-full rounded-lg py-6 px-5 border border-neutral-200 max-w-[490px]">
          <div>
            <label className="block text-neutral-1000 text-base font-medium font-araboto mb-2">
              Imagem do produto
            </label>
            <div
              className="border-2 border-dashed border-zhex-base-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer mb-4 min-h-[140px]"
              onClick={handleClick}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                type="file"
                accept="image/png, image/jpeg"
                multiple
                className="hidden"
                ref={inputRef}
                onChange={handleFileChange}
                disabled={images.length >= 4}
              />
              <UploadIcon size={24} className="text-zhex-base-500 mb-2" />
              <span className="text-neutral-1000 text-center font-araboto">
                Clique aqui para adicionar as imagens do seu produto
              </span>
              <span className="text-neutral-400 text-sm mt-1">
                Máx. 50mb tamanho na extensão png e jpeg.
              </span>
            </div>
            <div className="flex gap-4 mt-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-[100px] h-[100px] border-2 border-dashed rounded-xl flex items-center justify-center relative bg-neutral-50 overflow-hidden p-2 ${
                    images[idx]
                      ? 'border-neutral-200'
                      : 'border-zhex-base-500 '
                  }`}
                >
                  {images[idx]
                    ? (
                      <>
                        <Image
                          src={URL.createObjectURL(images[idx])}
                          alt="preview"
                          width={100}
                          height={100}
                          className="object-contain w-full h-full rounded-xl"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-2 text-neutral-1000 hover:text-red-secondary-500"
                          onClick={() => handleRemove(idx)}
                        >
                          <XIcon size={16} />
                        </button>
                      </>
                      )
                    : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Seção de informações para suporte */}
      <div className="w-full mt-6">
        <h2 className="text-neutral-1000 font-medium text-base font-araboto mb-1">Informações para suporte</h2>
        <p className="text-neutral-400 text-base font-araboto mb-4">Adicione produtos em sua loja</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="supportName" className="text-neutral-1000 font-medium text-base font-araboto">Nome: <span className="text-red-secondary-500">*</span></label>
            <TextField name="supportName" placeholder="Gabriel Fonseca" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="supportEmail" className="text-neutral-1000 font-medium text-base font-araboto">E-mail: <span className="text-red-secondary-500">*</span></label>
            <div className="relative flex items-center">
              <TextField name="supportEmail" placeholder="email@exemplo.com" className="pr-10" />

            </div>
            <span className="text-neutral-400 text-xs mt-1 flex items-center gap-1">
              <CheckCircleIcon size={16} />
              Necessária a verificação do e-mail. <a href="#" className="text-zhex-base-500 underline ml-1">Clique para verificar</a>
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="supportPhone" className="text-neutral-1000 font-medium text-base font-araboto">Telefone:</label>
            <TextField name="supportPhone" placeholder="(00) 00000-0000" />
          </div>
        </div>
      </div>
    </>
  )
}
