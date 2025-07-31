import { useState, useEffect } from 'react'
import { useApi } from './useApi'

interface ProductImage {
  id: string
  fileUrl: string
  fileName: string
}

interface Product {
  id: string
  name: string
  description: string
  type: string
  category: string
  status: string
  currency: string
  defaultImage: ProductImage | null
  createdAt: string
  updatedAt: string
}

interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface UseProductsReturn {
  products: Product[]
  loading: boolean
  error: string | null
  total: number
  page: number
  totalPages: number
  fetchProducts: (page?: number, limit?: number, status?: string) => Promise<void>
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const api = useApi()

  const fetchProducts = async (pageNumber: number = 1, limit: number = 8, status?: string) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: pageNumber.toString(),
        limit: limit.toString(),
      })

      if (status && status !== 'Todos') {
        params.append('status', status)
      }

      const response = await api.get<{ success: boolean; data: ProductsResponse }>(`/products?${params}`)

      if (response.data.success) {
        setProducts(response.data.data.products)
        setTotal(response.data.data.total)
        setPage(response.data.data.page)
        setTotalPages(response.data.data.totalPages)
      } else {
        setError('Erro ao carregar produtos')
      }
    } catch (err) {
      setError('Erro ao carregar produtos')
      console.error('Erro ao buscar produtos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    products,
    loading,
    error,
    total,
    page,
    totalPages,
    fetchProducts,
  }
}
