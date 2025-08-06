'use client'

import { Button } from '@/components/button'
import { TextField } from '@/components/textfield'
import { MagnifyingGlassIcon, BrowserIcon, PencilIcon, TrashIcon } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'
import { useApi } from '@/hooks/useApi'
import { ConfirmationModal } from '@/components/confirmation-modal'
import { CheckoutsTableSkeleton } from '@/components/skeletons/checkouts-table-skeleton'
import { Checkout } from '@/@types/checkout'
import { CreateCheckoutModal } from './create-checkout'
import Link from 'next/link'

interface CheckoutsProps {
  productId: string
}

export function Checkouts({ productId }: CheckoutsProps) {
  const [checkouts, setCheckouts] = useState<Checkout[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [checkoutToDelete, setCheckoutToDelete] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { get, delete: del } = useApi()

  // Buscar checkouts
  const fetchCheckouts = async () => {
    try {
      setLoading(true)
      const response = await get<{ success: boolean; data: Checkout[]; message?: string }>(`/products/${productId}/checkouts`)

      console.log(response)

      if (response.data.success) {
        setCheckouts(response.data.data)
      } else {
        console.error('Erro na resposta da API:', response.data.message)
      }
    } catch (error) {
      console.error('Erro ao buscar checkouts:', error)
    } finally {
      setLoading(false)
    }
  }

  // Abrir modal de confirmação de delete
  const openDeleteModal = (checkoutId: string) => {
    setCheckoutToDelete(checkoutId)
    setShowDeleteModal(true)
  }

  // Deletar checkout
  const deleteCheckout = async () => {
    if (!checkoutToDelete) return

    try {
      setDeleteLoading(true)
      const response = await del<{ success: boolean; message?: string }>(`/products/${productId}/checkouts/${checkoutToDelete}`)

      if (response.success) {
        setCheckouts(prevCheckouts => prevCheckouts.filter(checkout => checkout.id !== checkoutToDelete))
        setShowDeleteModal(false)
        setCheckoutToDelete(null)
      } else {
        console.error('Erro na resposta da API:', response.data.message)
      }
    } catch (error) {
      console.error('Erro ao deletar checkout:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  // Filtrar checkouts por busca
  const filteredCheckouts = checkouts?.filter(checkout =>
    checkout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (checkout.title && checkout.title.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  useEffect(() => {
    if (productId) {
      fetchCheckouts()
    }
  }, [productId])

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  // Abrir modal de criação
  const openCreateModal = () => {
    setIsModalOpen(true)
  }

  // Handler para quando um checkout for criado
  const handleCheckoutCreated = () => {
    fetchCheckouts()
    setIsModalOpen(false)
  }

  return (
    <>
      {/* Checkouts Section */}
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
          Adicionar checkout
        </Button>
      </div>

      {/* Content Area */}
      {loading
        ? (
          <CheckoutsTableSkeleton />
          )
        : checkouts?.length === 0
          ? (
        /* Empty State */
            <div className="flex flex-col items-center justify-center py-10">
              <BrowserIcon size={32} weight="bold" className="text-neutral-400 mb-4" />
              <h3 className="text-lg font-araboto font-medium text-neutral-1000 mb-1">
                Crie seu primeiro checkout personalizado
              </h3>
              <p className="text-neutral-600 text-center max-w-md">
                Personalize a experiência de compra dos seus clientes com cores, layouts e funcionalidades exclusivas.
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
                      <th className="py-3 px-6 font-medium font-araboto text-center">Links de pagamento</th>
                      <th className="py-3 px-6 font-medium font-araboto">Criado em</th>
                      <th className="py-3 px-6 font-medium font-araboto text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCheckouts?.map((checkout) => (
                      <tr key={checkout.id} className="border-b last:border-b-0 hover:bg-neutral-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <BrowserIcon size={20} weight="bold" className="text-neutral-500" />
                            <span className="font-araboto text-neutral-1000">{checkout.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-neutral-500">
                            {checkout.paymentLinksCount} {checkout.paymentLinksCount === 1
                              ? 'link'
                              : 'links'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-neutral-500">{formatDate(checkout.createdAt)}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                              href={`/products/${productId}/checkout/${checkout.id}`}
                            >
                              <PencilIcon size={16} className="text-neutral-600" />
                            </Link>
                            <button
                              type="button"
                              className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-red-50 transition-colors"
                              onClick={() => openDeleteModal(checkout.id)}
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

      {/* Create Checkout Modal */}
      <CreateCheckoutModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        productId={productId}
        onCheckoutCreated={handleCheckoutCreated}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Deletar checkout"
        description="Tem certeza que deseja deletar este checkout? Esta ação não pode ser desfeita."
        warningText="O checkout será removido permanentemente e todos os links de pagamento associados ficarão inativos."
        confirmText="Deletar"
        onConfirm={deleteCheckout}
        variant="danger"
        loading={deleteLoading}
      />
    </>
  )
}
