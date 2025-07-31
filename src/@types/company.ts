import { CompanyType, OnboardingStatus } from './onboarding'

export interface CompanyProps {
  id: string;
  ownerId: string;
  type: CompanyType;
  legalName: string;
  tradeName?: string;
  document?: string;
  phone: string;
  website?: string;
  businessNiche?: string;
  avatarUrl?: string;

  // Dados do perfil empresarial
  businessType?: string;
  companySize?: string;

  // Endereço
  zipCode: string;
  address: string;
  number?: string;
  complement?: string;
  city: string;
  state: string;

  // Status do onboarding
  onboardingStatus?: OnboardingStatus;
  onboardingStep?: number;
  isActive?: boolean;
}
