'use client'

import { Button } from '@/components/button'
import { TextField } from '@/components/textfield'
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, CircuitryIcon, FacebookLogoIcon, GoogleLogoIcon } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'
import { Switch } from '@/components/switch'
import { PixelModal } from './create-pixel'
import { useApi } from '@/hooks/useApi'
import { ConfirmationModal } from '@/components/confirmation-modal'
import { Pixel } from '@/@types/pixel'
import { PixelsTableSkeleton } from '@/components/skeletons/pixels-table-skeleton'

interface ProductPixelsProps {
  productId: string
}

export function ProductPixels({ productId }: ProductPixelsProps) {
  const [hasPixels, setHasPixels] = useState(false)
  const [pixelsList, setPixelsList] = useState<Pixel[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [pixelToEdit, setPixelToEdit] = useState<Pixel | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [pixelToDelete, setPixelToDelete] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const { get, put, delete: del } = useApi()

  // Buscar pixels da API
  const fetchPixels = async () => {
    try {
      setLoading(true)
      const response = await get<{ success: boolean; data: { pixels: Pixel[] } }>(`/products/${productId}/pixels`)

      if (response.success) {
        setPixelsList(response.data.data.pixels)
        setHasPixels(response.data.data.pixels.length > 0)
      }
    } catch (error) {
      console.error('Erro ao buscar pixels:', error)
    } finally {
      setLoading(false)
    }
  }

  // Alternar status do pixel
  const togglePixelStatus = async (pixelId: string, currentStatus: boolean) => {
    try {
      const response = await put<{ success: boolean }>(`/products/${productId}/pixels/${pixelId}`, {
        isActive: !currentStatus,
      })
      if (response.success) {
        fetchPixels()
      }
    } catch (error) {
      console.error('Erro ao alternar status do pixel:', error)
    }
  }

  // Abrir modal de criação
  const openCreateModal = () => {
    setModalMode('create')
    setPixelToEdit(null)
    setIsModalOpen(true)
  }

  // Abrir modal de edição
  const openEditModal = (pixel: Pixel) => {
    setModalMode('edit')
    setPixelToEdit(pixel)
    setIsModalOpen(true)
  }

  // Abrir modal de exclusão
  const openDeleteModal = (pixelId: string) => {
    setPixelToDelete(pixelId)
    setShowDeleteModal(true)
  }

  // Excluir pixel
  const deletePixel = async () => {
    if (!pixelToDelete) return

    try {
      setDeleteLoading(true)
      const response = await del<{ success: boolean }>(`/products/${productId}/pixels/${pixelToDelete}`)
      if (response.success) {
        fetchPixels()
        setShowDeleteModal(false)
        setPixelToDelete(null)
      }
    } catch (error) {
      console.error('Erro ao excluir pixel:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  // Recarregar após criar/editar pixel
  const handlePixelCreated = () => {
    fetchPixels()
    setIsModalOpen(false)
  }

  // Filtrar pixels por busca
  const filteredPixels = pixelsList.filter(pixel =>
    pixel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pixel.pixelId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pixel.pixelType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Buscar pixels quando o productId mudar
  useEffect(() => {
    if (productId) {
      fetchPixels()
    }
  }, [productId])

  // Função para renderizar o ícone do tipo
  const renderTypeIcon = (type: string) => {
    if (type === 'FACEBOOK') {
      return <FacebookLogoIcon size={18} className="text-blue-600 flex-shrink-0" />
    }
    if (type === 'GOOGLE_ANALYTICS' || type === 'GOOGLE_TAG_MANAGER') {
      return <GoogleLogoIcon size={18} className="text-red-500 flex-shrink-0" />
    }
    return null
  }

  // Função para formatar o tipo de pixel
  const formatPixelType = (type: string) => {
    switch (type) {
      case 'FACEBOOK':
        return 'Facebook'
      case 'GOOGLE_ANALYTICS':
        return 'Google Analytics'
      case 'GOOGLE_TAG_MANAGER':
        return 'Google Tag Manager'
      case 'TIKTOK':
        return 'TikTok'
      default:
        return type
    }
  }

  return (
    <>
      {/* Pixels Section */}
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
          Criar novo pixel
        </Button>
      </div>

      {/* Content Area */}
      {loading
        ? (
          <PixelsTableSkeleton />
          )
        : !hasPixels
            ? (
          /* Empty State */
              <div className="flex flex-col items-center justify-center py-10">
                <CircuitryIcon size={32} weight="bold" className="text-neutral-400 mb-4" />
                <h3 className="text-lg font-araboto font-medium text-neutral-1000 mb-1">
                  Você ainda não configurou nenhum pixel
                </h3>
                <p className="text-neutral-600 text-center max-w-md">
                  Configure pixels para rastrear conversões e otimizar suas campanhas.
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
                        <th className="py-3 px-6 font-medium font-araboto">Pixel ID</th>
                        <th className="py-3 px-6 font-medium font-araboto">Status</th>
                        <th className="py-3 px-6 font-medium font-araboto">Tipo</th>
                        <th className="py-3 px-6 font-medium font-araboto">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPixels.map((pixel) => (
                        <tr key={pixel.id} className="border-b last:border-b-0 hover:bg-neutral-50">
                          <td className="py-4 px-6">
                            <span className="font-araboto text-neutral-1000">{pixel.name}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-neutral-500 font-mono text-sm">{pixel.pixelId}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Switch
                                active={pixel.isActive}
                                setValue={() => togglePixelStatus(pixel.id, pixel.isActive)}
                              />
                              <span className="text-neutral-500">
                                {pixel.isActive
                                  ? 'Ativo'
                                  : 'Inativo'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              {renderTypeIcon(pixel.pixelType)}
                              <span className="text-neutral-500">
                                {formatPixelType(pixel.pixelType)}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                                onClick={() => openEditModal(pixel)}
                              >
                                <PencilIcon size={16} className="text-neutral-600" />
                              </button>
                              <button
                                type="button"
                                className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-red-50 transition-colors"
                                onClick={() => openDeleteModal(pixel.id)}
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

      {/* Pixel Modal */}
      <PixelModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        productId={productId}
        onPixelCreated={handlePixelCreated}
        mode={modalMode}
        pixelToEdit={pixelToEdit}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Deletar pixel"
        description="Tem certeza que deseja deletar este pixel? Esta ação não pode ser desfeita."
        warningText="O pixel será removido permanentemente e não estará mais disponível para uso."
        confirmText="Deletar"
        onConfirm={deletePixel}
        variant="danger"
        loading={deleteLoading}
      />
    </>
  )
}
