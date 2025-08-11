'use client'

import { Button } from '@/components/button'
import { TextField } from '@/components/textfield'
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, TicketIcon, InfinityIcon, CalendarIcon, UserIcon } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'
import { CouponModal } from './create-coupon'
import { Switch } from '@/components/switch'
import { useApi } from '@/hooks/useApi'
import { ConfirmationModal } from '@/components/confirmation-modal'
import { Coupon } from '@/@types/coupon'
import { CouponsTableSkeleton } from '@/components/skeletons/coupons-table-skeleton'
import { EmptyState } from '@/components/empty-state'

interface ProductCouponsProps {
  productId: string
}

export function ProductCoupons({ productId }: ProductCouponsProps) {
  const [hasCoupons, setHasCoupons] = useState(false)
  const [couponsList, setCouponsList] = useState<Coupon[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [couponToEdit, setCouponToEdit] = useState<Coupon | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const { get, put, delete: del } = useApi()

  // Buscar cupons
  const fetchCoupons = async () => {
    try {
      setLoading(true)
      const response = await get<{ success: boolean; data: { coupons: Coupon[] } }>(`/products/${productId}/coupons`)

      if (response.success) {
        setCouponsList(response.data.data.coupons)
        setHasCoupons(response.data.data.coupons.length > 0)
      }
    } catch (error) {
      console.error('Erro ao buscar cupons:', error)
    } finally {
      setLoading(false)
    }
  }

  // Alternar status do cupom
  const toggleCouponStatus = async (couponId: string) => {
    try {
      const currentCoupon = couponsList.find(coupon => coupon.id === couponId)
      if (!currentCoupon) return

      const newStatus = !currentCoupon.isActive

      const response = await put<{ success: boolean }>(`/products/${productId}/coupons/${couponId}`, {
        isActive: newStatus,
      })

      if (response.success) {
        setCouponsList(prevCoupons =>
          prevCoupons.map(coupon =>
            coupon.id === couponId
              ? {
                  ...coupon,
                  isActive: newStatus,
                }
              : coupon,
          ),
        )
      }
    } catch (error) {
      console.error('Erro ao alternar status:', error)
    }
  }

  // Abrir modal de confirmação de delete
  const openDeleteModal = (couponId: string) => {
    setCouponToDelete(couponId)
    setShowDeleteModal(true)
  }

  // Deletar cupom
  const deleteCoupon = async () => {
    if (!couponToDelete) return

    try {
      setDeleteLoading(true)
      const response = await del<{ success: boolean }>(`/products/${productId}/coupons/${couponToDelete}`)

      if (response.success) {
        setCouponsList(prevCoupons => prevCoupons.filter(coupon => coupon.id !== couponToDelete))
        setHasCoupons(couponsList.length > 1)
        setShowDeleteModal(false)
        setCouponToDelete(null)
      }
    } catch (error) {
      console.error('Erro ao deletar cupom:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  // Filtrar cupons por busca
  const filteredCoupons = couponsList.filter(coupon =>
    coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.discountValue.toString().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    if (productId) {
      fetchCoupons()
    }
  }, [productId])

  // Abrir modal de criação
  const openCreateModal = () => {
    setModalMode('create')
    setCouponToEdit(null)
    setIsModalOpen(true)
  }

  // Abrir modal de edição
  const openEditModal = (coupon: Coupon) => {
    setModalMode('edit')
    setCouponToEdit(coupon)
    setIsModalOpen(true)
  }

  // Recarregar após criar/editar cupom
  const handleCouponCreated = () => {
    fetchCoupons()
    setIsModalOpen(false)
  }

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  // Função para formatar o desconto
  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discountType === 'PERCENTAGE') {
      return `${coupon.discountValue}%`
    } else {
      return (coupon.discountValue / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }
  }

  return (
    <>
      {/* Coupons Section */}
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
          Criar novo cupom
        </Button>
      </div>

      {/* Content Area */}
      {loading
        ? (
          <CouponsTableSkeleton />
          )
        : !hasCoupons
            ? (
          /* Empty State */
              <EmptyState
                icon={<TicketIcon size={28} weight="bold" className="text-neutral-400" />}
                title="Você ainda não criou nenhum cupom de desconto"
                description="Crie descontos para aumentar suas vendas."
              />
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
                      {filteredCoupons.map((coupon) => (
                        <tr key={coupon.id} className="border-b last:border-b-0 hover:bg-neutral-50">
                          <td className="py-4 px-6">
                            <span className="font-araboto text-neutral-1000">{coupon.name}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-neutral-500">{coupon.code}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-araboto text-neutral-1000">{formatDiscount(coupon)}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Switch active={coupon.isActive} setValue={() => toggleCouponStatus(coupon.id)} />
                              <span className="text-neutral-500">
                                {coupon.isActive
                                  ? 'Ativo'
                                  : 'Inativo'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              {!coupon.expiresAt
                                ? (
                                  <InfinityIcon size={16} className="text-neutral-500" />
                                  )
                                : (
                                  <CalendarIcon size={16} className="text-neutral-500" />
                                  )}
                              <span className="text-neutral-500">
                                {!coupon.expiresAt
                                  ? ''
                                  : formatDate(coupon.expiresAt)}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <UserIcon size={16} className="text-neutral-500" />
                              <span className="text-neutral-500">
                                {coupon.usageLimit === null || coupon.usageLimit === undefined || coupon.usageLimit === 0
                                  ? <InfinityIcon size={16} className="text-neutral-500" />
                                  : `${coupon.usageCount}/${coupon.usageLimit}`}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                                onClick={() => openEditModal(coupon)}
                              >
                                <PencilIcon size={16} className="text-neutral-600" />
                              </button>
                              <button
                                type="button"
                                className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-red-50 transition-colors"
                                onClick={() => openDeleteModal(coupon.id)}
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

      {/* Coupon Modal */}
      <CouponModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        productId={productId}
        onCouponCreated={handleCouponCreated}
        mode={modalMode}
        couponToEdit={couponToEdit}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Deletar cupom"
        description="Tem certeza que deseja deletar este cupom? Esta ação não pode ser desfeita."
        warningText="O cupom será removido permanentemente e não estará mais disponível para uso."
        confirmText="Deletar"
        onConfirm={deleteCoupon}
        variant="danger"
        loading={deleteLoading}
      />
    </>
  )
}
