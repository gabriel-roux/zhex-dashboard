import { OffersFormData, OrderBump } from '@/hooks/useCheckoutOffersForm'
import Image from 'next/image'

interface OrderBumpPreviewProps {
  orderBump: OrderBump
  colors: OffersFormData
  productName?: string
  productImageUrl?: string
}

export function OrderBumpPreview({ orderBump, colors, productName, productImageUrl }: OrderBumpPreviewProps) {
  return (
    <div
      style={{
        borderColor: colors.orderBumpBorderColor,
      }}
      className="rounded-lg border-2 border-dashed border-zhex-base-500 overflow-hidden"
    >
      {/* Product Info Section */}
      <div
        style={{
          backgroundColor: `${colors.orderBumpCardColor}10`,
        }}
        className="p-5 bg-zhex-base-500/5 rounded-t-lg"
      >
        <div className="flex items-start gap-4">
          {/* Product Image */}
          <div
            style={{
              backgroundColor: `${colors.orderBumpCardColor}50`,
            }}
            className="w-28 h-32 rounded-lg flex-shrink-0 p-4 bg-zhex-base-400/60 flex items-center justify-center relative overflow-hidden"
          >
            {
              productImageUrl && (
                <Image src={productImageUrl} alt="Order Bump Preview" width={100} height={100} />
              )
            }
          </div>

          {/* Content */}
          <div className="flex-1">
            <h4
              style={{
                color: colors.titleColor,
              }}
              className="font-bold text-lg leading-tight mb-2"
            >
              {orderBump.offer || productName || 'Livro de Donald A. Norman, Publicado em 2016: O Design do Dia a Dia'}
            </h4>
            <p
              style={{
                color: colors.orderBumpTextColor,
              }}
              className="text-sm text-neutral-900 mb-3 leading-relaxed"
            >
              {orderBump.description || 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words.'}
            </p>

            {/* Price */}
            <div className="flex items-center gap-2">
              {orderBump.priceFrom && orderBump.priceFrom > 0 && (
                <span
                  style={{
                    color: colors.orderBumpFakePriceColor,
                  }}
                  className="text-base line-through text-red-secondary-500 font-medium"
                >
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: orderBump.currency || 'BRL',
                  }).format(orderBump.priceFrom / 100)}
                </span>
              )}
              <span
                style={{
                  color: colors.orderBumpTextColor,
                }}
                className="text-base text-neutral-900"
              >
                por apenas
              </span>
              {orderBump.priceTo && orderBump.priceTo > 0 && (
                <span
                  style={{
                    color: colors.orderBumpPriceColor,
                  }}
                  className="text-lg font-bold text-green-600"
                >
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: orderBump.currency || 'BRL',
                  }).format(orderBump.priceTo / 100)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Checkbox and Button Section */}
      <div
        style={{
          backgroundColor: `${colors.orderBumpCardColor}20`,
        }}
        className="py-4 px-5 bg-zhex-base-500/15 border-t border-neutral-200"
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              borderColor: colors.orderBumpBorderColor,
            }}
            className="w-5 h-5 rounded border-2 flex-shrink-0 bg-white"
          />
          <p className="text-base text-neutral-1000 font-medium">
            Adicionar produto
          </p>
        </div>
      </div>
    </div>
  )
}
