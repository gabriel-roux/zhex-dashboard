'use client'

import {
  UserIcon,
  TrashIcon,
  CaretDownIcon,
  CheckIcon,
} from '@phosphor-icons/react'
import { Button } from '@/components/button'
import { Textarea, TextField } from '@/components/textfield'
import { Switch } from '@/components/switch'
import { ColorPicker } from '@/components/color-picker'
import { UploadButton } from '../layout/upload-button'
import { TestimonialPreview } from './testimonial-preview'
import { UseFormReturn } from 'react-hook-form'
import { TestimonialsFormData } from '@/hooks/useCheckoutTestimonialsForm'
import { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'

interface TestimonalsCheckoutProps {
  form: UseFormReturn<TestimonialsFormData>
  testimonials: Array<{
    id: string
    profileImage?: string
    starRating: string
    name: string
    socialNetwork?: string
    text: string
  }>
  addTestimonial: () => void
  removeTestimonial: (id: string) => void
  updateTestimonial: (id: string, field: string, value: string) => void
  onFileSelect?: (testimonialId: string, file: File) => void
}

// Componente SelectField customizado igual ao original
interface CustomSelectFieldProps {
  options: Array<{ value: string; label: string }>
  placeholder?: string
  error?: string | boolean
  disabled?: boolean
  value?: string
  onChange?: (value: string) => void
}

function CustomSelectField({
  options,
  placeholder = 'Selecione',
  error,
  disabled = false,
  value,
  onChange,
}: CustomSelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="flex flex-col gap-2 w-full relative" ref={dropdownRef}>
      <div
        className={clsx(
          'w-full py-3 px-4 rounded-xl border bg-transparent outline-none transition-colors cursor-pointer',
          error
            ? 'border-red-secondary-500'
            : 'border-neutral-100',
          'text-neutral-1000 placeholder:text-neutral-400',
          'focus:ring-2 focus:ring-zhex-base-500',
          'flex items-center justify-between',
          disabled && 'bg-neutral-100 border-neutral-200 text-neutral-400 !cursor-not-allowed !pointer-events-none opacity-50',
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={value
          ? 'text-neutral-1000'
          : 'text-neutral-400'}
        >
          {value
            ? options.find(opt => opt.value === value)?.label || value
            : placeholder}
        </span>
        <CaretDownIcon size={16} className={clsx('transition-transform', isOpen && 'rotate-180')} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-neutral-200 overflow-hidden z-50 max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = value === option.value
            return (
              <div
                key={option.value}
                className={clsx(
                  'flex items-center px-3 py-2 text-sm text-neutral-900 cursor-pointer',
                  'hover:bg-neutral-100',
                  isSelected && 'bg-neutral-100',
                )}
                onClick={() => {
                  onChange?.(option.value)
                  setIsOpen(false)
                }}
              >
                <div className="flex-1">{option.label}</div>
                {isSelected && (
                  <CheckIcon size={16} className="text-zhex-base-500" />
                )}
              </div>
            )
          })}
        </div>
      )}

      {error && (
        <span className="text-red-secondary-500 text-sm">
          {typeof error === 'string'
            ? error
            : 'Campo obrigatório'}
        </span>
      )}
    </div>
  )
}

