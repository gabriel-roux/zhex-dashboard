import { createContext, useContext } from 'react'
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

interface OnboardingContextType {
  // Server-side data
  onboardingProgress: VerifyTokenWithProgressDto['onboardingProgress'] | null
  user: VerifyTokenWithProgressDto['user'] | null
  onboardingToken: string | null

  // Client-side state
  currentStep: number
  isLoading: boolean
  error: string | null

  // Actions
  createCompanyProfile: (data: CreateCompanyProfileData) => Promise<OnboardingStatus>
  updateCompanyDetails: (data: CompanyDetailsData) => Promise<OnboardingStatus>
  updateRepresentatives: (data: RepresentativesData) => Promise<OnboardingStatus>
  updateBankAccount: (data: BankAccountData) => Promise<OnboardingStatus>
  updateRiskProfile: (data: RiskProfileData) => Promise<OnboardingStatus>
  signContract: (data: ContractSignatureData) => Promise<OnboardingStatus>

  // Navigation
  goToStep: (step: number) => void

  // Helpers
  isStepCompleted: (step: number) => boolean
  clearError: () => void
}

export const OnboardingContext = createContext<OnboardingContextType | null>(null)

export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboardingContext must be used within an OnboardingProvider')
  }
  return context
}
