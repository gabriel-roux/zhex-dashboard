'use client'

import { useEffect, useState } from 'react'
import { AuthContext } from './context'
import { UserProps } from '@/@types/user'
import { api } from '@/libs/axios'
import React from 'react'
import Cookies from 'js-cookie'
import { CompanyProps } from '@/@types/company'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProps | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  async function getProfile() {
    try {
      const response = await api.get('/auth/me')

      console.log('response →', response.data)

      const user = response.data as UserProps

      setUser({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        isActive: user.isActive,
        companyId: user.companyId,
        emailVerified: user.emailVerified,
        phone: user.phone,
      })

      setIsAuthenticated(true)
    } catch {
      // Token inválido ou usuário não autenticado
      setUser(undefined)
      setIsAuthenticated(false)
      // Não redirecionar aqui, deixar o AuthGuard cuidar disso
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Só tentar buscar o perfil se houver um token
    const token = Cookies.get('user-token')
    if (token) {
      getProfile()
    } else {
      setLoading(false)
    }
  }, [])

  async function signIn(email: string, password: string) {
    try {
      setLoading(true)
      const response = await api.post('/auth/login', {
        email,
        password,
      })

      let success = 0

      if (response.data.success) {
        setUser(response.data.user)

        if (response.data.accessToken && response.data.refreshToken) {
          Cookies.set('user-token', response.data.accessToken)
          Cookies.set('refresh-token', response.data.refreshToken)

          success = 1
          setIsAuthenticated(true)
        } else if (response.data.selectCompanyLoginToken) {
          Cookies.set('select-company-token', response.data.selectCompanyLoginToken)

          success = 2
        }
      }

      return {
        success,
        message: response.data.message,
        companies: response.data.companies,
      } as {
        success: number;
        message: string;
        companies?: CompanyProps[];
      }
    } catch (error) {
      return {
        success: 0,
        message: error instanceof Error
          ? error.message
          : 'Erro interno do servidor',
      } as {
        success: number;
        message: string;
      }
    } finally {
      setLoading(false)
    }
  }

  async function loginCompany(companyId: string) {
    try {
      setLoading(true)
      const response = await api.post('/auth/login-company', {
        companyId,
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get('select-company-token')}`,
        },
      })

      if (response.data.success) {
        // Set tokens
        Cookies.set('user-token', response.data.accessToken)
        Cookies.set('refresh-token', response.data.refreshToken)

        // Set user with companyId
        setUser({
          ...response.data.user,
          id: response.data.user.id,
          email: response.data.user.email,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          companyId: response.data.user.companyId,
          avatarUrl: response.data.user.avatarUrl,
          isActive: true,
        })

        setIsAuthenticated(true)
      }

      return response.data
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error
          ? error.message
          : 'Erro interno do servidor',
      }
    } finally {
      setLoading(false)
    }
  }

  async function switchCompany(companyId: string) {
    try {
      setLoading(true)
      const response = await api.post('/auth/switch-company', {
        companyId,
      })

      if (response.data.success) {
        // Set tokens
        Cookies.set('user-token', response.data.accessToken)
        Cookies.set('refresh-token', response.data.refreshToken)

        // Set user with new companyId
        setUser({
          ...response.data.user,
          id: response.data.user.id,
          email: response.data.user.email,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          companyId: response.data.user.companyId,
          isActive: true,
        })

        setIsAuthenticated(true)
      }

      return response.data
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error
          ? error.message
          : 'Erro interno do servidor',
      }
    } finally {
      setLoading(false)
    }
  }

  async function signOut() {
    try {
      await api.post('/auth/logout')
    } finally {
      Cookies.remove('user-token')
      Cookies.remove('refresh-token')
      setUser(undefined)
    }
  }

  async function registerInWaitlist(waitlistData: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    socialMedia?: string;
    role?: string;
    revenue?: string;
    solution?: string;
    referral?: string;
    reason?: string;
  }) {
    const response = await api.post('/waitlist', waitlistData)

    return response.data as {
      success: boolean;
      message: string;
    }
  }

  async function updateUser(user: UserProps) {
    setUser(user)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        setIsAuthenticated,
        loading,
        signIn,
        loginCompany,
        switchCompany,
        signOut,
        registerInWaitlist,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
