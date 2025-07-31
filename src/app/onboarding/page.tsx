'use client'

import { Container } from '@/components/container'

import { ProgressBar } from './progress-bar'
import { InitOnboarding } from './verify'
import { BusinessForm } from './verify/business-form'
import { RepresentativesForm } from './verify/representatives-form'
import BankForm from './verify/bank-form'
import { OperationRisk } from './verify/operation-risk-form'
import { SignatureForm } from './verify/signature-form'
import { useOnboardingContext } from '@/contexts/onboarding/context'
import { SmileyXEyesIcon } from '@phosphor-icons/react'

export default function OnboardingPage() {
  const {
    onboardingProgress,
    user,
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
    clearError,
  } = useOnboardingContext()

  // Use the step from onboarding progress if available
  const effectiveCurrentStep = currentStep

  const steps = [
    {
      label: 'Perfil',
      completed: onboardingProgress?.completedSteps.profile ?? isStepCompleted(0),
    },
    {
      label: 'Detalhes da Empresa',
      completed: onboardingProgress?.completedSteps.companyDetails ?? isStepCompleted(1),
    },
    {
      label: 'Detalhes dos Representantes',
      completed: onboardingProgress?.completedSteps.representatives ?? isStepCompleted(2),
    },
    {
      label: 'Conta Bancária',
      completed: onboardingProgress?.completedSteps.bankAccount ?? isStepCompleted(3),
    },
    {
      label: 'Risco de Operação',
      completed: onboardingProgress?.completedSteps.riskProfile ?? isStepCompleted(4),
    },
    {
      label: 'Assinatura',
      completed: onboardingProgress?.completedSteps.contractSigned ?? isStepCompleted(5),
    },
  ]

  const step = () => {
    switch (effectiveCurrentStep) {
      case 0:
        return (
          <InitOnboarding
            onSubmit={createCompanyProfile}
            isLoading={isLoading}
            error={error}
            onClearError={clearError}
            setCurrentStep={goToStep}
          />
        )
      case 1:
        return (
          <BusinessForm
            onSubmit={updateCompanyDetails}
            isLoading={isLoading}
            error={error}
            setCurrentStep={goToStep}
          />
        )
      case 2:
        return (
          <RepresentativesForm
            onSubmit={updateRepresentatives}
            isLoading={isLoading}
            error={error}
            setCurrentStep={goToStep}
          />
        )
      case 3:
        return (
          <BankForm
            onSubmit={updateBankAccount}
            isLoading={isLoading}
            error={error}
            setCurrentStep={goToStep}
          />
        )
      case 4:
        return (
          <OperationRisk
            onSubmit={updateRiskProfile}
            isLoading={isLoading}
            error={error}
            setCurrentStep={goToStep}
          />
        )
      case 5:
        return (
          <SignatureForm
            onSubmit={signContract}
            isLoading={isLoading}
            error={error}
            setCurrentStep={goToStep}
          />
        )
      default:
        return (
          <InitOnboarding
            onSubmit={createCompanyProfile}
            isLoading={isLoading}
            error={error}
            onClearError={clearError}
            setCurrentStep={goToStep}
          />
        )
    }
  }

  if (!user?.id) {
    return (
      <Container>
        <div className="w-full bg-white rounded-lg px-5 mb-10 flex flex-col justify-center items-center gap-4 py-12">
          <div className="w-12 h-12 bg-zhex-base-500/15 rounded-full flex items-center justify-center">
            <SmileyXEyesIcon
              size={28}
              weight="bold"
              className="text-zhex-base-500"
            />
          </div>

          <div className="text-center">
            <h2 className="text-lg font-araboto font-semibold text-neutral-950">
              Token de acesso inválido
            </h2>
            <p className="text-neutral-500 font-araboto">
              O link de onboarding é inválido ou expirou. Entre em contato com o suporte.
            </p>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="w-full bg-white rounded-lg py-6 px-5 mb-10">
        <ProgressBar steps={steps} currentStep={effectiveCurrentStep} />

        {step()}
      </div>
    </Container>
  )
}
