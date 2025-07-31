'use client'

import { Button } from '@/components/button'
import { TextField } from '@/components/textfield'
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, CheckCircleIcon, ArrowsClockwiseIcon } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'
import { CreatePlanModal } from './create-plan'
import { Switch } from '@/components/switch'
import { useApi } from '@/hooks/useApi'
import { ConfirmationModal } from '@/components/confirmation-modal'
import { Subscription } from '@/@types/subscription'
import { SubscriptionsTableSkeleton } from '@/components/skeletons/subscriptions-table-skeleton'

interface ProductSubscriptionsProps {
  productId: string
}

export function ProductSubscriptions({ productId }: ProductSubscriptionsProps) {
  const [subscriptionsList, setSubscriptionsList] = useState<Subscription[]>([])
  const [hasSubscriptions, setHasSubscriptions] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [subscriptionToEdit, setSubscriptionToEdit] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const { get, put, delete: del } = useApi()

  // Buscar assinaturas da API
  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const response = await get<{ success: boolean; data: { subscriptions: Subscription[] } }>(`/products/${productId}/subscriptions`)

      if (response.success) {
        setSubscriptionsList(response.data.data.subscriptions)
        setHasSubscriptions(response.data.data.subscriptions.length > 0)
      }
    } catch (error) {
      console.error('Erro ao buscar assinaturas:', error)
    } finally {
      setLoading(false)
    }
  }

  // Alternar status da assinatura
  const toggleSubscriptionStatus = async (subscriptionId: string, currentStatus: boolean) => {
    try {
      const response = await put<{ success: boolean }>(`/products/${productId}/subscriptions/${subscriptionId}`, {
        isActive: !currentStatus,
      })

      if (response.success) {
        fetchSubscriptions()
      }
    } catch (error) {
      console.error('Erro ao alternar status:', error)
    }
  }

  // Abrir modal de criação
  const openCreateModal = () => {
    setModalMode('create')
    setSubscriptionToEdit(null)
    setIsModalOpen(true)
  }

  // Abrir modal de edição
  const openEditModal = (subscription: Subscription) => {
    setModalMode('edit')
    setSubscriptionToEdit(subscription)
    setIsModalOpen(true)
  }

  // Abrir modal de exclusão
  const openDeleteModal = (subscriptionId: string) => {
    setSubscriptionToDelete(subscriptionId)
    setShowDeleteModal(true)
  }

  // Excluir assinatura
  const deleteSubscription = async () => {
    if (!subscriptionToDelete) return

    try {
      setDeleteLoading(true)
      const response = await del<{ success: boolean }>(`/products/${productId}/subscriptions/${subscriptionToDelete}`)

      if (response.success) {
        fetchSubscriptions()
        setShowDeleteModal(false)
        setSubscriptionToDelete(null)
      }
    } catch (error) {
      console.error('Erro ao excluir assinatura:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  // Filtrar assinaturas
  const filteredSubscriptions = subscriptionsList.filter(subscription =>
    subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.price.baseAmount.toString().includes(searchTerm) ||
    subscription.billingInterval.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Buscar assinaturas quando o productId mudar
  useEffect(() => {
    if (productId) {
      fetchSubscriptions()
    }
  }, [productId])

  // Handler para quando uma assinatura for criada/editada
  const handleSubscriptionCreated = () => {
    fetchSubscriptions()
  }

  // Formatar valor monetário
  const formatCurrency = (amount: number) => {
    return (amount / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  // Formatar intervalo de cobrança
  const formatBillingInterval = (interval: string, count: number) => {
    switch (interval) {
      case 'DAY':
        return count === 1
          ? 'Diário'
          : `A cada ${count} dias`
      case 'WEEK':
        return count === 1
          ? 'Semanal'
          : `A cada ${count} semanas`
      case 'MONTH':
        return count === 1
          ? 'Mensal'
          : `A cada ${count} meses`
      case 'YEAR':
        return count === 1
          ? 'Anual'
          : `A cada ${count} anos`
      default:
        return 'Personalizado'
    }
  }

  return (
    <>
      <CreatePlanModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        productId={productId}
        onSubscriptionCreated={handleSubscriptionCreated}
        mode={modalMode}
        subscriptionToEdit={subscriptionToEdit}
      />

      <ConfirmationModal
        confirmText="Excluir assinatura"
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Excluir assinatura"
        description="Tem certeza que deseja excluir esta assinatura? Esta ação não pode ser desfeita."
        onConfirm={deleteSubscription}
        loading={deleteLoading}
        variant="danger"
      />

      {/* Subscriptions Section */}
      <div className="w-full flex justify-end items-center gap-4 mt-10 mb-6">
        <div className="w-full max-w-[340px]">
          <TextField
            leftIcon={<MagnifyingGlassIcon size={20} weight="bold" />}
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-[1px] h-10 bg-neutral-200" />
        <Button
          variant="ghost"
          size="medium"
          type="button"
          onClick={openCreateModal}
        >
          Criar nova assinatura
        </Button>
      </div>

      {/* Content Area */}
      {loading
        ? (
          <SubscriptionsTableSkeleton />
          )
        : !hasSubscriptions
            ? (
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
                      {filteredSubscriptions.map((subscription) => (
                        <tr key={subscription.id} className="border-b last:border-b-0 hover:bg-neutral-50">
                          <td className="py-4 px-6">
                            <span className="font-araboto text-neutral-1000">{subscription.name}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-araboto text-neutral-1000">
                              {formatCurrency(subscription.price.baseAmount)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-neutral-500">
                              {formatBillingInterval(subscription.billingInterval, subscription.billingIntervalCount)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Switch
                                active={subscription.isActive}
                                setValue={() => toggleSubscriptionStatus(subscription.id, subscription.isActive)}
                              />
                              <span className="text-neutral-500">
                                {subscription.isActive
                                  ? 'Ativo'
                                  : 'Inativo'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-neutral-500">{subscription.paymentLinksCount} links</span>
                          </td>
                          <td className="py-4 px-6">
                            <CheckCircleIcon
                              size={18}
                              className={subscription.trialEnabled
                                ? 'text-green-secondary-500'
                                : 'text-neutral-300'}
                              weight="bold"
                            />
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                                onClick={() => openEditModal(subscription)}
                              >
                                <PencilIcon size={16} className="text-neutral-600" />
                              </button>
                              <button
                                type="button"
                                className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-red-50 transition-colors"
                                onClick={() => openDeleteModal(subscription.id)}
                              >
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
