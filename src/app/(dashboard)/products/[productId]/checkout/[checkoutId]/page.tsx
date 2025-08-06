'use client'

import React, { useEffect } from 'react'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { ProductsMenu } from '@/components/products-menu'
import { use } from 'react'
import { useState } from 'react'
import {
  LayoutIcon,
  ChatCircleIcon,
  TagIcon,
  LinkSimpleIcon,
  ArrowLeftIcon,
} from '@phosphor-icons/react'
import Link from 'next/link'
import { CheckoutLayout } from './layout'
import { TestimonalsCheckout } from './testimonals'
import { OffersCheckout } from './offers'
import { LinksCheckout } from './links'
import { useCheckoutLayoutForm, CheckoutLayoutFormData } from '@/hooks/useCheckoutLayoutForm'
import { useCheckoutTestimonialsForm, TestimonialsFormData } from '@/hooks/useCheckoutTestimonialsForm'
import { useCheckoutOffersForm, OffersFormData } from '@/hooks/useCheckoutOffersForm'
import { useCheckoutLinksForm, LinksFormData } from '@/hooks/useCheckoutLinksForm'
import { CheckoutPreview } from './preview'
import { ProductProps } from '@/@types/product'
import { useApi } from '@/hooks/useApi'

interface CheckoutPageProps {
  params: Promise<{
    productId: string
    checkoutId: string
  }>
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { productId, checkoutId } = use(params)
  const [activeTab, setActiveTab] = useState('layout')
  const [product, setProduct] = useState<ProductProps>()
  const api = useApi()

  // Hooks para cada seção
  const layoutForm = useCheckoutLayoutForm(productId, checkoutId)
  const testimonialsForm = useCheckoutTestimonialsForm(productId, checkoutId)
  const offersForm = useCheckoutOffersForm(productId, checkoutId)
  const linksForm = useCheckoutLinksForm()

  // Watch para atualizar o preview em tempo real
  const layoutData = layoutForm.form.watch()
  const offersData = offersForm.form.watch()
  const linksData = linksForm.form.watch()

  const menuItems = [
    { label: 'Layout Principal', icon: <LayoutIcon size={20} />, value: 'layout' },
    { label: 'Depoimentos', icon: <ChatCircleIcon size={20} />, value: 'depoimentos' },
    { label: 'Ofertas', icon: <TagIcon size={20} />, value: 'ofertas' },
    { label: 'Links do checkout', icon: <LinkSimpleIcon size={20} />, value: 'links' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'layout':
        return (
          <CheckoutLayout
            product={product}
            form={layoutForm.form}
            selectedBannerLayout={layoutForm.selectedBannerLayout}
            onBannerLayoutChange={layoutForm.handleBannerLayoutChange}
            onFileSelect={layoutForm.handleFileSelect}
          />
        )
      case 'depoimentos':
        return (
          <TestimonalsCheckout
            form={testimonialsForm.form}
            testimonials={testimonialsForm.testimonials}
            addTestimonial={testimonialsForm.addTestimonial}
            removeTestimonial={testimonialsForm.removeTestimonial}
            updateTestimonial={testimonialsForm.updateTestimonial}
            onFileSelect={testimonialsForm.handleFileSelect}
          />
        )
      case 'ofertas':
        return (
          <OffersCheckout
            form={offersForm.form}
            orderBumps={offersForm.form.watch('orderBumps')}
            addOrderBump={offersForm.addOrderBump}
            removeOrderBump={offersForm.removeOrderBump}
          />
        )
      case 'links':
        return <LinksCheckout form={linksForm.form} />
      default:
        return null
    }
  }

  // Determinar qual hook usar baseado na tab ativa
  const isLayoutTab = activeTab === 'layout'
  const isTestimonialsTab = activeTab === 'depoimentos'
  const isOffersTab = activeTab === 'ofertas'
  const isLinksTab = activeTab === 'links'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let currentForm: any; let currentLoading = false; let currentHandleSubmit: any

  if (isLayoutTab) {
    currentForm = layoutForm.form
    currentLoading = layoutForm.loading
    currentHandleSubmit = layoutForm.handleSubmit
  } else if (isTestimonialsTab) {
    currentForm = testimonialsForm.form
    currentLoading = testimonialsForm.loading
    currentHandleSubmit = testimonialsForm.handleSubmit
  } else if (isOffersTab) {
    currentForm = offersForm.form
    currentLoading = offersForm.loading
    currentHandleSubmit = offersForm.handleSubmit
  } else if (isLinksTab) {
    currentForm = linksForm.form
    currentLoading = linksForm.loading
    currentHandleSubmit = linksForm.handleSubmit
  }

  // Função de submit unificada
  const handleSubmit = async (data: unknown) => {
    if (isLayoutTab) {
      return await currentHandleSubmit(data as CheckoutLayoutFormData)
    } else if (isTestimonialsTab) {
      return await currentHandleSubmit(data as TestimonialsFormData)
    } else if (isOffersTab) {
      return await currentHandleSubmit(data as OffersFormData)
    } else if (isLinksTab) {
      return await currentHandleSubmit(data as LinksFormData)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('onSubmit chamado')
    console.log('Tab ativa:', activeTab)
    console.log('Form válido:', currentForm.formState.isValid)
    console.log('Erros do form:', currentForm.formState.errors)

    try {
      const result = await currentForm.handleSubmit(handleSubmit)()
      console.log('Resultado do submit:', result)
    } catch (error) {
      console.error('Erro no submit:', error)
    }
  }

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await api.get<{ success: boolean; data: ProductProps }>(`/products/${productId}`)
      const product = response.data.data

      if (response.data.success) {
        setProduct(product)
      }
    }

    fetchProduct()
  }, [productId])

  return (
    <form onSubmit={onSubmit}>
      <Container className="w-full mt-6 px-2">
        <Link href={`/products/${productId}`} className="flex items-center gap-2 text-neutral-1000 text-base font-araboto font-medium mb-6 hover:text-zhex-base-500 transition-all duration-300">
          <ArrowLeftIcon size={20} weight="bold" className="text-zhex-base-500" />
          Voltar
        </Link>

        <div className="flex items-start justify-between w-full">
          <div>
            <h1 className="text-lg text-neutral-950 font-araboto font-medium">
              Editar checkout
            </h1>
            <p className="text-neutral-500 text-base font-araboto mb-6">
              Edite as informações do checkout para deixá-lo pronto para venda.
            </p>
          </div>

          <Button
            size="medium"
            variant="primary"
            type="submit"
            className="w-[180px]"
            loading={currentLoading}
          >
            Salvar
          </Button>
        </div>
      </Container>

      <Container>
        <div className="w-full bg-white rounded-lg py-6 px-5 mb-10 border border-neutral-200">
          <ProductsMenu
            items={menuItems}
            active={activeTab}
            onChange={setActiveTab}
          />

          <div className="mt-6 flex items-start justify-between w-full">
            <div className="w-full max-w-[680px] max-h-[680px] h-full overflow-y-auto scrollbar-hide px-0.5">
              {renderTabContent()}
            </div>

            <CheckoutPreview
              product={product}
              layoutData={layoutData}
              offersData={offersData}
              linksData={linksData}
            />
          </div>
        </div>
      </Container>
    </form>
  )
}
