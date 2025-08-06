'use client'

import {
  LinkIcon,
  GlobeIcon,
  CheckIcon,
  CopyIcon,
} from '@phosphor-icons/react'
import { Button } from '@/components/button'
import { TextField } from '@/components/textfield'
import { UseFormReturn } from 'react-hook-form'
import { LinksFormData } from '@/hooks/useCheckoutLinksForm'

interface LinksCheckoutProps {
  form: UseFormReturn<LinksFormData>
}

export function LinksCheckout({ form }: LinksCheckoutProps) {
  const { register, formState: { errors } } = form

  const handleCopyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    // TODO: Adicionar toast de sucesso
    console.log(`${field} copiado para a área de transferência`)
  }

  const dnsConfig = {
    type: 'CNAME',
    hostName: 'zhex',
    value: 'checkout.zhex.com.br',
  }

  return (
    <div className="bg-gradient-to-bl from-zhex-base-500/20 via-white to-white rounded-lg border border-neutral-200 p-6 max-w-2xl relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-neutral-1000 font-bold font-araboto text-lg mb-2">
            Configure seu Link Próprio com a Zhex
          </h2>

          <p className="text-neutral-600 font-araboto text-base mb-5">
            Ao configurar seu link próprio, você garante uma experiência única de checkout e reforça a autoridade da sua marca. Finalize agora a configuração do seu domínio personalizado.
          </p>

          {/* Lista de features */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-zhex-base-500 flex items-center justify-center">
                <CheckIcon size={12} className="text-white" />
              </div>
              <span className="text-neutral-1000 font-araboto text-sm">
                Integração de checkout com domínio próprio
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-neutral-300 flex items-center justify-center">
                <CheckIcon size={12} className="text-neutral-300" />
              </div>
              <span className="text-neutral-500 font-araboto text-sm">
                Integração de checkout com domínio próprio
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-neutral-300 flex items-center justify-center">
                <CheckIcon size={12} className="text-neutral-300" />
              </div>
              <span className="text-neutral-500 font-araboto text-sm">
                Integração de checkout com domínio próprio
              </span>
            </div>
          </div>
        </div>

        {/* Ícones de fluxo */}
        <div className="flex flex-col items-center ml-6">
          <div className="w-[50px] h-[50px] rounded-full bg-white border border-neutral-200 flex items-center justify-center mb-2">
            <LinkIcon size={24} className="text-zhex-base-500" />
          </div>
          <svg width="16" height="72" viewBox="0 0 16 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.2929 71.2071C7.68342 71.5976 8.31659 71.5976 8.70711 71.2071L15.0711 64.8431C15.4616 64.4526 15.4616 63.8195 15.0711 63.4289C14.6805 63.0384 14.0474 63.0384 13.6569 63.4289L8 69.0858L2.34315 63.4289C1.95262 63.0384 1.31946 63.0384 0.928935 63.4289C0.538411 63.8195 0.538411 64.4526 0.928935 64.8431L7.2929 71.2071ZM8 0.5L7 0.5L7 2.44444L8 2.44444L9 2.44444L9 0.5L8 0.5ZM8 6.33333L7 6.33333L7 10.2222L8 10.2222L9 10.2222L9 6.33333L8 6.33333ZM8 14.1111L7 14.1111L7 18L8 18L9 18L9 14.1111L8 14.1111ZM8 21.8889L7 21.8889L7 25.7778L8 25.7778L9 25.7778L9 21.8889L8 21.8889ZM8 29.6667L7 29.6667L7 33.5556L8 33.5556L9 33.5556L9 29.6667L8 29.6667ZM8 37.4444L7 37.4444L7 41.3333L8 41.3333L9 41.3333L9 37.4444L8 37.4444ZM8 45.2222L7 45.2222L7 49.1111L8 49.1111L9 49.1111L9 45.2222L8 45.2222ZM8 53L7 53L7 56.8889L8 56.8889L9 56.8889L9 53L8 53ZM8 60.7778L7 60.7778L7 64.6667L8 64.6667L9 64.6667L9 60.7778L8 60.7778ZM8 68.5556L7 68.5556L7 70.5L8 70.5L9 70.5L9 68.5556L8 68.5556ZM7.2929 71.2071C7.68342 71.5976 8.31659 71.5976 8.70711 71.2071L15.0711 64.8431C15.4616 64.4526 15.4616 63.8195 15.0711 63.4289C14.6805 63.0384 14.0474 63.0384 13.6569 63.4289L8 69.0858L2.34315 63.4289C1.95262 63.0384 1.31946 63.0384 0.928935 63.4289C0.538411 63.8195 0.538411 64.4526 0.928935 64.8431L7.2929 71.2071ZM8 0.5L7 0.5L7 2.44444L8 2.44444L9 2.44444L9 0.5L8 0.5ZM8 6.33333L7 6.33333L7 10.2222L8 10.2222L9 10.2222L9 6.33333L8 6.33333ZM8 14.1111L7 14.1111L7 18L8 18L9 18L9 14.1111L8 14.1111ZM8 21.8889L7 21.8889L7 25.7778L8 25.7778L9 25.7778L9 21.8889L8 21.8889ZM8 29.6667L7 29.6667L7 33.5556L8 33.5556L9 33.5556L9 29.6667L8 29.6667ZM8 37.4444L7 37.4444L7 41.3333L8 41.3333L9 41.3333L9 37.4444L8 37.4444ZM8 45.2222L7 45.2222L7 49.1111L8 49.1111L9 49.1111L9 45.2222L8 45.2222ZM8 53L7 53L7 56.8889L8 56.8889L9 56.8889L9 53L8 53ZM8 60.7778L7 60.7778L7 64.6667L8 64.6667L9 64.6667L9 60.7778L8 60.7778ZM8 68.5556L7 68.5556L7 70.5L8 70.5L9 70.5L9 68.5556L8 68.5556Z" fill="#5C7DFA" />
          </svg>

          <div className="w-[50px] h-[50px] rounded-full bg-[#6D86EB] flex items-center justify-center mt-2">
            <GlobeIcon size={24} className="text-white" />
          </div>
        </div>
      </div>

      {/* 1. Digite o link personalizado */}
      <div className="mb-6">
        <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
          1. Digite o link personalizado:
        </label>
        <TextField
          {...register('customLink')}
          placeholder="https://example.checkout.com"
          error={errors.customLink?.message}
          className="w-full"
        />
      </div>

      {/* 2. Copie e cole no DNS */}
      <div className="mb-6">
        <label className="text-neutral-1000 font-medium font-araboto text-base mb-3 block">
          2. Copie e cole no DNS
        </label>

        {/* Tabela DNS */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Type */}
            <div>
              <label className="text-neutral-600 font-araboto text-base mb-1 block">
                Type
              </label>
              <div className="flex items-center justify-between bg-white rounded-lg border border-neutral-200 px-3 py-2">
                <span className="text-neutral-800 font-araboto text-sm">
                  {dnsConfig.type}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyToClipboard(dnsConfig.type, 'Type')}
                  className="text-neutral-500 hover:text-zhex-base-500 transition-colors"
                >
                  <CopyIcon size={16} />
                </button>
              </div>
            </div>

            {/* Host name */}
            <div>
              <label className="text-neutral-600 font-araboto text-base mb-1 block">
                Host name
              </label>
              <div className="flex items-center justify-between bg-white rounded-lg border border-neutral-200 px-3 py-2">
                <span className="text-neutral-800 font-araboto text-sm">
                  {dnsConfig.hostName}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyToClipboard(dnsConfig.hostName, 'Host name')}
                  className="text-neutral-500 hover:text-zhex-base-500 transition-colors"
                >
                  <CopyIcon size={16} />
                </button>
              </div>
            </div>

            {/* Value */}
            <div>
              <label className="text-neutral-600 font-araboto text-base mb-1 block">
                Value
              </label>
              <div className="flex items-center justify-between bg-white rounded-lg border border-neutral-200 px-3 py-2">
                <span className="text-neutral-800 font-araboto text-sm">
                  {dnsConfig.value}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyToClipboard(dnsConfig.value, 'Value')}
                  className="text-neutral-500 hover:text-zhex-base-500 transition-colors"
                >
                  <CopyIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão Validar DNS */}
      <Button
        type="button"
        variant="ghost"
        size="medium"
        className="w-full flex items-center justify-center gap-2"
      >
        <CheckIcon size={20} weight="bold" />
        Validar DNS
      </Button>
    </div>
  )
}
