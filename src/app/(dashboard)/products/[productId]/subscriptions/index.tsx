'use client'

import { Button } from '@/components/button'
import { TextField } from '@/components/textfield'
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, CheckCircleIcon, ArrowsClockwiseIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { CreatePlanModal } from './create-plan'
import { Switch } from '@/components/switch'

// Dados das assinaturas
const subscriptions = [
  {
    id: 1,
    name: 'Assinatura #001',
    value: 1050.00,
    recurrence: 'Anual',
    status: 'active',
    paymentLinks: 3,
    freeTrial: true,
  },
  {
    id: 2,
    name: 'Assinatura #004',
    value: 129.90,
    recurrence: 'Mensal',
    status: 'active',
    paymentLinks: 3,
    freeTrial: false,
  },
  {
    id: 3,
    name: 'Assinatura #002',
    value: 70.00,
    recurrence: 'Semestral',
    status: 'inactive',
    paymentLinks: 3,
    freeTrial: true,
  },
  {
    id: 4,
    name: 'Assinatura #006',
    value: 70.00,
    recurrence: 'Semestral',
    status: 'inactive',
    paymentLinks: 3,
    freeTrial: true,
  },
  {
    id: 5,
    name: 'Assinatura #007',
    value: 70.00,
    recurrence: 'Semestral',
    status: 'inactive',
    paymentLinks: 3,
    freeTrial: true,
  },
  {
    id: 6,
    name: 'Assinatura #012',
    value: 70.00,
    recurrence: 'Semestral',
    status: 'inactive',
    paymentLinks: 3,
    freeTrial: false,
  },
]

export function ProductSubscriptions() {
  const [hasSubscriptions] = useState(true) // Controla se tem assinaturas ou não
  const [subscriptionsList, setSubscriptionsList] = useState(subscriptions) // Estado para controlar as assinaturas
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false) // Estado para controlar o modal

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true)
  }

  // Função para alternar o status de uma assinatura
  const toggleSubscriptionStatus = (subscriptionId: number) => {
    setSubscriptionsList(prevSubscriptions =>
      prevSubscriptions.map(subscription =>
        subscription.id === subscriptionId
          ? {
              ...subscription,
              status: subscription.status === 'active'
                ? 'inactive'
                : 'active',
            }
          : subscription,
      ),
    )
  }

  return (
    <>
      <CreatePlanModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
      {/* Subscriptions Section */}
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
          onClick={handleOpenCreateModal}
        >
          Criar nova assinatura
        </Button>
      </div>

      {/* Content Area */}
      {!hasSubscriptions
        ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-10">
            <ArrowsClockwiseIcon size={32} weight="bold" className="text-neutral-400 mb-4" />
            <h3 className="text-lg font-araboto font-medium text-neutral-1000 mb-1">
              Configure sua assinatura personalizada
            </h3>
            <p className="text-neutral-600 text-center max-w-md">
              Crie planos recorrentes, automatize cobranças e garanta faturamento previsível.
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
                    <th className="py-3 px-6 font-medium font-araboto">Valor</th>
                    <th className="py-3 px-6 font-medium font-araboto">Recorrência</th>
                    <th className="py-3 px-6 font-medium font-araboto">Status</th>
                    <th className="py-3 px-6 font-medium font-araboto">Links de pagamentos</th>
                    <th className="py-3 px-6 font-medium font-araboto">Free trial</th>
                    <th className="py-3 px-6 font-medium font-araboto">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptionsList.map((subscription) => (
                    <tr key={subscription.id} className="border-b last:border-b-0 hover:bg-neutral-50">
                      <td className="py-4 px-6">
                        <span className="font-araboto text-neutral-1000">{subscription.name}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-araboto text-neutral-1000">
                          {subscription.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-neutral-500">{subscription.recurrence}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Switch active={subscription.status === 'active'} setValue={() => toggleSubscriptionStatus(subscription.id)} />
                          <span className="text-neutral-500">
                            {subscription.status === 'active'
                              ? 'Ativo'
                              : 'Inativo'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-neutral-500">{subscription.paymentLinks} links</span>
                      </td>
                      <td className="py-4 px-6">
                        <CheckCircleIcon
                          size={18}
                          className={subscription.freeTrial
                            ? 'text-green-secondary-500'
                            : 'text-neutral-300'}
                          weight="bold"
                        />
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
    </>
  )
}
