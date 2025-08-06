'use client'

import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { ProductsMenu } from '@/components/products-menu'
import {
  FileTextIcon,
  CreditCardIcon,
  LinkSimpleIcon,
  ShoppingCartIcon,
  TicketIcon,
  RepeatIcon,
  UsersThreeIcon,
  BroadcastIcon,
  ArrowLeftIcon,
} from '@phosphor-icons/react'
import { useEffect, useState, use } from 'react'
import { motion } from 'framer-motion'
import { ProductInformations } from './informations'
import { PaymentMethods } from './payment-methods'
import { PaymentLinks } from './payment-links'
import { ProductSalesInformations } from '@/components/product-sales-informations'
import { ProductSubscriptions } from './subscriptions'
import { ProductCoupons } from './coupons'
import { ProductAffiliates } from './affiliates'
import { ProductPixels } from './pixels'
import { ProductClass, ProductProps, ProductType } from '@/@types/product'
import { useApi } from '@/hooks/useApi'
import { useProductForm, ProductFormData } from '@/hooks/useProductForm'
import { useProductPriceForm, ProductPriceFormData } from '@/hooks/useProductPriceForm'
import { useProductAffiliateForm, AffiliateFormData } from '@/hooks/useProductAffiliateForm'
import { Skeleton } from '@/components/skeleton'
import { useRouter } from 'next/navigation'
import { Checkouts } from './checkout'
import Link from 'next/link'

interface CustomError extends Error {
  isProductNotFound?: boolean
  statusCode?: number
}

interface ProductPageProps {
  params: Promise<{
    productId: string
  }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { productId } = use(params)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('informacoes')

  const [pageLoading, setPageLoading] = useState(true)
  const [product, setProduct] = useState({} as ProductProps)
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([])
  const [hasError, setHasError] = useState(false)

  const { form: productForm, handleSubmit: submitProduct, loading: submitLoading, error: productFormError } = useProductForm(
    product?.id
      ? product
      : null,
    productId,
    removedImageIds,
  )

  // Hook para formulário de preço
  const { form: priceForm, handleSubmit: submitPrice, loading: priceLoading, fetchProductPrice } = useProductPriceForm(productId)

  // Hook para formulário de afiliados
  const { form: affiliateForm, handleSubmit: submitAffiliate, loading: affiliateLoading, paymentLinks } = useProductAffiliateForm(productId)

  const api = useApi()

