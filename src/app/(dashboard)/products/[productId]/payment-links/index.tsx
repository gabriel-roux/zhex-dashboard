'use client'

import { Button } from '@/components/button'
import { TextField } from '@/components/textfield'
import { MagnifyingGlassIcon, LinkIcon, PencilIcon, TrashIcon, CopyIcon, BrowserIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { CreateLinkModal } from './create-link'
import { Switch } from '@/components/switch'

// Dados dos links de pagamento
const paymentLinks = [
  {
    id: 1,
    name: 'Oferta para clientes novos',
    checkout: 'Zhex Default Checkout',
    value: 190.00,
    status: 'active',
    accessUrl: 'https://livrodes...',
  },
  {
    id: 2,
    name: 'Promoção Black Friday',
    checkout: 'Zhex Default Checkout',
    value: 299.00,
    status: 'active',
    accessUrl: 'https://livrodes...',
  },
  {
    id: 3,
    name: 'Desconto para estudantes',
    checkout: 'Zhex Default Checkout',
    value: 150.00,
    status: 'inactive',
    accessUrl: 'https://livrodes...',
  },
]

export function PaymentLinks() {
  const [hasLinks] = useState(false) // Controla se tem links ou não
  const [links, setLinks] = useState(paymentLinks) // Estado para controlar os links
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false) // Estado para controlar o modal

  // Função para alternar o status de um link
  const toggleLinkStatus = (linkId: number) => {
    setLinks(prevLinks =>
      prevLinks.map(link =>
        link.id === linkId
          ? {
              ...link,
              status: link.status === 'active'
                ? 'inactive'
                : 'active',
            }
          : link,
      ),
    )
  }

  return (
    <>
      {/* Payment Links Section */}
      <div className="w-full flex justify-end items-center gap-4 mt-10 mb-6">
        <div className="w-full max-w-[340px]">
          <TextField
            leftIcon={<MagnifyingGlassIcon size={20} weight="bold" />}
            placeholder="Buscar"
          />
        </div>
        <div className="w-[1px] h-10 bg-neutral-200" />
        <Button
          variant="ghost"
          size="medium"
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Criar novo link
        </Button>
      </div>

      {/* Content Area */}
      {!hasLinks
        ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-10">
            <LinkIcon size={32} weight="bold" className="text-neutral-400 mb-4" />
            <h3 className="text-lg font-araboto font-medium text-neutral-1000 mb-1">
              Crie seu link de pagamento em segundos
            </h3>
            <p className="text-neutral-600 text-center max-w-md">
              Gere cobranças rápidas, compartilhe com seus clientes e receba direto na sua conta.
            </p>
          </div>
          )
        : (
          /* Table State */
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-neutral-200 ">
                  <tr className="text-neutral-1000">
                    <th className="py-3 px-6 font-medium font-araboto">Nome</th>
                    <th className="py-3 px-6 font-medium font-araboto">Checkout</th>
                    <th className="py-3 px-6 font-medium font-araboto">Valor</th>
                    <th className="py-3 px-6 font-medium font-araboto">Status</th>
                    <th className="py-3 px-6 font-medium font-araboto">Acesso</th>
                    <th className="py-3 px-6 font-medium font-araboto">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => (
                    <tr key={link.id} className="border-b last:border-b-0 hover:bg-neutral-50">
                      <td className="py-4 px-6">
                        <span className="font-araboto text-neutral-1000">{link.name}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <BrowserIcon size={20} weight="bold" className="text-neutral-500" />
                          <span className="text-neutral-500">{link.checkout}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-araboto text-neutral-1000">
                          {link.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Switch active={link.status === 'active'} setValue={() => toggleLinkStatus(link.id)} />
                          <span className="text-neutral-500">
                            {link.status === 'active'
                              ? 'Ativo'
                              : 'Inativo'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="w-[155px] flex items-center justify-between gap-2 bg-zhex-base-500/10 rounded-lg px-3 py-1">
                          <span className="text-neutral-500 text-sm">{link.accessUrl}</span>
                          <button type="button" className="text-zhex-base-500 hover:text-zhex-base-600">
                            <CopyIcon size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button type="button" className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-100 transition-colors">
                            <PencilIcon size={16} className="text-neutral-600" />
                          </button>
                          <button type="button" className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-red-50 transition-colors">
                            <TrashIcon size={16} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )}

      {/* Create Link Modal */}
      <CreateLinkModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </>
  )
}
