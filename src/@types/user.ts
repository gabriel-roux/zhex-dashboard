export interface UserProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isActive?: boolean;
  emailVerified?: boolean;
  avatarUrl?: string;
  companyId?: string;
}
