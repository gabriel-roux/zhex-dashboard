'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/product-card'
import { ProductCardSkeleton } from '@/components/skeletons/product-card-skeleton'
import { SwitchButton } from '@/components/switch-button'
import { TagIcon } from '@phosphor-icons/react'
import { Pagination } from '@/components/pagination'
import { useProducts } from '@/hooks/useProducts'
import Link from 'next/link'

export function ProductList() {
  const [filter, setFilter] = useState<'Todos' | 'Ativo' | 'Inativo'>('Todos')
  const { products, loading, total, page, totalPages, fetchProducts } = useProducts()

  // Buscar produtos quando o filtro mudar
  useEffect(() => {
    const status = filter === 'Todos'
      ? undefined
      : filter
    fetchProducts(1, 8, status)
  }, [filter]) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (newPage: number) => {
    const status = filter === 'Todos'
      ? undefined
      : filter
    fetchProducts(newPage, 8, status)
  }

  const handleFilterChange = (value: string) => {
    setFilter(value as 'Todos' | 'Ativo' | 'Inativo')
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-center justify-between">
        <SwitchButton
          items={['Todos', 'Ativo', 'Inativo']}
          active={filter}
          onChange={handleFilterChange}
        />
      </header>

      {loading
        ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
          )
        : products.length === 0
          ? (
            <div style={{ marginTop: '40px' }} className="w-full bg-white rounded-lg px-5 mb-10 flex flex-col justify-center items-center gap-4">
              <div className="w-12 h-12 bg-zhex-base-500/15 rounded-full flex items-center justify-center">
                <TagIcon
                  size={28}
                  weight="bold"
                  className="text-zhex-base-500"
                />
              </div>

              <div className="text-center">
                <h2 className="text-lg font-araboto font-semibold text-neutral-950">
                  Nenhum produto encontrado
                </h2>
                <p className="text-neutr-500 font-araboto">
                  Nenhum produto encontrado. Crie um produto para começar a vender.
                </p>
              </div>
            </div>
            )
          : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <Link
                  href={`/products/${product.id}/`}
                  key={product.id}
                >
                  <ProductCard
                    product={product}
                  />
                </Link>
              ))}
            </div>
            )}

      {totalPages > 1 && (
        <Pagination
          totalItems={total}
          pageSize={8}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}
