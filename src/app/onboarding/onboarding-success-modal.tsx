'use client'

import { Button } from '@/components/button'
import * as Dialog from '@radix-ui/react-dialog'
import Lottie from 'lottie-react'
import successAnimationData from '@/assets/animations/success.json'

interface OnboardingSuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export function OnboardingSuccessModal({ isOpen, onClose }: OnboardingSuccessModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-neutral-1000/40 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white px-4 py-6 shadow-xl flex flex-col items-center max-w-[480px] w-full">
          <div className="flex flex-col items-center gap-3">
            <div className="w-28 h-28">
              <Lottie
                animationData={successAnimationData}
                loop
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <Dialog.Title className="text-2xl font-araboto font-medium text-neutral-1000 text-center">
              Empresa registrada com sucesso! 🎉
            </Dialog.Title>
            <Dialog.Description className="text-neutral-700 text-center">
              Parabéns! Sua empresa foi registrada e você já pode começar a vender agora.
            </Dialog.Description>
            <Button variant="primary" className="mt-5" size="full" onClick={onClose}>
              Começar a vender
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
