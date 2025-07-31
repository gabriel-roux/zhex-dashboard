/* eslint-disable no-unused-vars */
export enum ProductType {
  ONE_TIME = 'ONE_TIME',     // Pagamento único
  RECURRING = 'RECURRING',   // Pagamento recorrente
  INSTALLMENT = 'INSTALLMENT', // Parcelamento
}

export enum ProductClass {
  PHYSICAL = 'PHYSICAL', // Produto físico
  DIGITAL = 'DIGITAL',   // Produto digital
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',   // Ativo
  INACTIVE = 'INACTIVE', // Inativo
  PENDING = 'PENDING',   // Pendente
}

export interface ProductImage {
  id: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  isDefault?: boolean;
}

export interface ProductProps {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  type: ProductType;
  category?: string;
  landingPage: string;
  language?: string;
  guarantee?: string;
  productClass?: ProductClass;
  currency?: string;
  status?: ProductStatus;
  supportEmail?: string;
  supportPhone?: string;
  supportName?: string;
  supportEmailVerified?: boolean;
  deletedAt?: Date;
  images?: ProductImage[];
  defaultImage?: ProductImage;
}
