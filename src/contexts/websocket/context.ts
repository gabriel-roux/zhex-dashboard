import { createContext, useContext } from 'react'
import { Socket } from 'socket.io-client'

export interface WebSocketContextProps {
  socket: Socket | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  joinProductRoom: (productId: string) => void
  leaveProductRoom: (productId: string) => void
  joinCompanyRoom: (companyId: string) => void
  onSupportEmailVerified: (callback: (data: SupportEmailVerifiedData) => void) => void
  onEmailChanged: (callback: (data: EmailChangedData) => void) => void
  reconnect: () => void
}

export interface SupportEmailVerifiedData {
  productId: string
  supportEmail: string
  verifiedAt: string
}

export interface EmailChangedData {
  userId: string
  oldEmail: string
  newEmail: string
  changedAt: string
}

export const WebSocketContext = createContext<WebSocketContextProps | null>(null)

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider')
  }
  return context
}
