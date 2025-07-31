'use client'

import * as Select from '@radix-ui/react-select'
import React, { InputHTMLAttributes, TextareaHTMLAttributes, useState, useEffect, useRef } from 'react'
import { UseFormRegister, Controller, Control } from 'react-hook-form'
import clsx from 'clsx'
import {
  CaretDownIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
  XIcon,
} from '@phosphor-icons/react'
import { IMaskInput } from 'react-imask'
import type { IMaskInputProps } from 'react-imask'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  rightIcon?: React.ReactNode
  leftIcon?: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
}

/**
 * Generic input component that adapts its paddings and colours depending
 * on whether an icon is present and whether an error exists.
 * Visual style (as per mock‑up):
 *  • black / transparent background
 *  • white 1px border (red on error)
 *  • white text, neutral‑400 placeholder
 *  • left icon and right icon are white
 *  • 12px radius to match rounded rectangle on design
 */
export function TextField({
  error,
  rightIcon,
  leftIcon,
  register,
  className,
  ...props
}: TextFieldProps) {
  const hasLeftIcon = Boolean(leftIcon)
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative w-full">
        {leftIcon && (
          <span
            className={clsx(
              'absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200',
              isFocused
                ? 'text-zhex-base-600'
                : error
                  ? 'text-red-secondary-500'
                  : 'text-zhex-base-500',
            )}
          >
            {leftIcon}
          </span>
        )}

        <input
          {...props}
          {...(register
            ? register(props.name || '')
            : {})}
          className={clsx(
            'w-full py-3 pr-4 transition-all duration-200', // vertical padding + right padding
            hasLeftIcon
              ? 'pl-12'
              : 'pl-4', // extra room when icon
            'rounded-xl border bg-transparent outline-none transition-colors',
            // colours
            error
              ? 'border-red-secondary-500'
              : 'border-neutral-100',
            'text-neutral-1000 placeholder:text-neutral-400',
            'focus:ring-2 focus:ring-zhex-base-500',
            className,
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {rightIcon && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
            {rightIcon}
          </span>
        )}
      </div>

      {error && <span className="text-red-secondary-500 text-sm">{error}</span>}
    </div>
  )
}

export function PasswordField({ error, ...props }: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <TextField
      {...props}
      type={showPassword
        ? 'text'
        : 'password'}
      error={error}
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          {showPassword
            ? <EyeSlashIcon size={20} />
            : <EyeIcon size={20} />}
        </button>
      }
    />
  )
}

type BaseMaskProps = Omit<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IMaskInputProps<any>, // Provide the required type argument here
  'mask' | 'onAccept' | 'inputRef' | 'value' | 'onChange'
>

interface MaskedTextFieldProps extends BaseMaskProps {
  /** Máscara IMask. Ex.: '00.000.000/0000-00', '(00) 00000‑0000' */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mask: any
  error?: string
  rightIcon?: React.ReactNode
  leftIcon?: React.ReactNode
  /** Nome do campo no formulário */
  name: string
  /** Control do react-hook-form */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

export function MaskedTextField({
  mask,
  error,
  rightIcon,
  leftIcon,
  name,
  control,
  className,
  ...props
}: MaskedTextFieldProps) {
  const hasLeftIcon = Boolean(leftIcon)
  const [isFocused, setIsFocused] = useState(false)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ref } }) => (
        <div className="flex flex-col gap-2 w-full">
          <div className="relative w-full">
            {leftIcon && (
              <span
                className={clsx(
                  'absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200',
                  isFocused
                    ? 'text-zhex-base-600'
                    : error
                      ? 'text-red-secondary-500'
                      : 'text-zhex-base-500',
                )}
              >
                {leftIcon}
              </span>
            )}

            <IMaskInput
              {...props}
              mask={mask}
              value={value || ''}
              onAccept={(value) => onChange(value)}
              inputRef={ref}
              onFocus={(e) => {
                setIsFocused(true)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                props.onFocus?.(e as any)
              }}
              onBlur={(e) => {
                setIsFocused(false)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                props.onBlur?.(e as any)
              }}
              className={clsx(
                'w-full py-3 pr-4 transition-all duration-200',
                hasLeftIcon
                  ? 'pl-12'
                  : 'pl-4',
                'rounded-xl border bg-transparent outline-none transition-colors',
                error
                  ? 'border-red-secondary-500'
                  : 'border-neutral-100',
                'text-neutral-1000 placeholder:text-neutral-400',
                'focus:ring-2 focus:ring-zhex-base-500',
                className,
              )}
            />

            {rightIcon && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                {rightIcon}
              </span>
            )}
          </div>

          {error && <span className="text-red-secondary-500 text-sm">{error}</span>}
        </div>
      )}
    />
  )
}

export interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps {
  /** nome do campo no RHF */
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any> // tipar o seu form se quiser
  options: SelectOption[]
  placeholder?: string
  /** exiba erro em vermelho igual ao TextField */
  error?: string | boolean
  /** permite seleção múltipla */
  multiple?: boolean

  disabled?: boolean
}

