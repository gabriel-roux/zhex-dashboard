'use client'

import { Button } from '@/components/button'
import { TextField } from '@/components/textfield'
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, TicketIcon, InfinityIcon, CalendarIcon, UserIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { CreateCouponModal } from './create-coupon'
import { Switch } from '@/components/switch'

// Dados dos cupons
const coupons = [
  {
    id: 1,
    name: 'Cupom #001',
    code: 'NEW20',
    discount: '20%',
    status: 'active',
    validity: 'infinity',
    usageLimit: 300,
  },
  {
    id: 2,
    name: 'Cupom #002',
    code: 'PROD30',
    discount: 'R$ 30,00',
    status: 'active',
    validity: '2025-07-17',
    usageLimit: 23,
  },
  {
    id: 3,
    name: 'Cupom #003',
    code: 'NEW20',
    discount: '20%',
    status: 'inactive',
    validity: 'infinity',
    usageLimit: 67,
  },
  {
    id: 4,
    name: 'Cupom #004',
    code: 'PRIME5',
    discount: 'R$ 5,00',
    status: 'active',
    validity: '2026-08-30',
    usageLimit: 1000,
  },
]

export function ProductCoupons() {
  const [hasCoupons] = useState(true) // Controla se tem cupons ou não
  const [couponsList, setCouponsList] = useState(coupons) // Estado para controlar os cupons
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false) // Estado para controlar o modal

  // Função para alternar o status de um cupom
  const toggleCouponStatus = (couponId: number) => {
    setCouponsList(prevCoupons =>
      prevCoupons.map(coupon =>
        coupon.id === couponId
          ? {
              ...coupon,
              status: coupon.status === 'active'
                ? 'inactive'
                : 'active',
            }
          : coupon,
      ),
    )
  }

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    if (dateString === 'infinity') return null
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <>
      {/* Coupons Section */}
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
          Criar novo cupom
        </Button>
      </div>

      {/* Content Area */}
      {!hasCoupons
        ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-10">
            <TicketIcon size={32} weight="bold" className="text-neutral-400 mb-4" />
            <h3 className="text-lg font-araboto font-medium text-neutral-1000 mb-1">
              Você ainda não criou nenhum cupom de desconto
            </h3>
            <p className="text-neutral-600 text-center max-w-md">
              Crie descontos para aumentar suas vendas.
            </p>
          </div>
          )
        : (
          /* Table State */
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-neutral-200">
                  <tr className="text-neutral-1000">
                    <th className="py-3 px-6 font-medium font-araboto">Nome</th>
                    <th className="py-3 px-6 font-medium font-araboto">Código</th>
                    <th className="py-3 px-6 font-medium font-araboto">Desconto</th>
                    <th className="py-3 px-6 font-medium font-araboto">Status</th>
                    <th className="py-3 px-6 font-medium font-araboto">Validade</th>
                    <th className="py-3 px-6 font-medium font-araboto">Limite de uso</th>
                    <th className="py-3 px-6 font-medium font-araboto">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {couponsList.map((coupon) => (
                    <tr key={coupon.id} className="border-b last:border-b-0 hover:bg-neutral-50">
                      <td className="py-4 px-6">
                        <span className="font-araboto text-neutral-1000">{coupon.name}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-neutral-500">{coupon.code}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-araboto text-neutral-1000">{coupon.discount}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Switch active={coupon.status === 'active'} setValue={() => toggleCouponStatus(coupon.id)} />
                          <span className="text-neutral-500">
                            {coupon.status === 'active'
                              ? 'Ativo'
                              : 'Inativo'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {coupon.validity === 'infinity'
                            ? (
                              <InfinityIcon size={16} className="text-neutral-500" />
                              )
                            : (
                              <CalendarIcon size={16} className="text-neutral-500" />
                              )}
                          <span className="text-neutral-500">
                            {coupon.validity === 'infinity'
                              ? ''
                              : formatDate(coupon.validity)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <UserIcon size={16} className="text-neutral-500" />
                          <span className="text-neutral-500">
                            {coupon.usageLimit.toLocaleString('pt-BR')}
                          </span>
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

      {/* Create Coupon Modal */}
      <CreateCouponModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </>
  )
}
