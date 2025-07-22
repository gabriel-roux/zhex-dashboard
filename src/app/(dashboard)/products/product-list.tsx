'use client'

import { useState } from 'react'
import { ProductCard } from '@/components/product-card'
import { SwitchButton } from '@/components/switch-button'
import { FunnelSimpleIcon } from '@phosphor-icons/react'
import { Pagination } from '@/components/pagination'
import Link from 'next/link'

const mockProducts = Array.from({ length: 12 }).map((_, idx) => ({
  id: idx,
  status: idx % 2 === 0
    ? 'Ativo'
    : 'Inativo', // alterna status só para exemplo
}))

export function ProductList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState<'Todos' | 'Ativo' | 'Inativo'>('Todos')
  const pageSize = 8

  // Filtra produtos conforme o filtro selecionado
  const filteredProducts =
    filter === 'Todos'
      ? mockProducts
      : mockProducts.filter((p) => p.status === filter)

  const totalItems = filteredProducts.length
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-center justify-between">
        <SwitchButton
          items={['Todos', 'Ativo', 'Inativo']}
          active={filter}
          onChange={(value) => setFilter(value as 'Todos' | 'Ativo' | 'Inativo')}
        />

        <div className="flex items-center gap-2">
          <button className="w-12 h-12 rounded-lg border text-neutral-500 border-neutral-200 hover:bg-neutral-100 transition-colors flex items-center justify-center bg-white">
            <FunnelSimpleIcon size={20} weight="bold" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {paginatedProducts.map((product) => (
          <Link
            href={`/products/${product.id}/`}
            key={product.id}
          >
            <ProductCard />
          </Link>
        ))}
      </div>

      <Pagination
        totalItems={totalItems}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
