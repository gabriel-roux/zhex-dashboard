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
} from '@phosphor-icons/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ProductInformations } from './informations'
import { PaymentMethods } from './payment-methods'
import { PaymentLinks } from './payment-links'
import { ProductSalesInformations } from '@/components/product-sales-informations'
import { ProductSubscriptions } from './subscriptions'
import { ProductCoupons } from './coupons'
import { ProductAffiliates } from './affiliates'
import { ProductPixels } from './pixels'

const menuItems = [
  { label: 'Informações', icon: <FileTextIcon size={20} />, value: 'informacoes' },
  { label: 'Opções de pagamento', icon: <CreditCardIcon size={20} />, value: 'pagamento' },
  { label: 'Links de Pagamento', icon: <LinkSimpleIcon size={20} />, value: 'links' },
  { label: 'Checkout', icon: <ShoppingCartIcon size={20} />, value: 'checkout' },
  { label: 'Cupons', icon: <TicketIcon size={20} />, value: 'cupons' },
  { label: 'Assinaturas', icon: <RepeatIcon size={20} />, value: 'assinaturas' },
  { label: 'Pixel', icon: <BroadcastIcon size={20} />, value: 'pixel' },
  { label: 'Afiliados', icon: <UsersThreeIcon size={20} />, value: 'afiliados' },
]

export default function ProductPage() {
  const [activeTab, setActiveTab] = useState('informacoes')

  const renderProductTab = () => {
    switch (activeTab) {
      case 'informacoes':
        return <ProductInformations />
      case 'pagamento':
        return <PaymentMethods />
      case 'links':
        return <PaymentLinks />
      case 'assinaturas':
        return <ProductSubscriptions />
      case 'cupons':
        return <ProductCoupons />
      case 'afiliados':
        return <ProductAffiliates />
      case 'pixel':
        return <ProductPixels />
    }
  }

  const hasSalesInformations = activeTab === 'links' || activeTab === 'assinaturas' || activeTab === 'cupons' || activeTab === 'checkout' || activeTab === 'afiliados' || activeTab === 'pixel'
  const showSaveButton = activeTab === 'informacoes' || activeTab === 'pagamento' || activeTab === 'afiliados'

  return (
    <form>
      <Container className="flex items-start justify-between w-full mt-6 px-2">
        <div>
          <h1 className="text-lg text-neutral-950 font-araboto font-medium">
            Adicionar Produto
          </h1>

          <p className="text-neutral-500 text-base font-araboto mb-6">
            Preencha as informações do produto para adicioná-lo ao seu catálogo.
            Você poderá editar essas informações posteriormente.
          </p>
        </div>

        {showSaveButton && (
          <Button size="medium" variant="primary" type="submit" className="w-[180px]">
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

          {hasSalesInformations && <ProductSalesInformations />}

          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
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
