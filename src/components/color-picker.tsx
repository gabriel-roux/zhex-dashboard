'use client'

import React, { useState, useRef, useEffect } from 'react'
import { HexColorPicker } from 'react-colorful'
import { CheckIcon } from '@phosphor-icons/react'
import { useClickAway } from '@/hooks/useClickAway'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  error?: string
  className?: string
}

export function ColorPicker({ value, onChange, error, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Fechar popover quando clicar fora
  useClickAway(
    popoverRef as React.RefObject<HTMLElement>,
    () => setIsOpen(false),
  )

  // Sincronizar input com valor
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Validar e aplicar cor do input
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue)

    // Validar se é um hex válido
    const hexRegex = /^#[0-9A-F]{6}$/i
    if (hexRegex.test(newValue)) {
      onChange(newValue.toUpperCase())
    }
  }

  // Aplicar cor do picker
  const handlePickerChange = (color: string) => {
    onChange(color.toUpperCase())
    setInputValue(color.toUpperCase())
  }

  // Formatar input para sempre ter #
  const formatInputValue = (value: string) => {
    if (!value.startsWith('#')) {
      return `#${value}`
    }
    return value
  }

  return (
    <div className={`relative ${className}`}>
      <div className="w-full flex items-center gap-3 border-[1.5px] border-neutral-200 hover:border-neutral-200 duration-300 p-2.5 rounded-xl transition-colors">
        {/* Swatch de cor */}

        <div className="w-7 h-7 border border-zhex-base-500 rounded-md flex items-center justify-center">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-5 h-5 rounded"
            style={{ backgroundColor: value }}
            aria-label="Selecionar cor"
          />
        </div>

        {/* Input hex */}
        <input
          value={inputValue}
          onChange={(e) => handleInputChange(formatInputValue(e.target.value))}
          className="w-24 outline-none"
          placeholder="#000000"
          maxLength={7}
        />
      </div>

      {error && <p className="text-red-secondary-500 text-sm">{error}</p>}

      {/* Popover do color picker */}
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute top-full left-0 mt-2 z-50 bg-white rounded-lg shadow-lg border border-neutral-200 p-4"
        >
          <HexColorPicker
            color={value}
            onChange={handlePickerChange}
            className="w-48 h-48"
          />

          {/* Botão de confirmar */}
          <div className="flex justify-end mt-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-1 px-3 py-1 text-sm text-zhex-base-500 hover:text-zhex-base-600 transition-colors"
            >
              <CheckIcon size={16} />
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
