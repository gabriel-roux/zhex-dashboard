'use client'

import { Button } from '@/components/button'
import { TextField } from '@/components/textfield'
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, CircuitryIcon, FacebookLogoIcon, GoogleLogoIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Switch } from '@/components/switch'
import { CreatePixelModal } from './create-pixel'

// Dados dos pixels
const pixels = [
  {
    id: 1,
    name: 'Pixel Principal Facebook',
    pixelId: 'FB_123456789012345',
    status: 'active',
    type: 'facebook',
    product: 'Produto Premium',
  },
  {
    id: 2,
    name: 'Pixel Google Analytics',
    pixelId: 'GA_G-XXXXXXXXXX',
    status: 'active',
    type: 'google',
    product: 'Produto Básico',
  },
  {
    id: 3,
    name: 'Pixel Facebook Conversões',
    pixelId: 'FB_987654321098765',
    status: 'inactive',
    type: 'facebook',
    product: 'Produto Premium',
  },
  {
    id: 4,
    name: 'Pixel Google Ads',
    pixelId: 'GA_AW-1234567890',
    status: 'active',
    type: 'google',
    product: 'Produto Básico',
  },
]

export function ProductPixels() {
  const [hasPixels] = useState(true) // Controla se tem pixels ou não
  const [pixelsList, setPixelsList] = useState(pixels) // Estado para controlar os pixels
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false) // Estado para controlar o modal

  // Função para alternar o status de um pixel
  const togglePixelStatus = (pixelId: number) => {
    setPixelsList(prevPixels =>
      prevPixels.map(pixel =>
        pixel.id === pixelId
          ? {
              ...pixel,
              status: pixel.status === 'active'
                ? 'inactive'
                : 'active',
            }
          : pixel,
      ),
    )
  }

  // Função para renderizar o ícone do tipo
  const renderTypeIcon = (type: string) => {
    if (type === 'facebook') {
      return <FacebookLogoIcon size={18} className="text-blue-600 flex-shrink-0" />
    }
    if (type === 'google') {
      return <GoogleLogoIcon size={18} className="text-red-500 flex-shrink-0" />
    }
    return null
  }

  return (
    <>
      {/* Pixels Section */}
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
          Criar novo pixel
        </Button>
      </div>

      {/* Content Area */}
      {!hasPixels
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
                    <th className="py-3 px-6 font-medium font-araboto">Produto</th>
                    <th className="py-3 px-6 font-medium font-araboto">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pixelsList.map((pixel) => (
                    <tr key={pixel.id} className="border-b last:border-b-0 hover:bg-neutral-50">
                      <td className="py-4 px-6">
                        <span className="font-araboto text-neutral-1000">{pixel.name}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-neutral-500 font-mono text-sm">{pixel.pixelId}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Switch active={pixel.status === 'active'} setValue={() => togglePixelStatus(pixel.id)} />
                          <span className="text-neutral-500">
                            {pixel.status === 'active'
                              ? 'Ativo'
                              : 'Inativo'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {renderTypeIcon(pixel.type)}
                          <span className="text-neutral-500 capitalize">
                            {pixel.type === 'facebook'
                              ? 'Facebook'
                              : 'Google'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-neutral-500">{pixel.product}</span>
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

      {/* Create Pixel Modal */}
      <CreatePixelModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </>
  )
}
