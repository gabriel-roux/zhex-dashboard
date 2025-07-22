'use client'

import { Button } from '@/components/button'
import {
  AddressBookIcon,
  ArrowsOutSimpleIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@phosphor-icons/react'

/**
 * Card: Seu gerente de contas
 *
 * Mostra contato dedicado, descrição de suporte e CTA.
 * Substitua avatar / nome / texto conforme API.
 */
export function SupportWidget() {
  const manager = {
    name: 'João Medes',
    role: 'Seu suporte 24/7',
    avatar: 'https://avatars.githubusercontent.com/u/9919?s=200&v=4', // placeholder
    blurb:
      'Quem quer vender sem limites, precisa de uma equipe que não coloca limite no atendimento. Estamos prontos para deixar tudo nos conformes e garantir que sua operação conosco funcione como um relógio.',
  }

  return (
    <div className="w-full h-[380px] bg-white border border-neutral-200 rounded-lg py-5 px-4 flex flex-col gap-4">
      {/* Header ---------------------------------------------------- */}
      <header className="flex items-start justify-between">
        <h3 className="text-neutral-1000 font-araboto text-lg flex items-center gap-2 font-medium">
          <AddressBookIcon size={22} weight="bold" className="-mt-0.5" />
          Seu Gerente de contas
        </h3>

        <button className="w-8 h-8 rounded-lg border text-neutral-500 border-neutral-200 hover:bg-neutral-100 transition-colors flex items-center justify-center">
          <ArrowsOutSimpleIcon size={18} weight="bold" />
        </button>
      </header>

      {/* Perfil ---------------------------------------------------- */}
      <div className="flex items-start gap-4">
        <img
          src={manager.avatar}
          alt={manager.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="text-neutral-1000 font-medium">{manager.name}</span>
          <span className="text-neutral-500 text-sm">{manager.role}</span>
        </div>
      </div>

      {/* Ações rápidas */}

      {/* Descrição ------------------------------------------------- */}
      <p className="text-neutral-1000 text-sm font-araboto font-medium leading-relaxed mt-2">
        {manager.blurb}
      </p>

      {/* CTA ------------------------------------------------------- */}
      <div className="mt-auto flex flex-col gap-3">
        <Button variant="primary">Entrar em Contato</Button>

        <Button variant="secondary">Marcar uma Call</Button>
      </div>
    </div>
  )
}
