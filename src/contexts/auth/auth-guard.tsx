'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth/context'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Não fazer nada enquanto está carregando
    if (loading) return

    // Se está no /login e já está autenticado, redirecionar para /
    if (pathname === '/login' && isAuthenticated) {
      console.log('🔍 Redirecting from login to /')
      router.replace('/')
      return
    }

    // Se está no onboarding, verificar se tem token de onboarding
    if (pathname.startsWith('/onboarding')) {
      const urlParams = new URLSearchParams(window.location.search)
      const tokenInUrl = urlParams.get('token')

      if (tokenInUrl) {
        // Tem token de onboarding na URL, permitir continuar
        return
      }
      // Se não tem token de onboarding e não está autenticado, redirecionar para login
      if (!isAuthenticated) {
        console.log('🔍 Redirecting to login - no onboarding token')
        router.replace('/login')
        return
      }
    }

    // Se não está autenticado e não está no login ou onboarding, redirecionar para login
    if (!isAuthenticated && pathname !== '/login' && !pathname.startsWith('/onboarding')) {
      console.log('🔍 Redirecting to login - not authenticated')
      router.replace('/login')
    }
  }, [isAuthenticated, loading, pathname, router])

  return <>{children}</>
}
