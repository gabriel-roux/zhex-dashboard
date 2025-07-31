import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/button'
import { XCircleIcon } from '@phosphor-icons/react'

interface ConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  warningText?: string
  confirmText: string
  cancelText?: string
  onConfirm: () => void
  variant?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  warningText,
  confirmText,
  cancelText = 'Cancelar',
  onConfirm,
  variant = 'danger',
  loading = false,
}: ConfirmationModalProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          button: 'bg-red-secondary-500 hover:bg-red-secondary-600',
          icon: 'text-red-secondary-500',
        }
      case 'warning':
        return {
          button: 'bg-yellow-500 hover:bg-yellow-600',
          icon: 'text-yellow-500',
        }
      case 'info':
        return {
          button: 'bg-blue-500 hover:bg-blue-600',
          icon: 'text-blue-500',
        }
      default:
        return {
          button: 'bg-red-secondary-500 hover:bg-red-secondary-600',
          icon: 'text-red-secondary-500',
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-full max-w-md z-50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold text-neutral-1000">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-neutral-500 hover:text-red-secondary-500 transition-colors">
                <XCircleIcon size={20} weight="fill" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-4 mb-6">
            <p className="text-sm text-neutral-600 leading-relaxed">
              {description}
            </p>
            {warningText && (
              <p className="text-sm text-neutral-1000 font-medium leading-relaxed">
                {warningText}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Dialog.Close asChild>
              <Button variant="ghost" size="medium" className="w-1/2">
                {cancelText}
              </Button>
            </Dialog.Close>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 w-full px-4 py-2 text-white rounded-lg transition-colors cursor-pointer ${styles.button} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading
                ? 'Confirmando...'
                : confirmText}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
