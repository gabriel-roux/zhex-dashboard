import { UploadIcon, XIcon } from '@phosphor-icons/react'
import clsx from 'clsx'
import React, { useState, useRef, useId, useEffect } from 'react'

interface UploadButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children' | 'onChange'> {
  children?: React.ReactNode
  onUpload?: (url: string) => void
  onFileSelect?: (file: File) => void
  currentImage?: string
  onRemove?: () => void
}

export function UploadButton({ children, onUpload, onFileSelect, currentImage, onRemove, ...inputProps }: UploadButtonProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uniqueId = useId()

  // Sincronizar currentImage com o estado interno
  useEffect(() => {
    setPreviewUrl(currentImage || null)
  }, [currentImage])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleFileChange triggered')
    console.log('event.target.files:', event.target.files)

    const file = event.target.files?.[0]
    console.log('selected file:', file)

    if (file) {
      // Criar URL temporária para preview
      const url = URL.createObjectURL(file)
      console.log('created URL:', url)
      setPreviewUrl(url)

      // Chamar callback de upload
      if (onUpload) {
        console.log('calling onUpload with URL:', url)
        onUpload(url)
      }

      // Chamar callback de seleção de arquivo
      if (onFileSelect) {
        console.log('calling onFileSelect with file:', file)
        onFileSelect(file)
      }
    }
  }

  const handleRemove = () => {
    console.log('handleRemove called')
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onRemove?.()
  }

  return (
    <div className="w-full flex items-center gap-2">
      <label
        htmlFor={`upload-button-${uniqueId}`}
        className={clsx(
          'flex-1 flex items-center gap-2 justify-center w-full h-12 bg-zhex-base-500/5 border border-dashed border-zhex-base-500 rounded-lg px-2 cursor-pointer hover:bg-zhex-base-500/10 transition-colors',
          inputProps.className,
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          id={`upload-button-${uniqueId}`}
          hidden
          accept="image/*"
          onChange={handleFileChange}
          {...inputProps}
        />

        <div className="h-[36px] w-full flex items-center gap-2 justify-center rounded-lg border-[1.5px] border-zhex-base-500 text-zhex-base-500 text-base font-araboto font-medium hover:bg-zhex-base-500 hover:text-white transition-all duration-300">
          <UploadIcon size={20} weight="bold" />
          {children || 'Upload'}
        </div>
      </label>

      {previewUrl && (
        <button type="button" onClick={handleRemove} className="w-10 h-10 flex items-center gap-2 justify-center rounded-lg text-zhex-base-500 text-base font-araboto font-medium hover:bg-zhex-base-500/50 transition-all duration-300">
          <XIcon size={20} weight="bold" />
        </button>
      )}
    </div>
  )
}
