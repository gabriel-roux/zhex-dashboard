import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth/context'
import { useApi } from './useApi'

export interface LoginSession {
  id: string
  ipAddress: string
  userAgent: string
  deviceType: string
  browser: string
  os: string
  country: string
  city: string
  region: string
  latitude: number
  longitude: number
  isActive: boolean
  lastActivity: string
  loggedOutAt: string | null
  createdAt: string
}

export interface LoginHistoryData {
  sessions: LoginSession[]
}

export function useLoginHistory() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [sessions, setSessions] = useState<LoginSession[]>([])
  const { get, put } = useApi()

  // Carregar histórico de login
  const loadLoginHistory = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const response = await get<{
        success: boolean
        sessions: LoginSession[]
      }>('/users/login-history')

      if (response.data.success) {
        setSessions(response.data.sessions)
      }
    } catch (error) {
      console.error('Erro ao carregar histórico de login:', error)
    } finally {
      setLoading(false)
    }
  }

  // Deslogar uma sessão específica
  const logoutSession = async (sessionId: string) => {
    try {
      const response = await put<{ success: boolean; message: string }>(`/users/sessions/${sessionId}/logout`)

      if (response.data.success) {
        // Atualizar a sessão na lista
        setSessions(prevSessions =>
          prevSessions.map(session =>
            session.id === sessionId
              ? { ...session, isActive: false, loggedOutAt: new Date().toISOString() }
              : session,
          ),
        )
        return { success: true, message: 'Sessão deslogada com sucesso' }
      } else {
        throw new Error(response.data.message || 'Erro ao deslogar sessão')
      }
    } catch (error) {
      console.error('❌ Error in logoutSession:', error)
      return {
        success: false,
        message: error instanceof Error
          ? error.message
          : 'Erro ao deslogar sessão',
      }
    }
  }

  // Deslogar todas as outras sessões (exceto a atual)
  const logoutAllOtherSessions = async () => {
    try {
      const response = await put<{ success: boolean; message: string }>('/users/sessions/logout-all-others')

      if (response.data.success) {
        // Atualizar todas as sessões exceto a atual
        setSessions(prevSessions =>
          prevSessions.map(session => ({
            ...session,
            isActive: false,
            loggedOutAt: new Date().toISOString(),
          })),
        )
        return { success: true, message: 'Todas as outras sessões foram deslogadas' }
      } else {
        throw new Error(response.data.message || 'Erro ao deslogar outras sessões')
      }
    } catch (error) {
      console.error('❌ Error in logoutAllOtherSessions:', error)
      return {
        success: false,
        message: error instanceof Error
          ? error.message
          : 'Erro ao deslogar outras sessões',
      }
    }
  }

  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Formatar localização
  const formatLocation = (session: LoginSession) => {
    const parts = []
    if (session.city) parts.push(session.city)
    if (session.region) parts.push(session.region)
    if (session.country) parts.push(session.country)
    return parts.length > 0
      ? parts.join(', ')
      : 'Localização desconhecida'
  }

  // Formatar dispositivo
  const formatDevice = (session: LoginSession) => {
    const parts = []
    if (session.browser) parts.push(session.browser)
    if (session.os) parts.push(session.os)
    if (session.deviceType) parts.push(session.deviceType)
    return parts.length > 0
      ? parts.join(' • ')
      : 'Dispositivo desconhecido'
  }

  // Verificar se é a sessão atual
  const isCurrentSession = (session: LoginSession) => {
    // Uma sessão é considerada atual se:
    // 1. Está ativa (isActive = true)
    // 2. Não foi deslogada (loggedOutAt = null)
    // 3. Não expirou (lastActivity é recente - dentro de 24h)
    if (!session.isActive || session.loggedOutAt) {
      return false
    }

    const lastActivity = new Date(session.lastActivity)
    const now = new Date()
    const hoursDiff = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60)

    // Considera atual se a última atividade foi nas últimas 24 horas
    return hoursDiff <= 24
  }

  useEffect(() => {
    loadLoginHistory()
  }, [user?.id])

  return {
    sessions,
    loading,
    logoutSession,
    logoutAllOtherSessions,
    formatDate,
    formatLocation,
    formatDevice,
    isCurrentSession,
    refreshHistory: loadLoginHistory,
  }
}