  // Função para tratar erros de produto não encontrado
  const handleProductError = (error: unknown) => {
    const customError = error as CustomError

    // Verificar se é erro de produto não encontrado
    if (customError.isProductNotFound || customError.message === 'Produto não encontrado') {
      console.log('Produto não encontrado, redirecionando para lista de produtos...')
      setHasError(true)
      router.push('/products')
      return true
    }
    return false
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setHasError(false)
        const response = await api.get<{ success: boolean; data: ProductProps }>(`/products/${productId}`)
        const product = response.data.data

        setProduct(product)
        productForm.reset({
          name: product.name || '',
          description: product.description || '',
          type: product.productClass || ProductClass.PHYSICAL,
          category: product.category || '',
          landingPage: product.landingPage || '',
          language: product.language || '',
          guarantee: product.guarantee || '',
          payment: product.type,
          supportName: product.supportName || '',
          supportEmail: product.supportEmail || '',
          supportPhone: product.supportPhone || '',
          newImages: [],
          existingImageIds: product.images?.map(img => img.id) || [],
          removedImageIds: [],
        })
        setPageLoading(false)
      } catch (error: unknown) {
        console.error('Erro ao carregar produto:', error)

        if (handleProductError(error)) {
          return // Se o erro foi tratado, não continuar
        }

        // Para outros erros, também redirecionar para a lista
        console.log('Erro desconhecido, redirecionando para lista de produtos...')
        setHasError(true)
        router.push('/products')
        setPageLoading(false)
      }
    }

    // Só carregar dados adicionais se o produto foi carregado com sucesso
    if (!hasError) {
      fetchProductPrice().catch((error) => {
        console.error('Erro ao carregar preço do produto:', error)
        handleProductError(error)
      })
      fetchProduct()
    }
  }, [productId, hasError])

  // Se houve erro, não renderizar nada (já foi redirecionado)
  if (hasError) {
    return null
  }

  const renderProductTab = () => {
    switch (activeTab) {
      case 'informacoes':
        return (
          <ProductInformations
            product={product}
            form={productForm}
            loading={pageLoading}
            error={productFormError}
            setRemovedImageIds={setRemovedImageIds}
          />
        )
      case 'pagamento':
        return <PaymentMethods productId={productId} productType={product.type} priceForm={priceForm} />
      case 'links':
        return <PaymentLinks productId={productId} productType={product.type} />
      case 'checkout':
        return <Checkouts productId={productId} />
      case 'assinaturas':
        return <ProductSubscriptions productId={productId} />
      case 'cupons':
        return <ProductCoupons productId={productId} />
      case 'afiliados':
        return <ProductAffiliates form={affiliateForm} paymentLinks={paymentLinks} />
      case 'pixel':
        return <ProductPixels productId={productId} />
    }
  }

  const hasSalesInformations = activeTab === 'links' || activeTab === 'assinaturas' || activeTab === 'cupons' || activeTab === 'checkout' || activeTab === 'afiliados' || activeTab === 'pixel'
  const showSaveButton = activeTab === 'informacoes' || activeTab === 'pagamento' || activeTab === 'afiliados'
  const isSubscription = product.productClass === ProductClass.DIGITAL && product.type === ProductType.RECURRING

  // Determinar qual formulário usar baseado na tab ativa
  const isPriceTab = activeTab === 'pagamento'
  const isAffiliateTab = activeTab === 'afiliados'

  let currentForm, currentLoading

  if (isPriceTab) {
    currentForm = priceForm
    currentLoading = priceLoading
  } else if (isAffiliateTab) {
    currentForm = affiliateForm
    currentLoading = affiliateLoading
  } else {
    currentForm = productForm
    currentLoading = submitLoading
  }

  // Função de submit unificada
  const handleSubmit = async (data: unknown) => {
    if (isPriceTab) {
      return await submitPrice(data as ProductPriceFormData)
    } else if (isAffiliateTab) {
      return await submitAffiliate(data as AffiliateFormData)
    } else {
      return await submitProduct(data as ProductFormData)
    }
  }

  const menuItems = [
    { label: 'Informações', icon: <FileTextIcon size={20} />, value: 'informacoes' },
    { label: 'Opções de pagamento', icon: <CreditCardIcon size={20} />, value: 'pagamento' },
    { label: 'Links de Pagamento', icon: <LinkSimpleIcon size={20} />, value: 'links' },
    { label: 'Checkout', icon: <ShoppingCartIcon size={20} />, value: 'checkout' },
    { label: 'Cupons', icon: <TicketIcon size={20} />, value: 'cupons' },
    ...(isSubscription
      ? [{ label: 'Assinaturas', icon: <RepeatIcon size={20} />, value: 'assinaturas' }]
      : []),
    { label: 'Pixel', icon: <BroadcastIcon size={20} />, value: 'pixel' },
    { label: 'Afiliados', icon: <UsersThreeIcon size={20} />, value: 'afiliados' },
  ]

  return (
    <form onSubmit={currentForm.handleSubmit(handleSubmit)}>
      <Container className="flex items-start justify-between w-full mt-6 px-2">
        <div>
          {pageLoading
            ? (
              <Skeleton className="w-[190px] h-5 mb-2 rounded-md" />
              )
            : (
              <Link href="/products" className="flex items-center gap-2 text-neutral-1000 text-lg font-araboto font-medium hover:text-zhex-base-500 transition-all duration-300">
                <ArrowLeftIcon size={20} weight="bold" className="text-zhex-base-500 -mt-1" />
                {product.name}
              </Link>

              )}

          <p className="text-neutral-500 text-base font-araboto mb-6">
            Altere as informações do seu produto para deixá-lo pronto para venda.
          </p>
        </div>

        {showSaveButton && (
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

          {hasSalesInformations && (
            <ProductSalesInformations
              product={product}
            />
          )}

          <motion.div
            key={activeTab}
            initial={{
              opacity: pageLoading
                ? 1
                : 0,
            }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {renderProductTab()}
          </motion.div>
        </div>
      </Container>
    </form>
  )
}
