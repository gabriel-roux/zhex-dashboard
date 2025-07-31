// ===== TIPOS DO ONBOARDING =====

export interface OnboardingStep {
  step: number;
  title: string;
  description: string;
}

export interface OnboardingStatus {
  companyId: string;
  onboardingToken?: string;
  currentStep: number;
  totalSteps: number;
  onboardingStatus: string;
  completedSteps: {
    profile: boolean;
    companyDetails: boolean;
    representatives: boolean;
    bankAccount: boolean;
    riskProfile: boolean;
    contractSigned: boolean;
  };
  nextStep?: OnboardingStep;
}

// ===== STEP 1: PERFIL DA EMPRESA =====
export type CompanyType = 'INDIVIDUAL' | 'CORPORATION'

export type BusinessType =
  | 'TRAFEGO_DIRETO'
  | 'PRODUTOR_INFOPRODUTOS'
  | 'AFILIADO_MARKETING'
  | 'ECOMMERCE_NICHO'
  | 'SAAS_FERRAMENTA_B2B'
  | 'MARKETPLACE'
  | 'INFLUENCER_CREATOR'
  | 'AGENCIA_GLOBAL'

export type CompanySize = '1_10_PESSOAS' | '11_50_PESSOAS' | '51_200_PESSOAS' | '201_500_PESSOAS' | '500_PESSOAS'

export interface CreateCompanyProfileData {
  companyType: CompanyType;
  businessType: BusinessType;
  companySize: CompanySize;
}

// ===== STEP 2: DETALHES DA EMPRESA =====
export interface CompanyDetailsData {
  legalName: string;
  tradeName?: string;
  document: string; // CPF ou CNPJ
  phone: string;
  website?: string;
  businessNiche?: string;
  zipCode: string;
  address: string;
  number?: string;
  complement?: string;
  city: string;
  state: string;
}

// ===== STEP 3: REPRESENTANTES =====
export interface RepresentativeData {
  firstName: string;
  lastName: string;
  birthDate: string; // YYYY-MM-DD
  cpf: string;
  email: string;
  phone: string;
  zipCode: string;
  address: string;
  number?: string;
  city: string;
  state: string;
  isPoliticallyExposed: boolean;
}

export interface RepresentativesData {
  representatives: RepresentativeData[];
}

// ===== STEP 4: CONTA BANCÁRIA =====
export type AccountType = 'CHECKING' | 'SAVINGS'

export interface BankAccountData {
  bankCode: string;
  bankName: string;
  agency: string;
  account: string;
  accountType: AccountType;
}

// ===== STEP 5: PERFIL DE RISCO =====
export type RiskLevel = 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'

export interface RiskProfileData {
  riskLevel: RiskLevel;
}

// ===== STEP 6: ASSINATURA =====
export type SignatureType = 'DIGITAL' | 'HANDWRITTEN'

export interface ContractSignatureData {
  signatureType: SignatureType;
  signatureData?: string; // Base64 da assinatura
  acceptTerms: boolean;
  password: string;
}

// ===== VERIFICAÇÃO DE TOKEN COM PROGRESSO =====
export interface VerifyTokenWithProgressDto {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  onboardingProgress: {
    currentStep: number;
    totalSteps: number;
    companyType?: 'INDIVIDUAL' | 'CORPORATION';
    completedSteps: {
      profile: boolean;
      companyDetails: boolean;
      representatives: boolean;
      bankAccount: boolean;
      riskProfile: boolean;
      contractSigned: boolean;
    };
    nextStep: {
      step: number;
      title: string;
      description: string;
    };
  };
}

// ===== MAPPING DOS TIPOS DO FRONTEND PARA API =====
export const businessTypeMapping: Record<string, BusinessType> = {
  'Tráfego Direto': 'TRAFEGO_DIRETO',
  'Produtor de Infoprodutos': 'PRODUTOR_INFOPRODUTOS',
  'Afiliado de Marketing': 'AFILIADO_MARKETING',
  'E‑commerce de Nicho': 'ECOMMERCE_NICHO',
  'SaaS / Ferramenta B2B': 'SAAS_FERRAMENTA_B2B',
  Marketplace: 'MARKETPLACE',
  'Influencer / Creator': 'INFLUENCER_CREATOR',
  'Agência Global': 'AGENCIA_GLOBAL',
}

export const companySizeMapping: Record<string, CompanySize> = {
  '1‑10': '1_10_PESSOAS',
  '11‑50': '11_50_PESSOAS',
  '51‑200': '51_200_PESSOAS',
  '201‑500': '201_500_PESSOAS',
  '+500': '500_PESSOAS',
}

export const reverseBusinessTypeMapping: Record<BusinessType, string> = {
  TRAFEGO_DIRETO: 'Tráfego Direto',
  PRODUTOR_INFOPRODUTOS: 'Produtor de Infoprodutos',
  AFILIADO_MARKETING: 'Afiliado de Marketing',
  ECOMMERCE_NICHO: 'E‑commerce de Nicho',
  SAAS_FERRAMENTA_B2B: 'SaaS / Ferramenta B2B',
  MARKETPLACE: 'Marketplace',
  INFLUENCER_CREATOR: 'Influencer / Creator',
  AGENCIA_GLOBAL: 'Agência Global',
}

export const reverseCompanySizeMapping: Record<CompanySize, string> = {
  '1_10_PESSOAS': '1‑10',
  '11_50_PESSOAS': '11‑50',
  '51_200_PESSOAS': '51‑200',
  '201_500_PESSOAS': '201‑500',
  '500_PESSOAS': '+500',
}
