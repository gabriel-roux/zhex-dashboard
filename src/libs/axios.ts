'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import Cookies from 'js-cookie'

interface RequestOptions {
  body?: any;
  headers?: Record<string, string>;
  [key: string]: any;
}

interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

class ApiClient {
  private client: AxiosInstance
  private isRefreshing = false
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = []

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-host': process.env.NEXT_PUBLIC_FORWADED_HOST || 'http://localhost:3333',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject })
            }).then(() => {
              return this.client(originalRequest)
            })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            const refreshToken = this.getRefreshToken()
            if (refreshToken) {
              const newTokens = await this.refreshAccessToken(refreshToken)
              if (newTokens) {
                this.setToken(newTokens.accessToken)

                // Retry queued requests
                this.failedQueue.forEach(({ resolve }) => {
                  resolve(undefined)
                })
                this.failedQueue = []

                return this.client(originalRequest)
              }
            }
          } catch (refreshError) {
            // Clear tokens on refresh failure
            this.clearTokens()
            this.failedQueue.forEach(({ reject }) => {
              reject(refreshError)
            })
            this.failedQueue = []
          } finally {
            this.isRefreshing = false
          }
        }

        return Promise.reject(error)
      },
    )
  }

  private getToken(): string | undefined {
    if (typeof window !== 'undefined') {
      return Cookies.get('user-token')
    }
    // For SSR, you might need to implement a different approach
    return undefined
  }

  private getRefreshToken(): string | undefined {
    if (typeof window !== 'undefined') {
      return Cookies.get('refresh-token')
    }
    return undefined
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      Cookies.set('user-token', token)
    }
  }

  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      Cookies.remove('user-token')
      Cookies.remove('refresh-token')
    }
  }

  private async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string } | null> {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/auth/refresh`,
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-host': process.env.NEXT_PUBLIC_FORWADED_HOST || 'http://localhost:3333',
          },
        },
      )

      const { accessToken } = response.data
      return { accessToken }
    } catch (error) {
      console.error('Refresh token error:', error)
      return null
    }
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.get(url, config)
      return {
        data: response.data,
        success: true,
      }
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.post(url, data, config)
      return {
        data: response.data,
        success: true,
      }
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.put(url, data, config)
      return {
        data: response.data,
        success: true,
      }
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.delete(url, config)
      return {
        data: response.data,
        success: true,
      }
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.statusText
      return new Error(message)
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network error - no response received')
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred')
    }
  }
}

// Create singleton instance
const apiClient = new ApiClient()

// Export the instance and methods
export default apiClient

// Export convenience methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => apiClient.get<T>(url, config),
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.post<T>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.put<T>(url, data, config),
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => apiClient.delete<T>(url, config),
}

// Export types
export type { ApiResponse, RequestOptions }
