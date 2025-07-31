import { FileTextIcon, FilePdfIcon, FileDocIcon, XIcon } from '@phosphor-icons/react'
import Image from 'next/image'
import clsx from 'clsx'

interface DocumentPreviewProps {
  file: File
  onRemove: () => void
  className?: string
}

export function DocumentPreview({ file, onRemove, className }: DocumentPreviewProps) {
  const getFileIcon = (file: File) => {
    const mimeType = file.type.toLowerCase()

    if (mimeType.includes('pdf')) {
      return <FilePdfIcon size={32} className="text-zhex-base-500" />
    }

    if (mimeType.includes('word') || mimeType.includes('document')) {
      return <FileDocIcon size={32} className="text-blue-600" />
    }

    return <FileTextIcon size={32} className="text-zhex-base-500" />
  }

  const isImage = file.type.toLowerCase().includes('image')

  return (
    <div className={clsx(
      'relative w-[100px] h-[100px] border-2 border-dashed rounded-xl flex items-center justify-center bg-neutral-50 overflow-hidden p-2',
      'border-neutral-200 hover:border-neutral-100 transition-colors',
      className,
    )}
    >
      {isImage
        ? (
          <Image
            src={URL.createObjectURL(file)}
            alt="preview"
            width={100}
            height={100}
            className="object-contain w-full h-full rounded-xl"
          />
          )
        : (
          <div className="flex flex-col items-center justify-center text-center">
            {getFileIcon(file)}
            <span className="text-xs text-neutral-600 mt-1 font-medium truncate w-full px-1">
              {file.name.length > 8
                ? `${file.name.substring(0, 8)}...`
                : file.name}
            </span>
          </div>
          )}

      <button
        type="button"
        className="absolute top-1 right-2 text-neutral-1000 hover:text-red-secondary-500"
        onClick={onRemove}
      >
        <XIcon size={16} />
      </button>
    </div>
  )
}
