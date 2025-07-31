export interface Coupon {
  id: string
  name: string
  code: string
  discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: number
  isActive: boolean
  usageLimit?: number
  usageCount: number
  expiresAt?: string
  createdAt: string
  updatedAt: string
}
