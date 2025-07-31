'use client'

import { useState } from 'react'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { ProductsMenu } from '@/components/products-menu'
import {
  UserIcon,
  BuildingsIcon,
  BankIcon,
  ClockCounterClockwiseIcon,
} from '@phosphor-icons/react'
import { UserProfile } from './user-profile'
import { useUserForm, UserFormData } from '@/hooks/useUserForm'
import { UserInformations } from '@/components/user-informations'
import { CompanyForm } from './company-form'
import { useCompanyForm, CompanyFormData } from '@/hooks/useCompanyForm'
import { RepresentativesForm } from './representatives-form'
import { useRepresentativesForm, RepresentativesFormData } from '@/hooks/useRepresentativesForm'
import { BankForm } from './bank-form'
import { useBankForm, BankFormData } from '@/hooks/useBankForm'
import { LoginHistory } from './login-history'

export default function MyAccountPage() {
  const [activeTab, setActiveTab] = useState('empresa')

  // Hook para formulário de usuário
  const { form: userForm, loading: userLoading, handleSubmit: submitUser } = useUserForm()

  // Hook para formulário de empresa
  const { form: companyForm, loading: companyLoading, logoPreview, companyType, handleLogoChange, handleSubmit: submitCompany, error: companyError } = useCompanyForm()

  // Hook para formulário de representantes
  const {
    form: representativesForm,
    loading: representativesLoading,
    minimizedForms,
    addRepresentative,
    removeRepresentative,
    toggleFormMinimization,
    isFormComplete,
    handleSubmit: submitRepresentatives,
    error: representativesError,
  } = useRepresentativesForm()

  // Hook para formulário de informações bancárias
  const { form: bankForm, loading: bankLoading, handleSubmit: submitBank, error: bankError } = useBankForm()

  const menuItems = [
    { label: 'Detalhes da empresa', icon: <BuildingsIcon size={20} />, value: 'empresa' },
    { label: 'Representantes', icon: <UserIcon size={20} />, value: 'representantes' },
    { label: 'Informaçoes Bancarias', icon: <BankIcon size={20} />, value: 'informacoes-bancarias' },
    { label: 'Histórico de Login', icon: <ClockCounterClockwiseIcon size={20} />, value: 'login-history' },
    { label: 'Minha conta', icon: <UserIcon size={20} />, value: 'minha-conta' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'minha-conta':
        return (
          <UserProfile
            form={userForm}
          />
        )
      case 'empresa':
        return (
          <CompanyForm
            loading={companyLoading}
            form={companyForm}
            logoPreview={logoPreview}
            companyType={companyType}
            onLogoChange={handleLogoChange}
            error={companyError}
          />
        )
      case 'representantes':
        return (
          <RepresentativesForm
            companyType={companyType}
            form={representativesForm}
            minimizedForms={minimizedForms}
            addRepresentative={addRepresentative}
            removeRepresentative={removeRepresentative}
            toggleFormMinimization={toggleFormMinimization}
            isFormComplete={isFormComplete}
            error={representativesError}
          />
        )
      case 'informacoes-bancarias':
        return (
          <BankForm
            form={bankForm}
            error={bankError}
          />
        )
      case 'login-history':
        return (
          <LoginHistory />
        )
      default:
        return <div className="p-8 text-center text-neutral-500">Funcionalidade em desenvolvimento</div>
    }
  }

  // Determinar qual formulário usar baseado na tab ativa
  const isUserTab = activeTab === 'minha-conta'
  const isCompanyTab = activeTab === 'empresa'
  const isRepresentativesTab = activeTab === 'representantes'
  const isBankTab = activeTab === 'informacoes-bancarias'
  const isLoginHistoryTab = activeTab === 'login-history'

  let currentForm, currentLoading

  if (isUserTab) {
    currentForm = userForm
    currentLoading = userLoading
  } else if (isCompanyTab) {
    currentForm = companyForm
    currentLoading = companyLoading
  } else if (isRepresentativesTab) {
    currentForm = representativesForm
    currentLoading = representativesLoading
  } else if (isBankTab) {
    currentForm = bankForm
    currentLoading = bankLoading
  } else if (isLoginHistoryTab) {
    currentForm = null // LoginHistory does not have a form
    currentLoading = false
  }

  // Função de submit unificada
  const handleSubmit = async (data: UserFormData | CompanyFormData | RepresentativesFormData | BankFormData) => {
    if (isUserTab) {
      return await submitUser(data as UserFormData)
    } else if (isCompanyTab) {
      return await submitCompany(data as CompanyFormData)
    } else if (isRepresentativesTab) {
      return await submitRepresentatives(data as RepresentativesFormData)
    } else if (isBankTab) {
      return await submitBank(data as BankFormData)
    }
  }

  return (
    <form onSubmit={currentForm?.handleSubmit(handleSubmit)}>
      <Container className="flex items-start justify-between w-full mt-6 px-2">
        <div>
          <h1 className="text-lg text-neutral-950 font-araboto font-medium">
            Minha conta
          </h1>
          <p className="text-neutral-500 text-base font-araboto mb-6">
            Gerencie suas informações pessoais e da empresa.
          </p>
        </div>

        {(isUserTab || isCompanyTab || isRepresentativesTab || isBankTab) && (
          <Button
            size="medium"
            variant="primary"
            type="submit"
            className="w-[180px]"
            loading={currentLoading}
          >
            Salvar
          </Button>
        )}
      </Container>

      <Container>
        <div className="w-full bg-white rounded-lg py-6 px-5 mb-10 border border-neutral-200">
          <ProductsMenu
            items={menuItems}
            active={activeTab}
            onChange={setActiveTab}
          />

          {!isCompanyTab && (
            <UserInformations />
          )}

          {renderTabContent()}
        </div>
      </Container>
    </form>
  )
}
