'use client'

import { Button } from '@/components/button'
import { TextField } from '@/components/textfield'
import { MagnifyingGlassIcon, MonitorIcon, SignOutIcon, MapPinIcon, GlobeIcon, DeviceMobileIcon, DeviceTabletIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { useLoginHistory, LoginSession } from '@/hooks/useLoginHistory'
import { ConfirmationModal } from '@/components/confirmation-modal'
import { LoginHistorySkeleton } from '@/components/skeletons/login-history-skeleton'

export function LoginHistory() {
  const {
    sessions,
    loading,
    logoutSession,
    logoutAllOtherSessions,
    formatDate,
    formatLocation,
    formatDevice,
    isCurrentSession,
  } = useLoginHistory()

  const [searchTerm, setSearchTerm] = useState('')
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showLogoutAllModal, setShowLogoutAllModal] = useState(false)
  const [sessionToLogout, setSessionToLogout] = useState<LoginSession | null>(null)
  const [logoutLoading, setLogoutLoading] = useState(false)

  // Filtrar sessões por busca
  const filteredSessions = sessions.filter(session =>
    formatLocation(session).toLowerCase().includes(searchTerm.toLowerCase()) ||
    formatDevice(session).toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.browser.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.os.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Abrir modal de logout de sessão específica
  const openLogoutModal = (session: LoginSession) => {
    setSessionToLogout(session)
    setShowLogoutModal(true)
  }

  // Abrir modal de logout de todas as outras sessões
  const openLogoutAllModal = () => {
    setShowLogoutAllModal(true)
  }

  // Executar logout de sessão específica
  const handleLogoutSession = async () => {
    if (!sessionToLogout) return

    try {
      setLogoutLoading(true)
      const result = await logoutSession(sessionToLogout.id)

      if (result.success) {
        setShowLogoutModal(false)
        setSessionToLogout(null)
        alert('✅ Sessão deslogada com sucesso!')
      } else {
        alert(`❌ Erro ao deslogar sessão: ${result.message}`)
        console.error('Erro ao deslogar sessão:', result.message)
      }
    } catch (error) {
      alert('❌ Erro inesperado ao deslogar sessão')
      console.error('Erro ao deslogar sessão:', error)
    } finally {
      setLogoutLoading(false)
    }
  }

  // Executar logout de todas as outras sessões
  const handleLogoutAllOtherSessions = async () => {
    try {
      setLogoutLoading(true)
      const result = await logoutAllOtherSessions()

      if (result.success) {
        setShowLogoutAllModal(false)
        alert('✅ Todas as outras sessões foram deslogadas!')
      } else {
        alert(`❌ Erro ao deslogar outras sessões: ${result.message}`)
        console.error('Erro ao deslogar outras sessões:', result.message)
      }
    } catch (error) {
      alert('❌ Erro inesperado ao deslogar outras sessões')
      console.error('Erro ao deslogar outras sessões:', error)
    } finally {
      setLogoutLoading(false)
    }
  }

  // Obter ícone do dispositivo
  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return <DeviceMobileIcon size={20} weight="bold" className="text-neutral-500" />
      case 'tablet':
        return <DeviceTabletIcon size={20} weight="bold" className="text-neutral-500" />
      case 'desktop':
      default:
        return <MonitorIcon size={20} weight="bold" className="text-neutral-500" />
    }
  }

  // Obter status da sessão
  const getSessionStatus = (session: LoginSession) => {
    if (session.loggedOutAt) {
      return { text: 'Deslogado', color: 'text-neutral-500', bgColor: 'bg-neutral-100' }
    }
    if (isCurrentSession(session)) {
      return { text: 'Sessão Atual', color: 'text-green-600', bgColor: 'bg-green-100' }
    }
    return { text: 'Ativo', color: 'text-blue-600', bgColor: 'bg-blue-100' }
  }

  return (
    <>
      {/* Header Section */}
      <div className="w-full flex justify-end items-center gap-4 mt-10 mb-6">
        <div className="w-full max-w-[340px]">
          <TextField
            leftIcon={<MagnifyingGlassIcon size={20} weight="bold" />}
            placeholder="Buscar por localização, dispositivo ou IP"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-[1px] h-10 bg-neutral-200" />
        <Button
          variant="ghost"
          size="medium"
          type="button"
          onClick={openLogoutAllModal}
          disabled={sessions.filter(s => !isCurrentSession(s) && !s.loggedOutAt).length === 0}
        >
          Deslogar outras sessões
        </Button>
      </div>

      {/* Content Area */}
      {loading
        ? (
          <LoginHistorySkeleton />
          )
        : sessions.length === 0
          ? (
        /* Empty State */
            <div className="flex flex-col items-center justify-center py-10">
              <GlobeIcon size={32} weight="bold" className="text-neutral-400 mb-4" />
              <h3 className="text-lg font-araboto font-medium text-neutral-1000 mb-1">
                Nenhuma sessão encontrada
              </h3>
              <p className="text-neutral-600 text-center max-w-md">
                Seu histórico de login aparecerá aqui quando você fizer login em diferentes dispositivos.
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
                      <th className="py-3 px-6 font-medium font-araboto">Dispositivo</th>
                      <th className="py-3 px-6 font-medium font-araboto">Localização</th>
                      <th className="py-3 px-6 font-medium font-araboto">IP</th>
                      <th className="py-3 px-6 font-medium font-araboto">Status</th>
                      <th className="py-3 px-6 font-medium font-araboto">Última Atividade</th>
                      <th className="py-3 px-6 font-medium font-araboto">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSessions.map((session) => {
                      const status = getSessionStatus(session)
                      return (
                        <tr
                          key={session.id} className="border-b last:border-b-0 hover:bg-neutral-50"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {getDeviceIcon(session.deviceType)}
                              <div className="flex flex-col">
                                <span className="font-araboto text-neutral-1000">{formatDevice(session)}</span>
                                <span className="text-sm text-neutral-500">{session.userAgent.substring(0, 50)}...</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <MapPinIcon size={16} className="text-neutral-500" />
                              <span className="text-neutral-500">{formatLocation(session)}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-mono text-sm text-neutral-600">{session.ipAddress}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                              {status.text}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-neutral-500 text-sm">
                              {formatDate(session.lastActivity)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              {!isCurrentSession(session) && !session.loggedOutAt && (
                                <button
                                  type="button"
                                  className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-red-50 transition-colors"
                                  onClick={() => openLogoutModal(session)}
                                  title="Deslogar esta sessão"
                                >
                                  <SignOutIcon size={16} className="text-red-500" />
                                </button>
                              )}
                              {session.loggedOutAt && (
                                <span className="text-xs text-neutral-400">
                                  Deslogado em {formatDate(session.loggedOutAt)}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            )}

      {/* Logout Session Modal */}
      <ConfirmationModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        title="Deslogar sessão"
        description="Tem certeza que deseja deslogar esta sessão?"
        warningText={`Dispositivo: ${sessionToLogout
? formatDevice(sessionToLogout)
: ''}\nLocalização: ${sessionToLogout
? formatLocation(sessionToLogout)
: ''}`}
        confirmText="Deslogar"
        onConfirm={handleLogoutSession}
        variant="danger"
        loading={logoutLoading}
      />

      {/* Logout All Other Sessions Modal */}
      <ConfirmationModal
        open={showLogoutAllModal}
        onOpenChange={setShowLogoutAllModal}
        title="Deslogar outras sessões"
        description="Tem certeza que deseja deslogar todas as outras sessões ativas?"
        warningText="Você será deslogado de todos os outros dispositivos, mantendo apenas a sessão atual."
        confirmText="Deslogar todas"
        onConfirm={handleLogoutAllOtherSessions}
        variant="danger"
        loading={logoutLoading}
      />
    </>
  )
}
