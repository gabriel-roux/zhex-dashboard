'use client'

import { useMemo } from 'react'
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'

interface PaginationProps {
  totalItems: number
  pageSize: number
  currentPage: number
  onPageChange: (page: number) => void
}

export function Pagination({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize)

  const pages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }, [totalPages])

  const start = (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="flex items-center justify-between py-4">
      {/* Range Indicator */}
      <span className="text-sm text-neutral-500">
        {start}–{end}{' '}
        <span className="text-black font-medium">de {totalItems}</span>
      </span>

      {/* Page Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2.5 rounded-md border border-neutral-200 hover:bg-neutral-100 disabled:opacity-50"
        >
          <CaretLeftIcon size={20} />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-[42px] h-[42px] rounded-md flex items-center justify-center ${
              page === currentPage
                ? 'bg-zhex-base-500 text-white'
                : 'text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2.5 rounded-md border border-neutral-200 hover:bg-neutral-100 disabled:opacity-50"
        >
          <CaretRightIcon size={20} />
        </button>
      </div>
    </div>
  )
}
