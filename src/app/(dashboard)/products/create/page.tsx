'use client'

import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { TextField, SelectField, Textarea } from '@/components/textfield'
import { useForm } from 'react-hook-form'
import React, { useRef, useState } from 'react'
import { LinkIcon, UploadIcon, XIcon } from '@phosphor-icons/react'
import Image from 'next/image'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { SuccessModal } from './success-modal'

const productSchema = z.object({
  name: z.string().nonempty('Nome obrigatório'),
  type: z.string().nonempty('Tipo obrigatório'),
  category: z.string().nonempty('Categoria obrigatória'),
  payment: z.string().optional(),
  landingPage: z.string().url('URL inválida'),
  description: z.string().nonempty('Descrição obrigatória'),
  price: z.string().nonempty('Preço obrigatório'),
  aceite: z.literal(true, { message: 'Obrigatório aceitar os termos' }),
})

export default function CreateProductPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const { control, handleSubmit, watch, register, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      type: '',
      category: '',
      payment: '',
      landingPage: '',
      description: '',
      price: '',
      aceite: true,
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
  function onSubmit(data: z.infer<typeof productSchema>) {
    console.log(data)
    setModalOpen(true)
  }

  return (
    <>
      <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
        <SuccessModal />

        <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
          <Container className="flex items-start justify-between w-full mt-6 px-2">
            <div>
              <h1 className="text-lg text-neutral-950 font-araboto font-medium">
                Adicionar Produto
              </h1>

              <p className="text-neutral-500 text-base font-araboto mb-6">
                Preencha as informações do produto para adicioná-lo ao seu catálogo.
                Você poderá editar essas informações posteriormente.
              </p>
            </div>

            <Button size="medium" variant="primary" type="submit" className="w-[180px]">
              Salvar
            </Button>
          </Container>

          <Container>
            <div className="flex items-start justify-between w-full gap-5">
              {/* Formulário de produto */}
              <div className="w-full bg-white rounded-lg py-6 px-5 mb-10 border border-neutral-200 max-w-[780px]">
                <div className="flex flex-col gap-4">
                  <label
                    htmlFor="name"
                    className="text-neutral-1000 font-medium text-base font-araboto"
                  >
                    Nome do produto{' '}
                    <span className="text-red-secondary-500">*</span>
                  </label>
                  <TextField
                    {...register('name')}
                    error={errors.name?.message}
                    name="name"
                    placeholder="Nome do produto"
                  />
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-4 w-full">
                      <label
                        htmlFor="type"
                        className="text-neutral-1000 font-medium text-base font-araboto"
                      >
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
                        placeholder="Tipo"
                      />
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                      <label
                        htmlFor="category"
                        className="text-neutral-1000 font-medium text-base font-araboto"
                      >
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
                        placeholder="Categoria"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    {type !== 'fisico' && (
                      <div className="flex flex-col gap-4 w-full">
                        <label
                          htmlFor="payment"
                          className="text-neutral-1000 font-medium text-base font-araboto"
                        >
                          Pagamento{' '}
                          <span className="text-red-secondary-500">*</span>
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
                          placeholder="Pagamento"
                        />
                      </div>
                    )}
                    <div className="flex flex-col gap-4 w-full">
                      <label
                        htmlFor="landingPage"
                        className="text-neutral-1000 font-medium text-base font-araboto"
                      >
                        Landing Page{' '}
                        <span className="text-red-secondary-500">*</span>
                      </label>
                      <TextField
                        {...register('landingPage')}
                        error={errors.landingPage?.message}
                        name="landingPage"
                        leftIcon={
                          <LinkIcon size={20} />
                    }
                        placeholder="https://"
                      />
                    </div>
                  </div>
                  <label
                    htmlFor="description"
                    className="text-neutral-1000 font-medium text-base font-araboto"
                  >
                    O que é seu produto?{' '}
                    <span className="text-red-secondary-500">*</span>
                  </label>
                  <Textarea
                    {...register('description')}
                    error={errors.description?.message}
                    name="description"
                    placeholder="Descreva seu produto"
                    maxLength={200}
                  />
                  <div className="flex flex-col">
                    <label
                      htmlFor="price"
                      className="text-neutral-1000 font-medium text-base font-araboto"
                    >
                      Preço <span className="text-red-secondary-500">*</span>
                    </label>
                    <span className="text-neutral-500 text-sm mb-4">
                      Na Zhex você consegue configurar diferentes moedas para o seu
                      produto, não se limitar a apenas uma.
                    </span>
                    <TextField
                      {...register('price')}
                      error={errors.price?.message}
                      name="price"
                      placeholder="129,40"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" id="aceite" name="aceite" />
                    <label htmlFor="aceite" className="text-neutral-500 text-xs">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industrys
                      standard dummy text ever since the 1500s.
                    </label>
                  </div>
                </div>
              </div>
              <div className="w-full bg-white rounded-lg py-6 px-5 mb-10 border border-neutral-200 max-w-[490px]">
                <div>
                  <label className="block text-neutral-950 text-base font-araboto mb-2">
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
          </Container>
        </form>
      </Dialog.Root>
    </>
  )
}