export function SelectField({
  name,
  control,
  options,
  placeholder = 'Selecione',
  error,
  multiple = false,
  disabled = false,
}: SelectFieldProps) {
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

  if (multiple) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => {
          const selectedValues = Array.isArray(value)
            ? value
            : []

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
                  disabled && 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed',
                )}
                onClick={() => !disabled && setIsOpen(!isOpen)}
              >
                <div className="flex flex-wrap gap-1 flex-1">
                  {selectedValues.length > 0
                    ? (
                        selectedValues.map((selectedValue) => {
                          const option = options.find(opt => opt.value === selectedValue)
                          return (
                            <span
                              key={selectedValue}
                              className="inline-flex items-center gap-2 px-2 py-1 text-xs bg-neutral-50 text-neutral-700 rounded-md border border-neutral-200"
                            >
                              {option?.label || selectedValue}
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                }}
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  const newValue = selectedValues.filter(v => v !== selectedValue)
                                  onChange(newValue)
                                }}
                                className="rounded-full w-4 h-4 flex items-center justify-center bg-neutral-100 text-neutral-700 hover:text-red-secondary-500"
                              >
                                <XIcon size={10} />
                              </button>
                            </span>
                          )
                        })
                      )
                    : (
                      <span className="text-neutral-400">{placeholder}</span>
                      )}
                </div>
                <CaretDownIcon size={16} className={clsx('transition-transform', isOpen && 'rotate-180')} />
              </div>

              {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-neutral-200 overflow-hidden z-50 max-h-60 overflow-y-auto">
                  {options.map((option) => {
                    const isSelected = selectedValues.includes(option.value)
                    return (
                      <div
                        key={option.value}
                        className={clsx(
                          'flex items-center px-3 py-2 text-sm text-neutral-900 cursor-pointer',
                          'hover:bg-neutral-100',
                          isSelected && 'bg-neutral-100',
                        )}
                        onClick={() => {
                          const newArray = isSelected
                            ? selectedValues.filter(v => v !== option.value)
                            : [...selectedValues, option.value]
                          onChange(newArray)
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
        }}
      />
    )
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <div className="flex flex-col gap-2 w-full">
          <Select.Root
            value={value}
            onValueChange={onChange}
            disabled={disabled}
          >
            <Select.Trigger
              className={clsx(
                'w-full py-3 px-4 rounded-xl border bg-transparent outline-none transition-colors',
                error
                  ? 'border-red-secondary-500'
                  : 'border-neutral-100',
                'text-neutral-1000 placeholder:text-neutral-400',
                'focus:ring-2 focus:ring-zhex-base-500',
                'flex items-center justify-between',
                disabled && 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed',
              )}
            >
              {multiple
                ? (
                  <div className="flex flex-wrap gap-1 flex-1">
                    {Array.isArray(value) && value.length > 0
                      ? (
                          value.map((selectedValue) => {
                            const option = options.find(opt => opt.value === selectedValue)
                            return (
                              <span
                                key={selectedValue}
                                className="inline-flex items-center gap-2 px-2 py-1 text-xs bg-neutral-50 text-neutral-700 rounded-md border border-neutral-200"
                              >
                                {option?.label || selectedValue}
                                <button
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    const newValue = value.filter(v => v !== selectedValue)
                                    onChange(newValue)
                                  }}
                                  className="rounded-full w-4 h-4 flex items-center justify-center bg-neutral-100 text-neutral-700 hover:text-red-secondary-500"
                                >
                                  <XIcon size={10} />
                                </button>
                              </span>
                            )
                          })
                        )
                      : (
                        <span className="text-neutral-400">{placeholder}</span>
                        )}
                  </div>
                  )
                : (
                  <Select.Value placeholder={placeholder} />
                  )}
              <Select.Icon>
                <CaretDownIcon size={16} />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content className="bg-white rounded-lg shadow-lg border border-neutral-200 overflow-hidden z-50">
                <Select.Viewport className="p-1">
                  {options.map((option) => (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      className={clsx(
                        'relative flex items-center px-3 py-2 text-sm text-neutral-900 rounded cursor-pointer',
                        'hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none',
                        multiple && Array.isArray(value) && value.includes(option.value) && 'bg-neutral-100',
                      )}
                    >
                      <Select.ItemText>{option.label}</Select.ItemText>
                      {multiple
                        ? (
                            Array.isArray(value) && value.includes(option.value) && (
                              <div className="absolute right-2">
                                <CheckIcon size={16} className="text-zhex-base-500" />
                              </div>
                            )
                          )
                        : (
                          <Select.ItemIndicator className="absolute right-2">
                            <CheckIcon size={16} />
                          </Select.ItemIndicator>
                          )}
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          {error && (
            <span className="text-red-secondary-500 text-sm">
              {typeof error === 'string'
                ? error
                : 'Campo obrigatório'}
            </span>
          )}
        </div>
      )}
    />
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
  leftIcon?: React.ReactNode
}

export function Textarea({
  error,
  register,
  className,
  leftIcon,
  rows = 4,
  ...props
}: TextareaProps) {
  const hasLeftIcon = Boolean(leftIcon)
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative w-full">
        {leftIcon && (
          <span
            className={clsx(
              'absolute left-4 top-4 transition-all duration-200',
              isFocused
                ? 'text-zhex-base-600'
                : error
                  ? 'text-red-secondary-500'
                  : 'text-zhex-base-500',
            )}
          >
            {leftIcon}
          </span>
        )}

        <textarea
          {...props}
          {...(register
            ? register(props.name || '')
            : {})}
          rows={rows}
          className={clsx(
            'w-full py-3 pr-4 transition-all duration-200',
            hasLeftIcon
              ? 'pl-12'
              : 'pl-4',
            'rounded-xl border bg-transparent outline-none transition-colors resize-none',
            error
              ? 'border-red-secondary-500'
              : 'border-neutral-100',
            'text-neutral-1000 placeholder:text-neutral-400',
            'focus:ring-2 focus:ring-zhex-base-500',
            className,
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      {error && <span className="text-red-secondary-500 text-sm">{error}</span>}
    </div>
  )
}
