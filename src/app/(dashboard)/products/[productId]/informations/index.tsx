'use client'

import { useRef, useState, useEffect } from 'react'
import { TextField, SelectField, Textarea } from '@/components/textfield'
import { LinkIcon, UploadIcon, XIcon } from '@phosphor-icons/react'
import Image from 'next/image'
import React from 'react'
import { ProductProps, ProductType, ProductImage } from '@/@types/product'
import { UseFormReturn } from 'react-hook-form'
import { ProductFormData } from '@/hooks/useProductForm'
import { VerifySupportEmail } from './verify-support-email'
import { ProductInformationsSkeleton } from '@/components/skeletons/product-informations-skeleton'

interface ProductInformationsProps {
  product: ProductProps
  form: UseFormReturn<ProductFormData>
  setRemovedImageIds: React.Dispatch<React.SetStateAction<string[]>>
  loading: boolean
  error: string | null
}

export function ProductInformations({ product, form, setRemovedImageIds, loading, error }: ProductInformationsProps) {
  const { control, watch, register, setValue, formState } = form
  const [existingImages, setExistingImages] = useState<ProductImage[]>([])
  const [emailVerified, setEmailVerified] = useState(product.supportEmailVerified || false)

  // Carregar imagens existentes quando o produto for carregado
  useEffect(() => {
    if (product?.images) {
      setExistingImages(product.images)
    }

    setEmailVerified(product.supportEmailVerified || false)
  }, [product])

  const newImages = watch('newImages') || []
  const supportEmail = watch('supportEmail') || ''
  const inputRef = useRef<HTMLInputElement>(null)
  const type = watch('type')

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter(
      (file) =>
        ['image/png', 'image/jpeg'].includes(file.type) &&
        file.size <= 50 * 1024 * 1024,
    )
    const totalImages = existingImages.length + newImages.length
    if (totalImages + files.length > 4) return
    setValue('newImages', [...newImages, ...files].slice(0, 4 - existingImages.length))
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).filter(
      (file) =>
        ['image/png', 'image/jpeg'].includes(file.type) &&
        file.size <= 50 * 1024 * 1024,
    )
    const totalImages = existingImages.length + newImages.length
    if (totalImages + files.length > 4) return
    setValue('newImages', [...newImages, ...files].slice(0, 4 - existingImages.length))
  }

  function handleRemove(idx: number) {
    setValue('newImages', newImages.filter((_: File, i: number) => i !== idx))
  }

  function handleClick() {
    inputRef.current?.click()
  }

  const handleVerificationChange = (verified: boolean) => {
    setEmailVerified(verified)
  }

  if (loading) {
    return <ProductInformationsSkeleton />
  }

  return (
    <>
      <div className="flex items-start justify-between w-full gap-5 mt-6">
        {/* Formulário à esquerda */}
        <div className="w-full max-w-[780px]">
          <div className="flex flex-col gap-4">
            <label htmlFor="name" className="text-neutral-1000 font-medium text-base font-araboto">
              Nome do produto <span className="text-red-secondary-500">*</span>
            </label>
            <TextField
              {...register('name')}
              error={formState.errors.name?.message}
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
                  error={formState.errors.type?.message}
                  name="type"
                  disabled
                  control={control}
                  options={[
                    { value: 'PHYSICAL', label: 'Físico' },
                    { value: 'DIGITAL', label: 'Digital' },
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
                  error={formState.errors.guarantee?.message}
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
                  error={formState.errors.language?.message}
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
                  error={formState.errors.category?.message}
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

            <div className="flex items-center justify-between">
              <label htmlFor="description" className="text-neutral-1000 font-medium text-base font-araboto">
                O que é seu produto? <span className="text-red-secondary-500">*</span>
              </label>
              <span className="text-neutral-400 text-sm">
                {watch('description')?.length || 0}/200
              </span>
            </div>
            <Textarea
              {...register('description')}
              error={formState.errors.description?.message}
              name="description"
              placeholder="Descreva seu produto"
              maxLength={200}
            />
            <div className="flex gap-4">
              {type !== 'PHYSICAL' && (
                <div className="flex flex-col gap-4 w-full">
                  <label htmlFor="payment" className="text-neutral-1000 font-medium text-base font-araboto">
                    Pagamento <span className="text-red-secondary-500">*</span>
                  </label>
                  <SelectField
                    {...register('payment')}
                    error={formState.errors.payment?.message}
                    name="payment"
                    control={control}
                    options={[
                      { value: ProductType.ONE_TIME, label: 'Único' },
                      { value: ProductType.RECURRING, label: 'Recorrente' },
                    ]}
                    disabled
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
                  error={formState.errors.landingPage?.message}
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
            {(existingImages.length + newImages.length) < 4 && (
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
                />
                <UploadIcon size={24} className="text-zhex-base-500 mb-2" />
                <span className="text-neutral-1000 text-center font-araboto">
                  Clique aqui para adicionar as imagens do seu produto
                </span>
                <span className="text-neutral-400 text-sm mt-1">
                  Máx. 50mb tamanho na extensão png e jpeg.
                </span>
              </div>
            )}
            {formState.errors.newImages && (
              <span className="text-red-secondary-500 text-sm mb-2">{formState.errors.newImages.message}</span>
            )}
            <div className="flex gap-4 mt-2">
              {Array.from({ length: 4 }).map((_, idx) => {
                // Combinar imagens existentes e novas em um array único
                const allImages = [...existingImages, ...newImages]
                const currentImage = allImages[idx]
                const isExistingImage = idx < existingImages.length

                return (
                  <div
                    key={idx}
                    className={`w-[100px] h-[100px] border-2 border-dashed rounded-xl flex items-center justify-center relative bg-neutral-50 overflow-hidden p-2 ${
                      currentImage
                        ? 'border-neutral-200'
                        : 'border-zhex-base-500 '
                    }`}
                  >
                    {currentImage
                      ? (
                        <>
                          <Image
                            src={isExistingImage
                              ? (currentImage as ProductImage).fileUrl
                              : URL.createObjectURL(currentImage as File)}
                            alt={isExistingImage
                              ? (currentImage as ProductImage).fileName
                              : 'preview'}
                            width={100}
                            height={100}
                            className="object-contain w-full h-full rounded-xl"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-2 text-neutral-1000 hover:text-red-secondary-500"
                            onClick={() => {
                              if (isExistingImage) {
                                const imageToRemove = currentImage as ProductImage
                                setRemovedImageIds(prev => [...prev, imageToRemove.id])
                                setExistingImages(prev => prev.filter((_, i) => i !== idx))
                              } else {
                                const newImageIndex = idx - existingImages.length
                                handleRemove(newImageIndex)
                              }
                            }}
                          >
                            <XIcon size={16} />
                          </button>
                        </>
                        )
                      : null}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      {/* Seção de informações para suporte */}
      <div className="w-full mt-6">
        <h2 className="text-lg font-araboto font-semibold text-neutral-950">
          Informações para suporte
        </h2>
        <p className="text-neutral-400 text-base font-araboto mb-4">
          Adicione informações para suporte ao seu produto.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="supportName" className="text-neutral-1000 font-medium text-base font-araboto">Nome: <span className="text-red-secondary-500">*</span></label>
            <TextField
              {...register('supportName')}
              error={formState.errors.supportName?.message}
              name="supportName"
              placeholder="Gabriel Fonseca"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="supportEmail" className="text-neutral-1000 font-medium text-base font-araboto">E-mail: <span className="text-red-secondary-500">*</span></label>
            <div className="relative flex items-center">
              <TextField
                {...register('supportEmail')}
                error={formState.errors.supportEmail?.message}
                name="supportEmail"
                placeholder="email@exemplo.com"
                className="pr-10"
              />
            </div>
            <VerifySupportEmail
              productId={product.id}
              supportEmail={supportEmail}
              isVerified={emailVerified}
              onVerificationChange={handleVerificationChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="supportPhone" className="text-neutral-1000 font-medium text-base font-araboto">Telefone:</label>
            <TextField
              {...register('supportPhone')}
              error={formState.errors.supportPhone?.message}
              name="supportPhone"
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </>
  )
}
