'use client'

import { Button } from '@/components/button'
import { TextField } from '@/components/textfield'
import { MagnifyingGlassIcon, LinkIcon, PencilIcon, TrashIcon, CopyIcon, BrowserIcon } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'
import { PaymentLinkModal } from './create-link'
import { Switch } from '@/components/switch'
import { useApi } from '@/hooks/useApi'
import { motion } from 'framer-motion'
import { ConfirmationModal } from '@/components/confirmation-modal'
import { PaymentLink } from '@/@types/payment-link'
import { PaymentLinksTableSkeleton } from '@/components/skeletons/payment-links-table-skeleton'
import { ProductType } from '@/@types/product'

interface Checkout {
  id: string
  name: string
  isActive: boolean
}

interface PaymentLinksProps {
  productId: string
  productType: ProductType
}

export function PaymentLinks({ productId, productType }: PaymentLinksProps) {
  const [hasLinks, setHasLinks] = useState(false)
  const [links, setLinks] = useState<PaymentLink[]>([])
  const [checkouts, setCheckouts] = useState<Checkout[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [linkToEdit, setLinkToEdit] = useState<PaymentLink | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const { get, put, delete: del } = useApi()

  // Buscar payment links
  const fetchPaymentLinks = async () => {
    try {
      setLoading(true)
      const response = await get<{ success: boolean; data: { paymentLinks: PaymentLink[]; availableCheckouts: Checkout[] } }>(`/products/${productId}/payment-links`)

      if (response.success) {
        setLinks(response.data.data.paymentLinks)
        setCheckouts(response.data.data.availableCheckouts)
        setHasLinks(response.data.data.paymentLinks.length > 0)
      }
    } catch (error) {
      console.error('Erro ao buscar payment links:', error)
    } finally {
      setLoading(false)
    }
  }

  // Alternar status do link
  const toggleLinkStatus = async (linkId: string) => {
    try {
      const currentLink = links.find(link => link.id === linkId)
      if (!currentLink) return

      const newStatus = !currentLink.isActive

      const response = await put<{ success: boolean }>(`/products/${productId}/payment-links/${linkId}`, {
        isActive: newStatus,
      })

      if (response.success) {
        setLinks(prevLinks =>
          prevLinks.map(link =>
            link.id === linkId
              ? {
                  ...link,
                  isActive: newStatus,
                }
              : link,
          ),
        )
      }
    } catch (error) {
      console.error('Erro ao alternar status:', error)
    }
  }

  // Abrir modal de confirmação de delete
  const openDeleteModal = (linkId: string) => {
    setLinkToDelete(linkId)
    setShowDeleteModal(true)
  }

  // Deletar link
  const deleteLink = async () => {
    if (!linkToDelete) return

    try {
      setDeleteLoading(true)
      const response = await del<{ success: boolean }>(`/products/${productId}/payment-links/${linkToDelete}`)

      if (response.success) {
        setLinks(prevLinks => prevLinks.filter(link => link.id !== linkToDelete))
        setHasLinks(links.length > 1)
        setShowDeleteModal(false)
        setLinkToDelete(null)
      }
    } catch (error) {
      console.error('Erro ao deletar link:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  // Copiar URL
  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      // TODO: Adicionar toast de sucesso
      console.log('URL copiada com sucesso!')
    } catch (error) {
      console.error('Erro ao copiar URL:', error)
    }
  }

  // Filtrar links por busca
  const filteredLinks = links.filter(link =>
    link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.checkout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.accessUrl.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    if (productId) {
      fetchPaymentLinks()
    }
  }, [productId])

  // Abrir modal de criação
  const openCreateModal = () => {
    setModalMode('create')
    setLinkToEdit(null)
    setIsModalOpen(true)
  }

  // Abrir modal de edição
  const openEditModal = (link: PaymentLink) => {
    setModalMode('edit')
    setLinkToEdit(link)
    setIsModalOpen(true)
  }

  // Recarregar após criar/editar link
  const handleLinkCreated = () => {
    fetchPaymentLinks()
    setIsModalOpen(false)
  }

  return (
    <>
      {/* Payment Links Section */}
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
          Criar novo link
        </Button>
      </div>

      {/* Content Area */}
      {loading
        ? (
          <PaymentLinksTableSkeleton />
          )
        : !hasLinks
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
                      {filteredLinks.map((link) => (
                        <tr key={link.id} className="border-b last:border-b-0 hover:bg-neutral-50">
                          <td className="py-4 px-6">
                            <span className="font-araboto text-neutral-1000">{link.name}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <BrowserIcon size={20} weight="bold" className="text-neutral-500" />
                              <span className="text-neutral-500">{link.checkout.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-araboto text-neutral-1000">
                              {link.isFreeOffer
                                ? 'Gratuito'
                                : `${(link.price.baseAmount / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} ${productType === ProductType.RECURRING
? ` / ${link?.subscription?.billingInterval || ''}`
: ''}`}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Switch active={link.isActive} setValue={() => toggleLinkStatus(link.id)} />
                              <span className="text-neutral-500">
                                {link.isActive
                                  ? 'Ativo'
                                  : 'Inativo'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="w-[155px] flex items-center justify-between gap-2 bg-zhex-base-500/10 rounded-lg px-3 py-1 group relative overflow-hidden hover:bg-zhex-base-500/15 transition-colors duration-200">
                              <div className="overflow-hidden flex-1 relative">
                                {/* Gradiente da esquerda */}
                                <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-zhex-base-500/10 via-zhex-base-500/5 to-transparent z-10 pointer-events-none" />

                                {/* Gradiente da direita */}
                                <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-zhex-base-500/10 via-zhex-base-500/5 to-transparent z-10 pointer-events-none" />
                                <motion.span
                                  className="text-neutral-500 text-sm whitespace-nowrap block"
                                  initial={{ x: 0 }}
                                  whileHover={{
                                    x: [0, -Math.min(link.accessUrl.length * 4, 120)],
                                    transition: {
                                      duration: Math.max(link.accessUrl.length * 0.08, 1.2),
                                      ease: 'easeInOut',
                                      repeat: Infinity,
                                      repeatType: 'reverse',
                                      repeatDelay: 0.5,
                                    },
                                  }}
                                >
                                  {link.accessUrl}
                                </motion.span>
                              </div>
                              <button
                                type="button"
                                className="text-zhex-base-500 hover:text-zhex-base-600 flex-shrink-0 relative z-20 transition-all duration-200 hover:scale-110"
                                onClick={() => copyUrl(link.accessUrl)}
                              >
                                <CopyIcon size={16} />
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                                onClick={() => openEditModal(link)}
                              >
                                <PencilIcon size={16} className="text-neutral-600" />
                              </button>
                              <button
                                type="button"
                                className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-red-50 transition-colors"
                                onClick={() => openDeleteModal(link.id)}
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

      {/* Payment Link Modal */}
      <PaymentLinkModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        productId={productId}
        checkouts={checkouts}
        onLinkCreated={handleLinkCreated}
        mode={modalMode}
        productType={productType}
        linkToEdit={linkToEdit}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Deletar link de pagamento"
        description="Tem certeza que deseja deletar este link de pagamento? Esta ação não pode ser desfeita."
        warningText="O link será removido permanentemente e não estará mais disponível para uso."
        confirmText="Deletar"
        onConfirm={deleteLink}
        variant="danger"
        loading={deleteLoading}
      />
    </>
  )
}
