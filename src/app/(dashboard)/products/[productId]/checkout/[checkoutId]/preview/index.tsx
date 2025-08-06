'use client'

import { XIcon } from '@phosphor-icons/react'
import { CheckoutLayoutFormData } from '@/hooks/useCheckoutLayoutForm'
import { OffersFormData } from '@/hooks/useCheckoutOffersForm'
import { LinksFormData } from '@/hooks/useCheckoutLinksForm'
import { TextField } from '@/components/textfield'
import { ProductProps } from '@/@types/product'

interface CheckoutPreviewProps {
  layoutData?: CheckoutLayoutFormData
  offersData?: OffersFormData
  linksData?: LinksFormData
  product?: ProductProps
}

export function CheckoutPreview({
  layoutData,
  offersData,
  linksData,
  product,
}: CheckoutPreviewProps) {
  // Dados padrão para quando não há dados do formulário
  const defaultLayoutData: CheckoutLayoutFormData = {
    name: 'Checkout',
    title: 'Título da page',
    faviconUrl: '',
    requireEmailConfirmation: true,
    requireDocument: true,
    requireAddress: true,
    requireCoupon: true,
    enableBanner: true,
    bannerLayout: 'LAYOUT_1',
    mainBannerUrl: '',
    sideBannerUrl: '',
    cardColor: '#FFFFFF',
    secondaryCardColor: '#F5F5F5',
    placeholderColor: '#9394A9',
    chipColor: '#EAE9F0',
    selectColor: '#F4F6F9',
    securityCodeColor: '#DDDEE7',
    backgroundColor: '#FFFFFF',
    backgroundImageUrl: '',
    primaryColor: '#5C7DFA',
    boxColor: '#FFFFFF',
    boxBorderColor: '#DDDEE7',
    primaryTextColor: '#27283A',
    secondaryTextColor: '#9394A9',
    inputColor: '#FFFFFF',
    inputBorderColor: '#DDDEE7',
  }

  const defaultOffersData: OffersFormData = {
    enableTimer: false,
    offerText: 'Oferta por tempo limitado!',
    timerBackgroundColor: '#FFFFFF',
    timerTextColor: '#27283A',
    timerCountdownColor: '#161616',
    timerCountdownBorderColor: '#5C7DFA',
    timerCountdownTextColor: '#FFFFFF',
    enableOrderBumps: false,
    titleColor: '#27283A',
    orderBumpTextColor: '#9394A9',
    orderBumpCardColor: '#E9E9E9',
    orderBumpBorderColor: '#5C7DFA',
    orderBumpFakePriceColor: '#9394A9',
    orderBumpPriceColor: '#5C7DFA',
    orderBumps: [],
  }

  // Usar dados do formulário ou padrões
  const layout = layoutData || defaultLayoutData
  const offers = offersData || defaultOffersData
  const links = linksData

  // Determinar URL baseada nos dados de links
  const checkoutUrl = links?.customLink || 'https://checkout.zhex.com'

  return (
    <div className="w-full max-w-[540px]">
      <h2 className="text-neutral-950 text-lg font-araboto font-medium">
        Demonstração:
      </h2>

      <div className="w-full mt-2 flex flex-col">
        <header className="w-full h-[60px] bg-neutral-25 rounded-t-3xl px-5 py-2 overflow-hidden">
          <span className="w-full border border-neutral-200 rounded-full block px-3 py-1 text-neutral-600 text-xs font-araboto">
            {checkoutUrl}
          </span>

          <div className="w-[130px] h-5 bg-neutral-200 rounded-t-md px-1 flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              {layout.faviconUrl
                ? (
                  <img
                    src={layout.faviconUrl}
                    alt="Favicon"
                    className="w-3 h-3 rounded object-cover"
                  />
                  )
                : (
                  <div className="w-3 h-3 bg-neutral-600 rounded" />
                  )}
              <span className="text-neutral-700 text-xs font-araboto font-medium leading-relaxed truncate max-w-[90px]">
                {layout.title || 'Título da page'}
              </span>
            </div>

            <XIcon size={12} className="text-neutral-700" />
          </div>
        </header>

        {/* Conteúdo da demonstração */}
        <div
          className="w-full bg-white rounded-b-3xl pb-6"
          style={{
            backgroundColor: layout.backgroundColor,
            backgroundImage: layout.backgroundImageUrl
              ? `url(${layout.backgroundImageUrl})`
              : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >

          {/* Timer (se habilitado) */}
          {offers.enableTimer && (
            <div
              className="py-2.5 text-center"
              style={{
                backgroundColor: offers.timerBackgroundColor,
                color: offers.timerTextColor,
              }}
            >
              <div className="flex flex-col gap-2">
                <p className="text-xs font-araboto text-center font-medium">
                  {offers.offerText}
                </p>
                <div className="flex justify-center items-center gap-1">
                  <div className="flex items-center">
                    <div
                      style={{
                        backgroundColor: offers.timerCountdownColor,
                        color: offers.timerCountdownTextColor,
                      }}
                      className="text-white px-2 py-1 text-xs font-bold"
                    >
                      {offers.hours || '14'}
                    </div>
                    <span
                      style={{
                        transform: 'rotate(90deg)',
                        backgroundColor: offers.timerCountdownBorderColor,
                        color: offers.timerCountdownTextColor,
                        marginLeft: -5.75,
                      }}
                      className="text-[9px] w-6 font-bold block"
                    >HRS
                    </span>
                  </div>
                  <span className="text-xs font-bold">:</span>
                  <div className="flex items-center">
                    <div
                      style={{
                        backgroundColor: offers.timerCountdownColor,
                        color: offers.timerCountdownTextColor,
                      }}
                      className="text-white px-2 py-1 text-xs font-bold"
                    >
                      {offers.minutes || '36'}
                    </div>
                    <span
                      style={{
                        transform: 'rotate(90deg)',
                        backgroundColor: offers.timerCountdownBorderColor,
                        color: offers.timerCountdownTextColor,
                        marginLeft: -5.7,
                      }}
                      className="text-[9px] w-6 font-bold block"
                    >MIN
                    </span>
                  </div>
                  <span className="text-xs font-bold">:</span>
                  <div className="flex items-center">
                    <div
                      style={{
                        backgroundColor: offers.timerCountdownColor,
                        color: offers.timerCountdownTextColor,
                      }}
                      className="text-white px-2 py-1 text-xs font-bold"
                    >
                      {offers.seconds || '59'}
                    </div>
                    <span
                      style={{
                        transform: 'rotate(90deg)',
                        backgroundColor: offers.timerCountdownBorderColor,
                        color: offers.timerCountdownTextColor,
                        marginLeft: -6,
                      }}
                      className="text-[9px] w-6 font-bold block"
                    >SEC
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Banner principal */}
          {layout.enableBanner && (layout.bannerLayout === 'LAYOUT_1' || layout.bannerLayout === 'LAYOUT_2') && (
            <div className="px-4 mt-4">
              {layout.mainBannerUrl
                ? (
                  <div
                    className="w-full h-24 rounded-lg bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${layout.mainBannerUrl})`,
                      backgroundColor: layout.cardColor,
                    }}
                  />
                  )
                : (
                  <div className="w-full h-24 rounded-lg" style={{ backgroundColor: layout.primaryColor, opacity: 0.2 }} />
                  )}
            </div>
          )}

          {/* Card do produto e placeholder lateral */}
          <div className="flex gap-4 px-4 mt-4">
            {/* Card do produto */}
            <div className="w-full flex-1">
              <div
                className="bg-white border border-neutral-200 rounded-lg p-3"
                style={{
                  backgroundColor: layout.boxColor,
                  borderColor: layout.boxBorderColor,
                }}
              >
                <div className="flex gap-4">
                  {/* Imagem do produto */}
                  <div className="w-20 h-20 bg-neutral-200 rounded-lg flex-shrink-0 overflow-hidden">
                    {product?.defaultImage?.fileUrl && (
                      <img
                        src={product.defaultImage.fileUrl}
                        alt="Imagem do produto"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Informações do produto */}
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-neutral-1000 font-araboto font-medium text-base mb-1.5" style={{ color: layout.primaryTextColor }}>
                      {product?.name || 'Título do produto'}
                    </h3>
                    <p
                      className="font-araboto text-xs mb-1.5"
                      style={{ color: layout.secondaryTextColor }}
                    >
                      Autor: {product?.supportName || 'Zhex Company'}
                    </p>
                    <p
                      className="font-araboto font-medium text-sm"
                      style={{ color: layout.primaryColor }}
                    >
                      Preço do produto
                    </p>
                  </div>
                </div>

                <div className="my-4 w-full h-[1px]" style={{ background: layout.boxBorderColor, opacity: 0.7 }} />

                <div className="flex items-center gap-4 relative">
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-neutral-1000 font-araboto font-medium text-xs" style={{ color: layout.primaryTextColor }}>
                      Seu melhor e-mail
                    </label>
                    <TextField
                      className="h-9 pt-2.5 pl-3 text-xs !leading-none pointer-events-none !rounded-lg"
                      style={{
                        backgroundColor: layout.inputColor,
                        color: layout.primaryTextColor,
                        borderColor: layout.inputBorderColor,
                      }}
                      placeholder="Digite seu melhor e-mail"
                    />
                  </div>

                  <div className="absolute bottom-0 left-0 w-full h-[50px] bg-gradient-to-b from-white/0 to-white" style={{ background: `linear-gradient(to top, ${layout.boxColor}, transparent)` }} />
                </div>
              </div>

              <button
                className="w-full font-araboto font-medium text-sm py-3 px-6 rounded-lg transition-colors mt-4 pointer-events-none"
                style={{
                  backgroundColor: layout.primaryColor,
                  color: '#FFFFFF',
                }}
              >
                Comprar agora
              </button>
            </div>

            {/* Banner lateral */}
            {layout.enableBanner && (layout.bannerLayout === 'LAYOUT_1' || layout.bannerLayout === 'LAYOUT_3') && (
              <>
                {layout.sideBannerUrl
                  ? (
                    <div
                      className="w-[120px] h-[195px] rounded-lg flex-shrink-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${layout.sideBannerUrl})`,
                        backgroundColor: layout.cardColor,
                      }}
                    />
                    )
                  : (
                    <div className="w-[120px] h-[195px] rounded-lg flex-shrink-0" style={{ backgroundColor: layout.primaryColor, opacity: 0.2 }} />
                    )}
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
