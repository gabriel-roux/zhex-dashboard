'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Container } from '@/components/container'
import { EnvelopeIcon, SmileyXEyesIcon } from '@phosphor-icons/react'
import { useApi } from '@/hooks/useApi'

function VerifyEmailChangeContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [verifying, setVerifying] = useState(true)

  const [error, setError] = useState<string | null>(null)
  const api = useApi()

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerifying(false)
        setError('Token não encontrado. Tente novamente.')
        return
      }

      try {
        const result = await api.get(`/email-verification/verify-email-change?token=${token}`)
        const data = result.data as { success: boolean, message: string }

        console.log(data)

        if (data.success) {
          setTimeout(() => {
            window.close()
          }, 3000)
        } else {
          setError(data.message || 'Erro ao verificar email. Tente novamente.')
        }
      } catch (error) {
        console.error('Erro ao verificar email:', error)
        setError('Erro ao verificar email. Tente novamente.')
      } finally {
        setVerifying(false)
      }
    }

    verifyEmail()
  }, [token])

  return (
    <Container>
      <div className="w-full bg-white rounded-lg px-5 mb-10 flex flex-col justify-center items-center gap-4 py-12">
        <div className="w-12 h-12 bg-zhex-base-500/15 rounded-full flex items-center justify-center">
          {
            error
              ? <SmileyXEyesIcon
                  size={28}
                  weight="bold"
                  className="text-zhex-base-500"
                />
              : !verifying
                  ? <EnvelopeIcon
                      size={28}
                      weight="bold"
                      className="text-zhex-base-500"
                    />
                  : <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
}
        </div>

        <div className="text-center">
          <h2 className="text-lg font-araboto font-semibold text-neutral-950">
            {error
              ? 'Erro ao verificar email'
              : verifying
                ? 'Verificando seu email...'
                : 'Email verificado com sucesso!'}
          </h2>
          <p className="text-neutr-500 font-araboto">
            {error || (verifying
              ? 'Estamos verificando seu email para alterar o seu email.'
              : 'Seu email foi alterado com sucesso. Essa página será fechada automaticamente em alguns segundos.')}
          </p>
        </div>
      </div>
    </Container>
  )
}

export default function VerifyEmailChangePage() {
  return (
    <Suspense fallback={
      <Container>
        <div className="w-full bg-white rounded-lg px-5 mb-10 flex flex-col justify-center items-center gap-4 py-12">
          <div className="w-12 h-12 bg-zhex-base-500/15 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-araboto font-semibold text-neutral-950">
              Carregando...
            </h2>
            <p className="text-neutr-500 font-araboto">
              Aguarde enquanto carregamos a página.
            </p>
          </div>
        </div>
      </Container>
    }
    >
      <VerifyEmailChangeContent />
    </Suspense>
  )
}
