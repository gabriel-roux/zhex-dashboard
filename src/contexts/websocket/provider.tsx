'use client'

import { useEffect, useState, useRef, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import { WebSocketContext, WebSocketContextProps, SupportEmailVerifiedData, EmailChangedData } from './context'
import Cookies from 'js-cookie'

interface WebSocketProviderProps {
  children: ReactNode
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5
  const isRefreshing = useRef(false)
  const failedQueue = useRef<Array<() => void>>([])

  const refreshAccessToken = async (refreshToken: string): Promise<{ accessToken: string } | null> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/auth/refresh`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-host': process.env.NEXT_PUBLIC_FORWADED_HOST || 'http://localhost:3333',
          },
          body: JSON.stringify({ refreshToken }),
        },
      )

      if (!response.ok) {
        throw new Error('Refresh failed')
      }

      const data = await response.json()
      return { accessToken: data.accessToken }
    } catch (error) {
      console.error('Refresh token error:', error)
      return null
    }
  }

  const connect = async (isRetry = false) => {
    if (isConnecting || isConnected) return

    const token = Cookies.get('user-token')
    const refreshToken = Cookies.get('refresh-token')

    if (!token && !refreshToken) {
      setError('Token não encontrado')
      return
    }

    // Se é uma retry e não temos token, tentar refresh
    if (isRetry && !token && refreshToken) {
      if (isRefreshing.current) {
        // Se já está fazendo refresh, adicionar à fila
        return new Promise<void>((resolve) => {
          failedQueue.current.push(resolve)
        })
      }

      isRefreshing.current = true

      try {
        const newTokens = await refreshAccessToken(refreshToken)
        if (newTokens) {
          Cookies.set('user-token', newTokens.accessToken)

          // Processar fila de retry
          failedQueue.current.forEach((resolve) => resolve())
          failedQueue.current = []

          // Tentar conectar novamente com o novo token
          await connect(false)
          return
        }
      } catch {
        // Limpar tokens em caso de falha
        Cookies.remove('user-token')
        Cookies.remove('refresh-token')
        failedQueue.current.forEach((resolve) => resolve())
        failedQueue.current = []
        setError('Falha na autenticação. Faça login novamente.')
        return
      } finally {
        isRefreshing.current = false
      }
    }

    // Se não temos token mesmo após refresh, não conectar
    const currentToken = Cookies.get('user-token')
    if (!currentToken) {
      setError('Token não encontrado')
      return
    }

    setIsConnecting(true)
    setError(null)

    const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
      auth: {
        token: currentToken,
      },
      withCredentials: true,
      transports: ['websocket', 'polling'],
      timeout: 10000,
    })

    newSocket.on('connect', () => {
      console.log('WebSocket connected')
      setIsConnected(true)
      setIsConnecting(false)
      reconnectAttemptsRef.current = 0
      setError(null)
    })

    newSocket.on('disconnect', async (reason) => {
      console.log('WebSocket disconnected:', reason)
      setIsConnected(false)
      setIsConnecting(false)

      // Se foi desconexão por token inválido, tentar refresh
      if (reason === 'io server disconnect' || reason === 'io client disconnect') {
        const refreshToken = Cookies.get('refresh-token')
        if (refreshToken && !isRefreshing.current) {
          isRefreshing.current = true

          try {
            const newTokens = await refreshAccessToken(refreshToken)
            if (newTokens) {
              Cookies.set('user-token', newTokens.accessToken)
              // Reconectar com novo token
              setTimeout(() => connect(false), 1000)
              return
            }
          } catch {
            // Limpar tokens em caso de falha
            Cookies.remove('user-token')
            Cookies.remove('refresh-token')
            setError('Falha na autenticação. Faça login novamente.')
            return
          } finally {
            isRefreshing.current = false
          }
        }
      }

      // Reconexão automática apenas se não foi desconexão manual
      if (reason !== 'io client disconnect' && reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current++
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000) // Exponential backoff

        reconnectTimeoutRef.current = setTimeout(() => {
          console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`)
          connect(true) // Marcar como retry para tentar refresh se necessário
        }, delay)
      } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
        setError('Falha na conexão. Tente recarregar a página.')
      }
    })

    newSocket.on('connect_error', async (err) => {
      console.error('WebSocket connection error:', err)
      setIsConnecting(false)

      // Se o erro for de autenticação, tentar refresh
      if (err.message.includes('unauthorized') || err.message.includes('401')) {
        const refreshToken = Cookies.get('refresh-token')
        if (refreshToken && !isRefreshing.current) {
          isRefreshing.current = true

          try {
            const newTokens = await refreshAccessToken(refreshToken)
            if (newTokens) {
              Cookies.set('user-token', newTokens.accessToken)
              // Tentar conectar novamente com novo token
              setTimeout(() => connect(false), 1000)
              return
            }
          } catch {
            // Limpar tokens em caso de falha
            Cookies.remove('user-token')
            Cookies.remove('refresh-token')
            setError('Falha na autenticação. Faça login novamente.')
            return
          } finally {
            isRefreshing.current = false
          }
        }
      }

      setError('Erro na conexão: ' + err.message)
    })

    newSocket.on('error', (err) => {
      console.error('WebSocket error:', err)
      setError('Erro no WebSocket: ' + err.message)
    })

    setSocket(newSocket)
  }

  const disconnect = () => {
    if (socket) {
      socket.disconnect()
      setSocket(null)
      setIsConnected(false)
      setIsConnecting(false)
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
  }

  const reconnect = () => {
    disconnect()
    reconnectAttemptsRef.current = 0
    setTimeout(() => connect(true), 1000)
  }

  const joinProductRoom = (productId: string) => {
    if (socket && isConnected) {
      socket.emit('join_product_room', productId)
    }
  }

  const leaveProductRoom = (productId: string) => {
    if (socket && isConnected) {
      socket.emit('leave_product_room', productId)
    }
  }

  const joinCompanyRoom = (companyId: string) => {
    if (socket && isConnected) {
      socket.emit('join_company_room', companyId)
    }
  }

  const onSupportEmailVerified = (callback: (data: SupportEmailVerifiedData) => void) => {
    if (socket) {
      socket.on('support_email_verified', callback)
    }
  }

  const onEmailChanged = (callback: (data: EmailChangedData) => void) => {
    if (socket) {
      socket.on('email_changed', callback)
    }
  }

  // Conectar quando o componente montar
  useEffect(() => {
    connect()

    // Cleanup na desmontagem
    return () => {
      disconnect()
    }
  }, [])

  // Reconectar quando o token mudar
  useEffect(() => {
    const token = Cookies.get('user-token')
    if (token && !isConnected && !isConnecting) {
      connect()
    }
  }, [isConnected, isConnecting])

  const contextValue: WebSocketContextProps = {
    socket,
    isConnected,
    isConnecting,
    error,
    joinProductRoom,
    leaveProductRoom,
    joinCompanyRoom,
    onSupportEmailVerified,
    onEmailChanged,
    reconnect,
  }

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  )
}
