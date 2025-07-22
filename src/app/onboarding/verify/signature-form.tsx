'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import SignatureCanvas from 'react-signature-canvas'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs'
import { TextField } from '@/components/textfield'

export function SignatureForm() {
  const padRef = useRef<SignatureCanvas | null>(null)
  const [mode, setMode] = useState<'draw' | 'type'>('draw')
  const [typed, setTyped] = useState('')

  const clearPad = () => padRef.current?.clear()

  // Ctrl+Z / Cmd+Z triggers clear
  useEffect(() => {
    const handleUndo = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        clearPad()
      }
    }
    window.addEventListener('keydown', handleUndo)
    return () => window.removeEventListener('keydown', handleUndo)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* header */}
      <h2 className="text-lg font-araboto font-semibold text-neutral-950">
        Sua assinatura.
      </h2>

      {/* Card */}
      <Tabs value={mode} onValueChange={(v) => setMode(v as 'draw' | 'type')}>
        <div className="w-full max-w-[460px] rounded-lg border border-neutral-200 overflow-hidden">
          <TabsContent value="draw">
            <SignatureCanvas
              ref={padRef}
              penColor="#0F172A"
              canvasProps={{
                width: 460,
                height: 260,
                className: 'bg-white cursor-crosshair',
              }}
            />
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={clearPad}
                className="text-sm text-neutral-500 hover:text-neutral-700"
              >
                Limpar
              </button>
            </div>
          </TabsContent>
          <TabsContent value="type">
            <div className="p-6 flex flex-col gap-4">
              <TextField
                placeholder="Digite seu nome"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
              />
              <div className="h-24 flex items-center justify-center border border-neutral-200 rounded-lg">
                <span className="font-signature text-4xl text-neutral-900">
                  {typed || 'Sua Assinatura'}
                </span>
              </div>
            </div>
          </TabsContent>
        </div>

        {/* Tab buttons */}
        <TabsList className="grid grid-cols-2 w-full max-w-[460px] mt-4 border border-neutral-200 rounded-lg">
          <TabsTrigger
            value="draw"
            className="py-3 text-sm font-medium data-[state=active]:border data-[state=active]:border-neutral-200 rounded-lg"
          >
            Rabisco
          </TabsTrigger>
          <TabsTrigger
            value="type"
            className="py-3 text-sm font-medium data-[state=active]:border data-[state=active]:border-neutral-200 rounded-lg"
          >
            Escrita
          </TabsTrigger>
        </TabsList>

        {/* Footer */}
        <p className="text-neutral-500 font-araboto text-sm mt-4 max-w-[460px]">
          Para concluir o processo de verificação, é necessário assinar o
          contrato de adesão. Por favor, leia atentamente nossos{' '}
          <Link href="#" className="text-zhex-base-500 underline">
            termos
          </Link>
          .
        </p>

        <p className="text-neutral-500 font-araboto text-sm mt-4 max-w-[460px]">
          Sua assinatura digital serve apenas para formalizar o contrato de
          adesão. Ela fica criptografada em nossos servidores e não é
          compartilhada com terceiros.
        </p>
      </Tabs>
    </div>
  )
}
