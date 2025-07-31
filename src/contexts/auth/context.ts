import { CompanyProps } from '@/@types/company'
import { UserProps } from '@/@types/user'
import { createContext, useContext } from 'react'

interface AuthContextProps {
  user?: UserProps;

  registerInWaitlist: (waitlistData: {
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
  }) => Promise<{
    success: boolean;
    message: string;
  }>;
  signIn: (email: string, password: string) => Promise<{
    success: number;
    message: string;
    companies?: CompanyProps[];
  }>;
  loginCompany: (companyId: string) => Promise<{
    success: boolean;
    message: string;
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      companyId: string;
    };
  }>;
  switchCompany: (companyId: string) => Promise<{
    success: boolean;
    message: string;
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      companyId: string;
    };
  }>;
  signOut: () => Promise<void>;
  updateUser: (user: UserProps) => Promise<void>;
  loading: boolean;

  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps)

export function useAuth() {
  return useContext(AuthContext)
}