export function TestimonalsCheckout({
  form,
  testimonials,
  addTestimonial,
  removeTestimonial,
  updateTestimonial,
  onFileSelect,
}: TestimonalsCheckoutProps) {
  const { watch, setValue, formState: { errors } } = form
  const [minimizedTestimonials, setMinimizedTestimonials] = useState<Set<string>>(new Set())

  const starOptions = [
    { value: '1', label: '1 Estrela' },
    { value: '2', label: '2 Estrelas' },
    { value: '3', label: '3 Estrelas' },
    { value: '4', label: '4 Estrelas' },
    { value: '5', label: '5 Estrelas' },
  ]

  // Função para verificar se um depoimento está completo
  const isTestimonialComplete = (testimonial: {
    id: string
    profileImage?: string
    starRating: string
    name: string
    socialNetwork?: string
    text: string
  }) => {
    return testimonial.starRating && testimonial.name && testimonial.text
  }

  // Função para alternar o estado minimizado de um depoimento
  const toggleMinimized = (testimonialId: string) => {
    setMinimizedTestimonials(prev => {
      const newSet = new Set(prev)
      if (newSet.has(testimonialId)) {
        newSet.delete(testimonialId)
      } else {
        newSet.add(testimonialId)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-8">
      {/* Header com Toggle */}
      <div className="flex items-center gap-4">
        <Switch
          active={watch('enabled')}
          setValue={(value: boolean) => setValue('enabled', value)}
        />
        <span className="text-neutral-1000 font-medium font-araboto text-base">
          Depoimentos
        </span>
      </div>

      {/* Preview dos Depoimentos */}
      {watch('enabled') && testimonials.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-neutral-1000 font-medium font-araboto text-base">
            Preview dos Depoimentos:
          </h3>
          <div
            className="p-6 rounded-lg max-w-[540px]"
            style={{ backgroundColor: watch('backgroundColor') }}
          >
            <div className="grid grid-cols-1 gap-4">
              {testimonials.map((testimonial) => (
                <TestimonialPreview
                  key={testimonial.id}
                  testimonial={testimonial}
                  colors={{
                    nameColor: watch('nameColor'),
                    textColor: watch('textColor'),
                    cardColor: watch('cardColor'),
                    borderColor: watch('borderColor'),
                    starsColor: watch('starsColor'),
                    backgroundColor: watch('backgroundColor'),
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lista de Depoimentos */}
      {watch('enabled') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-neutral-1000 font-medium font-araboto text-base">
              Depoimentos ({testimonials.length})
            </h3>
          </div>

          {testimonials.map((testimonial, index) => {
            const isComplete = isTestimonialComplete(testimonial)
            const isMinimized = minimizedTestimonials.has(testimonial.id)

            return (
              <div key={testimonial.id} className="border border-neutral-200 rounded-lg overflow-hidden">
                {/* Header do depoimento */}
                <div className="flex items-center justify-between px-4 pt-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleMinimized(testimonial.id)}
                      className="p-1 hover:bg-neutral-100 rounded transition-colors"
                      disabled={!isComplete}
                    >
                      <CaretDownIcon
                        weight="bold" size={16} className={`text-neutral-600 transition-all duration-300 ${!isMinimized
? 'rotate-180'
: ''}`}
                      />
                    </button>
                    <h4 className="text-neutral-1000 font-medium font-araboto text-base">
                      Depoimento {index + 1}
                    </h4>
                    {isComplete && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        <CheckIcon size={12} />
                        Completo
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="small"
                    onClick={() => removeTestimonial(testimonial.id)}
                    className="border-none"
                  >
                    <TrashIcon size={16} />
                  </Button>
                </div>

                {/* Conteúdo do depoimento */}
                <div className={clsx(
                  'transition-all duration-300 ease-in-out relative',
                  isMinimized
                    ? 'max-h-64 overflow-hidden'
                    : 'max-h-none',
                )}
                >
                  <div className="p-4 space-y-4">
                    {/* Upload de Imagem */}
                    <div>
                      <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                        Foto do perfil:
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-2">
                          {testimonial.profileImage
                            ? (
                              <img
                                src={testimonial.profileImage}
                                alt="Profile"
                                className={clsx(
                                  'rounded-full object-cover',
                                  isMinimized
                                    ? 'w-12 h-12'
                                    : 'w-16 h-16',
                                )}
                              />
                              )
                            : (
                              <div className={clsx(
                                'rounded-full bg-neutral-200 flex items-center justify-center',
                                isMinimized
                                  ? 'w-12 h-12'
                                  : 'w-16 h-16',
                              )}
                              >
                                <UserIcon
                                  size={isMinimized
                                    ? 20
                                    : 24} className="text-neutral-500"
                                />
                              </div>
                              )}
                        </div>

                        {!isMinimized && (
                          <div className="w-56">
                            <UploadButton
                              onUpload={(url) => {
                                console.log('Upload chamado com URL:', url)
                                updateTestimonial(testimonial.id, 'profileImage', url)
                              }}
                              onFileSelect={onFileSelect
                                ? (file) => onFileSelect(testimonial.id, file)
                                : undefined}
                              currentImage={testimonial.profileImage}
                              onRemove={() => {
                                console.log('Remove chamado')
                                updateTestimonial(testimonial.id, 'profileImage', '')
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Qtd. Estrelas */}
                    <div className="flex flex-col gap-2">
                      <label className="text-neutral-1000 font-medium font-araboto text-base block">
                        Qtd. Estrelas:
                      </label>
                      <div className="relative">
                        <CustomSelectField
                          options={starOptions}
                          placeholder="Selecione a quantidade de estrelas"
                          value={testimonial.starRating}
                          disabled={isMinimized}
                          onChange={(value) => updateTestimonial(testimonial.id, 'starRating', value)}
                        />
                      </div>
                    </div>

                    {/* Nome e Rede Social */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-neutral-1000 font-medium font-araboto text-base block">
                          Nome:
                        </label>
                        <TextField
                          value={testimonial.name}
                          onChange={(e) => updateTestimonial(testimonial.id, 'name', e.target.value)}
                          placeholder="Digite o nome da pessoa"
                          disabled={isMinimized}
                          className={isMinimized
                            ? 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed'
                            : ''}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-neutral-1000 font-medium font-araboto text-base block">
                          Rede social:
                        </label>
                        <TextField
                          value={testimonial.socialNetwork}
                          onChange={(e) => updateTestimonial(testimonial.id, 'socialNetwork', e.target.value)}
                          placeholder="@username"
                          disabled={isMinimized}
                          className={isMinimized
                            ? 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed'
                            : ''}
                        />
                      </div>
                    </div>

                    {/* Texto */}
                    <div className="flex flex-col gap-2">
                      <label className="text-neutral-1000 font-medium font-araboto text-base block">
                        Texto:
                      </label>
                      <Textarea
                        value={testimonial.text}
                        onChange={(e) => updateTestimonial(testimonial.id, 'text', e.target.value)}
                        placeholder="Digite aqui"
                        rows={isMinimized
                          ? 2
                          : 3}
                        disabled={isMinimized}
                        className={isMinimized
                          ? 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed resize-none'
                          : ''}
                      />
                    </div>
                  </div>

                  {/* Gradient com seta quando minimizado */}
                  {isMinimized && isComplete && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />
                  )}

                  {/* Botão para expandir quando minimizado */}
                  {isMinimized && isComplete && (
                    <div className="flex justify-center pb-1 absolute bottom-0 left-0 right-0">
                      <button
                        type="button"
                        onClick={() => toggleMinimized(testimonial.id)}
                        className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                      >
                        <CaretDownIcon weight="bold" size={16} className="text-neutral-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          <Button
            type="button"
            variant="ghost"
            size="medium"
            className="w-full"
            onClick={addTestimonial}
          >
            Adicionar mais avaliações
          </Button>
        </div>
      )}

      {/* Personalização de Cores */}
      <div className="flex flex-col gap-2">
        <label className="text-neutral-1000 font-medium font-araboto text-base mb-4 block">
          Personalização de Cores:
        </label>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-neutral-1000 font-medium font-araboto text-base block">
                Cor do nome:
              </label>
              <ColorPicker
                value={watch('nameColor')}
                onChange={(color) => setValue('nameColor', color)}
                error={errors.nameColor?.message}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-neutral-1000 font-medium font-araboto text-base block">
                Cor do texto:
              </label>
              <ColorPicker
                value={watch('textColor')}
                onChange={(color) => setValue('textColor', color)}
                error={errors.textColor?.message}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-neutral-1000 font-medium font-araboto text-base block">
                Cor do card:
              </label>
              <ColorPicker
                value={watch('cardColor')}
                onChange={(color) => setValue('cardColor', color)}
                error={errors.cardColor?.message}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-neutral-1000 font-medium font-araboto text-base block">
                Cor da borda:
              </label>
              <ColorPicker
                value={watch('borderColor')}
                onChange={(color) => setValue('borderColor', color)}
                error={errors.borderColor?.message}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-neutral-1000 font-medium font-araboto text-base block">
                Cor das estrelas:
              </label>
              <ColorPicker
                value={watch('starsColor')}
                onChange={(color) => setValue('starsColor', color)}
                error={errors.starsColor?.message}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-neutral-1000 font-medium font-araboto text-base block">
                Background:
              </label>
              <ColorPicker
                value={watch('backgroundColor')}
                onChange={(color) => setValue('backgroundColor', color)}
                error={errors.backgroundColor?.message}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
