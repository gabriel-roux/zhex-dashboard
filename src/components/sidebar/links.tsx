'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CubeIcon,
  UsersThreeIcon,
  GlobeIcon,
  CurrencyDollarSimpleIcon,
  ArrowsLeftRightIcon,
  NotepadIcon,
  CirclesFourIcon,
  WebhooksLogoIcon,
} from '@phosphor-icons/react'

interface SidebarLinksProps {
  /** Desabilita todos os links (ex.: onboarding) */
  desactived?: boolean
}

const primaryLinks = [
  { href: '/', label: 'Dashboard', Icon: CirclesFourIcon },
  { href: '/products', label: 'Produtos', Icon: CubeIcon },
  { href: '/affiliates', label: 'Afiliados', Icon: UsersThreeIcon },
]

const financeLinks = [
  { href: '/finances', label: 'Financeiro', Icon: CurrencyDollarSimpleIcon },
  { href: '/transactions', label: 'Transações', Icon: ArrowsLeftRightIcon },
  { href: '/orders', label: 'Pedidos', Icon: NotepadIcon },
  { href: '/analytics', label: 'Analytcs', Icon: GlobeIcon },
]

const othersLinks = [
  { href: '/apps', label: 'Integrações', Icon: WebhooksLogoIcon },
]

export function SidebarLinks({ desactived = false }: SidebarLinksProps) {
  const pathname = usePathname()

  /** Retorna estilos do item, considerando active e desactived */
  const getItemClasses = (active: boolean) =>
    [
      'flex items-center gap-3 px-2 py-1.5 h-11 rounded-xl transition-colors -ml-2',
      desactived
        ? 'cursor-not-allowed pointer-events-none opacity-40'
        : active
          ? 'bg-zhex-base-400/10 text-zhex-base-500 my-1 font-medium'
          : 'text-neutral-500 hover:text-neutral-400 cursor-pointer',
    ].join(' ')

  const SectionTitle = ({ children }: { children: string }) => (
    <span className="text-base text-neutral-300 font-arabot font-medium">
      {children}
    </span>
  )

  const renderLinks = (items: typeof primaryLinks) =>
    items.map(({ href, label, Icon }) => {
      const isDashboard = href === '/'
      const active = isDashboard
        ? pathname === '/'
        : pathname.startsWith(href) && href !== '/'
      return (
        <Link
          key={href as string}
          href={desactived
            ? '#'
            : href}
          className={getItemClasses(active)}
        >
          <Icon size={22} weight="regular" className="" />
          <span className="text-base font-araboto mt-1">{label}</span>
        </Link>
      )
    })

  return (
    <nav className="flex flex-col">
      <SectionTitle>Menu</SectionTitle>
      {renderLinks(primaryLinks)}

      <hr className="my-4 border-neutral-50" />

      <SectionTitle>Finanças</SectionTitle>
      {renderLinks(financeLinks)}

      <hr className="my-4 border-neutral-50" />

      <SectionTitle>Outros</SectionTitle>
      {renderLinks(othersLinks)}
    </nav>
  )
}
