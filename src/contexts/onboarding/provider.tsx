'use client'

import React, { useState, useCallback } from 'react'
import { useApi } from '@/hooks/useApi'
import { OnboardingContext } from './context'
import { VerifyTokenWithProgressDto } from '@/@types/onboarding'
import {
  OnboardingStatus,
  CreateCompanyProfileData,
  CompanyDetailsData,
  RepresentativesData,
  BankAccountData,
  RiskProfileData,
  ContractSignatureData,
} from '@/@types/onboarding'

// Você pode declarar esse tipo baseado no que foi criado no context
type OnboardingContextType = React.ContextType<typeof OnboardingContext>

interface OnboardingProviderProps {
  children: React.ReactNode
  onboardingProgress: VerifyTokenWithProgressDto['onboardingProgress'] | null
  user: VerifyTokenWithProgressDto['user'] | null
  token: string
}

export function OnboardingProvider({
  children,
  onboardingProgress,
  user,
  token,
}: OnboardingProviderProps) {
  const [onboardingToken, setOnboardingToken] = useState(token)
  const [currentStep, setCurrentStep] = useState(onboardingProgress?.currentStep ?? 0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [onboardingData, setOnboardingData] = useState<OnboardingStatus | null>(null)

  const api = useApi()

  const makeRequest = useCallback(
    async <T,>(endpoint: string, method: 'POST' | 'PUT' = 'POST', data?: unknown): Promise<T> => {
      setIsLoading(true)
      setError(null)

      try {
        console.log('onboardingToken', onboardingToken)

        const url = `/onboarding/${endpoint}?token=${onboardingToken}`
        const response = method === 'POST'
          ? await api.post<T>(url, data)
          : await api.put<T>(url, data)

        // Check if the response indicates an error (from our global filter)
        if (response.data && typeof response.data === 'object' && 'success' in response.data && !response.data.success) {
          const errorData = response.data as { message?: string }
          throw new Error(errorData.message || 'Erro desconhecido')
        }

        return response.data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        let errorMessage = 'Erro desconhecido'
        const status = err?.status || err?.response?.status

        if (status === 401) {
          if (err?.response?.data?.message?.includes('Token de onboarding inválido') ||
              err?.response?.data?.message?.includes('Token expirado')) {
            errorMessage = 'Token de acesso expirado. Por favor, solicite um novo link de onboarding.'
          } else {
            errorMessage = 'Token de acesso inválido. Por favor, verifique o link de onboarding.'
          }
        } else if (status === 403) {
          errorMessage = 'Acesso negado. Verifique suas permissões.'
        } else if (status === 404) {
          errorMessage = 'Endpoint não encontrado. Verifique a URL.'
        } else if (status === 422) {
          errorMessage = err?.response?.data?.message || 'Dados inválidos. Verifique as informações enviadas.'
        } else if (status && status >= 500) {
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.'
        } else if (err?.message?.includes('Network Error') || err?.message?.includes('ERR_CONNECTION_REFUSED')) {
          errorMessage = 'Servidor não está respondendo. Verifique se a API está rodando.'
        } else if (err?.response?.data?.message) {
          errorMessage = err.response.data.message
        } else if (err?.message) {
          errorMessage = err.message
        }

        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [api, onboardingToken],
  )

  const createCompanyProfile = useCallback(async (data: CreateCompanyProfileData): Promise<OnboardingStatus> => {
    const result = await makeRequest<OnboardingStatus>('step-1/profile', 'POST', data)
    setOnboardingData(result)

    console.log('createCompanyProfile', result)

    // If we received a new onboarding token, update the URL
    if (result.onboardingToken) {
      setOnboardingToken(result.onboardingToken)
    }

    return result
  }, [makeRequest])

  const updateCompanyDetails = useCallback(async (data: CompanyDetailsData): Promise<OnboardingStatus> => {
    const result = await makeRequest<OnboardingStatus>('step-2/company-details', 'PUT', data)
    setOnboardingData(result)
    return result
  }, [makeRequest])

  const updateRepresentatives = useCallback(async (data: RepresentativesData): Promise<OnboardingStatus> => {
    const result = await makeRequest<OnboardingStatus>('step-3/representatives', 'PUT', data)
    setOnboardingData(result)
    return result
  }, [makeRequest])

  const updateBankAccount = useCallback(async (data: BankAccountData): Promise<OnboardingStatus> => {
    const result = await makeRequest<OnboardingStatus>('step-4/bank-account', 'PUT', data)
    setOnboardingData(result)
    return result
  }, [makeRequest])

  const updateRiskProfile = useCallback(async (data: RiskProfileData): Promise<OnboardingStatus> => {
    const result = await makeRequest<OnboardingStatus>('step-5/risk-profile', 'PUT', data)
    setOnboardingData(result)
    return result
  }, [makeRequest])

  const signContract = useCallback(async (data: ContractSignatureData): Promise<OnboardingStatus> => {
    const result = await makeRequest<OnboardingStatus>('step-6/sign-contract', 'POST', data)
    setOnboardingData(result)
    return result
  }, [makeRequest])

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step)
  }, [])

  const isStepCompleted = useCallback((step: number): boolean => {
    const completedSteps = onboardingData?.completedSteps || onboardingProgress?.completedSteps

    if (!completedSteps) return false

    switch (step) {
      case 0: return completedSteps.profile
      case 1: return completedSteps.companyDetails
      case 2: return completedSteps.representatives
      case 3: return completedSteps.bankAccount
      case 4: return completedSteps.riskProfile
      case 5: return completedSteps.contractSigned
      default: return false
    }
  }, [onboardingProgress, onboardingData])

  const contextValue: OnboardingContextType = {
    onboardingProgress,
    user,
    onboardingToken,
    currentStep,
    isLoading,
    error,
    createCompanyProfile,
    updateCompanyDetails,
    updateRepresentatives,
    updateBankAccount,
    updateRiskProfile,
    signContract,
    goToStep,
    isStepCompleted,
    clearError: () => setError(null),
  }

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  )
}
