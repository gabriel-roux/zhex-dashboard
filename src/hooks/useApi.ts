import { useCallback } from 'react'
import { api } from '@/libs/axios'
import type { ApiResponse } from '@/libs/axios'

interface UseApiReturn {
  get: <T = unknown>(url: string) => Promise<ApiResponse<T>>;
  post: <T = unknown>(url: string, data?: unknown) => Promise<ApiResponse<T>>;
  put: <T = unknown>(url: string, data?: unknown) => Promise<ApiResponse<T>>;
  delete: <T = unknown>(url: string) => Promise<ApiResponse<T>>;
}

export function useApi(): UseApiReturn {
  const get = useCallback(async <T = unknown>(url: string): Promise<ApiResponse<T>> => {
    return api.get<T>(url)
  }, [])

  const post = useCallback(async <T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> => {
    return api.post<T>(url, data)
  }, [])

  const put = useCallback(async <T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> => {
    return api.put<T>(url, data)
  }, [])

  const deleteRequest = useCallback(async <T = unknown>(url: string): Promise<ApiResponse<T>> => {
    return api.delete<T>(url)
  }, [])

  return {
    get,
    post,
    put,
    delete: deleteRequest,
  }
}

// Export types
export type { ApiResponse }
