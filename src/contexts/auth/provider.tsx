'use client'

import { useState } from 'react'
import { AuthContext } from './context'
import { UserProps } from '@/@types/user'
import { api } from '@/libs/axios'
import React from 'react'
import Cookies from 'js-cookie'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProps | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!user

  async function signIn(email: string, password: string) {
    try {
      setLoading(true)
      const response = await api.post('/auth/login', {
        email,
        password,
      })

      if (response.data.success) {
        setUser(response.data.user)
        Cookies.set('user-token', response.data.accessToken)
        Cookies.set('refresh-token', response.data.refreshToken || '')
      }

      return response.data as {
        success: boolean;
        message: string;
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
        loading,
        signIn,
        signOut,
        registerInWaitlist,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
