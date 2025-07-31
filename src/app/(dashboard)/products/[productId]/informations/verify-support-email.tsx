'use client'

import { useState, useEffect, useRef } from 'react'
import { CheckCircleIcon, WarningCircleIcon, ClockIcon } from '@phosphor-icons/react'
import { useWebSocket } from '@/contexts/websocket/context'
import { useApi } from '@/hooks/useApi'

interface VerifySupportEmailProps {
  productId: string
  supportEmail: string
  isVerified: boolean
  onVerificationChange: (verified: boolean) => void
}

type EmailStatus = 'idle' | 'sending' | 'sent' | 'verified' | 'error'

export function VerifySupportEmail({
  productId,
  supportEmail,
  isVerified,
  onVerificationChange,
}: VerifySupportEmailProps) {
  const [status, setStatus] = useState<EmailStatus>(isVerified
    ? 'verified'
    : 'idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [originalEmail, setOriginalEmail] = useState<string>('')
  const { joinProductRoom, onSupportEmailVerified, isConnected } = useWebSocket()
  const api = useApi()
  const initialEmailRef = useRef<string>('')

  // Definir email original quando componente montar
  useEffect(() => {
    if (initialEmailRef.current === '' && supportEmail) {
      initialEmailRef.current = supportEmail
      setOriginalEmail(supportEmail)
    }
  }, [supportEmail])

  // Verificar se o email mudou
  const hasEmailChanged = supportEmail !== originalEmail && originalEmail !== ''

  // Resetar verificação se email mudou
  useEffect(() => {
    if (hasEmailChanged && isVerified) {
      setStatus('idle')
      onVerificationChange(false)
    }
  }, [hasEmailChanged, isVerified, onVerificationChange])

  // Entrar no room do produto quando conectar
  useEffect(() => {
    if (isConnected && productId) {
      joinProductRoom(productId)
    }
  }, [isConnected, productId, joinProductRoom])

  // Escutar evento de email verificado
  useEffect(() => {
    const handleEmailVerified = (data: { productId: string; supportEmail: string }) => {
      if (data.productId === productId && data.supportEmail === supportEmail) {
        setStatus('verified')
        onVerificationChange(true)
        setErrorMessage('')
        // Atualizar email original para o atual
        setOriginalEmail(supportEmail)
        initialEmailRef.current = supportEmail
      }
    }

    onSupportEmailVerified(handleEmailVerified)

    return () => {
      // Cleanup do listener será feito automaticamente pelo socket
    }
  }, [productId, supportEmail, onSupportEmailVerified, onVerificationChange])

  const handleSendVerification = async () => {
    if (!supportEmail) {
      setErrorMessage('Por favor, insira um email de suporte primeiro')
      return
    }

    // Se já está verificado e não mudou, não permitir reenvio
    if (isVerified && !hasEmailChanged) {
      return
    }

    setStatus('sending')
    setErrorMessage('')

    try {
      const response = await api.post<{ success: boolean; message: string }>(`/products/${productId}/verify-support-email`, {
        supportEmail,
      })

      if (response.data.success) {
        setStatus('sent')
        // Aguardar confirmação via WebSocket
        setTimeout(() => {
          if (status !== 'verified') {
            setStatus('idle')
            setErrorMessage('Email enviado, mas verificação pendente. Verifique sua caixa de entrada.')
          }
        }, 30000) // 30 segundos de timeout
      } else {
        setStatus('error')
        setErrorMessage(response.data.message || 'Erro ao enviar email de verificação')
      }
    } catch (error) {
      console.error('Erro ao enviar verificação:', error)
      setStatus('error')
      setErrorMessage('Erro ao enviar email de verificação. Tente novamente.')
    }
  }

  const getStatusConfig = () => {
    // Se está verificado e não mudou, mostrar como verificado
    if (isVerified && !hasEmailChanged) {
      return {
        icon: <CheckCircleIcon size={16} className="text-green-secondary-500" />,
        text: 'Email verificado com sucesso!',
        buttonText: 'Verificado',
        buttonColor: 'text-green-secondary-500 cursor-default',
        disabled: true,
      }
    }

    // Se está verificado mas mudou, permitir reenvio
    if (isVerified && hasEmailChanged) {
      return {
        icon: <WarningCircleIcon size={16} className="text-yellow-secondary-500" />,
        text: 'Email alterado. Necessária nova verificação.',
        buttonText: 'Clique para verificar',
        buttonColor: 'text-yellow-secondary-500 hover:text-yellow-secondary-600',
        disabled: false,
      }
    }

    switch (status) {
      case 'idle':
        return {
          icon: <CheckCircleIcon size={16} className="text-zhex-base-500" />,
          text: 'Necessária a verificação do e-mail.',
          buttonText: 'Clique para verificar',
          buttonColor: 'text-zhex-base-500 hover:text-zhex-base-600',
          disabled: false,
        }
      case 'sending':
        return {
          icon: <ClockIcon size={16} className="text-yellow-secondary-500 animate-spin" />,
          text: 'Enviando email de verificação...',
          buttonText: 'Enviando...',
          buttonColor: 'text-yellow-secondary-500 cursor-not-allowed',
          disabled: true,
        }
      case 'sent':
        return {
          icon: <ClockIcon size={16} className="text-zhex-base-500" />,
          text: 'Email enviado! Aguardando verificação...',
          buttonText: 'Reenviar',
          buttonColor: 'text-zhex-base-500 hover:text-zhex-base-600',
          disabled: false,
        }
      case 'verified':
        return {
          icon: <CheckCircleIcon size={16} className="text-green-secondary-500" />,
          text: 'Email verificado com sucesso!',
          buttonText: 'Verificado',
          buttonColor: 'text-green-secondary-500 cursor-default',
          disabled: true,
        }
      case 'error':
        return {
          icon: <WarningCircleIcon size={16} className="text-red-secondary-500" />,
          text: errorMessage,
          buttonText: 'Tentar novamente',
          buttonColor: 'text-red-secondary-500 hover:text-red-secondary-600',
          disabled: false,
        }
      default:
        return {
          icon: <CheckCircleIcon size={16} className="text-zhex-base-500" />,
          text: 'Necessária a verificação do e-mail.',
          buttonText: 'Clique para verificar',
          buttonColor: 'text-zhex-base-500 hover:text-zhex-base-600',
          disabled: false,
        }
    }
  }

  const statusConfig = getStatusConfig()

  return (
    <div className="flex flex-col gap-2">
      <span className="text-neutral-600 text-xs mt-1 flex items-center gap-1">
        {statusConfig.icon}
        <span>{statusConfig.text}</span>
        <button
          type="button"
          onClick={handleSendVerification}
          disabled={statusConfig.disabled}
          className={`underline ml-1 ${statusConfig.buttonColor} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        >
          {statusConfig.buttonText}
        </button>
      </span>

      {!isConnected && (
        <span className="text-yellow-600 text-xs flex items-center gap-1">
          <WarningCircleIcon size={12} />
          Conexão em tempo real não disponível
        </span>
      )}
    </div>
  )
}
