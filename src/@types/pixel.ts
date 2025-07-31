export interface Pixel {
  id: string
  name: string
  pixelType: 'FACEBOOK' | 'GOOGLE_ANALYTICS' | 'GOOGLE_TAG_MANAGER' | 'TIKTOK'
  pixelId: string
  useConversionsApi: boolean
  accessToken?: string
  trackPageView: boolean
  trackAddToCart: boolean
  trackInitiateCheckout: boolean
  trackPurchase: boolean
  trackAddPaymentInfo: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customEvents?: Record<string, any>
  isActive: boolean
  createdAt: string
  updatedAt: string
}
