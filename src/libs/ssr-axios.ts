import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { cookies } from 'next/headers'

interface RequestOptions {
  body?: unknown;
  headers?: Record<string, string>;
  [key: string]: unknown;
}

interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
}

class SSRApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-host': process.env.NEXT_PUBLIC_FORWADED_HOST as string,
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // For SSR, we don't handle token refresh
          // Just throw the error and let the client handle it
          throw new Error('Unauthorized - please login again')
        }
        return Promise.reject(error)
      },
    )
  }

  private async getToken(): Promise<string | undefined> {
    try {
      const cookieStore = await cookies()
      return cookieStore.get('user-token')?.value
    } catch {
      // If cookies() fails (e.g., not in SSR context), return undefined
      return undefined
    }
  }

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.get(url, config)
      return {
        data: response.data,
        success: true,
      }
    } catch (error: unknown) {
      throw this.handleError(error)
    }
  }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.post(url, data, config)
      return {
        data: response.data,
        success: true,
      }
    } catch (error: unknown) {
      throw this.handleError(error)
    }
  }

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.put(url, data, config)
      return {
        data: response.data,
        success: true,
      }
    } catch (error: unknown) {
      throw this.handleError(error)
    }
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.delete(url, config)
      return {
        data: response.data,
        success: true,
      }
    } catch (error: unknown) {
      throw this.handleError(error)
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        const message = error.response.data?.message || error.response.statusText
        return new Error(message)
      } else if (error.request) {
        // Request was made but no response received
        return new Error('Network error - no response received')
      }
    }

    // Something else happened
    return new Error(error instanceof Error
      ? error.message
      : 'An unexpected error occurred')
  }
}

// Create singleton instance
const ssrApiClient = new SSRApiClient()

// Export the instance and methods
export default ssrApiClient

// Export convenience methods
export const ssrApi = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) => ssrApiClient.get<T>(url, config),
  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => ssrApiClient.post<T>(url, data, config),
  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => ssrApiClient.put<T>(url, data, config),
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) => ssrApiClient.delete<T>(url, config),
}

// Export types
export type { ApiResponse, RequestOptions }
